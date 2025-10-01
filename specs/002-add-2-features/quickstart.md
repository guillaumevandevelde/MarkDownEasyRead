# Quickstart Validation: Enhanced Code Display and Context Menu

**Feature**: 002-add-2-features
**Purpose**: Manual validation checklist for enhanced code display and context menu functionality

## Prerequisites

- [ ] Extension built with `npm run package`
- [ ] VS Code opened in development mode (F5)
- [ ] Sample markdown files with code blocks available
- [ ] Test files with various extensions (.md, .markdown, .mdown, .txt)

## Test Setup

Create test files in workspace:

1. `test-code-blocks.md` - markdown with various code blocks
2. `test-untagged.md` - markdown with untagged code blocks
3. `test-mismatch.md` - markdown with incorrect language tags
4. `notes.markdown` - test alternate extension
5. `readme.txt` - non-markdown file for negative test

###test-code-blocks.md Content:
```markdown
# Code Examples

## JavaScript
```javascript
const greeting = "Hello World";
console.log(greeting);
```

## Python
```python
def hello():
    print("Hello World")
```

## TypeScript
```typescript
interface User {
    name: string;
    age: number;
}
```
```

## Feature 1: Enhanced Code Display

### Test 1.1: Syntax Highlighting

**Steps**:
1. Open `test-code-blocks.md`
2. Right-click file → "Open with Markdown Easy Read" (or use command palette)
3. Verify preview opens

**Expected Results**:
- [ ] JavaScript code block displays with syntax colors
- [ ] Python code block displays with syntax colors
- [ ] TypeScript code block displays with syntax colors
- [ ] Syntax colors adapt to current VS Code theme
- [ ] Keywords colored distinctly from variables and strings

### Test 1.2: Line Numbers

**Steps**:
1. In preview from Test 1.1
2. Examine each code block

**Expected Results**:
- [ ] Line numbers appear on left side of each code block
- [ ] Line numbers are gray/muted (not distracting)
- [ ] Line numbers don't interfere with text selection
- [ ] Line numbers are right-aligned
- [ ] Line numbers use consistent width

### Test 1.3: Copy Button

**Steps**:
1. In preview from Test 1.1
2. Hover over first code block
3. Click copy button
4. Paste into text editor

**Expected Results**:
- [ ] Copy button appears in top-right of code block
- [ ] Copy button shows clipboard icon
- [ ] Button is keyboard accessible (Tab + Enter)
- [ ] Clicking copies code to clipboard
- [ ] Pasted code excludes line numbers
- [ ] Button shows "Copied!" feedback briefly
- [ ] Button has accessible label for screen readers

### Test 1.4: Automatic Language Detection

**Steps**:
1. Open `test-untagged.md` with untagged code blocks:
```markdown
```
function test() {
    return 42;
}
```
```
2. Open in preview

**Expected Results**:
- [ ] Code is automatically detected as JavaScript
- [ ] Syntax highlighting applied correctly
- [ ] No error messages or warnings

### Test 1.5: Language Mismatch Warning

**Steps**:
1. Open `test-mismatch.md` with incorrect tag:
```markdown
```python
const foo = 42;
console.log(foo);
```
```
2. Open in preview

**Expected Results**:
- [ ] Code highlighted as Python (honors explicit tag)
- [ ] Warning badge/indicator shown
- [ ] Warning suggests "Looks like JavaScript" or similar
- [ ] Code remains readable despite mismatch

### Test 1.6: Theme Adaptation

**Steps**:
1. Open `test-code-blocks.md` in preview
2. Change VS Code theme: File → Preferences → Color Theme
3. Switch between Light, Dark, and High Contrast themes

**Expected Results**:
- [ ] Syntax colors adapt to Light theme
- [ ] Syntax colors adapt to Dark theme
- [ ] Syntax colors adapt to High Contrast theme
- [ ] Code remains readable in all themes
- [ ] Line numbers adapt to theme
- [ ] Copy button visible in all themes

## Feature 2: Context Menu Integration

### Test 2.1: Context Menu for .md Files

**Steps**:
1. In VS Code Explorer, locate `test-code-blocks.md`
2. Right-click the file
3. Examine context menu

**Expected Results**:
- [ ] "Open with Markdown Easy Read" option present
- [ ] Option appears near "Open Preview" command
- [ ] Option clearly labeled and distinguishable
- [ ] Option not duplicated

### Test 2.2: Context Menu for Alternate Extensions

**Steps**:
1. Right-click `notes.markdown` file
2. Right-click test files with extensions: .mdown, .mkd, .mkdn, .mdwn, .text (if available)

