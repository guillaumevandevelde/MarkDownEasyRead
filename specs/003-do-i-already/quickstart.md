# Quickstart: Editor Context Menu Validation

**Feature**: 003-do-i-already
**Date**: 2025-10-05
**Time to Complete**: ~5 minutes

## Purpose

This quickstart guide validates that the editor context menu integration works correctly for opening Markdown Easy Read preview.

## Prerequisites

- ✅ VS Code 1.85.0 or later installed
- ✅ Markdown Easy Read extension installed (development version)
- ✅ Extension compiled (`npm run compile`)

## Quick Validation Steps

### Step 1: Open a Markdown File (30 seconds)

1. Open VS Code
2. Create or open a file with `.md` extension
3. Add some markdown content:
   ```markdown
   # Test Document

   This is a test for the editor context menu.

   - Item 1
   - Item 2
   ```

**Expected**:
- ✅ File opens in standard VS Code markdown editor
- ✅ Syntax highlighting is active

### Step 2: Access Editor Context Menu (15 seconds)

1. **Right-click** anywhere in the markdown document text area
2. Look for the menu option

**Expected**:
- ✅ Context menu appears
- ✅ Menu contains option labeled **"Show Easy Read Preview"**
- ✅ Option appears in the default menu position (not at top or bottom specifically)
- ✅ Option has **text only** (no icon)

**If Failed**:
- Check package.json has `editor/context` menu contribution
- Verify command is registered in extension.ts
- Check `when` clause is `editorLangId == markdown`
- Reload VS Code window (Ctrl/Cmd+Shift+P → "Reload Window")

### Step 3: Open Preview from Context Menu (30 seconds)

1. Click **"Show Easy Read Preview"** in the context menu

**Expected**:
- ✅ Preview panel opens within 500ms
- ✅ Markdown content is rendered (heading, list items)
- ✅ Preview shows Markdown Easy Read styling (comfortable typography)
- ✅ No error messages appear

**If Failed**:
- Check console for errors (Help → Toggle Developer Tools → Console)
- Verify PreviewProvider is registered
- Check command handler executes `vscode.openWith`

### Step 4: Verify Focus Behavior (45 seconds)

1. With preview still open, click back into the markdown editor
2. **Right-click** in the editor again
3. Select **"Show Easy Read Preview"** again

**Expected**:
- ✅ Existing preview panel is **focused** (brought to front)
- ✅ **No duplicate** preview panel is created
- ✅ Preview content remains the same
- ✅ No error or notification shown

**If Failed**:
- Check if multiple preview panels exist (close extras)
- Verify `vscode.openWith` is used (not custom panel creation)
- Check custom editor provider viewType matches

### Step 5: Verify Menu Visibility (1 minute)

1. Open a **non-markdown file** (.js, .ts, .txt)
2. **Right-click** in the editor

**Expected**:
- ✅ "Show Easy Read Preview" option **does NOT appear**

3. Open different markdown file types:
   - Create file `test.markdown`
   - Create file `test.mdown`
   - Right-click in each

**Expected**:
- ✅ "Show Easy Read Preview" appears for `.markdown`
- ✅ "Show Easy Read Preview" appears for `.mdown`
- ✅ "Show Easy Read Preview" appears for `.mkd`

**If Failed**:
- Check `when` clause uses `editorLangId` not `resourceExtname`
- Verify language ID detection for markdown variants

### Step 6: Verify Integration with Existing Features (1 minute)

1. With preview open, test zoom controls:
   - Press `Ctrl/Cmd +` (zoom in)
   - Press `Ctrl/Cmd -` (zoom out)
   - Press `Ctrl/Cmd 0` (reset zoom)

**Expected**:
- ✅ Zoom controls work normally
- ✅ Preview opened from context menu behaves identically to preview opened from command palette

2. Test live updates:
   - Edit markdown content in editor
   - Observe preview

**Expected**:
- ✅ Preview updates within 200ms
- ✅ Changes are reflected correctly

**If Failed**:
- Context menu preview may be using different provider
- Verify command executes same `vscode.openWith` logic

## Edge Case Validation (Optional - 2 minutes)

### Edge Case 1: Multiple Markdown Files

1. Open two markdown files in split view
2. Right-click in **File A**
3. Select "Show Easy Read Preview"
4. Click into **File B**
5. Right-click in **File B**
6. Select "Show Easy Read Preview"

**Expected**:
- ✅ Two separate preview panels exist (one per file)
- ✅ Each shows correct content for its file
- ✅ Previews are independent

### Edge Case 2: Diff View

1. Make changes to a tracked git file
2. Open diff view (Source Control → file → Open Changes)
3. Right-click in diff editor

**Expected**:
- ✅ Menu appears if comparing markdown files
- ✅ Clicking menu opens preview of current version

### Edge Case 3: No Active Editor

1. Close all editor tabs
2. Focus on terminal or sidebar

**Expected**:
- ✅ No context menu (nothing to right-click in)
- ✅ Command doesn't execute (no active editor)

## Success Criteria

**Feature is validated when**:
- ✅ All 6 main steps pass
- ✅ No errors in developer console
- ✅ Preview behavior is identical to other access methods
- ✅ Edge cases behave reasonably (optional but recommended)

## Troubleshooting

### Problem: Menu doesn't appear

**Solution**:
1. Check `package.json` has menu contribution
2. Verify extension is activated (`markdownEasyRead.activate` in console)
3. Reload window: Ctrl/Cmd+Shift+P → "Reload Window"
4. Check `when` clause: `editorLangId == markdown`

### Problem: Menu appears for non-markdown files

**Solution**:
1. Check `when` clause in package.json
2. Should be `editorLangId == markdown` (not `resourceExtname`)
3. Rebuild extension: `npm run compile`

### Problem: Clicking menu does nothing

**Solution**:
1. Check console for errors
2. Verify command is registered in extension.ts
3. Check command ID matches: `markdownEasyRead.showEasyReadPreview`
4. Ensure disposable is added to subscriptions

### Problem: Duplicate previews created

**Solution**:
1. Verify using `vscode.openWith` not custom panel creation
2. Check viewType is `'markdownEasyRead.preview'`
3. Don't call `vscode.window.createWebviewPanel` directly

### Problem: Preview doesn't focus existing panel

**Solution**:
1. Use `vscode.openWith` command (handles focus automatically)
2. Don't manually track panels
3. Let custom editor provider manage lifecycle

## Performance Benchmarks

**Target**:
- Menu registration: <100ms during activation
- Menu display: <50ms after right-click
- Preview open: <500ms
- Preview focus: <200ms

**How to Measure**:
1. Enable performance marks in code
2. Use Chrome DevTools Performance tab
3. Measure from right-click to preview visible

## Next Steps

After validation passes:
1. ✅ Run automated tests (`npm test`)
2. ✅ Update CHANGELOG.md
3. ✅ Update README.md with context menu documentation
4. ✅ Prepare for release

## Rollback Plan

**If critical issues found**:
1. Remove menu contribution from package.json
2. Remove command registration from extension.ts
3. Revert package.json commands list
4. Rebuild: `npm run compile`
5. Test existing features still work

**Safe to rollback because**:
- No changes to existing commands
- No changes to preview provider
- Only additive changes (new menu + new command)

---

**Validation Complete**: ___________ (Date)
**Validated By**: ___________ (Name)
**Result**: ☐ Pass  ☐ Fail (describe issues below)

**Issues Found**:
```
[List any issues discovered during validation]
```

**Resolution**:
```
[How issues were resolved]
```
