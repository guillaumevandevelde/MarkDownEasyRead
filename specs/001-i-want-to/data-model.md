# Data Model: Reader-Optimized Markdown Preview

## Entity: PreviewState

**Purpose**: Represents the runtime state of an active markdown preview instance.

**Attributes**:
| Name | Type | Description | Validation |
|------|------|-------------|------------|
| documentUri | string | URI of the markdown file being previewed | Must be valid VS Code URI |
| zoomLevel | number | Current zoom multiplier | 0.5 ≤ value ≤ 3.0 |
| scrollPosition | number | Vertical scroll offset in pixels | value ≥ 0 |

**Lifecycle**:
- Created when user opens preview for a markdown file
- Updated on zoom changes, scroll events
- Destroyed when preview panel is closed

**Relationships**:
- 1:1 with Markdown Document
- N:1 with GlobalPreferences (reads default zoom on creation)

## Entity: GlobalPreferences

**Purpose**: Stores user preferences that persist across all VS Code sessions and workspaces.

**Attributes**:
| Name | Type | Description | Validation |
|------|------|-------------|------------|
| defaultZoomLevel | number | Global default zoom level | 0.5 ≤ value ≤ 3.0, default 1.0 |
| lastModified | timestamp | When preference was last updated | ISO 8601 format |

**Storage**: VS Code globalState API (`context.globalState`)

**Lifecycle**:
- Loaded on extension activation
- Updated whenever user changes zoom and it differs from current default
- Persisted automatically by VS Code

**Relationships**:
- 1:N with PreviewState instances (provides default zoom)

## Entity: WebviewMessage

**Purpose**: Defines the communication protocol between extension host and webview.

**Message Types**:

### Extension → Webview Messages

#### UpdateMessage
```typescript
{
  type: 'update',
  payload: {
    html: string,        // Rendered markdown HTML
    zoom: number,        // Current zoom level
    documentUri: string  // Source file URI
  }
}
```

#### ZoomChangeMessage
```typescript
{
  type: 'zoomChange',
  payload: {
    zoom: number  // New zoom level (0.5-3.0)
  }
}
```

### Webview → Extension Messages

#### ReadyMessage
```typescript
{
  type: 'ready'
}
```
Sent when webview has loaded and is ready to receive updates.

#### ZoomAdjustMessage
```typescript
{
  type: 'zoomAdjust',
  payload: {
    delta: number  // Change in zoom (+0.1, -0.1, or 0 for reset)
  }
}
```

#### ErrorMessage
```typescript
{
  type: 'error',
  payload: {
    message: string,  // Error description
    code?: string     // Optional error code
  }
}
```

## Entity: Markdown Document

**Purpose**: Represents the source markdown file (read-only from extension perspective).

**Attributes**:
| Name | Type | Description |
|------|------|-------------|
| uri | VS Code Uri | File system location |
| content | string | Raw markdown text |
| lastModified | timestamp | File modification time |

**Source**: VS Code workspace file system

**Lifecycle**:
- Managed by VS Code
- Extension observes via file system watcher (FR-008)

**Relationships**:
- 1:1 with PreviewState when preview is open

## Entity: Preview Panel

**Purpose**: The rendered webview displaying formatted markdown.

**Attributes**:
| Name | Type | Description |
|------|------|-------------|
| webview | VS Code Webview | Webview instance |
| viewColumn | ViewColumn | Editor column position |
| isVisible | boolean | Visibility state |

**Lifecycle**:
- Created by CustomTextEditorProvider when markdown file opened
- Disposed when tab closed or file closed

**State Transitions**:
```
[Created] → (user opens preview) → [Visible]
[Visible] → (user switches tab) → [Hidden]
[Hidden] → (user returns to tab) → [Visible]
[Visible] → (user closes tab) → [Disposed]
```

## Data Flow

### Preview Creation Flow
```
User Action: Open Preview Command
  ↓
Extension: Create PreviewState
  ↓
Extension: Load GlobalPreferences.defaultZoomLevel
  ↓
Extension: Initialize PreviewState.zoomLevel
  ↓
Extension: Create Webview Panel
  ↓
Webview: Send ReadyMessage
  ↓
Extension: Render markdown → HTML
  ↓
Extension: Send UpdateMessage(html, zoom)
  ↓
Webview: Display content
```

### Zoom Adjustment Flow
```
User Action: Keyboard shortcut OR UI button click
  ↓
Webview: Send ZoomAdjustMessage(delta)
  ↓
Extension: Update PreviewState.zoomLevel
  ↓
Extension: Update GlobalPreferences.defaultZoomLevel
  ↓
Extension: Send ZoomChangeMessage(zoom)
  ↓
Webview: Apply CSS zoom via CSS variables
```

### File Change Flow (FR-008)
```
File System: markdown file saved
  ↓
VS Code: Fire onDidChangeTextDocument event
  ↓
Extension: Detect change for active preview
  ↓
Extension: Debounce (200ms)
  ↓
Extension: Re-render markdown → HTML
  ↓
Extension: Send UpdateMessage(html, zoom)
  ↓
Webview: Update display (preserve scroll position)
```

## Validation Rules

**Zoom Level**:
- Minimum: 0.5 (50%)
- Maximum: 3.0 (300%)
- Increment: 0.1 (10%)
- Default: 1.0 (100%)

**URI Validation**:
- Must be markdown file (`.md` or `.markdown` extension)
- Must exist in workspace
- Must be readable

**Message Validation**:
- All messages must have valid `type` field
- Payload must match schema for type
- Unknown message types logged as warnings, not errors

## Performance Constraints

**Memory**:
- PreviewState: < 1KB per instance
- Rendered HTML: Target < 1MB for typical documents
- GlobalPreferences: < 100 bytes

**Persistence**:
- GlobalPreferences save latency: < 50ms (async, non-blocking)
- State retrieval: < 10ms (synchronous from memory)

---

**Data Model Complete**: All entities, relationships, and flows documented.