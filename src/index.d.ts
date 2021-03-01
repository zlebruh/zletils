interface TypedProperty {
  get: Function;
  set: Function;
  enumerable: true;
}

interface TypedProperties {
  [key: string]: TypedProperty;
}

declare module 'zletils' {
  class TypedProp implements TypedProperty {
    get: Function;
    set: Function;
    enumerable: true;
    constructor(props: { state: any, strict?: Boolean });
  }

  export function throwUnexpectedType(value: any, expected: String, name?: String): void;

  export function is(val: any): Boolean;
  export function getType(val: any): String;
  export function isType(VALUE: any, type: String, checkEmpty?: Boolean): Boolean;
  export function typedProp(state: any, strict?: Boolean): TypedProp;
  export function typedProps(props: { values: Object, target?: Object, strict?: Boolean }): TypedProperties;
  export function reachValue(ob: Object, path: String): any;
}
