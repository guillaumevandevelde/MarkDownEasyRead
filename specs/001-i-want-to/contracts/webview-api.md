# Webview Communication Contract

## Extension → Webview

### UpdateMessage
```typescript
interface UpdateMessage {
  type: 'update';
  payload: {
    html: string;        // Rendered markdown
    zoom: number;        // Zoom level 0.5-3.0
    documentUri: string; // Source file URI
  };
}
```
**Trigger**: File opened, file changed, or initial load
**Response**: Webview updates DOM, applies zoom via CSS

### ZoomChangeMessage
```typescript
interface ZoomChangeMessage {
  type: 'zoomChange';
  payload: {
    zoom: number; // New zoom 0.5-3.0
  };
}
```
**Trigger**: Zoom command executed
**Response**: Webview applies new zoom level

## Webview → Extension

### ReadyMessage
```typescript
interface ReadyMessage {
  type: 'ready';
}
```
**Trigger**: Webview finished loading
**Response**: Extension sends initial UpdateMessage

### ZoomAdjustMessage
```typescript
interface ZoomAdjustMessage {
  type: 'zoomAdjust';
  payload: {
    delta: number; // +0.1, -0.1, or 0 (reset)
  };
}
```
**Trigger**: UI zoom button clicked
**Response**: Extension updates zoom, sends ZoomChangeMessage

### ErrorMessage
```typescript
interface ErrorMessage {
  type: 'error';
  payload: {
    message: string;
    code?: string;
  };
}
```
**Trigger**: Webview error (image load failure, etc.)
**Response**: Extension logs error, optionally shows user notification