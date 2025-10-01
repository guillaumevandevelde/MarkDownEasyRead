/**
 * Contract: LanguageDetector
 *
 * Responsible for detecting programming language from code content
 */

export interface LanguageDetectionResult {
  language: string | null;
  confidence: number;  // 0-100
  alternatives: Array<{language: string; confidence: number}>;
}

export interface LanguageDetector {
  /**
   * Detect programming language from code
   * @param code - Raw code content
   * @returns Detection result with primary language and confidence
   */
  detect(code: string): LanguageDetectionResult;

  /**
   * Detect with multiple alternatives
   * @param code - Raw code content
   * @returns Detection result with ranked alternatives
   */
  detectWithAlternatives(code: string): LanguageDetectionResult[];
}

/**
 * Contract Tests - these should FAIL until implementation is complete
 */

// Test 1: Should detect TypeScript with high confidence
// Given: interface Foo { bar: string; }
// When: detect(code)
// Then: Returns {language: 'typescript', confidence: >30}

// Test 2: Should return null for non-code text
// Given: "This is just plain English text without any code syntax."
// When: detect(code)
// Then: Returns {language: null, confidence: <15}

// Test 3: Should provide alternative language suggestions
// Given: Ambiguous code that could be multiple languages
// When: detectWithAlternatives(code)
// Then: Returns multiple results with descending confidence scores
