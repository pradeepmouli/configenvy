/**
 * Sample fixtures for env-y-config tests
 * @module tests/fixtures
 */

/**
 * Simple Zod schema for testing
 */
export const simpleZodSchema = `
import { z } from 'zod';

export const config = z.object({
  database: z.object({
    host: z.string().describe('Database host'),
    port: z.number().default(5432),
    ssl: z.boolean().default(false)
  }),
  api: z.object({
    timeout: z.number().describe('Request timeout in seconds'),
    retries: z.number().default(3)
  })
});
`;

/**
 * Simple JSON Schema for testing
 */
export const simpleJsonSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    database: {
      type: 'object',
      properties: {
        host: {
          type: 'string',
          description: 'Database host'
        },
        port: {
          type: 'number',
          default: 5432
        }
      },
      required: ['host']
    },
    api: {
      type: 'object',
      properties: {
        timeout: {
          type: 'number',
          description: 'Request timeout'
        }
      }
    }
  }
};

/**
 * Simple JSON object for testing
 */
export const simpleJsonObject = {
  database: {
    host: 'localhost',
    port: 5432
  },
  api: {
    timeout: 30
  }
};

/**
 * TypeScript interface for testing
 */
export const simpleTypescriptInterface = `
export interface AppConfig {
  /** Database host */
  host: string;
  /** Database port */
  port: number;
  /** Enable debug mode */
  debug?: boolean;
}
`;

/**
 * Expected .env output for simple schemas
 */
export const expectedEnvOutput = `# Database host
DATABASE_HOST=localhost

# Database port
DATABASE_PORT=5432

# Enable SSL connection
DATABASE_SSL=false

# Request timeout in seconds
API_TIMEOUT=30

# API retries
API_RETRIES=3`;

/**
 * Complex Zod schema with nested objects
 */
export const complexZodSchema = `
import { z } from 'zod';

export const config = z.object({
  app: z.object({
    name: z.string().describe('Application name'),
    version: z.string(),
    features: z.array(z.string()).describe('Enabled features')
  }),
  database: z.object({
    primary: z.object({
      host: z.string(),
      port: z.number(),
      credentials: z.object({
        username: z.string(),
        password: z.string().describe('Database password')
      })
    }),
    replica: z.object({
      host: z.string(),
      port: z.number()
    }).optional()
  }),
  cache: z.object({
    redis: z.object({
      url: z.string().describe('Redis connection URL'),
      ttl: z.number().default(3600)
    })
  })
});
`;
