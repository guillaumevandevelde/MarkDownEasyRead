# Change Log

All notable changes to the "Markdown Easy Read" extension will be documented in this file.

## [1.1.0] - 2025-10-05

### Added
- **Editor Context Menu**: Right-click within any markdown document to access "Show Easy Read Preview"
- Automatic preview focus when menu option is selected while preview is already open (prevents duplicate previews)
- Context menu appears only for markdown files (.md, .markdown, .mdown, .mkd, etc.)

### Commands
- `markdownEasyRead.showEasyReadPreview`: Show Easy Read Preview (available via editor context menu)

### Technical
- Added `editor/context` menu contribution with `editorLangId == markdown` visibility condition
- Integration tests for menu visibility, preview opening, focus behavior, and error handling
- Contract tests for command registration and menu contribution

## [1.0.0] - 2025-09-30

### Added

#### Core Features
- Reader-optimized markdown preview with comfortable typography
- Research-based font stack for optimal readability (system fonts: Segoe UI, SF Pro Text, system-ui)
- Enhanced text rendering with anti-aliasing and optimized legibility
- Zoom controls with keyboard shortcuts (Ctrl/Cmd +, -, 0)
- UI zoom buttons in preview panel
- Global zoom preference persistence across VS Code restarts
- Automatic theme adaptation (light/dark/high-contrast)
- Live preview updates with 200ms debounce
- Responsive layout adapting to panel width

#### Markdown Support
- Full markdown rendering using markdown-it
- Code blocks with syntax highlighting structure and optimized monospace fonts
- Tables with horizontal scrolling
- Images with relative path resolution and query parameter support
- Image error handling with proper HTML escaping
- Blockquotes, lists, links, inline code
- Malformed markdown graceful handling

#### Technical Implementation
- CustomTextEditorProvider for seamless integration
- VS Code globalState API for preference persistence
- CSS Container Queries for responsive design
- VS Code CSS variables for theme integration
- Content Security Policy (CSP) compliant webview
- TypeScript with strict mode
- Comprehensive test suite (contract, integration, unit)

### Configuration
- `markdownEasyRead.zoomLevel`: Zoom level range 0.5-3.0 (default: 1.0)

### Commands
- `markdownEasyRead.openPreview`: Open Markdown Easy Read
- `markdownEasyRead.zoomIn`: Zoom In (Ctrl/Cmd +)
- `markdownEasyRead.zoomOut`: Zoom Out (Ctrl/Cmd -)
- `markdownEasyRead.resetZoom`: Reset Zoom (Ctrl/Cmd 0)

### Performance
- Preview renders in <1 second for documents up to 10,000 lines
- Update latency <200ms after file save
- Smooth zoom adjustments with no lag

---

## Future Enhancements (Planned)

- Export preview as PDF
- Custom CSS theme support
- Markdown table of contents
- Print preview optimization
- Multi-document preview tabs

---

**Legend**
- `Added`: New features
- `Changed`: Changes in existing functionality
- `Deprecated`: Soon-to-be removed features
- `Removed`: Removed features
- `Fixed`: Bug fixes
- `Security`: Security vulnerabilities