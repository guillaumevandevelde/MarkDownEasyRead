# Quickstart Validation Guide

## Prerequisites
- VS Code 1.85 or later
- Extension installed in development mode (`code --extensionDevelopmentPath`)

## Test Scenario 1: Basic Preview (AS-1)

1. Create `test-sample.md`:
```markdown
# Reader Test Document

This is a paragraph with **bold** and *italic* text.

## Section 2

- List item 1
- List item 2

### Code Example

\`\`\`javascript
function hello() {
  console.log("Hello, world!");
}
\`\`\`

![Test Image](./test-image.png)
```

2. Open `test-sample.md` in VS Code
3. Run command: **"Open Markdown Easy Read"** (Ctrl/Cmd+Shift+P)
4. **Verify**:
   - Preview opens in new editor tab
   - Comfortable padding and margins visible
   - Typography optimized for reading
   - All markdown elements render correctly

## Test Scenario 2: Zoom Controls (AS-2)

### Keyboard Shortcuts
1. With preview active, press **Ctrl/Cmd +** three times
2. **Verify**: Text increases in size smoothly
3. Press **Ctrl/Cmd -** twice
4. **Verify**: Text decreases in size
5. Press **Ctrl/Cmd 0**
6. **Verify**: Zoom resets to 100%

### UI Controls
1. Look for zoom buttons in preview (+ / -)
2. Click **+** button twice
3. **Verify**: Text scales up
4. Click **-** button once
5. **Verify**: Text scales down

## Test Scenario 3: Zoom Persistence (FR-007)

1. Set zoom to 150% (Ctrl/Cmd + five times)
2. Close preview tab
3. Close VS Code completely
4. Reopen VS Code
5. Open any markdown file with preview
6. **Verify**: Preview opens at 150% zoom (persisted)

## Test Scenario 4: Theme Adaptation (FR-010)

1. Open preview with light theme active
2. **Verify**: Preview uses light colors
3. Switch to dark theme (Settings → Color Theme → Dark+)
4. **Verify**: Preview immediately switches to dark colors
5. Switch back to light theme
6. **Verify**: Preview switches to light colors

## Test Scenario 5: Live Updates (FR-008)

1. Open `test-sample.md` in preview
2. In another editor pane, open the same file for editing
3. Add new line: `## New Section`
4. Save file (Ctrl/Cmd+S)
5. **Verify**: Preview updates within 200ms to show new section

## Test Scenario 6: Image Handling (FR-003, FR-009)

### Valid Images
1. Add image with relative path: `![Local](./existing-image.png)`
2. **Verify**: Image displays inline

### Broken Images
1. Add image with invalid path: `![Missing](./does-not-exist.png)`
2. **Verify**: Placeholder or error indicator shown (not blank/broken image icon)

### URL Images
1. Add image from URL: `![Remote](https://via.placeholder.com/150)`
2. **Verify**: Image loads and displays

## Test Scenario 7: Wide Content (FR-011)

1. Add wide code block:
\`\`\`javascript
const veryLongLine = "This is an extremely long line of code that would normally cause horizontal scrolling issues in a narrow preview panel but should be handled gracefully";
\`\`\`

2. Add wide table:
| Column 1 | Column 2 | Column 3 | Column 4 | Column 5 | Column 6 | Column 7 |
|----------|----------|----------|----------|----------|----------|----------|
| Data     | Data     | Data     | Data     | Data     | Data     | Data     |

3. Resize preview panel to narrow width
4. **Verify**:
   - Code wraps reasonably OR horizontal scroll available
   - Table shows horizontal scroll
   - Text content remains readable

## Test Scenario 8: Responsive Layout (FR-005, FR-006)

1. Open preview in wide editor column (> 1000px)
2. **Verify**: Comfortable margins, line length constrained
3. Resize to narrow column (< 500px)
4. **Verify**: Layout adapts, remains readable with appropriate margins

## Performance Validation

1. Open large markdown file (> 10,000 lines)
2. **Verify**: Preview renders in < 1 second
3. Make edit, save
4. **Verify**: Update latency < 200ms
5. Zoom in/out rapidly
6. **Verify**: No lag, smooth updates

## Success Criteria

All scenarios pass = **READY FOR RELEASE**
Any scenario fails = **FIX REQUIRED**

---

**Manual Testing Complete**: All functional requirements validated.