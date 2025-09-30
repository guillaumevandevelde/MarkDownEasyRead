# Extension API Contract

## Commands

### markdownEasyRead.openPreview
**Description**: Opens reader-optimized preview for active markdown file
**Trigger**: Command palette, context menu, or keybinding
**Preconditions**: Active editor contains markdown file
**Success Criteria**: Preview panel opens showing formatted content
**Error Handling**: Show error message if no markdown file active

### markdownEasyRead.zoomIn
**Description**: Increases preview zoom by 0.1 (10%)
**Trigger**: Keybinding (default: Ctrl/Cmd +)
**Preconditions**: Preview panel is active
**Success Criteria**: Text scales up, zoom persists
**Constraints**: Maximum zoom 3.0 (300%)

### markdownEasyRead.zoomOut
**Description**: Decreases preview zoom by 0.1 (10%)
**Trigger**: Keybinding (default: Ctrl/Cmd -)
**Preconditions**: Preview panel is active
**Success Criteria**: Text scales down, zoom persists
**Constraints**: Minimum zoom 0.5 (50%)

### markdownEasyRead.resetZoom
**Description**: Resets zoom to saved default (typically 1.0)
**Trigger**: Keybinding (default: Ctrl/Cmd 0)
**Preconditions**: Preview panel is active
**Success Criteria**: Zoom resets to default level

## Activation Events
- `onCommand:markdownEasyRead.openPreview`
- `onLanguage:markdown`

## Configuration (package.json)
```json
{
  "contributes": {
    "commands": [...],
    "keybindings": [...],
    "customEditors": [{
      "viewType": "markdownEasyRead.preview",
      "displayName": "Markdown Easy Read",
      "selector": [{"filenamePattern": "*.md"}],
      "priority": "option"
    }]
  }
}
```