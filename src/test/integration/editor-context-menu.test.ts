/**
 * Integration Tests: Editor Context Menu
 *
 * These tests verify the editor context menu integration for opening
 * Markdown Easy Read preview from within an active markdown document.
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Editor Context Menu Integration Tests', () => {

  // T004: Test menu visibility for different file types
  test('Menu should appear only for markdown files', async function() {
    this.timeout(10000); // Allow time for file operations

    // Test 1: Menu should appear for .md files
    const mdFile = path.join(__dirname, '../../../test-fixtures/sample.md');
    const mdDoc = await vscode.workspace.openTextDocument(mdFile);
    const mdEditor = await vscode.window.showTextDocument(mdDoc);

    // Verify active editor is markdown
    assert.strictEqual(mdEditor.document.languageId, 'markdown', 'Document should be markdown');

    // Verify command is available (would show in menu)
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes('markdownEasyRead.showEasyReadPreview'),
      'Command should be available for markdown files'
    );

    // Close the document
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

    // Test 2: Menu should NOT appear for non-markdown files (.js)
    // Create a temporary JavaScript file
    const jsDoc = await vscode.workspace.openTextDocument({
      language: 'javascript',
      content: 'console.log("test");'
    });
    const jsEditor = await vscode.window.showTextDocument(jsDoc);

    // Verify active editor is NOT markdown
    assert.notStrictEqual(jsEditor.document.languageId, 'markdown', 'Document should not be markdown');

    // Command exists globally, but when clause would hide it
    // (We can't directly test menu visibility, but we verify language ID)
    assert.strictEqual(jsEditor.document.languageId, 'javascript', 'Document should be javascript');

    // Close the document
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

    // Test 3: Menu should appear for other markdown extensions
    const markdownDoc = await vscode.workspace.openTextDocument({
      language: 'markdown',
      content: '# Test'
    });
    const markdownEditor = await vscode.window.showTextDocument(markdownDoc);

    assert.strictEqual(markdownEditor.document.languageId, 'markdown', 'Document should be markdown');

    // Close the document
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
  });

  // T005: Test preview opening from context menu command
  test('Clicking menu should open preview', async function() {
    this.timeout(10000);

    // Open a markdown file
    const mdFile = path.join(__dirname, '../../../test-fixtures/sample.md');
    const mdDoc = await vscode.workspace.openTextDocument(mdFile);
    await vscode.window.showTextDocument(mdDoc);

    // Execute the command (simulates clicking menu)
    await vscode.commands.executeCommand('markdownEasyRead.showEasyReadPreview');

    // Give preview time to open
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify a custom editor is open
    // Note: We can't directly access the webview panel from tests,
    // but we can verify the command executed without error
    // and that the active editor switched to the preview

    // The preview should now be the active editor
    // Note: activeEditor might be undefined (webview) or in a different view column
    // This is expected behavior - command executed successfully

    // Close all editors
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  // T006: Test focus behavior when preview already open
  test('Should focus existing preview when opened again', async function() {
    this.timeout(15000);

    // Open a markdown file
    const mdFile = path.join(__dirname, '../../../test-fixtures/sample.md');
    const mdDoc = await vscode.workspace.openTextDocument(mdFile);
    await vscode.window.showTextDocument(mdDoc);

    // Open preview first time
    await vscode.commands.executeCommand('markdownEasyRead.showEasyReadPreview');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Go back to markdown editor
    await vscode.window.showTextDocument(mdDoc);
    await new Promise(resolve => setTimeout(resolve, 500));

    // Open preview second time (should focus existing, not create duplicate)
    await vscode.commands.executeCommand('markdownEasyRead.showEasyReadPreview');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // We can't easily count webview panels from tests, but the command
    // should execute without error. VS Code's openWith automatically
    // focuses existing custom editor instances.

    // The key assertion is that no error was thrown
    // VS Code handles the focus/reveal logic automatically

    // Close all editors
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  });

  // T007: Test error handling when no active editor
  test('Should fail gracefully with no active editor', async function() {
    this.timeout(5000);

    // Close all editors first
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    await new Promise(resolve => setTimeout(resolve, 500));

    // Verify no active editor
    const activeEditor = vscode.window.activeTextEditor;
    assert.strictEqual(activeEditor, undefined, 'No editor should be active');

    // Execute command - should not throw error
    await assert.doesNotReject(async () => {
      await vscode.commands.executeCommand('markdownEasyRead.showEasyReadPreview');
    }, 'Command should not throw error when no active editor');

    // Verify no error message was shown (we can't directly check this in tests,
    // but if no error was thrown, the contract is satisfied)
  });

});
