/**
 * Creates a function that is restricted to being called only once.
 * Subsequent calls return the result of the first invocation.
 *
 * @param func - The function to restrict
 * @returns A function that invokes `func` at most once
 *
 * @example
 * ```ts
 * const initialize = once(() => {
 *   console.log('init!');
 *   return { ready: true };
 * });
 *
 * initialize(); // logs 'init!', returns { ready: true }
 * initialize(); // returns { ready: true } (no log)
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export function once<T extends (...args: any[]) => any>(
  func: T,
): (...args: Parameters<T>) => ReturnType<T> {
  let called = false;
  let result: ReturnType<T>;

  return function (this: unknown, ...args: Parameters<T>): ReturnType<T> {
    if (!called) {
      called = true;
      result = func.apply(this, args) as ReturnType<T>;
    }
    return result;
  };
}
