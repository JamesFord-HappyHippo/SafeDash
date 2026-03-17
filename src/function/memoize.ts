/**
 * Creates a memoized version of a function that caches results.
 *
 * The cache is a bounded `Map` that evicts the oldest entry when it
 * exceeds 1 000 entries (configurable). A custom `resolver` can
 * produce the cache key from the arguments.
 *
 * The cache is exposed as `memoized.cache` and supports `.clear()`.
 *
 * @param func - The function to memoize
 * @param resolver - Optional function that returns the cache key from the arguments
 * @param options - Configuration options
 * @param options.maxSize - Maximum number of cached entries before eviction (default: 1000)
 * @returns The memoized function with a `.cache` property
 *
 * @example
 * ```ts
 * const factorial = memoize((n: number): number =>
 *   n <= 1 ? 1 : n * factorial(n - 1)
 * );
 * factorial(5); // 120 (computed)
 * factorial(5); // 120 (cached)
 * ```
 *
 * @example
 * ```ts
 * // Custom resolver for multi-arg functions
 * const add = memoize(
 *   (a: number, b: number) => a + b,
 *   (a, b) => `${a}:${b}`
 * );
 * ```
 *
 * @example
 * ```ts
 * // Clear the cache
 * const fn = memoize(expensiveWork);
 * fn(42);
 * fn.cache.clear();
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface MemoizeOptions {
  /** Maximum number of cached entries before oldest are evicted (default: 1000). */
  maxSize?: number;
}

export interface MemoizedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T>;
  /** The underlying cache. Call `.clear()` to reset. */
  cache: Map<unknown, ReturnType<T>>;
}

export function memoize<T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => unknown,
  options: MemoizeOptions = {},
): MemoizedFunction<T> {
  const { maxSize = 1000 } = options;

  const cache = new Map<unknown, ReturnType<T>>();

  function memoized(this: unknown, ...args: Parameters<T>): ReturnType<T> {
    const key = resolver ? resolver(...args) : args[0];

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = func.apply(this, args) as ReturnType<T>;

    // Evict oldest entry if cache exceeds maxSize
    if (cache.size >= maxSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(key, result);
    return result;
  }

  memoized.cache = cache;

  return memoized as MemoizedFunction<T>;
}
