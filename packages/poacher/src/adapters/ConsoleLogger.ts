import { Logger as ICoreLogger } from '@i18n-bakery/core';
import { ILogger } from '../domain/Interfaces';
import chalk from 'chalk';

// We implement both our local ILogger (which has success) and Core Logger (standard)
// ideally we should just use ILogger extending CoreLogger.
export class ConsoleLogger implements ILogger, ICoreLogger {
    constructor(private debugMode: boolean = false) {}

    debug(message: string, ...args: any[]): void {
        if (this.debugMode) {
            console.log(chalk.gray('🐛'), message, ...args);
        }
    }

    info(message: string, ...args: any[]): void {
        console.log(chalk.blue('ℹ'), message, ...args);
    }

    warn(message: string, ...args: any[]): void {
        console.log(chalk.yellow('⚠'), message, ...args);
    }

    error(message: string, ...args: any[]): void {
        console.error(chalk.red('✖'), message, ...args);
    }

    success(message: string): void {
        console.log(chalk.green('✔'), message);
    }
}
