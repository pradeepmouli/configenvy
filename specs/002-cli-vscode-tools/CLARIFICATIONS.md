# Clarification Session Summary: CLI Tools & VS Code Extension

**Session Date**: January 5, 2026  
**Feature**: `002-cli-vscode-tools`  
**Branch**: `002-cli-vscode-tools`  
**Status**: ✅ **CLARIFICATIONS COMPLETE**

---

## Executive Summary

All 5 critical architectural decisions have been clarified and documented. The specification now includes explicit guidance on:
- Monorepo and package structure
- Type inference behavior
- Error handling and file safety
- Sample value generation
- VS Code extension configuration management

**Ready to proceed to**: Planning phase (`/speckit.plan`)

---

## Clarifications Recorded

### 1️⃣ Monorepo & Publishing Strategy

**Question**: How should the CLI tools and extension be organized in the monorepo and published?

**Answer**: **Option B** - Monorepo with shared core

**Details**:
- Single npm package: `@envyconfig/tools` (contains both CLI tools: `env-y-config` and `config-y-env`)
- Extension published separately: `envyconfig-tools` to VS Code Marketplace
- Shared library: Core conversion logic shared between CLI tools via internal package
- Independent versioning: Each package can be released on its own schedule

**Impact on Implementation**:
- Monorepo structure: 3 packages under `packages/`
  - `packages/cli-tools/` - Contains both CLI tools + entry points
  - `packages/vscode-extension/` - VS Code extension source
  - `packages/shared/` - Shared utilities and types
- Publishing workflow: CLI to npm registry, Extension to VS Code Marketplace
- Task decomposition: Can work on CLI and extension independently

**Architectural Benefit**: Allows CLI-only users to use tools without extension overhead while maintaining code reuse

---

### 2️⃣ Type Inference for Ambiguous Values

**Question**: How should `config-y-env` handle ambiguous type inference (e.g., `"123"` could be string or number)?

**Answer**: **Option A** - Conservative/Strict mode (default)

**Details**:
- **Strict mode** (`--strict=true`, default): All ambiguous values typed as `string`
  - Only infers `number` for clearly numeric values without quotes
  - Only infers `boolean` for exact `true`/`false` values
  - Results in explicit `string | number` unions when truly ambiguous
- **Loose mode** (`--strict=false`): Enables smart heuristics
  - Uses naming patterns (e.g., `_PORT`, `_COUNT`, `_ID` → `number`)
  - Uses prefixes (e.g., `_ENABLED`, `_DEBUG` → `boolean`)
  - For experienced users who have consistent naming conventions

**Impact on Implementation**:
- Type inference engine must implement both modes
- Strict mode is safer and prevents runtime type errors
- Tests must validate both modes produce correct output

**Example**:
```bash
# .env file
PORT=5432
DEBUG=true
API_KEY=secret123

# Strict mode (default) output
export interface Config {
  PORT: string;      // Conservative: stays string
  DEBUG: boolean;    // Matches exactly
  API_KEY: string;   // Clear string value
}

# Loose mode output (--strict=false)
export interface Config {
  PORT: number;      // Heuristic: ends in PORT → number
  DEBUG: boolean;
  API_KEY: string;
}
```

---

### 3️⃣ Error Recovery & Partial Files

**Question**: What happens if file generation fails partway through?

**Answer**: **Option A + D** - Atomic writes with pre-flight validation

**Details**:
- **Pre-flight validation** (before any writes):
  - Check input file validity and readability
  - Verify output path permissions and writability
  - Calculate output size and check available disk space
  - Fail fast with clear error messages
- **Atomic writes**:
  - Write to temporary file (`.tmp`) in same directory
  - On success: Atomically move temp file to target location
  - On failure: Leave target file untouched, clean up temp file
  - Prevents corruption and data loss

**Impact on Implementation**:
- Add pre-flight validation phase before conversion
- Implement temp file pattern in file writers
- Automatic cleanup of temp files on exit (use try-finally)
- Requires OS-level atomic rename support

**Safety Properties**:
- Target file never partially written
- No data loss from tool failures
- Safe for CI/CD pipelines and automated workflows
- Compliant with FR-014: "validate that output path is writable"

---

### 4️⃣ Sample Value Generation Strategy

**Question**: What values should `env-y-config` generate for sample `.env` files?

**Answer**: **Option C** - Placeholder syntax (explicit, non-executable values)

**Details**:
- **Placeholder format**: `<PLACEHOLDER_NAME>` syntax
  - Database: `<DATABASE_HOST>`, `<DATABASE_PORT>`, `<DATABASE_PASSWORD>`
  - API: `<API_KEY>`, `<API_SECRET>`, `<API_TOKEN>`
  - Authentication: `<JWT_SECRET>`, `<SESSION_KEY>`
  - General: `<YOUR_VALUE>` for unknown types
