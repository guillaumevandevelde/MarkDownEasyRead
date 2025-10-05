# Research: Right-Click Context Menu for Opening Preview

**Feature**: 003-do-i-already
**Date**: 2025-10-05
**Status**: Complete

## Overview

Research findings for adding an editor context menu option to open Markdown Easy Read preview from within an active markdown document.

## Research Task 1: VS Code Editor Context Menu API

### Decision
Use the `editor/context` contribution point in package.json menus section.

### Rationale
VS Code provides specific contribution points for different context menus:
- `editor/context` - Right-click menu within text editor
- `explorer/context` - Right-click menu in file explorer (already implemented)
- `editor/title/context` - Right-click menu on editor tab

For right-clicking within the document text area, `editor/context` is the correct contribution point.

### Implementation Pattern
```json
{
  "contributes": {
    "menus": {
      "editor/context": [
        {
          "command": "markdownEasyRead.openPreview",
          "when": "editorLangId == markdown",
          "group": "navigation"
        }
      ]
    }
  }
}
```

### Alternatives Considered
1. **editor/title/context** - Rejected: This is for the tab header, not the document content
2. **Custom context menu via VS Code API** - Rejected: Contribution points are the standard, declarative approach

### References
- VS Code Extension API: Contribution Points
- VS Code API Reference: Menus

---

## Research Task 2: Menu Visibility Conditions

### Decision
Use `editorLangId == markdown` as the `when` clause condition.

### Rationale
VS Code provides context keys for conditional menu visibility:
- `editorLangId` - Language ID of the active editor
- `resourceLangId` - Language ID based on file extension (less reliable for active editor)
- `editorFocus` - Whether editor has focus

For editor context menus, `editorLangId == markdown` is the most reliable way to ensure the menu only appears when right-clicking in a markdown file.

### Additional Considerations
- The condition works for all markdown file extensions (.md, .markdown, .mdown, etc.) because VS Code assigns them the same `markdown` language ID
- No need to check file extension patterns
- VS Code handles the language detection automatically

### Implementation
```json
"when": "editorLangId == markdown"
```

### Alternatives Considered
1. **resourceLangId == markdown** - Rejected: Less reliable for editor context (resource vs editor focus)
2. **resourceExtname matches patterns** - Rejected: Overly complex, language ID is simpler
3. **No condition** - Rejected: Would show menu in all file types

### References
- VS Code: When Clause Contexts
- VS Code: Language Identifiers

---

## Research Task 3: Focus Existing Preview Behavior

### Decision
The existing `markdownEasyRead.openPreview` command already handles this correctly by using `vscode.openWith` with the custom editor provider.

### Rationale
VS Code's custom editor provider (`markdownEasyRead.preview`) automatically handles panel focus:
- If preview is already open for the document, `vscode.openWith` brings it to front
- If preview is not open, it creates a new one
- The PreviewProvider's `resolveCustomTextEditor` is called only when creating new instances
- Panel lifecycle is managed by VS Code

**Key Finding**: No additional focus logic needed. The existing command already satisfies FR-007 (focus existing preview).

### Verification
Current implementation in extension.ts:
```typescript
await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview');
```

This automatically:
1. Checks if a panel with `markdownEasyRead.preview` viewType exists for the URI
2. If exists: Calls `panel.reveal()` to focus it
3. If not exists: Creates new panel and calls `resolveCustomTextEditor`

### Testing Strategy
Integration test should verify:
1. Opening preview from editor context menu creates preview
2. Opening again focuses existing preview (no duplicate panels)
3. Preview shows correct markdown content

### Alternatives Considered
1. **Manual panel tracking** - Rejected: VS Code already does this via custom editor provider
2. **Panel registry in PreviewProvider** - Rejected: Unnecessary complexity, VS Code manages lifecycle
3. **Custom focus command** - Rejected: `vscode.openWith` handles focus automatically

### References
- VS Code API: CustomTextEditorProvider
- VS Code API: WebviewPanel.reveal()
- Existing codebase: PreviewProvider.ts, extension.ts

---

## Research Task 4: Command Reuse vs New Command

### Decision
Reuse the existing `markdownEasyRead.openPreview` command. No new command needed.

### Rationale
The existing command already:
1. ✅ Checks if active editor is markdown
2. ✅ Gets the document URI
3. ✅ Opens preview with `vscode.openWith`
4. ✅ Handles focus automatically (see Task 3)
5. ✅ Works with custom editor provider

