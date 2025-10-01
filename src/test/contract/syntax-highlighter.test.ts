/**
 * Contract Tests: SyntaxHighlighter
 *
 * These tests define the contract for the SyntaxHighlighter class.
 * They will FAIL until the implementation is complete.
 */

import * as assert from 'assert';
import { SyntaxHighlighter, HighlightedCode, LanguageDetectionResult } from '../../syntaxHighlighter';

suite('SyntaxHighlighter Contract Tests', () => {

  let highlighter: SyntaxHighlighter;

  setup(() => {
    highlighter = new SyntaxHighlighter();
  });

  test('Should highlight JavaScript code with correct tokens', () => {
    const code = 'const greeting = "Hello World";\nconsole.log(greeting);';
    const result: HighlightedCode = highlighter.highlight(code, 'javascript');

    // Verify result structure
    assert.ok(result.html, 'Result should contain HTML');
    assert.strictEqual(result.language, 'javascript', 'Language should be javascript');
    assert.strictEqual(result.lineCount, 2, 'Should have 2 lines');

    // Verify HTML contains syntax highlighting classes
    assert.ok(result.html.includes('hljs'), 'HTML should contain hljs classes');
    assert.ok(result.html.includes('const') || result.html.includes('greeting'), 'HTML should contain code content');
  });

  test('Should return supported language list (22+ languages)', () => {
    const languages: string[] = highlighter.getSupportedLanguages();

    // Verify minimum language count
    assert.ok(languages.length >= 22, `Should support at least 22 languages, got ${languages.length}`);

    // Verify common languages are present
    const commonLanguages = ['javascript', 'typescript', 'python', 'java', 'csharp', 'html', 'css'];
    for (const lang of commonLanguages) {
      assert.ok(languages.includes(lang), `Should support ${lang}`);
    }
  });

  test('Should detect Python from code sample with confidence >30', () => {
    const pythonCode = 'def hello():\n    print("Hello World")\n    return True';
    const result: LanguageDetectionResult = highlighter.detectLanguage(pythonCode);

    // Verify detection result
    assert.strictEqual(result.language, 'python', 'Should detect Python');
    assert.ok(result.confidence > 30, `Confidence should be >30, got ${result.confidence}`);
  });

  test('Should handle unknown language gracefully (fallback to plaintext)', () => {
    const code = 'some code here';
    const result: HighlightedCode = highlighter.highlight(code, 'unknownlang');

    // Should not throw error
    assert.ok(result.html, 'Should return HTML even for unknown language');
    assert.ok(result.language, 'Should have a language set (plaintext fallback)');
  });

});
