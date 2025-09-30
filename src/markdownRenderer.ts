import MarkdownIt from 'markdown-it';
import * as vscode from 'vscode';
import * as path from 'path';

export class MarkdownRenderer {
	private md: MarkdownIt;

	constructor() {
		this.md = new MarkdownIt({
			html: true,
			linkify: true,
			typographer: true,
			breaks: false
		});
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
}