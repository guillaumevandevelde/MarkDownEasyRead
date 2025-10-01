/**
 * ContextMenuHandler: Handles context menu commands for opening markdown files
 */

import * as vscode from 'vscode';

/**
 * Preview placement preference
 */
export type PreviewPlacementPreference = 'replace' | 'beside' | 'default';

/**
 * ContextMenuHandler class
 */
export class ContextMenuHandler {

  /**
   * Open markdown file in preview with user's preferred placement
   * @param uri File URI from context menu
   * @returns Promise that resolves when preview is opened
   */
  public async openPreviewInPreferredLocation(uri: vscode.Uri): Promise<void> {
    const placement = this.getPreviewPlacement();

    try {
      switch (placement) {
        case 'replace':
          // Open in current editor group (replaces current file)
          await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview');
          break;

        case 'beside':
          // Open in new editor column (split view)
          await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview', vscode.ViewColumn.Beside);
          break;

        case 'default':
        default:
          // Let VS Code decide based on current layout
          await vscode.commands.executeCommand('vscode.openWith', uri, 'markdownEasyRead.preview');
          break;
      }
    } catch (error) {
      // Show error message if opening fails
      vscode.window.showErrorMessage(`Failed to open markdown preview: ${error}`);
    }
  }

  /**
   * Get current preview placement preference from settings
   * @returns User's configured preference
   */
  public getPreviewPlacement(): PreviewPlacementPreference {
    const config = vscode.workspace.getConfiguration('markdownEasyRead');
    const placement = config.get<string>('previewPlacement', 'default');

    // Validate and return preference
    if (placement === 'replace' || placement === 'beside' || placement === 'default') {
      return placement;
    }

    // Default to 'default' if invalid value
    return 'default';
  }
}
