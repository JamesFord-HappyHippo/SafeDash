const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

describe('Util utilities', () => {
  let range, times, uniqueId;

  before(async () => {
    ({ range } = await import('../../dist/util/range.js'));
    ({ times } = await import('../../dist/util/times.js'));
    ({ uniqueId } = await import('../../dist/util/uniqueId.js'));
  });

  // ── range ──────────────────────────────────────────────────────────

  describe('range', () => {
    it('should create range with single argument (0 to n)', () => {
      assert.deepStrictEqual(range(4), [0, 1, 2, 3]);
    });

    it('should create range with start and end', () => {
      assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4]);
    });

    it('should create range with custom step', () => {
      assert.deepStrictEqual(range(0, 20, 5), [0, 5, 10, 15]);
    });

    it('should create descending range', () => {
      assert.deepStrictEqual(range(0, -4, -1), [0, -1, -2, -3]);
    });

    it('should return empty array for range(0)', () => {
      assert.deepStrictEqual(range(0), []);
    });

    it('should auto-detect descending when start > end without step', () => {
      assert.deepStrictEqual(range(4, 0), [4, 3, 2, 1]);
    });

    it('should return empty array for zero step', () => {
      assert.deepStrictEqual(range(1, 5, 0), []);
    });

    it('should handle negative start and end', () => {
      assert.deepStrictEqual(range(-3, 0), [-3, -2, -1]);
    });

    it('should throw on excessively large ranges', () => {
      assert.throws(
        () => range(0, 100_000_000),
        /maximum/i
      );
    });

    it('should handle step larger than range', () => {
      assert.deepStrictEqual(range(0, 3, 10), [0]);
    });

    it('should return empty when step direction mismatches range direction', () => {
      assert.deepStrictEqual(range(0, 5, -1), []);
    });
  });

  // ── times ──────────────────────────────────────────────────────────

  describe('times', () => {
    it('should invoke iteratee n times', () => {
      assert.deepStrictEqual(times(3, (i) => i * 2), [0, 2, 4]);
    });

    it('should return constant array', () => {
      assert.deepStrictEqual(times(4, () => 'x'), ['x', 'x', 'x', 'x']);
    });

    it('should pass index to iteratee', () => {
      assert.deepStrictEqual(times(3, String), ['0', '1', '2']);
    });

    it('should return empty array for n=0', () => {
      assert.deepStrictEqual(times(0, () => 'never'), []);
    });

    it('should return empty array for negative n', () => {
      assert.deepStrictEqual(times(-1, () => 'never'), []);
    });

    it('should floor fractional n', () => {
      assert.deepStrictEqual(times(2.9, (i) => i), [0, 1]);
    });

    it('should throw on excessively large n', () => {
      assert.throws(
        () => times(100_000_000, () => null),
        /maximum/i
      );
    });
  });

  // ── uniqueId ───────────────────────────────────────────────────────

  describe('uniqueId', () => {
    it('should return incrementing IDs', () => {
      const a = uniqueId();
      const b = uniqueId();
      assert.notStrictEqual(a, b);
      // Both should be numeric strings (the counter value)
      assert.ok(/^\d+$/.test(a));
      assert.ok(/^\d+$/.test(b));
    });

    it('should prepend prefix', () => {
      const id = uniqueId('user_');
      assert.ok(id.startsWith('user_'));
    });

    it('should produce unique values across calls', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(uniqueId());
      }
      assert.strictEqual(ids.size, 100);
    });

    it('should handle empty prefix', () => {
      const id = uniqueId('');
      assert.ok(/^\d+$/.test(id));
    });
  });
});
