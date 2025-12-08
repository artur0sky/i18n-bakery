
import chalk from 'chalk';

export class CliLogger {
  private verboseMode: boolean = false;

  constructor(verbose: boolean = false) {
    this.verboseMode = verbose;
  }

  setVerbose(verbose: boolean) {
    this.verboseMode = verbose;
  }

  info(message: string) {
    console.log(message);
  }

  success(message: string) {
    console.log(chalk.green(message));
  }

  warn(message: string) {
    console.warn(chalk.yellow(message));
  }

  error(message: string, error?: any) {
    console.error(chalk.red(message));
    if (error) {
      if (error instanceof Error) {
        console.error(chalk.red(error.message));
        if (this.verboseMode) {
          console.error(chalk.gray(error.stack));
        }
      } else {
        console.error(chalk.red(String(error)));
      }
    }
  }

  debug(message: string) {
    if (this.verboseMode) {
      console.log(chalk.gray(`[DEBUG] ${message}`));
    }
  }
  
  section(title: string) {
    console.log(chalk.blue(`\n${title}`));
  }

  gray(message: string) {
    console.log(chalk.gray(message));
  }
  
  cyan(message: string) {
    console.log(chalk.cyan(message));
  }
  
  magenta(message: string) {
    console.log(chalk.magenta(message));
  }
}

export const logger = new CliLogger();
