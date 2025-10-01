/**
 * LanguageDetector: Detects programming language from code samples
 * Uses Highlight.js highlightAuto() for language detection
 */

import hljs from 'highlight.js/lib/core';

// Import supported languages - same as SyntaxHighlighter
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import csharp from 'highlight.js/lib/languages/csharp';
import html from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import php from 'highlight.js/lib/languages/php';
import ruby from 'highlight.js/lib/languages/ruby';
import swift from 'highlight.js/lib/languages/swift';
import kotlin from 'highlight.js/lib/languages/kotlin';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import yaml from 'highlight.js/lib/languages/yaml';
import xml from 'highlight.js/lib/languages/xml';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import markdown from 'highlight.js/lib/languages/markdown';

/**
 * Language detection result
 */
export interface LanguageDetectionResult {
  language: string | null;        // Detected language identifier
  confidence: number;             // Confidence score 0-100
  alternatives: LanguageAlternative[];  // Alternative language suggestions
}

/**
 * Alternative language suggestion
 */
export interface LanguageAlternative {
  language: string;
  confidence: number;
}

/**
 * LanguageDetector class
 */
export class LanguageDetector {
  private static initialized = false;

  constructor() {
    if (!LanguageDetector.initialized) {
      this.registerLanguages();
      LanguageDetector.initialized = true;
    }
  }

  /**
   * Register all supported languages with Highlight.js
   */
  private registerLanguages(): void {
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('python', python);
    hljs.registerLanguage('java', java);
    hljs.registerLanguage('csharp', csharp);
    hljs.registerLanguage('html', html);
    hljs.registerLanguage('css', css);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('shell', bash);
    hljs.registerLanguage('sql', sql);
    hljs.registerLanguage('go', go);
    hljs.registerLanguage('rust', rust);
    hljs.registerLanguage('php', php);
    hljs.registerLanguage('ruby', ruby);
    hljs.registerLanguage('swift', swift);
    hljs.registerLanguage('kotlin', kotlin);
    hljs.registerLanguage('cpp', cpp);
    hljs.registerLanguage('c', c);
    hljs.registerLanguage('yaml', yaml);
    hljs.registerLanguage('yml', yaml);
    hljs.registerLanguage('xml', xml);
    hljs.registerLanguage('dockerfile', dockerfile);
    hljs.registerLanguage('markdown', markdown);
    hljs.registerLanguage('md', markdown);
  }

  /**
   * Detect language from code sample
   * @param code Code to analyze
   * @returns LanguageDetectionResult with detected language and confidence
   */
  public detect(code: string): LanguageDetectionResult {
    try {
      // Use highlightAuto to detect language
      const result = hljs.highlightAuto(code);

      // Build alternatives list
      const alternatives: LanguageAlternative[] = [];
      if (result.secondBest) {
        alternatives.push({
          language: result.secondBest.language || 'unknown',
          confidence: result.secondBest.relevance || 0
        });
      }

      return {
        language: result.language || null,
        confidence: result.relevance || 0,
        alternatives: alternatives
      };
    } catch (error) {
      // Return null result on error
      return {
        language: null,
        confidence: 0,
        alternatives: []
      };
    }
  }

  /**
   * Detect language with multiple alternatives
   * @param code Code to analyze
   * @returns Array of LanguageDetectionResult sorted by confidence
   */
  public detectWithAlternatives(code: string): LanguageDetectionResult[] {
    try {
      const result = hljs.highlightAuto(code);
      const results: LanguageDetectionResult[] = [];

      // Add primary detection result
      if (result.language) {
        results.push({
          language: result.language,
          confidence: result.relevance || 0,
          alternatives: []
        });
      }

      // Add second best as alternative result
      if (result.secondBest && result.secondBest.language) {
        results.push({
          language: result.secondBest.language,
          confidence: result.secondBest.relevance || 0,
          alternatives: []
        });
      }

      // If no results, return empty array
      if (results.length === 0) {
        results.push({
          language: null,
          confidence: 0,
          alternatives: []
        });
      }

      return results;
    } catch (error) {
      // Return single null result on error
      return [{
        language: null,
        confidence: 0,
        alternatives: []
      }];
    }
  }
}
