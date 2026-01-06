/**
 * Unit tests for JSON parser
 */

import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { parseJsonFile } from '../../../src/parsers/json.js';

// Test fixtures directory
const fixturesDir = join(process.cwd(), 'tests', 'unit', 'parsers', '.fixtures', 'json');

// Setup and teardown
function setupFixture(filename: string, content: string): string {
  mkdirSync(fixturesDir, { recursive: true });
  const filePath = join(fixturesDir, filename);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function teardownFixtures(): void {
  try {
    rmSync(join(process.cwd(), 'tests', 'unit', 'parsers', '.fixtures'), {
      recursive: true,
      force: true
    });
  } catch {
    // Ignore cleanup errors
  }
}

describe('JSON Parser', () => {
  describe('Simple object parsing', () => {
    it('should parse a simple flat JSON object with basic types', async () => {
      const content = JSON.stringify({
        host: 'localhost',
        port: 5432,
        debug: false
      });
      const filePath = setupFixture('simple.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(3);
      expect(result.fields[0]).toEqual({
        name: 'host',
        type: 'string',
        required: true
      });
      expect(result.fields[1]).toEqual({
        name: 'port',
        type: 'number',
        required: true
      });
      expect(result.fields[2]).toEqual({
        name: 'debug',
        type: 'boolean',
        required: true
      });
      expect(result.metadata.format).toBe('json');

      teardownFixtures();
    });

    it('should infer string type for string values', async () => {
      const content = JSON.stringify({
        name: 'John',
        email: 'john@example.com'
      });
      const filePath = setupFixture('strings.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(2);
      expect(result.fields.every((f) => f.type === 'string')).toBe(true);

      teardownFixtures();
    });

    it('should infer number type for numeric values', async () => {
      const content = JSON.stringify({
        age: 30,
        port: 5432,
        timeout: 3000
      });
      const filePath = setupFixture('numbers.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(3);
      expect(result.fields.every((f) => f.type === 'number')).toBe(true);

      teardownFixtures();
    });

    it('should infer boolean type for boolean values', async () => {
      const content = JSON.stringify({
        debug: true,
        enabled: false,
        production: false
      });
      const filePath = setupFixture('booleans.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(3);
      expect(result.fields.every((f) => f.type === 'boolean')).toBe(true);

      teardownFixtures();
    });
  });

  describe('Array type handling', () => {
    it('should detect array types', async () => {
      const content = JSON.stringify({
        hosts: ['localhost', '127.0.0.1'],
        ports: [5432, 3306],
        flags: [true, false]
      });
      const filePath = setupFixture('arrays.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(3);
      expect(result.fields.every((f) => f.type === 'array')).toBe(true);

      teardownFixtures();
    });

    it('should handle empty arrays', async () => {
      const content = JSON.stringify({
        items: [],
        names: []
      });
      const filePath = setupFixture('empty-arrays.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(2);
      expect(result.fields.every((f) => f.type === 'array')).toBe(true);

      teardownFixtures();
    });
  });

  describe('Nested object parsing', () => {
    it('should parse nested objects', async () => {
      const content = JSON.stringify({
        database: {
          host: 'localhost',
          port: 5432,
          credentials: {
            username: 'admin',
            password: 'secret'
          }
        },
        api: {
          timeout: 30000
        }
      });
      const filePath = setupFixture('nested.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(2);
      expect(result.fields[0].type).toBe('object');
      expect(result.fields[0].nested).toHaveLength(3);
      expect(result.fields[0].nested?.[0]).toEqual({
        name: 'host',
        type: 'string',
        required: true
      });

      // Check deeply nested
      const credentials = result.fields[0].nested?.find((f) => f.name === 'credentials');
      expect(credentials?.type).toBe('object');
      expect(credentials?.nested).toHaveLength(2);

      teardownFixtures();
    });

    it('should handle mixed nested structures', async () => {
      const content = JSON.stringify({
        config: {
          servers: [
            { host: 'localhost', port: 5432 },
            { host: '127.0.0.1', port: 3306 }
          ],
          options: {
            timeout: 30000,
            retries: 3
          }
        }
      });
      const filePath = setupFixture('mixed-nested.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields[0].type).toBe('object');
      expect(result.fields[0].nested).toBeDefined();

      teardownFixtures();
    });
  });

  describe('Null and undefined handling', () => {
    it('should treat null as string type', async () => {
      const content = JSON.stringify({
        field1: null,
        field2: 'value'
      });
      const filePath = setupFixture('nulls.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields[0].type).toBe('string'); // null defaults to string
      expect(result.fields[1].type).toBe('string');

      teardownFixtures();
    });
  });

  describe('Error handling', () => {
    it('should throw error for invalid JSON', async () => {
      const content = '{ invalid json }';
      const filePath = setupFixture('invalid.json', content);

      await expect(parseJsonFile(filePath)).rejects.toThrow(/Invalid JSON/);

      teardownFixtures();
    });

    it('should throw error for JSON array at root', async () => {
      const content = JSON.stringify(['item1', 'item2']);
      const filePath = setupFixture('array-root.json', content);

      await expect(parseJsonFile(filePath)).rejects.toThrow(
        /Root JSON value must be an object/
      );

      teardownFixtures();
    });

    it('should throw error for primitive value at root', async () => {
      const content = JSON.stringify('string');
      const filePath = setupFixture('string-root.json', content);

      await expect(parseJsonFile(filePath)).rejects.toThrow(
        /Root JSON value must be an object/
      );

      teardownFixtures();
    });

    it('should throw error for non-existent file', async () => {
      const filePath = join(fixturesDir, 'non-existent.json');

      await expect(parseJsonFile(filePath)).rejects.toThrow();

      teardownFixtures();
    });
  });

  describe('Complex structures', () => {
    it('should handle real-world config structure', async () => {
      const content = JSON.stringify({
        server: {
          host: 'localhost',
          port: 3000,
          ssl: true
        },
        database: {
          url: 'postgresql://localhost/db',
          pool: {
            min: 2,
            max: 10
          }
        },
        logging: {
          level: 'info',
          transports: ['console', 'file']
        }
      });
      const filePath = setupFixture('config.json', content);

      const result = await parseJsonFile(filePath);

      expect(result.fields).toHaveLength(3);
      expect(result.fields.map((f) => f.name)).toEqual(['server', 'database', 'logging']);

      // All top-level fields are objects
      expect(result.fields.every((f) => f.type === 'object')).toBe(true);

      teardownFixtures();
    });
  });
});
