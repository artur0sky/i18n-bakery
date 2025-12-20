
import { describe, it, expect, vi } from 'vitest';
import path from 'path';
import { ScoutRecipes } from '../../src/use-cases/ScoutRecipes';
import { ConsoleLogger } from '../../src/adapters/ConsoleLogger';

const SOURCE_DIR = path.join(__dirname, '../fixtures/complex-project/src');

describe('ScoutRecipes', () => {
    it('should detect keys using BabelKeyExtractor', async () => {
        // Mock logger to verify output or just use it silently
        const logger = new ConsoleLogger();
        const spy = vi.spyOn(logger, 'info');

        const scout = new ScoutRecipes(logger);
        await scout.execute(SOURCE_DIR);

        // Verify keys found
        // "welcome", "auth:title", "auth:submit", "missing.key"
        
        // Since execute checks void and logs, we spy on logs or we refactor Scout to return result.
        // For CLI tools usually returning result is better for testing.
        // But checking logs is enough for void command.
        
        // Assertions on spy calls (checking if keys were logged)
        const calls = spy.mock.calls.map(c => c[0]); // First arg message
        const combined = calls.join('\n');
        
        expect(combined).toContain('welcome');
        expect(combined).toContain('auth:title');
        expect(combined).toContain('auth:submit');
        expect(combined).toContain('default: "Submit Default"');
        expect(combined).toContain('missing.key');
        expect(combined).toContain('default: "This is a default value"');
    });
});
