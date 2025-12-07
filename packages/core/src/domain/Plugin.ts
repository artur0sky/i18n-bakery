/**
 * 🥯 i18n-bakery - Plugin System (Domain Layer)
 * 
 * This file defines the domain interfaces for the plugin system
 * following Clean Architecture principles.
 * 
 * @module domain/Plugin
 */

import { Locale, Namespace, Key } from './types';

/**
 * Plugin types supported by the system.
 */
export type PluginType = 
  | 'formatter'      // Custom formatters (numbers, dates, currencies)
  | 'backend'        // Backend loaders (HTTP, localStorage, etc.)
  | 'detector'       // Language detectors (browser, cookie, etc.)
  | 'processor'      // Post-processors (capitalize, escape, etc.)
  | 'middleware';    // Middleware for translation pipeline

/**
 * Plugin lifecycle hooks.
 */
export type PluginHook =
  | 'init'           // Called when plugin is initialized
  | 'beforeTranslate' // Called before translation lookup
  | 'afterTranslate'  // Called after translation lookup
  | 'onMissing'      // Called when translation is missing
  | 'onLoad'         // Called when namespace is loaded
  | 'onLocaleChange'; // Called when locale changes

/**
 * Plugin metadata.
 */
export interface PluginMetadata {
  /**
   * Plugin name (unique identifier)
   */
  name: string;
  
  /**
   * Plugin version
   */
  version: string;
  
  /**
   * Plugin type
   */
  type: PluginType;
  
  /**
   * Plugin description
   */
  description?: string;
  
  /**
   * Plugin author
   */
  author?: string;
  
  /**
   * Dependencies on other plugins
   */
  dependencies?: string[];
}

/**
 * Plugin configuration options.
 */
export interface PluginConfig {
  /**
   * Whether the plugin is enabled
   * @default true
   */
  enabled?: boolean;
  
  /**
   * Plugin-specific options
   */
  options?: Record<string, any>;
}

/**
 * Context passed to plugin hooks.
 */
export interface PluginContext {
  /**
   * Current locale
   */
  locale: Locale;
  
  /**
   * Current namespace
   */
  namespace?: Namespace;
  
  /**
   * Translation key
   */
  key?: Key;
  
  /**
   * Variables for interpolation
   */
  vars?: Record<string, any>;
  
  /**
   * Translation result (for afterTranslate hook)
   */
  result?: string;
  
  /**
   * Additional context data
   */
  data?: Record<string, any>;
}

/**
 * Port (Interface) for plugins.
 * 
 * Following the Dependency Inversion Principle (SOLID),
 * this interface allows different plugin types to be
 * implemented without changing the core logic.
 */
export interface Plugin {
  /**
   * Plugin metadata
   */
  readonly metadata: PluginMetadata;
  
  /**
   * Plugin configuration
   */
  config: PluginConfig;
  
  /**
   * Initialize the plugin.
   * Called when the plugin is registered.
   * 
   * @param options - Initialization options
   */
  init?(options?: Record<string, any>): void | Promise<void>;
  
  /**
   * Hook: Before translation lookup.
   * Can modify the key or context before translation.
   * 
   * @param context - Plugin context
   * @returns Modified context or void
   */
  beforeTranslate?(context: PluginContext): PluginContext | void | Promise<PluginContext | void>;
  
  /**
   * Hook: After translation lookup.
   * Can modify the translation result.
   * 
   * @param context - Plugin context with result
   * @returns Modified result or void
   */
  afterTranslate?(context: PluginContext): string | void | Promise<string | void>;
  
  /**
   * Hook: When translation is missing.
   * Can provide a fallback or log the missing key.
   * 
   * @param context - Plugin context
   */
  onMissing?(context: PluginContext): void | Promise<void>;
  
  /**
   * Hook: When namespace is loaded.
   * 
   * @param locale - The locale
   * @param namespace - The namespace
   * @param data - The loaded data
   */
  onLoad?(locale: Locale, namespace: Namespace, data: Record<string, string>): void | Promise<void>;
  
  /**
   * Hook: When locale changes.
   * 
   * @param oldLocale - Previous locale
   * @param newLocale - New locale
   */
  onLocaleChange?(oldLocale: Locale, newLocale: Locale): void | Promise<void>;
  
  /**
   * Cleanup the plugin.
   * Called when the plugin is unregistered or the service is destroyed.
   */
  destroy?(): void | Promise<void>;
}

/**
 * Port (Interface) for managing plugins.
 */
export interface PluginManager {
  /**
   * Register a plugin.
   * 
   * @param plugin - The plugin to register
   * @param config - Plugin configuration
   * @throws Error if plugin with same name already exists
   */
  register(plugin: Plugin, config?: PluginConfig): void | Promise<void>;
  
  /**
   * Unregister a plugin.
   * 
   * @param name - Plugin name
   * @returns True if plugin was unregistered
   */
  unregister(name: string): boolean | Promise<boolean>;
  
  /**
   * Get a plugin by name.
   * 
   * @param name - Plugin name
   * @returns The plugin or undefined
   */
  get(name: string): Plugin | undefined;
  
  /**
   * Get all registered plugins.
   * 
   * @returns Array of plugins
   */
  getAll(): Plugin[];
  
  /**
   * Get plugins by type.
   * 
   * @param type - Plugin type
   * @returns Array of plugins of the specified type
   */
  getByType(type: PluginType): Plugin[];
  
  /**
   * Check if a plugin is registered.
   * 
   * @param name - Plugin name
   * @returns True if plugin is registered
   */
  has(name: string): boolean;
  
  /**
   * Execute a hook on all plugins.
   * 
   * @param hook - Hook name
   * @param context - Plugin context
   * @returns Promise that resolves when all hooks complete
   */
  executeHook(hook: PluginHook, context: PluginContext): Promise<void>;
  
  /**
   * Clear all plugins.
   */
  clear(): void | Promise<void>;
}
