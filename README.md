# zletils
My handy utils



If, at least sometimes, you really care about guaranteed `run-time` type safety, these are for you.

## Usage
```javascript
import { typedProps } from 'zle-typed';

const manyValues = {
  a: 1,
    b: '2',
    c: false,
    d: true,
    e: null,
    f: document.createElement('div'),
    g: () => ({}),
    h: undefined,
    i: {},
    j: [],
    k: new RegExp('abc'),
};
const test = typedProps({
  values: manyValues,
  strict: true // Optional: causes the set function to throw, not log, en error on incorrect assignment attempts
});

test.a = 3
test.a // 3
test.a = []
index.js:60 ### Cannot change property type Number with Array

test.a = '511'
index.js:60 ### Cannot change property type Number with String

test.k = 'no wai'
index.js:60 ### Cannot change property type RegExp with String

test.k = /^no wai$/
/^no wai$/

test.e // null
test.e = null
test.e = 'OK'
test.e = null
index.js:60 ### Cannot change property type String with null

test.g // () => ({})
test.g = {}
index.js:60 ### Cannot change property type Function with Object

test.g = function ohYeah() {}
test.g // ƒ ohYeah() {}
```

## Use an existing object
```javascript
import { typedProps } from 'zle-typed';

const foo = new Object({ cool: 'story' });

const fewValues = {
  a: 1,
  b: '2',
  c: false,
};
const test = typedProps({
  values: fewValues,
  strict: true // Optional: causes the set function to throw, not log, en error on incorrect assignment attempts
}, foo);

console.log(foo); // {a: 1, b: "2", c: false, cool: "story"}
```

## Single prop
Having a getter and setter functions for each and every property is expensive and completely non-sensical in at least 99.99999% of any real case scenario. It serves no real purpose.

However, if you really, really need a run-time guaruantee for a single property, that's fine.

Here's how
```javascript
import { typedProp } from 'zle-typed';

const arr = typedProp([123]);
console.log(arr); // TypedProp {enumerable: true, get: ƒ, set: ƒ}

const someObject = Object.defineProperties({}, {
  arr,
  something: { value: 'else', enumerable: true, wriatable: true },
});

console.log(someObject); // { something: "else", arr: Array(1) }
```