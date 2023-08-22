(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.sfz = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
var sfz = require('./src/sfz')
  , AjaxLoader = require("./src/client/ajax_loader")

sfz.WebAudioSynth = require("./src/client/web_audio_synth")

sfz.load = function(audioContext, url, callback){
  var self = this
  AjaxLoader.load(url, function(str){
    var instrument = self.parse(str, sfz.WebAudioSynth, audioContext)
    callback(instrument)
  })
}

module.exports = sfz

},{"./src/client/ajax_loader":3,"./src/client/web_audio_synth":15,"./src/sfz":21}],2:[function(require,module,exports){
(function (global){(function (){
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define('underscore', factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
    var current = global._;
    var exports = global._ = factory();
    exports.noConflict = function () { global._ = current; return exports; };
  }()));
}(this, (function () {
  //     Underscore.js 1.13.6
  //     https://underscorejs.org
  //     (c) 2009-2022 Jeremy Ashkenas, Julian Gonggrijp, and DocumentCloud and Investigative Reporters & Editors
  //     Underscore may be freely distributed under the MIT license.

  // Current version.
  var VERSION = '1.13.6';

  // Establish the root object, `window` (`self`) in the browser, `global`
  // on the server, or `this` in some virtual machines. We use `self`
  // instead of `window` for `WebWorker` support.
  var root = (typeof self == 'object' && self.self === self && self) ||
            (typeof global == 'object' && global.global === global && global) ||
            Function('return this')() ||
            {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

  // Create quick reference variables for speed access to core prototypes.
  var push = ArrayProto.push,
      slice = ArrayProto.slice,
      toString = ObjProto.toString,
      hasOwnProperty = ObjProto.hasOwnProperty;

  // Modern feature detection.
  var supportsArrayBuffer = typeof ArrayBuffer !== 'undefined',
      supportsDataView = typeof DataView !== 'undefined';

  // All **ECMAScript 5+** native function implementations that we hope to use
  // are declared here.
  var nativeIsArray = Array.isArray,
      nativeKeys = Object.keys,
      nativeCreate = Object.create,
      nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

  // Create references to these builtin functions because we override them.
  var _isNaN = isNaN,
      _isFinite = isFinite;

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  // The largest integer that can be represented exactly.
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

  // Some functions take a variable number of arguments, or a few expected
  // arguments at the beginning and then a variable number of values to operate
  // on. This helper accumulates all remaining arguments past the function’s
  // argument length (or an explicit `startIndex`), into an array that becomes
  // the last argument. Similar to ES6’s "rest parameter".
  function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : +startIndex;
    return function() {
      var length = Math.max(arguments.length - startIndex, 0),
          rest = Array(length),
          index = 0;
      for (; index < length; index++) {
        rest[index] = arguments[index + startIndex];
      }
      switch (startIndex) {
        case 0: return func.call(this, rest);
        case 1: return func.call(this, arguments[0], rest);
        case 2: return func.call(this, arguments[0], arguments[1], rest);
      }
      var args = Array(startIndex + 1);
      for (index = 0; index < startIndex; index++) {
        args[index] = arguments[index];
      }
      args[startIndex] = rest;
      return func.apply(this, args);
    };
  }

  // Is a given variable an object?
  function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || (type === 'object' && !!obj);
  }

  // Is a given value equal to null?
  function isNull(obj) {
    return obj === null;
  }

  // Is a given variable undefined?
  function isUndefined(obj) {
    return obj === void 0;
  }

  // Is a given value a boolean?
  function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  }

  // Is a given value a DOM element?
  function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
  }

  // Internal function for creating a `toString`-based type tester.
  function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function(obj) {
      return toString.call(obj) === tag;
    };
  }

  var isString = tagTester('String');

  var isNumber = tagTester('Number');

  var isDate = tagTester('Date');

  var isRegExp = tagTester('RegExp');

  var isError = tagTester('Error');

  var isSymbol = tagTester('Symbol');

  var isArrayBuffer = tagTester('ArrayBuffer');

  var isFunction = tagTester('Function');

  // Optimize `isFunction` if appropriate. Work around some `typeof` bugs in old
  // v8, IE 11 (#1621), Safari 8 (#1929), and PhantomJS (#2236).
  var nodelist = root.document && root.document.childNodes;
  if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  var isFunction$1 = isFunction;

  var hasObjectTag = tagTester('Object');

  // In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
  // In IE 11, the most common among them, this problem also applies to
  // `Map`, `WeakMap` and `Set`.
  var hasStringTagBug = (
        supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
      ),
      isIE11 = (typeof Map !== 'undefined' && hasObjectTag(new Map));

  var isDataView = tagTester('DataView');

  // In IE 10 - Edge 13, we need a different heuristic
  // to determine whether an object is a `DataView`.
  function ie10IsDataView(obj) {
    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
  }

  var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

  // Is a given value an array?
  // Delegates to ECMA5's native `Array.isArray`.
  var isArray = nativeIsArray || tagTester('Array');

  // Internal function to check whether `key` is an own property name of `obj`.
  function has$1(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  }

  var isArguments = tagTester('Arguments');

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  (function() {
    if (!isArguments(arguments)) {
      isArguments = function(obj) {
        return has$1(obj, 'callee');
      };
    }
  }());

  var isArguments$1 = isArguments;

  // Is a given object a finite number?
  function isFinite$1(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
  }

  // Is the given value `NaN`?
  function isNaN$1(obj) {
    return isNumber(obj) && _isNaN(obj);
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function constant(value) {
    return function() {
      return value;
    };
  }

  // Common internal logic for `isArrayLike` and `isBufferLike`.
  function createSizePropertyCheck(getSizeProperty) {
    return function(collection) {
      var sizeProperty = getSizeProperty(collection);
      return typeof sizeProperty == 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
  }

  // Internal helper to generate a function to obtain property `key` from `obj`.
  function shallowProperty(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  }

  // Internal helper to obtain the `byteLength` property of an object.
  var getByteLength = shallowProperty('byteLength');

  // Internal helper to determine whether we should spend extensive checks against
  // `ArrayBuffer` et al.
  var isBufferLike = createSizePropertyCheck(getByteLength);

  // Is a given value a typed array?
  var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
  function isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof, so use it when available.
    // Otherwise, fall back on the above regular expression.
    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
                  isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
  }

  var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

  // Internal helper to obtain the `length` property of an object.
  var getLength = shallowProperty('length');

  // Internal helper to create a simple lookup structure.
  // `collectNonEnumProps` used to depend on `_.contains`, but this led to
  // circular imports. `emulatedSet` is a one-off solution that only works for
  // arrays of strings.
  function emulatedSet(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) hash[keys[i]] = true;
    return {
      contains: function(key) { return hash[key] === true; },
      push: function(key) {
        hash[key] = true;
        return keys.push(key);
      }
    };
  }

  // Internal helper. Checks `keys` for the presence of keys in IE < 9 that won't
  // be iterated by `for key in ...` and thus missed. Extends `keys` in place if
  // needed.
  function collectNonEnumProps(obj, keys) {
    keys = emulatedSet(keys);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (isFunction$1(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has$1(obj, prop) && !keys.contains(prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !keys.contains(prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`.
  function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (has$1(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  function isEmpty(obj) {
    if (obj == null) return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no
    // `.length`.
    var length = getLength(obj);
    if (typeof length == 'number' && (
      isArray(obj) || isString(obj) || isArguments$1(obj)
    )) return length === 0;
    return getLength(keys(obj)) === 0;
  }

  // Returns whether an object has a given set of `key:value` pairs.
  function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = _keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  }

  // If Underscore is called as a function, it returns a wrapped object that can
  // be used OO-style. This wrapper holds altered versions of all functions added
  // through `_.mixin`. Wrapped objects may be chained.
  function _$1(obj) {
    if (obj instanceof _$1) return obj;
    if (!(this instanceof _$1)) return new _$1(obj);
    this._wrapped = obj;
  }

  _$1.VERSION = VERSION;

  // Extracts the result from a wrapped and chained object.
  _$1.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxies for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

  _$1.prototype.toString = function() {
    return String(this._wrapped);
  };

  // Internal function to wrap or shallow-copy an ArrayBuffer,
  // typed array or DataView to a new view, reusing the buffer.
  function toBufferView(bufferSource) {
    return new Uint8Array(
      bufferSource.buffer || bufferSource,
      bufferSource.byteOffset || 0,
      getByteLength(bufferSource)
    );
  }

  // We use this string twice, so give it a name for minification.
  var tagDataView = '[object DataView]';

  // Internal recursive comparison function for `_.isEqual`.
  function eq(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself (strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent, but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
  }

  // Internal recursive comparison function for `_.isEqual`.
  function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _$1) a = a._wrapped;
    if (b instanceof _$1) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    // Work around a bug in IE 10 - Edge 13.
    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
      if (!isDataView$1(b)) return false;
      className = tagDataView;
    }
    switch (className) {
      // These types are compared by value.
      case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN.
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
      case '[object Symbol]':
        return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
      case '[object ArrayBuffer]':
      case tagDataView:
        // Coerce to typed array so we can fall through.
        return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }

    var areArrays = className === '[object Array]';
    if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
                               isFunction$1(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var _keys = keys(a), key;
      length = _keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = _keys[length];
        if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  }

  // Perform a deep comparison to check if two objects are equal.
  function isEqual(a, b) {
    return eq(a, b);
  }

  // Retrieve all the enumerable property names of an object.
  function allKeys(obj) {
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  }

  // Since the regular `Object.prototype.toString` type tests don't work for
  // some types in IE 11, we use a fingerprinting heuristic instead, based
  // on the methods. It's not great, but it's the best we got.
  // The fingerprint method lists are defined below.
  function ie11fingerprint(methods) {
    var length = getLength(methods);
    return function(obj) {
      if (obj == null) return false;
      // `Map`, `WeakMap` and `Set` have no enumerable keys.
      var keys = allKeys(obj);
      if (getLength(keys)) return false;
      for (var i = 0; i < length; i++) {
        if (!isFunction$1(obj[methods[i]])) return false;
      }
      // If we are testing against `WeakMap`, we need to ensure that
      // `obj` doesn't have a `forEach` method in order to distinguish
      // it from a regular `Map`.
      return methods !== weakMapMethods || !isFunction$1(obj[forEachName]);
    };
  }

  // In the interest of compact minification, we write
  // each string in the fingerprints only once.
  var forEachName = 'forEach',
      hasName = 'has',
      commonInit = ['clear', 'delete'],
      mapTail = ['get', hasName, 'set'];

  // `Map`, `WeakMap` and `Set` each have slightly different
  // combinations of the above sublists.
  var mapMethods = commonInit.concat(forEachName, mapTail),
      weakMapMethods = commonInit.concat(mapTail),
      setMethods = ['add'].concat(commonInit, forEachName, hasName);

  var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

  var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

  var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

  var isWeakSet = tagTester('WeakSet');

  // Retrieve the values of an object's properties.
  function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[_keys[i]];
    }
    return values;
  }

  // Convert an object into a list of `[key, value]` pairs.
  // The opposite of `_.object` with one argument.
  function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
  }

  // Invert the keys and values of an object. The values must be serializable.
  function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
      result[obj[_keys[i]]] = _keys[i];
    }
    return result;
  }

  // Return a sorted list of the function names available on the object.
  function functions(obj) {
    var names = [];
    for (var key in obj) {
      if (isFunction$1(obj[key])) names.push(key);
    }
    return names.sort();
  }

  // An internal function for creating assigner functions.
  function createAssigner(keysFunc, defaults) {
    return function(obj) {
      var length = arguments.length;
      if (defaults) obj = Object(obj);
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!defaults || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  }

  // Extend a given object with all the properties in passed-in object(s).
  var extend = createAssigner(allKeys);

  // Assigns a given object with all the own properties in the passed-in
  // object(s).
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  var extendOwn = createAssigner(keys);

  // Fill in a given object with default properties.
  var defaults = createAssigner(allKeys, true);

  // Create a naked function reference for surrogate-prototype-swapping.
  function ctor() {
    return function(){};
  }

  // An internal function for creating a new object that inherits from another.
  function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  }

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
  }

  // Create a (shallow-cloned) duplicate of an object.
  function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
  }

  // Invokes `interceptor` with the `obj` and then returns `obj`.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
  }

  // Normalize a (deep) property `path` to array.
  // Like `_.iteratee`, this function can be customized.
  function toPath$1(path) {
    return isArray(path) ? path : [path];
  }
  _$1.toPath = toPath$1;

  // Internal wrapper for `_.toPath` to enable minification.
  // Similar to `cb` for `_.iteratee`.
  function toPath(path) {
    return _$1.toPath(path);
  }

  // Internal function to obtain a nested property in `obj` along `path`.
  function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
      if (obj == null) return void 0;
      obj = obj[path[i]];
    }
    return length ? obj : void 0;
  }

  // Get the value of the (deep) property on `path` from `object`.
  // If any property in `path` does not exist or if the value is
  // `undefined`, return `defaultValue` instead.
  // The `path` is normalized through `_.toPath`.
  function get(object, path, defaultValue) {
    var value = deepGet(object, toPath(path));
    return isUndefined(value) ? defaultValue : value;
  }

  // Shortcut function for checking if an object has a given property directly on
  // itself (in other words, not on a prototype). Unlike the internal `has`
  // function, this public version can also traverse nested properties.
  function has(obj, path) {
    path = toPath(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
      var key = path[i];
      if (!has$1(obj, key)) return false;
      obj = obj[key];
    }
    return !!length;
  }

  // Keep the identity function around for default iteratees.
  function identity(value) {
    return value;
  }

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  function matcher(attrs) {
    attrs = extendOwn({}, attrs);
    return function(obj) {
      return isMatch(obj, attrs);
    };
  }

  // Creates a function that, when passed an object, will traverse that object’s
  // properties down the given `path`, specified as an array of keys or indices.
  function property(path) {
    path = toPath(path);
    return function(obj) {
      return deepGet(obj, path);
    };
  }

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  function optimizeCb(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      // The 2-argument case is omitted because we’re not using it.
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  }

  // An internal function to generate callbacks that can be applied to each
  // element in a collection, returning the desired result — either `_.identity`,
  // an arbitrary callback, a property matcher, or a property accessor.
  function baseIteratee(value, context, argCount) {
    if (value == null) return identity;
    if (isFunction$1(value)) return optimizeCb(value, context, argCount);
    if (isObject(value) && !isArray(value)) return matcher(value);
    return property(value);
  }

  // External wrapper for our callback generator. Users may customize
  // `_.iteratee` if they want additional predicate/iteratee shorthand styles.
  // This abstraction hides the internal-only `argCount` argument.
  function iteratee(value, context) {
    return baseIteratee(value, context, Infinity);
  }
  _$1.iteratee = iteratee;

  // The function we call internally to generate a callback. It invokes
  // `_.iteratee` if overridden, otherwise `baseIteratee`.
  function cb(value, context, argCount) {
    if (_$1.iteratee !== iteratee) return _$1.iteratee(value, context);
    return baseIteratee(value, context, argCount);
  }

  // Returns the results of applying the `iteratee` to each element of `obj`.
  // In contrast to `_.map` it returns an object.
  function mapObject(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = keys(obj),
        length = _keys.length,
        results = {};
    for (var index = 0; index < length; index++) {
      var currentKey = _keys[index];
      results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Predicate-generating function. Often useful outside of Underscore.
  function noop(){}

  // Generates a function for a given object that returns a given property.
  function propertyOf(obj) {
    if (obj == null) return noop;
    return function(path) {
      return get(obj, path);
    };
  }

  // Run a function **n** times.
  function times(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  }

  // Return a random integer between `min` and `max` (inclusive).
  function random(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  }

  // A (possibly faster) way to get the current timestamp as an integer.
  var now = Date.now || function() {
    return new Date().getTime();
  };

  // Internal helper to generate functions for escaping and unescaping strings
  // to/from HTML interpolation.
  function createEscaper(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped.
    var source = '(?:' + keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  }

  // Internal list of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };

  // Function for escaping strings to HTML interpolation.
  var _escape = createEscaper(escapeMap);

  // Internal list of HTML entities for unescaping.
  var unescapeMap = invert(escapeMap);

  // Function for unescaping strings from HTML interpolation.
  var _unescape = createEscaper(unescapeMap);

  // By default, Underscore uses ERB-style template delimiters. Change the
  // following template settings to use alternative delimiters.
  var templateSettings = _$1.templateSettings = {
    evaluate: /<%([\s\S]+?)%>/g,
    interpolate: /<%=([\s\S]+?)%>/g,
    escape: /<%-([\s\S]+?)%>/g
  };

  // When customizing `_.templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'": "'",
    '\\': '\\',
    '\r': 'r',
    '\n': 'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escapeRegExp = /\\|'|\r|\n|\u2028|\u2029/g;

  function escapeChar(match) {
    return '\\' + escapes[match];
  }

  // In order to prevent third-party code injection through
  // `_.templateSettings.variable`, we test it against the following regular
  // expression. It is intentionally a bit more liberal than just matching valid
  // identifiers, but still prevents possible loopholes through defaults or
  // destructuring assignment.
  var bareIdentifier = /^\s*(\w|\$)+\s*$/;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  function template(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = defaults({}, settings, _$1.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escapeRegExp, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offset.
      return match;
    });
    source += "';\n";

    var argument = settings.variable;
    if (argument) {
      // Insure against third-party code injection. (CVE-2021-23358)
      if (!bareIdentifier.test(argument)) throw new Error(
        'variable is not a bare identifier: ' + argument
      );
    } else {
      // If a variable is not specified, place data values in local scope.
      source = 'with(obj||{}){\n' + source + '}\n';
      argument = 'obj';
    }

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    var render;
    try {
      render = new Function(argument, '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _$1);
    };

    // Provide the compiled source as a convenience for precompilation.
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  }

  // Traverses the children of `obj` along `path`. If a child is a function, it
  // is invoked with its parent as context. Returns the value of the final
  // child, or `fallback` if any child is undefined.
  function result(obj, path, fallback) {
    path = toPath(path);
    var length = path.length;
    if (!length) {
      return isFunction$1(fallback) ? fallback.call(obj) : fallback;
    }
    for (var i = 0; i < length; i++) {
      var prop = obj == null ? void 0 : obj[path[i]];
      if (prop === void 0) {
        prop = fallback;
        i = length; // Ensure we don't continue iterating.
      }
      obj = isFunction$1(prop) ? prop.call(obj) : prop;
    }
    return obj;
  }

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  function uniqueId(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  }

  // Start chaining a wrapped Underscore object.
  function chain(obj) {
    var instance = _$1(obj);
    instance._chain = true;
    return instance;
  }

  // Internal function to execute `sourceFunc` bound to `context` with optional
  // `args`. Determines whether to execute a function as a constructor or as a
  // normal function.
  function executeBound(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (isObject(result)) return result;
    return self;
  }

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. `_` acts
  // as a placeholder by default, allowing any combination of arguments to be
  // pre-filled. Set `_.partial.placeholder` for a custom placeholder argument.
  var partial = restArguments(function(func, boundArgs) {
    var placeholder = partial.placeholder;
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === placeholder ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  });

  partial.placeholder = _$1;

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally).
  var bind = restArguments(function(func, context, args) {
    if (!isFunction$1(func)) throw new TypeError('Bind must be called on a function');
    var bound = restArguments(function(callArgs) {
      return executeBound(func, bound, context, this, args.concat(callArgs));
    });
    return bound;
  });

  // Internal helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object.
  // Related: https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var isArrayLike = createSizePropertyCheck(getLength);

  // Internal implementation of a recursive `flatten` function.
  function flatten$1(input, depth, strict, output) {
    output = output || [];
    if (!depth && depth !== 0) {
      depth = Infinity;
    } else if (depth <= 0) {
      return output.concat(input);
    }
    var idx = output.length;
    for (var i = 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (isArray(value) || isArguments$1(value))) {
        // Flatten current level of array or arguments object.
        if (depth > 1) {
          flatten$1(value, depth - 1, strict, output);
          idx = output.length;
        } else {
          var j = 0, len = value.length;
          while (j < len) output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  }

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  var bindAll = restArguments(function(obj, keys) {
    keys = flatten$1(keys, false, false);
    var index = keys.length;
    if (index < 1) throw new Error('bindAll must be passed function names');
    while (index--) {
      var key = keys[index];
      obj[key] = bind(obj[key], obj);
    }
    return obj;
  });

  // Memoize an expensive function by storing its results.
  function memoize(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!has$1(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  }

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  var delay = restArguments(function(func, wait, args) {
    return setTimeout(function() {
      return func.apply(null, args);
    }, wait);
  });

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  var defer = partial(delay, _$1, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  function throttle(func, wait, options) {
    var timeout, context, args, result;
    var previous = 0;
    if (!options) options = {};

    var later = function() {
      previous = options.leading === false ? 0 : now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    var throttled = function() {
      var _now = now();
      if (!previous && options.leading === false) previous = _now;
      var remaining = wait - (_now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = _now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };

    throttled.cancel = function() {
      clearTimeout(timeout);
      previous = 0;
      timeout = context = args = null;
    };

    return throttled;
  }

  // When a sequence of calls of the returned function ends, the argument
  // function is triggered. The end of a sequence is defined by the `wait`
  // parameter. If `immediate` is passed, the argument function will be
  // triggered at the beginning of the sequence instead of at the end.
  function debounce(func, wait, immediate) {
    var timeout, previous, args, result, context;

    var later = function() {
      var passed = now() - previous;
      if (wait > passed) {
        timeout = setTimeout(later, wait - passed);
      } else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
        // This check is needed because `func` can recursively invoke `debounced`.
        if (!timeout) args = context = null;
      }
    };

    var debounced = restArguments(function(_args) {
      context = this;
      args = _args;
      previous = now();
      if (!timeout) {
        timeout = setTimeout(later, wait);
        if (immediate) result = func.apply(context, args);
      }
      return result;
    });

    debounced.cancel = function() {
      clearTimeout(timeout);
      timeout = args = context = null;
    };

    return debounced;
  }

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  function wrap(func, wrapper) {
    return partial(wrapper, func);
  }

  // Returns a negated version of the passed-in predicate.
  function negate(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  }

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  function compose() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  }

  // Returns a function that will only be executed on and after the Nth call.
  function after(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  }

  // Returns a function that will only be executed up to (but not including) the
  // Nth call.
  function before(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  }

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  var once = partial(before, 2);

  // Returns the first key on an object that passes a truth test.
  function findKey(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = keys(obj), key;
    for (var i = 0, length = _keys.length; i < length; i++) {
      key = _keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  }

  // Internal function to generate `_.findIndex` and `_.findLastIndex`.
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a truth test.
  var findIndex = createPredicateIndexFinder(1);

  // Returns the last index on an array-like that passes a truth test.
  var findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  function sortedIndex(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  }

  // Internal function to generate the `_.indexOf` and `_.lastIndexOf` functions.
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
          i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
          length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), isNaN$1);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  var indexOf = createIndexFinder(1, findIndex, sortedIndex);

  // Return the position of the last occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  var lastIndexOf = createIndexFinder(-1, findLastIndex);

  // Return the first value which passes a truth test.
  function find(obj, predicate, context) {
    var keyFinder = isArrayLike(obj) ? findIndex : findKey;
    var key = keyFinder(obj, predicate, context);
    if (key !== void 0 && key !== -1) return obj[key];
  }

  // Convenience version of a common use case of `_.find`: getting the first
  // object containing specific `key:value` pairs.
  function findWhere(obj, attrs) {
    return find(obj, matcher(attrs));
  }

  // The cornerstone for collection functions, an `each`
  // implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  function each(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var _keys = keys(obj);
      for (i = 0, length = _keys.length; i < length; i++) {
        iteratee(obj[_keys[i]], _keys[i], obj);
      }
    }
    return obj;
  }

  // Return the results of applying the iteratee to each element.
  function map(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  }

  // Internal helper to create a reducing function, iterating left or right.
  function createReduce(dir) {
    // Wrap code that reassigns argument variables in a separate function than
    // the one that accesses `arguments.length` to avoid a perf hit. (#1991)
    var reducer = function(obj, iteratee, memo, initial) {
      var _keys = !isArrayLike(obj) && keys(obj),
          length = (_keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      if (!initial) {
        memo = obj[_keys ? _keys[index] : index];
        index += dir;
      }
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = _keys ? _keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    };

    return function(obj, iteratee, memo, context) {
      var initial = arguments.length >= 3;
      return reducer(obj, optimizeCb(iteratee, context, 4), memo, initial);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  var reduce = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  var reduceRight = createReduce(-1);

  // Return all the elements that pass a truth test.
  function filter(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  }

  // Return all the elements for which a truth test fails.
  function reject(obj, predicate, context) {
    return filter(obj, negate(cb(predicate)), context);
  }

  // Determine whether all of the elements pass a truth test.
  function every(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  }

  // Determine if at least one element in the object passes a truth test.
  function some(obj, predicate, context) {
    predicate = cb(predicate, context);
    var _keys = !isArrayLike(obj) && keys(obj),
        length = (_keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = _keys ? _keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  }

  // Determine if the array or object contains a given item (using `===`).
  function contains(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return indexOf(obj, item, fromIndex) >= 0;
  }

  // Invoke a method (with arguments) on every item in a collection.
  var invoke = restArguments(function(obj, path, args) {
    var contextPath, func;
    if (isFunction$1(path)) {
      func = path;
    } else {
      path = toPath(path);
      contextPath = path.slice(0, -1);
      path = path[path.length - 1];
    }
    return map(obj, function(context) {
      var method = func;
      if (!method) {
        if (contextPath && contextPath.length) {
          context = deepGet(context, contextPath);
        }
        if (context == null) return void 0;
        method = context[path];
      }
      return method == null ? method : method.apply(context, args);
    });
  });

  // Convenience version of a common use case of `_.map`: fetching a property.
  function pluck(obj, key) {
    return map(obj, property(key));
  }

  // Convenience version of a common use case of `_.filter`: selecting only
  // objects containing specific `key:value` pairs.
  function where(obj, attrs) {
    return filter(obj, matcher(attrs));
  }

  // Return the maximum element (or element-based computation).
  function max(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed > lastComputed || (computed === -Infinity && result === -Infinity)) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Return the minimum element (or element-based computation).
  function min(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null || (typeof iteratee == 'number' && typeof obj[0] != 'object' && obj != null)) {
      obj = isArrayLike(obj) ? obj : values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value != null && value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      each(obj, function(v, index, list) {
        computed = iteratee(v, index, list);
        if (computed < lastComputed || (computed === Infinity && result === Infinity)) {
          result = v;
          lastComputed = computed;
        }
      });
    }
    return result;
  }

  // Safely create a real, live array from anything iterable.
  var reStrSymbol = /[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;
  function toArray(obj) {
    if (!obj) return [];
    if (isArray(obj)) return slice.call(obj);
    if (isString(obj)) {
      // Keep surrogate pair characters together.
      return obj.match(reStrSymbol);
    }
    if (isArrayLike(obj)) return map(obj, identity);
    return values(obj);
  }

  // Sample **n** random values from a collection using the modern version of the
  // [Fisher-Yates shuffle](https://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `_.map`.
  function sample(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = values(obj);
      return obj[random(obj.length - 1)];
    }
    var sample = toArray(obj);
    var length = getLength(sample);
    n = Math.max(Math.min(n, length), 0);
    var last = length - 1;
    for (var index = 0; index < n; index++) {
      var rand = random(index, last);
      var temp = sample[index];
      sample[index] = sample[rand];
      sample[rand] = temp;
    }
    return sample.slice(0, n);
  }

  // Shuffle a collection.
  function shuffle(obj) {
    return sample(obj, Infinity);
  }

  // Sort the object's values by a criterion produced by an iteratee.
  function sortBy(obj, iteratee, context) {
    var index = 0;
    iteratee = cb(iteratee, context);
    return pluck(map(obj, function(value, key, list) {
      return {
        value: value,
        index: index++,
        criteria: iteratee(value, key, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  }

  // An internal function used for aggregate "group by" operations.
  function group(behavior, partition) {
    return function(obj, iteratee, context) {
      var result = partition ? [[], []] : {};
      iteratee = cb(iteratee, context);
      each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  }

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  var groupBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `_.groupBy`, but for
  // when you know that your index values will be unique.
  var indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  var countBy = group(function(result, value, key) {
    if (has$1(result, key)) result[key]++; else result[key] = 1;
  });

  // Split a collection into two arrays: one whose elements all pass the given
  // truth test, and one whose elements all do not pass the truth test.
  var partition = group(function(result, value, pass) {
    result[pass ? 0 : 1].push(value);
  }, true);

  // Return the number of elements in a collection.
  function size(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : keys(obj).length;
  }

  // Internal `_.pick` helper function to determine whether `key` is an enumerable
  // property name of `obj`.
  function keyInObj(value, key, obj) {
    return key in obj;
  }

  // Return a copy of the object only containing the allowed properties.
  var pick = restArguments(function(obj, keys) {
    var result = {}, iteratee = keys[0];
    if (obj == null) return result;
    if (isFunction$1(iteratee)) {
      if (keys.length > 1) iteratee = optimizeCb(iteratee, keys[1]);
      keys = allKeys(obj);
    } else {
      iteratee = keyInObj;
      keys = flatten$1(keys, false, false);
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  });

  // Return a copy of the object without the disallowed properties.
  var omit = restArguments(function(obj, keys) {
    var iteratee = keys[0], context;
    if (isFunction$1(iteratee)) {
      iteratee = negate(iteratee);
      if (keys.length > 1) context = keys[1];
    } else {
      keys = map(flatten$1(keys, false, false), String);
      iteratee = function(value, key) {
        return !contains(keys, key);
      };
    }
    return pick(obj, iteratee, context);
  });

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  function initial(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  }

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. The **guard** check allows it to work with `_.map`.
  function first(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[0];
    return initial(array, array.length - n);
  }

  // Returns everything but the first entry of the `array`. Especially useful on
  // the `arguments` object. Passing an **n** will return the rest N values in the
  // `array`.
  function rest(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  }

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  function last(array, n, guard) {
    if (array == null || array.length < 1) return n == null || guard ? void 0 : [];
    if (n == null || guard) return array[array.length - 1];
    return rest(array, Math.max(0, array.length - n));
  }

  // Trim out all falsy values from an array.
  function compact(array) {
    return filter(array, Boolean);
  }

  // Flatten out an array, either recursively (by default), or up to `depth`.
  // Passing `true` or `false` as `depth` means `1` or `Infinity`, respectively.
  function flatten(array, depth) {
    return flatten$1(array, depth, false);
  }

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  var difference = restArguments(function(array, rest) {
    rest = flatten$1(rest, true, true);
    return filter(array, function(value){
      return !contains(rest, value);
    });
  });

  // Return a version of the array that does not contain the specified value(s).
  var without = restArguments(function(array, otherArrays) {
    return difference(array, otherArrays);
  });

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // The faster algorithm will not work with an iteratee if the iteratee
  // is not a one-to-one function, so providing an iteratee will disable
  // the faster algorithm.
  function uniq(array, isSorted, iteratee, context) {
    if (!isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted && !iteratee) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  }

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  var union = restArguments(function(arrays) {
    return uniq(flatten$1(arrays, true, true));
  });

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  function intersection(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (contains(result, item)) continue;
      var j;
      for (j = 1; j < argsLength; j++) {
        if (!contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  }

  // Complement of zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices.
  function unzip(array) {
    var length = (array && max(array, getLength).length) || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = pluck(array, index);
    }
    return result;
  }

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  var zip = restArguments(unzip);

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values. Passing by pairs is the reverse of `_.pairs`.
  function object(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  }

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](https://docs.python.org/library/functions.html#range).
  function range(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    if (!step) {
      step = stop < start ? -1 : 1;
    }

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  }

  // Chunk a single array into multiple arrays, each containing `count` or fewer
  // items.
  function chunk(array, count) {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(slice.call(array, i, i += count));
    }
    return result;
  }

  // Helper function to continue chaining intermediate results.
  function chainResult(instance, obj) {
    return instance._chain ? _$1(obj).chain() : obj;
  }

  // Add your own custom functions to the Underscore object.
  function mixin(obj) {
    each(functions(obj), function(name) {
      var func = _$1[name] = obj[name];
      _$1.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return chainResult(this, func.apply(_$1, args));
      };
    });
    return _$1;
  }

  // Add all mutator `Array` functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) {
        method.apply(obj, arguments);
        if ((name === 'shift' || name === 'splice') && obj.length === 0) {
          delete obj[0];
        }
      }
      return chainResult(this, obj);
    };
  });

  // Add all accessor `Array` functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _$1.prototype[name] = function() {
      var obj = this._wrapped;
      if (obj != null) obj = method.apply(obj, arguments);
      return chainResult(this, obj);
    };
  });

  // Named Exports

  var allExports = {
    __proto__: null,
    VERSION: VERSION,
    restArguments: restArguments,
    isObject: isObject,
    isNull: isNull,
    isUndefined: isUndefined,
    isBoolean: isBoolean,
    isElement: isElement,
    isString: isString,
    isNumber: isNumber,
    isDate: isDate,
    isRegExp: isRegExp,
    isError: isError,
    isSymbol: isSymbol,
    isArrayBuffer: isArrayBuffer,
    isDataView: isDataView$1,
    isArray: isArray,
    isFunction: isFunction$1,
    isArguments: isArguments$1,
    isFinite: isFinite$1,
    isNaN: isNaN$1,
    isTypedArray: isTypedArray$1,
    isEmpty: isEmpty,
    isMatch: isMatch,
    isEqual: isEqual,
    isMap: isMap,
    isWeakMap: isWeakMap,
    isSet: isSet,
    isWeakSet: isWeakSet,
    keys: keys,
    allKeys: allKeys,
    values: values,
    pairs: pairs,
    invert: invert,
    functions: functions,
    methods: functions,
    extend: extend,
    extendOwn: extendOwn,
    assign: extendOwn,
    defaults: defaults,
    create: create,
    clone: clone,
    tap: tap,
    get: get,
    has: has,
    mapObject: mapObject,
    identity: identity,
    constant: constant,
    noop: noop,
    toPath: toPath$1,
    property: property,
    propertyOf: propertyOf,
    matcher: matcher,
    matches: matcher,
    times: times,
    random: random,
    now: now,
    escape: _escape,
    unescape: _unescape,
    templateSettings: templateSettings,
    template: template,
    result: result,
    uniqueId: uniqueId,
    chain: chain,
    iteratee: iteratee,
    partial: partial,
    bind: bind,
    bindAll: bindAll,
    memoize: memoize,
    delay: delay,
    defer: defer,
    throttle: throttle,
    debounce: debounce,
    wrap: wrap,
    negate: negate,
    compose: compose,
    after: after,
    before: before,
    once: once,
    findKey: findKey,
    findIndex: findIndex,
    findLastIndex: findLastIndex,
    sortedIndex: sortedIndex,
    indexOf: indexOf,
    lastIndexOf: lastIndexOf,
    find: find,
    detect: find,
    findWhere: findWhere,
    each: each,
    forEach: each,
    map: map,
    collect: map,
    reduce: reduce,
    foldl: reduce,
    inject: reduce,
    reduceRight: reduceRight,
    foldr: reduceRight,
    filter: filter,
    select: filter,
    reject: reject,
    every: every,
    all: every,
    some: some,
    any: some,
    contains: contains,
    includes: contains,
    include: contains,
    invoke: invoke,
    pluck: pluck,
    where: where,
    max: max,
    min: min,
    shuffle: shuffle,
    sample: sample,
    sortBy: sortBy,
    groupBy: groupBy,
    indexBy: indexBy,
    countBy: countBy,
    partition: partition,
    toArray: toArray,
    size: size,
    pick: pick,
    omit: omit,
    first: first,
    head: first,
    take: first,
    initial: initial,
    last: last,
    rest: rest,
    tail: rest,
    drop: rest,
    compact: compact,
    flatten: flatten,
    without: without,
    uniq: uniq,
    unique: uniq,
    union: union,
    intersection: intersection,
    difference: difference,
    unzip: unzip,
    transpose: unzip,
    zip: zip,
    object: object,
    range: range,
    chunk: chunk,
    mixin: mixin,
    'default': _$1
  };

  // Default Export

  // Add all of the Underscore functions to the wrapper object.
  var _ = mixin(allExports);
  // Legacy Node.js API.
  _._ = _;

  return _;

})));


}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],3:[function(require,module,exports){
module.exports = {
  load: function(url, callback){
    var request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = "text"

    var loader = this

    request.onload = function(){
      var pathString = request.response.replace(/\\/g,"/")
      callback(pathString)
    }

    request.send()
  }
}

},{}],4:[function(require,module,exports){
var _ = require("underscore")
  , EnvelopeGenerator = require("./envelope_generator")
  , LFO = require("./lfo")
  , Signal = require("./signal")
  , AudioMath = require("./audio_math")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var Amplifier = function(opts){
  this.context = opts.context
  this.input = opts.context.createGain()
  this.output = opts.context.createGain()
  this.input.connect(this.output)

  var depth = AudioMath.dbToGain(opts.lfo_depth)
    , velScalar = opts.velocity / 127.0

  this.lfo = new LFO({
    context: opts.context,
    delay: opts.lfo_delay,
    fade: opts.lfo_fade,
    freq: opts.lfo_freq,
    hold: opts.lfo_hold,
    depth: depth,
    depthchanaft: opts.lfo_depthchanaft,
    depthpolyaft: opts.lfo_depthpolyaft,
    freqchanaft: opts.lfo_freqchanaft,
    freqpolyaft: opts.lfo_freqpolyaft
  })


  var volume = opts.volume || 0

  var db = -20 * Math.log(Math.pow(127, 2) / Math.pow(opts.velocity, 2))
    , noteGainAdj = (opts.pitch - opts.keycenter) * opts.keytrack

  db = volume + db + noteGainAdj

  var velGainAdj = (opts.veltrack / 100.0) * velScalar
    , gain = AudioMath.dbToGain(db)

  gain = gain + (gain * velGainAdj)

  this.gainSignal = new Signal({
    context: opts.context,
    value: gain
  })
  this.gainSignal.connect(this.input.gain)
  this.gainSignal.start()
  this.lfo.connect(this.input.gain)

  this.eg_release = opts.eg_release + opts.eg_vel2release * velScalar

  this.eg = new EnvelopeGenerator({
    context: opts.context,
    delay: opts.eg_delay + opts.eg_vel2delay * velScalar,
    start: opts.eg_start,
    attack: opts.eg_attack + opts.eg_vel2attack * velScalar,
    hold: opts.eg_hold + opts.eg_vel2hold * velScalar,
    decay: opts.eg_decay + opts.eg_vel2decay * velScalar,
    sustain: opts.eg_sustain + opts.eg_vel2sustain * velScalar,
    release: this.eg_release,
    depth: 100
  }, { pitch: opts.pitch, velocity: opts.velocity })

  this.eg.connect(this.output.gain)
}

Amplifier.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

Amplifier.prototype.disconnect = function(output){
  this.output.disconnect(output)
}

Amplifier.prototype.trigger = function(onended){
  this.eg.onended = onended

  this.lfo.start()
  this.eg.trigger()
}

Amplifier.prototype.triggerRelease = function(){
  this.eg.triggerRelease()
}

Amplifier.prototype.destroy = function(){
  this.lfo.destroy()
  this.eg.destroy()
  this.input.disconnect()
  this.output.disconnect()
  this.gainSignal.stop()
  this.gainSignal = null
  this.input = null
  this.output = null
  this.lfo = null
  this.eg = null
}

Amplifier.prototype.onended = function(){}

module.exports = Amplifier

},{"./audio_math":5,"./envelope_generator":8,"./lfo":11,"./signal":13,"underscore":2}],5:[function(require,module,exports){
module.exports = {
  dbToGain: function(db){
    return Math.pow(10, (db / 20.0 )) * 1.0
  },

  adjustFreqByCents: function(freq, cents){
    return freq * Math.pow((Math.pow(2, 1/1200)), cents)
  }
}

},{}],6:[function(require,module,exports){
function BufferLoader(urlList, callback, audioContext){
  this.audioContext = audioContext
  this.urlList = urlList
  this.onload = callback
  this.bufferList = new Array()
  this.loadCount = 0
}

BufferLoader.cache = {}

BufferLoader.prototype.loadBuffer = function(url, index, retries){
  var self = this
  var saneUrl = url.split("?date")[0]
  if (BufferLoader.cache[saneUrl]) {
    return this.onload([BufferLoader.cache[saneUrl]])
  }

  var request = new XMLHttpRequest()
  request.open("GET", url, true)
  request.responseType = "arraybuffer"

  var loader = this

  request.onload = function(){
    self.audioContext.decodeAudioData(
      request.response,
      function(buffer){
        if (!buffer) return;
        loader.bufferList[index] = buffer
        BufferLoader.cache[saneUrl] = buffer
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList)
      }, function(e){}
    )
  }

  request.send()
}

BufferLoader.prototype.load = function(){
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i, 0)
}

module.exports = BufferLoader

},{}],7:[function(require,module,exports){
var _ = require("underscore")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var BufferSource = function(opts){
  this.buffer = opts.buffer
  this.opts = opts
  this.bend = opts.bend

  this.updatePlaybackRate = function(){
    var opts = this.opts
    var cents = ((opts.pitch - opts.keycenter) * opts.keytrack) + opts.tune
    cents += (opts.veltrack * opts.velocity / 127)

    var bendRange = 8191
      , bendDepth = opts.bend_up

    if (this.bend < 0) {
      bendRange = -8192
      bendDepth = opts.bend_down
    }

    cents += bendDepth * this.bend / bendRange

    var noteFreq = pitchToFreq(opts.pitch + opts.transpose) * Math.pow((Math.pow(2, 1/1200)), cents)
      , playbackRate = noteFreq / pitchToFreq(opts.keycenter)

    this.playbackRate.value = playbackRate
  }

  this.pitchBend = function(bend){
    this.bend = bend
    this.updatePlaybackRate()
  }

  this.updatePlaybackRate()
}


var BufferSourceFactory = function(opts){
  var source = opts.context.createBufferSource()
  BufferSource.call(source, opts)

  return source
}

module.exports = BufferSourceFactory

},{"underscore":2}],8:[function(require,module,exports){
var _ = require("underscore")

var defaults = {
  delay: 0,
  start: 0,
  attack: 0,
  hold: 0,
  decay: 0,
  release: 0,
  sustain: 100,
  depth: 100
}

var EnvelopeGenerator = function(opts){
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)
}

EnvelopeGenerator.prototype.onended = function(){}

EnvelopeGenerator.prototype.trigger = function(){
  var now = this.context.currentTime
  var attackTime = now + this.attack
    , holdTime = attackTime + this.hold
    , decayTime = holdTime + this.decay
    , maxValue = this.depth / 100
    , sustainLevel = this.sustain / 100

  //console.log(attackTime, holdTime, decayTime, maxValue, sustainLevel)

  this.param.cancelScheduledValues(now)
  this.param.setValueAtTime(0, now)
  this.param.linearRampToValueAtTime(maxValue, attackTime)
  this.param.setValueAtTime(maxValue, holdTime)
  this.param.linearRampToValueAtTime(sustainLevel, decayTime)
}

EnvelopeGenerator.prototype.triggerRelease = function(){
  var now = this.context.currentTime
  //console.log("release start", this.param, this.param.value)
  this.param.cancelScheduledValues(0)
  this.param.setValueAtTime(this.param.value, now)
  this.param.linearRampToValueAtTime(0, now + this.release)
  setTimeout(function(){
    //console.log("release done", this.param.value)
    this.onended()
  }.bind(this), this.release * 1000 + 5)
}

EnvelopeGenerator.prototype.connect = function(param) {
  this.param = param
}

EnvelopeGenerator.prototype.destroy = function(destroy) {
  this.param = null
}

module.exports = EnvelopeGenerator

},{"underscore":2}],9:[function(require,module,exports){
var _ = require("underscore")
  , AudioMath = require("./audio_math")

var defaults = {
  freq1: 50,
  freq2: 500,
  freq3: 5000,
  vel2freq1: 0,
  vel2freq2: 0,
  vel2freq3: 0,
  bw1: 1,
  bw2: 1,
  bw3: 1,
  gain1: 0,
  gain2: 0,
  gain3: 0,
  vel2gain1: 0,
  vel2gain2: 0,
  vel2gain3: 0,
  velocity: 0
}

var bwToQ = function(bw){
  var x = Math.pow(2, bw)
  return Math.sqrt(x) / (x - 1)
}

var Equalizer = function(opts){
  _.defaults(opts, defaults)

  var velScalar = opts.velocity / 127

  this.input = this.eq1 = opts.context.createBiquadFilter()
  this.eq2 = opts.context.createBiquadFilter()
  this.output = this.eq3 = opts.context.createBiquadFilter()

  this.input.connect(this.eq2)
  this.eq2.connect(this.output)

  // All of these are "peaking"-type filters
  this.eq1.type = 5
  this.eq2.type = 5
  this.eq3.type = 5

  this.eq1.frequency.value = opts.freq1 + opts.vel2freq1 * velScalar
  this.eq2.frequency.value = opts.freq2 + opts.vel2freq2 * velScalar
  this.eq3.frequency.value = opts.freq3 + opts.vel2freq3 * velScalar

  this.eq1.Q.value = bwToQ(opts.bw1)
  this.eq2.Q.value = bwToQ(opts.bw2)
  this.eq3.Q.value = bwToQ(opts.bw3)

  this.eq1.gain.value = AudioMath.dbToGain(opts.gain1 + opts.vel2gain1 * velScalar)
  this.eq2.gain.value = AudioMath.dbToGain(opts.gain2 + opts.vel2gain2 * velScalar)
  this.eq3.gain.value = AudioMath.dbToGain(opts.gain3 + opts.vel2gain3 * velScalar)
}

Equalizer.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

Equalizer.prototype.disconnect = function(output){
  this.output.disconnect(output)
}

Equalizer.prototype.destroy = function(){
  this.disconnect()
}

module.exports = Equalizer

},{"./audio_math":5,"underscore":2}],10:[function(require,module,exports){
var _ = require("underscore")
  , EnvelopeGenerator = require("./envelope_generator")
  , LFO = require("./lfo")
  , Signal = require("./signal")
  , AudioMath = require("./audio_math")

var FILTER_TYPES = [
  "lowpass",
  "highpass",
  "bandpass",
  "lowshelf",
  "highshelf",
  "peaking",
  "notch",
  "allpass"
]

//TODO - update this for 1-pole filters when the web audio API
 //makes the filter coefficients available
var filter_map = {
  "lpf_1p": FILTER_TYPES.indexOf("lowpass"),
  "hpf_1p": FILTER_TYPES.indexOf("highpass"),
  "lpf_2p": FILTER_TYPES.indexOf("lowpass"),
  "hpf_2p": FILTER_TYPES.indexOf("highpass"),
  "bpf_2p": FILTER_TYPES.indexOf("bandpass"),
  "brf_2p": FILTER_TYPES.indexOf("notch")
}

var defaults = {
  type: "lpf_2p",
  cutoff: null,
  cutoff_chanaft: 0,
  cutoff_polyaft: 0,
  resonance: 0,
  keytrack: 0,
  keycenter: 60,
  veltrack: 0,
  random: 0
}

var Filter = function(opts, noteOn){
  opts.type = filter_map[opts.type]
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)

  var noteCutoffAdj = (noteOn.pitch - this.keycenter) * this.keytrack
    , velScalar = noteOn.velocity / 127.0
    , velCutoffAdj = this.veltrack * velScalar
    , cutoffAdj = noteCutoffAdj + velCutoffAdj
    , cutoffValue = this.cutoff + cutoffAdj

  var cutoffSignal = new Signal({
    context: opts.context,
    value: cutoffValue
  })
  cutoffSignal.connect(this.frequency)
  cutoffSignal.start()

  this.eg = new EnvelopeGenerator({
    context: opts.context,
    delay: opts.eg_delay + opts.eg_vel2delay * velScalar,
    start: opts.eg_start,
    attack: opts.eg_attack + opts.eg_vel2attack * velScalar,
    hold: opts.eg_hold + opts.eg_vel2hold * velScalar,
    decay: opts.eg_decay + opts.eg_vel2decay * velScalar,
    sustain: opts.eg_sustain + opts.eg_vel2sustain * velScalar,
    release: opts.eg_release + opts.eg_vel2release * velScalar,
    depth: 100
  }, { pitch: opts.pitch, velocity: opts.velocity })

  this.eg.connect(this.frequency)

  var freq2 = AudioMath.adjustFreqByCents(cutoffValue, this.lfo_depth)
    , depth = freq2 - cutoffValue

  this.lfo = new LFO({
    context: this.context,
    delay: this.lfo_delay,
    fade: this.lfo_fade,
    freq: this.lfo_freq,
    hold: this.lfo_hold,
    depth: depth,
    depthchanaft: this.lfo_depthchanaft,
    depthpolyaft: this.lfo_depthpolyaft,
    freqchanaft: this.lfo_freqchanaft,
    freqpolyaft: this.lfo_freqpolyaft
  })
  this.lfo.connect(this.frequency)

  this.Q.value = this.resonance

  this.trigger = function(){
    this.lfo.start()
    this.eg.trigger()
  }

  this.destroy = function(){
    this.lfo.destroy()
    this.eg.destroy()
  }

}


var FilterFactory = function(opts, noteOn){
  var filter = opts.context.createBiquadFilter()
  Filter.call(filter, opts, noteOn)

  return filter
}

module.exports = FilterFactory

},{"./audio_math":5,"./envelope_generator":8,"./lfo":11,"./signal":13,"underscore":2}],11:[function(require,module,exports){
var _ = require("underscore")
  , AudioMath = require("./audio_math")

var defaults = {
  delay: 0,
  fade: 0,
  freq: 0,
  hold: 0,
  depth: 0,
  depthchanaft: 0,
  depthpolyaft: 0,
  freqchanaft: 0,
  freqpolyaft: 0
}

var LFO = function(opts){
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)

  this.oscillator = this.context.createOscillator()
  this.oscillator.frequency.value = this.freq
  this.gainNode = this.context.createGain()
  this.oscillator.connect(this.gainNode)
}

LFO.prototype.start = function(){
  var now = this.context.currentTime
    , delayTime = now + this.delay
    , fadeTime = delayTime + this.fade

  this.gainNode.gain.setValueAtTime(0, now)
  this.gainNode.gain.setValueAtTime(0, delayTime)
  this.gainNode.gain.linearRampToValueAtTime(this.depth, fadeTime)
  this.oscillator.start(delayTime)
}

LFO.prototype.connect = function(param){
  this.gainNode.connect(param)
}

LFO.prototype.destroy = function(){
  this.oscillator.stop()
  this.oscillator.disconnect()
  this.gainNode.disconnect()
}

module.exports = LFO

},{"./audio_math":5,"underscore":2}],12:[function(require,module,exports){
var _ = require("underscore")
  , EnvelopeGenerator = require("./envelope_generator")
  , LFO = require("./lfo")
  , Signal = require("./signal")
  , AudioMath = require("./audio_math")


var defaults = {
  pan: 0,
  width: 0,
  position: 0
}

var Panner = function(opts){
  _.extend(this, opts)
  _.defaults(this, defaults)

  this.updatePosition = function(position){
    this.panningModel = "equalpower"
    this.distanceModel = "linear"

    var xDeg = position * 45.0
    var zDeg = xDeg + 90
    if (zDeg > 90) zDeg = 180 - zDeg

    var scale = 10
    var x = Math.sin(xDeg * (Math.PI / 180)) * scale

    this.setPosition(x, 0, -1)
  }

  this.updatePosition(this.position)
}


var PannerFactory = function(opts){
  var panner = opts.context.createPanner()
  Panner.call(panner, opts)

  return panner
}

module.exports = PannerFactory

},{"./audio_math":5,"./envelope_generator":8,"./lfo":11,"./signal":13,"underscore":2}],13:[function(require,module,exports){
var Signal = function(opts){
  this.context = opts.context
  if (typeof opts.value == "undefined") opts.value == 1

  var buffer = opts.context.createBuffer(1, 1024, opts.context.sampleRate)

  var data = buffer.getChannelData(0)

  for (var i=0; i < data.length; i++) {
    data[i] = opts.value
  }

  this.buffer = buffer
  this.loop = true
}

var SignalFactory = function(opts){
  var source = opts.context.createBufferSource()
  Signal.call(source, opts)

  return source
}

module.exports = SignalFactory

},{}],14:[function(require,module,exports){
var BufferSource = require("./buffer_source")
  , Filter = require("./filter")
  , Amplifier = require("./amplifier")
  , Panner = require("./panner")
  , Equalizer = require("./equalizer")

var voiceNumber = 0

var sampleRate = 48000

var model = function(buffer, region, noteOn, audioContext, bend){
  this.audioContext = audioContext
  this.voiceId = "voice" + voiceNumber
  voiceNumber += 1

  this.output = audioContext.createGain()

  this.setupSource(buffer, region, noteOn, bend)
  this.setupFilter(region, noteOn)
  this.setupAmp(region, noteOn)
  this.setupPanner(region, noteOn)
  this.setupEqualizer(region, noteOn)

  if (region.offset && region.end) {
    this.offset = region.offset / sampleRate
    this.end = region.end / sampleRate
    this.duration = this.end - this.offset
  }

  if (this.filter) {
    this.source.connect(this.filter)
    this.filter.connect(this.amp.input)
  } else {
    this.source.connect(this.amp.input)
  }

  this.amp.connect(this.panner)
  this.panner.connect(this.equalizer.input)
  this.equalizer.connect(this.output)
}

model.prototype.setupSource = function(buffer, region, noteOn, bend){
  this.source = new BufferSource({
    context: this.audioContext,
    buffer: buffer,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.pitch_keycenter,
    keytrack: region.pitch_keytrack,
    transpose: region.transpose,
    tune: region.tune,
    veltrack: region.pitch_veltrack,
    bend: bend,
    bend_up: region.bend_up,
    bend_down: region.bend_down,
    bend_step: region.bend_step
  })

  if (region.loop_start && region.loop_end && region.loop_mode == "loop_continuous") {
    this.source.loopStart = region.loop_start / sampleRate
    this.source.loopEnd = region.loop_end / sampleRate
    this.source.loop = true
  }
}

model.prototype.setupAmp = function(region, noteOn){
  this.amp = new Amplifier({
    context: this.audioContext,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.amp_keycenter,
    keytrack: region.amp_keytrack,
    veltrack: region.amp_veltrack,
    eg_delay: region.ampeg_delay,
    eg_start: region.ampeg_start,
    eg_attack: region.ampeg_attack,
    eg_hold: region.ampeg_hold,
    eg_decay: region.ampeg_decay,
    eg_sustain: region.ampeg_sustain,
    eg_release: region.ampeg_release,
    eg_vel2delay: region.ampeg_vel2delay,
    eg_vel2attack: region.ampeg_vel2attack,
    eg_vel2hold: region.ampeg_vel2hold,
    eg_vel2decay: region.ampeg_vel2decay,
    eg_vel2sustain: region.ampeg_vel2sustain,
    eg_vel2release: region.ampeg_vel2release,
    lfo_delay: region.amplfo_delay,
    lfo_fade: region.amplfo_fade,
    lfo_freq: region.amplfo_freq,
    lfo_depth: region.amplfo_depth,
    lfo_depthchanaft: region.amplfo_depthchanaft,
    lfo_depthpolyaft: region.amplfo_depthpolyaft,
    lfo_freqchanaft: region.amplfo_freqchanaft,
    lfo_freqpolyaft: region.amplfo_freqpolyaft
  })
}

model.prototype.setupFilter = function(region, noteOn){
  if (!region.cutoff) return;

  this.filter = new Filter({
    context: this.audioContext,
    type: region.fil_type,
    cutoff: region.cutoff,
    cutoff_chanaft: region.cutoff_chanaft,
    cutoff_polyaft: region.cutoff_polyaft,
    resonance: region.resonance,
    keytrack: region.fil_keytrack,
    keycenter: region.fil_keycenter,
    veltrack: region.fil_veltrack,
    random: region.fil_random,
    eg_delay: region.fileg_delay,
    eg_start: region.fileg_start,
    eg_attack: region.fileg_attack,
    eg_hold: region.fileg_hold,
    eg_decay: region.fileg_decay,
    eg_sustain: region.fileg_sustain,
    eg_release: region.fileg_release,
    eg_vel2delay: region.fileg_vel2delay,
    eg_vel2attack: region.fileg_vel2attack,
    eg_vel2hold: region.fileg_vel2hold,
    eg_vel2decay: region.fileg_vel2decay,
    eg_vel2sustain: region.fileg_vel2sustain,
    eg_vel2release: region.fileg_vel2release,
    lfo_delay: region.fillfo_delay,
    lfo_fade: region.fillfo_fade,
    lfo_freq: region.fillfo_freq,
    lfo_depth: region.fillfo_depth,
    lfo_depthchanaft: region.fillfo_depthchanaft,
    lfo_depthpolyaft: region.fillfo_depthpolyaft,
    lfo_freqchanaft: region.fillfo_freqchanaft,
    lfo_freqpolyaft: region.fillfo_freqpolyaft
  }, noteOn)
}

model.prototype.setupPanner = function(region, noteOn){
  this.panner = new Panner({
    context: this.audioContext,
    pan: region.pan,
    width: region.width,
    position: region.position
  })
}

model.prototype.setupEqualizer = function(region, noteOn){
  this.equalizer = new Equalizer({
    context: this.audioContext,
    velocity: noteOn.velocity,
    freq1: region.eq1_freq,
    freq2: region.eq2_freq,
    freq3: region.eq3_freq,
    vel2freq1: region.eq1_vel2freq,
    vel2freq2: region.eq2_vel2freq,
    vel2freq3: region.eq3_vel2freq,
    bw1: region.eq1_bw,
    bw2: region.eq2_bw,
    bw3: region.eq3_bw,
    gain1: region.eq1_gain,
    gain2: region.eq2_gain,
    gain3: region.eq3_gain,
    vel2gain1: region.eq1_vel2gain,
    vel2gain2: region.eq2_vel2gain,
    vel2gain3: region.eq3_vel2gain
  })
}

model.prototype.start = function(){
  var self = this
  var onended = function(){
    self.source.stop()
    self.destroy()
  }
  this.amp.trigger(onended)
  if (this.filter) this.filter.trigger()
  if (this.offset && this.duration) {
    this.source.start(0, this.offset, this.duration)
  } else {
    this.source.start(0)
  }
}

model.prototype.stop = function(){
  this.amp.triggerRelease()
}

model.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.equalizer.disconnect(output)
}

model.prototype.destroy = function(){
  if (this.filter) this.filter.destroy()
  this.amp.destroy()
  this.panner.disconnect()
  this.equalizer.destroy()

  this.source = null
  this.filter = null
  this.amp = null
  this.panner = null
  this.equalizer = null

  if (this.onended) this.onended()
}

model.prototype.pitchBend = function(bend){
  this.source.pitchBend(bend)
}

module.exports = model

},{"./amplifier":4,"./buffer_source":7,"./equalizer":9,"./filter":10,"./panner":12}],15:[function(require,module,exports){
var BufferLoader = require("./buffer_loader")
  , Voice = require("./voice")
  , _ = require("underscore")

var player = function(instrument, audioContext){
  this.context = audioContext
  var sampleUrls = _(instrument.samples()).uniq()
  this.loadBuffers(sampleUrls)
  this.voicesToRelease = {}
  this.activeVoices = window.voices = {}
  this.bend = 0
}

player.prototype.loadBuffers = function(urls){
  this.samples = urls
  urls = _(urls).map(function(url){ return encodeURIComponent(url) })
  var loader = new BufferLoader(urls, this.onBuffersLoaded.bind(this), this.context)
  loader.load()
}

player.prototype.onBuffersLoaded = function(buffers){
  console.log('onBuffersLoaded', buffers);
  var self = this
  this.buffers = {}

  _(this.samples).each(function(url, i){
    self.buffers[url] = buffers[i]
  })
  console.log('onBuffersLoaded2', this.samples, this.buffers);
}

player.prototype.play = function(region, noteOn){
  console.log('play', region, noteOn);
  var buffer = this.buffers[region.sample]
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[noteOn.pitch] = voicesToRelease[noteOn.pitch] || []

  var voice = new Voice(buffer, region, noteOn, this.context, this.bend)
  self.activeVoices[voice.voiceId] = voice
  voice.onended = function(){
    delete self.activeVoices[voice.voiceId]
  }
  if (region.trigger == "attack") {
    voicesToRelease[noteOn.pitch].push(voice)
  }
  voice.connect(this.context.destination)
  voice.start()
}

player.prototype.stop = function(pitch){
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[pitch] = voicesToRelease[pitch] || []

  _(voicesToRelease[pitch]).each(function(voice){
    voice.stop()
  })
  voicesToRelease[pitch] = []
  //var voiceToRelase = voicesToRelease[noteOn.pitch][region.regionId]
  //if (voiceToRelase) voiceToRelase.stop()
  //voicesToRelease[noteOn.pitch][region.regionId] = null
}

player.prototype.pitchBend = function(channel, bend){
  _(this.activeVoices).invoke("pitchBend", bend)
  this.bend = bend
}

module.exports = player

},{"./buffer_loader":6,"./voice":14,"underscore":2}],16:[function(require,module,exports){
var  Region = require("./region")
  , NullSynth = require("./null_synth")
  , _ = require("underscore")

model = function(opts){
  opts = opts || {}
  opts.regions = opts.regions || []

  this.regions = _(opts.regions).map(function(regionDefinition){
    return new Region(regionDefinition)
  })

  this.control = opts.control

  this.bend = 0
  this.chanaft = 64
  this.polyaft = 64
  this.bpm = 120

  if (opts.driver) {
    this.synth = new opts.driver(this, opts.audioContext)
  } else {
    this.synth = new NullSynth()
  }
}

model.prototype.shouldPlayRegion = function(region, noteOn, rand){
  return region.sample != null &&
    region.lochan <= noteOn.channel &&
    region.hichan >= noteOn.channel &&
    region.lokey <= noteOn.pitch &&
    region.hikey >= noteOn.pitch &&
    region.lovel <= noteOn.velocity &&
    region.hivel >= noteOn.velocity &&
    region.lobend <= this.bend &&
    region.hibend >= this.bend &&
    region.lochanaft <= this.chanaft &&
    region.hichanaft >= this.chanaft &&
    region.lopolyaft <= this.polyaft &&
    region.hipolyaft >= this.polyaft &&
    region.lorand <= rand &&
    region.hirand >= rand &&
    region.lobpm <= this.bpm &&
    region.hibpm >= this.bpm
}

model.prototype.regionsToPlay = function(noteOn, rand){
  var self = this
  return _(this.regions).filter(function(region){
    return self.shouldPlayRegion(region, noteOn, rand)
  })
}

model.prototype.random = function(){
  return Math.random()
}

model.prototype.noteOn = function(channel, pitch, velocity){
  console.log('noteOn', channel, pitch, velocity);
  var rand = this.random()
  var noteOn = {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  }

  if (noteOn.velocity > 0) {
    var regions = this.regionsToPlay(noteOn, rand)
    _(regions).each(function(region){
      this.play(region, noteOn)
    }.bind(this))
  } else {
    this.stop(noteOn.pitch)
  }
}

model.prototype.play = function(region, noteOn){
  this.synth.play(region, noteOn)
}

model.prototype.stop = function(pitch){
  this.synth.stop(pitch)
}

model.prototype.samples = function(){
  var samples = []
  _(this.regions).each(function(region){
    if (region.sample) samples.push(region.sample)
  })
  return samples
}

model.prototype.pitchBend = function(channel, bend){
  this.synth.pitchBend(channel, bend)
  this.bend = bend
}

model.prototype.connect = function(destination, output){
  this.synth.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.synth.connect(output)
}

module.exports = model

},{"./null_synth":17,"./region":20,"underscore":2}],17:[function(require,module,exports){
model = function(opts){
}

module.exports = model

},{}],18:[function(require,module,exports){
var  _ = require("underscore")

var MAX_INT = 4294967296
  , MAX_BEND = 9600

Parameter = function(opts){
}

var defaults = {
  lochan: {
    value: 0,
    min: 0,
    max: 15
  },
  hichan: {
    value: 15,
    min: 0,
    max: 15
  },
  lokey: {
    value: 0,
    min: 0,
    max: 127
  },
  hikey: {
    value: 127,
    min: 0,
    max: 127
  },
  lovel: {
    value: 0,
    min: 0,
    max: 127
  },
  hivel: {
    value: 127,
    min: 0,
    max: 127
  },
  lobend: {
    value: -8192,
    min: -8192,
    max: 8192
  },
  hibend: {
    value: 8192,
    min: -8192,
    max: 8192
  },
  lochanaft: {
    value: 0,
    min: 0,
    max: 127
  },
  hichanaft: {
    value: 127,
    min: 0,
    max: 127
  },
  lopolyaft: {
    value: 0,
    min: 0,
    max: 127
  },
  hipolyaft: {
    value: 127,
    min: 0,
    max: 127
  },
  lorand: {
    value: 0,
    min: 0,
    max: 1
  },
  hirand: {
    value: 1,
    min: 0,
    max: 1
  },
  lobpm: {
    value: 0,
    min: 0,
    max: 500
  },
  hibpm: {
    value: 500,
    min: 0,
    max: 500
  },
  seq_length: {
    value: 1,
    min: 1,
    max: 100
  },
  seq_position: {
    value: 1,
    min: 1,
    max: 100
  },
  sw_lokey: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_hikey: {
    value: 127,
    min: 0,
    max: 127
  },
  sw_last: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_down: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_up: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_previous: {
    value: 0,
    min: 0,
    max: 127
  },
  sw_vel: {
    value: "current",
    allowedValues: ["current", "previous"]
  },
  trigger: {
    value: "attack",
    allowedValues: ["attack", "release", "first", "legato"]
  },
  group: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  off_by: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  off_mode: {
    value: "fast",
    allowedValues: ["fast", "normal"]
  },
  delay: {
    value: 0,
    min: 0,
    max: 100
  },
  delay_random: {
    value: 0,
    min: 0,
    max: 100
  },
  offset: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  offset_random: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  end: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  count: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  loop_mode: {
    value: null,
    allowedValues: ["no_loop", "one_shot", "loop_continuous", "loop_sustain"]
  },
  loop_start: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  loop_end: {
    value: 0,
    min: 0,
    max: MAX_INT
  },
  sync_beats: {
    value: 0,
    min: 0,
    max: 32
  },
  sync_offset: {
    value: 0,
    min: 0,
    max: 32
  },
  transpose: {
    value: 0,
    min: -127,
    max: 127
  },
  tune: {
    value: 0,
    min: -100,
    max: 100
  },
  pitch_keycenter: {
    value: 60,
    min: -127,
    max: 127
  },
  pitch_keytrack: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitch_veltrack: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  pitch_random: {
    value: 0,
    min: 0,
    max: MAX_BEND
  },
  bend_up: {
    value: 200,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  bend_down: {
    value: -200,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  bend_step: {
    value: 1,
    min: 1,
    max: 1200
  },
  pitcheg_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_start: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_attack: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_hold: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_decay: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_sustain: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_release: {
    value: 0,
    min: 0,
    max: 100
  },
  pitcheg_depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  pitcheg_vel2delay: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2attack: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2hold: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2decay: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2sustain: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2release: {
    value: 0,
    min: -100,
    max: 100
  },
  pitcheg_vel2depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  pitchlfo_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  pitchlfo_fade: {
    value: 0,
    min: 0,
    max: 100
  },
  pitchlfo_freq: {
    value: 0,
    min: 0,
    max: 20
  },
  pitchlfo_depth: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitchlfo_depthchanaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitchlfo_depthpolyaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  pitchlfo_freqchanaft: {
    value: 0,
    min: -200,
    max: 200
  },
  pitchlfo_freqpolyaft: {
    value: 0,
    min: -200,
    max: 200
  },
  fil_type: {
    value: "lpf_2p",
    allowedValues: ["lpf_1p", "hpf_1p", "lpf_2p", "hpf_2p", "bpf_2p", "brf_2p"]
  },
  cutoff: {
    value: null,
    min: 0,
    max: 22050
  },
  cutoff_chanaft: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  cutoff_polyaft: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  resonance: {
    value: 0,
    min: 0,
    max: 40
  },
  fil_keytrack: {
    value: 0,
    min: 0,
    max: 1200
  },
  fil_keycenter: {
    value: 60,
    min: 0,
    max: 127
  },
  fil_veltrack: {
    value: 0,
    min: -MAX_BEND,
    max: MAX_BEND
  },
  fil_random: {
    value: 0,
    min: 0,
    max: MAX_BEND
  },
  fileg_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_start: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_attack: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_hold: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_decay: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_sustain: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_release: {
    value: 0,
    min: 0,
    max: 100
  },
  fileg_depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  fileg_vel2delay: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2attack: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2hold: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2decay: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2sustain: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2release: {
    value: 0,
    min: -100,
    max: 100
  },
  fileg_vel2depth: {
    value: 0,
    min: -12000,
    max: 12000
  },
  fillfo_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  fillfo_fade: {
    value: 0,
    min: 0,
    max: 100
  },
  fillfo_freq: {
    value: 0,
    min: 0,
    max: 20
  },
  fillfo_depth: {
    value: 0,
    min: -1200,
    max: 1200
  },
  fillfo_depthchanaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  fillfo_depthpolyaft: {
    value: 0,
    min: -1200,
    max: 1200
  },
  fillfo_freqchanaft: {
    value: 0,
    min: -200,
    max: 200
  },
  fillfo_freqpolyaft: {
    value: 0,
    min: -200,
    max: 200
  },

  volume: {
    value: 0,
    min: -144,
    max: 6
  },
  pan: {
    value: 0,
    min: -100,
    max: 100
  },
  width: {
    value: 0,
    min: -100,
    max: 100
  },
  position: {
    value: 0,
    min: -100,
    max: 100
  },
  amp_keytrack: {
    value: 0,
    min: -96,
    max: 12
  },
  amp_keycenter: {
    value: 60,
    min: 0,
    max: 127
  },
  amp_veltrack: {
    value: 100,
    min: -100,
    max: 100
  },
  amp_random: {
    value: 0,
    min: 0,
    max: 24
  },
  rt_decay: {
    value: 0,
    min: 0,
    max: 200
  },
  output: {
    value: 0,
    min: 0,
    max: 1024
  },
  xfin_lokey: {
    value: 0,
    min: 0,
    max: 127
  },
  xfin_hikey: {
    value: 0,
    min: 0,
    max: 127
  },
  xfout_lokey: {
    value: 127,
    min: 0,
    max: 127
  },
  xfout_hikey: {
    value: 127,
    min: 0,
    max: 127
  },
  xf_keycurve: {
    value: "power",
    allowedValues: ["gain", "power"]
  },
  xf_velcurve: {
    value: "power",
    allowedValues: ["gain", "power"]
  },
  xf_cccurve: {
    value: "power",
    allowedValues: ["gain", "power"]
  },
  ampeg_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_start: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_attack: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_hold: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_decay: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_sustain: {
    value: 100,
    min: 0,
    max: 100
  },
  ampeg_release: {
    value: 0,
    min: 0,
    max: 100
  },
  ampeg_vel2delay: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2attack: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2hold: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2decay: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2sustain: {
    value: 0,
    min: -100,
    max: 100
  },
  ampeg_vel2release: {
    value: 0,
    min: -100,
    max: 100
  },
  amplfo_delay: {
    value: 0,
    min: 0,
    max: 100
  },
  amplfo_fade: {
    value: 0,
    min: 0,
    max: 100
  },
  amplfo_freq: {
    value: 0,
    min: 0,
    max: 20
  },
  amplfo_depth: {
    value: 0,
    min: -10,
    max: 10
  },
  amplfo_depthchanaft: {
    value: 0,
    min: -10,
    max: 10
  },
  amplfo_depthpolyaft: {
    value: 0,
    min: -10,
    max: 10
  },
  amplfo_freqchanaft: {
    value: 0,
    min: -200,
    max: 200
  },
  amplfo_freqpolyaft: {
    value: 0,
    min: -200,
    max: 200
  },
  eq1_freq: {
    value: 50,
    min: 0,
    max: 30000
  },
  eq2_freq: {
    value: 500,
    min: 0,
    max: 30000
  },
  eq3_freq: {
    value: 5000,
    min: 0,
    max: 30000
  },
  eq1_vel2freq: {
    value: 0,
    min: -30000,
    max: 30000
  },
  eq2_vel2freq: {
    value: 0,
    min: -30000,
    max: 30000
  },
  eq3_vel2freq: {
    value: 0,
    min: -30000,
    max: 30000
  },
  eq1_bw: {
    value: 1,
    min: 0.001,
    max: 4
  },
  eq2_bw: {
    value: 1,
    min: 0.001,
    max: 4
  },
  eq3_bw: {
    value: 1,
    min: 0.001,
    max: 4
  },
  eq1_gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq2_gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq3_gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq1_vel2gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq2_vel2gain: {
    value: 0,
    min: -96,
    max: 24
  },
  eq3_vel2gain: {
    value: 0,
    min: -96,
    max: 24
  },
  effect1: {
    value: 0,
    min: 0,
    max: 100
  },
  effect2: {
    value: 0,
    min: 0,
    max: 100
  }

}

//_(128).times(function(i){
  //defaults["on_locc" + i] = {
    //value: -1,
    //min: 0,
    //max: 127
  //}
  //defaults["on_hicc" + i] = {
    //value: -1,
    //min: 0,
    //max: 127
  //}
  //defaults["delay_cc" + i] = {
    //value: 0,
    //min: 0,
    //max: 100
  //}
  //defaults["offset_cc" + i] = {
    //value: 0,
    //min: 0,
    //max: MAX_INT
  //}
  //defaults["pitchlfo_depthcc" + i] = {
    //value: 0,
    //min: -1200,
    //max: 1200
  //},
  //defaults["pitchlfo_freqcc" + i] = {
    //value: 0,
    //min: -200,
    //max: 200
  //}
  //defaults["cutoff_cc" + i] = {
    //value: 0,
    //min: -MAX_BEND,
    //max: MAX_BEND
  //}
  //defaults["fillfo_depthcc" + i] = {
    //value: 0,
    //min: -1200,
    //max: 1200
  //}
  //defaults["fillfo_freqcc" + i] = {
    //value: 0,
    //min: -200,
    //max: 200
  //}
  //defaults["amp_velcurve_" + i] = {
    //value: 1,
    //min: 0,
    //max: 1
  //}
  //defaults["gain_cc" + i] = {
    //value: 0,
    //min: -144,
    //max: 48
  //}
  //defaults["xfin_locc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["xfin_hicc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["xfout_locc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["xfout_hicc" + i] = {
    //value: 0,
    //min: 0,
    //max: 127
  //}
  //defaults["ampeg_delaycc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_startcc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_attackcc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_holdcc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_decaycc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_sustaincc" + i] = {
    //value: 100,
    //min: -100,
    //max: 100
  //}
  //defaults["ampeg_releasecc" + i] = {
    //value: 0,
    //min: -100,
    //max: 100
  //}
  //defaults["amplfo_depthcc" + i] = {
    //value: 0,
    //min: -10,
    //max: 10
  //}
  //defaults["amplfo_freqcc" + i] = {
    //value: 0,
    //min: -200,
    //max: 200
  //}
  //defaults["eq1_freqcc" + i] = {
    //value: 0,
    //min: -30000,
    //max: 30000
  //}
  //defaults["eq2_freqcc" + i] = {
    //value: 0,
    //min: -30000,
    //max: 30000
  //}
  //defaults["eq3_freqcc" + i] = {
    //value: 0,
    //min: -30000,
    //max: 30000
  //}
  //defaults["eq1_bwcc" + i] = {
    //value: 0,
    //min: -4,
    //max: 4
  //}
  //defaults["eq2_bwcc" + i] = {
    //value: 0,
    //min: -4,
    //max: 4
  //}
  //defaults["eq3_bwcc" + i] = {
    //value: 0,
    //min: -4,
    //max: 4
  //}
  //defaults["eq1_gaincc" + i] = {
    //value: 0,
    //min: -96,
    //max: 48
  //}
  //defaults["eq2_gaincc" + i] = {
    //value: 0,
    //min: -96,
    //max: 48
  //}
  //defaults["eq3_gaincc" + i] = {
    //value: 0,
    //min: -96,
    //max: 48
  //}
//})

Parameter.defaults = defaults

Parameter.inputControls = [
  "lochan",
  "hichan",
  "lokey",
  "hikey",
  "lovel",
  "hivel",
  "lobend",
  "hibend",
  "lochanaft",
  "hichanaft",
  "lopolyaft",
  "hipolyaft",
  "lorand",
  "hirand",
  "lobpm",
  "hibpm",
  "seq_length",
  "seq_position",
  "sw_lokey",
  "sw_hikey",
  "sw_last",
  "sw_down",
  "sw_up",
  "sw_previous",
  "sw_vel",
  "trigger",
  "group",
  "off_by",
  "off_mode"
]

_(128).times(function(i){
  Parameter.inputControls.push("on_locc" + i)
  Parameter.inputControls.push("on_hicc" + i)
})

Parameter.performanceParameters = [
  "delay",
  "delay_random",
  "offset",
  "offset_random",
  "end",
  "count",
  "loop_mode",
  "loop_start",
  "loop_end",
  "sync_beats",
  "sync_offset",
  "transpose",
  "tune",
  "pitch_keycenter",
  "pitch_keytrack",
  "pitch_veltrack",
  "pitch_random",
  "bend_up",
  "bend_down",
  "bend_step",
  "pitcheg_delay",
  "pitcheg_start",
  "pitcheg_attack",
  "pitcheg_hold",
  "pitcheg_decay",
  "pitcheg_sustain",
  "pitcheg_release",
  "pitcheg_depth",
  "pitcheg_vel2delay",
  "pitcheg_vel2attack",
  "pitcheg_vel2hold",
  "pitcheg_vel2decay",
  "pitcheg_vel2sustain",
  "pitcheg_vel2release",
  "pitcheg_vel2depth",
  "pitchlfo_delay",
  "pitchlfo_fade",
  "pitchlfo_freq",
  "pitchlfo_depth",
  "pitchlfo_depthchanaft",
  "pitchlfo_depthpolyaft",
  "pitchlfo_freqchanaft",
  "pitchlfo_freqpolyaft",
  "fil_type",
  "cutoff",
  "cutoff_chanaft",
  "cutoff_polyaft",
  "resonance",
  "fil_keycenter",
  "fil_veltrack",
  "fil_random",
  "fileg_delay",
  "fileg_start",
  "fileg_attack",
  "fileg_hold",
  "fileg_decay",
  "fileg_sustain",
  "fileg_release",
  "fileg_depth",
  "fileg_vel2delay",
  "fileg_vel2attack",
  "fileg_vel2hold",
  "fileg_vel2decay",
  "fileg_vel2sustain",
  "fileg_vel2release",
  "fileg_vel2depth",
  "fillfo_delay",
  "fillfo_fade",
  "fillfo_freq",
  "fillfo_depth",
  "fillfo_depthchanaft",
  "fillfo_depthpolyaft",
  "fillfo_freqcc",
  "fillfo_freqchanaft",
  "fillfo_freqpolyaft",
  "volume",
  "pan",
  "width",
  "position",
  "amp_keytrack",
  "amp_keycenter",
  "amp_veltrack",
  "amp_random",
  "rt_decay",
  "output",
  "xfin_lokey",
  "xfin_hikey",
  "xfout_lokey",
  "xfout_hikey",
  "xf_keycurve",
  "xfin_lovel",
  "xfout_hivel",
  "xf_velcurve",
  "xf_cccurve",
  "ampeg_delay",
  "ampeg_start",
  "ampeg_attack",
  "ampeg_hold",
  "ampeg_decay",
  "ampeg_sustain",
  "ampeg_release",
  "ampeg_vel2delay",
  "ampeg_vel2attack",
  "ampeg_vel2hold",
  "ampeg_vel2decay",
  "ampeg_vel2sustain",
  "ampeg_vel2release",
  "amplfo_delay",
  "amplfo_fade",
  "amplfo_freq",
  "amplfo_depth",
  "amplfo_depthchanaft",
  "amplfo_depthpolyaft",
  "amplfo_freqchanaft",
  "amplfo_freqpolyaft",
  "eq1_freq",
  "eq2_freq",
  "eq3_freq",
  "eq1_vel2freq",
  "eq2_vel2freq",
  "eq3_vel2freq",
  "eq1_bw",
  "eq2_bw",
  "eq3_bw",
  "eq1_gain",
  "eq2_gain",
  "eq3_gain",
  "eq1_vel2gain",
  "eq2_vel2gain",
  "eq3_vel2gain",
  "effect1",
  "effect2"
]

var seqPerformanceParameters = [
  "delay_cc",
  "offset_cc",
  "pitchlfo_depthcc",
  "pitchlfo_freqcc",
  "cutoff_cc",
  "fillfo_depthcc",
  "amp_velcurve_",
  "gain_cc",
  "xfin_locc",
  "xfin_hicc",
  "xfout_locc",
  "xfout_hicc",
  "ampeg_delaycc",
  "ampeg_startcc",
  "ampeg_attackcc",
  "ampeg_holdcc",
  "ampeg_decaycc",
  "ampeg_sustaincc",
  "ampeg_releasecc",
  "amplfo_depthcc",
  "amplfo_freqcc",
  "eq1_freqcc",
  "eq2_freqcc",
  "eq3_freqcc",
  "eq1_bwcc",
  "eq2_bwcc",
  "eq3_bwcc",
  "eq1_gaincc",
  "eq2_gaincc",
  "eq3_gaincc"
]
_(128).times(function(i){
  _(seqPerformanceParameters).each(function(paramName){
    Parameter.performanceParameters.push(paramName + i)
  })
})

var defaultValues = {}
_(defaults).each(function(settings, name){
  defaultValues[name] = settings.value
})
Parameter.defaultValues = defaultValues


module.exports = Parameter

},{"underscore":2}],19:[function(require,module,exports){
/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleFunctions = { start: peg$parsestart },
      peg$startRuleFunction  = peg$parsestart,

      peg$c0 = function(instrument) { return instrument; },
      peg$c1 = function(elements) {

            function extend(target, source){
              target = target || {};
              for (var prop in source) {
                if (typeof source[prop] === 'object') {
                  target[prop] = extend(target[prop], source[prop]);
                } else {
                  target[prop] = source[prop];
                }
              }
              return target;
            }

            function defaults(target, source){
              target = target || {};
              for (var prop in source) {
                if (target[prop]) continue;
                if (typeof source[prop] === 'object') {
                  target[prop] = defaults(target[prop], source[prop]);
                } else {
                  target[prop] = source[prop];
                }
              }
              return target;
            }

            elements = elements !== null ? elements : [];
            var global = null;
            var masters = [];
            var controls = [];
            var groups = [];
            var regions = [];
            var curves = [];
            var lastMaster = null
              , lastControl = null
              , lastGroup = null
              , lastNode = null
            for (var i = 0; i < elements.length; i++) {
              if (elements[i] == '<global>') {
                lastNode = global = {}
              } else if (elements[i] == '<master>') {
                lastNode = lastMaster = { masterId: "master" + masters.length }
              } else if (elements[i] == '<group>') {
                lastNode = lastGroup = {}
              } else if (elements[i] == '<control>') {
                lastNode = lastControl = {}
              } else if (elements[i] == "<region>") {
                lastNode = {}
                lastNode.master = lastMaster
                lastNode.groupNode = lastGroup
                lastNode.control = lastControl
                lastNode.regionId = "r" + regions.length
                regions.push(lastNode)
              } else if (elements[i] == "<curve>") {
                lastNode = {}
                curves.push(lastNode)
              } else {
                var param = elements[i]
                  , name = param[0]
                  , value = param[1]

                if (lastNode) {
                  extend(lastNode, elements[i])
                }
              }
            }

            for (var i = 0; i < curves.length; i++) {
              var curve = curves[i]
              var newCurve = {}
              for (var key in curve) {
                if (curve.hasOwnProperty(key)) {
                  var v = key.replace("v", "")
                  newCurve[parseInt(v, 10)] = curve[key]
                }
              }
              curves[i] = newCurve
            }

            var isEmpty = function(obj) {
              if (obj == null) return true;
              for (var key in obj) if (obj.hasOwnProperty(key)) return false;
              return true;
            };

            var regionz = []
            for (var i = 0; i < regions.length; i++) {
              var region = regions[i]
                , regionCopy = {}

              extend(regionCopy, region)
              delete regionCopy.master
              delete regionCopy.groupNode
              delete regionCopy.control
              delete regionCopy.regionId

              if (isEmpty(regionCopy)) {
                continue;
              }

              if (global) defaults(region, global)
              if (region.control) defaults(region, region.control)
              if (region.groupNode) defaults(region, region.groupNode)

              if (region.default_path && region.sample) {
                region.sample = region.default_path + region.sample
                delete region.default_path
              }

              var noteOffset = 0
              if (region.octave_offset) {
                noteOffset += region.octave_offset * 12
                delete region.octave_offset
              }

              if (region.note_offset) {
                noteOffset += region.note_offset
                delete region.note_offset
              }

              if (noteOffset) {
                if (region.lokey) region.lokey += noteOffset
                if (region.hikey) region.hikey += noteOffset
                if (region.pitch_keycenter) region.pitch_keycenter += noteOffset
                if (region.sw_lokey) region.sw_lokey += noteOffset
                if (region.sw_hikey) region.sw_hikey += noteOffset
                if (region.sw_last) region.sw_last += noteOffset
                if (region.sw_down) region.sw_down += noteOffset
                if (region.sw_up) region.sw_up += noteOffset
                if (region.sw_previous) region.sw_previous += noteOffset
              }

              if (region.master) {
                defaults(region, region.master)
                if (region.lokey && region.master.lokey) {
                  if (region.lokey < region.master.lokey) {
                    region.lokey = region.master.lokey
                  }
                }

                if (region.hikey && region.master.hikey) {
                  if (region.hikey > region.master.hikey) {
                    region.hikey = region.master.hikey
                  }
                }

                if (region.lovel && region.master.lovel) {
                  if (region.lovel < region.master.lovel) {
                    region.lovel = region.master.lovel
                  }
                }

                if (region.hivel && region.master.hivel) {
                  if (region.hivel > region.master.hivel) {
                    region.hivel = region.master.hivel
                  }
                }
              }
              delete region.master
              delete region.groupNode
              delete region.control
              if (region.masterId) delete region.masterId
              regionz.push(region)
            }

            return {
              type: "Instrument",
              masters: masters,
              regions: regionz,
              curves: curves
            };
          },
      peg$c2 = function(head, tail) {
            var result = [head];
            for (var i = 0; i < tail.length; i++) {
              result.push(tail[i][1]);
            }
            return result;
          },
      peg$c3 = peg$anyExpectation(),
      peg$c4 = peg$otherExpectation("header"),
      peg$c5 = "<global>",
      peg$c6 = peg$literalExpectation("<global>", false),
      peg$c7 = "<master>",
      peg$c8 = peg$literalExpectation("<master>", false),
      peg$c9 = "<region>",
      peg$c10 = peg$literalExpectation("<region>", false),
      peg$c11 = "<group>",
      peg$c12 = peg$literalExpectation("<group>", false),
      peg$c13 = "<curve>",
      peg$c14 = peg$literalExpectation("<curve>", false),
      peg$c15 = peg$otherExpectation("opcode directive"),
      peg$c16 = "sample=",
      peg$c17 = peg$literalExpectation("sample=", false),
      peg$c18 = function(value) { return { sample: value } },
      peg$c19 = "key=",
      peg$c20 = peg$literalExpectation("key=", false),
      peg$c21 = function(value) {
          return { lokey: value, hikey: value, pitch_keycenter: value }
        },
      peg$c22 = "sw_vel=",
      peg$c23 = peg$literalExpectation("sw_vel=", false),
      peg$c24 = "current",
      peg$c25 = peg$literalExpectation("current", false),
      peg$c26 = "previous",
      peg$c27 = peg$literalExpectation("previous", false),
      peg$c28 = function(value) { return { sw_vel: value } },
      peg$c29 = "sw_trigger=",
      peg$c30 = peg$literalExpectation("sw_trigger=", false),
      peg$c31 = "attack",
      peg$c32 = peg$literalExpectation("attack", false),
      peg$c33 = "release",
      peg$c34 = peg$literalExpectation("release", false),
      peg$c35 = "first",
      peg$c36 = peg$literalExpectation("first", false),
      peg$c37 = "legato",
      peg$c38 = peg$literalExpectation("legato", false),
      peg$c39 = function(value) { return { sw_trigger: value } },
      peg$c40 = "off_mode=",
      peg$c41 = peg$literalExpectation("off_mode=", false),
      peg$c42 = "fast",
      peg$c43 = peg$literalExpectation("fast", false),
      peg$c44 = "normal",
      peg$c45 = peg$literalExpectation("normal", false),
      peg$c46 = function(value) { return { off_mode: value } },
      peg$c47 = "fil_type=",
      peg$c48 = peg$literalExpectation("fil_type=", false),
      peg$c49 = "lpf_1p",
      peg$c50 = peg$literalExpectation("lpf_1p", false),
      peg$c51 = "hpf_1p",
      peg$c52 = peg$literalExpectation("hpf_1p", false),
      peg$c53 = "lpf_2p",
      peg$c54 = peg$literalExpectation("lpf_2p", false),
      peg$c55 = "hpf_2p",
      peg$c56 = peg$literalExpectation("hpf_2p", false),
      peg$c57 = "bpf_2p",
      peg$c58 = peg$literalExpectation("bpf_2p", false),
      peg$c59 = "brf_2p",
      peg$c60 = peg$literalExpectation("brf_2p", false),
      peg$c61 = function(value) { return { fil_type: value } },
      peg$c62 = "=",
      peg$c63 = peg$literalExpectation("=", false),
      peg$c64 = function(name, value) {
          var param = {}
          param[name] = value
          return param
        },
      peg$c65 = "gain",
      peg$c66 = peg$literalExpectation("gain", false),
      peg$c67 = "power",
      peg$c68 = peg$literalExpectation("power", false),
      peg$c69 = "xf_keycurve",
      peg$c70 = peg$literalExpectation("xf_keycurve", false),
      peg$c71 = "xf_velcurve",
      peg$c72 = peg$literalExpectation("xf_velcurve", false),
      peg$c73 = "xf_cccurve",
      peg$c74 = peg$literalExpectation("xf_cccurve", false),
      peg$c75 = peg$otherExpectation("midi note opcode"),
      peg$c76 = "lokey",
      peg$c77 = peg$literalExpectation("lokey", false),
      peg$c78 = "hikey",
      peg$c79 = peg$literalExpectation("hikey", false),
      peg$c80 = "pitch_keycenter",
      peg$c81 = peg$literalExpectation("pitch_keycenter", false),
      peg$c82 = "sw_lokey",
      peg$c83 = peg$literalExpectation("sw_lokey", false),
      peg$c84 = "sw_hikey",
      peg$c85 = peg$literalExpectation("sw_hikey", false),
      peg$c86 = "sw_last",
      peg$c87 = peg$literalExpectation("sw_last", false),
      peg$c88 = "sw_down",
      peg$c89 = peg$literalExpectation("sw_down", false),
      peg$c90 = "sw_up",
      peg$c91 = peg$literalExpectation("sw_up", false),
      peg$c92 = "sw_previous",
      peg$c93 = peg$literalExpectation("sw_previous", false),
      peg$c94 = "octave_offset",
      peg$c95 = peg$literalExpectation("octave_offset", false),
      peg$c96 = "note_offset",
      peg$c97 = peg$literalExpectation("note_offset", false),
      peg$c98 = peg$otherExpectation("float opcode"),
      peg$c99 = "fillfo_delay",
      peg$c100 = peg$literalExpectation("fillfo_delay", false),
      peg$c101 = "fillfo_fade",
      peg$c102 = peg$literalExpectation("fillfo_fade", false),
      peg$c103 = "fillfo_freq",
      peg$c104 = peg$literalExpectation("fillfo_freq", false),
      peg$c105 = "fillfo_freqcc1",
      peg$c106 = peg$literalExpectation("fillfo_freqcc1", false),
      peg$c107 = "fillfo_freqcc2",
      peg$c108 = peg$literalExpectation("fillfo_freqcc2", false),
      peg$c109 = "lorand",
      peg$c110 = peg$literalExpectation("lorand", false),
      peg$c111 = "hirand",
      peg$c112 = peg$literalExpectation("hirand", false),
      peg$c113 = "lotimer",
      peg$c114 = peg$literalExpectation("lotimer", false),
      peg$c115 = "hitimer",
      peg$c116 = peg$literalExpectation("hitimer", false),
      peg$c117 = "lobpm",
      peg$c118 = peg$literalExpectation("lobpm", false),
      peg$c119 = "hibpm",
      peg$c120 = peg$literalExpectation("hibpm", false),
      peg$c121 = "delay_random",
      peg$c122 = peg$literalExpectation("delay_random", false),
      peg$c123 = "delay_cc1",
      peg$c124 = peg$literalExpectation("delay_cc1", false),
      peg$c125 = "delay_cc2",
      peg$c126 = peg$literalExpectation("delay_cc2", false),
      peg$c127 = "delay",
      peg$c128 = peg$literalExpectation("delay", false),
      peg$c129 = "sync_beats",
      peg$c130 = peg$literalExpectation("sync_beats", false),
      peg$c131 = "sync_offset",
      peg$c132 = peg$literalExpectation("sync_offset", false),
      peg$c133 = "pitcheg_delay",
      peg$c134 = peg$literalExpectation("pitcheg_delay", false),
      peg$c135 = "pitcheg_start",
      peg$c136 = peg$literalExpectation("pitcheg_start", false),
      peg$c137 = "pitcheg_attack",
      peg$c138 = peg$literalExpectation("pitcheg_attack", false),
      peg$c139 = "pitcheg_hold",
      peg$c140 = peg$literalExpectation("pitcheg_hold", false),
      peg$c141 = "pitcheg_decay",
      peg$c142 = peg$literalExpectation("pitcheg_decay", false),
      peg$c143 = "pitcheg_sustain",
      peg$c144 = peg$literalExpectation("pitcheg_sustain", false),
      peg$c145 = "pitcheg_release",
      peg$c146 = peg$literalExpectation("pitcheg_release", false),
      peg$c147 = "pitcheg_vel2delay",
      peg$c148 = peg$literalExpectation("pitcheg_vel2delay", false),
      peg$c149 = "pitcheg_vel2attack",
      peg$c150 = peg$literalExpectation("pitcheg_vel2attack", false),
      peg$c151 = "pitcheg_vel2hold",
      peg$c152 = peg$literalExpectation("pitcheg_vel2hold", false),
      peg$c153 = "pitcheg_vel2decay",
      peg$c154 = peg$literalExpectation("pitcheg_vel2decay", false),
      peg$c155 = "pitcheg_vel2sustain",
      peg$c156 = peg$literalExpectation("pitcheg_vel2sustain", false),
      peg$c157 = "pitchlfo_delay",
      peg$c158 = peg$literalExpectation("pitchlfo_delay", false),
      peg$c159 = "pitchlfo_fade",
      peg$c160 = peg$literalExpectation("pitchlfo_fade", false),
      peg$c161 = "pitchlfo_freqcc1",
      peg$c162 = peg$literalExpectation("pitchlfo_freqcc1", false),
      peg$c163 = "pitchlfo_freqcc60",
      peg$c164 = peg$literalExpectation("pitchlfo_freqcc60", false),
      peg$c165 = "pitchlfo_freqchanaft",
      peg$c166 = peg$literalExpectation("pitchlfo_freqchanaft", false),
      peg$c167 = "pitchlfo_freqpolyaft",
      peg$c168 = peg$literalExpectation("pitchlfo_freqpolyaft", false),
      peg$c169 = "pitchlfo_freq",
      peg$c170 = peg$literalExpectation("pitchlfo_freq", false),
      peg$c171 = "cutoff",
      peg$c172 = peg$literalExpectation("cutoff", false),
      peg$c173 = "resonance",
      peg$c174 = peg$literalExpectation("resonance", false),
      peg$c175 = "fileg_delay",
      peg$c176 = peg$literalExpectation("fileg_delay", false),
      peg$c177 = "fileg_start",
      peg$c178 = peg$literalExpectation("fileg_start", false),
      peg$c179 = "fileg_attack",
      peg$c180 = peg$literalExpectation("fileg_attack", false),
      peg$c181 = "fileg_hold",
      peg$c182 = peg$literalExpectation("fileg_hold", false),
      peg$c183 = "fileg_decay",
      peg$c184 = peg$literalExpectation("fileg_decay", false),
      peg$c185 = "fileg_sustain",
      peg$c186 = peg$literalExpectation("fileg_sustain", false),
      peg$c187 = "fileg_release",
      peg$c188 = peg$literalExpectation("fileg_release", false),
      peg$c189 = "fileg_vel2delay",
      peg$c190 = peg$literalExpectation("fileg_vel2delay", false),
      peg$c191 = "fileg_vel2attack",
      peg$c192 = peg$literalExpectation("fileg_vel2attack", false),
      peg$c193 = "fileg_vel2hold",
      peg$c194 = peg$literalExpectation("fileg_vel2hold", false),
      peg$c195 = "fileg_vel2decay",
      peg$c196 = peg$literalExpectation("fileg_vel2decay", false),
      peg$c197 = "fileg_vel2sustain",
      peg$c198 = peg$literalExpectation("fileg_vel2sustain", false),
      peg$c199 = "fileg_vel2release",
      peg$c200 = peg$literalExpectation("fileg_vel2release", false),
      peg$c201 = "volume",
      peg$c202 = peg$literalExpectation("volume", false),
      peg$c203 = "pan",
      peg$c204 = peg$literalExpectation("pan", false),
      peg$c205 = "width",
      peg$c206 = peg$literalExpectation("width", false),
      peg$c207 = "position",
      peg$c208 = peg$literalExpectation("position", false),
      peg$c209 = "amp_keytrack",
      peg$c210 = peg$literalExpectation("amp_keytrack", false),
      peg$c211 = "amp_veltrack",
      peg$c212 = peg$literalExpectation("amp_veltrack", false),
      peg$c213 = "amp_velcurve_1",
      peg$c214 = peg$literalExpectation("amp_velcurve_1", false),
      peg$c215 = "amp_velcurve_127",
      peg$c216 = peg$literalExpectation("amp_velcurve_127", false),
      peg$c217 = "amp_random",
      peg$c218 = peg$literalExpectation("amp_random", false),
      peg$c219 = "rt_decay",
      peg$c220 = peg$literalExpectation("rt_decay", false),
      peg$c221 = "ampeg_delay",
      peg$c222 = peg$literalExpectation("ampeg_delay", false),
      peg$c223 = "ampeg_start",
      peg$c224 = peg$literalExpectation("ampeg_start", false),
      peg$c225 = "ampeg_attack",
      peg$c226 = peg$literalExpectation("ampeg_attack", false),
      peg$c227 = "ampeg_hold",
      peg$c228 = peg$literalExpectation("ampeg_hold", false),
      peg$c229 = "ampeg_decay",
      peg$c230 = peg$literalExpectation("ampeg_decay", false),
      peg$c231 = "ampeg_sustain",
      peg$c232 = peg$literalExpectation("ampeg_sustain", false),
      peg$c233 = "ampeg_release",
      peg$c234 = peg$literalExpectation("ampeg_release", false),
      peg$c235 = "ampeg_vel2delay",
      peg$c236 = peg$literalExpectation("ampeg_vel2delay", false),
      peg$c237 = "ampeg_vel2attack",
      peg$c238 = peg$literalExpectation("ampeg_vel2attack", false),
      peg$c239 = "ampeg_vel2hold",
      peg$c240 = peg$literalExpectation("ampeg_vel2hold", false),
      peg$c241 = "ampeg_vel2decay",
      peg$c242 = peg$literalExpectation("ampeg_vel2decay", false),
      peg$c243 = "ampeg_vel2sustain",
      peg$c244 = peg$literalExpectation("ampeg_vel2sustain", false),
      peg$c245 = "ampeg_vel2release",
      peg$c246 = peg$literalExpectation("ampeg_vel2release", false),
      peg$c247 = "amplfo_delay",
      peg$c248 = peg$literalExpectation("amplfo_delay", false),
      peg$c249 = "amplfo_fade",
      peg$c250 = peg$literalExpectation("amplfo_fade", false),
      peg$c251 = "amplfo_depthchanaft",
      peg$c252 = peg$literalExpectation("amplfo_depthchanaft", false),
      peg$c253 = "amplfo_depthpolyaft",
      peg$c254 = peg$literalExpectation("amplfo_depthpolyaft", false),
      peg$c255 = "amplfo_depth",
      peg$c256 = peg$literalExpectation("amplfo_depth", false),
      peg$c257 = "amplfo_freqchanaft",
      peg$c258 = peg$literalExpectation("amplfo_freqchanaft", false),
      peg$c259 = "amplfo_freqpolyaft",
      peg$c260 = peg$literalExpectation("amplfo_freqpolyaft", false),
      peg$c261 = "amplfo_freq",
      peg$c262 = peg$literalExpectation("amplfo_freq", false),
      peg$c263 = "eq1_freq",
      peg$c264 = peg$literalExpectation("eq1_freq", false),
      peg$c265 = "eq2_freq",
      peg$c266 = peg$literalExpectation("eq2_freq", false),
      peg$c267 = "eq3_freq",
      peg$c268 = peg$literalExpectation("eq3_freq", false),
      peg$c269 = "eq1_vel2freq",
      peg$c270 = peg$literalExpectation("eq1_vel2freq", false),
      peg$c271 = "eq2_vel2freq",
      peg$c272 = peg$literalExpectation("eq2_vel2freq", false),
      peg$c273 = "eq3_vel2freq",
      peg$c274 = peg$literalExpectation("eq3_vel2freq", false),
      peg$c275 = "eq1_bw",
      peg$c276 = peg$literalExpectation("eq1_bw", false),
      peg$c277 = "eq2_bw",
      peg$c278 = peg$literalExpectation("eq2_bw", false),
      peg$c279 = "eq3_bw",
      peg$c280 = peg$literalExpectation("eq3_bw", false),
      peg$c281 = "eq1_gain",
      peg$c282 = peg$literalExpectation("eq1_gain", false),
      peg$c283 = "eq2_gain",
      peg$c284 = peg$literalExpectation("eq2_gain", false),
      peg$c285 = "eq3_gain",
      peg$c286 = peg$literalExpectation("eq3_gain", false),
      peg$c287 = "eq1_vel2gain",
      peg$c288 = peg$literalExpectation("eq1_vel2gain", false),
      peg$c289 = "eq2_vel2gain",
      peg$c290 = peg$literalExpectation("eq2_vel2gain", false),
      peg$c291 = "eq3_vel2gain",
      peg$c292 = peg$literalExpectation("eq3_vel2gain", false),
      peg$c293 = "effect1",
      peg$c294 = peg$literalExpectation("effect1", false),
      peg$c295 = "effect2",
      peg$c296 = peg$literalExpectation("effect2", false),
      peg$c297 = peg$otherExpectation("integer opcode"),
      peg$c298 = "fillfo_depthcc1",
      peg$c299 = peg$literalExpectation("fillfo_depthcc1", false),
      peg$c300 = "fillfo_depthcc60",
      peg$c301 = peg$literalExpectation("fillfo_depthcc60", false),
      peg$c302 = "fillfo_freqchanaft",
      peg$c303 = peg$literalExpectation("fillfo_freqchanaft", false),
      peg$c304 = "fillfo_freqpolyaft",
      peg$c305 = peg$literalExpectation("fillfo_freqpolyaft", false),
      peg$c306 = "fillfo_depth",
      peg$c307 = peg$literalExpectation("fillfo_depth", false),
      peg$c308 = "lovel",
      peg$c309 = peg$literalExpectation("lovel", false),
      peg$c310 = "hivel",
      peg$c311 = peg$literalExpectation("hivel", false),
      peg$c312 = "lobend",
      peg$c313 = peg$literalExpectation("lobend", false),
      peg$c314 = "hibend",
      peg$c315 = peg$literalExpectation("hibend", false),
      peg$c316 = "lochanaft",
      peg$c317 = peg$literalExpectation("lochanaft", false),
      peg$c318 = "hichanaft",
      peg$c319 = peg$literalExpectation("hichanaft", false),
      peg$c320 = "lochan",
      peg$c321 = peg$literalExpectation("lochan", false),
      peg$c322 = "hichan",
      peg$c323 = peg$literalExpectation("hichan", false),
      peg$c324 = "loprog",
      peg$c325 = peg$literalExpectation("loprog", false),
      peg$c326 = "hiprog",
      peg$c327 = peg$literalExpectation("hiprog", false),
      peg$c328 = "lopolyaft",
      peg$c329 = peg$literalExpectation("lopolyaft", false),
      peg$c330 = "hipolyaft",
      peg$c331 = peg$literalExpectation("hipolyaft", false),
      peg$c332 = "seq_length",
      peg$c333 = peg$literalExpectation("seq_length", false),
      peg$c334 = "seq_position",
      peg$c335 = peg$literalExpectation("seq_position", false),
      peg$c336 = "group",
      peg$c337 = peg$literalExpectation("group", false),
      peg$c338 = "off_by",
      peg$c339 = peg$literalExpectation("off_by", false),
      peg$c340 = "offset_random",
      peg$c341 = peg$literalExpectation("offset_random", false),
      peg$c342 = "offset_cc1",
      peg$c343 = peg$literalExpectation("offset_cc1", false),
      peg$c344 = "offset_cc64",
      peg$c345 = peg$literalExpectation("offset_cc64", false),
      peg$c346 = "offset",
      peg$c347 = peg$literalExpectation("offset", false),
      peg$c348 = "end",
      peg$c349 = peg$literalExpectation("end", false),
      peg$c350 = "count",
      peg$c351 = peg$literalExpectation("count", false),
      peg$c352 = "loop_start",
      peg$c353 = peg$literalExpectation("loop_start", false),
      peg$c354 = "loop_end",
      peg$c355 = peg$literalExpectation("loop_end", false),
      peg$c356 = "transpose",
      peg$c357 = peg$literalExpectation("transpose", false),
      peg$c358 = "tune",
      peg$c359 = peg$literalExpectation("tune", false),
      peg$c360 = "pitch_keytrack",
      peg$c361 = peg$literalExpectation("pitch_keytrack", false),
      peg$c362 = "pitch_veltrack",
      peg$c363 = peg$literalExpectation("pitch_veltrack", false),
      peg$c364 = "pitch_random",
      peg$c365 = peg$literalExpectation("pitch_random", false),
      peg$c366 = "bend_up",
      peg$c367 = peg$literalExpectation("bend_up", false),
      peg$c368 = "bend_down",
      peg$c369 = peg$literalExpectation("bend_down", false),
      peg$c370 = "pitcheg_depth",
      peg$c371 = peg$literalExpectation("pitcheg_depth", false),
      peg$c372 = "fileg_depth",
      peg$c373 = peg$literalExpectation("fileg_depth", false),
      peg$c374 = "fileg_vel2depth",
      peg$c375 = peg$literalExpectation("fileg_vel2depth", false),
      peg$c376 = "fil_keytrack",
      peg$c377 = peg$literalExpectation("fil_keytrack", false),
      peg$c378 = "fil_keycenter",
      peg$c379 = peg$literalExpectation("fil_keycenter", false),
      peg$c380 = "fil_veltrack",
      peg$c381 = peg$literalExpectation("fil_veltrack", false),
      peg$c382 = "fil_random",
      peg$c383 = peg$literalExpectation("fil_random", false),
      peg$c384 = "cutoff_cc1",
      peg$c385 = peg$literalExpectation("cutoff_cc1", false),
      peg$c386 = "cutoff_cc2",
      peg$c387 = peg$literalExpectation("cutoff_cc2", false),
      peg$c388 = "cutoff_chanaft",
      peg$c389 = peg$literalExpectation("cutoff_chanaft", false),
      peg$c390 = "cutoff_polyaft",
      peg$c391 = peg$literalExpectation("cutoff_polyaft", false),
      peg$c392 = "pitchlfo_depthcc1",
      peg$c393 = peg$literalExpectation("pitchlfo_depthcc1", false),
      peg$c394 = "pitchlfo_depthcc60",
      peg$c395 = peg$literalExpectation("pitchlfo_depthcc60", false),
      peg$c396 = "pitchlfo_depthchanaft",
      peg$c397 = peg$literalExpectation("pitchlfo_depthchanaft", false),
      peg$c398 = "pitchlfo_depthpolyaft",
      peg$c399 = peg$literalExpectation("pitchlfo_depthpolyaft", false),
      peg$c400 = "pitchlfo_depth",
      peg$c401 = peg$literalExpectation("pitchlfo_depth", false),
      peg$c402 = "pitcheg_vel2depth",
      peg$c403 = peg$literalExpectation("pitcheg_vel2depth", false),
      peg$c404 = "amp_keycenter",
      peg$c405 = peg$literalExpectation("amp_keycenter", false),
      peg$c406 = "output",
      peg$c407 = peg$literalExpectation("output", false),
      peg$c408 = "xfin_lokey",
      peg$c409 = peg$literalExpectation("xfin_lokey", false),
      peg$c410 = "xfin_hikey",
      peg$c411 = peg$literalExpectation("xfin_hikey", false),
      peg$c412 = "xfin_lovel",
      peg$c413 = peg$literalExpectation("xfin_lovel", false),
      peg$c414 = "xfin_hivel",
      peg$c415 = peg$literalExpectation("xfin_hivel", false),
      peg$c416 = "xfout_lovel",
      peg$c417 = peg$literalExpectation("xfout_lovel", false),
      peg$c418 = "xfout_hivel",
      peg$c419 = peg$literalExpectation("xfout_hivel", false),
      peg$c420 = function(n, i) { return n + i },
      peg$c421 = peg$otherExpectation("sequential float opcode"),
      peg$c422 = "fillfo_freqcc",
      peg$c423 = peg$literalExpectation("fillfo_freqcc", false),
      peg$c424 = "gain_cc",
      peg$c425 = peg$literalExpectation("gain_cc", false),
      peg$c426 = "ampeg_delaycc",
      peg$c427 = peg$literalExpectation("ampeg_delaycc", false),
      peg$c428 = "ampeg_startcc",
      peg$c429 = peg$literalExpectation("ampeg_startcc", false),
      peg$c430 = "ampeg_attackcc",
      peg$c431 = peg$literalExpectation("ampeg_attackcc", false),
      peg$c432 = "ampeg_holdcc",
      peg$c433 = peg$literalExpectation("ampeg_holdcc", false),
      peg$c434 = "ampeg_decaycc",
      peg$c435 = peg$literalExpectation("ampeg_decaycc", false),
      peg$c436 = "ampeg_sustaincc",
      peg$c437 = peg$literalExpectation("ampeg_sustaincc", false),
      peg$c438 = "ampeg_releasecc",
      peg$c439 = peg$literalExpectation("ampeg_releasecc", false),
      peg$c440 = "amplfo_depthcc",
      peg$c441 = peg$literalExpectation("amplfo_depthcc", false),
      peg$c442 = "amplfo_freqcc",
      peg$c443 = peg$literalExpectation("amplfo_freqcc", false),
      peg$c444 = "eq1_freqcc",
      peg$c445 = peg$literalExpectation("eq1_freqcc", false),
      peg$c446 = "eq2_freqcc",
      peg$c447 = peg$literalExpectation("eq2_freqcc", false),
      peg$c448 = "eq3_freqcc",
      peg$c449 = peg$literalExpectation("eq3_freqcc", false),
      peg$c450 = "eq1_bwcc",
      peg$c451 = peg$literalExpectation("eq1_bwcc", false),
      peg$c452 = "eq2_bwcc",
      peg$c453 = peg$literalExpectation("eq2_bwcc", false),
      peg$c454 = "eq3_bwcc",
      peg$c455 = peg$literalExpectation("eq3_bwcc", false),
      peg$c456 = "eq1_gaincc",
      peg$c457 = peg$literalExpectation("eq1_gaincc", false),
      peg$c458 = "eq2_gaincc",
      peg$c459 = peg$literalExpectation("eq2_gaincc", false),
      peg$c460 = "eq3_gaincc",
      peg$c461 = peg$literalExpectation("eq3_gaincc", false),
      peg$c462 = "amp_velcurve_",
      peg$c463 = peg$literalExpectation("amp_velcurve_", false),
      peg$c464 = "fillfo_depthcc",
      peg$c465 = peg$literalExpectation("fillfo_depthcc", false),
      peg$c466 = "xfin_locc",
      peg$c467 = peg$literalExpectation("xfin_locc", false),
      peg$c468 = "xfin_hicc",
      peg$c469 = peg$literalExpectation("xfin_hicc", false),
      peg$c470 = "xfout_locc",
      peg$c471 = peg$literalExpectation("xfout_locc", false),
      peg$c472 = "xfout_hicc",
      peg$c473 = peg$literalExpectation("xfout_hicc", false),
      peg$c474 = "delay_cc",
      peg$c475 = peg$literalExpectation("delay_cc", false),
      peg$c476 = "offset_cc",
      peg$c477 = peg$literalExpectation("offset_cc", false),
      peg$c478 = "pitchlfo_depthcc",
      peg$c479 = peg$literalExpectation("pitchlfo_depthcc", false),
      peg$c480 = "pitchlfo_freqcc",
      peg$c481 = peg$literalExpectation("pitchlfo_freqcc", false),
      peg$c482 = "cutoff_cc",
      peg$c483 = peg$literalExpectation("cutoff_cc", false),
      peg$c484 = "loop_mode",
      peg$c485 = peg$literalExpectation("loop_mode", false),
      peg$c486 = "no_loop",
      peg$c487 = peg$literalExpectation("no_loop", false),
      peg$c488 = "one_shot",
      peg$c489 = peg$literalExpectation("one_shot", false),
      peg$c490 = "loop_continuous",
      peg$c491 = peg$literalExpectation("loop_continuous", false),
      peg$c492 = "loop_sustain",
      peg$c493 = peg$literalExpectation("loop_sustain", false),
      peg$c494 = function(value) { return { loop_mode: value } },
      peg$c495 = /^[0-9]/,
      peg$c496 = peg$classExpectation([["0", "9"]], false, false),
      peg$c497 = /^[1-9]/,
      peg$c498 = peg$classExpectation([["1", "9"]], false, false),
      peg$c499 = /^[eE]/,
      peg$c500 = peg$classExpectation(["e", "E"], false, false),
      peg$c501 = /^[\-+]/,
      peg$c502 = peg$classExpectation(["-", "+"], false, false),
      peg$c503 = function(sign, digits) {
          sign = sign || ""
          return parseInt(sign + digits.join(""), 10)
        },
      peg$c504 = ".",
      peg$c505 = peg$literalExpectation(".", false),
      peg$c506 = function(parts) {
            return parseFloat(parts);
          },
      peg$c507 = function(parts) { return parseFloat(parts); },
      peg$c508 = "0",
      peg$c509 = peg$literalExpectation("0", false),
      peg$c510 = function(sign, decimal) {
         sign = sign || ""
        return parseFloat(sign + decimal)
       },
      peg$c511 = function(pitch, accidental, octave) {
          return (pitch + accidental) + (octave + 1) * 12
        },
      peg$c512 = /^[a-gA-G]/,
      peg$c513 = peg$classExpectation([["a", "g"], ["A", "G"]], false, false),
      peg$c514 = function(note) {
          var pitches = {
            "c": 0,
            "d": 2,
            "e": 4,
            "f": 5,
            "g": 7,
            "a": 9,
            "b": 11
          }
          return pitches[note.toLowerCase()]
        },
      peg$c515 = /^[#b]/,
      peg$c516 = peg$classExpectation(["#", "b"], false, false),
      peg$c517 = function(accidental) {
          switch (accidental) {
            case "#":
              return 1
            case "b":
              return -1
            default:
              return 0
          }
        },
      peg$c518 = function(name, ext) { return name + ext },
      peg$c519 = function(c) { return c },
      peg$c520 = function(chars) {
         return chars.join("")
       },
      peg$c521 = "../",
      peg$c522 = peg$literalExpectation("../", false),
      peg$c523 = ".wav",
      peg$c524 = peg$literalExpectation(".wav", false),
      peg$c525 = ".ogg",
      peg$c526 = peg$literalExpectation(".ogg", false),
      peg$c527 = ".mp3",
      peg$c528 = peg$literalExpectation(".mp3", false),
      peg$c529 = peg$otherExpectation("whitespace"),
      peg$c530 = /^[\t\x0B\f \xA0\uFEFF]/,
      peg$c531 = peg$classExpectation(["\t", "\x0B", "\f", " ", "\xA0", "\uFEFF"], false, false),
      peg$c532 = /^[\n\r\u2028\u2029]/,
      peg$c533 = peg$classExpectation(["\n", "\r", "\u2028", "\u2029"], false, false),
      peg$c534 = peg$otherExpectation("end of line"),
      peg$c535 = "\n",
      peg$c536 = peg$literalExpectation("\n", false),
      peg$c537 = "\r\n",
      peg$c538 = peg$literalExpectation("\r\n", false),
      peg$c539 = "\r",
      peg$c540 = peg$literalExpectation("\r", false),
      peg$c541 = "\u2028",
      peg$c542 = peg$literalExpectation("\u2028", false),
      peg$c543 = "\u2029",
      peg$c544 = peg$literalExpectation("\u2029", false),
      peg$c545 = peg$otherExpectation("comment"),
      peg$c546 = "/*",
      peg$c547 = peg$literalExpectation("/*", false),
      peg$c548 = "*/",
      peg$c549 = peg$literalExpectation("*/", false),
      peg$c550 = "//",
      peg$c551 = peg$literalExpectation("//", false),
      peg$c552 = /^[ \xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]/,
      peg$c553 = peg$classExpectation([" ", "\xA0", "\u1680", "\u180E", "\u2000", "\u2001", "\u2002", "\u2003", "\u2004", "\u2005", "\u2006", "\u2007", "\u2008", "\u2009", "\u200A", "\u202F", "\u205F", "\u3000"], false, false),
      peg$c554 = ";",
      peg$c555 = peg$literalExpectation(";", false),
      peg$c556 = "}",
      peg$c557 = peg$literalExpectation("}", false),
      peg$c558 = "<control>",
      peg$c559 = peg$literalExpectation("<control>", false),
      peg$c560 = "hint_ram_based",
      peg$c561 = peg$literalExpectation("hint_ram_based", false),
      peg$c562 = "global_volume",
      peg$c563 = peg$literalExpectation("global_volume", false),
      peg$c564 = "lfo06_freq",
      peg$c565 = peg$literalExpectation("lfo06_freq", false),
      peg$c566 = "lfo06_pitch",
      peg$c567 = peg$literalExpectation("lfo06_pitch", false),
      peg$c568 = "lfo06_wave",
      peg$c569 = peg$literalExpectation("lfo06_wave", false),
      peg$c570 = "lfo06_pitch_oncc129",
      peg$c571 = peg$literalExpectation("lfo06_pitch_oncc129", false),
      peg$c572 = "set_cc",
      peg$c573 = peg$literalExpectation("set_cc", false),
      peg$c574 = "lfo06_pitch_oncc",
      peg$c575 = peg$literalExpectation("lfo06_pitch_oncc", false),
      peg$c576 = "amplitude_oncc",
      peg$c577 = peg$literalExpectation("amplitude_oncc", false),
      peg$c578 = "amplitude_curvecc",
      peg$c579 = peg$literalExpectation("amplitude_curvecc", false),
      peg$c580 = "region_label=",
      peg$c581 = peg$literalExpectation("region_label=", false),
      peg$c582 = function(value) { return { region_label: value } },
      peg$c583 = "default_path=",
      peg$c584 = peg$literalExpectation("default_path=", false),
      peg$c585 = function(value) { return { default_path: value } },
      peg$c586 = "v",
      peg$c587 = peg$literalExpectation("v", false),
      peg$c588 = function(digits, value) {
          var param = {}
          var name = "v" + digits.join("")
          param[name] = value
          return param
        },
      peg$c589 = "eg",
      peg$c590 = peg$literalExpectation("eg", false),
      peg$c591 = "_cutoff=",
      peg$c592 = peg$literalExpectation("_cutoff=", false),
      peg$c593 = function(digits, value) {
          var param = {}
          var name = "eg" + digits.join("")
          param[name] = value
          return param
        },
      peg$c594 = "_sustain=",
      peg$c595 = peg$literalExpectation("_sustain=", false),
      peg$c596 = "_pitch=",
      peg$c597 = peg$literalExpectation("_pitch=", false),
      peg$c598 = "_time",
      peg$c599 = peg$literalExpectation("_time", false),
      peg$c600 = function(digits, node, value) {
          var param = {}
          var name = "eg" + digits.join("") + "_time" + node
          param[name] = value
          return param
        },
      peg$c601 = "_level",
      peg$c602 = peg$literalExpectation("_level", false),
      peg$c603 = function(digits, node, value) {
          var param = {}
          var name = "eg" + digits.join("") + "_level" + node
          param[name] = value
          return param
        },
      peg$c604 = "_shape",
      peg$c605 = peg$literalExpectation("_shape", false),
      peg$c606 = function(digits, node, value) {
          var param = {}
          var name = "eg" + digits.join("") + "_shape" + node
          param[name] = value
          return param
        },
      peg$c607 = "lfo",
      peg$c608 = peg$literalExpectation("lfo", false),
      peg$c609 = "_wave=",
      peg$c610 = peg$literalExpectation("_wave=", false),
      peg$c611 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_wave"
          param[name] = value
          return param
        },
      peg$c612 = "_freq=",
      peg$c613 = peg$literalExpectation("_freq=", false),
      peg$c614 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_freq"
          param[name] = value
          return param
        },
      peg$c615 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_pitch"
          param[name] = value
          return param
        },
      peg$c616 = "_delay=",
      peg$c617 = peg$literalExpectation("_delay=", false),
      peg$c618 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_delay"
          param[name] = value
          return param
        },
      peg$c619 = "_amplitude=",
      peg$c620 = peg$literalExpectation("_amplitude=", false),
      peg$c621 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_amplitude"
          param[name] = value
          return param
        },
      peg$c622 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_cutoff"
          param[name] = value
          return param
        },
      peg$c623 = "_phase=",
      peg$c624 = peg$literalExpectation("_phase=", false),
      peg$c625 = function(digits, value) {
          var param = {}
          var name = "lfo" + digits.join("") + "_phase"
          param[name] = value
          return param
        },

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleFunctions)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$parsestart() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parse__();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseInstrument();
      if (s2 !== peg$FAILED) {
        s3 = peg$parse__();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c0(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseInstrument() {
    var s0, s1;

    s0 = peg$currPos;
    s1 = peg$parseSourceElements();
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c1(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseSourceElements() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    s1 = peg$parseSourceElement();
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$parse__();
      if (s4 !== peg$FAILED) {
        s5 = peg$parseSourceElement();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$parse__();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceElement();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c2(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSourceElement() {
    var s0;

    s0 = peg$parseComment();
    if (s0 === peg$FAILED) {
      s0 = peg$parseHeader();
      if (s0 === peg$FAILED) {
        s0 = peg$parseOpcodeDirective();
      }
    }

    return s0;
  }

  function peg$parseSourceCharacter() {
    var s0;

    if (input.length > peg$currPos) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c3); }
    }

    return s0;
  }

  function peg$parseHeader() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$parseGlobal();
    if (s0 === peg$FAILED) {
      s0 = peg$parseMaster();
      if (s0 === peg$FAILED) {
        s0 = peg$parseRegion();
        if (s0 === peg$FAILED) {
          s0 = peg$parseGroup();
          if (s0 === peg$FAILED) {
            s0 = peg$parseCurve();
            if (s0 === peg$FAILED) {
              s0 = peg$parseAriaCustomHeader();
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c4); }
    }

    return s0;
  }

  function peg$parseGlobal() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c5) {
      s0 = peg$c5;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c6); }
    }

    return s0;
  }

  function peg$parseMaster() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c7) {
      s0 = peg$c7;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c8); }
    }

    return s0;
  }

  function peg$parseRegion() {
    var s0;

    if (input.substr(peg$currPos, 8) === peg$c9) {
      s0 = peg$c9;
      peg$currPos += 8;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c10); }
    }

    return s0;
  }

  function peg$parseGroup() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c11) {
      s0 = peg$c11;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c12); }
    }

    return s0;
  }

  function peg$parseCurve() {
    var s0;

    if (input.substr(peg$currPos, 7) === peg$c13) {
      s0 = peg$c13;
      peg$currPos += 7;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c14); }
    }

    return s0;
  }

  function peg$parseOpcodeDirective() {
    var s0, s1, s2;

    peg$silentFails++;
    s0 = peg$currPos;
    if (input.substr(peg$currPos, 7) === peg$c16) {
      s1 = peg$c16;
      peg$currPos += 7;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c17); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseFilepath();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c18(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      if (input.substr(peg$currPos, 4) === peg$c19) {
        s1 = peg$c19;
        peg$currPos += 4;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c20); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseMidiNoteValue();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c21(s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        if (input.substr(peg$currPos, 7) === peg$c22) {
          s1 = peg$c22;
          peg$currPos += 7;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c23); }
        }
        if (s1 !== peg$FAILED) {
          if (input.substr(peg$currPos, 7) === peg$c24) {
            s2 = peg$c24;
            peg$currPos += 7;
          } else {
            s2 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c25); }
          }
          if (s2 === peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c26) {
              s2 = peg$c26;
              peg$currPos += 8;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c27); }
            }
          }
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c28(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          if (input.substr(peg$currPos, 11) === peg$c29) {
            s1 = peg$c29;
            peg$currPos += 11;
          } else {
            s1 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c30); }
          }
          if (s1 !== peg$FAILED) {
            if (input.substr(peg$currPos, 6) === peg$c31) {
              s2 = peg$c31;
              peg$currPos += 6;
            } else {
              s2 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c32); }
            }
            if (s2 === peg$FAILED) {
              if (input.substr(peg$currPos, 7) === peg$c33) {
                s2 = peg$c33;
                peg$currPos += 7;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c34); }
              }
              if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 5) === peg$c35) {
                  s2 = peg$c35;
                  peg$currPos += 5;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c36); }
                }
                if (s2 === peg$FAILED) {
                  if (input.substr(peg$currPos, 6) === peg$c37) {
                    s2 = peg$c37;
                    peg$currPos += 6;
                  } else {
                    s2 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c38); }
                  }
                }
              }
            }
            if (s2 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c39(s2);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
          if (s0 === peg$FAILED) {
            s0 = peg$currPos;
            if (input.substr(peg$currPos, 9) === peg$c40) {
              s1 = peg$c40;
              peg$currPos += 9;
            } else {
              s1 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c41); }
            }
            if (s1 !== peg$FAILED) {
              if (input.substr(peg$currPos, 4) === peg$c42) {
                s2 = peg$c42;
                peg$currPos += 4;
              } else {
                s2 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c43); }
              }
              if (s2 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c44) {
                  s2 = peg$c44;
                  peg$currPos += 6;
                } else {
                  s2 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c45); }
                }
              }
              if (s2 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c46(s2);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseDelayCcDirective();
              if (s0 === peg$FAILED) {
                s0 = peg$parseOffsetCcDirective();
                if (s0 === peg$FAILED) {
                  s0 = peg$parseLoopModeDirective();
                  if (s0 === peg$FAILED) {
                    s0 = peg$parsePitchLfoDepthCcDirective();
                    if (s0 === peg$FAILED) {
                      s0 = peg$parsePitchLfoFreqCcDirective();
                      if (s0 === peg$FAILED) {
                        s0 = peg$currPos;
                        if (input.substr(peg$currPos, 9) === peg$c47) {
                          s1 = peg$c47;
                          peg$currPos += 9;
                        } else {
                          s1 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c48); }
                        }
                        if (s1 !== peg$FAILED) {
                          if (input.substr(peg$currPos, 6) === peg$c49) {
                            s2 = peg$c49;
                            peg$currPos += 6;
                          } else {
                            s2 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c50); }
                          }
                          if (s2 === peg$FAILED) {
                            if (input.substr(peg$currPos, 6) === peg$c51) {
                              s2 = peg$c51;
                              peg$currPos += 6;
                            } else {
                              s2 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c52); }
                            }
                            if (s2 === peg$FAILED) {
                              if (input.substr(peg$currPos, 6) === peg$c53) {
                                s2 = peg$c53;
                                peg$currPos += 6;
                              } else {
                                s2 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c54); }
                              }
                              if (s2 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c55) {
                                  s2 = peg$c55;
                                  peg$currPos += 6;
                                } else {
                                  s2 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c56); }
                                }
                                if (s2 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 6) === peg$c57) {
                                    s2 = peg$c57;
                                    peg$currPos += 6;
                                  } else {
                                    s2 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c58); }
                                  }
                                  if (s2 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c59) {
                                      s2 = peg$c59;
                                      peg$currPos += 6;
                                    } else {
                                      s2 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c60); }
                                    }
                                  }
                                }
                              }
                            }
                          }
                          if (s2 !== peg$FAILED) {
                            peg$savedPos = s0;
                            s1 = peg$c61(s2);
                            s0 = s1;
                          } else {
                            peg$currPos = s0;
                            s0 = peg$FAILED;
                          }
                        } else {
                          peg$currPos = s0;
                          s0 = peg$FAILED;
                        }
                        if (s0 === peg$FAILED) {
                          s0 = peg$parseCutoffCcDirective();
                          if (s0 === peg$FAILED) {
                            s0 = peg$parseMidiNoteOpcodeDirective();
                            if (s0 === peg$FAILED) {
                              s0 = peg$parseFloatOpcodeDirective();
                              if (s0 === peg$FAILED) {
                                s0 = peg$parseIntegerOpcodeDirective();
                                if (s0 === peg$FAILED) {
                                  s0 = peg$parseCurveOpcodeDirective();
                                  if (s0 === peg$FAILED) {
                                    s0 = peg$parseSequentialFloatDirective();
                                    if (s0 === peg$FAILED) {
                                      s0 = peg$parseSequentialIntegerDirective();
                                      if (s0 === peg$FAILED) {
                                        s0 = peg$parseAriaDefaultPathOpcode();
                                        if (s0 === peg$FAILED) {
                                          s0 = peg$parseAriaCustomTextOpcode();
                                          if (s0 === peg$FAILED) {
                                            s0 = peg$parseAriaCurveOpcode();
                                            if (s0 === peg$FAILED) {
                                              s0 = peg$parseFlexEgOpcode();
                                              if (s0 === peg$FAILED) {
                                                s0 = peg$parseLfoOpcode();
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c15); }
    }

    return s0;
  }

  function peg$parseMidiNoteOpcodeDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseMidiNoteOpcode();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseMidiNoteValue();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFloatOpcodeDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseFloatOpcode();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedDecimalLiteral();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseIntegerOpcodeDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseIntegerOpcode();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCurveOpcodeDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseCurveOpcode();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c65) {
          s3 = peg$c65;
          peg$currPos += 4;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c66); }
        }
        if (s3 === peg$FAILED) {
          if (input.substr(peg$currPos, 5) === peg$c67) {
            s3 = peg$c67;
            peg$currPos += 5;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c68); }
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCurveOpcode() {
    var s0;

    if (input.substr(peg$currPos, 11) === peg$c69) {
      s0 = peg$c69;
      peg$currPos += 11;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c70); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 11) === peg$c71) {
        s0 = peg$c71;
        peg$currPos += 11;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c72); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 10) === peg$c73) {
          s0 = peg$c73;
          peg$currPos += 10;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c74); }
        }
      }
    }

    return s0;
  }

  function peg$parseMidiNoteOpcode() {
    var s0, s1;

    peg$silentFails++;
    if (input.substr(peg$currPos, 5) === peg$c76) {
      s0 = peg$c76;
      peg$currPos += 5;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c77); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 5) === peg$c78) {
        s0 = peg$c78;
        peg$currPos += 5;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c79); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 15) === peg$c80) {
          s0 = peg$c80;
          peg$currPos += 15;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c81); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c82) {
            s0 = peg$c82;
            peg$currPos += 8;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c83); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 8) === peg$c84) {
              s0 = peg$c84;
              peg$currPos += 8;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c85); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 7) === peg$c86) {
                s0 = peg$c86;
                peg$currPos += 7;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c87); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 7) === peg$c88) {
                  s0 = peg$c88;
                  peg$currPos += 7;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c89); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 5) === peg$c90) {
                    s0 = peg$c90;
                    peg$currPos += 5;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c91); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 11) === peg$c92) {
                      s0 = peg$c92;
                      peg$currPos += 11;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c93); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 13) === peg$c94) {
                        s0 = peg$c94;
                        peg$currPos += 13;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c95); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 11) === peg$c96) {
                          s0 = peg$c96;
                          peg$currPos += 11;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c97); }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c75); }
    }

    return s0;
  }

  function peg$parseFloatOpcode() {
    var s0, s1;

    peg$silentFails++;
    if (input.substr(peg$currPos, 12) === peg$c99) {
      s0 = peg$c99;
      peg$currPos += 12;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c100); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 11) === peg$c101) {
        s0 = peg$c101;
        peg$currPos += 11;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c102); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c103) {
          s0 = peg$c103;
          peg$currPos += 11;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c104); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 14) === peg$c105) {
            s0 = peg$c105;
            peg$currPos += 14;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c106); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 14) === peg$c107) {
              s0 = peg$c107;
              peg$currPos += 14;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c108); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 6) === peg$c109) {
                s0 = peg$c109;
                peg$currPos += 6;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c110); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 6) === peg$c111) {
                  s0 = peg$c111;
                  peg$currPos += 6;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c112); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 7) === peg$c113) {
                    s0 = peg$c113;
                    peg$currPos += 7;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c114); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 7) === peg$c115) {
                      s0 = peg$c115;
                      peg$currPos += 7;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c116); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 5) === peg$c117) {
                        s0 = peg$c117;
                        peg$currPos += 5;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c118); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 5) === peg$c119) {
                          s0 = peg$c119;
                          peg$currPos += 5;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c120); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 12) === peg$c121) {
                            s0 = peg$c121;
                            peg$currPos += 12;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c122); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 9) === peg$c123) {
                              s0 = peg$c123;
                              peg$currPos += 9;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c124); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 9) === peg$c125) {
                                s0 = peg$c125;
                                peg$currPos += 9;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c126); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 5) === peg$c127) {
                                  s0 = peg$c127;
                                  peg$currPos += 5;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c128); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 10) === peg$c129) {
                                    s0 = peg$c129;
                                    peg$currPos += 10;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c130); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 11) === peg$c131) {
                                      s0 = peg$c131;
                                      peg$currPos += 11;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c132); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 13) === peg$c133) {
                                        s0 = peg$c133;
                                        peg$currPos += 13;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c134); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 13) === peg$c135) {
                                          s0 = peg$c135;
                                          peg$currPos += 13;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c136); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 14) === peg$c137) {
                                            s0 = peg$c137;
                                            peg$currPos += 14;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c138); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 12) === peg$c139) {
                                              s0 = peg$c139;
                                              peg$currPos += 12;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c140); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 13) === peg$c141) {
                                                s0 = peg$c141;
                                                peg$currPos += 13;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c142); }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 15) === peg$c143) {
                                                  s0 = peg$c143;
                                                  peg$currPos += 15;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c144); }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 15) === peg$c145) {
                                                    s0 = peg$c145;
                                                    peg$currPos += 15;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c146); }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 17) === peg$c147) {
                                                      s0 = peg$c147;
                                                      peg$currPos += 17;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c148); }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 18) === peg$c149) {
                                                        s0 = peg$c149;
                                                        peg$currPos += 18;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c150); }
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 16) === peg$c151) {
                                                          s0 = peg$c151;
                                                          peg$currPos += 16;
                                                        } else {
                                                          s0 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c152); }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 17) === peg$c153) {
                                                            s0 = peg$c153;
                                                            peg$currPos += 17;
                                                          } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c154); }
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 19) === peg$c155) {
                                                              s0 = peg$c155;
                                                              peg$currPos += 19;
                                                            } else {
                                                              s0 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c156); }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 14) === peg$c157) {
                                                                s0 = peg$c157;
                                                                peg$currPos += 14;
                                                              } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c158); }
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 13) === peg$c159) {
                                                                  s0 = peg$c159;
                                                                  peg$currPos += 13;
                                                                } else {
                                                                  s0 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c160); }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 16) === peg$c161) {
                                                                    s0 = peg$c161;
                                                                    peg$currPos += 16;
                                                                  } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c162); }
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 17) === peg$c163) {
                                                                      s0 = peg$c163;
                                                                      peg$currPos += 17;
                                                                    } else {
                                                                      s0 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c164); }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 20) === peg$c165) {
                                                                        s0 = peg$c165;
                                                                        peg$currPos += 20;
                                                                      } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c166); }
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 20) === peg$c167) {
                                                                          s0 = peg$c167;
                                                                          peg$currPos += 20;
                                                                        } else {
                                                                          s0 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c168); }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 13) === peg$c169) {
                                                                            s0 = peg$c169;
                                                                            peg$currPos += 13;
                                                                          } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c170); }
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 6) === peg$c171) {
                                                                              s0 = peg$c171;
                                                                              peg$currPos += 6;
                                                                            } else {
                                                                              s0 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c172); }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 9) === peg$c173) {
                                                                                s0 = peg$c173;
                                                                                peg$currPos += 9;
                                                                              } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c174); }
                                                                              }
                                                                              if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 11) === peg$c175) {
                                                                                  s0 = peg$c175;
                                                                                  peg$currPos += 11;
                                                                                } else {
                                                                                  s0 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c176); }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 11) === peg$c177) {
                                                                                    s0 = peg$c177;
                                                                                    peg$currPos += 11;
                                                                                  } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c178); }
                                                                                  }
                                                                                  if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 12) === peg$c179) {
                                                                                      s0 = peg$c179;
                                                                                      peg$currPos += 12;
                                                                                    } else {
                                                                                      s0 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c180); }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                      if (input.substr(peg$currPos, 10) === peg$c181) {
                                                                                        s0 = peg$c181;
                                                                                        peg$currPos += 10;
                                                                                      } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c182); }
                                                                                      }
                                                                                      if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 11) === peg$c183) {
                                                                                          s0 = peg$c183;
                                                                                          peg$currPos += 11;
                                                                                        } else {
                                                                                          s0 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c184); }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                          if (input.substr(peg$currPos, 13) === peg$c185) {
                                                                                            s0 = peg$c185;
                                                                                            peg$currPos += 13;
                                                                                          } else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c186); }
                                                                                          }
                                                                                          if (s0 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 13) === peg$c187) {
                                                                                              s0 = peg$c187;
                                                                                              peg$currPos += 13;
                                                                                            } else {
                                                                                              s0 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c188); }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                              if (input.substr(peg$currPos, 15) === peg$c189) {
                                                                                                s0 = peg$c189;
                                                                                                peg$currPos += 15;
                                                                                              } else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c190); }
                                                                                              }
                                                                                              if (s0 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 16) === peg$c191) {
                                                                                                  s0 = peg$c191;
                                                                                                  peg$currPos += 16;
                                                                                                } else {
                                                                                                  s0 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c192); }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                  if (input.substr(peg$currPos, 14) === peg$c193) {
                                                                                                    s0 = peg$c193;
                                                                                                    peg$currPos += 14;
                                                                                                  } else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c194); }
                                                                                                  }
                                                                                                  if (s0 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 15) === peg$c195) {
                                                                                                      s0 = peg$c195;
                                                                                                      peg$currPos += 15;
                                                                                                    } else {
                                                                                                      s0 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c196); }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                      if (input.substr(peg$currPos, 17) === peg$c197) {
                                                                                                        s0 = peg$c197;
                                                                                                        peg$currPos += 17;
                                                                                                      } else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c198); }
                                                                                                      }
                                                                                                      if (s0 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 17) === peg$c199) {
                                                                                                          s0 = peg$c199;
                                                                                                          peg$currPos += 17;
                                                                                                        } else {
                                                                                                          s0 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c200); }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                          if (input.substr(peg$currPos, 6) === peg$c201) {
                                                                                                            s0 = peg$c201;
                                                                                                            peg$currPos += 6;
                                                                                                          } else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c202); }
                                                                                                          }
                                                                                                          if (s0 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 3) === peg$c203) {
                                                                                                              s0 = peg$c203;
                                                                                                              peg$currPos += 3;
                                                                                                            } else {
                                                                                                              s0 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c204); }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                              if (input.substr(peg$currPos, 5) === peg$c205) {
                                                                                                                s0 = peg$c205;
                                                                                                                peg$currPos += 5;
                                                                                                              } else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c206); }
                                                                                                              }
                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 8) === peg$c207) {
                                                                                                                  s0 = peg$c207;
                                                                                                                  peg$currPos += 8;
                                                                                                                } else {
                                                                                                                  s0 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c208); }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c209) {
                                                                                                                    s0 = peg$c209;
                                                                                                                    peg$currPos += 12;
                                                                                                                  } else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c210); }
                                                                                                                  }
                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 12) === peg$c211) {
                                                                                                                      s0 = peg$c211;
                                                                                                                      peg$currPos += 12;
                                                                                                                    } else {
                                                                                                                      s0 = peg$FAILED;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c212); }
                                                                                                                    }
                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                      if (input.substr(peg$currPos, 14) === peg$c213) {
                                                                                                                        s0 = peg$c213;
                                                                                                                        peg$currPos += 14;
                                                                                                                      } else {
                                                                                                                        s0 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c214); }
                                                                                                                      }
                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                        if (input.substr(peg$currPos, 16) === peg$c215) {
                                                                                                                          s0 = peg$c215;
                                                                                                                          peg$currPos += 16;
                                                                                                                        } else {
                                                                                                                          s0 = peg$FAILED;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c216); }
                                                                                                                        }
                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                          if (input.substr(peg$currPos, 10) === peg$c217) {
                                                                                                                            s0 = peg$c217;
                                                                                                                            peg$currPos += 10;
                                                                                                                          } else {
                                                                                                                            s0 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c218); }
                                                                                                                          }
                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                            if (input.substr(peg$currPos, 8) === peg$c219) {
                                                                                                                              s0 = peg$c219;
                                                                                                                              peg$currPos += 8;
                                                                                                                            } else {
                                                                                                                              s0 = peg$FAILED;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c220); }
                                                                                                                            }
                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                              if (input.substr(peg$currPos, 11) === peg$c221) {
                                                                                                                                s0 = peg$c221;
                                                                                                                                peg$currPos += 11;
                                                                                                                              } else {
                                                                                                                                s0 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c222); }
                                                                                                                              }
                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                if (input.substr(peg$currPos, 11) === peg$c223) {
                                                                                                                                  s0 = peg$c223;
                                                                                                                                  peg$currPos += 11;
                                                                                                                                } else {
                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c224); }
                                                                                                                                }
                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c225) {
                                                                                                                                    s0 = peg$c225;
                                                                                                                                    peg$currPos += 12;
                                                                                                                                  } else {
                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c226); }
                                                                                                                                  }
                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                    if (input.substr(peg$currPos, 10) === peg$c227) {
                                                                                                                                      s0 = peg$c227;
                                                                                                                                      peg$currPos += 10;
                                                                                                                                    } else {
                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c228); }
                                                                                                                                    }
                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                      if (input.substr(peg$currPos, 11) === peg$c229) {
                                                                                                                                        s0 = peg$c229;
                                                                                                                                        peg$currPos += 11;
                                                                                                                                      } else {
                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c230); }
                                                                                                                                      }
                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                        if (input.substr(peg$currPos, 13) === peg$c231) {
                                                                                                                                          s0 = peg$c231;
                                                                                                                                          peg$currPos += 13;
                                                                                                                                        } else {
                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c232); }
                                                                                                                                        }
                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                          if (input.substr(peg$currPos, 13) === peg$c233) {
                                                                                                                                            s0 = peg$c233;
                                                                                                                                            peg$currPos += 13;
                                                                                                                                          } else {
                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c234); }
                                                                                                                                          }
                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                            if (input.substr(peg$currPos, 15) === peg$c235) {
                                                                                                                                              s0 = peg$c235;
                                                                                                                                              peg$currPos += 15;
                                                                                                                                            } else {
                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c236); }
                                                                                                                                            }
                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                              if (input.substr(peg$currPos, 16) === peg$c237) {
                                                                                                                                                s0 = peg$c237;
                                                                                                                                                peg$currPos += 16;
                                                                                                                                              } else {
                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c238); }
                                                                                                                                              }
                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                if (input.substr(peg$currPos, 14) === peg$c239) {
                                                                                                                                                  s0 = peg$c239;
                                                                                                                                                  peg$currPos += 14;
                                                                                                                                                } else {
                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c240); }
                                                                                                                                                }
                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                  if (input.substr(peg$currPos, 15) === peg$c241) {
                                                                                                                                                    s0 = peg$c241;
                                                                                                                                                    peg$currPos += 15;
                                                                                                                                                  } else {
                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c242); }
                                                                                                                                                  }
                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                    if (input.substr(peg$currPos, 17) === peg$c243) {
                                                                                                                                                      s0 = peg$c243;
                                                                                                                                                      peg$currPos += 17;
                                                                                                                                                    } else {
                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c244); }
                                                                                                                                                    }
                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                      if (input.substr(peg$currPos, 17) === peg$c245) {
                                                                                                                                                        s0 = peg$c245;
                                                                                                                                                        peg$currPos += 17;
                                                                                                                                                      } else {
                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c246); }
                                                                                                                                                      }
                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                        if (input.substr(peg$currPos, 12) === peg$c247) {
                                                                                                                                                          s0 = peg$c247;
                                                                                                                                                          peg$currPos += 12;
                                                                                                                                                        } else {
                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c248); }
                                                                                                                                                        }
                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                          if (input.substr(peg$currPos, 11) === peg$c249) {
                                                                                                                                                            s0 = peg$c249;
                                                                                                                                                            peg$currPos += 11;
                                                                                                                                                          } else {
                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c250); }
                                                                                                                                                          }
                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                            if (input.substr(peg$currPos, 19) === peg$c251) {
                                                                                                                                                              s0 = peg$c251;
                                                                                                                                                              peg$currPos += 19;
                                                                                                                                                            } else {
                                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c252); }
                                                                                                                                                            }
                                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                                              if (input.substr(peg$currPos, 19) === peg$c253) {
                                                                                                                                                                s0 = peg$c253;
                                                                                                                                                                peg$currPos += 19;
                                                                                                                                                              } else {
                                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c254); }
                                                                                                                                                              }
                                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                                if (input.substr(peg$currPos, 12) === peg$c255) {
                                                                                                                                                                  s0 = peg$c255;
                                                                                                                                                                  peg$currPos += 12;
                                                                                                                                                                } else {
                                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c256); }
                                                                                                                                                                }
                                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                                  if (input.substr(peg$currPos, 18) === peg$c257) {
                                                                                                                                                                    s0 = peg$c257;
                                                                                                                                                                    peg$currPos += 18;
                                                                                                                                                                  } else {
                                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c258); }
                                                                                                                                                                  }
                                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                                    if (input.substr(peg$currPos, 18) === peg$c259) {
                                                                                                                                                                      s0 = peg$c259;
                                                                                                                                                                      peg$currPos += 18;
                                                                                                                                                                    } else {
                                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c260); }
                                                                                                                                                                    }
                                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                                      if (input.substr(peg$currPos, 11) === peg$c261) {
                                                                                                                                                                        s0 = peg$c261;
                                                                                                                                                                        peg$currPos += 11;
                                                                                                                                                                      } else {
                                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c262); }
                                                                                                                                                                      }
                                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                                        if (input.substr(peg$currPos, 8) === peg$c263) {
                                                                                                                                                                          s0 = peg$c263;
                                                                                                                                                                          peg$currPos += 8;
                                                                                                                                                                        } else {
                                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c264); }
                                                                                                                                                                        }
                                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                                          if (input.substr(peg$currPos, 8) === peg$c265) {
                                                                                                                                                                            s0 = peg$c265;
                                                                                                                                                                            peg$currPos += 8;
                                                                                                                                                                          } else {
                                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c266); }
                                                                                                                                                                          }
                                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                                            if (input.substr(peg$currPos, 8) === peg$c267) {
                                                                                                                                                                              s0 = peg$c267;
                                                                                                                                                                              peg$currPos += 8;
                                                                                                                                                                            } else {
                                                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c268); }
                                                                                                                                                                            }
                                                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                                                              if (input.substr(peg$currPos, 12) === peg$c269) {
                                                                                                                                                                                s0 = peg$c269;
                                                                                                                                                                                peg$currPos += 12;
                                                                                                                                                                              } else {
                                                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c270); }
                                                                                                                                                                              }
                                                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                                                if (input.substr(peg$currPos, 12) === peg$c271) {
                                                                                                                                                                                  s0 = peg$c271;
                                                                                                                                                                                  peg$currPos += 12;
                                                                                                                                                                                } else {
                                                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c272); }
                                                                                                                                                                                }
                                                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c273) {
                                                                                                                                                                                    s0 = peg$c273;
                                                                                                                                                                                    peg$currPos += 12;
                                                                                                                                                                                  } else {
                                                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c274); }
                                                                                                                                                                                  }
                                                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                                                    if (input.substr(peg$currPos, 6) === peg$c275) {
                                                                                                                                                                                      s0 = peg$c275;
                                                                                                                                                                                      peg$currPos += 6;
                                                                                                                                                                                    } else {
                                                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c276); }
                                                                                                                                                                                    }
                                                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                                                      if (input.substr(peg$currPos, 6) === peg$c277) {
                                                                                                                                                                                        s0 = peg$c277;
                                                                                                                                                                                        peg$currPos += 6;
                                                                                                                                                                                      } else {
                                                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c278); }
                                                                                                                                                                                      }
                                                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                                                        if (input.substr(peg$currPos, 6) === peg$c279) {
                                                                                                                                                                                          s0 = peg$c279;
                                                                                                                                                                                          peg$currPos += 6;
                                                                                                                                                                                        } else {
                                                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c280); }
                                                                                                                                                                                        }
                                                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                                                          if (input.substr(peg$currPos, 8) === peg$c281) {
                                                                                                                                                                                            s0 = peg$c281;
                                                                                                                                                                                            peg$currPos += 8;
                                                                                                                                                                                          } else {
                                                                                                                                                                                            s0 = peg$FAILED;
                                                                                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c282); }
                                                                                                                                                                                          }
                                                                                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                                                                                            if (input.substr(peg$currPos, 8) === peg$c283) {
                                                                                                                                                                                              s0 = peg$c283;
                                                                                                                                                                                              peg$currPos += 8;
                                                                                                                                                                                            } else {
                                                                                                                                                                                              s0 = peg$FAILED;
                                                                                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c284); }
                                                                                                                                                                                            }
                                                                                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                                                                                              if (input.substr(peg$currPos, 8) === peg$c285) {
                                                                                                                                                                                                s0 = peg$c285;
                                                                                                                                                                                                peg$currPos += 8;
                                                                                                                                                                                              } else {
                                                                                                                                                                                                s0 = peg$FAILED;
                                                                                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c286); }
                                                                                                                                                                                              }
                                                                                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                                                                                if (input.substr(peg$currPos, 12) === peg$c287) {
                                                                                                                                                                                                  s0 = peg$c287;
                                                                                                                                                                                                  peg$currPos += 12;
                                                                                                                                                                                                } else {
                                                                                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c288); }
                                                                                                                                                                                                }
                                                                                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                                                                                  if (input.substr(peg$currPos, 12) === peg$c289) {
                                                                                                                                                                                                    s0 = peg$c289;
                                                                                                                                                                                                    peg$currPos += 12;
                                                                                                                                                                                                  } else {
                                                                                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c290); }
                                                                                                                                                                                                  }
                                                                                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                                                                                    if (input.substr(peg$currPos, 12) === peg$c291) {
                                                                                                                                                                                                      s0 = peg$c291;
                                                                                                                                                                                                      peg$currPos += 12;
                                                                                                                                                                                                    } else {
                                                                                                                                                                                                      s0 = peg$FAILED;
                                                                                                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c292); }
                                                                                                                                                                                                    }
                                                                                                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                                                                                                      if (input.substr(peg$currPos, 7) === peg$c293) {
                                                                                                                                                                                                        s0 = peg$c293;
                                                                                                                                                                                                        peg$currPos += 7;
                                                                                                                                                                                                      } else {
                                                                                                                                                                                                        s0 = peg$FAILED;
                                                                                                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c294); }
                                                                                                                                                                                                      }
                                                                                                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                                                                                                        if (input.substr(peg$currPos, 7) === peg$c295) {
                                                                                                                                                                                                          s0 = peg$c295;
                                                                                                                                                                                                          peg$currPos += 7;
                                                                                                                                                                                                        } else {
                                                                                                                                                                                                          s0 = peg$FAILED;
                                                                                                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c296); }
                                                                                                                                                                                                        }
                                                                                                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                                                                                                          s0 = peg$parseAriaCustomFloatOpcode();
                                                                                                                                                                                                        }
                                                                                                                                                                                                      }
                                                                                                                                                                                                    }
                                                                                                                                                                                                  }
                                                                                                                                                                                                }
                                                                                                                                                                                              }
                                                                                                                                                                                            }
                                                                                                                                                                                          }
                                                                                                                                                                                        }
                                                                                                                                                                                      }
                                                                                                                                                                                    }
                                                                                                                                                                                  }
                                                                                                                                                                                }
                                                                                                                                                                              }
                                                                                                                                                                            }
                                                                                                                                                                          }
                                                                                                                                                                        }
                                                                                                                                                                      }
                                                                                                                                                                    }
                                                                                                                                                                  }
                                                                                                                                                                }
                                                                                                                                                              }
                                                                                                                                                            }
                                                                                                                                                          }
                                                                                                                                                        }
                                                                                                                                                      }
                                                                                                                                                    }
                                                                                                                                                  }
                                                                                                                                                }
                                                                                                                                              }
                                                                                                                                            }
                                                                                                                                          }
                                                                                                                                        }
                                                                                                                                      }
                                                                                                                                    }
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c98); }
    }

    return s0;
  }

  function peg$parseIntegerOpcode() {
    var s0, s1;

    peg$silentFails++;
    if (input.substr(peg$currPos, 15) === peg$c298) {
      s0 = peg$c298;
      peg$currPos += 15;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c299); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 16) === peg$c300) {
        s0 = peg$c300;
        peg$currPos += 16;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c301); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 18) === peg$c302) {
          s0 = peg$c302;
          peg$currPos += 18;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c303); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 18) === peg$c304) {
            s0 = peg$c304;
            peg$currPos += 18;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c305); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 18) === peg$c302) {
              s0 = peg$c302;
              peg$currPos += 18;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c303); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 18) === peg$c304) {
                s0 = peg$c304;
                peg$currPos += 18;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c305); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 12) === peg$c306) {
                  s0 = peg$c306;
                  peg$currPos += 12;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c307); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 5) === peg$c308) {
                    s0 = peg$c308;
                    peg$currPos += 5;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c309); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 5) === peg$c310) {
                      s0 = peg$c310;
                      peg$currPos += 5;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c311); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 6) === peg$c312) {
                        s0 = peg$c312;
                        peg$currPos += 6;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c313); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 6) === peg$c314) {
                          s0 = peg$c314;
                          peg$currPos += 6;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c315); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 9) === peg$c316) {
                            s0 = peg$c316;
                            peg$currPos += 9;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c317); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 9) === peg$c318) {
                              s0 = peg$c318;
                              peg$currPos += 9;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c319); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 6) === peg$c320) {
                                s0 = peg$c320;
                                peg$currPos += 6;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c321); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 6) === peg$c322) {
                                  s0 = peg$c322;
                                  peg$currPos += 6;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c323); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 6) === peg$c324) {
                                    s0 = peg$c324;
                                    peg$currPos += 6;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c325); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 6) === peg$c326) {
                                      s0 = peg$c326;
                                      peg$currPos += 6;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c327); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 9) === peg$c328) {
                                        s0 = peg$c328;
                                        peg$currPos += 9;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c329); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 9) === peg$c330) {
                                          s0 = peg$c330;
                                          peg$currPos += 9;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c331); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 10) === peg$c332) {
                                            s0 = peg$c332;
                                            peg$currPos += 10;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c333); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 12) === peg$c334) {
                                              s0 = peg$c334;
                                              peg$currPos += 12;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c335); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 5) === peg$c336) {
                                                s0 = peg$c336;
                                                peg$currPos += 5;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c337); }
                                              }
                                              if (s0 === peg$FAILED) {
                                                if (input.substr(peg$currPos, 6) === peg$c338) {
                                                  s0 = peg$c338;
                                                  peg$currPos += 6;
                                                } else {
                                                  s0 = peg$FAILED;
                                                  if (peg$silentFails === 0) { peg$fail(peg$c339); }
                                                }
                                                if (s0 === peg$FAILED) {
                                                  if (input.substr(peg$currPos, 13) === peg$c340) {
                                                    s0 = peg$c340;
                                                    peg$currPos += 13;
                                                  } else {
                                                    s0 = peg$FAILED;
                                                    if (peg$silentFails === 0) { peg$fail(peg$c341); }
                                                  }
                                                  if (s0 === peg$FAILED) {
                                                    if (input.substr(peg$currPos, 10) === peg$c342) {
                                                      s0 = peg$c342;
                                                      peg$currPos += 10;
                                                    } else {
                                                      s0 = peg$FAILED;
                                                      if (peg$silentFails === 0) { peg$fail(peg$c343); }
                                                    }
                                                    if (s0 === peg$FAILED) {
                                                      if (input.substr(peg$currPos, 11) === peg$c344) {
                                                        s0 = peg$c344;
                                                        peg$currPos += 11;
                                                      } else {
                                                        s0 = peg$FAILED;
                                                        if (peg$silentFails === 0) { peg$fail(peg$c345); }
                                                      }
                                                      if (s0 === peg$FAILED) {
                                                        if (input.substr(peg$currPos, 6) === peg$c346) {
                                                          s0 = peg$c346;
                                                          peg$currPos += 6;
                                                        } else {
                                                          s0 = peg$FAILED;
                                                          if (peg$silentFails === 0) { peg$fail(peg$c347); }
                                                        }
                                                        if (s0 === peg$FAILED) {
                                                          if (input.substr(peg$currPos, 3) === peg$c348) {
                                                            s0 = peg$c348;
                                                            peg$currPos += 3;
                                                          } else {
                                                            s0 = peg$FAILED;
                                                            if (peg$silentFails === 0) { peg$fail(peg$c349); }
                                                          }
                                                          if (s0 === peg$FAILED) {
                                                            if (input.substr(peg$currPos, 5) === peg$c350) {
                                                              s0 = peg$c350;
                                                              peg$currPos += 5;
                                                            } else {
                                                              s0 = peg$FAILED;
                                                              if (peg$silentFails === 0) { peg$fail(peg$c351); }
                                                            }
                                                            if (s0 === peg$FAILED) {
                                                              if (input.substr(peg$currPos, 10) === peg$c352) {
                                                                s0 = peg$c352;
                                                                peg$currPos += 10;
                                                              } else {
                                                                s0 = peg$FAILED;
                                                                if (peg$silentFails === 0) { peg$fail(peg$c353); }
                                                              }
                                                              if (s0 === peg$FAILED) {
                                                                if (input.substr(peg$currPos, 8) === peg$c354) {
                                                                  s0 = peg$c354;
                                                                  peg$currPos += 8;
                                                                } else {
                                                                  s0 = peg$FAILED;
                                                                  if (peg$silentFails === 0) { peg$fail(peg$c355); }
                                                                }
                                                                if (s0 === peg$FAILED) {
                                                                  if (input.substr(peg$currPos, 9) === peg$c356) {
                                                                    s0 = peg$c356;
                                                                    peg$currPos += 9;
                                                                  } else {
                                                                    s0 = peg$FAILED;
                                                                    if (peg$silentFails === 0) { peg$fail(peg$c357); }
                                                                  }
                                                                  if (s0 === peg$FAILED) {
                                                                    if (input.substr(peg$currPos, 4) === peg$c358) {
                                                                      s0 = peg$c358;
                                                                      peg$currPos += 4;
                                                                    } else {
                                                                      s0 = peg$FAILED;
                                                                      if (peg$silentFails === 0) { peg$fail(peg$c359); }
                                                                    }
                                                                    if (s0 === peg$FAILED) {
                                                                      if (input.substr(peg$currPos, 4) === peg$c358) {
                                                                        s0 = peg$c358;
                                                                        peg$currPos += 4;
                                                                      } else {
                                                                        s0 = peg$FAILED;
                                                                        if (peg$silentFails === 0) { peg$fail(peg$c359); }
                                                                      }
                                                                      if (s0 === peg$FAILED) {
                                                                        if (input.substr(peg$currPos, 14) === peg$c360) {
                                                                          s0 = peg$c360;
                                                                          peg$currPos += 14;
                                                                        } else {
                                                                          s0 = peg$FAILED;
                                                                          if (peg$silentFails === 0) { peg$fail(peg$c361); }
                                                                        }
                                                                        if (s0 === peg$FAILED) {
                                                                          if (input.substr(peg$currPos, 14) === peg$c362) {
                                                                            s0 = peg$c362;
                                                                            peg$currPos += 14;
                                                                          } else {
                                                                            s0 = peg$FAILED;
                                                                            if (peg$silentFails === 0) { peg$fail(peg$c363); }
                                                                          }
                                                                          if (s0 === peg$FAILED) {
                                                                            if (input.substr(peg$currPos, 12) === peg$c364) {
                                                                              s0 = peg$c364;
                                                                              peg$currPos += 12;
                                                                            } else {
                                                                              s0 = peg$FAILED;
                                                                              if (peg$silentFails === 0) { peg$fail(peg$c365); }
                                                                            }
                                                                            if (s0 === peg$FAILED) {
                                                                              if (input.substr(peg$currPos, 7) === peg$c366) {
                                                                                s0 = peg$c366;
                                                                                peg$currPos += 7;
                                                                              } else {
                                                                                s0 = peg$FAILED;
                                                                                if (peg$silentFails === 0) { peg$fail(peg$c367); }
                                                                              }
                                                                              if (s0 === peg$FAILED) {
                                                                                if (input.substr(peg$currPos, 9) === peg$c368) {
                                                                                  s0 = peg$c368;
                                                                                  peg$currPos += 9;
                                                                                } else {
                                                                                  s0 = peg$FAILED;
                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c369); }
                                                                                }
                                                                                if (s0 === peg$FAILED) {
                                                                                  if (input.substr(peg$currPos, 13) === peg$c370) {
                                                                                    s0 = peg$c370;
                                                                                    peg$currPos += 13;
                                                                                  } else {
                                                                                    s0 = peg$FAILED;
                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c371); }
                                                                                  }
                                                                                  if (s0 === peg$FAILED) {
                                                                                    if (input.substr(peg$currPos, 11) === peg$c372) {
                                                                                      s0 = peg$c372;
                                                                                      peg$currPos += 11;
                                                                                    } else {
                                                                                      s0 = peg$FAILED;
                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c373); }
                                                                                    }
                                                                                    if (s0 === peg$FAILED) {
                                                                                      if (input.substr(peg$currPos, 15) === peg$c374) {
                                                                                        s0 = peg$c374;
                                                                                        peg$currPos += 15;
                                                                                      } else {
                                                                                        s0 = peg$FAILED;
                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c375); }
                                                                                      }
                                                                                      if (s0 === peg$FAILED) {
                                                                                        if (input.substr(peg$currPos, 12) === peg$c376) {
                                                                                          s0 = peg$c376;
                                                                                          peg$currPos += 12;
                                                                                        } else {
                                                                                          s0 = peg$FAILED;
                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c377); }
                                                                                        }
                                                                                        if (s0 === peg$FAILED) {
                                                                                          if (input.substr(peg$currPos, 13) === peg$c378) {
                                                                                            s0 = peg$c378;
                                                                                            peg$currPos += 13;
                                                                                          } else {
                                                                                            s0 = peg$FAILED;
                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c379); }
                                                                                          }
                                                                                          if (s0 === peg$FAILED) {
                                                                                            if (input.substr(peg$currPos, 12) === peg$c380) {
                                                                                              s0 = peg$c380;
                                                                                              peg$currPos += 12;
                                                                                            } else {
                                                                                              s0 = peg$FAILED;
                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c381); }
                                                                                            }
                                                                                            if (s0 === peg$FAILED) {
                                                                                              if (input.substr(peg$currPos, 10) === peg$c382) {
                                                                                                s0 = peg$c382;
                                                                                                peg$currPos += 10;
                                                                                              } else {
                                                                                                s0 = peg$FAILED;
                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c383); }
                                                                                              }
                                                                                              if (s0 === peg$FAILED) {
                                                                                                if (input.substr(peg$currPos, 10) === peg$c384) {
                                                                                                  s0 = peg$c384;
                                                                                                  peg$currPos += 10;
                                                                                                } else {
                                                                                                  s0 = peg$FAILED;
                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c385); }
                                                                                                }
                                                                                                if (s0 === peg$FAILED) {
                                                                                                  if (input.substr(peg$currPos, 10) === peg$c386) {
                                                                                                    s0 = peg$c386;
                                                                                                    peg$currPos += 10;
                                                                                                  } else {
                                                                                                    s0 = peg$FAILED;
                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c387); }
                                                                                                  }
                                                                                                  if (s0 === peg$FAILED) {
                                                                                                    if (input.substr(peg$currPos, 14) === peg$c388) {
                                                                                                      s0 = peg$c388;
                                                                                                      peg$currPos += 14;
                                                                                                    } else {
                                                                                                      s0 = peg$FAILED;
                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c389); }
                                                                                                    }
                                                                                                    if (s0 === peg$FAILED) {
                                                                                                      if (input.substr(peg$currPos, 14) === peg$c390) {
                                                                                                        s0 = peg$c390;
                                                                                                        peg$currPos += 14;
                                                                                                      } else {
                                                                                                        s0 = peg$FAILED;
                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c391); }
                                                                                                      }
                                                                                                      if (s0 === peg$FAILED) {
                                                                                                        if (input.substr(peg$currPos, 17) === peg$c392) {
                                                                                                          s0 = peg$c392;
                                                                                                          peg$currPos += 17;
                                                                                                        } else {
                                                                                                          s0 = peg$FAILED;
                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c393); }
                                                                                                        }
                                                                                                        if (s0 === peg$FAILED) {
                                                                                                          if (input.substr(peg$currPos, 18) === peg$c394) {
                                                                                                            s0 = peg$c394;
                                                                                                            peg$currPos += 18;
                                                                                                          } else {
                                                                                                            s0 = peg$FAILED;
                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c395); }
                                                                                                          }
                                                                                                          if (s0 === peg$FAILED) {
                                                                                                            if (input.substr(peg$currPos, 21) === peg$c396) {
                                                                                                              s0 = peg$c396;
                                                                                                              peg$currPos += 21;
                                                                                                            } else {
                                                                                                              s0 = peg$FAILED;
                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c397); }
                                                                                                            }
                                                                                                            if (s0 === peg$FAILED) {
                                                                                                              if (input.substr(peg$currPos, 21) === peg$c398) {
                                                                                                                s0 = peg$c398;
                                                                                                                peg$currPos += 21;
                                                                                                              } else {
                                                                                                                s0 = peg$FAILED;
                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c399); }
                                                                                                              }
                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                if (input.substr(peg$currPos, 14) === peg$c400) {
                                                                                                                  s0 = peg$c400;
                                                                                                                  peg$currPos += 14;
                                                                                                                } else {
                                                                                                                  s0 = peg$FAILED;
                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c401); }
                                                                                                                }
                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                  if (input.substr(peg$currPos, 17) === peg$c402) {
                                                                                                                    s0 = peg$c402;
                                                                                                                    peg$currPos += 17;
                                                                                                                  } else {
                                                                                                                    s0 = peg$FAILED;
                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c403); }
                                                                                                                  }
                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                    if (input.substr(peg$currPos, 13) === peg$c404) {
                                                                                                                      s0 = peg$c404;
                                                                                                                      peg$currPos += 13;
                                                                                                                    } else {
                                                                                                                      s0 = peg$FAILED;
                                                                                                                      if (peg$silentFails === 0) { peg$fail(peg$c405); }
                                                                                                                    }
                                                                                                                    if (s0 === peg$FAILED) {
                                                                                                                      if (input.substr(peg$currPos, 6) === peg$c406) {
                                                                                                                        s0 = peg$c406;
                                                                                                                        peg$currPos += 6;
                                                                                                                      } else {
                                                                                                                        s0 = peg$FAILED;
                                                                                                                        if (peg$silentFails === 0) { peg$fail(peg$c407); }
                                                                                                                      }
                                                                                                                      if (s0 === peg$FAILED) {
                                                                                                                        if (input.substr(peg$currPos, 10) === peg$c408) {
                                                                                                                          s0 = peg$c408;
                                                                                                                          peg$currPos += 10;
                                                                                                                        } else {
                                                                                                                          s0 = peg$FAILED;
                                                                                                                          if (peg$silentFails === 0) { peg$fail(peg$c409); }
                                                                                                                        }
                                                                                                                        if (s0 === peg$FAILED) {
                                                                                                                          if (input.substr(peg$currPos, 10) === peg$c410) {
                                                                                                                            s0 = peg$c410;
                                                                                                                            peg$currPos += 10;
                                                                                                                          } else {
                                                                                                                            s0 = peg$FAILED;
                                                                                                                            if (peg$silentFails === 0) { peg$fail(peg$c411); }
                                                                                                                          }
                                                                                                                          if (s0 === peg$FAILED) {
                                                                                                                            if (input.substr(peg$currPos, 10) === peg$c412) {
                                                                                                                              s0 = peg$c412;
                                                                                                                              peg$currPos += 10;
                                                                                                                            } else {
                                                                                                                              s0 = peg$FAILED;
                                                                                                                              if (peg$silentFails === 0) { peg$fail(peg$c413); }
                                                                                                                            }
                                                                                                                            if (s0 === peg$FAILED) {
                                                                                                                              if (input.substr(peg$currPos, 10) === peg$c414) {
                                                                                                                                s0 = peg$c414;
                                                                                                                                peg$currPos += 10;
                                                                                                                              } else {
                                                                                                                                s0 = peg$FAILED;
                                                                                                                                if (peg$silentFails === 0) { peg$fail(peg$c415); }
                                                                                                                              }
                                                                                                                              if (s0 === peg$FAILED) {
                                                                                                                                if (input.substr(peg$currPos, 11) === peg$c416) {
                                                                                                                                  s0 = peg$c416;
                                                                                                                                  peg$currPos += 11;
                                                                                                                                } else {
                                                                                                                                  s0 = peg$FAILED;
                                                                                                                                  if (peg$silentFails === 0) { peg$fail(peg$c417); }
                                                                                                                                }
                                                                                                                                if (s0 === peg$FAILED) {
                                                                                                                                  if (input.substr(peg$currPos, 11) === peg$c418) {
                                                                                                                                    s0 = peg$c418;
                                                                                                                                    peg$currPos += 11;
                                                                                                                                  } else {
                                                                                                                                    s0 = peg$FAILED;
                                                                                                                                    if (peg$silentFails === 0) { peg$fail(peg$c419); }
                                                                                                                                  }
                                                                                                                                  if (s0 === peg$FAILED) {
                                                                                                                                    s0 = peg$parseAriaCustomIntegerOpcode();
                                                                                                                                  }
                                                                                                                                }
                                                                                                                              }
                                                                                                                            }
                                                                                                                          }
                                                                                                                        }
                                                                                                                      }
                                                                                                                    }
                                                                                                                  }
                                                                                                                }
                                                                                                              }
                                                                                                            }
                                                                                                          }
                                                                                                        }
                                                                                                      }
                                                                                                    }
                                                                                                  }
                                                                                                }
                                                                                              }
                                                                                            }
                                                                                          }
                                                                                        }
                                                                                      }
                                                                                    }
                                                                                  }
                                                                                }
                                                                              }
                                                                            }
                                                                          }
                                                                        }
                                                                      }
                                                                    }
                                                                  }
                                                                }
                                                              }
                                                            }
                                                          }
                                                        }
                                                      }
                                                    }
                                                  }
                                                }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c297); }
    }

    return s0;
  }

  function peg$parseSequentialFloatDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parseSequentialFloatOpcode();
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedDecimalLiteral();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSequentialIntegerDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$parseSequentialIntegerOpcode();
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedDecimalLiteral();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSequentialFloatOpcode() {
    var s0, s1;

    peg$silentFails++;
    if (input.substr(peg$currPos, 13) === peg$c422) {
      s0 = peg$c422;
      peg$currPos += 13;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c423); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c424) {
        s0 = peg$c424;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c425); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 13) === peg$c426) {
          s0 = peg$c426;
          peg$currPos += 13;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c427); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 13) === peg$c428) {
            s0 = peg$c428;
            peg$currPos += 13;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c429); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 14) === peg$c430) {
              s0 = peg$c430;
              peg$currPos += 14;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c431); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 12) === peg$c432) {
                s0 = peg$c432;
                peg$currPos += 12;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c433); }
              }
              if (s0 === peg$FAILED) {
                if (input.substr(peg$currPos, 13) === peg$c434) {
                  s0 = peg$c434;
                  peg$currPos += 13;
                } else {
                  s0 = peg$FAILED;
                  if (peg$silentFails === 0) { peg$fail(peg$c435); }
                }
                if (s0 === peg$FAILED) {
                  if (input.substr(peg$currPos, 15) === peg$c436) {
                    s0 = peg$c436;
                    peg$currPos += 15;
                  } else {
                    s0 = peg$FAILED;
                    if (peg$silentFails === 0) { peg$fail(peg$c437); }
                  }
                  if (s0 === peg$FAILED) {
                    if (input.substr(peg$currPos, 15) === peg$c438) {
                      s0 = peg$c438;
                      peg$currPos += 15;
                    } else {
                      s0 = peg$FAILED;
                      if (peg$silentFails === 0) { peg$fail(peg$c439); }
                    }
                    if (s0 === peg$FAILED) {
                      if (input.substr(peg$currPos, 14) === peg$c440) {
                        s0 = peg$c440;
                        peg$currPos += 14;
                      } else {
                        s0 = peg$FAILED;
                        if (peg$silentFails === 0) { peg$fail(peg$c441); }
                      }
                      if (s0 === peg$FAILED) {
                        if (input.substr(peg$currPos, 13) === peg$c442) {
                          s0 = peg$c442;
                          peg$currPos += 13;
                        } else {
                          s0 = peg$FAILED;
                          if (peg$silentFails === 0) { peg$fail(peg$c443); }
                        }
                        if (s0 === peg$FAILED) {
                          if (input.substr(peg$currPos, 10) === peg$c444) {
                            s0 = peg$c444;
                            peg$currPos += 10;
                          } else {
                            s0 = peg$FAILED;
                            if (peg$silentFails === 0) { peg$fail(peg$c445); }
                          }
                          if (s0 === peg$FAILED) {
                            if (input.substr(peg$currPos, 10) === peg$c446) {
                              s0 = peg$c446;
                              peg$currPos += 10;
                            } else {
                              s0 = peg$FAILED;
                              if (peg$silentFails === 0) { peg$fail(peg$c447); }
                            }
                            if (s0 === peg$FAILED) {
                              if (input.substr(peg$currPos, 10) === peg$c448) {
                                s0 = peg$c448;
                                peg$currPos += 10;
                              } else {
                                s0 = peg$FAILED;
                                if (peg$silentFails === 0) { peg$fail(peg$c449); }
                              }
                              if (s0 === peg$FAILED) {
                                if (input.substr(peg$currPos, 8) === peg$c450) {
                                  s0 = peg$c450;
                                  peg$currPos += 8;
                                } else {
                                  s0 = peg$FAILED;
                                  if (peg$silentFails === 0) { peg$fail(peg$c451); }
                                }
                                if (s0 === peg$FAILED) {
                                  if (input.substr(peg$currPos, 8) === peg$c452) {
                                    s0 = peg$c452;
                                    peg$currPos += 8;
                                  } else {
                                    s0 = peg$FAILED;
                                    if (peg$silentFails === 0) { peg$fail(peg$c453); }
                                  }
                                  if (s0 === peg$FAILED) {
                                    if (input.substr(peg$currPos, 8) === peg$c454) {
                                      s0 = peg$c454;
                                      peg$currPos += 8;
                                    } else {
                                      s0 = peg$FAILED;
                                      if (peg$silentFails === 0) { peg$fail(peg$c455); }
                                    }
                                    if (s0 === peg$FAILED) {
                                      if (input.substr(peg$currPos, 10) === peg$c456) {
                                        s0 = peg$c456;
                                        peg$currPos += 10;
                                      } else {
                                        s0 = peg$FAILED;
                                        if (peg$silentFails === 0) { peg$fail(peg$c457); }
                                      }
                                      if (s0 === peg$FAILED) {
                                        if (input.substr(peg$currPos, 10) === peg$c458) {
                                          s0 = peg$c458;
                                          peg$currPos += 10;
                                        } else {
                                          s0 = peg$FAILED;
                                          if (peg$silentFails === 0) { peg$fail(peg$c459); }
                                        }
                                        if (s0 === peg$FAILED) {
                                          if (input.substr(peg$currPos, 10) === peg$c460) {
                                            s0 = peg$c460;
                                            peg$currPos += 10;
                                          } else {
                                            s0 = peg$FAILED;
                                            if (peg$silentFails === 0) { peg$fail(peg$c461); }
                                          }
                                          if (s0 === peg$FAILED) {
                                            if (input.substr(peg$currPos, 13) === peg$c462) {
                                              s0 = peg$c462;
                                              peg$currPos += 13;
                                            } else {
                                              s0 = peg$FAILED;
                                              if (peg$silentFails === 0) { peg$fail(peg$c463); }
                                            }
                                            if (s0 === peg$FAILED) {
                                              if (input.substr(peg$currPos, 13) === peg$c462) {
                                                s0 = peg$c462;
                                                peg$currPos += 13;
                                              } else {
                                                s0 = peg$FAILED;
                                                if (peg$silentFails === 0) { peg$fail(peg$c463); }
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c421); }
    }

    return s0;
  }

  function peg$parseSequentialIntegerOpcode() {
    var s0;

    if (input.substr(peg$currPos, 14) === peg$c464) {
      s0 = peg$c464;
      peg$currPos += 14;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c465); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 9) === peg$c466) {
        s0 = peg$c466;
        peg$currPos += 9;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c467); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c468) {
          s0 = peg$c468;
          peg$currPos += 9;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c469); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 10) === peg$c470) {
            s0 = peg$c470;
            peg$currPos += 10;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c471); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 10) === peg$c472) {
              s0 = peg$c472;
              peg$currPos += 10;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c473); }
            }
            if (s0 === peg$FAILED) {
              s0 = peg$parseAriaCustomSequentialIntegerOpcode();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseDelayCcDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 8) === peg$c474) {
      s2 = peg$c474;
      peg$currPos += 8;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c475); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedDecimalLiteral();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseOffsetCcDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 9) === peg$c476) {
      s2 = peg$c476;
      peg$currPos += 9;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c477); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsePitchLfoDepthCcDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 16) === peg$c478) {
      s2 = peg$c478;
      peg$currPos += 16;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c479); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parsePitchLfoFreqCcDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 15) === peg$c480) {
      s2 = peg$c480;
      peg$currPos += 15;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c481); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedDecimalLiteral();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseCutoffCcDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$currPos;
    if (input.substr(peg$currPos, 9) === peg$c482) {
      s2 = peg$c482;
      peg$currPos += 9;
    } else {
      s2 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c483); }
    }
    if (s2 !== peg$FAILED) {
      s3 = peg$parseSignedIntegerAsNumber();
      if (s3 !== peg$FAILED) {
        peg$savedPos = s1;
        s2 = peg$c420(s2, s3);
        s1 = s2;
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
    } else {
      peg$currPos = s1;
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c64(s1, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLoopModeDirective() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 9) === peg$c484) {
      s1 = peg$c484;
      peg$currPos += 9;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c485); }
    }
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 61) {
        s2 = peg$c62;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c63); }
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c486) {
          s3 = peg$c486;
          peg$currPos += 7;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c487); }
        }
        if (s3 === peg$FAILED) {
          if (input.substr(peg$currPos, 8) === peg$c488) {
            s3 = peg$c488;
            peg$currPos += 8;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c489); }
          }
          if (s3 === peg$FAILED) {
            if (input.substr(peg$currPos, 15) === peg$c490) {
              s3 = peg$c490;
              peg$currPos += 15;
            } else {
              s3 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c491); }
            }
            if (s3 === peg$FAILED) {
              if (input.substr(peg$currPos, 12) === peg$c492) {
                s3 = peg$c492;
                peg$currPos += 12;
              } else {
                s3 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c493); }
              }
            }
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c494(s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMidiNoteValue() {
    var s0;

    s0 = peg$parseSignedIntegerAsNumber();
    if (s0 === peg$FAILED) {
      s0 = peg$parseMidiNoteName();
    }

    return s0;
  }

  function peg$parseDecimalDigits() {
    var s0, s1;

    s0 = [];
    s1 = peg$parseDecimalDigit();
    if (s1 !== peg$FAILED) {
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        s1 = peg$parseDecimalDigit();
      }
    } else {
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDecimalDigit() {
    var s0;

    if (peg$c495.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c496); }
    }

    return s0;
  }

  function peg$parseNonZeroDigit() {
    var s0;

    if (peg$c497.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c498); }
    }

    return s0;
  }

  function peg$parseExponentPart() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseExponentIndicator();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseSignedInteger();
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseExponentIndicator() {
    var s0;

    if (peg$c499.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c500); }
    }

    return s0;
  }

  function peg$parseSignedInteger() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (peg$c501.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c502); }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSignedIntegerAsNumber() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (peg$c501.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c502); }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c503(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseDecimalLiteral() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    s1 = peg$currPos;
    s2 = peg$currPos;
    s3 = peg$parseDecimalIntegerLiteral();
    if (s3 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 46) {
        s4 = peg$c504;
        peg$currPos++;
      } else {
        s4 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c505); }
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseDecimalDigits();
        if (s5 === peg$FAILED) {
          s5 = null;
        }
        if (s5 !== peg$FAILED) {
          s6 = peg$parseExponentPart();
          if (s6 === peg$FAILED) {
            s6 = null;
          }
          if (s6 !== peg$FAILED) {
            s3 = [s3, s4, s5, s6];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      s1 = input.substring(s1, peg$currPos);
    } else {
      s1 = s2;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c506(s1);
    }
    s0 = s1;
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 46) {
        s3 = peg$c504;
        peg$currPos++;
      } else {
        s3 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c505); }
      }
      if (s3 !== peg$FAILED) {
        s4 = peg$parseDecimalDigits();
        if (s4 !== peg$FAILED) {
          s5 = peg$parseExponentPart();
          if (s5 === peg$FAILED) {
            s5 = null;
          }
          if (s5 !== peg$FAILED) {
            s3 = [s3, s4, s5];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s1 = input.substring(s1, peg$currPos);
      } else {
        s1 = s2;
      }
      if (s1 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c507(s1);
      }
      s0 = s1;
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$currPos;
        s2 = peg$currPos;
        s3 = peg$parseDecimalIntegerLiteral();
        if (s3 !== peg$FAILED) {
          s4 = peg$parseExponentPart();
          if (s4 === peg$FAILED) {
            s4 = null;
          }
          if (s4 !== peg$FAILED) {
            s3 = [s3, s4];
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
        if (s2 !== peg$FAILED) {
          s1 = input.substring(s1, peg$currPos);
        } else {
          s1 = s2;
        }
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c507(s1);
        }
        s0 = s1;
      }
    }

    return s0;
  }

  function peg$parseDecimalIntegerLiteral() {
    var s0, s1, s2;

    if (input.charCodeAt(peg$currPos) === 48) {
      s0 = peg$c508;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c509); }
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parseNonZeroDigit();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseDecimalDigits();
        if (s2 === peg$FAILED) {
          s2 = null;
        }
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    }

    return s0;
  }

  function peg$parseSignedDecimalLiteral() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (peg$c501.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c502); }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalLiteral();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c510(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMidiNoteName() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parseMidiPitch();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseMidiAccidental();
      if (s2 !== peg$FAILED) {
        s3 = peg$parseSignedIntegerAsNumber();
        if (s3 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c511(s1, s2, s3);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMidiPitch() {
    var s0, s1;

    s0 = peg$currPos;
    if (peg$c512.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c513); }
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c514(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseMidiAccidental() {
    var s0, s1;

    s0 = peg$currPos;
    if (peg$c515.test(input.charAt(peg$currPos))) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c516); }
    }
    if (s1 === peg$FAILED) {
      s1 = null;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c517(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseFilepath() {
    var s0, s1, s2;

    s0 = peg$currPos;
    s1 = peg$parseFilename();
    if (s1 !== peg$FAILED) {
      s2 = peg$parseFileExtension();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c518(s1, s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFilename() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$currPos;
    peg$silentFails++;
    s4 = peg$parseFileExtension();
    peg$silentFails--;
    if (s4 === peg$FAILED) {
      s3 = void 0;
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    if (s3 !== peg$FAILED) {
      s4 = peg$parseSourceCharacter();
      if (s4 !== peg$FAILED) {
        peg$savedPos = s2;
        s3 = peg$c519(s4);
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parseFileExtension();
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = void 0;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSourceCharacter();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c519(s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c520(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parsePath() {
    var s0;

    if (input.substr(peg$currPos, 3) === peg$c521) {
      s0 = peg$c521;
      peg$currPos += 3;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c522); }
    }

    return s0;
  }

  function peg$parseFileExtension() {
    var s0;

    if (input.substr(peg$currPos, 4) === peg$c523) {
      s0 = peg$c523;
      peg$currPos += 4;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c524); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 4) === peg$c525) {
        s0 = peg$c525;
        peg$currPos += 4;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c526); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 4) === peg$c527) {
          s0 = peg$c527;
          peg$currPos += 4;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c528); }
        }
      }
    }

    return s0;
  }

  function peg$parseWhiteSpace() {
    var s0, s1;

    peg$silentFails++;
    if (peg$c530.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c531); }
    }
    if (s0 === peg$FAILED) {
      s0 = peg$parseZs();
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c529); }
    }

    return s0;
  }

  function peg$parseLineTerminator() {
    var s0;

    if (peg$c532.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c533); }
    }

    return s0;
  }

  function peg$parseLineTerminatorSequence() {
    var s0, s1;

    peg$silentFails++;
    if (input.charCodeAt(peg$currPos) === 10) {
      s0 = peg$c535;
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c536); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 2) === peg$c537) {
        s0 = peg$c537;
        peg$currPos += 2;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c538); }
      }
      if (s0 === peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 13) {
          s0 = peg$c539;
          peg$currPos++;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c540); }
        }
        if (s0 === peg$FAILED) {
          if (input.charCodeAt(peg$currPos) === 8232) {
            s0 = peg$c541;
            peg$currPos++;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c542); }
          }
          if (s0 === peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 8233) {
              s0 = peg$c543;
              peg$currPos++;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c544); }
            }
          }
        }
      }
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c534); }
    }

    return s0;
  }

  function peg$parseComment() {
    var s0, s1;

    peg$silentFails++;
    s0 = peg$parseMultiLineComment();
    if (s0 === peg$FAILED) {
      s0 = peg$parseSingleLineComment();
    }
    peg$silentFails--;
    if (s0 === peg$FAILED) {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c545); }
    }

    return s0;
  }

  function peg$parseMultiLineComment() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c546) {
      s1 = peg$c546;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c547); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c548) {
        s5 = peg$c548;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c549); }
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = void 0;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseSourceCharacter();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c548) {
          s5 = peg$c548;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c549); }
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c548) {
          s3 = peg$c548;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c549); }
        }
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseMultiLineCommentNoLineTerminator() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c546) {
      s1 = peg$c546;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c547); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      if (input.substr(peg$currPos, 2) === peg$c548) {
        s5 = peg$c548;
        peg$currPos += 2;
      } else {
        s5 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c549); }
      }
      if (s5 === peg$FAILED) {
        s5 = peg$parseLineTerminator();
      }
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = void 0;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseSourceCharacter();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        if (input.substr(peg$currPos, 2) === peg$c548) {
          s5 = peg$c548;
          peg$currPos += 2;
        } else {
          s5 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c549); }
        }
        if (s5 === peg$FAILED) {
          s5 = peg$parseLineTerminator();
        }
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 2) === peg$c548) {
          s3 = peg$c548;
          peg$currPos += 2;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c549); }
        }
        if (s3 !== peg$FAILED) {
          s1 = [s1, s2, s3];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseSingleLineComment() {
    var s0, s1, s2, s3, s4, s5;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c550) {
      s1 = peg$c550;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c551); }
    }
    if (s1 !== peg$FAILED) {
      s2 = [];
      s3 = peg$currPos;
      s4 = peg$currPos;
      peg$silentFails++;
      s5 = peg$parseLineTerminator();
      peg$silentFails--;
      if (s5 === peg$FAILED) {
        s4 = void 0;
      } else {
        peg$currPos = s4;
        s4 = peg$FAILED;
      }
      if (s4 !== peg$FAILED) {
        s5 = peg$parseSourceCharacter();
        if (s5 !== peg$FAILED) {
          s4 = [s4, s5];
          s3 = s4;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      } else {
        peg$currPos = s3;
        s3 = peg$FAILED;
      }
      while (s3 !== peg$FAILED) {
        s2.push(s3);
        s3 = peg$currPos;
        s4 = peg$currPos;
        peg$silentFails++;
        s5 = peg$parseLineTerminator();
        peg$silentFails--;
        if (s5 === peg$FAILED) {
          s4 = void 0;
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseSourceCharacter();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseZs() {
    var s0;

    if (peg$c552.test(input.charAt(peg$currPos))) {
      s0 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c553); }
    }

    return s0;
  }

  function peg$parseEOS() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parse__();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 59) {
        s2 = peg$c554;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c555); }
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLineTerminatorSequence();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 125) {
            s3 = peg$c556;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c557); }
          }
          peg$silentFails--;
          if (s3 !== peg$FAILED) {
            peg$currPos = s2;
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse__();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseEOF();
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }
    }

    return s0;
  }

  function peg$parseEOSNoLineTerminator() {
    var s0, s1, s2, s3;

    s0 = peg$currPos;
    s1 = peg$parse_();
    if (s1 !== peg$FAILED) {
      if (input.charCodeAt(peg$currPos) === 59) {
        s2 = peg$c554;
        peg$currPos++;
      } else {
        s2 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c555); }
      }
      if (s2 !== peg$FAILED) {
        s1 = [s1, s2];
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }
    if (s0 === peg$FAILED) {
      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLineTerminatorSequence();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$currPos;
          peg$silentFails++;
          if (input.charCodeAt(peg$currPos) === 125) {
            s3 = peg$c556;
            peg$currPos++;
          } else {
            s3 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c557); }
          }
          peg$silentFails--;
          if (s3 !== peg$FAILED) {
            peg$currPos = s2;
            s2 = void 0;
          } else {
            s2 = peg$FAILED;
          }
          if (s2 !== peg$FAILED) {
            s1 = [s1, s2];
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parse_();
          if (s1 !== peg$FAILED) {
            s2 = peg$parseEOF();
            if (s2 !== peg$FAILED) {
              s1 = [s1, s2];
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        }
      }
    }

    return s0;
  }

  function peg$parseEOF() {
    var s0, s1;

    s0 = peg$currPos;
    peg$silentFails++;
    if (input.length > peg$currPos) {
      s1 = input.charAt(peg$currPos);
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c3); }
    }
    peg$silentFails--;
    if (s1 === peg$FAILED) {
      s0 = void 0;
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parse_() {
    var s0, s1;

    s0 = [];
    s1 = peg$parseWhiteSpace();
    if (s1 === peg$FAILED) {
      s1 = peg$parseMultiLineCommentNoLineTerminator();
      if (s1 === peg$FAILED) {
        s1 = peg$parseSingleLineComment();
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseMultiLineCommentNoLineTerminator();
        if (s1 === peg$FAILED) {
          s1 = peg$parseSingleLineComment();
        }
      }
    }

    return s0;
  }

  function peg$parse__() {
    var s0, s1;

    s0 = [];
    s1 = peg$parseWhiteSpace();
    if (s1 === peg$FAILED) {
      s1 = peg$parseLineTerminatorSequence();
      if (s1 === peg$FAILED) {
        s1 = peg$parseComment();
      }
    }
    while (s1 !== peg$FAILED) {
      s0.push(s1);
      s1 = peg$parseWhiteSpace();
      if (s1 === peg$FAILED) {
        s1 = peg$parseLineTerminatorSequence();
        if (s1 === peg$FAILED) {
          s1 = peg$parseComment();
        }
      }
    }

    return s0;
  }

  function peg$parseAriaCustomHeader() {
    var s0;

    if (input.substr(peg$currPos, 9) === peg$c558) {
      s0 = peg$c558;
      peg$currPos += 9;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c559); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 7) === peg$c13) {
        s0 = peg$c13;
        peg$currPos += 7;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c14); }
      }
    }

    return s0;
  }

  function peg$parseAriaCustomIntegerOpcode() {
    var s0;

    if (input.substr(peg$currPos, 14) === peg$c560) {
      s0 = peg$c560;
      peg$currPos += 14;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c561); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 13) === peg$c562) {
        s0 = peg$c562;
        peg$currPos += 13;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c563); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 10) === peg$c564) {
          s0 = peg$c564;
          peg$currPos += 10;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c565); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 11) === peg$c566) {
            s0 = peg$c566;
            peg$currPos += 11;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c567); }
          }
          if (s0 === peg$FAILED) {
            if (input.substr(peg$currPos, 10) === peg$c568) {
              s0 = peg$c568;
              peg$currPos += 10;
            } else {
              s0 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c569); }
            }
            if (s0 === peg$FAILED) {
              if (input.substr(peg$currPos, 19) === peg$c570) {
                s0 = peg$c570;
                peg$currPos += 19;
              } else {
                s0 = peg$FAILED;
                if (peg$silentFails === 0) { peg$fail(peg$c571); }
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseAriaCustomFloatOpcode() {
    var s0;

    if (input.substr(peg$currPos, 10) === peg$c564) {
      s0 = peg$c564;
      peg$currPos += 10;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c565); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 13) === peg$c562) {
        s0 = peg$c562;
        peg$currPos += 13;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c563); }
      }
    }

    return s0;
  }

  function peg$parseAriaCustomSequentialIntegerOpcode() {
    var s0;

    if (input.substr(peg$currPos, 6) === peg$c572) {
      s0 = peg$c572;
      peg$currPos += 6;
    } else {
      s0 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c573); }
    }
    if (s0 === peg$FAILED) {
      if (input.substr(peg$currPos, 16) === peg$c574) {
        s0 = peg$c574;
        peg$currPos += 16;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c575); }
      }
      if (s0 === peg$FAILED) {
        if (input.substr(peg$currPos, 14) === peg$c576) {
          s0 = peg$c576;
          peg$currPos += 14;
        } else {
          s0 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c577); }
        }
        if (s0 === peg$FAILED) {
          if (input.substr(peg$currPos, 17) === peg$c578) {
            s0 = peg$c578;
            peg$currPos += 17;
          } else {
            s0 = peg$FAILED;
            if (peg$silentFails === 0) { peg$fail(peg$c579); }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseAriaCustomTextOpcode() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 13) === peg$c580) {
      s1 = peg$c580;
      peg$currPos += 13;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c581); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseLabel();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c582(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseAriaDefaultPathOpcode() {
    var s0, s1, s2;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 13) === peg$c583) {
      s1 = peg$c583;
      peg$currPos += 13;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c584); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parsePath();
      if (s2 !== peg$FAILED) {
        peg$savedPos = s0;
        s1 = peg$c585(s2);
        s0 = s1;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLabel() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    s1 = [];
    s2 = peg$currPos;
    s3 = peg$currPos;
    peg$silentFails++;
    s4 = peg$parseLineTerminatorSequence();
    peg$silentFails--;
    if (s4 === peg$FAILED) {
      s3 = void 0;
    } else {
      peg$currPos = s3;
      s3 = peg$FAILED;
    }
    if (s3 !== peg$FAILED) {
      s4 = peg$parseSourceCharacter();
      if (s4 !== peg$FAILED) {
        peg$savedPos = s2;
        s3 = peg$c519(s4);
        s2 = s3;
      } else {
        peg$currPos = s2;
        s2 = peg$FAILED;
      }
    } else {
      peg$currPos = s2;
      s2 = peg$FAILED;
    }
    if (s2 !== peg$FAILED) {
      while (s2 !== peg$FAILED) {
        s1.push(s2);
        s2 = peg$currPos;
        s3 = peg$currPos;
        peg$silentFails++;
        s4 = peg$parseLineTerminatorSequence();
        peg$silentFails--;
        if (s4 === peg$FAILED) {
          s3 = void 0;
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSourceCharacter();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s2;
            s3 = peg$c519(s4);
            s2 = s3;
          } else {
            peg$currPos = s2;
            s2 = peg$FAILED;
          }
        } else {
          peg$currPos = s2;
          s2 = peg$FAILED;
        }
      }
    } else {
      s1 = peg$FAILED;
    }
    if (s1 !== peg$FAILED) {
      peg$savedPos = s0;
      s1 = peg$c520(s1);
    }
    s0 = s1;

    return s0;
  }

  function peg$parseAriaCurveOpcode() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.charCodeAt(peg$currPos) === 118) {
      s1 = peg$c586;
      peg$currPos++;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c587); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.charCodeAt(peg$currPos) === 61) {
          s3 = peg$c62;
          peg$currPos++;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c63); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c588(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFlexEgOpcode() {
    var s0;

    s0 = peg$parseFlexEgCutoff();
    if (s0 === peg$FAILED) {
      s0 = peg$parseFlexEgSustain();
      if (s0 === peg$FAILED) {
        s0 = peg$parseFlexEgPitch();
        if (s0 === peg$FAILED) {
          s0 = peg$parseFlexEgTime();
          if (s0 === peg$FAILED) {
            s0 = peg$parseFlexEgLevel();
            if (s0 === peg$FAILED) {
              s0 = peg$parseFlexEgShape();
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseFlexEgCutoff() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c589) {
      s1 = peg$c589;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c590); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c591) {
          s3 = peg$c591;
          peg$currPos += 8;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c592); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c593(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFlexEgSustain() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c589) {
      s1 = peg$c589;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c590); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 9) === peg$c594) {
          s3 = peg$c594;
          peg$currPos += 9;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c595); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c593(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFlexEgPitch() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c589) {
      s1 = peg$c589;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c590); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c596) {
          s3 = peg$c596;
          peg$currPos += 7;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c597); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c593(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFlexEgTime() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c589) {
      s1 = peg$c589;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c590); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 5) === peg$c598) {
          s3 = peg$c598;
          peg$currPos += 5;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c599); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedIntegerAsNumber();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c62;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseSignedDecimalLiteral();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c600(s2, s4, s6);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFlexEgLevel() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c589) {
      s1 = peg$c589;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c590); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c601) {
          s3 = peg$c601;
          peg$currPos += 6;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c602); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedIntegerAsNumber();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c62;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseSignedDecimalLiteral();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c603(s2, s4, s6);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseFlexEgShape() {
    var s0, s1, s2, s3, s4, s5, s6;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 2) === peg$c589) {
      s1 = peg$c589;
      peg$currPos += 2;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c590); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c604) {
          s3 = peg$c604;
          peg$currPos += 6;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c605); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedIntegerAsNumber();
          if (s4 !== peg$FAILED) {
            if (input.charCodeAt(peg$currPos) === 61) {
              s5 = peg$c62;
              peg$currPos++;
            } else {
              s5 = peg$FAILED;
              if (peg$silentFails === 0) { peg$fail(peg$c63); }
            }
            if (s5 !== peg$FAILED) {
              s6 = peg$parseSignedIntegerAsNumber();
              if (s6 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c606(s2, s4, s6);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoOpcode() {
    var s0;

    s0 = peg$parseLfoWave();
    if (s0 === peg$FAILED) {
      s0 = peg$parseLfoFreq();
      if (s0 === peg$FAILED) {
        s0 = peg$parseLfoPitch();
        if (s0 === peg$FAILED) {
          s0 = peg$parseLfoDelay();
          if (s0 === peg$FAILED) {
            s0 = peg$parseLfoAmplitude();
            if (s0 === peg$FAILED) {
              s0 = peg$parseLfoCutoff();
              if (s0 === peg$FAILED) {
                s0 = peg$parseLfoPhase();
              }
            }
          }
        }
      }
    }

    return s0;
  }

  function peg$parseLfoWave() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c609) {
          s3 = peg$c609;
          peg$currPos += 6;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c610); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedIntegerAsNumber();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c611(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoFreq() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 6) === peg$c612) {
          s3 = peg$c612;
          peg$currPos += 6;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c613); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c614(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoPitch() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c596) {
          s3 = peg$c596;
          peg$currPos += 7;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c597); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedIntegerAsNumber();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c615(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoDelay() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c616) {
          s3 = peg$c616;
          peg$currPos += 7;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c617); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c618(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoAmplitude() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 11) === peg$c619) {
          s3 = peg$c619;
          peg$currPos += 11;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c620); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c621(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoCutoff() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 8) === peg$c591) {
          s3 = peg$c591;
          peg$currPos += 8;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c592); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c622(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  function peg$parseLfoPhase() {
    var s0, s1, s2, s3, s4;

    s0 = peg$currPos;
    if (input.substr(peg$currPos, 3) === peg$c607) {
      s1 = peg$c607;
      peg$currPos += 3;
    } else {
      s1 = peg$FAILED;
      if (peg$silentFails === 0) { peg$fail(peg$c608); }
    }
    if (s1 !== peg$FAILED) {
      s2 = peg$parseDecimalDigits();
      if (s2 !== peg$FAILED) {
        if (input.substr(peg$currPos, 7) === peg$c623) {
          s3 = peg$c623;
          peg$currPos += 7;
        } else {
          s3 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c624); }
        }
        if (s3 !== peg$FAILED) {
          s4 = peg$parseSignedDecimalLiteral();
          if (s4 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c625(s2, s4);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
    } else {
      peg$currPos = s0;
      s0 = peg$FAILED;
    }

    return s0;
  }

  peg$result = peg$startRuleFunction();

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};

},{}],20:[function(require,module,exports){
var  Parameter = require("./parameter")
  , _ = require("underscore")

function extend(target, source){
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

Region = function(opts){
  this.sample = {}
  this.inputControls = {}
  this.performanceParameters = {}
  _.extend(this, opts)
  _.defaults(this, Parameter.defaultValues)
}

module.exports = Region

},{"./parameter":18,"underscore":2}],21:[function(require,module,exports){
var sfz = {
  name: 'sfz'
}
  , Parser = require("./parser")

sfz.Instrument = require("./instrument")

sfz.parse = function(str, driver, audioContext){
  var instrumentDefinition = Parser.parse(str)
  console.log('instrumentDefinition', instrumentDefinition);
  if (driver) instrumentDefinition.driver = driver
  if (audioContext) instrumentDefinition.audioContext = audioContext
  return new sfz.Instrument(instrumentDefinition)
}


module.exports = sfz

},{"./instrument":16,"./parser":19}]},{},[1])(1)
});
