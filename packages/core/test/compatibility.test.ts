import { describe, it, expect, beforeEach } from 'vitest';
import { I18nService } from '../src/use-cases/I18nService';
import { MemoryStore } from '../src/adapters/MemoryStore';

describe('i18next Compatibility', () => {
  const config = { locale: 'en' };
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

  it('should support standard dot notation (ns.key)', () => {
    expect(i18n.t('auth.login')).toBe('Log In');
  });

  it('should support i18next colon notation (ns:key)', () => {
    expect(i18n.t('auth:login')).toBe('Log In');
  });

  it('should support nested variables in interpolation', () => {
    expect(i18n.t('common.nested.var', undefined, { deep: { value: 42 } }))
      .toBe('Value is 42');
  });

  it('should support deep nested keys in dot notation', () => {
     // If we have ns='common', key='messages.error'
     i18n.addTranslations('en', 'common', {
         'messages.error': 'An error occurred'
     });
     // Accessing via common.messages.error
     expect(i18n.t('common.messages.error')).toBe('An error occurred');
  });
});
