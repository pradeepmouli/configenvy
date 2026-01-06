/**
 * Unit tests for sample value generator
 */

import { describe, it, expect } from 'vitest';
import { generateSampleValue, generateSampleValues, generatePlaceholderWithKeywords } from '../../../src/generators/sample-values.js';
import type { SchemaField } from '../../../src/types.js';

describe('Sample Value Generator', () => {
  describe('Basic type sample generation', () => {
    it('should generate placeholder for string types', () => {
      const field: SchemaField = {
        name: 'api_key',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toMatch(/^<[A-Z_]*>$/);
      expect(sample).toContain('KEY');
    });

    it('should generate sample for number types', () => {
      const field: SchemaField = {
        name: 'count',
        type: 'number',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('42');
    });

    it('should generate sample for boolean types', () => {
      const field: SchemaField = {
        name: 'enabled',
        type: 'boolean',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('true');
    });

    it('should generate sample for array types', () => {
      const field: SchemaField = {
        name: 'hosts',
        type: 'array',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain(',');
      expect(sample).toMatch(/^<.*>,<.*>$/);
    });

    it('should generate placeholder for object types', () => {
      const field: SchemaField = {
        name: 'config',
        type: 'object',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('<NESTED_OBJECT>');
    });
  });

  describe('Semantic keyword extraction', () => {
    it('should recognize database host pattern', () => {
      const field: SchemaField = {
        name: 'database_host',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('HOST');
    });

    it('should recognize database port pattern', () => {
      const field: SchemaField = {
        name: 'db_port',
        type: 'number',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('5432');
    });

    it('should recognize API key pattern', () => {
      const field: SchemaField = {
        name: 'api_key',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('KEY');
    });

    it('should recognize password pattern', () => {
      const field: SchemaField = {
        name: 'db_password',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('PASSWORD');
    });

    it('should recognize token pattern', () => {
      const field: SchemaField = {
        name: 'auth_token',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('TOKEN');
    });

    it('should recognize secret pattern', () => {
      const field: SchemaField = {
        name: 'jwt_secret',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('SECRET');
    });

    it('should recognize URL pattern', () => {
      const field: SchemaField = {
        name: 'api_url',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('URL');
    });

    it('should recognize timeout pattern for numbers', () => {
      const field: SchemaField = {
        name: 'request_timeout',
        type: 'number',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('30000');
    });

    it('should recognize limit pattern for numbers', () => {
      const field: SchemaField = {
        name: 'max_retries',
        type: 'number',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('100');
    });

    it('should use description hints', () => {
      const field: SchemaField = {
        name: 'secret',
        type: 'string',
        required: true,
        description: 'JWT secret key for signing tokens'
      };

      const sample = generateSampleValue(field);

      expect(sample).toContain('SECRET');
    });
  });

  describe('Batch value generation', () => {
    it('should generate values for multiple fields', () => {
      const fields: SchemaField[] = [
        { name: 'host', type: 'string', required: true },
        { name: 'port', type: 'number', required: true },
        { name: 'debug', type: 'boolean', required: true }
      ];

      const samples = generateSampleValues(fields);

      expect(Object.keys(samples)).toHaveLength(3);
      expect(samples.host).toMatch(/^</);
      expect(samples.port).toBe('5432');
      expect(samples.debug).toBe('true');
    });

    it('should handle nested fields', () => {
      const fields: SchemaField[] = [
        {
          name: 'database',
          type: 'object',
          required: true,
          nested: [
            { name: 'host', type: 'string', required: true },
            { name: 'port', type: 'number', required: true }
          ]
        }
      ];

      const samples = generateSampleValues(fields);

      expect(samples.database_host).toBeDefined();
      expect(samples.database_port).toBe('5432');
    });

    it('should handle deeply nested fields', () => {
      const fields: SchemaField[] = [
        {
          name: 'server',
          type: 'object',
          required: true,
          nested: [
            {
              name: 'database',
              type: 'object',
              required: true,
              nested: [
                { name: 'host', type: 'string', required: true },
                { name: 'port', type: 'number', required: true }
              ]
            }
          ]
        }
      ];

      const samples = generateSampleValues(fields);

      expect(samples.server_database_host).toBeDefined();
      expect(samples.server_database_port).toBe('5432');
    });

    it('should handle arrays in nested structure', () => {
      const fields: SchemaField[] = [
        {
          name: 'hosts',
          type: 'array',
          required: true
        },
        {
          name: 'config',
          type: 'object',
          required: true,
          nested: [
            { name: 'ports', type: 'array', required: true }
          ]
        }
      ];

      const samples = generateSampleValues(fields);

      expect(samples.hosts).toContain(',');
      expect(samples.config_ports).toContain(',');
    });
  });

  describe('Placeholder generation with keywords', () => {
    it('should extract keywords from field name', () => {
      const placeholder = generatePlaceholderWithKeywords('database_host');

      expect(placeholder).toContain('HOST');
    });

    it('should extract keywords from description', () => {
      const placeholder = generatePlaceholderWithKeywords('secret', 'The API key for authentication');

      expect(placeholder).toContain('KEY');
    });

    it('should prefer field name keywords over description', () => {
      const placeholder = generatePlaceholderWithKeywords('api_host', 'The database URL');

      expect(placeholder).toContain('HOST');
    });

    it('should return generic placeholder for unknown fields', () => {
      const placeholder = generatePlaceholderWithKeywords('unknown_field');

      expect(placeholder).toBe('<YOUR_VALUE>');
    });
  });

  describe('Edge cases', () => {
    it('should handle fields with no description', () => {
      const field: SchemaField = {
        name: 'field',
        type: 'string',
        required: true
      };

      const sample = generateSampleValue(field);

      expect(sample).toBe('<YOUR_VALUE>');
    });

    it('should handle empty array', () => {
      const fields: SchemaField[] = [];

      const samples = generateSampleValues(fields);

      expect(Object.keys(samples)).toHaveLength(0);
    });

    it('should handle complex real-world config', () => {
      const fields: SchemaField[] = [
        { name: 'app_name', type: 'string', required: true },
        { name: 'app_port', type: 'number', required: true },
        { name: 'app_debug', type: 'boolean', required: true },
        {
          name: 'database',
          type: 'object',
          required: true,
          nested: [
            { name: 'host', type: 'string', required: true, description: 'Database server hostname' },
            { name: 'port', type: 'number', required: true },
            { name: 'username', type: 'string', required: true },
            { name: 'password', type: 'string', required: true }
          ]
        },
        {
          name: 'api',
          type: 'object',
          required: true,
          nested: [
            { name: 'url', type: 'string', required: true },
            { name: 'key', type: 'string', required: true },
            { name: 'timeout', type: 'number', required: true }
          ]
        }
      ];

      const samples = generateSampleValues(fields);

      expect(samples.app_name).toBeDefined();
      expect(samples.database_host).toBeDefined();
      expect(samples.database_port).toBe('5432');
      expect(samples.database_password).toContain('PASSWORD');
      expect(samples.api_url).toContain('URL');
      expect(samples.api_key).toContain('KEY');
      expect(samples.api_timeout).toBe('30000');
    });
  });
});
