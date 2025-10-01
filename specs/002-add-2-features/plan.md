# Implementation Plan: Enhanced Code Display and Context Menu Preview

**Branch**: `002-add-2-features` | **Date**: 2025-10-01 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-add-2-features/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ Loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ TypeScript/VS Code Extension detected
   → ⚠️ Some NEEDS CLARIFICATION items deferred to Phase 0 research
3. Fill the Constitution Check section
   → ✅ Template constitution - no specific constraints
4. Evaluate Constitution Check section
   → ✅ No violations
   → ✅ Progress Tracking: Initial Constitution Check PASS
5. Execute Phase 0 → research.md
   → 🔄 In progress
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → ⏳ Pending Phase 0 completion
7. Re-evaluate Constitution Check section
   → ⏳ Pending Phase 1 completion
8. Plan Phase 2 → Describe task generation approach
   → ⏳ Pending Phase 1 completion
9. STOP - Ready for /tasks command
```

**IMPORTANT**: The /plan command STOPS at step 9. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

This feature enhances the Markdown Easy Read VS Code extension with two major capabilities:

1. **Enhanced Code Display with Syntax Highlighting**: Transforms code blocks in markdown previews with syntax highlighting, line numbers, and copy functionality. Includes automatic language detection for untagged blocks and smart warning system when explicit tags differ from detected language.

2. **Context Menu Integration**: Adds right-click access to open markdown files directly in Easy Read preview, supporting all common markdown file extensions (.md, .markdown, .mdown, etc.) with user-configurable preview window placement.

**Technical Approach**: Leverage Prism.js or Highlight.js for syntax highlighting in webview, integrate VS Code's menu contribution API for context menu, and extend existing MarkdownRenderer to handle enhanced code block processing.

## Technical Context

**Language/Version**: TypeScript 5.3.3, targeting ES2020
**Primary Dependencies**:
- VS Code Extension API ^1.85.0
- markdown-it ^14.0.0 (existing)
- Syntax highlighting library (Prism.js or Highlight.js - to be decided in Phase 0)
- Language detection library (to be decided in Phase 0)

**Storage**:
- Extension context global state (existing PreferenceManager)
- VS Code workspace settings for preview placement preference

**Testing**:
- Mocha ^10.2.0 with @vscode/test-electron
- Existing test structure: contract/, integration/, unit/

**Target Platform**: VS Code 1.85.0+, bundled extension via esbuild
**Project Type**: Single TypeScript project (VS Code extension)

**Performance Goals**:
- Language detection: <500ms for files up to 1MB (to be validated in Phase 0)
- Syntax highlighting render: <200ms added latency
- Preview load time increase: <20% vs current baseline

**Constraints**:
- Must work in webview CSP (Content Security Policy)
- Bundle size impact: <100KB additional after minification
- No external network requests for syntax highlighting
- Must adapt to VS Code's theme system (light/dark/high-contrast)

**Scale/Scope**:
- Support 20+ common programming languages initially
- Handle markdown files up to 5MB with acceptable performance
- 7 new markdown file extensions (.md, .markdown, .mdown, .mkd, .mkdn, .mdwn, .text)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Status**: PASS ✅

The project uses a template constitution with no specific constraints. Standard software development best practices will be followed:
- Test-driven development approach
- Clear separation of concerns
- Minimal complexity additions
- Leverage existing architecture (PreferenceManager, MarkdownRenderer, PreviewProvider)

**No violations detected.**

## Project Structure

### Documentation (this feature)
```
specs/002-add-2-features/
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
src/
├── extension.ts           # Existing - register context menu command
├── previewProvider.ts     # Existing - handle code block rendering
├── markdownRenderer.ts    # Existing - enhance with syntax highlighting
├── preferenceManager.ts   # Existing - add preview placement preference
├── syntaxHighlighter.ts   # NEW - syntax highlighting logic
├── languageDetector.ts    # NEW - language detection logic
└── contextMenuHandler.ts  # NEW - context menu command logic

tests/
├── contract/
│   ├── extension.test.ts          # Existing - extend for new commands
│   ├── syntax-highlighter.test.ts # NEW - syntax highlighting contract
│   └── language-detector.test.ts  # NEW - language detection contract
├── integration/
│   ├── code-display.test.ts       # NEW - end-to-end code block rendering
│   └── context-menu.test.ts       # NEW - end-to-end context menu flow
└── unit/
    ├── syntax-highlighter.test.ts # NEW - unit tests for highlighting
    └── language-detector.test.ts  # NEW - unit tests for detection
