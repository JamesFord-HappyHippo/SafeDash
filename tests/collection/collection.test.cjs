const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

describe('Collection utilities', () => {
  let groupBy, sortBy, keyBy, partition, countBy, orderBy, find, every, some;

  before(async () => {
    ({ groupBy } = await import('../../dist/collection/groupBy.js'));
    ({ sortBy } = await import('../../dist/collection/sortBy.js'));
    ({ keyBy } = await import('../../dist/collection/keyBy.js'));
    ({ partition } = await import('../../dist/collection/partition.js'));
    ({ countBy } = await import('../../dist/collection/countBy.js'));
    ({ orderBy } = await import('../../dist/collection/orderBy.js'));
    ({ find } = await import('../../dist/collection/find.js'));
    ({ every } = await import('../../dist/collection/every.js'));
    ({ some } = await import('../../dist/collection/some.js'));
  });

  // ── groupBy ────────────────────────────────────────────────────────

  describe('groupBy', () => {
    it('should group by function iteratee', () => {
      const result = groupBy([6.1, 4.2, 6.3], Math.floor);
      assert.deepStrictEqual(result['4'], [4.2]);
      assert.deepStrictEqual(result['6'], [6.1, 6.3]);
    });

    it('should group by property name on objects', () => {
      const items = [{ type: 'a', v: 1 }, { type: 'b', v: 2 }, { type: 'a', v: 3 }];
      const result = groupBy(items, 'type');
      assert.strictEqual(result['a'].length, 2);
      assert.strictEqual(result['b'].length, 1);
    });

    it('should group strings by function accessing length', () => {
      const result = groupBy(['one', 'two', 'three'], (s) => s.length);
      assert.deepStrictEqual(result['3'], ['one', 'two']);
      assert.deepStrictEqual(result['5'], ['three']);
    });

    it('should handle empty array', () => {
      const result = groupBy([], (x) => x);
      assert.deepStrictEqual(Object.keys(result), []);
    });

    it('should work with object collection', () => {
      const result = groupBy({ a: 1, b: 2, c: 1 }, (v) => v);
      assert.deepStrictEqual(result['1'], [1, 1]);
      assert.deepStrictEqual(result['2'], [2]);
    });
  });

  // ── sortBy ─────────────────────────────────────────────────────────

  describe('sortBy', () => {
    it('should sort by function iteratee', () => {
      assert.deepStrictEqual(sortBy([3, 1, 2], (n) => n), [1, 2, 3]);
    });

    it('should sort by property name', () => {
      const users = [
        { name: 'Zoe', age: 25 },
        { name: 'Ada', age: 30 },
      ];
      const result = sortBy(users, 'name');
      assert.strictEqual(result[0].name, 'Ada');
      assert.strictEqual(result[1].name, 'Zoe');
    });

    it('should not mutate original array', () => {
      const arr = [3, 1, 2];
      sortBy(arr, (n) => n);
      assert.deepStrictEqual(arr, [3, 1, 2]);
    });

    it('should handle empty array', () => {
      assert.deepStrictEqual(sortBy([], (n) => n), []);
    });

    it('should work with object collection', () => {
      const result = sortBy({ a: 3, b: 1, c: 2 }, (v) => v);
      assert.deepStrictEqual(result, [1, 2, 3]);
    });
  });

  // ── keyBy ──────────────────────────────────────────────────────────

  describe('keyBy', () => {
    it('should key by property name', () => {
      const users = [
        { id: 'a1', name: 'Alice' },
        { id: 'b2', name: 'Bob' },
      ];
      const result = keyBy(users, 'id');
      assert.strictEqual(result['a1'].name, 'Alice');
      assert.strictEqual(result['b2'].name, 'Bob');
    });

    it('should key by function iteratee', () => {
      const result = keyBy([6.1, 4.2, 6.3], Math.floor);
      assert.strictEqual(result['4'], 4.2);
      // First occurrence wins: 6.1, not 6.3
      assert.strictEqual(result['6'], 6.1);
    });

    it('should handle empty array', () => {
      const result = keyBy([], (x) => x);
      assert.deepStrictEqual(Object.keys(result), []);
    });

    it('should keep first element on duplicate keys', () => {
      const items = [{ k: 'a', v: 1 }, { k: 'a', v: 2 }];
      const result = keyBy(items, 'k');
      assert.strictEqual(result['a'].v, 1);
    });
  });

  // ── partition ──────────────────────────────────────────────────────

  describe('partition', () => {
    it('should split into truthy and falsy groups', () => {
      const [evens, odds] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0);
      assert.deepStrictEqual(evens, [2, 4]);
      assert.deepStrictEqual(odds, [1, 3, 5]);
    });

    it('should handle all truthy', () => {
      const [t, f] = partition([2, 4, 6], (n) => n % 2 === 0);
      assert.deepStrictEqual(t, [2, 4, 6]);
      assert.deepStrictEqual(f, []);
    });

    it('should handle all falsy', () => {
      const [t, f] = partition([1, 3, 5], (n) => n % 2 === 0);
      assert.deepStrictEqual(t, []);
      assert.deepStrictEqual(f, [1, 3, 5]);
    });

    it('should handle empty array', () => {
      const [t, f] = partition([], () => true);
      assert.deepStrictEqual(t, []);
      assert.deepStrictEqual(f, []);
    });

    it('should work with object collection', () => {
      const [t, f] = partition({ a: 1, b: 2, c: 3 }, (v) => v > 1);
      assert.deepStrictEqual(t, [2, 3]);
      assert.deepStrictEqual(f, [1]);
    });
  });

  // ── countBy ────────────────────────────────────────────────────────

  describe('countBy', () => {
    it('should count by function iteratee', () => {
      const result = countBy([6.1, 4.2, 6.3], Math.floor);
      assert.strictEqual(result['4'], 1);
      assert.strictEqual(result['6'], 2);
    });

    it('should count by property name on objects', () => {
      const items = [{ type: 'a' }, { type: 'b' }, { type: 'a' }];
      const result = countBy(items, 'type');
      assert.strictEqual(result['a'], 2);
      assert.strictEqual(result['b'], 1);
    });

    it('should count strings by function accessing length', () => {
      const result = countBy(['one', 'two', 'three'], (s) => s.length);
      assert.strictEqual(result['3'], 2);
      assert.strictEqual(result['5'], 1);
    });

    it('should handle empty array', () => {
      const result = countBy([], (x) => x);
      assert.deepStrictEqual(Object.keys(result), []);
    });

    it('should work with object collection', () => {
      const result = countBy({ a: 'yes', b: 'no', c: 'yes' }, (v) => v);
      assert.strictEqual(result['yes'], 2);
      assert.strictEqual(result['no'], 1);
    });
  });

  // ── orderBy ────────────────────────────────────────────────────────

  describe('orderBy', () => {
    it('should sort by multiple iteratees with directions', () => {
      const users = [
        { name: 'Alice', age: 30 },
        { name: 'Bob', age: 25 },
        { name: 'Alice', age: 25 },
      ];
      const result = orderBy(users, ['name', 'age'], ['asc', 'desc']);
      assert.strictEqual(result[0].name, 'Alice');
      assert.strictEqual(result[0].age, 30);
      assert.strictEqual(result[1].name, 'Alice');
      assert.strictEqual(result[1].age, 25);
      assert.strictEqual(result[2].name, 'Bob');
    });

    it('should default to ascending', () => {
      const result = orderBy([3, 1, 2], [(n) => n]);
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    it('should support descending', () => {
      const result = orderBy([3, 1, 2], [(n) => n], ['desc']);
      assert.deepStrictEqual(result, [3, 2, 1]);
    });

    it('should not mutate original', () => {
      const arr = [3, 1, 2];
      orderBy(arr, [(n) => n]);
      assert.deepStrictEqual(arr, [3, 1, 2]);
    });

    it('should handle empty array', () => {
      assert.deepStrictEqual(orderBy([], [(n) => n]), []);
    });
  });

  // ── find ───────────────────────────────────────────────────────────

  describe('find', () => {
    it('should find first matching element with function predicate', () => {
      assert.strictEqual(find([1, 2, 3, 4], (n) => n > 2), 3);
    });

    it('should find with object shorthand', () => {
      const users = [
        { name: 'Alice', active: false },
        { name: 'Bob', active: true },
      ];
      const result = find(users, { active: true });
      assert.strictEqual(result.name, 'Bob');
    });

    it('should return undefined when no match', () => {
      assert.strictEqual(find([1, 2, 3], (n) => n > 10), undefined);
    });

    it('should handle empty array', () => {
      assert.strictEqual(find([], () => true), undefined);
    });

    it('should work with object collection', () => {
      assert.strictEqual(find({ a: 1, b: 2, c: 3 }, (v) => v === 2), 2);
    });
  });

  // ── every ──────────────────────────────────────────────────────────

  describe('every', () => {
    it('should return true when all match', () => {
      assert.strictEqual(every([2, 4, 6], (n) => n % 2 === 0), true);
    });

    it('should return false when one fails', () => {
      assert.strictEqual(every([2, 3, 6], (n) => n % 2 === 0), false);
    });

    it('should return true for empty array (vacuous truth)', () => {
      assert.strictEqual(every([], () => false), true);
    });

    it('should work with object collection', () => {
      assert.strictEqual(
        every({ a: 1, b: 2, c: 3 }, (v) => typeof v === 'number'),
        true
      );
    });
  });

  // ── some ───────────────────────────────────────────────────────────

  describe('some', () => {
    it('should return true when any match', () => {
      assert.strictEqual(some([1, 2, 3], (n) => n > 2), true);
    });

    it('should return false when none match', () => {
      assert.strictEqual(some([1, 2, 3], (n) => n > 5), false);
    });

    it('should return false for empty array', () => {
      assert.strictEqual(some([], () => true), false);
    });

    it('should work with object collection', () => {
      assert.strictEqual(some({ a: 'x', b: 'y' }, (v) => v === 'y'), true);
    });

    it('should short-circuit on first match', () => {
      let count = 0;
      some([1, 2, 3], (n) => { count++; return n === 1; });
      assert.strictEqual(count, 1);
    });
  });
});
