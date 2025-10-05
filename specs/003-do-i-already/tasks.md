# Tasks: Right-Click Context Menu for Opening Preview

**Input**: Design documents from `/specs/003-do-i-already/`
**Prerequisites**: plan.md ✅, research.md ✅, contracts/editor-context-menu.contract.md ✅, quickstart.md ✅

## Execution Flow (main)
```
1. Load plan.md from feature directory
   → ✅ COMPLETE: TypeScript 5.3.3, VS Code Extension, ~50 lines of code
2. Load optional design documents:
   → ✅ research.md: VS Code editor context menu API decisions
   → ✅ contracts/: editor-context-menu.contract.md loaded
   → ✅ quickstart.md: 6-step validation guide loaded
   → ⚠️ data-model.md: N/A (no new entities)
3. Generate tasks by category:
   → Setup: No setup needed (existing VS Code extension)
   → Tests: Contract tests (3), Integration tests (4)
   → Core: Package.json changes (2), Command registration (4)
   → Integration: N/A (reuses existing infrastructure)
   → Polish: Documentation (2), Validation (1)
4. Apply task rules:
   → Contract tests [P] (different test files)
   → Package.json modifications [P] (separate sections)
   → Command implementation sequential (same file)
   → Integration tests [P] (different scenarios)
5. Number tasks sequentially (T001-T020)
6. Generate dependency graph
7. Create parallel execution examples
8. Validate task completeness:
   → ✅ Contract has tests (3 contract tests)
   → ✅ All scenarios covered (4 integration tests)
   → ✅ Tests before implementation (TDD enforced)
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`
- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions

## Path Conventions
- **Project Type**: Single project (VS Code extension)
- **Source**: `src/` at repository root
- **Tests**: `src/test/` subdirectories (contract/, integration/)
- **Config**: `package.json` at repository root

---

## Phase 3.1: Setup
*(No setup tasks needed - extending existing VS Code extension)*

---

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**

### Contract Tests (Must Fail)

- [x] **T001** [P] Write contract test for command registration in `src/test/contract/context-menu.test.ts`
  - **What**: Add test `should register showEasyReadPreview command`
  - **Assert**: Command `markdownEasyRead.showEasyReadPreview` exists in VS Code command registry
  - **Assert**: Command is registered during extension activation
  - **Assert**: Command disposable is tracked in context.subscriptions
  - **File**: Extend existing `src/test/contract/context-menu.test.ts`
  - **Expected**: ❌ FAIL (command not yet registered)
  - **Status**: ✅ COMPLETE - Test added

- [x] **T002** [P] Write contract test for command title in `src/test/contract/context-menu.test.ts`
  - **What**: Add test `should have correct command title`
  - **Assert**: Command title is exactly "Show Easy Read Preview"
  - **Assert**: Command is declared in package.json commands section
  - **File**: Extend existing `src/test/contract/context-menu.test.ts`
  - **Expected**: ❌ FAIL (command not in package.json)
  - **Status**: ✅ COMPLETE - Test added

- [x] **T003** [P] Write contract test for menu contribution in `src/test/contract/context-menu.test.ts`
  - **What**: Add test `should contribute editor context menu`
  - **Assert**: `contributes.menus.editor/context` contains command entry
  - **Assert**: `when` clause is `editorLangId == markdown`
  - **Assert**: No `icon` property (text-only menu item)
  - **File**: Extend existing `src/test/contract/context-menu.test.ts`
  - **Expected**: ❌ FAIL (menu not in package.json)
  - **Status**: ✅ COMPLETE - Test added

### Integration Tests (Must Fail)

- [x] **T004** [P] Write integration test for menu visibility in `src/test/integration/editor-context-menu.test.ts` (NEW FILE)
  - **What**: Test menu appears only for markdown files
  - **Scenario 1**: Open .md file → right-click → menu shows "Show Easy Read Preview"
  - **Scenario 2**: Open .js file → right-click → menu does NOT show "Show Easy Read Preview"
  - **Scenario 3**: Open .markdown, .mdown files → menu shows for all
  - **File**: Create new `src/test/integration/editor-context-menu.test.ts`
  - **Expected**: ❌ FAIL (menu not configured)

- [x] **T005** [P] Write integration test for preview opening in `src/test/integration/editor-context-menu.test.ts`
  - **What**: Test clicking menu opens preview
  - **Given**: Markdown file is active editor
  - **When**: Execute command `markdownEasyRead.showEasyReadPreview`
  - **Then**: Preview panel opens with rendered markdown content
  - **Then**: Preview viewType is `markdownEasyRead.preview`
  - **File**: Add to `src/test/integration/editor-context-menu.test.ts`
  - **Expected**: ❌ FAIL (command not implemented)

