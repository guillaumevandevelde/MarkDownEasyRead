/**
 * Contract: ContextMenuHandler
 *
 * Responsible for handling context menu commands for markdown files
 */

import * as vscode from 'vscode';

export type PreviewPlacementPreference = 'replace' | 'beside' | 'default';

export interface ContextMenuHandler {
  /**
   * Open markdown file in preview with user's preferred placement
   * @param uri - File URI from context menu
   * @returns Promise that resolves when preview is opened
   */
  openPreviewInPreferredLocation(uri: vscode.Uri): Promise<void>;

  /**
   * Get current preview placement preference from settings
   * @returns User's configured preference
   */
  getPreviewPlacement(): PreviewPlacementPreference;
}

/**
 * Contract Tests - these should FAIL until implementation is complete
 */

// Test 1: Should register context menu command
// When: Extension activates
// Then: Command 'markdownEasyRead.openPreviewFromExplorer' is registered

// Test 2: Should respect file extension filter
// Given: Context menu activated on .txt file
// When: Menu appears
// Then: "Open with Markdown Easy Read" option not present

// Test 3: Should honor preview placement preference
// Given: User sets previewPlacement to 'beside'
// When: openPreviewInPreferredLocation() called
// Then: Preview opens in new editor column
