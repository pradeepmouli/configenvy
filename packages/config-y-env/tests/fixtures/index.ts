/**
 * Sample fixtures for config-y-env tests
 * @module tests/fixtures
 */

/**
 * Simple .env file content for testing
 */
export const simpleEnvContent = `DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_SSL=true
API_TIMEOUT=30
DEBUG=false
ALLOWED_HOSTS=localhost,example.com`;

/**
 * Complex .env file with various types
 */
export const complexEnvContent = `# Server configuration
SERVER_HOST=0.0.0.0
SERVER_PORT=3000
SERVER_WORKERS=4

# Database
DB_HOST=db.example.com
DB_PORT=5432
DB_NAME=production
DB_POOL_SIZE=10

# Redis
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600

# Features
FEATURES_AUTH=true
FEATURES_API=true
FEATURES_CACHE=false

# Arrays
ALLOWED_ORIGINS=http://localhost,https://example.com,https://api.example.com
TRUSTED_PROXIES=10.0.0.0/8,172.16.0.0/12

# Empty values
OPTIONAL_VALUE=
UNUSED_SETTING=`;

/**
 * Expected TypeScript interface for simple .env
 */
export const expectedSimpleInterface = `export interface Config {
  database: {
    host: string;
    port: number;
    ssl: boolean;
  };
  api: {
    timeout: number;
  };
  debug: boolean;
  allowedHosts: string[];
}`;

/**
 * Expected TypeScript interface for complex .env
 */
export const expectedComplexInterface = `export interface Config {
  server: {
    host: string;
    port: number;
    workers: number;
  };
  db: {
    host: string;
    port: number;
    name: string;
    poolSize: number;
  };
  redis: {
    url: string;
    ttl: number;
  };
  features: {
    auth: boolean;
    api: boolean;
    cache: boolean;
  };
  allowedOrigins: string[];
  trustedProxies: string[];
  optionalValue?: string;
  unusedSetting?: string;
}`;

/**
 * .env file with edge cases
 */
export const edgeCaseEnvContent = `# Comments should be ignored
SIMPLE=value
QUOTED="value with spaces"
EMPTY=
WITH_UNDERSCORE_PREFIX=_value
NUMERIC_STRING=123456
DECIMAL=3.14159
BOOLEAN_TRUE=true
BOOLEAN_FALSE=false
ARRAY_SINGLE=item1
ARRAY_MULTIPLE=item1,item2,item3
MIXED_ARRAY=123,text,true`;

/**
 * .env file with semantic naming patterns
 */
export const semanticEnvContent = `# Ports
SERVER_PORT=3000
DB_PORT=5432
CACHE_PORT=6379

# Hosts
SERVER_HOST=localhost
DB_HOST=db.example.com
CACHE_HOST=cache.example.com

# Timeouts
REQUEST_TIMEOUT=30
DB_TIMEOUT=10
CACHE_TIMEOUT=5

# Flags
DEBUG_ENABLED=true
VERBOSE_LOGGING=false
CACHE_ENABLED=true

# Secrets
API_SECRET=<change-me>
DATABASE_PASSWORD=<change-me>
JWT_SECRET=<change-me>`;
