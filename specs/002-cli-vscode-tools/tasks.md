# Tasks: CLI Tools & VS Code Extension for envyconfig

**Input**: Design documents from `/specs/002-cli-vscode-tools/`
**Prerequisites**: [spec.md](spec.md) (user stories), [plan.md](plan.md) (implementation approach), [data-model.md](data-model.md) (types)

**Tests**: Per Constitution Principle II (Test-Driven Public APIs), unit tests are MANDATORY for all public APIs. Tests are included for all CLI commands, parsers, generators, and extension commands.

**Organization**: Tasks organized by user story (US1-US4) to enable independent implementation and delivery. Each user story can be developed, tested, and shipped independently.

## Format: `[ID] [P?] [Story] Description with file path`

- **[ID]**: Sequential task number (T001, T002, etc.)
- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story (US1, US2, US3, US4) - omitted for setup/foundation phases
- **File paths**: Exact locations for implementation

---

## Phase 1: Infrastructure Setup

**Purpose**: Project initialization and monorepo configuration

**Duration**: 2-3 days

- [ ] T001 Create monorepo structure with pnpm workspaces in `packages/` directory
- [ ] T002 [P] Create `packages/env-y-config/` directory with `src/`, `tests/`, `package.json`, `tsconfig.json`
- [ ] T003 [P] Create `packages/config-y-env/` directory with `src/`, `tests/`, `package.json`, `tsconfig.json`
- [ ] T004 [P] Create `packages/vscode-envyconfig/` directory with `src/`, `media/`, `tests/`, `package.json`, `extension.json`
- [ ] T005 Configure TypeScript compiler settings for monorepo in `tsconfig.json` files
- [ ] T006 [P] Set up vitest configuration in each package for test running
- [ ] T007 [P] Configure build scripts in each `package.json` (build, test, lint)
- [ ] T008 Create root `pnpm-workspace.yaml` to link all packages
- [ ] T009 Add Commander.js and ts-morph to `packages/env-y-config/package.json` dependencies
- [ ] T010 Add Commander.js and ts-morph to `packages/config-y-env/package.json` dependencies
- [ ] T011 Add VS Code API types to `packages/vscode-envyconfig/package.json` devDependencies

**Checkpoint**: All three packages set up with proper TypeScript configuration, dependencies installed, build scripts working

---

## Phase 2: Foundational Infrastructure

**Purpose**: Core utilities and base modules needed by both CLI tools

**Duration**: 3-4 days

**⚠️ CRITICAL**: This phase must complete before any user story implementation begins

### Shared Utilities & Type Definitions

- [x] T012 Create base types file `packages/env-y-config/src/types.ts` with SchemaField, ParsedSchema, ConversionOptions interfaces
- [x] T013 Create base types file `packages/config-y-env/src/types.ts` with EnvVariable, TypedField, InferenceOptions interfaces
- [x] T014 Create error handling module `packages/env-y-config/src/utils/errors.ts` with ConversionError class and exit codes
- [x] T015 Create error handling module `packages/config-y-env/src/utils/errors.ts` with detailed error messages
- [x] T016 Create logger utility `packages/env-y-config/src/utils/logger.ts` for structured logging
- [x] T017 Create logger utility `packages/config-y-env/src/utils/logger.ts` for structured logging
- [x] T018 Create file I/O utility `packages/env-y-config/src/utils/file-io.ts` with atomic write functionality
- [x] T019 Create file I/O utility `packages/config-y-env/src/utils/file-io.ts` with pre-flight validation
- [x] T020 Create formatting utility `packages/env-y-config/src/utils/formatting.ts` for .env output formatting

### CLI Framework Setup

- [x] T021 Create Commander.js setup in `packages/env-y-config/src/cli.ts` with root command definition
- [x] T022 Create Commander.js setup in `packages/config-y-env/src/cli.ts` with root command definition
- [x] T023 Create CLI entry point `packages/env-y-config/bin/env-y-config.js` for npm script execution
- [x] T024 Create CLI entry point `packages/config-y-env/bin/config-y-env.js` for npm script execution
- [x] T025 Add npm bin configuration to `packages/env-y-config/package.json` for global CLI availability
- [x] T026 Add npm bin configuration to `packages/config-y-env/package.json` for global CLI availability
- [x] T027 Implement global `--help` command displaying all available commands and options
- [x] T028 Implement global `--version` flag showing package version

### Testing Infrastructure

- [x] T029 Create test utilities file `packages/env-y-config/tests/test-helpers.ts` with fixture generators
- [x] T030 Create test utilities file `packages/config-y-env/tests/test-helpers.ts` with fixture generators
- [x] T031 Create mock data generators `packages/env-y-config/tests/fixtures/` for sample schemas and .env files
- [x] T032 Create mock data generators `packages/config-y-env/tests/fixtures/` for .env files
- [x] T033 Set up test configuration in `vitest.config.ts` for both packages

**Checkpoint**: Foundation complete. CLI framework operational. File I/O with atomic writes implemented. Ready for user story work.

---

## Phase 3: User Story 1 - Developer Generates .env Files from Schema (Priority: P1)

**Goal**: Developers can convert schema definitions (Zod, JSON Schema, JSON, TypeScript) to sample `.env` files with placeholder values

