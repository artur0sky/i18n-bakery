/**
 * 🥯 i18n-bakery/tray - Shared Utilities
 *
 * Pure utility functions used across multiple modules.
 * DRY: centralizes repeated logic like flatten/unflatten, path validation,
 * and deep object access that previously lived in each CLI command.
 *
 * @module shared/utils
 */

// ─── Object Flattening ────────────────────────────────────────────────────────

/**
 * Flattens a nested object into dot-notation keys.
 * @example flatten({ home: { title: "Hi" } }) → { "home.title": "Hi" }
 */
export function flattenObject(
  data: Record<string, any>,
  prefix = '',
  result: Record<string, string> = {}
): Record<string, string> {
  for (const key of Object.keys(data)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
    const value = data[key];
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      flattenObject(value, newKey, result);
    } else {
      result[newKey] = String(value);
    }
  }
  return result;
}

/**
 * Converts a flat dot-notation object back to a nested object.
 * @example unflattenObject({ "home.title": "Hi" }) → { home: { title: "Hi" } }
 */
export function unflattenObject(data: Record<string, string>): Record<string, any> {
  const result: Record<string, any> = {};
  for (const key of Object.keys(data)) {
    if (key.includes('__proto__') || key.includes('constructor') || key.includes('prototype')) {
      continue;
    }
    setDeepKey(result, key, data[key]);
  }
  return result;
}

// ─── Deep Key Access ─────────────────────────────────────────────────────────

/**
 * Sets a value in a nested object using a dot-notation path.
 * Creates intermediate objects as needed.
 * @example setDeepKey(obj, "home.title", "Hi")
 */
export function setDeepKey(obj: Record<string, any>, dotPath: string, value: any): void {
  const parts = dotPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

/**
 * Gets a value from a nested object using a dot-notation path.
 * Returns undefined if any segment of the path does not exist.
 * @example getDeepKey(obj, "home.title") → "Hi" | undefined
 */
export function getDeepKey(obj: Record<string, any>, dotPath: string): any {
  const parts = dotPath.split('.');
  let current: any = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

// ─── Security ────────────────────────────────────────────────────────────────

/**
 * Validates a path segment to prevent directory traversal attacks.
 * Throws an error if the segment is dangerous.
 */
export function validatePathSegment(segment: string, name: string): void {
  if (!segment) return;
  if (
    segment.includes('..') ||
    segment.includes('\\') ||
    segment.startsWith('/') ||
    segment.includes('\0')
  ) {
    throw new Error(
      `Invalid ${name}: "${segment}" contains path traversal characters or absolute paths`
    );
  }
}
