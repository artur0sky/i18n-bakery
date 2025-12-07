/**
 * 🥯 i18n-bakery - Capitalize Plugin
 * 
 * Plugin for capitalizing translations.
 * Provides uppercase, lowercase, and capitalize transformations.
 * 
 * @module plugins/CapitalizePlugin
 */

import { Plugin, PluginMetadata, PluginConfig, PluginContext } from '../domain/Plugin';

/**
 * Capitalize plugin for text transformations.
 * 
 * Usage:
 * - Add '_upper' suffix to key for UPPERCASE
 * - Add '_lower' suffix to key for lowercase
 * - Add '_capitalize' suffix to key for Capitalize First Letter
 * 
 * @example
 * const plugin = new CapitalizePlugin();
 * pluginManager.register(plugin);
 * 
 * addTranslations('en', 'common', {
 *   'greeting': 'hello world',
 * });
 * 
 * t('greeting_upper')      // → "HELLO WORLD"
 * t('greeting_lower')      // → "hello world"
 * t('greeting_capitalize') // → "Hello world"
 */
export class CapitalizePlugin implements Plugin {
  readonly metadata: PluginMetadata = {
    name: 'capitalize',
    version: '1.0.0',
    type: 'processor',
    description: 'Provides text transformation (uppercase, lowercase, capitalize)',
    author: 'i18n-bakery',
  };

  config: PluginConfig = {
    enabled: true,
  };

  /**
   * Hook: Before translation to detect transformation suffix.
   */
  beforeTranslate(context: PluginContext): PluginContext | void {
    if (!context.key) {
      return;
    }

    // Check for transformation suffixes
    if (context.key.endsWith('_upper')) {
      context.data = { ...context.data, transform: 'upper' };
      context.key = context.key.slice(0, -6); // Remove '_upper'
    } else if (context.key.endsWith('_lower')) {
      context.data = { ...context.data, transform: 'lower' };
      context.key = context.key.slice(0, -6); // Remove '_lower'
    } else if (context.key.endsWith('_capitalize')) {
      context.data = { ...context.data, transform: 'capitalize' };
      context.key = context.key.slice(0, -11); // Remove '_capitalize'
    } else if (context.key.endsWith('_title')) {
      context.data = { ...context.data, transform: 'title' };
      context.key = context.key.slice(0, -6); // Remove '_title'
    }

    return context;
  }

  /**
   * Hook: After translation to apply transformation.
   */
  afterTranslate(context: PluginContext): string | void {
    if (!context.result || !context.data?.transform) {
      return;
    }

    const transform = context.data.transform;

    switch (transform) {
      case 'upper':
        return context.result.toUpperCase();
      
      case 'lower':
        return context.result.toLowerCase();
      
      case 'capitalize':
        return this.capitalize(context.result);
      
      case 'title':
        return this.titleCase(context.result);
      
      default:
        return context.result;
    }
  }

  /**
   * Capitalize first letter of the string.
   */
  private capitalize(text: string): string {
    if (!text) return text;
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /**
   * Convert to title case (capitalize first letter of each word).
   */
  private titleCase(text: string): string {
    if (!text) return text;
    
    return text
      .split(' ')
      .map(word => this.capitalize(word))
      .join(' ');
  }
}