**Expected Results**:
- [ ] "Open with Markdown Easy Read" present for .markdown
- [ ] Option present for all 7 supported extensions
- [ ] Option consistent across all markdown extensions

### Test 2.3: Context Menu Absent for Non-Markdown

**Steps**:
1. Right-click `readme.txt` file
2. Right-click other non-markdown files (.js, .json, .png)

**Expected Results**:
- [ ] "Open with Markdown Easy Read" NOT present for .txt
- [ ] Option absent for all non-markdown file types
- [ ] No errors or console warnings

### Test 2.4: Preview Placement - Replace Mode

**Steps**:
1. Open settings: File → Preferences → Settings
2. Search for "markdown easy read preview placement"
3. Set to "replace"
4. Open a text file in editor
5. Right-click `test-code-blocks.md` in explorer
6. Select "Open with Markdown Easy Read"

**Expected Results**:
- [ ] Preview opens
- [ ] Previous file is closed (replaced)
- [ ] Preview appears in same editor group

### Test 2.5: Preview Placement - Beside Mode

**Steps**:
1. In settings, change "Preview Placement" to "beside"
2. Open a text file in editor
3. Right-click `test-code-blocks.md`
4. Select "Open with Markdown Easy Read"

**Expected Results**:
- [ ] Preview opens
- [ ] Previous file remains open
- [ ] Editor splits into two columns
- [ ] Preview in new column

### Test 2.6: Preview Placement - Default Mode

**Steps**:
1. In settings, change "Preview Placement" to "default"
2. Test opening from various editor states (empty, single file, split)

**Expected Results**:
- [ ] Preview opens using VS Code's default behavior
- [ ] Behavior matches double-clicking file
- [ ] No unexpected editor rearrangement

## Performance Tests

### Test P.1: Large File Performance

**Steps**:
1. Create markdown file with 50+ code blocks (or generate one)
2. Open in Markdown Easy Read preview
3. Observe load time

**Expected Results**:
- [ ] Preview loads within 3 seconds
- [ ] All code blocks highlighted correctly
- [ ] No visible lag or freezing
- [ ] Copy buttons responsive

### Test P.2: Syntax Highlighting Latency

**Steps**:
1. Edit `test-code-blocks.md` while preview open
2. Add new code block
3. Observe update speed

**Expected Results**:
- [ ] Preview updates within 500ms
- [ ] New code block highlighted correctly
- [ ] No flickering or visual artifacts

## Edge Case Tests

### Test E.1: Mixed Languages

**Steps**:
1. Create file with 10+ different languages
2. Open in preview

**Expected Results**:
- [ ] All languages highlighted correctly
- [ ] No language interference
- [ ] Performance acceptable

### Test E.2: Very Long Code Block

**Steps**:
1. Create code block with 500+ lines
2. Open in preview

**Expected Results**:
- [ ] All lines numbered correctly
- [ ] Syntax highlighting complete
- [ ] Copy button works for entire block
- [ ] No performance degradation

### Test E.3: Special Characters

**Steps**:
1. Create code with unicode, emojis, and special chars
2. Open in preview

**Expected Results**:
- [ ] Special characters render correctly
- [ ] Copy preserves special characters
- [ ] No encoding issues

## Regression Tests

### Test R.1: Existing Features Still Work

**Steps**:
1. Test zoom controls (Ctrl/Cmd +, -, 0)
2. Test theme adaptation
3. Test responsive layout

**Expected Results**:
- [ ] Zoom in/out works
- [ ] Zoom reset works
- [ ] Theme switching works
- [ ] Layout responds to window size

### Test R.2: Bundle Size Check

**Steps**:
1. Run `npm run package`
2. Check `out/extension.js` size

**Expected Results**:
- [ ] Bundle size increased by <100KB
- [ ] Extension loads quickly (<1 second)

## Accessibility Tests

### Test A.1: Keyboard Navigation

**Steps**:
1. Open preview
2. Use Tab key to navigate
3. Press Enter on copy button

**Expected Results**:
- [ ] Can tab to copy buttons
- [ ] Focus indicator visible
- [ ] Enter activates copy
- [ ] Keyboard shortcuts work

### Test A.2: Screen Reader

**Steps**:
1. Enable screen reader (if available)
2. Navigate code blocks

**Expected Results**:
- [ ] Code blocks announced
- [ ] Copy button labeled correctly
- [ ] Language announced
- [ ] Line numbers not read redundantly

## Sign-off

**Date**: ___________
**Tester**: ___________
**Results**: ___________

**Critical Issues Found**: ___________

**Ready for Release**: [ ] Yes [ ] No
