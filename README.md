# SafeDash

A security-hardened JavaScript utility library — lodash rebuilt with zero CVEs.

**Pareidolia LLC (d/b/a Equilateral AI)**

## Why

Lodash has had [multiple prototype pollution CVEs](https://security.snyk.io/package/npm/lodash) in `merge`, `defaultsDeep`, `set`, and `zipObjectDeep`. SafeDash provides the same API with these security guarantees:

- **No prototype pollution** — `__proto__`, `constructor`, `prototype` keys are blocked everywhere
- **No eval or Function constructor** — template interpolation uses safe string replacement
- **No unbounded recursion** — all recursive operations capped at 64 levels
- **Immutable by default** — `merge`, `set`, `defaults` return new objects
- **Circular reference safe** — `cloneDeep`, `isEqual` detect cycles via WeakMap/WeakSet

## Install

```bash
npm install safedash
```

## Usage

```typescript
import { merge, get, set, cloneDeep, groupBy, debounce } from 'safedash';

// Safe deep merge — no prototype pollution possible
const config = merge(defaults, userConfig);

// Safe path access — blocks __proto__ paths
const value = get(obj, 'a.b.c', fallback);

// Immutable set — returns new object
const updated = set(obj, 'user.name', 'Alice');

// All the utilities you expect
const grouped = groupBy(users, 'role');
const search = debounce(fetchResults, 300);
```

## Prototype Pollution Protection

```typescript
// lodash vulnerability (CVE-2020-8203):
_.merge({}, JSON.parse('{"__proto__":{"polluted":"yes"}}'));
({} as any).polluted // "yes" — POLLUTED!

// SafeDash:
merge({}, JSON.parse('{"__proto__":{"polluted":"yes"}}'));
({} as any).polluted // undefined — SAFE!
```

## API

### Array
`chunk` `compact` `flatten` `flattenDeep` `uniq` `uniqBy` `difference` `intersection` `zip` `unzip`

### Object
`get` `set` `merge` `pick` `omit` `cloneDeep` `defaults` `defaultsDeep`

### String
`camelCase` `kebabCase` `snakeCase` `capitalize` `truncate` `escape` `unescape` `escapeRegExp` `trim` `trimStart` `trimEnd` `pad` `padStart` `padEnd` `template`

### Collection
`groupBy` `sortBy` `keyBy` `partition` `countBy` `orderBy` `find` `every` `some`

### Function
`debounce` `throttle` `memoize` `once` `curry`

### Lang
`isEqual` `isEmpty` `isNil` `isNull` `isUndefined` `isString` `isNumber` `isBoolean` `isFunction` `isArray` `isObject` `isPlainObject` `isDate` `isRegExp` `isSymbol` `isMap` `isSet`

### Util
`range` `times` `uniqueId`

## License

MIT
