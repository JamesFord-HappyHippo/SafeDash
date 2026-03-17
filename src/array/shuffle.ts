/**
 * Returns a new array with elements randomly shuffled using the Fisher-Yates
 * algorithm. Uses `crypto.getRandomValues` for cryptographically strong
 * randomness when available, falling back to `Math.random`.
 *
 * Never mutates the input array.
 *
 * @typeParam T - The type of elements in the array.
 * @param array - The source array.
 * @returns A new shuffled array.
 *
 * @example
 * ```ts
 * import { shuffle } from './shuffle';
 *
 * shuffle([1, 2, 3, 4, 5]); // e.g. [3, 1, 5, 2, 4]
 * shuffle([]);               // []
 * ```
 */
export function shuffle<T>(array: readonly T[]): T[] {
  const result = array.slice();
  const len = result.length;

  if (len <= 1) return result;

  for (let i = len - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const temp = result[i];
    result[i] = result[j];
    result[j] = temp;
  }

  return result;
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
