# Storage API Contract

## Global State (VS Code globalState)

### Key: `markdownEasyRead.zoomLevel`
**Type**: `number`
**Default**: `1.0`
**Range**: `0.5 - 3.0`
**Persistence**: Survives VS Code restarts
**Scope**: Global (all workspaces)

### Operations

#### Read
```typescript
const zoom = context.globalState.get<number>('markdownEasyRead.zoomLevel', 1.0);
```
**Returns**: Current zoom or default 1.0
**Performance**: Synchronous, < 10ms

#### Write
```typescript
await context.globalState.update('markdownEasyRead.zoomLevel', newZoom);
```
**Side Effects**: Persisted to disk asynchronously
**Performance**: < 50ms (non-blocking)
**Error Handling**: VS Code handles failures silently

## Migration Strategy
**v1.0**: Single key schema (current)
**Future**: If additional settings needed, use namespaced keys:
- `markdownEasyRead.preferences.zoom`
- `markdownEasyRead.preferences.theme`