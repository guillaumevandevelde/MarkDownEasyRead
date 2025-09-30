# Markdown Easy Read

A VS Code extension that provides a reader-optimized markdown preview with zoom controls and responsive layout.

## Features

- **Reader-Optimized Preview**: Comfortable typography with optimized padding, margins, and line spacing
- **Research-Based Font Stack**: Uses system fonts proven for optimal readability (Segoe UI, SF Pro Text, system-ui)
- **Enhanced Text Rendering**: Anti-aliasing and optimized legibility for comfortable reading
- **Zoom Controls**: Adjust font size with keyboard shortcuts or UI buttons
- **Persistent Preferences**: Zoom level persists across VS Code sessions
- **Theme Integration**: Automatically adapts to VS Code's light/dark theme
- **Live Updates**: Preview updates in real-time as you edit (200ms debounce)
- **Responsive Layout**: Adapts to narrow and wide panel widths
- **Smart Content Handling**: Text wraps, tables scroll horizontally
- **Image Support**: Displays images with graceful error handling, including query parameters

## Usage

### Opening Preview

1. Open any markdown file (`.md`)
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run command: **"Open Markdown Easy Read"**

Or right-click on a markdown file and select **"Open With → Markdown Easy Read"**

### Zoom Controls

#### Keyboard Shortcuts

- **Zoom In**: `Ctrl/Cmd +`
- **Zoom Out**: `Ctrl/Cmd -`
- **Reset Zoom**: `Ctrl/Cmd 0`

#### UI Buttons

Look for `+` and `−` buttons in the top-right corner of the preview.

### Theme Switching

The preview automatically adapts when you change VS Code themes:
1. Go to **Settings → Color Theme**
2. Select any light or dark theme
3. Preview updates instantly

## Requirements

- VS Code 1.85 or later

## Extension Settings

This extension stores:
- `markdownEasyRead.zoomLevel`: Global zoom preference (0.5-3.0, default: 1.0)

## Known Issues

- Custom CSS in markdown is not supported
- Some advanced markdown features may render differently than GitHub

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

### 1.0.0

Initial release with core features:
- Reader-optimized markdown preview
- Zoom controls (keyboard + UI)
- Theme integration
- Live updates
- Responsive layout

## Contributing

This extension was built using the Specify workflow. For contributions:
1. See design specifications in `specs/001-i-want-to/`
2. Follow TDD approach (tests first)
3. Maintain responsive design patterns

## License

MIT

---

**Enjoy reading markdown!** 📖# MarkDownEasyRead
