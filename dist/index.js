var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) =>
  key in obj
    ? __defProp(obj, key, {
        enumerable: true,
        configurable: true,
        writable: true,
        value,
      })
    : (obj[key] = value);
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== 'symbol' ? key + '' : key, value);
  return value;
};

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/rng.js
var getRandomValues;
var rnds8 = new Uint8Array(16);
function rng() {
  if (!getRandomValues) {
    getRandomValues =
      (typeof crypto !== 'undefined' &&
        crypto.getRandomValues &&
        crypto.getRandomValues.bind(crypto)) ||
      (typeof msCrypto !== 'undefined' &&
        typeof msCrypto.getRandomValues === 'function' &&
        msCrypto.getRandomValues.bind(msCrypto));
    if (!getRandomValues) {
      throw new Error(
        'crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported'
      );
    }
  }
  return getRandomValues(rnds8);
}

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/regex.js
var regex_default =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/validate.js
function validate(uuid) {
  return typeof uuid === 'string' && regex_default.test(uuid);
}
var validate_default = validate;

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/stringify.js
var byteToHex = [];
for (i = 0; i < 256; ++i) {
  byteToHex.push((i + 256).toString(16).substr(1));
}
var i;
function stringify(arr) {
  var offset =
    arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
  var uuid = (
    byteToHex[arr[offset + 0]] +
    byteToHex[arr[offset + 1]] +
    byteToHex[arr[offset + 2]] +
    byteToHex[arr[offset + 3]] +
    '-' +
    byteToHex[arr[offset + 4]] +
    byteToHex[arr[offset + 5]] +
    '-' +
    byteToHex[arr[offset + 6]] +
    byteToHex[arr[offset + 7]] +
    '-' +
    byteToHex[arr[offset + 8]] +
    byteToHex[arr[offset + 9]] +
    '-' +
    byteToHex[arr[offset + 10]] +
    byteToHex[arr[offset + 11]] +
    byteToHex[arr[offset + 12]] +
    byteToHex[arr[offset + 13]] +
    byteToHex[arr[offset + 14]] +
    byteToHex[arr[offset + 15]]
  ).toLowerCase();
  if (!validate_default(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }
  return uuid;
}
var stringify_default = stringify;

// node_modules/.pnpm/uuid@8.3.2/node_modules/uuid/dist/esm-browser/v4.js
function v4(options, buf, offset) {
  options = options || {};
  var rnds = options.random || (options.rng || rng)();
  rnds[6] = (rnds[6] & 15) | 64;
  rnds[8] = (rnds[8] & 63) | 128;
  if (buf) {
    offset = offset || 0;
    for (var i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }
    return buf;
  }
  return stringify_default(rnds);
}
var v4_default = v4;

// src/utils.ts
function isFunction(func) {
  return typeof func === 'function' && func.length <= 1;
}

// src/index.ts
var Observable = class {
  constructor(subscriberFunction) {
    this.subscriberFunction = subscriberFunction;
    __publicField(this, 'subscribed', /* @__PURE__ */ new Map());
  }
  subscribe(observer) {
    const { uuid, serializedObserver } = this.serialize(observer);
    this.subscribed.set(uuid, serializedObserver);
    this.subscriberFunction(serializedObserver);
    return {
      unsubscribe: () => this.subscribed.delete(uuid),
    };
  }
  serialize(observer) {
    const uuid = v4_default();
    let serializedObserver = isFunction(observer)
      ? {
          next: this.wrapFunction(uuid, observer),
          complete: this.wrapFunction(uuid, () => {}, true),
          error: this.wrapFunction(uuid, () => {}, true),
        }
      : {
          next: this.wrapFunction(uuid, observer.next),
          complete: this.wrapFunction(uuid, observer.complete, true),
          error: this.wrapFunction(uuid, observer.error, true),
        };
    return { uuid, serializedObserver };
  }
  wrapFunction(uuid, func, remove = false) {
    return (...args) => {
      const { subscribed } = this;
      if (!subscribed.has(uuid)) {
        return;
      }
      if (func === void 0) {
        func = () => {};
      }
      func(...args);
      if (remove) {
        subscribed.delete(uuid);
      }
    };
  }
};
var src_default = Observable;
