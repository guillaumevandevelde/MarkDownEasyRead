import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Contract Test: Extension Activation', () => {
	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('your-publisher-name.markdown-easy-read'));
	});

	test('Extension should activate', async () => {
		const ext = vscode.extensions.getExtension('your-publisher-name.markdown-easy-read');
		await ext?.activate();
		assert.strictEqual(ext?.isActive, true);
	});

	test('Command markdownEasyRead.openPreview should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('markdownEasyRead.openPreview'));
	});

	test('Command markdownEasyRead.zoomIn should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('markdownEasyRead.zoomIn'));
	});

	test('Command markdownEasyRead.zoomOut should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('markdownEasyRead.zoomOut'));
	});

	test('Command markdownEasyRead.resetZoom should be registered', async () => {
		const commands = await vscode.commands.getCommands(true);
		assert.ok(commands.includes('markdownEasyRead.resetZoom'));
	});
});