- [x] **T006** [P] Write integration test for focus behavior in `src/test/integration/editor-context-menu.test.ts`
  - **What**: Test command focuses existing preview (FR-007)
  - **Given**: Preview is already open for document X
  - **When**: Execute command `markdownEasyRead.showEasyReadPreview` again
  - **Then**: Existing preview panel is revealed/focused
  - **Then**: No duplicate preview panel is created
  - **Then**: Preview content remains unchanged
  - **File**: Add to `src/test/integration/editor-context-menu.test.ts`
  - **Expected**: ❌ FAIL (command not implemented)

- [x] **T007** [P] Write integration test for error handling in `src/test/integration/editor-context-menu.test.ts`
  - **What**: Test command fails gracefully with no active editor
  - **Given**: No active text editor
  - **When**: Execute command `markdownEasyRead.showEasyReadPreview`
  - **Then**: Command returns without error
  - **Then**: No error message shown to user
  - **File**: Add to `src/test/integration/editor-context-menu.test.ts`
  - **Expected**: ❌ FAIL (command not implemented)

### Verify Tests Fail

- [x] **T008** Run contract tests and verify failures
  - **Command**: `npm test -- src/test/contract/context-menu.test.ts`
  - **Expected**: 3 new tests fail (command registration, title, menu contribution)
  - **Action**: Verify all T001-T003 tests are present and failing
  - **Gate**: ❌ MUST FAIL before proceeding to Phase 3.3

- [x] **T009** Run integration tests and verify failures
  - **Command**: `npm test -- src/test/integration/editor-context-menu.test.ts`
  - **Expected**: 4 tests fail (menu visibility, preview opening, focus, error handling)
  - **Action**: Verify all T004-T007 tests are present and failing
  - **Gate**: ❌ MUST FAIL before proceeding to Phase 3.3

---

## Phase 3.3: Core Implementation (ONLY after tests are failing)

### Package.json Configuration

- [x] **T010** [P] Add command declaration to `package.json`
  - **What**: Add `markdownEasyRead.showEasyReadPreview` to `contributes.commands`
  - **Location**: `package.json` → `contributes.commands` array
  - **Content**:
    ```json
    {
      "command": "markdownEasyRead.showEasyReadPreview",
      "title": "Show Easy Read Preview"
    }
    ```
  - **Verify**: Command title is exactly "Show Easy Read Preview" (FR-005)
  - **File**: `package.json`
  - **Expected**: T002 contract test should pass after this

- [x] **T011** [P] Add menu contribution to `package.json`
  - **What**: Add `editor/context` menu contribution
  - **Location**: `package.json` → `contributes.menus.editor/context` (create if needed)
  - **Content**:
    ```json
    {
      "contributes": {
        "menus": {
          "editor/context": [
            {
              "command": "markdownEasyRead.showEasyReadPreview",
              "when": "editorLangId == markdown"
            }
          ]
        }
      }
    }
    ```
  - **Verify**: No `group` property (default positioning per FR-006)
  - **Verify**: No `icon` property (text-only per FR-008)
  - **File**: `package.json`
  - **Expected**: T003 contract test should pass after this

- [x] **T012** Validate package.json schema
  - **Command**: `npm run compile` (TypeScript will validate package.json references)
  - **Action**: Verify no schema validation errors
  - **Action**: Check VS Code recognizes new contributions (reload window in dev mode)
  - **Expected**: No errors, extension activates successfully

### Command Implementation

- [x] **T013** Register command in `src/extension.ts`
  - **What**: Add command registration in `activate()` function
  - **Location**: After existing command registrations (around line 72)
  - **Content**:
    ```typescript
    const showEasyReadPreviewCommand = vscode.commands.registerCommand(
      'markdownEasyRead.showEasyReadPreview',
      async () => {
        // Handler implementation in next tasks
      }
    );
    ```
  - **File**: `src/extension.ts`
  - **Dependencies**: After T010-T011 (package.json must be configured first)
  - **Expected**: T001 contract test should pass after this

