import { OCR_CONFIG } from './config';
import type { OcrResult, OcrOptions } from './types';

export async function performOcr(
  imageUrl: string, 
  options: OcrOptions = OCR_CONFIG.defaultOptions
): Promise<OcrResult> {
  const formData = new FormData();
  formData.append('apikey', OCR_CONFIG.apiKey);
  formData.append('url', imageUrl);
  formData.append('language', options.language || 'eng');
  formData.append('isOverlayRequired', String(options.isOverlayRequired));
  formData.append('detectOrientation', String(options.detectOrientation));
  formData.append('scale', String(options.scale));
  formData.append('isTable', String(options.isTable));

  try {
    const response = await fetch(OCR_CONFIG.apiEndpoint, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR API error: ${response.statusText}`);
    }

    const result: OcrResult = await response.json();

    if (result.OCRExitCode !== 1) {
      throw new Error(result.ErrorMessage || 'OCR processing failed');
    }

    return result;
  } catch (error) {
    throw new Error(`OCR request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}