**Independent Test**: Provide any supported schema format, run `env-y-config`, verify generated `.env` contains all fields with `<PLACEHOLDER>` syntax values

**Duration**: 8-12 days

### Tests for User Story 1

- [ ] T034 [P] [US1] Unit test: Zod schema parser in `packages/env-y-config/tests/unit/parsers/zod.test.ts`
- [ ] T035 [P] [US1] Unit test: JSON Schema parser in `packages/env-y-config/tests/unit/parsers/json-schema.test.ts`
- [ ] T036 [P] [US1] Unit test: TypeScript interface parser in `packages/env-y-config/tests/unit/parsers/typescript.test.ts`
- [ ] T037 [P] [US1] Unit test: JSON object parser in `packages/env-y-config/tests/unit/parsers/json.test.ts`
- [ ] T038 [P] [US1] Unit test: Format detection in `packages/env-y-config/tests/unit/parsers/format-detection.test.ts`
- [ ] T039 [P] [US1] Unit test: Sample value generation in `packages/env-y-config/tests/unit/generators/sample-values.test.ts`
- [ ] T040 [P] [US1] Unit test: .env file formatting in `packages/env-y-config/tests/unit/generators/env-formatter.test.ts`
- [ ] T041 [US1] Integration test: CLI end-to-end with Zod input in `packages/env-y-config/tests/integration/cli-zod.test.ts`
- [ ] T042 [US1] Integration test: CLI end-to-end with JSON Schema input in `packages/env-y-config/tests/integration/cli-json-schema.test.ts`
- [ ] T043 [US1] Integration test: CLI end-to-end with TypeScript input in `packages/env-y-config/tests/integration/cli-typescript.test.ts`
- [ ] T044 [US1] Integration test: CLI with flags (prefix, include, exclude) in `packages/env-y-config/tests/integration/cli-flags.test.ts`

### Implementation for User Story 1

#### Zod Schema Parser (3-4 days)

- [ ] T045 [P] [US1] Implement Zod schema parser in `packages/env-y-config/src/parsers/zod.ts` extracting fields and descriptions
- [ ] T046 [P] [US1] Add field metadata extraction from Zod `.describe()` in `packages/env-y-config/src/parsers/zod.ts`
- [ ] T047 [P] [US1] Handle nested Zod objects and array field detection in `packages/env-y-config/src/parsers/zod.ts`
- [ ] T048 [P] [US1] Extract default values from Zod schema definitions in `packages/env-y-config/src/parsers/zod.ts`
- [ ] T049 [US1] Create unit tests for Zod parser covering all Zod field types in `packages/env-y-config/tests/unit/parsers/zod.test.ts`

#### JSON Schema Parser (2-3 days)

- [ ] T050 [P] [US1] Implement JSON Schema parser in `packages/env-y-config/src/parsers/json-schema.ts`
- [ ] T051 [P] [US1] Handle nested objects and array detection in JSON Schema in `packages/env-y-config/src/parsers/json-schema.ts`
- [ ] T052 [P] [US1] Extract descriptions and type information from JSON Schema in `packages/env-y-config/src/parsers/json-schema.ts`
- [ ] T053 [US1] Create unit tests for JSON Schema parser in `packages/env-y-config/tests/unit/parsers/json-schema.test.ts`

#### TypeScript Interface Parser (3-4 days)

- [x] T054 [P] [US1] Implement ts-morph-based parser in `packages/env-y-config/src/parsers/typescript.ts` to extract type information
- [x] T055 [P] [US1] Find and extract named interface/type from TypeScript file in `packages/env-y-config/src/parsers/typescript.ts`
- [x] T056 [P] [US1] Convert TypeScript types to field definitions (string, number, boolean, arrays) in `packages/env-y-config/src/parsers/typescript.ts`
- [x] T057 [P] [US1] Extract JSDoc comments as field descriptions in `packages/env-y-config/src/parsers/typescript.ts`
- [x] T058 [US1] Handle union types and enum types in TypeScript parser in `packages/env-y-config/src/parsers/typescript.ts`
- [x] T059 [US1] Create unit tests for TypeScript parser in `packages/env-y-config/tests/unit/parsers/typescript.test.ts`

#### JSON Object Parser (1-2 days)

- [ ] T060 [P] [US1] Implement JSON object parser in `packages/env-y-config/src/parsers/json.ts` treating JSON as a schema template
- [ ] T061 [P] [US1] Infer field types from JSON values in `packages/env-y-config/src/parsers/json.ts`
- [ ] T062 [US1] Create unit tests for JSON object parser in `packages/env-y-config/tests/unit/parsers/json.test.ts`

#### Sample Value Generation (2-3 days)

- [ ] T063 [P] [US1] Create sample value generator in `packages/env-y-config/src/generators/sample-values.ts` using placeholder syntax
- [ ] T064 [P] [US1] Implement placeholder generation for string types (e.g., `<YOUR_VALUE>`) in `packages/env-y-config/src/generators/sample-values.ts`
- [ ] T065 [P] [US1] Implement placeholder generation for specific patterns: `<DATABASE_HOST>`, `<API_KEY>`, etc. in `packages/env-y-config/src/generators/sample-values.ts`
- [ ] T066 [P] [US1] Add support for schema descriptions as hints in placeholder generation in `packages/env-y-config/src/generators/sample-values.ts`
- [ ] T067 [P] [US1] Create unit tests for sample value generation in `packages/env-y-config/tests/unit/generators/sample-values.test.ts`

