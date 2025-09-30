# Implementation Plan: Reader-Optimized Markdown Preview

**Branch**: `001-i-want-to` | **Date**: 2025-09-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `C:\develop\MarkDownEasyRead\specs\001-i-want-to\spec.md`

## Execution Flow (/plan command scope)
```
1. Load feature spec from Input path
   → ✅ Spec loaded successfully
2. Fill Technical Context (scan for NEEDS CLARIFICATION)
   → ✅ No NEEDS CLARIFICATION markers remain
   → ✅ Project Type: single (VS Code extension)
3. Fill the Constitution Check section
   → ✅ Constitution template analyzed
4. Evaluate Constitution Check section
   → ✅ No violations (constitution is template-only, proceeding)
5. Execute Phase 0 → research.md
   → ✅ Research complete
6. Execute Phase 1 → contracts, data-model.md, quickstart.md, CLAUDE.md
   → ✅ Design artifacts generated
7. Re-evaluate Constitution Check
   → ✅ No new violations
8. Plan Phase 2 → Task generation approach described
   → ✅ Ready for /tasks command
9. STOP - Ready for /tasks command
```

## Summary

Create a VS Code extension that provides a reader-optimized markdown preview with adjustable zoom (keyboard shortcuts + UI controls), responsive layout with comfortable reading padding/margins, automatic theme adaptation, smart wide-content handling, global preference persistence, live updates, and graceful image error handling.

## Technical Context

**Language/Version**: TypeScript 5.x (VS Code extension standard)
**Primary Dependencies**:
- VS Code Extension API 1.85+
- Markdown-it (markdown parsing and rendering)
- VS Code Webview API (preview panel)
**Storage**: VS Code globalState API (for global zoom preferences)
**Testing**: VS Code Extension Test Runner, Mocha
**Target Platform**: VS Code 1.85+ (Windows, macOS, Linux)
**Project Type**: single (VS Code extension with webview provider)
**Performance Goals**:
- Preview render < 100ms for typical documents (<10k lines)
- Zoom/resize updates < 16ms (60fps)
- Live update latency < 200ms after file change
**Constraints**:
- Must work with VS Code's webview security model (CSP)
- Limited to VS Code Extension API capabilities
- Global storage only (no workspace-specific zoom)
**Scale/Scope**:
- Target: individual developers/writers
- Files: up to 100k lines markdown
- Concurrent previews: typically 1-3 open

## Constitution Check
*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: The constitution file at `.specify/memory/constitution.md` is currently a template with placeholders. Since no specific constitutional principles have been ratified for this project yet, this check is informational only. Once the constitution is populated via `/constitution`, this section will be updated with specific compliance checks.

**Template-Level Principles Inferred**:
- ✅ **Test-First Development**: Plan includes contract tests and integration tests before implementation
- ✅ **Specification-Driven**: This plan derives from a complete, clarified specification
- ✅ **Clarity Over Assumptions**: All clarifications resolved in Session 2025-09-30
- ✅ **Incremental Progress**: Phases clearly defined with gates
- ✅ **Simplicity**: VS Code extension is simplest architecture for the requirements

**Status**: PASS (no violations, template-level compliance achieved)

## Project Structure

### Documentation (this feature)
```
specs/001-i-want-to/
├── spec.md              # Feature specification
├── plan.md              # This file (/plan command output)
├── research.md          # Phase 0 output (/plan command)
├── data-model.md        # Phase 1 output (/plan command)
├── quickstart.md        # Phase 1 output (/plan command)
├── contracts/           # Phase 1 output (/plan command)
│   ├── extension-api.md # Extension activation and commands
│   ├── webview-api.md   # Preview panel webview communication
│   └── storage-api.md   # Preference persistence
└── tasks.md             # Phase 2 output (/tasks command - NOT created by /plan)
```

### Source Code (repository root)
```
markdown-easy-read/
├── src/
│   ├── extension.ts          # Extension entry point, activation
│   ├── previewProvider.ts    # Webview panel management
│   ├── markdownRenderer.ts   # Markdown to HTML conversion
│   ├── preferenceManager.ts  # Zoom/settings persistence
│   ├── commands.ts           # VS Code command registration
│   └── webview/
│       ├── index.html        # Webview HTML template
│       ├── style.css         # Reader-optimized CSS
│       └── script.js         # Zoom controls, theme detection
├── tests/
│   ├── contract/
│   │   ├── extension.test.ts
│   │   ├── webview.test.ts
│   │   └── storage.test.ts
│   ├── integration/
│   │   ├── preview-render.test.ts
│   │   ├── zoom-controls.test.ts
│   │   └── theme-adaptation.test.ts
│   └── unit/
│       ├── markdown-renderer.test.ts
│       └── preference-manager.test.ts
├── package.json              # Extension manifest
├── tsconfig.json
└── .vscode/
    └── launch.json           # Debug configuration
```

