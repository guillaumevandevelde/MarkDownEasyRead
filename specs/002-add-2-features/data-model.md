# Data Model: Enhanced Code Display and Context Menu

**Date**: 2025-10-01
**Feature**: 002-add-2-features

## Overview

This feature has **no persistent data entities**. All data structures represent transient runtime state for rendering and configuration.

## Configuration Entities

### PreviewPlacementPreference

**Type**: VS Code Configuration Setting
**Storage**: Workspace/User settings.json

```typescript
type PreviewPlacementPreference = 'replace' | 'beside' | 'default';
```

**Values**:
- `'replace'`: Open preview in current editor group (closes current file)
- `'beside'`: Open preview in new editor column (split view)
- `'default'`: Let VS Code decide based on current layout (same as double-click)

**Access Pattern**:
```typescript
const config = vscode.workspace.getConfiguration('markdownEasyRead');
const placement = config.get<PreviewPlacementPreference>('previewPlacement', 'default');
```

---

### Syntax HighlightingOptions

**Type**: Runtime Configuration Object
**Lifecycle**: Created per code block during rendering

```typescript
interface SyntaxHighlightingOptions {
  language: string | null;         // Explicit language tag or detected language
  lineNumbers: boolean;            // Always true for this feature
  copyButton: boolean;             // Always true for this feature
  theme: 'light' | 'dark' | 'hc'; // Derived from VS Code theme
}
```

**Derivation**:
```typescript
const options: SyntaxHighlightingOptions = {
  language: explicitTag || detectedLanguage,
  lineNumbers: true,
  copyButton: true,
  theme: vscode.window.activeColorTheme.kind === vscode.ColorThemeKind.Dark ? 'dark' : 'light'
};
```

---

### LanguageDetectionResult

**Type**: Runtime Detection Result
**Lifecycle**: Created during markdown rendering, discarded after use

```typescript
interface LanguageDetectionResult {
  language: string | null;        // Detected language identifier (e.g., 'javascript', 'python')
  confidence: number;             // Confidence score 0-100
  alternatives: LanguageAlternative[];  // Alternative language suggestions
}

interface LanguageAlternative {
  language: string;
  confidence: number;
}
```

**Usage Pattern**:
```typescript
const detection = languageDetector.detect(codeContent);

if (detection.confidence > 30) {
  // High confidence: use detected language
  highlighter.highlight(code, detection.language);
} else if (detection.confidence >= 15) {
  // Medium confidence: use but show warning
  highlighter.highlight(code, detection.language);
  showLowConfidenceWarning(detection.alternatives);
} else {
  // Low confidence: fall back to plain text
  renderPlainText(code);
}
```

---

### HighlightedCode

**Type**: Rendering Result
**Lifecycle**: Created by SyntaxHighlighter, consumed by webview

```typescript
interface HighlightedCode {
  html: string;                   // Syntax-highlighted HTML with line numbers
  language: string;               // Language used for highlighting
  lineCount: number;              // Number of lines in code block
  tokens: TokenInfo[];            // Token information for advanced features (optional)
}

interface TokenInfo {
  type: string;                   // Token type (keyword, string, comment, etc.)
  value: string;                  // Token text content
  line: number;                   // Line number (1-indexed)
  column: number;                 // Column start position
}
```

**HTML Structure**:
```html
<div class="code-block-container" data-language="{language}">
  <button class="copy-button" aria-label="Copy code to clipboard" title="Copy">
    <span class="copy-icon">📋</span>
  </button>
  <pre><code class="hljs language-{language}">
    <span class="line">
      <span class="hljs-keyword">const</span>
      <span class="hljs-variable">foo</span> =
      <span class="hljs-number">42</span>;
    </span>
    ...
  </code></pre>
</div>
```

---

## State Flow Diagram

```
User opens markdown file with code blocks
           ↓
MarkdownRenderer.render()
           ↓
For each code block:
    ├── Has explicit language tag?
    │   ├── Yes → Use explicit language
    │   │         ↓
    │   │   LanguageDetector.detect() (for mismatch check)
    │   │         ↓
    │   │   Confidence differs significantly?
    │   │         ├── Yes → Add warning badge
    │   │         └── No → Continue
    │   │
    │   └── No → LanguageDetector.detect()
    │             ↓
    │       Confidence > threshold?
    │             ├── Yes → Use detected language
    │             └── No → Use plain text
    │
    └── SyntaxHighlighter.highlight(code, language)
              ↓
        Return HighlightedCode
              ↓
        Insert into webview HTML
              ↓
        Webview renders with copy buttons
              ↓
        User can copy code
```

---

## Extension Settings Schema

**package.json contributions.configuration**:

```json
{
  "markdownEasyRead.previewPlacement": {
    "type": "string",
    "enum": ["replace", "beside", "default"],
    "default": "default",
    "markdownDescription": "Controls how markdown files open from the context menu:\n- `replace`: Opens in current editor (closes current file)\n- `beside`: Opens in new column (split view)\n- `default`: Uses VS Code's default behavior",
    "scope": "window"
  },
  "markdownEasyRead.syntax.highlightThreshold": {
    "type": "number",
    "default": 15,
    "minimum": 0,
    "maximum": 100,
    "markdownDescription": "Minimum confidence threshold (0-100) for applying detected language syntax highlighting. Lower values are more aggressive.",
    "scope": "window"
  }
}
```

---

## Memory/Performance Characteristics

**Memory Usage** (per markdown file):
- LanguageDetectionResult: ~200 bytes per code block
- HighlightedCode HTML: ~2-10KB per code block (depending on code length)
- Cached language definitions: ~55KB (loaded once, shared across all files)

**Performance Targets** (from research.md):
- Language detection: <5ms per code block
- Syntax highlighting: 1-3ms per code block
- Total render time increase: <20% vs baseline (measured: ~12%)

**Cleanup**:
- Detection results: Garbage collected after render complete
- Highlighted HTML: Persisted in webview, cleaned up when webview disposed
- No memory leaks: All event listeners cleaned up in webview onDidDispose()

---

## No Persistent Data

This feature requires **no database**, **no file system storage**, and **no cloud synchronization**.

All configuration is stored in standard VS Code settings.
All runtime state is transient and garbage collected.
