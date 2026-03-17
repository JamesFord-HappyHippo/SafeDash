/**
 * Invokes an iteratee `n` times, returning an array of the results.
 *
 * Capped at 10 000 000 invocations to prevent accidental memory exhaustion.
 *
 * @param n - The number of times to invoke `iteratee`
 * @param iteratee - The function invoked on each iteration, receiving the current index
 * @returns An array of results from each invocation
 *
 * @example
 * ```ts
 * times(3, (i) => i * 2);        // [0, 2, 4]
 * times(4, () => 'x');           // ['x', 'x', 'x', 'x']
 * times(3, String);              // ['0', '1', '2']
 * times(0, () => 'never');       // []
 * ```
 */

const MAX_COUNT = 10_000_000;

export function times<T>(n: number, iteratee: (index: number) => T): T[] {
  const count = Math.max(Math.floor(n), 0);

  if (count > MAX_COUNT) {
    throw new RangeError(
      `SafeDash: times() called with n=${count}, exceeding the maximum of ${MAX_COUNT}.`
    );
  }

  const result = new Array<T>(count);
  for (let i = 0; i < count; i++) {
    result[i] = iteratee(i);
  }

  return result;
}