#### .env File Generation (2-3 days)

- [ ] T068 [P] [US1] Create .env formatter in `packages/env-y-config/src/generators/env-formatter.ts` with KEY=value format
- [ ] T069 [P] [US1] Implement nested object flattening (e.g., `database.host` → `DATABASE_HOST`) in `packages/env-y-config/src/generators/env-formatter.ts`
- [ ] T070 [P] [US1] Add comment generation from field descriptions in `packages/env-y-config/src/generators/env-formatter.ts`
- [ ] T071 [P] [US1] Implement field filtering by name patterns (include/exclude) in `packages/env-y-config/src/generators/env-formatter.ts`
- [ ] T072 [P] [US1] Implement prefix addition to all environment variable names in `packages/env-y-config/src/generators/env-formatter.ts`
- [ ] T073 [US1] Create unit tests for .env formatting in `packages/env-y-config/tests/unit/generators/env-formatter.test.ts`

#### CLI Command Implementation (2-3 days)

- [ ] T074 [US1] Implement main `env-y-config` command handler in `packages/env-y-config/src/commands/generate.ts`
- [ ] T075 [US1] Add `--from` flag for explicit format selection (zod, json-schema, json, ts) in `packages/env-y-config/src/cli.ts`
- [ ] T076 [US1] Add `--type` flag for TypeScript export name specification in `packages/env-y-config/src/cli.ts`
- [ ] T077 [US1] Add `--output` / `-o` flag for output file path in `packages/env-y-config/src/cli.ts`
- [ ] T078 [US1] Add `--prefix` flag for environment variable name prefix in `packages/env-y-config/src/cli.ts`
- [ ] T079 [US1] Add `--include` flag for field name filtering (comma-separated) in `packages/env-y-config/src/cli.ts`
- [ ] T080 [US1] Add `--exclude` flag for excluding field names in `packages/env-y-config/src/cli.ts`
- [ ] T081 [US1] Add `--comments` flag for description comments (default: true) in `packages/env-y-config/src/cli.ts`
- [ ] T082 [US1] Add `--required-only` flag to output only required fields in `packages/env-y-config/src/cli.ts`
- [ ] T083 [US1] Implement atomic file write with pre-flight validation in command handler in `packages/env-y-config/src/commands/generate.ts`
- [ ] T084 [US1] Implement error handling with helpful messages for invalid schemas in `packages/env-y-config/src/commands/generate.ts`
- [ ] T085 [US1] Create integration tests for CLI in `packages/env-y-config/tests/integration/cli-*.test.ts`
- [ ] T085a [P] [US1] Implement cyclic schema reference detection in parsers in `packages/env-y-config/src/parsers/*.ts` with clear error message
- [ ] T085b [P] [US1] Add test for cyclic schema detection in `packages/env-y-config/tests/unit/parsers/cyclic-detection.test.ts`
- [ ] T085c [P] [US1] Implement naming collision detection for nested object flattening in `packages/env-y-config/src/generators/env-formatter.ts`
- [ ] T085d [US1] Add test for collision detection in `packages/env-y-config/tests/unit/generators/collision-detection.test.ts`

#### Documentation for User Story 1

- [ ] T086 [US1] Create CLI usage guide in `packages/env-y-config/README.md` with examples for each input format
- [ ] T087 [US1] Document all flags and options in `packages/env-y-config/README.md` with examples
- [ ] T088 [US1] Add troubleshooting section in `packages/env-y-config/README.md` for common issues

**Checkpoint**: User Story 1 complete. env-y-config tool fully functional with all input formats, flags, and tests. Ready for User Story 2.

---

## Phase 4: User Story 2 - Developer Generates TypeScript Types from .env Files (Priority: P1)

**Goal**: Developers can convert existing `.env` files to TypeScript type definitions with smart type inference

**Independent Test**: Provide a `.env` file, run `config-y-env`, verify generated TypeScript interface with correct type inference (string, number, boolean, arrays)

**Duration**: 10-14 days

### Tests for User Story 2

- [ ] T089 [P] [US2] Unit test: .env file parser in `packages/config-y-env/tests/unit/parsers/env-parser.test.ts`
- [ ] T090 [P] [US2] Unit test: Type inference engine in `packages/config-y-env/tests/unit/inference/type-detector.test.ts`
- [ ] T091 [P] [US2] Unit test: Nesting analysis in `packages/config-y-env/tests/unit/inference/nesting-analyzer.test.ts`
- [ ] T092 [P] [US2] Unit test: TypeScript generator in `packages/config-y-env/tests/unit/generators/typescript.test.ts`
- [ ] T093 [P] [US2] Unit test: JSON Schema generator in `packages/config-y-env/tests/unit/generators/json-schema.test.ts`
- [ ] T094 [P] [US2] Unit test: JavaScript object generator in `packages/config-y-env/tests/unit/generators/javascript.test.ts`
- [ ] T095 [P] [US2] Unit test: Zod schema generator in `packages/config-y-env/tests/unit/generators/zod.test.ts`
- [ ] T096 [US2] Integration test: CLI with TypeScript output in `packages/config-y-env/tests/integration/cli-typescript.test.ts`
- [ ] T097 [US2] Integration test: CLI with JSON Schema output in `packages/config-y-env/tests/integration/cli-json-schema.test.ts`
- [ ] T098 [US2] Integration test: CLI with JavaScript output in `packages/config-y-env/tests/integration/cli-javascript.test.ts`
- [ ] T099 [US2] Integration test: CLI with Zod output in `packages/config-y-env/tests/integration/cli-zod.test.ts`
- [ ] T100 [US2] Integration test: CLI with strict/loose inference modes in `packages/config-y-env/tests/integration/cli-inference-modes.test.ts`

