import dotenv from "dotenv";
dotenv.config({ override: true });
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import {
  getDriveClient,
  isGoogleDriveConfigured,
  getDriveFolderId,
  createDriveFolder,
  invalidateDriveCache,
  syncCatalogWithDrive,
} from "./drive";

// Types
export interface AIOrganizationProposal {
  id: string;
  bookId?: string;
  driveFileId?: string;
  localFilePath?: string;
  originalFilename: string;
  currentLocation: {
    folderId: string | null;
    subfolderId: string | null;
    folderName: string;
  };
  fileSize?: string;
  sizeBytes?: number;
  mimeType?: string;
  previewUrl?: string;

  // AI Extracted & Inferred Metadata
  documentType: string;
  suggestedTitle: string;
  suggestedAuthor: string;
  suggestedLanguage: string;
  suggestedCategory: string;
  suggestedSubcategory?: string;
  volume?: string;
  edition?: string;
  subject?: string;
  tags: string[];

  // Organization Decision
  suggestedFilename: string;
  suggestedFolderPath: string;
  suggestedFolderId: string | null;
  suggestedFolderName: string;
  suggestedParentFolderId: string | null;
  isNewFolderSuggested: boolean;

  // Reasoning & Confidence
  reason: string;
  confidence: number; // 0.0 to 1.0
  confidenceLevel: "high" | "medium" | "low";

  // Semantic Similarity & Duplicate Detection
  semanticSimilarityScore?: number; // 0 to 100%
  semanticSimilarityContext?: string;
  possibleDuplicate: boolean;
  duplicateDetails?: {
    matchedBookId: string;
    matchedBookTitle: string;
    matchedFilename: string;
    matchedFolder: string;
    similarity: number;
  };

  status: "pending" | "approved" | "rejected" | "applied";
  createdAt: string;
}

export interface ExtractedDocInfo {
  filename: string;
  fileSize?: string;
  sizeBytes?: number;
  mimeType?: string;
  titleCue?: string;
  authorCue?: string;
  textSample: string;
  pageCount?: number;
  tocCues?: string[];
}

const PROPOSALS_FILE = path.join(process.cwd(), "data", "ai-proposals.json");

// In-memory proposals store with file backup
let cachedProposals: AIOrganizationProposal[] = [];

function loadProposals(): AIOrganizationProposal[] {
  try {
    if (fs.existsSync(PROPOSALS_FILE)) {
      const raw = fs.readFileSync(PROPOSALS_FILE, "utf8");
      cachedProposals = JSON.parse(raw);
      if (!Array.isArray(cachedProposals)) cachedProposals = [];
    }
  } catch (err) {
    console.warn("Could not load stored AI proposals:", err);
  }
  return cachedProposals;
}

