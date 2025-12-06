export interface ExtractedKey {
  key: string;
  defaultValue?: string;
  file: string;
  line: number;
  namespace: string;
}

export interface ExtractionResult {
  keys: ExtractedKey[];
  filesScanned: number;
}
