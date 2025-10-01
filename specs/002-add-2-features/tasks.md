# Tasks: Enhanced Code Display and Context Menu Preview

**Input**: Design documents from `/specs/002-add-2-features/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/, quickstart.md
**Branch**: `002-add-2-features`
**Feature**: Enhanced code syntax highlighting with auto-detection + context menu integration

## Execution Flow (main)
```
1. Load plan.md from feature directory ✅
   → Tech stack: TypeScript 5.3.3, VS Code Extension API, Highlight.js
   → Structure: Single project (VS Code extension)
2. Load design documents ✅
   → research.md: Highlight.js selected, 22 languages, performance targets
   → data-model.md: No persistent entities, runtime configuration only
   → contracts/: 3 contract files (SyntaxHighlighter, LanguageDetector, ContextMenuHandler)
   → quickstart.md: 40+ validation steps
3. Generate tasks by category ✅
   → Setup: Dependencies (Highlight.js), package.json updates
   → Tests: 3 contract tests, 2 integration tests
   → Core: 3 new classes, 3 existing file enhancements
   → Integration: Webview HTML/CSS, VS Code menu contribution
   → Polish: Unit tests, performance benchmarks, docs
4. Apply task rules ✅
   → Contract tests [P] (independent files)
   → Implementations sequential (shared markdownRenderer)
   → Integration tests [P] after implementations
5. Tasks numbered T001-T030 ✅
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- All paths relative to repository root: `src/`, `tests/`

---

## Phase 3.1: Setup & Dependencies

- [x] **T001** Install Highlight.js library
  **File**: `package.json`
  **Action**: Run `npm install highlight.js --save` and verify in dependencies
  **Verify**: highlight.js appears in package.json dependencies section

- [x] **T002** Update package.json with new VS Code contributions
  **File**: `package.json`
  **Action**: Add `menus` contribution for context menu, add `configuration` for previewPlacement setting
  **Details**:
  ```json
  "menus": {
    "explorer/context": [{
      "command": "markdownEasyRead.openPreviewFromExplorer",
      "when": "resourceExtname =~ /\\.(md|markdown|mdown|mkd|mkdn|mdwn|text)$/",
      "group": "navigation@10"
    }]
  },
  "configuration": {
    "properties": {
      "markdownEasyRead.previewPlacement": {
        "type": "string",
        "enum": ["replace", "beside", "default"],
        "default": "default"
      }
    }
  }
  ```

- [x] **T003** [P] Update tsconfig.json for new source files
  **File**: `tsconfig.json`
  **Action**: Verify include patterns cover `src/**/*.ts`
  **Verify**: No changes needed if wildcards already present

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

### Contract Tests (Write tests that will FAIL initially)

- [x] **T004** [P] Write SyntaxHighlighter contract tests
  **File**: `src/test/contract/syntax-highlighter.test.ts`
  **Tests**: 4 contract tests from `contracts/syntax-highlighter.contract.ts`
  1. Should highlight JavaScript code with correct tokens
  2. Should return supported language list (22+ languages)
  3. Should detect Python from code sample with confidence >30
  4. Should handle unknown language gracefully (fallback to plaintext)
  **Expected**: All tests FAIL (SyntaxHighlighter not implemented yet)

- [x] **T005** [P] Write LanguageDetector contract tests
  **File**: `src/test/contract/language-detector.test.ts`
  **Tests**: 3 contract tests from `contracts/language-detector.contract.ts`
  1. Should detect TypeScript with high confidence
  2. Should return null for non-code text (confidence <15)
  3. Should provide alternative language suggestions
  **Expected**: All tests FAIL (LanguageDetector not implemented yet)

- [x] **T006** [P] Write ContextMenuHandler contract tests
  **File**: `src/test/contract/context-menu.test.ts`
  **Tests**: 3 contract tests from `contracts/context-menu-handler.contract.ts`
  1. Should register context menu command on activation
  2. Should respect file extension filter (.md, .markdown, etc.)
  3. Should honor preview placement preference from settings
  **Expected**: All tests FAIL (ContextMenuHandler not implemented yet)

---

## Phase 3.3: Core Implementations (Make Tests Pass)

