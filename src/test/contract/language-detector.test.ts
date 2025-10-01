/**
 * Contract Tests: LanguageDetector
 *
 * These tests define the contract for the LanguageDetector class.
 * They will FAIL until the implementation is complete.
 */

import * as assert from 'assert';
import { LanguageDetector, LanguageDetectionResult } from '../../languageDetector';

suite('LanguageDetector Contract Tests', () => {

  let detector: LanguageDetector;

  setup(() => {
    detector = new LanguageDetector();
  });

  test('Should detect TypeScript with high confidence', () => {
    const tsCode = `interface User {
  name: string;
  age: number;
}

const user: User = {
  name: "John",
  age: 30
};`;

    const result: LanguageDetectionResult = detector.detect(tsCode);

    // Verify TypeScript detection
    assert.strictEqual(result.language, 'typescript', 'Should detect TypeScript');
    assert.ok(result.confidence > 30, `Confidence should be >30, got ${result.confidence}`);
  });

  test('Should return null for non-code text (confidence <15)', () => {
    const plainText = 'This is just some regular text without any code syntax.';
    const result: LanguageDetectionResult = detector.detect(plainText);

    // Should have very low confidence or null language
    if (result.language !== null) {
      assert.ok(result.confidence < 15, `Confidence should be <15 for plain text, got ${result.confidence}`);
    }
  });

  test('Should provide alternative language suggestions', () => {
    const ambiguousCode = `function test() {
  return 42;
}`;

    const results: LanguageDetectionResult[] = detector.detectWithAlternatives(ambiguousCode);

    // Should provide multiple suggestions
    assert.ok(results.length >= 1, 'Should provide at least one detection result');

    // First result should be the best match
    assert.ok(results[0].language, 'First result should have a language');
    assert.ok(results[0].confidence > 0, 'First result should have confidence score');

    // If alternatives exist, they should have lower confidence
    if (results.length > 1) {
      assert.ok(results[0].confidence >= results[1].confidence,
        'First result should have highest confidence');
    }
  });

});
