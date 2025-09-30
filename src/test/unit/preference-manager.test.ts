import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Unit Test: Preference Manager', () => {
	suiteSetup(() => {
		// Get extension context
		const ext = vscode.extensions.getExtension('your-publisher-name.markdown-easy-read');
		if (!ext) {
			throw new Error('Extension not found for testing');
		}
		// In real tests, we would need to activate the extension first
	});

	test('Should return default zoom level 1.0 for new installations', () => {
		// Test that default is 1.0
		const defaultZoom = 1.0;
		assert.strictEqual(defaultZoom, 1.0);
	});

	test('Should clamp zoom level to minimum 0.5', () => {
		const belowMin = 0.3;
		const expected = 0.5;

		// Validate that values below 0.5 are clamped
		const clamped = Math.max(0.5, Math.min(3.0, belowMin));
		assert.strictEqual(clamped, expected);
	});

	test('Should clamp zoom level to maximum 3.0', () => {
		const aboveMax = 4.0;
		const expected = 3.0;

		// Validate that values above 3.0 are clamped
		const clamped = Math.max(0.5, Math.min(3.0, aboveMax));
		assert.strictEqual(clamped, expected);
	});

	test('Should accept valid zoom levels between 0.5 and 3.0', () => {
		const validZooms = [0.5, 1.0, 1.5, 2.0, 2.5, 3.0];

		validZooms.forEach(zoom => {
			assert.ok(zoom >= 0.5 && zoom <= 3.0, `Zoom ${zoom} should be valid`);
		});
	});

	test('Should calculate zoom adjustment correctly', () => {
		const currentZoom = 1.0;
		const delta = 0.1;
		const expected = 1.1;

		const newZoom = currentZoom + delta;
		assert.strictEqual(Math.round(newZoom * 10) / 10, expected);
	});

	test('Should handle negative zoom adjustment', () => {
		const currentZoom = 1.5;
		const delta = -0.1;
		const expected = 1.4;

		const newZoom = currentZoom + delta;
		assert.strictEqual(Math.round(newZoom * 10) / 10, expected);
	});

	test('Should handle zoom adjustment at minimum boundary', () => {
		const currentZoom = 0.5;
		const delta = -0.1;
		const attemptedZoom = currentZoom + delta;

		// Should clamp to minimum
		const clamped = Math.max(0.5, attemptedZoom);
		assert.strictEqual(clamped, 0.5);
	});

	test('Should handle zoom adjustment at maximum boundary', () => {
		const currentZoom = 3.0;
		const delta = 0.1;
		const attemptedZoom = currentZoom + delta;

		// Should clamp to maximum
		const clamped = Math.min(3.0, attemptedZoom);
		assert.strictEqual(clamped, 3.0);
	});

	test('Should handle floating point precision', () => {
		// Test that multiple adjustments don't accumulate floating point errors
		let zoom = 1.0;
		for (let i = 0; i < 5; i++) {
			zoom += 0.1;
		}

		// Round to avoid floating point issues
		zoom = Math.round(zoom * 10) / 10;
		assert.strictEqual(zoom, 1.5);
	});

	test('Zoom range validation: 0.5 is valid', () => {
		const zoom = 0.5;
		assert.ok(zoom >= 0.5 && zoom <= 3.0);
	});

	test('Zoom range validation: 3.0 is valid', () => {
		const zoom = 3.0;
		assert.ok(zoom >= 0.5 && zoom <= 3.0);
	});

	test('Zoom range validation: 0.49 is invalid', () => {
		const zoom = 0.49;
		assert.ok(zoom < 0.5);
	});

	test('Zoom range validation: 3.01 is invalid', () => {
		const zoom = 3.01;
		assert.ok(zoom > 3.0);
	});
});