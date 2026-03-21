/**
 * 🥯 i18n-bakery/tray - SilentLogger (Adapter Layer)
 *
 * A no-op Logger implementation that satisfies @i18n-bakery/core's Logger interface
 * without producing console output. Used in an MCP context where structured JSON
 * responses replace human-readable terminal logs.
 *
 * LSP: A drop-in replacement for ConsoleLogger in any context expecting Logger.
 *
 * @module adapters/SilentLogger
 */

import type { Logger } from '@i18n-bakery/core';

/**
 * Silent logger that collects messages without printing them.
 * Useful for capturing log output from BakingManager in a structured way.
 */
export class SilentLogger implements Logger {
  private readonly _messages: Array<{ level: string; message: string }> = [];

  debug(message: string): void {
    this._messages.push({ level: 'debug', message });
  }

  info(message: string): void {
    this._messages.push({ level: 'info', message });
  }

  warn(message: string): void {
    this._messages.push({ level: 'warn', message });
  }

  error(message: string): void {
    this._messages.push({ level: 'error', message });
  }

  /** Returns all collected log messages, useful for debugging after the fact. */
  getMessages(): ReadonlyArray<{ level: string; message: string }> {
    return this._messages;
  }
}
