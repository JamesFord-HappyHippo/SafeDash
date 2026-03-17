const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

describe('Lang utilities', () => {
  let isEqual, isEmpty, isNil, isNull, isUndefined;
  let isString, isNumber, isBoolean, isFunction, isArray,
      isObject, isPlainObject, isDate, isRegExp, isSymbol,
      isMap, isSet;

  before(async () => {
    ({ isEqual } = await import('../../dist/lang/isEqual.js'));
    ({ isEmpty } = await import('../../dist/lang/isEmpty.js'));
    ({ isNil, isNull, isUndefined } = await import('../../dist/lang/isNil.js'));
    ({
      isString, isNumber, isBoolean, isFunction, isArray,
      isObject, isPlainObject, isDate, isRegExp, isSymbol,
      isMap, isSet,
    } = await import('../../dist/lang/isString.js'));
  });

  // ── isEqual ────────────────────────────────────────────────────────

  describe('isEqual', () => {
    it('should compare primitives', () => {
      assert.strictEqual(isEqual(1, 1), true);
      assert.strictEqual(isEqual('a', 'a'), true);
      assert.strictEqual(isEqual(true, true), true);
      assert.strictEqual(isEqual(1, 2), false);
      assert.strictEqual(isEqual('a', 'b'), false);
    });

    it('should treat NaN as equal to NaN', () => {
      assert.strictEqual(isEqual(NaN, NaN), true);
    });

    it('should compare deep objects', () => {
      assert.strictEqual(
        isEqual({ x: 1, y: [2, 3] }, { x: 1, y: [2, 3] }),
        true
      );
      assert.strictEqual(
        isEqual({ a: 1 }, { a: 2 }),
        false
      );
    });

    it('should compare arrays', () => {
      assert.strictEqual(isEqual([1, 2, 3], [1, 2, 3]), true);
      assert.strictEqual(isEqual([1, 2], [1, 2, 3]), false);
      assert.strictEqual(isEqual([1, 2, 3], [1, 3, 2]), false);
    });

    it('should compare nested arrays', () => {
      assert.strictEqual(isEqual([[1, [2]]], [[1, [2]]]), true);
      assert.strictEqual(isEqual([[1, [2]]], [[1, [3]]]), false);
    });

    it('should compare Date objects', () => {
      assert.strictEqual(
        isEqual(new Date('2024-01-01'), new Date('2024-01-01')),
        true
      );
      assert.strictEqual(
        isEqual(new Date('2024-01-01'), new Date('2024-01-02')),
        false
      );
    });

    it('should compare RegExp objects', () => {
      assert.strictEqual(isEqual(/abc/gi, /abc/gi), true);
      assert.strictEqual(isEqual(/abc/g, /abc/i), false);
      assert.strictEqual(isEqual(/abc/, /def/), false);
    });

    it('should compare Map objects', () => {
      const m1 = new Map([['a', 1], ['b', 2]]);
      const m2 = new Map([['a', 1], ['b', 2]]);
      const m3 = new Map([['a', 1], ['b', 3]]);
      assert.strictEqual(isEqual(m1, m2), true);
      assert.strictEqual(isEqual(m1, m3), false);
    });

    it('should compare Set objects', () => {
      const s1 = new Set([1, 2, 3]);
      const s2 = new Set([1, 2, 3]);
      const s3 = new Set([1, 2, 4]);
      assert.strictEqual(isEqual(s1, s2), true);
      assert.strictEqual(isEqual(s1, s3), false);
    });

    it('should handle null comparisons', () => {
      assert.strictEqual(isEqual(null, null), true);
      assert.strictEqual(isEqual(null, undefined), false);
      assert.strictEqual(isEqual(null, {}), false);
    });

    it('should handle undefined comparisons', () => {
      assert.strictEqual(isEqual(undefined, undefined), true);
      assert.strictEqual(isEqual(undefined, null), false);
    });

    it('should handle circular references', () => {
      const a = { self: null };
      a.self = a;
      const b = { self: null };
      b.self = b;
      assert.strictEqual(isEqual(a, b), true);
    });

    it('should distinguish different types', () => {
      assert.strictEqual(isEqual([], {}), false);
      assert.strictEqual(isEqual(new Date(), /regex/), false);
      assert.strictEqual(isEqual(1, '1'), false);
    });

    it('should compare objects with different key counts', () => {
      assert.strictEqual(isEqual({ a: 1 }, { a: 1, b: 2 }), false);
    });
  });

  // ── isEmpty ────────────────────────────────────────────────────────

  describe('isEmpty', () => {
    it('should return true for null and undefined', () => {
      assert.strictEqual(isEmpty(null), true);
      assert.strictEqual(isEmpty(undefined), true);
    });

    it('should return true for empty string', () => {
      assert.strictEqual(isEmpty(''), true);
    });

    it('should return false for non-empty string', () => {
      assert.strictEqual(isEmpty('hello'), false);
    });

    it('should return true for empty array', () => {
      assert.strictEqual(isEmpty([]), true);
    });

    it('should return false for non-empty array', () => {
      assert.strictEqual(isEmpty([1]), false);
    });

    it('should return true for empty object', () => {
      assert.strictEqual(isEmpty({}), true);
    });

    it('should return false for non-empty object', () => {
      assert.strictEqual(isEmpty({ a: 1 }), false);
    });

    it('should return true for empty Map', () => {
      assert.strictEqual(isEmpty(new Map()), true);
    });

    it('should return false for non-empty Map', () => {
      assert.strictEqual(isEmpty(new Map([['a', 1]])), false);
    });

    it('should return true for empty Set', () => {
      assert.strictEqual(isEmpty(new Set()), true);
    });

    it('should return false for non-empty Set', () => {
      assert.strictEqual(isEmpty(new Set([1])), false);
    });

    it('should return false for numbers (0, 1)', () => {
      assert.strictEqual(isEmpty(0), false);
      assert.strictEqual(isEmpty(1), false);
    });

    it('should return false for booleans', () => {
      assert.strictEqual(isEmpty(false), false);
      assert.strictEqual(isEmpty(true), false);
    });
  });

  // ── isNil / isNull / isUndefined ───────────────────────────────────

  describe('isNil', () => {
    it('should return true for null', () => {
      assert.strictEqual(isNil(null), true);
    });

    it('should return true for undefined', () => {
      assert.strictEqual(isNil(undefined), true);
    });

    it('should return false for other values', () => {
      assert.strictEqual(isNil(0), false);
      assert.strictEqual(isNil(''), false);
      assert.strictEqual(isNil(false), false);
      assert.strictEqual(isNil(NaN), false);
    });
  });

  describe('isNull', () => {
    it('should return true only for null', () => {
      assert.strictEqual(isNull(null), true);
      assert.strictEqual(isNull(undefined), false);
      assert.strictEqual(isNull(0), false);
    });
  });

  describe('isUndefined', () => {
    it('should return true only for undefined', () => {
      assert.strictEqual(isUndefined(undefined), true);
      assert.strictEqual(isUndefined(null), false);
      assert.strictEqual(isUndefined(0), false);
    });
  });

  // ── Type check functions ───────────────────────────────────────────

  describe('isString', () => {
    it('should detect strings', () => {
      assert.strictEqual(isString('hello'), true);
      assert.strictEqual(isString(''), true);
      assert.strictEqual(isString(123), false);
      assert.strictEqual(isString(null), false);
    });
  });

  describe('isNumber', () => {
    it('should detect numbers including NaN and Infinity', () => {
      assert.strictEqual(isNumber(42), true);
      assert.strictEqual(isNumber(NaN), true);
      assert.strictEqual(isNumber(Infinity), true);
      assert.strictEqual(isNumber('42'), false);
    });
  });

  describe('isBoolean', () => {
    it('should detect booleans', () => {
      assert.strictEqual(isBoolean(true), true);
      assert.strictEqual(isBoolean(false), true);
      assert.strictEqual(isBoolean(0), false);
      assert.strictEqual(isBoolean('true'), false);
    });
  });

  describe('isFunction', () => {
    it('should detect functions', () => {
      assert.strictEqual(isFunction(() => {}), true);
      assert.strictEqual(isFunction(function() {}), true);
      assert.strictEqual(isFunction(class Foo {}), true);
      assert.strictEqual(isFunction('not a function'), false);
    });
  });

  describe('isArray', () => {
    it('should detect arrays', () => {
      assert.strictEqual(isArray([1, 2, 3]), true);
      assert.strictEqual(isArray([]), true);
      assert.strictEqual(isArray('abc'), false);
      assert.strictEqual(isArray({ length: 0 }), false);
    });
  });

  describe('isObject', () => {
    it('should detect objects (non-null, non-array)', () => {
      assert.strictEqual(isObject({}), true);
      assert.strictEqual(isObject(new Date()), true);
      assert.strictEqual(isObject([]), false);
      assert.strictEqual(isObject(null), false);
      assert.strictEqual(isObject('string'), false);
    });
  });

  describe('isPlainObject', () => {
    it('should detect plain objects', () => {
      assert.strictEqual(isPlainObject({}), true);
      assert.strictEqual(isPlainObject({ a: 1 }), true);
      assert.strictEqual(isPlainObject(Object.create(null)), true);
      assert.strictEqual(isPlainObject(new Date()), false);
      assert.strictEqual(isPlainObject([]), false);
      assert.strictEqual(isPlainObject(null), false);
    });
  });

  describe('isDate', () => {
    it('should detect Date instances', () => {
      assert.strictEqual(isDate(new Date()), true);
      assert.strictEqual(isDate('2024-01-01'), false);
      assert.strictEqual(isDate(Date.now()), false);
    });
  });

  describe('isRegExp', () => {
    it('should detect RegExp instances', () => {
      assert.strictEqual(isRegExp(/abc/), true);
      assert.strictEqual(isRegExp(new RegExp('x')), true);
      assert.strictEqual(isRegExp('abc'), false);
    });
  });

  describe('isSymbol', () => {
    it('should detect symbols', () => {
      assert.strictEqual(isSymbol(Symbol('x')), true);
      assert.strictEqual(isSymbol(Symbol.iterator), true);
      assert.strictEqual(isSymbol('x'), false);
    });
  });

  describe('isMap', () => {
    it('should detect Map instances', () => {
      assert.strictEqual(isMap(new Map()), true);
      assert.strictEqual(isMap({}), false);
      assert.strictEqual(isMap(new WeakMap()), false);
    });
  });

  describe('isSet', () => {
    it('should detect Set instances', () => {
      assert.strictEqual(isSet(new Set()), true);
      assert.strictEqual(isSet([]), false);
      assert.strictEqual(isSet(new WeakSet()), false);
    });
  });
});
