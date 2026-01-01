# TypeScript Project Template

A modern TypeScript project template with best practices, tooling configuration, and multi-agent support.

## Features

- **Schema-Guided Nesting**: When a Zod schema is provided, the structure follows the schema exactly
  - `PORT_NUMBER` → `{ portNumber }` or `{ port: { number } }` depending on your schema
- **Smart Nesting** (without schema): Automatically nests when multiple entries share a prefix
  - `PORT_NUMBER=1234` → `{ portNumber: 1234 }` (single entry stays flat)
  - `LOG_LEVEL` + `LOG_PATH` → `{ log: { level: ..., path: ... } }` (multiple entries get nested)
- **Type Coercion**: Automatically converts strings to numbers and booleans
- **Prefix Filtering**: Only load variables with a specific prefix (e.g., `APP_`)
- **Zod Validation**: Optional schema validation with full TypeScript type inference
- **Type Utilities**: `ToEnv<T>`, `FromEnv<T>`, `WithPrefix<T>` for type-level transformations
- **Zero Dependencies Runtime**: Uses Zod only when you opt-in to schema validation

## Quick Start

### Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0

### Installation

1. Clone or use this template:

```bash
git clone <your-repo-url>
cd template-ts
```

2. Install dependencies:

```bash
pnpm install
```

4. Initialize Husky (first time only):

```bash
pnpm prepare
```

### Development

```bash
# Run in development mode with watch
pnpm dev

# Build the project
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Lint code
pnpm lint

# Format code
pnpm format

# Check formatting without changes
pnpm format:check

# Type check without emitting
pnpm type-check
```

## Project Structure

```
.
├── src/                  # Source files
│   └── index.ts         # Entry point
├── dist/                # Build output (generated)
├── AGENTS.md            # AI agent instructions
├── mcp.json             # MCP server configuration
├── package.json         # Project manifest
├── tsconfig.json        # TypeScript configuration
└── README.md            # This file
```

## MCP Configuration

This template includes MCP (Model Context Protocol) configuration for AI agents:

- **Context7**: Provides up-to-date library documentation
  - Set `CONTEXT7_API_KEY` in your environment to enable

## Agent Instructions

See [AGENTS.md](AGENTS.md) for comprehensive guidelines on:

- Coding standards and style
- Preferred technologies
- Workflow conventions
- Agent-specific instructions

## Scripts

| Script               | Description                             |
| -------------------- | --------------------------------------- |
| `pnpm dev`           | Run in development mode with hot reload |
| `pnpm build`         | Compile TypeScript to JavaScript        |
| `pnpm start`         | Run the compiled application            |
| `pnpm test`          | Run tests with Vitest                   |
| `pnpm test:coverage` | Run tests with coverage report          |
| `pnpm lint`          | Lint code with oxlint                   |
| `pnpm format`        | Format code with oxfmt                  |
| `pnpm format:check`  | Check code formatting                   |
| `pnpm type-check`    | Type check without building             |
| `pnpm clean`         | Remove build artifacts                  |
| `pnpm changeset`     | Create a new changeset                  |
| `pnpm version`       | Version packages using changesets       |
| `pnpm release`       | Build and publish to npm                |

## Configuration Files

### TypeScript (`tsconfig.json`)

- Strict type checking enabled
- ES2022 target with ESNext modules
- Decorator support enabled
- Source maps and declarations generated

### Package Manager

- Uses pnpm with workspaces support
- Minimum pnpm version: 9.0.0
- Minimum Node.js version: 20.0.0

## Coding Standards

This project follows strict coding standards:

### Naming Conventions

- **camelCase**: Variables and functions
- **PascalCase**: Classes, types, interfaces, components, files/folders
- **snake_case**: Script files (non-module)
- **#prefix**: Private class fields (ES2022)

### Code Style

- 2 spaces for indentation
- Single quotes for strings
- Semicolons required
- No trailing commas

### Best Practices

- Async/await over Promises
- Strict equality (`===`)
- Explicit return types
- JSDoc for public APIs only
- Dependency injection with decorators

See [AGENTS.md](AGENTS.md) for complete guidelines.

## Version Management

This project uses [Changesets](https://github.com/changesets/changesets) for version management:

### Creating a Changeset

When you make changes that should be released:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select the type of change (major, minor, patch)
2. Describe your changes

### Releasing

The release process is automated via GitHub Actions:

1. **Make changes** and create changesets
2. **Merge to main** - GitHub Actions will create a "Version Packages" PR
3. **Review and merge** the Version Packages PR
4. **Automatic release** - Package is published to npm and GitHub release is created

### Manual Release

If needed, you can release manually:

```bash
pnpm version  # Update versions
git add .
git commit -m "chore: version packages"
pnpm release  # Publish to npm
```

## CI/CD Workflows

### CI Workflow (`.github/workflows/ci.yml`)

Runs on push and pull requests:
- Code quality checks (formatting, linting, type checking)
- Tests on Node.js 20 and 22
- Build verification
- Coverage reporting

### Release Workflow (`.github/workflows/release.yml`)

Runs on main branch:
- Creates version PRs using Changesets
- Publishes to npm when version PR is merged
- Creates GitHub releases automatically
- Supports pre-release versions

### Dependency Updates

Dependabot is configured to:
- Check for npm package updates weekly
- Check for GitHub Actions updates weekly
- Group updates by category (TypeScript, testing, etc.)
- Auto-label and assign PRs

## Pre-commit Hooks

Husky and lint-staged are configured to run on every commit:
- Format code with oxfmt
- Lint and fix with oxlint
- Ensure code quality before commits

## Type Utilities

configenvy exports type utilities to help with type-safe environment variable handling:

### `ToEnv<T>`

Convert a nested config type to a flat SCREAMING_SNAKE_CASE env record:

```typescript
import type { ToEnv } from 'configenvy';

type Config = {
  portNumber: number;
  log: {
    level: string;
    path: string;
  };
};

type Env = ToEnv<Config>;
// {
//   PORT_NUMBER: string;
//   LOG_LEVEL: string;
//   LOG_PATH: string;
// }
```

### `FromEnv<T>`

Convert flat env keys to camelCase (uses type-fest's `CamelCasedPropertiesDeep`):

```typescript
import type { FromEnv } from 'configenvy';

type Env = { PORT_NUMBER: string; LOG_LEVEL: string };
type Config = FromEnv<Env>;
// { portNumber: string; logLevel: string }
```

### `WithPrefix<T, P>` / `WithoutPrefix<T, P>`

Add or remove prefixes from env keys:

```typescript
import type { WithPrefix, WithoutPrefix } from 'configenvy';

type Env = { PORT: string; DEBUG: string };
type PrefixedEnv = WithPrefix<Env, 'APP'>;
// { APP_PORT: string; APP_DEBUG: string }

type Unprefixed = WithoutPrefix<PrefixedEnv, 'APP'>;
// { PORT: string; DEBUG: string }
```

### `SchemaToEnv<T>`

Extract env type from a Zod schema's inferred type:

```typescript
import type { SchemaToEnv } from 'configenvy';
import { z } from 'zod';

const schema = z.object({
  port: z.number(),
  log: z.object({ level: z.string() })
});

type Env = SchemaToEnv<z.infer<typeof schema>>;
// { PORT: string; LOG_LEVEL: string }
```

## Type Coercion Rules

1. Follow the coding standards in [AGENTS.md](AGENTS.md)
2. Write tests for new features
3. Use conventional commits
4. Ensure all tests pass before submitting PR

## License

MIT

---

_Generated from template-ts on December 19, 2025_
