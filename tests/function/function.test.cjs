const { describe, it, before } = require('node:test');
const assert = require('node:assert/strict');

describe('Function utilities', () => {
  let debounce, throttle, memoize, once, curry, _;

  before(async () => {
    ({ debounce } = await import('../../dist/function/debounce.js'));
    ({ throttle } = await import('../../dist/function/throttle.js'));
    ({ memoize } = await import('../../dist/function/memoize.js'));
    ({ once } = await import('../../dist/function/once.js'));
    ({ curry, _ } = await import('../../dist/function/curry.js'));
  });

  // ── debounce ───────────────────────────────────────────────────────

  describe('debounce', () => {
    it('should delay invocation', async () => {
      let callCount = 0;
      const debounced = debounce(() => { callCount++; }, { wait: 50 });

      debounced();
      debounced();
      debounced();

      assert.strictEqual(callCount, 0);

      await new Promise((r) => setTimeout(r, 100));
      assert.strictEqual(callCount, 1);
    });

    it('should invoke on leading edge when configured', () => {
      let callCount = 0;
      const debounced = debounce(() => { callCount++; }, {
        wait: 100,
        leading: true,
        trailing: false,
      });

      debounced();
      assert.strictEqual(callCount, 1);

      debounced();
      assert.strictEqual(callCount, 1); // Still only 1 — within wait period
    });

    it('should support cancel()', async () => {
      let callCount = 0;
      const debounced = debounce(() => { callCount++; }, { wait: 50 });

      debounced();
      debounced.cancel();

      await new Promise((r) => setTimeout(r, 100));
      assert.strictEqual(callCount, 0);
    });

    it('should support flush()', () => {
      let callCount = 0;
      const debounced = debounce(() => { callCount++; return 'result'; }, { wait: 1000 });

      debounced();
      assert.strictEqual(callCount, 0);

      debounced.flush();
      assert.strictEqual(callCount, 1);
    });

    it('should pass arguments to the function', async () => {
      let received;
      const debounced = debounce((...args) => { received = args; }, { wait: 50 });

      debounced('a', 'b');
      debounced.flush();

      assert.deepStrictEqual(received, ['a', 'b']);
    });

    it('should use the latest arguments when trailing', async () => {
      let received;
      const debounced = debounce((...args) => { received = args; }, { wait: 50 });

      debounced('first');
      debounced('second');
      debounced.flush();

      assert.deepStrictEqual(received, ['second']);
    });
  });

  // ── throttle ───────────────────────────────────────────────────────

  describe('throttle', () => {
    it('should invoke immediately on first call (leading: true by default)', () => {
      let callCount = 0;
      const throttled = throttle(() => { callCount++; }, { wait: 100 });

      throttled();
      assert.strictEqual(callCount, 1);
    });

    it('should not invoke again within wait period', () => {
      let callCount = 0;
      const throttled = throttle(() => { callCount++; }, {
        wait: 100,
        trailing: false,
      });

      throttled();
      throttled();
      throttled();

      assert.strictEqual(callCount, 1);
    });

    it('should invoke on trailing edge after wait', async () => {
      let callCount = 0;
      const throttled = throttle(() => { callCount++; }, { wait: 50 });

      throttled();
      assert.strictEqual(callCount, 1); // leading
      throttled();

      await new Promise((r) => setTimeout(r, 100));
      assert.strictEqual(callCount, 2); // trailing
    });

    it('should have cancel method', () => {
      const throttled = throttle(() => {}, { wait: 100 });
      assert.strictEqual(typeof throttled.cancel, 'function');
    });

    it('should have flush method', () => {
      const throttled = throttle(() => {}, { wait: 100 });
      assert.strictEqual(typeof throttled.flush, 'function');
    });
  });

  // ── memoize ────────────────────────────────────────────────────────

  describe('memoize', () => {
    it('should cache results by first argument', () => {
      let computeCount = 0;
      const fn = memoize((n) => { computeCount++; return n * 2; });

      assert.strictEqual(fn(5), 10);
      assert.strictEqual(fn(5), 10);
      assert.strictEqual(computeCount, 1);
    });

    it('should compute for new arguments', () => {
      let computeCount = 0;
      const fn = memoize((n) => { computeCount++; return n * 2; });

      fn(1);
      fn(2);
      assert.strictEqual(computeCount, 2);
    });

    it('should support custom resolver', () => {
      let computeCount = 0;
      const fn = memoize(
        (a, b) => { computeCount++; return a + b; },
        (a, b) => `${a}:${b}`
      );

      assert.strictEqual(fn(1, 2), 3);
      assert.strictEqual(fn(1, 2), 3);
      assert.strictEqual(computeCount, 1);

      assert.strictEqual(fn(2, 1), 3);
      assert.strictEqual(computeCount, 2);
    });

    it('should expose cache as a Map', () => {
      const fn = memoize((n) => n * 2);
      fn(5);
      assert.ok(fn.cache instanceof Map);
      assert.strictEqual(fn.cache.size, 1);
      assert.strictEqual(fn.cache.get(5), 10);
    });

    it('should support cache.clear()', () => {
      let computeCount = 0;
      const fn = memoize((n) => { computeCount++; return n * 2; });

      fn(5);
      fn.cache.clear();
      fn(5);
      assert.strictEqual(computeCount, 2);
    });

    it('should evict oldest entry when cache exceeds maxSize', () => {
      const fn = memoize((n) => n * 2, undefined, { maxSize: 3 });

      fn(1); fn(2); fn(3);
      assert.strictEqual(fn.cache.size, 3);

      fn(4); // Should evict key 1
      assert.strictEqual(fn.cache.size, 3);
      assert.strictEqual(fn.cache.has(1), false);
      assert.strictEqual(fn.cache.has(4), true);
    });
  });

  // ── once ───────────────────────────────────────────────────────────

  describe('once', () => {
    it('should call function only once', () => {
      let count = 0;
      const fn = once(() => { count++; return 'result'; });

      assert.strictEqual(fn(), 'result');
      assert.strictEqual(fn(), 'result');
      assert.strictEqual(fn(), 'result');
      assert.strictEqual(count, 1);
    });

    it('should pass arguments on first call', () => {
      let received;
      const fn = once((...args) => { received = args; return args; });

      fn('a', 'b');
      fn('c', 'd'); // Ignored

      assert.deepStrictEqual(received, ['a', 'b']);
    });

    it('should return first result on subsequent calls', () => {
      const fn = once((x) => x * 2);

      assert.strictEqual(fn(5), 10);
      assert.strictEqual(fn(99), 10); // Returns first result
    });

    it('should handle functions returning undefined', () => {
      let count = 0;
      const fn = once(() => { count++; });

      fn();
      fn();
      assert.strictEqual(count, 1);
    });
  });

  // ── curry ──────────────────────────────────────────────────────────

  describe('curry', () => {
    it('should curry a function', () => {
      const add = (a, b, c) => a + b + c;
      const curried = curry(add);

      assert.strictEqual(curried(1)(2)(3), 6);
    });

    it('should accept multiple arguments at once', () => {
      const add = (a, b, c) => a + b + c;
      const curried = curry(add);

      assert.strictEqual(curried(1, 2)(3), 6);
      assert.strictEqual(curried(1)(2, 3), 6);
      assert.strictEqual(curried(1, 2, 3), 6);
    });

    it('should work with unary functions', () => {
      const double = (x) => x * 2;
      const curried = curry(double);
      assert.strictEqual(curried(5), 10);
    });

    it('should support placeholder for skipping arguments', () => {
      const greet = (greeting, name) => `${greeting}, ${name}!`;
      const curried = curry(greet);

      const greetBob = curried(_, 'Bob');
      assert.strictEqual(greetBob('Hello'), 'Hello, Bob!');
    });

    it('should allow partial application to be reused', () => {
      const add = (a, b) => a + b;
      const curried = curry(add);
      const add10 = curried(10);

      assert.strictEqual(add10(5), 15);
      assert.strictEqual(add10(20), 30);
    });
  });
});
