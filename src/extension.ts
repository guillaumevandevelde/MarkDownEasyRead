import * as vscode from 'vscode';
import { PreviewProvider } from './previewProvider';
import { PreferenceManager } from './preferenceManager';
import { MarkdownRenderer } from './markdownRenderer';
import { ContextMenuHandler } from './contextMenuHandler';

let previewProvider: PreviewProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Markdown Easy Read extension is now active');

	// Initialize core components
	const preferenceManager = new PreferenceManager(context);
	const markdownRenderer = new MarkdownRenderer();
	const contextMenuHandler = new ContextMenuHandler();

	// Initialize preview provider
	previewProvider = new PreviewProvider(context, preferenceManager, markdownRenderer);

	// Register custom editor provider
	const providerRegistration = vscode.window.registerCustomEditorProvider(
		'markdownEasyRead.preview',
		previewProvider,
		{
			webviewOptions: {
				retainContextWhenHidden: true
			}
		}
	);

	// Register commands
	const openPreviewCommand = vscode.commands.registerCommand(
		'markdownEasyRead.openPreview',
		async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor || editor.document.languageId !== 'markdown') {
				vscode.window.showErrorMessage('Please open a markdown file first');
				return;
			}

			const uri = editor.document.uri;
			await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview');
		}
	);

	const zoomInCommand = vscode.commands.registerCommand(
		'markdownEasyRead.zoomIn',
		async () => {
			if (previewProvider) {
				await previewProvider.zoomIn();
			}
		}
	);

	const zoomOutCommand = vscode.commands.registerCommand(
		'markdownEasyRead.zoomOut',
		async () => {
			if (previewProvider) {
				await previewProvider.zoomOut();
			}
		}
	);

	const resetZoomCommand = vscode.commands.registerCommand(
		'markdownEasyRead.resetZoom',
		async () => {
			if (previewProvider) {
				await previewProvider.resetZoom();
			}
		}
	);

	const openPreviewFromExplorerCommand = vscode.commands.registerCommand(
		'markdownEasyRead.openPreviewFromExplorer',
		async (uri: vscode.Uri) => {
			await contextMenuHandler.openPreviewInPreferredLocation(uri);
		}
	);

	// T013-T016: Register editor context menu command
	const showEasyReadPreviewCommand = vscode.commands.registerCommand(
		'markdownEasyRead.showEasyReadPreview',
		async () => {
			// T014: Get active editor and validate
			const editor = vscode.window.activeTextEditor;
			if (!editor || editor.document.languageId !== 'markdown') {
				// Silently fail - menu won't show for non-markdown files anyway
				return;
			}

			// T014: Extract URI and open preview
			const uri = editor.document.uri;
			await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview');
		}
	);

	// Add all disposables to context
	context.subscriptions.push(
		providerRegistration,
		openPreviewCommand,
		openPreviewFromExplorerCommand,
		showEasyReadPreviewCommand, // T015: Add disposable to subscriptions
		zoomInCommand,
		zoomOutCommand,
		resetZoomCommand
	);
}

export function deactivate() {
	previewProvider = undefined;
}