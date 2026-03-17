/**
 * Creates a throttled version of a function that only invokes `func`
 * at most once per every `wait` milliseconds.
 *
 * Built on top of {@link debounce} with `maxWait` set to `wait`.
 *
 * @param func - The function to throttle
 * @param options - Throttle configuration
 * @param options.wait - Milliseconds to throttle invocations to (default: 0)
 * @param options.leading - Invoke on the leading edge (default: true)
 * @param options.trailing - Invoke on the trailing edge (default: true)
 * @returns The throttled function with `.cancel()` and `.flush()` methods
 *
 * @example
 * ```ts
 * const throttled = throttle(updatePosition, { wait: 100 });
 * window.addEventListener('scroll', throttled);
 * ```
 *
 * @example
 * ```ts
 * // Only leading edge
 * const onClick = throttle(handleClick, { wait: 500, trailing: false });
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import { debounce, type DebouncedFunction } from './debounce.js';

export interface ThrottleOptions {
  /** Milliseconds to throttle invocations to (default: 0). */
  wait?: number;
  /** Invoke on the leading edge (default: true). */
  leading?: boolean;
  /** Invoke on the trailing edge (default: true). */
  trailing?: boolean;
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  options: ThrottleOptions = {},
): DebouncedFunction<T> {
  const {
    wait = 0,
    leading = true,
    trailing = true,
  } = options;

  return debounce(func, {
    wait,
    leading,
    trailing,
    maxWait: wait,
  });
}
