/**
 * 🥯 i18n-bakery - Number Format Plugin
 * 
 * Plugin for formatting numbers using Intl.NumberFormat.
 * Provides currency, decimal, and percent formatting.
 * 
 * @module plugins/NumberFormatPlugin
 */

import { Plugin, PluginMetadata, PluginConfig, PluginContext } from '../domain/Plugin';

/**
 * Number format plugin using Intl.NumberFormat.
 * 
 * Usage in translations:
 * - {price|currency:USD} → $1,234.56
 * - {amount|number} → 1,234.56
 * - {ratio|percent} → 12.34%
 * 
 * @example
 * const plugin = new NumberFormatPlugin();
 * pluginManager.register(plugin);
 * 
 * addTranslations('en', 'shop', {
 *   'price': 'Total: {amount|currency:USD}',
 * });
 * 
 * t('shop:price', { amount: 1234.56 }); // → "Total: $1,234.56"
 */
export class NumberFormatPlugin implements Plugin {
  readonly metadata: PluginMetadata = {
    name: 'number-format',
    version: '1.0.0',
    type: 'formatter',
    description: 'Formats numbers, currencies, and percentages using Intl.NumberFormat',
    author: 'i18n-bakery',
  };

  config: PluginConfig = {
    enabled: true,
  };

  private locale: string = 'en';

  /**
   * Initialize the plugin.
   */
  init(options?: Record<string, any>): void {
    if (options?.locale) {
      this.locale = options.locale;
    }
  }

  /**
   * Hook: After translation to format numbers.
   */
  afterTranslate(context: PluginContext): string | void {
    if (!context.result || !context.vars) {
      return;
    }

    let result = context.result;

    // Process number format patterns: {variable|format:options}
    const formatRegex = /\{(\w+)\|(\w+)(?::([^}]+))?\}/g;
    
    result = result.replace(formatRegex, (match, variable, format, options) => {
      const value = context.vars![variable];

      if (typeof value !== 'number') {
        return match;
      }

      try {
        return this.formatNumber(value, format, options, context.locale);
      } catch (error) {
        console.error(`[NumberFormatPlugin] Error formatting ${variable}:`, error);
        return match;
      }
    });

    return result;
  }

  /**
   * Hook: When locale changes, update the plugin locale.
   */
  onLocaleChange(oldLocale: string, newLocale: string): void {
    this.locale = newLocale;
  }

  /**
   * Format a number based on the format type.
   */
  private formatNumber(value: number, format: string, options: string | undefined, locale: string): string {
    const currentLocale = locale || this.locale;

    switch (format) {
      case 'currency':
        return this.formatCurrency(value, options || 'USD', currentLocale);
      
      case 'number':
      case 'decimal':
        return this.formatDecimal(value, options, currentLocale);
      
      case 'percent':
        return this.formatPercent(value, currentLocale);
      
      case 'compact':
        return this.formatCompact(value, currentLocale);
      
      default:
        return String(value);
    }
  }

  /**
   * Format as currency.
   */
  private formatCurrency(value: number, currency: string, locale: string): string {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency.toUpperCase(),
    });
    return formatter.format(value);
  }

  /**
   * Format as decimal number.
   */
  private formatDecimal(value: number, options: string | undefined, locale: string): string {
    const decimals = options ? parseInt(options, 10) : undefined;
    
    const formatter = new Intl.NumberFormat(locale, {
      style: 'decimal',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
    
    return formatter.format(value);
  }

  /**
   * Format as percentage.
   */
  private formatPercent(value: number, locale: string): string {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(value / 100);
  }

  /**
   * Format as compact number (1K, 1M, etc.).
   */
  private formatCompact(value: number, locale: string): string {
    const formatter = new Intl.NumberFormat(locale, {
      notation: 'compact',
      compactDisplay: 'short',
    });
    return formatter.format(value);
  }
}
