# Implementation Plan: Right-Click Context Menu for Opening Preview

**Branch**: `003-do-i-already` | **Date**: 2025-10-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-do-i-already/spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ COMPLETE: Spec loaded and analyzed
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ COMPLETE: All clarifications resolved, VS Code extension context identified
3. Fill the Constitution Check section based on the content of the constitution document.
   → ✅ COMPLETE: Constitution is template-based, no specific constraints for this project
4. Evaluate Constitution Check section below
   → ✅ COMPLETE: No violations (adding menu to existing VS Code extension)
5. Execute Phase 0 → research.md
   → IN PROGRESS
6. Execute Phase 1 → contracts, data-model.md, quickstart.md
   → PENDING
7. Re-evaluate Constitution Check section
   → PENDING
8. Plan Phase 2 → Describe task generation approach
   → PENDING
9. STOP - Ready for /tasks command
   → PENDING
```

**IMPORTANT**: The /plan command STOPS at step 8. Phases 2-4 are executed by other commands:
- Phase 2: /tasks command creates tasks.md
- Phase 3-4: Implementation execution (manual or via tools)

## Summary

Add an editor context menu option "Show Easy Read Preview" that allows users to right-click within an active markdown document and open the Markdown Easy Read preview. This provides an additional access method alongside the existing command palette and file explorer context menu options. The feature focuses the existing preview if one is already open, requires no icon, and uses VS Code's default menu positioning.

## Technical Context

**Language/Version**: TypeScript 5.3.3, Node 20.x
**Primary Dependencies**: VS Code API ^1.85.0, markdown-it ^14.0.0
**Storage**: VS Code workspace state (existing PreferenceManager)
**Testing**: Mocha ^10.2.0 with @vscode/test-electron ^2.3.8
**Target Platform**: VS Code Extension (cross-platform: Windows, macOS, Linux)
**Project Type**: Single project (VS Code extension)
**Performance Goals**: <50ms menu registration, instant context menu display
**Constraints**: Must work with existing PreviewProvider, reuse existing command infrastructure
**Scale/Scope**: Single new menu contribution + command registration, ~50 lines of new code

**Existing Infrastructure**:
- ✅ PreviewProvider already handles preview lifecycle
- ✅ ContextMenuHandler exists for file explorer menu
- ✅ Command `markdownEasyRead.openPreview` opens preview from active editor
- ✅ Extension architecture supports multiple access methods

**Key Discovery**: The specification asks about adding editor context menu, but the extension already has:
1. File explorer context menu (`markdownEasyRead.openPreviewFromExplorer`)
2. Command palette command (`markdownEasyRead.openPreview`)
3. Custom editor provider that handles "Open With" menu

**What's Missing**: Editor context menu (right-click within the document text area) is NOT yet implemented. This is the gap this feature fills.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Constitutional Requirements** (from template-based constitution):
- No specific constitution file with enforced principles exists
- Default software engineering best practices apply
- TDD approach preferred (tests before implementation)
- Integration testing for new VS Code API integrations

**Compliance Status**:
- ✅ No new complexity introduced (simple menu + command registration)
- ✅ Reuses existing preview infrastructure
- ✅ Follows VS Code extension patterns already established in codebase
- ✅ No architectural changes required

**Gate Status**: PASS - No violations or deviations

## Project Structure

### Documentation (this feature)
```
specs/003-do-i-already/
├── spec.md              # Feature specification (complete)
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (in progress)
├── data-model.md        # Phase 1 output (N/A - no new data entities)
├── quickstart.md        # Phase 1 output (pending)
└── contracts/           # Phase 1 output (pending)
    └── editor-context-menu.contract.md
```

### Source Code (repository root)
```
src/
├── extension.ts                          # [MODIFY] Register editor context menu command
├── contextMenuHandler.ts                 # [REUSE] Existing handler, may extend
├── previewProvider.ts                    # [REUSE] Existing preview logic
└── test/
    ├── contract/
    │   └── context-menu.test.ts          # [EXISTS] Extend for editor menu
    └── integration/
        └── editor-context-menu.test.ts   # [NEW] Integration test for editor menu

