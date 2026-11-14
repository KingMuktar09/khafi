import { describe, it, expect } from "vitest";
import {
  isPrivateOrReservedIpv4,
  isPrivateOrReservedIpv6,
  sanitizeFilename,
  detectExtensionFromMime,
  detectItemTypeFromExtAndMime,
  formatBytes,
  extractFilenameFromContentDisposition,
} from "../server/url-importer";

describe("isPrivateOrReservedIpv4 (SSRF guard)", () => {
  it("blocks loopback, private and link-local ranges", () => {
    for (const ip of [
      "127.0.0.1",
      "10.0.0.5",
      "172.16.3.9",
      "172.31.255.255",
      "192.168.1.1",
      "169.254.169.254", // cloud metadata
      "100.64.0.1", // carrier-grade NAT
      "0.0.0.0",
    ]) {
      expect(isPrivateOrReservedIpv4(ip)).toBe(true);
    }
  });

  it("blocks multicast, reserved and test-net ranges", () => {
    for (const ip of ["224.0.0.1", "240.0.0.1", "255.255.255.255", "192.0.2.1", "198.51.100.7", "203.0.113.9"]) {
      expect(isPrivateOrReservedIpv4(ip)).toBe(true);
    }
  });

  it("treats malformed addresses as unsafe", () => {
    expect(isPrivateOrReservedIpv4("999.1.1.1")).toBe(true);
    expect(isPrivateOrReservedIpv4("1.2.3")).toBe(true);
    expect(isPrivateOrReservedIpv4("not-an-ip")).toBe(true);
  });

  it("allows ordinary public addresses", () => {
    for (const ip of ["8.8.8.8", "1.1.1.1", "172.32.0.1", "100.63.0.1", "198.20.1.1"]) {
      expect(isPrivateOrReservedIpv4(ip)).toBe(false);
    }
  });
});

describe("isPrivateOrReservedIpv6 (SSRF guard)", () => {
  it("blocks loopback, unspecified, ULA and link-local", () => {
    expect(isPrivateOrReservedIpv6("::1")).toBe(true);
    expect(isPrivateOrReservedIpv6("::")).toBe(true);
    expect(isPrivateOrReservedIpv6("fd12:3456::1")).toBe(true);
    expect(isPrivateOrReservedIpv6("fe80::1")).toBe(true);
  });

  it("blocks IPv4-mapped private addresses", () => {
    expect(isPrivateOrReservedIpv6("::ffff:192.168.1.1")).toBe(true);
    expect(isPrivateOrReservedIpv6("::ffff:127.0.0.1")).toBe(true);
  });

  it("allows public IPv6", () => {
    expect(isPrivateOrReservedIpv6("2606:4700:4700::1111")).toBe(false);
  });
});

describe("sanitizeFilename", () => {
  it("strips path traversal and slashes", () => {
    expect(sanitizeFilename("../../etc/passwd")).toBe("etcpasswd");
    expect(sanitizeFilename("..\\..\\win.ini")).toBe("win.ini");
  });

  it("replaces filesystem-forbidden characters", () => {
    expect(sanitizeFilename('a<b>:"|?*.pdf')).toBe("a_b______.pdf");
  });

  it("collapses double dots", () => {
    expect(sanitizeFilename("secret..pdf")).toBe("secret.pdf");
  });

  it("adds a fallback extension when missing", () => {
    expect(sanitizeFilename("book", "pdf")).toBe("book.pdf");
    expect(sanitizeFilename("book", ".PDF")).toBe("book.pdf");
  });

  it("truncates very long names but keeps the extension", () => {
    const long = "x".repeat(300) + ".pdf";
    const out = sanitizeFilename(long);
    expect(out.length).toBeLessThanOrEqual(200);
    expect(out.endsWith(".pdf")).toBe(true);
  });

  it("handles empty input", () => {
    expect(sanitizeFilename("")).toBe("imported_file");
  });
});

describe("detectExtensionFromMime", () => {
  it("maps common document and media types", () => {
    expect(detectExtensionFromMime("application/pdf")).toBe("pdf");
    expect(detectExtensionFromMime("application/epub+zip")).toBe("epub");
    expect(detectExtensionFromMime("image/png")).toBe("png");
    expect(detectExtensionFromMime("audio/mpeg")).toBe("mp3");
    expect(detectExtensionFromMime("video/mp4")).toBe("mp4");
    expect(detectExtensionFromMime("application/zip")).toBe("zip");
  });

  it("ignores charset parameters and case", () => {
    expect(detectExtensionFromMime("text/plain; charset=utf-8")).toBe("txt");
    expect(detectExtensionFromMime("Application/PDF")).toBe("pdf");
  });

  it("returns empty string for unknown or missing types", () => {
    expect(detectExtensionFromMime("application/x-unknown-thing")).toBe("");
    expect(detectExtensionFromMime()).toBe("");
  });
});

describe("detectItemTypeFromExtAndMime", () => {
  it("prefers the extension when present", () => {
    expect(detectItemTypeFromExtAndMime("book.pdf")).toBe("pdf");
    expect(detectItemTypeFromExtAndMime("notes.docx")).toBe("document");
    expect(detectItemTypeFromExtAndMime("cover.PNG")).toBe("image");
    expect(detectItemTypeFromExtAndMime("clip.mkv")).toBe("video");
    expect(detectItemTypeFromExtAndMime("audio.flac")).toBe("audio");
    expect(detectItemTypeFromExtAndMime("archive.7z")).toBe("archive");
  });

  it("falls back to the MIME type", () => {
    expect(detectItemTypeFromExtAndMime(undefined, "application/pdf")).toBe("pdf");
    expect(detectItemTypeFromExtAndMime(undefined, "image/jpeg")).toBe("image");
    expect(detectItemTypeFromExtAndMime(undefined, "video/webm")).toBe("video");
    expect(detectItemTypeFromExtAndMime(undefined, "audio/ogg")).toBe("audio");
  });

  it("returns other for unknown inputs", () => {
    expect(detectItemTypeFromExtAndMime("file.xyz", "application/octet-stream")).toBe("other");
    expect(detectItemTypeFromExtAndMime()).toBe("other");
  });
});

describe("formatBytes", () => {
  it("formats KB, MB and GB", () => {
    expect(formatBytes(512)).toBe("1 KB");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(14.5 * 1024 * 1024)).toBe("14.5 MB");
    expect(formatBytes(2 * 1024 * 1024 * 1024)).toBe("2.00 GB");
  });

  it("handles zero and undefined", () => {
    expect(formatBytes(0)).toBe("0 KB");
    expect(formatBytes()).toBe("0 KB");
  });
});

describe("extractFilenameFromContentDisposition", () => {
  it("parses quoted and bare filenames", () => {
    expect(extractFilenameFromContentDisposition('attachment; filename="book.pdf"')).toBe("book.pdf");
    expect(extractFilenameFromContentDisposition("attachment; filename=book.pdf")).toBe("book.pdf");
  });

  it("prefers RFC 5987 UTF-8 filename*", () => {
    expect(
      extractFilenameFromContentDisposition("attachment; filename*=UTF-8''%D9%83%D8%AA%D8%A7%D8%A8.pdf; filename=\"fallback.pdf\"")
    ).toBe("كتاب.pdf");
  });

  it("returns null when no filename is present", () => {
    expect(extractFilenameFromContentDisposition("attachment")).toBe(null);
    expect(extractFilenameFromContentDisposition(null)).toBe(null);
  });
});
