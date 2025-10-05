import * as vscode from 'vscode';
import * as path from 'path';
import { PreferenceManager } from './preferenceManager';
import { MarkdownRenderer } from './markdownRenderer';

interface WebviewMessage {
	type: string;
	payload?: any;
}

export class PreviewProvider implements vscode.CustomTextEditorProvider {
	private activeWebview: vscode.Webview | undefined;
	private activeDocument: vscode.TextDocument | undefined;
	private updateTimeout: NodeJS.Timeout | undefined;

	constructor(
		private readonly context: vscode.ExtensionContext,
		private readonly preferenceManager: PreferenceManager,
		private readonly markdownRenderer: MarkdownRenderer
	) {}

	/**
	 * Called when a custom editor is opened
	 */
	public async resolveCustomTextEditor(
		document: vscode.TextDocument,
		webviewPanel: vscode.WebviewPanel,
		_token: vscode.CancellationToken
	): Promise<void> {
		this.activeDocument = document;
		this.activeWebview = webviewPanel.webview;

		// Configure webview options
		webviewPanel.webview.options = {
			enableScripts: true,
			localResourceRoots: [
				vscode.Uri.file(path.dirname(document.uri.fsPath)),
				vscode.Uri.file(path.join(this.context.extensionPath, 'out', 'webview'))
			]
		};

		// Set webview HTML content
		webviewPanel.webview.html = this.getWebviewContent(webviewPanel.webview);

		// Handle messages from webview
		webviewPanel.webview.onDidReceiveMessage(
			this.handleWebviewMessage.bind(this),
			undefined,
			this.context.subscriptions
		);

		// Listen for document changes with debounce
		const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(e => {
			if (e.document.uri.toString() === document.uri.toString()) {
				this.scheduleUpdate();
			}
		});

		// Listen for document save
		const saveDocumentSubscription = vscode.workspace.onDidSaveTextDocument(doc => {
			if (doc.uri.toString() === document.uri.toString()) {
				this.updatePreview();
			}
		});

		// Listen for theme changes
		const themeChangeSubscription = vscode.window.onDidChangeActiveColorTheme(() => {
			this.updatePreview();
		});

		// Clean up when panel is closed
		webviewPanel.onDidDispose(() => {
			changeDocumentSubscription.dispose();
			saveDocumentSubscription.dispose();
			themeChangeSubscription.dispose();
			if (this.updateTimeout) {
				clearTimeout(this.updateTimeout);
			}
			if (this.activeWebview === webviewPanel.webview) {
				this.activeWebview = undefined;
				this.activeDocument = undefined;
			}
		});

		// Wait for webview to be ready, then send initial content
		// The webview will send a 'ready' message when loaded
	}

	/**
	 * Handle messages from the webview
	 */
	private async handleWebviewMessage(message: WebviewMessage): Promise<void> {
		switch (message.type) {
			case 'ready':
				// Webview is ready, send initial content
				await this.updatePreview();
				break;

			case 'zoomAdjust':
				if (message.payload && typeof message.payload.delta === 'number') {
					await this.adjustZoom(message.payload.delta);
				}
				break;

			case 'error':
				if (message.payload && message.payload.message) {
					console.error('Webview error:', message.payload.message);
				}
				break;
		}
	}

	/**
	 * Schedule a preview update with debounce
	 */
	private scheduleUpdate(): void {
		if (this.updateTimeout) {
			clearTimeout(this.updateTimeout);
		}
		this.updateTimeout = setTimeout(() => {
			this.updatePreview();
		}, 200);
	}

	/**
	 * Update the preview content
	 */
	private async updatePreview(): Promise<void> {
		if (!this.activeWebview || !this.activeDocument) {
			return;
		}

		const content = this.activeDocument.getText();
		const html = this.markdownRenderer.render(content, this.activeDocument.uri, this.activeWebview);
		const zoom = this.preferenceManager.getZoomLevel();

		this.activeWebview.postMessage({
			type: 'update',
			payload: {
				html,
				zoom,
				documentUri: this.activeDocument.uri.toString()
			}
		});
	}

	/**
	 * Adjust zoom level
	 */
	private async adjustZoom(delta: number): Promise<void> {
		const newZoom = await this.preferenceManager.adjustZoom(delta);

		if (this.activeWebview) {
			this.activeWebview.postMessage({
				type: 'zoomChange',
				payload: { zoom: newZoom }
			});
		}
	}

	/**
	 * Zoom in (increase by 0.1)
	 */
	public async zoomIn(): Promise<void> {
		await this.adjustZoom(0.1);
	}

	/**
	 * Zoom out (decrease by 0.1)
	 */
	public async zoomOut(): Promise<void> {
		await this.adjustZoom(-0.1);
	}