**Key Insight**: Editor context menus automatically provide the active editor context, so the command doesn't need modification.

### Implementation Approach
Simply add menu contribution pointing to existing command:
```json
{
  "menus": {
    "editor/context": [
      {
        "command": "markdownEasyRead.openPreview",
        "when": "editorLangId == markdown"
      }
    ]
  }
}
```

### Command Title Consideration
The existing command title is "Open Markdown Easy Read". The spec requires menu label "Show Easy Read Preview".

**Solution**: Add a second command registration with the spec-compliant title, but both execute the same logic. This allows:
- Command palette: Shows "Open Markdown Easy Read" (existing)
- Editor context menu: Shows "Show Easy Read Preview" (spec requirement)

### Updated Decision
Create a new command `markdownEasyRead.showEasyReadPreview` that:
- Has title "Show Easy Read Preview" (matches spec FR-005)
- Executes the same logic as `openPreview`
- Is registered only in `editor/context` menu

### Implementation Pattern
```typescript
// In extension.ts
const showPreviewCommand = vscode.commands.registerCommand(
  'markdownEasyRead.showEasyReadPreview',
  async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.languageId !== 'markdown') {
      return; // Silently fail (menu won't show if not markdown anyway)
    }
    await vscode.commands.executeCommand('vscode.openWith',
      editor.document.uri,
      'markdownEasyRead.preview'
    );
  }
);
```

### Alternatives Considered
1. **Reuse exact same command** - Rejected: Can't have two different titles for same command
2. **Modify existing command title** - Rejected: Would change command palette entry (breaking change)
3. **Share implementation via helper function** - Considered: Good for DRY, but implementation is only 4 lines

### References
- VS Code API: commands.registerCommand
- Existing codebase: extension.ts lines 32-44

---

## Key Findings Summary

| Aspect | Decision | Impact |
|--------|----------|--------|
| Menu Contribution | `editor/context` | Add to package.json menus section |
| Visibility Condition | `editorLangId == markdown` | Simple, reliable markdown detection |
| Focus Behavior | Reuse VS Code's automatic focus | No custom logic needed |
| Command | New command with spec-compliant title | 15 lines of new code in extension.ts |
| Menu Label | "Show Easy Read Preview" | Matches FR-005 requirement |
| Menu Icon | None | Matches FR-008 (text-only) |
| Menu Position | Default (no group specified) | Matches FR-006 (no positioning constraint) |

---

## Dependencies

**No new dependencies required**. Feature uses existing VS Code API surface:
- ✅ vscode.commands.registerCommand (already used)
- ✅ vscode.window.activeTextEditor (already used)
- ✅ vscode.commands.executeCommand (already used)
- ✅ package.json menu contributions (standard VS Code pattern)

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Menu doesn't appear | Low | Medium | Test with multiple markdown file types (.md, .markdown) |
| Duplicate command in palette | Low | Low | Don't add new command to command palette (menu-only) |
| Focus doesn't work | Very Low | Medium | VS Code API handles this, verified in existing code |
| Performance degradation | Very Low | Low | Menu registration is O(1), no runtime overhead |

---

## Testing Strategy

### Contract Tests
- Menu contribution is registered in package.json
- Command is registered in extension activation
- Command handler function exists

### Integration Tests
- Right-click in markdown editor shows menu option
- Right-click in non-markdown editor doesn't show menu option
- Clicking menu option opens preview
- Clicking menu option when preview is open focuses existing preview
- Menu label is "Show Easy Read Preview"

### Manual Testing Checklist
- [ ] Right-click in .md file shows menu
- [ ] Right-click in .markdown, .mdown shows menu
- [ ] Right-click in .txt, .js doesn't show menu
- [ ] Menu appears in default position (not at specific location)
- [ ] Menu has text label only (no icon)
- [ ] Clicking menu opens preview
- [ ] Clicking menu again focuses existing preview (no duplicate)

---

## Open Questions

**None**. All research tasks complete with clear decisions.

---

## Next Steps

Proceed to Phase 1:
1. ~~Create data-model.md~~ (N/A - no new data entities)
2. Create contracts/editor-context-menu.contract.md
3. Create quickstart.md with manual validation steps
4. Update agent context file (CLAUDE.md or similar)

