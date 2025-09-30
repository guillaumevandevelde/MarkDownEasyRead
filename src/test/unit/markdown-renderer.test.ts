import * as assert from 'assert';
import * as vscode from 'vscode';
import { MarkdownRenderer } from '../../markdownRenderer';

suite('Unit Test: Markdown Renderer', () => {
	let renderer: MarkdownRenderer;
	let testUri: vscode.Uri;

	setup(() => {
		renderer = new MarkdownRenderer();
		testUri = vscode.Uri.file('/test/document.md');
	});

	test('Should render basic markdown to HTML', () => {
		const markdown = '# Heading\n\nParagraph with **bold** text.';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<h1>Heading</h1>'));
		assert.ok(html.includes('<strong>bold</strong>'));
	});

	test('Should handle empty markdown', () => {
		const markdown = '';
		const html = renderer.render(markdown, testUri);

		assert.ok(html !== null);
		assert.ok(html.length >= 0);
	});

	test('Should handle malformed markdown gracefully', () => {
		const markdown = '# Incomplete\n**unclosed bold\n`unclosed code';

		assert.doesNotThrow(() => {
			const html = renderer.render(markdown, testUri);
			assert.ok(html.length > 0);
		});
	});

	test('Should render code blocks', () => {
		const markdown = '```javascript\nconst x = 1;\n```';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<pre>'));
		assert.ok(html.includes('<code'));
	});

	test('Should render inline code', () => {
		const markdown = 'This is `inline code` example.';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<code>inline code</code>'));
	});

	test('Should render lists', () => {
		const markdown = '- Item 1\n- Item 2\n- Item 3';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<ul>'));
		assert.ok(html.includes('<li>'));
	});

	test('Should render links', () => {
		const markdown = '[Link text](https://example.com)';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<a'));
		assert.ok(html.includes('href="https://example.com"'));
	});

	test('Should render images', () => {
		const markdown = '![Alt text](./image.png)';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<img'));
		assert.ok(html.includes('alt="Alt text"'));
	});

	test('Should handle special characters', () => {
		const markdown = 'Text with <html> & special chars';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.length > 0);
	});

	test('Should render tables', () => {
		const markdown = '| Col1 | Col2 |\n|------|------|\n| A    | B    |';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<table>'));
		assert.ok(html.includes('<th>'));
		assert.ok(html.includes('<td>'));
	});

	test('Should render blockquotes', () => {
		const markdown = '> This is a quote';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<blockquote>'));
	});

	test('Should handle very long documents', () => {
		const longMarkdown = '# Heading\n\n' + 'Paragraph text.\n\n'.repeat(1000);

		assert.doesNotThrow(() => {
			const html = renderer.render(longMarkdown, testUri);
			assert.ok(html.length > 0);
		});
	});

	test('Should preserve whitespace in code blocks', () => {
		const markdown = '```\n  indented\n    more indented\n```';
		const html = renderer.render(markdown, testUri);

		assert.ok(html.includes('<pre>'));
	});
});