	/**
	 * Reset zoom to default
	 */
	public async resetZoom(): Promise<void> {
		await this.preferenceManager.resetZoom();
		const zoom = this.preferenceManager.getZoomLevel();

		if (this.activeWebview) {
			this.activeWebview.postMessage({
				type: 'zoomChange',
				payload: { zoom }
			});
		}
	}

	/**
	 * Generate the HTML content for the webview
	 */
	private getWebviewContent(webview: vscode.Webview): string {
		const nonce = this.getNonce();

		return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${webview.cspSource} https: data:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
	<title>Markdown Easy Read</title>
	<style>
		:root {
			--zoom-level: 1.0;
		}

		body {
			/* Optimized readable font stack based on research:
			   - System fonts render best on each platform
			   - Sans-serif proven better for screen reading
			   - High-quality fallback chain for cross-platform consistency */
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Text', system-ui, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
			font-size: calc(16px * var(--zoom-level));
			line-height: 1.6;
			color: var(--vscode-editor-foreground);
			background-color: var(--vscode-editor-background);
			padding: 0;
			margin: 0;
			/* Improved text rendering for better readability */
			-webkit-font-smoothing: antialiased;
			-moz-osx-font-smoothing: grayscale;
			text-rendering: optimizeLegibility;
		}

		.container {
			max-width: 800px;
			margin: 0 auto;
			padding: 2rem;
			container-type: inline-size;
		}

		@container (max-width: 600px) {
			.container {
				padding: 1rem;
			}
		}

		.zoom-controls {
			position: fixed;
			top: 1rem;
			right: 1rem;
			display: flex;
			gap: 0.5rem;
			z-index: 1000;
		}

		.zoom-button {
			background: var(--vscode-button-background);
			color: var(--vscode-button-foreground);
			border: none;
			padding: 0.5rem 1rem;
			cursor: pointer;
			border-radius: 4px;
			font-size: 14px;
		}

		.zoom-button:hover {
			background: var(--vscode-button-hoverBackground);
		}

		#content h1, #content h2, #content h3, #content h4, #content h5, #content h6 {
			margin-top: 1.5em;
			margin-bottom: 0.5em;
			font-weight: 600;
			line-height: 1.3;
		}

		#content h1 { font-size: 2em; }
		#content h2 { font-size: 1.5em; }
		#content h3 { font-size: 1.25em; }

		#content p {
			margin-bottom: 1em;
		}

		#content a {
			color: var(--vscode-textLink-foreground);
			text-decoration: none;
		}

		#content a:hover {
			text-decoration: underline;
		}

		#content code {
			background: var(--vscode-textCodeBlock-background);
			padding: 0.2em 0.4em;
			border-radius: 3px;
			/* Use monospace for code, respecting VS Code editor font first */
			font-family: var(--vscode-editor-font-family, 'SF Mono', 'Consolas', 'Monaco', 'Menlo', 'Courier New', monospace);
		}

		#content pre {
			background: var(--vscode-textCodeBlock-background);
			padding: 1em;
			border-radius: 4px;
			overflow-x: auto;
		}

		#content pre code {
			background: none;
			padding: 0;
		}

		#content table {
			border-collapse: collapse;
			width: 100%;
			margin: 1em 0;
			display: block;
			overflow-x: auto;
		}

		#content table th,
		#content table td {
			border: 1px solid var(--vscode-panel-border);
			padding: 0.5em;
		}

		#content table th {
			background: var(--vscode-editor-selectionBackground);
			font-weight: 600;
		}

		#content img {
			max-width: 100%;
			height: auto;
		}

		#content blockquote {
			border-left: 4px solid var(--vscode-textBlockQuote-border);
			padding-left: 1em;
			margin-left: 0;
			color: var(--vscode-textBlockQuote-foreground);
		}

		.image-error {
			color: var(--vscode-errorForeground);
			padding: 0.5em;
			background: var(--vscode-inputValidation-errorBackground);
			border: 1px solid var(--vscode-inputValidation-errorBorder);
			border-radius: 4px;
			margin: 0.5em 0;
		}

		.render-error {
			color: var(--vscode-errorForeground);
			padding: 1em;
			background: var(--vscode-inputValidation-errorBackground);
			border: 1px solid var(--vscode-inputValidation-errorBorder);
			border-radius: 4px;
			margin: 1em 0;
		}

		/* Highlight.js Syntax Highlighting Theme (VS Code adapted) */
		.hljs {
			display: block;
			overflow-x: auto;
			color: var(--vscode-editor-foreground);
		}

		/* Comments */
		.hljs-comment,
		.hljs-quote {
			color: var(--vscode-descriptionForeground);
			font-style: italic;
		}

		/* Keywords, tags */
		.hljs-keyword,
		.hljs-selector-tag,
		.hljs-tag,
		.hljs-name {
			color: #569cd6; /* Blue for keywords */
		}

		/* Strings */
		.hljs-string,
		.hljs-attr,
		.hljs-selector-attr,
		.hljs-selector-pseudo {
			color: #ce9178; /* Orange/brown for strings */
		}

		/* Numbers */
		.hljs-number,
		.hljs-literal {
			color: #b5cea8; /* Light green for numbers */
		}

		/* Functions */
		.hljs-title,
		.hljs-function,
		.hljs-built_in {
			color: #dcdcaa; /* Yellow for functions */
		}

		/* Types, classes */
		.hljs-type,
		.hljs-class,
		.hljs-selector-class {
			color: #4ec9b0; /* Cyan for types */
		}

		/* Variables, attributes */
		.hljs-variable,
		.hljs-template-variable,
		.hljs-attribute {
			color: #9cdcfe; /* Light blue for variables */
		}

		/* Operators, symbols */
		.hljs-operator,
		.hljs-symbol,
		.hljs-bullet,
		.hljs-link {
			color: var(--vscode-editor-foreground);
		}

		/* Additions (diff) */
		.hljs-addition {
			color: #b5cea8;
			background-color: rgba(181, 206, 168, 0.1);
		}

		/* Deletions (diff) */
		.hljs-deletion {
			color: #f48771;
			background-color: rgba(244, 135, 113, 0.1);
		}

		/* Meta, doctags */
		.hljs-meta,
		.hljs-doctag {
			color: #569cd6;
		}

		/* Sections, titles */
		.hljs-section {
			color: #dcdcaa;
			font-weight: bold;
		}

		/* Emphasis */
		.hljs-emphasis {
			font-style: italic;
		}

		/* Strong */
		.hljs-strong {
			font-weight: bold;
		}

		/* Code block container with copy button */
		.code-block-container {
			position: relative;
			margin: 1em 0;
		}

		.copy-button {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			background: var(--vscode-button-background);
			color: var(--vscode-button-foreground);
			border: none;
			padding: 0.25rem 0.5rem;
			cursor: pointer;
			border-radius: 3px;
			font-size: 12px;
			opacity: 0.7;
			transition: opacity 0.2s;
			z-index: 10;
		}

		.copy-button:hover {
			opacity: 1;
			background: var(--vscode-button-hoverBackground);
		}

		.copy-icon {
			display: inline-block;
		}

		.language-warning {
			position: absolute;
			top: 0.5rem;
			left: 0.5rem;
			font-size: 16px;
			opacity: 0.7;
		}
	</style>
