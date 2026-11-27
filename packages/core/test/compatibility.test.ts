import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService } from '../src/use-cases/I18nService';
import { MemoryStore } from '../src/adapters/MemoryStore';

describe('i18next Compatibility', () => {
  const config = { locale: 'en', defaultNamespace: 'common' };
  let i18n: I18nService;

  beforeEach(() => {
    i18n = new I18nService(config);
    i18n.addTranslations('en', 'common', {
      welcome: 'Welcome {{name}}',
      'nested.var': 'Value is {{deep.value}}'
    });
    i18n.addTranslations('en', 'auth', {
      login: 'Log In'
    });
  });

  it('should support standard dot notation (ns.key) with defaultNamespace', () => {
    // With defaultNamespace='common', 'nested.var' uses common namespace
    expect(i18n.t('nested.var', undefined, { deep: { value: 42 } })).toBe('Value is 42');
  });

  it('should support i18next colon notation (ns:key)', () => {
    expect(i18n.t('auth:login')).toBe('Log In');
  });

  it('should support nested variables in interpolation', () => {
    expect(i18n.t('nested.var', undefined, { deep: { value: 42 } }))
      .toBe('Value is 42');
  });

  it('should support deep nested keys in dot notation', () => {
     // If we have ns='common', key='messages.error'
     i18n.addTranslations('en', 'common', {
         'messages.error': 'An error occurred'
     });
     // Accessing via common namespace with nested key
     expect(i18n.t('messages.error')).toBe('An error occurred');
  });

  it('stores prototype-named locales, namespaces and keys without polluting objects', () => {
    const store = new MemoryStore();
    store.set('__proto__', '__proto__', '__proto__', 'safe');
    expect(store.get('__proto__', '__proto__', '__proto__')).toBe('safe');
    expect(store.has('__proto__', '__proto__', '__proto__')).toBe(true);
    expect(({} as Record<string, unknown>).__proto__).toBe(Object.prototype);

    store.setNamespace('en', 'common', JSON.parse('{"nested":{"__proto__":{"value":"own"}}}'));
    expect(store.get('en', 'common', 'nested.__proto__.value')).toBe('own');
    expect(store.get('en', 'common', 'nested.constructor.name')).toBeUndefined();
  });

  it('does not pollute Object.prototype when saving a missing key', () => {
    const saver = { save: async () => {} };
    const service = new I18nService({ locale: 'en', saveMissing: true, saver });
    expect(service.t('__proto__:bakery_pollution_probe', 'safe')).toBe('safe');
    expect(({} as Record<string, unknown>).bakery_pollution_probe).toBeUndefined();
  });
});