package.json                              # [MODIFY] Add editor context menu contribution
```

**Structure Decision**: Single project structure. This is a VS Code extension following standard extension layout. New feature adds:
1. Menu contribution point in package.json (`editor/context` menu)
2. Command registration in extension.ts (may reuse existing `openPreview` command or create new variant)
3. Test coverage for new menu integration point

## Phase 0: Outline & Research

### Research Tasks

**Task 1: VS Code Editor Context Menu API**
- **Question**: What's the correct contribution point for editor context menus?
- **Research**: VS Code Contribution Points documentation
- **Output**: Menu configuration structure for `editor/context`

**Task 2: Menu Visibility Conditions**
- **Question**: How to show menu only for markdown files?
- **Research**: VS Code `when` clause expressions, `resourceLangId` context key
- **Output**: Correct `when` clause for markdown language detection

**Task 3: Focus Existing Preview Behavior**
- **Question**: How to detect and focus existing preview panel?
- **Research**: VS Code WebviewPanel API, `reveal()` method, panel tracking
- **Output**: Implementation approach for focusing existing preview

**Task 4: Command Reuse vs New Command**
- **Question**: Reuse `markdownEasyRead.openPreview` or create new command?
- **Research**: Existing command behavior, focus logic requirements
- **Output**: Decision on command architecture

### Research Execution

✅ **Complete**: research.md generated with all findings

**Output**: research.md with all NEEDS CLARIFICATION resolved

---

## Phase 1: Design & Contracts

*Prerequisites: research.md complete ✅*

### 1. Data Model

**Decision**: No data-model.md needed
**Rationale**: Feature adds menu integration only, no new data entities, state, or persistence

### 2. API Contracts

✅ **Complete**: Generated `contracts/editor-context-menu.contract.md`

**Contract Defines**:
- Menu contribution structure (package.json)
- Command registration contract (extension.ts)
- Command behavior contract (async function)
- Visibility contract (when clause)
- Focus behavior contract (FR-007)
- Integration contract (existing components)
- Performance contract (<500ms)
- Error handling contract
- Test scenarios

**Key Contract Points**:
- Menu: `editor/context` with `when: editorLangId == markdown`
- Command: `markdownEasyRead.showEasyReadPreview`
- Title: "Show Easy Read Preview" (per FR-005)
- No icon (per FR-008)
- Default positioning (per FR-006)
- Focus existing preview (per FR-007)

### 3. Contract Tests

**Contract Test File**: `src/test/contract/context-menu.test.ts` (already exists, will be extended)

**New Tests to Add**:
```typescript
describe('Editor Context Menu Contract', () => {
  it('should register showEasyReadPreview command', () => {
    // Assert command exists in command registry
  });

  it('should have correct command title', () => {
    // Assert title is "Show Easy Read Preview"
  });

  it('should be disposable', () => {
    // Assert command can be disposed
  });
});
```

**Test Status**: Tests defined in contract, will fail until implementation

### 4. User Scenarios → Integration Tests

**Integration Test File**: `src/test/integration/editor-context-menu.test.ts` (new)

**Scenarios from spec.md**:
1. Menu appears for markdown files
2. Menu does not appear for non-markdown files
3. Clicking menu opens preview
4. Clicking menu when preview open focuses existing preview

**Test Status**: Tests defined in contract and quickstart.md, will fail until implementation

### 5. Quickstart Validation

✅ **Complete**: Generated `quickstart.md`

**Quickstart Contains**:
- 6-step manual validation (5 minutes total)
- Edge case validation (optional, 2 minutes)
- Troubleshooting guide
- Performance benchmarks
- Rollback plan

**Validation Scenarios**:
- ✅ Step 1: Open markdown file
- ✅ Step 2: Access editor context menu
- ✅ Step 3: Open preview from context menu
- ✅ Step 4: Verify focus behavior (FR-007)
- ✅ Step 5: Verify menu visibility (FR-002)
- ✅ Step 6: Verify integration with existing features

### 6. Agent Context Update

**Action**: Update CLAUDE.md with context about this feature

**Content to Add**:
- New command: `markdownEasyRead.showEasyReadPreview`
- New menu: `editor/context` contribution
- Focus behavior: handled by `vscode.openWith`
- Recent change: Editor context menu integration (003-do-i-already)

**Note**: Execute `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`

**Output**: Phase 1 complete - contracts, quickstart, and test plans generated

---

## Phase 2: Task Planning Approach

*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:

1. **Load tasks template** from `.specify/templates/tasks-template.md`

2. **Generate tasks from contracts**:
   - Contract: Add menu contribution to package.json → Task
   - Contract: Add command to package.json commands → Task
   - Contract: Register command in extension.ts → Task
   - Contract: Add contract tests → Task
   - Contract: Add integration tests → Task

3. **TDD Task Ordering**:
   ```
   Phase A: Contract Tests (MUST FAIL)
   - T001: Write contract test for command registration
   - T002: Write contract test for command title
   - T003: Run tests (expect failures)

   Phase B: Package.json Configuration
   - T004: Add command to package.json commands
   - T005: Add menu to package.json editor/context
   - T006: Verify package.json schema valid

   Phase C: Command Implementation
   - T007: Register showEasyReadPreview command in extension.ts
   - T008: Implement command handler (get active editor)
   - T009: Add vscode.openWith execution
   - T010: Add disposable to subscriptions

   Phase D: Contract Tests Pass
   - T011: Run contract tests (expect pass)

   Phase E: Integration Tests (MUST FAIL)
   - T012: Write integration test for menu visibility
   - T013: Write integration test for preview opening
   - T014: Write integration test for focus behavior
   - T015: Run integration tests (expect failures)

   Phase F: Verification & Validation
   - T016: Run integration tests (expect pass)
   - T017: Run all existing tests (no regressions)
   - T018: Execute quickstart.md manual validation
   - T019: Update CHANGELOG.md
   - T020: Update README.md

   Phase G: Agent Context
   - T021: Run update-agent-context.ps1 script
   ```

4. **Parallel Execution Markers**:
   - T001-T002 [P] (independent test files)
   - T004-T005 [P] (separate sections of package.json)
   - T012-T014 [P] (independent test scenarios)

5. **Dependencies**:
   - T004-T006 must complete before T011 (contract tests need package.json)
   - T007-T010 must complete before T011 (contract tests need command registration)
   - T011 must pass before T012-T015 (validate contracts before integration)
   - T012-T015 must fail before T016 (TDD red phase)
   - T016 must pass before T017-T018 (green phase validation)

**Estimated Task Count**: 20-22 tasks

**Estimated Implementation Time**: 2-3 hours including testing

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

---

## Phase 3+: Future Implementation

*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following TDD cycle)
**Phase 5**: Validation (run tests, execute quickstart.md, manual review)

---

## Complexity Tracking

*Fill ONLY if Constitution Check has violations that must be justified*

**No violations**. Table not applicable.

---

## Progress Tracking

*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [x] Phase 3: Tasks generated (/tasks command) - 22 tasks created
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS
- [x] Post-Design Constitution Check: PASS
- [x] All NEEDS CLARIFICATION resolved
- [x] Complexity deviations documented (N/A - no deviations)

**Artifacts Generated**:
- [x] research.md (Phase 0)
- [x] contracts/editor-context-menu.contract.md (Phase 1)
- [x] quickstart.md (Phase 1)
- [x] data-model.md (N/A - no new entities)
- [x] Agent context update (CLAUDE.md created)
- [x] tasks.md (Phase 3 - 22 tasks generated)

**Files to Modify**:
- [ ] package.json (add menu + command)
- [ ] src/extension.ts (register command)
- [ ] src/test/contract/context-menu.test.ts (extend tests)
- [ ] src/test/integration/editor-context-menu.test.ts (new file)

**Files to Create**:
- [ ] None (all modifications to existing files)

---

## Summary

**Ready for /tasks command**

This plan provides:
- ✅ Complete technical research (research.md)
- ✅ Detailed API contract (contracts/)
- ✅ Manual validation guide (quickstart.md)
- ✅ Test strategy (contract + integration)
- ✅ Task generation approach (Phase 2)

**Next Command**: `/tasks` to generate tasks.md

---

*Based on Constitution Template - No specific project constitution exists*
*Plan generated: 2025-10-05*