**Structure Decision**: Single project structure chosen because this is a standalone VS Code extension. All source code lives in `src/` with a clear separation between extension host code (TypeScript) and webview content (HTML/CSS/JS). Tests are organized by type (contract/integration/unit) to support TDD workflow.

## Phase 0: Outline & Research

**Research Topics**:

### 1. VS Code Extension Architecture for Webview Providers
**Decision**: Use CustomTextEditorProvider pattern
**Rationale**:
- Integrates with VS Code's editor system for markdown files
- Automatic lifecycle management (open/close/focus)
- Built-in file watching for live updates (FR-008)
**Alternatives Considered**:
- WebviewPanel: More manual lifecycle, harder to integrate with editor
- Custom Editor API: Overkill for read-only preview

### 2. Markdown Rendering Library
**Decision**: markdown-it with extensions
**Rationale**:
- Industry standard, well-maintained
- Plugin ecosystem for extended syntax
- Good performance for large documents
- Already used by VS Code's built-in markdown preview
**Alternatives Considered**:
- marked: Simpler but fewer features
- remark: More complex AST-based approach

### 3. Global State Persistence
**Decision**: VS Code globalState API
**Rationale**:
- Requirement FR-007 specifies global (not workspace-specific) persistence
- Built-in API, no external dependencies
- Survives VS Code restarts
- Simple key-value storage
**Alternatives Considered**:
- Workspace state: Wrong scope per requirements
- File-based config: Unnecessary complexity

### 4. Responsive Layout Strategy
**Decision**: CSS Container Queries + CSS Variables
**Rationale**:
- Clarification specifies responsive adaptation to panel width
- Container queries respond to webview size, not window size
- CSS variables enable dynamic font-size scaling
- Modern browser support (VS Code uses Electron with recent Chromium)
**Alternatives Considered**:
- Fixed breakpoints: Less flexible
- JavaScript resize observers: Unnecessary overhead

### 5. Theme Detection & Adaptation
**Decision**: VS Code CSS Variables + postMessage API
**Rationale**:
- VS Code exposes theme colors via CSS variables in webviews
- Can listen to theme change events via extension host
- Automatic adaptation without extension code (FR-010 auto-adapt)
**Alternatives Considered**:
- Manual theme detection: More work, fragile
- Fixed color schemes: Violates FR-010

### 6. Keyboard Shortcuts for Zoom
**Decision**: VS Code keybindings in package.json
**Rationale**:
- Native VS Code shortcut system
- User-customizable
- Cross-platform key mapping handled by VS Code
**Alternatives Considered**:
- Webview keyboard events: Doesn't work when focus outside webview
- Global OS hooks: Security issues, platform-specific

**Output**: research.md documenting all decisions above

## Phase 1: Design & Contracts

### Data Model

**Entities** (see data-model.md):

1. **PreviewState**
   - documentUri: string (file being previewed)
   - zoomLevel: number (1.0 = 100%, range 0.5 to 3.0)
   - scrollPosition: number (last scroll offset, for restoration)

2. **GlobalPreferences**
   - defaultZoomLevel: number (persisted globally)
   - lastModified: timestamp

3. **WebviewMessage** (communication protocol)
   - type: 'zoom' | 'scroll' | 'ready' | 'error'
   - payload: any (type-specific data)

### Contracts

**Extension API Contract** (contracts/extension-api.md):
- Command: `markdownEasyRead.openPreview` → activates preview for active markdown file
- Command: `markdownEasyRead.zoomIn` → increases zoom by 0.1
- Command: `markdownEasyRead.zoomOut` → decreases zoom by 0.1
- Command: `markdownEasyRead.resetZoom` → resets to saved default

**Webview Communication Contract** (contracts/webview-api.md):
- Extension → Webview:
  - `{type: 'update', payload: {html: string, zoom: number}}`
  - `{type: 'zoomChange', payload: {zoom: number}}`
- Webview → Extension:
  - `{type: 'zoomAdjust', payload: {delta: number}}`
  - `{type: 'ready'}`
  - `{type: 'error', payload: {message: string}}`

**Storage Contract** (contracts/storage-api.md):
- `globalState.get<number>('markdownEasyRead.zoomLevel', 1.0)` → retrieves zoom
- `globalState.update('markdownEasyRead.zoomLevel', value)` → persists zoom

