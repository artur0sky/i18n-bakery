import { describe, it, expect, beforeEach } from 'vitest';
import { initI18n, t, addTranslations, setLocale } from '../src/index';

describe('i18n-bakery core', () => {
  beforeEach(() => {
    // Reset state if needed, but for now we just re-init
    initI18n({
      locale: 'en',
      fallbackLocale: 'es',
    });
  });

  it('should translate simple keys', () => {
    addTranslations('en', 'common', { hello: 'Hello World' });
    expect(t('common.hello')).toBe('Hello World');
  });

  it('should use fallback locale', () => {
    addTranslations('es', 'common', { hello: 'Hola Mundo' });
    // 'en' does not have 'hello'
    expect(t('common.hello')).toBe('Hola Mundo');
  });

  it('should return default text if key missing', () => {
    expect(t('common.missing', 'Default Text')).toBe('Default Text');
  });

  it('should return key if no default text', () => {
    expect(t('common.missing')).toBe('common.missing');
  });

  it('should interpolate variables', () => {
    addTranslations('en', 'common', { welcome: 'Welcome {{name}}' });
    expect(t('common.welcome', '', { name: 'Arturo' })).toBe('Welcome Arturo');
  });

  it('should handle nested keys', () => {
    addTranslations('en', 'home', { title: 'Home Page' });
    expect(t('home.title')).toBe('Home Page');
  });
  
  it('should handle deep object interpolation', () => {
      addTranslations('en', 'profile', { user: 'User: {{user.details.name}}' });
      expect(t('profile.user', '', { user: { details: { name: 'John' } } })).toBe('User: John');
  });
});
