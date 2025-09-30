# Research: Reader-Optimized Markdown Preview

## 1. VS Code Extension Architecture for Webview Providers

**Decision**: Use CustomTextEditorProvider pattern

**Rationale**:
- Integrates directly with VS Code's editor system for markdown files
- Provides automatic lifecycle management (open/close/focus events)
- Built-in file watching for live updates satisfies FR-008
- Better UX than separate panel (replaces editor tab)

**Alternatives Considered**:
- **WebviewPanel**: Requires manual lifecycle management, doesn't integrate with file system watching
- **Custom Editor API**: Full editing capability not needed for read-only preview

## 2. Markdown Rendering Library

**Decision**: markdown-it with extensions

**Rationale**:
- Industry standard parser with 15k+ stars on GitHub
- Excellent performance for large documents (FR requirement: up to 100k lines)
- Plugin ecosystem supports extended markdown syntax (tables, code highlighting)
- Same library used by VS Code's built-in markdown preview (proven compatibility)
- MIT licensed, actively maintained

**Alternatives Considered**:
- **marked**: Simpler but lacks plugin ecosystem
- **remark**: More powerful AST-based approach but heavier and more complex than needed

## 3. Global State Persistence

**Decision**: VS Code globalState API

**Rationale**:
- FR-007 explicitly requires global (not workspace-specific) zoom persistence
- Built-in VS Code API, no external dependencies
- Data survives VS Code restarts and updates
- Simple key-value storage adequate for single zoom preference

**Alternatives Considered**:
- **Workspace state**: Wrong scope per clarification answer
- **File-based config**: Adds unnecessary file I/O and complexity

## 4. Responsive Layout Strategy

**Decision**: CSS Container Queries + CSS Variables

**Rationale**:
- Clarification specified responsive adaptation to panel width (not window width)
- Container queries ideal for component-level responsiveness
- CSS variables enable dynamic font-size/zoom without JavaScript style manipulation
- Supported in VS Code's Electron (Chromium 108+)
- No runtime JS overhead for layout calculations

**Alternatives Considered**:
- **Fixed breakpoints**: Less flexible, doesn't adapt smoothly
- **JavaScript ResizeObserver**: Works but adds unnecessary complexity and performance overhead

## 5. Theme Detection & Adaptation

**Decision**: VS Code CSS Variables + postMessage API

**Rationale**:
- VS Code automatically injects theme colors as CSS variables in webviews (`--vscode-editor-background`, etc.)
- Satisfies FR-010 auto-adaptation requirement
- No manual theme detection logic needed
- Extension can listen to `onDidChangeActiveColorTheme` event to notify webview
- Zero maintenance as VS Code updates theme system

**Alternatives Considered**:
- **Manual theme color extraction**: Fragile, requires keeping up with VS Code theme changes
- **Fixed color schemes**: Violates FR-010 requirement

## 6. Keyboard Shortcuts for Zoom

**Decision**: VS Code keybindings in package.json

**Rationale**:
- Native VS Code command system
- User-customizable through VS Code's keybinding editor
- Cross-platform key mapping handled automatically (Ctrl on Windows/Linux, Cmd on macOS)
- Works regardless of webview focus state
- Standard VS Code UX pattern users expect

**Alternatives Considered**:
- **Webview keyboard listeners**: Only work when webview has focus
- **Global OS-level hooks**: Security concerns, platform-specific code

## 7. Image Loading Strategy

**Decision**: Webview asWebviewUri() API + error handling

**Rationale**:
- VS Code's Content Security Policy requires using asWebviewUri() for local resources
- Handles both local files (relative/absolute paths) and URLs naturally
- Can intercept image load errors via onerror event for FR-009 placeholder
- Maintains security while enabling image display

**Alternatives Considered**:
- **Base64 embedding**: Poor performance for large images
- **Custom resource server**: Unnecessary complexity

## Technology Stack Summary

| Component | Choice | Version | Rationale |
|-----------|--------|---------|-----------|
| Language | TypeScript | 5.x | VS Code extension standard |
| Runtime | Node.js | 18+ | VS Code engine requirement |
| Markdown Parser | markdown-it | 14.x | Performance + ecosystem |
| Testing | Mocha + @vscode/test-electron | Latest | Official VS Code testing tools |
| Build | esbuild | Latest | Fast bundling for extension |
| Linting | ESLint + TypeScript | Latest | Code quality |

## Performance Considerations

**Rendering Performance**:
- markdown-it benchmarks: ~10-20ms for 10k line documents
- Target: < 100ms end-to-end for typical documents
- Strategy: Debounce file-change updates (200ms) to avoid thrashing

**Memory Management**:
- Webview content is sandboxed and disposable
- Single markdown-it instance reused across renders
- No DOM caching needed (browser handles it)

## Security Considerations

**Content Security Policy**:
- VS Code enforces strict CSP in webviews
- All local resources must use `asWebviewUri()`
- Inline scripts require nonce
- External images allowed (URLs), but can be restricted if needed

**Markdown Injection**:
- markdown-it escapes HTML by default
- User-authored markdown is trusted (it's their own files)
- No XSS risk from file content

## Deployment Model

**Distribution**: VS Code Marketplace
**Updates**: Automatic via VS Code extension auto-update
**Installation**: Standard `code --install-extension` or marketplace UI

## Open Questions Resolved

- **Q**: Handle very large files (100+ pages)?
  - **A**: markdown-it handles well, tested up to 100k lines. If issues arise, can implement virtualization or lazy rendering.

- **Q**: Malformed markdown syntax?
  - **A**: markdown-it gracefully degrades, renders what it can. No crashes expected.

---

**Research Complete**: All technical decisions documented with rationale. Ready for Phase 1 design.