/**
 * On-page figure helpers for the Wafq Forge, the seal (Khatam) and the
 * plate. The rule is simple: the figure is shown on the page first and
 * is fully usable there. Copy and save-as-image are extras the visitor
 * chooses. Nothing here needs a server round trip and nothing here
 * makes a PDF.
 */

/** One row of numbers per line, numbers in a row separated by a space. */
export function gridToText(grid: number[][]): string {
  return grid.map((row) => row.join(' ')).join('\n');
}

/** Copy text to the clipboard. Falls back to a hidden textarea when the
 * clipboard API is not available. Returns true when the copy ran. */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to the textarea path below.
  }
  try {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

/** Download a blob in the browser, with no server round trip. */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Download an SVG string as an .svg image file. */
export function downloadSvgText(svg: string, filename: string): void {
  downloadBlob(new Blob([svg], { type: 'image/svg+xml' }), filename);
}

/**
 * Save an SVG string as a PNG image, fully in the browser: draw the SVG
 * onto a canvas and download the PNG. Returns true when the image was
 * saved. `scale` 2 draws at twice the size for a sharper image.
 */
export function saveSvgAsPng(svgText: string, filename: string, scale = 2): Promise<boolean> {
  return new Promise((resolve) => {
    const widthMatch = svgText.match(/width="(\d+)"/);
    const heightMatch = svgText.match(/height="(\d+)"/);
    const width = widthMatch ? Number(widthMatch[1]) : 640;
    const height = heightMatch ? Number(heightMatch[1]) : 640;
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width * scale;
        canvas.height = height * scale;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(false);
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((png) => {
          if (png) downloadBlob(png, filename);
          resolve(Boolean(png));
        }, 'image/png');
      } catch {
        resolve(false);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve(false);
    };
    img.src = url;
  });
}

/**
 * A framed square as an SVG string, in the same manuscript style as the
 * Forge export: dark ground, double gold border with corner marks, the
 * grid, and a caption line under it. The caller renders this same SVG
 * on the page and hands it to saveSvgAsPng, so the saved image matches
 * what the visitor sees.
 */
export function buildFramedSquareSvg(grid: number[][], caption: string): string {
  const order = grid.length;
  const size = 640;
  const margin = 56;
  const inner = size - margin * 2;
  const cell = inner / order;
  const fontSize = Math.min(28, Math.max(9, Math.floor(cell * 0.52)));
  const lines: string[] = [];
  lines.push(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
  );
  lines.push(`<rect x="0" y="0" width="${size}" height="${size}" fill="#0a0806"/>`);
  lines.push(
    `<rect x="14" y="14" width="${size - 28}" height="${size - 28}" fill="none" stroke="#e8b84f" stroke-width="3"/>`,
  );
  lines.push(
    `<rect x="26" y="26" width="${size - 52}" height="${size - 52}" fill="none" stroke="#e8b84f" stroke-width="1"/>`,
  );
  const corners: [number, number][] = [
    [14, 14],
    [size - 14, 14],
    [14, size - 14],
    [size - 14, size - 14],
  ];
  for (const [cx, cy] of corners) {
    lines.push(`<circle cx="${cx}" cy="${cy}" r="5" fill="#e8b84f"/>`);
  }
  for (let r = 0; r <= order; r += 1) {
    const y = margin + r * cell;
    lines.push(
      `<line x1="${margin}" y1="${y}" x2="${margin + inner}" y2="${y}" stroke="#e8b84f" stroke-width="1"/>`,
    );
  }
  for (let c = 0; c <= order; c += 1) {
    const x = margin + c * cell;
    lines.push(
      `<line x1="${x}" y1="${margin}" x2="${x}" y2="${margin + inner}" stroke="#e8b84f" stroke-width="1"/>`,
    );
  }
  for (let r = 0; r < order; r += 1) {
    for (let c = 0; c < order; c += 1) {
      const x = margin + c * cell + cell / 2;
      const y = margin + r * cell + cell / 2 + fontSize * 0.35;
      lines.push(
        `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-family="Georgia, serif" font-size="${fontSize}" fill="#ece6d8" text-anchor="middle">${grid[r][c]}</text>`,
      );
    }
  }
  lines.push(
    `<text x="${size / 2}" y="${size - 22}" font-family="Georgia, serif" font-size="14" fill="#e8b84f" text-anchor="middle">${caption}</text>`,
  );
  lines.push('</svg>');
  return lines.join('\n');
}
