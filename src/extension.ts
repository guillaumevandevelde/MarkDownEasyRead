import * as vscode from 'vscode';
import { PreviewProvider } from './previewProvider';
import { PreferenceManager } from './preferenceManager';
import { MarkdownRenderer } from './markdownRenderer';

let previewProvider: PreviewProvider | undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Markdown Easy Read extension is now active');

	// Initialize core components
	const preferenceManager = new PreferenceManager(context);
	const markdownRenderer = new MarkdownRenderer();

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

	// Add all disposables to context
	context.subscriptions.push(
		providerRegistration,
		openPreviewCommand,
		zoomInCommand,
		zoomOutCommand,
		resetZoomCommand
	);
}

export function deactivate() {
	previewProvider = undefined;
}