### Implementation for User Story 2

#### .env File Parser (2-3 days)

- [ ] T101 [P] [US2] Implement .env parser in `packages/config-y-env/src/parsers/env-parser.ts` following dotenv format
- [ ] T102 [P] [US2] Handle comment lines and empty lines in .env parser in `packages/config-y-env/src/parsers/env-parser.ts`
- [ ] T103 [P] [US2] Handle quoted values and escape sequences in .env parser in `packages/config-y-env/src/parsers/env-parser.ts`
- [ ] T104 [P] [US2] Detect empty/undefined environment variables in .env parser in `packages/config-y-env/src/parsers/env-parser.ts`
- [ ] T105 [US2] Create unit tests for .env parser in `packages/config-y-env/tests/unit/parsers/env-parser.test.ts`

#### Type Inference Engine (4-5 days)

- [ ] T106 [P] [US2] Implement strict mode type detection in `packages/config-y-env/src/inference/type-detector.ts` (conservative approach)
- [ ] T107 [P] [US2] Implement boolean type detection (exact `true`/`false` values) in `packages/config-y-env/src/inference/type-detector.ts`
- [ ] T108 [P] [US2] Implement number type detection (numeric-only values) in `packages/config-y-env/src/inference/type-detector.ts`
- [ ] T109 [P] [US2] Implement array type detection (comma-separated values) in `packages/config-y-env/src/inference/type-detector.ts`
- [ ] T110 [P] [US2] Implement loose mode heuristics (naming patterns: `_PORT`, `_COUNT`, `_ENABLED`) in `packages/config-y-env/src/inference/type-detector.ts`
- [ ] T111 [P] [US2] Implement optional field detection (empty values typed as `T | undefined`) in `packages/config-y-env/src/inference/type-detector.ts`
- [ ] T112 [US2] Create unit tests for type detection in `packages/config-y-env/tests/unit/inference/type-detector.test.ts`
- [ ] T113 [US2] Implement nesting analyzer in `packages/config-y-env/src/inference/nesting-analyzer.ts` (e.g., `DATABASE_HOST` → nested `database.host`)
- [ ] T114 [US2] Create unit tests for nesting analyzer in `packages/config-y-env/tests/unit/inference/nesting-analyzer.test.ts`

#### TypeScript Generator (2-3 days)

- [ ] T115 [P] [US2] Implement TypeScript interface generator in `packages/config-y-env/src/generators/typescript.ts`
- [ ] T116 [P] [US2] Generate export interface with proper type annotations in `packages/config-y-env/src/generators/typescript.ts`
- [ ] T117 [P] [US2] Add JSDoc comments for fields from .env variable names in `packages/config-y-env/src/generators/typescript.ts`
- [ ] T118 [P] [US2] Implement `--interface-name` customization in `packages/config-y-env/src/generators/typescript.ts`
- [ ] T119 [US2] Create unit tests for TypeScript generator in `packages/config-y-env/tests/unit/generators/typescript.test.ts`

#### JSON Schema Generator (2-3 days)

- [ ] T120 [P] [US2] Implement JSON Schema generator in `packages/config-y-env/src/generators/json-schema.ts`
- [ ] T121 [P] [US2] Generate valid JSON Schema with proper type specifications in `packages/config-y-env/src/generators/json-schema.ts`
- [ ] T122 [P] [US2] Add descriptions and required field definitions in `packages/config-y-env/src/generators/json-schema.ts`
- [ ] T123 [US2] Create unit tests for JSON Schema generator in `packages/config-y-env/tests/unit/generators/json-schema.test.ts`

#### JavaScript Object Generator (1-2 days)

- [ ] T124 [P] [US2] Implement JavaScript object generator in `packages/config-y-env/src/generators/javascript.ts`
- [ ] T125 [P] [US2] Generate exportable JavaScript object with type hints as comments in `packages/config-y-env/src/generators/javascript.ts`
- [ ] T126 [US2] Create unit tests for JavaScript object generator in `packages/config-y-env/tests/unit/generators/javascript.test.ts`

#### Zod Schema Generator (2-3 days)

- [ ] T127 [P] [US2] Implement Zod schema generator in `packages/config-y-env/src/generators/zod.ts`
- [ ] T128 [P] [US2] Generate Zod validators with correct type mappings in `packages/config-y-env/src/generators/zod.ts`
- [ ] T129 [P] [US2] Add descriptions and optional field definitions in `packages/config-y-env/src/generators/zod.ts`
- [ ] T130 [US2] Create unit tests for Zod generator in `packages/config-y-env/tests/unit/generators/zod.test.ts`