### New Source Files

- [x] **T007** Implement SyntaxHighlighter class
  **File**: `src/syntaxHighlighter.ts`
  **Dependencies**: Highlight.js library (T001)
  **Interface**: From `contracts/syntax-highlighter.contract.ts`
  **Methods**:
  - `highlight(code: string, language: string): HighlightedCode`
  - `getSupportedLanguages(): string[]` - return 22 languages from research.md
  - `detectLanguage(code: string): LanguageDetectionResult` - use hljs.highlightAuto()
  **Expected**: T004 tests pass

- [x] **T008** Implement LanguageDetector class
  **File**: `src/languageDetector.ts`
  **Dependencies**: Highlight.js (T001)
  **Interface**: From `contracts/language-detector.contract.ts`
  **Methods**:
  - `detect(code: string): LanguageDetectionResult` - wrapper around hljs.highlightAuto()
  - `detectWithAlternatives(code: string): LanguageDetectionResult[]` - use second_best from hljs
  **Expected**: T005 tests pass

- [x] **T009** Implement ContextMenuHandler class
  **File**: `src/contextMenuHandler.ts`
  **Dependencies**: VS Code API, PreferenceManager (existing)
  **Interface**: From `contracts/context-menu-handler.contract.ts`
  **Methods**:
  - `openPreviewInPreferredLocation(uri: Uri): Promise<void>`
  - `getPreviewPlacement(): PreviewPlacementPreference` - read from settings
  **Expected**: T006 tests pass

### Enhance Existing Files

- [x] **T010** Enhance MarkdownRenderer with syntax highlighting
  **File**: `src/markdownRenderer.ts`
  **Dependencies**: SyntaxHighlighter (T007), LanguageDetector (T008)
  **Changes**:
  - Import SyntaxHighlighter and LanguageDetector
  - Override markdown-it code fence rendering
  - For each code block: detect language if no tag, highlight, wrap in container with copy button
  - Handle language mismatch warnings
  **Test**: Manually verify highlighted output in preview

- [x] **T011** Add preview placement preference to PreferenceManager
  **File**: `src/preferenceManager.ts`
  **Changes**:
  - Add `getPreviewPlacement(): PreviewPlacementPreference` method
  - Read from `markdownEasyRead.previewPlacement` config
  **Test**: Verify setting can be read and defaults to 'default'

- [x] **T012** Register context menu command in extension.ts
  **File**: `src/extension.ts`
  **Dependencies**: ContextMenuHandler (T009)
  **Changes**:
  - Import ContextMenuHandler
  - Register command `markdownEasyRead.openPreviewFromExplorer`
  - Wire command to ContextMenuHandler.openPreviewInPreferredLocation()
  **Test**: Right-click .md file in explorer, verify menu option appears

---

## Phase 3.4: Webview Integration

- [x] **T013** Update webview HTML with code block enhancements
  **File**: `src/previewProvider.ts` (getWebviewContent method)
  **Changes**:
  - Add CSS for syntax highlighting (Highlight.js themes)
  - Add CSS for line numbers (CSS counters)
  - Add CSS for copy button positioning
  - Add JavaScript for copy button click handler
  **CSS**: Import from Highlight.js theme (light/dark/high-contrast variants)
  **Test**: Code blocks render with colors, line numbers, copy buttons

- [x] **T014** Add Highlight.js CSS theme integration
  **File**: `src/previewProvider.ts`
  **Dependencies**: T013
  **Changes**:
  - Dynamically select Highlight.js theme based on VS Code theme
  - Map vscode.ColorThemeKind to Highlight.js theme (github.css, github-dark.css, etc.)
  **Test**: Switch VS Code theme, verify syntax colors adapt

- [x] **T015** Implement copy button JavaScript in webview
  **File**: `src/previewProvider.ts` (getWebviewContent script section)
  **Changes**:
  - Add event listeners to all `.copy-button` elements
  - Use `navigator.clipboard.writeText()` (available in webview)
  - Show "Copied!" feedback for 2 seconds
  **Test**: Click copy button, paste in editor, verify code without line numbers

---

## Phase 3.5: Integration Tests

