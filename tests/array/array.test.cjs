const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

describe('Array utilities', () => {
  let chunk, compact, flatten, flattenDeep, uniq, uniqBy,
      difference, intersection, zip, unzip;

  before(async () => {
    ({ chunk } = await import('../../dist/array/chunk.js'));
    ({ compact } = await import('../../dist/array/compact.js'));
    ({ flatten, flattenDeep } = await import('../../dist/array/flatten.js'));
    ({ uniq, uniqBy } = await import('../../dist/array/uniq.js'));
    ({ difference, intersection } = await import('../../dist/array/difference.js'));
    ({ zip, unzip } = await import('../../dist/array/zip.js'));
  });

  // ── chunk ──────────────────────────────────────────────────────────

  describe('chunk', () => {
    it('should split array into chunks of given size', () => {
      assert.deepStrictEqual(chunk([1, 2, 3, 4], 2), [[1, 2], [3, 4]]);
    });

    it('should return remainder chunk when array is not evenly divisible', () => {
      assert.deepStrictEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]]);
    });

    it('should default to size 1', () => {
      assert.deepStrictEqual(chunk([1, 2, 3]), [[1], [2], [3]]);
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(chunk([], 2), []);
    });

    it('should treat negative size as 1', () => {
      assert.deepStrictEqual(chunk([1, 2, 3], -1), [[1], [2], [3]]);
    });

    it('should treat zero size as 1', () => {
      assert.deepStrictEqual(chunk([1, 2, 3], 0), [[1], [2], [3]]);
    });

    it('should treat fractional size by flooring', () => {
      assert.deepStrictEqual(chunk([1, 2, 3, 4], 2.7), [[1, 2], [3, 4]]);
    });

    it('should return single chunk when size >= length', () => {
      assert.deepStrictEqual(chunk([1, 2], 5), [[1, 2]]);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(chunk(null, 2), []);
      assert.deepStrictEqual(chunk(undefined, 2), []);
    });
  });

  // ── compact ────────────────────────────────────────────────────────

  describe('compact', () => {
    it('should remove all falsy values', () => {
      assert.deepStrictEqual(
        compact([0, 1, false, 2, '', 3, null, undefined, NaN]),
        [1, 2, 3]
      );
    });

    it('should return empty array for all-falsy input', () => {
      assert.deepStrictEqual(compact([0, false, '', null, undefined, NaN]), []);
    });

    it('should return copy of array when all truthy', () => {
      assert.deepStrictEqual(compact([1, 2, 3]), [1, 2, 3]);
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(compact([]), []);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(compact(null), []);
    });
  });

  // ── flatten / flattenDeep ──────────────────────────────────────────

  describe('flatten', () => {
    it('should flatten one level deep by default', () => {
      assert.deepStrictEqual(flatten([1, [2, [3, [4]]]]), [1, 2, [3, [4]]]);
    });

    it('should flatten to specified depth', () => {
      assert.deepStrictEqual(flatten([1, [2, [3, [4]]]], 2), [1, 2, 3, [4]]);
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(flatten([]), []);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(flatten(null), []);
    });

    it('should handle depth 0 (no flattening)', () => {
      assert.deepStrictEqual(flatten([1, [2, 3]], 0), [1, [2, 3]]);
    });

    it('should handle already flat array', () => {
      assert.deepStrictEqual(flatten([1, 2, 3]), [1, 2, 3]);
    });
  });

  describe('flattenDeep', () => {
    it('should flatten deeply nested arrays completely', () => {
      assert.deepStrictEqual(flattenDeep([1, [2, [3, [4, [5]]]]]), [1, 2, 3, 4, 5]);
    });

    it('should handle empty nested arrays', () => {
      assert.deepStrictEqual(flattenDeep([[], [[], []]]), []);
    });

    it('should handle mixed types', () => {
      assert.deepStrictEqual(flattenDeep([1, ['a', [true, [null]]]]), [1, 'a', true, null]);
    });
  });

  // ── uniq / uniqBy ──────────────────────────────────────────────────

  describe('uniq', () => {
    it('should remove duplicate values', () => {
      assert.deepStrictEqual(uniq([2, 1, 2, 3, 1]), [2, 1, 3]);
    });

    it('should preserve order of first occurrence', () => {
      assert.deepStrictEqual(uniq([3, 3, 2, 2, 1, 1]), [3, 2, 1]);
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(uniq([]), []);
    });

    it('should handle single element', () => {
      assert.deepStrictEqual(uniq([42]), [42]);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(uniq(null), []);
    });
  });

  describe('uniqBy', () => {
    it('should deduplicate by iteratee result', () => {
      const result = uniqBy([{ id: 1 }, { id: 2 }, { id: 1 }], o => o.id);
      assert.deepStrictEqual(result, [{ id: 1 }, { id: 2 }]);
    });

    it('should use first occurrence when iteratee matches', () => {
      const result = uniqBy([{ id: 1, v: 'a' }, { id: 1, v: 'b' }], o => o.id);
      assert.strictEqual(result[0].v, 'a');
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(uniqBy([], x => x), []);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(uniqBy(null, x => x), []);
    });

    it('should deduplicate numbers by Math.floor', () => {
      assert.deepStrictEqual(uniqBy([2.1, 1.2, 2.3], Math.floor), [2.1, 1.2]);
    });
  });

  // ── difference ─────────────────────────────────────────────────────

  describe('difference', () => {
    it('should return values not in exclude array', () => {
      assert.deepStrictEqual(difference([2, 1, 3], [2, 3]), [1]);
    });

    it('should return copy when exclude is empty', () => {
      assert.deepStrictEqual(difference([1, 2, 3], []), [1, 2, 3]);
    });

    it('should return empty array when all excluded', () => {
      assert.deepStrictEqual(difference([1, 2], [1, 2, 3]), []);
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(difference([], [1, 2]), []);
    });

    it('should return copy for non-array exclude', () => {
      assert.deepStrictEqual(difference([1, 2], null), [1, 2]);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(difference(null, [1, 2]), []);
    });
  });

  // ── intersection ───────────────────────────────────────────────────

  describe('intersection', () => {
    it('should return values present in both arrays', () => {
      assert.deepStrictEqual(intersection([2, 1, 3], [2, 3, 4]), [2, 3]);
    });

    it('should return empty array when no overlap', () => {
      assert.deepStrictEqual(intersection([1, 2], [3, 4]), []);
    });

    it('should return empty array for empty inputs', () => {
      assert.deepStrictEqual(intersection([], [1, 2]), []);
      assert.deepStrictEqual(intersection([1, 2], []), []);
    });

    it('should return empty array for non-array inputs', () => {
      assert.deepStrictEqual(intersection(null, [1]), []);
      assert.deepStrictEqual(intersection([1], null), []);
    });
  });

  // ── zip / unzip ────────────────────────────────────────────────────

  describe('zip', () => {
    it('should group corresponding elements', () => {
      assert.deepStrictEqual(
        zip(['a', 'b'], [1, 2], [true, false]),
        [['a', 1, true], ['b', 2, false]]
      );
    });

    it('should pad shorter arrays with undefined', () => {
      const result = zip(['a', 'b', 'c'], [1]);
      assert.strictEqual(result.length, 3);
      assert.strictEqual(result[1][1], undefined);
      assert.strictEqual(result[2][1], undefined);
    });

    it('should return empty array for no arguments', () => {
      assert.deepStrictEqual(zip(), []);
    });

    it('should handle single array', () => {
      assert.deepStrictEqual(zip([1, 2, 3]), [[1], [2], [3]]);
    });
  });

  describe('unzip', () => {
    it('should inverse zip', () => {
      assert.deepStrictEqual(
        unzip([['a', 1], ['b', 2]]),
        [['a', 'b'], [1, 2]]
      );
    });

    it('should return empty array for empty input', () => {
      assert.deepStrictEqual(unzip([]), []);
    });

    it('should return empty array for non-array input', () => {
      assert.deepStrictEqual(unzip(null), []);
    });

    it('should handle uneven inner arrays', () => {
      const result = unzip([['a', 1], ['b']]);
      assert.strictEqual(result.length, 2);
      assert.strictEqual(result[1][1], undefined);
    });
  });
});
