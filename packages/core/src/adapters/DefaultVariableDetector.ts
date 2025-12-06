/**
 * 🥯 i18n-bakery - Default Variable Detector (Adapter Layer)
 * 
 * Concrete implementation of the VariableDetector interface.
 * Detects variables from translation calls and creates signatures.
 * 
 * @module adapters/DefaultVariableDetector
 */

import { VariableDetector, VariableSignature, VariableDetectorConfig } from '../domain/VariableDetection';

/**
 * Default implementation of the VariableDetector interface.
 * 
 * This adapter implements the variable detection strategy defined in Phase 8:
 * - Extracts variable names from objects
 * - Creates sorted signatures for consistent identification
 * - Generates default translation templates
 * 
 * @example
 * const detector = new DefaultVariableDetector();
 * const signature = detector.detectVariables({ meal: "Pizza", price: 120 });
 * // ["meal", "price"]
 */
export class DefaultVariableDetector implements VariableDetector {
  private config: Required<VariableDetectorConfig>;

  constructor(config: VariableDetectorConfig = {}) {
    this.config = {
      autoGenerate: config.autoGenerate ?? true,
      enableVariants: config.enableVariants ?? true,
      defaultTemplate: config.defaultTemplate || 'variables-only',
    };
  }

  /**
   * Detects variables from a variables object and creates a signature.
   * 
   * The signature is a sorted array of variable names to ensure
   * consistent identification regardless of object key order.
   * 
   * @param vars - The variables object passed to t()
   * @returns Sorted array of variable names (signature)
   */
  detectVariables(vars?: Record<string, any>): VariableSignature {
    if (!vars || typeof vars !== 'object') {
      return [];
    }

    // Extract keys and sort them for consistent signatures
    const keys = Object.keys(vars);
    return keys.sort();
  }

  /**
   * Creates a signature key from a variable signature.
   * 
   * The signature key is used to identify variants in storage.
   * Format: variable names joined by underscore.
   * 
   * @param signature - The variable signature
   * @returns String key (e.g., "meal_price")
   */
  createSignatureKey(signature: VariableSignature): string {
    if (!signature || signature.length === 0) {
      return 'default';
    }
    
    return signature.join('_');
  }

  /**
   * Generates a default translation value based on variables.
   * 
   * Supports two template styles:
   * - 'variables-only': Creates "{{var1}} {{var2}}" format
   * - 'empty': Returns empty string
   * 
   * @param signature - The variable signature
   * @param template - Template style to use
   * @returns Generated translation value
   */
  generateDefaultValue(
    signature: VariableSignature,
    template: 'variables-only' | 'empty' = this.config.defaultTemplate
  ): string {
    if (template === 'empty') {
      return '';
    }

    // 'variables-only' template
    if (!signature || signature.length === 0) {
      return '';
    }

    return signature.map(varName => `{{${varName}}}`).join(' ');
  }
}
