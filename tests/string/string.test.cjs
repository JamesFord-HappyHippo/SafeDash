const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

describe('String utilities', () => {
  let camelCase, kebabCase, snakeCase, capitalize,
      truncate, escape, unescape, escapeRegExp, trim;
  let template;

  before(async () => {
    ({ camelCase } = await import('../../dist/string/camelCase.js'));
    ({ kebabCase } = await import('../../dist/string/kebabCase.js'));
    ({ snakeCase } = await import('../../dist/string/snakeCase.js'));
    ({ capitalize } = await import('../../dist/string/capitalize.js'));
    ({ truncate } = await import('../../dist/string/truncate.js'));
    ({ escape, unescape, escapeRegExp } = await import('../../dist/string/escape.js'));
    ({ trim } = await import('../../dist/string/trim.js'));
    ({ template } = await import('../../dist/string/template.js'));
  });

  // ── camelCase ──────────────────────────────────────────────────────

  describe('camelCase', () => {
    it('should convert kebab-case', () => {
      assert.strictEqual(camelCase('hello-world'), 'helloWorld');
    });

    it('should convert snake_case', () => {
      assert.strictEqual(camelCase('hello_world'), 'helloWorld');
    });

    it('should convert PascalCase', () => {
      assert.strictEqual(camelCase('HelloWorld'), 'helloWorld');
    });

    it('should convert space-separated', () => {
      assert.strictEqual(camelCase('hello world'), 'helloWorld');
    });

    it('should convert all-caps with underscores', () => {
      assert.strictEqual(camelCase('FOO_BAR'), 'fooBar');
    });

    it('should handle leading/trailing separators', () => {
      assert.strictEqual(camelCase('--foo--bar--'), 'fooBar');
    });

    it('should return empty string for empty input', () => {
      assert.strictEqual(camelCase(''), '');
    });

    it('should handle single word', () => {
      assert.strictEqual(camelCase('hello'), 'hello');
    });
  });

  // ── kebabCase ──────────────────────────────────────────────────────

  describe('kebabCase', () => {
    it('should convert camelCase', () => {
      assert.strictEqual(kebabCase('helloWorld'), 'hello-world');
    });

    it('should convert PascalCase', () => {
      assert.strictEqual(kebabCase('HelloWorld'), 'hello-world');
    });

    it('should convert snake_case', () => {
      assert.strictEqual(kebabCase('hello_world'), 'hello-world');
    });

    it('should convert space-separated', () => {
      assert.strictEqual(kebabCase('hello world'), 'hello-world');
    });

    it('should convert all-caps', () => {
      assert.strictEqual(kebabCase('FOO_BAR'), 'foo-bar');
    });

    it('should handle leading/trailing underscores', () => {
      assert.strictEqual(kebabCase('__foo__bar__'), 'foo-bar');
    });

    it('should return empty string for empty input', () => {
      assert.strictEqual(kebabCase(''), '');
    });
  });

  // ── snakeCase ──────────────────────────────────────────────────────

  describe('snakeCase', () => {
    it('should convert camelCase', () => {
      assert.strictEqual(snakeCase('helloWorld'), 'hello_world');
    });

    it('should convert PascalCase', () => {
      assert.strictEqual(snakeCase('HelloWorld'), 'hello_world');
    });

    it('should convert kebab-case', () => {
      assert.strictEqual(snakeCase('hello-world'), 'hello_world');
    });

    it('should convert space-separated', () => {
      assert.strictEqual(snakeCase('hello world'), 'hello_world');
    });

    it('should convert all-caps', () => {
      assert.strictEqual(snakeCase('FOO_BAR'), 'foo_bar');
    });

    it('should handle leading/trailing dashes', () => {
      assert.strictEqual(snakeCase('--foo--bar--'), 'foo_bar');
    });

    it('should return empty string for empty input', () => {
      assert.strictEqual(snakeCase(''), '');
    });
  });

  // ── capitalize ─────────────────────────────────────────────────────

  describe('capitalize', () => {
    it('should capitalize first letter and lowercase rest', () => {
      assert.strictEqual(capitalize('hello'), 'Hello');
    });

    it('should handle all uppercase', () => {
      assert.strictEqual(capitalize('HELLO'), 'Hello');
    });

    it('should handle mixed case', () => {
      assert.strictEqual(capitalize('hELLO WORLD'), 'Hello world');
    });

    it('should return empty string for empty input', () => {
      assert.strictEqual(capitalize(''), '');
    });

    it('should handle single character', () => {
      assert.strictEqual(capitalize('a'), 'A');
    });
  });

  // ── truncate ───────────────────────────────────────────────────────

  describe('truncate', () => {
    it('should truncate long strings with default omission', () => {
      assert.strictEqual(
        truncate('This is a very long string', { length: 15 }),
        'This is a ve...'
      );
    });

    it('should not truncate short strings', () => {
      assert.strictEqual(truncate('short'), 'short');
    });

    it('should use custom omission', () => {
      assert.strictEqual(
        truncate('This is a very long string', { length: 15, omission: '---' }),
        'This is a ve---'
      );
    });

    it('should break at separator when provided', () => {
      assert.strictEqual(
        truncate('This is a very long string', { length: 15, separator: ' ' }),
        'This is a...'
      );
    });

    it('should handle length shorter than omission', () => {
      const result = truncate('Hello World', { length: 2, omission: '...' });
      assert.strictEqual(result, '..');
    });

    it('should default to length 30', () => {
      const long = 'a'.repeat(40);
      assert.strictEqual(truncate(long).length, 30);
    });
  });

  // ── escape / unescape / escapeRegExp ───────────────────────────────

  describe('escape', () => {
    it('should escape HTML special characters', () => {
      assert.strictEqual(
        escape('<div class="test">Tom & Jerry</div>'),
        '&lt;div class=&quot;test&quot;&gt;Tom &amp; Jerry&lt;/div&gt;'
      );
    });

    it('should escape single quotes', () => {
      assert.strictEqual(escape("it's"), "it&#39;s");
    });

    it('should not modify strings without special characters', () => {
      assert.strictEqual(escape('hello world'), 'hello world');
    });

    it('should handle empty string', () => {
      assert.strictEqual(escape(''), '');
    });
  });

  describe('unescape', () => {
    it('should unescape HTML entities', () => {
      assert.strictEqual(
        unescape('&lt;div&gt;Tom &amp; Jerry&lt;/div&gt;'),
        '<div>Tom & Jerry</div>'
      );
    });

    it('should be inverse of escape', () => {
      const original = '<a href="url">it\'s & done</a>';
      assert.strictEqual(unescape(escape(original)), original);
    });
  });

  describe('escapeRegExp', () => {
    it('should escape regex special characters', () => {
      assert.strictEqual(
        escapeRegExp('[lodash](https://lodash.com/)'),
        '\\[lodash\\]\\(https://lodash\\.com/\\)'
      );
    });

    it('should escape dollar and dot', () => {
      assert.strictEqual(escapeRegExp('price: $5.00'), 'price: \\$5\\.00');
    });

    it('should handle empty string', () => {
      assert.strictEqual(escapeRegExp(''), '');
    });

    it('should produce a pattern that matches literally', () => {
      const input = 'a.b*c?d';
      const pattern = new RegExp(escapeRegExp(input));
      assert.ok(pattern.test(input));
      assert.ok(!pattern.test('aXbYcZd'));
    });
  });

  // ── trim ───────────────────────────────────────────────────────────

  describe('trim', () => {
    it('should trim whitespace by default', () => {
      assert.strictEqual(trim('  hello  '), 'hello');
    });

    it('should trim specified characters', () => {
      assert.strictEqual(trim('--hello--', '-'), 'hello');
    });

    it('should trim multiple character types', () => {
      assert.strictEqual(trim('_-hello-_', '_-'), 'hello');
    });

    it('should handle no trimming needed', () => {
      assert.strictEqual(trim('hello', '-'), 'hello');
    });

    it('should handle all-trim characters', () => {
      assert.strictEqual(trim('---', '-'), '');
    });

    it('should handle empty string', () => {
      assert.strictEqual(trim(''), '');
    });
  });

  // ── template ───────────────────────────────────────────────────────

  describe('template', () => {
    it('should interpolate variables', () => {
      assert.strictEqual(
        template('Hello, ${name}!', { name: 'World' }),
        'Hello, World!'
      );
    });

    it('should handle multiple variables', () => {
      assert.strictEqual(
        template('${a} + ${b} = ${c}', { a: 1, b: 2, c: 3 }),
        '1 + 2 = 3'
      );
    });

    it('should leave unmatched placeholders intact', () => {
      assert.strictEqual(
        template('Hello, ${name}!', {}),
        'Hello, ${name}!'
      );
    });

    it('should support custom delimiters', () => {
      assert.strictEqual(
        template('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'World' }, { open: '{{', close: '}}' }),
        'Hi, World!'
      );
    });

    it('should handle empty string', () => {
      assert.strictEqual(template('', { a: 1 }), '');
    });

    it('should handle no placeholders', () => {
      assert.strictEqual(template('hello world', { a: 1 }), 'hello world');
    });

    // SECURITY: __proto__ rejection
    it('should reject __proto__ keys', () => {
      assert.strictEqual(
        template('${__proto__}', { __proto__: 'bad' }),
        '${__proto__}'
      );
    });

    it('should reject constructor keys', () => {
      assert.strictEqual(
        template('${constructor}', { constructor: 'bad' }),
        '${constructor}'
      );
    });

    it('should handle unclosed delimiter', () => {
      assert.strictEqual(template('Hello ${name', { name: 'X' }), 'Hello ${name');
    });
  });
});
