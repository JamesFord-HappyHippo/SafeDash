/**
 * SafeDash — A Security-Hardened JavaScript Utility Library
 *
 * Lodash-compatible API rebuilt with zero CVEs.
 *
 * Security guarantees:
 * - No prototype pollution (all __proto__/constructor/prototype keys blocked)
 * - No eval or Function constructor (safe template interpolation)
 * - No unbounded recursion (depth-capped at 64 levels)
 * - Immutable by default (merge, set, defaults return new objects)
 * - Circular reference safe (cloneDeep, isEqual use WeakMap/WeakSet)
 *
 * MIT License — Pareidolia LLC (d/b/a Equilateral AI)
 */

// Array
export { chunk } from './array/chunk.js';
export { compact } from './array/compact.js';
export { flatten, flattenDeep } from './array/flatten.js';
export { uniq, uniqBy } from './array/uniq.js';
export { difference, intersection } from './array/difference.js';
export { zip, unzip } from './array/zip.js';
export { head, first } from './array/head.js';
export { last } from './array/last.js';
export { tail, initial } from './array/tail.js';
export { take, takeRight } from './array/take.js';
export { drop, dropRight } from './array/drop.js';
export { without } from './array/without.js';
export { pull, pullAll } from './array/pull.js';
export { findIndex, findLastIndex } from './array/findIndex.js';
export { shuffle } from './array/shuffle.js';
export { sample, sampleSize } from './array/sample.js';

// Object
export { get } from './object/get.js';
export { set } from './object/set.js';
export { merge } from './object/merge.js';
export { pick, omit } from './object/pick.js';
export { cloneDeep } from './object/cloneDeep.js';
export { defaults, defaultsDeep } from './object/defaults.js';
export { has } from './object/has.js';
export { assign } from './object/assign.js';
export { keys, values, entries, mapKeys, mapValues, invert } from './object/keys.js';

// String
export { camelCase } from './string/camelCase.js';
export { kebabCase } from './string/kebabCase.js';
export { snakeCase } from './string/snakeCase.js';
export { capitalize } from './string/capitalize.js';
export { truncate } from './string/truncate.js';
export { escape, unescape, escapeRegExp } from './string/escape.js';
export { trim, trimStart, trimEnd } from './string/trim.js';
export { pad, padStart, padEnd } from './string/pad.js';
export { template } from './string/template.js';

// Collection
export { groupBy } from './collection/groupBy.js';
export { sortBy } from './collection/sortBy.js';
export { keyBy } from './collection/keyBy.js';
export { partition } from './collection/partition.js';
export { countBy } from './collection/countBy.js';
export { orderBy } from './collection/orderBy.js';
export { find } from './collection/find.js';
export { every } from './collection/every.js';
export { some } from './collection/some.js';

// Function
export { debounce } from './function/debounce.js';
export { throttle } from './function/throttle.js';
export { memoize } from './function/memoize.js';
export { once } from './function/once.js';
export { curry } from './function/curry.js';

// Lang
export { isEqual } from './lang/isEqual.js';
export { isEmpty } from './lang/isEmpty.js';
export { isNil, isNull, isUndefined } from './lang/isNil.js';
export {
  isString, isNumber, isBoolean, isFunction, isArray,
  isObject, isPlainObject, isDate, isRegExp, isSymbol, isMap, isSet,
} from './lang/isString.js';

// Util
export { range } from './util/range.js';
export { times } from './util/times.js';
export { uniqueId } from './util/uniqueId.js';
