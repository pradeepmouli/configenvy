# Implementation Plan: CLI Tools & VS Code Extension

**Branch**: `002-cli-vscode-tools` | **Date**: 2026-01-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-cli-vscode-tools/spec.md`

**Note**: This plan documents the design and implementation approach for bidirectional CLI tools and VS Code extension to convert between schemas, .env files, and TypeScript types.

## Summary

Develop two command-line tools (`env-y-config` and `config-y-env`) and a VS Code extension to provide bidirectional conversion between environment variable definitions and TypeScript types/schemas. The `env-y-config` tool converts schema definitions (Zod, JSON Schema, JSON, TypeScript) to sample `.env` files with realistic values. The `config-y-env` tool converts `.env` files to TypeScript types, JSON Schema, JavaScript objects, or Zod validators with smart type inference. The VS Code extension integrates both tools into the editor with WebView previews, command palette commands, and context menu integration for seamless developer workflow.

## Technical Context

**Language/Version**: TypeScript 5.9+ with strict mode, Node.js 20.0+ runtime
**Primary Dependencies**: 
  - Core library: envyconfig (existing codebase)
  - CLI framework: commander.js for argument parsing
  - Schema parsing: Zod 4.3.4+ (peer dependency), ts-morph for TypeScript AST manipulation
  - VS Code: vscode extension API 1.85.0+
**Storage**: File system I/O for reading/writing .env files and generated outputs
**Testing**: Vitest 4.0+ for unit tests, integration tests for CLI tools, VS Code extension testing framework
**Target Platform**: 
  - CLI tools: Cross-platform Node.js executables (Linux, macOS, Windows)
  - VS Code extension: VS Code 1.85.0+ on all supported platforms
**Project Type**: Multi-package project (2 CLI tools + 1 VS Code extension)
**Performance Goals**: 
  - CLI tool execution: <1 second for typical schemas/env files (<10KB)
  - Type inference: >95% accuracy for standard patterns
  - VS Code extension: Preview rendering <500ms, startup overhead <100ms
**Constraints**: 
  - CLI tools must work standalone (no VS Code dependency)
  - Zero runtime dependencies for core library (Zod peer dependency only)
  - VS Code extension bundle size <2MB
  - Must handle files up to 10,000 lines without performance degradation
**Scale/Scope**: Large feature with 3 deliverables:
  - env-y-config CLI (15 functional requirements)
  - config-y-env CLI (17 functional requirements)
  - VS Code extension (11 functional requirements)
  - Total: 43 functional requirements, 22 success criteria

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Verify alignment with envyconfig Constitution v1.1.0 principles:

- [x] **Type Safety First**: All new APIs designed with explicit types, no `any`
  - CLI tool modules will use strict TypeScript with explicit types
  - Schema parsers and type generators have full type safety
  - VS Code extension uses typed VS Code API
- [x] **Test-Driven Public APIs**: Test plan documented before implementation
  - Unit tests for all CLI command handlers, parsers, and generators
  - Integration tests for end-to-end CLI workflows
  - VS Code extension tests for commands and WebView interactions
  - Success criteria define >85% code coverage
- [x] **Code Quality Standards**: Linting/formatting rules identified for new code
  - Use existing oxlint and oxfmt configurations
  - Commander.js provides standardized CLI patterns
  - VS Code extension follows extension development best practices
- [x] **Semantic Versioning**: Breaking changes documented, version bump planned
  - **MINOR version bump** (0.2.0 → 0.3.0) - new features, no breaking changes to core library
  - CLI tools are new packages, start at 1.0.0
  - VS Code extension starts at 1.0.0
  - Core envyconfig API unchanged
- [x] **Documentation Discipline**: JSDoc requirements identified for new public APIs
  - CLI tools have comprehensive --help text and README
  - VS Code extension has marketplace description and usage guide
  - Public API functions have JSDoc comments
  - README updated with CLI tool installation and usage
- [x] **Modern TypeScript Patterns**: ES2022+ features used, no legacy patterns
  - async/await for file I/O operations
  - ES modules for all packages
  - Modern Node.js file system APIs
- [ ] **Zero-Runtime Dependencies**: No new runtime dependencies introduced (peer deps only if justified)
  - ⚠️ **DEVIATION**: CLI tools require commander.js (13KB) and ts-morph (~2MB) as dependencies
  - **JUSTIFICATION**: 
    - commander.js: Industry standard for CLI argument parsing, provides help generation, error handling
    - ts-morph: Required for TypeScript AST manipulation, no lightweight alternative for full type extraction
    - VS Code extension: Requires VS Code API (peer dependency)
  - **MITIGATION**: Dependencies scoped to CLI packages only, core envyconfig remains zero-dependency

## Project Structure

### Documentation (this feature)

```text
specs/002-cli-vscode-tools/
├── spec.md                    # Feature specification (existing)
├── SPECIFICATION_SUMMARY.md   # Spec summary (existing)
├── plan.md                    # This file (implementation plan)
├── research.md                # Phase 0 output - design decisions
├── data-model.md              # Phase 1 output - CLI/extension data structures
├── quickstart.md              # Phase 1 output - CLI and extension usage guide
├── contracts/                 # Phase 1 output - API contracts
│   ├── env-y-config-cli.md   # CLI tool interface contract
│   ├── config-y-env-cli.md   # CLI tool interface contract
│   └── vscode-extension.md   # Extension API contract
└── checklists/                # Existing directory
```

### Source Code (repository root)

```text
packages/
├── env-y-config/              # CLI tool: schema → .env
│   ├── src/
│   │   ├── cli.ts             # Command-line interface entry point
│   │   ├── parsers/           # Input format parsers (Zod, JSON Schema, etc.)
│   │   │   ├── zod.ts
│   │   │   ├── json-schema.ts
│   │   │   ├── typescript.ts
│   │   │   └── json.ts
│   │   ├── generators/        # .env file generators
│   │   │   ├── env-writer.ts
│   │   │   └── sample-values.ts
│   │   └── utils/             # Shared utilities
│   ├── tests/
│   │   ├── unit/              # Unit tests for parsers/generators
│   │   └── integration/       # End-to-end CLI tests
│   ├── package.json
│   └── README.md
│
├── config-y-env/              # CLI tool: .env → types
│   ├── src/
│   │   ├── cli.ts             # Command-line interface entry point
│   │   ├── parsers/           # .env file parser
│   │   │   └── env-parser.ts
│   │   ├── inference/         # Type inference engine
│   │   │   ├── type-detector.ts
│   │   │   └── nesting-analyzer.ts
│   │   ├── generators/        # Output format generators
│   │   │   ├── typescript.ts
│   │   │   ├── json-schema.ts
│   │   │   ├── javascript.ts
│   │   │   └── zod.ts
│   │   └── utils/             # Shared utilities
│   ├── tests/
│   │   ├── unit/              # Unit tests for inference/generators
│   │   └── integration/       # End-to-end CLI tests
│   ├── package.json
│   └── README.md
│
└── vscode-envyconfig/         # VS Code extension
    ├── src/
    │   ├── extension.ts       # Extension entry point
    │   ├── commands/          # Command handlers
    │   │   ├── generate-env.ts
    │   │   ├── generate-types.ts
    │   │   └── quick-convert.ts
    │   ├── webview/           # WebView UI components
    │   │   ├── preview-panel.ts
    │   │   └── webview-content.ts
    │   ├── utils/             # Extension utilities
    │   │   ├── cli-executor.ts
    │   │   └── file-manager.ts
    │   └── types/             # Extension type definitions
    ├── media/                 # WebView assets (CSS, icons)
    ├── tests/                 # Extension tests
    ├── package.json           # VS Code extension manifest
    └── README.md