</head>
<body>
	<div class="zoom-controls">
		<button class="zoom-button" id="zoom-out" title="Zoom Out (Ctrl/Cmd -)">−</button>
		<button class="zoom-button" id="zoom-in" title="Zoom In (Ctrl/Cmd +)">+</button>
	</div>
	<div class="container">
		<div id="content"></div>
	</div>
	<script nonce="${nonce}">
		const vscode = acquireVsCodeApi();
		const contentDiv = document.getElementById('content');
		const zoomInBtn = document.getElementById('zoom-in');
		const zoomOutBtn = document.getElementById('zoom-out');

		// Handle messages from extension
		window.addEventListener('message', event => {
			const message = event.data;

			switch (message.type) {
				case 'update':
					contentDiv.innerHTML = message.payload.html;
					applyZoom(message.payload.zoom);
					attachCopyButtons(); // Attach copy button handlers after content update
					break;

				case 'zoomChange':
					applyZoom(message.payload.zoom);
					break;
			}
		});

		// Apply zoom level
		function applyZoom(zoom) {
			document.documentElement.style.setProperty('--zoom-level', zoom);
		}

		// Zoom controls
		zoomInBtn.addEventListener('click', () => {
			vscode.postMessage({
				type: 'zoomAdjust',
				payload: { delta: 0.1 }
			});
		});

		zoomOutBtn.addEventListener('click', () => {
			vscode.postMessage({
				type: 'zoomAdjust',
				payload: { delta: -0.1 }
			});
		});

		// Attach copy button handlers to all code blocks
		function attachCopyButtons() {
			const copyButtons = document.querySelectorAll('.copy-button');
			copyButtons.forEach(button => {
				button.addEventListener('click', () => {
					const codeBlock = button.parentElement.querySelector('code');
					if (codeBlock) {
						const code = codeBlock.textContent;
						navigator.clipboard.writeText(code).then(() => {
							// Show feedback
							const icon = button.querySelector('.copy-icon');
							const originalText = icon.textContent;
							icon.textContent = '✓';
							button.style.opacity = '1';
							setTimeout(() => {
								icon.textContent = originalText;
								button.style.opacity = '0.7';
							}, 2000);
						}).catch(err => {
							console.error('Failed to copy:', err);
						});
					}
				});
			});
		}

		// Notify extension that webview is ready
		vscode.postMessage({ type: 'ready' });
	</script>
</body>
</html>`;
	}

	/**
	 * Generate a nonce for CSP
	 */
	private getNonce(): string {
		let text = '';
		const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		for (let i = 0; i < 32; i++) {
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return text;
	}
}