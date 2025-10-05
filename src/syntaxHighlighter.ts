/**
 * SyntaxHighlighter: Provides syntax highlighting for code blocks
 * Uses Highlight.js for syntax highlighting with support for 22+ languages
 */

import hljs from 'highlight.js/lib/core';

// Import supported languages
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
 * Language detection result interface
 */
export interface LanguageDetectionResult {
  language: string | null;
  confidence: number;
}

/**
 * Highlighted code result interface
 */
export interface HighlightedCode {
  html: string;           // HTML with syntax highlighting
  language: string;       // Language used for highlighting
  lineCount: number;      // Number of lines in the code
}

/**
 * SyntaxHighlighter class
 */
export class SyntaxHighlighter {
  private static initialized = false;
  private supportedLanguages: string[] = [];

  constructor() {
    if (!SyntaxHighlighter.initialized) {
      this.registerLanguages();
      SyntaxHighlighter.initialized = true;
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

    // Store supported languages list
    this.supportedLanguages = [
      'javascript', 'typescript', 'python', 'java', 'csharp', 'html', 'css',
      'json', 'bash', 'shell', 'sql', 'go', 'rust', 'php', 'ruby', 'swift',
      'kotlin', 'cpp', 'c', 'yaml', 'yml', 'xml', 'dockerfile', 'markdown', 'md'
    ];
  }

  /**
   * Highlight code with syntax highlighting
   * @param code Code to highlight
   * @param language Programming language
   * @returns HighlightedCode with HTML and metadata
   */
  public highlight(code: string, language: string): HighlightedCode {
    try {
      let result;
      let finalLanguage = language;

      // Check if language is supported
      if (this.supportedLanguages.includes(language)) {
        result = hljs.highlight(code, { language });
        finalLanguage = language;
      } else {
        // Fallback to auto-detection or plaintext
        const autoResult = hljs.highlightAuto(code);
        if (autoResult.language && this.supportedLanguages.includes(autoResult.language)) {
          result = autoResult;
          finalLanguage = autoResult.language;
        } else {
          // Use plaintext fallback
          result = {
            value: this.escapeHtml(code),
            language: 'plaintext'
          };
          finalLanguage = 'plaintext';
        }
      }

      return {
        html: result.value,
        language: finalLanguage,
        lineCount: code.split('\n').length
      };
    } catch (error) {
      // Fallback to escaped plaintext on error
      return {
        html: this.escapeHtml(code),
        language: 'plaintext',
        lineCount: code.split('\n').length
      };
    }
  }

  /**
   * Get list of supported languages
   * @returns Array of supported language identifiers
   */
  public getSupportedLanguages(): string[] {
    return [...this.supportedLanguages]; // Return copy to prevent modification
  }

  /**
   * Detect language from code sample
   * @param code Code to analyze
   * @returns LanguageDetectionResult with detected language and confidence
   */
  public detectLanguage(code: string): LanguageDetectionResult {
    try {
      const result = hljs.highlightAuto(code);
      return {
        language: result.language || null,
        confidence: result.relevance || 0
      };
    } catch (error) {
      return {
        language: null,
        confidence: 0
      };
    }
  }

  /**
   * Escape HTML special characters
   * @param text Text to escape
   * @returns Escaped HTML
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }
}