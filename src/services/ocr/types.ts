export interface OcrResult {
  ParsedResults: Array<{
    ParsedText: string;
    ErrorMessage?: string;
    FileParseExitCode: number;
    TextOverlay?: {
      Lines: Array<{
        Words: Array<{
          WordText: string;
          Left: number;
          Top: number;
          Height: number;
          Width: number;
        }>;
      }>;
    };
  }>;
  OCRExitCode: number;
  ErrorMessage?: string;
  ErrorDetails?: string;
}

export interface OcrOptions {
  language?: string;
  isOverlayRequired?: boolean;
  detectOrientation?: boolean;
  scale?: boolean;
  isTable?: boolean;
}