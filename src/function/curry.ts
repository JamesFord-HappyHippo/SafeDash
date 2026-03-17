/**
 * Creates a curried version of a function. Arguments can be supplied
 * incrementally across multiple calls. Use the exported `_` placeholder
 * to skip positional arguments.
 *
 * @param func - The function to curry
 * @returns The curried function
 *
 * @example
 * ```ts
 * const add = (a: number, b: number, c: number) => a + b + c;
 * const curried = curry(add);
 *
 * curried(1)(2)(3);    // 6
 * curried(1, 2)(3);    // 6
 * curried(1)(2, 3);    // 6
 * curried(1, 2, 3);    // 6
 * ```
 *
 * @example
 * ```ts
 * // Using placeholder to skip arguments
 * import { curry, _ } from './curry.js';
 *
 * const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
 * const curried = curry(greet);
 *
 * const greetBob = curried(_, 'Bob');
 * greetBob('Hello'); // 'Hello, Bob!'
 * ```
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/** Placeholder symbol used to skip positional arguments in curried calls. */
export const _: unique symbol = Symbol.for('SafeDash.curry.placeholder') as any;

/** The placeholder type. */
export type Placeholder = typeof _;

export function curry<T extends (...args: any[]) => any>(func: T): CurriedFunction<T> {
  const arity = func.length;

  function curried(this: unknown, prevArgs: unknown[]): any {
    return function (this: unknown, ...supplied: unknown[]): any {
      // Merge supplied args into previous args, filling placeholders
      const merged = [...prevArgs];
      let supIdx = 0;

      // Fill in placeholders from previous calls
      for (let i = 0; i < merged.length && supIdx < supplied.length; i++) {
        if (merged[i] === _) {
          merged[i] = supplied[supIdx++];
        }
      }

      // Append remaining supplied args
      while (supIdx < supplied.length) {
        merged.push(supplied[supIdx++]);
      }

      // Count non-placeholder args
      const filledCount = merged.filter((a) => a !== _).length;

      if (filledCount >= arity) {
        // Replace any remaining placeholders with undefined
        const finalArgs = merged.map((a) => (a === _ ? undefined : a));
        return func.apply(this, finalArgs);
      }

      return curried.call(this, merged);
    };
  }

  return curried.call(undefined, []) as CurriedFunction<T>;
}

/**
 * A curried function type.
 * For simplicity the return type accepts any number of args and returns
 * either another curried function or the final result.
 */
export type CurriedFunction<T extends (...args: any[]) => any> = (
  ...args: any[]
) => ReturnType<T> | CurriedFunction<T>;
