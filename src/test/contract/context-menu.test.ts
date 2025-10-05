/**
 * Contract Tests: ContextMenuHandler
 *
 * These tests define the contract for the ContextMenuHandler class.
 * They will FAIL until the implementation is complete.
 */

import * as assert from 'assert';
import * as vscode from 'vscode';
import { ContextMenuHandler, PreviewPlacementPreference } from '../../contextMenuHandler';

suite('ContextMenuHandler Contract Tests', () => {

  let handler: ContextMenuHandler;

  setup(() => {
    handler = new ContextMenuHandler();
  });

  test('Should register context menu command on activation', async () => {
    // Verify the command is registered in VS Code
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes('markdownEasyRead.openPreviewFromExplorer'),
      'Command markdownEasyRead.openPreviewFromExplorer should be registered'
    );
  });

  test('Should respect file extension filter (.md, .markdown, etc.)', () => {
    // This test verifies the contract expectation that the handler
    // should only be called for markdown files
    // The actual filtering is done by VS Code's when clause in package.json

    // Verify the handler can process markdown URIs
    const mdUri = vscode.Uri.file('/test/file.md');
    const markdownUri = vscode.Uri.file('/test/file.markdown');

    // Handler should accept markdown files (no error thrown)
    assert.doesNotThrow(() => {
      handler.openPreviewInPreferredLocation(mdUri);
    }, 'Should handle .md files');

    assert.doesNotThrow(() => {
      handler.openPreviewInPreferredLocation(markdownUri);
    }, 'Should handle .markdown files');

    // Note: Actual filtering is handled by package.json when clause,
    // but handler should gracefully handle any URI if called
  });

  test('Should honor preview placement preference from settings', () => {
    const placement: PreviewPlacementPreference = handler.getPreviewPlacement();

    // Should return a valid placement preference
    assert.ok(
      placement === 'replace' || placement === 'beside' || placement === 'default',
      `Placement should be one of: replace, beside, default. Got: ${placement}`
    );

    // Default should be 'default' if no setting configured
    // (Can't test actual setting changes in unit test, but we verify the contract)
  });

  // T001: Contract test for editor context menu command registration
  test('Should register showEasyReadPreview command', async () => {
    // Verify the command is registered in VS Code
    const commands = await vscode.commands.getCommands(true);
    assert.ok(
      commands.includes('markdownEasyRead.showEasyReadPreview'),
      'Command markdownEasyRead.showEasyReadPreview should be registered'
    );
  });

  // T002: Contract test for command title
  test('Should have correct command title', async () => {
    // Load package.json to verify command declaration
    const extension = vscode.extensions.getExtension('vdvguillaume.markdown-easy-read');
    assert.ok(extension, 'Extension should be installed');

    const packageJson = extension?.packageJSON;
    assert.ok(packageJson, 'Extension should have package.json');

    // Find the command in contributes.commands
    const commands = packageJson.contributes?.commands || [];
    const showPreviewCommand = commands.find((cmd: { command: string; title: string }) =>
      cmd.command === 'markdownEasyRead.showEasyReadPreview'
    );

    assert.ok(showPreviewCommand, 'Command should be declared in package.json');
    assert.strictEqual(
      showPreviewCommand.title,
      'Show Easy Read Preview',
      'Command title should be exactly "Show Easy Read Preview"'
    );
  });

  // T003: Contract test for menu contribution
  test('Should contribute editor context menu', async () => {
    // Load package.json to verify menu contribution
    const extension = vscode.extensions.getExtension('vdvguillaume.markdown-easy-read');
    assert.ok(extension, 'Extension should be installed');

    const packageJson = extension?.packageJSON;
    assert.ok(packageJson, 'Extension should have package.json');

    // Check editor/context menu contribution
    const menus = packageJson.contributes?.menus || {};
    const editorContextMenu = menus['editor/context'] || [];

    const menuItem = editorContextMenu.find((item: { command: string; when: string; icon?: string }) =>
      item.command === 'markdownEasyRead.showEasyReadPreview'
    );

    assert.ok(menuItem, 'Menu item should be contributed to editor/context');
    assert.strictEqual(
      menuItem.when,
      'editorLangId == markdown',
      'Menu when clause should be "editorLangId == markdown"'
    );
    assert.strictEqual(
      menuItem.icon,
      undefined,
      'Menu item should not have an icon (text-only)'
    );
  });

});
