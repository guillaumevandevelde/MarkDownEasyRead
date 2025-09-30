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
	 * @returns Rendered HTML string
	 */
	public render(content: string, documentUri: vscode.Uri): string {
		try {
			let html = this.md.render(content);
			html = this.resolveImagePaths(html, documentUri);
			return html;
		} catch (error) {
			console.error('Markdown rendering error:', error);
			return this.renderError('Failed to render markdown');
		}
	}

	/**
	 * Resolve relative image paths to absolute file URIs
	 * @param html Rendered HTML
	 * @param documentUri Source document URI
	 * @returns HTML with resolved image paths
	 */
	private resolveImagePaths(html: string, documentUri: vscode.Uri): string {
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

				// Resolve relative paths
				const absolutePath = path.resolve(documentDir, src);
				const fileUri = vscode.Uri.file(absolutePath);
				const webviewUri = fileUri.toString().replace('file:///', 'vscode-resource:/');

				return `<img${before}src="${webviewUri}"${after} onerror="this.style.display='none'; this.insertAdjacentHTML('afterend', '<div class=\\"image-error\\">Image not found: ${path.basename(src)}</div>');">`;
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