- **Include schema descriptions**: If available in schema, add as comments
  - Example description from schema: "Database hostname (local or production)"
  - Include in generated comment for developer guidance

**Impact on Implementation**:
- Sample value generator must use placeholder templates
- Schema description parser required to extract hints
- Generated `.env` files are obviously incomplete and require filling
- Safe for version control (no actual credentials)

**Example Output**:
```bash
# Generated .env.sample
# Database connection settings
DATABASE_HOST="<DATABASE_HOST>"
DATABASE_PORT="<DATABASE_PORT>"
DATABASE_PASSWORD="<DATABASE_PASSWORD>"

# API Configuration  
API_KEY="<API_KEY>"
API_SECRET="<API_SECRET>"

# Log Level (debug, info, warn, error)
LOG_LEVEL="<LOG_LEVEL>"
```

**Safety Properties**:
- Prevents accidental use of generated values in production
- Forces conscious replacement of values
- Safe for templates and documentation
- Clear intent for developers

---

### 5️⃣ VS Code Extension Settings Scope

**Question**: Should extension settings apply globally or per-workspace?

**Answer**: **Option C** - Hierarchical (User defaults + Workspace overrides)

**Details**:
- **User-level settings** (`~/.config/Code/User/settings.json`):
  - Global defaults for all VS Code workspaces
  - Persistent across projects
  - Example: `"envyconfig.prefix": "APP_"` as personal preference
- **Workspace-level settings** (`.vscode/settings.json`):
  - Per-project configuration in repository
  - Overrides user settings for that workspace
  - Teams can enforce conventions (e.g., `PREFIX: "SERVICE_"` for a microservice)
  - Committed to git for team-wide consistency
- **Resolution order** (highest to lowest priority):
  1. Command-line flags (if CLI invoked directly)
  2. Workspace settings (`.vscode/settings.json`)
  3. User settings (`~/...Code/User/settings.json`)
  4. Extension defaults (hard-coded in code)

**Impact on Implementation**:
- Extension must read both configuration sources
- Implement settings hierarchy merge logic
- Settings panel UI saves to appropriate level
- Workspace detection required

**Example Configurations**:

User global settings:
```json
{
  "envyconfig.prefix": "",
  "envyconfig.strict": true,
  "envyconfig.includeComments": true
}
```

Team workspace settings (`.vscode/settings.json`):
```json
{
  "envyconfig.prefix": "SERVICE_",
  "envyconfig.strict": true,
  "envyconfig.excludeFields": ["DEBUG", "TEST_MODE"]
}
```

**Benefit**: Matches VS Code conventions (ESLint, Prettier, etc.) and allows team customization

---

## Coverage Assessment After Clarifications

| Category | Status | Notes |
|----------|--------|-------|
| **Functional Scope** | ✅ Clear | 43 requirements fully specified |
| **Domain & Data Model** | ✅ Clear | 5 entities with relationships defined |
| **Interaction & UX Flow** | ✅ Clear | UI elements, settings, configuration defined |
| **Non-Functional Attributes** | ✅ Clear | Performance targets, strictness levels explicit |
| **Integration & Dependencies** | ✅ Clear | Monorepo structure, publishing strategy defined |
| **Error Handling** | ✅ Clear | Atomic writes, pre-flight validation specified |
| **Constraints & Tradeoffs** | ✅ Clear | Safety vs. simplicity tradeoffs documented |
| **Terminology & Consistency** | ✅ Clear | Canonical terms used throughout |

**Overall**: All ambiguities resolved. Specification is **100% ready for implementation planning**.

---

## Architecture Decisions Summary

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Monorepo Structure** | Single CLI package, separate extension | Code reuse while maintaining independence |
| **Type Inference** | Strict by default, loose optional | Safety first, power for advanced users |
| **File Safety** | Atomic writes + pre-flight checks | Prevents corruption and data loss |
| **Sample Values** | Placeholder syntax | Prevents production credential leaks |
| **Configuration** | Hierarchical (user + workspace) | Follows VS Code conventions |

---

## Next Phase: Planning

The specification is now **fully clarified and ready for detailed planning**.

**Recommended next step**:
```bash
/speckit.plan
```

This will create:
- Detailed task breakdown (100+ tasks)
- Implementation phases and timeline
- Dependencies and prerequisites
- Estimation and capacity planning

---

## Files Updated

- `specs/002-cli-vscode-tools/spec.md` - Added Clarifications section with all 5 decisions
- Git commit: `clarify(cli-vscode-tools): add 5 architectural clarifications to specification`

**Session completed**: January 5, 2026