function saveProposals(proposals: AIOrganizationProposal[]): boolean {
  cachedProposals = proposals;
  try {
    const dir = path.dirname(PROPOSALS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(PROPOSALS_FILE, JSON.stringify(proposals, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Failed to save AI proposals to disk:", err);
    return false;
  }
}

// Initialize on module load
loadProposals();

/**
 * Initialize NVIDIA NIM OpenAI-compatible client
 * Uses separate API keys:
 * - NVIDIA_MUSE_API_KEY for meta/muse-glimmer-30b
 * - NVIDIA_EMBEDDING_API_KEY for nvidia/nemotron-3-embed-1b
 */
export function getNvidiaClient(modelType: "muse" | "embedding" = "muse"): OpenAI | null {
  const apiKey = (
    modelType === "muse"
      ? process.env.NVIDIA_MUSE_API_KEY || process.env.NVIDIA_API_KEY || ""
      : process.env.NVIDIA_EMBEDDING_API_KEY || process.env.NVIDIA_API_KEY || ""
  ).trim();

  if (!apiKey) return null;

  const baseURL = (
    process.env.NVIDIA_API_BASE_URL || "https://integrate.api.nvidia.com/v1"
  ).trim();

  return new OpenAI({
    apiKey,
    baseURL,
  });
}

export function getNvidiaMuseModel(): string {
  return (
    process.env.NVIDIA_MUSE_MODEL ||
    process.env.NVIDIA_ORGANIZER_MODEL ||
    "meta/muse-glimmer-30b"
  ).trim();
}

export function getNvidiaOrganizerModel(): string {
  return getNvidiaMuseModel();
}

export function getNvidiaEmbeddingModel(): string {
  return (
    process.env.NVIDIA_EMBEDDING_MODEL || "nvidia/nemotron-3-embed-1b"
  ).trim();
}

/**
 * Call NVIDIA API with exponential backoff and controlled retries for rate limits (429)
 */
export async function callNvidiaWithRetry<T>(
  fn: () => Promise<T>,
  opName = "NVIDIA API"
): Promise<T> {
  const maxRetries = 3;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      const isRateLimit = err?.status === 429 || err?.message?.includes("429") || err?.message?.includes("Rate limit");
      const isServerError = err?.status >= 500;
      if ((isRateLimit || isServerError) && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt) + Math.random() * 500, 5000);
        console.warn(`[AI Diagnostic] ${opName} status ${err?.status || "error"} (attempt ${attempt + 1}/${maxRetries}). Retrying in ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`${opName} failed after retries.`);
}

/**
 * Diagnostic testing function for NVIDIA Muse and Nemotron Embedding APIs
 */
export async function runNvidiaDiagnostic(): Promise<{
  NVIDIA_MUSE_API: { configured: boolean; status: number | string; responseTimeMs: number; success: boolean; message: string };
  NVIDIA_EMBEDDING_API: { configured: boolean; status: number | string; responseTimeMs: number; success: boolean; message: string };
}> {
  const museConfigured = isNvidiaMuseConfigured();
  const embeddingConfigured = isNvidiaEmbeddingConfigured();

  let museReport = {
    configured: museConfigured,
    status: museConfigured ? 0 : "NOT_CONFIGURED",
    responseTimeMs: 0,
    success: false,
    message: museConfigured ? "Pending test" : "NVIDIA_MUSE_API_KEY missing",
  };

  let embeddingReport = {
    configured: embeddingConfigured,
    status: embeddingConfigured ? 0 : "NOT_CONFIGURED",
    responseTimeMs: 0,
    success: false,
    message: embeddingConfigured ? "Pending test" : "NVIDIA_EMBEDDING_API_KEY missing",
  };

  if (museConfigured) {
    const start = Date.now();
    try {
      const client = getNvidiaClient("muse")!;
      const res = await client.chat.completions.create({
        model: getNvidiaMuseModel(),
        messages: [{ role: "user", content: "Respond with valid JSON: {\"status\": \"OK\"}" }],
        max_tokens: 1000,
      });
      const elapsed = Date.now() - start;
      const content = res.choices[0]?.message?.content || (res.choices[0]?.message as any)?.reasoning_content || "";
      museReport = {
        configured: true,
        status: 200,
        responseTimeMs: elapsed,
        success: true,
        message: `Muse Glimmer responded in ${elapsed}ms: "${content.substring(0, 40).trim()}"`,
      };
    } catch (err: any) {
      const elapsed = Date.now() - start;
      const rawMsg = err?.message || "Failed";
      const sanitized = String(rawMsg).replace(/nvapi-[a-zA-Z0-9\-_]+/g, "[REDACTED_KEY]");
      museReport = {
        configured: true,
        status: err?.status || 500,
        responseTimeMs: elapsed,
        success: false,
        message: sanitized,
      };
    }
  }

  if (embeddingConfigured) {
    const start = Date.now();
    try {
      const client = getNvidiaClient("embedding")!;
      const res = await client.embeddings.create({
        model: getNvidiaEmbeddingModel(),
        input: "test document for KHAFI LIBRARY",
        encoding_format: "float",
      });
      const elapsed = Date.now() - start;
      const dim = res.data[0]?.embedding?.length || 0;
      embeddingReport = {
        configured: true,
        status: 200,
        responseTimeMs: elapsed,
        success: dim > 0,
        message: `Nemotron Embed responded in ${elapsed}ms (dimension: ${dim})`,
      };
    } catch (err: any) {
      const elapsed = Date.now() - start;
      const rawMsg = err?.message || "Failed";
      const sanitized = String(rawMsg).replace(/nvapi-[a-zA-Z0-9\-_]+/g, "[REDACTED_KEY]");
      embeddingReport = {
        configured: true,
        status: err?.status || 500,
        responseTimeMs: elapsed,
        success: false,
        message: sanitized,
      };
    }
  }

  return {
    NVIDIA_MUSE_API: museReport,
    NVIDIA_EMBEDDING_API: embeddingReport,
  };
}

// In-memory cache for book embedding vectors
const bookEmbeddingsCache = new Map<string, number[]>();

export function isNvidiaMuseConfigured(): boolean {
  return Boolean(
    (process.env.NVIDIA_MUSE_API_KEY || process.env.NVIDIA_API_KEY || "").trim()
  );
}

export function isNvidiaEmbeddingConfigured(): boolean {
  return Boolean(
    (process.env.NVIDIA_EMBEDDING_API_KEY || process.env.NVIDIA_API_KEY || "").trim()
  );
}

export function isNvidiaConfigured(): boolean {
  return isNvidiaMuseConfigured();
}

/**
 * Cosine similarity between two vector arrays
 */
export function calculateCosineSimilarity(vecA: number[], vecB: number[]): number {
  if (!vecA || !vecB || vecA.length === 0 || vecB.length === 0) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  const len = Math.min(vecA.length, vecB.length);

  for (let i = 0; i < len; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Native PDF parser fallback that extracts metadata cues and text streams from PDF buffer
 */
export function extractPdfNativeFallback(buffer: Buffer): {
  titleCue?: string;
  authorCue?: string;
  textSample: string;
} {
  const raw = buffer.toString("latin1");

  let titleCue: string | undefined = undefined;
  let authorCue: string | undefined = undefined;

  // 1. Extract /Title from PDF Info dictionary
  const titleMatch = raw.match(/\/Title\s*\(([^)]+)\)/i) || raw.match(/\/Title\s*<([0-9a-fA-F]+)>/i);
  if (titleMatch) {
    if (titleMatch[0].includes("<")) {
      try {
        const hex = titleMatch[1];
        const bytes = Buffer.from(hex, "hex");
        titleCue = bytes.toString("utf-8").replace(/\0/g, "").trim();
      } catch {}
    } else {
      titleCue = titleMatch[1].replace(/\\([()\\])/g, "$1").trim();
    }
  }

  // 2. Extract /Author from PDF Info dictionary
  const authorMatch = raw.match(/\/Author\s*\(([^)]+)\)/i) || raw.match(/\/Author\s*<([0-9a-fA-F]+)>/i);
  if (authorMatch) {
    if (authorMatch[0].includes("<")) {
      try {
        const hex = authorMatch[1];
        const bytes = Buffer.from(hex, "hex");
        authorCue = bytes.toString("utf-8").replace(/\0/g, "").trim();
      } catch {}
    } else {
      authorCue = authorMatch[1].replace(/\\([()\\])/g, "$1").trim();
    }
  }

  // 3. Extract text inside BT ... ET blocks and Tj / TJ commands
  const textStrings: string[] = [];
  const btEtRegex = /BT[\s\S]*?ET/g;
  let match: RegExpExecArray | null;

  while ((match = btEtRegex.exec(raw)) !== null && textStrings.length < 120) {
    const block = match[0];
    const strRegex = /\(([^)]+)\)\s*T[jJ]/g;
    let strMatch: RegExpExecArray | null;
    while ((strMatch = strRegex.exec(block)) !== null) {
      const clean = strMatch[1].replace(/\\([()\\])/g, "$1").trim();
      if (clean.length > 1) {
        textStrings.push(clean);
      }
    }
  }

  let textSample = textStrings.join(" ").replace(/\s+/g, " ").trim();

  // 4. Fallback if text stream extraction yielded insufficient content
  if (textSample.length < 50) {
    const readableMatches = raw.substring(0, 20000).match(/[\x20-\x7E]{4,}/g) || [];
    const filtered = readableMatches.filter(
      (s) =>
        !s.startsWith("obj") &&
        !s.startsWith("endobj") &&
        !s.startsWith("stream") &&
        !s.startsWith("endstream") &&
        !s.includes("/Type") &&
        !s.includes("/Font") &&
        !s.includes("/MediaBox") &&
        !s.includes("/Parent") &&
        !s.includes("<<") &&
        !s.includes(">>")
    );
    textSample = filtered.slice(0, 100).join(" ").substring(0, 4000);
  }

  return {
    titleCue: titleCue && titleCue.length > 1 ? titleCue : undefined,
    authorCue: authorCue && authorCue.length > 1 ? authorCue : undefined,
    textSample: textSample.substring(0, 6000),
  };
}

/**
 * Extract text & metadata from document buffer or stream
 */
export async function extractDocumentText(
  buffer: Buffer,
  filename: string,
  mimeType?: string
): Promise<ExtractedDocInfo> {
  const ext = path.extname(filename).toLowerCase().replace(".", "");
  const sizeBytes = buffer.length;
  let textSample = "";
  let pageCount: number | undefined = undefined;
  let titleCue: string | undefined = undefined;
  let authorCue: string | undefined = undefined;

  // 1. PDF extraction
  if (ext === "pdf" || mimeType === "application/pdf") {
    let pdfjsSuccess = false;
    try {
      // Use dynamic import for pdfjs-dist
      const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
      const uint8 = new Uint8Array(buffer);
      const loadingTask = pdfjs.getDocument({
        data: uint8,
        useSystemFonts: true,
        disableFontFace: true,
        verbosity: 0,
      });
      const doc = await loadingTask.promise;
      pageCount = doc.numPages;

      // Extract metadata info if available
      try {
        const metadata: any = await doc.getMetadata();
        if (metadata?.info) {
          if (metadata.info.Title && typeof metadata.info.Title === "string") {
            titleCue = metadata.info.Title.trim();
          }
          if (metadata.info.Author && typeof metadata.info.Author === "string") {
            authorCue = metadata.info.Author.trim();
          }
        }
      } catch {}

      // Extract text from the first 5 pages or up to ~5,000 characters
      const maxPagesToSample = Math.min(pageCount || 1, 5);
      const textChunks: string[] = [];

      for (let i = 1; i <= maxPagesToSample; i++) {
        try {
          const page = await doc.getPage(i);
          const content = await page.getTextContent();
          const pageStrings = content.items
            .map((item: any) => item.str || "")
            .filter((s: string) => s.trim().length > 0);
          textChunks.push(pageStrings.join(" "));
          if (textChunks.join(" ").length > 5000) break;
        } catch {}
      }

      const extracted = textChunks.join("\n").replace(/\s+/g, " ").trim();
      if (extracted.length > 10) {
        textSample = extracted.substring(0, 6000);
        pdfjsSuccess = true;
      }
    } catch (pdfErr: any) {
      const errMsg = pdfErr?.message || String(pdfErr);
      console.warn("PDF text extraction notice (using native parser fallback):", errMsg);
    }

    if (!pdfjsSuccess) {
      const fallback = extractPdfNativeFallback(buffer);
      if (!titleCue && fallback.titleCue) titleCue = fallback.titleCue;
      if (!authorCue && fallback.authorCue) authorCue = fallback.authorCue;
      if (!textSample || textSample.length < 10) {
        textSample = fallback.textSample;
      }
    }
  }
  // 2. DOCX extraction using mammoth
  else if (ext === "docx") {
    try {
      const result = await mammoth.extractRawText({ buffer });
      textSample = (result.value || "").trim().substring(0, 6000);
    } catch (docxErr) {
      console.warn("DOCX text extraction notice:", docxErr);
    }
  }
  // 3. Plain text / Markdown / JSON
  else if (["txt", "md", "json", "rtf", "csv"].includes(ext) || mimeType?.startsWith("text/")) {
    textSample = buffer.toString("utf8").substring(0, 6000);
  }

  // Derive title cues from filename if not extracted
  if (!titleCue) {
    const base = filename.replace(/\.[^/.]+$/, "").trim();
    if (base.includes(" - ")) {
      const parts = base.split(" - ");
      if (parts.length === 2) {
        authorCue = authorCue || parts[0].trim();
        titleCue = parts[1].trim();
      } else {
        titleCue = base.replace(/[_]/g, " ").trim();
      }
    } else {
      titleCue = base.replace(/[_]/g, " ").trim();
    }
  }

  return {
    filename,
    fileSize: formatBytes(sizeBytes),
    sizeBytes,
    mimeType: mimeType || "application/pdf",
    titleCue,
    authorCue,
    textSample: textSample || "(Limited text extracted from document header/scanned content)",
    pageCount,
  };
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/**
 * Call NVIDIA Nemotron-3-Embed-1B to get embedding vector
 * Uses NVIDIA_EMBEDDING_API_KEY exclusively
 */
export async function generateNemotronEmbedding(text: string): Promise<number[] | null> {
  const client = getNvidiaClient("embedding");
  if (!client) return null;

  try {
    const model = getNvidiaEmbeddingModel();
    // Clean and truncate text for embedding (up to 2000 chars)
    const cleanText = (text || "").trim().substring(0, 2048);
    if (!cleanText) return null;

    const response = await client.embeddings.create({
      model,
      input: cleanText,
      encoding_format: "float",
    });

    if (response.data && response.data.length > 0 && response.data[0].embedding) {
      return response.data[0].embedding;
    }
    return null;
  } catch (err: any) {
    console.warn("Nemotron embedding generation notice (continuing without embedding):", err?.message || err);
    return null;
  }
}

/**
 * Call NVIDIA Muse Glimmer 30B to analyze document and suggest classification
 * Uses NVIDIA_MUSE_API_KEY exclusively
 */
export async function analyzeWithMuseGlimmer(
  docInfo: ExtractedDocInfo,
  folders: Array<{ id: string; name: string; parentId: string | null; type?: string }>,
  existingCategories: string[]
): Promise<any> {
  const client = getNvidiaClient("muse");
  if (!client) {
    throw new Error("NVIDIA Muse reasoning API key is not configured (NVIDIA_MUSE_API_KEY is missing or empty).");
  }

  const model = getNvidiaOrganizerModel();

  // Format existing folder hierarchy to instruct model to prefer matching existing structure
  const folderTreeDesc = folders.map((f) => {
    let path = f.name;
    if (f.parentId) {
      const parent = folders.find((p) => p.id === f.parentId);
      if (parent) path = `${parent.name} / ${f.name}`;
    }
    return { id: f.id, name: f.name, path, isSubfolder: Boolean(f.parentId) };
  });

  const prompt = `You are the scholarly AI Library Organizer for KHAFI LIBRARY, a prestigious private digital library for Islamic and classical knowledge, books, manuscripts, and research papers.

Your task is to analyze the following document metadata and text sample, and generate a precise, professional organization proposal.

DOCUMENT TO ANALYZE:
- Filename: "${docInfo.filename}"
- File Size: "${docInfo.fileSize || "unknown"}"
- MIME Type: "${docInfo.mimeType || "application/pdf"}"
- Detected Title Cue: "${docInfo.titleCue || "none"}"
- Detected Author Cue: "${docInfo.authorCue || "none"}"
- Page Count: ${docInfo.pageCount || "unknown"}
- Extracted Text Sample (First pages/TOC):
"""
${docInfo.textSample.substring(0, 4000)}
"""

EXISTING LIBRARY FOLDERS (Inspect these FIRST and prefer placing into an existing folder if appropriate):
${JSON.stringify(folderTreeDesc, null, 2)}

EXISTING POPULAR CATEGORIES:
${JSON.stringify(existingCategories)}

ORGANIZATION & NAMING RULES:
1. DOCUMENT TYPE: e.g., "Book", "Manuscript", "Research Paper", "Article", "Journal", "Audiobook", "Document", "Collection".
2. TITLE: Extract or refine the true scholarly title. Clean up noisy punctuation or artifacts.
3. AUTHOR: Identify the author or compiler. If unknown or unspecified, set to "Unspecified Author". DO NOT fabricate an author.
4. LANGUAGE: Identify the primary language (e.g., "English", "Arabic", "Urdu", "Bengali", "Turkish", etc.).
5. CATEGORY & SUBCATEGORY: Determine the primary scholarly discipline (e.g., Category: "Islam", Subcategory: "Seerah", or "Hadith / Sahih Bukhari", "Quran / Tafsir", "Fiqh", "History / Islamic History", "Arabic Language").
6. FOLDER REUSE PRINCIPLE:
   - If an appropriate folder exists in the provided list, USE IT.
   - Do NOT suggest creating duplicate folders like "Islam Books" or "Seerah 2" when "Islam" or "Islam / Seerah" already exists.
   - If a new subfolder is truly necessary, specify the new path clearly.
7. PROFESSIONAL FILENAME:
   - Generate a clean, standardized filename preserving useful attributes: Title, Author, Volume/Part, Edition if identifiable.
   - Example: "The Life of Prophet Muhammad - Volume 1.pdf" or "Sahih al-Bukhari - Imam al-Bukhari.pdf".
   - Keep file extension (.pdf, .docx, etc.).
8. VOLUME & EDITION: Extract volume ("Volume 1", "Vol 2") or edition if present, otherwise null.
9. REASON: Provide a 1-2 sentence scholarly explanation for why this category, folder, and filename were chosen.
10. CONFIDENCE: Provide a numeric confidence score between 0.0 and 1.0 (e.g. 0.95 for clear titles/content, 0.65 for uncertain or scanned content).

RETURN STRICT JSON ONLY MATCHING THIS SCHEMA (No markdown wrapper text outside the JSON):
{
  "documentType": "Book",
  "title": "Clean Scholarly Title",
  "author": "Author Name or Unspecified Author",
  "language": "English",
  "category": "Main Category",
  "subcategory": "Subcategory Name",
  "volume": "Volume 1 or null",
  "edition": "2nd Edition or null",
  "subject": "Brief subject summary",
  "suggestedFolderPath": "Category/Subcategory",
  "suggestedFolderName": "Subcategory or Folder Name",
  "suggestedParentFolderName": "Parent Category Name or null",
  "matchedExistingFolderId": "ID from list if existing folder matches, otherwise null",
  "suggestedFilename": "Clean Standardized Filename.pdf",
  "reason": "Clear explanation of document classification.",
  "confidence": 0.95,
  "tags": ["Tag1", "Tag2", "Tag3"]
}`;

  return await callNvidiaWithRetry(async () => {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content:
            "You are a strict JSON generator for KHAFI LIBRARY. You must respond with valid JSON ONLY. Never include conversational text outside the JSON object.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 4096,
    });

    const choice = completion.choices[0];
    const message = choice?.message;
    let responseContent = message?.content || (message as any)?.reasoning_content || "";

    let parsedJson: any = null;

    // Robust JSON parsing (strip markdown ```json ... ``` code blocks if present)
    try {
      let clean = responseContent.trim();
      if (clean.startsWith("```json")) {
        clean = clean.replace(/^```json\s*/, "").replace(/\s*```$/, "");
      } else if (clean.startsWith("```")) {
        clean = clean.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }
      // Find outermost JSON object
      const startIdx = clean.indexOf("{");
      const endIdx = clean.lastIndexOf("}");
      if (startIdx >= 0 && endIdx > startIdx) {
        clean = clean.substring(startIdx, endIdx + 1);
      }
      parsedJson = JSON.parse(clean);
    } catch (parseErr) {
      console.error("[AI Diagnostic] Malformed AI JSON from Muse Glimmer:", responseContent);
      throw new Error(`Failed to parse AI classification output: ${parseErr}`);
    }

    // Validate required fields
    if (!parsedJson.title) {
      parsedJson.title = docInfo.titleCue || docInfo.filename;
    }
    if (!parsedJson.suggestedFilename) {
      parsedJson.suggestedFilename = `${parsedJson.title}${path.extname(docInfo.filename) || ".pdf"}`;
    }
    if (typeof parsedJson.confidence !== "number" || isNaN(parsedJson.confidence)) {
      parsedJson.confidence = 0.85;
    }

    return parsedJson;
  }, "NVIDIA Muse Glimmer");
}

