/**
 * Creates an array of numbers progressing from `start` up to, but not
 * including, `end`. A `step` of `-1` is used for descending ranges.
 *
 * Capped at 10 000 000 elements to prevent accidental memory exhaustion.
 *
 * @param startOrEnd - If only one argument, this is `end` (start defaults to 0).
 *                     If two or more arguments, this is `start`.
 * @param end - The exclusive upper bound
 * @param step - The increment/decrement value (default: 1 or -1 depending on direction)
 * @returns An array of numbers
 *
 * @example
 * ```ts
 * range(4);          // [0, 1, 2, 3]
 * range(1, 5);       // [1, 2, 3, 4]
 * range(0, 20, 5);   // [0, 5, 10, 15]
 * range(0, -4, -1);  // [0, -1, -2, -3]
 * range(0);          // []
 * ```
 */

const MAX_LENGTH = 10_000_000;

export function range(startOrEnd: number, end?: number, step?: number): number[] {
  let start: number;
  let stop: number;

  if (end === undefined) {
    start = 0;
    stop = startOrEnd;
  } else {
    start = startOrEnd;
    stop = end;
  }

  let s: number;
  if (step !== undefined) {
    s = step;
  } else {
    s = start <= stop ? 1 : -1;
  }

  // Zero step would cause infinite loop
  if (s === 0) return [];

  // Calculate length
  const length = Math.max(Math.ceil((stop - start) / s), 0);

  if (length > MAX_LENGTH) {
    throw new RangeError(
      `SafeDash: range() would produce ${length} elements, exceeding the maximum of ${MAX_LENGTH}.`
    );
  }

  const result = new Array<number>(length);
  for (let i = 0; i < length; i++) {
    result[i] = start + i * s;
  }

  return result;
}
