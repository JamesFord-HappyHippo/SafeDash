# SafeDash — Claude Code Configuration

**Security-Hardened JavaScript Utility Library**
**Pareidolia LLC (d/b/a Equilateral AI)**

## Project Overview

SafeDash is a lodash-compatible utility library rebuilt from scratch with security as the primary design constraint. Every function that touches object keys filters `__proto__`, `constructor`, and `prototype`. All recursive operations are depth-limited. No eval or Function constructor is used anywhere.

## Architecture

- `src/_internal/guards.ts` — Security primitives (isSafeKey, isPlainObject, assertDepth, MAX_DEPTH)
- `src/array/` — Array utilities (chunk, compact, flatten, uniq, difference, zip)
- `src/object/` — Object utilities (get, set, merge, pick, omit, cloneDeep, defaults)
- `src/string/` — String utilities (camelCase, kebabCase, escape, truncate, template)
- `src/collection/` — Collection utilities (groupBy, sortBy, keyBy, partition)
- `src/function/` — Function utilities (debounce, throttle, memoize, once, curry)
- `src/lang/` — Type checks and deep equality (isEqual, isEmpty, isNil, type guards)
- `src/util/` — Utilities (range, times, uniqueId)

## Security Rules

- **NEVER** access or write `__proto__`, `constructor`, or `prototype` keys
- **NEVER** use eval, Function constructor, or dynamic code generation
- **NEVER** mutate input arguments — always return new objects/arrays
- **ALWAYS** cap recursion depth at MAX_DEPTH (64)
- **ALWAYS** handle circular references in recursive operations
- **ALWAYS** validate input types before processing

## Development

```bash
npm install          # Install TypeScript
npm run build        # Compile to dist/
npm test             # Run tests
npm run scan         # AEGIS security scan
```