```

**Structure Decision**: Multi-package monorepo using pnpm workspaces. Three separate packages:
1. **env-y-config** - Standalone CLI tool for schema → .env conversion
2. **config-y-env** - Standalone CLI tool for .env → types conversion
3. **vscode-envyconfig** - VS Code extension that wraps both CLI tools

Each package has independent versioning and can be published separately to npm/VS Code marketplace. Shared utilities may be extracted to a common package if needed during implementation.

## Complexity Tracking

> **Constitution principle deviation justified below**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Zero-Runtime Dependencies (commander.js, ts-morph) | CLI tools require robust argument parsing and TypeScript AST manipulation | Building custom CLI parser would be 500+ lines, error-prone, and miss edge cases. ts-morph is the de-facto standard for TypeScript AST work with no lightweight alternative |
| Multiple new packages (3 packages vs 1) | CLI tools and VS Code extension are distinct deliverables with different lifecycles and distribution channels | Bundling all into core library would bloat package size, couple unrelated concerns, and make independent versioning impossible |

**Risk Mitigation**:
- Dependencies are dev dependencies for bundled CLI executables
- VS Code extension bundles dependencies (not runtime deps for users)
- Core envyconfig library remains zero-dependency
- Total added bundle size: ~2.5MB (acceptable for CLI/extension tooling)
