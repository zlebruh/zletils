const CONSTANTS = {
  Object: 'Object',
  String: 'String',
};

const REGEX = {
  ip: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/, /* jscs:ignore */ // eslint-disable-line
  url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/, /* jscs:ignore */ // eslint-disable-line
  email: /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)])/, /* jscs:ignore */ // eslint-disable-line
};

const TYPE_CHECKS = {
  Array: 'Array.isArray(VALUE)',
  Boolean: 'typeof VALUE === "boolean"',
  Element: 'VALUE instanceof HTMLElement',
  Function: 'VALUE instanceof Function',
  Number: 'typeof VALUE === "number" && isFinite(VALUE)',
  Object: 'typeof VALUE === "object" && !Array.isArray(VALUE) && VALUE !== null',
  String: 'typeof VALUE === "string"',
  URL: 'REGEX.url.test(VALUE)',
  ValidEmail: 'REGEX.email.test(VALUE)',
  ValidIP: 'REGEX.ip.test(VALUE)',
  // null: 'This one is handled manually',
};

// #################### EXPORTED ##################
// ####### Types #######
export function isType(VALUE, type, checkEmpty = false) {
  try {
    if (VALUE === null) return VALUE === type;

    const result = eval(TYPE_CHECKS[type]) || false;

    if (result && checkEmpty === true) {
      if (VALUE.hasOwnProperty('length')) return Boolean(VALUE.length);
      return Boolean(Object.keys(VALUE).length);
    }

    return result;
  } catch (err) {
    console.warn(err);
    return false;
  }
}

export function getType(val) {
  try {
    return val.constructor.name;
  } catch (err) {
    return val === null ? val : typeof val;
  }
}

// ####### Typed #######
export class TypedProp {
  constructor(state, strict = false) {
    let type = getType(state);

    function get() {
      return state;
    }

    function set(val) {
      const notSet = !is(state);
      const sameType = isType(val, type);
      const valueType = getType(val);

      if (notSet || sameType) {
        if (state !== val) {
          state = val;
          type = valueType;
        }
      } else {
        const msg = `### Cannot change property type ${type} with ${valueType}`;
        if (strict === true) throw new TypeError(msg);
        console.error(msg);
      }
    }

    Object.assign(this, { get, set, enumerable: true });
  }
}

export function typedProp(state, strict = false) {
  return new TypedProp(state, strict);
};

export function typedProps(props) {
  const { values, target, strict = false } = props;
  const type = CONSTANTS.Object;
  const noValues = !isType(values, type);

  if (noValues) { throwUnexpectedType(values, type, 'values'); }

  const result = {};
  Object.keys(values).forEach((key) => result[key] = typedProp(values[key], strict));

  const noTarget = !isType(target, type);
  const targetObject = noTarget
    ? Object.create(null)
    : target;

  return Object.defineProperties(targetObject, result);
};

// ####### Other ######
export function is(val) {
  return val !== undefined && val !== null;
}

export function throwUnexpectedType(value, expected, name) {
  const typeValue = `[${getType(value)}]`;
  const typeTarget = `[${getType(expected)}]`;
  const middle = isType(name, CONSTANTS.String)
    ? `"${name}" ${typeValue}`
    : typeValue;

  const errText = `Param ${middle} does not match type ${typeTarget}`;
  throw new TypeError(errText);
}

export function reachValue(ob, path = '') {
  const obj = CONSTANTS.Object;
  const str = CONSTANTS.String;
  if (!isType(ob, obj)) throwUnexpectedType(ob, obj, 'ob');
  if (!isType(path, str)) throwUnexpectedType(path, str, 'path');

  const steps = path.split('.');
  const result = { key: null, value: null, parent: null };

  for (let i = 0; i < steps.length; i += 1) {
    const key = steps[i];
    const parent = result.value || ob;
    const item = parent[key];
    const value = is(item) ? item : null;

    Object.assign(result, { key, parent, value });

    if (!is(value)) break;
  }

  return result;
}
