/**
 * 🥯 i18n-bakery - Plugin System Tests
 * 
 * Comprehensive tests for the plugin system.
 * Tests plugin registration, lifecycle, hooks, and example plugins.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DefaultPluginManager } from '../src/adapters/DefaultPluginManager';
import { NumberFormatPlugin } from '../src/plugins/NumberFormatPlugin';
import { CapitalizePlugin } from '../src/plugins/CapitalizePlugin';
import type { Plugin, PluginContext } from '../src/domain/Plugin';

describe('Plugin System', () => {
  let pluginManager: DefaultPluginManager;

  beforeEach(() => {
    pluginManager = new DefaultPluginManager();
  });

  describe('PluginManager', () => {
    it('should register a plugin', async () => {
      const plugin = new NumberFormatPlugin();
      
      await pluginManager.register(plugin);
      
      expect(pluginManager.has('number-format')).toBe(true);
      expect(pluginManager.get('number-format')).toBe(plugin);
    });

    it('should throw error when registering duplicate plugin', async () => {
      const plugin = new NumberFormatPlugin();
      
      await pluginManager.register(plugin);
      
      await expect(pluginManager.register(plugin)).rejects.toThrow(
        "Plugin 'number-format' is already registered"
      );
    });

    it('should unregister a plugin', async () => {
      const plugin = new NumberFormatPlugin();
      
      await pluginManager.register(plugin);
      const result = await pluginManager.unregister('number-format');
      
      expect(result).toBe(true);
      expect(pluginManager.has('number-format')).toBe(false);
    });

    it('should return false when unregistering non-existent plugin', async () => {
      const result = await pluginManager.unregister('non-existent');
      
      expect(result).toBe(false);
    });

    it('should get all plugins', async () => {
      const plugin1 = new NumberFormatPlugin();
      const plugin2 = new CapitalizePlugin();
      
      await pluginManager.register(plugin1);
      await pluginManager.register(plugin2);
      
      const plugins = pluginManager.getAll();
      
      expect(plugins).toHaveLength(2);
      expect(plugins).toContain(plugin1);
      expect(plugins).toContain(plugin2);
    });

    it('should get plugins by type', async () => {
      const plugin1 = new NumberFormatPlugin();
      const plugin2 = new CapitalizePlugin();
      
      await pluginManager.register(plugin1);
      await pluginManager.register(plugin2);
      
      const formatters = pluginManager.getByType('formatter');
      const processors = pluginManager.getByType('processor');
      
      expect(formatters).toHaveLength(1);
      expect(formatters[0]).toBe(plugin1);
      expect(processors).toHaveLength(1);
      expect(processors[0]).toBe(plugin2);
    });

    it('should clear all plugins', async () => {
      const plugin1 = new NumberFormatPlugin();
      const plugin2 = new CapitalizePlugin();
      
      await pluginManager.register(plugin1);
      await pluginManager.register(plugin2);
      
      await pluginManager.clear();
      
      expect(pluginManager.getAll()).toHaveLength(0);
    });

    it('should check plugin dependencies', async () => {
      const dependentPlugin: Plugin = {
        metadata: {
          name: 'dependent',
          version: '1.0.0',
          type: 'processor',
          dependencies: ['number-format'],
        },
        config: { enabled: true },
      };

      await expect(pluginManager.register(dependentPlugin)).rejects.toThrow(
        "Plugin 'dependent' depends on 'number-format' which is not registered"
      );
    });

    it('should prevent unregistering plugin with dependents', async () => {
      const basePlugin = new NumberFormatPlugin();
      const dependentPlugin: Plugin = {
        metadata: {
          name: 'dependent',
          version: '1.0.0',
          type: 'processor',
          dependencies: ['number-format'],
        },
        config: { enabled: true },
      };

      await pluginManager.register(basePlugin);
      await pluginManager.register(dependentPlugin);

      await expect(pluginManager.unregister('number-format')).rejects.toThrow(
        "Cannot unregister plugin 'number-format' because 'dependent' depends on it"
      );
    });
  });

  describe('Plugin Hooks', () => {
    it('should execute beforeTranslate hook', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'mock',
          version: '1.0.0',
          type: 'middleware',
        },
        config: { enabled: true },
        beforeTranslate: vi.fn((context) => {
          context.data = { ...context.data, modified: true };
          return context;
        }),
      };

      await pluginManager.register(mockPlugin);

      const context: PluginContext = {
        locale: 'en',
        key: 'test',
      };

      await pluginManager.executeHook('beforeTranslate', context);

      expect(mockPlugin.beforeTranslate).toHaveBeenCalled();
      expect(context.data?.modified).toBe(true);
    });

    it('should execute afterTranslate hook', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'mock',
          version: '1.0.0',
          type: 'processor',
        },
        config: { enabled: true },
        afterTranslate: vi.fn(() => 'modified result'),
      };

      await pluginManager.register(mockPlugin);

      const context: PluginContext = {
        locale: 'en',
        result: 'original result',
      };

      await pluginManager.executeHook('afterTranslate', context);

      expect(mockPlugin.afterTranslate).toHaveBeenCalled();
      expect(context.result).toBe('modified result');
    });

    it('should skip disabled plugins', async () => {
      const mockPlugin: Plugin = {
        metadata: {
          name: 'mock',
          version: '1.0.0',
          type: 'processor',
        },
        config: { enabled: false },
        afterTranslate: vi.fn(),
      };

      await pluginManager.register(mockPlugin);

      const context: PluginContext = {
        locale: 'en',
        result: 'test',
      };

      await pluginManager.executeHook('afterTranslate', context);

      expect(mockPlugin.afterTranslate).not.toHaveBeenCalled();
    });
  });

  describe('NumberFormatPlugin', () => {
    let plugin: NumberFormatPlugin;

    beforeEach(() => {
      plugin = new NumberFormatPlugin();
      plugin.init({ locale: 'en-US' });
    });

    it('should format currency', () => {
      const context: PluginContext = {
        locale: 'en-US',
        result: 'Total: {amount|currency:USD}',
        vars: { amount: 1234.56 },
      };

      const result = plugin.afterTranslate(context);

      expect(result).toBe('Total: $1,234.56');
    });

    it('should format number', () => {
      const context: PluginContext = {
        locale: 'en-US',
        result: 'Count: {count|number}',
        vars: { count: 1234.56 },
      };

      const result = plugin.afterTranslate(context);

      expect(result).toBe('Count: 1,234.56');
    });

    it('should format percent', () => {
      const context: PluginContext = {
        locale: 'en-US',
        result: 'Progress: {progress|percent}',
        vars: { progress: 75.5 },
      };

      const result = plugin.afterTranslate(context);

      expect(result).toBe('Progress: 75.50%');
    });

    it('should format compact numbers', () => {
      const context: PluginContext = {
        locale: 'en-US',
        result: 'Views: {views|compact}',
        vars: { views: 1500000 },
      };

      const result = plugin.afterTranslate(context);

      expect(result).toContain('1.5M');
    });

    it('should handle multiple formats in one string', () => {
      const context: PluginContext = {
        locale: 'en-US',
        result: 'Price: {price|currency:USD}, Discount: {discount|percent}',
        vars: { price: 99.99, discount: 20 },
      };

      const result = plugin.afterTranslate(context);

      expect(result).toContain('$99.99');
      expect(result).toContain('20.00%');
    });
  });

  describe('CapitalizePlugin', () => {
    let plugin: CapitalizePlugin;

    beforeEach(() => {
      plugin = new CapitalizePlugin();
    });

    it('should transform to uppercase', () => {
      const beforeContext: PluginContext = {
        locale: 'en',
        key: 'greeting_upper',
      };

      const modifiedContext = plugin.beforeTranslate!(beforeContext);
      expect(modifiedContext?.key).toBe('greeting');
      expect(modifiedContext?.data?.transform).toBe('upper');

      const afterContext: PluginContext = {
        locale: 'en',
        result: 'hello world',
        data: { transform: 'upper' },
      };

      const result = plugin.afterTranslate!(afterContext);
      expect(result).toBe('HELLO WORLD');
    });

    it('should transform to lowercase', () => {
      const beforeContext: PluginContext = {
        locale: 'en',
        key: 'greeting_lower',
      };

      const modifiedContext = plugin.beforeTranslate!(beforeContext);
      expect(modifiedContext?.key).toBe('greeting');

      const afterContext: PluginContext = {
        locale: 'en',
        result: 'HELLO WORLD',
        data: { transform: 'lower' },
      };

      const result = plugin.afterTranslate!(afterContext);
      expect(result).toBe('hello world');
    });

    it('should capitalize first letter', () => {
      const beforeContext: PluginContext = {
        locale: 'en',
        key: 'greeting_capitalize',
      };

      const modifiedContext = plugin.beforeTranslate!(beforeContext);
      expect(modifiedContext?.key).toBe('greeting');

      const afterContext: PluginContext = {
        locale: 'en',
        result: 'hello world',
        data: { transform: 'capitalize' },
      };

      const result = plugin.afterTranslate!(afterContext);
      expect(result).toBe('Hello world');
    });

    it('should transform to title case', () => {
      const beforeContext: PluginContext = {
        locale: 'en',
        key: 'greeting_title',
      };

      const modifiedContext = plugin.beforeTranslate!(beforeContext);
      expect(modifiedContext?.key).toBe('greeting');

      const afterContext: PluginContext = {
        locale: 'en',
        result: 'hello world from i18n',
        data: { transform: 'title' },
      };

      const result = plugin.afterTranslate!(afterContext);
      expect(result).toBe('Hello World From I18n');
    });
  });
});
