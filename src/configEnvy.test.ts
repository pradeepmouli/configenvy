import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { configEnvy, createConfigEnvy } from './configEnvy.js';

describe('configEnvy', () => {
  describe('basic mapping', () => {
    it('maps simple env vars to flat config', () => {
      const env = {
        PORT: '3000',
        DEBUG: 'true'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        port: 3000,
        debug: true
      });
    });

    it('maps SNAKE_CASE to nested camelCase structure', () => {
      const env = {
        PORT_NUMBER: '1234'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        port: { number: 1234 }
      });
    });

    it('groups related env vars into nested objects', () => {
      const env = {
        LOG_LEVEL: 'debug',
        LOG_PATH: '/var/log'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        log: {
          level: 'debug',
          path: '/var/log'
        }
      });
    });

    it('handles deeply nested structures', () => {
      const env = {
        DATABASE_CONNECTION_HOST: 'localhost',
        DATABASE_CONNECTION_PORT: '5432',
        DATABASE_CONNECTION_NAME: 'mydb'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        database: {
          connection: {
            host: 'localhost',
            port: 5432,
            name: 'mydb'
          }
        }
      });
    });
  });

  describe('type coercion', () => {
    it('coerces numbers', () => {
      const env = {
        PORT: '3000',
        TIMEOUT: '5000',
        RATE: '0.5'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        port: 3000,
        timeout: 5000,
        rate: 0.5
      });
    });

    it('coerces booleans', () => {
      const env = {
        DEBUG: 'true',
        VERBOSE: 'false',
        ENABLED: 'TRUE'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        debug: true,
        verbose: false,
        enabled: true
      });
    });

    it('keeps strings as strings when appropriate', () => {
      const env = {
        HOST: 'localhost',
        PATH: '/var/log/app.log',
        NAME: 'my-app'
      };
      const config = configEnvy({ env });
      expect(config).toEqual({
        host: 'localhost',
        path: '/var/log/app.log',
        name: 'my-app'
      });
    });

    it('can disable coercion', () => {
      const env = {
        PORT: '3000',
        DEBUG: 'true'
      };
      const config = configEnvy({ env, coerce: false });
      expect(config).toEqual({
        port: '3000',
        debug: 'true'
      });
    });
  });

  describe('prefix filtering', () => {
    it('filters by prefix', () => {
      const env = {
        APP_PORT: '3000',
        APP_DEBUG: 'true',
        OTHER_VAR: 'ignored',
        RANDOM: 'also ignored'
      };
      const config = configEnvy({ env, prefix: 'APP' });
      expect(config).toEqual({
        port: 3000,
        debug: true
      });
    });

    it('handles nested keys with prefix', () => {
      const env = {
        APP_LOG_LEVEL: 'debug',
        APP_LOG_PATH: '/var/log',
        APP_DB_HOST: 'localhost'
      };
      const config = configEnvy({ env, prefix: 'APP' });
      expect(config).toEqual({
        log: {
          level: 'debug',
          path: '/var/log'
        },
        db: {
          host: 'localhost'
        }
      });
    });

    it('handles prefix with trailing underscore', () => {
      const env = {
        APP_PORT: '3000'
      };
      const config = configEnvy({ env, prefix: 'APP_' });
      expect(config).toEqual({
        port: 3000
      });
    });
  });

  describe('custom delimiter', () => {
    it('uses double underscore for nesting', () => {
      const env = {
        LOG__LEVEL: 'debug',
        LOG__FILE_PATH: '/var/log'
      };
      const config = configEnvy({ env, delimiter: '__' });
      expect(config).toEqual({
        log: {
          level: 'debug',
          filePath: '/var/log'
        }
      });
    });

    it('preserves single underscores as camelCase with double underscore delimiter', () => {
      const env = {
        DATABASE__CONNECTION_STRING: 'postgres://localhost',
        DATABASE__POOL_SIZE: '10'
      };
      const config = configEnvy({ env, delimiter: '__' });
      expect(config).toEqual({
        database: {
          connectionString: 'postgres://localhost',
          poolSize: 10
        }
      });
    });
  });

  describe('Zod schema validation', () => {
    it('validates config with schema', () => {
      const schema = z.object({
        port: z.number(),
        debug: z.boolean()
      });

      const env = {
        PORT: '3000',
        DEBUG: 'true'
      };

      const config = configEnvy({ env, schema });
      expect(config).toEqual({
        port: 3000,
        debug: true
      });
    });

    it('validates nested config with schema', () => {
      const schema = z.object({
        log: z.object({
          level: z.enum(['debug', 'info', 'warn', 'error']),
          path: z.string()
        })
      });

      const env = {
        LOG_LEVEL: 'debug',
        LOG_PATH: '/var/log'
      };

      const config = configEnvy({ env, schema });
      expect(config).toEqual({
        log: {
          level: 'debug',
          path: '/var/log'
        }
      });
    });

    it('throws on validation error', () => {
      const schema = z.object({
        port: z.number().min(1000)
      });

      const env = {
        PORT: '80'
      };

      expect(() => configEnvy({ env, schema })).toThrow();
    });

    it('provides type safety with schema', () => {
      const schema = z.object({
        port: z.number(),
        log: z.object({
          level: z.string()
        })
      });

      const env = {
        PORT: '3000',
        LOG_LEVEL: 'info'
      };

      const config = configEnvy({ env, schema });

      // TypeScript should infer these types
      const port: number = config.port;
      const level: string = config.log.level;

      expect(port).toBe(3000);
      expect(level).toBe('info');
    });
  });

  describe('complex scenarios', () => {
    it('handles a realistic app config', () => {
      const env = {
        APP_PORT: '3000',
        APP_HOST: '0.0.0.0',
        APP_LOG_LEVEL: 'info',
        APP_LOG_FORMAT: 'json',
        APP_DATABASE_HOST: 'localhost',
        APP_DATABASE_PORT: '5432',
        APP_DATABASE_NAME: 'myapp',
        APP_DATABASE_SSL: 'true',
        APP_REDIS_URL: 'redis://localhost:6379',
        APP_FEATURE_NEW_UI: 'true',
        APP_FEATURE_DARK_MODE: 'false'
      };

      const config = configEnvy({ env, prefix: 'APP' });

      expect(config).toEqual({
        port: 3000,
        host: '0.0.0.0',
        log: {
          level: 'info',
          format: 'json'
        },
        database: {
          host: 'localhost',
          port: 5432,
          name: 'myapp',
          ssl: true
        },
        redis: {
          url: 'redis://localhost:6379'
        },
        feature: {
          new: { ui: true },
          dark: { mode: false }
        }
      });
    });

    it('handles empty env', () => {
      const config = configEnvy({ env: {} });
      expect(config).toEqual({});
    });

    it('handles undefined values in env', () => {
      const env: NodeJS.ProcessEnv = {
        PORT: '3000',
        EMPTY: undefined
      };
      const config = configEnvy({ env });
      expect(config).toEqual({ port: 3000 });
    });
  });
});

describe('createConfigEnvy', () => {
  it('creates a reusable config loader', () => {
    const loadConfig = createConfigEnvy({ prefix: 'APP' });

    const env1 = { APP_PORT: '3000' };
    const env2 = { APP_PORT: '4000' };

    expect(loadConfig({ env: env1 })).toEqual({ port: 3000 });
    expect(loadConfig({ env: env2 })).toEqual({ port: 4000 });
  });

  it('creates a typed config loader with schema', () => {
    const schema = z.object({
      port: z.number(),
      debug: z.boolean()
    });

    const loadConfig = createConfigEnvy({ prefix: 'APP', schema });

    const env = { APP_PORT: '3000', APP_DEBUG: 'true' };
    const config = loadConfig({ env });

    expect(config).toEqual({ port: 3000, debug: true });
    // TypeScript infers the type from schema
    const port: number = config.port;
    expect(port).toBe(3000);
  });

  it('allows overriding default options', () => {
    const loadConfig = createConfigEnvy({ prefix: 'APP', coerce: true });

    const env = { APP_PORT: '3000' };

    // Override coerce
    const config = loadConfig({ env, coerce: false });
    expect(config).toEqual({ port: '3000' });
  });
});