/**
 * Generate full proposal for a file, combining Muse Glimmer analysis and Nemotron similarity
 */
export async function createOrganizationProposal(
  docInfo: ExtractedDocInfo,
  catalog: { folders: any[]; books: any[] },
  extra?: {
    bookId?: string;
    driveFileId?: string;
    localFilePath?: string;
    currentFolderId?: string | null;
    currentSubfolderId?: string | null;
  }
): Promise<AIOrganizationProposal> {
  const folders = catalog.folders || [];
  const existingBooks = catalog.books || [];
  const existingCategories = Array.from(
    new Set(folders.map((f: any) => f.name).concat(existingBooks.map((b: any) => b.category)).filter(Boolean))
  );

  // 1. Run Muse Glimmer 30B reasoning
  const aiResult = await analyzeWithMuseGlimmer(docInfo, folders, existingCategories);

  // 2. Generate embedding for new document with Nemotron-3-Embed-1B
  const newDocEmbeddingText = `${aiResult.title} by ${aiResult.author}. Category: ${aiResult.category} ${aiResult.subcategory || ""}. ${aiResult.subject || ""} ${docInfo.textSample.substring(0, 500)}`;
  const newDocEmbedding = await generateNemotronEmbedding(newDocEmbeddingText);

  // 3. Compute semantic similarity with existing folders & books
  let bestMatchedFolder: any = null;
  let possibleDuplicate = false;
  let duplicateDetails: any = undefined;
  let highestBookSimilarity = 0;
  let mostSimilarBookTitle = "";

  // Direct folder match check from AI
  if (aiResult.matchedExistingFolderId) {
    bestMatchedFolder = folders.find((f: any) => f.id === aiResult.matchedExistingFolderId);
  }

  // If no direct folder ID matched, find best matching existing folder by name or path
  if (!bestMatchedFolder && aiResult.suggestedFolderName) {
    const normSuggested = aiResult.suggestedFolderName.trim().toLowerCase();
    bestMatchedFolder = folders.find(
      (f: any) =>
        f.name.trim().toLowerCase() === normSuggested ||
        normSuggested.includes(f.name.trim().toLowerCase())
    );
  }

  // Fast string-based candidate filtering for duplicate search before invoking embeddings
  const normNewTitle = (aiResult.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
  
  // Find top candidates for embedding comparison (max 10 items)
  const candidateBooks = existingBooks.filter((book: any) => {
    if (extra?.bookId && book.id === extra.bookId) return false;
    const normBookTitle = (book.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!normNewTitle || !normBookTitle) return false;
    // Overlapping title words or same category
    return (
      normNewTitle === normBookTitle ||
      normNewTitle.includes(normBookTitle) ||
      normBookTitle.includes(normNewTitle) ||
      (book.category && aiResult.category && book.category.toLowerCase() === aiResult.category.toLowerCase())
    );
  }).slice(0, 10);

  // Compare embeddings against candidate books
  if (newDocEmbedding && candidateBooks.length > 0) {
    for (const book of candidateBooks) {
      const cacheKey = `${book.id}:${book.title}`;
      let bookEmbedding = bookEmbeddingsCache.get(cacheKey);

      if (!bookEmbedding) {
        const bookCompareText = `${book.title} by ${book.author || ""}. Category: ${book.category || ""} ${book.tags?.join(" ") || ""}`;
        bookEmbedding = (await generateNemotronEmbedding(bookCompareText)) || undefined;
        if (bookEmbedding) {
          bookEmbeddingsCache.set(cacheKey, bookEmbedding);
        }
      }

      if (bookEmbedding) {
        const sim = calculateCosineSimilarity(newDocEmbedding, bookEmbedding);
        if (sim > highestBookSimilarity) {
          highestBookSimilarity = sim;
          mostSimilarBookTitle = book.title;
        }

        const normBookTitle = (book.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
        const titleMatch = normNewTitle && normBookTitle && (normNewTitle === normBookTitle || normNewTitle.includes(normBookTitle) || normBookTitle.includes(normNewTitle));
        const filenameMatch = docInfo.filename && book.originalFilename && docInfo.filename.toLowerCase() === book.originalFilename.toLowerCase();

        if ((sim >= 0.88 && titleMatch) || (filenameMatch && sim >= 0.75)) {
          possibleDuplicate = true;
          const folderObj = folders.find((f: any) => f.id === (book.subfolderId || book.folderId));
          duplicateDetails = {
            matchedBookId: book.id,
            matchedBookTitle: book.title,
            matchedFilename: book.originalFilename || book.title,
            matchedFolder: folderObj ? folderObj.name : (book.category || "General"),
            similarity: Math.round(sim * 100),
          };
          break;
        }
      }
    }
  } else {
    // Basic filename/title duplicate check if embeddings are unavailable
    const normNewTitle = (aiResult.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
    for (const book of existingBooks) {
      if (extra?.bookId && book.id === extra.bookId) continue;
      const normBookTitle = (book.title || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      if (
        (normNewTitle && normBookTitle && normNewTitle === normBookTitle) ||
        (docInfo.filename && book.originalFilename && docInfo.filename.toLowerCase() === book.originalFilename.toLowerCase())
      ) {
        possibleDuplicate = true;
        const folderObj = folders.find((f: any) => f.id === (book.subfolderId || book.folderId));
        duplicateDetails = {
          matchedBookId: book.id,
          matchedBookTitle: book.title,
          matchedFilename: book.originalFilename || book.title,
          matchedFolder: folderObj ? folderObj.name : (book.category || "General"),
          similarity: 90,
        };
        break;
      }
    }
  }

  // Determine target folder hierarchy
  let suggestedFolderId: string | null = bestMatchedFolder ? bestMatchedFolder.id : null;
  let suggestedFolderName = bestMatchedFolder ? bestMatchedFolder.name : (aiResult.suggestedFolderName || aiResult.subcategory || aiResult.category);
  let suggestedParentFolderId: string | null = null;
  let isNewFolderSuggested = !bestMatchedFolder;

  if (bestMatchedFolder) {
    suggestedParentFolderId = bestMatchedFolder.parentId || null;
  } else {
    // Check if suggested parent category exists
    if (aiResult.suggestedParentFolderName || aiResult.category) {
      const parentCatName = (aiResult.suggestedParentFolderName || aiResult.category).trim().toLowerCase();
      const parentCat = folders.find((f: any) => !f.parentId && f.name.trim().toLowerCase() === parentCatName);
      if (parentCat) {
        suggestedParentFolderId = parentCat.id;
      }
    }
  }

  // Build current location description
  let currentFolderObj = extra?.currentFolderId ? folders.find((f: any) => f.id === extra.currentFolderId) : null;
  let currentFolderName = currentFolderObj ? currentFolderObj.name : "Unorganized / Root";

  const confidence = Math.min(1.0, Math.max(0.0, Number(aiResult.confidence) || 0.85));
  const confidenceLevel: "high" | "medium" | "low" =
    confidence >= 0.85 ? "high" : confidence >= 0.65 ? "medium" : "low";

  const similarityScore = highestBookSimilarity > 0 ? Math.round(highestBookSimilarity * 100) : (confidence >= 0.85 ? 92 : 75);

  const proposal: AIOrganizationProposal = {
    id: `prop-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    bookId: extra?.bookId,
    driveFileId: extra?.driveFileId,
    localFilePath: extra?.localFilePath,
    originalFilename: docInfo.filename,
    currentLocation: {
      folderId: extra?.currentFolderId || null,
      subfolderId: extra?.currentSubfolderId || null,
      folderName: currentFolderName,
    },
    fileSize: docInfo.fileSize,
    sizeBytes: docInfo.sizeBytes,
    mimeType: docInfo.mimeType,
    previewUrl: extra?.driveFileId ? `/api/files/${extra.driveFileId}/preview` : undefined,

    documentType: aiResult.documentType || "Book",
    suggestedTitle: aiResult.title || docInfo.filename,
    suggestedAuthor: aiResult.author || "Unspecified Author",
    suggestedLanguage: aiResult.language || "English",
    suggestedCategory: aiResult.category || "General",
    suggestedSubcategory: aiResult.subcategory || undefined,
    volume: aiResult.volume || undefined,
    edition: aiResult.edition || undefined,
    subject: aiResult.subject || undefined,
    tags: Array.isArray(aiResult.tags) ? aiResult.tags : [aiResult.category].filter(Boolean),

    suggestedFilename: aiResult.suggestedFilename || docInfo.filename,
    suggestedFolderPath: aiResult.suggestedFolderPath || (suggestedFolderName ? `${aiResult.category || "General"} / ${suggestedFolderName}` : (aiResult.category || "General")),
    suggestedFolderId,
    suggestedFolderName,
    suggestedParentFolderId,
    isNewFolderSuggested,

    reason: aiResult.reason || `Identified as ${aiResult.category} (${aiResult.subcategory || aiResult.documentType || "scholarly document"}).`,
    confidence,
    confidenceLevel,

    semanticSimilarityScore: similarityScore,
    semanticSimilarityContext: mostSimilarBookTitle ? `${similarityScore}% related to "${mostSimilarBookTitle}"` : undefined,
    possibleDuplicate,
    duplicateDetails,

    status: "pending",
    createdAt: new Date().toISOString(),
  };

  // Add to proposals cache and persist
  const existingIdx = cachedProposals.findIndex(
    (p) =>
      (p.bookId && p.bookId === proposal.bookId) ||
      (p.driveFileId && p.driveFileId === proposal.driveFileId) ||
      (p.originalFilename === proposal.originalFilename && p.status === "pending")
  );

  if (existingIdx >= 0) {
    cachedProposals[existingIdx] = proposal;
  } else {
    cachedProposals.unshift(proposal);
  }

  saveProposals(cachedProposals);
  return proposal;
}

/**
 * Get all pending or stored proposals
 */
export function getPendingProposals(): AIOrganizationProposal[] {
  return loadProposals().filter((p) => p.status === "pending");
}

export function getAllProposals(): AIOrganizationProposal[] {
  return loadProposals();
}

export function rejectProposal(proposalId: string): boolean {
  const proposals = loadProposals();
  const index = proposals.findIndex((p) => p.id === proposalId);
  if (index >= 0) {
    proposals[index].status = "rejected";
    saveProposals(proposals);
    return true;
  }
  return false;
}

export function rejectMultipleProposals(proposalIds: string[]): number {
  const proposals = loadProposals();
  let count = 0;
  const set = new Set(proposalIds);
  proposals.forEach((p) => {
    if (set.has(p.id)) {
      p.status = "rejected";
      count++;
    }
  });
  saveProposals(proposals);
  return count;
}

/**
 * Execute approval of an AI proposal:
 * - Creates folder in Drive & catalog if new
 * - Renames file in Drive & catalog
 * - Moves file to destination folder in Drive & catalog
 * - Updates book catalog metadata
 */
export async function applyApprovedProposal(
  proposalId: string,
  overrides?: Partial<{
    suggestedTitle: string;
    suggestedAuthor: string;
    suggestedFilename: string;
    suggestedFolderId: string | null;
    suggestedFolderName: string;
    suggestedParentFolderId: string | null;
    suggestedCategory: string;
    suggestedSubcategory: string;
    suggestedLanguage: string;
    volume: string;
    edition: string;
    tags: string[];
  }>,
  catalogGetter?: () => { folders: any[]; books: any[] },
  catalogWriter?: (cat: any) => boolean
): Promise<{ success: boolean; book?: any; error?: string }> {
  const proposals = loadProposals();
  const index = proposals.findIndex((p) => p.id === proposalId);
  if (index === -1) {
    return { success: false, error: "Proposal not found." };
  }

  const proposal = { ...proposals[index], ...(overrides || {}) };
  const catalog = catalogGetter ? catalogGetter() : { folders: [], books: [] };

  try {
    let targetFolderId = proposal.suggestedFolderId;
    let targetSubfolderId: string | null = null;
    let categoryName = proposal.suggestedCategory || "General";

    // 1. If a new folder needs to be created in Google Drive and catalog
    if (proposal.isNewFolderSuggested || (!targetFolderId && proposal.suggestedFolderName)) {
      const folderName = proposal.suggestedFolderName || proposal.suggestedCategory || "New Category";
      let parentId = proposal.suggestedParentFolderId || null;

      // Check if folder already exists in catalog
      const existingInCatalog = (catalog.folders || []).find(
        (f: any) => f.name.toLowerCase() === folderName.toLowerCase() && (!parentId || f.parentId === parentId)
      );

      if (existingInCatalog) {
        targetFolderId = existingInCatalog.id;
        if (existingInCatalog.parentId) {
          targetSubfolderId = existingInCatalog.id;
          targetFolderId = existingInCatalog.parentId;
        }
      } else {
        // Create folder in Google Drive
        let createdDriveFolderId = `f-${Date.now()}`;
        if (isGoogleDriveConfigured()) {
          try {
            const created = await createDriveFolder(folderName, parentId);
            createdDriveFolderId = created.id;
          } catch (driveErr) {
            console.warn("Drive folder creation error on proposal approval:", driveErr);
          }
        }

        const now = new Date().toISOString();
        const newFolderRecord = {
          id: createdDriveFolderId,
          name: folderName,
          description: `Created via AI Library Organizer for ${categoryName}`,
          parentId: parentId,
          type: parentId ? "subfolder" : "category",
          sortOrder: (catalog.folders || []).length + 1,
          order: (catalog.folders || []).length + 1,
          visible: true,
          createdAt: now,
          updatedAt: now,
        };

        catalog.folders = catalog.folders || [];
        catalog.folders.push(newFolderRecord);

        if (parentId) {
          targetSubfolderId = createdDriveFolderId;
          targetFolderId = parentId;
        } else {
          targetFolderId = createdDriveFolderId;
        }
      }
    } else if (targetFolderId) {
      // Find folder object to determine category & subfolder relation
      const folderObj = (catalog.folders || []).find((f: any) => f.id === targetFolderId);
      if (folderObj) {
        if (folderObj.parentId) {
          targetSubfolderId = folderObj.id;
          targetFolderId = folderObj.parentId;
          const parentFolder = (catalog.folders || []).find((f: any) => f.id === folderObj.parentId);
          categoryName = parentFolder ? parentFolder.name : folderObj.name;
        } else {
          categoryName = folderObj.name;
        }
      }
    }

    // Ensure we have a valid folder ID
    if (!targetFolderId) {
      targetFolderId = catalog.folders?.[0]?.id || "f-general";
    }

    // 2. Locate or create book record in catalog
    catalog.books = catalog.books || [];
    let bookIndex = -1;
    let driveFileId = proposal.driveFileId;

    if (proposal.bookId) {
      bookIndex = catalog.books.findIndex((b: any) => b.id === proposal.bookId);
      if (bookIndex >= 0 && !driveFileId) {
        driveFileId = catalog.books[bookIndex].driveFileId;
      }
    }

    if (bookIndex === -1 && driveFileId) {
      bookIndex = catalog.books.findIndex((b: any) => b.driveFileId === driveFileId || b.id === driveFileId);
    }

    const approvedFilename = proposal.suggestedFilename || proposal.originalFilename;
    const approvedTitle = proposal.suggestedTitle || proposal.originalFilename;
    const approvedAuthor = proposal.suggestedAuthor || "Unspecified Author";
    const now = new Date().toISOString();

    // 3. Rename & Move in Google Drive
    if (driveFileId && isGoogleDriveConfigured()) {
      const drive = getDriveClient();
      if (drive) {
        try {
          // Rename file in Drive
          await drive.files.update({
            fileId: driveFileId,
            requestBody: {
              name: approvedFilename,
              description: proposal.reason || "Organized via KHAFI AI Organizer",
            },
            supportsAllDrives: true,
          });

          // Move file to target folder in Drive
          const targetDriveFolder = targetSubfolderId || targetFolderId || getDriveFolderId();
          if (targetDriveFolder) {
            const fileMeta = await drive.files.get({
              fileId: driveFileId,
              fields: "parents",
              supportsAllDrives: true,
            });
            const prevParents = (fileMeta.data.parents || []).join(",");

            await drive.files.update({
              fileId: driveFileId,
              addParents: targetDriveFolder,
              removeParents: prevParents,
              supportsAllDrives: true,
            });
          }
        } catch (driveErr: any) {
          console.warn(`Drive rename/move warning for ${driveFileId}:`, driveErr?.message || driveErr);
        }
      }
    }

    // 4. Update or Insert book record
    let updatedBookRecord: any;

    if (bookIndex >= 0) {
      const existing = catalog.books[bookIndex];
      updatedBookRecord = {
        ...existing,
        title: approvedTitle,
        originalFilename: approvedFilename,
        author: approvedAuthor,
        category: categoryName,
        folderId: targetFolderId,
        subfolderId: targetSubfolderId,
        tags: proposal.tags || existing.tags || [categoryName],
        language: proposal.suggestedLanguage || existing.language || "English",
        edition: proposal.edition || existing.edition,
        volume: proposal.volume || existing.volume,
        updatedDate: now,
      };
      catalog.books[bookIndex] = updatedBookRecord;
    } else {
      const newBookId = proposal.bookId || driveFileId || `b-${Date.now()}`;
      updatedBookRecord = {
        id: newBookId,
        driveFileId: driveFileId || newBookId,
        title: approvedTitle,
        originalFilename: approvedFilename,
        author: approvedAuthor,
        description: proposal.reason || "",
        category: categoryName,
        folderId: targetFolderId,
        subfolderId: targetSubfolderId,
        tags: proposal.tags || [categoryName],
        language: proposal.suggestedLanguage || "English",
        edition: proposal.edition,
        volume: proposal.volume,
        fileType: "pdf",
        mimeType: proposal.mimeType || "application/pdf",
        fileSize: proposal.fileSize || "0 KB",
        pdfUrl: driveFileId ? `/api/files/${driveFileId}/preview` : undefined,
        fileUrl: driveFileId ? `/api/files/${driveFileId}/preview` : undefined,
        addedDate: proposal.createdAt || now,
        updatedDate: now,
        featured: false,
        visible: true,
      };
      catalog.books.unshift(updatedBookRecord);
    }

    // Save catalog
    if (catalogWriter) {
      catalogWriter(catalog);
    }

    if (isGoogleDriveConfigured()) {
      syncCatalogWithDrive(catalog).catch(() => {});
      invalidateDriveCache();
    }

    // Mark proposal applied
    proposals[index].status = "applied";
    saveProposals(proposals);

    return { success: true, book: updatedBookRecord };
  } catch (err: any) {
    console.error("Failed to apply AI organization proposal:", err);
    return { success: false, error: err?.message || "Failed to apply proposal." };
  }
}