- [x] **T014** Implement command handler logic in `src/extension.ts`
  - **What**: Add handler code inside command registration
  - **Logic**:
    1. Get active editor: `const editor = vscode.window.activeTextEditor;`
    2. Guard clause: `if (!editor || editor.document.languageId !== 'markdown') { return; }`
    3. Extract URI: `const uri = editor.document.uri;`
    4. Open preview: `await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview');`
  - **File**: `src/extension.ts` (same function as T013)
  - **Note**: Silently fail if not markdown (menu won't show anyway)
  - **Expected**: T005, T006, T007 integration tests should pass

- [x] **T015** Add disposable to subscriptions in `src/extension.ts`
  - **What**: Register command disposable for cleanup
  - **Location**: In `context.subscriptions.push()` around line 81
  - **Content**: Add `showEasyReadPreviewCommand` to the list
  - **File**: `src/extension.ts`
  - **Expected**: T001 contract test should fully pass (disposable tracked)

- [x] **T016** Add error handling (if needed) in `src/extension.ts`
  - **What**: Wrap `vscode.openWith` in try-catch if needed
  - **Decision**: Based on research.md, VS Code handles errors automatically
  - **Action**: Review command handler, add try-catch only if necessary
  - **File**: `src/extension.ts`
  - **Expected**: T007 integration test should pass (graceful failure)

---

## Phase 3.4: Integration
*(No integration tasks needed - reuses existing PreviewProvider and infrastructure)*

---

## Phase 3.5: Verification & Polish

### Test Verification

- [x] **T017** Run all contract tests and verify pass
  - **Command**: `npm test -- src/test/contract/context-menu.test.ts`
  - **Expected**: All 3 new tests pass (T001-T003 implemented)
  - **Action**: Verify command registration, title, menu contribution tests pass
  - **Gate**: ✅ MUST PASS before proceeding

- [x] **T018** Run all integration tests and verify pass
  - **Command**: `npm test -- src/test/integration/editor-context-menu.test.ts`
  - **Expected**: All 4 tests pass (T004-T007 implemented)
  - **Action**: Verify menu visibility, preview opening, focus, error handling tests pass
  - **Gate**: ✅ MUST PASS before proceeding

- [x] **T019** Run all existing tests for regression check
  - **Command**: `npm test`
  - **Expected**: All existing tests still pass (no regressions)
  - **Action**: Verify no breaking changes to existing functionality
  - **Action**: Check preview provider, zoom controls, theme adaptation still work
  - **Gate**: ✅ MUST PASS (no regressions allowed)

### Manual Validation

- [x] **T020** Execute quickstart.md manual validation
  - **File**: Follow steps in `specs/003-do-i-already/quickstart.md`
  - **Duration**: 5 minutes for main validation, 2 minutes for edge cases
  - **Steps**:
    1. Open markdown file → right-click → verify menu appears
    2. Click "Show Easy Read Preview" → verify preview opens
    3. Click menu again → verify existing preview is focused (no duplicate)
    4. Open non-markdown file → verify menu does NOT appear
    5. Test .markdown, .mdown extensions → verify menu appears
    6. Test zoom controls work with preview opened from context menu
  - **Expected**: All validation steps pass
  - **Action**: Document any issues found in quickstart.md
  - **Gate**: ✅ MUST PASS before documentation updates

### Documentation

- [x] **T021** [P] Update CHANGELOG.md
  - **What**: Add entry for editor context menu feature
  - **Section**: Under version 1.2.0 (or next version)
  - **Content**:
    - Added editor context menu option "Show Easy Read Preview"
    - Right-click in markdown document to access preview
    - Menu automatically focuses existing preview if already open
  - **File**: `CHANGELOG.md`
  - **Dependencies**: After T020 (validation passes)

- [x] **T022** [P] Update README.md
  - **What**: Document new context menu access method
  - **Section**: Under "Usage" → "Opening Preview"
  - **Content**: Add note about right-clicking in markdown editor
  - **Update**: Include "Show Easy Read Preview" in feature list if not already there
  - **File**: `README.md`
  - **Dependencies**: After T020 (validation passes)

---

## Dependencies

**Test Dependencies**:
- T001-T007 (write tests) have no dependencies [P] - can run in parallel
- T008-T009 (verify test failures) depend on T001-T007

**Implementation Dependencies**:
- T010-T011 (package.json) [P] - can run in parallel (different sections)
- T012 (validate package.json) depends on T010-T011
- T013 (register command) depends on T010-T011 (package.json must exist first)
- T014-T016 (implement handler) depend on T013 (command registration)

**Verification Dependencies**:
- T017 (contract tests pass) depends on T010-T015 (implementation complete)
- T018 (integration tests pass) depends on T010-T015 (implementation complete)
- T019 (regression tests) depends on T017-T018 (new tests pass)
- T020 (manual validation) depends on T019 (all tests pass)

**Documentation Dependencies**:
- T021-T022 (documentation) [P] - can run in parallel (different files)
- T021-T022 depend on T020 (validation complete)

**Critical Path**:
```
T001-T007 → T008-T009 → T010-T011 → T012 → T013 → T014-T016 → T017-T018 → T019 → T020 → T021-T022
```

**Parallel Execution Points**:
- T001, T002, T003, T004, T005, T006, T007 [7 parallel]
- T010, T011 [2 parallel]
- T021, T022 [2 parallel]

---

## Parallel Execution Examples

### Example 1: Write All Tests in Parallel (T001-T007)
```bash
# Launch 7 test-writing tasks together (different test files/cases):
Task 1: "Write contract test for command registration in src/test/contract/context-menu.test.ts"
Task 2: "Write contract test for command title in src/test/contract/context-menu.test.ts"
Task 3: "Write contract test for menu contribution in src/test/contract/context-menu.test.ts"
Task 4: "Write integration test for menu visibility in src/test/integration/editor-context-menu.test.ts"
Task 5: "Write integration test for preview opening in src/test/integration/editor-context-menu.test.ts"
Task 6: "Write integration test for focus behavior in src/test/integration/editor-context-menu.test.ts"
Task 7: "Write integration test for error handling in src/test/integration/editor-context-menu.test.ts"
```

**Note**: T001-T003 modify the same file (context-menu.test.ts), but different test cases within that file, so they CAN be parallelized if the tool supports merging changes to the same file. If not, run them sequentially.

### Example 2: Package.json Configuration (T010-T011)
```bash
# Launch 2 package.json tasks together (different sections):
Task 1: "Add command declaration to package.json contributes.commands"
Task 2: "Add menu contribution to package.json contributes.menus.editor/context"
```

### Example 3: Documentation Updates (T021-T022)
```bash
# Launch 2 documentation tasks together (different files):
Task 1: "Update CHANGELOG.md with editor context menu feature"
Task 2: "Update README.md with context menu usage instructions"
```

---

## Notes

### TDD Enforcement
- **Phase 3.2 MUST complete before Phase 3.3**
- Tests T001-T007 must be written first
- Tests T008-T009 must verify failures before any implementation
- Implementation tasks T010-T016 only after tests fail
- Verification tasks T017-T018 confirm tests now pass (green phase)

### Parallel Execution
- [P] tasks indicate different files or independent sections
- T001-T003 technically same file but different test cases (can merge)
- T004-T007 are in a new file, fully independent
- T010-T011 are different sections of package.json (can merge)
- T021-T022 are different files, fully independent

### File Modifications Summary
- **package.json**: T010 (commands), T011 (menus)
- **src/extension.ts**: T013 (register), T014 (handler), T015 (disposable), T016 (error handling)
- **src/test/contract/context-menu.test.ts**: T001, T002, T003 (extend existing)
- **src/test/integration/editor-context-menu.test.ts**: T004, T005, T006, T007 (new file)
- **CHANGELOG.md**: T021
- **README.md**: T022

### Key Constraints
- ✅ No new dependencies (uses existing VS Code API)
- ✅ No new files except test file (src/test/integration/editor-context-menu.test.ts)
- ✅ ~50 lines of new code total (T013-T016)
- ✅ Must work with existing PreviewProvider (no changes to provider)
- ✅ Must reuse vscode.openWith command (no custom panel creation)

### Performance Targets
- Menu registration: <100ms during activation (T013)
- Menu display: <50ms after right-click (VS Code handles this)
- Preview open/focus: <500ms (T014, tested in T005-T006)

---

## Validation Checklist
*GATE: Checked before marking feature complete*

- [x] All contracts have corresponding tests (T001-T003 for editor-context-menu.contract.md)
- [x] All entities have model tasks (N/A - no new entities)
- [x] All tests come before implementation (T001-T009 before T010-T016)
- [x] Parallel tasks truly independent (T001-T007, T010-T011, T021-T022 verified)
- [x] Each task specifies exact file path (all tasks include file paths)
- [x] No task modifies same file as another [P] task (verified - T001-T003 are mergeable, others independent)

---

**Total Tasks**: 22 (T001-T022)
**Parallel Execution Opportunities**: 11 tasks can run in parallel across 3 groups
**Estimated Time**: 2-3 hours total (1 hour tests, 1 hour implementation, 30min validation, 30min docs)
**Critical Path Length**: 12 sequential stages

**Ready for execution**: ✅ All tasks defined with clear acceptance criteria
