export function assertSafeTranslationKey(parts: string[]): void {
  if (parts.some(part => part === '__proto__' || part === 'constructor' || part === 'prototype')) {
    throw new Error('Invalid translation key: prototype-related segments are not allowed');
  }
}
