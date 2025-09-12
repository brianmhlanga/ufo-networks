// PDF utility - only runs on client side
export async function extractBatchNumbers(file: File): Promise<string[]> {
  // Only run on client side
  if (process.server) {
    throw new Error('PDF extraction only works on client side');
  }

  try {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist');
    
    // Setup worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    
    const loadingTask = pdfjsLib.getDocument(URL.createObjectURL(file));
    const pdf = await loadingTask.promise;
    let textContent = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const text = await page.getTextContent();
      text.items.forEach((item: any) => {
        textContent += item.str + "\n";
      });
    }

    // Match 8-digit numbers (batch numbers)
    const matches = textContent.match(/\b\d{8}\b/g);
    return matches || [];
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw new Error('Failed to extract text from PDF');
  }
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
