/**
 * Contract: SyntaxHighlighter
 *
 * Responsible for applying syntax highlighting to code blocks using Highlight.js
 */

export interface HighlightedCode {
  html: string;          // HTML with syntax highlighting and line numbers
  language: string;      // Language used for highlighting
  lineCount: number;     // Number of lines
}

export interface LanguageDetectionResult {
  language: string | null;
  confidence: number;    // 0-100
  alternatives: Array<{language: string; confidence: number}>;
}

export interface SyntaxHighlighter {
  /**
   * Highlight code with specified language
   * @param code - Raw code content
   * @param language - Language identifier (e.g., 'javascript', 'python')
   * @returns Highlighted HTML with line numbers and copy button
   */
  highlight(code: string, language: string): HighlightedCode;

  /**
   * Get list of supported language identifiers
   * @returns Array of language IDs (e.g., ['javascript', 'python', ...])
   */
  getSupportedLanguages(): string[];

  /**
   * Detect language from code content
   * @param code - Raw code content
   * @returns Detection result with confidence score
   */
  detectLanguage(code: string): LanguageDetectionResult;
}

/**
 * Contract Tests - these should FAIL until implementation is complete
 */

// Test 1: Should highlight JavaScript code with correct tokens
// Given: const foo = 42;
// When: highlight(code, 'javascript')
// Then: HTML contains hljs-keyword, hljs-variable, hljs-number classes

// Test 2: Should return supported language list
// When: getSupportedLanguages()
// Then: Returns array with at least 22 languages including javascript, python, typescript

// Test 3: Should detect Python from code sample
// Given: def hello():\n    print("world")
// When: detectLanguage(code)
// Then: Returns {language: 'python', confidence: >30}

// Test 4: Should handle unknown language gracefully
// When: highlight(code, 'nonexistent-lang')
// Then: Falls back to plaintext highlighting without error
