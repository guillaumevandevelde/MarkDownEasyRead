# Markdown Easy Read

A VS Code extension that provides a reader-optimized markdown preview with zoom controls, syntax highlighting, and responsive layout.

## Features

### Reading Experience
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

### Code Display (New in 1.1.0)
- **Syntax Highlighting**: Automatic syntax highlighting for 22+ programming languages
- **Language Auto-Detection**: Automatically detects code language when not specified
- **Line Numbers**: CSS-based line numbers for easy reference
- **Copy Button**: One-click copy for all code blocks (copies without line numbers)
- **Language Mismatch Warnings**: Alerts when explicit language tag differs from detected language
- **Theme-Adaptive Colors**: Syntax colors adapt to VS Code light/dark themes

### Quick Access (New in 1.1.0)
- **Context Menu Integration**: Right-click any markdown file to open in Easy Read
- **Multiple File Extensions**: Supports .md, .markdown, .mdown, .mkd, .mkdn, .mdwn, .text
- **Configurable Preview Placement**: Choose how preview opens (replace, beside, default)

## Usage

### Opening Preview

There are three ways to open the preview:

**Method 1: Editor Context Menu (New!)**
1. Open any markdown file (`.md`)
2. Right-click anywhere in the document
3. Select **"Show Easy Read Preview"**

**Method 2: Command Palette**
1. Open any markdown file (`.md`)
2. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
3. Run command: **"Open Markdown Easy Read"**

**Method 3: File Explorer**
- Right-click on a markdown file in the explorer and select **"Open With → Markdown Easy Read"**

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

This extension provides the following settings:

- `markdownEasyRead.zoomLevel`: Global zoom preference (0.5-3.0, default: 1.0)
- `markdownEasyRead.previewPlacement`: How to open preview from context menu
  - `default`: Use VS Code's default behavior (default)
  - `replace`: Open in current editor (closes current file)
  - `beside`: Open in new column (split view)

## Supported Languages

Syntax highlighting supports 22 programming languages:
JavaScript, TypeScript, Python, Java, C#, HTML, CSS, JSON, Bash/Shell, SQL, Go, Rust, PHP, Ruby, Swift, Kotlin, C++, C, YAML, XML, Dockerfile, Markdown

## Known Issues

- Custom CSS in markdown is not supported
- Some advanced markdown features may render differently than GitHub

## Release Notes

See [CHANGELOG.md](CHANGELOG.md) for detailed release notes.

### 1.1.0 (Latest)

Enhanced code display and quick access:
- Syntax highlighting for 22+ languages with auto-detection
- Line numbers and copy buttons for code blocks
- Language mismatch warnings
- Context menu integration for quick preview access
- Configurable preview placement setting

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
