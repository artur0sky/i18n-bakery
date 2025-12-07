/**
 * 🥯 i18n-bakery - Default Plugin Manager (Adapter Layer)
 * 
 * Concrete implementation of the PluginManager interface.
 * Manages plugin registration, lifecycle, and hook execution.
 * 
 * @module adapters/DefaultPluginManager
 */

import {
  Plugin,
  PluginManager,
  PluginConfig,
  PluginType,
  PluginHook,
  PluginContext,
} from '../domain/Plugin';

/**
 * Default implementation of the PluginManager interface.
 * 
 * Features:
 * - Plugin registration with dependency checking
 * - Hook execution with error handling
 * - Plugin lifecycle management
 * - Type-based plugin filtering
 */
export class DefaultPluginManager implements PluginManager {
  private plugins: Map<string, Plugin>;
  private debug: boolean;

  constructor(debug: boolean = false) {
    this.plugins = new Map();
    this.debug = debug;
  }

  /**
   * Register a plugin.
   */
  async register(plugin: Plugin, config?: PluginConfig): Promise<void> {
    const name = plugin.metadata.name;

    // Check if plugin already exists
    if (this.plugins.has(name)) {
      throw new Error(`Plugin '${name}' is already registered`);
    }

    // Check dependencies
    if (plugin.metadata.dependencies) {
      for (const dep of plugin.metadata.dependencies) {
        if (!this.plugins.has(dep)) {
          throw new Error(`Plugin '${name}' depends on '${dep}' which is not registered`);
        }
      }
    }

    // Apply configuration
    if (config) {
      plugin.config = { ...plugin.config, ...config };
    }

    // Initialize plugin
    if (plugin.init) {
      try {
        await plugin.init(config?.options);
        if (this.debug) {
          console.log(`[PluginManager] Initialized plugin: ${name}`);
        }
      } catch (error) {
        throw new Error(`Failed to initialize plugin '${name}': ${error}`);
      }
    }

    // Register plugin
    this.plugins.set(name, plugin);

    if (this.debug) {
      console.log(`[PluginManager] Registered plugin: ${name} (${plugin.metadata.type})`);
    }
  }

  /**
   * Unregister a plugin.
   */
  async unregister(name: string): Promise<boolean> {
    const plugin = this.plugins.get(name);

    if (!plugin) {
      return false;
    }

    // Check if other plugins depend on this one
    for (const [pluginName, p] of this.plugins) {
      if (p.metadata.dependencies?.includes(name)) {
        throw new Error(`Cannot unregister plugin '${name}' because '${pluginName}' depends on it`);
      }
    }

    // Destroy plugin
    if (plugin.destroy) {
      try {
        await plugin.destroy();
        if (this.debug) {
          console.log(`[PluginManager] Destroyed plugin: ${name}`);
        }
      } catch (error) {
        console.error(`[PluginManager] Error destroying plugin '${name}':`, error);
      }
    }

    // Unregister plugin
    this.plugins.delete(name);

    if (this.debug) {
      console.log(`[PluginManager] Unregistered plugin: ${name}`);
    }

    return true;
  }

  /**
   * Get a plugin by name.
   */
  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Get all registered plugins.
   */
  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get plugins by type.
   */
  getByType(type: PluginType): Plugin[] {
    return this.getAll().filter(plugin => plugin.metadata.type === type);
  }

  /**
   * Check if a plugin is registered.
   */
  has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Execute a hook on all plugins.
   */
  async executeHook(hook: PluginHook, context: PluginContext): Promise<void> {
    const enabledPlugins = this.getAll().filter(p => p.config.enabled !== false);

    for (const plugin of enabledPlugins) {
      try {
        switch (hook) {
          case 'beforeTranslate':
            if (plugin.beforeTranslate) {
              const result = await plugin.beforeTranslate(context);
              if (result) {
                Object.assign(context, result);
              }
            }
            break;

          case 'afterTranslate':
            if (plugin.afterTranslate) {
              const result = await plugin.afterTranslate(context);
              if (result !== undefined && result !== null) {
                context.result = result;
              }
            }
            break;

          case 'onMissing':
            if (plugin.onMissing) {
              await plugin.onMissing(context);
            }
            break;

          case 'onLoad':
            if (plugin.onLoad && context.namespace && context.data) {
              await plugin.onLoad(context.locale, context.namespace, context.data as Record<string, string>);
            }
            break;

          case 'onLocaleChange':
            if (plugin.onLocaleChange && context.data?.oldLocale && context.data?.newLocale) {
              await plugin.onLocaleChange(context.data.oldLocale, context.data.newLocale);
            }
            break;
        }
      } catch (error) {
        console.error(`[PluginManager] Error executing ${hook} hook on plugin '${plugin.metadata.name}':`, error);
      }
    }
  }

  /**
   * Clear all plugins.
   */
  async clear(): Promise<void> {
    const pluginNames = Array.from(this.plugins.keys());

    for (const name of pluginNames) {
      await this.unregister(name);
    }

    if (this.debug) {
      console.log(`[PluginManager] Cleared all plugins`);
    }
  }
}
