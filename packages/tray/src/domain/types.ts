/**
 * 🥯 i18n-bakery/tray - Domain Types
 *
 * Core types used across the Tray MCP server. These are pure data shapes
 * with no runtime dependencies, following Clean Architecture principles.
 *
 * @module domain/types
 */

// ─── Extraction ──────────────────────────────────────────────────────────────

export interface BatterInput {
  /** Source directory to scan for t() calls (e.g., "src") */
  source: string;
  /** Comma-separated list of locales (e.g., "en-US,es-MX,it,jp") */
  locales: string;
  /** Output directory for locale files (default: "public/locales") */
  out?: string;
  /** Output format: "json" | "toml" (default: "json") */
  format?: 'json' | 'toml';
  /** Current working directory, resolved at call time */
  cwd: string;
}

export interface BatterResult {
  /** Total keys found across all files */
  totalKeys: number;
  /** Keys grouped by namespace */
  keysByNamespace: Record<string, ExtractedKeyInfo[]>;
  /** Number of files scanned */
  filesScanned: number;
  /** New keys added per locale (locale → count) */
  newKeysPerLocale: Record<string, number>;
  /** Output directory where files were written */
  outputDir: string;
}

export interface ExtractedKeyInfo {
  /** The raw translation key string */
  key: string;
  /** Inferred namespace from key structure */
  namespace: string;
  /** Optional default value from source */
  defaultValue?: string;
  /** Source file where key was found */
  file: string;
  /** Line number in source file */
  line: number;
}

// ─── Compilation ─────────────────────────────────────────────────────────────

export interface BakeInput {
  /** Source directory with locale subdirectories (e.g., "public/locales") */
  source: string;
  /** Output directory for compiled bundles (default: "dist/locales") */
  out?: string;
  /** Minify the JSON output */
  minify?: boolean;
  /** Add a content hash to filenames for cache busting */
  hash?: boolean;
  /** Generate a manifest JSON file (provide filename, e.g., "manifest.json") */
  manifest?: string;
  /** Split output into per-namespace files (lazy-loading friendly) */
  split?: boolean;
  /** Encrypt the output files with AES-256-GCM */
  encrypt?: boolean;
  /** Encryption key (required when encrypt is true) */
  encryptionKey?: string;
  /** Current working directory, resolved at call time */
  cwd: string;
}

export interface BakeResult {
  /** List of files that were compiled */
  bakedFiles: string[];
  /** Path to the generated manifest file, if any */
  manifestPath?: string;
  /** Total number of locales baked */
  localesCount: number;
}

// ─── Pantry (Status/Inventory) ────────────────────────────────────────────────

export interface PantryInput {
  /** Base directory containing locale subdirectories (e.g., "public/locales") */
  localesDir: string;
  /** Reference locale to compare against (default: "en-US" or first found) */
  referenceLocale?: string;
  /** Current working directory, resolved at call time */
  cwd: string;
}

export interface PantryResult {
  /** The locale used as reference for comparison */
  referenceLocale: string;
  /** List of all locales found */
  locales: string[];
  /** Per-locale status report */
  status: Record<string, LocaleStatus>;
}

export interface LocaleStatus {
  /** Locale identifier */
  locale: string;
  /** Total keys in the reference locale */
  totalKeys: number;
  /** Number of keys present in this locale */
  presentKeys: number;
  /** Number of keys missing in this locale */
  missingKeys: number;
  /** Completion percentage (0–100) */
  completionPercent: number;
  /** The actual missing key paths */
  missingKeyList: string[];
}

// ─── Recipe Update (Write) ────────────────────────────────────────────────────

export interface RecipeInput {
  /** Locale to write to (e.g., "es-MX") */
  locale: string;
  /** Namespace (e.g., "common") */
  namespace: string;
  /** The translation key in dot-notation (e.g., "home.title") */
  key: string;
  /** The translation value to write */
  value: string;
  /** Base directory containing locale subdirectories */
  localesDir: string;
  /** Current working directory, resolved at call time */
  cwd: string;
}

export interface RecipeResult {
  /** The absolute path of the file that was written */
  filePath: string;
  /** The key that was written */
  key: string;
  /** The value that was written */
  value: string;
  /** Whether this was a new key (true) or an update (false) */
  isNew: boolean;
}
