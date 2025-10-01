import MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
import * as path from 'path';
import { SyntaxHighlighter } from './syntaxHighlighter';
import { LanguageDetector } from './languageDetector';

export class MarkdownRenderer {
	private md: MarkdownIt;
	private syntaxHighlighter: SyntaxHighlighter;
	private languageDetector: LanguageDetector;

	constructor() {
		this.md = new MarkdownIt({
			html: true,
			linkify: true,
			typographer: true,
			breaks: false
		});

		// Initialize syntax highlighting
		this.syntaxHighlighter = new SyntaxHighlighter();
		this.languageDetector = new LanguageDetector();

		// Override code fence rendering for syntax highlighting
		this.setupCodeBlockRendering();
	}

	/**
	 * Setup custom code block rendering with syntax highlighting
	 */
	private setupCodeBlockRendering(): void {
		// Store original fence renderer
		const defaultFenceRenderer = this.md.renderer.rules.fence ||
			((tokens, idx, options, _env, self) => self.renderToken(tokens, idx, options));

		// Override fence renderer
		this.md.renderer.rules.fence = (tokens, idx, options, env, self) => {
			const token = tokens[idx];
			const code = token.content;
			const explicitLang = token.info.trim(); // Language tag from ```lang

			try {
				let language = explicitLang;
				let showWarning = false;

				// If no explicit language, detect it
				if (!language) {
					const detection = this.languageDetector.detect(code);
					if (detection.confidence >= 15) {
						language = detection.language || 'plaintext';
					} else {
						language = 'plaintext';
					}
				} else {
					// If explicit language provided, check for mismatch
					const detection = this.languageDetector.detect(code);
					if (detection.language && detection.language !== explicitLang && detection.confidence > 30) {
						// Detected language differs significantly from explicit tag
						showWarning = true;
					}
				}

				// Highlight the code
				const highlighted = this.syntaxHighlighter.highlight(code, language);

				// Build HTML with copy button
				let html = '<div class="code-block-container" data-language="' + this.escapeHtml(highlighted.language) + '">';
				html += '<button class="copy-button" aria-label="Copy code to clipboard" title="Copy">';
				html += '<span class="copy-icon">📋</span>';
				html += '</button>';

				// Add warning if language mismatch detected
				if (showWarning) {
					html += '<div class="language-warning" title="Code appears to be a different language">⚠️</div>';
				}

				html += '<pre><code class="hljs language-' + this.escapeHtml(highlighted.language) + '">';
				html += highlighted.html;
				html += '</code></pre>';
				html += '</div>';

				return html;
			} catch (error) {
				// Fallback to default rendering on error
				return defaultFenceRenderer(tokens, idx, options, env, self);
			}
		};
	}

	/**
	 * Render markdown content to HTML
	 * @param content Markdown source text
	 * @param documentUri URI of the source document (for resolving relative paths)
	 * @param webview Webview instance for converting URIs
	 * @returns Rendered HTML string
	 */
	public render(content: string, documentUri: vscode.Uri, webview: vscode.Webview): string {
		try {
			let html = this.md.render(content);
			html = this.resolveImagePaths(html, documentUri, webview);
			return html;
		} catch (error) {
			console.error('Markdown rendering error:', error);
			return this.renderError('Failed to render markdown');
		}
	}

	/**
	 * Resolve relative image paths to webview URIs
	 * @param html Rendered HTML
	 * @param documentUri Source document URI
	 * @param webview Webview instance
	 * @returns HTML with resolved image paths
	 */
	private resolveImagePaths(html: string, documentUri: vscode.Uri, webview: vscode.Webview): string {
		const documentDir = path.dirname(documentUri.fsPath);

		return html.replace(
			/<img([^>]*?)src="([^"]+)"([^>]*?)>/g,
			(match, before, src, after) => {
				// Skip absolute URLs (http:// or https://)
				if (src.startsWith('http://') || src.startsWith('https://')) {
					return match;
				}

				// Skip data URIs
				if (src.startsWith('data:')) {
					return match;
				}

				// Parse the src to separate path from query string
				const srcUrl = new URL(src, 'file:///dummy');
				const cleanPath = srcUrl.pathname.replace(/^\//, ''); // Remove leading slash from pathname
				const queryString = srcUrl.search; // Includes the '?'

				// Resolve relative paths (without query string)
				const absolutePath = path.resolve(documentDir, cleanPath);
				const fileUri = vscode.Uri.file(absolutePath);
				const webviewUri = webview.asWebviewUri(fileUri);

				// Reconstruct with query string if present
				const finalUri = queryString ? `${webviewUri.toString()}${queryString}` : webviewUri.toString();

				// Extract just the filename for error message (without query string)
				const basename = path.basename(cleanPath);
				const errorMsg = `Image not found: ${basename}`.replace(/'/g, '&apos;');

				return `<img${before}src="${finalUri}"${after} onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '&lt;div class=&quot;image-error&quot;&gt;${errorMsg}&lt;/div&gt;');">`;
			}
		);
	}

	/**
	 * Render an error message
	 * @param message Error message
	 * @returns HTML error display
	 */
	private renderError(message: string): string {
		return `<div class="render-error"><strong>Error:</strong> ${message}</div>`;
	}

	/**
	 * Escape HTML special characters
	 * @param text Text to escape
	 * @returns Escaped text
	 */
	private escapeHtml(text: string): string {
		const map: { [key: string]: string } = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;',
			'"': '&quot;',
			"'": '&#039;'
		};
		return text.replace(/[&<>"']/g, m => map[m]);
	}
}