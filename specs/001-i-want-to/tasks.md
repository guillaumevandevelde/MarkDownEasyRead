# Tasks: Reader-Optimized Markdown Preview

**Input**: Design documents from `C:\develop\MarkDownEasyRead\specs\001-i-want-to\`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Extension root**: Repository root (`C:\develop\MarkDownEasyRead`)
- Source: `src/`
- Tests: `tests/`
- Webview: `src/webview/`

## Phase 3.1: Setup

- [ ] T001 Create VS Code extension project structure with package.json, tsconfig.json, and .vscode/launch.json at repository root
- [ ] T002 Install dependencies: @types/vscode, @types/node, typescript, markdown-it, @types/markdown-it, esbuild
- [ ] T003 [P] Configure TypeScript (tsconfig.json) with strict mode, ES2020 target, and VS Code extension settings
- [ ] T004 [P] Configure VS Code extension test runner with @vscode/test-electron and mocha in package.json
- [ ] T005 [P] Add ESLint configuration for TypeScript with VS Code extension rules

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

- [ ] T006 [P] Contract test for extension activation and command registration in tests/contract/extension.test.ts
- [ ] T007 [P] Contract test for webview message protocol (ready, update, zoomChange, zoomAdjust) in tests/contract/webview.test.ts
- [ ] T008 [P] Contract test for globalState zoom persistence (get/update operations) in tests/contract/storage.test.ts
- [ ] T009 [P] Integration test for preview rendering with formatted markdown in tests/integration/preview-render.test.ts
- [ ] T010 [P] Integration test for zoom controls (keyboard shortcuts and UI buttons) in tests/integration/zoom-controls.test.ts
- [ ] T011 [P] Integration test for theme adaptation (light/dark switching) in tests/integration/theme-adaptation.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Extension Host (TypeScript)

- [ ] T012 [P] Implement PreferenceManager class with globalState get/update methods in src/preferenceManager.ts
- [ ] T013 [P] Implement MarkdownRenderer class with markdown-it integration and HTML generation in src/markdownRenderer.ts
- [ ] T014 Create extension activation function registering CustomTextEditorProvider in src/extension.ts
- [ ] T015 Register VS Code commands (openPreview, zoomIn, zoomOut, resetZoom) in src/commands.ts
- [ ] T016 Implement PreviewProvider class managing webview lifecycle and message handling in src/previewProvider.ts
- [ ] T017 Wire PreviewProvider to load PreferenceManager default zoom on webview creation in src/previewProvider.ts
- [ ] T018 Implement file change watcher with 200ms debounce for live markdown updates in src/previewProvider.ts
- [ ] T019 Add webview message handling for zoomAdjust messages from UI in src/previewProvider.ts
- [ ] T020 Implement zoom persistence logic (update globalState on zoom change) in src/previewProvider.ts

### Webview Content (HTML/CSS/JS)

- [ ] T021 [P] Create webview HTML template with CSP nonce, container div, and zoom UI buttons in src/webview/index.html
- [ ] T022 [P] Implement reader-optimized CSS with responsive container queries, CSS variables for zoom, and VS Code theme variables in src/webview/style.css
- [ ] T023 [P] Add responsive layout rules for narrow/wide panels (FR-005, FR-006) in src/webview/style.css
- [ ] T024 [P] Implement smart wide-content handling CSS (wrap text, horizontal scroll for tables) in src/webview/style.css
- [ ] T025 [P] Create webview JavaScript for postMessage communication and zoom button handlers in src/webview/script.js
- [ ] T026 [P] Implement image error handling (onerror event → placeholder display) in src/webview/script.js
- [ ] T027 [P] Add CSS zoom application via CSS variables (--zoom-level) in src/webview/script.js

## Phase 3.4: Integration & Polish

- [ ] T028 Update package.json with extension manifest: commands, keybindings, customEditors contribution
- [ ] T029 Add VS Code activation events (onCommand, onLanguage:markdown) to package.json
- [ ] T030 Configure keybindings for zoom commands (Ctrl/Cmd +, -, 0) in package.json contributions
- [ ] T031 [P] Add unit test for markdown rendering edge cases (malformed syntax) in tests/unit/markdown-renderer.test.ts
- [ ] T032 [P] Add unit test for preference manager zoom range validation (0.5-3.0) in tests/unit/preference-manager.test.ts
- [ ] T033 Create test sample markdown file with images, tables, code blocks in tests/fixtures/sample.md
- [ ] T034 Run all contract tests and verify they pass
- [ ] T035 Run all integration tests and verify they pass
- [ ] T036 Execute manual quickstart validation (all 8 scenarios from quickstart.md)
- [ ] T037 [P] Add extension README.md with usage instructions, keybindings, and screenshots
- [ ] T038 [P] Create CHANGELOG.md documenting v1.0.0 features

## Dependencies

**Critical Path**:
```
Setup (T001-T005)
  → Tests (T006-T011) ⚠️ MUST COMPLETE FIRST
  → Core TypeScript (T012-T020)
  → Webview Assets (T021-T027)
  → Integration (T028-T030)
  → Polish (T031-T038)
