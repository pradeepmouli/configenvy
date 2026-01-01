import type { z } from 'zod';
import type { ConfigEnvyOptions, ConfigObject, InferConfig } from './types.js';
import { coerceValue, setNestedValue } from './utils.js';

/**
 * Parse environment variable key into nested path based on delimiter
 */
function parseKeyToPath(key: string, prefix?: string, delimiter = '_'): string[] {
  let normalizedKey = key;

  if (prefix) {
    const prefixWithDelimiter = prefix.endsWith(delimiter) ? prefix : `${prefix}${delimiter}`;
    if (key.startsWith(prefixWithDelimiter)) {
      normalizedKey = key.slice(prefixWithDelimiter.length);
    } else if (key === prefix) {
      return [];
    } else {
      return [];
    }
  }

  if (delimiter === '_') {
    return normalizedKey
      .toLowerCase()
      .split('_')
      .filter((part) => part.length > 0);
  }

  // For custom delimiters like '__', split by that first for nesting
  // then convert each part to camelCase
  return normalizedKey
    .split(delimiter)
    .filter((part) => part.length > 0)
    .map((part) =>
      part
        .toLowerCase()
        .split('_')
        .map((word, index) => (index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)))
        .join('')
    );
}

/**
 * Build a nested configuration object from environment variables
 */
function buildConfig(
  env: NodeJS.ProcessEnv,
  options: Omit<ConfigEnvyOptions, 'schema'> = {}
): ConfigObject {
  const { prefix, coerce = true, delimiter = '_' } = options;
  const result: ConfigObject = {};

  for (const [key, value] of Object.entries(env)) {
    if (value === undefined) continue;

    const path = parseKeyToPath(key, prefix, delimiter);
    if (path.length === 0) continue;

    const finalValue = coerce ? coerceValue(value) : value;
    setNestedValue(result, path, finalValue);
  }

  return result;
}

/**
 * Create a typed configuration object from environment variables
 *
 * @example
 * // Basic usage - auto-maps env vars to nested camelCase config
 * // PORT_NUMBER=1234 LOG_LEVEL=debug LOG_PATH=/var/log
 * const config = configEnvy();
 * // Returns: { port: { number: 1234 }, log: { level: 'debug', path: '/var/log' } }
 *
 * @example
 * // With prefix filtering
 * // APP_PORT=3000 APP_DEBUG=true OTHER_VAR=ignored
 * const config = configEnvy({ prefix: 'APP' });
 * // Returns: { port: 3000, debug: true }
 *
 * @example
 * // With Zod schema for validation and type safety
 * const schema = z.object({
 *   port: z.number(),
 *   log: z.object({
 *     level: z.enum(['debug', 'info', 'warn', 'error']),
 *     path: z.string()
 *   })
 * });
 * const config = configEnvy({ schema });
 * // Returns typed config with validation
 */
export function configEnvy<T extends z.ZodType>(
  options: ConfigEnvyOptions<T> & { schema: T }
): InferConfig<T>;
export function configEnvy(options?: Omit<ConfigEnvyOptions, 'schema'>): ConfigObject;
export function configEnvy<T extends z.ZodType>(
  options: ConfigEnvyOptions<T> = {}
): InferConfig<T> {
  const env = options.env ?? process.env;
  const config = buildConfig(env, options);

  if (options.schema) {
    return options.schema.parse(config) as InferConfig<T>;
  }

  return config as InferConfig<T>;
}

/**
 * Create a configuration loader with preset options
 *
 * @example
 * const loadConfig = createConfigEnvy({
 *   prefix: 'APP',
 *   schema: appConfigSchema
 * });
 *
 * const config = loadConfig(); // Uses preset options
 * const testConfig = loadConfig({ env: testEnv }); // Override env for testing
 */
export function createConfigEnvy<T extends z.ZodType>(
  defaultOptions: ConfigEnvyOptions<T> & { schema: T }
): (overrides?: Partial<Omit<ConfigEnvyOptions<T>, 'schema'>>) => InferConfig<T>;
export function createConfigEnvy(
  defaultOptions: Omit<ConfigEnvyOptions, 'schema'>
): (overrides?: Partial<Omit<ConfigEnvyOptions, 'schema'>>) => ConfigObject;
export function createConfigEnvy<T extends z.ZodType>(
  defaultOptions: ConfigEnvyOptions<T>
): (overrides?: Partial<Omit<ConfigEnvyOptions<T>, 'schema'>>) => ConfigObject | InferConfig<T> {
  return (overrides = {}) => {
    const mergedOptions = { ...defaultOptions, ...overrides };
    if ('schema' in mergedOptions && mergedOptions.schema) {
      return configEnvy(mergedOptions as ConfigEnvyOptions<T> & { schema: T });
    }
    return configEnvy(mergedOptions as Omit<ConfigEnvyOptions, 'schema'>);
  };
}
