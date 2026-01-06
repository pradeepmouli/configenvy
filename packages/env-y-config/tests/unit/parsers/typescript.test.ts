/**
 * Unit tests for TypeScript parser
 */

import { describe, it, expect } from 'vitest';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { parseTypeScriptFile, listAvailableExports } from '../../../src/parsers/typescript.js';
import { Project } from 'ts-morph';

// Test fixtures directory
const fixturesDir = join(process.cwd(), 'tests', 'unit', 'parsers', '.fixtures');

// Setup and teardown
function setupFixture(filename: string, content: string): string {
  mkdirSync(fixturesDir, { recursive: true });
  const filePath = join(fixturesDir, filename);
  writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function teardownFixtures(): void {
  try {
    rmSync(fixturesDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup errors
  }
}

describe('TypeScript Parser', () => {
  describe('Simple interface parsing', () => {
    it('should parse a simple interface with basic types', async () => {
      const content = `
export interface Config {
  /** Database host */
  host: string;
  /** Database port */
  port: number;
  /** Enable debug mode */
  debug: boolean;
}
`;
      const filePath = setupFixture('simple.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields).toHaveLength(3);
      expect(result.fields[0]).toEqual({
        name: 'host',
        type: 'string',
        required: true,
        description: 'Database host'
      });
      expect(result.fields[1]).toEqual({
        name: 'port',
        type: 'number',
        required: true,
        description: 'Database port'
      });
      expect(result.fields[2]).toEqual({
        name: 'debug',
        type: 'boolean',
        required: true,
        description: 'Enable debug mode'
      });
      expect(result.metadata.format).toBe('typescript');
      expect(result.metadata.exportName).toBe('Config');

      teardownFixtures();
    });

    it('should handle optional fields', async () => {
      const content = `
export interface Config {
  required: string;
  optional?: string;
}
`;
      const filePath = setupFixture('optional.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields).toHaveLength(2);
      expect(result.fields[0].required).toBe(true);
      expect(result.fields[1].required).toBe(false);

      teardownFixtures();
    });

    it('should parse array types', async () => {
      const content = `
export interface Config {
  hosts: string[];
  ports: number[];
}
`;
      const filePath = setupFixture('arrays.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields).toHaveLength(2);
      expect(result.fields[0].type).toBe('array');
      expect(result.fields[1].type).toBe('array');

      teardownFixtures();
    });
  });

  describe('Nested object parsing', () => {
    it('should parse nested objects', async () => {
      const content = `
export interface Config {
  database: {
    host: string;
    port: number;
  };
  api: {
    timeout: number;
  };
}
`;
      const filePath = setupFixture('nested.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields).toHaveLength(2);
      expect(result.fields[0].type).toBe('object');
      expect(result.fields[0].nested).toHaveLength(2);
      expect(result.fields[0].nested?.[0]).toEqual({
        name: 'host',
        type: 'string',
        required: true,
        description: undefined
      });
      expect(result.fields[0].nested?.[1]).toEqual({
        name: 'port',
        type: 'number',
        required: true,
        description: undefined
      });

      teardownFixtures();
    });

    it('should parse deeply nested objects', async () => {
      const content = `
export interface Config {
  database: {
    primary: {
      host: string;
      port: number;
    };
  };
}
`;
      const filePath = setupFixture('deep-nested.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields[0].type).toBe('object');
      expect(result.fields[0].nested).toHaveLength(1);
      expect(result.fields[0].nested?.[0].type).toBe('object');
      expect(result.fields[0].nested?.[0].nested).toHaveLength(2);

      teardownFixtures();
    });
  });

  describe('Type alias parsing', () => {
    it('should parse type aliases', async () => {
      const content = `
export type Config = {
  host: string;
  port: number;
};
`;
      const filePath = setupFixture('type-alias.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields).toHaveLength(2);
      expect(result.fields[0].name).toBe('host');
      expect(result.fields[1].name).toBe('port');
      expect(result.metadata.exportName).toBe('Config');

      teardownFixtures();
    });
  });

  describe('JSDoc extraction', () => {
    it('should extract JSDoc comments', async () => {
      const content = `
export interface Config {
  /**
   * The database hostname
   */
  host: string;

  /** Port number for database connection */
  port: number;
}
`;
      const filePath = setupFixture('jsdoc.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields[0].description).toBe('The database hostname');
      expect(result.fields[1].description).toBe('Port number for database connection');

      teardownFixtures();
    });

    it('should handle missing JSDoc comments', async () => {
      const content = `
export interface Config {
  host: string;
  port: number;
}
`;
      const filePath = setupFixture('no-jsdoc.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields[0].description).toBeUndefined();
      expect(result.fields[1].description).toBeUndefined();

      teardownFixtures();
    });
  });

  describe('Union types', () => {
    it('should handle union types as strings', async () => {
      const content = `
export interface Config {
  mode: 'development' | 'production' | 'test';
  value: string | number;
}
`;
      const filePath = setupFixture('union.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Config');

      expect(result.fields[0].type).toBe('string');
      expect(result.fields[1].type).toBe('string');

      teardownFixtures();
    });
  });

  describe('Export detection', () => {
    it('should find the first exported interface when no name specified', async () => {
      const content = `
interface Internal {
  value: string;
}

export interface First {
  name: string;
}

export interface Second {
  age: number;
}
`;
      const filePath = setupFixture('multiple.ts', content);

      const result = await parseTypeScriptFile(filePath);

      expect(result.metadata.exportName).toBe('First');
      expect(result.fields).toHaveLength(1);
      expect(result.fields[0].name).toBe('name');

      teardownFixtures();
    });

    it('should list available exports', async () => {
      const content = `
export interface Config {
  name: string;
}

export type Settings = {
  value: number;
};

interface Internal {
  secret: string;
}
`;
      const filePath = setupFixture('list-exports.ts', content);

      const project = new Project();
      const sourceFile = project.addSourceFileAtPath(filePath);
      const exports = listAvailableExports(sourceFile);

      expect(exports).toHaveLength(2);
      expect(exports).toContain('Config (interface)');
      expect(exports).toContain('Settings (type)');

      teardownFixtures();
    });

    it('should throw error when export not found', async () => {
      const content = `
export interface Config {
  name: string;
}
`;
      const filePath = setupFixture('not-found.ts', content);

      await expect(
        parseTypeScriptFile(filePath, 'NonExistent')
      ).rejects.toThrow(/Failed to parse|NonExistent/);

      teardownFixtures();
    });

    it('should throw error when no exports found', async () => {
      const content = `
interface Internal {
  name: string;
}
`;
      const filePath = setupFixture('no-exports.ts', content);

      await expect(
        parseTypeScriptFile(filePath)
      ).rejects.toThrow(/Failed to parse|No exported/);

      teardownFixtures();
    });
  });

  describe('Edge cases', () => {
    it('should handle empty interfaces', async () => {
      const content = `
export interface Empty {}
`;
      const filePath = setupFixture('empty.ts', content);

      const result = await parseTypeScriptFile(filePath, 'Empty');

      expect(result.fields).toHaveLength(0);

      teardownFixtures();
    });

    it('should handle interfaces with only optional fields', async () => {
      const content = `
export interface OptionalOnly {
  field1?: string;
  field2?: number;
}
`;
      const filePath = setupFixture('all-optional.ts', content);

      const result = await parseTypeScriptFile(filePath, 'OptionalOnly');

      expect(result.fields).toHaveLength(2);
      expect(result.fields.every((f) => !f.required)).toBe(true);

      teardownFixtures();
    });
  });
});