```

**Blocking Relationships**:
- T001 blocks all other tasks
- T002 blocks T006-T011 (tests need dependencies)
- T006-T011 block T012-T027 (TDD: tests first)
- T012 blocks T020 (PreferenceManager needed for persistence)
- T013 blocks T016 (MarkdownRenderer needed for PreviewProvider)
- T014 blocks T016 (extension activation must register provider)
- T015 blocks T019 (commands must exist before handling)
- T016 blocks T017-T020 (PreviewProvider is the orchestrator)
- T021-T027 have no interdependencies (all [P])
- T028-T030 need T014-T027 complete (manifest references implementation)
- T034-T035 need T012-T030 complete (tests run against implementation)

## Parallel Execution Examples

### Parallel Block 1: Setup Configuration
```bash
# Can run T003, T004, T005 in parallel after T002
Task: "Configure TypeScript (tsconfig.json) with strict mode"
Task: "Configure VS Code extension test runner"
Task: "Add ESLint configuration"
```

### Parallel Block 2: Contract Tests
```bash
# Run T006-T011 together (all different files)
Task: "Contract test for extension activation in tests/contract/extension.test.ts"
Task: "Contract test for webview message protocol in tests/contract/webview.test.ts"
Task: "Contract test for globalState zoom persistence in tests/contract/storage.test.ts"
Task: "Integration test for preview rendering in tests/integration/preview-render.test.ts"
Task: "Integration test for zoom controls in tests/integration/zoom-controls.test.ts"
Task: "Integration test for theme adaptation in tests/integration/theme-adaptation.test.ts"
```

### Parallel Block 3: Core Components
```bash
# After tests fail, run T012-T013 in parallel (independent modules)
Task: "Implement PreferenceManager class in src/preferenceManager.ts"
Task: "Implement MarkdownRenderer class in src/markdownRenderer.ts"
```

### Parallel Block 4: Webview Assets
```bash
# Run T021-T027 in parallel (all independent webview files)
Task: "Create webview HTML template in src/webview/index.html"
Task: "Implement reader-optimized CSS in src/webview/style.css"
Task: "Add responsive layout rules in src/webview/style.css"
Task: "Implement smart wide-content handling CSS in src/webview/style.css"
Task: "Create webview JavaScript for postMessage in src/webview/script.js"
Task: "Implement image error handling in src/webview/script.js"
Task: "Add CSS zoom application in src/webview/script.js"
```

### Parallel Block 5: Documentation
```bash
# Run T037-T038 in parallel (independent doc files)
Task: "Add extension README.md with usage instructions"
Task: "Create CHANGELOG.md documenting v1.0.0 features"
```

## Notes

- **TDD Enforcement**: T006-T011 MUST be completed and failing before T012-T027 begin
- **Parallel Opportunities**: 19 tasks marked [P] can run concurrently with proper grouping
- **Commit Strategy**: Commit after each task completion
- **Test-Driven**: Verify tests pass after T012-T030 complete (T034-T035)
- **Manual Validation**: T036 requires human verification via quickstart.md scenarios

## Task Validation Checklist

Before marking this phase complete, ensure:
- [ ] All 38 tasks completed in order
- [ ] All contract tests (T006-T008) passing
- [ ] All integration tests (T009-T011) passing
- [ ] All unit tests (T031-T032) passing
- [ ] Manual quickstart validation (T036) passed all scenarios
- [ ] Extension loads without errors in VS Code Extension Development Host
- [ ] Zoom persists across VS Code restarts
- [ ] Theme adaptation works with light/dark themes
- [ ] Images render correctly (including error handling)
- [ ] Wide content (tables/code) displays with horizontal scroll

---

**Total Tasks**: 38
**Parallel Tasks**: 19 (50%)
**Estimated Completion**: ~15-20 hours for experienced VS Code extension developer

**Next**: Execute tasks sequentially respecting dependencies, or use parallel execution blocks for maximum efficiency.