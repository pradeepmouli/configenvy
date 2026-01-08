import type { z } from 'zod';

export type ConfigPrimitive = string | number | boolean;

export type ConfigObject = {
  [key: string]: ConfigValue;
};

export type ConfigArray = Array<ConfigPrimitive | ConfigObject>;

export type ConfigValue = ConfigPrimitive | ConfigObject | ConfigArray;

export interface ObjectEnvyOptions<T = ConfigObject> {
  /**
   * Filter environment variables by prefix.
   * e.g., "APP" will only include variables starting with "APP_"
   */
  prefix?: string;

  /**
   * Custom environment object. Defaults to process.env
   */
  env?: NodeJS.ProcessEnv;

  /**
   * Zod schema for validation and type inference
   */
  schema?: T extends ConfigObject ? z.ZodObject<any> : never;

  /**
   * Whether to automatically coerce values to numbers/booleans
   * @default true
   */
  coerce?: boolean;

  /**
   * Delimiter used to indicate nesting depth.
   * By default, each underscore creates a new nesting level.
   * Set to '__' to use double underscores for nesting.
   * @default '_'
   */
  delimiter?: string;
}