#### CLI Command Implementation (3-4 days)

- [ ] T131 [US2] Implement main `config-y-env` command handler in `packages/config-y-env/src/commands/generate.ts`
- [ ] T132 [US2] Add `--to` flag for output format selection (ts, json-schema, object, zod) in `packages/config-y-env/src/cli.ts`
- [ ] T133 [US2] Add `--output` / `-o` flag for output file path in `packages/config-y-env/src/cli.ts`
- [ ] T134 [US2] Add `--interface-name` flag for custom TypeScript interface name in `packages/config-y-env/src/cli.ts`
- [ ] T135 [US2] Add `--strict` flag for type inference mode (default: true) in `packages/config-y-env/src/cli.ts`
- [ ] T136 [US2] Add `--prefix` flag to filter variables by prefix in `packages/config-y-env/src/cli.ts`
- [ ] T137 [US2] Add `--exclude` flag to exclude specific fields in `packages/config-y-env/src/cli.ts`
- [ ] T138 [US2] Add `--zod-schema` flag to generate both TypeScript and Zod output in `packages/config-y-env/src/cli.ts`
- [ ] T139 [US2] Add `--with-comments` flag for JSDoc comment generation (default: true) in `packages/config-y-env/src/cli.ts`
- [ ] T140 [US2] Implement atomic file write with pre-flight validation in command handler in `packages/config-y-env/src/commands/generate.ts`
- [ ] T141 [US2] Implement error handling with helpful messages for invalid .env files in `packages/config-y-env/src/commands/generate.ts`
- [ ] T142 [US2] Create integration tests for CLI in `packages/config-y-env/tests/integration/cli-*.test.ts`
- [ ] T142a [P] [US2] Implement detection for unsupported TypeScript constructs in `packages/config-y-env/src/parsers/typescript.ts` with graceful fallback
- [ ] T142b [US2] Add test for unsupported TypeScript handling in `packages/config-y-env/tests/unit/parsers/unsupported-types.test.ts`
- [ ] T142c [US2] Create type inference accuracy measurement suite in `packages/config-y-env/tests/integration/accuracy-benchmark.test.ts` testing against corpus of 50+ real-world .env files
- [ ] T142d [US2] Add accuracy reporting in `packages/config-y-env/tests/integration/accuracy-report.ts` generating metrics for CI dashboard
- [ ] T142e [P] [US2] Implement detection for unsupported TypeScript constructs (complex generics, mapped types) in `packages/config-y-env/src/parsers/typescript.ts`
- [ ] T142f [US2] Add test for unsupported TypeScript handling with graceful fallback in `packages/config-y-env/tests/unit/parsers/unsupported-typescript.test.ts`

#### Documentation for User Story 2

- [ ] T143 [US2] Create CLI usage guide in `packages/config-y-env/README.md` with examples for each output format
- [ ] T144 [US2] Document type inference rules with examples in `packages/config-y-env/README.md`
- [ ] T145 [US2] Document strict vs loose inference modes in `packages/config-y-env/README.md`
- [ ] T146 [US2] Add troubleshooting section in `packages/config-y-env/README.md` for type inference issues

**Checkpoint**: User Story 2 complete. config-y-env tool fully functional with all output formats, type inference modes, and tests. Both CLI tools ready. Ready for User Story 3 (VS Code Extension).

---

## Phase 5: User Story 3 - Developer Integrates CLI Tools via VS Code Extension (Priority: P2)

**Goal**: Developers can use both CLI tools directly from VS Code with real-time preview and file generation

**Independent Test**: Install extension, open schema or .env file, use command palette or context menu to preview conversion, click "Create File" to generate output

**Duration**: 10-14 days

### Tests for User Story 3

- [ ] T147 [P] [US3] Unit test: CLI executor service in `packages/vscode-envyconfig/tests/unit/services/cli-executor.test.ts`
- [ ] T148 [P] [US3] Unit test: File manager service in `packages/vscode-envyconfig/tests/unit/services/file-manager.test.ts`
- [ ] T149 [P] [US3] Unit test: WebView state management in `packages/vscode-envyconfig/tests/unit/webview/state-manager.test.ts`
- [ ] T150 [US3] Integration test: Generate .env command in `packages/vscode-envyconfig/tests/integration/commands/generate-env.test.ts`
- [ ] T151 [US3] Integration test: Generate types command in `packages/vscode-envyconfig/tests/integration/commands/generate-types.test.ts`
- [ ] T152 [US3] Integration test: Quick convert command in `packages/vscode-envyconfig/tests/integration/commands/quick-convert.test.ts`
- [ ] T153 [US3] Integration test: Extension activation and deactivation in `packages/vscode-envyconfig/tests/integration/extension-lifecycle.test.ts`
- [ ] T154 [US3] Integration test: WebView preview panel rendering in `packages/vscode-envyconfig/tests/integration/webview/preview-panel.test.ts`

### Implementation for User Story 3

#### Extension Infrastructure (3-4 days)

