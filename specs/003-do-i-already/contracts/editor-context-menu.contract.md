# Contract: Editor Context Menu Integration

**Feature**: 003-do-i-already
**Component**: Editor Context Menu
**Date**: 2025-10-05

## Contract Overview

This contract defines the expected behavior of the editor context menu integration for opening Markdown Easy Read preview.

## Menu Contribution Contract

### Package.json Configuration

**MUST** contain the following menu contribution:

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

**Assertions**:
- ✅ Menu contribution exists under `contributes.menus.editor/context`
- ✅ Command ID is `markdownEasyRead.showEasyReadPreview`
- ✅ `when` clause is `editorLangId == markdown`
- ✅ No `group` specified (default positioning per FR-006)
- ✅ No `icon` specified (text-only per FR-008)

## Command Registration Contract

### Command Definition

**MUST** register command in extension activation:

```typescript
const showPreviewCommand = vscode.commands.registerCommand(
  'markdownEasyRead.showEasyReadPreview',
  async () => {
    // Command handler logic
  }
);
```

**Assertions**:
- ✅ Command ID matches menu contribution
- ✅ Command is registered during `activate()`
- ✅ Command disposable is added to `context.subscriptions`
- ✅ Handler is async function

### Command Title

**MUST** declare command with title in package.json:

```json
{
  "contributes": {
    "commands": [
      {
        "command": "markdownEasyRead.showEasyReadPreview",
        "title": "Show Easy Read Preview"
      }
    ]
  }
}
```

**Assertions**:
- ✅ Command title is exactly "Show Easy Read Preview" (per FR-005)
- ✅ No category prefix (menu-only command)

## Command Behavior Contract

### Input Preconditions

**GIVEN**: User right-clicks in an active text editor

**WHEN**: Editor language ID is "markdown"

**THEN**: Menu option appears with label "Show Easy Read Preview"

### Execution Contract

**Function Signature**:
```typescript
async function showEasyReadPreview(): Promise<void>
```

**Behavior**:
1. **MUST** get active text editor from `vscode.window.activeTextEditor`
2. **MUST** verify editor exists and language ID is "markdown"
3. **MUST** extract document URI from `editor.document.uri`
4. **MUST** execute `vscode.openWith` with:
   - URI: active document URI
   - viewType: `'markdownEasyRead.preview'`
5. **MUST** handle case where preview is already open (focus existing)
6. **MAY** fail silently if no active editor or not markdown (menu won't show anyway)

**Assertions**:
- ✅ Returns `Promise<void>`
- ✅ Uses `vscode.openWith` command (not custom logic)
- ✅ No error messages shown to user
- ✅ No duplicate previews created

### Focus Behavior Contract (FR-007)

**GIVEN**: Preview is already open for document X

**WHEN**: User right-clicks in document X and selects "Show Easy Read Preview"

**THEN**:
- ✅ Existing preview panel is revealed (brought to front)
- ✅ No new preview panel is created
- ✅ Preview content remains unchanged
- ✅ No error or notification shown

**Implementation Note**: This behavior is handled automatically by `vscode.openWith` + custom editor provider. No explicit focus logic needed.

## Visibility Contract (FR-002)

### Positive Cases (Menu MUST Appear)

| File Type | Extension | Language ID | Expected |
|-----------|-----------|-------------|----------|
| Markdown | .md | markdown | ✅ Show |
| Markdown | .markdown | markdown | ✅ Show |
| Markdown | .mdown | markdown | ✅ Show |
| Markdown | .mkd | markdown | ✅ Show |

### Negative Cases (Menu MUST NOT Appear)

| File Type | Extension | Language ID | Expected |
|-----------|-----------|-------------|----------|
| JavaScript | .js | javascript | ❌ Hide |
| TypeScript | .ts | typescript | ❌ Hide |
| Text | .txt | plaintext | ❌ Hide |
| JSON | .json | json | ❌ Hide |
| No editor | N/A | N/A | ❌ Hide |

## Integration Contract

### Dependencies

**MUST** work with existing components:
- ✅ `PreviewProvider` (custom text editor provider)
- ✅ `vscode.openWith` command
- ✅ Custom editor viewType `'markdownEasyRead.preview'`

**MUST NOT**:
- ❌ Duplicate preview provider registration
- ❌ Create custom panel tracking
- ❌ Modify existing command `markdownEasyRead.openPreview`

## Performance Contract

**Menu Registration**:
- ✅ MUST complete during extension activation (<100ms)
- ✅ MUST NOT block activation or other commands

**Menu Display**:
- ✅ MUST appear instantly when right-clicking (<50ms after click)
- ✅ MUST NOT cause UI lag or stutter

**Command Execution**:
- ✅ MUST open/focus preview within 500ms
- ✅ MUST reuse existing preview (O(1) lookup)

## Error Handling Contract

### Edge Cases

**Case 1: No Active Editor**
```typescript
const editor = vscode.window.activeTextEditor;
if (!editor) {
  return; // Silently fail
}
```
**Expected**: No error, no user notification (menu won't show anyway)

**Case 2: Non-Markdown File**
```typescript
if (editor.document.languageId !== 'markdown') {
  return; // Silently fail
}
```
**Expected**: No error, no user notification (menu won't show anyway)

**Case 3: Preview Provider Not Ready**
- **Expected**: VS Code handles this automatically
- **Behavior**: Command execution deferred until provider ready

## Test Scenarios

### Contract Tests

1. **Test**: Menu contribution exists in package.json
   - **Assert**: `contributes.menus.editor/context` contains command
   - **Assert**: `when` clause is `editorLangId == markdown`

2. **Test**: Command is registered
   - **Assert**: Command handler is registered during activation
   - **Assert**: Disposable is added to subscriptions

3. **Test**: Command title matches specification
   - **Assert**: Command title is "Show Easy Read Preview"

### Integration Tests

4. **Test**: Menu appears for markdown files
   - **Given**: Open .md file
   - **When**: Right-click in editor
   - **Then**: Menu shows "Show Easy Read Preview"

5. **Test**: Menu does not appear for non-markdown files
   - **Given**: Open .js file
   - **When**: Right-click in editor
   - **Then**: Menu does not show "Show Easy Read Preview"

6. **Test**: Clicking menu opens preview
   - **Given**: Markdown file is active
   - **When**: Click "Show Easy Read Preview" in context menu
   - **Then**: Preview panel opens with rendered content

7. **Test**: Clicking menu focuses existing preview
   - **Given**: Preview is already open for document X
   - **When**: Right-click in document X and select menu option
   - **Then**: Existing preview is focused (no duplicate created)

## Breaking Change Policy

**MUST NOT**:
- ❌ Change existing command `markdownEasyRead.openPreview`
- ❌ Modify preview provider behavior
- ❌ Change zoom command behavior
- ❌ Alter file explorer context menu

**MAY**:
- ✅ Add new command `markdownEasyRead.showEasyReadPreview`
- ✅ Add menu contribution to `editor/context`
- ✅ Add command to package.json commands list

## Acceptance Criteria

**Contract is satisfied when**:
1. ✅ All package.json contributions are present
2. ✅ Command is registered and disposable is tracked
3. ✅ Menu appears only for markdown files
4. ✅ Menu label is "Show Easy Read Preview"
5. ✅ Clicking menu opens/focuses preview correctly
6. ✅ No duplicate previews are created
7. ✅ No errors or warnings in console
8. ✅ All contract tests pass
9. ✅ All integration tests pass

---

**Contract Version**: 1.0
**Last Updated**: 2025-10-05
