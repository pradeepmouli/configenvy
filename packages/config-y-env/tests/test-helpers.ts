/**
 * Test utilities and helpers for config-y-env
 * @module tests/test-helpers
 */

import type { EnvVariable, ParsedEnv, TypeGeneratorOptions, FieldInfo } from '../src/types.js';

/**
 * Create a mock EnvVariable for testing
 */
export function createMockVariable(overrides?: Partial<EnvVariable>): EnvVariable {
  return {
    key: 'TEST_VAR',
    value: 'test-value',
    inferredType: 'string',
    isOptional: false,
    ...overrides
  };
}

/**
 * Create a mock ParsedEnv for testing
 */
export function createMockParsedEnv(
  variables?: EnvVariable[],
  fileName: string = 'test.env'
): ParsedEnv {
  return {
    variables: variables || [createMockVariable()],
    metadata: {
      fileName,
      variableCount: variables?.length || 1
    }
  };
}

/**
 * Create default generator options
 */
export function createDefaultOptions(): TypeGeneratorOptions {
  return {
    outputFormat: 'typescript',
    interfaceName: 'Config',
    inferenceMode: 'strict',
    withComments: true,
    zodSchema: false
  };
}

/**
 * Create custom generator options
 */
export function createOptions(overrides?: Partial<TypeGeneratorOptions>): TypeGeneratorOptions {
  return {
    ...createDefaultOptions(),
    ...overrides
  };
}

/**
 * Create a field info object
 */
export function createFieldInfo(overrides?: Partial<FieldInfo>): FieldInfo {
  return {
    type: 'string',
    optional: false,
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
