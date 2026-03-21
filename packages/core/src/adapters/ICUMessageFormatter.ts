/**
 * 🥯 i18n-bakery - ICU Message Formatter (Adapter Layer)
 * 
 * Concrete implementation of the Formatter interface
 * using ICU MessageFormat syntax.
 * 
 * @module adapters/ICUMessageFormatter
 */

import { Formatter } from '../domain/types';

/**
 * ICU MessageFormat-based formatter.
 * 
 * Supports:
 * - Plural: {count, plural, =0 {no items} one {# item} other {# items}}
 * - Select: {gender, select, male {He} female {She} other {They}}
 * - Selectordinal: {place, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}
 * - Simple variables: {name}, {count}
 * 
 * @example
 * const formatter = new ICUMessageFormatter('en');
 * 
 * // Plural
 * formatter.interpolate(
 *   '{count, plural, =0 {no items} one {# item} other {# items}}',
 *   { count: 0 }
 * ); // → "no items"
 * 
 * // Select
 * formatter.interpolate(
 *   '{gender, select, male {He} female {She} other {They}} liked this',
 *   { gender: 'male' }
 * ); // → "He liked this"
 */
export class ICUMessageFormatter implements Formatter {
  private locale: string;
  private pluralRules: Intl.PluralRules;

  constructor(locale: string = 'en') {
    this.locale = locale;
    this.pluralRules = new Intl.PluralRules(locale);
  }

  /**
   * Interpolates a message with ICU MessageFormat syntax.
   * 
   * @param text - The message template
   * @param vars - Variables for interpolation
   * @returns Interpolated message
   */
  interpolate(text: string, vars?: Record<string, any>): string {
    if (!text || !vars) {
      return text;
    }

    // Process ICU MessageFormat patterns
    let result = text;

    // Process plural patterns: {count, plural, ...}
    result = this.processPluralPatterns(result, vars);

    // Process select patterns: {gender, select, ...}
    result = this.processSelectPatterns(result, vars);

    // Process selectordinal patterns: {place, selectordinal, ...}
    result = this.processSelectordinalPatterns(result, vars);

    // Process simple variables: {name}, {count}
    result = this.processSimpleVariables(result, vars);

    return result;
  }

  /**
   * Processes plural patterns.
   * Pattern: {variable, plural, =0 {text} one {text} other {text}}
   */
  private processPluralPatterns(text: string, vars: Record<string, any>): string {
    return this.processICUPattern(text, vars, 'plural', (count, options) => {
      if (typeof count !== 'number') {
        return null;
      }
      return this.selectPluralOption(count, options);
    });
  }

  /**
   * Processes select patterns.
   * Pattern: {variable, select, male {text} female {text} other {text}}
   */
  private processSelectPatterns(text: string, vars: Record<string, any>): string {
    return this.processICUPattern(text, vars, 'select', (value, options) => {
      if (value === undefined || value === null) {
        return null;
      }
      return this.selectOption(String(value), options);
    });
  }

  /**
   * Processes selectordinal patterns.
   * Pattern: {variable, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}
   */
  private processSelectordinalPatterns(text: string, vars: Record<string, any>): string {
    return this.processICUPattern(text, vars, 'selectordinal', (count, options) => {
      if (typeof count !== 'number') {
        return null;
      }
      return this.selectOrdinalOption(count, options);
    });
  }

  /**
   * Generic ICU pattern processor that handles nested braces correctly.
   */
  private processICUPattern(
    text: string,
    vars: Record<string, any>,
    type: string,
    selector: (value: any, options: string) => string | null
  ): string {
    let result = text;
    let match: RegExpExecArray | null;
    const regex = new RegExp(`\\{(\\w+),\\s*${type},\\s*`, 'g');

    while ((match = regex.exec(result)) !== null) {
      const variable = match[1];
      const startPos = match.index;
      const optionsStart = match.index + match[0].length;

      // Find the matching closing brace
      const closingPos = this.findMatchingBrace(result, optionsStart - 1);
      
      if (closingPos === -1) {
        continue;
      }

      const options = result.substring(optionsStart, closingPos);
      const value = vars[variable];
      const replacement = selector(value, options);

      if (replacement !== null) {
        result = result.substring(0, startPos) + replacement + result.substring(closingPos + 1);
        regex.lastIndex = startPos + replacement.length;
      }
    }

    return result;
  }