- [ ] T155 [P] [US3] Create extension entry point in `packages/vscode-envyconfig/src/extension.ts` with activation handler
- [ ] T156 [P] [US3] Configure extension manifest in `packages/vscode-envyconfig/package.json` with all commands and menus
- [ ] T157 [P] [US3] Implement activation events for supported file types (*.env, *.ts, *.json) in `packages/vscode-envyconfig/package.json`
- [ ] T158 [P] [US3] Create extension output channel "EnvyConfig Tools" in `packages/vscode-envyconfig/src/extension.ts`
- [ ] T158a [P] [US3] Implement structured logging service in `packages/vscode-envyconfig/src/services/logger.ts` with timestamps and severity levels
- [ ] T159 [P] [US3] Implement CLI tool detection and installation prompt in `packages/vscode-envyconfig/src/services/cli-detector.ts`
- [ ] T160 [US3] Add extension version and status to output channel in `packages/vscode-envyconfig/src/extension.ts`

#### CLI Integration Service (2-3 days)

- [ ] T161 [P] [US3] Create CLI executor service in `packages/vscode-envyconfig/src/services/cli-executor.ts` for running CLI commands
- [ ] T162 [P] [US3] Implement error handling and output parsing in `packages/vscode-envyconfig/src/services/cli-executor.ts`
- [ ] T163 [P] [US3] Add timeout handling for long-running conversions in `packages/vscode-envyconfig/src/services/cli-executor.ts`
- [ ] T164 [US3] Create file manager service in `packages/vscode-envyconfig/src/services/file-manager.ts` for reading input files
- [ ] T165 [US3] Create unit tests for CLI executor in `packages/vscode-envyconfig/tests/unit/services/cli-executor.test.ts`

#### Command Implementation (4-5 days)

- [ ] T166 [P] [US3] Implement "Generate .env from Schema" command in `packages/vscode-envyconfig/src/commands/generate-env.ts`
- [ ] T167 [P] [US3] Add quick-pick UI for input format selection in `packages/vscode-envyconfig/src/commands/generate-env.ts`
- [ ] T168 [P] [US3] Implement file selection dialog for schema input in `packages/vscode-envyconfig/src/commands/generate-env.ts`
- [ ] T169 [P] [US3] Implement "Generate Types from .env" command in `packages/vscode-envyconfig/src/commands/generate-types.ts`
- [ ] T170 [P] [US3] Add quick-pick UI for output format selection in `packages/vscode-envyconfig/src/commands/generate-types.ts`
- [ ] T171 [P] [US3] Implement "Quick Convert" command in `packages/vscode-envyconfig/src/commands/quick-convert.ts` with smart detection
- [ ] T172 [US3] Register all three commands in extension activation in `packages/vscode-envyconfig/src/extension.ts`
- [ ] T173 [US3] Add error notifications for command failures in `packages/vscode-envyconfig/src/commands/*.ts`
- [ ] T173a [US3] Add logging calls to all command handlers in `packages/vscode-envyconfig/src/commands/*.ts` for execution, completion, and errors
- [ ] T174 [US3] Create integration tests for commands in `packages/vscode-envyconfig/tests/integration/commands/*.test.ts`

#### WebView Panel Implementation (4-5 days)

- [ ] T175 [P] [US3] Create WebView preview panel in `packages/vscode-envyconfig/src/webview/preview-panel.ts`
- [ ] T176 [P] [US3] Implement WebView content generator in `packages/vscode-envyconfig/src/webview/webview-content.ts` with HTML/CSS
- [ ] T177 [P] [US3] Create input editor (with syntax highlighting) in `packages/vscode-envyconfig/media/preview.html`
- [ ] T178 [P] [US3] Create output editor (with syntax highlighting) in `packages/vscode-envyconfig/media/preview.html`
- [ ] T179 [P] [US3] Implement real-time preview synchronization in `packages/vscode-envyconfig/src/webview/preview-panel.ts`
- [ ] T180 [P] [US3] Add "Create File" button functionality in `packages/vscode-envyconfig/src/webview/preview-panel.ts`
- [ ] T181 [P] [US3] Add "Copy to Clipboard" button functionality in `packages/vscode-envyconfig/src/webview/preview-panel.ts`
- [ ] T182 [US3] Implement format tabs for toggling between formats in `packages/vscode-envyconfig/src/webview/preview-panel.ts`
- [ ] T183 [US3] Add loading and error states in WebView in `packages/vscode-envyconfig/src/webview/preview-panel.ts`
- [ ] T183a [US3] Add logging calls to WebView preview panel in `packages/vscode-envyconfig/src/webview/preview-panel.ts` for preview updates, file generation, and errors
- [ ] T184 [US3] Create WebView styling in `packages/vscode-envyconfig/media/style.css`
- [ ] T184a [US3] Create unit test for extension logging in `packages/vscode-envyconfig/tests/unit/services/logger.test.ts`

#### Context Menu Integration (2-3 days)

- [ ] T185 [P] [US3] Add context menu for `.env` files in `packages/vscode-envyconfig/package.json` with "Generate Types" option
- [ ] T186 [P] [US3] Add context menu for schema files (*.ts, *.json with "schema" pattern) in `packages/vscode-envyconfig/package.json` with "Generate .env" option
- [ ] T187 [P] [US3] Implement context menu command handlers in `packages/vscode-envyconfig/src/extension.ts`
- [ ] T188 [US3] Create unit tests for context menu in `packages/vscode-envyconfig/tests/unit/menus/context-menu.test.ts`

