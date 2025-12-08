/**
 * 🥯 i18n-bakery - Key Extractor Domain
 * 
 * Defines the interface for extracting translation keys from source code.
 */

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

export interface KeyExtractor {
  extractFromFile(filePath: string): Promise<ExtractedKey[]>;
}