  /**
   * Finds the matching closing brace for an opening brace, handling nested braces.
   */
  private findMatchingBrace(text: string, startPos: number): number {
    let depth = 1;
    let pos = startPos + 1;

    while (pos < text.length && depth > 0) {
      if (text[pos] === '{') {
        depth++;
      } else if (text[pos] === '}') {
        depth--;
      }
      pos++;
    }

    return depth === 0 ? pos - 1 : -1;
  }

  /**
   * Processes simple variable substitution.
   * Pattern: {variable}
   */
  private processSimpleVariables(text: string, vars: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, variable) => {
      const value = vars[variable];
      return value !== undefined && value !== null ? String(value) : match;
    });
  }

  /**
   * Selects the appropriate plural option based on count.
   */
  private selectPluralOption(count: number, options: string): string {
    // Parse options: =0 {no items} one {# item} other {# items}
    const exactMatch = this.findExactMatch(count, options);
    if (exactMatch !== null) {
      return exactMatch.replace(/#/g, String(count));
    }

    // Get plural category
    const category = this.pluralRules.select(count);
    const categoryMatch = this.findCategoryMatch(category, options);
    
    if (categoryMatch !== null) {
      return categoryMatch.replace(/#/g, String(count));
    }

    // Fallback to 'other'
    const otherMatch = this.findCategoryMatch('other', options);
    return otherMatch !== null ? otherMatch.replace(/#/g, String(count)) : String(count);
  }

  /**
   * Selects the appropriate select option based on value.
   */
  private selectOption(value: string, options: string): string {
    const match = this.findCategoryMatch(value, options);
    
    if (match !== null) {
      return match;
    }

    // Fallback to 'other'
    const otherMatch = this.findCategoryMatch('other', options);
    return otherMatch !== null ? otherMatch : value;
  }

  /**
   * Selects the appropriate ordinal option based on count.
   */
  private selectOrdinalOption(count: number, options: string): string {
    // For ordinals, we need special rules
    const ordinalCategory = this.getOrdinalCategory(count);
    const categoryMatch = this.findCategoryMatch(ordinalCategory, options);
    
    if (categoryMatch !== null) {
      return categoryMatch.replace(/#/g, String(count));
    }

    // Fallback to 'other'
    const otherMatch = this.findCategoryMatch('other', options);
    return otherMatch !== null ? otherMatch.replace(/#/g, String(count)) : String(count);
  }

  /**
   * Finds an exact match (e.g., =0, =1, =2).
   */
  private findExactMatch(count: number, options: string): string | null {
    const exactRegex = new RegExp(`=\\s*${count}\\s*\\{`);
    const match = exactRegex.exec(options);
    
    if (!match) {
      return null;
    }

    const startPos = match.index + match[0].length;
    const endPos = this.findMatchingBrace(options, startPos - 1);
    
    if (endPos === -1) {
      return null;
    }

    return options.substring(startPos, endPos);
  }

  /**
   * Finds a category match (e.g., one, other, male, female).
   */
  private findCategoryMatch(category: string, options: string): string | null {
    const categoryRegex = new RegExp(`\\b${category}\\s*\\{`);
    const match = categoryRegex.exec(options);
    
    if (!match) {
      return null;
    }

    const startPos = match.index + match[0].length;
    const endPos = this.findMatchingBrace(options, startPos - 1);
    
    if (endPos === -1) {
      return null;
    }

    return options.substring(startPos, endPos);
  }

  /**
   * Gets the ordinal category for a number.
   * This is a simplified version - full implementation would use Intl.PluralRules with type: 'ordinal'
   */
  private getOrdinalCategory(count: number): string {
    // English ordinal rules
    if (this.locale.startsWith('en')) {
      const lastDigit = count % 10;
      const lastTwoDigits = count % 100;

      if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
        return 'other';
      }

      switch (lastDigit) {
        case 1: return 'one';
        case 2: return 'two';
        case 3: return 'few';
        default: return 'other';
      }
    }

    // For other locales, use cardinal rules as fallback
    return this.pluralRules.select(count);
  }

  /**
   * Updates the locale for this formatter.
   */
  setLocale(locale: string): void {
    this.locale = locale;
    this.pluralRules = new Intl.PluralRules(locale);
  }
}
