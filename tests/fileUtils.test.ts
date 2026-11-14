import { describe, it, expect } from "vitest";
import {
  getFileExtension,
  detectFileType,
  getItemType,
  extractDriveId,
  getItemUrl,
  formatFileSize,
  extractTitleFromFilename,
  formatReadableDate,
  parseSizeBytes,
} from "../src/utils/fileUtils";

describe("getFileExtension", () => {
  it("extracts lowercased extensions", () => {
    expect(getFileExtension("Book.PDF")).toBe("pdf");
    expect(getFileExtension("archive.tar.gz")).toBe("gz");
  });

  it("ignores query strings and fragments", () => {
    expect(getFileExtension("file.pdf?dl=1")).toBe("pdf");
    expect(getFileExtension("file.epub#page=3")).toBe("epub");
  });

  it("returns empty for missing or extensionless names", () => {
    expect(getFileExtension()).toBe("");
    expect(getFileExtension("README")).toBe("");
  });
});

describe("detectFileType", () => {
  it("detects by extension first", () => {
    expect(detectFileType("a.pdf")).toBe("pdf");
    expect(detectFileType("a.docx")).toBe("document");
    expect(detectFileType("a.png")).toBe("image");
    expect(detectFileType("a.mp4")).toBe("video");
    expect(detectFileType("a.mp3")).toBe("audio");
    expect(detectFileType("a.zip")).toBe("archive");
  });

  it("detects by mime when extension missing", () => {
    expect(detectFileType("noext", "application/pdf")).toBe("pdf");
    expect(detectFileType("noext", "image/webp")).toBe("image");
  });

  it("returns other for unknown", () => {
    expect(detectFileType("a.bin", "application/octet-stream")).toBe("other");
  });
});

describe("getItemType", () => {
  it("prefers an explicit fileType", () => {
    expect(getItemType({ fileType: "audio", fileUrl: "x.pdf" })).toBe("audio");
  });

  it("infers from url/mime otherwise", () => {
    expect(getItemType({ fileUrl: "/api/files/abc/preview", mimeType: "application/pdf" })).toBe("pdf");
    expect(getItemType({ title: "scan.png" })).toBe("image");
  });
});

describe("extractDriveId", () => {
  it("extracts from internal drive routes", () => {
    expect(extractDriveId("/api/drive/file/1AbC_def-123")).toBe("1AbC_def-123");
    expect(extractDriveId("/api/files/1AbC_def-123/preview")).toBe("1AbC_def-123");
    expect(extractDriveId("/api/files/1AbC_def-123")).toBe("1AbC_def-123");
  });

  it("extracts from Google Drive share links", () => {
    expect(extractDriveId("https://drive.google.com/file/d/1AbC_def-123/view?usp=sharing")).toBe("1AbC_def-123");
    expect(extractDriveId("https://drive.google.com/open?id=1AbC_def-123")).toBe("1AbC_def-123");
  });

  it("accepts a bare id and rejects junk", () => {
    expect(extractDriveId("1AbC_def-123XYZ123456")).toBe("1AbC_def-123XYZ123456");
    expect(extractDriveId("not a url at all")).toBe(null);
    expect(extractDriveId()).toBe(null);
  });
});

describe("getItemUrl", () => {
  it("uses the drive preview endpoint when a driveFileId exists", () => {
    expect(getItemUrl({ driveFileId: "abc123" })).toBe("/api/files/abc123/preview");
  });

  it("converts Google Drive links to the preview endpoint", () => {
    expect(
      getItemUrl({ fileUrl: "https://drive.google.com/file/d/1AbC_def-12345678901234567890/view", id: "b1" })
    ).toBe("/api/files/1AbC_def-12345678901234567890/preview");
  });

  it("passes through local relative urls", () => {
    expect(getItemUrl({ fileUrl: "/uploads/book.pdf" })).toBe("/uploads/book.pdf");
  });

  it("falls back to the book id endpoint", () => {
    expect(getItemUrl({ id: "b-9" })).toBe("/api/files/b-9/preview");
  });
});

describe("formatFileSize", () => {
  it("formats B, KB, MB, GB", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
    expect(formatFileSize(3 * 1024 * 1024 * 1024)).toBe("3.0 GB");
  });

  it("parses numeric strings and passes through bad ones", () => {
    expect(formatFileSize("2048")).toBe("2.0 KB");
    expect(formatFileSize("not-a-size")).toBe("not-a-size");
    expect(formatFileSize("")).toBe("");
    expect(formatFileSize()).toBe("");
  });
});

describe("extractTitleFromFilename", () => {
  it("strips only the trailing extension", () => {
    expect(extractTitleFromFilename("Sahih.Bukhari.Vol1.pdf")).toBe("Sahih.Bukhari.Vol1");
    expect(extractTitleFromFilename("notes.docx")).toBe("notes");
  });

  it("handles missing and extensionless input", () => {
    expect(extractTitleFromFilename()).toBe("Untitled");
    expect(extractTitleFromFilename("noext")).toBe("noext");
  });
});

describe("formatReadableDate", () => {
  it("returns empty for missing input", () => {
    expect(formatReadableDate()).toBe("");
  });

  it("labels today and yesterday", () => {
    const now = new Date();
    expect(formatReadableDate(now.toISOString())).toBe("Today");
    const y = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    expect(formatReadableDate(y.toISOString())).toBe("Yesterday");
  });

  it("formats older dates as d MMM yyyy", () => {
    const old = new Date("2020-01-15T10:00:00Z");
    expect(formatReadableDate(old.toISOString())).toBe("15 Jan 2020");
  });

  it("passes through unparseable input", () => {
    expect(formatReadableDate("garbage")).toBe("garbage");
  });
});

describe("parseSizeBytes", () => {
  it("parses suffixed sizes", () => {
    expect(parseSizeBytes("2.5 MB")).toBe(2.5 * 1024 * 1024);
    expect(parseSizeBytes("10 KB")).toBe(10 * 1024);
    expect(parseSizeBytes("1 GB")).toBe(1024 * 1024 * 1024);
    expect(parseSizeBytes("512 B")).toBe(512);
  });

  it("handles numbers and junk", () => {
    expect(parseSizeBytes(1024)).toBe(1024);
    expect(parseSizeBytes("junk")).toBe(0);
    expect(parseSizeBytes()).toBe(0);
  });
});
