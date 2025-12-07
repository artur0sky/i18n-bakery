/**
 * 🥯 i18n-bakery - Variable Detection Tests
 * 
 * Comprehensive tests for the DefaultVariableDetector adapter.
 * Ensures correct variable detection and signature generation.
 */

import { describe, it, expect } from 'vitest';
import { DefaultVariableDetector } from '../src/adapters/DefaultVariableDetector';

describe('DefaultVariableDetector', () => {
  const detector = new DefaultVariableDetector();

  describe('detectVariables', () => {
    it('should detect variables from an object', () => {
      const vars = { meal: 'Pizza', price: 120 };
      const signature = detector.detectVariables(vars);
      
      // Should be sorted alphabetically
      expect(signature).toEqual(['meal', 'price']);
    });

    it('should sort variables alphabetically for consistent signatures', () => {
      const vars1 = { price: 120, meal: 'Pizza' };
      const vars2 = { meal: 'Tacos', price: 80 };
      
      const sig1 = detector.detectVariables(vars1);
      const sig2 = detector.detectVariables(vars2);
      
      // Both should have the same signature despite different order
      expect(sig1).toEqual(['meal', 'price']);
      expect(sig2).toEqual(['meal', 'price']);
      expect(sig1).toEqual(sig2);
    });

    it('should handle single variable', () => {
      const vars = { meal: 'Pizza' };
      const signature = detector.detectVariables(vars);
      
      expect(signature).toEqual(['meal']);
    });

    it('should handle many variables', () => {
      const vars = { 
        meal: 'Pizza',
        price: 120,
        quantity: 2,
        restaurant: 'Bella Italia',
        date: '2025-12-06'
      };
      const signature = detector.detectVariables(vars);
      
      expect(signature).toEqual(['date', 'meal', 'price', 'quantity', 'restaurant']);
    });

    it('should return empty array for undefined', () => {
      const signature = detector.detectVariables(undefined);
      expect(signature).toEqual([]);
    });

    it('should return empty array for null', () => {
      const signature = detector.detectVariables(null as any);
      expect(signature).toEqual([]);
    });

    it('should return empty array for empty object', () => {
      const signature = detector.detectVariables({});
      expect(signature).toEqual([]);
    });

    it('should ignore variable values, only extract keys', () => {
      const vars1 = { meal: 'Pizza', price: 120 };
      const vars2 = { meal: 'Tacos', price: 80 };
      
      const sig1 = detector.detectVariables(vars1);
      const sig2 = detector.detectVariables(vars2);
      
      // Signatures should be identical regardless of values
      expect(sig1).toEqual(sig2);
    });
  });

  describe('createSignatureKey', () => {
    it('should create signature key from variables', () => {
      const signature = ['meal', 'price'];
      const key = detector.createSignatureKey(signature);
      
      expect(key).toBe('meal_price');
    });

    it('should create signature key for single variable', () => {
      const signature = ['meal'];
      const key = detector.createSignatureKey(signature);
      
      expect(key).toBe('meal');
    });

    it('should create signature key for many variables', () => {
      const signature = ['date', 'meal', 'price', 'quantity'];
      const key = detector.createSignatureKey(signature);
      
      expect(key).toBe('date_meal_price_quantity');
    });

    it('should return "default" for empty signature', () => {
      const signature: string[] = [];
      const key = detector.createSignatureKey(signature);
      
      expect(key).toBe('default');
    });

    it('should handle signatures with underscores in variable names', () => {
      const signature = ['meal_name', 'total_price'];
      const key = detector.createSignatureKey(signature);
      
      expect(key).toBe('meal_name_total_price');
    });
  });

  describe('generateDefaultValue', () => {
    it('should generate default value with variables-only template', () => {
      const signature = ['meal', 'price'];
      const value = detector.generateDefaultValue(signature, 'variables-only');
      
      expect(value).toBe('{{meal}} {{price}}');
    });

    it('should generate default value for single variable', () => {
      const signature = ['meal'];
      const value = detector.generateDefaultValue(signature, 'variables-only');
      
      expect(value).toBe('{{meal}}');
    });

    it('should generate default value for many variables', () => {
      const signature = ['meal', 'price', 'quantity'];
      const value = detector.generateDefaultValue(signature, 'variables-only');
      
      expect(value).toBe('{{meal}} {{price}} {{quantity}}');
    });

    it('should return empty string for empty template', () => {
      const signature = ['meal', 'price'];
      const value = detector.generateDefaultValue(signature, 'empty');
      
      expect(value).toBe('');
    });

    it('should return empty string for empty signature', () => {
      const signature: string[] = [];
      const value = detector.generateDefaultValue(signature, 'variables-only');
      
      expect(value).toBe('');
    });

    it('should use config default template when not specified', () => {
      const detector1 = new DefaultVariableDetector({ defaultTemplate: 'variables-only' });
      const detector2 = new DefaultVariableDetector({ defaultTemplate: 'empty' });
      
      const signature = ['meal'];
      
      expect(detector1.generateDefaultValue(signature)).toBe('{{meal}}');
      expect(detector2.generateDefaultValue(signature)).toBe('');
    });
  });

  describe('integration - full workflow', () => {
    it('should handle complete variable detection workflow', () => {
      const vars = { price: 120, meal: 'Pizza' };
      
      // Step 1: Detect variables
      const signature = detector.detectVariables(vars);
      expect(signature).toEqual(['meal', 'price']);
      
      // Step 2: Create signature key
      const signatureKey = detector.createSignatureKey(signature);
      expect(signatureKey).toBe('meal_price');
      
      // Step 3: Generate default value
      const defaultValue = detector.generateDefaultValue(signature);
      expect(defaultValue).toBe('{{meal}} {{price}}');
    });

    it('should handle different variable sets for same key', () => {
      // First call: only meal
      const vars1 = { meal: 'Pizza' };
      const sig1 = detector.detectVariables(vars1);
      const key1 = detector.createSignatureKey(sig1);
      const val1 = detector.generateDefaultValue(sig1);
      
      expect(key1).toBe('meal');
      expect(val1).toBe('{{meal}}');
      
      // Second call: meal and price
      const vars2 = { meal: 'Pizza', price: 120 };
      const sig2 = detector.detectVariables(vars2);
      const key2 = detector.createSignatureKey(sig2);
      const val2 = detector.generateDefaultValue(sig2);
      
      expect(key2).toBe('meal_price');
      expect(val2).toBe('{{meal}} {{price}}');
      
      // Keys should be different
      expect(key1).not.toBe(key2);
    });
  });

  describe('configuration', () => {
    it('should respect autoGenerate config', () => {
      const detector1 = new DefaultVariableDetector({ autoGenerate: true });
      const detector2 = new DefaultVariableDetector({ autoGenerate: false });
      
      // Both should work the same for detection (config affects I18nService behavior)
      const vars = { meal: 'Pizza' };
      expect(detector1.detectVariables(vars)).toEqual(['meal']);
      expect(detector2.detectVariables(vars)).toEqual(['meal']);
    });

    it('should respect enableVariants config', () => {
      const detector1 = new DefaultVariableDetector({ enableVariants: true });
      const detector2 = new DefaultVariableDetector({ enableVariants: false });
      
      // Both should work the same for detection (config affects I18nService behavior)
      const vars = { meal: 'Pizza' };
      expect(detector1.detectVariables(vars)).toEqual(['meal']);
      expect(detector2.detectVariables(vars)).toEqual(['meal']);
    });
  });
});