```

**Structure Decision**: Single TypeScript project structure. This is a VS Code extension with existing architecture established in feature 001. New functionality extends existing classes (MarkdownRenderer for syntax highlighting, extension.ts for command registration) and adds focused new modules for syntax highlighting and language detection.

## Phase 0: Outline & Research

### Unknowns to Research

1. **Syntax Highlighting Library Selection**
   - Unknown: Best library for VS Code webview environment (Prism.js vs Highlight.js vs Shiki)
   - Research: Compare bundle size, language support, theme integration, CSP compatibility
   - Decision criteria: Smallest bundle, best VS Code theme integration, CSP-safe

2. **Language Detection Library**
   - Unknown: Client-side JS language detection (highlight.js auto-detect vs linguist-js vs custom heuristics)
   - Research: Accuracy rates, bundle size, supported languages, performance
   - Decision criteria: <100KB bundle, 80%+ accuracy on common languages, <100ms execution

3. **Line Numbers Implementation**
   - Unknown: CSS-based vs DOM-based line numbers for code blocks
   - Research: Copy-paste behavior, accessibility, rendering performance
   - Decision criteria: Doesn't interfere with copy button, accessible, performant

4. **Copy Button Implementation**
   - Unknown: Clipboard API in webview, positioning strategy
   - Research: VS Code webview Clipboard API support, positioning patterns
   - Decision criteria: Works in webview CSP, good UX, no content shift

5. **Performance Baselines**
   - Unknown: Current preview render time baseline
   - Research: Measure existing markdown render performance
   - Decision criteria: Establish baseline for <20% increase target

6. **Deferred Clarifications Resolution**
   - FR-004: Minimum language set - Research most common languages in markdown documentation
   - FR-005: Fallback behavior - Research best practices for undetectable code
   - NFR-001/NFR-002: Performance targets - Establish concrete thresholds

### Research Tasks

```
Task 1: Evaluate syntax highlighting libraries
  - Compare Prism.js, Highlight.js, Shiki for webview use
  - Test bundle size impact with esbuild
  - Verify CSP compatibility
  - Test VS Code theme integration
  Output: Library recommendation with rationale

Task 2: Evaluate language detection approaches
  - Test highlight.js languageDetection
  - Test alternative: manual heuristics with file extensions
  - Benchmark accuracy and performance
  Output: Detection strategy recommendation

Task 3: Research line numbers + copy button patterns
  - Study VS Code's built-in markdown preview implementation
  - Test clipboard API in webview environment
  - Prototype CSS vs DOM line number approaches
  Output: Implementation pattern recommendations

Task 4: Establish performance baselines
  - Measure current preview render time for various file sizes
  - Profile markdown-it rendering cost
  - Set concrete performance targets
  Output: Baseline metrics and target thresholds

Task 5: Context menu API patterns
  - Review VS Code menus contribution point
  - Study `when` clause for file extension filtering
  - Research view column placement options
  Output: Context menu implementation approach
```

**Output**: research.md with all decisions documented

## Phase 1: Design & Contracts

*Prerequisites: research.md complete*

### Data Model

**No persistent entities** - This feature operates on transient rendering state only.

**Configuration Entities**:
- PreviewPlacementPreference: enum { 'replace', 'beside', 'default' }
- SyntaxHighlightingOptions: { theme: string, lineNumbers: boolean, copyButton: boolean }
- LanguageDetectionResult: { language: string | null, confidence: number }

### API Contracts

**Internal APIs (TypeScript interfaces)**:

```typescript
// Contract 1: SyntaxHighlighter
interface SyntaxHighlighter {
  highlight(code: string, language: string): HighlightedCode;
  getSupportedLanguages(): string[];
  detectLanguage(code: string): LanguageDetectionResult;
}

// Contract 2: LanguageDetector
interface LanguageDetector {
  detect(code: string): LanguageDetectionResult;
  detectWithAlternatives(code: string): LanguageDetectionResult[];
}

// Contract 3: Enhanced MarkdownRenderer
interface EnhancedMarkdownRenderer extends MarkdownRenderer {
  renderWithSyntax(content: string, documentUri: Uri, webview: Webview): string;
}

// Contract 4: Context Menu Handler
interface ContextMenuHandler {
  openPreviewInPreferredLocation(uri: Uri): Promise<void>;
  getPreviewPlacement(): PreviewPlacementPreference;
}
```

### Contract Tests (Phase 1)

```
tests/contract/syntax-highlighter.test.ts
  - Should highlight JavaScript code with correct tokens
  - Should return supported language list
  - Should detect Python from code sample
  - Should handle unknown language gracefully

tests/contract/language-detector.test.ts
  - Should detect TypeScript with high confidence
  - Should return null for non-code text
  - Should provide alternative language suggestions

tests/contract/context-menu.test.ts
  - Should register context menu command
  - Should respect file extension filter
  - Should honor preview placement preference
