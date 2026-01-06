/**
 * Test utilities and helpers for env-y-config
 * @module tests/test-helpers
 */

import type { SchemaField, ParsedSchema, EnvGeneratorOptions } from '../src/types.js';

/**
 * Create a mock SchemaField for testing
 */
export function createMockField(overrides?: Partial<SchemaField>): SchemaField {
  return {
    name: 'testField',
    type: 'string',
    required: true,
    description: 'Test field',
    ...overrides
  };
}

/**
 * Create a mock ParsedSchema for testing
 */
export function createMockParsedSchema(
  fields?: SchemaField[],
  overrides?: Partial<ParsedSchema['metadata']>
): ParsedSchema {
  return {
    fields: fields || [createMockField()],
    metadata: {
      format: 'json',
      fileName: 'test.json',
      ...overrides
    }
  };
}

/**
 * Create default generator options
 */
export function createDefaultOptions(): EnvGeneratorOptions {
  return {
    comments: true,
    requiredOnly: false
  };
}

/**
 * Create custom generator options
 */
export function createOptions(overrides?: Partial<EnvGeneratorOptions>): EnvGeneratorOptions {
  return {
    ...createDefaultOptions(),
    ...overrides
  };
}

/**
 * Assert error message contains expected text
 */
export function assertErrorContains(error: unknown, expectedText: string): void {
  const message = error instanceof Error ? error.message : String(error);
  if (!message.includes(expectedText)) {
    throw new Error(`Expected error to contain "${expectedText}", got: ${message}`);
  }
}

/**
 * Wait for async operation (useful in tests)
 */
export async function wait(ms: number = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