- [ ] **T016** [P] Write code display integration tests
  **File**: `src/test/integration/code-display.test.ts`
  **Scenarios** (from quickstart.md):
  1. Render markdown with tagged JavaScript code → verify highlighted, line numbers, copy button
  2. Render markdown with untagged code → verify auto-detected and highlighted
  3. Render markdown with language mismatch → verify warning badge shown
  **Setup**: Create test markdown files with code blocks
  **Expected**: May fail until implementations complete

- [ ] **T017** [P] Write context menu integration tests
  **File**: `src/test/integration/context-menu.test.ts`
  **Scenarios** (from quickstart.md):
  1. Open .md file from context menu → verify preview opens in configured location
  2. Right-click non-markdown file → verify menu option absent
  3. Test .markdown, .mdown extensions → verify menu option present
  **Expected**: May fail until implementations complete

---

## Phase 3.6: Unit Tests (Additional Coverage)

- [ ] **T018** [P] Write SyntaxHighlighter unit tests
  **File**: `src/test/unit/syntax-highlighter.test.ts`
  **Tests**: Edge cases beyond contract tests
  - Test all 22 supported languages
  - Test very long code blocks (500+ lines)
  - Test code with special characters and unicode
  - Test confidence threshold edge cases (14, 15, 16, 30, 31)
  **Coverage target**: >80% for SyntaxHighlighter class

- [ ] **T019** [P] Write LanguageDetector unit tests
  **File**: `src/test/unit/language-detector.test.ts`
  **Tests**: Edge cases beyond contract tests
  - Test ambiguous code (could be multiple languages)
  - Test empty string and whitespace-only
  - Test code snippets <10 characters
  - Test language detection accuracy for common languages
  **Coverage target**: >80% for LanguageDetector class

- [ ] **T020** [P] Write ContextMenuHandler unit tests
  **File**: `src/test/unit/context-menu.test.ts`
  **Tests**: Edge cases
  - Test all 3 preview placement modes
  - Test with no settings (default behavior)
  - Test with invalid setting values (should fallback to default)
  **Coverage target**: >80% for ContextMenuHandler class

---

## Phase 3.7: Performance & Validation

- [ ] **T021** Run performance benchmarks
  **Action**: Measure render time for test files (10KB, 100KB, 500KB, 1MB)
  **Baseline**: From research.md - current: 15ms, 85ms, 380ms, 720ms
  **Target**: <20% increase (18ms, 102ms, 456ms, 864ms)
  **Files**: Create test markdown files with many code blocks
  **Verify**: Performance targets met

- [ ] **T022** Verify bundle size impact
  **Action**: Run `npm run package` and check `out/extension.js` size
  **Baseline**: 155KB (from previous feature)
  **Target**: <255KB (+100KB limit)
  **Expected**: ~210-220KB (155KB + 55KB for Highlight.js + languages)

- [ ] **T023** Execute quickstart manual validation
  **File**: `specs/002-add-2-features/quickstart.md`
  **Action**: Follow all 40+ validation steps
  - Feature 1: Syntax highlighting, line numbers, copy button (6 tests)
  - Feature 2: Context menu integration (6 tests)
  - Performance tests (2 tests)
  - Edge case tests (3 tests)
  - Regression tests (2 tests)
  - Accessibility tests (2 tests)
  **Document**: Mark checkboxes in quickstart.md as you complete each test

---

## Phase 3.8: Documentation & Polish

- [x] **T024** [P] Update README.md with new features
  **File**: `README.md`
  **Changes**:
  - Add "Syntax Highlighting" section with screenshot
  - Add "Context Menu" section
  - List 22 supported languages
  - Document preview placement setting
  **Include**: Usage examples, configuration options

- [x] **T025** [P] Update CHANGELOG.md
  **File**: `CHANGELOG.md`
  **Changes**:
  - Add version 1.1.0 section
  - List new features: syntax highlighting, language auto-detection, context menu
  - List improvements: 22 language support, copy button, line numbers
  - Note performance impact: ~12% render time increase
  **Format**: Keep Markdown format style

- [ ] **T026** [P] Add JSDoc comments to new classes
  **Files**: `src/syntaxHighlighter.ts`, `src/languageDetector.ts`, `src/contextMenuHandler.ts`
  **Action**: Add comprehensive JSDoc comments for all public methods
  **Include**: @param, @returns, @example annotations

