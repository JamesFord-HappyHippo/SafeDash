/**
 * Options for the {@link template} function.
 */
export interface TemplateOptions {
  /**
   * Opening delimiter for interpolation placeholders. Defaults to `'${'`.
   */
  open?: string;
  /**
   * Closing delimiter for interpolation placeholders. Defaults to `'}'`.
   */
  close?: string;
}

/** Keys that must never be interpolated for security reasons. */
const FORBIDDEN_KEYS = new Set([
  '__proto__',
  'constructor',
  'prototype',
]);

/**
 * Performs simple string template interpolation by replacing `${key}`
 * placeholders with values from a data object.
 *
 * **Security:** This function uses plain string replacement only. It does
 * NOT use `eval`, `new Function`, or any dynamic code execution. Keys
 * matching `__proto__`, `constructor`, or `prototype` are rejected and
 * left unreplaced.
 *
 * Nested property access is NOT supported; keys are looked up as literal
 * property names on the data object.
 *
 * @param str - The template string containing `${key}` placeholders.
 * @param data - An object whose own properties provide replacement values.
 * @param options - Optional delimiters for the placeholders.
 * @returns The interpolated string.
 *
 * @example
 * ```ts
 * template('Hello, ${name}!', { name: 'World' });
 * // 'Hello, World!'
 *
 * template('${a} + ${b} = ${c}', { a: 1, b: 2, c: 3 });
 * // '1 + 2 = 3'
 *
 * template('Hello, ${name}!', {});
 * // 'Hello, ${name}!'
 *
 * template('{{greeting}}, {{name}}!', { greeting: 'Hi', name: 'World' }, { open: '{{', close: '}}' });
 * // 'Hi, World!'
 *
 * // __proto__ keys are rejected for safety
 * template('${__proto__}', { __proto__: 'bad' });
 * // '${__proto__}'
 * ```
 */
export function template(
  str: string,
  data: Record<string, unknown>,
  options: TemplateOptions = {},
): string {
  const { open = '${', close = '}' } = options;

  let result = '';
  let i = 0;

  while (i < str.length) {
    const openIdx = str.indexOf(open, i);

    if (openIdx === -1) {
      result += str.slice(i);
      break;
    }

    // Append everything before the opening delimiter
    result += str.slice(i, openIdx);

    const keyStart = openIdx + open.length;
    const closeIdx = str.indexOf(close, keyStart);

    if (closeIdx === -1) {
      // No matching close delimiter; append rest as-is
      result += str.slice(openIdx);
      break;
    }

    const key = str.slice(keyStart, closeIdx);

    if (FORBIDDEN_KEYS.has(key)) {
      // Leave forbidden keys unreplaced
      result += open + key + close;
    } else if (Object.prototype.hasOwnProperty.call(data, key)) {
      result += String(data[key]);
    } else {
      // Key not found in data; leave placeholder intact
      result += open + key + close;
    }

    i = closeIdx + close.length;
  }

  return result;
}
