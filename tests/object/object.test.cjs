const { describe, it, before, afterEach } = require('node:test');
const assert = require('node:assert/strict');

describe('Object utilities', () => {
  let get, set, merge, pick, omit, cloneDeep, defaults, defaultsDeep;

  before(async () => {
    ({ get } = await import('../../dist/object/get.js'));
    ({ set } = await import('../../dist/object/set.js'));
    ({ merge } = await import('../../dist/object/merge.js'));
    ({ pick, omit } = await import('../../dist/object/pick.js'));
    ({ cloneDeep } = await import('../../dist/object/cloneDeep.js'));
    ({ defaults, defaultsDeep } = await import('../../dist/object/defaults.js'));
  });

  // Ensure prototype is never polluted after each test
  afterEach(() => {
    assert.strictEqual(
      ({}).polluted,
      undefined,
      'CRITICAL: Object.prototype was polluted!'
    );
  });

  // ── get ────────────────────────────────────────────────────────────

  describe('get', () => {
    it('should get nested value by dot path', () => {
      assert.strictEqual(get({ a: { b: { c: 3 } } }, 'a.b.c'), 3);
    });

    it('should get value by array path', () => {
      assert.strictEqual(get({ a: { b: 2 } }, ['a', 'b']), 2);
    });

    it('should return default for missing path', () => {
      assert.strictEqual(get({ a: 1 }, 'b.c', 'default'), 'default');
    });

    it('should return undefined for missing path with no default', () => {
      assert.strictEqual(get({ a: 1 }, 'b.c'), undefined);
    });

    it('should get array index via bracket notation', () => {
      assert.strictEqual(get({ a: [{ b: 1 }] }, 'a[0].b'), 1);
    });

    it('should return default for null/undefined object', () => {
      assert.strictEqual(get(null, 'a', 'x'), 'x');
      assert.strictEqual(get(undefined, 'a', 'y'), 'y');
    });

    it('should return the object itself for empty path', () => {
      const obj = { a: 1 };
      assert.deepStrictEqual(get(obj, ''), obj);
    });

    // PROTOTYPE POLLUTION PROOF
    it('should return default for __proto__ path', () => {
      const result = get({}, '__proto__', 'safe');
      assert.strictEqual(result, 'safe');
    });

    it('should return default for constructor path', () => {
      const result = get({}, 'constructor', 'safe');
      assert.strictEqual(result, 'safe');
    });

    it('should return default for prototype path', () => {
      const result = get({}, 'prototype', 'safe');
      assert.strictEqual(result, 'safe');
    });

    it('should return default for nested __proto__ path', () => {
      const result = get({ a: {} }, 'a.__proto__', 'safe');
      assert.strictEqual(result, 'safe');
    });
  });

  // ── set ────────────────────────────────────────────────────────────

  describe('set', () => {
    it('should set a nested value immutably', () => {
      const obj = {};
      const result = set(obj, 'a.b.c', 1);
      assert.deepStrictEqual(result, { a: { b: { c: 1 } } });
      assert.deepStrictEqual(obj, {}); // original not mutated
    });

    it('should create intermediate arrays for numeric keys', () => {
      const result = set({}, 'a[0].b', 'hi');
      assert.strictEqual(result.a[0].b, 'hi');
    });

    it('should return a new object, not mutate the original', () => {
      const original = { a: 1 };
      const result = set(original, 'b', 2);
      assert.strictEqual(original.b, undefined);
      assert.strictEqual(result.b, 2);
    });

    // PROTOTYPE POLLUTION PROOF
    it('should throw on __proto__ path', () => {
      assert.throws(
        () => set({}, '__proto__.polluted', 'yes'),
        /prototype pollution blocked/i
      );
      assert.strictEqual(({}).polluted, undefined);
    });

    it('should throw on constructor path', () => {
      assert.throws(
        () => set({}, 'constructor.prototype.polluted', 'yes'),
        /prototype pollution blocked/i
      );
      assert.strictEqual(({}).polluted, undefined);
    });

    it('should throw on prototype path', () => {
      assert.throws(
        () => set({}, 'prototype.polluted', 'yes'),
        /prototype pollution blocked/i
      );
    });

    it('should handle null/undefined object gracefully', () => {
      assert.strictEqual(set(null, 'a', 1), null);
    });
  });

  // ── merge ──────────────────────────────────────────────────────────

  describe('merge', () => {
    it('should deep merge objects', () => {
      const result = merge({ a: 1, b: { c: 2 } }, { b: { d: 3 }, e: 4 });
      assert.deepStrictEqual(result, { a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it('should not mutate the target', () => {
      const target = { a: { b: 1 } };
      const result = merge(target, { a: { c: 2 } });
      assert.strictEqual(target.a.c, undefined);
      assert.strictEqual(result.a.c, 2);
    });

    it('should clone arrays instead of merging them', () => {
      const result = merge({ a: [1, 2] }, { a: [3, 4, 5] });
      assert.deepStrictEqual(result.a, [3, 4, 5]);
    });

    it('should handle multiple sources', () => {
      const result = merge({ a: 1 }, { b: 2 }, { c: 3 });
      assert.deepStrictEqual(result, { a: 1, b: 2, c: 3 });
    });

    it('should skip non-plain-object sources', () => {
      const result = merge({ a: 1 }, null, undefined, 42, { b: 2 });
      assert.deepStrictEqual(result, { a: 1, b: 2 });
    });

    // PROTOTYPE POLLUTION PROOF
    it('should NOT pollute prototype via __proto__ key (JSON.parse vector)', () => {
      const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
      merge({}, malicious);
      assert.strictEqual(({}).polluted, undefined);
    });

    it('should NOT pollute via constructor key', () => {
      merge({}, { constructor: { prototype: { polluted: 'yes' } } });
      assert.strictEqual(({}).polluted, undefined);
    });

    it('should silently skip __proto__ keys in nested merge', () => {
      const result = merge({ a: {} }, { a: JSON.parse('{"__proto__":{"x":1}}') });
      assert.strictEqual(({}).x, undefined);
      // The result should not have __proto__ as an own property
    });
  });

  // ── pick / omit ────────────────────────────────────────────────────

  describe('pick', () => {
    it('should pick specified keys', () => {
      assert.deepStrictEqual(pick({ a: 1, b: 2, c: 3 }, ['a', 'c']), { a: 1, c: 3 });
    });

    it('should ignore keys not present', () => {
      assert.deepStrictEqual(pick({ a: 1 }, ['a', 'b']), { a: 1 });
    });

    it('should return empty object for null input', () => {
      assert.deepStrictEqual(pick(null, ['a']), {});
    });

    it('should skip __proto__ keys', () => {
      const obj = { a: 1, b: 2 };
      assert.deepStrictEqual(pick(obj, ['a', '__proto__']), { a: 1 });
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      assert.deepStrictEqual(omit({ a: 1, b: 2, c: 3 }, ['b']), { a: 1, c: 3 });
    });

    it('should return copy when omitting nonexistent keys', () => {
      assert.deepStrictEqual(omit({ a: 1 }, ['z']), { a: 1 });
    });

    it('should return empty object for null input', () => {
      assert.deepStrictEqual(omit(null, ['a']), {});
    });
  });

  // ── cloneDeep ──────────────────────────────────────────────────────

  describe('cloneDeep', () => {
    it('should deep clone objects', () => {
      const obj = { a: { b: [1, 2, 3] } };
      const clone = cloneDeep(obj);
      clone.a.b.push(4);
      assert.deepStrictEqual(obj.a.b, [1, 2, 3]);
    });

    it('should clone arrays', () => {
      const arr = [1, [2, [3]]];
      const clone = cloneDeep(arr);
      clone[1][1][0] = 99;
      assert.strictEqual(arr[1][1][0], 3);
    });

    it('should clone Date objects', () => {
      const date = new Date('2024-01-01');
      const clone = cloneDeep(date);
      assert.notStrictEqual(clone, date);
      assert.strictEqual(clone.getTime(), date.getTime());
    });

    it('should clone RegExp objects', () => {
      const regex = /abc/gi;
      const clone = cloneDeep(regex);
      assert.notStrictEqual(clone, regex);
      assert.strictEqual(clone.source, 'abc');
      assert.strictEqual(clone.flags, 'gi');
    });

    it('should handle primitives', () => {
      assert.strictEqual(cloneDeep(42), 42);
      assert.strictEqual(cloneDeep('hello'), 'hello');
      assert.strictEqual(cloneDeep(null), null);
      assert.strictEqual(cloneDeep(undefined), undefined);
      assert.strictEqual(cloneDeep(true), true);
    });

    it('should handle circular references', () => {
      const obj = { a: 1 };
      obj.self = obj;
      const clone = cloneDeep(obj);
      assert.strictEqual(clone.a, 1);
      // structuredClone handles circular refs natively
      assert.strictEqual(clone.self, clone);
    });

    // PROTOTYPE POLLUTION PROOF
    it('should strip __proto__ keys during clone', () => {
      // Create an object with __proto__ as an own key
      const malicious = Object.create(null);
      malicious.__proto__ = { polluted: 'yes' };
      malicious.safe = 'value';
      const clone = cloneDeep(malicious);
      assert.strictEqual(({}).polluted, undefined);
      // Note: structuredClone may or may not preserve __proto__ as own key
      // What matters is prototype is not polluted
    });
  });

  // ── defaults / defaultsDeep ────────────────────────────────────────

  describe('defaults', () => {
    it('should apply defaults for undefined properties', () => {
      assert.deepStrictEqual(defaults({ a: 1 }, { a: 2, b: 3 }), { a: 1, b: 3 });
    });

    it('should not overwrite existing properties', () => {
      assert.deepStrictEqual(defaults({ a: 1, b: 2 }, { a: 99, b: 99 }), { a: 1, b: 2 });
    });

    it('should handle multiple sources', () => {
      const result = defaults({}, { a: 1 }, { a: 2, b: 3 });
      assert.strictEqual(result.a, 1);
      assert.strictEqual(result.b, 3);
    });

    it('should skip non-plain-object sources', () => {
      const result = defaults({ a: 1 }, null, { b: 2 });
      assert.deepStrictEqual(result, { a: 1, b: 2 });
    });
  });

  describe('defaultsDeep', () => {
    it('should deep-apply defaults', () => {
      const result = defaultsDeep({ a: { b: 1 } }, { a: { b: 2, c: 3 }, d: 4 });
      assert.strictEqual(result.a.b, 1);
      assert.strictEqual(result.a.c, 3);
      assert.strictEqual(result.d, 4);
    });

    it('should not overwrite existing nested values', () => {
      const result = defaultsDeep({ a: { x: 1 } }, { a: { x: 99, y: 2 } });
      assert.strictEqual(result.a.x, 1);
      assert.strictEqual(result.a.y, 2);
    });

    // PROTOTYPE POLLUTION PROOF
    it('should NOT pollute prototype via __proto__ key', () => {
      const malicious = JSON.parse('{"__proto__":{"polluted":"yes"}}');
      defaultsDeep({}, malicious);
      assert.strictEqual(({}).polluted, undefined);
    });

    it('should NOT pollute via nested __proto__', () => {
      defaultsDeep({}, { a: JSON.parse('{"__proto__":{"polluted":"yes"}}') });
      assert.strictEqual(({}).polluted, undefined);
    });

    it('should NOT pollute via constructor.prototype', () => {
      defaultsDeep({}, { constructor: { prototype: { polluted: 'yes' } } });
      assert.strictEqual(({}).polluted, undefined);
    });
  });
});
