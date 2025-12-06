import { Formatter } from '../domain/types';

export class MustacheFormatter implements Formatter {
  interpolate(text: string, vars?: Record<string, any>): string {
    if (!vars) return text;
    
    return text.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
      const value = this.getValue(vars, path.trim());
      return value !== undefined && value !== null ? String(value) : `{{${path}}}`;
    });
  }

  private getValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
