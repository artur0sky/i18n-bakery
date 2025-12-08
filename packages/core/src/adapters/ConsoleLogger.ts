
import { Logger } from '../domain/Logger';

export class ConsoleLogger implements Logger {
  constructor(private debugMode: boolean = false) {}

  debug(message: string, ...args: any[]): void {
    if (this.debugMode) {
      console.debug(`[i18n-bakery] [DEBUG] ${message}`, ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    console.info(`[i18n-bakery] [INFO] ${message}`, ...args);
  }

  warn(message: string, ...args: any[]): void {
    console.warn(`[i18n-bakery] [WARN] ${message}`, ...args);
  }

  error(message: string, ...args: any[]): void {
    console.error(`[i18n-bakery] [ERROR] ${message}`, ...args);
  }
}
