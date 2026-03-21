import { Formatter } from '../domain/types';

export class MustacheFormatter implements Formatter {
  interpolate(text: string, vars?: Record<string, any>): string {
    if (!vars) return text;
    
    return text.replace(/\{\{([^}]+)\}\}/g, (_, path) => {
      const value = this.getValue(vars, path.trim());
      if (value === undefined || value === null) {
        return `{{${path}}}`;
      }
      // Security: Escape HTML to prevent XSS
      return this.escapeHtml(String(value));
    });
  }

  private escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  private getValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }
}
