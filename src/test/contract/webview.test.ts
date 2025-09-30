import * as assert from 'assert';

suite('Contract Test: Webview Message Protocol', () => {
	test('UpdateMessage contract should be valid', () => {
		const message = {
			type: 'update',
			payload: {
				html: '<h1>Test</h1>',
				zoom: 1.5,
				documentUri: 'file:///test.md'
			}
		};

		assert.strictEqual(message.type, 'update');
		assert.strictEqual(typeof message.payload.html, 'string');
		assert.strictEqual(typeof message.payload.zoom, 'number');
		assert.ok(message.payload.zoom >= 0.5 && message.payload.zoom <= 3.0);
		assert.strictEqual(typeof message.payload.documentUri, 'string');
	});

	test('ZoomChangeMessage contract should be valid', () => {
		const message = {
			type: 'zoomChange',
			payload: {
				zoom: 1.2
			}
		};

		assert.strictEqual(message.type, 'zoomChange');
		assert.strictEqual(typeof message.payload.zoom, 'number');
		assert.ok(message.payload.zoom >= 0.5 && message.payload.zoom <= 3.0);
	});

	test('ReadyMessage contract should be valid', () => {
		const message = {
			type: 'ready'
		};

		assert.strictEqual(message.type, 'ready');
	});

	test('ZoomAdjustMessage contract should be valid', () => {
		const message = {
			type: 'zoomAdjust',
			payload: {
				delta: 0.1
			}
		};

		assert.strictEqual(message.type, 'zoomAdjust');
		assert.strictEqual(typeof message.payload.delta, 'number');
	});

	test('ErrorMessage contract should be valid', () => {
		const message = {
			type: 'error',
			payload: {
				message: 'Test error',
				code: 'TEST_ERROR'
			}
		};

		assert.strictEqual(message.type, 'error');
		assert.strictEqual(typeof message.payload.message, 'string');
		assert.strictEqual(typeof message.payload.code, 'string');
	});
});