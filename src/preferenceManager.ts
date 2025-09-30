import * as vscode from 'vscode';

export class PreferenceManager {
	private static readonly ZOOM_KEY = 'markdownEasyRead.zoomLevel';
	private static readonly DEFAULT_ZOOM = 1.0;
	private static readonly MIN_ZOOM = 0.5;
	private static readonly MAX_ZOOM = 3.0;

	constructor(private context: vscode.ExtensionContext) {}

	/**
	 * Get the current zoom level from global state
	 * @returns Current zoom level (0.5-3.0), defaults to 1.0
	 */
	public getZoomLevel(): number {
		const zoom = this.context.globalState.get<number>(
			PreferenceManager.ZOOM_KEY,
			PreferenceManager.DEFAULT_ZOOM
		);
		return this.clampZoom(zoom);
	}

	/**
	 * Update the zoom level in global state
	 * @param zoom New zoom level (will be clamped to 0.5-3.0)
	 */
	public async updateZoomLevel(zoom: number): Promise<void> {
		const clampedZoom = this.clampZoom(zoom);
		await this.context.globalState.update(PreferenceManager.ZOOM_KEY, clampedZoom);
	}

	/**
	 * Get the default zoom level
	 * @returns Default zoom level (1.0)
	 */
	public getDefaultZoom(): number {
		return PreferenceManager.DEFAULT_ZOOM;
	}

	/**
	 * Adjust zoom level by a delta
	 * @param delta Amount to adjust zoom (+0.1, -0.1, etc.)
	 * @returns New zoom level after adjustment
	 */
	public async adjustZoom(delta: number): Promise<number> {
		const currentZoom = this.getZoomLevel();
		const newZoom = currentZoom + delta;
		await this.updateZoomLevel(newZoom);
		return this.getZoomLevel();
	}

	/**
	 * Reset zoom to default level
	 */
	public async resetZoom(): Promise<void> {
		await this.updateZoomLevel(PreferenceManager.DEFAULT_ZOOM);
	}

	/**
	 * Clamp zoom level to valid range
	 * @param zoom Zoom level to clamp
	 * @returns Clamped zoom level (0.5-3.0)
	 */
	private clampZoom(zoom: number): number {
		return Math.max(PreferenceManager.MIN_ZOOM, Math.min(PreferenceManager.MAX_ZOOM, zoom));
	}
}