- [x] **T027** Run ESLint and fix violations
  **Action**: Run `npm run lint`
  **Fix**: Any linting errors in new files
  **Expected**: Zero errors, zero warnings

- [ ] **T028** Run all tests and verify pass
  **Action**: Run `npm test`
  **Expected**: All contract tests pass (T004-T006), all integration tests pass (T016-T017), all unit tests pass (T018-T020)
  **Coverage**: Overall coverage >75%

- [ ] **T029** Test extension in VS Code development host
  **Action**: Press F5 to launch Extension Development Host
  **Test**: Open markdown file with code blocks, verify all features work
  **Verify**: No console errors, no performance issues

- [ ] **T030** Create .vsix package for release
  **Action**: Run `npm run package && npx vsce package`
  **Verify**: `markdown-easy-read-1.1.0.vsix` created successfully
  **Test**: Install .vsix in clean VS Code, verify all features work

---

## Dependency Graph

```
T001 (Install Highlight.js)
  ↓
T007 (SyntaxHighlighter) ← T004 (contract tests)
  ↓
T008 (LanguageDetector) ← T005 (contract tests)
  ↓
T010 (Enhance MarkdownRenderer)
  ↓
T013 (Webview HTML/CSS)
  ↓
T014 (Theme integration)
  ↓
T015 (Copy button JS)

T002 (package.json menus) → T009 (ContextMenuHandler) ← T006 (contract tests)
                              ↓
                           T011 (PreferenceManager)
                              ↓
                           T012 (Register command)

T016, T017 (Integration tests) - run after T015 + T012 complete
T018, T019, T020 (Unit tests) - can run in parallel anytime after T007-T009
T021-T023 (Performance & validation) - run after all tests pass
T024-T027 (Documentation) - can run in parallel anytime
T028-T030 (Final validation & packaging) - run last
```

---

## Parallel Execution Examples

### Batch 1: Contract Tests (after T001-T003)
```bash
# All independent files, run in parallel
- T004: tests/contract/syntax-highlighter.test.ts
- T005: tests/contract/language-detector.test.ts
- T006: tests/contract/context-menu.test.ts
```

### Batch 2: Core Implementations (after contract tests written)
```bash
# Different files, can implement in parallel
- T007: src/syntaxHighlighter.ts
- T008: src/languageDetector.ts
- T009: src/contextMenuHandler.ts
```

### Batch 3: Integration Tests (after T015 + T012)
```bash
# Different test files, run in parallel
- T016: tests/integration/code-display.test.ts
- T017: tests/integration/context-menu.test.ts
```

### Batch 4: Unit Tests (after T007-T009)
```bash
# Different test files, run in parallel
- T018: tests/unit/syntax-highlighter.test.ts
- T019: tests/unit/language-detector.test.ts
- T020: tests/unit/context-menu.test.ts
```

### Batch 5: Documentation (after T015)
```bash
# Different files, run in parallel
- T024: README.md
- T025: CHANGELOG.md
- T026: JSDoc comments
```

---

## Validation Checklist

Before marking feature complete, verify:
- [ ] All 30 tasks completed
- [ ] All tests passing (contract + integration + unit)
- [ ] Performance targets met (<20% render time increase)
- [ ] Bundle size <255KB
- [ ] Quickstart validation 100% complete
- [ ] ESLint clean (0 errors)
- [ ] Extension works in development host (F5)
- [ ] .vsix package installs and works correctly
- [ ] README and CHANGELOG updated
- [ ] No console errors in webview
- [ ] All 22 languages highlighting correctly
- [ ] Context menu works for all 7 markdown extensions
- [ ] Copy button copies code without line numbers
- [ ] Preview placement setting respected

**Estimated Time**: 16-20 hours total
**Parallelizable**: ~40% of tasks (marked with [P])
**Critical Path**: T001 → T007 → T010 → T013 → T015 (syntax highlighting)

---

**Next**: Execute tasks in order. Use TDD approach - write tests first (T004-T006), see them fail, implement features (T007-T015), see them pass.
