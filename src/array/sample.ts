import { shuffle } from './shuffle';

/**
 * Returns a random element from an array, or `undefined` if the array is empty.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @returns A random element, or `undefined` if the array is empty.
 *
 * @example
 * ```ts
 * import { sample } from './sample';
 *
 * sample([1, 2, 3, 4]); // e.g. 3
 * sample([]);            // undefined
 * ```
 */
export function sample<T>(array: readonly T[]): T | undefined {
  if (array.length === 0) return undefined;
  const index = randomInt(array.length);
  return array[index];
}

/**
 * Returns `n` random elements from an array. The returned elements are unique
 * (sampled without replacement). If `n` is greater than or equal to the array
 * length, a shuffled copy of the entire array is returned.
 *
 * Never mutates the input array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @param n - The number of elements to sample.
 * @returns A new array of up to `n` randomly selected elements.
 *
 * @example
 * ```ts
 * import { sampleSize } from './sample';
 *
 * sampleSize([1, 2, 3, 4, 5], 3); // e.g. [5, 1, 3]
 * sampleSize([1, 2, 3], 10);      // e.g. [2, 3, 1]
 * sampleSize([], 5);              // []
 * ```
 */
export function sampleSize<T>(array: readonly T[], n: number): T[] {
  if (n <= 0 || array.length === 0) return [];
  const shuffled = shuffle(array);
  return shuffled.slice(0, Math.min(n, array.length));
}

/**
 * Returns a random integer in [0, max).
 * Uses crypto.getRandomValues when available for true randomness.
 */
function randomInt(max: number): number {
  if (typeof globalThis.crypto !== 'undefined' && typeof globalThis.crypto.getRandomValues === 'function') {
    const arr = new Uint32Array(1);
    globalThis.crypto.getRandomValues(arr);
    return arr[0] % max;
  }
  return Math.floor(Math.random() * max);
}