#### Settings Management (2-3 days)

- [ ] T189 [P] [US3] Define extension settings in `packages/vscode-envyconfig/package.json` with defaults:
   - `envyconfig.prefix` (default: "")
   - `envyconfig.strict` (default: true)
   - `envyconfig.includeComments` (default: true)
   - `envyconfig.interfaceName` (default: "Config")
- [ ] T190 [P] [US3] Implement settings reading in `packages/vscode-envyconfig/src/services/settings-manager.ts`
- [ ] T191 [P] [US3] Add settings UI in command palette with quick-pick options in `packages/vscode-envyconfig/src/commands/open-settings.ts`
- [ ] T192 [US3] Implement settings persistence (user vs workspace levels) in `packages/vscode-envyconfig/src/services/settings-manager.ts`
- [ ] T193 [US3] Add settings change listener to update WebView in `packages/vscode-envyconfig/src/extension.ts`
- [ ] T193a [US3] Implement structured logging service in `packages/vscode-envyconfig/src/services/logger.ts` with timestamp and severity
- [ ] T193b [US3] Add logging calls to all command handlers in `packages/vscode-envyconfig/src/commands/*.ts` for execution, completion, and errors
- [ ] T193c [US3] Add logging calls to WebView preview panel in `packages/vscode-envyconfig/src/webview/preview-panel.ts` for preview updates and file generation
- [ ] T193d [US3] Create unit test for logging output in `packages/vscode-envyconfig/tests/unit/services/logger.test.ts`

#### Documentation for User Story 3

- [ ] T194 [US3] Create extension README in `packages/vscode-envyconfig/README.md` with feature overview
- [ ] T195 [US3] Document all commands with keyboard shortcuts in `packages/vscode-envyconfig/README.md`
- [ ] T196 [US3] Document extension settings and configuration in `packages/vscode-envyconfig/README.md`
- [ ] T197 [US3] Add usage examples and screenshots in `packages/vscode-envyconfig/README.md`

**Checkpoint**: User Story 3 complete. VS Code extension fully functional with all commands, WebView preview, file generation, and settings. Ready for User Story 4 (Team Consistency).

---

## Phase 6: User Story 4 - Team Maintains Consistent Environment Configuration (Priority: P2)

**Goal**: Teams can use the tools in CI/CD pipelines to regenerate `.env` and type files from source schemas

**Independent Test**: Add schema file to git, run CLI tools in CI pipeline, verify `.env` and type files regenerated correctly on each commit

**Duration**: 4-5 days

### Tests for User Story 4

- [ ] T198 [US4] Integration test: CLI tools in CI scenario in `packages/env-y-config/tests/integration/ci-pipeline.test.ts`
- [ ] T199 [US4] Integration test: Monorepo scenario with multiple services in `tests/integration/monorepo-scenario.test.ts`
- [ ] T200 [US4] Test: `.vscode/settings.json` team configuration in `tests/integration/team-settings.test.ts`

### Implementation for User Story 4

#### CI/CD Integration Documentation (2 days)

- [ ] T201 [P] [US4] Create GitHub Actions workflow example in `.github/workflows/envyconfig-generate.yml` showing CLI usage in CI
- [ ] T202 [P] [US4] Add CI/CD section to main `README.md` with setup instructions
- [ ] T203 [US4] Create team configuration guide in `specs/002-cli-vscode-tools/TEAM_CONFIGURATION.md` documenting:
   - Shared schema location in monorepo
   - How to set up CI job to regenerate outputs
   - Git diff workflow for schema changes
   - `.vscode/settings.json` for team-wide defaults

#### Team Configuration Templates (2-3 days)

- [ ] T204 [P] [US4] Create example `.vscode/settings.json` template in `examples/vscode-team-settings.json` with team defaults
- [ ] T205 [P] [US4] Create example schema file in `examples/shared-config.schema.ts` for team to reference
- [ ] T206 [US4] Create monorepo setup guide in `docs/MONOREPO_SETUP.md` showing how multiple services share schema
- [ ] T207 [US4] Add best practices document in `docs/BEST_PRACTICES.md` covering:
   - Schema management across services
   - Secret field handling
   - Environment-specific .env generation
   - Type synchronization strategy

#### Integration Tests (2 days)

- [ ] T208 [US4] Create monorepo scenario test with multiple service directories in `tests/integration/monorepo-scenario.test.ts`
- [ ] T209 [US4] Create CI pipeline simulation test in `packages/env-y-config/tests/integration/ci-pipeline.test.ts`
- [ ] T210 [US4] Create team settings test in `tests/integration/team-settings.test.ts`

**Checkpoint**: User Story 4 complete. Tools ready for CI/CD integration. Team configuration documented. All user stories delivered.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, publishing, final testing, and release preparation

**Duration**: 5-7 days

### Final Documentation & Polish

