// PDF utility - only runs on client side

/**
 * Resolve the pdf.js worker to a same-origin URL.
 *
 * This must NOT be a CDN URL. The site's CSP has no `worker-src`, and pdf.js wraps a
 * cross-origin worker in a `blob:` worker, which then falls back to `script-src` and is blocked —
 * which is what broke batch uploads when the CSP was introduced. Vite's `?url` import emits the
 * worker as a local asset, so it is served from our own origin and always matches the installed
 * pdfjs-dist version (a hardcoded CDN version string silently drifts on upgrade).
 */
async function resolveWorkerSrc(): Promise<string> {
  // @ts-expect-error - Vite resolves `?url` imports to an emitted asset path
  const workerUrl = await import('pdfjs-dist/build/pdf.worker.min.js?url')
  return workerUrl.default
}

export async function extractBatchNumbers(file: File): Promise<string[]> {
  if (import.meta.server) {
    throw new Error('PDF extraction only works on client side');
  }

  const pdfjsLib = await import('pdfjs-dist');
  pdfjsLib.GlobalWorkerOptions.workerSrc = await resolveWorkerSrc();

  // Hand pdf.js the bytes directly. Passing a `blob:` object URL instead would make pdf.js
  // fetch it, which the CSP's `connect-src` blocks.
  const data = new Uint8Array(await file.arrayBuffer());

  const pdf = await pdfjsLib.getDocument({ data }).promise;
  let textContent = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    text.items.forEach((item: any) => {
      textContent += item.str + "\n";
    });
  }

  // Voucher numbers are 8 digits. Nothing else in the batch PDF (durations like "24h",
  // prices like "1 USD", dates like "2026-06-30") can produce an 8-digit run.
  const matches = textContent.match(/\b\d{8}\b/g);

  // De-duplicate: voucherNumber and pin are both unique columns, so a repeated number would
  // otherwise fail the whole insert with an opaque 500.
  return Array.from(new Set(matches || []));
}

export function validateBatchNumbers(batchNumbers: string[]): {
  valid: string[];
  invalid: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];

  batchNumbers.forEach(number => {
    // Check if it's exactly 8 digits
    if (/^\d{8}$/.test(number)) {
      valid.push(number);
    } else {
      invalid.push(number);
    }
  });

  return { valid, invalid };
}
