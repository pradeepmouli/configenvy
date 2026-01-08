import { describe, it, expect } from 'vitest';
import * as objectenvy from './index.js';

describe('Module exports', () => {
  it('exports all main functions', () => {
    expect(objectenvy.objectEnvy).toBeDefined();
    expect(objectenvy.config).toBeDefined();
    expect(objectenvy.createObjectEnvy).toBeDefined();
    expect(objectenvy.createConfig).toBeDefined();
    expect(objectenvy.applyDefaults).toBeDefined();
    expect(objectenvy.merge).toBeDefined();
    expect(objectenvy.toCamelCase).toBeDefined();
    expect(objectenvy.toSnakeCase).toBeDefined();
    expect(objectenvy.coerceValue).toBeDefined();
  });

  it('maintains backward compatibility with aliases', () => {
    // New names map to config and createConfig
    expect(objectenvy.objectEnvy).toBe(objectenvy.config);
    expect(objectenvy.createObjectEnvy).toBe(objectenvy.createConfig);
  });
});

describe('Example test suite', () => {
  it('should pass a basic test', () => {
    expect(true).toBe(true);
  });

  it('should perform arithmetic correctly', () => {
    expect(2 + 2).toBe(4);
  });
});