- [ ] T211 Create comprehensive root README in `README.md` with feature overview and installation instructions
- [ ] T212 Create API reference documentation in `docs/API_REFERENCE.md` covering all CLI options
- [ ] T213 Create troubleshooting guide in `docs/TROUBLESHOOTING.md` for common issues
- [ ] T214 Create CHANGELOG in `CHANGELOG.md` with all features for v1.0.0 release
- [ ] T215 Add JSDoc comments to all public functions and exports in all three packages
- [ ] T216 Update root `package.json` with workspace configuration and scripts
- [ ] T217 Create GitHub action for automated testing on PR in `.github/workflows/test.yml`
- [ ] T218 Create GitHub action for publishing packages on release in `.github/workflows/publish.yml`

### Quality Assurance

- [ ] T219 Run full test suite across all packages and verify >85% coverage
- [ ] T220 Run linter (oxlint) across all packages and fix violations
- [ ] T221 Run formatter (oxfmt) across all packages
- [ ] T222 Manual smoke testing of both CLI tools on all platforms (macOS, Linux, Windows)
- [ ] T223 Manual smoke testing of VS Code extension on VS Code 1.85.0+ (Linux, macOS, Windows)
- [ ] T224 Load test CLI tools with large files (10,000+ lines) to verify performance
- [ ] T224a Create WebView preview performance test in `packages/vscode-envyconfig/tests/integration/webview-perf.test.ts` measuring render time for inputs up to 100KB
- [ ] T224b Add preview latency thresholds to CI (fail if >500ms for typical 10KB input)
- [ ] T225 Test edge cases: invalid inputs, malformed files, permission errors, disk full
- [ ] T225a Test cyclic schema references with clear error output
- [ ] T225b Test unsupported TypeScript constructs with fallback behavior
- [ ] T225c Test naming collision detection with helpful error messages

### Publishing & Release

- [ ] T226 Package CLI tools for npm: `@envyconfig/tools` package
- [ ] T227 Create GitHub release with release notes
- [ ] T228 Publish CLI tools to npm registry
- [ ] T229 Package VS Code extension and submit to VS Code Marketplace
- [ ] T230 Add installation badges to README

### Final Validation

- [ ] T231 Verify CLI tools installable via npm: `npm install -g @envyconfig/tools`
- [ ] T232 Verify VS Code extension installable from Marketplace
- [ ] T233 Test end-to-end workflows: schema → .env → types → back to schema
- [ ] T234 Verify all acceptance scenarios from spec.md pass
- [ ] T235 Verify all success criteria from spec.md met

**Checkpoint**: Feature complete, tested, documented, and published. Ready for v1.0.0 release.

---

## Summary

| Phase | Duration | Tasks | Status |
|-------|----------|-------|--------|
| **Phase 1: Infrastructure** | 2-3 days | T001-T011 | 📋 Ready |
| **Phase 2: Foundation** | 3-4 days | T012-T033 | 📋 Blocked by Phase 1 |
| **Phase 3: User Story 1** | 8-12 days | T034-T088 (+4) | 📋 Blocked by Phase 2 |
| **Phase 4: User Story 2** | 10-14 days | T089-T146 (+4) | 📋 Blocked by Phase 3 |
| **Phase 5: User Story 3** | 10-14 days | T147-T197 (+4) | 📋 Blocked by Phase 4 |
| **Phase 6: User Story 4** | 4-5 days | T198-T210 | 📋 Blocked by Phase 5 |
| **Phase 7: Polish** | 5-7 days | T211-T235 (+3) | 📋 Blocked by Phase 6 |
| **TOTAL** | **42-62 days** | **251 tasks** | **📋 Ready to start** |

---

## Task Organization

**By User Story** (Independent implementation):
- **User Story 1** (env-y-config): Tasks T034-T088 (55 tasks)
- **User Story 2** (config-y-env): Tasks T089-T146 (58 tasks)
- **User Story 3** (VS Code Extension): Tasks T147-T197 (51 tasks)
- **User Story 4** (Team Configuration): Tasks T198-T210 (13 tasks)

**By Package** (Parallel development teams):
- **env-y-config**: Tasks T001-T088 (88 tasks across phases)
- **config-y-env**: Tasks T001-T146 (146 tasks across phases)
- **vscode-envyconfig**: Tasks T001-T197 (197 tasks across phases)

**By Phase** (Sequential delivery):
- Phase 1 (Infrastructure): 11 tasks (sequential)
- Phase 2 (Foundation): 22 tasks (mostly parallel)
- Phases 3-6 (User Stories): 192 tasks (highly parallelizable within each phase)
- Phase 7 (Polish): 25 tasks (sequential)

---

## Parallel Execution Opportunities

### Scenario: 3-Person Team

**Team A** (env-y-config):
- Parallel T002, T045-T062 (parsers)
- Parallel T063-T073 (generators)
- Sequential T074-T087 (CLI + docs)

**Team B** (config-y-env):
- Parallel T003, T101-T130 (parser + generators)
- Sequential T131-T146 (CLI + docs)

**Team C** (VS Code Extension):
- Parallel T004, T155-T197 (extension infrastructure + features)

All teams can work in parallel after Phase 1, with Phase 3 team starting immediately after Phase 2.

---

**Status**: ✅ Task breakdown complete and ready for implementation
**Total Tasks**: 235
**Estimated Duration**: 42-62 days (6-8 weeks with team)
**Next Step**: Begin Phase 1 infrastructure setup