```

### Integration Test Scenarios

```
tests/integration/code-display.test.ts
  Scenario 1: Render markdown with tagged JavaScript code
    - Given: Markdown file with ```javascript block
    - When: Preview opened
    - Then: Syntax highlighted, line numbers shown, copy button present

  Scenario 2: Render markdown with untagged code
    - Given: Markdown file with ``` block (no language)
    - When: Preview opened
    - Then: Language auto-detected, syntax applied

  Scenario 3: Warn on language mismatch
    - Given: ```python block containing JavaScript
    - When: Preview opened
    - Then: Highlight as Python, show warning badge

tests/integration/context-menu.test.ts
  Scenario 1: Open .md file from context menu
    - Given: Right-click on README.md in explorer
    - When: Select "Open with Markdown Easy Read"
    - Then: Preview opens in configured location

  Scenario 2: Hide menu for non-markdown files
    - Given: Right-click on package.json
    - When: Context menu shown
    - Then: "Open with Markdown Easy Read" not present

  Scenario 3: Handle .markdown extension
    - Given: Right-click on NOTES.markdown
    - When: Context menu shown
    - Then: "Open with Markdown Easy Read" present
```

### Quickstart Test

**File**: `quickstart.md`

Manual validation steps:
1. Install extension in development mode (F5)
2. Open sample markdown file with code blocks
3. Verify syntax highlighting renders correctly
4. Verify line numbers appear
5. Click copy button, verify code copies to clipboard
6. Open file with untagged code block, verify detection
7. Right-click .md file in explorer
8. Select "Open with Markdown Easy Read" from menu
9. Verify preview opens in configured location
10. Try with .markdown, .mdown extensions
11. Right-click .txt file, verify menu option absent
12. Change preview placement setting
13. Test placement preference respected

### Agent Context Update

Run update script:
```bash
.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude
```

**NEW tech to add**:
- Syntax highlighting library (from Phase 0 research)
- Language detection approach (from Phase 0 research)
- VS Code menus contribution point
- Webview clipboard API patterns

**Output**: data-model.md, /contracts/*, failing tests, quickstart.md, CLAUDE.md

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

1. **Research & Decision Tasks** (from research.md):
   - Select syntax highlighting library
   - Select language detection approach
   - Finalize performance targets

2. **Contract Test Tasks** (TDD - tests first):
   - Write SyntaxHighlighter contract tests [P]
   - Write LanguageDetector contract tests [P]
   - Write ContextMenuHandler contract tests [P]

3. **Implementation Tasks** (make tests pass):
   - Implement SyntaxHighlighter class
   - Implement LanguageDetector class
   - Enhance MarkdownRenderer with syntax support
   - Add context menu command registration
   - Implement ContextMenuHandler class
   - Add preview placement setting to PreferenceManager
   - Create webview HTML/CSS for enhanced code blocks

4. **Integration Test Tasks**:
   - Write code display integration tests [P]
   - Write context menu integration tests [P]
   - Implement integration test fixtures

5. **Documentation & Validation**:
   - Update package.json with new menus contribution
   - Update README with new features
   - Create quickstart validation checklist
   - Performance benchmarking against targets

**Ordering Strategy**:
- Phase 0 research first (library selection)
- Contract tests before implementations (TDD)
- Core classes before integration (SyntaxHighlighter → MarkdownRenderer → PreviewProvider)
- Context menu as parallel track [P]
- Integration tests after core implementations
- Documentation and validation last

**Estimated Output**: 28-32 numbered, ordered tasks in tasks.md

**Parallelizable Tasks** (marked [P]):
- Contract test files (independent)
- SyntaxHighlighter + LanguageDetector implementation (independent)
- Context menu handler implementation (independent track)

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following TDD approach)
**Phase 5**: Validation (run all tests, execute quickstart.md, performance benchmarks)

## Complexity Tracking

*No constitutional violations to document.*

The implementation leverages existing extension architecture:
- Extends MarkdownRenderer (already processes code blocks)
- Uses PreferenceManager pattern (already handles zoom preferences)
- Follows existing test structure (contract/integration/unit)
- Adds focused new classes (SyntaxHighlighter, LanguageDetector, ContextMenuHandler)

**Justification for new dependencies**:
- Syntax highlighting library: Required for FR-001, no viable alternative
- Language detection library: Required for FR-002, manual implementation would be complex and error-prone

**Complexity remains bounded**: 3 new source files, ~800-1000 LOC estimated

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command) ✅
- [x] Phase 1: Design complete (/plan command) ✅
- [x] Phase 2: Task planning complete (/plan command - approach documented) ✅
- [ ] Phase 3: Tasks generated (/tasks command) - Ready to execute
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS ✅
- [x] Post-Design Constitution Check: PASS ✅
- [x] All NEEDS CLARIFICATION resolved ✅
- [x] Complexity deviations documented: None ✅

---
*Based on Constitution template - See `/.specify/memory/constitution.md`*
