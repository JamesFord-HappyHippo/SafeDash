/**
 * Creates a debounced version of a function that delays invocation
 * until `wait` milliseconds have elapsed since the last call.
 *
 * The debounced function has `.cancel()` and `.flush()` methods.
 *
 * @param func - The function to debounce
 * @param options - Debounce configuration
 * @param options.wait - Milliseconds to delay (default: 0)
 * @param options.leading - Invoke on the leading edge (default: false)
 * @param options.trailing - Invoke on the trailing edge (default: true)
 * @param options.maxWait - Maximum time `func` can be delayed before forced invocation
 * @returns The debounced function
 *
 * @example
 * ```ts
 * const debounced = debounce(saveInput, { wait: 300 });
 * input.addEventListener('keyup', debounced);
 *
 * // Cancel pending invocation
 * debounced.cancel();
 *
 * // Immediately invoke if pending
 * debounced.flush();
 * ```
 *
 * @example
 * ```ts
 * // Leading edge invocation
 * const onClick = debounce(handleClick, { wait: 200, leading: true, trailing: false });
 * ```
 *
 * @example
 * ```ts
 * // maxWait ensures the function is called at least every 1000ms
 * const onScroll = debounce(handleScroll, { wait: 100, maxWait: 1000 });
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

export interface DebounceOptions {
  /** Milliseconds to delay (default: 0). */
  wait?: number;
  /** Invoke on the leading edge of the timeout (default: false). */
  leading?: boolean;
  /** Invoke on the trailing edge of the timeout (default: true). */
  trailing?: boolean;
  /** Maximum time the function can be delayed before it is forced to invoke. */
  maxWait?: number;
}

export interface DebouncedFunction<T extends (...args: any[]) => any> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  /** Cancel any pending delayed invocation. */
  cancel(): void;
  /** If there is a pending invocation, invoke it immediately and return the result. */
  flush(): ReturnType<T> | undefined;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  options: DebounceOptions = {},
): DebouncedFunction<T> {
  const {
    wait = 0,
    leading = false,
    trailing = true,
    maxWait,
  } = options;

  let timerId: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T> | undefined;
  let lastThis: unknown;
  let result: ReturnType<T> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;

  const hasMaxWait = maxWait !== undefined;
  const maxWaitMs = hasMaxWait ? Math.max(maxWait, wait) : 0;

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs;
    const thisArg = lastThis;
    lastArgs = undefined;
    lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args!) as ReturnType<T>;
    return result;
  }

  function startTimer(pendingFunc: () => void, waitMs: number): void {
    timerId = setTimeout(pendingFunc, waitMs);
  }

  function cancelTimer(): void {
    if (timerId !== undefined) {
      clearTimeout(timerId);
      timerId = undefined;
    }
  }

  function remainingWait(time: number): number {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;
    const timeWaiting = wait - timeSinceLastCall;
    return hasMaxWait
      ? Math.min(timeWaiting, maxWaitMs - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = time - (lastCallTime ?? 0);
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      (hasMaxWait && timeSinceLastInvoke >= maxWaitMs)
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      trailingEdge(time);
      return;
    }
    startTimer(timerExpired, remainingWait(time));
  }

  function leadingEdge(time: number): ReturnType<T> | undefined {
    lastInvokeTime = time;
    startTimer(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }

  function trailingEdge(time: number): ReturnType<T> | undefined {
    timerId = undefined;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = undefined;
    lastThis = undefined;
    return result;
  }

  function debounced(this: unknown, ...args: Parameters<T>): ReturnType<T> | undefined {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(time);
      }
      if (hasMaxWait) {
        cancelTimer();
        startTimer(timerExpired, wait);
        return invokeFunc(time);
      }
    }
    if (timerId === undefined) {
      startTimer(timerExpired, wait);
    }
    return result;
  }

  debounced.cancel = function cancel(): void {
    cancelTimer();
    lastInvokeTime = 0;
    lastArgs = undefined;
    lastCallTime = undefined;
    lastThis = undefined;
  };

  debounced.flush = function flush(): ReturnType<T> | undefined {
    if (timerId === undefined) {
      return result;
    }
    return trailingEdge(Date.now());
  };

  return debounced as DebouncedFunction<T>;
}