### Contract Tests (must fail before implementation)

**tests/contract/extension.test.ts**:
- Test: activating extension registers all commands
- Test: openPreview command creates webview for markdown file
- Test: zoom commands update webview state

**tests/contract/webview.test.ts**:
- Test: webview sends 'ready' message on load
- Test: webview responds to 'update' message by rendering HTML
- Test: webview sends 'zoomAdjust' on UI button click

**tests/contract/storage.test.ts**:
- Test: zoom preference persists across extension reload
- Test: default zoom is 1.0 for new installations

### Integration Test Scenarios

**tests/integration/preview-render.test.ts**:
- Scenario 1 (AS-1): Open markdown file → preview shows formatted content
- Scenario 2 (AS-3): Markdown with images → images render inline
- Edge: Broken image → placeholder shown

**tests/integration/zoom-controls.test.ts**:
- Scenario 2 (AS-2): Zoom via keyboard → text scales, layout adapts
- Scenario 2 (AS-2): Zoom via UI buttons → text scales, layout adapts
- Test: Zoom persists after VS Code restart

**tests/integration/theme-adaptation.test.ts**:
- Test: Light theme → preview uses light colors
- Test: Dark theme → preview uses dark colors
- Test: Theme change while preview open → colors update immediately

### Quickstart Validation

**quickstart.md** provides manual validation steps:
1. Install extension in development mode
2. Open sample.md (provided)
3. Run "Open Markdown Easy Read" command
4. Verify: readable typography, comfortable margins
5. Test: Press Ctrl/Cmd + to zoom in
6. Test: Press Ctrl/Cmd - to zoom out
7. Test: Click zoom UI buttons
8. Verify: Zoom persists after closing/reopening preview
9. Test: Switch VS Code theme
10. Verify: Preview colors adapt automatically
11. Test: Add broken image link to markdown
12. Verify: Placeholder or error indicator shown
13. Test: Wide code block
14. Verify: Horizontal scroll available, text readable

## Phase 2: Task Planning Approach
*This section describes what the /tasks command will do - DO NOT execute during /plan*

**Task Generation Strategy**:
1. Load `.specify/templates/tasks-template.md` as base
2. Extract from contracts:
   - Extension API contract → 4 command implementation tasks
   - Webview API contract → 2 message handling tasks
   - Storage contract → 1 persistence task
3. Extract from data-model.md:
   - PreviewState → state management task
   - GlobalPreferences → preference loading task
4. Extract from integration tests:
   - preview-render.test.ts → markdown rendering task
   - zoom-controls.test.ts → zoom control tasks (keyboard + UI)
   - theme-adaptation.test.ts → theme detection task
5. Setup tasks:
   - Extension scaffolding
   - TypeScript configuration
   - Test framework setup

**Ordering Strategy**:
- **Setup first**: Scaffold, dependencies, test framework
- **TDD order**: All contract tests [P], then implementation
- **Dependency order**:
  - Core extension activation → command registration
  - Markdown renderer → preview provider
  - Webview communication → zoom controls
  - Preference manager → persistence
- **Parallel opportunities**: Contract tests are independent [P], webview assets (HTML/CSS/JS) can be built in parallel [P]

**Estimated Output**: ~20-25 numbered, ordered tasks in tasks.md

**IMPORTANT**: This phase is executed by the /tasks command, NOT by /plan

## Phase 3+: Future Implementation
*These phases are beyond the scope of the /plan command*

**Phase 3**: Task execution (/tasks command creates tasks.md)
**Phase 4**: Implementation (execute tasks.md following constitutional principles)
**Phase 5**: Validation (run tests, execute quickstart.md, performance validation)

## Complexity Tracking
*Fill ONLY if Constitution Check has violations that must be justified*

No complexity violations - architecture is straightforward VS Code extension following standard patterns.

## Progress Tracking
*This checklist is updated during execution flow*

**Phase Status**:
- [x] Phase 0: Research complete (/plan command)
- [x] Phase 1: Design complete (/plan command)
- [x] Phase 2: Task planning complete (/plan command - describe approach only)
- [ ] Phase 3: Tasks generated (/tasks command)
- [ ] Phase 4: Implementation complete
- [ ] Phase 5: Validation passed

**Gate Status**:
- [x] Initial Constitution Check: PASS (template-level compliance)
- [x] Post-Design Constitution Check: PASS (no new violations)
- [x] All NEEDS CLARIFICATION resolved (Session 2025-09-30)
- [x] Complexity deviations documented (none)

---
*Based on Constitution template - See `.specify/memory/constitution.md`*