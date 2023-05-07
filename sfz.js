(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Sfz"] = factory();
	else
		root["Sfz"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/base64-js/index.js":
/*!*****************************************!*\
  !*** ./node_modules/base64-js/index.js ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

// Support decoding URL-safe base64 strings, as Node.js does.
// See: https://en.wikipedia.org/wiki/Base64#URL_applications
revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function getLens (b64) {
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // Trim off extra bytes after placeholder bytes are found
  // See: https://github.com/beatgammit/base64-js/issues/42
  var validLen = b64.indexOf('=')
  if (validLen === -1) validLen = len

  var placeHoldersLen = validLen === len
    ? 0
    : 4 - (validLen % 4)

  return [validLen, placeHoldersLen]
}

// base64 is 4/3 + up to two characters of the original data
function byteLength (b64) {
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function _byteLength (b64, validLen, placeHoldersLen) {
  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
}

function toByteArray (b64) {
  var tmp
  var lens = getLens(b64)
  var validLen = lens[0]
  var placeHoldersLen = lens[1]

  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen))

  var curByte = 0

  // if there are placeholders, only get up to the last complete 4 chars
  var len = placeHoldersLen > 0
    ? validLen - 4
    : validLen

  var i
  for (i = 0; i < len; i += 4) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 18) |
      (revLookup[b64.charCodeAt(i + 1)] << 12) |
      (revLookup[b64.charCodeAt(i + 2)] << 6) |
      revLookup[b64.charCodeAt(i + 3)]
    arr[curByte++] = (tmp >> 16) & 0xFF
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 2) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 2) |
      (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[curByte++] = tmp & 0xFF
  }

  if (placeHoldersLen === 1) {
    tmp =
      (revLookup[b64.charCodeAt(i)] << 10) |
      (revLookup[b64.charCodeAt(i + 1)] << 4) |
      (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[curByte++] = (tmp >> 8) & 0xFF
    arr[curByte++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] +
    lookup[num >> 12 & 0x3F] +
    lookup[num >> 6 & 0x3F] +
    lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp =
      ((uint8[i] << 16) & 0xFF0000) +
      ((uint8[i + 1] << 8) & 0xFF00) +
      (uint8[i + 2] & 0xFF)
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    parts.push(
      lookup[tmp >> 2] +
      lookup[(tmp << 4) & 0x3F] +
      '=='
    )
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1]
    parts.push(
      lookup[tmp >> 10] +
      lookup[(tmp >> 4) & 0x3F] +
      lookup[(tmp << 2) & 0x3F] +
      '='
    )
  }

  return parts.join('')
}


/***/ }),

/***/ "./node_modules/buffer/index.js":
/*!**************************************!*\
  !*** ./node_modules/buffer/index.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



const base64 = __webpack_require__(/*! base64-js */ "./node_modules/base64-js/index.js")
const ieee754 = __webpack_require__(/*! ieee754 */ "./node_modules/ieee754/index.js")
const customInspectSymbol =
  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
    : null

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

const K_MAX_LENGTH = 0x7fffffff
exports.kMaxLength = K_MAX_LENGTH

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
 *               implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * We report that the browser does not support typed arrays if the are not subclassable
 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
 * for __proto__ and has a buggy typed array implementation.
 */
Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport()

if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
    typeof console.error === 'function') {
  console.error(
    'This browser lacks typed array (Uint8Array) support which is required by ' +
    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
  )
}

function typedArraySupport () {
  // Can typed array instances can be augmented?
  try {
    const arr = new Uint8Array(1)
    const proto = { foo: function () { return 42 } }
    Object.setPrototypeOf(proto, Uint8Array.prototype)
    Object.setPrototypeOf(arr, proto)
    return arr.foo() === 42
  } catch (e) {
    return false
  }
}

Object.defineProperty(Buffer.prototype, 'parent', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.buffer
  }
})

Object.defineProperty(Buffer.prototype, 'offset', {
  enumerable: true,
  get: function () {
    if (!Buffer.isBuffer(this)) return undefined
    return this.byteOffset
  }
})

function createBuffer (length) {
  if (length > K_MAX_LENGTH) {
    throw new RangeError('The value "' + length + '" is invalid for option "size"')
  }
  // Return an augmented `Uint8Array` instance
  const buf = new Uint8Array(length)
  Object.setPrototypeOf(buf, Buffer.prototype)
  return buf
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new TypeError(
        'The "string" argument must be of type string. Received type number'
      )
    }
    return allocUnsafe(arg)
  }
  return from(arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

function from (value, encodingOrOffset, length) {
  if (typeof value === 'string') {
    return fromString(value, encodingOrOffset)
  }

  if (ArrayBuffer.isView(value)) {
    return fromArrayView(value)
  }

  if (value == null) {
    throw new TypeError(
      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
      'or Array-like Object. Received type ' + (typeof value)
    )
  }

  if (isInstance(value, ArrayBuffer) ||
      (value && isInstance(value.buffer, ArrayBuffer))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof SharedArrayBuffer !== 'undefined' &&
      (isInstance(value, SharedArrayBuffer) ||
      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
    return fromArrayBuffer(value, encodingOrOffset, length)
  }

  if (typeof value === 'number') {
    throw new TypeError(
      'The "value" argument must not be of type number. Received type number'
    )
  }

  const valueOf = value.valueOf && value.valueOf()
  if (valueOf != null && valueOf !== value) {
    return Buffer.from(valueOf, encodingOrOffset, length)
  }

  const b = fromObject(value)
  if (b) return b

  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
      typeof value[Symbol.toPrimitive] === 'function') {
    return Buffer.from(value[Symbol.toPrimitive]('string'), encodingOrOffset, length)
  }

  throw new TypeError(
    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
    'or Array-like Object. Received type ' + (typeof value)
  )
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(value, encodingOrOffset, length)
}

// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
// https://github.com/feross/buffer/pull/148
Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype)
Object.setPrototypeOf(Buffer, Uint8Array)

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be of type number')
  } else if (size < 0) {
    throw new RangeError('The value "' + size + '" is invalid for option "size"')
  }
}

function alloc (size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpreted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(size).fill(fill, encoding)
      : createBuffer(size).fill(fill)
  }
  return createBuffer(size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(size, fill, encoding)
}

function allocUnsafe (size) {
  assertSize(size)
  return createBuffer(size < 0 ? 0 : checked(size) | 0)
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(size)
}

function fromString (string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('Unknown encoding: ' + encoding)
  }

  const length = byteLength(string, encoding) | 0
  let buf = createBuffer(length)

  const actual = buf.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    buf = buf.slice(0, actual)
  }

  return buf
}

function fromArrayLike (array) {
  const length = array.length < 0 ? 0 : checked(array.length) | 0
  const buf = createBuffer(length)
  for (let i = 0; i < length; i += 1) {
    buf[i] = array[i] & 255
  }
  return buf
}

function fromArrayView (arrayView) {
  if (isInstance(arrayView, Uint8Array)) {
    const copy = new Uint8Array(arrayView)
    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
  }
  return fromArrayLike(arrayView)
}

function fromArrayBuffer (array, byteOffset, length) {
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('"offset" is outside of buffer bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('"length" is outside of buffer bounds')
  }

  let buf
  if (byteOffset === undefined && length === undefined) {
    buf = new Uint8Array(array)
  } else if (length === undefined) {
    buf = new Uint8Array(array, byteOffset)
  } else {
    buf = new Uint8Array(array, byteOffset, length)
  }

  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(buf, Buffer.prototype)

  return buf
}

function fromObject (obj) {
  if (Buffer.isBuffer(obj)) {
    const len = checked(obj.length) | 0
    const buf = createBuffer(len)

    if (buf.length === 0) {
      return buf
    }

    obj.copy(buf, 0, 0, len)
    return buf
  }

  if (obj.length !== undefined) {
    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
      return createBuffer(0)
    }
    return fromArrayLike(obj)
  }

  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
    return fromArrayLike(obj.data)
  }
}

function checked (length) {
  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= K_MAX_LENGTH) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return b != null && b._isBuffer === true &&
    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
}

Buffer.compare = function compare (a, b) {
  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength)
  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength)
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError(
      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
    )
  }

  if (a === b) return 0

  let x = a.length
  let y = b.length

  for (let i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!Array.isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  let i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  const buffer = Buffer.allocUnsafe(length)
  let pos = 0
  for (i = 0; i < list.length; ++i) {
    let buf = list[i]
    if (isInstance(buf, Uint8Array)) {
      if (pos + buf.length > buffer.length) {
        if (!Buffer.isBuffer(buf)) buf = Buffer.from(buf)
        buf.copy(buffer, pos)
      } else {
        Uint8Array.prototype.set.call(
          buffer,
          buf,
          pos
        )
      }
    } else if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    } else {
      buf.copy(buffer, pos)
    }
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    throw new TypeError(
      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
      'Received type ' + typeof string
    )
  }

  const len = string.length
  const mustMatch = (arguments.length > 2 && arguments[2] === true)
  if (!mustMatch && len === 0) return 0

  // Use a for loop to avoid recursion
  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) {
          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
        }
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  let loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
// reliably in a browserify context because there could be multiple different
// copies of the 'buffer' package in use. This method works even for Buffer
// instances that were created from another copy of the `buffer` package.
// See: https://github.com/feross/buffer/issues/154
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  const i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  const len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (let i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  const len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (let i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  const len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (let i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  const length = this.length
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.toLocaleString = Buffer.prototype.toString

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  let str = ''
  const max = exports.INSPECT_MAX_BYTES
  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim()
  if (this.length > max) str += ' ... '
  return '<Buffer ' + str + '>'
}
if (customInspectSymbol) {
  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (isInstance(target, Uint8Array)) {
    target = Buffer.from(target, target.offset, target.byteLength)
  }
  if (!Buffer.isBuffer(target)) {
    throw new TypeError(
      'The "target" argument must be one of type Buffer or Uint8Array. ' +
      'Received type ' + (typeof target)
    )
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  let x = thisEnd - thisStart
  let y = end - start
  const len = Math.min(x, y)

  const thisCopy = this.slice(thisStart, thisEnd)
  const targetCopy = target.slice(start, end)

  for (let i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset // Coerce to Number.
  if (numberIsNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  let indexSize = 1
  let arrLength = arr.length
  let valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  let i
  if (dir) {
    let foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      let found = true
      for (let j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  const remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  const strLen = string.length

  if (length > strLen / 2) {
    length = strLen / 2
  }
  let i
  for (i = 0; i < length; ++i) {
    const parsed = parseInt(string.substr(i * 2, 2), 16)
    if (numberIsNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset >>> 0
    if (isFinite(length)) {
      length = length >>> 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  const remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  let loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
      case 'latin1':
      case 'binary':
        return asciiWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  const res = []

  let i = start
  while (i < end) {
    const firstByte = buf[i]
    let codePoint = null
    let bytesPerSequence = (firstByte > 0xEF)
      ? 4
      : (firstByte > 0xDF)
          ? 3
          : (firstByte > 0xBF)
              ? 2
              : 1

    if (i + bytesPerSequence <= end) {
      let secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
const MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  const len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  let res = ''
  let i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  let ret = ''
  end = Math.min(buf.length, end)

  for (let i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  const len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  let out = ''
  for (let i = start; i < end; ++i) {
    out += hexSliceLookupTable[buf[i]]
  }
  return out
}

function utf16leSlice (buf, start, end) {
  const bytes = buf.slice(start, end)
  let res = ''
  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
  for (let i = 0; i < bytes.length - 1; i += 2) {
    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256))
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  const len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  const newBuf = this.subarray(start, end)
  // Return an augmented `Uint8Array` instance
  Object.setPrototypeOf(newBuf, Buffer.prototype)

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUintLE =
Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUintBE =
Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  let val = this[offset + --byteLength]
  let mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUint8 =
Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUint16LE =
Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUint16BE =
Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUint32LE =
Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUint32BE =
Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const lo = first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24

  const hi = this[++offset] +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    last * 2 ** 24

  return BigInt(lo) + (BigInt(hi) << BigInt(32))
})

Buffer.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const hi = first * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  const lo = this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last

  return (BigInt(hi) << BigInt(32)) + BigInt(lo)
})

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let val = this[offset]
  let mul = 1
  let i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  let i = byteLength
  let mul = 1
  let val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 2, this.length)
  const val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = this[offset + 4] +
    this[offset + 5] * 2 ** 8 +
    this[offset + 6] * 2 ** 16 +
    (last << 24) // Overflow

  return (BigInt(val) << BigInt(32)) +
    BigInt(first +
    this[++offset] * 2 ** 8 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 24)
})

Buffer.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE (offset) {
  offset = offset >>> 0
  validateNumber(offset, 'offset')
  const first = this[offset]
  const last = this[offset + 7]
  if (first === undefined || last === undefined) {
    boundsError(offset, this.length - 8)
  }

  const val = (first << 24) + // Overflow
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    this[++offset]

  return (BigInt(val) << BigInt(32)) +
    BigInt(this[++offset] * 2 ** 24 +
    this[++offset] * 2 ** 16 +
    this[++offset] * 2 ** 8 +
    last)
})

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  offset = offset >>> 0
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUintLE =
Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let mul = 1
  let i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUintBE =
Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  byteLength = byteLength >>> 0
  if (!noAssert) {
    const maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  let i = byteLength - 1
  let mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUint8 =
Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeUint16LE =
Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeUint16BE =
Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeUint32LE =
Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset + 3] = (value >>> 24)
  this[offset + 2] = (value >>> 16)
  this[offset + 1] = (value >>> 8)
  this[offset] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeUint32BE =
Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

function wrtBigUInt64LE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  lo = lo >> 8
  buf[offset++] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  hi = hi >> 8
  buf[offset++] = hi
  return offset
}

function wrtBigUInt64BE (buf, value, offset, min, max) {
  checkIntBI(value, min, max, buf, offset, 7)

  let lo = Number(value & BigInt(0xffffffff))
  buf[offset + 7] = lo
  lo = lo >> 8
  buf[offset + 6] = lo
  lo = lo >> 8
  buf[offset + 5] = lo
  lo = lo >> 8
  buf[offset + 4] = lo
  let hi = Number(value >> BigInt(32) & BigInt(0xffffffff))
  buf[offset + 3] = hi
  hi = hi >> 8
  buf[offset + 2] = hi
  hi = hi >> 8
  buf[offset + 1] = hi
  hi = hi >> 8
  buf[offset] = hi
  return offset + 8
}

Buffer.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt('0xffffffffffffffff'))
})

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = 0
  let mul = 1
  let sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    const limit = Math.pow(2, (8 * byteLength) - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  let i = byteLength - 1
  let mul = 1
  let sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  this[offset] = (value >>> 8)
  this[offset + 1] = (value & 0xff)
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  this[offset] = (value & 0xff)
  this[offset + 1] = (value >>> 8)
  this[offset + 2] = (value >>> 16)
  this[offset + 3] = (value >>> 24)
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  this[offset] = (value >>> 24)
  this[offset + 1] = (value >>> 16)
  this[offset + 2] = (value >>> 8)
  this[offset + 3] = (value & 0xff)
  return offset + 4
}

Buffer.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE (value, offset = 0) {
  return wrtBigUInt64LE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

Buffer.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE (value, offset = 0) {
  return wrtBigUInt64BE(this, value, offset, -BigInt('0x8000000000000000'), BigInt('0x7fffffffffffffff'))
})

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  value = +value
  offset = offset >>> 0
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  const len = end - start

  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
    // Use built-in when available, missing from IE11
    this.copyWithin(targetStart, start, end)
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, end),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
    if (val.length === 1) {
      const code = val.charCodeAt(0)
      if ((encoding === 'utf8' && code < 128) ||
          encoding === 'latin1') {
        // Fast path: If `val` fits into a single byte, use that numeric value.
        val = code
      }
    }
  } else if (typeof val === 'number') {
    val = val & 255
  } else if (typeof val === 'boolean') {
    val = Number(val)
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  let i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    const bytes = Buffer.isBuffer(val)
      ? val
      : Buffer.from(val, encoding)
    const len = bytes.length
    if (len === 0) {
      throw new TypeError('The value "' + val +
        '" is invalid for argument "value"')
    }
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// CUSTOM ERRORS
// =============

// Simplified versions from Node, changed for Buffer-only usage
const errors = {}
function E (sym, getMessage, Base) {
  errors[sym] = class NodeError extends Base {
    constructor () {
      super()

      Object.defineProperty(this, 'message', {
        value: getMessage.apply(this, arguments),
        writable: true,
        configurable: true
      })

      // Add the error code to the name to include it in the stack trace.
      this.name = `${this.name} [${sym}]`
      // Access the stack to generate the error message including the error code
      // from the name.
      this.stack // eslint-disable-line no-unused-expressions
      // Reset the name to the actual name.
      delete this.name
    }

    get code () {
      return sym
    }

    set code (value) {
      Object.defineProperty(this, 'code', {
        configurable: true,
        enumerable: true,
        value,
        writable: true
      })
    }

    toString () {
      return `${this.name} [${sym}]: ${this.message}`
    }
  }
}

E('ERR_BUFFER_OUT_OF_BOUNDS',
  function (name) {
    if (name) {
      return `${name} is outside of buffer bounds`
    }

    return 'Attempt to access memory outside buffer bounds'
  }, RangeError)
E('ERR_INVALID_ARG_TYPE',
  function (name, actual) {
    return `The "${name}" argument must be of type number. Received type ${typeof actual}`
  }, TypeError)
E('ERR_OUT_OF_RANGE',
  function (str, range, input) {
    let msg = `The value of "${str}" is out of range.`
    let received = input
    if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
      received = addNumericalSeparator(String(input))
    } else if (typeof input === 'bigint') {
      received = String(input)
      if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
        received = addNumericalSeparator(received)
      }
      received += 'n'
    }
    msg += ` It must be ${range}. Received ${received}`
    return msg
  }, RangeError)

function addNumericalSeparator (val) {
  let res = ''
  let i = val.length
  const start = val[0] === '-' ? 1 : 0
  for (; i >= start + 4; i -= 3) {
    res = `_${val.slice(i - 3, i)}${res}`
  }
  return `${val.slice(0, i)}${res}`
}

// CHECK FUNCTIONS
// ===============

function checkBounds (buf, offset, byteLength) {
  validateNumber(offset, 'offset')
  if (buf[offset] === undefined || buf[offset + byteLength] === undefined) {
    boundsError(offset, buf.length - (byteLength + 1))
  }
}

function checkIntBI (value, min, max, buf, offset, byteLength) {
  if (value > max || value < min) {
    const n = typeof min === 'bigint' ? 'n' : ''
    let range
    if (byteLength > 3) {
      if (min === 0 || min === BigInt(0)) {
        range = `>= 0${n} and < 2${n} ** ${(byteLength + 1) * 8}${n}`
      } else {
        range = `>= -(2${n} ** ${(byteLength + 1) * 8 - 1}${n}) and < 2 ** ` +
                `${(byteLength + 1) * 8 - 1}${n}`
      }
    } else {
      range = `>= ${min}${n} and <= ${max}${n}`
    }
    throw new errors.ERR_OUT_OF_RANGE('value', range, value)
  }
  checkBounds(buf, offset, byteLength)
}

function validateNumber (value, name) {
  if (typeof value !== 'number') {
    throw new errors.ERR_INVALID_ARG_TYPE(name, 'number', value)
  }
}

function boundsError (value, length, type) {
  if (Math.floor(value) !== value) {
    validateNumber(value, type)
    throw new errors.ERR_OUT_OF_RANGE(type || 'offset', 'an integer', value)
  }

  if (length < 0) {
    throw new errors.ERR_BUFFER_OUT_OF_BOUNDS()
  }

  throw new errors.ERR_OUT_OF_RANGE(type || 'offset',
                                    `>= ${type ? 1 : 0} and <= ${length}`,
                                    value)
}

// HELPER FUNCTIONS
// ================

const INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node takes equal signs as end of the Base64 encoding
  str = str.split('=')[0]
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = str.trim().replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  let codePoint
  const length = string.length
  let leadSurrogate = null
  const bytes = []

  for (let i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  let c, hi, lo
  const byteArray = []
  for (let i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  let i
  for (i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
// the `instanceof` check but they should be treated as of that type.
// See: https://github.com/feross/buffer/issues/166
function isInstance (obj, type) {
  return obj instanceof type ||
    (obj != null && obj.constructor != null && obj.constructor.name != null &&
      obj.constructor.name === type.name)
}
function numberIsNaN (obj) {
  // For IE11 support
  return obj !== obj // eslint-disable-line no-self-compare
}

// Create lookup table for `toString('hex')`
// See: https://github.com/feross/buffer/issues/219
const hexSliceLookupTable = (function () {
  const alphabet = '0123456789abcdef'
  const table = new Array(256)
  for (let i = 0; i < 16; ++i) {
    const i16 = i * 16
    for (let j = 0; j < 16; ++j) {
      table[i16 + j] = alphabet[i] + alphabet[j]
    }
  }
  return table
})()

// Return not function with Error if BigInt not supported
function defineBigIntMethod (fn) {
  return typeof BigInt === 'undefined' ? BufferBigIntNotDefined : fn
}

function BufferBigIntNotDefined () {
  throw new Error('BigInt not supported')
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Editor.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Editor.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".editor {\n  background-color: #272822;\n  color: #fff;\n  font-size: 11px;\n  font-family: Arial, Helvetica, sans-serif;\n  display: flex;\n  height: 365px;\n}\n\n.editor .ace {\n  flex-basis: 75%;\n}\n\n.editor .fileList {\n  --spacing: 1rem;\n  --radius: 7px;\n  flex-basis: 25%;\n  padding: 0.5rem;\n  overflow-y: auto;\n}\n\n.editor .fileList ul {\n  margin: 0;\n  padding: 0;\n}\n\n.editor .fileList li {\n  cursor: pointer;\n  padding: 0.25rem 0.5rem;\n}\n.editor .fileList li:hover {\n  background-color: #222;\n}\n\n.editor .fileList li {\n  display: block;\n  position: relative;\n  padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);\n  white-space: nowrap;\n}\n\n.editor .fileList ul li {\n  border-left: 2px solid #ddd;\n}\n\n.editor .fileList ul li:last-child {\n  border-color: transparent;\n}\n\n.editor .fileList ul li::before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: calc(var(--spacing) / -4);\n  left: -2px;\n  width: calc(var(--spacing) + 2px);\n  height: calc(var(--spacing) + 1px);\n  border: solid #ddd;\n  border-width: 0 0 2px 2px;\n}\n\n.editor .fileList summary {\n  display: block;\n  cursor: pointer;\n}\n\n.editor .fileList summary::marker,\n.editor .fileList summary::-webkit-details-marker {\n  display: none;\n}\n\n.editor .fileList summary:focus {\n  outline: none;\n}\n\n.editor .fileList summary:focus-visible {\n  outline: 1px dotted #000;\n}\n\n.editor .fileList li::after,\n.editor .fileList summary::before {\n  display: block;\n  position: absolute;\n  top: calc(var(--spacing) / 2 - var(--radius));\n  left: calc(var(--spacing) - var(--radius) - 1px);\n  width: calc(2 * var(--radius));\n  height: calc(2 * var(--radius));\n  background: #ddd;\n}\n\n.editor .fileList summary::before {\n  content: \">\";\n  z-index: 1;\n  background-color: #272822;\n  color: #fff;\n  line-height: calc(2 * var(--radius) - 2px);\n  text-align: center;\n  left: 5px;\n  top: 7px;\n}\n\n.editor .fileList details[open] > summary::before {\n  transform: rotate(90deg);\n}", "",{"version":3,"sources":["webpack://./src/components/Editor.scss"],"names":[],"mappings":"AAAA;EACE,yBAAA;EACA,WAAA;EACA,eAAA;EACA,yCAAA;EACA,aAAA;EACA,aAAA;AACF;;AAEA;EACE,eAAA;AACF;;AAEA;EACE,eAAA;EACA,aAAA;EACA,eAAA;EACA,eAAA;EACA,gBAAA;AACF;;AAEA;EACE,SAAA;EACA,UAAA;AACF;;AAEA;EACE,eAAA;EACA,uBAAA;AACF;AACE;EACE,sBAAA;AACJ;;AAGA;EACE,cAAA;EACA,kBAAA;EACA,4DAAA;EACA,mBAAA;AAAF;;AAGA;EACE,2BAAA;AAAF;;AAGA;EACE,yBAAA;AAAF;;AAGA;EACE,WAAA;EACA,cAAA;EACA,kBAAA;EACA,8BAAA;EACA,UAAA;EACA,iCAAA;EACA,kCAAA;EACA,kBAAA;EACA,yBAAA;AAAF;;AAGA;EACE,cAAA;EACA,eAAA;AAAF;;AAGA;;EAEE,aAAA;AAAF;;AAGA;EACE,aAAA;AAAF;;AAGA;EACE,wBAAA;AAAF;;AAGA;;EAEE,cAAA;EACA,kBAAA;EACA,6CAAA;EACA,gDAAA;EACA,8BAAA;EACA,+BAAA;EACA,gBAAA;AAAF;;AAGA;EACE,YAAA;EACA,UAAA;EACA,yBAAA;EACA,WAAA;EACA,0CAAA;EACA,kBAAA;EACA,SAAA;EACA,QAAA;AAAF;;AAGA;EAEE,wBAAA;AADF","sourcesContent":[".editor {\n  background-color: #272822;\n  color: #fff;\n  font-size: 11px;\n  font-family: Arial, Helvetica, sans-serif;\n  display: flex;\n  height: 365px;\n}\n\n.editor .ace {\n  flex-basis: 75%;\n}\n\n.editor .fileList {\n  --spacing: 1rem;\n  --radius: 7px;\n  flex-basis: 25%;\n  padding: 0.5rem;\n  overflow-y: auto;\n}\n\n.editor .fileList ul {\n  margin: 0;\n  padding: 0;\n}\n\n.editor .fileList li {\n  cursor: pointer;\n  padding: 0.25rem 0.5rem;\n\n  &:hover {\n    background-color: #222;\n  }\n}\n\n.editor .fileList li {\n  display: block;\n  position: relative;\n  padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);\n  white-space: nowrap;\n}\n\n.editor .fileList ul li {\n  border-left: 2px solid #ddd;\n}\n\n.editor .fileList ul li:last-child {\n  border-color: transparent;\n}\n\n.editor .fileList ul li::before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: calc(var(--spacing) / -4);\n  left: -2px;\n  width: calc(var(--spacing) + 2px);\n  height: calc(var(--spacing) + 1px);\n  border: solid #ddd;\n  border-width: 0 0 2px 2px;\n}\n\n.editor .fileList summary {\n  display: block;\n  cursor: pointer;\n}\n\n.editor .fileList summary::marker,\n.editor .fileList summary::-webkit-details-marker {\n  display: none;\n}\n\n.editor .fileList summary:focus {\n  outline: none;\n}\n\n.editor .fileList summary:focus-visible {\n  outline: 1px dotted #000;\n}\n\n.editor .fileList li::after,\n.editor .fileList summary::before {\n  display: block;\n  position: absolute;\n  top: calc(var(--spacing) / 2 - var(--radius));\n  left: calc(var(--spacing) - var(--radius) - 1px);\n  width: calc(2 * var(--radius));\n  height: calc(2 * var(--radius));\n  background: #ddd;\n}\n\n.editor .fileList summary::before {\n  content: \">\";\n  z-index: 1;\n  background-color: #272822;\n  color: #fff;\n  line-height: calc(2 * var(--radius) - 2px);\n  text-align: center;\n  left: 5px;\n  top: 7px;\n}\n\n.editor .fileList details[open] > summary::before {\n  // content : '−';\n  transform: rotate(90deg);\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Interface.scss":
/*!********************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Interface.scss ***!
  \********************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".interface {\n  background-color: #000;\n  color: #fff;\n  font-size: 14px;\n  font-family: Arial, Helvetica, sans-serif;\n  user-select: none;\n}\n\n.interface img,\n.interface span,\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  position: absolute;\n}\n\n.interface img {\n  z-index: 1;\n}\n\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  z-index: 2;\n}\n\n.interface span {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  z-index: 3;\n}\n\n.interface .tabs {\n  align-content: flex-start;\n  color: #fff;\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.interface .radiotab {\n  position: absolute;\n  opacity: 0;\n}\n\n.interface .label {\n  width: 100%;\n  cursor: pointer;\n  padding: 0.5rem 1rem;\n  text-align: center;\n}\n\n.interface .label:hover {\n  background-color: #222;\n}\n\n.interface .radiotab:checked + .label {\n  background-color: #333;\n}\n\n.interface .panel {\n  background-color: #333;\n  position: relative;\n  display: none;\n  width: 100%;\n  height: 0;\n  padding-bottom: 42.58%;\n}\n\n.interface .radiotab:checked + .label + .panel {\n  display: block;\n}\n\n.interface .panel {\n  order: 99;\n}\n\n.interface .label {\n  width: auto;\n}", "",{"version":3,"sources":["webpack://./src/components/Interface.scss"],"names":[],"mappings":"AAAA;EACE,sBAAA;EACA,WAAA;EACA,eAAA;EACA,yCAAA;EACA,iBAAA;AACF;;AAEA;;;;;EAKE,kBAAA;AACF;;AAGA;EACE,UAAA;AAAF;;AAGA;;;EAGE,UAAA;AAAF;;AAGA;EACE,mBAAA;EACA,aAAA;EACA,uBAAA;EACA,UAAA;AAAF;;AAGA;EACE,yBAAA;EACA,WAAA;EACA,aAAA;EACA,eAAA;AAAF;;AAGA;EACE,kBAAA;EACA,UAAA;AAAF;;AAGA;EACE,WAAA;EACA,eAAA;EACA,oBAAA;EACA,kBAAA;AAAF;;AAGA;EACE,sBAAA;AAAF;;AAGA;EACE,sBAAA;AAAF;;AAGA;EACE,sBAAA;EACA,kBAAA;EACA,aAAA;EACA,WAAA;EACA,SAAA;EACA,sBAAA;AAAF;;AAGA;EACE,cAAA;AAAF;;AAGA;EACE,SAAA;AAAF;;AAEA;EACE,WAAA;AACF","sourcesContent":[".interface {\n  background-color: #000;\n  color: #fff;\n  font-size: 14px;\n  font-family: Arial, Helvetica, sans-serif;\n  user-select: none;\n}\n\n.interface img,\n.interface span,\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  position: absolute;\n  // transform: translate(-50%, -50%);\n}\n\n.interface img {\n  z-index: 1;\n}\n\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  z-index: 2;\n}\n\n.interface span {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  z-index: 3;\n}\n\n.interface .tabs {\n  align-content: flex-start;\n  color: #fff;\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.interface .radiotab {\n  position: absolute;\n  opacity: 0;\n}\n\n.interface .label {\n  width: 100%;\n  cursor: pointer;\n  padding: 0.5rem 1rem;\n  text-align: center;\n}\n\n.interface .label:hover {\n  background-color: #222;\n}\n\n.interface .radiotab:checked + .label {\n  background-color: #333;\n}\n\n.interface .panel {\n  background-color: #333;\n  position: relative;\n  display: none;\n  width: 100%;\n  height: 0;\n  padding-bottom: 42.58%; // 330px / 775px\n}\n\n.interface .radiotab:checked + .label + .panel {\n  display: block;\n}\n\n.interface .panel {\n  order: 99;\n}\n.interface .label {\n  width: auto;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Player.scss":
/*!*****************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Player.scss ***!
  \*****************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".player .header {\n  background-color: #000;\n  color: #fff;\n  font-size: 11px;\n  font-family: Arial, Helvetica, sans-serif;\n  padding: 1rem;\n}\n\n.player .header input {\n  margin-right: 1rem;\n}", "",{"version":3,"sources":["webpack://./src/components/Player.scss"],"names":[],"mappings":"AAAA;EACE,sBAAA;EACA,WAAA;EACA,eAAA;EACA,yCAAA;EACA,aAAA;AACF;;AAEA;EACE,kBAAA;AACF","sourcesContent":[".player .header {\n  background-color: #000;\n  color: #fff;\n  font-size: 11px;\n  font-family: Arial, Helvetica, sans-serif;\n  padding: 1rem;\n}\n\n.player .header input {\n  margin-right: 1rem;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/emitter-component/index.js":
/*!*************************************************!*\
  !*** ./node_modules/emitter-component/index.js ***!
  \*************************************************/
/***/ ((module) => {


/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ "./node_modules/ieee754/index.js":
/*!***************************************!*\
  !*** ./node_modules/ieee754/index.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = (nBytes * 8) - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = ((value * c) - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),

/***/ "./node_modules/safe-buffer/index.js":
/*!*******************************************!*\
  !*** ./node_modules/safe-buffer/index.js ***!
  \*******************************************/
/***/ ((module, exports, __webpack_require__) => {

/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
/* eslint-disable node/no-deprecated-api */
var buffer = __webpack_require__(/*! buffer */ "./node_modules/buffer/index.js")
var Buffer = buffer.Buffer

// alternative to using Object.keys for old browsers
function copyProps (src, dst) {
  for (var key in src) {
    dst[key] = src[key]
  }
}
if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
  module.exports = buffer
} else {
  // Copy properties from require('buffer')
  copyProps(buffer, exports)
  exports.Buffer = SafeBuffer
}

function SafeBuffer (arg, encodingOrOffset, length) {
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.prototype = Object.create(Buffer.prototype)

// Copy static methods from Buffer
copyProps(Buffer, SafeBuffer)

SafeBuffer.from = function (arg, encodingOrOffset, length) {
  if (typeof arg === 'number') {
    throw new TypeError('Argument must not be a number')
  }
  return Buffer(arg, encodingOrOffset, length)
}

SafeBuffer.alloc = function (size, fill, encoding) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  var buf = Buffer(size)
  if (fill !== undefined) {
    if (typeof encoding === 'string') {
      buf.fill(fill, encoding)
    } else {
      buf.fill(fill)
    }
  } else {
    buf.fill(0)
  }
  return buf
}

SafeBuffer.allocUnsafe = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return Buffer(size)
}

SafeBuffer.allocUnsafeSlow = function (size) {
  if (typeof size !== 'number') {
    throw new TypeError('Argument must be a number')
  }
  return buffer.SlowBuffer(size)
}


/***/ }),

/***/ "./node_modules/sax/lib/sax.js":
/*!*************************************!*\
  !*** ./node_modules/sax/lib/sax.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

;(function (sax) { // wrapper for non-node envs
  sax.parser = function (strict, opt) { return new SAXParser(strict, opt) }
  sax.SAXParser = SAXParser
  sax.SAXStream = SAXStream
  sax.createStream = createStream

  // When we pass the MAX_BUFFER_LENGTH position, start checking for buffer overruns.
  // When we check, schedule the next check for MAX_BUFFER_LENGTH - (max(buffer lengths)),
  // since that's the earliest that a buffer overrun could occur.  This way, checks are
  // as rare as required, but as often as necessary to ensure never crossing this bound.
  // Furthermore, buffers are only tested at most once per write(), so passing a very
  // large string into write() might have undesirable effects, but this is manageable by
  // the caller, so it is assumed to be safe.  Thus, a call to write() may, in the extreme
  // edge case, result in creating at most one complete copy of the string passed in.
  // Set to Infinity to have unlimited buffers.
  sax.MAX_BUFFER_LENGTH = 64 * 1024

  var buffers = [
    'comment', 'sgmlDecl', 'textNode', 'tagName', 'doctype',
    'procInstName', 'procInstBody', 'entity', 'attribName',
    'attribValue', 'cdata', 'script'
  ]

  sax.EVENTS = [
    'text',
    'processinginstruction',
    'sgmldeclaration',
    'doctype',
    'comment',
    'opentagstart',
    'attribute',
    'opentag',
    'closetag',
    'opencdata',
    'cdata',
    'closecdata',
    'error',
    'end',
    'ready',
    'script',
    'opennamespace',
    'closenamespace'
  ]

  function SAXParser (strict, opt) {
    if (!(this instanceof SAXParser)) {
      return new SAXParser(strict, opt)
    }

    var parser = this
    clearBuffers(parser)
    parser.q = parser.c = ''
    parser.bufferCheckPosition = sax.MAX_BUFFER_LENGTH
    parser.opt = opt || {}
    parser.opt.lowercase = parser.opt.lowercase || parser.opt.lowercasetags
    parser.looseCase = parser.opt.lowercase ? 'toLowerCase' : 'toUpperCase'
    parser.tags = []
    parser.closed = parser.closedRoot = parser.sawRoot = false
    parser.tag = parser.error = null
    parser.strict = !!strict
    parser.noscript = !!(strict || parser.opt.noscript)
    parser.state = S.BEGIN
    parser.strictEntities = parser.opt.strictEntities
    parser.ENTITIES = parser.strictEntities ? Object.create(sax.XML_ENTITIES) : Object.create(sax.ENTITIES)
    parser.attribList = []

    // namespaces form a prototype chain.
    // it always points at the current tag,
    // which protos to its parent tag.
    if (parser.opt.xmlns) {
      parser.ns = Object.create(rootNS)
    }

    // mostly just for error reporting
    parser.trackPosition = parser.opt.position !== false
    if (parser.trackPosition) {
      parser.position = parser.line = parser.column = 0
    }
    emit(parser, 'onready')
  }

  if (!Object.create) {
    Object.create = function (o) {
      function F () {}
      F.prototype = o
      var newf = new F()
      return newf
    }
  }

  if (!Object.keys) {
    Object.keys = function (o) {
      var a = []
      for (var i in o) if (o.hasOwnProperty(i)) a.push(i)
      return a
    }
  }

  function checkBufferLength (parser) {
    var maxAllowed = Math.max(sax.MAX_BUFFER_LENGTH, 10)
    var maxActual = 0
    for (var i = 0, l = buffers.length; i < l; i++) {
      var len = parser[buffers[i]].length
      if (len > maxAllowed) {
        // Text/cdata nodes can get big, and since they're buffered,
        // we can get here under normal conditions.
        // Avoid issues by emitting the text node now,
        // so at least it won't get any bigger.
        switch (buffers[i]) {
          case 'textNode':
            closeText(parser)
            break

          case 'cdata':
            emitNode(parser, 'oncdata', parser.cdata)
            parser.cdata = ''
            break

          case 'script':
            emitNode(parser, 'onscript', parser.script)
            parser.script = ''
            break

          default:
            error(parser, 'Max buffer length exceeded: ' + buffers[i])
        }
      }
      maxActual = Math.max(maxActual, len)
    }
    // schedule the next check for the earliest possible buffer overrun.
    var m = sax.MAX_BUFFER_LENGTH - maxActual
    parser.bufferCheckPosition = m + parser.position
  }

  function clearBuffers (parser) {
    for (var i = 0, l = buffers.length; i < l; i++) {
      parser[buffers[i]] = ''
    }
  }

  function flushBuffers (parser) {
    closeText(parser)
    if (parser.cdata !== '') {
      emitNode(parser, 'oncdata', parser.cdata)
      parser.cdata = ''
    }
    if (parser.script !== '') {
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }
  }

  SAXParser.prototype = {
    end: function () { end(this) },
    write: write,
    resume: function () { this.error = null; return this },
    close: function () { return this.write(null) },
    flush: function () { flushBuffers(this) }
  }

  var Stream
  try {
    Stream = (__webpack_require__(/*! stream */ "./node_modules/stream/index.js").Stream)
  } catch (ex) {
    Stream = function () {}
  }

  var streamWraps = sax.EVENTS.filter(function (ev) {
    return ev !== 'error' && ev !== 'end'
  })

  function createStream (strict, opt) {
    return new SAXStream(strict, opt)
  }

  function SAXStream (strict, opt) {
    if (!(this instanceof SAXStream)) {
      return new SAXStream(strict, opt)
    }

    Stream.apply(this)

    this._parser = new SAXParser(strict, opt)
    this.writable = true
    this.readable = true

    var me = this

    this._parser.onend = function () {
      me.emit('end')
    }

    this._parser.onerror = function (er) {
      me.emit('error', er)

      // if didn't throw, then means error was handled.
      // go ahead and clear error, so we can write again.
      me._parser.error = null
    }

    this._decoder = null

    streamWraps.forEach(function (ev) {
      Object.defineProperty(me, 'on' + ev, {
        get: function () {
          return me._parser['on' + ev]
        },
        set: function (h) {
          if (!h) {
            me.removeAllListeners(ev)
            me._parser['on' + ev] = h
            return h
          }
          me.on(ev, h)
        },
        enumerable: true,
        configurable: false
      })
    })
  }

  SAXStream.prototype = Object.create(Stream.prototype, {
    constructor: {
      value: SAXStream
    }
  })

  SAXStream.prototype.write = function (data) {
    if (typeof Buffer === 'function' &&
      typeof Buffer.isBuffer === 'function' &&
      Buffer.isBuffer(data)) {
      if (!this._decoder) {
        var SD = (__webpack_require__(/*! string_decoder */ "./node_modules/string_decoder/lib/string_decoder.js").StringDecoder)
        this._decoder = new SD('utf8')
      }
      data = this._decoder.write(data)
    }

    this._parser.write(data.toString())
    this.emit('data', data)
    return true
  }

  SAXStream.prototype.end = function (chunk) {
    if (chunk && chunk.length) {
      this.write(chunk)
    }
    this._parser.end()
    return true
  }

  SAXStream.prototype.on = function (ev, handler) {
    var me = this
    if (!me._parser['on' + ev] && streamWraps.indexOf(ev) !== -1) {
      me._parser['on' + ev] = function () {
        var args = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments)
        args.splice(0, 0, ev)
        me.emit.apply(me, args)
      }
    }

    return Stream.prototype.on.call(me, ev, handler)
  }

  // this really needs to be replaced with character classes.
  // XML allows all manner of ridiculous numbers and digits.
  var CDATA = '[CDATA['
  var DOCTYPE = 'DOCTYPE'
  var XML_NAMESPACE = 'http://www.w3.org/XML/1998/namespace'
  var XMLNS_NAMESPACE = 'http://www.w3.org/2000/xmlns/'
  var rootNS = { xml: XML_NAMESPACE, xmlns: XMLNS_NAMESPACE }

  // http://www.w3.org/TR/REC-xml/#NT-NameStartChar
  // This implementation works on strings, a single character at a time
  // as such, it cannot ever support astral-plane characters (10000-EFFFF)
  // without a significant breaking change to either this  parser, or the
  // JavaScript language.  Implementation of an emoji-capable xml parser
  // is left as an exercise for the reader.
  var nameStart = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/

  var nameBody = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  var entityStart = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/
  var entityBody = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/

  function isWhitespace (c) {
    return c === ' ' || c === '\n' || c === '\r' || c === '\t'
  }

  function isQuote (c) {
    return c === '"' || c === '\''
  }

  function isAttribEnd (c) {
    return c === '>' || isWhitespace(c)
  }

  function isMatch (regex, c) {
    return regex.test(c)
  }

  function notMatch (regex, c) {
    return !isMatch(regex, c)
  }

  var S = 0
  sax.STATE = {
    BEGIN: S++, // leading byte order mark or whitespace
    BEGIN_WHITESPACE: S++, // leading whitespace
    TEXT: S++, // general stuff
    TEXT_ENTITY: S++, // &amp and such.
    OPEN_WAKA: S++, // <
    SGML_DECL: S++, // <!BLARG
    SGML_DECL_QUOTED: S++, // <!BLARG foo "bar
    DOCTYPE: S++, // <!DOCTYPE
    DOCTYPE_QUOTED: S++, // <!DOCTYPE "//blah
    DOCTYPE_DTD: S++, // <!DOCTYPE "//blah" [ ...
    DOCTYPE_DTD_QUOTED: S++, // <!DOCTYPE "//blah" [ "foo
    COMMENT_STARTING: S++, // <!-
    COMMENT: S++, // <!--
    COMMENT_ENDING: S++, // <!-- blah -
    COMMENT_ENDED: S++, // <!-- blah --
    CDATA: S++, // <![CDATA[ something
    CDATA_ENDING: S++, // ]
    CDATA_ENDING_2: S++, // ]]
    PROC_INST: S++, // <?hi
    PROC_INST_BODY: S++, // <?hi there
    PROC_INST_ENDING: S++, // <?hi "there" ?
    OPEN_TAG: S++, // <strong
    OPEN_TAG_SLASH: S++, // <strong /
    ATTRIB: S++, // <a
    ATTRIB_NAME: S++, // <a foo
    ATTRIB_NAME_SAW_WHITE: S++, // <a foo _
    ATTRIB_VALUE: S++, // <a foo=
    ATTRIB_VALUE_QUOTED: S++, // <a foo="bar
    ATTRIB_VALUE_CLOSED: S++, // <a foo="bar"
    ATTRIB_VALUE_UNQUOTED: S++, // <a foo=bar
    ATTRIB_VALUE_ENTITY_Q: S++, // <foo bar="&quot;"
    ATTRIB_VALUE_ENTITY_U: S++, // <foo bar=&quot
    CLOSE_TAG: S++, // </a
    CLOSE_TAG_SAW_WHITE: S++, // </a   >
    SCRIPT: S++, // <script> ...
    SCRIPT_ENDING: S++ // <script> ... <
  }

  sax.XML_ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'"
  }

  sax.ENTITIES = {
    'amp': '&',
    'gt': '>',
    'lt': '<',
    'quot': '"',
    'apos': "'",
    'AElig': 198,
    'Aacute': 193,
    'Acirc': 194,
    'Agrave': 192,
    'Aring': 197,
    'Atilde': 195,
    'Auml': 196,
    'Ccedil': 199,
    'ETH': 208,
    'Eacute': 201,
    'Ecirc': 202,
    'Egrave': 200,
    'Euml': 203,
    'Iacute': 205,
    'Icirc': 206,
    'Igrave': 204,
    'Iuml': 207,
    'Ntilde': 209,
    'Oacute': 211,
    'Ocirc': 212,
    'Ograve': 210,
    'Oslash': 216,
    'Otilde': 213,
    'Ouml': 214,
    'THORN': 222,
    'Uacute': 218,
    'Ucirc': 219,
    'Ugrave': 217,
    'Uuml': 220,
    'Yacute': 221,
    'aacute': 225,
    'acirc': 226,
    'aelig': 230,
    'agrave': 224,
    'aring': 229,
    'atilde': 227,
    'auml': 228,
    'ccedil': 231,
    'eacute': 233,
    'ecirc': 234,
    'egrave': 232,
    'eth': 240,
    'euml': 235,
    'iacute': 237,
    'icirc': 238,
    'igrave': 236,
    'iuml': 239,
    'ntilde': 241,
    'oacute': 243,
    'ocirc': 244,
    'ograve': 242,
    'oslash': 248,
    'otilde': 245,
    'ouml': 246,
    'szlig': 223,
    'thorn': 254,
    'uacute': 250,
    'ucirc': 251,
    'ugrave': 249,
    'uuml': 252,
    'yacute': 253,
    'yuml': 255,
    'copy': 169,
    'reg': 174,
    'nbsp': 160,
    'iexcl': 161,
    'cent': 162,
    'pound': 163,
    'curren': 164,
    'yen': 165,
    'brvbar': 166,
    'sect': 167,
    'uml': 168,
    'ordf': 170,
    'laquo': 171,
    'not': 172,
    'shy': 173,
    'macr': 175,
    'deg': 176,
    'plusmn': 177,
    'sup1': 185,
    'sup2': 178,
    'sup3': 179,
    'acute': 180,
    'micro': 181,
    'para': 182,
    'middot': 183,
    'cedil': 184,
    'ordm': 186,
    'raquo': 187,
    'frac14': 188,
    'frac12': 189,
    'frac34': 190,
    'iquest': 191,
    'times': 215,
    'divide': 247,
    'OElig': 338,
    'oelig': 339,
    'Scaron': 352,
    'scaron': 353,
    'Yuml': 376,
    'fnof': 402,
    'circ': 710,
    'tilde': 732,
    'Alpha': 913,
    'Beta': 914,
    'Gamma': 915,
    'Delta': 916,
    'Epsilon': 917,
    'Zeta': 918,
    'Eta': 919,
    'Theta': 920,
    'Iota': 921,
    'Kappa': 922,
    'Lambda': 923,
    'Mu': 924,
    'Nu': 925,
    'Xi': 926,
    'Omicron': 927,
    'Pi': 928,
    'Rho': 929,
    'Sigma': 931,
    'Tau': 932,
    'Upsilon': 933,
    'Phi': 934,
    'Chi': 935,
    'Psi': 936,
    'Omega': 937,
    'alpha': 945,
    'beta': 946,
    'gamma': 947,
    'delta': 948,
    'epsilon': 949,
    'zeta': 950,
    'eta': 951,
    'theta': 952,
    'iota': 953,
    'kappa': 954,
    'lambda': 955,
    'mu': 956,
    'nu': 957,
    'xi': 958,
    'omicron': 959,
    'pi': 960,
    'rho': 961,
    'sigmaf': 962,
    'sigma': 963,
    'tau': 964,
    'upsilon': 965,
    'phi': 966,
    'chi': 967,
    'psi': 968,
    'omega': 969,
    'thetasym': 977,
    'upsih': 978,
    'piv': 982,
    'ensp': 8194,
    'emsp': 8195,
    'thinsp': 8201,
    'zwnj': 8204,
    'zwj': 8205,
    'lrm': 8206,
    'rlm': 8207,
    'ndash': 8211,
    'mdash': 8212,
    'lsquo': 8216,
    'rsquo': 8217,
    'sbquo': 8218,
    'ldquo': 8220,
    'rdquo': 8221,
    'bdquo': 8222,
    'dagger': 8224,
    'Dagger': 8225,
    'bull': 8226,
    'hellip': 8230,
    'permil': 8240,
    'prime': 8242,
    'Prime': 8243,
    'lsaquo': 8249,
    'rsaquo': 8250,
    'oline': 8254,
    'frasl': 8260,
    'euro': 8364,
    'image': 8465,
    'weierp': 8472,
    'real': 8476,
    'trade': 8482,
    'alefsym': 8501,
    'larr': 8592,
    'uarr': 8593,
    'rarr': 8594,
    'darr': 8595,
    'harr': 8596,
    'crarr': 8629,
    'lArr': 8656,
    'uArr': 8657,
    'rArr': 8658,
    'dArr': 8659,
    'hArr': 8660,
    'forall': 8704,
    'part': 8706,
    'exist': 8707,
    'empty': 8709,
    'nabla': 8711,
    'isin': 8712,
    'notin': 8713,
    'ni': 8715,
    'prod': 8719,
    'sum': 8721,
    'minus': 8722,
    'lowast': 8727,
    'radic': 8730,
    'prop': 8733,
    'infin': 8734,
    'ang': 8736,
    'and': 8743,
    'or': 8744,
    'cap': 8745,
    'cup': 8746,
    'int': 8747,
    'there4': 8756,
    'sim': 8764,
    'cong': 8773,
    'asymp': 8776,
    'ne': 8800,
    'equiv': 8801,
    'le': 8804,
    'ge': 8805,
    'sub': 8834,
    'sup': 8835,
    'nsub': 8836,
    'sube': 8838,
    'supe': 8839,
    'oplus': 8853,
    'otimes': 8855,
    'perp': 8869,
    'sdot': 8901,
    'lceil': 8968,
    'rceil': 8969,
    'lfloor': 8970,
    'rfloor': 8971,
    'lang': 9001,
    'rang': 9002,
    'loz': 9674,
    'spades': 9824,
    'clubs': 9827,
    'hearts': 9829,
    'diams': 9830
  }

  Object.keys(sax.ENTITIES).forEach(function (key) {
    var e = sax.ENTITIES[key]
    var s = typeof e === 'number' ? String.fromCharCode(e) : e
    sax.ENTITIES[key] = s
  })

  for (var s in sax.STATE) {
    sax.STATE[sax.STATE[s]] = s
  }

  // shorthand
  S = sax.STATE

  function emit (parser, event, data) {
    parser[event] && parser[event](data)
  }

  function emitNode (parser, nodeType, data) {
    if (parser.textNode) closeText(parser)
    emit(parser, nodeType, data)
  }

  function closeText (parser) {
    parser.textNode = textopts(parser.opt, parser.textNode)
    if (parser.textNode) emit(parser, 'ontext', parser.textNode)
    parser.textNode = ''
  }

  function textopts (opt, text) {
    if (opt.trim) text = text.trim()
    if (opt.normalize) text = text.replace(/\s+/g, ' ')
    return text
  }

  function error (parser, er) {
    closeText(parser)
    if (parser.trackPosition) {
      er += '\nLine: ' + parser.line +
        '\nColumn: ' + parser.column +
        '\nChar: ' + parser.c
    }
    er = new Error(er)
    parser.error = er
    emit(parser, 'onerror', er)
    return parser
  }

  function end (parser) {
    if (parser.sawRoot && !parser.closedRoot) strictFail(parser, 'Unclosed root tag')
    if ((parser.state !== S.BEGIN) &&
      (parser.state !== S.BEGIN_WHITESPACE) &&
      (parser.state !== S.TEXT)) {
      error(parser, 'Unexpected end')
    }
    closeText(parser)
    parser.c = ''
    parser.closed = true
    emit(parser, 'onend')
    SAXParser.call(parser, parser.strict, parser.opt)
    return parser
  }

  function strictFail (parser, message) {
    if (typeof parser !== 'object' || !(parser instanceof SAXParser)) {
      throw new Error('bad call to strictFail')
    }
    if (parser.strict) {
      error(parser, message)
    }
  }

  function newTag (parser) {
    if (!parser.strict) parser.tagName = parser.tagName[parser.looseCase]()
    var parent = parser.tags[parser.tags.length - 1] || parser
    var tag = parser.tag = { name: parser.tagName, attributes: {} }

    // will be overridden if tag contails an xmlns="foo" or xmlns:foo="bar"
    if (parser.opt.xmlns) {
      tag.ns = parent.ns
    }
    parser.attribList.length = 0
    emitNode(parser, 'onopentagstart', tag)
  }

  function qname (name, attribute) {
    var i = name.indexOf(':')
    var qualName = i < 0 ? [ '', name ] : name.split(':')
    var prefix = qualName[0]
    var local = qualName[1]

    // <x "xmlns"="http://foo">
    if (attribute && name === 'xmlns') {
      prefix = 'xmlns'
      local = ''
    }

    return { prefix: prefix, local: local }
  }

  function attrib (parser) {
    if (!parser.strict) {
      parser.attribName = parser.attribName[parser.looseCase]()
    }

    if (parser.attribList.indexOf(parser.attribName) !== -1 ||
      parser.tag.attributes.hasOwnProperty(parser.attribName)) {
      parser.attribName = parser.attribValue = ''
      return
    }

    if (parser.opt.xmlns) {
      var qn = qname(parser.attribName, true)
      var prefix = qn.prefix
      var local = qn.local

      if (prefix === 'xmlns') {
        // namespace binding attribute. push the binding into scope
        if (local === 'xml' && parser.attribValue !== XML_NAMESPACE) {
          strictFail(parser,
            'xml: prefix must be bound to ' + XML_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else if (local === 'xmlns' && parser.attribValue !== XMLNS_NAMESPACE) {
          strictFail(parser,
            'xmlns: prefix must be bound to ' + XMLNS_NAMESPACE + '\n' +
            'Actual: ' + parser.attribValue)
        } else {
          var tag = parser.tag
          var parent = parser.tags[parser.tags.length - 1] || parser
          if (tag.ns === parent.ns) {
            tag.ns = Object.create(parent.ns)
          }
          tag.ns[local] = parser.attribValue
        }
      }

      // defer onattribute events until all attributes have been seen
      // so any new bindings can take effect. preserve attribute order
      // so deferred events can be emitted in document order
      parser.attribList.push([parser.attribName, parser.attribValue])
    } else {
      // in non-xmlns mode, we can emit the event right away
      parser.tag.attributes[parser.attribName] = parser.attribValue
      emitNode(parser, 'onattribute', {
        name: parser.attribName,
        value: parser.attribValue
      })
    }

    parser.attribName = parser.attribValue = ''
  }

  function openTag (parser, selfClosing) {
    if (parser.opt.xmlns) {
      // emit namespace binding events
      var tag = parser.tag

      // add namespace info to tag
      var qn = qname(parser.tagName)
      tag.prefix = qn.prefix
      tag.local = qn.local
      tag.uri = tag.ns[qn.prefix] || ''

      if (tag.prefix && !tag.uri) {
        strictFail(parser, 'Unbound namespace prefix: ' +
          JSON.stringify(parser.tagName))
        tag.uri = qn.prefix
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (tag.ns && parent.ns !== tag.ns) {
        Object.keys(tag.ns).forEach(function (p) {
          emitNode(parser, 'onopennamespace', {
            prefix: p,
            uri: tag.ns[p]
          })
        })
      }

      // handle deferred onattribute events
      // Note: do not apply default ns to attributes:
      //   http://www.w3.org/TR/REC-xml-names/#defaulting
      for (var i = 0, l = parser.attribList.length; i < l; i++) {
        var nv = parser.attribList[i]
        var name = nv[0]
        var value = nv[1]
        var qualName = qname(name, true)
        var prefix = qualName.prefix
        var local = qualName.local
        var uri = prefix === '' ? '' : (tag.ns[prefix] || '')
        var a = {
          name: name,
          value: value,
          prefix: prefix,
          local: local,
          uri: uri
        }

        // if there's any attributes with an undefined namespace,
        // then fail on them now.
        if (prefix && prefix !== 'xmlns' && !uri) {
          strictFail(parser, 'Unbound namespace prefix: ' +
            JSON.stringify(prefix))
          a.uri = prefix
        }
        parser.tag.attributes[name] = a
        emitNode(parser, 'onattribute', a)
      }
      parser.attribList.length = 0
    }

    parser.tag.isSelfClosing = !!selfClosing

    // process the tag
    parser.sawRoot = true
    parser.tags.push(parser.tag)
    emitNode(parser, 'onopentag', parser.tag)
    if (!selfClosing) {
      // special case for <script> in non-strict mode.
      if (!parser.noscript && parser.tagName.toLowerCase() === 'script') {
        parser.state = S.SCRIPT
      } else {
        parser.state = S.TEXT
      }
      parser.tag = null
      parser.tagName = ''
    }
    parser.attribName = parser.attribValue = ''
    parser.attribList.length = 0
  }

  function closeTag (parser) {
    if (!parser.tagName) {
      strictFail(parser, 'Weird empty close tag.')
      parser.textNode += '</>'
      parser.state = S.TEXT
      return
    }

    if (parser.script) {
      if (parser.tagName !== 'script') {
        parser.script += '</' + parser.tagName + '>'
        parser.tagName = ''
        parser.state = S.SCRIPT
        return
      }
      emitNode(parser, 'onscript', parser.script)
      parser.script = ''
    }

    // first make sure that the closing tag actually exists.
    // <a><b></c></b></a> will close everything, otherwise.
    var t = parser.tags.length
    var tagName = parser.tagName
    if (!parser.strict) {
      tagName = tagName[parser.looseCase]()
    }
    var closeTo = tagName
    while (t--) {
      var close = parser.tags[t]
      if (close.name !== closeTo) {
        // fail the first time in strict mode
        strictFail(parser, 'Unexpected close tag')
      } else {
        break
      }
    }

    // didn't find it.  we already failed for strict, so just abort.
    if (t < 0) {
      strictFail(parser, 'Unmatched closing tag: ' + parser.tagName)
      parser.textNode += '</' + parser.tagName + '>'
      parser.state = S.TEXT
      return
    }
    parser.tagName = tagName
    var s = parser.tags.length
    while (s-- > t) {
      var tag = parser.tag = parser.tags.pop()
      parser.tagName = parser.tag.name
      emitNode(parser, 'onclosetag', parser.tagName)

      var x = {}
      for (var i in tag.ns) {
        x[i] = tag.ns[i]
      }

      var parent = parser.tags[parser.tags.length - 1] || parser
      if (parser.opt.xmlns && tag.ns !== parent.ns) {
        // remove namespace bindings introduced by tag
        Object.keys(tag.ns).forEach(function (p) {
          var n = tag.ns[p]
          emitNode(parser, 'onclosenamespace', { prefix: p, uri: n })
        })
      }
    }
    if (t === 0) parser.closedRoot = true
    parser.tagName = parser.attribValue = parser.attribName = ''
    parser.attribList.length = 0
    parser.state = S.TEXT
  }

  function parseEntity (parser) {
    var entity = parser.entity
    var entityLC = entity.toLowerCase()
    var num
    var numStr = ''

    if (parser.ENTITIES[entity]) {
      return parser.ENTITIES[entity]
    }
    if (parser.ENTITIES[entityLC]) {
      return parser.ENTITIES[entityLC]
    }
    entity = entityLC
    if (entity.charAt(0) === '#') {
      if (entity.charAt(1) === 'x') {
        entity = entity.slice(2)
        num = parseInt(entity, 16)
        numStr = num.toString(16)
      } else {
        entity = entity.slice(1)
        num = parseInt(entity, 10)
        numStr = num.toString(10)
      }
    }
    entity = entity.replace(/^0+/, '')
    if (isNaN(num) || numStr.toLowerCase() !== entity) {
      strictFail(parser, 'Invalid character entity')
      return '&' + parser.entity + ';'
    }

    return String.fromCodePoint(num)
  }

  function beginWhiteSpace (parser, c) {
    if (c === '<') {
      parser.state = S.OPEN_WAKA
      parser.startTagPosition = parser.position
    } else if (!isWhitespace(c)) {
      // have to process this as a text node.
      // weird, but happens.
      strictFail(parser, 'Non-whitespace before first tag.')
      parser.textNode = c
      parser.state = S.TEXT
    }
  }

  function charAt (chunk, i) {
    var result = ''
    if (i < chunk.length) {
      result = chunk.charAt(i)
    }
    return result
  }

  function write (chunk) {
    var parser = this
    if (this.error) {
      throw this.error
    }
    if (parser.closed) {
      return error(parser,
        'Cannot write after close. Assign an onready handler.')
    }
    if (chunk === null) {
      return end(parser)
    }
    if (typeof chunk === 'object') {
      chunk = chunk.toString()
    }
    var i = 0
    var c = ''
    while (true) {
      c = charAt(chunk, i++)
      parser.c = c

      if (!c) {
        break
      }

      if (parser.trackPosition) {
        parser.position++
        if (c === '\n') {
          parser.line++
          parser.column = 0
        } else {
          parser.column++
        }
      }

      switch (parser.state) {
        case S.BEGIN:
          parser.state = S.BEGIN_WHITESPACE
          if (c === '\uFEFF') {
            continue
          }
          beginWhiteSpace(parser, c)
          continue

        case S.BEGIN_WHITESPACE:
          beginWhiteSpace(parser, c)
          continue

        case S.TEXT:
          if (parser.sawRoot && !parser.closedRoot) {
            var starti = i - 1
            while (c && c !== '<' && c !== '&') {
              c = charAt(chunk, i++)
              if (c && parser.trackPosition) {
                parser.position++
                if (c === '\n') {
                  parser.line++
                  parser.column = 0
                } else {
                  parser.column++
                }
              }
            }
            parser.textNode += chunk.substring(starti, i - 1)
          }
          if (c === '<' && !(parser.sawRoot && parser.closedRoot && !parser.strict)) {
            parser.state = S.OPEN_WAKA
            parser.startTagPosition = parser.position
          } else {
            if (!isWhitespace(c) && (!parser.sawRoot || parser.closedRoot)) {
              strictFail(parser, 'Text data outside of root node.')
            }
            if (c === '&') {
              parser.state = S.TEXT_ENTITY
            } else {
              parser.textNode += c
            }
          }
          continue

        case S.SCRIPT:
          // only non-strict
          if (c === '<') {
            parser.state = S.SCRIPT_ENDING
          } else {
            parser.script += c
          }
          continue

        case S.SCRIPT_ENDING:
          if (c === '/') {
            parser.state = S.CLOSE_TAG
          } else {
            parser.script += '<' + c
            parser.state = S.SCRIPT
          }
          continue

        case S.OPEN_WAKA:
          // either a /, ?, !, or text is coming next.
          if (c === '!') {
            parser.state = S.SGML_DECL
            parser.sgmlDecl = ''
          } else if (isWhitespace(c)) {
            // wait for it...
          } else if (isMatch(nameStart, c)) {
            parser.state = S.OPEN_TAG
            parser.tagName = c
          } else if (c === '/') {
            parser.state = S.CLOSE_TAG
            parser.tagName = ''
          } else if (c === '?') {
            parser.state = S.PROC_INST
            parser.procInstName = parser.procInstBody = ''
          } else {
            strictFail(parser, 'Unencoded <')
            // if there was some whitespace, then add that in.
            if (parser.startTagPosition + 1 < parser.position) {
              var pad = parser.position - parser.startTagPosition
              c = new Array(pad).join(' ') + c
            }
            parser.textNode += '<' + c
            parser.state = S.TEXT
          }
          continue

        case S.SGML_DECL:
          if ((parser.sgmlDecl + c).toUpperCase() === CDATA) {
            emitNode(parser, 'onopencdata')
            parser.state = S.CDATA
            parser.sgmlDecl = ''
            parser.cdata = ''
          } else if (parser.sgmlDecl + c === '--') {
            parser.state = S.COMMENT
            parser.comment = ''
            parser.sgmlDecl = ''
          } else if ((parser.sgmlDecl + c).toUpperCase() === DOCTYPE) {
            parser.state = S.DOCTYPE
            if (parser.doctype || parser.sawRoot) {
              strictFail(parser,
                'Inappropriately located doctype declaration')
            }
            parser.doctype = ''
            parser.sgmlDecl = ''
          } else if (c === '>') {
            emitNode(parser, 'onsgmldeclaration', parser.sgmlDecl)
            parser.sgmlDecl = ''
            parser.state = S.TEXT
          } else if (isQuote(c)) {
            parser.state = S.SGML_DECL_QUOTED
            parser.sgmlDecl += c
          } else {
            parser.sgmlDecl += c
          }
          continue

        case S.SGML_DECL_QUOTED:
          if (c === parser.q) {
            parser.state = S.SGML_DECL
            parser.q = ''
          }
          parser.sgmlDecl += c
          continue

        case S.DOCTYPE:
          if (c === '>') {
            parser.state = S.TEXT
            emitNode(parser, 'ondoctype', parser.doctype)
            parser.doctype = true // just remember that we saw it.
          } else {
            parser.doctype += c
            if (c === '[') {
              parser.state = S.DOCTYPE_DTD
            } else if (isQuote(c)) {
              parser.state = S.DOCTYPE_QUOTED
              parser.q = c
            }
          }
          continue

        case S.DOCTYPE_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.q = ''
            parser.state = S.DOCTYPE
          }
          continue

        case S.DOCTYPE_DTD:
          parser.doctype += c
          if (c === ']') {
            parser.state = S.DOCTYPE
          } else if (isQuote(c)) {
            parser.state = S.DOCTYPE_DTD_QUOTED
            parser.q = c
          }
          continue

        case S.DOCTYPE_DTD_QUOTED:
          parser.doctype += c
          if (c === parser.q) {
            parser.state = S.DOCTYPE_DTD
            parser.q = ''
          }
          continue

        case S.COMMENT:
          if (c === '-') {
            parser.state = S.COMMENT_ENDING
          } else {
            parser.comment += c
          }
          continue

        case S.COMMENT_ENDING:
          if (c === '-') {
            parser.state = S.COMMENT_ENDED
            parser.comment = textopts(parser.opt, parser.comment)
            if (parser.comment) {
              emitNode(parser, 'oncomment', parser.comment)
            }
            parser.comment = ''
          } else {
            parser.comment += '-' + c
            parser.state = S.COMMENT
          }
          continue

        case S.COMMENT_ENDED:
          if (c !== '>') {
            strictFail(parser, 'Malformed comment')
            // allow <!-- blah -- bloo --> in non-strict mode,
            // which is a comment of " blah -- bloo "
            parser.comment += '--' + c
            parser.state = S.COMMENT
          } else {
            parser.state = S.TEXT
          }
          continue

        case S.CDATA:
          if (c === ']') {
            parser.state = S.CDATA_ENDING
          } else {
            parser.cdata += c
          }
          continue

        case S.CDATA_ENDING:
          if (c === ']') {
            parser.state = S.CDATA_ENDING_2
          } else {
            parser.cdata += ']' + c
            parser.state = S.CDATA
          }
          continue

        case S.CDATA_ENDING_2:
          if (c === '>') {
            if (parser.cdata) {
              emitNode(parser, 'oncdata', parser.cdata)
            }
            emitNode(parser, 'onclosecdata')
            parser.cdata = ''
            parser.state = S.TEXT
          } else if (c === ']') {
            parser.cdata += ']'
          } else {
            parser.cdata += ']]' + c
            parser.state = S.CDATA
          }
          continue

        case S.PROC_INST:
          if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else if (isWhitespace(c)) {
            parser.state = S.PROC_INST_BODY
          } else {
            parser.procInstName += c
          }
          continue

        case S.PROC_INST_BODY:
          if (!parser.procInstBody && isWhitespace(c)) {
            continue
          } else if (c === '?') {
            parser.state = S.PROC_INST_ENDING
          } else {
            parser.procInstBody += c
          }
          continue

        case S.PROC_INST_ENDING:
          if (c === '>') {
            emitNode(parser, 'onprocessinginstruction', {
              name: parser.procInstName,
              body: parser.procInstBody
            })
            parser.procInstName = parser.procInstBody = ''
            parser.state = S.TEXT
          } else {
            parser.procInstBody += '?' + c
            parser.state = S.PROC_INST_BODY
          }
          continue

        case S.OPEN_TAG:
          if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else {
            newTag(parser)
            if (c === '>') {
              openTag(parser)
            } else if (c === '/') {
              parser.state = S.OPEN_TAG_SLASH
            } else {
              if (!isWhitespace(c)) {
                strictFail(parser, 'Invalid character in tag name')
              }
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.OPEN_TAG_SLASH:
          if (c === '>') {
            openTag(parser, true)
            closeTag(parser)
          } else {
            strictFail(parser, 'Forward-slash in opening tag not followed by >')
            parser.state = S.ATTRIB
          }
          continue

        case S.ATTRIB:
          // haven't read the attribute name yet.
          if (isWhitespace(c)) {
            continue
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (c === '>') {
            strictFail(parser, 'Attribute without value')
            parser.attribValue = parser.attribName
            attrib(parser)
            openTag(parser)
          } else if (isWhitespace(c)) {
            parser.state = S.ATTRIB_NAME_SAW_WHITE
          } else if (isMatch(nameBody, c)) {
            parser.attribName += c
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_NAME_SAW_WHITE:
          if (c === '=') {
            parser.state = S.ATTRIB_VALUE
          } else if (isWhitespace(c)) {
            continue
          } else {
            strictFail(parser, 'Attribute without value')
            parser.tag.attributes[parser.attribName] = ''
            parser.attribValue = ''
            emitNode(parser, 'onattribute', {
              name: parser.attribName,
              value: ''
            })
            parser.attribName = ''
            if (c === '>') {
              openTag(parser)
            } else if (isMatch(nameStart, c)) {
              parser.attribName = c
              parser.state = S.ATTRIB_NAME
            } else {
              strictFail(parser, 'Invalid attribute name')
              parser.state = S.ATTRIB
            }
          }
          continue

        case S.ATTRIB_VALUE:
          if (isWhitespace(c)) {
            continue
          } else if (isQuote(c)) {
            parser.q = c
            parser.state = S.ATTRIB_VALUE_QUOTED
          } else {
            strictFail(parser, 'Unquoted attribute value')
            parser.state = S.ATTRIB_VALUE_UNQUOTED
            parser.attribValue = c
          }
          continue

        case S.ATTRIB_VALUE_QUOTED:
          if (c !== parser.q) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_Q
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          parser.q = ''
          parser.state = S.ATTRIB_VALUE_CLOSED
          continue

        case S.ATTRIB_VALUE_CLOSED:
          if (isWhitespace(c)) {
            parser.state = S.ATTRIB
          } else if (c === '>') {
            openTag(parser)
          } else if (c === '/') {
            parser.state = S.OPEN_TAG_SLASH
          } else if (isMatch(nameStart, c)) {
            strictFail(parser, 'No whitespace between attributes')
            parser.attribName = c
            parser.attribValue = ''
            parser.state = S.ATTRIB_NAME
          } else {
            strictFail(parser, 'Invalid attribute name')
          }
          continue

        case S.ATTRIB_VALUE_UNQUOTED:
          if (!isAttribEnd(c)) {
            if (c === '&') {
              parser.state = S.ATTRIB_VALUE_ENTITY_U
            } else {
              parser.attribValue += c
            }
            continue
          }
          attrib(parser)
          if (c === '>') {
            openTag(parser)
          } else {
            parser.state = S.ATTRIB
          }
          continue

        case S.CLOSE_TAG:
          if (!parser.tagName) {
            if (isWhitespace(c)) {
              continue
            } else if (notMatch(nameStart, c)) {
              if (parser.script) {
                parser.script += '</' + c
                parser.state = S.SCRIPT
              } else {
                strictFail(parser, 'Invalid tagname in closing tag.')
              }
            } else {
              parser.tagName = c
            }
          } else if (c === '>') {
            closeTag(parser)
          } else if (isMatch(nameBody, c)) {
            parser.tagName += c
          } else if (parser.script) {
            parser.script += '</' + parser.tagName
            parser.tagName = ''
            parser.state = S.SCRIPT
          } else {
            if (!isWhitespace(c)) {
              strictFail(parser, 'Invalid tagname in closing tag')
            }
            parser.state = S.CLOSE_TAG_SAW_WHITE
          }
          continue

        case S.CLOSE_TAG_SAW_WHITE:
          if (isWhitespace(c)) {
            continue
          }
          if (c === '>') {
            closeTag(parser)
          } else {
            strictFail(parser, 'Invalid characters in closing tag')
          }
          continue

        case S.TEXT_ENTITY:
        case S.ATTRIB_VALUE_ENTITY_Q:
        case S.ATTRIB_VALUE_ENTITY_U:
          var returnState
          var buffer
          switch (parser.state) {
            case S.TEXT_ENTITY:
              returnState = S.TEXT
              buffer = 'textNode'
              break

            case S.ATTRIB_VALUE_ENTITY_Q:
              returnState = S.ATTRIB_VALUE_QUOTED
              buffer = 'attribValue'
              break

            case S.ATTRIB_VALUE_ENTITY_U:
              returnState = S.ATTRIB_VALUE_UNQUOTED
              buffer = 'attribValue'
              break
          }

          if (c === ';') {
            parser[buffer] += parseEntity(parser)
            parser.entity = ''
            parser.state = returnState
          } else if (isMatch(parser.entity.length ? entityBody : entityStart, c)) {
            parser.entity += c
          } else {
            strictFail(parser, 'Invalid character in entity name')
            parser[buffer] += '&' + parser.entity + c
            parser.entity = ''
            parser.state = returnState
          }

          continue

        default:
          throw new Error(parser, 'Unknown state: ' + parser.state)
      }
    } // while

    if (parser.position >= parser.bufferCheckPosition) {
      checkBufferLength(parser)
    }
    return parser
  }

  /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
  /* istanbul ignore next */
  if (!String.fromCodePoint) {
    (function () {
      var stringFromCharCode = String.fromCharCode
      var floor = Math.floor
      var fromCodePoint = function () {
        var MAX_SIZE = 0x4000
        var codeUnits = []
        var highSurrogate
        var lowSurrogate
        var index = -1
        var length = arguments.length
        if (!length) {
          return ''
        }
        var result = ''
        while (++index < length) {
          var codePoint = Number(arguments[index])
          if (
            !isFinite(codePoint) || // `NaN`, `+Infinity`, or `-Infinity`
            codePoint < 0 || // not a valid Unicode code point
            codePoint > 0x10FFFF || // not a valid Unicode code point
            floor(codePoint) !== codePoint // not an integer
          ) {
            throw RangeError('Invalid code point: ' + codePoint)
          }
          if (codePoint <= 0xFFFF) { // BMP code point
            codeUnits.push(codePoint)
          } else { // Astral code point; split in surrogate halves
            // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
            codePoint -= 0x10000
            highSurrogate = (codePoint >> 10) + 0xD800
            lowSurrogate = (codePoint % 0x400) + 0xDC00
            codeUnits.push(highSurrogate, lowSurrogate)
          }
          if (index + 1 === length || codeUnits.length > MAX_SIZE) {
            result += stringFromCharCode.apply(null, codeUnits)
            codeUnits.length = 0
          }
        }
        return result
      }
      /* istanbul ignore next */
      if (Object.defineProperty) {
        Object.defineProperty(String, 'fromCodePoint', {
          value: fromCodePoint,
          configurable: true,
          writable: true
        })
      } else {
        String.fromCodePoint = fromCodePoint
      }
    }())
  }
})( false ? 0 : exports)


/***/ }),

/***/ "./node_modules/stream/index.js":
/*!**************************************!*\
  !*** ./node_modules/stream/index.js ***!
  \**************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

var Emitter = __webpack_require__(/*! emitter */ "./node_modules/emitter-component/index.js");

function Stream() {
  Emitter.call(this);
}
Stream.prototype = new Emitter();
module.exports = Stream;
// Backwards-compat with node 0.4.x
Stream.Stream = Stream;

Stream.prototype.pipe = function(dest, options) {
  var source = this;

  function ondata(chunk) {
    if (dest.writable) {
      if (false === dest.write(chunk) && source.pause) {
        source.pause();
      }
    }
  }

  source.on('data', ondata);

  function ondrain() {
    if (source.readable && source.resume) {
      source.resume();
    }
  }

  dest.on('drain', ondrain);

  // If the 'end' option is not supplied, dest.end() will be called when
  // source gets the 'end' or 'close' events.  Only dest.end() once.
  if (!dest._isStdio && (!options || options.end !== false)) {
    source.on('end', onend);
    source.on('close', onclose);
  }

  var didOnEnd = false;
  function onend() {
    if (didOnEnd) return;
    didOnEnd = true;

    dest.end();
  }


  function onclose() {
    if (didOnEnd) return;
    didOnEnd = true;

    if (typeof dest.destroy === 'function') dest.destroy();
  }

  // don't leave dangling pipes when there are errors.
  function onerror(er) {
    cleanup();
    if (!this.hasListeners('error')) {
      throw er; // Unhandled stream error in pipe.
    }
  }

  source.on('error', onerror);
  dest.on('error', onerror);

  // remove all the event listeners that were added.
  function cleanup() {
    source.off('data', ondata);
    dest.off('drain', ondrain);

    source.off('end', onend);
    source.off('close', onclose);

    source.off('error', onerror);
    dest.off('error', onerror);

    source.off('end', cleanup);
    source.off('close', cleanup);

    dest.off('end', cleanup);
    dest.off('close', cleanup);
  }

  source.on('end', cleanup);
  source.on('close', cleanup);

  dest.on('end', cleanup);
  dest.on('close', cleanup);

  dest.emit('pipe', source);

  // Allow for unix-like usage: A.pipe(B).pipe(C)
  return dest;
}


/***/ }),

/***/ "./node_modules/string_decoder/lib/string_decoder.js":
/*!***********************************************************!*\
  !*** ./node_modules/string_decoder/lib/string_decoder.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



/*<replacement>*/

var Buffer = (__webpack_require__(/*! safe-buffer */ "./node_modules/safe-buffer/index.js").Buffer);
/*</replacement>*/

var isEncoding = Buffer.isEncoding || function (encoding) {
  encoding = '' + encoding;
  switch (encoding && encoding.toLowerCase()) {
    case 'hex':case 'utf8':case 'utf-8':case 'ascii':case 'binary':case 'base64':case 'ucs2':case 'ucs-2':case 'utf16le':case 'utf-16le':case 'raw':
      return true;
    default:
      return false;
  }
};

function _normalizeEncoding(enc) {
  if (!enc) return 'utf8';
  var retried;
  while (true) {
    switch (enc) {
      case 'utf8':
      case 'utf-8':
        return 'utf8';
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return 'utf16le';
      case 'latin1':
      case 'binary':
        return 'latin1';
      case 'base64':
      case 'ascii':
      case 'hex':
        return enc;
      default:
        if (retried) return; // undefined
        enc = ('' + enc).toLowerCase();
        retried = true;
    }
  }
};

// Do not cache `Buffer.isEncoding` when checking encoding names as some
// modules monkey-patch it to support additional encodings
function normalizeEncoding(enc) {
  var nenc = _normalizeEncoding(enc);
  if (typeof nenc !== 'string' && (Buffer.isEncoding === isEncoding || !isEncoding(enc))) throw new Error('Unknown encoding: ' + enc);
  return nenc || enc;
}

// StringDecoder provides an interface for efficiently splitting a series of
// buffers into a series of JS strings without breaking apart multi-byte
// characters.
exports.StringDecoder = StringDecoder;
function StringDecoder(encoding) {
  this.encoding = normalizeEncoding(encoding);
  var nb;
  switch (this.encoding) {
    case 'utf16le':
      this.text = utf16Text;
      this.end = utf16End;
      nb = 4;
      break;
    case 'utf8':
      this.fillLast = utf8FillLast;
      nb = 4;
      break;
    case 'base64':
      this.text = base64Text;
      this.end = base64End;
      nb = 3;
      break;
    default:
      this.write = simpleWrite;
      this.end = simpleEnd;
      return;
  }
  this.lastNeed = 0;
  this.lastTotal = 0;
  this.lastChar = Buffer.allocUnsafe(nb);
}

StringDecoder.prototype.write = function (buf) {
  if (buf.length === 0) return '';
  var r;
  var i;
  if (this.lastNeed) {
    r = this.fillLast(buf);
    if (r === undefined) return '';
    i = this.lastNeed;
    this.lastNeed = 0;
  } else {
    i = 0;
  }
  if (i < buf.length) return r ? r + this.text(buf, i) : this.text(buf, i);
  return r || '';
};

StringDecoder.prototype.end = utf8End;

// Returns only complete characters in a Buffer
StringDecoder.prototype.text = utf8Text;

// Attempts to complete a partial non-UTF-8 character using bytes from a Buffer
StringDecoder.prototype.fillLast = function (buf) {
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, this.lastTotal - this.lastNeed, 0, buf.length);
  this.lastNeed -= buf.length;
};

// Checks the type of a UTF-8 byte, whether it's ASCII, a leading byte, or a
// continuation byte. If an invalid byte is detected, -2 is returned.
function utf8CheckByte(byte) {
  if (byte <= 0x7F) return 0;else if (byte >> 5 === 0x06) return 2;else if (byte >> 4 === 0x0E) return 3;else if (byte >> 3 === 0x1E) return 4;
  return byte >> 6 === 0x02 ? -1 : -2;
}

// Checks at most 3 bytes at the end of a Buffer in order to detect an
// incomplete multi-byte UTF-8 character. The total number of bytes (2, 3, or 4)
// needed to complete the UTF-8 character (if applicable) are returned.
function utf8CheckIncomplete(self, buf, i) {
  var j = buf.length - 1;
  if (j < i) return 0;
  var nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 1;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) self.lastNeed = nb - 2;
    return nb;
  }
  if (--j < i || nb === -2) return 0;
  nb = utf8CheckByte(buf[j]);
  if (nb >= 0) {
    if (nb > 0) {
      if (nb === 2) nb = 0;else self.lastNeed = nb - 3;
    }
    return nb;
  }
  return 0;
}

// Validates as many continuation bytes for a multi-byte UTF-8 character as
// needed or are available. If we see a non-continuation byte where we expect
// one, we "replace" the validated continuation bytes we've seen so far with
// a single UTF-8 replacement character ('\ufffd'), to match v8's UTF-8 decoding
// behavior. The continuation byte check is included three times in the case
// where all of the continuation bytes for a character exist in the same buffer.
// It is also done this way as a slight performance increase instead of using a
// loop.
function utf8CheckExtraBytes(self, buf, p) {
  if ((buf[0] & 0xC0) !== 0x80) {
    self.lastNeed = 0;
    return '\ufffd';
  }
  if (self.lastNeed > 1 && buf.length > 1) {
    if ((buf[1] & 0xC0) !== 0x80) {
      self.lastNeed = 1;
      return '\ufffd';
    }
    if (self.lastNeed > 2 && buf.length > 2) {
      if ((buf[2] & 0xC0) !== 0x80) {
        self.lastNeed = 2;
        return '\ufffd';
      }
    }
  }
}

// Attempts to complete a multi-byte UTF-8 character using bytes from a Buffer.
function utf8FillLast(buf) {
  var p = this.lastTotal - this.lastNeed;
  var r = utf8CheckExtraBytes(this, buf, p);
  if (r !== undefined) return r;
  if (this.lastNeed <= buf.length) {
    buf.copy(this.lastChar, p, 0, this.lastNeed);
    return this.lastChar.toString(this.encoding, 0, this.lastTotal);
  }
  buf.copy(this.lastChar, p, 0, buf.length);
  this.lastNeed -= buf.length;
}

// Returns all complete UTF-8 characters in a Buffer. If the Buffer ended on a
// partial character, the character's bytes are buffered until the required
// number of bytes are available.
function utf8Text(buf, i) {
  var total = utf8CheckIncomplete(this, buf, i);
  if (!this.lastNeed) return buf.toString('utf8', i);
  this.lastTotal = total;
  var end = buf.length - (total - this.lastNeed);
  buf.copy(this.lastChar, 0, end);
  return buf.toString('utf8', i, end);
}

// For UTF-8, a replacement character is added when ending on a partial
// character.
function utf8End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + '\ufffd';
  return r;
}

// UTF-16LE typically needs two bytes per character, but even if we have an even
// number of bytes available, we need to check if we end on a leading/high
// surrogate. In that case, we need to wait for the next two bytes in order to
// decode the last character properly.
function utf16Text(buf, i) {
  if ((buf.length - i) % 2 === 0) {
    var r = buf.toString('utf16le', i);
    if (r) {
      var c = r.charCodeAt(r.length - 1);
      if (c >= 0xD800 && c <= 0xDBFF) {
        this.lastNeed = 2;
        this.lastTotal = 4;
        this.lastChar[0] = buf[buf.length - 2];
        this.lastChar[1] = buf[buf.length - 1];
        return r.slice(0, -1);
      }
    }
    return r;
  }
  this.lastNeed = 1;
  this.lastTotal = 2;
  this.lastChar[0] = buf[buf.length - 1];
  return buf.toString('utf16le', i, buf.length - 1);
}

// For UTF-16LE we do not explicitly append special replacement characters if we
// end on a partial character, we simply let v8 handle that.
function utf16End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) {
    var end = this.lastTotal - this.lastNeed;
    return r + this.lastChar.toString('utf16le', 0, end);
  }
  return r;
}

function base64Text(buf, i) {
  var n = (buf.length - i) % 3;
  if (n === 0) return buf.toString('base64', i);
  this.lastNeed = 3 - n;
  this.lastTotal = 3;
  if (n === 1) {
    this.lastChar[0] = buf[buf.length - 1];
  } else {
    this.lastChar[0] = buf[buf.length - 2];
    this.lastChar[1] = buf[buf.length - 1];
  }
  return buf.toString('base64', i, buf.length - n);
}

function base64End(buf) {
  var r = buf && buf.length ? this.write(buf) : '';
  if (this.lastNeed) return r + this.lastChar.toString('base64', 0, 3 - this.lastNeed);
  return r;
}

// Pass bytes on through for single-byte encodings (e.g. ascii, latin1, hex)
function simpleWrite(buf) {
  return buf.toString(this.encoding);
}

function simpleEnd(buf) {
  return buf && buf.length ? this.write(buf) : '';
}

/***/ }),

/***/ "./src/components/Editor.scss":
/*!************************************!*\
  !*** ./src/components/Editor.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Editor_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Editor.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Editor.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Editor_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Editor_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Editor_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Editor_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Interface.scss":
/*!***************************************!*\
  !*** ./src/components/Interface.scss ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Interface_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Interface.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Interface.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Interface_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Interface_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Interface_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Interface_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/Player.scss":
/*!************************************!*\
  !*** ./src/components/Player.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Player_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./Player.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/Player.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Player_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Player_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Player_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_Player_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {

"use strict";


var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {

"use strict";


var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {

"use strict";


/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/components/Audio.ts":
/*!*********************************!*\
  !*** ./src/components/Audio.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const event_1 = __webpack_require__(/*! ./event */ "./src/components/event.ts");
const fileLoader_1 = __webpack_require__(/*! ../utils/fileLoader */ "./src/utils/fileLoader.ts");
const parser_1 = __webpack_require__(/*! ../utils/parser */ "./src/utils/parser.ts");
class Audio extends event_1.default {
    constructor(options) {
        super();
        this.samples = [];
        this.audio = new AudioContext();
        this.audioBuffer = this.audio.createBufferSource();
        if (!window.webAudioControlsWidgetManager) {
            window.alert("webaudio-controls not found, add to a <script> tag.");
        }
        window.webAudioControlsWidgetManager.addMidiListener((event) => this.onKeyboard(event));
        this.loader = new fileLoader_1.default();
        (0, parser_1.setParserLoader)(this.loader);
        if (options.root)
            this.loader.setRoot(options.root);
        if (options.file) {
            const file = this.loader.addFile(options.file);
            this.showFile(file);
        }
    }
    loadSample(path) {
        return __awaiter(this, void 0, void 0, function* () {
            const fileRef = this.loader.files[path];
            if (fileRef) {
                return yield this.loader.getFile(fileRef, true);
            }
            const file = this.loader.addFile(path);
            return this.loader.getFile(file, true);
        });
    }
    showFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            file = yield this.loader.getFile(file);
            const prefix = (file === null || file === void 0 ? void 0 : file.path.startsWith("https"))
                ? this.loader.root + "Programs/"
                : "Programs/";
            const sfzObject = yield (0, parser_1.parseSfz)(prefix, file === null || file === void 0 ? void 0 : file.contents);
            console.log("showFile", file);
            console.log("parseSFZ", sfzObject);
            // hardcoded prototype for one sfz file
            let defaultPath = "";
            if (sfzObject.control &&
                sfzObject.control[0] &&
                sfzObject.control[0].default_path) {
                defaultPath = sfzObject.control[0].default_path;
            }
            let regions = sfzObject.region;
            if (sfzObject.master)
                regions = sfzObject.master[0].region;
            if (regions) {
                regions.forEach((region) => {
                    this.samples[region.lokey] = region.sample.replace("../", "");
                    if (file === null || file === void 0 ? void 0 : file.path.startsWith("https")) {
                        this.samples[region.lokey] =
                            this.loader.root + defaultPath + region.sample.replace("../", "");
                    }
                });
                for (const key in this.samples) {
                    yield this.loadSample(this.samples[key]);
                }
                const keys = Object.keys(this.samples);
                this.dispatchEvent("load", {
                    start: Number(keys[0]),
                    end: Number(keys[keys.length - 1]),
                });
            }
        });
    }
    onKeyboard(event) {
        const controlEvent = {
            channel: 0x90,
            note: event.data[1],
            velocity: event.data[0] === 128 ? 0 : event.data[2],
        };
        this.setSynth(controlEvent);
        this.dispatchEvent("change", controlEvent);
    }
    setSynth(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // prototype using samples
            if (event.velocity === 0) {
                // this.audioBuffer.stop();
                return;
            }
            const samplePath = this.samples[event.note];
            console.log("samplePath", event.note, samplePath);
            const fileRef = this.loader.files[samplePath];
            const newFile = yield this.loader.getFile(fileRef || samplePath, true);
            this.audioBuffer = this.audio.createBufferSource();
            this.audioBuffer.buffer = newFile === null || newFile === void 0 ? void 0 : newFile.contents;
            this.audioBuffer.connect(this.audio.destination);
            this.audioBuffer.start(0);
        });
    }
}
exports["default"] = Audio;


/***/ }),

/***/ "./src/components/Editor.ts":
/*!**********************************!*\
  !*** ./src/components/Editor.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./Editor.scss */ "./src/components/Editor.scss");
const component_1 = __webpack_require__(/*! ./component */ "./src/components/component.ts");
const fileLoader_1 = __webpack_require__(/*! ../utils/fileLoader */ "./src/utils/fileLoader.ts");
class Editor extends component_1.default {
    constructor(options) {
        super("editor");
        if (!window.ace) {
            window.alert("Ace editor not found, add to a <script> tag.");
        }
        this.fileEl = document.createElement("div");
        this.fileEl.className = "fileList";
        this.getEl().appendChild(this.fileEl);
        this.aceEl = document.createElement("div");
        this.aceEl.className = "ace";
        this.ace = window.ace.edit(this.aceEl, {
            theme: "ace/theme/monokai",
        });
        this.getEl().appendChild(this.aceEl);
        if (options.loader) {
            this.loader = options.loader;
        }
        else {
            this.loader = new fileLoader_1.default();
        }
        if (options.root)
            this.loader.setRoot(options.root);
        if (options.directory) {
            this.loader.addDirectory(options.directory);
            this.render();
        }
        if (options.file) {
            const file = this.loader.addFile(options.file);
            this.showFile(file);
        }
    }
    showFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            file = yield this.loader.getFile(file);
            if (!file)
                return;
            if (file.ext === "sfz") {
                const SfzMode = (__webpack_require__(/*! ../lib/mode-sfz */ "./src/lib/mode-sfz.js").Mode);
                this.ace.session.setMode(new SfzMode());
            }
            else {
                const modelist = window.ace.require("ace/ext/modelist");
                if (!modelist) {
                    window.alert("Ace modelist not found, add to a <script> tag.");
                }
                const mode = modelist.getModeForPath(file.path).mode;
                this.ace.session.setMode(mode);
            }
            this.ace.setOption("value", file.contents);
        });
    }
    createTree(root, files, filesTree) {
        const ul = document.createElement("ul");
        for (const key in filesTree) {
            let filePath = root + "/" + key;
            if (filePath.startsWith("/"))
                filePath = filePath.slice(1);
            const li = document.createElement("li");
            if (Object.keys(filesTree[key]).length > 0) {
                const details = document.createElement("details");
                const summary = document.createElement("summary");
                summary.innerHTML = key;
                details.appendChild(summary);
                details.appendChild(this.createTree(filePath, files, filesTree[key]));
                li.appendChild(details);
            }
            else {
                li.innerHTML = key;
                li.addEventListener("click", () => __awaiter(this, void 0, void 0, function* () {
                    yield this.showFile(files[filePath]);
                }));
            }
            ul.appendChild(li);
        }
        return ul;
    }
    render() {
        this.fileEl.replaceChildren();
        this.fileEl.innerHTML = this.loader.root;
        const ul = this.createTree("", this.loader.files, this.loader.filesTree);
        ul.className = "tree";
        this.fileEl.appendChild(ul);
    }
}
exports["default"] = Editor;


/***/ }),

/***/ "./src/components/Interface.ts":
/*!*************************************!*\
  !*** ./src/components/Interface.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ./Interface.scss */ "./src/components/Interface.scss");
const xml_js_1 = __webpack_require__(/*! xml-js */ "./node_modules/xml-js/lib/index.js");
const component_1 = __webpack_require__(/*! ./component */ "./src/components/component.ts");
const interface_1 = __webpack_require__(/*! ../types/interface */ "./src/types/interface.ts");
const fileLoader_1 = __webpack_require__(/*! ../utils/fileLoader */ "./src/utils/fileLoader.ts");
class Interface extends component_1.default {
    constructor(options) {
        super("interface");
        this.width = 775;
        this.height = 330;
        this.keyboardStart = 0;
        this.keyboardEnd = 200;
        this.instrument = {};
        this.tabs = document.createElement("div");
        this.tabs.className = "tabs";
        this.addTab("Info");
        this.addTab("Controls");
        this.getEl().appendChild(this.tabs);
        this.addKeyboard();
        if (options.loader) {
            this.loader = options.loader;
        }
        else {
            this.loader = new fileLoader_1.default();
        }
        if (options.root)
            this.loader.setRoot(options.root);
        if (options.directory)
            this.loader.addDirectory(options.directory);
        if (options.file) {
            const file = this.loader.addFile(options.file);
            this.showFile(file);
        }
    }
    showFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            file = yield this.loader.getFile(file);
            this.instrument = this.parseXML(file);
            this.render();
        });
    }
    render() {
        this.setupInfo();
        this.setupControls();
    }
    toPercentage(val1, val2) {
        return Math.min(Number(val1) / val2, 1) * 100 + "%";
    }
    toRelative(element) {
        return {
            left: this.toPercentage(element.x, this.width),
            top: this.toPercentage(element.y, this.height),
            width: this.toPercentage(element.w, this.width),
            height: this.toPercentage(element.h, this.height),
        };
    }
    addImage(image) {
        return __awaiter(this, void 0, void 0, function* () {
            const relative = this.toRelative(image);
            const img = document.createElement("img");
            img.setAttribute("draggable", "false");
            img.setAttribute("style", `left: ${relative.left}; top: ${relative.top}; width: ${relative.width}; height: ${relative.height};`);
            yield this.addImageAtr(img, "src", image.image);
            return img;
        });
    }
    addImageAtr(img, attribute, path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loader.root.startsWith("http")) {
                img.setAttribute(attribute, this.loader.root + "GUI/" + path);
            }
            else {
                const file = this.loader.files["GUI/" + path];
                if (file && "handle" in file) {
                    img.setAttribute(attribute, URL.createObjectURL(file.handle));
                }
            }
        });
    }
    addControl(type, element) {
        const relative = this.toRelative(element);
        const el = document.createElement(`webaudio-${type}`);
        if ("image" in element)
            this.addImageAtr(el, "src", element.image);
        if ("image_bg" in element)
            this.addImageAtr(el, "src", element.image_bg);
        if ("image_handle" in element)
            this.addImageAtr(el, "knobsrc", element.image_handle);
        if ("frames" in element) {
            el.setAttribute("value", "0");
            el.setAttribute("max", Number(element.frames) - 1);
            el.setAttribute("step", "1");
            el.setAttribute("sprites", Number(element.frames) - 1);
            el.setAttribute("tooltip", "%d");
        }
        if ("orientation" in element) {
            const dir = element.orientation === "vertical" ? "vert" : "horz";
            el.setAttribute("direction", dir);
        }
        if ("x" in element) {
            el.setAttribute("style", `left: ${relative.left}; top: ${relative.top};`);
        }
        if ("w" in element) {
            el.setAttribute("height", element.h);
            el.setAttribute("width", element.w);
        }
        return el;
    }
    addKeyboard() {
        const keyboard = document.createElement("webaudio-keyboard");
        keyboard.setAttribute("keys", "88");
        keyboard.setAttribute("height", "70");
        keyboard.setAttribute("width", "775");
        keyboard.addEventListener("change", (event) => {
            const controlEvent = {
                channel: 0x90,
                note: event.note[1],
                velocity: event.note[0] ? 100 : 0,
            };
            this.dispatchEvent("change", controlEvent);
        });
        this.getEl().appendChild(keyboard);
        this.keyboard = keyboard;
        window.addEventListener("resize", () => this.resizeKeyboard());
        window.setTimeout(() => this.resizeKeyboard());
    }
    resizeKeyboard() {
        const keysFit = Math.floor(this.getEl().clientWidth / 13);
        const keysRange = this.keyboardEnd - this.keyboardStart;
        const keysDiff = Math.floor(keysFit / 2 - keysRange / 2);
        this.keyboard.min = Math.max(this.keyboardStart - keysDiff, 0);
        this.keyboard.keys = keysFit;
        this.keyboard.width = this.getEl().clientWidth;
        // This feature is only available if this PR is merged
        // https://github.com/g200kg/webaudio-controls/pull/52
        this.keyboard.setDisabledRange(1, 0, this.keyboardStart);
        this.keyboard.setDisabledRange(1, this.keyboardEnd, 200);
    }
    setKeyboard(event) {
        this.keyboard.setNote(event.velocity, event.note);
    }
    setKeyboardRange(start, end) {
        console.log("setKeyboardRange", start, end);
        this.keyboardStart = start || 0;
        this.keyboardEnd = end || 100;
        this.resizeKeyboard();
    }
    addTab(name) {
        const input = document.createElement("input");
        input.className = "radiotab";
        if (name === "Info")
            input.setAttribute("checked", "checked");
        input.type = "radio";
        input.id = name.toLowerCase();
        input.name = "tabs";
        this.tabs.appendChild(input);
        const label = document.createElement("label");
        label.className = "label";
        label.setAttribute("for", name.toLowerCase());
        label.innerHTML = name;
        this.tabs.appendChild(label);
        const div = document.createElement("div");
        div.className = "panel";
        this.tabs.appendChild(div);
    }
    addText(text) {
        const relative = this.toRelative(text);
        const span = document.createElement("span");
        span.setAttribute("style", `left: ${relative.left}; top: ${relative.top}; width: ${relative.width}; height: ${relative.height}; color: ${text.color_text};`);
        span.innerHTML = text.text;
        return span;
    }
    parseXML(file) {
        if (!file)
            return {};
        const fileParsed = (0, xml_js_1.xml2js)(file.contents);
        return this.findElements({}, fileParsed.elements);
    }
    setupInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instrument.AriaGUI)
                return;
            const info = this.tabs.getElementsByClassName("panel")[0];
            info.replaceChildren();
            const file = yield this.loader.getFile(this.loader.root + this.instrument.AriaGUI[0].path);
            const fileXml = yield this.parseXML(file);
            info.appendChild(yield this.addImage(fileXml.StaticImage[0]));
        });
    }
    setupControls() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instrument.AriaProgram)
                return;
            const controls = this.tabs.getElementsByClassName("panel")[1];
            controls.replaceChildren();
            const file = yield this.loader.getFile(this.loader.root + this.instrument.AriaProgram[0].gui);
            const fileXml = yield this.parseXML(file);
            if (fileXml.Knob)
                fileXml.Knob.forEach((knob) => controls.appendChild(this.addControl(interface_1.PlayerElements.Knob, knob)));
            if (fileXml.OnOffButton)
                fileXml.OnOffButton.forEach((button) => controls.appendChild(this.addControl(interface_1.PlayerElements.Switch, button)));
            if (fileXml.Slider)
                fileXml.Slider.forEach((slider) => controls.appendChild(this.addControl(interface_1.PlayerElements.Slider, slider)));
            if (fileXml.StaticImage)
                fileXml.StaticImage.forEach((image) => __awaiter(this, void 0, void 0, function* () { return controls.appendChild(yield this.addImage(image)); }));
            if (fileXml.StaticText)
                fileXml.StaticText.forEach((text) => controls.appendChild(this.addText(text)));
            window.addEventListener("resize", () => this.resizeControls());
            window.setTimeout(() => this.resizeControls());
        });
    }
    resizeControls() {
        const width = Math.floor(this.getEl().clientWidth / 25);
        const sliderWidth = Math.floor(this.getEl().clientWidth / 65);
        const sliderHeight = Math.floor(this.getEl().clientHeight / 3.5);
        const controls = this.tabs.getElementsByClassName("panel")[1];
        controls.childNodes.forEach((control) => {
            if (control.nodeName === "WEBAUDIO-KNOB" ||
                control.nodeName === "WEBAUDIO-SWITCH") {
                control.width = control.height = width;
            }
            else if (control.nodeName === "WEBAUDIO-SLIDER") {
                control.width = sliderWidth;
                control.height = sliderHeight;
            }
        });
    }
    findElements(list, nodes) {
        nodes.forEach((node) => {
            if (node.type === "element") {
                if (!list[node.name])
                    list[node.name] = [];
                list[node.name].push(node.attributes);
            }
            if (node.elements) {
                this.findElements(list, node.elements);
            }
        });
        return list;
    }
}
exports["default"] = Interface;


/***/ }),

/***/ "./src/components/Player.ts":
/*!**********************************!*\
  !*** ./src/components/Player.ts ***!
  \**********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const component_1 = __webpack_require__(/*! ./component */ "./src/components/component.ts");
const Editor_1 = __webpack_require__(/*! ./Editor */ "./src/components/Editor.ts");
const Interface_1 = __webpack_require__(/*! ./Interface */ "./src/components/Interface.ts");
__webpack_require__(/*! ./Player.scss */ "./src/components/Player.scss");
const browser_fs_access_1 = __webpack_require__(/*! browser-fs-access */ "./node_modules/browser-fs-access/dist/index.modern.js");
const utils_1 = __webpack_require__(/*! ../utils/utils */ "./src/utils/utils.ts");
const fileLoader_1 = __webpack_require__(/*! ../utils/fileLoader */ "./src/utils/fileLoader.ts");
const Audio_1 = __webpack_require__(/*! ./Audio */ "./src/components/Audio.ts");
const api_1 = __webpack_require__(/*! ../utils/api */ "./src/utils/api.ts");
class Player extends component_1.default {
    constructor(id, options) {
        var _a;
        super("player");
        this.loader = new fileLoader_1.default();
        if (options.audio)
            this.setupAudio(options.audio);
        if (options.header)
            this.setupHeader();
        if (options.interface)
            this.setupInterface(options.interface);
        if (options.editor)
            this.setupEditor(options.editor);
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.appendChild(this.getEl());
    }
    setupAudio(options) {
        options.loader = this.loader;
        this.audio = new Audio_1.default(options);
        this.audio.addEvent("change", (event) => {
            if (this.interface)
                this.interface.setKeyboard(event.data);
        });
        this.audio.addEvent("load", (event) => {
            if (this.interface)
                this.interface.setKeyboardRange(event.data.start, event.data.end);
        });
    }
    setupInterface(options) {
        options.loader = this.loader;
        this.interface = new Interface_1.default(options);
        this.interface.addEvent("change", (event) => {
            if (this.audio)
                this.audio.setSynth(event.data);
        });
        this.getEl().appendChild(this.interface.getEl());
    }
    setupEditor(options) {
        options.loader = this.loader;
        this.editor = new Editor_1.default(options);
        this.getEl().appendChild(this.editor.getEl());
    }
    setupHeader() {
        const div = document.createElement("div");
        div.className = "header";
        const inputLocal = document.createElement("input");
        inputLocal.type = "button";
        inputLocal.value = "Local directory";
        inputLocal.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            yield this.loadLocalInstrument();
        }));
        div.appendChild(inputLocal);
        const inputRemote = document.createElement("input");
        inputRemote.type = "button";
        inputRemote.value = "Remote directory";
        inputRemote.addEventListener("click", (e) => __awaiter(this, void 0, void 0, function* () {
            yield this.loadRemoteInstrument();
        }));
        div.appendChild(inputRemote);
        this.getEl().appendChild(div);
    }
    loadLocalInstrument() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blobs = (yield (0, browser_fs_access_1.directoryOpen)({
                    recursive: true,
                }));
                console.log(`${blobs.length} files selected.`);
                this.loadDirectory((0, utils_1.pathRoot)(blobs[0].webkitRelativePath), blobs);
            }
            catch (err) {
                if (err.name !== "AbortError") {
                    return console.error(err);
                }
                console.log("The user aborted a request.");
            }
        });
    }
    loadRemoteInstrument() {
        return __awaiter(this, void 0, void 0, function* () {
            const repo = window.prompt("Enter a GitHub owner/repo", "studiorack/black-and-green-guitars");
            if (repo) {
                const response = yield (0, api_1.getJSON)(`https://api.github.com/repos/${repo}/git/trees/main?recursive=1`);
                const paths = response.tree.map((file) => `https://raw.githubusercontent.com/${repo}/main/${file.path}`);
                yield this.loadDirectory(`https://raw.githubusercontent.com/${repo}/main/`, paths);
            }
        });
    }
    loadDirectory(root, files) {
        return __awaiter(this, void 0, void 0, function* () {
            let audioFile;
            let interfaceFile;
            for (const file of files) {
                const path = typeof file === "string" ? file : file.webkitRelativePath;
                if (!audioFile &&
                    (0, utils_1.pathExt)(path) === "sfz" &&
                    ((0, utils_1.pathDir)(path) === root || (0, utils_1.pathDir)(path) === root + "Programs/")) {
                    audioFile = file;
                }
                if (!interfaceFile && (0, utils_1.pathExt)(path) === "xml" && (0, utils_1.pathDir)(path) === root) {
                    interfaceFile = file;
                }
            }
            console.log("audioFile", audioFile);
            console.log("interfaceFile", interfaceFile);
            if (this.interface) {
                this.interface.loader.setRoot(root);
                this.interface.loader.addDirectory(files);
                if (interfaceFile) {
                    const file = this.interface.loader.addFile(interfaceFile);
                    yield this.interface.showFile(file);
                }
                this.interface.render();
            }
            if (this.editor) {
                this.editor.loader.setRoot(root);
                this.editor.loader.addDirectory(files);
                const defaultFile = audioFile || interfaceFile;
                if (defaultFile) {
                    const file = this.editor.loader.addFile(defaultFile);
                    yield this.editor.showFile(file);
                }
                this.editor.render();
            }
            if (this.audio) {
                this.audio.loader.setRoot(root);
                this.audio.loader.addDirectory(files);
                if (audioFile) {
                    const file = this.audio.loader.addFile(audioFile);
                    yield this.audio.showFile(file);
                }
            }
        });
    }
}
exports["default"] = Player;


/***/ }),

/***/ "./src/components/component.ts":
/*!*************************************!*\
  !*** ./src/components/component.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const event_1 = __webpack_require__(/*! ./event */ "./src/components/event.ts");
class Component extends event_1.default {
    constructor(className) {
        super();
        this.el = document.createElement("div");
        this.getEl().className = className;
    }
    getEl() {
        return this.el;
    }
}
exports["default"] = Component;


/***/ }),

/***/ "./src/components/event.ts":
/*!*********************************!*\
  !*** ./src/components/event.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Event {
    constructor() {
        this.events = {};
    }
    addEvent(type, func) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(func);
    }
    removeEvent(type, func) {
        if (this.events[type]) {
            if (func) {
                this.events[type].forEach((eventFunc, index) => {
                    if (eventFunc === func) {
                        this.events[type].splice(index, 1);
                        return true;
                    }
                });
            }
            else {
                delete this.events[type];
            }
        }
    }
    dispatchEvent(type, data) {
        if (this.events[type]) {
            this.events[type].forEach((eventFunc) => {
                eventFunc({ data, target: this, type });
            });
        }
    }
}
exports["default"] = Event;


/***/ }),

/***/ "./src/types/interface.ts":
/*!********************************!*\
  !*** ./src/types/interface.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PlayerElements = void 0;
var PlayerElements;
(function (PlayerElements) {
    PlayerElements["Keyboard"] = "keyboard";
    PlayerElements["Knob"] = "knob";
    PlayerElements["Slider"] = "slider";
    PlayerElements["Switch"] = "switch";
})(PlayerElements || (PlayerElements = {}));
exports.PlayerElements = PlayerElements;


/***/ }),

/***/ "./src/utils/api.ts":
/*!**************************!*\
  !*** ./src/utils/api.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getXML = exports.getRaw = exports.getJSON = exports.get = void 0;
const xml_js_1 = __webpack_require__(/*! xml-js */ "./node_modules/xml-js/lib/index.js");
function get(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("⤓", url);
        return fetch(url).then((res) => res.text());
    });
}
exports.get = get;
function getJSON(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("⤓", url);
        return fetch(url).then((res) => res.json());
    });
}
exports.getJSON = getJSON;
function getRaw(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("⤓", url);
        return fetch(url).then((res) => res.arrayBuffer());
    });
}
exports.getRaw = getRaw;
function getXML(url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("⤓", url);
        return fetch(url).then((res) => __awaiter(this, void 0, void 0, function* () { return (0, xml_js_1.xml2js)(yield res.text()); }));
    });
}
exports.getXML = getXML;


/***/ }),

/***/ "./src/utils/fileLoader.ts":
/*!*********************************!*\
  !*** ./src/utils/fileLoader.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const api_1 = __webpack_require__(/*! ./api */ "./src/utils/api.ts");
const utils_1 = __webpack_require__(/*! ./utils */ "./src/utils/utils.ts");
class FileLoader {
    constructor() {
        this.audio = new AudioContext();
        this.files = {};
        this.filesTree = {};
        this.root = "";
    }
    addDirectory(files) {
        this.resetFiles();
        files.forEach((file) => this.addFile(file));
    }
    addFile(file) {
        const path = decodeURI(typeof file === "string" ? file : file.webkitRelativePath);
        if (path === this.root)
            return;
        const fileKey = (0, utils_1.pathSubDir)(path, this.root);
        if (typeof file === "string") {
            this.files[fileKey] = {
                ext: (0, utils_1.pathExt)(file),
                contents: null,
                path,
            };
        }
        else {
            this.files[fileKey] = {
                ext: (0, utils_1.pathExt)(file.webkitRelativePath),
                contents: null,
                path,
                handle: file,
            };
        }
        this.addToFileTree(fileKey);
        return this.files[fileKey];
    }
    addToFileTree(key) {
        key
            .split("/")
            .reduce((o, k) => (o[k] = o[k] || {}), this.filesTree);
    }
    loadFileLocal(file, buffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (buffer === true) {
                const arrayBuffer = yield file.handle.arrayBuffer();
                file.contents = yield this.audio.decodeAudioData(arrayBuffer);
                return file;
            }
            file.contents = yield file.handle.text();
            return file;
        });
    }
    loadFileRemote(file, buffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (buffer === true) {
                const arrayBuffer = yield (0, api_1.getRaw)((0, utils_1.encodeHashes)(file.path));
                file.contents = yield this.audio.decodeAudioData(arrayBuffer);
                return file;
            }
            file.contents = yield (0, api_1.get)((0, utils_1.encodeHashes)(file.path));
            return file;
        });
    }
    getFile(file, buffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file)
                return;
            if (typeof file === "string") {
                if ((0, utils_1.pathExt)(file).length === 0)
                    return;
                const fileKey = (0, utils_1.pathSubDir)(file, this.root);
                const fileRef = this.files[fileKey];
                if (file.startsWith("http"))
                    return yield this.loadFileRemote(fileRef, buffer);
                return yield this.loadFileLocal(fileRef, buffer);
            }
            if ("handle" in file)
                return yield this.loadFileLocal(file, buffer);
            return yield this.loadFileRemote(file, buffer);
        });
    }
    setRoot(dir) {
        this.root = dir;
    }
    resetFiles() {
        this.files = {};
        this.filesTree = {};
    }
}
exports["default"] = FileLoader;


/***/ }),

/***/ "./src/utils/parser.ts":
/*!*****************************!*\
  !*** ./src/utils/parser.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.setParserLoader = exports.parseSfz = void 0;
let loader;
const skipCharacters = [" ", "\t", "\r", "\n"];
const endCharacters = [">", "\r", "\n"];
function parseSfz(prefix, contents) {
    return __awaiter(this, void 0, void 0, function* () {
        let header = "";
        const map = {};
        let values = {};
        for (let i = 0; i < contents.length; i++) {
            const char = contents.charAt(i);
            if (skipCharacters.includes(char))
                continue;
            const iEnd = findEnd(contents, i);
            if (char === "/") {
                // do nothing
            }
            else if (char === "#") {
                const directive = contents.slice(i + 10, iEnd - 1);
                const fileRef = loader.files[prefix + directive];
                const file = yield loader.getFile(fileRef || prefix + directive);
                const directiveValues = yield parseSfz(prefix, file === null || file === void 0 ? void 0 : file.contents);
                const headerValues = map[header];
                headerValues[headerValues.length - 1] = Object.assign(Object.assign({}, headerValues[headerValues.length - 1]), directiveValues);
            }
            else if (char === "<") {
                header = contents.slice(i + 1, iEnd);
                values = {};
                if (!map[header])
                    map[header] = [];
                map[header].push(values);
            }
            else {
                const opcode = contents.slice(i, iEnd);
                const [opcodeName, opcodeValue] = opcode.split("=");
                if (!isNaN(opcodeValue)) {
                    values[opcodeName] = Number(opcodeValue);
                }
                else {
                    values[opcodeName] = opcodeValue;
                }
            }
            i = iEnd;
        }
        if (!header)
            return values;
        return map;
    });
}
exports.parseSfz = parseSfz;
function findEnd(contents, startAt) {
    for (let index = startAt; index < contents.length; index++) {
        const char = contents.charAt(index);
        if (endCharacters.includes(char))
            return index;
        if (char === "/" && contents.charAt(index + 1) === "/")
            return index;
    }
    return contents.length;
}
function setParserLoader(fileLoader) {
    loader = fileLoader;
}
exports.setParserLoader = setParserLoader;


/***/ }),

/***/ "./src/utils/utils.ts":
/*!****************************!*\
  !*** ./src/utils/utils.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pathSubDir = exports.pathRoot = exports.pathExt = exports.pathDir = exports.encodeHashes = void 0;
function encodeHashes(item) {
    return item.replace(/#/g, encodeURIComponent("#"));
}
exports.encodeHashes = encodeHashes;
function pathDir(item, separator = "/") {
    return item.substring(0, item.lastIndexOf(separator) + 1);
}
exports.pathDir = pathDir;
function pathExt(item) {
    return item.substring(item.lastIndexOf(".") + 1);
}
exports.pathExt = pathExt;
function pathRoot(item, separator = "/") {
    return item.substring(0, item.indexOf(separator) + 1);
}
exports.pathRoot = pathRoot;
function pathSubDir(item, dir) {
    return item.substring(dir.length);
}
exports.pathSubDir = pathSubDir;


/***/ }),

/***/ "./node_modules/xml-js/lib/array-helper.js":
/*!*************************************************!*\
  !*** ./node_modules/xml-js/lib/array-helper.js ***!
  \*************************************************/
/***/ ((module) => {

module.exports = {

  isArray: function(value) {
    if (Array.isArray) {
      return Array.isArray(value);
    }
    // fallback for older browsers like  IE 8
    return Object.prototype.toString.call( value ) === '[object Array]';
  }

};


/***/ }),

/***/ "./node_modules/xml-js/lib/index.js":
/*!******************************************!*\
  !*** ./node_modules/xml-js/lib/index.js ***!
  \******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*jslint node:true */

var xml2js = __webpack_require__(/*! ./xml2js */ "./node_modules/xml-js/lib/xml2js.js");
var xml2json = __webpack_require__(/*! ./xml2json */ "./node_modules/xml-js/lib/xml2json.js");
var js2xml = __webpack_require__(/*! ./js2xml */ "./node_modules/xml-js/lib/js2xml.js");
var json2xml = __webpack_require__(/*! ./json2xml */ "./node_modules/xml-js/lib/json2xml.js");

module.exports = {
  xml2js: xml2js,
  xml2json: xml2json,
  js2xml: js2xml,
  json2xml: json2xml
};


/***/ }),

/***/ "./node_modules/xml-js/lib/js2xml.js":
/*!*******************************************!*\
  !*** ./node_modules/xml-js/lib/js2xml.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var helper = __webpack_require__(/*! ./options-helper */ "./node_modules/xml-js/lib/options-helper.js");
var isArray = (__webpack_require__(/*! ./array-helper */ "./node_modules/xml-js/lib/array-helper.js").isArray);

var currentElement, currentElementName;

function validateOptions(userOptions) {
  var options = helper.copyOptions(userOptions);
  helper.ensureFlagExists('ignoreDeclaration', options);
  helper.ensureFlagExists('ignoreInstruction', options);
  helper.ensureFlagExists('ignoreAttributes', options);
  helper.ensureFlagExists('ignoreText', options);
  helper.ensureFlagExists('ignoreComment', options);
  helper.ensureFlagExists('ignoreCdata', options);
  helper.ensureFlagExists('ignoreDoctype', options);
  helper.ensureFlagExists('compact', options);
  helper.ensureFlagExists('indentText', options);
  helper.ensureFlagExists('indentCdata', options);
  helper.ensureFlagExists('indentAttributes', options);
  helper.ensureFlagExists('indentInstruction', options);
  helper.ensureFlagExists('fullTagEmptyElement', options);
  helper.ensureFlagExists('noQuotesForNativeAttributes', options);
  helper.ensureSpacesExists(options);
  if (typeof options.spaces === 'number') {
    options.spaces = Array(options.spaces + 1).join(' ');
  }
  helper.ensureKeyExists('declaration', options);
  helper.ensureKeyExists('instruction', options);
  helper.ensureKeyExists('attributes', options);
  helper.ensureKeyExists('text', options);
  helper.ensureKeyExists('comment', options);
  helper.ensureKeyExists('cdata', options);
  helper.ensureKeyExists('doctype', options);
  helper.ensureKeyExists('type', options);
  helper.ensureKeyExists('name', options);
  helper.ensureKeyExists('elements', options);
  helper.checkFnExists('doctype', options);
  helper.checkFnExists('instruction', options);
  helper.checkFnExists('cdata', options);
  helper.checkFnExists('comment', options);
  helper.checkFnExists('text', options);
  helper.checkFnExists('instructionName', options);
  helper.checkFnExists('elementName', options);
  helper.checkFnExists('attributeName', options);
  helper.checkFnExists('attributeValue', options);
  helper.checkFnExists('attributes', options);
  helper.checkFnExists('fullTagEmptyElement', options);
  return options;
}

function writeIndentation(options, depth, firstLine) {
  return (!firstLine && options.spaces ? '\n' : '') + Array(depth + 1).join(options.spaces);
}

function writeAttributes(attributes, options, depth) {
  if (options.ignoreAttributes) {
    return '';
  }
  if ('attributesFn' in options) {
    attributes = options.attributesFn(attributes, currentElementName, currentElement);
  }
  var key, attr, attrName, quote, result = [];
  for (key in attributes) {
    if (attributes.hasOwnProperty(key) && attributes[key] !== null && attributes[key] !== undefined) {
      quote = options.noQuotesForNativeAttributes && typeof attributes[key] !== 'string' ? '' : '"';
      attr = '' + attributes[key]; // ensure number and boolean are converted to String
      attr = attr.replace(/"/g, '&quot;');
      attrName = 'attributeNameFn' in options ? options.attributeNameFn(key, attr, currentElementName, currentElement) : key;
      result.push((options.spaces && options.indentAttributes? writeIndentation(options, depth+1, false) : ' '));
      result.push(attrName + '=' + quote + ('attributeValueFn' in options ? options.attributeValueFn(attr, key, currentElementName, currentElement) : attr) + quote);
    }
  }
  if (attributes && Object.keys(attributes).length && options.spaces && options.indentAttributes) {
    result.push(writeIndentation(options, depth, false));
  }
  return result.join('');
}

function writeDeclaration(declaration, options, depth) {
  currentElement = declaration;
  currentElementName = 'xml';
  return options.ignoreDeclaration ? '' :  '<?' + 'xml' + writeAttributes(declaration[options.attributesKey], options, depth) + '?>';
}

function writeInstruction(instruction, options, depth) {
  if (options.ignoreInstruction) {
    return '';
  }
  var key;
  for (key in instruction) {
    if (instruction.hasOwnProperty(key)) {
      break;
    }
  }
  var instructionName = 'instructionNameFn' in options ? options.instructionNameFn(key, instruction[key], currentElementName, currentElement) : key;
  if (typeof instruction[key] === 'object') {
    currentElement = instruction;
    currentElementName = instructionName;
    return '<?' + instructionName + writeAttributes(instruction[key][options.attributesKey], options, depth) + '?>';
  } else {
    var instructionValue = instruction[key] ? instruction[key] : '';
    if ('instructionFn' in options) instructionValue = options.instructionFn(instructionValue, key, currentElementName, currentElement);
    return '<?' + instructionName + (instructionValue ? ' ' + instructionValue : '') + '?>';
  }
}

function writeComment(comment, options) {
  return options.ignoreComment ? '' : '<!--' + ('commentFn' in options ? options.commentFn(comment, currentElementName, currentElement) : comment) + '-->';
}

function writeCdata(cdata, options) {
  return options.ignoreCdata ? '' : '<![CDATA[' + ('cdataFn' in options ? options.cdataFn(cdata, currentElementName, currentElement) : cdata.replace(']]>', ']]]]><![CDATA[>')) + ']]>';
}

function writeDoctype(doctype, options) {
  return options.ignoreDoctype ? '' : '<!DOCTYPE ' + ('doctypeFn' in options ? options.doctypeFn(doctype, currentElementName, currentElement) : doctype) + '>';
}

function writeText(text, options) {
  if (options.ignoreText) return '';
  text = '' + text; // ensure Number and Boolean are converted to String
  text = text.replace(/&amp;/g, '&'); // desanitize to avoid double sanitization
  text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return 'textFn' in options ? options.textFn(text, currentElementName, currentElement) : text;
}

function hasContent(element, options) {
  var i;
  if (element.elements && element.elements.length) {
    for (i = 0; i < element.elements.length; ++i) {
      switch (element.elements[i][options.typeKey]) {
      case 'text':
        if (options.indentText) {
          return true;
        }
        break; // skip to next key
      case 'cdata':
        if (options.indentCdata) {
          return true;
        }
        break; // skip to next key
      case 'instruction':
        if (options.indentInstruction) {
          return true;
        }
        break; // skip to next key
      case 'doctype':
      case 'comment':
      case 'element':
        return true;
      default:
        return true;
      }
    }
  }
  return false;
}

function writeElement(element, options, depth) {
  currentElement = element;
  currentElementName = element.name;
  var xml = [], elementName = 'elementNameFn' in options ? options.elementNameFn(element.name, element) : element.name;
  xml.push('<' + elementName);
  if (element[options.attributesKey]) {
    xml.push(writeAttributes(element[options.attributesKey], options, depth));
  }
  var withClosingTag = element[options.elementsKey] && element[options.elementsKey].length || element[options.attributesKey] && element[options.attributesKey]['xml:space'] === 'preserve';
  if (!withClosingTag) {
    if ('fullTagEmptyElementFn' in options) {
      withClosingTag = options.fullTagEmptyElementFn(element.name, element);
    } else {
      withClosingTag = options.fullTagEmptyElement;
    }
  }
  if (withClosingTag) {
    xml.push('>');
    if (element[options.elementsKey] && element[options.elementsKey].length) {
      xml.push(writeElements(element[options.elementsKey], options, depth + 1));
      currentElement = element;
      currentElementName = element.name;
    }
    xml.push(options.spaces && hasContent(element, options) ? '\n' + Array(depth + 1).join(options.spaces) : '');
    xml.push('</' + elementName + '>');
  } else {
    xml.push('/>');
  }
  return xml.join('');
}

function writeElements(elements, options, depth, firstLine) {
  return elements.reduce(function (xml, element) {
    var indent = writeIndentation(options, depth, firstLine && !xml);
    switch (element.type) {
    case 'element': return xml + indent + writeElement(element, options, depth);
    case 'comment': return xml + indent + writeComment(element[options.commentKey], options);
    case 'doctype': return xml + indent + writeDoctype(element[options.doctypeKey], options);
    case 'cdata': return xml + (options.indentCdata ? indent : '') + writeCdata(element[options.cdataKey], options);
    case 'text': return xml + (options.indentText ? indent : '') + writeText(element[options.textKey], options);
    case 'instruction':
      var instruction = {};
      instruction[element[options.nameKey]] = element[options.attributesKey] ? element : element[options.instructionKey];
      return xml + (options.indentInstruction ? indent : '') + writeInstruction(instruction, options, depth);
    }
  }, '');
}

function hasContentCompact(element, options, anyContent) {
  var key;
  for (key in element) {
    if (element.hasOwnProperty(key)) {
      switch (key) {
      case options.parentKey:
      case options.attributesKey:
        break; // skip to next key
      case options.textKey:
        if (options.indentText || anyContent) {
          return true;
        }
        break; // skip to next key
      case options.cdataKey:
        if (options.indentCdata || anyContent) {
          return true;
        }
        break; // skip to next key
      case options.instructionKey:
        if (options.indentInstruction || anyContent) {
          return true;
        }
        break; // skip to next key
      case options.doctypeKey:
      case options.commentKey:
        return true;
      default:
        return true;
      }
    }
  }
  return false;
}

function writeElementCompact(element, name, options, depth, indent) {
  currentElement = element;
  currentElementName = name;
  var elementName = 'elementNameFn' in options ? options.elementNameFn(name, element) : name;
  if (typeof element === 'undefined' || element === null || element === '') {
    return 'fullTagEmptyElementFn' in options && options.fullTagEmptyElementFn(name, element) || options.fullTagEmptyElement ? '<' + elementName + '></' + elementName + '>' : '<' + elementName + '/>';
  }
  var xml = [];
  if (name) {
    xml.push('<' + elementName);
    if (typeof element !== 'object') {
      xml.push('>' + writeText(element,options) + '</' + elementName + '>');
      return xml.join('');
    }
    if (element[options.attributesKey]) {
      xml.push(writeAttributes(element[options.attributesKey], options, depth));
    }
    var withClosingTag = hasContentCompact(element, options, true) || element[options.attributesKey] && element[options.attributesKey]['xml:space'] === 'preserve';
    if (!withClosingTag) {
      if ('fullTagEmptyElementFn' in options) {
        withClosingTag = options.fullTagEmptyElementFn(name, element);
      } else {
        withClosingTag = options.fullTagEmptyElement;
      }
    }
    if (withClosingTag) {
      xml.push('>');
    } else {
      xml.push('/>');
      return xml.join('');
    }
  }
  xml.push(writeElementsCompact(element, options, depth + 1, false));
  currentElement = element;
  currentElementName = name;
  if (name) {
    xml.push((indent ? writeIndentation(options, depth, false) : '') + '</' + elementName + '>');
  }
  return xml.join('');
}

function writeElementsCompact(element, options, depth, firstLine) {
  var i, key, nodes, xml = [];
  for (key in element) {
    if (element.hasOwnProperty(key)) {
      nodes = isArray(element[key]) ? element[key] : [element[key]];
      for (i = 0; i < nodes.length; ++i) {
        switch (key) {
        case options.declarationKey: xml.push(writeDeclaration(nodes[i], options, depth)); break;
        case options.instructionKey: xml.push((options.indentInstruction ? writeIndentation(options, depth, firstLine) : '') + writeInstruction(nodes[i], options, depth)); break;
        case options.attributesKey: case options.parentKey: break; // skip
        case options.textKey: xml.push((options.indentText ? writeIndentation(options, depth, firstLine) : '') + writeText(nodes[i], options)); break;
        case options.cdataKey: xml.push((options.indentCdata ? writeIndentation(options, depth, firstLine) : '') + writeCdata(nodes[i], options)); break;
        case options.doctypeKey: xml.push(writeIndentation(options, depth, firstLine) + writeDoctype(nodes[i], options)); break;
        case options.commentKey: xml.push(writeIndentation(options, depth, firstLine) + writeComment(nodes[i], options)); break;
        default: xml.push(writeIndentation(options, depth, firstLine) + writeElementCompact(nodes[i], key, options, depth, hasContentCompact(nodes[i], options)));
        }
        firstLine = firstLine && !xml.length;
      }
    }
  }
  return xml.join('');
}

module.exports = function (js, options) {
  options = validateOptions(options);
  var xml = [];
  currentElement = js;
  currentElementName = '_root_';
  if (options.compact) {
    xml.push(writeElementsCompact(js, options, 0, true));
  } else {
    if (js[options.declarationKey]) {
      xml.push(writeDeclaration(js[options.declarationKey], options, 0));
    }
    if (js[options.elementsKey] && js[options.elementsKey].length) {
      xml.push(writeElements(js[options.elementsKey], options, 0, !xml.length));
    }
  }
  return xml.join('');
};


/***/ }),

/***/ "./node_modules/xml-js/lib/json2xml.js":
/*!*********************************************!*\
  !*** ./node_modules/xml-js/lib/json2xml.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var js2xml = __webpack_require__(/*! ./js2xml.js */ "./node_modules/xml-js/lib/js2xml.js");

module.exports = function (json, options) {
  if (json instanceof Buffer) {
    json = json.toString();
  }
  var js = null;
  if (typeof (json) === 'string') {
    try {
      js = JSON.parse(json);
    } catch (e) {
      throw new Error('The JSON structure is invalid');
    }
  } else {
    js = json;
  }
  return js2xml(js, options);
};


/***/ }),

/***/ "./node_modules/xml-js/lib/options-helper.js":
/*!***************************************************!*\
  !*** ./node_modules/xml-js/lib/options-helper.js ***!
  \***************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var isArray = (__webpack_require__(/*! ./array-helper */ "./node_modules/xml-js/lib/array-helper.js").isArray);

module.exports = {

  copyOptions: function (options) {
    var key, copy = {};
    for (key in options) {
      if (options.hasOwnProperty(key)) {
        copy[key] = options[key];
      }
    }
    return copy;
  },

  ensureFlagExists: function (item, options) {
    if (!(item in options) || typeof options[item] !== 'boolean') {
      options[item] = false;
    }
  },

  ensureSpacesExists: function (options) {
    if (!('spaces' in options) || (typeof options.spaces !== 'number' && typeof options.spaces !== 'string')) {
      options.spaces = 0;
    }
  },

  ensureAlwaysArrayExists: function (options) {
    if (!('alwaysArray' in options) || (typeof options.alwaysArray !== 'boolean' && !isArray(options.alwaysArray))) {
      options.alwaysArray = false;
    }
  },

  ensureKeyExists: function (key, options) {
    if (!(key + 'Key' in options) || typeof options[key + 'Key'] !== 'string') {
      options[key + 'Key'] = options.compact ? '_' + key : key;
    }
  },

  checkFnExists: function (key, options) {
    return key + 'Fn' in options;
  }

};


/***/ }),

/***/ "./node_modules/xml-js/lib/xml2js.js":
/*!*******************************************!*\
  !*** ./node_modules/xml-js/lib/xml2js.js ***!
  \*******************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var sax = __webpack_require__(/*! sax */ "./node_modules/sax/lib/sax.js");
var expat /*= require('node-expat');*/ = { on: function () { }, parse: function () { } };
var helper = __webpack_require__(/*! ./options-helper */ "./node_modules/xml-js/lib/options-helper.js");
var isArray = (__webpack_require__(/*! ./array-helper */ "./node_modules/xml-js/lib/array-helper.js").isArray);

var options;
var pureJsParser = true;
var currentElement;

function validateOptions(userOptions) {
  options = helper.copyOptions(userOptions);
  helper.ensureFlagExists('ignoreDeclaration', options);
  helper.ensureFlagExists('ignoreInstruction', options);
  helper.ensureFlagExists('ignoreAttributes', options);
  helper.ensureFlagExists('ignoreText', options);
  helper.ensureFlagExists('ignoreComment', options);
  helper.ensureFlagExists('ignoreCdata', options);
  helper.ensureFlagExists('ignoreDoctype', options);
  helper.ensureFlagExists('compact', options);
  helper.ensureFlagExists('alwaysChildren', options);
  helper.ensureFlagExists('addParent', options);
  helper.ensureFlagExists('trim', options);
  helper.ensureFlagExists('nativeType', options);
  helper.ensureFlagExists('nativeTypeAttributes', options);
  helper.ensureFlagExists('sanitize', options);
  helper.ensureFlagExists('instructionHasAttributes', options);
  helper.ensureFlagExists('captureSpacesBetweenElements', options);
  helper.ensureAlwaysArrayExists(options);
  helper.ensureKeyExists('declaration', options);
  helper.ensureKeyExists('instruction', options);
  helper.ensureKeyExists('attributes', options);
  helper.ensureKeyExists('text', options);
  helper.ensureKeyExists('comment', options);
  helper.ensureKeyExists('cdata', options);
  helper.ensureKeyExists('doctype', options);
  helper.ensureKeyExists('type', options);
  helper.ensureKeyExists('name', options);
  helper.ensureKeyExists('elements', options);
  helper.ensureKeyExists('parent', options);
  helper.checkFnExists('doctype', options);
  helper.checkFnExists('instruction', options);
  helper.checkFnExists('cdata', options);
  helper.checkFnExists('comment', options);
  helper.checkFnExists('text', options);
  helper.checkFnExists('instructionName', options);
  helper.checkFnExists('elementName', options);
  helper.checkFnExists('attributeName', options);
  helper.checkFnExists('attributeValue', options);
  helper.checkFnExists('attributes', options);
  return options;
}

function nativeType(value) {
  var nValue = Number(value);
  if (!isNaN(nValue)) {
    return nValue;
  }
  var bValue = value.toLowerCase();
  if (bValue === 'true') {
    return true;
  } else if (bValue === 'false') {
    return false;
  }
  return value;
}

function addField(type, value) {
  var key;
  if (options.compact) {
    if (
      !currentElement[options[type + 'Key']] &&
      (isArray(options.alwaysArray) ? options.alwaysArray.indexOf(options[type + 'Key']) !== -1 : options.alwaysArray)
    ) {
      currentElement[options[type + 'Key']] = [];
    }
    if (currentElement[options[type + 'Key']] && !isArray(currentElement[options[type + 'Key']])) {
      currentElement[options[type + 'Key']] = [currentElement[options[type + 'Key']]];
    }
    if (type + 'Fn' in options && typeof value === 'string') {
      value = options[type + 'Fn'](value, currentElement);
    }
    if (type === 'instruction' && ('instructionFn' in options || 'instructionNameFn' in options)) {
      for (key in value) {
        if (value.hasOwnProperty(key)) {
          if ('instructionFn' in options) {
            value[key] = options.instructionFn(value[key], key, currentElement);
          } else {
            var temp = value[key];
            delete value[key];
            value[options.instructionNameFn(key, temp, currentElement)] = temp;
          }
        }
      }
    }
    if (isArray(currentElement[options[type + 'Key']])) {
      currentElement[options[type + 'Key']].push(value);
    } else {
      currentElement[options[type + 'Key']] = value;
    }
  } else {
    if (!currentElement[options.elementsKey]) {
      currentElement[options.elementsKey] = [];
    }
    var element = {};
    element[options.typeKey] = type;
    if (type === 'instruction') {
      for (key in value) {
        if (value.hasOwnProperty(key)) {
          break;
        }
      }
      element[options.nameKey] = 'instructionNameFn' in options ? options.instructionNameFn(key, value, currentElement) : key;
      if (options.instructionHasAttributes) {
        element[options.attributesKey] = value[key][options.attributesKey];
        if ('instructionFn' in options) {
          element[options.attributesKey] = options.instructionFn(element[options.attributesKey], key, currentElement);
        }
      } else {
        if ('instructionFn' in options) {
          value[key] = options.instructionFn(value[key], key, currentElement);
        }
        element[options.instructionKey] = value[key];
      }
    } else {
      if (type + 'Fn' in options) {
        value = options[type + 'Fn'](value, currentElement);
      }
      element[options[type + 'Key']] = value;
    }
    if (options.addParent) {
      element[options.parentKey] = currentElement;
    }
    currentElement[options.elementsKey].push(element);
  }
}

function manipulateAttributes(attributes) {
  if ('attributesFn' in options && attributes) {
    attributes = options.attributesFn(attributes, currentElement);
  }
  if ((options.trim || 'attributeValueFn' in options || 'attributeNameFn' in options || options.nativeTypeAttributes) && attributes) {
    var key;
    for (key in attributes) {
      if (attributes.hasOwnProperty(key)) {
        if (options.trim) attributes[key] = attributes[key].trim();
        if (options.nativeTypeAttributes) {
          attributes[key] = nativeType(attributes[key]);
        }
        if ('attributeValueFn' in options) attributes[key] = options.attributeValueFn(attributes[key], key, currentElement);
        if ('attributeNameFn' in options) {
          var temp = attributes[key];
          delete attributes[key];
          attributes[options.attributeNameFn(key, attributes[key], currentElement)] = temp;
        }
      }
    }
  }
  return attributes;
}

function onInstruction(instruction) {
  var attributes = {};
  if (instruction.body && (instruction.name.toLowerCase() === 'xml' || options.instructionHasAttributes)) {
    var attrsRegExp = /([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))\s*/g;
    var match;
    while ((match = attrsRegExp.exec(instruction.body)) !== null) {
      attributes[match[1]] = match[2] || match[3] || match[4];
    }
    attributes = manipulateAttributes(attributes);
  }
  if (instruction.name.toLowerCase() === 'xml') {
    if (options.ignoreDeclaration) {
      return;
    }
    currentElement[options.declarationKey] = {};
    if (Object.keys(attributes).length) {
      currentElement[options.declarationKey][options.attributesKey] = attributes;
    }
    if (options.addParent) {
      currentElement[options.declarationKey][options.parentKey] = currentElement;
    }
  } else {
    if (options.ignoreInstruction) {
      return;
    }
    if (options.trim) {
      instruction.body = instruction.body.trim();
    }
    var value = {};
    if (options.instructionHasAttributes && Object.keys(attributes).length) {
      value[instruction.name] = {};
      value[instruction.name][options.attributesKey] = attributes;
    } else {
      value[instruction.name] = instruction.body;
    }
    addField('instruction', value);
  }
}

function onStartElement(name, attributes) {
  var element;
  if (typeof name === 'object') {
    attributes = name.attributes;
    name = name.name;
  }
  attributes = manipulateAttributes(attributes);
  if ('elementNameFn' in options) {
    name = options.elementNameFn(name, currentElement);
  }
  if (options.compact) {
    element = {};
    if (!options.ignoreAttributes && attributes && Object.keys(attributes).length) {
      element[options.attributesKey] = {};
      var key;
      for (key in attributes) {
        if (attributes.hasOwnProperty(key)) {
          element[options.attributesKey][key] = attributes[key];
        }
      }
    }
    if (
      !(name in currentElement) &&
      (isArray(options.alwaysArray) ? options.alwaysArray.indexOf(name) !== -1 : options.alwaysArray)
    ) {
      currentElement[name] = [];
    }
    if (currentElement[name] && !isArray(currentElement[name])) {
      currentElement[name] = [currentElement[name]];
    }
    if (isArray(currentElement[name])) {
      currentElement[name].push(element);
    } else {
      currentElement[name] = element;
    }
  } else {
    if (!currentElement[options.elementsKey]) {
      currentElement[options.elementsKey] = [];
    }
    element = {};
    element[options.typeKey] = 'element';
    element[options.nameKey] = name;
    if (!options.ignoreAttributes && attributes && Object.keys(attributes).length) {
      element[options.attributesKey] = attributes;
    }
    if (options.alwaysChildren) {
      element[options.elementsKey] = [];
    }
    currentElement[options.elementsKey].push(element);
  }
  element[options.parentKey] = currentElement; // will be deleted in onEndElement() if !options.addParent
  currentElement = element;
}

function onText(text) {
  if (options.ignoreText) {
    return;
  }
  if (!text.trim() && !options.captureSpacesBetweenElements) {
    return;
  }
  if (options.trim) {
    text = text.trim();
  }
  if (options.nativeType) {
    text = nativeType(text);
  }
  if (options.sanitize) {
    text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  addField('text', text);
}

function onComment(comment) {
  if (options.ignoreComment) {
    return;
  }
  if (options.trim) {
    comment = comment.trim();
  }
  addField('comment', comment);
}

function onEndElement(name) {
  var parentElement = currentElement[options.parentKey];
  if (!options.addParent) {
    delete currentElement[options.parentKey];
  }
  currentElement = parentElement;
}

function onCdata(cdata) {
  if (options.ignoreCdata) {
    return;
  }
  if (options.trim) {
    cdata = cdata.trim();
  }
  addField('cdata', cdata);
}

function onDoctype(doctype) {
  if (options.ignoreDoctype) {
    return;
  }
  doctype = doctype.replace(/^ /, '');
  if (options.trim) {
    doctype = doctype.trim();
  }
  addField('doctype', doctype);
}

function onError(error) {
  error.note = error; //console.error(error);
}

module.exports = function (xml, userOptions) {

  var parser = pureJsParser ? sax.parser(true, {}) : parser = new expat.Parser('UTF-8');
  var result = {};
  currentElement = result;

  options = validateOptions(userOptions);

  if (pureJsParser) {
    parser.opt = {strictEntities: true};
    parser.onopentag = onStartElement;
    parser.ontext = onText;
    parser.oncomment = onComment;
    parser.onclosetag = onEndElement;
    parser.onerror = onError;
    parser.oncdata = onCdata;
    parser.ondoctype = onDoctype;
    parser.onprocessinginstruction = onInstruction;
  } else {
    parser.on('startElement', onStartElement);
    parser.on('text', onText);
    parser.on('comment', onComment);
    parser.on('endElement', onEndElement);
    parser.on('error', onError);
    //parser.on('startCdata', onStartCdata);
    //parser.on('endCdata', onEndCdata);
    //parser.on('entityDecl', onEntityDecl);
  }

  if (pureJsParser) {
    parser.write(xml).close();
  } else {
    if (!parser.parse(xml)) {
      throw new Error('XML parsing error: ' + parser.getError());
    }
  }

  if (result[options.elementsKey]) {
    var temp = result[options.elementsKey];
    delete result[options.elementsKey];
    result[options.elementsKey] = temp;
    delete result.text;
  }

  return result;

};


/***/ }),

/***/ "./node_modules/xml-js/lib/xml2json.js":
/*!*********************************************!*\
  !*** ./node_modules/xml-js/lib/xml2json.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var helper = __webpack_require__(/*! ./options-helper */ "./node_modules/xml-js/lib/options-helper.js");
var xml2js = __webpack_require__(/*! ./xml2js */ "./node_modules/xml-js/lib/xml2js.js");

function validateOptions (userOptions) {
  var options = helper.copyOptions(userOptions);
  helper.ensureSpacesExists(options);
  return options;
}

module.exports = function(xml, userOptions) {
  var options, js, json, parentKey;
  options = validateOptions(userOptions);
  js = xml2js(xml, options);
  parentKey = 'compact' in options && options.compact ? '_parent' : 'parent';
  // parentKey = ptions.compact ? '_parent' : 'parent'; // consider this
  if ('addParent' in options && options.addParent) {
    json = JSON.stringify(js, function (k, v) { return k === parentKey? '_' : v; }, options.spaces);
  } else {
    json = JSON.stringify(js, null, options.spaces);
  }
  return json.replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
};


/***/ }),

/***/ "./src/lib/mode-sfz.js":
/*!*****************************!*\
  !*** ./src/lib/mode-sfz.js ***!
  \*****************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var oop = ace.require("ace/lib/oop");
var TextMode = ace.require("ace/mode/text").Mode;
var SFZHighlightRules = (__webpack_require__(/*! ./sfz_highlight_rules */ "./src/lib/sfz_highlight_rules.js").SFZHighlightRules);
var FoldMode = (__webpack_require__(/*! ./sfz_folding_mode */ "./src/lib/sfz_folding_mode.js").FoldMode);

var Mode = function () {
  this.HighlightRules = SFZHighlightRules;
  this.foldingRules = new FoldMode();
};
oop.inherits(Mode, TextMode);

(function () {
  this.lineCommentStart = "//";

  this.$id = "ace/mode/sfz";
}).call(Mode.prototype);

module.exports.Mode = Mode;


/***/ }),

/***/ "./src/lib/sfz_folding_mode.js":
/*!*************************************!*\
  !*** ./src/lib/sfz_folding_mode.js ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var oop = ace.require("ace/lib/oop");
var Range = ace.require("ace/range").Range;
var BaseFoldMode = ace.require("ace/mode/folding/fold_mode").FoldMode;
var FoldMode = (exports.FoldMode = function (commentRegex) {
  if (commentRegex) {
    this.foldingStartMarker = new RegExp(
      this.foldingStartMarker.source.replace(
        /\|[^|]*?$/,
        "|" + commentRegex.start
      )
    );
    this.foldingStopMarker = new RegExp(
      this.foldingStopMarker.source.replace(/\|[^|]*?$/, "|" + commentRegex.end)
    );
  }
});
oop.inherits(FoldMode, BaseFoldMode);
(function () {
  this.foldingStartMarker = /([\{\[\(])[^\}\]\)]*$|^\s*(\/\*)/;
  this.foldingStopMarker = /^[^\[\{\(]*([\}\]\)])|^[\s\*]*(\*\/)/;
  this.singleLineBlockCommentRe = /^\s*(\/\*).*\*\/\s*$/;
  this.tripleStarBlockCommentRe = /^\s*(\/\*\*\*).*\*\/\s*$/;
  this.startRegionRe = /^\s*(\/\*|\/\/)#?region\b/;
  this._getFoldWidgetBase = this.getFoldWidget;
  this.getFoldWidget = function (session, foldStyle, row) {
    var line = session.getLine(row);
    if (this.singleLineBlockCommentRe.test(line)) {
      if (
        !this.startRegionRe.test(line) &&
        !this.tripleStarBlockCommentRe.test(line)
      )
        return "";
    }
    var fw = this._getFoldWidgetBase(session, foldStyle, row);
    if (!fw && this.startRegionRe.test(line)) return "start"; // lineCommentRegionStart
    return fw;
  };
  this.getFoldWidgetRange = function (session, foldStyle, row, forceMultiline) {
    var line = session.getLine(row);
    if (this.startRegionRe.test(line))
      return this.getCommentRegionBlock(session, line, row);
    var match = line.match(this.foldingStartMarker);
    if (match) {
      var i = match.index;
      if (match[1]) return this.openingBracketBlock(session, match[1], row, i);
      var range = session.getCommentFoldRange(row, i + match[0].length, 1);
      if (range && !range.isMultiLine()) {
        if (forceMultiline) {
          range = this.getSectionRange(session, row);
        } else if (foldStyle != "all") range = null;
      }
      return range;
    }
    if (foldStyle === "markbegin") return;
    var match = line.match(this.foldingStopMarker);
    if (match) {
      var i = match.index + match[0].length;
      if (match[1]) return this.closingBracketBlock(session, match[1], row, i);
      return session.getCommentFoldRange(row, i, -1);
    }
  };
  this.getSectionRange = function (session, row) {
    var line = session.getLine(row);
    var startIndent = line.search(/\S/);
    var startRow = row;
    var startColumn = line.length;
    row = row + 1;
    var endRow = row;
    var maxRow = session.getLength();
    while (++row < maxRow) {
      line = session.getLine(row);
      var indent = line.search(/\S/);
      if (indent === -1) continue;
      if (startIndent > indent) break;
      var subRange = this.getFoldWidgetRange(session, "all", row);
      if (subRange) {
        if (subRange.start.row <= startRow) {
          break;
        } else if (subRange.isMultiLine()) {
          row = subRange.end.row;
        } else if (startIndent == indent) {
          break;
        }
      }
      endRow = row;
    }
    return new Range(
      startRow,
      startColumn,
      endRow,
      session.getLine(endRow).length
    );
  };
  this.getCommentRegionBlock = function (session, line, row) {
    var startColumn = line.search(/\s*$/);
    var maxRow = session.getLength();
    var startRow = row;
    var re = /^\s*(?:\/\*|\/\/|--)#?(end)?region\b/;
    var depth = 1;
    while (++row < maxRow) {
      line = session.getLine(row);
      var m = re.exec(line);
      if (!m) continue;
      if (m[1]) depth--;
      else depth++;
      if (!depth) break;
    }
    var endRow = row;
    if (endRow > startRow) {
      return new Range(startRow, startColumn, endRow, line.length);
    }
  };
}).call(FoldMode.prototype);


/***/ }),

/***/ "./src/lib/sfz_highlight_rules.js":
/*!****************************************!*\
  !*** ./src/lib/sfz_highlight_rules.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


var oop = ace.require("ace/lib/oop");
var TextHighlightRules = ace.require("ace/mode/text_highlight_rules").TextHighlightRules;
var SFZHighlightRules = function () {
  this.$rules = {
    start: [
      {
        include: "#comment",
      },
      {
        include: "#headers",
      },
      {
        include: "#sfz1_sound-source",
      },
      {
        include: "#sfz1_instrument-settings",
      },
      {
        include: "#sfz1_region-logic",
      },
      {
        include: "#sfz1_performance-parameters",
      },
      {
        include: "#sfz1_modulation",
      },
      {
        include: "#sfz1_effects",
      },
      {
        include: "#sfz2_directives",
      },
      {
        include: "#sfz2_sound-source",
      },
      {
        include: "#sfz2_instrument-settings",
      },
      {
        include: "#sfz2_region-logic",
      },
      {
        include: "#sfz2_performance-parameters",
      },
      {
        include: "#sfz2_modulation",
      },
      {
        include: "#sfz2_curves",
      },
      {
        include: "#aria_instrument-settings",
      },
      {
        include: "#aria_region-logic",
      },
      {
        include: "#aria_performance-parameters",
      },
      {
        include: "#aria_modulation",
      },
      {
        include: "#aria_curves",
      },
      {
        include: "#aria_effects",
      },
    ],
    "#comment": [
      {
        token: "punctuation.definition.comment.sfz",
        regex: /\/\*/,
        push: [
          {
            token: "punctuation.definition.comment.sfz",
            regex: /\*\//,
            next: "pop",
          },
          {
            defaultToken: "comment.block.sfz",
          },
        ],
      },
      {
        token: [
          "punctuation.whitespace.comment.leading.sfz",
          "punctuation.definition.comment.sfz",
        ],
        regex: /((?:[\s]+)?)(\/\/)(?:\s*(?=\s|$))?/,
        push: [
          {
            token: "comment.line.double-slash.sfz",
            regex: /(?=$)/,
            next: "pop",
          },
          {
            defaultToken: "comment.line.double-slash.sfz",
          },
        ],
      },
    ],
    "#headers": [
      {
        token: [
          "punctuation.definition.tag.begin.sfz",
          "keyword.control.$2.sfz",
          "punctuation.definition.tag.begin.sfz",
        ],
        regex: /(<)(control|global|master|group|region|curve|effect|midi)(>)/,
        comment: "Headers",
      },
      {
        token: "invalid.sfz",
        regex:
          /<.*(?!(?:control|global|master|group|region|curve|effect|midi))>/,
        comment: "Non-compliant headers",
      },
    ],
    "#sfz1_sound-source": [
      {
        token: [
          "variable.language.sound-source.$1.sfz",
          "keyword.operator.assignment.sfz",
        ],
        regex: /\b(sample)(=?)/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /(?=(?:\s\/\/|$))/,
            next: "pop",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (sample): (any string)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\bdelay(?:_random|_oncc\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (delay|delay_random|delay_onccN): (0 to 100 percent)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\boffset(?:_random|_oncc\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (offset|offset_random|offset_onccN): (0 to 4294967296 sample units)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\bend\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive_or_neg1",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (end): (-1 to 4294967296 sample units)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\bcount\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (count): (0 to 4294967296 loops)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\bloop_mode\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_loop_mode",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (loop_mode): (no_loop|one_shot|loop_continuous|loop_sustain)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\b(?:loop_start|loop_end)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (loop_start|loop_end): (0 to 4294967296 sample units)",
      },
      {
        token: "variable.language.sound-source.$1.sfz",
        regex: /\b(?:sync_beats|sync_offset)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-32",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (sync_beats|sync_offset): (0 to 32 beats)",
      },
    ],
    "#sfz1_instrument-settings": [
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\b(?:group|polyphony_group|off_by)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (group|polyphony_group|off_by): (0 to 4294967296 sample units)",
      },
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\boff_mode\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_fast-normal-time",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (off_mode): (fast|normal)",
      },
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\boutput\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-1024",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (output): (0 to 1024 MIDI Nodes)",
      },
    ],
    "#sfz1_region-logic": [
      {
        token: "variable.language.region-logic.key-mapping.$1.sfz",
        regex: /\b(?:key|lokey|hikey)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127_or_string_note",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (key|lokey|hikey): (0 to 127 MIDI Note or C-1 to G#9 Note)",
      },
      {
        token: "variable.language.region-logic.key-mapping.$1.sfz",
        regex: /\b(?:lovel|hivel)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (love|hivel): (0 to 127 MIDI Velocity)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\b(?:lochan|hichan)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_1-16",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lochan|hichan): (1 to 16 MIDI Channel)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\b(?:lo|hi)cc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (loccN|hiccN): (0 to 127 MIDI Controller)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\b(?:lobend|hibend)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg8192-8192",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lobend|hibend): (-8192 to 8192 cents)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\bsw_(?:lokey|hikey|last|down|up|previous)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127_or_string_note",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (sw_lokey|sw_hikey|sw_last|sw_down|sw_up|sw_previous): (0 to 127 MIDI Note or C-1 to G#9 Note)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\bsw_vel\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_current-previous",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (sw_vel): (current|previous)",
      },
      {
        token: "variable.language.region-logic.internal-conditions.$1.sfz",
        regex: /\b(?:lobpm|hibpm)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-500",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lobpm|hibpm): (0 to 500 BPM)",
      },
      {
        token: "variable.language.region-logic.internal-conditions.$1.sfz",
        regex: /\b(?:lochanaft|hichanaft|lopolyaft|hipolyaft)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (lochanaft|hichanaft|lopolyaft|hipolyaft): (0 to 127 MIDI Controller)",
      },
      {
        token: "variable.language.region-logic.internal-conditions.$1.sfz",
        regex: /\b(?:lorand|hirand)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-1",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lorand|hirand): (0 to 1 float)",
      },
      {
        token: "variable.language.region-logic.internal-conditions.$1.sfz",
        regex: /\b(?:seq_length|seq_position)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_1-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (seq_length|seq_position): (1 to 100 beats)",
      },
      {
        token: "variable.language.region-logic.triggers.$1.sfz",
        regex: /\btrigger\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_attack-release-first-legato",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (trigger): (attack|release|first|legato)",
      },
      {
        token: "variable.language.region-logic.triggers.$1.sfz",
        regex: /\bon_(?:lo|hi)cc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg1-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (on_loccN|on_hiccN): (-1 to 127 MIDI Controller)",
      },
    ],
    "#sfz1_performance-parameters": [
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\b(?:pan|position|width|amp_veltrack)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg100-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (pan|position|width|amp_veltrack): (-100 to 100 percent)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bvolume\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg144-6",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (volume): (-144 to 6 dB)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bamp_keycenter\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127_or_string_note",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (amp_keycenter): (0 to 127 MIDI Note or C-1 to G#9 Note)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bamp_keytrack\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg96-12",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (amp_keytrack): (-96 to 12 dB)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bamp_velcurve_(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-1",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (amp_velcurve_N): (0 to 1 curve)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bamp_random\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-24",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (amp_random): (0 to 24 dB)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bgain_oncc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg144-48",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (gain_onccN): (-144 to 48 dB)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\brt_decay\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (rt_decay): (0 to 200 dB)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\b(?:xf_cccurve|xf_keycurve|xf_velcurve)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_gain-power",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (xf_cccurve|xf_keycurve|xf_velcurve): (gain|power)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex:
          /\b(?:xfin_locc(?:\d{1,3})?|xfin_hicc(?:\d{1,3})?|xfout_locc(?:\d{1,3})?|xfout_hicc(?:\d{1,3})?|xfin_lokey|xfin_hikey|xfout_lokey|xfout_hikey|xfin_lovel|xfin_hivel|xfout_lovel|xfout_hivel)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (xfin_loccN|xfin_hiccN|xfout_loccN|xfout_hiccN|xfin_lokey|xfin_hikey|xfout_lokey|xfout_hikey|xfin_lovel|xfin_hivel|xfout_lovel|xfout_hivel): (0 to 127 MIDI Velocity)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\b(?:xfin_lokey|xfin_hikey|xfout_lokey|xfout_hikey)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127_or_string_note",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (xfin_lokey|xfin_hikey|xfout_lokey|xfout_hikey): (0 to 127 MIDI Note or C-1 to G#9 Note)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\b(?:bend_up|bend_down|pitch_veltrack)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg9600-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (bend_up|bend_down|pitch_veltrack): (-9600 to 9600 cents)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\bbend_step\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_1-1200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (bend_step): (1 to 1200 cents)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\bpitch_keycenter\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127_or_string_note",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (pitch_keycenter): (0 to 127 MIDI Note)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\bpitch_keytrack\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg1200-1200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (pitch_keytrack): (-1200 to 1200 cents)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\bpitch_random\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (pitch_random): (0 to 9600 cents)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\btranspose\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg127-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (transpose): (-127 to 127 MIDI Note)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\btune\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg9600-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (tune): (-2400 to 2400 cents)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bcutoff\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (cutoff): (0 to arbitrary Hz)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\b(?:cutoff_oncc(?:\d{1,3})?|cutoff_chanaft|cutoff_polyaft)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg9600-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (cutoff_onccN|cutoff_chanaft|cutoff_polyaft): (-9600 to 9600 cents)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bfil_keytrack\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-1200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (fil_keytrack): (0 to 1200 cents)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bfil_keycenter\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127_or_string_note",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (fil_keycenter): (0 to 127 MIDI Note)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bfil_random\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (fil_random): (0 to 9600 cents)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bfil_type\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_lpf-hpf-bpf-brf",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (fil_type): (lpf_1p|hpf_1p|lpf_2p|hpf_2p|bpf_2p|brf_2p)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bfil_veltrack\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg9600-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (fil_veltrack): (-9600 to 9600 cents)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bresonance\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-40",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (resonance): (0 to 40 dB)",
      },
      {
        token: "variable.language.performance-parameters.eq.$1.sfz",
        regex: /\b(?:eq1_freq|eq2_freq|eq3_freq)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-30000",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (eq1_freq|eq2_freq|eq3_freq): (0 to 30000 Hz)",
      },
      {
        token: "variable.language.performance-parameters.eq.$1.sfz",
        regex:
          /\b(?:eq[1-3]_freq_oncc(?:\d{1,3})?|eq1_vel2freq|eq2_vel2freq|eq3_vel2freq)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg30000-30000",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (eq1_freq_onccN|eq2_freq_onccN|eq3_freq_onccN|eq1_vel2freq|eq2_vel2freq|eq3_vel2freq): (-30000 to 30000 Hz)",
      },
      {
        token: "variable.language.performance-parameters.eq.$1.sfz",
        regex: /\b(?:eq1_bw|eq2_bw|eq3_bw)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-4",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (eq1_bw|eq2_bw|eq3_bw): (0.0001 to 4 octaves)",
      },
      {
        token: "variable.language.performance-parameters.eq.$1.sfz",
        regex:
          /\b(?:eq[1-3]_bw_oncc(?:\d{1,3})?|eq1_vel2bw|eq2_vel2bw|eq3_vel2bw)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg4-4",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (eq1_bw_onccN|eq2_bw_onccN|eq3_bw_onccN|eq1_vel2bw|eq2_vel2bw|eq3_vel2bw): (-30000 to 30000 Hz)",
      },
      {
        token: "variable.language.performance-parameters.eq.$1.sfz",
        regex: /\b(?:eq[1-3]_(?:vel2)?gain|eq[1-3]_gain_oncc(?:\d{1,3})?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg96-24",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (eq1_gain|eq2_gain|eq3_gain|eq1_gain_onccN|eq2_gain_onccN|eq3_gain_onccN|eq1_vel2gain|eq2_vel2gain|eq3_vel2gain): (-96 to 24 dB)",
      },
    ],
    "#sfz1_modulation": [
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex:
          /\b(?:ampeg|fileg|pitcheg)_(?:(?:attack|decay|delay|hold|release|start|sustain)(?:_oncc(?:\d{1,3})?)?|vel2(?:attack|decay|delay|hold|release|start|sustain))\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (ampeg_delay_onccN|ampeg_attack_onccN|ampeg_hold_onccN|ampeg_decay_onccN|ampeg_release_onccN|ampeg_vel2delay|ampeg_vel2attack|ampeg_vel2hold|ampeg_vel2decay|ampeg_vel2release|pitcheg_vel2delay|pitcheg_vel2attack|pitcheg_vel2hold|pitcheg_vel2decay|pitcheg_vel2release|fileg_vel2delay|fileg_vel2attack|fileg_vel2hold|fileg_vel2decay|fileg_vel2release): (0 to 100 seconds)",
      },
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex:
          /\b(?:pitcheg_depth|fileg_depth|pitcheg_vel2depth|fileg_vel2depth)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg12000-12000",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (pitcheg_depth|fileg_depth|pitcheg_vel2depth|fileg_vel2depth): (-12000 to 12000 cents)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\bamplfo_(?:depth(?:cc(?:\d{1,3})?)?|depth(?:chan|poly)aft)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg20-20",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (amplfo_depth|amplfo_depthccN|amplfo_depthchanaft|amplfo_depthpolyaft): (-20 to 20 dB)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex:
          /\b(?:fillfo|pitchlfo)_(?:depth(?:(?:_on)?cc(?:\d{1,3})?)?|depth(?:chan|poly)aft)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg1200-1200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (pitchlfo_depth|pitchlfo_depthccN|pitchlfo_depthchanaft|pitchlfo_depthpolyaft|fillfo_depth|fillfo_depthccN|fillfo_depthchanaft|fillfo_depthpolyaft): (-1200 to 1200 cents)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex:
          /\b(?:(?:amplfo|fillfo|pitchlfo)_(?:freq|(?:cc(?:\d{1,3})?)?)|freq(?:chan|poly)aft)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg200-200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (amplfo_freqccN|amplfo_freqchanaft|amplfo_freqpolyaft|pitchlfo_freqccN|pitchlfo_freqchanaft|pitchlfo_freqpolyaft|fillfo_freqccN|fillfo_freqchanaft|fillfo_freqpolyaft): (-200 to 200 Hz)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\b(?:amplfo|fillfo|pitchlfo)_(?:delay|fade)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (amplfo_delay|amplfo_fade|pitchlfo_delay|pitchlfo_fade|fillfo_delay|fillfo_fade): (0 to 100 seconds)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\b(?:amplfo_freq|pitchlfo_freq|fillfo_freq)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-20",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (amplfo_freq|pitchlfo_freq|fillfo_freq): (0 to 20 Hz)",
      },
    ],
    "#sfz1_effects": [
      {
        token: "variable.language.effects.$1.sfz",
        regex: /\b(?:effect1|effect2)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (effect1|effect2): (0 to 100 percent)",
      },
    ],
    "#sfz2_directives": [
      {
        token: [
          "meta.preprocessor.define.sfz",
          "meta.generic.define.sfz",
          "punctuation.definition.variable.sfz",
          "meta.preprocessor.string.sfz",
          "meta.generic.define.sfz",
          "meta.preprocessor.string.sfz",
        ],
        regex: /(\#define)(\s+)(\$)([^\s]+)(\s+)(.+)\b/,
        comment: "#define statement",
      },
      {
        token: [
          "meta.preprocessor.import.sfz",
          "meta.generic.include.sfz",
          "punctuation.definition.string.begin.sfz",
          "meta.preprocessor.string.sfz",
          "meta.preprocessor.string.sfz",
          "punctuation.definition.string.end.sfz",
        ],
        regex: /(\#include)(\s+)(")(.+)(?=\.sfz)(\.sfzh?)(")/,
        comment: "#include statement",
      },
      {
        token: "variable.other.constant.sfz",
        regex: /\$[^\s\=]+/,
        comment: "defined variable",
      },
    ],
    "#sfz2_sound-source": [
      {
        token: [
          "variable.language.sound-source.$1.sfz",
          "keyword.operator.assignment.sfz",
        ],
        regex: /\b(default_path)(=?)/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /(?=(?:\s\/\/|$))/,
            next: "pop",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (default_path): any string",
      },
      {
        token: "variable.language.sound-source.sample-playback.$1.sfz",
        regex: /\bdirection\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_forward-reverse",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (direction): (forward|reverse)",
      },
      {
        token: "variable.language.sound-source.sample-playback.$1.sfz",
        regex: /\bloop_count\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (loop_count): (0 to 4294967296 loops)",
      },
      {
        token: "variable.language.sound-source.sample-playback.$1.sfz",
        regex: /\bloop_type\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_forward-backward-alternate",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (loop_type): (forward|backward|alternate)",
      },
      {
        token: "variable.language.sound-source.sample-playback.$1.sfz",
        regex: /\bmd5\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_md5",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (md5): (128-bit hex md5 hash)",
      },
    ],
    "#sfz2_instrument-settings": [
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\boctave_offset\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg10-10",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (octave_offset): (-10 to 10 octaves)",
      },
      {
        token: [
          "variable.language.instrument-settings.$1.sfz",
          "keyword.operator.assignment.sfz",
        ],
        regex: /\b(region_label|label_cc(?:\d{1,3})?)(=?)/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /(?=(?:\s\/\/|$))/,
            next: "pop",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (region_label|label_ccN): (any string)",
      },
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\bset_cc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (set_ccN): (0 to 127 MIDI Controller)",
      },
      {
        token: "variable.language.instrument-settings.voice-lifecycle.$1.sfz",
        regex: /\b(?:polyphony|note_polyphony)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (polyphony|note_polyphony): (0 to 127 voices)",
      },
      {
        token: "variable.language.instrument-settings.voice-lifecycle.$1.sfz",
        regex: /\b(?:note_selfmask|rt_dead)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_on-off",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (note_selfmask|rt_dead): (on|off)",
      },
    ],
    "#sfz2_region-logic": [
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\b(?:sustain_sw|sostenuto_sw)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_on-off",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (sustain_sw|sostenuto_sw): (on|off)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\b(?:loprog|hiprog)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (loprog|hiprog): (0 to 127 MIDI program)",
      },
    ],
    "#sfz2_performance-parameters": [
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bvolume_oncc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg144-6",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (volume_onccN): (-144 to 6 dB)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bphase\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_normal-invert",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (phase): (normal|invert)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bwidth_oncc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg100-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (width_onccN): (-100 to 100 percent)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\bbend_smooth\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (bend_smooth): (0 to 9600 cents)",
      },
      {
        token: "variable.language.performance-parameters.pitch.$1.sfz",
        regex: /\b(?:bend_stepup|bend_stepdown)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_1-1200",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (bend_stepup|bend_stepdown): (1 to 1200 cents)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\b(?:cutoff2|cutoff2_oncc(?:\d{1,3})?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (cutoff2|cutoff2_onccN): (0 to arbitrary Hz)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex:
          /\b(?:resonance_oncc(?:\d{1,3})?|resonance2|resonance2_oncc(?:\d{1,3})?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-40",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (resonance_onccN|resonance2|resonance2_onccN): (0 to 40 dB)",
      },
      {
        token: "variable.language.performance-parameters.filters.$1.sfz",
        regex: /\bfil2_type\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_lpf-hpf-bpf-brf",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (fil2_type): (lpf_1p|hpf_1p|lpf_2p|hpf_2p|bpf_2p|brf_2p)",
      },
    ],
    "#sfz2_modulation": [
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex: /\beg\d{2}_(?:curve|loop|points|sustain)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (egN_(curve|loop|points|sustain)): (positive int)",
      },
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex: /\beg\d{2}_level\d*(?:_oncc(?:\d{1,3})?)?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg1-1",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (egN_level|egN_level_onccX): (-1 to 1 float)",
      },
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex: /\beg\d{2}_shape\d+\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg10-10",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (egN_shapeX): (-10 to 10 number)",
      },
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex: /\beg\d{2}_time\d*(?:_oncc(?:\d{1,3})?)?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (egN_time|egN_time_onccX): (0 to 100 seconds)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\blfo\d{2}_(?:wave|count|freq_(?:smooth|step)cc(?:\d{1,3})?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (lfoN_wave|lfoN_count|lfoN_freq|lfoN_freq_onccX|lfoN_freq_smoothccX): (positive int)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\blfo\d{2}_freq(?:_oncc(?:\d{1,3})?)?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg20-20",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lfoN_freq|lfoN_freq_onccN): (-20 to 20 Hz)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\b(?:lfo\d{2}_(?:delay|fade)(?:_oncc(?:\d{1,3})?)?|count)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (lfoN_delay|lfoN_delay_onccX|lfoN_fade|lfoN_fade_onccX): (0 to 100 seconds)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\b(?:lfo\d{2}_phase(?:_oncc(?:\d{1,3})?)?|count)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-1",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lfoN_phase|lfoN_phase_onccX): (0 to 1 number)",
      },
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex:
          /\beg\d{2}_(?:(?:depth_lfo|depthadd_lfo|freq_lfo)|(?:amplitude|depth|depth_lfo|depthadd_lfo|freq_lfo|pitch|cutoff2?|eq[1-3]freq|eq[1-3]bw|eq[1-3]gain|pan|resonance2?|volume|width)(?:_oncc(?:\d{1,3})?)?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (other eg destinations): (any float)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex:
          /\blfo\d{2}_(?:(?:depth_lfo|depthadd_lfo|freq_lfo)|(?:amplitude|decim|bitred|depth_lfo|depthadd_lfo|freq_lfo|pitch|cutoff2?|eq[1-3]freq|eq[1-3]bw|eq[1-3]gain|pan|resonance2?|volume|width)(?:_oncc(?:\d{1,3})?)?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (other lfo destinations): (any float)",
      },
    ],
    "#sfz2_curves": [
      {
        token: "variable.language.curves.$1.sfz",
        regex: /\bv[0-9]{3}\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-1",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (vN): (0 to 1 number)",
      },
    ],
    "#aria_instrument-settings": [
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\bhint_[A-z_]*\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (hint_): (any number)",
      },
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\b(?:set_|lo|hi)hdcc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (set_hdccN|lohdccN|hihdccN): (any number)",
      },
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\b(?:sustain_cc|sostenuto_cc|sustain_lo|sostenuto_lo)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (sustain_cc|sostenuto_cc|sustain_lo|sostenuto_lo): (0 to 127 MIDI byte)",
      },
      {
        token: "variable.language.instrument-settings.$1.sfz",
        regex: /\bsw_octave_offset\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_neg10-10",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (sw_octave_offset): (-10 to 10 octaves)",
      },
      {
        token: "variable.language.instrument-settings.voice-lifecycle.$1.sfz",
        regex: /\boff_curve\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (off_curve): (0 to any curve)",
      },
      {
        token: "variable.language.instrument-settings.voice-lifecycle.$1.sfz",
        regex: /\b(?:off_shape|off_time)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg10-10",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (off_shape|off_time): (-10 to 10 number)",
      },
    ],
    "#aria_region-logic": [
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\b(?:sw_default|sw_lolast|sw_hilast)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (sw_default|sw_lolast|sw_hilast): (0 to 127 MIDI Note)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\bsw_label\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_any_continuous",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (sw_label): (any string)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\bvar\d{2}_curvecc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (varNN_curveccX): (0 to any curve)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex: /\bvar\d{2}_mod\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_add-mult",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (varNN_mod): (add|mult)",
      },
      {
        token: "variable.language.region-logic.midi-conditions.$1.sfz",
        regex:
          /\b(?:var\d{2}_oncc(?:\d{1,3})?|var\d{2}_(?:pitch|cutoff|resonance|cutoff2|resonance2|eq[1-3]freq|eq[1-3]bw|eq[1-3]gain|volume|amplitude|pan|width))\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (varNN_onccX|varNN_target): (any float)",
      },
    ],
    "#aria_performance-parameters": [
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex:
          /\b(?:amplitude|amplitude_oncc(?:\d{1,3})?|global_amplitude|master_amplitude|group_amplitude)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_0-100",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (amplitude|amplitude_onccN|global_amplitude|master_amplitude|group_amplitude): (0 to 100 percent)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bamplitude_curvecc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (amplitude_curveccN): (any positive curve)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bamplitude_smoothcc(?:\d{1,3})?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-9600",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (amplitude_smoothccN): (0 to 9600 number)",
      },
      {
        token: "variable.language.performance-parameters.amplifier.$1.sfz",
        regex: /\bpan_law\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_balance-mma",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (pan_law): (balance|mma)",
      },
      {
        token: "variable.language.performance-parameters.amplifiers.$1.sfz",
        regex:
          /\b(?:global_volume|master_volume|group_volume|volume_oncc(?:\d{1,3})?)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg144-6",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (global_volume|master_volume|group_volume|volume_onccN): (-144 to 6 dB)",
      },
    ],
    "#aria_modulation": [
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex:
          /\b(?:ampeg_attack_shape|ampeg_decay_shape|ampeg_release_shape|eg\d{2}_shape\d+)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_neg10-10",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (ampeg_attack_shape|ampeg_decay_shape|ampeg_release_shape|egN_shapeX): (-10 to 10 float)",
      },
      {
        token: "variable.language.modulation.envelope-generators.$1.sfz",
        regex: /\b(?:ampeg_release_zero|ampeg_decay_zero)\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_on-off",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (ampeg_release_zero|ampeg_decay_zero): (true|false)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\blfo\d{2}_(?:offset|ratio|scale)2?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#float_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment:
          "opcodes: (lfoN_offset|lfoN_offset2|lfoN_ratio|lfoN_ratio2|lfoN_scale|lfoN_scale2): (any float)",
      },
      {
        token: "variable.language.modulation.lfo.$1.sfz",
        regex: /\blfo\d{2}_wave2?\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_0-127",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (lfoN_wave|lfoN_wav2): (0 to 127 MIDI Number)",
      },
    ],
    "#aria_curves": [
      {
        token: "variable.language.curves.$1.sfz",
        regex: /\bcurve_index\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_positive",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (curve_index): (any positive integer)",
      },
    ],
    "#aria_effects": [
      {
        token: "variable.language.effects.$1.sfz",
        regex: /\bparam_offset\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#int_any",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (param_offset): (any integer)",
      },
      {
        token: "variable.language.effects.$1.sfz",
        regex: /\bvendor_specific\b/,
        push: [
          {
            token: "meta.opcode.sfz",
            regex: /\s|$/,
            next: "pop",
          },
          {
            include: "#string_any_continuous",
          },
          {
            defaultToken: "meta.opcode.sfz",
          },
        ],
        comment: "opcodes: (vendor_specific): (any to continuous string)",
      },
    ],
    "#float_neg30000-30000": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(-?(?<!\.)\b(?:30000|(?:[0-9]|[1-9][0-9]{1,3}|2[0-9]{4})(?:\.\d*)?)\b)\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=-?(?<!\.)\b(?:30000|(?:[0-9]|[1-9][0-9]{1,3}|2[0-9]{4})(?:\.\d*)?)\b\b)[^\s]*/,
      },
    ],
    "#float_neg144-48": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(-(?<!\.)(?:144|(?:[1-9]|[1-8][0-9]|9[0-9]|1[0-4][0-3])(?:\.\d*)?)\b|\b(?<!\.)(?:48|(?:[0-9]|[1-3][0-9]|4[0-7])(?:\.\d*)?)\b)/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:-(?<!\.)(?:144|(?:[1-9]|[1-8][0-9]|9[0-9]|1[0-4][0-3])(?:\.\d*)?)\b|\b(?<!\.)(?:48|(?:[0-9]|[1-3][0-9]|4[0-7])(?:\.\d*)?)\b)).*/,
      },
    ],
    "#float_neg144-6": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(-(?<!\.)(?:144|(?:[1-9]|[1-8][0-9]|9[0-9]|1[0-4][0-3])(?:\.\d*)?)\b|\b(?<!\.)(?:6|[0-5](?:\.\d*)?\b))/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:-(?<!\.)(?:144|(?:[1-9]|[1-8][0-9]|9[0-9]|1[0-4][0-3])(?:\.\d*)?)\b|\b(?<!\.)(?:6|[0-5](?:\.\d*)?\b))).*/,
      },
    ],
    "#float_neg200-200": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?(?<!\.)(?:200|(?:[0-9]|[1-9][0-9]{1,2})(?:\.\d*)?))\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=-?(?<!\.)(?:200|(?:[0-9]|[1-9][0-9]{1,2})(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_neg100-100": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?(?<!\.)(?:100|(?:[0-9]|[1-9][0-9])(?:\.\d*)?))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?(?<!\.)(?:100|(?:[0-9]|[1-9][0-9])(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_neg96-12": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(-(?<!\.)(?:96|(?:[1-9]|[1-8][0-9]|9[0-5])(?:\.\d*)?)\b|\b(?<!\.)(?:12|(?:[0-9]|1[01])(?:\.\d*)?\b))/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:-(?<!\.)(?:96|(?:[1-9]|[1-8][0-9]|9[0-5])(?:\.\d*)?)\b|\b(?<!\.)(?:12|(?:[0-9]|1[01])(?:\.\d*)?\b))).*/,
      },
    ],
    "#float_neg96-24": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(-(?<!\.)(?:96|(?:[1-9]|[1-8][0-9]|9[0-5])(?:\.\d*)?)\b|\b(?<!\.)(?:24|(?:[0-9]|1[0-9]|2[0-3])(?:\.\d*)?\b))/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:-(?<!\.)(?:96|(?:[1-9]|[1-8][0-9]|9[0-5])(?:\.\d*)?)\b|\b(?<!\.)(?:24|(?:[0-9]|1[0-9]|2[0-3])(?:\.\d*)?\b))).*/,
      },
    ],
    "#float_neg20-20": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?(?<!\.)(?:20|1?[0-9](?:\.\d*)?))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?(?<!\.)(?:20|1?[0-9](?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_neg10-10": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?(?<!\.)(?:10|[0-9](?:\.\d*)?))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?(?<!\.)(?:10|[0-9](?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_neg4-4": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?(?<!\.)(?:4|[0-3](?:\.\d*)?))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?(?<!\.)(?:4|[0-3](?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_neg1-1": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?(?<!\.)(?:1|0(?:\.\d*)?))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?(?<!\.)(?:1|0(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-1": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(1|0(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?<!\.)(?:1|0(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-4": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(4|[0-3](?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?<!\.)(?:4|[0-3](?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-20": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(20|(?:[0-9]|1[0-9])(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?<!\.)(?:24|(?:[0-9]|1[0-9])(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-24": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(24|(?:[0-9]|1[0-9]|2[0-3])(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?<!\.)(?:24|(?:[0-9]|1[0-9]|2[0-3])(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-32": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(32|(?:[0-9]|1[0-9]|2[0-9]|3[0-1])(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?<!\.)(?:32|(?:[0-9]|1[0-9]|2[0-9]|3[0-1])(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-40": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(40|(?:[0-9]|[1-3][0-9])(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?<!\.)(?:40|(?:[0-9]|[1-3][0-9])(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-100": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(100|(?:[0-9]|[1-9][0-9])(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?<!\.)(?:100|(?:[0-9]|[1-9][0-9])(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-200": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(?<!\.)(200|(?:[0-9]|[1-9][0-9]|1[0-9]{2})(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?<!\.)(?:200|(?:[0-9]|[1-9][0-9]|1[0-9]{2})(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-500": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(?<!\.)(500|(?:[0-9]|[1-8][0-9]|9[0-9]|[1-4][0-9]{2})(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?<!\.)(?:500|(?:[0-9]|[1-8][0-9]|9[0-9]|[1-4][0-9]{2})(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_0-30000": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex:
          /(=)(?<!\.)\b(30000|(?:[0-9]|[1-9][0-9]{1,3}|2[0-9]{4})(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?<!\.)\b(?:30000|(?:[0-9]|[1-9][0-9]{1,3}|2[0-9]{4})(?:\.\d*)?)\b)[^\s]*/,
      },
    ],
    "#float_positive": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(\d+(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=\d+(?:\.\d*)?\b)[^\s]*/,
      },
    ],
    "#float_any": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.float.sfz",
        ],
        regex: /(=)(-?\b\d+(?:\.\d*)?)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?\b\d+(?:\.\d*)?\b)[^\s]*/,
      },
    ],
    "#int_neg12000-12000": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-?\b(?:12000|[0-9]|[1-9][0-9]{1,3}|1[01][0-9]{3}))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?\b(?:12000|[0-9]|[1-9][0-9]{1,3}|1[01][0-9]{3})\b)[^\s]*/,
      },
    ],
    "#int_neg9600-9600": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex:
          /(=)(-?(?:[0-9]|[1-9][0-9]{1,2}|[1-8][0-9]{3}|9[0-5][0-9]{2}|9600))\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=-?(?:[0-9]|[1-9][0-9]{1,2}|[1-8][0-9]{3}|9[0-5][0-9]{2}|9600)\b)[^\s]*/,
      },
    ],
    "#int_neg8192-8192": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex:
          /(=)(-?(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2}|[1-7][0-9]{3}|80[0-9]{2}|81[0-8][0-9]|819[0-2]))\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=-?(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2}|[1-7][0-9]{3}|80[0-9]{2}|81[0-8][0-9]|819[0-2])\b)[^\s]*/,
      },
    ],
    "#int_neg1200-1200": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-?\b(?:1200|[0-9]|[1-9][0-9]{1,2}|1[01][0-9]{2}))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?\b(?:1200|[0-9]|[1-9][0-9]{1,2}|1[01][0-9]{2})\b)[^\s]*/,
      },
    ],
    "#int_neg100-100": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-?\b(?:100|[0-9]|[1-9][0-9]))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?\b(?:100|[0-9]|[1-9][0-9])\b)[^\s]*/,
      },
    ],
    "#int_neg10-10": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-?\b(?:10|[0-9]))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=-?\b(?:10|[0-9])\b)[^\s]*/,
      },
    ],
    "#int_neg1-127": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-1|[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:-1|[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])\b)[^\s]*/,
      },
    ],
    "#int_neg127-127": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-?\b(?:[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7]))\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=-?\b(?:[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])\b)[^\s]*/,
      },
    ],
    "#int_0-127": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)([0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])\b)[^\s]*/,
      },
    ],
    "#int_0-127_or_string_note": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex:
          /(=)((?:[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])|[cdefgabCDEFGAB]\#?(?:-1|[0-9]))\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:(?:[0-9]|[1-8][0-9]|9[0-9]|1[01][0-9]|12[0-7])|[cdefgabCDEFGAB]\#?(?:-1|[0-9]))\b)[^\s]*/,
      },
    ],
    "#int_0-1024": [
      {
        token: "constant.numeric.integer.sfz",
        regex: /=(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2}|10[01][0-9]|102[0-4])\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:[0-9]|[1-9][0-9]|[1-9][0-9]{2}|10[01][0-9]|102[0-4])\b)[^\s]*/,
      },
    ],
    "#int_0-1200": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(1200|[0-9]|[1-9][0-9]{1,2}|1[01][0-9{2}])\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:1200|[0-9]|[1-9][0-9]{1,2}|1[01][0-9]{2}])\b)[^\s]*/,
      },
    ],
    "#int_0-9600": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)([0-9]|[1-9][0-9]{1,2}|[1-8][0-9]{3}|9[0-5][0-9]{2}|9600)\b/,
      },
      {
        token: "invalid.sfz",
        regex:
          /(?!=(?:[0-9]|[1-9][0-9]{1,2}|[1-8][0-9]{3}|9[0-5][0-9]{2}|9600)\b)[^\s]*/,
      },
    ],
    "#int_1-16": [
      {
        token: "constant.numeric.integer.sfz",
        regex: /=(?:[1-9]|1[0-6])\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:[1-9]|1[0-6])\b)[^\s]*/,
      },
    ],
    "#int_1-100": [
      {
        token: "constant.numeric.integer.sfz",
        regex: /=(?:100|[1-9]|[1-9][0-9])\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:100|[1-9]|[1-9][0-9])\b)[^\s]*/,
      },
    ],
    "#int_1-1200": [
      {
        token: "constant.numeric.integer.sfz",
        regex: /=(?:1200|[0-9]|[1-9][0-9]{1,2}|1[01][0-9]{2})\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:1200|[0-9]|[1-9][0-9]{1,2}|1[01][0-9]{2})\b)[^\s]*/,
      },
    ],
    "#int_positive": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(\d+)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?:(?!\d+).)*$/,
      },
    ],
    "#int_positive_or_neg1": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-1|\d+)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?:(?!(?:-1|\d+)\b).)*$/,
      },
    ],
    "#int_any": [
      {
        token: [
          "keyword.operator.assignment.sfz",
          "constant.numeric.integer.sfz",
        ],
        regex: /(=)(-?\b\d+)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?:(?!-?\b\d+).)*$/,
      },
    ],
    "#string_add-mult": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(add|mult)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:add|mult)).*/,
      },
    ],
    "#string_attack-release-first-legato": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(attack|release|first|legato)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:attack|release|first|legato)).*/,
      },
    ],
    "#string_balance-mma": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(balance|mma)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:balance|mma)).*/,
      },
    ],
    "#string_current-previous": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(current|previous)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:current|previous)).*/,
      },
    ],
    "#string_fast-normal-time": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(fast|normal|time)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:fast|normal|time)).*/,
      },
    ],
    "#string_forward-backward-alternate": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(forward|backward|alternate)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:forward|backward|alternate)).*/,
      },
    ],
    "#string_forward-reverse": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(forward|reverse)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:forward|reverse)).*/,
      },
    ],
    "#string_gain-power": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(gain|power)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:gain|power)).*/,
      },
    ],
    "#string_loop_mode": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(no_loop|one_shot|loop_continuous|loop_sustain)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:no_loop|one_shot|loop_continuous|loop_sustain)).*/,
      },
    ],
    "#string_lpf-hpf-bpf-brf": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(lpf_1p|hpf_1p|lpf_2p|hpf_2p|bpf_2p|brf_2p)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:lpf_1p|hpf_1p|lpf_2p|hpf_2p|bpf_2p|brf_2p)).*/,
      },
    ],
    "#string_md5": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)([abcdef0-9]{32})\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=[abcdef0-9]{32}).*/,
      },
    ],
    "#string_normal-invert": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(normal|invert)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:normal|invert)).*/,
      },
    ],
    "#string_on-off": [
      {
        token: ["keyword.operator.assignment.sfz", "string.unquoted.sfz"],
        regex: /(=)(true|false|on|off|0|1)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=(?:true|false|on|off|0|1)).*/,
      },
    ],
    "#string_note": [
      {
        token: ["keyword.operator.assignment.sfz", "string.note.sfz"],
        regex: /(=)([cdefgabCDEFGAB]\#?(?:-1|[0-9]))\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=[cdefgabCDEFGAB]\#?(?:-1|[0-9])).*/,
      },
    ],
    "#string_any_continuous": [
      {
        token: ["keyword.operator.assignment.sfz", "string.note.sfz"],
        regex: /(=)([^\s]+)\b/,
      },
      {
        token: "invalid.sfz",
        regex: /(?!=[^\s]+).*/,
      },
    ],
  };
  this.normalizeRules();
};
SFZHighlightRules.metaData = {
  $schema:
    "https://raw.githubusercontent.com/martinring/tmlanguage/master/tmlanguage.json",
  name: "SFZ",
  scopeName: "source.sfz",
};
oop.inherits(SFZHighlightRules, TextHighlightRules);

exports.SFZHighlightRules = SFZHighlightRules;


/***/ }),

/***/ "./node_modules/browser-fs-access/dist/index.modern.js":
/*!*************************************************************!*\
  !*** ./node_modules/browser-fs-access/dist/index.modern.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "directoryOpen": () => (/* binding */ i),
/* harmony export */   "directoryOpenLegacy": () => (/* binding */ h),
/* harmony export */   "directoryOpenModern": () => (/* binding */ d),
/* harmony export */   "fileOpen": () => (/* binding */ n),
/* harmony export */   "fileOpenLegacy": () => (/* binding */ w),
/* harmony export */   "fileOpenModern": () => (/* binding */ c),
/* harmony export */   "fileSave": () => (/* binding */ o),
/* harmony export */   "fileSaveLegacy": () => (/* binding */ P),
/* harmony export */   "fileSaveModern": () => (/* binding */ f),
/* harmony export */   "supported": () => (/* binding */ e)
/* harmony export */ });
const e=(()=>{if("undefined"==typeof self)return!1;if("top"in self&&self!==top)try{top}catch(e){return!1}return"showOpenFilePicker"in self})(),t=e?Promise.resolve().then(function(){return l}):Promise.resolve().then(function(){return v});async function n(...e){return(await t).default(...e)}const r=e?Promise.resolve().then(function(){return y}):Promise.resolve().then(function(){return b});async function i(...e){return(await r).default(...e)}const a=e?Promise.resolve().then(function(){return m}):Promise.resolve().then(function(){return k});async function o(...e){return(await a).default(...e)}const s=async e=>{const t=await e.getFile();return t.handle=e,t};var c=async(e=[{}])=>{Array.isArray(e)||(e=[e]);const t=[];e.forEach((e,n)=>{t[n]={description:e.description||"Files",accept:{}},e.mimeTypes?e.mimeTypes.map(r=>{t[n].accept[r]=e.extensions||[]}):t[n].accept["*/*"]=e.extensions||[]});const n=await window.showOpenFilePicker({id:e[0].id,startIn:e[0].startIn,types:t,multiple:e[0].multiple||!1,excludeAcceptAllOption:e[0].excludeAcceptAllOption||!1}),r=await Promise.all(n.map(s));return e[0].multiple?r:r[0]},l={__proto__:null,default:c};function u(e){function t(e){if(Object(e)!==e)return Promise.reject(new TypeError(e+" is not an object."));var t=e.done;return Promise.resolve(e.value).then(function(e){return{value:e,done:t}})}return u=function(e){this.s=e,this.n=e.next},u.prototype={s:null,n:null,next:function(){return t(this.n.apply(this.s,arguments))},return:function(e){var n=this.s.return;return void 0===n?Promise.resolve({value:e,done:!0}):t(n.apply(this.s,arguments))},throw:function(e){var n=this.s.return;return void 0===n?Promise.reject(e):t(n.apply(this.s,arguments))}},new u(e)}const p=async(e,t,n=e.name,r)=>{const i=[],a=[];var o,s=!1,c=!1;try{for(var l,d=function(e){var t,n,r,i=2;for("undefined"!=typeof Symbol&&(n=Symbol.asyncIterator,r=Symbol.iterator);i--;){if(n&&null!=(t=e[n]))return t.call(e);if(r&&null!=(t=e[r]))return new u(t.call(e));n="@@asyncIterator",r="@@iterator"}throw new TypeError("Object is not async iterable")}(e.values());s=!(l=await d.next()).done;s=!1){const o=l.value,s=`${n}/${o.name}`;"file"===o.kind?a.push(o.getFile().then(t=>(t.directoryHandle=e,t.handle=o,Object.defineProperty(t,"webkitRelativePath",{configurable:!0,enumerable:!0,get:()=>s})))):"directory"!==o.kind||!t||r&&r(o)||i.push(p(o,t,s,r))}}catch(e){c=!0,o=e}finally{try{s&&null!=d.return&&await d.return()}finally{if(c)throw o}}return[...(await Promise.all(i)).flat(),...await Promise.all(a)]};var d=async(e={})=>{e.recursive=e.recursive||!1,e.mode=e.mode||"read";const t=await window.showDirectoryPicker({id:e.id,startIn:e.startIn,mode:e.mode});return(await(await t.values()).next()).done?[t]:p(t,e.recursive,void 0,e.skipDirectory)},y={__proto__:null,default:d},f=async(e,t=[{}],n=null,r=!1,i=null)=>{Array.isArray(t)||(t=[t]),t[0].fileName=t[0].fileName||"Untitled";const a=[];let o=null;if(e instanceof Blob&&e.type?o=e.type:e.headers&&e.headers.get("content-type")&&(o=e.headers.get("content-type")),t.forEach((e,t)=>{a[t]={description:e.description||"Files",accept:{}},e.mimeTypes?(0===t&&o&&e.mimeTypes.push(o),e.mimeTypes.map(n=>{a[t].accept[n]=e.extensions||[]})):o?a[t].accept[o]=e.extensions||[]:a[t].accept["*/*"]=e.extensions||[]}),n)try{await n.getFile()}catch(e){if(n=null,r)throw e}const s=n||await window.showSaveFilePicker({suggestedName:t[0].fileName,id:t[0].id,startIn:t[0].startIn,types:a,excludeAcceptAllOption:t[0].excludeAcceptAllOption||!1});!n&&i&&i(s);const c=await s.createWritable();if("stream"in e){const t=e.stream();return await t.pipeTo(c),s}return"body"in e?(await e.body.pipeTo(c),s):(await c.write(await e),await c.close(),s)},m={__proto__:null,default:f},w=async(e=[{}])=>(Array.isArray(e)||(e=[e]),new Promise((t,n)=>{const r=document.createElement("input");r.type="file";const i=[...e.map(e=>e.mimeTypes||[]),...e.map(e=>e.extensions||[])].join();r.multiple=e[0].multiple||!1,r.accept=i||"",r.style.display="none",document.body.append(r);const a=e=>{"function"==typeof o&&o(),t(e)},o=e[0].legacySetup&&e[0].legacySetup(a,()=>o(n),r),s=()=>{window.removeEventListener("focus",s),r.remove()};r.addEventListener("click",()=>{window.addEventListener("focus",s)}),r.addEventListener("change",()=>{window.removeEventListener("focus",s),r.remove(),a(r.multiple?Array.from(r.files):r.files[0])}),"showPicker"in HTMLInputElement.prototype?r.showPicker():r.click()})),v={__proto__:null,default:w},h=async(e=[{}])=>(Array.isArray(e)||(e=[e]),e[0].recursive=e[0].recursive||!1,new Promise((t,n)=>{const r=document.createElement("input");r.type="file",r.webkitdirectory=!0;const i=e=>{"function"==typeof a&&a(),t(e)},a=e[0].legacySetup&&e[0].legacySetup(i,()=>a(n),r);r.addEventListener("change",()=>{let t=Array.from(r.files);e[0].recursive?e[0].recursive&&e[0].skipDirectory&&(t=t.filter(t=>t.webkitRelativePath.split("/").every(t=>!e[0].skipDirectory({name:t,kind:"directory"})))):t=t.filter(e=>2===e.webkitRelativePath.split("/").length),i(t)}),"showPicker"in HTMLInputElement.prototype?r.showPicker():r.click()})),b={__proto__:null,default:h},P=async(e,t={})=>{Array.isArray(t)&&(t=t[0]);const n=document.createElement("a");let r=e;"body"in e&&(r=await async function(e,t){const n=e.getReader(),r=new ReadableStream({start:e=>async function t(){return n.read().then(({done:n,value:r})=>{if(!n)return e.enqueue(r),t();e.close()})}()}),i=new Response(r),a=await i.blob();return n.releaseLock(),new Blob([a],{type:t})}(e.body,e.headers.get("content-type"))),n.download=t.fileName||"Untitled",n.href=URL.createObjectURL(await r);const i=()=>{"function"==typeof a&&a()},a=t.legacySetup&&t.legacySetup(i,()=>a(),n);return n.addEventListener("click",()=>{setTimeout(()=>URL.revokeObjectURL(n.href),3e4),i()}),n.click(),null},k={__proto__:null,default:P};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Player = exports.Interface = exports.Editor = void 0;
const Editor_1 = __webpack_require__(/*! ./components/Editor */ "./src/components/Editor.ts");
exports.Editor = Editor_1.default;
const Interface_1 = __webpack_require__(/*! ./components/Interface */ "./src/components/Interface.ts");
exports.Interface = Interface_1.default;
const Player_1 = __webpack_require__(/*! ./components/Player */ "./src/components/Player.ts");
exports.Player = Player_1.default;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFlBQVk7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBLHdDQUF3QyxTQUFTO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixpQkFBaUI7QUFDakM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLGlCQUFpQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxFQUFFO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMENBQTBDO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLGVBQWU7QUFDeEM7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EseUJBQXlCLFFBQVE7QUFDakM7QUFDQSxzQkFBc0IsZUFBZTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxZQUFZO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsU0FBUztBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0Esc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isc0JBQXNCO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG1CQUFtQjtBQUNuQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7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O0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGdIQUF1QztBQUN4RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbURBQW1EO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7O0FBRTdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1gsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxPQUFPO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRCxtQkFBbUI7QUFDcEUsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07O0FBRU47QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxZQUFZLE9BQU8sc0JBQXNCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULFFBQVE7QUFDUjtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsQ0FBQyxFQUFFLE1BQThCLEdBQUcsQ0FBYSxDQUFDOzs7Ozs7Ozs7OztBQzVoRGxEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsY0FBYyxtQkFBTyxDQUFDLDBEQUFTOztBQUUvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7Ozs7Ozs7Ozs7O0FDbEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRWE7O0FBRWI7O0FBRUEsYUFBYSxzRkFBNkI7QUFDMUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHNDQUFzQyxzQ0FBc0M7QUFDekc7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RTQSxNQUFrRztBQUNsRyxNQUF3RjtBQUN4RixNQUErRjtBQUMvRixNQUFrSDtBQUNs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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7O0FDbEhZOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsMENBQTBDLElBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSwyQ0FBMkMsSUFBSTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxzQ0FBc0MsSUFBSTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EscUNBQXFDLElBQUk7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxpQ0FBaUMsSUFBSTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsSUFBSSxrQkFBa0IsSUFBSSxtQkFBbUIsSUFBSSxtQkFBbUIsSUFBSTtBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxzQ0FBc0MsSUFBSTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxJQUFJO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxJQUFJO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0Esa0VBQWtFLElBQUk7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1R0FBdUcsSUFBSTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLDRDQUE0QyxJQUFJO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsSUFBSTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsOERBQThELElBQUk7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLElBQUk7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLDhCQUE4QixJQUFJO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsSUFBSTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNB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QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELElBQUk7QUFDNUQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxJQUFJO0FBQ3ZELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwREFBMEQsRUFBRTtBQUM1RCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELEVBQUU7QUFDMUQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnRUFBZ0UsRUFBRTtBQUNsRSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsbUVBQW1FLEVBQUU7QUFDckUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsSUFBSSxRQUFRLEVBQUU7QUFDaEUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRCxJQUFJLFFBQVEsRUFBRTtBQUNuRSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrREFBa0QsSUFBSSxZQUFZLEVBQUU7QUFDcEUsT0FBTztBQUNQO0FBQ0E7QUFDQSxrREFBa0QsSUFBSSxZQUFZLEVBQUU7QUFDcEUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsSUFBSSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ3RFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsSUFBSSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ3RFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRTtBQUMzRSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUUsWUFBWSxFQUFFLFNBQVMsRUFBRTtBQUMzRSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsSUFBSSxZQUFZLEVBQUU7QUFDbkUsT0FBTztBQUNQO0FBQ0E7QUFDQSxpREFBaUQsSUFBSSxZQUFZLEVBQUU7QUFDbkUsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0RBQWdELEVBQUU7QUFDbEQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QyxFQUFFO0FBQ2hELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxJQUFJLFdBQVcsRUFBRTtBQUMzRCxPQUFPO0FBQ1A7QUFDQTtBQUNBLDZDQUE2QyxJQUFJLFlBQVksRUFBRTtBQUMvRCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUMsSUFBSSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ3RFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsSUFBSSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ3BFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxJQUFJLFlBQVksRUFBRTtBQUM1RCxPQUFPO0FBQ1A7QUFDQTtBQUNBLDZDQUE2QyxJQUFJLFlBQVksRUFBRTtBQUMvRCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsR0FBRztBQUNuQyxPQUFPO0FBQ1A7QUFDQTtBQUNBLGdDQUFnQyxHQUFHO0FBQ25DLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QU8sQ0FBQyx1REFBcUI7QUFDOUMsY0FBYyIsInNvdXJjZXMiOlsid2VicGFjazovL1Nmei93ZWJwYWNrL3VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24iLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL0VkaXRvci5zY3NzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL0ludGVyZmFjZS5zY3NzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL1BsYXllci5zY3NzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL2VtaXR0ZXItY29tcG9uZW50L2luZGV4LmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9zYWZlLWJ1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc2F4L2xpYi9zYXguanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3N0cmVhbS9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc3RyaW5nX2RlY29kZXIvbGliL3N0cmluZ19kZWNvZGVyLmpzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL0VkaXRvci5zY3NzPzNjOTciLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvSW50ZXJmYWNlLnNjc3M/ZjYzYyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuc2Nzcz81OThhIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvQXVkaW8udHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvRWRpdG9yLnRzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL0ludGVyZmFjZS50cyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvY29tcG9uZW50LnRzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL2V2ZW50LnRzIiwid2VicGFjazovL1Nmei8uL3NyYy90eXBlcy9pbnRlcmZhY2UudHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL3V0aWxzL2FwaS50cyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvdXRpbHMvZmlsZUxvYWRlci50cyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvdXRpbHMvcGFyc2VyLnRzIiwid2VicGFjazovL1Nmei8uL3NyYy91dGlscy91dGlscy50cyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMveG1sLWpzL2xpYi9hcnJheS1oZWxwZXIuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3htbC1qcy9saWIvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3htbC1qcy9saWIvanMyeG1sLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy94bWwtanMvbGliL2pzb24yeG1sLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy94bWwtanMvbGliL29wdGlvbnMtaGVscGVyLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy94bWwtanMvbGliL3htbDJqcy5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMveG1sLWpzL2xpYi94bWwyanNvbi5qcyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvbGliL21vZGUtc2Z6LmpzIiwid2VicGFjazovL1Nmei8uL3NyYy9saWIvc2Z6X2ZvbGRpbmdfbW9kZS5qcyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvbGliL3Nmel9oaWdobGlnaHRfcnVsZXMuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL2Jyb3dzZXItZnMtYWNjZXNzL2Rpc3QvaW5kZXgubW9kZXJuLmpzIiwid2VicGFjazovL1Nmei93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9TZnovd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vU2Z6L3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9TZnovd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9TZnovd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9TZnovd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL1Nmei8uL3NyYy9pbmRleC50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gd2VicGFja1VuaXZlcnNhbE1vZHVsZURlZmluaXRpb24ocm9vdCwgZmFjdG9yeSkge1xuXHRpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcpXG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCk7XG5cdGVsc2UgaWYodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKVxuXHRcdGRlZmluZShbXSwgZmFjdG9yeSk7XG5cdGVsc2UgaWYodHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnKVxuXHRcdGV4cG9ydHNbXCJTZnpcIl0gPSBmYWN0b3J5KCk7XG5cdGVsc2Vcblx0XHRyb290W1wiU2Z6XCJdID0gZmFjdG9yeSgpO1xufSkodGhpcywgKCkgPT4ge1xucmV0dXJuICIsIid1c2Ugc3RyaWN0J1xuXG5leHBvcnRzLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5leHBvcnRzLnRvQnl0ZUFycmF5ID0gdG9CeXRlQXJyYXlcbmV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IGZyb21CeXRlQXJyYXlcblxudmFyIGxvb2t1cCA9IFtdXG52YXIgcmV2TG9va3VwID0gW11cbnZhciBBcnIgPSB0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcgPyBVaW50OEFycmF5IDogQXJyYXlcblxudmFyIGNvZGUgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLydcbmZvciAodmFyIGkgPSAwLCBsZW4gPSBjb2RlLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XG4gIGxvb2t1cFtpXSA9IGNvZGVbaV1cbiAgcmV2TG9va3VwW2NvZGUuY2hhckNvZGVBdChpKV0gPSBpXG59XG5cbi8vIFN1cHBvcnQgZGVjb2RpbmcgVVJMLXNhZmUgYmFzZTY0IHN0cmluZ3MsIGFzIE5vZGUuanMgZG9lcy5cbi8vIFNlZTogaHR0cHM6Ly9lbi53aWtpcGVkaWEub3JnL3dpa2kvQmFzZTY0I1VSTF9hcHBsaWNhdGlvbnNcbnJldkxvb2t1cFsnLScuY2hhckNvZGVBdCgwKV0gPSA2MlxucmV2TG9va3VwWydfJy5jaGFyQ29kZUF0KDApXSA9IDYzXG5cbmZ1bmN0aW9uIGdldExlbnMgKGI2NCkge1xuICB2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXG4gIGlmIChsZW4gJSA0ID4gMCkge1xuICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG4gIH1cblxuICAvLyBUcmltIG9mZiBleHRyYSBieXRlcyBhZnRlciBwbGFjZWhvbGRlciBieXRlcyBhcmUgZm91bmRcbiAgLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vYmVhdGdhbW1pdC9iYXNlNjQtanMvaXNzdWVzLzQyXG4gIHZhciB2YWxpZExlbiA9IGI2NC5pbmRleE9mKCc9JylcbiAgaWYgKHZhbGlkTGVuID09PSAtMSkgdmFsaWRMZW4gPSBsZW5cblxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gdmFsaWRMZW4gPT09IGxlblxuICAgID8gMFxuICAgIDogNCAtICh2YWxpZExlbiAlIDQpXG5cbiAgcmV0dXJuIFt2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuXVxufVxuXG4vLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcbmZ1bmN0aW9uIGJ5dGVMZW5ndGggKGI2NCkge1xuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiBfYnl0ZUxlbmd0aCAoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSB7XG4gIHJldHVybiAoKHZhbGlkTGVuICsgcGxhY2VIb2xkZXJzTGVuKSAqIDMgLyA0KSAtIHBsYWNlSG9sZGVyc0xlblxufVxuXG5mdW5jdGlvbiB0b0J5dGVBcnJheSAoYjY0KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbnMgPSBnZXRMZW5zKGI2NClcbiAgdmFyIHZhbGlkTGVuID0gbGVuc1swXVxuICB2YXIgcGxhY2VIb2xkZXJzTGVuID0gbGVuc1sxXVxuXG4gIHZhciBhcnIgPSBuZXcgQXJyKF9ieXRlTGVuZ3RoKGI2NCwgdmFsaWRMZW4sIHBsYWNlSG9sZGVyc0xlbikpXG5cbiAgdmFyIGN1ckJ5dGUgPSAwXG5cbiAgLy8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuICB2YXIgbGVuID0gcGxhY2VIb2xkZXJzTGVuID4gMFxuICAgID8gdmFsaWRMZW4gLSA0XG4gICAgOiB2YWxpZExlblxuXG4gIHZhciBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAxOCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldIDw8IDEyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPDwgNikgfFxuICAgICAgcmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAzKV1cbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gMTYpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiA4KSAmIDB4RkZcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDIpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMikgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMSldID4+IDQpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICBpZiAocGxhY2VIb2xkZXJzTGVuID09PSAxKSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDEwKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgNCkgfFxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpICsgMildID4+IDIpXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIGFyclxufVxuXG5mdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuICByZXR1cm4gbG9va3VwW251bSA+PiAxOCAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtID4+IDEyICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gNiAmIDB4M0ZdICtcbiAgICBsb29rdXBbbnVtICYgMHgzRl1cbn1cblxuZnVuY3Rpb24gZW5jb2RlQ2h1bmsgKHVpbnQ4LCBzdGFydCwgZW5kKSB7XG4gIHZhciB0bXBcbiAgdmFyIG91dHB1dCA9IFtdXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSArPSAzKSB7XG4gICAgdG1wID1cbiAgICAgICgodWludDhbaV0gPDwgMTYpICYgMHhGRjAwMDApICtcbiAgICAgICgodWludDhbaSArIDFdIDw8IDgpICYgMHhGRjAwKSArXG4gICAgICAodWludDhbaSArIDJdICYgMHhGRilcbiAgICBvdXRwdXQucHVzaCh0cmlwbGV0VG9CYXNlNjQodG1wKSlcbiAgfVxuICByZXR1cm4gb3V0cHV0LmpvaW4oJycpXG59XG5cbmZ1bmN0aW9uIGZyb21CeXRlQXJyYXkgKHVpbnQ4KSB7XG4gIHZhciB0bXBcbiAgdmFyIGxlbiA9IHVpbnQ4Lmxlbmd0aFxuICB2YXIgZXh0cmFCeXRlcyA9IGxlbiAlIDMgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcbiAgdmFyIHBhcnRzID0gW11cbiAgdmFyIG1heENodW5rTGVuZ3RoID0gMTYzODMgLy8gbXVzdCBiZSBtdWx0aXBsZSBvZiAzXG5cbiAgLy8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuICBmb3IgKHZhciBpID0gMCwgbGVuMiA9IGxlbiAtIGV4dHJhQnl0ZXM7IGkgPCBsZW4yOyBpICs9IG1heENodW5rTGVuZ3RoKSB7XG4gICAgcGFydHMucHVzaChlbmNvZGVDaHVuayh1aW50OCwgaSwgKGkgKyBtYXhDaHVua0xlbmd0aCkgPiBsZW4yID8gbGVuMiA6IChpICsgbWF4Q2h1bmtMZW5ndGgpKSlcbiAgfVxuXG4gIC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcbiAgaWYgKGV4dHJhQnl0ZXMgPT09IDEpIHtcbiAgICB0bXAgPSB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDJdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDQpICYgMHgzRl0gK1xuICAgICAgJz09J1xuICAgIClcbiAgfSBlbHNlIGlmIChleHRyYUJ5dGVzID09PSAyKSB7XG4gICAgdG1wID0gKHVpbnQ4W2xlbiAtIDJdIDw8IDgpICsgdWludDhbbGVuIC0gMV1cbiAgICBwYXJ0cy5wdXNoKFxuICAgICAgbG9va3VwW3RtcCA+PiAxMF0gK1xuICAgICAgbG9va3VwWyh0bXAgPj4gNCkgJiAweDNGXSArXG4gICAgICBsb29rdXBbKHRtcCA8PCAyKSAmIDB4M0ZdICtcbiAgICAgICc9J1xuICAgIClcbiAgfVxuXG4gIHJldHVybiBwYXJ0cy5qb2luKCcnKVxufVxuIiwiLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuXG4ndXNlIHN0cmljdCdcblxuY29uc3QgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbmNvbnN0IGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcbmNvbnN0IGN1c3RvbUluc3BlY3RTeW1ib2wgPVxuICAodHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgU3ltYm9sWydmb3InXSA9PT0gJ2Z1bmN0aW9uJykgLy8gZXNsaW50LWRpc2FibGUtbGluZSBkb3Qtbm90YXRpb25cbiAgICA/IFN5bWJvbFsnZm9yJ10oJ25vZGVqcy51dGlsLmluc3BlY3QuY3VzdG9tJykgLy8gZXNsaW50LWRpc2FibGUtbGluZSBkb3Qtbm90YXRpb25cbiAgICA6IG51bGxcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IFNsb3dCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuXG5jb25zdCBLX01BWF9MRU5HVEggPSAweDdmZmZmZmZmXG5leHBvcnRzLmtNYXhMZW5ndGggPSBLX01BWF9MRU5HVEhcblxuLyoqXG4gKiBJZiBgQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlRgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgUHJpbnQgd2FybmluZyBhbmQgcmVjb21tZW5kIHVzaW5nIGBidWZmZXJgIHY0Lnggd2hpY2ggaGFzIGFuIE9iamVjdFxuICogICAgICAgICAgICAgICBpbXBsZW1lbnRhdGlvbiAobW9zdCBjb21wYXRpYmxlLCBldmVuIElFNilcbiAqXG4gKiBCcm93c2VycyB0aGF0IHN1cHBvcnQgdHlwZWQgYXJyYXlzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssIENocm9tZSA3KywgU2FmYXJpIDUuMSssXG4gKiBPcGVyYSAxMS42KywgaU9TIDQuMisuXG4gKlxuICogV2UgcmVwb3J0IHRoYXQgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0eXBlZCBhcnJheXMgaWYgdGhlIGFyZSBub3Qgc3ViY2xhc3NhYmxlXG4gKiB1c2luZyBfX3Byb3RvX18uIEZpcmVmb3ggNC0yOSBsYWNrcyBzdXBwb3J0IGZvciBhZGRpbmcgbmV3IHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgXG4gKiAoU2VlOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzgpLiBJRSAxMCBsYWNrcyBzdXBwb3J0XG4gKiBmb3IgX19wcm90b19fIGFuZCBoYXMgYSBidWdneSB0eXBlZCBhcnJheSBpbXBsZW1lbnRhdGlvbi5cbiAqL1xuQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgPSB0eXBlZEFycmF5U3VwcG9ydCgpXG5cbmlmICghQnVmZmVyLlRZUEVEX0FSUkFZX1NVUFBPUlQgJiYgdHlwZW9mIGNvbnNvbGUgIT09ICd1bmRlZmluZWQnICYmXG4gICAgdHlwZW9mIGNvbnNvbGUuZXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgY29uc29sZS5lcnJvcihcbiAgICAnVGhpcyBicm93c2VyIGxhY2tzIHR5cGVkIGFycmF5IChVaW50OEFycmF5KSBzdXBwb3J0IHdoaWNoIGlzIHJlcXVpcmVkIGJ5ICcgK1xuICAgICdgYnVmZmVyYCB2NS54LiBVc2UgYGJ1ZmZlcmAgdjQueCBpZiB5b3UgcmVxdWlyZSBvbGQgYnJvd3NlciBzdXBwb3J0LidcbiAgKVxufVxuXG5mdW5jdGlvbiB0eXBlZEFycmF5U3VwcG9ydCAoKSB7XG4gIC8vIENhbiB0eXBlZCBhcnJheSBpbnN0YW5jZXMgY2FuIGJlIGF1Z21lbnRlZD9cbiAgdHJ5IHtcbiAgICBjb25zdCBhcnIgPSBuZXcgVWludDhBcnJheSgxKVxuICAgIGNvbnN0IHByb3RvID0geyBmb286IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH0gfVxuICAgIE9iamVjdC5zZXRQcm90b3R5cGVPZihwcm90bywgVWludDhBcnJheS5wcm90b3R5cGUpXG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGFyciwgcHJvdG8pXG4gICAgcmV0dXJuIGFyci5mb28oKSA9PT0gNDJcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAncGFyZW50Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ1ZmZlclxuICB9XG59KVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQnVmZmVyLnByb3RvdHlwZSwgJ29mZnNldCcsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGhpcykpIHJldHVybiB1bmRlZmluZWRcbiAgICByZXR1cm4gdGhpcy5ieXRlT2Zmc2V0XG4gIH1cbn0pXG5cbmZ1bmN0aW9uIGNyZWF0ZUJ1ZmZlciAobGVuZ3RoKSB7XG4gIGlmIChsZW5ndGggPiBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIFwiJyArIGxlbmd0aCArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICB9XG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIGNvbnN0IGJ1ZiA9IG5ldyBVaW50OEFycmF5KGxlbmd0aClcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKGJ1ZiwgQnVmZmVyLnByb3RvdHlwZSlcbiAgcmV0dXJuIGJ1ZlxufVxuXG4vKipcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgaGF2ZSB0aGVpclxuICogcHJvdG90eXBlIGNoYW5nZWQgdG8gYEJ1ZmZlci5wcm90b3R5cGVgLiBGdXJ0aGVybW9yZSwgYEJ1ZmZlcmAgaXMgYSBzdWJjbGFzcyBvZlxuICogYFVpbnQ4QXJyYXlgLCBzbyB0aGUgcmV0dXJuZWQgaW5zdGFuY2VzIHdpbGwgaGF2ZSBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgbWV0aG9kc1xuICogYW5kIHRoZSBgVWludDhBcnJheWAgbWV0aG9kcy4gU3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXRcbiAqIHJldHVybnMgYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogVGhlIGBVaW50OEFycmF5YCBwcm90b3R5cGUgcmVtYWlucyB1bm1vZGlmaWVkLlxuICovXG5cbmZ1bmN0aW9uIEJ1ZmZlciAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgLy8gQ29tbW9uIGNhc2UuXG4gIGlmICh0eXBlb2YgYXJnID09PSAnbnVtYmVyJykge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmdPck9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgc3RyaW5nLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICAgIClcbiAgICB9XG4gICAgcmV0dXJuIGFsbG9jVW5zYWZlKGFyZylcbiAgfVxuICByZXR1cm4gZnJvbShhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnBvb2xTaXplID0gODE5MiAvLyBub3QgdXNlZCBieSB0aGlzIGltcGxlbWVudGF0aW9uXG5cbmZ1bmN0aW9uIGZyb20gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZnJvbVN0cmluZyh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldClcbiAgfVxuXG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheVZpZXcodmFsdWUpXG4gIH1cblxuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgJyArXG4gICAgICAnb3IgQXJyYXktbGlrZSBPYmplY3QuIFJlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdmFsdWUpXG4gICAgKVxuICB9XG5cbiAgaWYgKGlzSW5zdGFuY2UodmFsdWUsIEFycmF5QnVmZmVyKSB8fFxuICAgICAgKHZhbHVlICYmIGlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLCBBcnJheUJ1ZmZlcikpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUJ1ZmZlcih2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgaWYgKHR5cGVvZiBTaGFyZWRBcnJheUJ1ZmZlciAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAgIChpc0luc3RhbmNlKHZhbHVlLCBTaGFyZWRBcnJheUJ1ZmZlcikgfHxcbiAgICAgICh2YWx1ZSAmJiBpc0luc3RhbmNlKHZhbHVlLmJ1ZmZlciwgU2hhcmVkQXJyYXlCdWZmZXIpKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidmFsdWVcIiBhcmd1bWVudCBtdXN0IG5vdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSBudW1iZXInXG4gICAgKVxuICB9XG5cbiAgY29uc3QgdmFsdWVPZiA9IHZhbHVlLnZhbHVlT2YgJiYgdmFsdWUudmFsdWVPZigpXG4gIGlmICh2YWx1ZU9mICE9IG51bGwgJiYgdmFsdWVPZiAhPT0gdmFsdWUpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odmFsdWVPZiwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgY29uc3QgYiA9IGZyb21PYmplY3QodmFsdWUpXG4gIGlmIChiKSByZXR1cm4gYlxuXG4gIGlmICh0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9QcmltaXRpdmUgIT0gbnVsbCAmJlxuICAgICAgdHlwZW9mIHZhbHVlW1N5bWJvbC50b1ByaW1pdGl2ZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gQnVmZmVyLmZyb20odmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSgnc3RyaW5nJyksIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgJ1RoZSBmaXJzdCBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBBcnJheUJ1ZmZlciwgQXJyYXksICcgK1xuICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgKVxufVxuXG4vKipcbiAqIEZ1bmN0aW9uYWxseSBlcXVpdmFsZW50IHRvIEJ1ZmZlcihhcmcsIGVuY29kaW5nKSBidXQgdGhyb3dzIGEgVHlwZUVycm9yXG4gKiBpZiB2YWx1ZSBpcyBhIG51bWJlci5cbiAqIEJ1ZmZlci5mcm9tKHN0clssIGVuY29kaW5nXSlcbiAqIEJ1ZmZlci5mcm9tKGFycmF5KVxuICogQnVmZmVyLmZyb20oYnVmZmVyKVxuICogQnVmZmVyLmZyb20oYXJyYXlCdWZmZXJbLCBieXRlT2Zmc2V0WywgbGVuZ3RoXV0pXG4gKiovXG5CdWZmZXIuZnJvbSA9IGZ1bmN0aW9uICh2YWx1ZSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBmcm9tKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cbi8vIE5vdGU6IENoYW5nZSBwcm90b3R5cGUgKmFmdGVyKiBCdWZmZXIuZnJvbSBpcyBkZWZpbmVkIHRvIHdvcmthcm91bmQgQ2hyb21lIGJ1Zzpcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL3B1bGwvMTQ4XG5PYmplY3Quc2V0UHJvdG90eXBlT2YoQnVmZmVyLnByb3RvdHlwZSwgVWludDhBcnJheS5wcm90b3R5cGUpXG5PYmplY3Quc2V0UHJvdG90eXBlT2YoQnVmZmVyLCBVaW50OEFycmF5KVxuXG5mdW5jdGlvbiBhc3NlcnRTaXplIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInNpemVcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyJylcbiAgfSBlbHNlIGlmIChzaXplIDwgMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgc2l6ZSArICdcIiBpcyBpbnZhbGlkIGZvciBvcHRpb24gXCJzaXplXCInKVxuICB9XG59XG5cbmZ1bmN0aW9uIGFsbG9jIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIGlmIChzaXplIDw9IDApIHtcbiAgICByZXR1cm4gY3JlYXRlQnVmZmVyKHNpemUpXG4gIH1cbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9ubHkgcGF5IGF0dGVudGlvbiB0byBlbmNvZGluZyBpZiBpdCdzIGEgc3RyaW5nLiBUaGlzXG4gICAgLy8gcHJldmVudHMgYWNjaWRlbnRhbGx5IHNlbmRpbmcgaW4gYSBudW1iZXIgdGhhdCB3b3VsZFxuICAgIC8vIGJlIGludGVycHJldGVkIGFzIGEgc3RhcnQgb2Zmc2V0LlxuICAgIHJldHVybiB0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnXG4gICAgICA/IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwsIGVuY29kaW5nKVxuICAgICAgOiBjcmVhdGVCdWZmZXIoc2l6ZSkuZmlsbChmaWxsKVxuICB9XG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKiBhbGxvYyhzaXplWywgZmlsbFssIGVuY29kaW5nXV0pXG4gKiovXG5CdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGFsbG9jKHNpemUsIGZpbGwsIGVuY29kaW5nKVxufVxuXG5mdW5jdGlvbiBhbGxvY1Vuc2FmZSAoc2l6ZSkge1xuICBhc3NlcnRTaXplKHNpemUpXG4gIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSA8IDAgPyAwIDogY2hlY2tlZChzaXplKSB8IDApXG59XG5cbi8qKlxuICogRXF1aXZhbGVudCB0byBCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqICovXG5CdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cbi8qKlxuICogRXF1aXZhbGVudCB0byBTbG93QnVmZmVyKG51bSksIGJ5IGRlZmF1bHQgY3JlYXRlcyBhIG5vbi16ZXJvLWZpbGxlZCBCdWZmZXIgaW5zdGFuY2UuXG4gKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZVNsb3cgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICByZXR1cm4gYWxsb2NVbnNhZmUoc2l6ZSlcbn1cblxuZnVuY3Rpb24gZnJvbVN0cmluZyAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAodHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJyB8fCBlbmNvZGluZyA9PT0gJycpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICB9XG5cbiAgaWYgKCFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gIH1cblxuICBjb25zdCBsZW5ndGggPSBieXRlTGVuZ3RoKHN0cmluZywgZW5jb2RpbmcpIHwgMFxuICBsZXQgYnVmID0gY3JlYXRlQnVmZmVyKGxlbmd0aClcblxuICBjb25zdCBhY3R1YWwgPSBidWYud3JpdGUoc3RyaW5nLCBlbmNvZGluZylcblxuICBpZiAoYWN0dWFsICE9PSBsZW5ndGgpIHtcbiAgICAvLyBXcml0aW5nIGEgaGV4IHN0cmluZywgZm9yIGV4YW1wbGUsIHRoYXQgY29udGFpbnMgaW52YWxpZCBjaGFyYWN0ZXJzIHdpbGxcbiAgICAvLyBjYXVzZSBldmVyeXRoaW5nIGFmdGVyIHRoZSBmaXJzdCBpbnZhbGlkIGNoYXJhY3RlciB0byBiZSBpZ25vcmVkLiAoZS5nLlxuICAgIC8vICdhYnh4Y2QnIHdpbGwgYmUgdHJlYXRlZCBhcyAnYWInKVxuICAgIGJ1ZiA9IGJ1Zi5zbGljZSgwLCBhY3R1YWwpXG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUxpa2UgKGFycmF5KSB7XG4gIGNvbnN0IGxlbmd0aCA9IGFycmF5Lmxlbmd0aCA8IDAgPyAwIDogY2hlY2tlZChhcnJheS5sZW5ndGgpIHwgMFxuICBjb25zdCBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgYnVmW2ldID0gYXJyYXlbaV0gJiAyNTVcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheVZpZXcgKGFycmF5Vmlldykge1xuICBpZiAoaXNJbnN0YW5jZShhcnJheVZpZXcsIFVpbnQ4QXJyYXkpKSB7XG4gICAgY29uc3QgY29weSA9IG5ldyBVaW50OEFycmF5KGFycmF5VmlldylcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKGNvcHkuYnVmZmVyLCBjb3B5LmJ5dGVPZmZzZXQsIGNvcHkuYnl0ZUxlbmd0aClcbiAgfVxuICByZXR1cm4gZnJvbUFycmF5TGlrZShhcnJheVZpZXcpXG59XG5cbmZ1bmN0aW9uIGZyb21BcnJheUJ1ZmZlciAoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAoYnl0ZU9mZnNldCA8IDAgfHwgYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignXCJvZmZzZXRcIiBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHMnKVxuICB9XG5cbiAgaWYgKGFycmF5LmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgKGxlbmd0aCB8fCAwKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcImxlbmd0aFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBsZXQgYnVmXG4gIGlmIChieXRlT2Zmc2V0ID09PSB1bmRlZmluZWQgJiYgbGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBidWYgPSBuZXcgVWludDhBcnJheShhcnJheSlcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0KVxuICB9IGVsc2Uge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5LCBieXRlT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICAvLyBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYnVmLCBCdWZmZXIucHJvdG90eXBlKVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbU9iamVjdCAob2JqKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIob2JqKSkge1xuICAgIGNvbnN0IGxlbiA9IGNoZWNrZWQob2JqLmxlbmd0aCkgfCAwXG4gICAgY29uc3QgYnVmID0gY3JlYXRlQnVmZmVyKGxlbilcblxuICAgIGlmIChidWYubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gYnVmXG4gICAgfVxuXG4gICAgb2JqLmNvcHkoYnVmLCAwLCAwLCBsZW4pXG4gICAgcmV0dXJuIGJ1ZlxuICB9XG5cbiAgaWYgKG9iai5sZW5ndGggIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2Ygb2JqLmxlbmd0aCAhPT0gJ251bWJlcicgfHwgbnVtYmVySXNOYU4ob2JqLmxlbmd0aCkpIHtcbiAgICAgIHJldHVybiBjcmVhdGVCdWZmZXIoMClcbiAgICB9XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqKVxuICB9XG5cbiAgaWYgKG9iai50eXBlID09PSAnQnVmZmVyJyAmJiBBcnJheS5pc0FycmF5KG9iai5kYXRhKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlMaWtlKG9iai5kYXRhKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrZWQgKGxlbmd0aCkge1xuICAvLyBOb3RlOiBjYW5ub3QgdXNlIGBsZW5ndGggPCBLX01BWF9MRU5HVEhgIGhlcmUgYmVjYXVzZSB0aGF0IGZhaWxzIHdoZW5cbiAgLy8gbGVuZ3RoIGlzIE5hTiAod2hpY2ggaXMgb3RoZXJ3aXNlIGNvZXJjZWQgdG8gemVyby4pXG4gIGlmIChsZW5ndGggPj0gS19NQVhfTEVOR1RIKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gYWxsb2NhdGUgQnVmZmVyIGxhcmdlciB0aGFuIG1heGltdW0gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgJ3NpemU6IDB4JyArIEtfTUFYX0xFTkdUSC50b1N0cmluZygxNikgKyAnIGJ5dGVzJylcbiAgfVxuICByZXR1cm4gbGVuZ3RoIHwgMFxufVxuXG5mdW5jdGlvbiBTbG93QnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKCtsZW5ndGggIT0gbGVuZ3RoKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgZXFlcWVxXG4gICAgbGVuZ3RoID0gMFxuICB9XG4gIHJldHVybiBCdWZmZXIuYWxsb2MoK2xlbmd0aClcbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gaXNCdWZmZXIgKGIpIHtcbiAgcmV0dXJuIGIgIT0gbnVsbCAmJiBiLl9pc0J1ZmZlciA9PT0gdHJ1ZSAmJlxuICAgIGIgIT09IEJ1ZmZlci5wcm90b3R5cGUgLy8gc28gQnVmZmVyLmlzQnVmZmVyKEJ1ZmZlci5wcm90b3R5cGUpIHdpbGwgYmUgZmFsc2Vcbn1cblxuQnVmZmVyLmNvbXBhcmUgPSBmdW5jdGlvbiBjb21wYXJlIChhLCBiKSB7XG4gIGlmIChpc0luc3RhbmNlKGEsIFVpbnQ4QXJyYXkpKSBhID0gQnVmZmVyLmZyb20oYSwgYS5vZmZzZXQsIGEuYnl0ZUxlbmd0aClcbiAgaWYgKGlzSW5zdGFuY2UoYiwgVWludDhBcnJheSkpIGIgPSBCdWZmZXIuZnJvbShiLCBiLm9mZnNldCwgYi5ieXRlTGVuZ3RoKVxuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihhKSB8fCAhQnVmZmVyLmlzQnVmZmVyKGIpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJidWYxXCIsIFwiYnVmMlwiIGFyZ3VtZW50cyBtdXN0IGJlIG9uZSBvZiB0eXBlIEJ1ZmZlciBvciBVaW50OEFycmF5J1xuICAgIClcbiAgfVxuXG4gIGlmIChhID09PSBiKSByZXR1cm4gMFxuXG4gIGxldCB4ID0gYS5sZW5ndGhcbiAgbGV0IHkgPSBiLmxlbmd0aFxuXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBNYXRoLm1pbih4LCB5KTsgaSA8IGxlbjsgKytpKSB7XG4gICAgaWYgKGFbaV0gIT09IGJbaV0pIHtcbiAgICAgIHggPSBhW2ldXG4gICAgICB5ID0gYltpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gaXNFbmNvZGluZyAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnbGF0aW4xJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiBjb25jYXQgKGxpc3QsIGxlbmd0aCkge1xuICBpZiAoIUFycmF5LmlzQXJyYXkobGlzdCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImxpc3RcIiBhcmd1bWVudCBtdXN0IGJlIGFuIEFycmF5IG9mIEJ1ZmZlcnMnKVxuICB9XG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5hbGxvYygwKVxuICB9XG5cbiAgbGV0IGlcbiAgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgICBsZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICBjb25zdCBidWZmZXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobGVuZ3RoKVxuICBsZXQgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7ICsraSkge1xuICAgIGxldCBidWYgPSBsaXN0W2ldXG4gICAgaWYgKGlzSW5zdGFuY2UoYnVmLCBVaW50OEFycmF5KSkge1xuICAgICAgaWYgKHBvcyArIGJ1Zi5sZW5ndGggPiBidWZmZXIubGVuZ3RoKSB7XG4gICAgICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIGJ1ZiA9IEJ1ZmZlci5mcm9tKGJ1ZilcbiAgICAgICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBVaW50OEFycmF5LnByb3RvdHlwZS5zZXQuY2FsbChcbiAgICAgICAgICBidWZmZXIsXG4gICAgICAgICAgYnVmLFxuICAgICAgICAgIHBvc1xuICAgICAgICApXG4gICAgICB9XG4gICAgfSBlbHNlIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gICAgfSBlbHNlIHtcbiAgICAgIGJ1Zi5jb3B5KGJ1ZmZlciwgcG9zKVxuICAgIH1cbiAgICBwb3MgKz0gYnVmLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZmZXJcbn1cblxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoc3RyaW5nLCBlbmNvZGluZykge1xuICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN0cmluZykpIHtcbiAgICByZXR1cm4gc3RyaW5nLmxlbmd0aFxuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoc3RyaW5nKSB8fCBpc0luc3RhbmNlKHN0cmluZywgQXJyYXlCdWZmZXIpKSB7XG4gICAgcmV0dXJuIHN0cmluZy5ieXRlTGVuZ3RoXG4gIH1cbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJzdHJpbmdcIiBhcmd1bWVudCBtdXN0IGJlIG9uZSBvZiB0eXBlIHN0cmluZywgQnVmZmVyLCBvciBBcnJheUJ1ZmZlci4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIHN0cmluZ1xuICAgIClcbiAgfVxuXG4gIGNvbnN0IGxlbiA9IHN0cmluZy5sZW5ndGhcbiAgY29uc3QgbXVzdE1hdGNoID0gKGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSA9PT0gdHJ1ZSlcbiAgaWYgKCFtdXN0TWF0Y2ggJiYgbGVuID09PSAwKSByZXR1cm4gMFxuXG4gIC8vIFVzZSBhIGZvciBsb29wIHRvIGF2b2lkIHJlY3Vyc2lvblxuICBsZXQgbG93ZXJlZENhc2UgPSBmYWxzZVxuICBmb3IgKDs7KSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsZW5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGhcbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiBsZW4gKiAyXG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gbGVuID4+PiAxXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB7XG4gICAgICAgICAgcmV0dXJuIG11c3RNYXRjaCA/IC0xIDogdXRmOFRvQnl0ZXMoc3RyaW5nKS5sZW5ndGggLy8gYXNzdW1lIHV0ZjhcbiAgICAgICAgfVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuQnVmZmVyLmJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoXG5cbmZ1bmN0aW9uIHNsb3dUb1N0cmluZyAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgbGV0IGxvd2VyZWRDYXNlID0gZmFsc2VcblxuICAvLyBObyBuZWVkIHRvIHZlcmlmeSB0aGF0IFwidGhpcy5sZW5ndGggPD0gTUFYX1VJTlQzMlwiIHNpbmNlIGl0J3MgYSByZWFkLW9ubHlcbiAgLy8gcHJvcGVydHkgb2YgYSB0eXBlZCBhcnJheS5cblxuICAvLyBUaGlzIGJlaGF2ZXMgbmVpdGhlciBsaWtlIFN0cmluZyBub3IgVWludDhBcnJheSBpbiB0aGF0IHdlIHNldCBzdGFydC9lbmRcbiAgLy8gdG8gdGhlaXIgdXBwZXIvbG93ZXIgYm91bmRzIGlmIHRoZSB2YWx1ZSBwYXNzZWQgaXMgb3V0IG9mIHJhbmdlLlxuICAvLyB1bmRlZmluZWQgaXMgaGFuZGxlZCBzcGVjaWFsbHkgYXMgcGVyIEVDTUEtMjYyIDZ0aCBFZGl0aW9uLFxuICAvLyBTZWN0aW9uIDEzLjMuMy43IFJ1bnRpbWUgU2VtYW50aWNzOiBLZXllZEJpbmRpbmdJbml0aWFsaXphdGlvbi5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQgfHwgc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgLy8gUmV0dXJuIGVhcmx5IGlmIHN0YXJ0ID4gdGhpcy5sZW5ndGguIERvbmUgaGVyZSB0byBwcmV2ZW50IHBvdGVudGlhbCB1aW50MzJcbiAgLy8gY29lcmNpb24gZmFpbCBiZWxvdy5cbiAgaWYgKHN0YXJ0ID4gdGhpcy5sZW5ndGgpIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIGlmIChlbmQgPT09IHVuZGVmaW5lZCB8fCBlbmQgPiB0aGlzLmxlbmd0aCkge1xuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoZW5kIDw9IDApIHtcbiAgICByZXR1cm4gJydcbiAgfVxuXG4gIC8vIEZvcmNlIGNvZXJjaW9uIHRvIHVpbnQzMi4gVGhpcyB3aWxsIGFsc28gY29lcmNlIGZhbHNleS9OYU4gdmFsdWVzIHRvIDAuXG4gIGVuZCA+Pj49IDBcbiAgc3RhcnQgPj4+PSAwXG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKCFlbmNvZGluZykgZW5jb2RpbmcgPSAndXRmOCdcblxuICB3aGlsZSAodHJ1ZSkge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICAgIHJldHVybiBhc2NpaVNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gbGF0aW4xU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgcmV0dXJuIGJhc2U2NFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1dGYxNmxlU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKGVuY29kaW5nICsgJycpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbi8vIFRoaXMgcHJvcGVydHkgaXMgdXNlZCBieSBgQnVmZmVyLmlzQnVmZmVyYCAoYW5kIHRoZSBgaXMtYnVmZmVyYCBucG0gcGFja2FnZSlcbi8vIHRvIGRldGVjdCBhIEJ1ZmZlciBpbnN0YW5jZS4gSXQncyBub3QgcG9zc2libGUgdG8gdXNlIGBpbnN0YW5jZW9mIEJ1ZmZlcmBcbi8vIHJlbGlhYmx5IGluIGEgYnJvd3NlcmlmeSBjb250ZXh0IGJlY2F1c2UgdGhlcmUgY291bGQgYmUgbXVsdGlwbGUgZGlmZmVyZW50XG4vLyBjb3BpZXMgb2YgdGhlICdidWZmZXInIHBhY2thZ2UgaW4gdXNlLiBUaGlzIG1ldGhvZCB3b3JrcyBldmVuIGZvciBCdWZmZXJcbi8vIGluc3RhbmNlcyB0aGF0IHdlcmUgY3JlYXRlZCBmcm9tIGFub3RoZXIgY29weSBvZiB0aGUgYGJ1ZmZlcmAgcGFja2FnZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE1NFxuQnVmZmVyLnByb3RvdHlwZS5faXNCdWZmZXIgPSB0cnVlXG5cbmZ1bmN0aW9uIHN3YXAgKGIsIG4sIG0pIHtcbiAgY29uc3QgaSA9IGJbbl1cbiAgYltuXSA9IGJbbV1cbiAgYlttXSA9IGlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMTYgPSBmdW5jdGlvbiBzd2FwMTYgKCkge1xuICBjb25zdCBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgMiAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMTYtYml0cycpXG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gMikge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDEpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwMzIgPSBmdW5jdGlvbiBzd2FwMzIgKCkge1xuICBjb25zdCBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgNCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgMzItYml0cycpXG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gNCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDMpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDIpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zd2FwNjQgPSBmdW5jdGlvbiBzd2FwNjQgKCkge1xuICBjb25zdCBsZW4gPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuICUgOCAhPT0gMCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdCdWZmZXIgc2l6ZSBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNjQtYml0cycpXG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkgKz0gOCkge1xuICAgIHN3YXAodGhpcywgaSwgaSArIDcpXG4gICAgc3dhcCh0aGlzLCBpICsgMSwgaSArIDYpXG4gICAgc3dhcCh0aGlzLCBpICsgMiwgaSArIDUpXG4gICAgc3dhcCh0aGlzLCBpICsgMywgaSArIDQpXG4gIH1cbiAgcmV0dXJuIHRoaXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nICgpIHtcbiAgY29uc3QgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgaWYgKGxlbmd0aCA9PT0gMCkgcmV0dXJuICcnXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIDAsIGxlbmd0aClcbiAgcmV0dXJuIHNsb3dUb1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9Mb2NhbGVTdHJpbmcgPSBCdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nXG5cbkJ1ZmZlci5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzIChiKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGIpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgQnVmZmVyJylcbiAgaWYgKHRoaXMgPT09IGIpIHJldHVybiB0cnVlXG4gIHJldHVybiBCdWZmZXIuY29tcGFyZSh0aGlzLCBiKSA9PT0gMFxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiBpbnNwZWN0ICgpIHtcbiAgbGV0IHN0ciA9ICcnXG4gIGNvbnN0IG1heCA9IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVNcbiAgc3RyID0gdGhpcy50b1N0cmluZygnaGV4JywgMCwgbWF4KS5yZXBsYWNlKC8oLnsyfSkvZywgJyQxICcpLnRyaW0oKVxuICBpZiAodGhpcy5sZW5ndGggPiBtYXgpIHN0ciArPSAnIC4uLiAnXG4gIHJldHVybiAnPEJ1ZmZlciAnICsgc3RyICsgJz4nXG59XG5pZiAoY3VzdG9tSW5zcGVjdFN5bWJvbCkge1xuICBCdWZmZXIucHJvdG90eXBlW2N1c3RvbUluc3BlY3RTeW1ib2xdID0gQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKHRhcmdldCwgc3RhcnQsIGVuZCwgdGhpc1N0YXJ0LCB0aGlzRW5kKSB7XG4gIGlmIChpc0luc3RhbmNlKHRhcmdldCwgVWludDhBcnJheSkpIHtcbiAgICB0YXJnZXQgPSBCdWZmZXIuZnJvbSh0YXJnZXQsIHRhcmdldC5vZmZzZXQsIHRhcmdldC5ieXRlTGVuZ3RoKVxuICB9XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInRhcmdldFwiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXkuICcgK1xuICAgICAgJ1JlY2VpdmVkIHR5cGUgJyArICh0eXBlb2YgdGFyZ2V0KVxuICAgIClcbiAgfVxuXG4gIGlmIChzdGFydCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgc3RhcnQgPSAwXG4gIH1cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZW5kID0gdGFyZ2V0ID8gdGFyZ2V0Lmxlbmd0aCA6IDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzU3RhcnQgPSAwXG4gIH1cbiAgaWYgKHRoaXNFbmQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNFbmQgPSB0aGlzLmxlbmd0aFxuICB9XG5cbiAgaWYgKHN0YXJ0IDwgMCB8fCBlbmQgPiB0YXJnZXQubGVuZ3RoIHx8IHRoaXNTdGFydCA8IDAgfHwgdGhpc0VuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ291dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQgJiYgc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDBcbiAgfVxuICBpZiAodGhpc1N0YXJ0ID49IHRoaXNFbmQpIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZiAoc3RhcnQgPj0gZW5kKSB7XG4gICAgcmV0dXJuIDFcbiAgfVxuXG4gIHN0YXJ0ID4+Pj0gMFxuICBlbmQgPj4+PSAwXG4gIHRoaXNTdGFydCA+Pj49IDBcbiAgdGhpc0VuZCA+Pj49IDBcblxuICBpZiAodGhpcyA9PT0gdGFyZ2V0KSByZXR1cm4gMFxuXG4gIGxldCB4ID0gdGhpc0VuZCAtIHRoaXNTdGFydFxuICBsZXQgeSA9IGVuZCAtIHN0YXJ0XG4gIGNvbnN0IGxlbiA9IE1hdGgubWluKHgsIHkpXG5cbiAgY29uc3QgdGhpc0NvcHkgPSB0aGlzLnNsaWNlKHRoaXNTdGFydCwgdGhpc0VuZClcbiAgY29uc3QgdGFyZ2V0Q29weSA9IHRhcmdldC5zbGljZShzdGFydCwgZW5kKVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAodGhpc0NvcHlbaV0gIT09IHRhcmdldENvcHlbaV0pIHtcbiAgICAgIHggPSB0aGlzQ29weVtpXVxuICAgICAgeSA9IHRhcmdldENvcHlbaV1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgaWYgKHggPCB5KSByZXR1cm4gLTFcbiAgaWYgKHkgPCB4KSByZXR1cm4gMVxuICByZXR1cm4gMFxufVxuXG4vLyBGaW5kcyBlaXRoZXIgdGhlIGZpcnN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA+PSBgYnl0ZU9mZnNldGAsXG4vLyBPUiB0aGUgbGFzdCBpbmRleCBvZiBgdmFsYCBpbiBgYnVmZmVyYCBhdCBvZmZzZXQgPD0gYGJ5dGVPZmZzZXRgLlxuLy9cbi8vIEFyZ3VtZW50czpcbi8vIC0gYnVmZmVyIC0gYSBCdWZmZXIgdG8gc2VhcmNoXG4vLyAtIHZhbCAtIGEgc3RyaW5nLCBCdWZmZXIsIG9yIG51bWJlclxuLy8gLSBieXRlT2Zmc2V0IC0gYW4gaW5kZXggaW50byBgYnVmZmVyYDsgd2lsbCBiZSBjbGFtcGVkIHRvIGFuIGludDMyXG4vLyAtIGVuY29kaW5nIC0gYW4gb3B0aW9uYWwgZW5jb2RpbmcsIHJlbGV2YW50IGlzIHZhbCBpcyBhIHN0cmluZ1xuLy8gLSBkaXIgLSB0cnVlIGZvciBpbmRleE9mLCBmYWxzZSBmb3IgbGFzdEluZGV4T2ZcbmZ1bmN0aW9uIGJpZGlyZWN0aW9uYWxJbmRleE9mIChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcikge1xuICAvLyBFbXB0eSBidWZmZXIgbWVhbnMgbm8gbWF0Y2hcbiAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDApIHJldHVybiAtMVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0XG4gIGlmICh0eXBlb2YgYnl0ZU9mZnNldCA9PT0gJ3N0cmluZycpIHtcbiAgICBlbmNvZGluZyA9IGJ5dGVPZmZzZXRcbiAgICBieXRlT2Zmc2V0ID0gMFxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPiAweDdmZmZmZmZmKSB7XG4gICAgYnl0ZU9mZnNldCA9IDB4N2ZmZmZmZmZcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgLTB4ODAwMDAwMDApIHtcbiAgICBieXRlT2Zmc2V0ID0gLTB4ODAwMDAwMDBcbiAgfVxuICBieXRlT2Zmc2V0ID0gK2J5dGVPZmZzZXQgLy8gQ29lcmNlIHRvIE51bWJlci5cbiAgaWYgKG51bWJlcklzTmFOKGJ5dGVPZmZzZXQpKSB7XG4gICAgLy8gYnl0ZU9mZnNldDogaXQgaXQncyB1bmRlZmluZWQsIG51bGwsIE5hTiwgXCJmb29cIiwgZXRjLCBzZWFyY2ggd2hvbGUgYnVmZmVyXG4gICAgYnl0ZU9mZnNldCA9IGRpciA/IDAgOiAoYnVmZmVyLmxlbmd0aCAtIDEpXG4gIH1cblxuICAvLyBOb3JtYWxpemUgYnl0ZU9mZnNldDogbmVnYXRpdmUgb2Zmc2V0cyBzdGFydCBmcm9tIHRoZSBlbmQgb2YgdGhlIGJ1ZmZlclxuICBpZiAoYnl0ZU9mZnNldCA8IDApIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoICsgYnl0ZU9mZnNldFxuICBpZiAoYnl0ZU9mZnNldCA+PSBidWZmZXIubGVuZ3RoKSB7XG4gICAgaWYgKGRpcikgcmV0dXJuIC0xXG4gICAgZWxzZSBieXRlT2Zmc2V0ID0gYnVmZmVyLmxlbmd0aCAtIDFcbiAgfSBlbHNlIGlmIChieXRlT2Zmc2V0IDwgMCkge1xuICAgIGlmIChkaXIpIGJ5dGVPZmZzZXQgPSAwXG4gICAgZWxzZSByZXR1cm4gLTFcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSB2YWxcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsID0gQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgfVxuXG4gIC8vIEZpbmFsbHksIHNlYXJjaCBlaXRoZXIgaW5kZXhPZiAoaWYgZGlyIGlzIHRydWUpIG9yIGxhc3RJbmRleE9mXG4gIGlmIChCdWZmZXIuaXNCdWZmZXIodmFsKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZTogbG9va2luZyBmb3IgZW1wdHkgc3RyaW5nL2J1ZmZlciBhbHdheXMgZmFpbHNcbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIC0xXG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAweEZGIC8vIFNlYXJjaCBmb3IgYSBieXRlIHZhbHVlIFswLTI1NV1cbiAgICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGlmIChkaXIpIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmluZGV4T2YuY2FsbChidWZmZXIsIHZhbCwgYnl0ZU9mZnNldClcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBVaW50OEFycmF5LnByb3RvdHlwZS5sYXN0SW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXJyYXlJbmRleE9mKGJ1ZmZlciwgW3ZhbF0sIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpXG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKCd2YWwgbXVzdCBiZSBzdHJpbmcsIG51bWJlciBvciBCdWZmZXInKVxufVxuXG5mdW5jdGlvbiBhcnJheUluZGV4T2YgKGFyciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIGxldCBpbmRleFNpemUgPSAxXG4gIGxldCBhcnJMZW5ndGggPSBhcnIubGVuZ3RoXG4gIGxldCB2YWxMZW5ndGggPSB2YWwubGVuZ3RoXG5cbiAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKVxuICAgIGlmIChlbmNvZGluZyA9PT0gJ3VjczInIHx8IGVuY29kaW5nID09PSAndWNzLTInIHx8XG4gICAgICAgIGVuY29kaW5nID09PSAndXRmMTZsZScgfHwgZW5jb2RpbmcgPT09ICd1dGYtMTZsZScpIHtcbiAgICAgIGlmIChhcnIubGVuZ3RoIDwgMiB8fCB2YWwubGVuZ3RoIDwgMikge1xuICAgICAgICByZXR1cm4gLTFcbiAgICAgIH1cbiAgICAgIGluZGV4U2l6ZSA9IDJcbiAgICAgIGFyckxlbmd0aCAvPSAyXG4gICAgICB2YWxMZW5ndGggLz0gMlxuICAgICAgYnl0ZU9mZnNldCAvPSAyXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZCAoYnVmLCBpKSB7XG4gICAgaWYgKGluZGV4U2l6ZSA9PT0gMSkge1xuICAgICAgcmV0dXJuIGJ1ZltpXVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYnVmLnJlYWRVSW50MTZCRShpICogaW5kZXhTaXplKVxuICAgIH1cbiAgfVxuXG4gIGxldCBpXG4gIGlmIChkaXIpIHtcbiAgICBsZXQgZm91bmRJbmRleCA9IC0xXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA8IGFyckxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAocmVhZChhcnIsIGkpID09PSByZWFkKHZhbCwgZm91bmRJbmRleCA9PT0gLTEgPyAwIDogaSAtIGZvdW5kSW5kZXgpKSB7XG4gICAgICAgIGlmIChmb3VuZEluZGV4ID09PSAtMSkgZm91bmRJbmRleCA9IGlcbiAgICAgICAgaWYgKGkgLSBmb3VuZEluZGV4ICsgMSA9PT0gdmFsTGVuZ3RoKSByZXR1cm4gZm91bmRJbmRleCAqIGluZGV4U2l6ZVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggIT09IC0xKSBpIC09IGkgLSBmb3VuZEluZGV4XG4gICAgICAgIGZvdW5kSW5kZXggPSAtMVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoYnl0ZU9mZnNldCArIHZhbExlbmd0aCA+IGFyckxlbmd0aCkgYnl0ZU9mZnNldCA9IGFyckxlbmd0aCAtIHZhbExlbmd0aFxuICAgIGZvciAoaSA9IGJ5dGVPZmZzZXQ7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBsZXQgZm91bmQgPSB0cnVlXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHZhbExlbmd0aDsgaisrKSB7XG4gICAgICAgIGlmIChyZWFkKGFyciwgaSArIGopICE9PSByZWFkKHZhbCwgaikpIHtcbiAgICAgICAgICBmb3VuZCA9IGZhbHNlXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKGZvdW5kKSByZXR1cm4gaVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIHRoaXMuaW5kZXhPZih2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSAhPT0gLTFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gaW5kZXhPZiAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gYmlkaXJlY3Rpb25hbEluZGV4T2YodGhpcywgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgdHJ1ZSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5sYXN0SW5kZXhPZiA9IGZ1bmN0aW9uIGxhc3RJbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBmYWxzZSlcbn1cblxuZnVuY3Rpb24gaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIGNvbnN0IHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBsZXQgaVxuICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyArK2kpIHtcbiAgICBjb25zdCBwYXJzZWQgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgaWYgKG51bWJlcklzTmFOKHBhcnNlZCkpIHJldHVybiBpXG4gICAgYnVmW29mZnNldCArIGldID0gcGFyc2VkXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBiYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gdWNzMldyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nLCBidWYubGVuZ3RoIC0gb2Zmc2V0KSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIHdyaXRlIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nKVxuICBpZiAob2Zmc2V0ID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmNvZGluZyA9ICd1dGY4J1xuICAgIGxlbmd0aCA9IHRoaXMubGVuZ3RoXG4gICAgb2Zmc2V0ID0gMFxuICAvLyBCdWZmZXIjd3JpdGUoc3RyaW5nLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCAmJiB0eXBlb2Ygb2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIG9mZnNldFssIGxlbmd0aF1bLCBlbmNvZGluZ10pXG4gIH0gZWxzZSBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICAgIGlmIChpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBsZW5ndGggPSBsZW5ndGggPj4+IDBcbiAgICAgIGlmIChlbmNvZGluZyA9PT0gdW5kZWZpbmVkKSBlbmNvZGluZyA9ICd1dGY4J1xuICAgIH0gZWxzZSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICdCdWZmZXIud3JpdGUoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0WywgbGVuZ3RoXSkgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCdcbiAgICApXG4gIH1cblxuICBjb25zdCByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQgfHwgbGVuZ3RoID4gcmVtYWluaW5nKSBsZW5ndGggPSByZW1haW5pbmdcblxuICBpZiAoKHN0cmluZy5sZW5ndGggPiAwICYmIChsZW5ndGggPCAwIHx8IG9mZnNldCA8IDApKSB8fCBvZmZzZXQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdBdHRlbXB0IHRvIHdyaXRlIG91dHNpZGUgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIGxldCBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdoZXgnOlxuICAgICAgICByZXR1cm4gaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBhc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIC8vIFdhcm5pbmc6IG1heExlbmd0aCBub3QgdGFrZW4gaW50byBhY2NvdW50IGluIGJhc2U2NFdyaXRlXG4gICAgICAgIHJldHVybiBiYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1Y3MyJzpcbiAgICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgICByZXR1cm4gdWNzMldyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChsb3dlcmVkQ2FzZSkgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgICAgICBlbmNvZGluZyA9ICgnJyArIGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgICAgIGxvd2VyZWRDYXNlID0gdHJ1ZVxuICAgIH1cbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uIHRvSlNPTiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuZnVuY3Rpb24gYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIHV0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcbiAgY29uc3QgcmVzID0gW11cblxuICBsZXQgaSA9IHN0YXJ0XG4gIHdoaWxlIChpIDwgZW5kKSB7XG4gICAgY29uc3QgZmlyc3RCeXRlID0gYnVmW2ldXG4gICAgbGV0IGNvZGVQb2ludCA9IG51bGxcbiAgICBsZXQgYnl0ZXNQZXJTZXF1ZW5jZSA9IChmaXJzdEJ5dGUgPiAweEVGKVxuICAgICAgPyA0XG4gICAgICA6IChmaXJzdEJ5dGUgPiAweERGKVxuICAgICAgICAgID8gM1xuICAgICAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4QkYpXG4gICAgICAgICAgICAgID8gMlxuICAgICAgICAgICAgICA6IDFcblxuICAgIGlmIChpICsgYnl0ZXNQZXJTZXF1ZW5jZSA8PSBlbmQpIHtcbiAgICAgIGxldCBzZWNvbmRCeXRlLCB0aGlyZEJ5dGUsIGZvdXJ0aEJ5dGUsIHRlbXBDb2RlUG9pbnRcblxuICAgICAgc3dpdGNoIChieXRlc1BlclNlcXVlbmNlKSB7XG4gICAgICAgIGNhc2UgMTpcbiAgICAgICAgICBpZiAoZmlyc3RCeXRlIDwgMHg4MCkge1xuICAgICAgICAgICAgY29kZVBvaW50ID0gZmlyc3RCeXRlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMjpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4MUYpIDw8IDB4NiB8IChzZWNvbmRCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHg3Rikge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgMzpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBpZiAoKHNlY29uZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAodGhpcmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweEMgfCAoc2Vjb25kQnl0ZSAmIDB4M0YpIDw8IDB4NiB8ICh0aGlyZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGRiAmJiAodGVtcENvZGVQb2ludCA8IDB4RDgwMCB8fCB0ZW1wQ29kZVBvaW50ID4gMHhERkZGKSkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgNDpcbiAgICAgICAgICBzZWNvbmRCeXRlID0gYnVmW2kgKyAxXVxuICAgICAgICAgIHRoaXJkQnl0ZSA9IGJ1ZltpICsgMl1cbiAgICAgICAgICBmb3VydGhCeXRlID0gYnVmW2kgKyAzXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCAmJiAoZm91cnRoQnl0ZSAmIDB4QzApID09PSAweDgwKSB7XG4gICAgICAgICAgICB0ZW1wQ29kZVBvaW50ID0gKGZpcnN0Qnl0ZSAmIDB4RikgPDwgMHgxMiB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHhDIHwgKHRoaXJkQnl0ZSAmIDB4M0YpIDw8IDB4NiB8IChmb3VydGhCeXRlICYgMHgzRilcbiAgICAgICAgICAgIGlmICh0ZW1wQ29kZVBvaW50ID4gMHhGRkZGICYmIHRlbXBDb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgICAgICAgICBjb2RlUG9pbnQgPSB0ZW1wQ29kZVBvaW50XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChjb2RlUG9pbnQgPT09IG51bGwpIHtcbiAgICAgIC8vIHdlIGRpZCBub3QgZ2VuZXJhdGUgYSB2YWxpZCBjb2RlUG9pbnQgc28gaW5zZXJ0IGFcbiAgICAgIC8vIHJlcGxhY2VtZW50IGNoYXIgKFUrRkZGRCkgYW5kIGFkdmFuY2Ugb25seSAxIGJ5dGVcbiAgICAgIGNvZGVQb2ludCA9IDB4RkZGRFxuICAgICAgYnl0ZXNQZXJTZXF1ZW5jZSA9IDFcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA+IDB4RkZGRikge1xuICAgICAgLy8gZW5jb2RlIHRvIHV0ZjE2IChzdXJyb2dhdGUgcGFpciBkYW5jZSlcbiAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICByZXMucHVzaChjb2RlUG9pbnQgPj4+IDEwICYgMHgzRkYgfCAweEQ4MDApXG4gICAgICBjb2RlUG9pbnQgPSAweERDMDAgfCBjb2RlUG9pbnQgJiAweDNGRlxuICAgIH1cblxuICAgIHJlcy5wdXNoKGNvZGVQb2ludClcbiAgICBpICs9IGJ5dGVzUGVyU2VxdWVuY2VcbiAgfVxuXG4gIHJldHVybiBkZWNvZGVDb2RlUG9pbnRzQXJyYXkocmVzKVxufVxuXG4vLyBCYXNlZCBvbiBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMjc0NzI3Mi82ODA3NDIsIHRoZSBicm93c2VyIHdpdGhcbi8vIHRoZSBsb3dlc3QgbGltaXQgaXMgQ2hyb21lLCB3aXRoIDB4MTAwMDAgYXJncy5cbi8vIFdlIGdvIDEgbWFnbml0dWRlIGxlc3MsIGZvciBzYWZldHlcbmNvbnN0IE1BWF9BUkdVTUVOVFNfTEVOR1RIID0gMHgxMDAwXG5cbmZ1bmN0aW9uIGRlY29kZUNvZGVQb2ludHNBcnJheSAoY29kZVBvaW50cykge1xuICBjb25zdCBsZW4gPSBjb2RlUG9pbnRzLmxlbmd0aFxuICBpZiAobGVuIDw9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoU3RyaW5nLCBjb2RlUG9pbnRzKSAvLyBhdm9pZCBleHRyYSBzbGljZSgpXG4gIH1cblxuICAvLyBEZWNvZGUgaW4gY2h1bmtzIHRvIGF2b2lkIFwiY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkXCIuXG4gIGxldCByZXMgPSAnJ1xuICBsZXQgaSA9IDBcbiAgd2hpbGUgKGkgPCBsZW4pIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcbiAgICAgIFN0cmluZyxcbiAgICAgIGNvZGVQb2ludHMuc2xpY2UoaSwgaSArPSBNQVhfQVJHVU1FTlRTX0xFTkdUSClcbiAgICApXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5mdW5jdGlvbiBhc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgbGV0IHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSAmIDB4N0YpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBsYXRpbjFTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGxldCByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBoZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGNvbnN0IGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICBsZXQgb3V0ID0gJydcbiAgZm9yIChsZXQgaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICBvdXQgKz0gaGV4U2xpY2VMb29rdXBUYWJsZVtidWZbaV1dXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiB1dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBjb25zdCBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICBsZXQgcmVzID0gJydcbiAgLy8gSWYgYnl0ZXMubGVuZ3RoIGlzIG9kZCwgdGhlIGxhc3QgOCBiaXRzIG11c3QgYmUgaWdub3JlZCAoc2FtZSBhcyBub2RlLmpzKVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aCAtIDE7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgKGJ5dGVzW2kgKyAxXSAqIDI1NikpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gc2xpY2UgKHN0YXJ0LCBlbmQpIHtcbiAgY29uc3QgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSB+fnN0YXJ0XG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuIDogfn5lbmRcblxuICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgc3RhcnQgKz0gbGVuXG4gICAgaWYgKHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIH0gZWxzZSBpZiAoc3RhcnQgPiBsZW4pIHtcbiAgICBzdGFydCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IDApIHtcbiAgICBlbmQgKz0gbGVuXG4gICAgaWYgKGVuZCA8IDApIGVuZCA9IDBcbiAgfSBlbHNlIGlmIChlbmQgPiBsZW4pIHtcbiAgICBlbmQgPSBsZW5cbiAgfVxuXG4gIGlmIChlbmQgPCBzdGFydCkgZW5kID0gc3RhcnRcblxuICBjb25zdCBuZXdCdWYgPSB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihuZXdCdWYsIEJ1ZmZlci5wcm90b3R5cGUpXG5cbiAgcmV0dXJuIG5ld0J1ZlxufVxuXG4vKlxuICogTmVlZCB0byBtYWtlIHN1cmUgdGhhdCBidWZmZXIgaXNuJ3QgdHJ5aW5nIHRvIHdyaXRlIG91dCBvZiBib3VuZHMuXG4gKi9cbmZ1bmN0aW9uIGNoZWNrT2Zmc2V0IChvZmZzZXQsIGV4dCwgbGVuZ3RoKSB7XG4gIGlmICgob2Zmc2V0ICUgMSkgIT09IDAgfHwgb2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ29mZnNldCBpcyBub3QgdWludCcpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBsZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdUcnlpbmcgdG8gYWNjZXNzIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludExFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnRMRSA9IGZ1bmN0aW9uIHJlYWRVSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0XVxuICBsZXQgbXVsID0gMVxuICBsZXQgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50QkUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludEJFID0gZnVuY3Rpb24gcmVhZFVJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG4gIH1cblxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWJ5dGVMZW5ndGhdXG4gIGxldCBtdWwgPSAxXG4gIHdoaWxlIChieXRlTGVuZ3RoID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF0gKiBtdWxcbiAgfVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDggPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiByZWFkVUludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDE2TEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiByZWFkVUludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiB0aGlzW29mZnNldF0gfCAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MTZCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgOCkgfCB0aGlzW29mZnNldCArIDFdXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQzMkxFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gcmVhZFVJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAoKHRoaXNbb2Zmc2V0XSkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgMTYpKSArXG4gICAgICAodGhpc1tvZmZzZXQgKyAzXSAqIDB4MTAwMDAwMClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDMyQkUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiByZWFkVUludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gKiAweDEwMDAwMDApICtcbiAgICAoKHRoaXNbb2Zmc2V0ICsgMV0gPDwgMTYpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCA4KSB8XG4gICAgdGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnVUludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gcmVhZEJpZ1VJbnQ2NExFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgbG8gPSBmaXJzdCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDI0XG5cbiAgY29uc3QgaGkgPSB0aGlzWysrb2Zmc2V0XSArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgbGFzdCAqIDIgKiogMjRcblxuICByZXR1cm4gQmlnSW50KGxvKSArIChCaWdJbnQoaGkpIDw8IEJpZ0ludCgzMikpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdVSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnVUludDY0QkUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCBoaSA9IGZpcnN0ICogMiAqKiAyNCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF1cblxuICBjb25zdCBsbyA9IHRoaXNbKytvZmZzZXRdICogMiAqKiAyNCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgbGFzdFxuXG4gIHJldHVybiAoQmlnSW50KGhpKSA8PCBCaWdJbnQoMzIpKSArIEJpZ0ludChsbylcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludExFID0gZnVuY3Rpb24gcmVhZEludExFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldF1cbiAgbGV0IG11bCA9IDFcbiAgbGV0IGkgPSAwXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgaV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnRCRSA9IGZ1bmN0aW9uIHJlYWRJbnRCRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICBsZXQgaSA9IGJ5dGVMZW5ndGhcbiAgbGV0IG11bCA9IDFcbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgLS1pXVxuICB3aGlsZSAoaSA+IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyAtLWldICogbXVsXG4gIH1cbiAgbXVsICo9IDB4ODBcblxuICBpZiAodmFsID49IG11bCkgdmFsIC09IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKVxuXG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIHJlYWRJbnQ4IChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDEsIHRoaXMubGVuZ3RoKVxuICBpZiAoISh0aGlzW29mZnNldF0gJiAweDgwKSkgcmV0dXJuICh0aGlzW29mZnNldF0pXG4gIHJldHVybiAoKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gcmVhZEludDE2TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIGNvbnN0IHZhbCA9IHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIHJlYWRJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICBjb25zdCB2YWwgPSB0aGlzW29mZnNldCArIDFdIHwgKHRoaXNbb2Zmc2V0XSA8PCA4KVxuICByZXR1cm4gKHZhbCAmIDB4ODAwMCkgPyB2YWwgfCAweEZGRkYwMDAwIDogdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiByZWFkSW50MzJMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDNdIDw8IDI0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gcmVhZEludDMyQkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICh0aGlzW29mZnNldF0gPDwgMjQpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICAodGhpc1tvZmZzZXQgKyAzXSlcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnSW50NjRMRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgNF0gK1xuICAgIHRoaXNbb2Zmc2V0ICsgNV0gKiAyICoqIDggK1xuICAgIHRoaXNbb2Zmc2V0ICsgNl0gKiAyICoqIDE2ICtcbiAgICAobGFzdCA8PCAyNCkgLy8gT3ZlcmZsb3dcblxuICByZXR1cm4gKEJpZ0ludCh2YWwpIDw8IEJpZ0ludCgzMikpICtcbiAgICBCaWdJbnQoZmlyc3QgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAyNClcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ0ludDY0QkUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gcmVhZEJpZ0ludDY0QkUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCB2YWwgPSAoZmlyc3QgPDwgMjQpICsgLy8gT3ZlcmZsb3dcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XVxuXG4gIHJldHVybiAoQmlnSW50KHZhbCkgPDwgQmlnSW50KDMyKSkgK1xuICAgIEJpZ0ludCh0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjQgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIGxhc3QpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gcmVhZEZsb2F0TEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCB0cnVlLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIHJlYWRGbG9hdEJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIHJlYWREb3VibGVCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA4LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIGZhbHNlLCA1MiwgOClcbn1cblxuZnVuY3Rpb24gY2hlY2tJbnQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgZXh0LCBtYXgsIG1pbikge1xuICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcihidWYpKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdcImJ1ZmZlclwiIGFyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXIgaW5zdGFuY2UnKVxuICBpZiAodmFsdWUgPiBtYXggfHwgdmFsdWUgPCBtaW4pIHRocm93IG5ldyBSYW5nZUVycm9yKCdcInZhbHVlXCIgYXJndW1lbnQgaXMgb3V0IG9mIGJvdW5kcycpXG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnRMRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludExFID0gZnVuY3Rpb24gd3JpdGVVSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY29uc3QgbWF4Qnl0ZXMgPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aCkgLSAxXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbWF4Qnl0ZXMsIDApXG4gIH1cblxuICBsZXQgbXVsID0gMVxuICBsZXQgaSA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICh2YWx1ZSAvIG11bCkgJiAweEZGXG4gIH1cblxuICByZXR1cm4gb2Zmc2V0ICsgYnl0ZUxlbmd0aFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludEJFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIGxldCBpID0gYnl0ZUxlbmd0aCAtIDFcbiAgbGV0IG11bCA9IDFcbiAgdGhpc1tvZmZzZXQgKyBpXSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoLS1pID49IDAgJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50OCA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiB3cml0ZVVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHhmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDFcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQxNkxFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MTZCRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZVVJbnQxNkJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHhmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDMyTEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQzMkJFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweGZmZmZmZmZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgPj4+IDI0KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiAxNilcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyA0XG59XG5cbmZ1bmN0aW9uIHdydEJpZ1VJbnQ2NExFIChidWYsIHZhbHVlLCBvZmZzZXQsIG1pbiwgbWF4KSB7XG4gIGNoZWNrSW50QkkodmFsdWUsIG1pbiwgbWF4LCBidWYsIG9mZnNldCwgNylcblxuICBsZXQgbG8gPSBOdW1iZXIodmFsdWUgJiBCaWdJbnQoMHhmZmZmZmZmZikpXG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsZXQgaGkgPSBOdW1iZXIodmFsdWUgPj4gQmlnSW50KDMyKSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIHJldHVybiBvZmZzZXRcbn1cblxuZnVuY3Rpb24gd3J0QmlnVUludDY0QkUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbWluLCBtYXgpIHtcbiAgY2hlY2tJbnRCSSh2YWx1ZSwgbWluLCBtYXgsIGJ1Ziwgb2Zmc2V0LCA3KVxuXG4gIGxldCBsbyA9IE51bWJlcih2YWx1ZSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCArIDddID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQgKyA2XSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0ICsgNV0gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCArIDRdID0gbG9cbiAgbGV0IGhpID0gTnVtYmVyKHZhbHVlID4+IEJpZ0ludCgzMikgJiBCaWdJbnQoMHhmZmZmZmZmZikpXG4gIGJ1ZltvZmZzZXQgKyAzXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0ICsgMl0gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCArIDFdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXRdID0gaGlcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUJpZ1VJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnVUludDY0TEUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRMRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBCaWdJbnQoMCksIEJpZ0ludCgnMHhmZmZmZmZmZmZmZmZmZmZmJykpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnVUludDY0QkUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdVSW50NjRCRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NEJFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIEJpZ0ludCgwKSwgQmlnSW50KCcweGZmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRMRSA9IGZ1bmN0aW9uIHdyaXRlSW50TEUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY29uc3QgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgbGV0IGkgPSAwXG4gIGxldCBtdWwgPSAxXG4gIGxldCBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlICYgMHhGRlxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSAtIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlSW50QkUgKHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY29uc3QgbGltaXQgPSBNYXRoLnBvdygyLCAoOCAqIGJ5dGVMZW5ndGgpIC0gMSlcblxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIGxpbWl0IC0gMSwgLWxpbWl0KVxuICB9XG5cbiAgbGV0IGkgPSBieXRlTGVuZ3RoIC0gMVxuICBsZXQgbXVsID0gMVxuICBsZXQgc3ViID0gMFxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIGlmICh2YWx1ZSA8IDAgJiYgc3ViID09PSAwICYmIHRoaXNbb2Zmc2V0ICsgaSArIDFdICE9PSAwKSB7XG4gICAgICBzdWIgPSAxXG4gICAgfVxuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAoKHZhbHVlIC8gbXVsKSA+PiAwKSAtIHN1YiAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gd3JpdGVJbnQ4ICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMSwgMHg3ZiwgLTB4ODApXG4gIGlmICh2YWx1ZSA8IDApIHZhbHVlID0gMHhmZiArIHZhbHVlICsgMVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiB3cml0ZUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweDdmZmYsIC0weDgwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gd3JpdGVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlID4+PiAyNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiB3cml0ZUludDMyQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmZmZmZmZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUJpZ0ludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdJbnQ2NExFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0TEUodGhpcywgdmFsdWUsIG9mZnNldCwgLUJpZ0ludCgnMHg4MDAwMDAwMDAwMDAwMDAwJyksIEJpZ0ludCgnMHg3ZmZmZmZmZmZmZmZmZmZmJykpXG59KVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ0ludDY0QkUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRCRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAtQmlnSW50KCcweDgwMDAwMDAwMDAwMDAwMDAnKSwgQmlnSW50KCcweDdmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbmZ1bmN0aW9uIGNoZWNrSUVFRTc1NCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmIChvZmZzZXQgKyBleHQgPiBidWYubGVuZ3RoKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignSW5kZXggb3V0IG9mIHJhbmdlJylcbiAgaWYgKG9mZnNldCA8IDApIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5mdW5jdGlvbiB3cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA0LCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiB3cml0ZUZsb2F0TEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiB3cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tJRUVFNzU0KGJ1ZiwgdmFsdWUsIG9mZnNldCwgOCwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbiAgcmV0dXJuIG9mZnNldCArIDhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gd3JpdGVEb3VibGVMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiBjb3B5ICh0YXJnZXQsIHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKHRhcmdldCkpIHRocm93IG5ldyBUeXBlRXJyb3IoJ2FyZ3VtZW50IHNob3VsZCBiZSBhIEJ1ZmZlcicpXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXRTdGFydCA+PSB0YXJnZXQubGVuZ3RoKSB0YXJnZXRTdGFydCA9IHRhcmdldC5sZW5ndGhcbiAgaWYgKCF0YXJnZXRTdGFydCkgdGFyZ2V0U3RhcnQgPSAwXG4gIGlmIChlbmQgPiAwICYmIGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuIDBcbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgdGhpcy5sZW5ndGggPT09IDApIHJldHVybiAwXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBpZiAodGFyZ2V0U3RhcnQgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICB9XG4gIGlmIChzdGFydCA8IDAgfHwgc3RhcnQgPj0gdGhpcy5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAoZW5kIDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0U3RhcnQgPCBlbmQgLSBzdGFydCkge1xuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCArIHN0YXJ0XG4gIH1cblxuICBjb25zdCBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQgJiYgdHlwZW9mIFVpbnQ4QXJyYXkucHJvdG90eXBlLmNvcHlXaXRoaW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBVc2UgYnVpbHQtaW4gd2hlbiBhdmFpbGFibGUsIG1pc3NpbmcgZnJvbSBJRTExXG4gICAgdGhpcy5jb3B5V2l0aGluKHRhcmdldFN0YXJ0LCBzdGFydCwgZW5kKVxuICB9IGVsc2Uge1xuICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgdGFyZ2V0LFxuICAgICAgdGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSxcbiAgICAgIHRhcmdldFN0YXJ0XG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIGxlblxufVxuXG4vLyBVc2FnZTpcbi8vICAgIGJ1ZmZlci5maWxsKG51bWJlclssIG9mZnNldFssIGVuZF1dKVxuLy8gICAgYnVmZmVyLmZpbGwoYnVmZmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChzdHJpbmdbLCBvZmZzZXRbLCBlbmRdXVssIGVuY29kaW5nXSlcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uIGZpbGwgKHZhbCwgc3RhcnQsIGVuZCwgZW5jb2RpbmcpIHtcbiAgLy8gSGFuZGxlIHN0cmluZyBjYXNlczpcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKHR5cGVvZiBzdGFydCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gc3RhcnRcbiAgICAgIHN0YXJ0ID0gMFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBlbmQgPT09ICdzdHJpbmcnKSB7XG4gICAgICBlbmNvZGluZyA9IGVuZFxuICAgICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgICB9XG4gICAgaWYgKGVuY29kaW5nICE9PSB1bmRlZmluZWQgJiYgdHlwZW9mIGVuY29kaW5nICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZW5jb2RpbmcgbXVzdCBiZSBhIHN0cmluZycpXG4gICAgfVxuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnICYmICFCdWZmZXIuaXNFbmNvZGluZyhlbmNvZGluZykpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICB9XG4gICAgaWYgKHZhbC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGNvbnN0IGNvZGUgPSB2YWwuY2hhckNvZGVBdCgwKVxuICAgICAgaWYgKChlbmNvZGluZyA9PT0gJ3V0ZjgnICYmIGNvZGUgPCAxMjgpIHx8XG4gICAgICAgICAgZW5jb2RpbmcgPT09ICdsYXRpbjEnKSB7XG4gICAgICAgIC8vIEZhc3QgcGF0aDogSWYgYHZhbGAgZml0cyBpbnRvIGEgc2luZ2xlIGJ5dGUsIHVzZSB0aGF0IG51bWVyaWMgdmFsdWUuXG4gICAgICAgIHZhbCA9IGNvZGVcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICB2YWwgPSB2YWwgJiAyNTVcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnYm9vbGVhbicpIHtcbiAgICB2YWwgPSBOdW1iZXIodmFsKVxuICB9XG5cbiAgLy8gSW52YWxpZCByYW5nZXMgYXJlIG5vdCBzZXQgdG8gYSBkZWZhdWx0LCBzbyBjYW4gcmFuZ2UgY2hlY2sgZWFybHkuXG4gIGlmIChzdGFydCA8IDAgfHwgdGhpcy5sZW5ndGggPCBzdGFydCB8fCB0aGlzLmxlbmd0aCA8IGVuZCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdPdXQgb2YgcmFuZ2UgaW5kZXgnKVxuICB9XG5cbiAgaWYgKGVuZCA8PSBzdGFydCkge1xuICAgIHJldHVybiB0aGlzXG4gIH1cblxuICBzdGFydCA9IHN0YXJ0ID4+PiAwXG4gIGVuZCA9IGVuZCA9PT0gdW5kZWZpbmVkID8gdGhpcy5sZW5ndGggOiBlbmQgPj4+IDBcblxuICBpZiAoIXZhbCkgdmFsID0gMFxuXG4gIGxldCBpXG4gIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IHN0YXJ0OyBpIDwgZW5kOyArK2kpIHtcbiAgICAgIHRoaXNbaV0gPSB2YWxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgYnl0ZXMgPSBCdWZmZXIuaXNCdWZmZXIodmFsKVxuICAgICAgPyB2YWxcbiAgICAgIDogQnVmZmVyLmZyb20odmFsLCBlbmNvZGluZylcbiAgICBjb25zdCBsZW4gPSBieXRlcy5sZW5ndGhcbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgdmFsdWUgXCInICsgdmFsICtcbiAgICAgICAgJ1wiIGlzIGludmFsaWQgZm9yIGFyZ3VtZW50IFwidmFsdWVcIicpXG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBlbmQgLSBzdGFydDsgKytpKSB7XG4gICAgICB0aGlzW2kgKyBzdGFydF0gPSBieXRlc1tpICUgbGVuXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzXG59XG5cbi8vIENVU1RPTSBFUlJPUlNcbi8vID09PT09PT09PT09PT1cblxuLy8gU2ltcGxpZmllZCB2ZXJzaW9ucyBmcm9tIE5vZGUsIGNoYW5nZWQgZm9yIEJ1ZmZlci1vbmx5IHVzYWdlXG5jb25zdCBlcnJvcnMgPSB7fVxuZnVuY3Rpb24gRSAoc3ltLCBnZXRNZXNzYWdlLCBCYXNlKSB7XG4gIGVycm9yc1tzeW1dID0gY2xhc3MgTm9kZUVycm9yIGV4dGVuZHMgQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKCkge1xuICAgICAgc3VwZXIoKVxuXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ21lc3NhZ2UnLCB7XG4gICAgICAgIHZhbHVlOiBnZXRNZXNzYWdlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyksXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgIH0pXG5cbiAgICAgIC8vIEFkZCB0aGUgZXJyb3IgY29kZSB0byB0aGUgbmFtZSB0byBpbmNsdWRlIGl0IGluIHRoZSBzdGFjayB0cmFjZS5cbiAgICAgIHRoaXMubmFtZSA9IGAke3RoaXMubmFtZX0gWyR7c3ltfV1gXG4gICAgICAvLyBBY2Nlc3MgdGhlIHN0YWNrIHRvIGdlbmVyYXRlIHRoZSBlcnJvciBtZXNzYWdlIGluY2x1ZGluZyB0aGUgZXJyb3IgY29kZVxuICAgICAgLy8gZnJvbSB0aGUgbmFtZS5cbiAgICAgIHRoaXMuc3RhY2sgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtZXhwcmVzc2lvbnNcbiAgICAgIC8vIFJlc2V0IHRoZSBuYW1lIHRvIHRoZSBhY3R1YWwgbmFtZS5cbiAgICAgIGRlbGV0ZSB0aGlzLm5hbWVcbiAgICB9XG5cbiAgICBnZXQgY29kZSAoKSB7XG4gICAgICByZXR1cm4gc3ltXG4gICAgfVxuXG4gICAgc2V0IGNvZGUgKHZhbHVlKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ2NvZGUnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlXG4gICAgICB9KVxuICAgIH1cblxuICAgIHRvU3RyaW5nICgpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLm5hbWV9IFske3N5bX1dOiAke3RoaXMubWVzc2FnZX1gXG4gICAgfVxuICB9XG59XG5cbkUoJ0VSUl9CVUZGRVJfT1VUX09GX0JPVU5EUycsXG4gIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiBgJHtuYW1lfSBpcyBvdXRzaWRlIG9mIGJ1ZmZlciBib3VuZHNgXG4gICAgfVxuXG4gICAgcmV0dXJuICdBdHRlbXB0IHRvIGFjY2VzcyBtZW1vcnkgb3V0c2lkZSBidWZmZXIgYm91bmRzJ1xuICB9LCBSYW5nZUVycm9yKVxuRSgnRVJSX0lOVkFMSURfQVJHX1RZUEUnLFxuICBmdW5jdGlvbiAobmFtZSwgYWN0dWFsKSB7XG4gICAgcmV0dXJuIGBUaGUgXCIke25hbWV9XCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIG51bWJlci4gUmVjZWl2ZWQgdHlwZSAke3R5cGVvZiBhY3R1YWx9YFxuICB9LCBUeXBlRXJyb3IpXG5FKCdFUlJfT1VUX09GX1JBTkdFJyxcbiAgZnVuY3Rpb24gKHN0ciwgcmFuZ2UsIGlucHV0KSB7XG4gICAgbGV0IG1zZyA9IGBUaGUgdmFsdWUgb2YgXCIke3N0cn1cIiBpcyBvdXQgb2YgcmFuZ2UuYFxuICAgIGxldCByZWNlaXZlZCA9IGlucHV0XG4gICAgaWYgKE51bWJlci5pc0ludGVnZXIoaW5wdXQpICYmIE1hdGguYWJzKGlucHV0KSA+IDIgKiogMzIpIHtcbiAgICAgIHJlY2VpdmVkID0gYWRkTnVtZXJpY2FsU2VwYXJhdG9yKFN0cmluZyhpbnB1dCkpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaW5wdXQgPT09ICdiaWdpbnQnKSB7XG4gICAgICByZWNlaXZlZCA9IFN0cmluZyhpbnB1dClcbiAgICAgIGlmIChpbnB1dCA+IEJpZ0ludCgyKSAqKiBCaWdJbnQoMzIpIHx8IGlucHV0IDwgLShCaWdJbnQoMikgKiogQmlnSW50KDMyKSkpIHtcbiAgICAgICAgcmVjZWl2ZWQgPSBhZGROdW1lcmljYWxTZXBhcmF0b3IocmVjZWl2ZWQpXG4gICAgICB9XG4gICAgICByZWNlaXZlZCArPSAnbidcbiAgICB9XG4gICAgbXNnICs9IGAgSXQgbXVzdCBiZSAke3JhbmdlfS4gUmVjZWl2ZWQgJHtyZWNlaXZlZH1gXG4gICAgcmV0dXJuIG1zZ1xuICB9LCBSYW5nZUVycm9yKVxuXG5mdW5jdGlvbiBhZGROdW1lcmljYWxTZXBhcmF0b3IgKHZhbCkge1xuICBsZXQgcmVzID0gJydcbiAgbGV0IGkgPSB2YWwubGVuZ3RoXG4gIGNvbnN0IHN0YXJ0ID0gdmFsWzBdID09PSAnLScgPyAxIDogMFxuICBmb3IgKDsgaSA+PSBzdGFydCArIDQ7IGkgLT0gMykge1xuICAgIHJlcyA9IGBfJHt2YWwuc2xpY2UoaSAtIDMsIGkpfSR7cmVzfWBcbiAgfVxuICByZXR1cm4gYCR7dmFsLnNsaWNlKDAsIGkpfSR7cmVzfWBcbn1cblxuLy8gQ0hFQ0sgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gY2hlY2tCb3VuZHMgKGJ1Ziwgb2Zmc2V0LCBieXRlTGVuZ3RoKSB7XG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGlmIChidWZbb2Zmc2V0XSA9PT0gdW5kZWZpbmVkIHx8IGJ1ZltvZmZzZXQgKyBieXRlTGVuZ3RoXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCBidWYubGVuZ3RoIC0gKGJ5dGVMZW5ndGggKyAxKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBjaGVja0ludEJJICh2YWx1ZSwgbWluLCBtYXgsIGJ1Ziwgb2Zmc2V0LCBieXRlTGVuZ3RoKSB7XG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikge1xuICAgIGNvbnN0IG4gPSB0eXBlb2YgbWluID09PSAnYmlnaW50JyA/ICduJyA6ICcnXG4gICAgbGV0IHJhbmdlXG4gICAgaWYgKGJ5dGVMZW5ndGggPiAzKSB7XG4gICAgICBpZiAobWluID09PSAwIHx8IG1pbiA9PT0gQmlnSW50KDApKSB7XG4gICAgICAgIHJhbmdlID0gYD49IDAke259IGFuZCA8IDIke259ICoqICR7KGJ5dGVMZW5ndGggKyAxKSAqIDh9JHtufWBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJhbmdlID0gYD49IC0oMiR7bn0gKiogJHsoYnl0ZUxlbmd0aCArIDEpICogOCAtIDF9JHtufSkgYW5kIDwgMiAqKiBgICtcbiAgICAgICAgICAgICAgICBgJHsoYnl0ZUxlbmd0aCArIDEpICogOCAtIDF9JHtufWBcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmFuZ2UgPSBgPj0gJHttaW59JHtufSBhbmQgPD0gJHttYXh9JHtufWBcbiAgICB9XG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfT1VUX09GX1JBTkdFKCd2YWx1ZScsIHJhbmdlLCB2YWx1ZSlcbiAgfVxuICBjaGVja0JvdW5kcyhidWYsIG9mZnNldCwgYnl0ZUxlbmd0aClcbn1cblxuZnVuY3Rpb24gdmFsaWRhdGVOdW1iZXIgKHZhbHVlLCBuYW1lKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfSU5WQUxJRF9BUkdfVFlQRShuYW1lLCAnbnVtYmVyJywgdmFsdWUpXG4gIH1cbn1cblxuZnVuY3Rpb24gYm91bmRzRXJyb3IgKHZhbHVlLCBsZW5ndGgsIHR5cGUpIHtcbiAgaWYgKE1hdGguZmxvb3IodmFsdWUpICE9PSB2YWx1ZSkge1xuICAgIHZhbGlkYXRlTnVtYmVyKHZhbHVlLCB0eXBlKVxuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX09VVF9PRl9SQU5HRSh0eXBlIHx8ICdvZmZzZXQnLCAnYW4gaW50ZWdlcicsIHZhbHVlKVxuICB9XG5cbiAgaWYgKGxlbmd0aCA8IDApIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9CVUZGRVJfT1VUX09GX0JPVU5EUygpXG4gIH1cblxuICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9PVVRfT0ZfUkFOR0UodHlwZSB8fCAnb2Zmc2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGA+PSAke3R5cGUgPyAxIDogMH0gYW5kIDw9ICR7bGVuZ3RofWAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSlcbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5jb25zdCBJTlZBTElEX0JBU0U2NF9SRSA9IC9bXisvMC05QS1aYS16LV9dL2dcblxuZnVuY3Rpb24gYmFzZTY0Y2xlYW4gKHN0cikge1xuICAvLyBOb2RlIHRha2VzIGVxdWFsIHNpZ25zIGFzIGVuZCBvZiB0aGUgQmFzZTY0IGVuY29kaW5nXG4gIHN0ciA9IHN0ci5zcGxpdCgnPScpWzBdXG4gIC8vIE5vZGUgc3RyaXBzIG91dCBpbnZhbGlkIGNoYXJhY3RlcnMgbGlrZSBcXG4gYW5kIFxcdCBmcm9tIHRoZSBzdHJpbmcsIGJhc2U2NC1qcyBkb2VzIG5vdFxuICBzdHIgPSBzdHIudHJpbSgpLnJlcGxhY2UoSU5WQUxJRF9CQVNFNjRfUkUsICcnKVxuICAvLyBOb2RlIGNvbnZlcnRzIHN0cmluZ3Mgd2l0aCBsZW5ndGggPCAyIHRvICcnXG4gIGlmIChzdHIubGVuZ3RoIDwgMikgcmV0dXJuICcnXG4gIC8vIE5vZGUgYWxsb3dzIGZvciBub24tcGFkZGVkIGJhc2U2NCBzdHJpbmdzIChtaXNzaW5nIHRyYWlsaW5nID09PSksIGJhc2U2NC1qcyBkb2VzIG5vdFxuICB3aGlsZSAoc3RyLmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICBzdHIgPSBzdHIgKyAnPSdcbiAgfVxuICByZXR1cm4gc3RyXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHJpbmcsIHVuaXRzKSB7XG4gIHVuaXRzID0gdW5pdHMgfHwgSW5maW5pdHlcbiAgbGV0IGNvZGVQb2ludFxuICBjb25zdCBsZW5ndGggPSBzdHJpbmcubGVuZ3RoXG4gIGxldCBsZWFkU3Vycm9nYXRlID0gbnVsbFxuICBjb25zdCBieXRlcyA9IFtdXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvZGVQb2ludCA9IHN0cmluZy5jaGFyQ29kZUF0KGkpXG5cbiAgICAvLyBpcyBzdXJyb2dhdGUgY29tcG9uZW50XG4gICAgaWYgKGNvZGVQb2ludCA+IDB4RDdGRiAmJiBjb2RlUG9pbnQgPCAweEUwMDApIHtcbiAgICAgIC8vIGxhc3QgY2hhciB3YXMgYSBsZWFkXG4gICAgICBpZiAoIWxlYWRTdXJyb2dhdGUpIHtcbiAgICAgICAgLy8gbm8gbGVhZCB5ZXRcbiAgICAgICAgaWYgKGNvZGVQb2ludCA+IDB4REJGRikge1xuICAgICAgICAgIC8vIHVuZXhwZWN0ZWQgdHJhaWxcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9IGVsc2UgaWYgKGkgKyAxID09PSBsZW5ndGgpIHtcbiAgICAgICAgICAvLyB1bnBhaXJlZCBsZWFkXG4gICAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgICAgY29udGludWVcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHZhbGlkIGxlYWRcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9XG5cbiAgICAgIC8vIDIgbGVhZHMgaW4gYSByb3dcbiAgICAgIGlmIChjb2RlUG9pbnQgPCAweERDMDApIHtcbiAgICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgICAgIGxlYWRTdXJyb2dhdGUgPSBjb2RlUG9pbnRcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gdmFsaWQgc3Vycm9nYXRlIHBhaXJcbiAgICAgIGNvZGVQb2ludCA9IChsZWFkU3Vycm9nYXRlIC0gMHhEODAwIDw8IDEwIHwgY29kZVBvaW50IC0gMHhEQzAwKSArIDB4MTAwMDBcbiAgICB9IGVsc2UgaWYgKGxlYWRTdXJyb2dhdGUpIHtcbiAgICAgIC8vIHZhbGlkIGJtcCBjaGFyLCBidXQgbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgIH1cblxuICAgIGxlYWRTdXJyb2dhdGUgPSBudWxsXG5cbiAgICAvLyBlbmNvZGUgdXRmOFxuICAgIGlmIChjb2RlUG9pbnQgPCAweDgwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDEpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goY29kZVBvaW50KVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50IDwgMHg4MDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiB8IDB4QzAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDMpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgfCAweEUwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDExMDAwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSA0KSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHgxMiB8IDB4RjAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweEMgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4NiAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgJiAweDNGIHwgMHg4MFxuICAgICAgKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludCcpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIGNvbnN0IGJ5dGVBcnJheSA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0ciwgdW5pdHMpIHtcbiAgbGV0IGMsIGhpLCBsb1xuICBjb25zdCBieXRlQXJyYXkgPSBbXVxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0ci5sZW5ndGg7ICsraSkge1xuICAgIGlmICgodW5pdHMgLT0gMikgPCAwKSBicmVha1xuXG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoYmFzZTY0Y2xlYW4oc3RyKSlcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIGxldCBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSkgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG4vLyBBcnJheUJ1ZmZlciBvciBVaW50OEFycmF5IG9iamVjdHMgZnJvbSBvdGhlciBjb250ZXh0cyAoaS5lLiBpZnJhbWVzKSBkbyBub3QgcGFzc1xuLy8gdGhlIGBpbnN0YW5jZW9mYCBjaGVjayBidXQgdGhleSBzaG91bGQgYmUgdHJlYXRlZCBhcyBvZiB0aGF0IHR5cGUuXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8xNjZcbmZ1bmN0aW9uIGlzSW5zdGFuY2UgKG9iaiwgdHlwZSkge1xuICByZXR1cm4gb2JqIGluc3RhbmNlb2YgdHlwZSB8fFxuICAgIChvYmogIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IgIT0gbnVsbCAmJiBvYmouY29uc3RydWN0b3IubmFtZSAhPSBudWxsICYmXG4gICAgICBvYmouY29uc3RydWN0b3IubmFtZSA9PT0gdHlwZS5uYW1lKVxufVxuZnVuY3Rpb24gbnVtYmVySXNOYU4gKG9iaikge1xuICAvLyBGb3IgSUUxMSBzdXBwb3J0XG4gIHJldHVybiBvYmogIT09IG9iaiAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNlbGYtY29tcGFyZVxufVxuXG4vLyBDcmVhdGUgbG9va3VwIHRhYmxlIGZvciBgdG9TdHJpbmcoJ2hleCcpYFxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMjE5XG5jb25zdCBoZXhTbGljZUxvb2t1cFRhYmxlID0gKGZ1bmN0aW9uICgpIHtcbiAgY29uc3QgYWxwaGFiZXQgPSAnMDEyMzQ1Njc4OWFiY2RlZidcbiAgY29uc3QgdGFibGUgPSBuZXcgQXJyYXkoMjU2KVxuICBmb3IgKGxldCBpID0gMDsgaSA8IDE2OyArK2kpIHtcbiAgICBjb25zdCBpMTYgPSBpICogMTZcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IDE2OyArK2opIHtcbiAgICAgIHRhYmxlW2kxNiArIGpdID0gYWxwaGFiZXRbaV0gKyBhbHBoYWJldFtqXVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFibGVcbn0pKClcblxuLy8gUmV0dXJuIG5vdCBmdW5jdGlvbiB3aXRoIEVycm9yIGlmIEJpZ0ludCBub3Qgc3VwcG9ydGVkXG5mdW5jdGlvbiBkZWZpbmVCaWdJbnRNZXRob2QgKGZuKSB7XG4gIHJldHVybiB0eXBlb2YgQmlnSW50ID09PSAndW5kZWZpbmVkJyA/IEJ1ZmZlckJpZ0ludE5vdERlZmluZWQgOiBmblxufVxuXG5mdW5jdGlvbiBCdWZmZXJCaWdJbnROb3REZWZpbmVkICgpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdCaWdJbnQgbm90IHN1cHBvcnRlZCcpXG59XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi5lZGl0b3Ige1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI3MjgyMjtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZm9udC1zaXplOiAxMXB4O1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgaGVpZ2h0OiAzNjVweDtcXG59XFxuXFxuLmVkaXRvciAuYWNlIHtcXG4gIGZsZXgtYmFzaXM6IDc1JTtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qge1xcbiAgLS1zcGFjaW5nOiAxcmVtO1xcbiAgLS1yYWRpdXM6IDdweDtcXG4gIGZsZXgtYmFzaXM6IDI1JTtcXG4gIHBhZGRpbmc6IDAuNXJlbTtcXG4gIG92ZXJmbG93LXk6IGF1dG87XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHVsIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGxpIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtO1xcbn1cXG4uZWRpdG9yIC5maWxlTGlzdCBsaTpob3ZlciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjIyO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBsaSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIHBhZGRpbmctbGVmdDogY2FsYygyICogdmFyKC0tc3BhY2luZykgLSB2YXIoLS1yYWRpdXMpIC0gMnB4KTtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHVsIGxpIHtcXG4gIGJvcmRlci1sZWZ0OiAycHggc29saWQgI2RkZDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgdWwgbGk6bGFzdC1jaGlsZCB7XFxuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCB1bCBsaTo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCJcXFwiO1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IGNhbGModmFyKC0tc3BhY2luZykgLyAtNCk7XFxuICBsZWZ0OiAtMnB4O1xcbiAgd2lkdGg6IGNhbGModmFyKC0tc3BhY2luZykgKyAycHgpO1xcbiAgaGVpZ2h0OiBjYWxjKHZhcigtLXNwYWNpbmcpICsgMXB4KTtcXG4gIGJvcmRlcjogc29saWQgI2RkZDtcXG4gIGJvcmRlci13aWR0aDogMCAwIDJweCAycHg7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnkge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6Om1hcmtlcixcXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5Ojotd2Via2l0LWRldGFpbHMtbWFya2VyIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6Zm9jdXMge1xcbiAgb3V0bGluZTogbm9uZTtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTpmb2N1cy12aXNpYmxlIHtcXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgIzAwMDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgbGk6OmFmdGVyLFxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6OmJlZm9yZSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogY2FsYyh2YXIoLS1zcGFjaW5nKSAvIDIgLSB2YXIoLS1yYWRpdXMpKTtcXG4gIGxlZnQ6IGNhbGModmFyKC0tc3BhY2luZykgLSB2YXIoLS1yYWRpdXMpIC0gMXB4KTtcXG4gIHdpZHRoOiBjYWxjKDIgKiB2YXIoLS1yYWRpdXMpKTtcXG4gIGhlaWdodDogY2FsYygyICogdmFyKC0tcmFkaXVzKSk7XFxuICBiYWNrZ3JvdW5kOiAjZGRkO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5OjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIj5cXFwiO1xcbiAgei1pbmRleDogMTtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyNzI4MjI7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGxpbmUtaGVpZ2h0OiBjYWxjKDIgKiB2YXIoLS1yYWRpdXMpIC0gMnB4KTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIGxlZnQ6IDVweDtcXG4gIHRvcDogN3B4O1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBkZXRhaWxzW29wZW5dID4gc3VtbWFyeTo6YmVmb3JlIHtcXG4gIHRyYW5zZm9ybTogcm90YXRlKDkwZGVnKTtcXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2NvbXBvbmVudHMvRWRpdG9yLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUE7RUFDRSx5QkFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0VBQ0EseUNBQUE7RUFDQSxhQUFBO0VBQ0EsYUFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxTQUFBO0VBQ0EsVUFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLHVCQUFBO0FBQ0Y7QUFDRTtFQUNFLHNCQUFBO0FBQ0o7O0FBR0E7RUFDRSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSw0REFBQTtFQUNBLG1CQUFBO0FBQUY7O0FBR0E7RUFDRSwyQkFBQTtBQUFGOztBQUdBO0VBQ0UseUJBQUE7QUFBRjs7QUFHQTtFQUNFLFdBQUE7RUFDQSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSw4QkFBQTtFQUNBLFVBQUE7RUFDQSxpQ0FBQTtFQUNBLGtDQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtBQUFGOztBQUdBO0VBQ0UsY0FBQTtFQUNBLGVBQUE7QUFBRjs7QUFHQTs7RUFFRSxhQUFBO0FBQUY7O0FBR0E7RUFDRSxhQUFBO0FBQUY7O0FBR0E7RUFDRSx3QkFBQTtBQUFGOztBQUdBOztFQUVFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLDZDQUFBO0VBQ0EsZ0RBQUE7RUFDQSw4QkFBQTtFQUNBLCtCQUFBO0VBQ0EsZ0JBQUE7QUFBRjs7QUFHQTtFQUNFLFlBQUE7RUFDQSxVQUFBO0VBQ0EseUJBQUE7RUFDQSxXQUFBO0VBQ0EsMENBQUE7RUFDQSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxRQUFBO0FBQUY7O0FBR0E7RUFFRSx3QkFBQTtBQURGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi5lZGl0b3Ige1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI3MjgyMjtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZm9udC1zaXplOiAxMXB4O1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAgaGVpZ2h0OiAzNjVweDtcXG59XFxuXFxuLmVkaXRvciAuYWNlIHtcXG4gIGZsZXgtYmFzaXM6IDc1JTtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qge1xcbiAgLS1zcGFjaW5nOiAxcmVtO1xcbiAgLS1yYWRpdXM6IDdweDtcXG4gIGZsZXgtYmFzaXM6IDI1JTtcXG4gIHBhZGRpbmc6IDAuNXJlbTtcXG4gIG92ZXJmbG93LXk6IGF1dG87XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHVsIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGxpIHtcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG4gIHBhZGRpbmc6IDAuMjVyZW0gMC41cmVtO1xcblxcbiAgJjpob3ZlciB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICMyMjI7XFxuICB9XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGxpIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZy1sZWZ0OiBjYWxjKDIgKiB2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAycHgpO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgdWwgbGkge1xcbiAgYm9yZGVyLWxlZnQ6IDJweCBzb2xpZCAjZGRkO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCB1bCBsaTpsYXN0LWNoaWxkIHtcXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHVsIGxpOjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogY2FsYyh2YXIoLS1zcGFjaW5nKSAvIC00KTtcXG4gIGxlZnQ6IC0ycHg7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zcGFjaW5nKSArIDJweCk7XFxuICBoZWlnaHQ6IGNhbGModmFyKC0tc3BhY2luZykgKyAxcHgpO1xcbiAgYm9yZGVyOiBzb2xpZCAjZGRkO1xcbiAgYm9yZGVyLXdpZHRoOiAwIDAgMnB4IDJweDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTo6bWFya2VyLFxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6Oi13ZWJraXQtZGV0YWlscy1tYXJrZXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTpmb2N1cyB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5OmZvY3VzLXZpc2libGUge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCAjMDAwO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBsaTo6YWZ0ZXIsXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTo6YmVmb3JlIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiBjYWxjKHZhcigtLXNwYWNpbmcpIC8gMiAtIHZhcigtLXJhZGl1cykpO1xcbiAgbGVmdDogY2FsYyh2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAxcHgpO1xcbiAgd2lkdGg6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykpO1xcbiAgaGVpZ2h0OiBjYWxjKDIgKiB2YXIoLS1yYWRpdXMpKTtcXG4gIGJhY2tncm91bmQ6ICNkZGQ7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiPlxcXCI7XFxuICB6LWluZGV4OiAxO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI3MjgyMjtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgbGluZS1oZWlnaHQ6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykgLSAycHgpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbGVmdDogNXB4O1xcbiAgdG9wOiA3cHg7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGRldGFpbHNbb3Blbl0gPiBzdW1tYXJ5OjpiZWZvcmUge1xcbiAgLy8gY29udGVudCA6ICfiiJInO1xcbiAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIuaW50ZXJmYWNlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5pbnRlcmZhY2UgaW1nLFxcbi5pbnRlcmZhY2Ugc3BhbixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLWtub2IsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zbGlkZXIsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zd2l0Y2gge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbn1cXG5cXG4uaW50ZXJmYWNlIGltZyB7XFxuICB6LWluZGV4OiAxO1xcbn1cXG5cXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLWtub2IsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zbGlkZXIsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zd2l0Y2gge1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuLmludGVyZmFjZSBzcGFuIHtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB6LWluZGV4OiAzO1xcbn1cXG5cXG4uaW50ZXJmYWNlIC50YWJzIHtcXG4gIGFsaWduLWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxufVxcblxcbi5pbnRlcmZhY2UgLnJhZGlvdGFiIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG9wYWNpdHk6IDA7XFxufVxcblxcbi5pbnRlcmZhY2UgLmxhYmVsIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgcGFkZGluZzogMC41cmVtIDFyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5pbnRlcmZhY2UgLmxhYmVsOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyMjI7XFxufVxcblxcbi5pbnRlcmZhY2UgLnJhZGlvdGFiOmNoZWNrZWQgKyAubGFiZWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG59XFxuXFxuLmludGVyZmFjZSAucGFuZWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMDtcXG4gIHBhZGRpbmctYm90dG9tOiA0Mi41OCU7XFxufVxcblxcbi5pbnRlcmZhY2UgLnJhZGlvdGFiOmNoZWNrZWQgKyAubGFiZWwgKyAucGFuZWwge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbi5pbnRlcmZhY2UgLnBhbmVsIHtcXG4gIG9yZGVyOiA5OTtcXG59XFxuXFxuLmludGVyZmFjZSAubGFiZWwge1xcbiAgd2lkdGg6IGF1dG87XFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jb21wb25lbnRzL0ludGVyZmFjZS5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0VBQ0Usc0JBQUE7RUFDQSxXQUFBO0VBQ0EsZUFBQTtFQUNBLHlDQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTs7Ozs7RUFLRSxrQkFBQTtBQUNGOztBQUdBO0VBQ0UsVUFBQTtBQUFGOztBQUdBOzs7RUFHRSxVQUFBO0FBQUY7O0FBR0E7RUFDRSxtQkFBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLFVBQUE7QUFBRjs7QUFHQTtFQUNFLHlCQUFBO0VBQ0EsV0FBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0FBQUY7O0FBR0E7RUFDRSxrQkFBQTtFQUNBLFVBQUE7QUFBRjs7QUFHQTtFQUNFLFdBQUE7RUFDQSxlQUFBO0VBQ0Esb0JBQUE7RUFDQSxrQkFBQTtBQUFGOztBQUdBO0VBQ0Usc0JBQUE7QUFBRjs7QUFHQTtFQUNFLHNCQUFBO0FBQUY7O0FBR0E7RUFDRSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLFdBQUE7RUFDQSxTQUFBO0VBQ0Esc0JBQUE7QUFBRjs7QUFHQTtFQUNFLGNBQUE7QUFBRjs7QUFHQTtFQUNFLFNBQUE7QUFBRjs7QUFFQTtFQUNFLFdBQUE7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaW50ZXJmYWNlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5pbnRlcmZhY2UgaW1nLFxcbi5pbnRlcmZhY2Ugc3BhbixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLWtub2IsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zbGlkZXIsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zd2l0Y2gge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgLy8gdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxufVxcblxcbi5pbnRlcmZhY2UgaW1nIHtcXG4gIHotaW5kZXg6IDE7XFxufVxcblxcbi5pbnRlcmZhY2Ugd2ViYXVkaW8ta25vYixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLXNsaWRlcixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLXN3aXRjaCB7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4uaW50ZXJmYWNlIHNwYW4ge1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHotaW5kZXg6IDM7XFxufVxcblxcbi5pbnRlcmZhY2UgLnRhYnMge1xcbiAgYWxpZ24tY29udGVudDogZmxleC1zdGFydDtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG59XFxuXFxuLmludGVyZmFjZSAucmFkaW90YWIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmludGVyZmFjZSAubGFiZWwge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmludGVyZmFjZSAubGFiZWw6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzIyMjtcXG59XFxuXFxuLmludGVyZmFjZSAucmFkaW90YWI6Y2hlY2tlZCArIC5sYWJlbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbn1cXG5cXG4uaW50ZXJmYWNlIC5wYW5lbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAwO1xcbiAgcGFkZGluZy1ib3R0b206IDQyLjU4JTsgLy8gMzMwcHggLyA3NzVweFxcbn1cXG5cXG4uaW50ZXJmYWNlIC5yYWRpb3RhYjpjaGVja2VkICsgLmxhYmVsICsgLnBhbmVsIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4uaW50ZXJmYWNlIC5wYW5lbCB7XFxuICBvcmRlcjogOTk7XFxufVxcbi5pbnRlcmZhY2UgLmxhYmVsIHtcXG4gIHdpZHRoOiBhdXRvO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIucGxheWVyIC5oZWFkZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZm9udC1zaXplOiAxMXB4O1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBwYWRkaW5nOiAxcmVtO1xcbn1cXG5cXG4ucGxheWVyIC5oZWFkZXIgaW5wdXQge1xcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHNCQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSx5Q0FBQTtFQUNBLGFBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnBsYXllciAuaGVhZGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGZvbnQtc2l6ZTogMTFweDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgcGFkZGluZzogMXJlbTtcXG59XFxuXFxuLnBsYXllciAuaGVhZGVyIGlucHV0IHtcXG4gIG1hcmdpbi1yaWdodDogMXJlbTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCIvKiEgaWVlZTc1NC4gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiLyohIHNhZmUtYnVmZmVyLiBNSVQgTGljZW5zZS4gRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnL29wZW5zb3VyY2U+ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXG52YXIgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJylcbnZhciBCdWZmZXIgPSBidWZmZXIuQnVmZmVyXG5cbi8vIGFsdGVybmF0aXZlIHRvIHVzaW5nIE9iamVjdC5rZXlzIGZvciBvbGQgYnJvd3NlcnNcbmZ1bmN0aW9uIGNvcHlQcm9wcyAoc3JjLCBkc3QpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGRzdFtrZXldID0gc3JjW2tleV1cbiAgfVxufVxuaWYgKEJ1ZmZlci5mcm9tICYmIEJ1ZmZlci5hbGxvYyAmJiBCdWZmZXIuYWxsb2NVbnNhZmUgJiYgQnVmZmVyLmFsbG9jVW5zYWZlU2xvdykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGJ1ZmZlclxufSBlbHNlIHtcbiAgLy8gQ29weSBwcm9wZXJ0aWVzIGZyb20gcmVxdWlyZSgnYnVmZmVyJylcbiAgY29weVByb3BzKGJ1ZmZlciwgZXhwb3J0cylcbiAgZXhwb3J0cy5CdWZmZXIgPSBTYWZlQnVmZmVyXG59XG5cbmZ1bmN0aW9uIFNhZmVCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cblNhZmVCdWZmZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCdWZmZXIucHJvdG90eXBlKVxuXG4vLyBDb3B5IHN0YXRpYyBtZXRob2RzIGZyb20gQnVmZmVyXG5jb3B5UHJvcHMoQnVmZmVyLCBTYWZlQnVmZmVyKVxuXG5TYWZlQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cblNhZmVCdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHZhciBidWYgPSBCdWZmZXIoc2l6ZSlcbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBidWYuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmZpbGwoZmlsbClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLmZpbGwoMClcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cblNhZmVCdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlcihzaXplKVxufVxuXG5TYWZlQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gYnVmZmVyLlNsb3dCdWZmZXIoc2l6ZSlcbn1cbiIsIjsoZnVuY3Rpb24gKHNheCkgeyAvLyB3cmFwcGVyIGZvciBub24tbm9kZSBlbnZzXG4gIHNheC5wYXJzZXIgPSBmdW5jdGlvbiAoc3RyaWN0LCBvcHQpIHsgcmV0dXJuIG5ldyBTQVhQYXJzZXIoc3RyaWN0LCBvcHQpIH1cbiAgc2F4LlNBWFBhcnNlciA9IFNBWFBhcnNlclxuICBzYXguU0FYU3RyZWFtID0gU0FYU3RyZWFtXG4gIHNheC5jcmVhdGVTdHJlYW0gPSBjcmVhdGVTdHJlYW1cblxuICAvLyBXaGVuIHdlIHBhc3MgdGhlIE1BWF9CVUZGRVJfTEVOR1RIIHBvc2l0aW9uLCBzdGFydCBjaGVja2luZyBmb3IgYnVmZmVyIG92ZXJydW5zLlxuICAvLyBXaGVuIHdlIGNoZWNrLCBzY2hlZHVsZSB0aGUgbmV4dCBjaGVjayBmb3IgTUFYX0JVRkZFUl9MRU5HVEggLSAobWF4KGJ1ZmZlciBsZW5ndGhzKSksXG4gIC8vIHNpbmNlIHRoYXQncyB0aGUgZWFybGllc3QgdGhhdCBhIGJ1ZmZlciBvdmVycnVuIGNvdWxkIG9jY3VyLiAgVGhpcyB3YXksIGNoZWNrcyBhcmVcbiAgLy8gYXMgcmFyZSBhcyByZXF1aXJlZCwgYnV0IGFzIG9mdGVuIGFzIG5lY2Vzc2FyeSB0byBlbnN1cmUgbmV2ZXIgY3Jvc3NpbmcgdGhpcyBib3VuZC5cbiAgLy8gRnVydGhlcm1vcmUsIGJ1ZmZlcnMgYXJlIG9ubHkgdGVzdGVkIGF0IG1vc3Qgb25jZSBwZXIgd3JpdGUoKSwgc28gcGFzc2luZyBhIHZlcnlcbiAgLy8gbGFyZ2Ugc3RyaW5nIGludG8gd3JpdGUoKSBtaWdodCBoYXZlIHVuZGVzaXJhYmxlIGVmZmVjdHMsIGJ1dCB0aGlzIGlzIG1hbmFnZWFibGUgYnlcbiAgLy8gdGhlIGNhbGxlciwgc28gaXQgaXMgYXNzdW1lZCB0byBiZSBzYWZlLiAgVGh1cywgYSBjYWxsIHRvIHdyaXRlKCkgbWF5LCBpbiB0aGUgZXh0cmVtZVxuICAvLyBlZGdlIGNhc2UsIHJlc3VsdCBpbiBjcmVhdGluZyBhdCBtb3N0IG9uZSBjb21wbGV0ZSBjb3B5IG9mIHRoZSBzdHJpbmcgcGFzc2VkIGluLlxuICAvLyBTZXQgdG8gSW5maW5pdHkgdG8gaGF2ZSB1bmxpbWl0ZWQgYnVmZmVycy5cbiAgc2F4Lk1BWF9CVUZGRVJfTEVOR1RIID0gNjQgKiAxMDI0XG5cbiAgdmFyIGJ1ZmZlcnMgPSBbXG4gICAgJ2NvbW1lbnQnLCAnc2dtbERlY2wnLCAndGV4dE5vZGUnLCAndGFnTmFtZScsICdkb2N0eXBlJyxcbiAgICAncHJvY0luc3ROYW1lJywgJ3Byb2NJbnN0Qm9keScsICdlbnRpdHknLCAnYXR0cmliTmFtZScsXG4gICAgJ2F0dHJpYlZhbHVlJywgJ2NkYXRhJywgJ3NjcmlwdCdcbiAgXVxuXG4gIHNheC5FVkVOVFMgPSBbXG4gICAgJ3RleHQnLFxuICAgICdwcm9jZXNzaW5naW5zdHJ1Y3Rpb24nLFxuICAgICdzZ21sZGVjbGFyYXRpb24nLFxuICAgICdkb2N0eXBlJyxcbiAgICAnY29tbWVudCcsXG4gICAgJ29wZW50YWdzdGFydCcsXG4gICAgJ2F0dHJpYnV0ZScsXG4gICAgJ29wZW50YWcnLFxuICAgICdjbG9zZXRhZycsXG4gICAgJ29wZW5jZGF0YScsXG4gICAgJ2NkYXRhJyxcbiAgICAnY2xvc2VjZGF0YScsXG4gICAgJ2Vycm9yJyxcbiAgICAnZW5kJyxcbiAgICAncmVhZHknLFxuICAgICdzY3JpcHQnLFxuICAgICdvcGVubmFtZXNwYWNlJyxcbiAgICAnY2xvc2VuYW1lc3BhY2UnXG4gIF1cblxuICBmdW5jdGlvbiBTQVhQYXJzZXIgKHN0cmljdCwgb3B0KSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNBWFBhcnNlcikpIHtcbiAgICAgIHJldHVybiBuZXcgU0FYUGFyc2VyKHN0cmljdCwgb3B0KVxuICAgIH1cblxuICAgIHZhciBwYXJzZXIgPSB0aGlzXG4gICAgY2xlYXJCdWZmZXJzKHBhcnNlcilcbiAgICBwYXJzZXIucSA9IHBhcnNlci5jID0gJydcbiAgICBwYXJzZXIuYnVmZmVyQ2hlY2tQb3NpdGlvbiA9IHNheC5NQVhfQlVGRkVSX0xFTkdUSFxuICAgIHBhcnNlci5vcHQgPSBvcHQgfHwge31cbiAgICBwYXJzZXIub3B0Lmxvd2VyY2FzZSA9IHBhcnNlci5vcHQubG93ZXJjYXNlIHx8IHBhcnNlci5vcHQubG93ZXJjYXNldGFnc1xuICAgIHBhcnNlci5sb29zZUNhc2UgPSBwYXJzZXIub3B0Lmxvd2VyY2FzZSA/ICd0b0xvd2VyQ2FzZScgOiAndG9VcHBlckNhc2UnXG4gICAgcGFyc2VyLnRhZ3MgPSBbXVxuICAgIHBhcnNlci5jbG9zZWQgPSBwYXJzZXIuY2xvc2VkUm9vdCA9IHBhcnNlci5zYXdSb290ID0gZmFsc2VcbiAgICBwYXJzZXIudGFnID0gcGFyc2VyLmVycm9yID0gbnVsbFxuICAgIHBhcnNlci5zdHJpY3QgPSAhIXN0cmljdFxuICAgIHBhcnNlci5ub3NjcmlwdCA9ICEhKHN0cmljdCB8fCBwYXJzZXIub3B0Lm5vc2NyaXB0KVxuICAgIHBhcnNlci5zdGF0ZSA9IFMuQkVHSU5cbiAgICBwYXJzZXIuc3RyaWN0RW50aXRpZXMgPSBwYXJzZXIub3B0LnN0cmljdEVudGl0aWVzXG4gICAgcGFyc2VyLkVOVElUSUVTID0gcGFyc2VyLnN0cmljdEVudGl0aWVzID8gT2JqZWN0LmNyZWF0ZShzYXguWE1MX0VOVElUSUVTKSA6IE9iamVjdC5jcmVhdGUoc2F4LkVOVElUSUVTKVxuICAgIHBhcnNlci5hdHRyaWJMaXN0ID0gW11cblxuICAgIC8vIG5hbWVzcGFjZXMgZm9ybSBhIHByb3RvdHlwZSBjaGFpbi5cbiAgICAvLyBpdCBhbHdheXMgcG9pbnRzIGF0IHRoZSBjdXJyZW50IHRhZyxcbiAgICAvLyB3aGljaCBwcm90b3MgdG8gaXRzIHBhcmVudCB0YWcuXG4gICAgaWYgKHBhcnNlci5vcHQueG1sbnMpIHtcbiAgICAgIHBhcnNlci5ucyA9IE9iamVjdC5jcmVhdGUocm9vdE5TKVxuICAgIH1cblxuICAgIC8vIG1vc3RseSBqdXN0IGZvciBlcnJvciByZXBvcnRpbmdcbiAgICBwYXJzZXIudHJhY2tQb3NpdGlvbiA9IHBhcnNlci5vcHQucG9zaXRpb24gIT09IGZhbHNlXG4gICAgaWYgKHBhcnNlci50cmFja1Bvc2l0aW9uKSB7XG4gICAgICBwYXJzZXIucG9zaXRpb24gPSBwYXJzZXIubGluZSA9IHBhcnNlci5jb2x1bW4gPSAwXG4gICAgfVxuICAgIGVtaXQocGFyc2VyLCAnb25yZWFkeScpXG4gIH1cblxuICBpZiAoIU9iamVjdC5jcmVhdGUpIHtcbiAgICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGZ1bmN0aW9uIEYgKCkge31cbiAgICAgIEYucHJvdG90eXBlID0gb1xuICAgICAgdmFyIG5ld2YgPSBuZXcgRigpXG4gICAgICByZXR1cm4gbmV3ZlxuICAgIH1cbiAgfVxuXG4gIGlmICghT2JqZWN0LmtleXMpIHtcbiAgICBPYmplY3Qua2V5cyA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgYSA9IFtdXG4gICAgICBmb3IgKHZhciBpIGluIG8pIGlmIChvLmhhc093blByb3BlcnR5KGkpKSBhLnB1c2goaSlcbiAgICAgIHJldHVybiBhXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tCdWZmZXJMZW5ndGggKHBhcnNlcikge1xuICAgIHZhciBtYXhBbGxvd2VkID0gTWF0aC5tYXgoc2F4Lk1BWF9CVUZGRVJfTEVOR1RILCAxMClcbiAgICB2YXIgbWF4QWN0dWFsID0gMFxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnVmZmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBsZW4gPSBwYXJzZXJbYnVmZmVyc1tpXV0ubGVuZ3RoXG4gICAgICBpZiAobGVuID4gbWF4QWxsb3dlZCkge1xuICAgICAgICAvLyBUZXh0L2NkYXRhIG5vZGVzIGNhbiBnZXQgYmlnLCBhbmQgc2luY2UgdGhleSdyZSBidWZmZXJlZCxcbiAgICAgICAgLy8gd2UgY2FuIGdldCBoZXJlIHVuZGVyIG5vcm1hbCBjb25kaXRpb25zLlxuICAgICAgICAvLyBBdm9pZCBpc3N1ZXMgYnkgZW1pdHRpbmcgdGhlIHRleHQgbm9kZSBub3csXG4gICAgICAgIC8vIHNvIGF0IGxlYXN0IGl0IHdvbid0IGdldCBhbnkgYmlnZ2VyLlxuICAgICAgICBzd2l0Y2ggKGJ1ZmZlcnNbaV0pIHtcbiAgICAgICAgICBjYXNlICd0ZXh0Tm9kZSc6XG4gICAgICAgICAgICBjbG9zZVRleHQocGFyc2VyKVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ2NkYXRhJzpcbiAgICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uY2RhdGEnLCBwYXJzZXIuY2RhdGEpXG4gICAgICAgICAgICBwYXJzZXIuY2RhdGEgPSAnJ1xuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICBlbWl0Tm9kZShwYXJzZXIsICdvbnNjcmlwdCcsIHBhcnNlci5zY3JpcHQpXG4gICAgICAgICAgICBwYXJzZXIuc2NyaXB0ID0gJydcbiAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXJyb3IocGFyc2VyLCAnTWF4IGJ1ZmZlciBsZW5ndGggZXhjZWVkZWQ6ICcgKyBidWZmZXJzW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtYXhBY3R1YWwgPSBNYXRoLm1heChtYXhBY3R1YWwsIGxlbilcbiAgICB9XG4gICAgLy8gc2NoZWR1bGUgdGhlIG5leHQgY2hlY2sgZm9yIHRoZSBlYXJsaWVzdCBwb3NzaWJsZSBidWZmZXIgb3ZlcnJ1bi5cbiAgICB2YXIgbSA9IHNheC5NQVhfQlVGRkVSX0xFTkdUSCAtIG1heEFjdHVhbFxuICAgIHBhcnNlci5idWZmZXJDaGVja1Bvc2l0aW9uID0gbSArIHBhcnNlci5wb3NpdGlvblxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJCdWZmZXJzIChwYXJzZXIpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJ1ZmZlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJzZXJbYnVmZmVyc1tpXV0gPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoQnVmZmVycyAocGFyc2VyKSB7XG4gICAgY2xvc2VUZXh0KHBhcnNlcilcbiAgICBpZiAocGFyc2VyLmNkYXRhICE9PSAnJykge1xuICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jZGF0YScsIHBhcnNlci5jZGF0YSlcbiAgICAgIHBhcnNlci5jZGF0YSA9ICcnXG4gICAgfVxuICAgIGlmIChwYXJzZXIuc2NyaXB0ICE9PSAnJykge1xuICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25zY3JpcHQnLCBwYXJzZXIuc2NyaXB0KVxuICAgICAgcGFyc2VyLnNjcmlwdCA9ICcnXG4gICAgfVxuICB9XG5cbiAgU0FYUGFyc2VyLnByb3RvdHlwZSA9IHtcbiAgICBlbmQ6IGZ1bmN0aW9uICgpIHsgZW5kKHRoaXMpIH0sXG4gICAgd3JpdGU6IHdyaXRlLFxuICAgIHJlc3VtZTogZnVuY3Rpb24gKCkgeyB0aGlzLmVycm9yID0gbnVsbDsgcmV0dXJuIHRoaXMgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy53cml0ZShudWxsKSB9LFxuICAgIGZsdXNoOiBmdW5jdGlvbiAoKSB7IGZsdXNoQnVmZmVycyh0aGlzKSB9XG4gIH1cblxuICB2YXIgU3RyZWFtXG4gIHRyeSB7XG4gICAgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJykuU3RyZWFtXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgU3RyZWFtID0gZnVuY3Rpb24gKCkge31cbiAgfVxuXG4gIHZhciBzdHJlYW1XcmFwcyA9IHNheC5FVkVOVFMuZmlsdGVyKGZ1bmN0aW9uIChldikge1xuICAgIHJldHVybiBldiAhPT0gJ2Vycm9yJyAmJiBldiAhPT0gJ2VuZCdcbiAgfSlcblxuICBmdW5jdGlvbiBjcmVhdGVTdHJlYW0gKHN0cmljdCwgb3B0KSB7XG4gICAgcmV0dXJuIG5ldyBTQVhTdHJlYW0oc3RyaWN0LCBvcHQpXG4gIH1cblxuICBmdW5jdGlvbiBTQVhTdHJlYW0gKHN0cmljdCwgb3B0KSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNBWFN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBuZXcgU0FYU3RyZWFtKHN0cmljdCwgb3B0KVxuICAgIH1cblxuICAgIFN0cmVhbS5hcHBseSh0aGlzKVxuXG4gICAgdGhpcy5fcGFyc2VyID0gbmV3IFNBWFBhcnNlcihzdHJpY3QsIG9wdClcbiAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZVxuICAgIHRoaXMucmVhZGFibGUgPSB0cnVlXG5cbiAgICB2YXIgbWUgPSB0aGlzXG5cbiAgICB0aGlzLl9wYXJzZXIub25lbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBtZS5lbWl0KCdlbmQnKVxuICAgIH1cblxuICAgIHRoaXMuX3BhcnNlci5vbmVycm9yID0gZnVuY3Rpb24gKGVyKSB7XG4gICAgICBtZS5lbWl0KCdlcnJvcicsIGVyKVxuXG4gICAgICAvLyBpZiBkaWRuJ3QgdGhyb3csIHRoZW4gbWVhbnMgZXJyb3Igd2FzIGhhbmRsZWQuXG4gICAgICAvLyBnbyBhaGVhZCBhbmQgY2xlYXIgZXJyb3IsIHNvIHdlIGNhbiB3cml0ZSBhZ2Fpbi5cbiAgICAgIG1lLl9wYXJzZXIuZXJyb3IgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5fZGVjb2RlciA9IG51bGxcblxuICAgIHN0cmVhbVdyYXBzLmZvckVhY2goZnVuY3Rpb24gKGV2KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWUsICdvbicgKyBldiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gbWUuX3BhcnNlclsnb24nICsgZXZdXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGgpIHtcbiAgICAgICAgICBpZiAoIWgpIHtcbiAgICAgICAgICAgIG1lLnJlbW92ZUFsbExpc3RlbmVycyhldilcbiAgICAgICAgICAgIG1lLl9wYXJzZXJbJ29uJyArIGV2XSA9IGhcbiAgICAgICAgICAgIHJldHVybiBoXG4gICAgICAgICAgfVxuICAgICAgICAgIG1lLm9uKGV2LCBoKVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBTQVhTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdHJlYW0ucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBTQVhTdHJlYW1cbiAgICB9XG4gIH0pXG5cbiAgU0FYU3RyZWFtLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKHR5cGVvZiBCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHR5cGVvZiBCdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkge1xuICAgICAgaWYgKCF0aGlzLl9kZWNvZGVyKSB7XG4gICAgICAgIHZhciBTRCA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyJykuU3RyaW5nRGVjb2RlclxuICAgICAgICB0aGlzLl9kZWNvZGVyID0gbmV3IFNEKCd1dGY4JylcbiAgICAgIH1cbiAgICAgIGRhdGEgPSB0aGlzLl9kZWNvZGVyLndyaXRlKGRhdGEpXG4gICAgfVxuXG4gICAgdGhpcy5fcGFyc2VyLndyaXRlKGRhdGEudG9TdHJpbmcoKSlcbiAgICB0aGlzLmVtaXQoJ2RhdGEnLCBkYXRhKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBTQVhTdHJlYW0ucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHRoaXMud3JpdGUoY2h1bmspXG4gICAgfVxuICAgIHRoaXMuX3BhcnNlci5lbmQoKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBTQVhTdHJlYW0ucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2LCBoYW5kbGVyKSB7XG4gICAgdmFyIG1lID0gdGhpc1xuICAgIGlmICghbWUuX3BhcnNlclsnb24nICsgZXZdICYmIHN0cmVhbVdyYXBzLmluZGV4T2YoZXYpICE9PSAtMSkge1xuICAgICAgbWUuX3BhcnNlclsnb24nICsgZXZdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBbYXJndW1lbnRzWzBdXSA6IEFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cylcbiAgICAgICAgYXJncy5zcGxpY2UoMCwgMCwgZXYpXG4gICAgICAgIG1lLmVtaXQuYXBwbHkobWUsIGFyZ3MpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmVhbS5wcm90b3R5cGUub24uY2FsbChtZSwgZXYsIGhhbmRsZXIpXG4gIH1cblxuICAvLyB0aGlzIHJlYWxseSBuZWVkcyB0byBiZSByZXBsYWNlZCB3aXRoIGNoYXJhY3RlciBjbGFzc2VzLlxuICAvLyBYTUwgYWxsb3dzIGFsbCBtYW5uZXIgb2YgcmlkaWN1bG91cyBudW1iZXJzIGFuZCBkaWdpdHMuXG4gIHZhciBDREFUQSA9ICdbQ0RBVEFbJ1xuICB2YXIgRE9DVFlQRSA9ICdET0NUWVBFJ1xuICB2YXIgWE1MX05BTUVTUEFDRSA9ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnXG4gIHZhciBYTUxOU19OQU1FU1BBQ0UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXG4gIHZhciByb290TlMgPSB7IHhtbDogWE1MX05BTUVTUEFDRSwgeG1sbnM6IFhNTE5TX05BTUVTUEFDRSB9XG5cbiAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLXhtbC8jTlQtTmFtZVN0YXJ0Q2hhclxuICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIHdvcmtzIG9uIHN0cmluZ3MsIGEgc2luZ2xlIGNoYXJhY3RlciBhdCBhIHRpbWVcbiAgLy8gYXMgc3VjaCwgaXQgY2Fubm90IGV2ZXIgc3VwcG9ydCBhc3RyYWwtcGxhbmUgY2hhcmFjdGVycyAoMTAwMDAtRUZGRkYpXG4gIC8vIHdpdGhvdXQgYSBzaWduaWZpY2FudCBicmVha2luZyBjaGFuZ2UgdG8gZWl0aGVyIHRoaXMgIHBhcnNlciwgb3IgdGhlXG4gIC8vIEphdmFTY3JpcHQgbGFuZ3VhZ2UuICBJbXBsZW1lbnRhdGlvbiBvZiBhbiBlbW9qaS1jYXBhYmxlIHhtbCBwYXJzZXJcbiAgLy8gaXMgbGVmdCBhcyBhbiBleGVyY2lzZSBmb3IgdGhlIHJlYWRlci5cbiAgdmFyIG5hbWVTdGFydCA9IC9bOl9BLVphLXpcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdL1xuXG4gIHZhciBuYW1lQm9keSA9IC9bOl9BLVphLXpcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwLlxcZC1dL1xuXG4gIHZhciBlbnRpdHlTdGFydCA9IC9bIzpfQS1aYS16XFx1MDBDMC1cXHUwMEQ2XFx1MDBEOC1cXHUwMEY2XFx1MDBGOC1cXHUwMkZGXFx1MDM3MC1cXHUwMzdEXFx1MDM3Ri1cXHUxRkZGXFx1MjAwQy1cXHUyMDBEXFx1MjA3MC1cXHUyMThGXFx1MkMwMC1cXHUyRkVGXFx1MzAwMS1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkZEXS9cbiAgdmFyIGVudGl0eUJvZHkgPSAvWyM6X0EtWmEtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcdTAwQjdcXHUwMzAwLVxcdTAzNkZcXHUyMDNGLVxcdTIwNDAuXFxkLV0vXG5cbiAgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChjKSB7XG4gICAgcmV0dXJuIGMgPT09ICcgJyB8fCBjID09PSAnXFxuJyB8fCBjID09PSAnXFxyJyB8fCBjID09PSAnXFx0J1xuICB9XG5cbiAgZnVuY3Rpb24gaXNRdW90ZSAoYykge1xuICAgIHJldHVybiBjID09PSAnXCInIHx8IGMgPT09ICdcXCcnXG4gIH1cblxuICBmdW5jdGlvbiBpc0F0dHJpYkVuZCAoYykge1xuICAgIHJldHVybiBjID09PSAnPicgfHwgaXNXaGl0ZXNwYWNlKGMpXG4gIH1cblxuICBmdW5jdGlvbiBpc01hdGNoIChyZWdleCwgYykge1xuICAgIHJldHVybiByZWdleC50ZXN0KGMpXG4gIH1cblxuICBmdW5jdGlvbiBub3RNYXRjaCAocmVnZXgsIGMpIHtcbiAgICByZXR1cm4gIWlzTWF0Y2gocmVnZXgsIGMpXG4gIH1cblxuICB2YXIgUyA9IDBcbiAgc2F4LlNUQVRFID0ge1xuICAgIEJFR0lOOiBTKyssIC8vIGxlYWRpbmcgYnl0ZSBvcmRlciBtYXJrIG9yIHdoaXRlc3BhY2VcbiAgICBCRUdJTl9XSElURVNQQUNFOiBTKyssIC8vIGxlYWRpbmcgd2hpdGVzcGFjZVxuICAgIFRFWFQ6IFMrKywgLy8gZ2VuZXJhbCBzdHVmZlxuICAgIFRFWFRfRU5USVRZOiBTKyssIC8vICZhbXAgYW5kIHN1Y2guXG4gICAgT1BFTl9XQUtBOiBTKyssIC8vIDxcbiAgICBTR01MX0RFQ0w6IFMrKywgLy8gPCFCTEFSR1xuICAgIFNHTUxfREVDTF9RVU9URUQ6IFMrKywgLy8gPCFCTEFSRyBmb28gXCJiYXJcbiAgICBET0NUWVBFOiBTKyssIC8vIDwhRE9DVFlQRVxuICAgIERPQ1RZUEVfUVVPVEVEOiBTKyssIC8vIDwhRE9DVFlQRSBcIi8vYmxhaFxuICAgIERPQ1RZUEVfRFREOiBTKyssIC8vIDwhRE9DVFlQRSBcIi8vYmxhaFwiIFsgLi4uXG4gICAgRE9DVFlQRV9EVERfUVVPVEVEOiBTKyssIC8vIDwhRE9DVFlQRSBcIi8vYmxhaFwiIFsgXCJmb29cbiAgICBDT01NRU5UX1NUQVJUSU5HOiBTKyssIC8vIDwhLVxuICAgIENPTU1FTlQ6IFMrKywgLy8gPCEtLVxuICAgIENPTU1FTlRfRU5ESU5HOiBTKyssIC8vIDwhLS0gYmxhaCAtXG4gICAgQ09NTUVOVF9FTkRFRDogUysrLCAvLyA8IS0tIGJsYWggLS1cbiAgICBDREFUQTogUysrLCAvLyA8IVtDREFUQVsgc29tZXRoaW5nXG4gICAgQ0RBVEFfRU5ESU5HOiBTKyssIC8vIF1cbiAgICBDREFUQV9FTkRJTkdfMjogUysrLCAvLyBdXVxuICAgIFBST0NfSU5TVDogUysrLCAvLyA8P2hpXG4gICAgUFJPQ19JTlNUX0JPRFk6IFMrKywgLy8gPD9oaSB0aGVyZVxuICAgIFBST0NfSU5TVF9FTkRJTkc6IFMrKywgLy8gPD9oaSBcInRoZXJlXCIgP1xuICAgIE9QRU5fVEFHOiBTKyssIC8vIDxzdHJvbmdcbiAgICBPUEVOX1RBR19TTEFTSDogUysrLCAvLyA8c3Ryb25nIC9cbiAgICBBVFRSSUI6IFMrKywgLy8gPGFcbiAgICBBVFRSSUJfTkFNRTogUysrLCAvLyA8YSBmb29cbiAgICBBVFRSSUJfTkFNRV9TQVdfV0hJVEU6IFMrKywgLy8gPGEgZm9vIF9cbiAgICBBVFRSSUJfVkFMVUU6IFMrKywgLy8gPGEgZm9vPVxuICAgIEFUVFJJQl9WQUxVRV9RVU9URUQ6IFMrKywgLy8gPGEgZm9vPVwiYmFyXG4gICAgQVRUUklCX1ZBTFVFX0NMT1NFRDogUysrLCAvLyA8YSBmb289XCJiYXJcIlxuICAgIEFUVFJJQl9WQUxVRV9VTlFVT1RFRDogUysrLCAvLyA8YSBmb289YmFyXG4gICAgQVRUUklCX1ZBTFVFX0VOVElUWV9ROiBTKyssIC8vIDxmb28gYmFyPVwiJnF1b3Q7XCJcbiAgICBBVFRSSUJfVkFMVUVfRU5USVRZX1U6IFMrKywgLy8gPGZvbyBiYXI9JnF1b3RcbiAgICBDTE9TRV9UQUc6IFMrKywgLy8gPC9hXG4gICAgQ0xPU0VfVEFHX1NBV19XSElURTogUysrLCAvLyA8L2EgICA+XG4gICAgU0NSSVBUOiBTKyssIC8vIDxzY3JpcHQ+IC4uLlxuICAgIFNDUklQVF9FTkRJTkc6IFMrKyAvLyA8c2NyaXB0PiAuLi4gPFxuICB9XG5cbiAgc2F4LlhNTF9FTlRJVElFUyA9IHtcbiAgICAnYW1wJzogJyYnLFxuICAgICdndCc6ICc+JyxcbiAgICAnbHQnOiAnPCcsXG4gICAgJ3F1b3QnOiAnXCInLFxuICAgICdhcG9zJzogXCInXCJcbiAgfVxuXG4gIHNheC5FTlRJVElFUyA9IHtcbiAgICAnYW1wJzogJyYnLFxuICAgICdndCc6ICc+JyxcbiAgICAnbHQnOiAnPCcsXG4gICAgJ3F1b3QnOiAnXCInLFxuICAgICdhcG9zJzogXCInXCIsXG4gICAgJ0FFbGlnJzogMTk4LFxuICAgICdBYWN1dGUnOiAxOTMsXG4gICAgJ0FjaXJjJzogMTk0LFxuICAgICdBZ3JhdmUnOiAxOTIsXG4gICAgJ0FyaW5nJzogMTk3LFxuICAgICdBdGlsZGUnOiAxOTUsXG4gICAgJ0F1bWwnOiAxOTYsXG4gICAgJ0NjZWRpbCc6IDE5OSxcbiAgICAnRVRIJzogMjA4LFxuICAgICdFYWN1dGUnOiAyMDEsXG4gICAgJ0VjaXJjJzogMjAyLFxuICAgICdFZ3JhdmUnOiAyMDAsXG4gICAgJ0V1bWwnOiAyMDMsXG4gICAgJ0lhY3V0ZSc6IDIwNSxcbiAgICAnSWNpcmMnOiAyMDYsXG4gICAgJ0lncmF2ZSc6IDIwNCxcbiAgICAnSXVtbCc6IDIwNyxcbiAgICAnTnRpbGRlJzogMjA5LFxuICAgICdPYWN1dGUnOiAyMTEsXG4gICAgJ09jaXJjJzogMjEyLFxuICAgICdPZ3JhdmUnOiAyMTAsXG4gICAgJ09zbGFzaCc6IDIxNixcbiAgICAnT3RpbGRlJzogMjEzLFxuICAgICdPdW1sJzogMjE0LFxuICAgICdUSE9STic6IDIyMixcbiAgICAnVWFjdXRlJzogMjE4LFxuICAgICdVY2lyYyc6IDIxOSxcbiAgICAnVWdyYXZlJzogMjE3LFxuICAgICdVdW1sJzogMjIwLFxuICAgICdZYWN1dGUnOiAyMjEsXG4gICAgJ2FhY3V0ZSc6IDIyNSxcbiAgICAnYWNpcmMnOiAyMjYsXG4gICAgJ2FlbGlnJzogMjMwLFxuICAgICdhZ3JhdmUnOiAyMjQsXG4gICAgJ2FyaW5nJzogMjI5LFxuICAgICdhdGlsZGUnOiAyMjcsXG4gICAgJ2F1bWwnOiAyMjgsXG4gICAgJ2NjZWRpbCc6IDIzMSxcbiAgICAnZWFjdXRlJzogMjMzLFxuICAgICdlY2lyYyc6IDIzNCxcbiAgICAnZWdyYXZlJzogMjMyLFxuICAgICdldGgnOiAyNDAsXG4gICAgJ2V1bWwnOiAyMzUsXG4gICAgJ2lhY3V0ZSc6IDIzNyxcbiAgICAnaWNpcmMnOiAyMzgsXG4gICAgJ2lncmF2ZSc6IDIzNixcbiAgICAnaXVtbCc6IDIzOSxcbiAgICAnbnRpbGRlJzogMjQxLFxuICAgICdvYWN1dGUnOiAyNDMsXG4gICAgJ29jaXJjJzogMjQ0LFxuICAgICdvZ3JhdmUnOiAyNDIsXG4gICAgJ29zbGFzaCc6IDI0OCxcbiAgICAnb3RpbGRlJzogMjQ1LFxuICAgICdvdW1sJzogMjQ2LFxuICAgICdzemxpZyc6IDIyMyxcbiAgICAndGhvcm4nOiAyNTQsXG4gICAgJ3VhY3V0ZSc6IDI1MCxcbiAgICAndWNpcmMnOiAyNTEsXG4gICAgJ3VncmF2ZSc6IDI0OSxcbiAgICAndXVtbCc6IDI1MixcbiAgICAneWFjdXRlJzogMjUzLFxuICAgICd5dW1sJzogMjU1LFxuICAgICdjb3B5JzogMTY5LFxuICAgICdyZWcnOiAxNzQsXG4gICAgJ25ic3AnOiAxNjAsXG4gICAgJ2lleGNsJzogMTYxLFxuICAgICdjZW50JzogMTYyLFxuICAgICdwb3VuZCc6IDE2MyxcbiAgICAnY3VycmVuJzogMTY0LFxuICAgICd5ZW4nOiAxNjUsXG4gICAgJ2JydmJhcic6IDE2NixcbiAgICAnc2VjdCc6IDE2NyxcbiAgICAndW1sJzogMTY4LFxuICAgICdvcmRmJzogMTcwLFxuICAgICdsYXF1byc6IDE3MSxcbiAgICAnbm90JzogMTcyLFxuICAgICdzaHknOiAxNzMsXG4gICAgJ21hY3InOiAxNzUsXG4gICAgJ2RlZyc6IDE3NixcbiAgICAncGx1c21uJzogMTc3LFxuICAgICdzdXAxJzogMTg1LFxuICAgICdzdXAyJzogMTc4LFxuICAgICdzdXAzJzogMTc5LFxuICAgICdhY3V0ZSc6IDE4MCxcbiAgICAnbWljcm8nOiAxODEsXG4gICAgJ3BhcmEnOiAxODIsXG4gICAgJ21pZGRvdCc6IDE4MyxcbiAgICAnY2VkaWwnOiAxODQsXG4gICAgJ29yZG0nOiAxODYsXG4gICAgJ3JhcXVvJzogMTg3LFxuICAgICdmcmFjMTQnOiAxODgsXG4gICAgJ2ZyYWMxMic6IDE4OSxcbiAgICAnZnJhYzM0JzogMTkwLFxuICAgICdpcXVlc3QnOiAxOTEsXG4gICAgJ3RpbWVzJzogMjE1LFxuICAgICdkaXZpZGUnOiAyNDcsXG4gICAgJ09FbGlnJzogMzM4LFxuICAgICdvZWxpZyc6IDMzOSxcbiAgICAnU2Nhcm9uJzogMzUyLFxuICAgICdzY2Fyb24nOiAzNTMsXG4gICAgJ1l1bWwnOiAzNzYsXG4gICAgJ2Zub2YnOiA0MDIsXG4gICAgJ2NpcmMnOiA3MTAsXG4gICAgJ3RpbGRlJzogNzMyLFxuICAgICdBbHBoYSc6IDkxMyxcbiAgICAnQmV0YSc6IDkxNCxcbiAgICAnR2FtbWEnOiA5MTUsXG4gICAgJ0RlbHRhJzogOTE2LFxuICAgICdFcHNpbG9uJzogOTE3LFxuICAgICdaZXRhJzogOTE4LFxuICAgICdFdGEnOiA5MTksXG4gICAgJ1RoZXRhJzogOTIwLFxuICAgICdJb3RhJzogOTIxLFxuICAgICdLYXBwYSc6IDkyMixcbiAgICAnTGFtYmRhJzogOTIzLFxuICAgICdNdSc6IDkyNCxcbiAgICAnTnUnOiA5MjUsXG4gICAgJ1hpJzogOTI2LFxuICAgICdPbWljcm9uJzogOTI3LFxuICAgICdQaSc6IDkyOCxcbiAgICAnUmhvJzogOTI5LFxuICAgICdTaWdtYSc6IDkzMSxcbiAgICAnVGF1JzogOTMyLFxuICAgICdVcHNpbG9uJzogOTMzLFxuICAgICdQaGknOiA5MzQsXG4gICAgJ0NoaSc6IDkzNSxcbiAgICAnUHNpJzogOTM2LFxuICAgICdPbWVnYSc6IDkzNyxcbiAgICAnYWxwaGEnOiA5NDUsXG4gICAgJ2JldGEnOiA5NDYsXG4gICAgJ2dhbW1hJzogOTQ3LFxuICAgICdkZWx0YSc6IDk0OCxcbiAgICAnZXBzaWxvbic6IDk0OSxcbiAgICAnemV0YSc6IDk1MCxcbiAgICAnZXRhJzogOTUxLFxuICAgICd0aGV0YSc6IDk1MixcbiAgICAnaW90YSc6IDk1MyxcbiAgICAna2FwcGEnOiA5NTQsXG4gICAgJ2xhbWJkYSc6IDk1NSxcbiAgICAnbXUnOiA5NTYsXG4gICAgJ251JzogOTU3LFxuICAgICd4aSc6IDk1OCxcbiAgICAnb21pY3Jvbic6IDk1OSxcbiAgICAncGknOiA5NjAsXG4gICAgJ3Jobyc6IDk2MSxcbiAgICAnc2lnbWFmJzogOTYyLFxuICAgICdzaWdtYSc6IDk2MyxcbiAgICAndGF1JzogOTY0LFxuICAgICd1cHNpbG9uJzogOTY1LFxuICAgICdwaGknOiA5NjYsXG4gICAgJ2NoaSc6IDk2NyxcbiAgICAncHNpJzogOTY4LFxuICAgICdvbWVnYSc6IDk2OSxcbiAgICAndGhldGFzeW0nOiA5NzcsXG4gICAgJ3Vwc2loJzogOTc4LFxuICAgICdwaXYnOiA5ODIsXG4gICAgJ2Vuc3AnOiA4MTk0LFxuICAgICdlbXNwJzogODE5NSxcbiAgICAndGhpbnNwJzogODIwMSxcbiAgICAnenduaic6IDgyMDQsXG4gICAgJ3p3aic6IDgyMDUsXG4gICAgJ2xybSc6IDgyMDYsXG4gICAgJ3JsbSc6IDgyMDcsXG4gICAgJ25kYXNoJzogODIxMSxcbiAgICAnbWRhc2gnOiA4MjEyLFxuICAgICdsc3F1byc6IDgyMTYsXG4gICAgJ3JzcXVvJzogODIxNyxcbiAgICAnc2JxdW8nOiA4MjE4LFxuICAgICdsZHF1byc6IDgyMjAsXG4gICAgJ3JkcXVvJzogODIyMSxcbiAgICAnYmRxdW8nOiA4MjIyLFxuICAgICdkYWdnZXInOiA4MjI0LFxuICAgICdEYWdnZXInOiA4MjI1LFxuICAgICdidWxsJzogODIyNixcbiAgICAnaGVsbGlwJzogODIzMCxcbiAgICAncGVybWlsJzogODI0MCxcbiAgICAncHJpbWUnOiA4MjQyLFxuICAgICdQcmltZSc6IDgyNDMsXG4gICAgJ2xzYXF1byc6IDgyNDksXG4gICAgJ3JzYXF1byc6IDgyNTAsXG4gICAgJ29saW5lJzogODI1NCxcbiAgICAnZnJhc2wnOiA4MjYwLFxuICAgICdldXJvJzogODM2NCxcbiAgICAnaW1hZ2UnOiA4NDY1LFxuICAgICd3ZWllcnAnOiA4NDcyLFxuICAgICdyZWFsJzogODQ3NixcbiAgICAndHJhZGUnOiA4NDgyLFxuICAgICdhbGVmc3ltJzogODUwMSxcbiAgICAnbGFycic6IDg1OTIsXG4gICAgJ3VhcnInOiA4NTkzLFxuICAgICdyYXJyJzogODU5NCxcbiAgICAnZGFycic6IDg1OTUsXG4gICAgJ2hhcnInOiA4NTk2LFxuICAgICdjcmFycic6IDg2MjksXG4gICAgJ2xBcnInOiA4NjU2LFxuICAgICd1QXJyJzogODY1NyxcbiAgICAnckFycic6IDg2NTgsXG4gICAgJ2RBcnInOiA4NjU5LFxuICAgICdoQXJyJzogODY2MCxcbiAgICAnZm9yYWxsJzogODcwNCxcbiAgICAncGFydCc6IDg3MDYsXG4gICAgJ2V4aXN0JzogODcwNyxcbiAgICAnZW1wdHknOiA4NzA5LFxuICAgICduYWJsYSc6IDg3MTEsXG4gICAgJ2lzaW4nOiA4NzEyLFxuICAgICdub3Rpbic6IDg3MTMsXG4gICAgJ25pJzogODcxNSxcbiAgICAncHJvZCc6IDg3MTksXG4gICAgJ3N1bSc6IDg3MjEsXG4gICAgJ21pbnVzJzogODcyMixcbiAgICAnbG93YXN0JzogODcyNyxcbiAgICAncmFkaWMnOiA4NzMwLFxuICAgICdwcm9wJzogODczMyxcbiAgICAnaW5maW4nOiA4NzM0LFxuICAgICdhbmcnOiA4NzM2LFxuICAgICdhbmQnOiA4NzQzLFxuICAgICdvcic6IDg3NDQsXG4gICAgJ2NhcCc6IDg3NDUsXG4gICAgJ2N1cCc6IDg3NDYsXG4gICAgJ2ludCc6IDg3NDcsXG4gICAgJ3RoZXJlNCc6IDg3NTYsXG4gICAgJ3NpbSc6IDg3NjQsXG4gICAgJ2NvbmcnOiA4NzczLFxuICAgICdhc3ltcCc6IDg3NzYsXG4gICAgJ25lJzogODgwMCxcbiAgICAnZXF1aXYnOiA4ODAxLFxuICAgICdsZSc6IDg4MDQsXG4gICAgJ2dlJzogODgwNSxcbiAgICAnc3ViJzogODgzNCxcbiAgICAnc3VwJzogODgzNSxcbiAgICAnbnN1Yic6IDg4MzYsXG4gICAgJ3N1YmUnOiA4ODM4LFxuICAgICdzdXBlJzogODgzOSxcbiAgICAnb3BsdXMnOiA4ODUzLFxuICAgICdvdGltZXMnOiA4ODU1LFxuICAgICdwZXJwJzogODg2OSxcbiAgICAnc2RvdCc6IDg5MDEsXG4gICAgJ2xjZWlsJzogODk2OCxcbiAgICAncmNlaWwnOiA4OTY5LFxuICAgICdsZmxvb3InOiA4OTcwLFxuICAgICdyZmxvb3InOiA4OTcxLFxuICAgICdsYW5nJzogOTAwMSxcbiAgICAncmFuZyc6IDkwMDIsXG4gICAgJ2xveic6IDk2NzQsXG4gICAgJ3NwYWRlcyc6IDk4MjQsXG4gICAgJ2NsdWJzJzogOTgyNyxcbiAgICAnaGVhcnRzJzogOTgyOSxcbiAgICAnZGlhbXMnOiA5ODMwXG4gIH1cblxuICBPYmplY3Qua2V5cyhzYXguRU5USVRJRVMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlID0gc2F4LkVOVElUSUVTW2tleV1cbiAgICB2YXIgcyA9IHR5cGVvZiBlID09PSAnbnVtYmVyJyA/IFN0cmluZy5mcm9tQ2hhckNvZGUoZSkgOiBlXG4gICAgc2F4LkVOVElUSUVTW2tleV0gPSBzXG4gIH0pXG5cbiAgZm9yICh2YXIgcyBpbiBzYXguU1RBVEUpIHtcbiAgICBzYXguU1RBVEVbc2F4LlNUQVRFW3NdXSA9IHNcbiAgfVxuXG4gIC8vIHNob3J0aGFuZFxuICBTID0gc2F4LlNUQVRFXG5cbiAgZnVuY3Rpb24gZW1pdCAocGFyc2VyLCBldmVudCwgZGF0YSkge1xuICAgIHBhcnNlcltldmVudF0gJiYgcGFyc2VyW2V2ZW50XShkYXRhKVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdE5vZGUgKHBhcnNlciwgbm9kZVR5cGUsIGRhdGEpIHtcbiAgICBpZiAocGFyc2VyLnRleHROb2RlKSBjbG9zZVRleHQocGFyc2VyKVxuICAgIGVtaXQocGFyc2VyLCBub2RlVHlwZSwgZGF0YSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlVGV4dCAocGFyc2VyKSB7XG4gICAgcGFyc2VyLnRleHROb2RlID0gdGV4dG9wdHMocGFyc2VyLm9wdCwgcGFyc2VyLnRleHROb2RlKVxuICAgIGlmIChwYXJzZXIudGV4dE5vZGUpIGVtaXQocGFyc2VyLCAnb250ZXh0JywgcGFyc2VyLnRleHROb2RlKVxuICAgIHBhcnNlci50ZXh0Tm9kZSA9ICcnXG4gIH1cblxuICBmdW5jdGlvbiB0ZXh0b3B0cyAob3B0LCB0ZXh0KSB7XG4gICAgaWYgKG9wdC50cmltKSB0ZXh0ID0gdGV4dC50cmltKClcbiAgICBpZiAob3B0Lm5vcm1hbGl6ZSkgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxzKy9nLCAnICcpXG4gICAgcmV0dXJuIHRleHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGVycm9yIChwYXJzZXIsIGVyKSB7XG4gICAgY2xvc2VUZXh0KHBhcnNlcilcbiAgICBpZiAocGFyc2VyLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgIGVyICs9ICdcXG5MaW5lOiAnICsgcGFyc2VyLmxpbmUgK1xuICAgICAgICAnXFxuQ29sdW1uOiAnICsgcGFyc2VyLmNvbHVtbiArXG4gICAgICAgICdcXG5DaGFyOiAnICsgcGFyc2VyLmNcbiAgICB9XG4gICAgZXIgPSBuZXcgRXJyb3IoZXIpXG4gICAgcGFyc2VyLmVycm9yID0gZXJcbiAgICBlbWl0KHBhcnNlciwgJ29uZXJyb3InLCBlcilcbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICBmdW5jdGlvbiBlbmQgKHBhcnNlcikge1xuICAgIGlmIChwYXJzZXIuc2F3Um9vdCAmJiAhcGFyc2VyLmNsb3NlZFJvb3QpIHN0cmljdEZhaWwocGFyc2VyLCAnVW5jbG9zZWQgcm9vdCB0YWcnKVxuICAgIGlmICgocGFyc2VyLnN0YXRlICE9PSBTLkJFR0lOKSAmJlxuICAgICAgKHBhcnNlci5zdGF0ZSAhPT0gUy5CRUdJTl9XSElURVNQQUNFKSAmJlxuICAgICAgKHBhcnNlci5zdGF0ZSAhPT0gUy5URVhUKSkge1xuICAgICAgZXJyb3IocGFyc2VyLCAnVW5leHBlY3RlZCBlbmQnKVxuICAgIH1cbiAgICBjbG9zZVRleHQocGFyc2VyKVxuICAgIHBhcnNlci5jID0gJydcbiAgICBwYXJzZXIuY2xvc2VkID0gdHJ1ZVxuICAgIGVtaXQocGFyc2VyLCAnb25lbmQnKVxuICAgIFNBWFBhcnNlci5jYWxsKHBhcnNlciwgcGFyc2VyLnN0cmljdCwgcGFyc2VyLm9wdClcbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICBmdW5jdGlvbiBzdHJpY3RGYWlsIChwYXJzZXIsIG1lc3NhZ2UpIHtcbiAgICBpZiAodHlwZW9mIHBhcnNlciAhPT0gJ29iamVjdCcgfHwgIShwYXJzZXIgaW5zdGFuY2VvZiBTQVhQYXJzZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBjYWxsIHRvIHN0cmljdEZhaWwnKVxuICAgIH1cbiAgICBpZiAocGFyc2VyLnN0cmljdCkge1xuICAgICAgZXJyb3IocGFyc2VyLCBtZXNzYWdlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1RhZyAocGFyc2VyKSB7XG4gICAgaWYgKCFwYXJzZXIuc3RyaWN0KSBwYXJzZXIudGFnTmFtZSA9IHBhcnNlci50YWdOYW1lW3BhcnNlci5sb29zZUNhc2VdKClcbiAgICB2YXIgcGFyZW50ID0gcGFyc2VyLnRhZ3NbcGFyc2VyLnRhZ3MubGVuZ3RoIC0gMV0gfHwgcGFyc2VyXG4gICAgdmFyIHRhZyA9IHBhcnNlci50YWcgPSB7IG5hbWU6IHBhcnNlci50YWdOYW1lLCBhdHRyaWJ1dGVzOiB7fSB9XG5cbiAgICAvLyB3aWxsIGJlIG92ZXJyaWRkZW4gaWYgdGFnIGNvbnRhaWxzIGFuIHhtbG5zPVwiZm9vXCIgb3IgeG1sbnM6Zm9vPVwiYmFyXCJcbiAgICBpZiAocGFyc2VyLm9wdC54bWxucykge1xuICAgICAgdGFnLm5zID0gcGFyZW50Lm5zXG4gICAgfVxuICAgIHBhcnNlci5hdHRyaWJMaXN0Lmxlbmd0aCA9IDBcbiAgICBlbWl0Tm9kZShwYXJzZXIsICdvbm9wZW50YWdzdGFydCcsIHRhZylcbiAgfVxuXG4gIGZ1bmN0aW9uIHFuYW1lIChuYW1lLCBhdHRyaWJ1dGUpIHtcbiAgICB2YXIgaSA9IG5hbWUuaW5kZXhPZignOicpXG4gICAgdmFyIHF1YWxOYW1lID0gaSA8IDAgPyBbICcnLCBuYW1lIF0gOiBuYW1lLnNwbGl0KCc6JylcbiAgICB2YXIgcHJlZml4ID0gcXVhbE5hbWVbMF1cbiAgICB2YXIgbG9jYWwgPSBxdWFsTmFtZVsxXVxuXG4gICAgLy8gPHggXCJ4bWxuc1wiPVwiaHR0cDovL2Zvb1wiPlxuICAgIGlmIChhdHRyaWJ1dGUgJiYgbmFtZSA9PT0gJ3htbG5zJykge1xuICAgICAgcHJlZml4ID0gJ3htbG5zJ1xuICAgICAgbG9jYWwgPSAnJ1xuICAgIH1cblxuICAgIHJldHVybiB7IHByZWZpeDogcHJlZml4LCBsb2NhbDogbG9jYWwgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXR0cmliIChwYXJzZXIpIHtcbiAgICBpZiAoIXBhcnNlci5zdHJpY3QpIHtcbiAgICAgIHBhcnNlci5hdHRyaWJOYW1lID0gcGFyc2VyLmF0dHJpYk5hbWVbcGFyc2VyLmxvb3NlQ2FzZV0oKVxuICAgIH1cblxuICAgIGlmIChwYXJzZXIuYXR0cmliTGlzdC5pbmRleE9mKHBhcnNlci5hdHRyaWJOYW1lKSAhPT0gLTEgfHxcbiAgICAgIHBhcnNlci50YWcuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShwYXJzZXIuYXR0cmliTmFtZSkpIHtcbiAgICAgIHBhcnNlci5hdHRyaWJOYW1lID0gcGFyc2VyLmF0dHJpYlZhbHVlID0gJydcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChwYXJzZXIub3B0LnhtbG5zKSB7XG4gICAgICB2YXIgcW4gPSBxbmFtZShwYXJzZXIuYXR0cmliTmFtZSwgdHJ1ZSlcbiAgICAgIHZhciBwcmVmaXggPSBxbi5wcmVmaXhcbiAgICAgIHZhciBsb2NhbCA9IHFuLmxvY2FsXG5cbiAgICAgIGlmIChwcmVmaXggPT09ICd4bWxucycpIHtcbiAgICAgICAgLy8gbmFtZXNwYWNlIGJpbmRpbmcgYXR0cmlidXRlLiBwdXNoIHRoZSBiaW5kaW5nIGludG8gc2NvcGVcbiAgICAgICAgaWYgKGxvY2FsID09PSAneG1sJyAmJiBwYXJzZXIuYXR0cmliVmFsdWUgIT09IFhNTF9OQU1FU1BBQ0UpIHtcbiAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlcixcbiAgICAgICAgICAgICd4bWw6IHByZWZpeCBtdXN0IGJlIGJvdW5kIHRvICcgKyBYTUxfTkFNRVNQQUNFICsgJ1xcbicgK1xuICAgICAgICAgICAgJ0FjdHVhbDogJyArIHBhcnNlci5hdHRyaWJWYWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbCA9PT0gJ3htbG5zJyAmJiBwYXJzZXIuYXR0cmliVmFsdWUgIT09IFhNTE5TX05BTUVTUEFDRSkge1xuICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLFxuICAgICAgICAgICAgJ3htbG5zOiBwcmVmaXggbXVzdCBiZSBib3VuZCB0byAnICsgWE1MTlNfTkFNRVNQQUNFICsgJ1xcbicgK1xuICAgICAgICAgICAgJ0FjdHVhbDogJyArIHBhcnNlci5hdHRyaWJWYWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdGFnID0gcGFyc2VyLnRhZ1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBwYXJzZXIudGFnc1twYXJzZXIudGFncy5sZW5ndGggLSAxXSB8fCBwYXJzZXJcbiAgICAgICAgICBpZiAodGFnLm5zID09PSBwYXJlbnQubnMpIHtcbiAgICAgICAgICAgIHRhZy5ucyA9IE9iamVjdC5jcmVhdGUocGFyZW50Lm5zKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0YWcubnNbbG9jYWxdID0gcGFyc2VyLmF0dHJpYlZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZGVmZXIgb25hdHRyaWJ1dGUgZXZlbnRzIHVudGlsIGFsbCBhdHRyaWJ1dGVzIGhhdmUgYmVlbiBzZWVuXG4gICAgICAvLyBzbyBhbnkgbmV3IGJpbmRpbmdzIGNhbiB0YWtlIGVmZmVjdC4gcHJlc2VydmUgYXR0cmlidXRlIG9yZGVyXG4gICAgICAvLyBzbyBkZWZlcnJlZCBldmVudHMgY2FuIGJlIGVtaXR0ZWQgaW4gZG9jdW1lbnQgb3JkZXJcbiAgICAgIHBhcnNlci5hdHRyaWJMaXN0LnB1c2goW3BhcnNlci5hdHRyaWJOYW1lLCBwYXJzZXIuYXR0cmliVmFsdWVdKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbiBub24teG1sbnMgbW9kZSwgd2UgY2FuIGVtaXQgdGhlIGV2ZW50IHJpZ2h0IGF3YXlcbiAgICAgIHBhcnNlci50YWcuYXR0cmlidXRlc1twYXJzZXIuYXR0cmliTmFtZV0gPSBwYXJzZXIuYXR0cmliVmFsdWVcbiAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uYXR0cmlidXRlJywge1xuICAgICAgICBuYW1lOiBwYXJzZXIuYXR0cmliTmFtZSxcbiAgICAgICAgdmFsdWU6IHBhcnNlci5hdHRyaWJWYWx1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBwYXJzZXIuYXR0cmliTmFtZSA9IHBhcnNlci5hdHRyaWJWYWx1ZSA9ICcnXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuVGFnIChwYXJzZXIsIHNlbGZDbG9zaW5nKSB7XG4gICAgaWYgKHBhcnNlci5vcHQueG1sbnMpIHtcbiAgICAgIC8vIGVtaXQgbmFtZXNwYWNlIGJpbmRpbmcgZXZlbnRzXG4gICAgICB2YXIgdGFnID0gcGFyc2VyLnRhZ1xuXG4gICAgICAvLyBhZGQgbmFtZXNwYWNlIGluZm8gdG8gdGFnXG4gICAgICB2YXIgcW4gPSBxbmFtZShwYXJzZXIudGFnTmFtZSlcbiAgICAgIHRhZy5wcmVmaXggPSBxbi5wcmVmaXhcbiAgICAgIHRhZy5sb2NhbCA9IHFuLmxvY2FsXG4gICAgICB0YWcudXJpID0gdGFnLm5zW3FuLnByZWZpeF0gfHwgJydcblxuICAgICAgaWYgKHRhZy5wcmVmaXggJiYgIXRhZy51cmkpIHtcbiAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdVbmJvdW5kIG5hbWVzcGFjZSBwcmVmaXg6ICcgK1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHBhcnNlci50YWdOYW1lKSlcbiAgICAgICAgdGFnLnVyaSA9IHFuLnByZWZpeFxuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gcGFyc2VyLnRhZ3NbcGFyc2VyLnRhZ3MubGVuZ3RoIC0gMV0gfHwgcGFyc2VyXG4gICAgICBpZiAodGFnLm5zICYmIHBhcmVudC5ucyAhPT0gdGFnLm5zKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRhZy5ucykuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29ub3Blbm5hbWVzcGFjZScsIHtcbiAgICAgICAgICAgIHByZWZpeDogcCxcbiAgICAgICAgICAgIHVyaTogdGFnLm5zW3BdXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gaGFuZGxlIGRlZmVycmVkIG9uYXR0cmlidXRlIGV2ZW50c1xuICAgICAgLy8gTm90ZTogZG8gbm90IGFwcGx5IGRlZmF1bHQgbnMgdG8gYXR0cmlidXRlczpcbiAgICAgIC8vICAgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLXhtbC1uYW1lcy8jZGVmYXVsdGluZ1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXJzZXIuYXR0cmliTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIG52ID0gcGFyc2VyLmF0dHJpYkxpc3RbaV1cbiAgICAgICAgdmFyIG5hbWUgPSBudlswXVxuICAgICAgICB2YXIgdmFsdWUgPSBudlsxXVxuICAgICAgICB2YXIgcXVhbE5hbWUgPSBxbmFtZShuYW1lLCB0cnVlKVxuICAgICAgICB2YXIgcHJlZml4ID0gcXVhbE5hbWUucHJlZml4XG4gICAgICAgIHZhciBsb2NhbCA9IHF1YWxOYW1lLmxvY2FsXG4gICAgICAgIHZhciB1cmkgPSBwcmVmaXggPT09ICcnID8gJycgOiAodGFnLm5zW3ByZWZpeF0gfHwgJycpXG4gICAgICAgIHZhciBhID0ge1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICAgIGxvY2FsOiBsb2NhbCxcbiAgICAgICAgICB1cmk6IHVyaVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlcmUncyBhbnkgYXR0cmlidXRlcyB3aXRoIGFuIHVuZGVmaW5lZCBuYW1lc3BhY2UsXG4gICAgICAgIC8vIHRoZW4gZmFpbCBvbiB0aGVtIG5vdy5cbiAgICAgICAgaWYgKHByZWZpeCAmJiBwcmVmaXggIT09ICd4bWxucycgJiYgIXVyaSkge1xuICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnVW5ib3VuZCBuYW1lc3BhY2UgcHJlZml4OiAnICtcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHByZWZpeCkpXG4gICAgICAgICAgYS51cmkgPSBwcmVmaXhcbiAgICAgICAgfVxuICAgICAgICBwYXJzZXIudGFnLmF0dHJpYnV0ZXNbbmFtZV0gPSBhXG4gICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uYXR0cmlidXRlJywgYSlcbiAgICAgIH1cbiAgICAgIHBhcnNlci5hdHRyaWJMaXN0Lmxlbmd0aCA9IDBcbiAgICB9XG5cbiAgICBwYXJzZXIudGFnLmlzU2VsZkNsb3NpbmcgPSAhIXNlbGZDbG9zaW5nXG5cbiAgICAvLyBwcm9jZXNzIHRoZSB0YWdcbiAgICBwYXJzZXIuc2F3Um9vdCA9IHRydWVcbiAgICBwYXJzZXIudGFncy5wdXNoKHBhcnNlci50YWcpXG4gICAgZW1pdE5vZGUocGFyc2VyLCAnb25vcGVudGFnJywgcGFyc2VyLnRhZylcbiAgICBpZiAoIXNlbGZDbG9zaW5nKSB7XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDxzY3JpcHQ+IGluIG5vbi1zdHJpY3QgbW9kZS5cbiAgICAgIGlmICghcGFyc2VyLm5vc2NyaXB0ICYmIHBhcnNlci50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzY3JpcHQnKSB7XG4gICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuU0NSSVBUXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlRFWFRcbiAgICAgIH1cbiAgICAgIHBhcnNlci50YWcgPSBudWxsXG4gICAgICBwYXJzZXIudGFnTmFtZSA9ICcnXG4gICAgfVxuICAgIHBhcnNlci5hdHRyaWJOYW1lID0gcGFyc2VyLmF0dHJpYlZhbHVlID0gJydcbiAgICBwYXJzZXIuYXR0cmliTGlzdC5sZW5ndGggPSAwXG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZVRhZyAocGFyc2VyKSB7XG4gICAgaWYgKCFwYXJzZXIudGFnTmFtZSkge1xuICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdXZWlyZCBlbXB0eSBjbG9zZSB0YWcuJylcbiAgICAgIHBhcnNlci50ZXh0Tm9kZSArPSAnPC8+J1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAocGFyc2VyLnNjcmlwdCkge1xuICAgICAgaWYgKHBhcnNlci50YWdOYW1lICE9PSAnc2NyaXB0Jykge1xuICAgICAgICBwYXJzZXIuc2NyaXB0ICs9ICc8LycgKyBwYXJzZXIudGFnTmFtZSArICc+J1xuICAgICAgICBwYXJzZXIudGFnTmFtZSA9ICcnXG4gICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuU0NSSVBUXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25zY3JpcHQnLCBwYXJzZXIuc2NyaXB0KVxuICAgICAgcGFyc2VyLnNjcmlwdCA9ICcnXG4gICAgfVxuXG4gICAgLy8gZmlyc3QgbWFrZSBzdXJlIHRoYXQgdGhlIGNsb3NpbmcgdGFnIGFjdHVhbGx5IGV4aXN0cy5cbiAgICAvLyA8YT48Yj48L2M+PC9iPjwvYT4gd2lsbCBjbG9zZSBldmVyeXRoaW5nLCBvdGhlcndpc2UuXG4gICAgdmFyIHQgPSBwYXJzZXIudGFncy5sZW5ndGhcbiAgICB2YXIgdGFnTmFtZSA9IHBhcnNlci50YWdOYW1lXG4gICAgaWYgKCFwYXJzZXIuc3RyaWN0KSB7XG4gICAgICB0YWdOYW1lID0gdGFnTmFtZVtwYXJzZXIubG9vc2VDYXNlXSgpXG4gICAgfVxuICAgIHZhciBjbG9zZVRvID0gdGFnTmFtZVxuICAgIHdoaWxlICh0LS0pIHtcbiAgICAgIHZhciBjbG9zZSA9IHBhcnNlci50YWdzW3RdXG4gICAgICBpZiAoY2xvc2UubmFtZSAhPT0gY2xvc2VUbykge1xuICAgICAgICAvLyBmYWlsIHRoZSBmaXJzdCB0aW1lIGluIHN0cmljdCBtb2RlXG4gICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnVW5leHBlY3RlZCBjbG9zZSB0YWcnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkaWRuJ3QgZmluZCBpdC4gIHdlIGFscmVhZHkgZmFpbGVkIGZvciBzdHJpY3QsIHNvIGp1c3QgYWJvcnQuXG4gICAgaWYgKHQgPCAwKSB7XG4gICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ1VubWF0Y2hlZCBjbG9zaW5nIHRhZzogJyArIHBhcnNlci50YWdOYW1lKVxuICAgICAgcGFyc2VyLnRleHROb2RlICs9ICc8LycgKyBwYXJzZXIudGFnTmFtZSArICc+J1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcGFyc2VyLnRhZ05hbWUgPSB0YWdOYW1lXG4gICAgdmFyIHMgPSBwYXJzZXIudGFncy5sZW5ndGhcbiAgICB3aGlsZSAocy0tID4gdCkge1xuICAgICAgdmFyIHRhZyA9IHBhcnNlci50YWcgPSBwYXJzZXIudGFncy5wb3AoKVxuICAgICAgcGFyc2VyLnRhZ05hbWUgPSBwYXJzZXIudGFnLm5hbWVcbiAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uY2xvc2V0YWcnLCBwYXJzZXIudGFnTmFtZSlcblxuICAgICAgdmFyIHggPSB7fVxuICAgICAgZm9yICh2YXIgaSBpbiB0YWcubnMpIHtcbiAgICAgICAgeFtpXSA9IHRhZy5uc1tpXVxuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gcGFyc2VyLnRhZ3NbcGFyc2VyLnRhZ3MubGVuZ3RoIC0gMV0gfHwgcGFyc2VyXG4gICAgICBpZiAocGFyc2VyLm9wdC54bWxucyAmJiB0YWcubnMgIT09IHBhcmVudC5ucykge1xuICAgICAgICAvLyByZW1vdmUgbmFtZXNwYWNlIGJpbmRpbmdzIGludHJvZHVjZWQgYnkgdGFnXG4gICAgICAgIE9iamVjdC5rZXlzKHRhZy5ucykuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgICAgIHZhciBuID0gdGFnLm5zW3BdXG4gICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jbG9zZW5hbWVzcGFjZScsIHsgcHJlZml4OiBwLCB1cmk6IG4gfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHQgPT09IDApIHBhcnNlci5jbG9zZWRSb290ID0gdHJ1ZVxuICAgIHBhcnNlci50YWdOYW1lID0gcGFyc2VyLmF0dHJpYlZhbHVlID0gcGFyc2VyLmF0dHJpYk5hbWUgPSAnJ1xuICAgIHBhcnNlci5hdHRyaWJMaXN0Lmxlbmd0aCA9IDBcbiAgICBwYXJzZXIuc3RhdGUgPSBTLlRFWFRcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRW50aXR5IChwYXJzZXIpIHtcbiAgICB2YXIgZW50aXR5ID0gcGFyc2VyLmVudGl0eVxuICAgIHZhciBlbnRpdHlMQyA9IGVudGl0eS50b0xvd2VyQ2FzZSgpXG4gICAgdmFyIG51bVxuICAgIHZhciBudW1TdHIgPSAnJ1xuXG4gICAgaWYgKHBhcnNlci5FTlRJVElFU1tlbnRpdHldKSB7XG4gICAgICByZXR1cm4gcGFyc2VyLkVOVElUSUVTW2VudGl0eV1cbiAgICB9XG4gICAgaWYgKHBhcnNlci5FTlRJVElFU1tlbnRpdHlMQ10pIHtcbiAgICAgIHJldHVybiBwYXJzZXIuRU5USVRJRVNbZW50aXR5TENdXG4gICAgfVxuICAgIGVudGl0eSA9IGVudGl0eUxDXG4gICAgaWYgKGVudGl0eS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgaWYgKGVudGl0eS5jaGFyQXQoMSkgPT09ICd4Jykge1xuICAgICAgICBlbnRpdHkgPSBlbnRpdHkuc2xpY2UoMilcbiAgICAgICAgbnVtID0gcGFyc2VJbnQoZW50aXR5LCAxNilcbiAgICAgICAgbnVtU3RyID0gbnVtLnRvU3RyaW5nKDE2KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50aXR5ID0gZW50aXR5LnNsaWNlKDEpXG4gICAgICAgIG51bSA9IHBhcnNlSW50KGVudGl0eSwgMTApXG4gICAgICAgIG51bVN0ciA9IG51bS50b1N0cmluZygxMClcbiAgICAgIH1cbiAgICB9XG4gICAgZW50aXR5ID0gZW50aXR5LnJlcGxhY2UoL14wKy8sICcnKVxuICAgIGlmIChpc05hTihudW0pIHx8IG51bVN0ci50b0xvd2VyQ2FzZSgpICE9PSBlbnRpdHkpIHtcbiAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXIgZW50aXR5JylcbiAgICAgIHJldHVybiAnJicgKyBwYXJzZXIuZW50aXR5ICsgJzsnXG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KG51bSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGJlZ2luV2hpdGVTcGFjZSAocGFyc2VyLCBjKSB7XG4gICAgaWYgKGMgPT09ICc8Jykge1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5PUEVOX1dBS0FcbiAgICAgIHBhcnNlci5zdGFydFRhZ1Bvc2l0aW9uID0gcGFyc2VyLnBvc2l0aW9uXG4gICAgfSBlbHNlIGlmICghaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAvLyBoYXZlIHRvIHByb2Nlc3MgdGhpcyBhcyBhIHRleHQgbm9kZS5cbiAgICAgIC8vIHdlaXJkLCBidXQgaGFwcGVucy5cbiAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnTm9uLXdoaXRlc3BhY2UgYmVmb3JlIGZpcnN0IHRhZy4nKVxuICAgICAgcGFyc2VyLnRleHROb2RlID0gY1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hhckF0IChjaHVuaywgaSkge1xuICAgIHZhciByZXN1bHQgPSAnJ1xuICAgIGlmIChpIDwgY2h1bmsubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSBjaHVuay5jaGFyQXQoaSlcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGUgKGNodW5rKSB7XG4gICAgdmFyIHBhcnNlciA9IHRoaXNcbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgdGhyb3cgdGhpcy5lcnJvclxuICAgIH1cbiAgICBpZiAocGFyc2VyLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIGVycm9yKHBhcnNlcixcbiAgICAgICAgJ0Nhbm5vdCB3cml0ZSBhZnRlciBjbG9zZS4gQXNzaWduIGFuIG9ucmVhZHkgaGFuZGxlci4nKVxuICAgIH1cbiAgICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBlbmQocGFyc2VyKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNodW5rID09PSAnb2JqZWN0Jykge1xuICAgICAgY2h1bmsgPSBjaHVuay50b1N0cmluZygpXG4gICAgfVxuICAgIHZhciBpID0gMFxuICAgIHZhciBjID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgYyA9IGNoYXJBdChjaHVuaywgaSsrKVxuICAgICAgcGFyc2VyLmMgPSBjXG5cbiAgICAgIGlmICghYykge1xuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VyLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgcGFyc2VyLnBvc2l0aW9uKytcbiAgICAgICAgaWYgKGMgPT09ICdcXG4nKSB7XG4gICAgICAgICAgcGFyc2VyLmxpbmUrK1xuICAgICAgICAgIHBhcnNlci5jb2x1bW4gPSAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyc2VyLmNvbHVtbisrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChwYXJzZXIuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBTLkJFR0lOOlxuICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQkVHSU5fV0hJVEVTUEFDRVxuICAgICAgICAgIGlmIChjID09PSAnXFx1RkVGRicpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJlZ2luV2hpdGVTcGFjZShwYXJzZXIsIGMpXG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQkVHSU5fV0hJVEVTUEFDRTpcbiAgICAgICAgICBiZWdpbldoaXRlU3BhY2UocGFyc2VyLCBjKVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLlRFWFQ6XG4gICAgICAgICAgaWYgKHBhcnNlci5zYXdSb290ICYmICFwYXJzZXIuY2xvc2VkUm9vdCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0aSA9IGkgLSAxXG4gICAgICAgICAgICB3aGlsZSAoYyAmJiBjICE9PSAnPCcgJiYgYyAhPT0gJyYnKSB7XG4gICAgICAgICAgICAgIGMgPSBjaGFyQXQoY2h1bmssIGkrKylcbiAgICAgICAgICAgICAgaWYgKGMgJiYgcGFyc2VyLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIucG9zaXRpb24rK1xuICAgICAgICAgICAgICAgIGlmIChjID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgcGFyc2VyLmxpbmUrK1xuICAgICAgICAgICAgICAgICAgcGFyc2VyLmNvbHVtbiA9IDBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGFyc2VyLmNvbHVtbisrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXIudGV4dE5vZGUgKz0gY2h1bmsuc3Vic3RyaW5nKHN0YXJ0aSwgaSAtIDEpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjID09PSAnPCcgJiYgIShwYXJzZXIuc2F3Um9vdCAmJiBwYXJzZXIuY2xvc2VkUm9vdCAmJiAhcGFyc2VyLnN0cmljdCkpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuT1BFTl9XQUtBXG4gICAgICAgICAgICBwYXJzZXIuc3RhcnRUYWdQb3NpdGlvbiA9IHBhcnNlci5wb3NpdGlvblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZShjKSAmJiAoIXBhcnNlci5zYXdSb290IHx8IHBhcnNlci5jbG9zZWRSb290KSkge1xuICAgICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ1RleHQgZGF0YSBvdXRzaWRlIG9mIHJvb3Qgbm9kZS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPT09ICcmJykge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlRFWFRfRU5USVRZXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwYXJzZXIudGV4dE5vZGUgKz0gY1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5TQ1JJUFQ6XG4gICAgICAgICAgLy8gb25seSBub24tc3RyaWN0XG4gICAgICAgICAgaWYgKGMgPT09ICc8Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TQ1JJUFRfRU5ESU5HXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zY3JpcHQgKz0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5TQ1JJUFRfRU5ESU5HOlxuICAgICAgICAgIGlmIChjID09PSAnLycpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ0xPU0VfVEFHXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zY3JpcHQgKz0gJzwnICsgY1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TQ1JJUFRcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuT1BFTl9XQUtBOlxuICAgICAgICAgIC8vIGVpdGhlciBhIC8sID8sICEsIG9yIHRleHQgaXMgY29taW5nIG5leHQuXG4gICAgICAgICAgaWYgKGMgPT09ICchJykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TR01MX0RFQ0xcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCA9ICcnXG4gICAgICAgICAgfSBlbHNlIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIC8vIHdhaXQgZm9yIGl0Li4uXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuT1BFTl9UQUdcbiAgICAgICAgICAgIHBhcnNlci50YWdOYW1lID0gY1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJy8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNMT1NFX1RBR1xuICAgICAgICAgICAgcGFyc2VyLnRhZ05hbWUgPSAnJ1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJz8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlBST0NfSU5TVFxuICAgICAgICAgICAgcGFyc2VyLnByb2NJbnN0TmFtZSA9IHBhcnNlci5wcm9jSW5zdEJvZHkgPSAnJ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ1VuZW5jb2RlZCA8JylcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIHdhcyBzb21lIHdoaXRlc3BhY2UsIHRoZW4gYWRkIHRoYXQgaW4uXG4gICAgICAgICAgICBpZiAocGFyc2VyLnN0YXJ0VGFnUG9zaXRpb24gKyAxIDwgcGFyc2VyLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHZhciBwYWQgPSBwYXJzZXIucG9zaXRpb24gLSBwYXJzZXIuc3RhcnRUYWdQb3NpdGlvblxuICAgICAgICAgICAgICBjID0gbmV3IEFycmF5KHBhZCkuam9pbignICcpICsgY1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VyLnRleHROb2RlICs9ICc8JyArIGNcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuVEVYVFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5TR01MX0RFQ0w6XG4gICAgICAgICAgaWYgKChwYXJzZXIuc2dtbERlY2wgKyBjKS50b1VwcGVyQ2FzZSgpID09PSBDREFUQSkge1xuICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25vcGVuY2RhdGEnKVxuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5DREFUQVxuICAgICAgICAgICAgcGFyc2VyLnNnbWxEZWNsID0gJydcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSA9ICcnXG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJzZXIuc2dtbERlY2wgKyBjID09PSAnLS0nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNPTU1FTlRcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ID0gJydcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCA9ICcnXG4gICAgICAgICAgfSBlbHNlIGlmICgocGFyc2VyLnNnbWxEZWNsICsgYykudG9VcHBlckNhc2UoKSA9PT0gRE9DVFlQRSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5ET0NUWVBFXG4gICAgICAgICAgICBpZiAocGFyc2VyLmRvY3R5cGUgfHwgcGFyc2VyLnNhd1Jvb3QpIHtcbiAgICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsXG4gICAgICAgICAgICAgICAgJ0luYXBwcm9wcmlhdGVseSBsb2NhdGVkIGRvY3R5cGUgZGVjbGFyYXRpb24nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VyLmRvY3R5cGUgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnNnbWxEZWNsID0gJydcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25zZ21sZGVjbGFyYXRpb24nLCBwYXJzZXIuc2dtbERlY2wpXG4gICAgICAgICAgICBwYXJzZXIuc2dtbERlY2wgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfSBlbHNlIGlmIChpc1F1b3RlKGMpKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlNHTUxfREVDTF9RVU9URURcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCArPSBjXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCArPSBjXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLlNHTUxfREVDTF9RVU9URUQ6XG4gICAgICAgICAgaWYgKGMgPT09IHBhcnNlci5xKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlNHTUxfREVDTFxuICAgICAgICAgICAgcGFyc2VyLnEgPSAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJzZXIuc2dtbERlY2wgKz0gY1xuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkRPQ1RZUEU6XG4gICAgICAgICAgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgICBlbWl0Tm9kZShwYXJzZXIsICdvbmRvY3R5cGUnLCBwYXJzZXIuZG9jdHlwZSlcbiAgICAgICAgICAgIHBhcnNlci5kb2N0eXBlID0gdHJ1ZSAvLyBqdXN0IHJlbWVtYmVyIHRoYXQgd2Ugc2F3IGl0LlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZXIuZG9jdHlwZSArPSBjXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1snKSB7XG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuRE9DVFlQRV9EVERcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNRdW90ZShjKSkge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkRPQ1RZUEVfUVVPVEVEXG4gICAgICAgICAgICAgIHBhcnNlci5xID0gY1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5ET0NUWVBFX1FVT1RFRDpcbiAgICAgICAgICBwYXJzZXIuZG9jdHlwZSArPSBjXG4gICAgICAgICAgaWYgKGMgPT09IHBhcnNlci5xKSB7XG4gICAgICAgICAgICBwYXJzZXIucSA9ICcnXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkRPQ1RZUEVcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuRE9DVFlQRV9EVEQ6XG4gICAgICAgICAgcGFyc2VyLmRvY3R5cGUgKz0gY1xuICAgICAgICAgIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuRE9DVFlQRVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNRdW90ZShjKSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5ET0NUWVBFX0RURF9RVU9URURcbiAgICAgICAgICAgIHBhcnNlci5xID0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5ET0NUWVBFX0RURF9RVU9URUQ6XG4gICAgICAgICAgcGFyc2VyLmRvY3R5cGUgKz0gY1xuICAgICAgICAgIGlmIChjID09PSBwYXJzZXIucSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5ET0NUWVBFX0RURFxuICAgICAgICAgICAgcGFyc2VyLnEgPSAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5DT01NRU5UOlxuICAgICAgICAgIGlmIChjID09PSAnLScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ09NTUVOVF9FTkRJTkdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VyLmNvbW1lbnQgKz0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5DT01NRU5UX0VORElORzpcbiAgICAgICAgICBpZiAoYyA9PT0gJy0nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNPTU1FTlRfRU5ERURcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ID0gdGV4dG9wdHMocGFyc2VyLm9wdCwgcGFyc2VyLmNvbW1lbnQpXG4gICAgICAgICAgICBpZiAocGFyc2VyLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jb21tZW50JywgcGFyc2VyLmNvbW1lbnQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXIuY29tbWVudCA9ICcnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ICs9ICctJyArIGNcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ09NTUVOVFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5DT01NRU5UX0VOREVEOlxuICAgICAgICAgIGlmIChjICE9PSAnPicpIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnTWFsZm9ybWVkIGNvbW1lbnQnKVxuICAgICAgICAgICAgLy8gYWxsb3cgPCEtLSBibGFoIC0tIGJsb28gLS0+IGluIG5vbi1zdHJpY3QgbW9kZSxcbiAgICAgICAgICAgIC8vIHdoaWNoIGlzIGEgY29tbWVudCBvZiBcIiBibGFoIC0tIGJsb28gXCJcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ICs9ICctLScgKyBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNPTU1FTlRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNEQVRBOlxuICAgICAgICAgIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ0RBVEFfRU5ESU5HXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSArPSBjXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNEQVRBX0VORElORzpcbiAgICAgICAgICBpZiAoYyA9PT0gJ10nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNEQVRBX0VORElOR18yXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSArPSAnXScgKyBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNEQVRBXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNEQVRBX0VORElOR18yOlxuICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZXIuY2RhdGEpIHtcbiAgICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jZGF0YScsIHBhcnNlci5jZGF0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uY2xvc2VjZGF0YScpXG4gICAgICAgICAgICBwYXJzZXIuY2RhdGEgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSArPSAnXSdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VyLmNkYXRhICs9ICddXScgKyBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNEQVRBXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLlBST0NfSU5TVDpcbiAgICAgICAgICBpZiAoYyA9PT0gJz8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlBST0NfSU5TVF9FTkRJTkdcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5QUk9DX0lOU1RfQk9EWVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZXIucHJvY0luc3ROYW1lICs9IGNcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuUFJPQ19JTlNUX0JPRFk6XG4gICAgICAgICAgaWYgKCFwYXJzZXIucHJvY0luc3RCb2R5ICYmIGlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc/Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5QUk9DX0lOU1RfRU5ESU5HXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5wcm9jSW5zdEJvZHkgKz0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5QUk9DX0lOU1RfRU5ESU5HOlxuICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29ucHJvY2Vzc2luZ2luc3RydWN0aW9uJywge1xuICAgICAgICAgICAgICBuYW1lOiBwYXJzZXIucHJvY0luc3ROYW1lLFxuICAgICAgICAgICAgICBib2R5OiBwYXJzZXIucHJvY0luc3RCb2R5XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcGFyc2VyLnByb2NJbnN0TmFtZSA9IHBhcnNlci5wcm9jSW5zdEJvZHkgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5wcm9jSW5zdEJvZHkgKz0gJz8nICsgY1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5QUk9DX0lOU1RfQk9EWVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5PUEVOX1RBRzpcbiAgICAgICAgICBpZiAoaXNNYXRjaChuYW1lQm9keSwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci50YWdOYW1lICs9IGNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3VGFnKHBhcnNlcilcbiAgICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgICAgb3BlblRhZyhwYXJzZXIpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICcvJykge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLk9QRU5fVEFHX1NMQVNIXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXIgaW4gdGFnIG5hbWUnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLk9QRU5fVEFHX1NMQVNIOlxuICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyLCB0cnVlKVxuICAgICAgICAgICAgY2xvc2VUYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ZvcndhcmQtc2xhc2ggaW4gb3BlbmluZyB0YWcgbm90IGZvbGxvd2VkIGJ5ID4nKVxuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCOlxuICAgICAgICAgIC8vIGhhdmVuJ3QgcmVhZCB0aGUgYXR0cmlidXRlIG5hbWUgeWV0LlxuICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJy8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLk9QRU5fVEFHX1NMQVNIXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5hdHRyaWJOYW1lID0gY1xuICAgICAgICAgICAgcGFyc2VyLmF0dHJpYlZhbHVlID0gJydcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCX05BTUVcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdJbnZhbGlkIGF0dHJpYnV0ZSBuYW1lJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCX05BTUU6XG4gICAgICAgICAgaWYgKGMgPT09ICc9Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfVkFMVUVcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdBdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZScpXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliVmFsdWUgPSBwYXJzZXIuYXR0cmliTmFtZVxuICAgICAgICAgICAgYXR0cmliKHBhcnNlcilcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9OQU1FX1NBV19XSElURVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNNYXRjaChuYW1lQm9keSwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5hdHRyaWJOYW1lICs9IGNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdJbnZhbGlkIGF0dHJpYnV0ZSBuYW1lJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCX05BTUVfU0FXX1dISVRFOlxuICAgICAgICAgIGlmIChjID09PSAnPScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCX1ZBTFVFXG4gICAgICAgICAgfSBlbHNlIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnQXR0cmlidXRlIHdpdGhvdXQgdmFsdWUnKVxuICAgICAgICAgICAgcGFyc2VyLnRhZy5hdHRyaWJ1dGVzW3BhcnNlci5hdHRyaWJOYW1lXSA9ICcnXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliVmFsdWUgPSAnJ1xuICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25hdHRyaWJ1dGUnLCB7XG4gICAgICAgICAgICAgIG5hbWU6IHBhcnNlci5hdHRyaWJOYW1lLFxuICAgICAgICAgICAgICB2YWx1ZTogJydcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliTmFtZSA9ICcnXG4gICAgICAgICAgICBpZiAoYyA9PT0gJz4nKSB7XG4gICAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgICAgcGFyc2VyLmF0dHJpYk5hbWUgPSBjXG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCX05BTUVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBhdHRyaWJ1dGUgbmFtZScpXG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkFUVFJJQl9WQUxVRTpcbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNRdW90ZShjKSkge1xuICAgICAgICAgICAgcGFyc2VyLnEgPSBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9RVU9URURcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdVbnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUnKVxuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfVkFMVUVfVU5RVU9URURcbiAgICAgICAgICAgIHBhcnNlci5hdHRyaWJWYWx1ZSA9IGNcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCX1ZBTFVFX1FVT1RFRDpcbiAgICAgICAgICBpZiAoYyAhPT0gcGFyc2VyLnEpIHtcbiAgICAgICAgICAgIGlmIChjID09PSAnJicpIHtcbiAgICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfVkFMVUVfRU5USVRZX1FcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcnNlci5hdHRyaWJWYWx1ZSArPSBjXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBhdHRyaWIocGFyc2VyKVxuICAgICAgICAgIHBhcnNlci5xID0gJydcbiAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9DTE9TRURcbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfQ0xPU0VEOlxuICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJy8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLk9QRU5fVEFHX1NMQVNIXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnTm8gd2hpdGVzcGFjZSBiZXR3ZWVuIGF0dHJpYnV0ZXMnKVxuICAgICAgICAgICAgcGFyc2VyLmF0dHJpYk5hbWUgPSBjXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliVmFsdWUgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfTkFNRVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ludmFsaWQgYXR0cmlidXRlIG5hbWUnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfVU5RVU9URUQ6XG4gICAgICAgICAgaWYgKCFpc0F0dHJpYkVuZChjKSkge1xuICAgICAgICAgICAgaWYgKGMgPT09ICcmJykge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9FTlRJVFlfVVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyc2VyLmF0dHJpYlZhbHVlICs9IGNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGF0dHJpYihwYXJzZXIpXG4gICAgICAgICAgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgb3BlblRhZyhwYXJzZXIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNMT1NFX1RBRzpcbiAgICAgICAgICBpZiAoIXBhcnNlci50YWdOYW1lKSB7XG4gICAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vdE1hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgICAgaWYgKHBhcnNlci5zY3JpcHQpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIuc2NyaXB0ICs9ICc8LycgKyBjXG4gICAgICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TQ1JJUFRcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ludmFsaWQgdGFnbmFtZSBpbiBjbG9zaW5nIHRhZy4nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwYXJzZXIudGFnTmFtZSA9IGNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgY2xvc2VUYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNNYXRjaChuYW1lQm9keSwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci50YWdOYW1lICs9IGNcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcnNlci5zY3JpcHQpIHtcbiAgICAgICAgICAgIHBhcnNlci5zY3JpcHQgKz0gJzwvJyArIHBhcnNlci50YWdOYW1lXG4gICAgICAgICAgICBwYXJzZXIudGFnTmFtZSA9ICcnXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlNDUklQVFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ludmFsaWQgdGFnbmFtZSBpbiBjbG9zaW5nIHRhZycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNMT1NFX1RBR19TQVdfV0hJVEVcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQ0xPU0VfVEFHX1NBV19XSElURTpcbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYyA9PT0gJz4nKSB7XG4gICAgICAgICAgICBjbG9zZVRhZyhwYXJzZXIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXJzIGluIGNsb3NpbmcgdGFnJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuVEVYVF9FTlRJVFk6XG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfRU5USVRZX1E6XG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfRU5USVRZX1U6XG4gICAgICAgICAgdmFyIHJldHVyblN0YXRlXG4gICAgICAgICAgdmFyIGJ1ZmZlclxuICAgICAgICAgIHN3aXRjaCAocGFyc2VyLnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFMuVEVYVF9FTlRJVFk6XG4gICAgICAgICAgICAgIHJldHVyblN0YXRlID0gUy5URVhUXG4gICAgICAgICAgICAgIGJ1ZmZlciA9ICd0ZXh0Tm9kZSdcbiAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgY2FzZSBTLkFUVFJJQl9WQUxVRV9FTlRJVFlfUTpcbiAgICAgICAgICAgICAgcmV0dXJuU3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9RVU9URURcbiAgICAgICAgICAgICAgYnVmZmVyID0gJ2F0dHJpYlZhbHVlJ1xuICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICBjYXNlIFMuQVRUUklCX1ZBTFVFX0VOVElUWV9VOlxuICAgICAgICAgICAgICByZXR1cm5TdGF0ZSA9IFMuQVRUUklCX1ZBTFVFX1VOUVVPVEVEXG4gICAgICAgICAgICAgIGJ1ZmZlciA9ICdhdHRyaWJWYWx1ZSdcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYyA9PT0gJzsnKSB7XG4gICAgICAgICAgICBwYXJzZXJbYnVmZmVyXSArPSBwYXJzZUVudGl0eShwYXJzZXIpXG4gICAgICAgICAgICBwYXJzZXIuZW50aXR5ID0gJydcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IHJldHVyblN0YXRlXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKHBhcnNlci5lbnRpdHkubGVuZ3RoID8gZW50aXR5Qm9keSA6IGVudGl0eVN0YXJ0LCBjKSkge1xuICAgICAgICAgICAgcGFyc2VyLmVudGl0eSArPSBjXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXIgaW4gZW50aXR5IG5hbWUnKVxuICAgICAgICAgICAgcGFyc2VyW2J1ZmZlcl0gKz0gJyYnICsgcGFyc2VyLmVudGl0eSArIGNcbiAgICAgICAgICAgIHBhcnNlci5lbnRpdHkgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gcmV0dXJuU3RhdGVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBhcnNlciwgJ1Vua25vd24gc3RhdGU6ICcgKyBwYXJzZXIuc3RhdGUpXG4gICAgICB9XG4gICAgfSAvLyB3aGlsZVxuXG4gICAgaWYgKHBhcnNlci5wb3NpdGlvbiA+PSBwYXJzZXIuYnVmZmVyQ2hlY2tQb3NpdGlvbikge1xuICAgICAgY2hlY2tCdWZmZXJMZW5ndGgocGFyc2VyKVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICAvKiEgaHR0cDovL210aHMuYmUvZnJvbWNvZGVwb2ludCB2MC4xLjAgYnkgQG1hdGhpYXMgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFTdHJpbmcuZnJvbUNvZGVQb2ludCkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZVxuICAgICAgdmFyIGZsb29yID0gTWF0aC5mbG9vclxuICAgICAgdmFyIGZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBNQVhfU0laRSA9IDB4NDAwMFxuICAgICAgICB2YXIgY29kZVVuaXRzID0gW11cbiAgICAgICAgdmFyIGhpZ2hTdXJyb2dhdGVcbiAgICAgICAgdmFyIGxvd1N1cnJvZ2F0ZVxuICAgICAgICB2YXIgaW5kZXggPSAtMVxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSAnJ1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSlcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhaXNGaW5pdGUoY29kZVBvaW50KSB8fCAvLyBgTmFOYCwgYCtJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgXG4gICAgICAgICAgICBjb2RlUG9pbnQgPCAwIHx8IC8vIG5vdCBhIHZhbGlkIFVuaWNvZGUgY29kZSBwb2ludFxuICAgICAgICAgICAgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG4gICAgICAgICAgICBmbG9vcihjb2RlUG9pbnQpICE9PSBjb2RlUG9pbnQgLy8gbm90IGFuIGludGVnZXJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHsgLy8gQk1QIGNvZGUgcG9pbnRcbiAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludClcbiAgICAgICAgICB9IGVsc2UgeyAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuICAgICAgICAgICAgLy8gaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcbiAgICAgICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDBcbiAgICAgICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDBcbiAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZGV4ICsgMSA9PT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpXG4gICAgICAgICAgICBjb2RlVW5pdHMubGVuZ3RoID0gMFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RyaW5nLCAnZnJvbUNvZGVQb2ludCcsIHtcbiAgICAgICAgICB2YWx1ZTogZnJvbUNvZGVQb2ludCxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0cmluZy5mcm9tQ29kZVBvaW50ID0gZnJvbUNvZGVQb2ludFxuICAgICAgfVxuICAgIH0oKSlcbiAgfVxufSkodHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gdGhpcy5zYXggPSB7fSA6IGV4cG9ydHMpXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG5cbmZ1bmN0aW9uIFN0cmVhbSgpIHtcbiAgRW1pdHRlci5jYWxsKHRoaXMpO1xufVxuU3RyZWFtLnByb3RvdHlwZSA9IG5ldyBFbWl0dGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbTtcbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuNC54XG5TdHJlYW0uU3RyZWFtID0gU3RyZWFtO1xuXG5TdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGlmIChkZXN0LndyaXRhYmxlKSB7XG4gICAgICBpZiAoZmFsc2UgPT09IGRlc3Qud3JpdGUoY2h1bmspICYmIHNvdXJjZS5wYXVzZSkge1xuICAgICAgICBzb3VyY2UucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2RhdGEnLCBvbmRhdGEpO1xuXG4gIGZ1bmN0aW9uIG9uZHJhaW4oKSB7XG4gICAgaWYgKHNvdXJjZS5yZWFkYWJsZSAmJiBzb3VyY2UucmVzdW1lKSB7XG4gICAgICBzb3VyY2UucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcblxuICAvLyBJZiB0aGUgJ2VuZCcgb3B0aW9uIGlzIG5vdCBzdXBwbGllZCwgZGVzdC5lbmQoKSB3aWxsIGJlIGNhbGxlZCB3aGVuXG4gIC8vIHNvdXJjZSBnZXRzIHRoZSAnZW5kJyBvciAnY2xvc2UnIGV2ZW50cy4gIE9ubHkgZGVzdC5lbmQoKSBvbmNlLlxuICBpZiAoIWRlc3QuX2lzU3RkaW8gJiYgKCFvcHRpb25zIHx8IG9wdGlvbnMuZW5kICE9PSBmYWxzZSkpIHtcbiAgICBzb3VyY2Uub24oJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub24oJ2Nsb3NlJywgb25jbG9zZSk7XG4gIH1cblxuICB2YXIgZGlkT25FbmQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gb25lbmQoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgZGVzdC5lbmQoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIGRlc3QuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgZGVzdC5kZXN0cm95KCk7XG4gIH1cblxuICAvLyBkb24ndCBsZWF2ZSBkYW5nbGluZyBwaXBlcyB3aGVuIHRoZXJlIGFyZSBlcnJvcnMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKCF0aGlzLmhhc0xpc3RlbmVycygnZXJyb3InKSkge1xuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCBzdHJlYW0gZXJyb3IgaW4gcGlwZS5cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2Vycm9yJywgb25lcnJvcik7XG4gIGRlc3Qub24oJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgLy8gcmVtb3ZlIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZC5cbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBzb3VyY2Uub2ZmKCdkYXRhJywgb25kYXRhKTtcbiAgICBkZXN0Lm9mZignZHJhaW4nLCBvbmRyYWluKTtcblxuICAgIHNvdXJjZS5vZmYoJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub2ZmKCdjbG9zZScsIG9uY2xvc2UpO1xuXG4gICAgc291cmNlLm9mZignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0Lm9mZignZXJyb3InLCBvbmVycm9yKTtcblxuICAgIHNvdXJjZS5vZmYoJ2VuZCcsIGNsZWFudXApO1xuICAgIHNvdXJjZS5vZmYoJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgICBkZXN0Lm9mZignZW5kJywgY2xlYW51cCk7XG4gICAgZGVzdC5vZmYoJ2Nsb3NlJywgY2xlYW51cCk7XG4gIH1cblxuICBzb3VyY2Uub24oJ2VuZCcsIGNsZWFudXApO1xuICBzb3VyY2Uub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5vbignZW5kJywgY2xlYW51cCk7XG4gIGRlc3Qub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5lbWl0KCdwaXBlJywgc291cmNlKTtcblxuICAvLyBBbGxvdyBmb3IgdW5peC1saWtlIHVzYWdlOiBBLnBpcGUoQikucGlwZShDKVxuICByZXR1cm4gZGVzdDtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qPHJlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgaXNFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nIHx8IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBlbmNvZGluZyA9ICcnICsgZW5jb2Rpbmc7XG4gIHN3aXRjaCAoZW5jb2RpbmcgJiYgZW5jb2RpbmcudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6Y2FzZSAndXRmOCc6Y2FzZSAndXRmLTgnOmNhc2UgJ2FzY2lpJzpjYXNlICdiaW5hcnknOmNhc2UgJ2Jhc2U2NCc6Y2FzZSAndWNzMic6Y2FzZSAndWNzLTInOmNhc2UgJ3V0ZjE2bGUnOmNhc2UgJ3V0Zi0xNmxlJzpjYXNlICdyYXcnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX25vcm1hbGl6ZUVuY29kaW5nKGVuYykge1xuICBpZiAoIWVuYykgcmV0dXJuICd1dGY4JztcbiAgdmFyIHJldHJpZWQ7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmMpIHtcbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gJ3V0ZjgnO1xuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuICd1dGYxNmxlJztcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gJ2xhdGluMSc7XG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGVuYztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChyZXRyaWVkKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICAgICAgICBlbmMgPSAoJycgKyBlbmMpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHJpZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLy8gRG8gbm90IGNhY2hlIGBCdWZmZXIuaXNFbmNvZGluZ2Agd2hlbiBjaGVja2luZyBlbmNvZGluZyBuYW1lcyBhcyBzb21lXG4vLyBtb2R1bGVzIG1vbmtleS1wYXRjaCBpdCB0byBzdXBwb3J0IGFkZGl0aW9uYWwgZW5jb2RpbmdzXG5mdW5jdGlvbiBub3JtYWxpemVFbmNvZGluZyhlbmMpIHtcbiAgdmFyIG5lbmMgPSBfbm9ybWFsaXplRW5jb2RpbmcoZW5jKTtcbiAgaWYgKHR5cGVvZiBuZW5jICE9PSAnc3RyaW5nJyAmJiAoQnVmZmVyLmlzRW5jb2RpbmcgPT09IGlzRW5jb2RpbmcgfHwgIWlzRW5jb2RpbmcoZW5jKSkpIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuYyk7XG4gIHJldHVybiBuZW5jIHx8IGVuYztcbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLlxuZXhwb3J0cy5TdHJpbmdEZWNvZGVyID0gU3RyaW5nRGVjb2RlcjtcbmZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IG5vcm1hbGl6ZUVuY29kaW5nKGVuY29kaW5nKTtcbiAgdmFyIG5iO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIHRoaXMudGV4dCA9IHV0ZjE2VGV4dDtcbiAgICAgIHRoaXMuZW5kID0gdXRmMTZFbmQ7XG4gICAgICBuYiA9IDQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIHRoaXMuZmlsbExhc3QgPSB1dGY4RmlsbExhc3Q7XG4gICAgICBuYiA9IDQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgdGhpcy50ZXh0ID0gYmFzZTY0VGV4dDtcbiAgICAgIHRoaXMuZW5kID0gYmFzZTY0RW5kO1xuICAgICAgbmIgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBzaW1wbGVXcml0ZTtcbiAgICAgIHRoaXMuZW5kID0gc2ltcGxlRW5kO1xuICAgICAgcmV0dXJuO1xuICB9XG4gIHRoaXMubGFzdE5lZWQgPSAwO1xuICB0aGlzLmxhc3RUb3RhbCA9IDA7XG4gIHRoaXMubGFzdENoYXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobmIpO1xufVxuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChidWYpIHtcbiAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgdmFyIHI7XG4gIHZhciBpO1xuICBpZiAodGhpcy5sYXN0TmVlZCkge1xuICAgIHIgPSB0aGlzLmZpbGxMYXN0KGJ1Zik7XG4gICAgaWYgKHIgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICAgIGkgPSB0aGlzLmxhc3ROZWVkO1xuICAgIHRoaXMubGFzdE5lZWQgPSAwO1xuICB9IGVsc2Uge1xuICAgIGkgPSAwO1xuICB9XG4gIGlmIChpIDwgYnVmLmxlbmd0aCkgcmV0dXJuIHIgPyByICsgdGhpcy50ZXh0KGJ1ZiwgaSkgOiB0aGlzLnRleHQoYnVmLCBpKTtcbiAgcmV0dXJuIHIgfHwgJyc7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSB1dGY4RW5kO1xuXG4vLyBSZXR1cm5zIG9ubHkgY29tcGxldGUgY2hhcmFjdGVycyBpbiBhIEJ1ZmZlclxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUudGV4dCA9IHV0ZjhUZXh0O1xuXG4vLyBBdHRlbXB0cyB0byBjb21wbGV0ZSBhIHBhcnRpYWwgbm9uLVVURi04IGNoYXJhY3RlciB1c2luZyBieXRlcyBmcm9tIGEgQnVmZmVyXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5maWxsTGFzdCA9IGZ1bmN0aW9uIChidWYpIHtcbiAgaWYgKHRoaXMubGFzdE5lZWQgPD0gYnVmLmxlbmd0aCkge1xuICAgIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZCwgMCwgdGhpcy5sYXN0TmVlZCk7XG4gICAgcmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgdGhpcy5sYXN0VG90YWwpO1xuICB9XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZCwgMCwgYnVmLmxlbmd0aCk7XG4gIHRoaXMubGFzdE5lZWQgLT0gYnVmLmxlbmd0aDtcbn07XG5cbi8vIENoZWNrcyB0aGUgdHlwZSBvZiBhIFVURi04IGJ5dGUsIHdoZXRoZXIgaXQncyBBU0NJSSwgYSBsZWFkaW5nIGJ5dGUsIG9yIGFcbi8vIGNvbnRpbnVhdGlvbiBieXRlLiBJZiBhbiBpbnZhbGlkIGJ5dGUgaXMgZGV0ZWN0ZWQsIC0yIGlzIHJldHVybmVkLlxuZnVuY3Rpb24gdXRmOENoZWNrQnl0ZShieXRlKSB7XG4gIGlmIChieXRlIDw9IDB4N0YpIHJldHVybiAwO2Vsc2UgaWYgKGJ5dGUgPj4gNSA9PT0gMHgwNikgcmV0dXJuIDI7ZWxzZSBpZiAoYnl0ZSA+PiA0ID09PSAweDBFKSByZXR1cm4gMztlbHNlIGlmIChieXRlID4+IDMgPT09IDB4MUUpIHJldHVybiA0O1xuICByZXR1cm4gYnl0ZSA+PiA2ID09PSAweDAyID8gLTEgOiAtMjtcbn1cblxuLy8gQ2hlY2tzIGF0IG1vc3QgMyBieXRlcyBhdCB0aGUgZW5kIG9mIGEgQnVmZmVyIGluIG9yZGVyIHRvIGRldGVjdCBhblxuLy8gaW5jb21wbGV0ZSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3Rlci4gVGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyAoMiwgMywgb3IgNClcbi8vIG5lZWRlZCB0byBjb21wbGV0ZSB0aGUgVVRGLTggY2hhcmFjdGVyIChpZiBhcHBsaWNhYmxlKSBhcmUgcmV0dXJuZWQuXG5mdW5jdGlvbiB1dGY4Q2hlY2tJbmNvbXBsZXRlKHNlbGYsIGJ1ZiwgaSkge1xuICB2YXIgaiA9IGJ1Zi5sZW5ndGggLSAxO1xuICBpZiAoaiA8IGkpIHJldHVybiAwO1xuICB2YXIgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMTtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkgfHwgbmIgPT09IC0yKSByZXR1cm4gMDtcbiAgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMjtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkgfHwgbmIgPT09IC0yKSByZXR1cm4gMDtcbiAgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkge1xuICAgICAgaWYgKG5iID09PSAyKSBuYiA9IDA7ZWxzZSBzZWxmLmxhc3ROZWVkID0gbmIgLSAzO1xuICAgIH1cbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbi8vIFZhbGlkYXRlcyBhcyBtYW55IGNvbnRpbnVhdGlvbiBieXRlcyBmb3IgYSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3RlciBhc1xuLy8gbmVlZGVkIG9yIGFyZSBhdmFpbGFibGUuIElmIHdlIHNlZSBhIG5vbi1jb250aW51YXRpb24gYnl0ZSB3aGVyZSB3ZSBleHBlY3Rcbi8vIG9uZSwgd2UgXCJyZXBsYWNlXCIgdGhlIHZhbGlkYXRlZCBjb250aW51YXRpb24gYnl0ZXMgd2UndmUgc2VlbiBzbyBmYXIgd2l0aFxuLy8gYSBzaW5nbGUgVVRGLTggcmVwbGFjZW1lbnQgY2hhcmFjdGVyICgnXFx1ZmZmZCcpLCB0byBtYXRjaCB2OCdzIFVURi04IGRlY29kaW5nXG4vLyBiZWhhdmlvci4gVGhlIGNvbnRpbnVhdGlvbiBieXRlIGNoZWNrIGlzIGluY2x1ZGVkIHRocmVlIHRpbWVzIGluIHRoZSBjYXNlXG4vLyB3aGVyZSBhbGwgb2YgdGhlIGNvbnRpbnVhdGlvbiBieXRlcyBmb3IgYSBjaGFyYWN0ZXIgZXhpc3QgaW4gdGhlIHNhbWUgYnVmZmVyLlxuLy8gSXQgaXMgYWxzbyBkb25lIHRoaXMgd2F5IGFzIGEgc2xpZ2h0IHBlcmZvcm1hbmNlIGluY3JlYXNlIGluc3RlYWQgb2YgdXNpbmcgYVxuLy8gbG9vcC5cbmZ1bmN0aW9uIHV0ZjhDaGVja0V4dHJhQnl0ZXMoc2VsZiwgYnVmLCBwKSB7XG4gIGlmICgoYnVmWzBdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICBzZWxmLmxhc3ROZWVkID0gMDtcbiAgICByZXR1cm4gJ1xcdWZmZmQnO1xuICB9XG4gIGlmIChzZWxmLmxhc3ROZWVkID4gMSAmJiBidWYubGVuZ3RoID4gMSkge1xuICAgIGlmICgoYnVmWzFdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICAgIHNlbGYubGFzdE5lZWQgPSAxO1xuICAgICAgcmV0dXJuICdcXHVmZmZkJztcbiAgICB9XG4gICAgaWYgKHNlbGYubGFzdE5lZWQgPiAyICYmIGJ1Zi5sZW5ndGggPiAyKSB7XG4gICAgICBpZiAoKGJ1ZlsyXSAmIDB4QzApICE9PSAweDgwKSB7XG4gICAgICAgIHNlbGYubGFzdE5lZWQgPSAyO1xuICAgICAgICByZXR1cm4gJ1xcdWZmZmQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBBdHRlbXB0cyB0byBjb21wbGV0ZSBhIG11bHRpLWJ5dGUgVVRGLTggY2hhcmFjdGVyIHVzaW5nIGJ5dGVzIGZyb20gYSBCdWZmZXIuXG5mdW5jdGlvbiB1dGY4RmlsbExhc3QoYnVmKSB7XG4gIHZhciBwID0gdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkO1xuICB2YXIgciA9IHV0ZjhDaGVja0V4dHJhQnl0ZXModGhpcywgYnVmLCBwKTtcbiAgaWYgKHIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHI7XG4gIGlmICh0aGlzLmxhc3ROZWVkIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCBwLCAwLCB0aGlzLmxhc3ROZWVkKTtcbiAgICByZXR1cm4gdGhpcy5sYXN0Q2hhci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCB0aGlzLmxhc3RUb3RhbCk7XG4gIH1cbiAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgcCwgMCwgYnVmLmxlbmd0aCk7XG4gIHRoaXMubGFzdE5lZWQgLT0gYnVmLmxlbmd0aDtcbn1cblxuLy8gUmV0dXJucyBhbGwgY29tcGxldGUgVVRGLTggY2hhcmFjdGVycyBpbiBhIEJ1ZmZlci4gSWYgdGhlIEJ1ZmZlciBlbmRlZCBvbiBhXG4vLyBwYXJ0aWFsIGNoYXJhY3RlciwgdGhlIGNoYXJhY3RlcidzIGJ5dGVzIGFyZSBidWZmZXJlZCB1bnRpbCB0aGUgcmVxdWlyZWRcbi8vIG51bWJlciBvZiBieXRlcyBhcmUgYXZhaWxhYmxlLlxuZnVuY3Rpb24gdXRmOFRleHQoYnVmLCBpKSB7XG4gIHZhciB0b3RhbCA9IHV0ZjhDaGVja0luY29tcGxldGUodGhpcywgYnVmLCBpKTtcbiAgaWYgKCF0aGlzLmxhc3ROZWVkKSByZXR1cm4gYnVmLnRvU3RyaW5nKCd1dGY4JywgaSk7XG4gIHRoaXMubGFzdFRvdGFsID0gdG90YWw7XG4gIHZhciBlbmQgPSBidWYubGVuZ3RoIC0gKHRvdGFsIC0gdGhpcy5sYXN0TmVlZCk7XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIDAsIGVuZCk7XG4gIHJldHVybiBidWYudG9TdHJpbmcoJ3V0ZjgnLCBpLCBlbmQpO1xufVxuXG4vLyBGb3IgVVRGLTgsIGEgcmVwbGFjZW1lbnQgY2hhcmFjdGVyIGlzIGFkZGVkIHdoZW4gZW5kaW5nIG9uIGEgcGFydGlhbFxuLy8gY2hhcmFjdGVyLlxuZnVuY3Rpb24gdXRmOEVuZChidWYpIHtcbiAgdmFyIHIgPSBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xuICBpZiAodGhpcy5sYXN0TmVlZCkgcmV0dXJuIHIgKyAnXFx1ZmZmZCc7XG4gIHJldHVybiByO1xufVxuXG4vLyBVVEYtMTZMRSB0eXBpY2FsbHkgbmVlZHMgdHdvIGJ5dGVzIHBlciBjaGFyYWN0ZXIsIGJ1dCBldmVuIGlmIHdlIGhhdmUgYW4gZXZlblxuLy8gbnVtYmVyIG9mIGJ5dGVzIGF2YWlsYWJsZSwgd2UgbmVlZCB0byBjaGVjayBpZiB3ZSBlbmQgb24gYSBsZWFkaW5nL2hpZ2hcbi8vIHN1cnJvZ2F0ZS4gSW4gdGhhdCBjYXNlLCB3ZSBuZWVkIHRvIHdhaXQgZm9yIHRoZSBuZXh0IHR3byBieXRlcyBpbiBvcmRlciB0b1xuLy8gZGVjb2RlIHRoZSBsYXN0IGNoYXJhY3RlciBwcm9wZXJseS5cbmZ1bmN0aW9uIHV0ZjE2VGV4dChidWYsIGkpIHtcbiAgaWYgKChidWYubGVuZ3RoIC0gaSkgJSAyID09PSAwKSB7XG4gICAgdmFyIHIgPSBidWYudG9TdHJpbmcoJ3V0ZjE2bGUnLCBpKTtcbiAgICBpZiAocikge1xuICAgICAgdmFyIGMgPSByLmNoYXJDb2RlQXQoci5sZW5ndGggLSAxKTtcbiAgICAgIGlmIChjID49IDB4RDgwMCAmJiBjIDw9IDB4REJGRikge1xuICAgICAgICB0aGlzLmxhc3ROZWVkID0gMjtcbiAgICAgICAgdGhpcy5sYXN0VG90YWwgPSA0O1xuICAgICAgICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAyXTtcbiAgICAgICAgdGhpcy5sYXN0Q2hhclsxXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gICAgICAgIHJldHVybiByLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG4gIH1cbiAgdGhpcy5sYXN0TmVlZCA9IDE7XG4gIHRoaXMubGFzdFRvdGFsID0gMjtcbiAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gIHJldHVybiBidWYudG9TdHJpbmcoJ3V0ZjE2bGUnLCBpLCBidWYubGVuZ3RoIC0gMSk7XG59XG5cbi8vIEZvciBVVEYtMTZMRSB3ZSBkbyBub3QgZXhwbGljaXRseSBhcHBlbmQgc3BlY2lhbCByZXBsYWNlbWVudCBjaGFyYWN0ZXJzIGlmIHdlXG4vLyBlbmQgb24gYSBwYXJ0aWFsIGNoYXJhY3Rlciwgd2Ugc2ltcGx5IGxldCB2OCBoYW5kbGUgdGhhdC5cbmZ1bmN0aW9uIHV0ZjE2RW5kKGJ1Zikge1xuICB2YXIgciA9IGJ1ZiAmJiBidWYubGVuZ3RoID8gdGhpcy53cml0ZShidWYpIDogJyc7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSB7XG4gICAgdmFyIGVuZCA9IHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZDtcbiAgICByZXR1cm4gciArIHRoaXMubGFzdENoYXIudG9TdHJpbmcoJ3V0ZjE2bGUnLCAwLCBlbmQpO1xuICB9XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBiYXNlNjRUZXh0KGJ1ZiwgaSkge1xuICB2YXIgbiA9IChidWYubGVuZ3RoIC0gaSkgJSAzO1xuICBpZiAobiA9PT0gMCkgcmV0dXJuIGJ1Zi50b1N0cmluZygnYmFzZTY0JywgaSk7XG4gIHRoaXMubGFzdE5lZWQgPSAzIC0gbjtcbiAgdGhpcy5sYXN0VG90YWwgPSAzO1xuICBpZiAobiA9PT0gMSkge1xuICAgIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDJdO1xuICAgIHRoaXMubGFzdENoYXJbMV0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICB9XG4gIHJldHVybiBidWYudG9TdHJpbmcoJ2Jhc2U2NCcsIGksIGJ1Zi5sZW5ndGggLSBuKTtcbn1cblxuZnVuY3Rpb24gYmFzZTY0RW5kKGJ1Zikge1xuICB2YXIgciA9IGJ1ZiAmJiBidWYubGVuZ3RoID8gdGhpcy53cml0ZShidWYpIDogJyc7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSByZXR1cm4gciArIHRoaXMubGFzdENoYXIudG9TdHJpbmcoJ2Jhc2U2NCcsIDAsIDMgLSB0aGlzLmxhc3ROZWVkKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIFBhc3MgYnl0ZXMgb24gdGhyb3VnaCBmb3Igc2luZ2xlLWJ5dGUgZW5jb2RpbmdzIChlLmcuIGFzY2lpLCBsYXRpbjEsIGhleClcbmZ1bmN0aW9uIHNpbXBsZVdyaXRlKGJ1Zikge1xuICByZXR1cm4gYnVmLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiBzaW1wbGVFbmQoYnVmKSB7XG4gIHJldHVybiBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xufSIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vRWRpdG9yLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9FZGl0b3Iuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vSW50ZXJmYWNlLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9JbnRlcmZhY2Uuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vUGxheWVyLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9QbGF5ZXIuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZXZlbnRfMSA9IHJlcXVpcmUoXCIuL2V2ZW50XCIpO1xuY29uc3QgZmlsZUxvYWRlcl8xID0gcmVxdWlyZShcIi4uL3V0aWxzL2ZpbGVMb2FkZXJcIik7XG5jb25zdCBwYXJzZXJfMSA9IHJlcXVpcmUoXCIuLi91dGlscy9wYXJzZXJcIik7XG5jbGFzcyBBdWRpbyBleHRlbmRzIGV2ZW50XzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnNhbXBsZXMgPSBbXTtcbiAgICAgICAgdGhpcy5hdWRpbyA9IG5ldyBBdWRpb0NvbnRleHQoKTtcbiAgICAgICAgdGhpcy5hdWRpb0J1ZmZlciA9IHRoaXMuYXVkaW8uY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIGlmICghd2luZG93LndlYkF1ZGlvQ29udHJvbHNXaWRnZXRNYW5hZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cuYWxlcnQoXCJ3ZWJhdWRpby1jb250cm9scyBub3QgZm91bmQsIGFkZCB0byBhIDxzY3JpcHQ+IHRhZy5cIik7XG4gICAgICAgIH1cbiAgICAgICAgd2luZG93LndlYkF1ZGlvQ29udHJvbHNXaWRnZXRNYW5hZ2VyLmFkZE1pZGlMaXN0ZW5lcigoZXZlbnQpID0+IHRoaXMub25LZXlib2FyZChldmVudCkpO1xuICAgICAgICB0aGlzLmxvYWRlciA9IG5ldyBmaWxlTG9hZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICAoMCwgcGFyc2VyXzEuc2V0UGFyc2VyTG9hZGVyKSh0aGlzLmxvYWRlcik7XG4gICAgICAgIGlmIChvcHRpb25zLnJvb3QpXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5zZXRSb290KG9wdGlvbnMucm9vdCk7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmxvYWRlci5hZGRGaWxlKG9wdGlvbnMuZmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNob3dGaWxlKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGxvYWRTYW1wbGUocGF0aCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgY29uc3QgZmlsZVJlZiA9IHRoaXMubG9hZGVyLmZpbGVzW3BhdGhdO1xuICAgICAgICAgICAgaWYgKGZpbGVSZWYpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZShmaWxlUmVmLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmxvYWRlci5hZGRGaWxlKHBhdGgpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMubG9hZGVyLmdldEZpbGUoZmlsZSwgdHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzaG93RmlsZShmaWxlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBmaWxlID0geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZShmaWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9IChmaWxlID09PSBudWxsIHx8IGZpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZpbGUucGF0aC5zdGFydHNXaXRoKFwiaHR0cHNcIikpXG4gICAgICAgICAgICAgICAgPyB0aGlzLmxvYWRlci5yb290ICsgXCJQcm9ncmFtcy9cIlxuICAgICAgICAgICAgICAgIDogXCJQcm9ncmFtcy9cIjtcbiAgICAgICAgICAgIGNvbnN0IHNmek9iamVjdCA9IHlpZWxkICgwLCBwYXJzZXJfMS5wYXJzZVNmeikocHJlZml4LCBmaWxlID09PSBudWxsIHx8IGZpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZpbGUuY29udGVudHMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaG93RmlsZVwiLCBmaWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwicGFyc2VTRlpcIiwgc2Z6T2JqZWN0KTtcbiAgICAgICAgICAgIC8vIGhhcmRjb2RlZCBwcm90b3R5cGUgZm9yIG9uZSBzZnogZmlsZVxuICAgICAgICAgICAgbGV0IGRlZmF1bHRQYXRoID0gXCJcIjtcbiAgICAgICAgICAgIGlmIChzZnpPYmplY3QuY29udHJvbCAmJlxuICAgICAgICAgICAgICAgIHNmek9iamVjdC5jb250cm9sWzBdICYmXG4gICAgICAgICAgICAgICAgc2Z6T2JqZWN0LmNvbnRyb2xbMF0uZGVmYXVsdF9wYXRoKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdFBhdGggPSBzZnpPYmplY3QuY29udHJvbFswXS5kZWZhdWx0X3BhdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVnaW9ucyA9IHNmek9iamVjdC5yZWdpb247XG4gICAgICAgICAgICBpZiAoc2Z6T2JqZWN0Lm1hc3RlcilcbiAgICAgICAgICAgICAgICByZWdpb25zID0gc2Z6T2JqZWN0Lm1hc3RlclswXS5yZWdpb247XG4gICAgICAgICAgICBpZiAocmVnaW9ucykge1xuICAgICAgICAgICAgICAgIHJlZ2lvbnMuZm9yRWFjaCgocmVnaW9uKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2FtcGxlc1tyZWdpb24ubG9rZXldID0gcmVnaW9uLnNhbXBsZS5yZXBsYWNlKFwiLi4vXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoZmlsZSA9PT0gbnVsbCB8fCBmaWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBmaWxlLnBhdGguc3RhcnRzV2l0aChcImh0dHBzXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNhbXBsZXNbcmVnaW9uLmxva2V5XSA9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkZXIucm9vdCArIGRlZmF1bHRQYXRoICsgcmVnaW9uLnNhbXBsZS5yZXBsYWNlKFwiLi4vXCIsIFwiXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5zYW1wbGVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMubG9hZFNhbXBsZSh0aGlzLnNhbXBsZXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0aGlzLnNhbXBsZXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChcImxvYWRcIiwge1xuICAgICAgICAgICAgICAgICAgICBzdGFydDogTnVtYmVyKGtleXNbMF0pLFxuICAgICAgICAgICAgICAgICAgICBlbmQ6IE51bWJlcihrZXlzW2tleXMubGVuZ3RoIC0gMV0pLFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgb25LZXlib2FyZChldmVudCkge1xuICAgICAgICBjb25zdCBjb250cm9sRXZlbnQgPSB7XG4gICAgICAgICAgICBjaGFubmVsOiAweDkwLFxuICAgICAgICAgICAgbm90ZTogZXZlbnQuZGF0YVsxXSxcbiAgICAgICAgICAgIHZlbG9jaXR5OiBldmVudC5kYXRhWzBdID09PSAxMjggPyAwIDogZXZlbnQuZGF0YVsyXSxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRTeW50aChjb250cm9sRXZlbnQpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoXCJjaGFuZ2VcIiwgY29udHJvbEV2ZW50KTtcbiAgICB9XG4gICAgc2V0U3ludGgoZXZlbnQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIC8vIHByb3RvdHlwZSB1c2luZyBzYW1wbGVzXG4gICAgICAgICAgICBpZiAoZXZlbnQudmVsb2NpdHkgPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyB0aGlzLmF1ZGlvQnVmZmVyLnN0b3AoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zdCBzYW1wbGVQYXRoID0gdGhpcy5zYW1wbGVzW2V2ZW50Lm5vdGVdO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzYW1wbGVQYXRoXCIsIGV2ZW50Lm5vdGUsIHNhbXBsZVBhdGgpO1xuICAgICAgICAgICAgY29uc3QgZmlsZVJlZiA9IHRoaXMubG9hZGVyLmZpbGVzW3NhbXBsZVBhdGhdO1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsZSA9IHlpZWxkIHRoaXMubG9hZGVyLmdldEZpbGUoZmlsZVJlZiB8fCBzYW1wbGVQYXRoLCB0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuYXVkaW9CdWZmZXIgPSB0aGlzLmF1ZGlvLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICAgICAgdGhpcy5hdWRpb0J1ZmZlci5idWZmZXIgPSBuZXdGaWxlID09PSBudWxsIHx8IG5ld0ZpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG5ld0ZpbGUuY29udGVudHM7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvQnVmZmVyLmNvbm5lY3QodGhpcy5hdWRpby5kZXN0aW5hdGlvbik7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvQnVmZmVyLnN0YXJ0KDApO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBBdWRpbztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5yZXF1aXJlKFwiLi9FZGl0b3Iuc2Nzc1wiKTtcbmNvbnN0IGNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50XCIpO1xuY29uc3QgZmlsZUxvYWRlcl8xID0gcmVxdWlyZShcIi4uL3V0aWxzL2ZpbGVMb2FkZXJcIik7XG5jbGFzcyBFZGl0b3IgZXh0ZW5kcyBjb21wb25lbnRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKFwiZWRpdG9yXCIpO1xuICAgICAgICBpZiAoIXdpbmRvdy5hY2UpIHtcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydChcIkFjZSBlZGl0b3Igbm90IGZvdW5kLCBhZGQgdG8gYSA8c2NyaXB0PiB0YWcuXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5maWxlRWwuY2xhc3NOYW1lID0gXCJmaWxlTGlzdFwiO1xuICAgICAgICB0aGlzLmdldEVsKCkuYXBwZW5kQ2hpbGQodGhpcy5maWxlRWwpO1xuICAgICAgICB0aGlzLmFjZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5hY2VFbC5jbGFzc05hbWUgPSBcImFjZVwiO1xuICAgICAgICB0aGlzLmFjZSA9IHdpbmRvdy5hY2UuZWRpdCh0aGlzLmFjZUVsLCB7XG4gICAgICAgICAgICB0aGVtZTogXCJhY2UvdGhlbWUvbW9ub2thaVwiLFxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKHRoaXMuYWNlRWwpO1xuICAgICAgICBpZiAob3B0aW9ucy5sb2FkZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyID0gb3B0aW9ucy5sb2FkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IG5ldyBmaWxlTG9hZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnJvb3QpXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5zZXRSb290KG9wdGlvbnMucm9vdCk7XG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdG9yeSkge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIuYWRkRGlyZWN0b3J5KG9wdGlvbnMuZGlyZWN0b3J5KTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMubG9hZGVyLmFkZEZpbGUob3B0aW9ucy5maWxlKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0ZpbGUoZmlsZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc2hvd0ZpbGUoZmlsZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgZmlsZSA9IHlpZWxkIHRoaXMubG9hZGVyLmdldEZpbGUoZmlsZSk7XG4gICAgICAgICAgICBpZiAoIWZpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKGZpbGUuZXh0ID09PSBcInNmelwiKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgU2Z6TW9kZSA9IHJlcXVpcmUoXCIuLi9saWIvbW9kZS1zZnpcIikuTW9kZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFjZS5zZXNzaW9uLnNldE1vZGUobmV3IFNmek1vZGUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlbGlzdCA9IHdpbmRvdy5hY2UucmVxdWlyZShcImFjZS9leHQvbW9kZWxpc3RcIik7XG4gICAgICAgICAgICAgICAgaWYgKCFtb2RlbGlzdCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cuYWxlcnQoXCJBY2UgbW9kZWxpc3Qgbm90IGZvdW5kLCBhZGQgdG8gYSA8c2NyaXB0PiB0YWcuXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlID0gbW9kZWxpc3QuZ2V0TW9kZUZvclBhdGgoZmlsZS5wYXRoKS5tb2RlO1xuICAgICAgICAgICAgICAgIHRoaXMuYWNlLnNlc3Npb24uc2V0TW9kZShtb2RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuYWNlLnNldE9wdGlvbihcInZhbHVlXCIsIGZpbGUuY29udGVudHMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlVHJlZShyb290LCBmaWxlcywgZmlsZXNUcmVlKSB7XG4gICAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBmaWxlc1RyZWUpIHtcbiAgICAgICAgICAgIGxldCBmaWxlUGF0aCA9IHJvb3QgKyBcIi9cIiArIGtleTtcbiAgICAgICAgICAgIGlmIChmaWxlUGF0aC5zdGFydHNXaXRoKFwiL1wiKSlcbiAgICAgICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnNsaWNlKDEpO1xuICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIik7XG4gICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMoZmlsZXNUcmVlW2tleV0pLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXRhaWxzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRldGFpbHNcIik7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgICAgICAgICAgICAgIHN1bW1hcnkuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgICAgICAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoc3VtbWFyeSk7XG4gICAgICAgICAgICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVRyZWUoZmlsZVBhdGgsIGZpbGVzLCBmaWxlc1RyZWVba2V5XSkpO1xuICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgICAgICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMuc2hvd0ZpbGUoZmlsZXNbZmlsZVBhdGhdKTtcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVsO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuZmlsZUVsLnJlcGxhY2VDaGlsZHJlbigpO1xuICAgICAgICB0aGlzLmZpbGVFbC5pbm5lckhUTUwgPSB0aGlzLmxvYWRlci5yb290O1xuICAgICAgICBjb25zdCB1bCA9IHRoaXMuY3JlYXRlVHJlZShcIlwiLCB0aGlzLmxvYWRlci5maWxlcywgdGhpcy5sb2FkZXIuZmlsZXNUcmVlKTtcbiAgICAgICAgdWwuY2xhc3NOYW1lID0gXCJ0cmVlXCI7XG4gICAgICAgIHRoaXMuZmlsZUVsLmFwcGVuZENoaWxkKHVsKTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFZGl0b3I7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xucmVxdWlyZShcIi4vSW50ZXJmYWNlLnNjc3NcIik7XG5jb25zdCB4bWxfanNfMSA9IHJlcXVpcmUoXCJ4bWwtanNcIik7XG5jb25zdCBjb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudFwiKTtcbmNvbnN0IGludGVyZmFjZV8xID0gcmVxdWlyZShcIi4uL3R5cGVzL2ludGVyZmFjZVwiKTtcbmNvbnN0IGZpbGVMb2FkZXJfMSA9IHJlcXVpcmUoXCIuLi91dGlscy9maWxlTG9hZGVyXCIpO1xuY2xhc3MgSW50ZXJmYWNlIGV4dGVuZHMgY29tcG9uZW50XzEuZGVmYXVsdCB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihcImludGVyZmFjZVwiKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IDc3NTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAzMzA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRTdGFydCA9IDA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRFbmQgPSAyMDA7XG4gICAgICAgIHRoaXMuaW5zdHJ1bWVudCA9IHt9O1xuICAgICAgICB0aGlzLnRhYnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB0aGlzLnRhYnMuY2xhc3NOYW1lID0gXCJ0YWJzXCI7XG4gICAgICAgIHRoaXMuYWRkVGFiKFwiSW5mb1wiKTtcbiAgICAgICAgdGhpcy5hZGRUYWIoXCJDb250cm9sc1wiKTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKHRoaXMudGFicyk7XG4gICAgICAgIHRoaXMuYWRkS2V5Ym9hcmQoKTtcbiAgICAgICAgaWYgKG9wdGlvbnMubG9hZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IG9wdGlvbnMubG9hZGVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgZmlsZUxvYWRlcl8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5yb290KVxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuc2V0Um9vdChvcHRpb25zLnJvb3QpO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3RvcnkpXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5hZGREaXJlY3Rvcnkob3B0aW9ucy5kaXJlY3RvcnkpO1xuICAgICAgICBpZiAob3B0aW9ucy5maWxlKSB7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5sb2FkZXIuYWRkRmlsZShvcHRpb25zLmZpbGUpO1xuICAgICAgICAgICAgdGhpcy5zaG93RmlsZShmaWxlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzaG93RmlsZShmaWxlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBmaWxlID0geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZShmaWxlKTtcbiAgICAgICAgICAgIHRoaXMuaW5zdHJ1bWVudCA9IHRoaXMucGFyc2VYTUwoZmlsZSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLnNldHVwSW5mbygpO1xuICAgICAgICB0aGlzLnNldHVwQ29udHJvbHMoKTtcbiAgICB9XG4gICAgdG9QZXJjZW50YWdlKHZhbDEsIHZhbDIpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKE51bWJlcih2YWwxKSAvIHZhbDIsIDEpICogMTAwICsgXCIlXCI7XG4gICAgfVxuICAgIHRvUmVsYXRpdmUoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC54LCB0aGlzLndpZHRoKSxcbiAgICAgICAgICAgIHRvcDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC55LCB0aGlzLmhlaWdodCksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC53LCB0aGlzLndpZHRoKSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC5oLCB0aGlzLmhlaWdodCksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFkZEltYWdlKGltYWdlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZSA9IHRoaXMudG9SZWxhdGl2ZShpbWFnZSk7XG4gICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW1nXCIpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcImRyYWdnYWJsZVwiLCBcImZhbHNlXCIpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGBsZWZ0OiAke3JlbGF0aXZlLmxlZnR9OyB0b3A6ICR7cmVsYXRpdmUudG9wfTsgd2lkdGg6ICR7cmVsYXRpdmUud2lkdGh9OyBoZWlnaHQ6ICR7cmVsYXRpdmUuaGVpZ2h0fTtgKTtcbiAgICAgICAgICAgIHlpZWxkIHRoaXMuYWRkSW1hZ2VBdHIoaW1nLCBcInNyY1wiLCBpbWFnZS5pbWFnZSk7XG4gICAgICAgICAgICByZXR1cm4gaW1nO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkSW1hZ2VBdHIoaW1nLCBhdHRyaWJ1dGUsIHBhdGgpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmxvYWRlci5yb290LnN0YXJ0c1dpdGgoXCJodHRwXCIpKSB7XG4gICAgICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHRoaXMubG9hZGVyLnJvb3QgKyBcIkdVSS9cIiArIHBhdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMubG9hZGVyLmZpbGVzW1wiR1VJL1wiICsgcGF0aF07XG4gICAgICAgICAgICAgICAgaWYgKGZpbGUgJiYgXCJoYW5kbGVcIiBpbiBmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUuaGFuZGxlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkQ29udHJvbCh0eXBlLCBlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlID0gdGhpcy50b1JlbGF0aXZlKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYHdlYmF1ZGlvLSR7dHlwZX1gKTtcbiAgICAgICAgaWYgKFwiaW1hZ2VcIiBpbiBlbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5hZGRJbWFnZUF0cihlbCwgXCJzcmNcIiwgZWxlbWVudC5pbWFnZSk7XG4gICAgICAgIGlmIChcImltYWdlX2JnXCIgaW4gZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuYWRkSW1hZ2VBdHIoZWwsIFwic3JjXCIsIGVsZW1lbnQuaW1hZ2VfYmcpO1xuICAgICAgICBpZiAoXCJpbWFnZV9oYW5kbGVcIiBpbiBlbGVtZW50KVxuICAgICAgICAgICAgdGhpcy5hZGRJbWFnZUF0cihlbCwgXCJrbm9ic3JjXCIsIGVsZW1lbnQuaW1hZ2VfaGFuZGxlKTtcbiAgICAgICAgaWYgKFwiZnJhbWVzXCIgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwidmFsdWVcIiwgXCIwXCIpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwibWF4XCIsIE51bWJlcihlbGVtZW50LmZyYW1lcykgLSAxKTtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShcInN0ZXBcIiwgXCIxXCIpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwic3ByaXRlc1wiLCBOdW1iZXIoZWxlbWVudC5mcmFtZXMpIC0gMSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ0b29sdGlwXCIsIFwiJWRcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwib3JpZW50YXRpb25cIiBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBkaXIgPSBlbGVtZW50Lm9yaWVudGF0aW9uID09PSBcInZlcnRpY2FsXCIgPyBcInZlcnRcIiA6IFwiaG9yelwiO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiZGlyZWN0aW9uXCIsIGRpcik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKFwieFwiIGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZShcInN0eWxlXCIsIGBsZWZ0OiAke3JlbGF0aXZlLmxlZnR9OyB0b3A6ICR7cmVsYXRpdmUudG9wfTtgKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoXCJ3XCIgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKFwiaGVpZ2h0XCIsIGVsZW1lbnQuaCk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBlbGVtZW50LncpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9XG4gICAgYWRkS2V5Ym9hcmQoKSB7XG4gICAgICAgIGNvbnN0IGtleWJvYXJkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcIndlYmF1ZGlvLWtleWJvYXJkXCIpO1xuICAgICAgICBrZXlib2FyZC5zZXRBdHRyaWJ1dGUoXCJrZXlzXCIsIFwiODhcIik7XG4gICAgICAgIGtleWJvYXJkLnNldEF0dHJpYnV0ZShcImhlaWdodFwiLCBcIjcwXCIpO1xuICAgICAgICBrZXlib2FyZC5zZXRBdHRyaWJ1dGUoXCJ3aWR0aFwiLCBcIjc3NVwiKTtcbiAgICAgICAga2V5Ym9hcmQuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xFdmVudCA9IHtcbiAgICAgICAgICAgICAgICBjaGFubmVsOiAweDkwLFxuICAgICAgICAgICAgICAgIG5vdGU6IGV2ZW50Lm5vdGVbMV0sXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IGV2ZW50Lm5vdGVbMF0gPyAxMDAgOiAwLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChcImNoYW5nZVwiLCBjb250cm9sRXZlbnQpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKGtleWJvYXJkKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZCA9IGtleWJvYXJkO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB0aGlzLnJlc2l6ZUtleWJvYXJkKCkpO1xuICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2l6ZUtleWJvYXJkKCkpO1xuICAgIH1cbiAgICByZXNpemVLZXlib2FyZCgpIHtcbiAgICAgICAgY29uc3Qga2V5c0ZpdCA9IE1hdGguZmxvb3IodGhpcy5nZXRFbCgpLmNsaWVudFdpZHRoIC8gMTMpO1xuICAgICAgICBjb25zdCBrZXlzUmFuZ2UgPSB0aGlzLmtleWJvYXJkRW5kIC0gdGhpcy5rZXlib2FyZFN0YXJ0O1xuICAgICAgICBjb25zdCBrZXlzRGlmZiA9IE1hdGguZmxvb3Ioa2V5c0ZpdCAvIDIgLSBrZXlzUmFuZ2UgLyAyKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZC5taW4gPSBNYXRoLm1heCh0aGlzLmtleWJvYXJkU3RhcnQgLSBrZXlzRGlmZiwgMCk7XG4gICAgICAgIHRoaXMua2V5Ym9hcmQua2V5cyA9IGtleXNGaXQ7XG4gICAgICAgIHRoaXMua2V5Ym9hcmQud2lkdGggPSB0aGlzLmdldEVsKCkuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIFRoaXMgZmVhdHVyZSBpcyBvbmx5IGF2YWlsYWJsZSBpZiB0aGlzIFBSIGlzIG1lcmdlZFxuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vZzIwMGtnL3dlYmF1ZGlvLWNvbnRyb2xzL3B1bGwvNTJcbiAgICAgICAgdGhpcy5rZXlib2FyZC5zZXREaXNhYmxlZFJhbmdlKDEsIDAsIHRoaXMua2V5Ym9hcmRTdGFydCk7XG4gICAgICAgIHRoaXMua2V5Ym9hcmQuc2V0RGlzYWJsZWRSYW5nZSgxLCB0aGlzLmtleWJvYXJkRW5kLCAyMDApO1xuICAgIH1cbiAgICBzZXRLZXlib2FyZChldmVudCkge1xuICAgICAgICB0aGlzLmtleWJvYXJkLnNldE5vdGUoZXZlbnQudmVsb2NpdHksIGV2ZW50Lm5vdGUpO1xuICAgIH1cbiAgICBzZXRLZXlib2FyZFJhbmdlKHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJzZXRLZXlib2FyZFJhbmdlXCIsIHN0YXJ0LCBlbmQpO1xuICAgICAgICB0aGlzLmtleWJvYXJkU3RhcnQgPSBzdGFydCB8fCAwO1xuICAgICAgICB0aGlzLmtleWJvYXJkRW5kID0gZW5kIHx8IDEwMDtcbiAgICAgICAgdGhpcy5yZXNpemVLZXlib2FyZCgpO1xuICAgIH1cbiAgICBhZGRUYWIobmFtZSkge1xuICAgICAgICBjb25zdCBpbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gXCJyYWRpb3RhYlwiO1xuICAgICAgICBpZiAobmFtZSA9PT0gXCJJbmZvXCIpXG4gICAgICAgICAgICBpbnB1dC5zZXRBdHRyaWJ1dGUoXCJjaGVja2VkXCIsIFwiY2hlY2tlZFwiKTtcbiAgICAgICAgaW5wdXQudHlwZSA9IFwicmFkaW9cIjtcbiAgICAgICAgaW5wdXQuaWQgPSBuYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlucHV0Lm5hbWUgPSBcInRhYnNcIjtcbiAgICAgICAgdGhpcy50YWJzLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIik7XG4gICAgICAgIGxhYmVsLmNsYXNzTmFtZSA9IFwibGFiZWxcIjtcbiAgICAgICAgbGFiZWwuc2V0QXR0cmlidXRlKFwiZm9yXCIsIG5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGxhYmVsLmlubmVySFRNTCA9IG5hbWU7XG4gICAgICAgIHRoaXMudGFicy5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIGRpdi5jbGFzc05hbWUgPSBcInBhbmVsXCI7XG4gICAgICAgIHRoaXMudGFicy5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cbiAgICBhZGRUZXh0KHRleHQpIHtcbiAgICAgICAgY29uc3QgcmVsYXRpdmUgPSB0aGlzLnRvUmVsYXRpdmUodGV4dCk7XG4gICAgICAgIGNvbnN0IHNwYW4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcbiAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGUoXCJzdHlsZVwiLCBgbGVmdDogJHtyZWxhdGl2ZS5sZWZ0fTsgdG9wOiAke3JlbGF0aXZlLnRvcH07IHdpZHRoOiAke3JlbGF0aXZlLndpZHRofTsgaGVpZ2h0OiAke3JlbGF0aXZlLmhlaWdodH07IGNvbG9yOiAke3RleHQuY29sb3JfdGV4dH07YCk7XG4gICAgICAgIHNwYW4uaW5uZXJIVE1MID0gdGV4dC50ZXh0O1xuICAgICAgICByZXR1cm4gc3BhbjtcbiAgICB9XG4gICAgcGFyc2VYTUwoZmlsZSkge1xuICAgICAgICBpZiAoIWZpbGUpXG4gICAgICAgICAgICByZXR1cm4ge307XG4gICAgICAgIGNvbnN0IGZpbGVQYXJzZWQgPSAoMCwgeG1sX2pzXzEueG1sMmpzKShmaWxlLmNvbnRlbnRzKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmluZEVsZW1lbnRzKHt9LCBmaWxlUGFyc2VkLmVsZW1lbnRzKTtcbiAgICB9XG4gICAgc2V0dXBJbmZvKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmluc3RydW1lbnQuQXJpYUdVSSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zdCBpbmZvID0gdGhpcy50YWJzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoXCJwYW5lbFwiKVswXTtcbiAgICAgICAgICAgIGluZm8ucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZSh0aGlzLmxvYWRlci5yb290ICsgdGhpcy5pbnN0cnVtZW50LkFyaWFHVUlbMF0ucGF0aCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlWG1sID0geWllbGQgdGhpcy5wYXJzZVhNTChmaWxlKTtcbiAgICAgICAgICAgIGluZm8uYXBwZW5kQ2hpbGQoeWllbGQgdGhpcy5hZGRJbWFnZShmaWxlWG1sLlN0YXRpY0ltYWdlWzBdKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXR1cENvbnRyb2xzKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmluc3RydW1lbnQuQXJpYVByb2dyYW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY29udHJvbHMgPSB0aGlzLnRhYnMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZShcInBhbmVsXCIpWzFdO1xuICAgICAgICAgICAgY29udHJvbHMucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZSh0aGlzLmxvYWRlci5yb290ICsgdGhpcy5pbnN0cnVtZW50LkFyaWFQcm9ncmFtWzBdLmd1aSk7XG4gICAgICAgICAgICBjb25zdCBmaWxlWG1sID0geWllbGQgdGhpcy5wYXJzZVhNTChmaWxlKTtcbiAgICAgICAgICAgIGlmIChmaWxlWG1sLktub2IpXG4gICAgICAgICAgICAgICAgZmlsZVhtbC5Lbm9iLmZvckVhY2goKGtub2IpID0+IGNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuYWRkQ29udHJvbChpbnRlcmZhY2VfMS5QbGF5ZXJFbGVtZW50cy5Lbm9iLCBrbm9iKSkpO1xuICAgICAgICAgICAgaWYgKGZpbGVYbWwuT25PZmZCdXR0b24pXG4gICAgICAgICAgICAgICAgZmlsZVhtbC5Pbk9mZkJ1dHRvbi5mb3JFYWNoKChidXR0b24pID0+IGNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuYWRkQ29udHJvbChpbnRlcmZhY2VfMS5QbGF5ZXJFbGVtZW50cy5Td2l0Y2gsIGJ1dHRvbikpKTtcbiAgICAgICAgICAgIGlmIChmaWxlWG1sLlNsaWRlcilcbiAgICAgICAgICAgICAgICBmaWxlWG1sLlNsaWRlci5mb3JFYWNoKChzbGlkZXIpID0+IGNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuYWRkQ29udHJvbChpbnRlcmZhY2VfMS5QbGF5ZXJFbGVtZW50cy5TbGlkZXIsIHNsaWRlcikpKTtcbiAgICAgICAgICAgIGlmIChmaWxlWG1sLlN0YXRpY0ltYWdlKVxuICAgICAgICAgICAgICAgIGZpbGVYbWwuU3RhdGljSW1hZ2UuZm9yRWFjaCgoaW1hZ2UpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHsgcmV0dXJuIGNvbnRyb2xzLmFwcGVuZENoaWxkKHlpZWxkIHRoaXMuYWRkSW1hZ2UoaW1hZ2UpKTsgfSkpO1xuICAgICAgICAgICAgaWYgKGZpbGVYbWwuU3RhdGljVGV4dClcbiAgICAgICAgICAgICAgICBmaWxlWG1sLlN0YXRpY1RleHQuZm9yRWFjaCgodGV4dCkgPT4gY29udHJvbHMuYXBwZW5kQ2hpbGQodGhpcy5hZGRUZXh0KHRleHQpKSk7XG4gICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLCAoKSA9PiB0aGlzLnJlc2l6ZUNvbnRyb2xzKCkpO1xuICAgICAgICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZXNpemVDb250cm9scygpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJlc2l6ZUNvbnRyb2xzKCkge1xuICAgICAgICBjb25zdCB3aWR0aCA9IE1hdGguZmxvb3IodGhpcy5nZXRFbCgpLmNsaWVudFdpZHRoIC8gMjUpO1xuICAgICAgICBjb25zdCBzbGlkZXJXaWR0aCA9IE1hdGguZmxvb3IodGhpcy5nZXRFbCgpLmNsaWVudFdpZHRoIC8gNjUpO1xuICAgICAgICBjb25zdCBzbGlkZXJIZWlnaHQgPSBNYXRoLmZsb29yKHRoaXMuZ2V0RWwoKS5jbGllbnRIZWlnaHQgLyAzLjUpO1xuICAgICAgICBjb25zdCBjb250cm9scyA9IHRoaXMudGFicy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwicGFuZWxcIilbMV07XG4gICAgICAgIGNvbnRyb2xzLmNoaWxkTm9kZXMuZm9yRWFjaCgoY29udHJvbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRyb2wubm9kZU5hbWUgPT09IFwiV0VCQVVESU8tS05PQlwiIHx8XG4gICAgICAgICAgICAgICAgY29udHJvbC5ub2RlTmFtZSA9PT0gXCJXRUJBVURJTy1TV0lUQ0hcIikge1xuICAgICAgICAgICAgICAgIGNvbnRyb2wud2lkdGggPSBjb250cm9sLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29udHJvbC5ub2RlTmFtZSA9PT0gXCJXRUJBVURJTy1TTElERVJcIikge1xuICAgICAgICAgICAgICAgIGNvbnRyb2wud2lkdGggPSBzbGlkZXJXaWR0aDtcbiAgICAgICAgICAgICAgICBjb250cm9sLmhlaWdodCA9IHNsaWRlckhlaWdodDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGZpbmRFbGVtZW50cyhsaXN0LCBub2Rlcykge1xuICAgICAgICBub2Rlcy5mb3JFYWNoKChub2RlKSA9PiB7XG4gICAgICAgICAgICBpZiAobm9kZS50eXBlID09PSBcImVsZW1lbnRcIikge1xuICAgICAgICAgICAgICAgIGlmICghbGlzdFtub2RlLm5hbWVdKVxuICAgICAgICAgICAgICAgICAgICBsaXN0W25vZGUubmFtZV0gPSBbXTtcbiAgICAgICAgICAgICAgICBsaXN0W25vZGUubmFtZV0ucHVzaChub2RlLmF0dHJpYnV0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG5vZGUuZWxlbWVudHMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmRFbGVtZW50cyhsaXN0LCBub2RlLmVsZW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEludGVyZmFjZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBjb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudFwiKTtcbmNvbnN0IEVkaXRvcl8xID0gcmVxdWlyZShcIi4vRWRpdG9yXCIpO1xuY29uc3QgSW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi9JbnRlcmZhY2VcIik7XG5yZXF1aXJlKFwiLi9QbGF5ZXIuc2Nzc1wiKTtcbmNvbnN0IGJyb3dzZXJfZnNfYWNjZXNzXzEgPSByZXF1aXJlKFwiYnJvd3Nlci1mcy1hY2Nlc3NcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4uL3V0aWxzL3V0aWxzXCIpO1xuY29uc3QgZmlsZUxvYWRlcl8xID0gcmVxdWlyZShcIi4uL3V0aWxzL2ZpbGVMb2FkZXJcIik7XG5jb25zdCBBdWRpb18xID0gcmVxdWlyZShcIi4vQXVkaW9cIik7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCIuLi91dGlscy9hcGlcIik7XG5jbGFzcyBQbGF5ZXIgZXh0ZW5kcyBjb21wb25lbnRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3RvcihpZCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHN1cGVyKFwicGxheWVyXCIpO1xuICAgICAgICB0aGlzLmxvYWRlciA9IG5ldyBmaWxlTG9hZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICBpZiAob3B0aW9ucy5hdWRpbylcbiAgICAgICAgICAgIHRoaXMuc2V0dXBBdWRpbyhvcHRpb25zLmF1ZGlvKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuaGVhZGVyKVxuICAgICAgICAgICAgdGhpcy5zZXR1cEhlYWRlcigpO1xuICAgICAgICBpZiAob3B0aW9ucy5pbnRlcmZhY2UpXG4gICAgICAgICAgICB0aGlzLnNldHVwSW50ZXJmYWNlKG9wdGlvbnMuaW50ZXJmYWNlKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZWRpdG9yKVxuICAgICAgICAgICAgdGhpcy5zZXR1cEVkaXRvcihvcHRpb25zLmVkaXRvcik7XG4gICAgICAgIChfYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKSkgPT09IG51bGwgfHwgX2EgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9hLmFwcGVuZENoaWxkKHRoaXMuZ2V0RWwoKSk7XG4gICAgfVxuICAgIHNldHVwQXVkaW8ob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLmxvYWRlciA9IHRoaXMubG9hZGVyO1xuICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvXzEuZGVmYXVsdChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5hdWRpby5hZGRFdmVudChcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyZmFjZSlcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyZmFjZS5zZXRLZXlib2FyZChldmVudC5kYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXVkaW8uYWRkRXZlbnQoXCJsb2FkXCIsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJmYWNlKVxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLnNldEtleWJvYXJkUmFuZ2UoZXZlbnQuZGF0YS5zdGFydCwgZXZlbnQuZGF0YS5lbmQpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgc2V0dXBJbnRlcmZhY2Uob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLmxvYWRlciA9IHRoaXMubG9hZGVyO1xuICAgICAgICB0aGlzLmludGVyZmFjZSA9IG5ldyBJbnRlcmZhY2VfMS5kZWZhdWx0KG9wdGlvbnMpO1xuICAgICAgICB0aGlzLmludGVyZmFjZS5hZGRFdmVudChcImNoYW5nZVwiLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1ZGlvKVxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW8uc2V0U3ludGgoZXZlbnQuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmdldEVsKCkuYXBwZW5kQ2hpbGQodGhpcy5pbnRlcmZhY2UuZ2V0RWwoKSk7XG4gICAgfVxuICAgIHNldHVwRWRpdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5sb2FkZXIgPSB0aGlzLmxvYWRlcjtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBuZXcgRWRpdG9yXzEuZGVmYXVsdChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKHRoaXMuZWRpdG9yLmdldEVsKCkpO1xuICAgIH1cbiAgICBzZXR1cEhlYWRlcigpIHtcbiAgICAgICAgY29uc3QgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGl2LmNsYXNzTmFtZSA9IFwiaGVhZGVyXCI7XG4gICAgICAgIGNvbnN0IGlucHV0TG9jYWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7XG4gICAgICAgIGlucHV0TG9jYWwudHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIGlucHV0TG9jYWwudmFsdWUgPSBcIkxvY2FsIGRpcmVjdG9yeVwiO1xuICAgICAgICBpbnB1dExvY2FsLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5sb2FkTG9jYWxJbnN0cnVtZW50KCk7XG4gICAgICAgIH0pKTtcbiAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0TG9jYWwpO1xuICAgICAgICBjb25zdCBpbnB1dFJlbW90ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtcbiAgICAgICAgaW5wdXRSZW1vdGUudHlwZSA9IFwiYnV0dG9uXCI7XG4gICAgICAgIGlucHV0UmVtb3RlLnZhbHVlID0gXCJSZW1vdGUgZGlyZWN0b3J5XCI7XG4gICAgICAgIGlucHV0UmVtb3RlLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoZSkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgeWllbGQgdGhpcy5sb2FkUmVtb3RlSW5zdHJ1bWVudCgpO1xuICAgICAgICB9KSk7XG4gICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dFJlbW90ZSk7XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cbiAgICBsb2FkTG9jYWxJbnN0cnVtZW50KCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9icyA9ICh5aWVsZCAoMCwgYnJvd3Nlcl9mc19hY2Nlc3NfMS5kaXJlY3RvcnlPcGVuKSh7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7YmxvYnMubGVuZ3RofSBmaWxlcyBzZWxlY3RlZC5gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREaXJlY3RvcnkoKDAsIHV0aWxzXzEucGF0aFJvb3QpKGJsb2JzWzBdLndlYmtpdFJlbGF0aXZlUGF0aCksIGJsb2JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLm5hbWUgIT09IFwiQWJvcnRFcnJvclwiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVGhlIHVzZXIgYWJvcnRlZCBhIHJlcXVlc3QuXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgbG9hZFJlbW90ZUluc3RydW1lbnQoKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCByZXBvID0gd2luZG93LnByb21wdChcIkVudGVyIGEgR2l0SHViIG93bmVyL3JlcG9cIiwgXCJzdHVkaW9yYWNrL2JsYWNrLWFuZC1ncmVlbi1ndWl0YXJzXCIpO1xuICAgICAgICAgICAgaWYgKHJlcG8pIHtcbiAgICAgICAgICAgICAgICBjb25zdCByZXNwb25zZSA9IHlpZWxkICgwLCBhcGlfMS5nZXRKU09OKShgaHR0cHM6Ly9hcGkuZ2l0aHViLmNvbS9yZXBvcy8ke3JlcG99L2dpdC90cmVlcy9tYWluP3JlY3Vyc2l2ZT0xYCk7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aHMgPSByZXNwb25zZS50cmVlLm1hcCgoZmlsZSkgPT4gYGh0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS8ke3JlcG99L21haW4vJHtmaWxlLnBhdGh9YCk7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5sb2FkRGlyZWN0b3J5KGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vJHtyZXBvfS9tYWluL2AsIHBhdGhzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxvYWREaXJlY3Rvcnkocm9vdCwgZmlsZXMpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGxldCBhdWRpb0ZpbGU7XG4gICAgICAgICAgICBsZXQgaW50ZXJmYWNlRmlsZTtcbiAgICAgICAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmaWxlcykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhdGggPSB0eXBlb2YgZmlsZSA9PT0gXCJzdHJpbmdcIiA/IGZpbGUgOiBmaWxlLndlYmtpdFJlbGF0aXZlUGF0aDtcbiAgICAgICAgICAgICAgICBpZiAoIWF1ZGlvRmlsZSAmJlxuICAgICAgICAgICAgICAgICAgICAoMCwgdXRpbHNfMS5wYXRoRXh0KShwYXRoKSA9PT0gXCJzZnpcIiAmJlxuICAgICAgICAgICAgICAgICAgICAoKDAsIHV0aWxzXzEucGF0aERpcikocGF0aCkgPT09IHJvb3QgfHwgKDAsIHV0aWxzXzEucGF0aERpcikocGF0aCkgPT09IHJvb3QgKyBcIlByb2dyYW1zL1wiKSkge1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0ZpbGUgPSBmaWxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWludGVyZmFjZUZpbGUgJiYgKDAsIHV0aWxzXzEucGF0aEV4dCkocGF0aCkgPT09IFwieG1sXCIgJiYgKDAsIHV0aWxzXzEucGF0aERpcikocGF0aCkgPT09IHJvb3QpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRmlsZSA9IGZpbGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhdWRpb0ZpbGVcIiwgYXVkaW9GaWxlKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiaW50ZXJmYWNlRmlsZVwiLCBpbnRlcmZhY2VGaWxlKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyZmFjZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLmxvYWRlci5zZXRSb290KHJvb3QpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLmxvYWRlci5hZGREaXJlY3RvcnkoZmlsZXMpO1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcmZhY2VGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmludGVyZmFjZS5sb2FkZXIuYWRkRmlsZShpbnRlcmZhY2VGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5pbnRlcmZhY2Uuc2hvd0ZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLnJlbmRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3IubG9hZGVyLnNldFJvb3Qocm9vdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3IubG9hZGVyLmFkZERpcmVjdG9yeShmaWxlcyk7XG4gICAgICAgICAgICAgICAgY29uc3QgZGVmYXVsdEZpbGUgPSBhdWRpb0ZpbGUgfHwgaW50ZXJmYWNlRmlsZTtcbiAgICAgICAgICAgICAgICBpZiAoZGVmYXVsdEZpbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuZWRpdG9yLmxvYWRlci5hZGRGaWxlKGRlZmF1bHRGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5lZGl0b3Iuc2hvd0ZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yLnJlbmRlcigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuYXVkaW8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmF1ZGlvLmxvYWRlci5zZXRSb290KHJvb3QpO1xuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW8ubG9hZGVyLmFkZERpcmVjdG9yeShmaWxlcyk7XG4gICAgICAgICAgICAgICAgaWYgKGF1ZGlvRmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5hdWRpby5sb2FkZXIuYWRkRmlsZShhdWRpb0ZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmF1ZGlvLnNob3dGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUGxheWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBldmVudF8xID0gcmVxdWlyZShcIi4vZXZlbnRcIik7XG5jbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBldmVudF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKGNsYXNzTmFtZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9XG4gICAgZ2V0RWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY2xhc3MgRXZlbnQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIH1cbiAgICBhZGRFdmVudCh0eXBlLCBmdW5jKSB7XG4gICAgICAgIGlmICghdGhpcy5ldmVudHNbdHlwZV0pIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzW3R5cGVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0ucHVzaChmdW5jKTtcbiAgICB9XG4gICAgcmVtb3ZlRXZlbnQodHlwZSwgZnVuYykge1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbdHlwZV0pIHtcbiAgICAgICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0uZm9yRWFjaCgoZXZlbnRGdW5jLCBpbmRleCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRGdW5jID09PSBmdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmV2ZW50c1t0eXBlXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBkaXNwYXRjaEV2ZW50KHR5cGUsIGRhdGEpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXS5mb3JFYWNoKChldmVudEZ1bmMpID0+IHtcbiAgICAgICAgICAgICAgICBldmVudEZ1bmMoeyBkYXRhLCB0YXJnZXQ6IHRoaXMsIHR5cGUgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEV2ZW50O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBsYXllckVsZW1lbnRzID0gdm9pZCAwO1xudmFyIFBsYXllckVsZW1lbnRzO1xuKGZ1bmN0aW9uIChQbGF5ZXJFbGVtZW50cykge1xuICAgIFBsYXllckVsZW1lbnRzW1wiS2V5Ym9hcmRcIl0gPSBcImtleWJvYXJkXCI7XG4gICAgUGxheWVyRWxlbWVudHNbXCJLbm9iXCJdID0gXCJrbm9iXCI7XG4gICAgUGxheWVyRWxlbWVudHNbXCJTbGlkZXJcIl0gPSBcInNsaWRlclwiO1xuICAgIFBsYXllckVsZW1lbnRzW1wiU3dpdGNoXCJdID0gXCJzd2l0Y2hcIjtcbn0pKFBsYXllckVsZW1lbnRzIHx8IChQbGF5ZXJFbGVtZW50cyA9IHt9KSk7XG5leHBvcnRzLlBsYXllckVsZW1lbnRzID0gUGxheWVyRWxlbWVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5nZXRYTUwgPSBleHBvcnRzLmdldFJhdyA9IGV4cG9ydHMuZ2V0SlNPTiA9IGV4cG9ydHMuZ2V0ID0gdm9pZCAwO1xuY29uc3QgeG1sX2pzXzEgPSByZXF1aXJlKFwieG1sLWpzXCIpO1xuZnVuY3Rpb24gZ2V0KHVybCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwi4qSTXCIsIHVybCk7XG4gICAgICAgIHJldHVybiBmZXRjaCh1cmwpLnRoZW4oKHJlcykgPT4gcmVzLnRleHQoKSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmdldCA9IGdldDtcbmZ1bmN0aW9uIGdldEpTT04odXJsKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLipJNcIiwgdXJsKTtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCkudGhlbigocmVzKSA9PiByZXMuanNvbigpKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZ2V0SlNPTiA9IGdldEpTT047XG5mdW5jdGlvbiBnZXRSYXcodXJsKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCLipJNcIiwgdXJsKTtcbiAgICAgICAgcmV0dXJuIGZldGNoKHVybCkudGhlbigocmVzKSA9PiByZXMuYXJyYXlCdWZmZXIoKSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmdldFJhdyA9IGdldFJhdztcbmZ1bmN0aW9uIGdldFhNTCh1cmwpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIuKkk1wiLCB1cmwpO1xuICAgICAgICByZXR1cm4gZmV0Y2godXJsKS50aGVuKChyZXMpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHsgcmV0dXJuICgwLCB4bWxfanNfMS54bWwyanMpKHlpZWxkIHJlcy50ZXh0KCkpOyB9KSk7XG4gICAgfSk7XG59XG5leHBvcnRzLmdldFhNTCA9IGdldFhNTDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBhcGlfMSA9IHJlcXVpcmUoXCIuL2FwaVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiLi91dGlsc1wiKTtcbmNsYXNzIEZpbGVMb2FkZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICAgICAgICB0aGlzLmZpbGVzID0ge307XG4gICAgICAgIHRoaXMuZmlsZXNUcmVlID0ge307XG4gICAgICAgIHRoaXMucm9vdCA9IFwiXCI7XG4gICAgfVxuICAgIGFkZERpcmVjdG9yeShmaWxlcykge1xuICAgICAgICB0aGlzLnJlc2V0RmlsZXMoKTtcbiAgICAgICAgZmlsZXMuZm9yRWFjaCgoZmlsZSkgPT4gdGhpcy5hZGRGaWxlKGZpbGUpKTtcbiAgICB9XG4gICAgYWRkRmlsZShmaWxlKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBkZWNvZGVVUkkodHlwZW9mIGZpbGUgPT09IFwic3RyaW5nXCIgPyBmaWxlIDogZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGgpO1xuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5yb290KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBmaWxlS2V5ID0gKDAsIHV0aWxzXzEucGF0aFN1YkRpcikocGF0aCwgdGhpcy5yb290KTtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVzW2ZpbGVLZXldID0ge1xuICAgICAgICAgICAgICAgIGV4dDogKDAsIHV0aWxzXzEucGF0aEV4dCkoZmlsZSksXG4gICAgICAgICAgICAgICAgY29udGVudHM6IG51bGwsXG4gICAgICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmZpbGVzW2ZpbGVLZXldID0ge1xuICAgICAgICAgICAgICAgIGV4dDogKDAsIHV0aWxzXzEucGF0aEV4dCkoZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGgpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBudWxsLFxuICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICAgICAgaGFuZGxlOiBmaWxlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmFkZFRvRmlsZVRyZWUoZmlsZUtleSk7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbGVzW2ZpbGVLZXldO1xuICAgIH1cbiAgICBhZGRUb0ZpbGVUcmVlKGtleSkge1xuICAgICAgICBrZXlcbiAgICAgICAgICAgIC5zcGxpdChcIi9cIilcbiAgICAgICAgICAgIC5yZWR1Y2UoKG8sIGspID0+IChvW2tdID0gb1trXSB8fCB7fSksIHRoaXMuZmlsZXNUcmVlKTtcbiAgICB9XG4gICAgbG9hZEZpbGVMb2NhbChmaWxlLCBidWZmZXIgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKGJ1ZmZlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0geWllbGQgZmlsZS5oYW5kbGUuYXJyYXlCdWZmZXIoKTtcbiAgICAgICAgICAgICAgICBmaWxlLmNvbnRlbnRzID0geWllbGQgdGhpcy5hdWRpby5kZWNvZGVBdWRpb0RhdGEoYXJyYXlCdWZmZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmlsZS5jb250ZW50cyA9IHlpZWxkIGZpbGUuaGFuZGxlLnRleHQoKTtcbiAgICAgICAgICAgIHJldHVybiBmaWxlO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbG9hZEZpbGVSZW1vdGUoZmlsZSwgYnVmZmVyID0gZmFsc2UpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGlmIChidWZmZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IHlpZWxkICgwLCBhcGlfMS5nZXRSYXcpKCgwLCB1dGlsc18xLmVuY29kZUhhc2hlcykoZmlsZS5wYXRoKSk7XG4gICAgICAgICAgICAgICAgZmlsZS5jb250ZW50cyA9IHlpZWxkIHRoaXMuYXVkaW8uZGVjb2RlQXVkaW9EYXRhKGFycmF5QnVmZmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZpbGUuY29udGVudHMgPSB5aWVsZCAoMCwgYXBpXzEuZ2V0KSgoMCwgdXRpbHNfMS5lbmNvZGVIYXNoZXMpKGZpbGUucGF0aCkpO1xuICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRGaWxlKGZpbGUsIGJ1ZmZlciA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBpZiAoIWZpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWxlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgaWYgKCgwLCB1dGlsc18xLnBhdGhFeHQpKGZpbGUpLmxlbmd0aCA9PT0gMClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVLZXkgPSAoMCwgdXRpbHNfMS5wYXRoU3ViRGlyKShmaWxlLCB0aGlzLnJvb3QpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGVSZWYgPSB0aGlzLmZpbGVzW2ZpbGVLZXldO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlLnN0YXJ0c1dpdGgoXCJodHRwXCIpKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5sb2FkRmlsZVJlbW90ZShmaWxlUmVmLCBidWZmZXIpO1xuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLmxvYWRGaWxlTG9jYWwoZmlsZVJlZiwgYnVmZmVyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChcImhhbmRsZVwiIGluIGZpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIHRoaXMubG9hZEZpbGVMb2NhbChmaWxlLCBidWZmZXIpO1xuICAgICAgICAgICAgcmV0dXJuIHlpZWxkIHRoaXMubG9hZEZpbGVSZW1vdGUoZmlsZSwgYnVmZmVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHNldFJvb3QoZGlyKSB7XG4gICAgICAgIHRoaXMucm9vdCA9IGRpcjtcbiAgICB9XG4gICAgcmVzZXRGaWxlcygpIHtcbiAgICAgICAgdGhpcy5maWxlcyA9IHt9O1xuICAgICAgICB0aGlzLmZpbGVzVHJlZSA9IHt9O1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEZpbGVMb2FkZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5zZXRQYXJzZXJMb2FkZXIgPSBleHBvcnRzLnBhcnNlU2Z6ID0gdm9pZCAwO1xubGV0IGxvYWRlcjtcbmNvbnN0IHNraXBDaGFyYWN0ZXJzID0gW1wiIFwiLCBcIlxcdFwiLCBcIlxcclwiLCBcIlxcblwiXTtcbmNvbnN0IGVuZENoYXJhY3RlcnMgPSBbXCI+XCIsIFwiXFxyXCIsIFwiXFxuXCJdO1xuZnVuY3Rpb24gcGFyc2VTZnoocHJlZml4LCBjb250ZW50cykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGxldCBoZWFkZXIgPSBcIlwiO1xuICAgICAgICBjb25zdCBtYXAgPSB7fTtcbiAgICAgICAgbGV0IHZhbHVlcyA9IHt9O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvbnRlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBjaGFyID0gY29udGVudHMuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKHNraXBDaGFyYWN0ZXJzLmluY2x1ZGVzKGNoYXIpKVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgY29uc3QgaUVuZCA9IGZpbmRFbmQoY29udGVudHMsIGkpO1xuICAgICAgICAgICAgaWYgKGNoYXIgPT09IFwiL1wiKSB7XG4gICAgICAgICAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY2hhciA9PT0gXCIjXCIpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3RpdmUgPSBjb250ZW50cy5zbGljZShpICsgMTAsIGlFbmQgLSAxKTtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlUmVmID0gbG9hZGVyLmZpbGVzW3ByZWZpeCArIGRpcmVjdGl2ZV07XG4gICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIGxvYWRlci5nZXRGaWxlKGZpbGVSZWYgfHwgcHJlZml4ICsgZGlyZWN0aXZlKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3RpdmVWYWx1ZXMgPSB5aWVsZCBwYXJzZVNmeihwcmVmaXgsIGZpbGUgPT09IG51bGwgfHwgZmlsZSA9PT0gdm9pZCAwID8gdm9pZCAwIDogZmlsZS5jb250ZW50cyk7XG4gICAgICAgICAgICAgICAgY29uc3QgaGVhZGVyVmFsdWVzID0gbWFwW2hlYWRlcl07XG4gICAgICAgICAgICAgICAgaGVhZGVyVmFsdWVzW2hlYWRlclZhbHVlcy5sZW5ndGggLSAxXSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmFzc2lnbih7fSwgaGVhZGVyVmFsdWVzW2hlYWRlclZhbHVlcy5sZW5ndGggLSAxXSksIGRpcmVjdGl2ZVZhbHVlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjaGFyID09PSBcIjxcIikge1xuICAgICAgICAgICAgICAgIGhlYWRlciA9IGNvbnRlbnRzLnNsaWNlKGkgKyAxLCBpRW5kKTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB7fTtcbiAgICAgICAgICAgICAgICBpZiAoIW1hcFtoZWFkZXJdKVxuICAgICAgICAgICAgICAgICAgICBtYXBbaGVhZGVyXSA9IFtdO1xuICAgICAgICAgICAgICAgIG1hcFtoZWFkZXJdLnB1c2godmFsdWVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG9wY29kZSA9IGNvbnRlbnRzLnNsaWNlKGksIGlFbmQpO1xuICAgICAgICAgICAgICAgIGNvbnN0IFtvcGNvZGVOYW1lLCBvcGNvZGVWYWx1ZV0gPSBvcGNvZGUuc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgICAgIGlmICghaXNOYU4ob3Bjb2RlVmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc1tvcGNvZGVOYW1lXSA9IE51bWJlcihvcGNvZGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZXNbb3Bjb2RlTmFtZV0gPSBvcGNvZGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpID0gaUVuZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWhlYWRlcilcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZXM7XG4gICAgICAgIHJldHVybiBtYXA7XG4gICAgfSk7XG59XG5leHBvcnRzLnBhcnNlU2Z6ID0gcGFyc2VTZno7XG5mdW5jdGlvbiBmaW5kRW5kKGNvbnRlbnRzLCBzdGFydEF0KSB7XG4gICAgZm9yIChsZXQgaW5kZXggPSBzdGFydEF0OyBpbmRleCA8IGNvbnRlbnRzLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICBjb25zdCBjaGFyID0gY29udGVudHMuY2hhckF0KGluZGV4KTtcbiAgICAgICAgaWYgKGVuZENoYXJhY3RlcnMuaW5jbHVkZXMoY2hhcikpXG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgICAgIGlmIChjaGFyID09PSBcIi9cIiAmJiBjb250ZW50cy5jaGFyQXQoaW5kZXggKyAxKSA9PT0gXCIvXCIpXG4gICAgICAgICAgICByZXR1cm4gaW5kZXg7XG4gICAgfVxuICAgIHJldHVybiBjb250ZW50cy5sZW5ndGg7XG59XG5mdW5jdGlvbiBzZXRQYXJzZXJMb2FkZXIoZmlsZUxvYWRlcikge1xuICAgIGxvYWRlciA9IGZpbGVMb2FkZXI7XG59XG5leHBvcnRzLnNldFBhcnNlckxvYWRlciA9IHNldFBhcnNlckxvYWRlcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5wYXRoU3ViRGlyID0gZXhwb3J0cy5wYXRoUm9vdCA9IGV4cG9ydHMucGF0aEV4dCA9IGV4cG9ydHMucGF0aERpciA9IGV4cG9ydHMuZW5jb2RlSGFzaGVzID0gdm9pZCAwO1xuZnVuY3Rpb24gZW5jb2RlSGFzaGVzKGl0ZW0pIHtcbiAgICByZXR1cm4gaXRlbS5yZXBsYWNlKC8jL2csIGVuY29kZVVSSUNvbXBvbmVudChcIiNcIikpO1xufVxuZXhwb3J0cy5lbmNvZGVIYXNoZXMgPSBlbmNvZGVIYXNoZXM7XG5mdW5jdGlvbiBwYXRoRGlyKGl0ZW0sIHNlcGFyYXRvciA9IFwiL1wiKSB7XG4gICAgcmV0dXJuIGl0ZW0uc3Vic3RyaW5nKDAsIGl0ZW0ubGFzdEluZGV4T2Yoc2VwYXJhdG9yKSArIDEpO1xufVxuZXhwb3J0cy5wYXRoRGlyID0gcGF0aERpcjtcbmZ1bmN0aW9uIHBhdGhFeHQoaXRlbSkge1xuICAgIHJldHVybiBpdGVtLnN1YnN0cmluZyhpdGVtLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xufVxuZXhwb3J0cy5wYXRoRXh0ID0gcGF0aEV4dDtcbmZ1bmN0aW9uIHBhdGhSb290KGl0ZW0sIHNlcGFyYXRvciA9IFwiL1wiKSB7XG4gICAgcmV0dXJuIGl0ZW0uc3Vic3RyaW5nKDAsIGl0ZW0uaW5kZXhPZihzZXBhcmF0b3IpICsgMSk7XG59XG5leHBvcnRzLnBhdGhSb290ID0gcGF0aFJvb3Q7XG5mdW5jdGlvbiBwYXRoU3ViRGlyKGl0ZW0sIGRpcikge1xuICAgIHJldHVybiBpdGVtLnN1YnN0cmluZyhkaXIubGVuZ3RoKTtcbn1cbmV4cG9ydHMucGF0aFN1YkRpciA9IHBhdGhTdWJEaXI7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcclxuXHJcbiAgaXNBcnJheTogZnVuY3Rpb24odmFsdWUpIHtcclxuICAgIGlmIChBcnJheS5pc0FycmF5KSB7XHJcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKTtcclxuICAgIH1cclxuICAgIC8vIGZhbGxiYWNrIGZvciBvbGRlciBicm93c2VycyBsaWtlICBJRSA4XHJcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKCB2YWx1ZSApID09PSAnW29iamVjdCBBcnJheV0nO1xyXG4gIH1cclxuXHJcbn07XHJcbiIsIi8qanNsaW50IG5vZGU6dHJ1ZSAqL1xyXG5cclxudmFyIHhtbDJqcyA9IHJlcXVpcmUoJy4veG1sMmpzJyk7XHJcbnZhciB4bWwyanNvbiA9IHJlcXVpcmUoJy4veG1sMmpzb24nKTtcclxudmFyIGpzMnhtbCA9IHJlcXVpcmUoJy4vanMyeG1sJyk7XHJcbnZhciBqc29uMnhtbCA9IHJlcXVpcmUoJy4vanNvbjJ4bWwnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHhtbDJqczogeG1sMmpzLFxyXG4gIHhtbDJqc29uOiB4bWwyanNvbixcclxuICBqczJ4bWw6IGpzMnhtbCxcclxuICBqc29uMnhtbDoganNvbjJ4bWxcclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vb3B0aW9ucy1oZWxwZXInKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9hcnJheS1oZWxwZXInKS5pc0FycmF5O1xuXG52YXIgY3VycmVudEVsZW1lbnQsIGN1cnJlbnRFbGVtZW50TmFtZTtcblxuZnVuY3Rpb24gdmFsaWRhdGVPcHRpb25zKHVzZXJPcHRpb25zKSB7XG4gIHZhciBvcHRpb25zID0gaGVscGVyLmNvcHlPcHRpb25zKHVzZXJPcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZURlY2xhcmF0aW9uJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVJbnN0cnVjdGlvbicsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlQXR0cmlidXRlcycsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlVGV4dCcsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlQ29tbWVudCcsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlQ2RhdGEnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZURvY3R5cGUnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2NvbXBhY3QnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2luZGVudFRleHQnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2luZGVudENkYXRhJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpbmRlbnRBdHRyaWJ1dGVzJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpbmRlbnRJbnN0cnVjdGlvbicsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnZnVsbFRhZ0VtcHR5RWxlbWVudCcsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnbm9RdW90ZXNGb3JOYXRpdmVBdHRyaWJ1dGVzJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVTcGFjZXNFeGlzdHMob3B0aW9ucyk7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5zcGFjZXMgPT09ICdudW1iZXInKSB7XG4gICAgb3B0aW9ucy5zcGFjZXMgPSBBcnJheShvcHRpb25zLnNwYWNlcyArIDEpLmpvaW4oJyAnKTtcbiAgfVxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdkZWNsYXJhdGlvbicsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdpbnN0cnVjdGlvbicsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdhdHRyaWJ1dGVzJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ3RleHQnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnY29tbWVudCcsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdjZGF0YScsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdkb2N0eXBlJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ3R5cGUnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnbmFtZScsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdlbGVtZW50cycsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnZG9jdHlwZScsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnaW5zdHJ1Y3Rpb24nLCBvcHRpb25zKTtcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2NkYXRhJywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdjb21tZW50Jywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCd0ZXh0Jywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdpbnN0cnVjdGlvbk5hbWUnLCBvcHRpb25zKTtcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2VsZW1lbnROYW1lJywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdhdHRyaWJ1dGVOYW1lJywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdhdHRyaWJ1dGVWYWx1ZScsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnYXR0cmlidXRlcycsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnZnVsbFRhZ0VtcHR5RWxlbWVudCcsIG9wdGlvbnMpO1xuICByZXR1cm4gb3B0aW9ucztcbn1cblxuZnVuY3Rpb24gd3JpdGVJbmRlbnRhdGlvbihvcHRpb25zLCBkZXB0aCwgZmlyc3RMaW5lKSB7XG4gIHJldHVybiAoIWZpcnN0TGluZSAmJiBvcHRpb25zLnNwYWNlcyA/ICdcXG4nIDogJycpICsgQXJyYXkoZGVwdGggKyAxKS5qb2luKG9wdGlvbnMuc3BhY2VzKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMsIG9wdGlvbnMsIGRlcHRoKSB7XG4gIGlmIChvcHRpb25zLmlnbm9yZUF0dHJpYnV0ZXMpIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgaWYgKCdhdHRyaWJ1dGVzRm4nIGluIG9wdGlvbnMpIHtcbiAgICBhdHRyaWJ1dGVzID0gb3B0aW9ucy5hdHRyaWJ1dGVzRm4oYXR0cmlidXRlcywgY3VycmVudEVsZW1lbnROYW1lLCBjdXJyZW50RWxlbWVudCk7XG4gIH1cbiAgdmFyIGtleSwgYXR0ciwgYXR0ck5hbWUsIHF1b3RlLCByZXN1bHQgPSBbXTtcbiAgZm9yIChrZXkgaW4gYXR0cmlidXRlcykge1xuICAgIGlmIChhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkgJiYgYXR0cmlidXRlc1trZXldICE9PSBudWxsICYmIGF0dHJpYnV0ZXNba2V5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBxdW90ZSA9IG9wdGlvbnMubm9RdW90ZXNGb3JOYXRpdmVBdHRyaWJ1dGVzICYmIHR5cGVvZiBhdHRyaWJ1dGVzW2tleV0gIT09ICdzdHJpbmcnID8gJycgOiAnXCInO1xuICAgICAgYXR0ciA9ICcnICsgYXR0cmlidXRlc1trZXldOyAvLyBlbnN1cmUgbnVtYmVyIGFuZCBib29sZWFuIGFyZSBjb252ZXJ0ZWQgdG8gU3RyaW5nXG4gICAgICBhdHRyID0gYXR0ci5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gICAgICBhdHRyTmFtZSA9ICdhdHRyaWJ1dGVOYW1lRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmF0dHJpYnV0ZU5hbWVGbihrZXksIGF0dHIsIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpIDoga2V5O1xuICAgICAgcmVzdWx0LnB1c2goKG9wdGlvbnMuc3BhY2VzICYmIG9wdGlvbnMuaW5kZW50QXR0cmlidXRlcz8gd3JpdGVJbmRlbnRhdGlvbihvcHRpb25zLCBkZXB0aCsxLCBmYWxzZSkgOiAnICcpKTtcbiAgICAgIHJlc3VsdC5wdXNoKGF0dHJOYW1lICsgJz0nICsgcXVvdGUgKyAoJ2F0dHJpYnV0ZVZhbHVlRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmF0dHJpYnV0ZVZhbHVlRm4oYXR0ciwga2V5LCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KSA6IGF0dHIpICsgcXVvdGUpO1xuICAgIH1cbiAgfVxuICBpZiAoYXR0cmlidXRlcyAmJiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5sZW5ndGggJiYgb3B0aW9ucy5zcGFjZXMgJiYgb3B0aW9ucy5pbmRlbnRBdHRyaWJ1dGVzKSB7XG4gICAgcmVzdWx0LnB1c2god3JpdGVJbmRlbnRhdGlvbihvcHRpb25zLCBkZXB0aCwgZmFsc2UpKTtcbiAgfVxuICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiB3cml0ZURlY2xhcmF0aW9uKGRlY2xhcmF0aW9uLCBvcHRpb25zLCBkZXB0aCkge1xuICBjdXJyZW50RWxlbWVudCA9IGRlY2xhcmF0aW9uO1xuICBjdXJyZW50RWxlbWVudE5hbWUgPSAneG1sJztcbiAgcmV0dXJuIG9wdGlvbnMuaWdub3JlRGVjbGFyYXRpb24gPyAnJyA6ICAnPD8nICsgJ3htbCcgKyB3cml0ZUF0dHJpYnV0ZXMoZGVjbGFyYXRpb25bb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSwgb3B0aW9ucywgZGVwdGgpICsgJz8+Jztcbn1cblxuZnVuY3Rpb24gd3JpdGVJbnN0cnVjdGlvbihpbnN0cnVjdGlvbiwgb3B0aW9ucywgZGVwdGgpIHtcbiAgaWYgKG9wdGlvbnMuaWdub3JlSW5zdHJ1Y3Rpb24pIHtcbiAgICByZXR1cm4gJyc7XG4gIH1cbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gaW5zdHJ1Y3Rpb24pIHtcbiAgICBpZiAoaW5zdHJ1Y3Rpb24uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHZhciBpbnN0cnVjdGlvbk5hbWUgPSAnaW5zdHJ1Y3Rpb25OYW1lRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmluc3RydWN0aW9uTmFtZUZuKGtleSwgaW5zdHJ1Y3Rpb25ba2V5XSwgY3VycmVudEVsZW1lbnROYW1lLCBjdXJyZW50RWxlbWVudCkgOiBrZXk7XG4gIGlmICh0eXBlb2YgaW5zdHJ1Y3Rpb25ba2V5XSA9PT0gJ29iamVjdCcpIHtcbiAgICBjdXJyZW50RWxlbWVudCA9IGluc3RydWN0aW9uO1xuICAgIGN1cnJlbnRFbGVtZW50TmFtZSA9IGluc3RydWN0aW9uTmFtZTtcbiAgICByZXR1cm4gJzw/JyArIGluc3RydWN0aW9uTmFtZSArIHdyaXRlQXR0cmlidXRlcyhpbnN0cnVjdGlvbltrZXldW29wdGlvbnMuYXR0cmlidXRlc0tleV0sIG9wdGlvbnMsIGRlcHRoKSArICc/Pic7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGluc3RydWN0aW9uVmFsdWUgPSBpbnN0cnVjdGlvbltrZXldID8gaW5zdHJ1Y3Rpb25ba2V5XSA6ICcnO1xuICAgIGlmICgnaW5zdHJ1Y3Rpb25GbicgaW4gb3B0aW9ucykgaW5zdHJ1Y3Rpb25WYWx1ZSA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25GbihpbnN0cnVjdGlvblZhbHVlLCBrZXksIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpO1xuICAgIHJldHVybiAnPD8nICsgaW5zdHJ1Y3Rpb25OYW1lICsgKGluc3RydWN0aW9uVmFsdWUgPyAnICcgKyBpbnN0cnVjdGlvblZhbHVlIDogJycpICsgJz8+JztcbiAgfVxufVxuXG5mdW5jdGlvbiB3cml0ZUNvbW1lbnQoY29tbWVudCwgb3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5pZ25vcmVDb21tZW50ID8gJycgOiAnPCEtLScgKyAoJ2NvbW1lbnRGbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuY29tbWVudEZuKGNvbW1lbnQsIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpIDogY29tbWVudCkgKyAnLS0+Jztcbn1cblxuZnVuY3Rpb24gd3JpdGVDZGF0YShjZGF0YSwgb3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5pZ25vcmVDZGF0YSA/ICcnIDogJzwhW0NEQVRBWycgKyAoJ2NkYXRhRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmNkYXRhRm4oY2RhdGEsIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpIDogY2RhdGEucmVwbGFjZSgnXV0+JywgJ11dXV0+PCFbQ0RBVEFbPicpKSArICddXT4nO1xufVxuXG5mdW5jdGlvbiB3cml0ZURvY3R5cGUoZG9jdHlwZSwgb3B0aW9ucykge1xuICByZXR1cm4gb3B0aW9ucy5pZ25vcmVEb2N0eXBlID8gJycgOiAnPCFET0NUWVBFICcgKyAoJ2RvY3R5cGVGbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuZG9jdHlwZUZuKGRvY3R5cGUsIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpIDogZG9jdHlwZSkgKyAnPic7XG59XG5cbmZ1bmN0aW9uIHdyaXRlVGV4dCh0ZXh0LCBvcHRpb25zKSB7XG4gIGlmIChvcHRpb25zLmlnbm9yZVRleHQpIHJldHVybiAnJztcbiAgdGV4dCA9ICcnICsgdGV4dDsgLy8gZW5zdXJlIE51bWJlciBhbmQgQm9vbGVhbiBhcmUgY29udmVydGVkIHRvIFN0cmluZ1xuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8mYW1wOy9nLCAnJicpOyAvLyBkZXNhbml0aXplIHRvIGF2b2lkIGRvdWJsZSBzYW5pdGl6YXRpb25cbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICByZXR1cm4gJ3RleHRGbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMudGV4dEZuKHRleHQsIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpIDogdGV4dDtcbn1cblxuZnVuY3Rpb24gaGFzQ29udGVudChlbGVtZW50LCBvcHRpb25zKSB7XG4gIHZhciBpO1xuICBpZiAoZWxlbWVudC5lbGVtZW50cyAmJiBlbGVtZW50LmVsZW1lbnRzLmxlbmd0aCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBlbGVtZW50LmVsZW1lbnRzLmxlbmd0aDsgKytpKSB7XG4gICAgICBzd2l0Y2ggKGVsZW1lbnQuZWxlbWVudHNbaV1bb3B0aW9ucy50eXBlS2V5XSkge1xuICAgICAgY2FzZSAndGV4dCc6XG4gICAgICAgIGlmIChvcHRpb25zLmluZGVudFRleHQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhazsgLy8gc2tpcCB0byBuZXh0IGtleVxuICAgICAgY2FzZSAnY2RhdGEnOlxuICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRDZGF0YSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrOyAvLyBza2lwIHRvIG5leHQga2V5XG4gICAgICBjYXNlICdpbnN0cnVjdGlvbic6XG4gICAgICAgIGlmIChvcHRpb25zLmluZGVudEluc3RydWN0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7IC8vIHNraXAgdG8gbmV4dCBrZXlcbiAgICAgIGNhc2UgJ2RvY3R5cGUnOlxuICAgICAgY2FzZSAnY29tbWVudCc6XG4gICAgICBjYXNlICdlbGVtZW50JzpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiB3cml0ZUVsZW1lbnQoZWxlbWVudCwgb3B0aW9ucywgZGVwdGgpIHtcbiAgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50O1xuICBjdXJyZW50RWxlbWVudE5hbWUgPSBlbGVtZW50Lm5hbWU7XG4gIHZhciB4bWwgPSBbXSwgZWxlbWVudE5hbWUgPSAnZWxlbWVudE5hbWVGbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuZWxlbWVudE5hbWVGbihlbGVtZW50Lm5hbWUsIGVsZW1lbnQpIDogZWxlbWVudC5uYW1lO1xuICB4bWwucHVzaCgnPCcgKyBlbGVtZW50TmFtZSk7XG4gIGlmIChlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0pIHtcbiAgICB4bWwucHVzaCh3cml0ZUF0dHJpYnV0ZXMoZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldLCBvcHRpb25zLCBkZXB0aCkpO1xuICB9XG4gIHZhciB3aXRoQ2xvc2luZ1RhZyA9IGVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0gJiYgZWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XS5sZW5ndGggfHwgZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldICYmIGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XVsneG1sOnNwYWNlJ10gPT09ICdwcmVzZXJ2ZSc7XG4gIGlmICghd2l0aENsb3NpbmdUYWcpIHtcbiAgICBpZiAoJ2Z1bGxUYWdFbXB0eUVsZW1lbnRGbicgaW4gb3B0aW9ucykge1xuICAgICAgd2l0aENsb3NpbmdUYWcgPSBvcHRpb25zLmZ1bGxUYWdFbXB0eUVsZW1lbnRGbihlbGVtZW50Lm5hbWUsIGVsZW1lbnQpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aXRoQ2xvc2luZ1RhZyA9IG9wdGlvbnMuZnVsbFRhZ0VtcHR5RWxlbWVudDtcbiAgICB9XG4gIH1cbiAgaWYgKHdpdGhDbG9zaW5nVGFnKSB7XG4gICAgeG1sLnB1c2goJz4nKTtcbiAgICBpZiAoZWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XSAmJiBlbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldLmxlbmd0aCkge1xuICAgICAgeG1sLnB1c2god3JpdGVFbGVtZW50cyhlbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldLCBvcHRpb25zLCBkZXB0aCArIDEpKTtcbiAgICAgIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgICAgIGN1cnJlbnRFbGVtZW50TmFtZSA9IGVsZW1lbnQubmFtZTtcbiAgICB9XG4gICAgeG1sLnB1c2gob3B0aW9ucy5zcGFjZXMgJiYgaGFzQ29udGVudChlbGVtZW50LCBvcHRpb25zKSA/ICdcXG4nICsgQXJyYXkoZGVwdGggKyAxKS5qb2luKG9wdGlvbnMuc3BhY2VzKSA6ICcnKTtcbiAgICB4bWwucHVzaCgnPC8nICsgZWxlbWVudE5hbWUgKyAnPicpO1xuICB9IGVsc2Uge1xuICAgIHhtbC5wdXNoKCcvPicpO1xuICB9XG4gIHJldHVybiB4bWwuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRWxlbWVudHMoZWxlbWVudHMsIG9wdGlvbnMsIGRlcHRoLCBmaXJzdExpbmUpIHtcbiAgcmV0dXJuIGVsZW1lbnRzLnJlZHVjZShmdW5jdGlvbiAoeG1sLCBlbGVtZW50KSB7XG4gICAgdmFyIGluZGVudCA9IHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSAmJiAheG1sKTtcbiAgICBzd2l0Y2ggKGVsZW1lbnQudHlwZSkge1xuICAgIGNhc2UgJ2VsZW1lbnQnOiByZXR1cm4geG1sICsgaW5kZW50ICsgd3JpdGVFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMsIGRlcHRoKTtcbiAgICBjYXNlICdjb21tZW50JzogcmV0dXJuIHhtbCArIGluZGVudCArIHdyaXRlQ29tbWVudChlbGVtZW50W29wdGlvbnMuY29tbWVudEtleV0sIG9wdGlvbnMpO1xuICAgIGNhc2UgJ2RvY3R5cGUnOiByZXR1cm4geG1sICsgaW5kZW50ICsgd3JpdGVEb2N0eXBlKGVsZW1lbnRbb3B0aW9ucy5kb2N0eXBlS2V5XSwgb3B0aW9ucyk7XG4gICAgY2FzZSAnY2RhdGEnOiByZXR1cm4geG1sICsgKG9wdGlvbnMuaW5kZW50Q2RhdGEgPyBpbmRlbnQgOiAnJykgKyB3cml0ZUNkYXRhKGVsZW1lbnRbb3B0aW9ucy5jZGF0YUtleV0sIG9wdGlvbnMpO1xuICAgIGNhc2UgJ3RleHQnOiByZXR1cm4geG1sICsgKG9wdGlvbnMuaW5kZW50VGV4dCA/IGluZGVudCA6ICcnKSArIHdyaXRlVGV4dChlbGVtZW50W29wdGlvbnMudGV4dEtleV0sIG9wdGlvbnMpO1xuICAgIGNhc2UgJ2luc3RydWN0aW9uJzpcbiAgICAgIHZhciBpbnN0cnVjdGlvbiA9IHt9O1xuICAgICAgaW5zdHJ1Y3Rpb25bZWxlbWVudFtvcHRpb25zLm5hbWVLZXldXSA9IGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSA/IGVsZW1lbnQgOiBlbGVtZW50W29wdGlvbnMuaW5zdHJ1Y3Rpb25LZXldO1xuICAgICAgcmV0dXJuIHhtbCArIChvcHRpb25zLmluZGVudEluc3RydWN0aW9uID8gaW5kZW50IDogJycpICsgd3JpdGVJbnN0cnVjdGlvbihpbnN0cnVjdGlvbiwgb3B0aW9ucywgZGVwdGgpO1xuICAgIH1cbiAgfSwgJycpO1xufVxuXG5mdW5jdGlvbiBoYXNDb250ZW50Q29tcGFjdChlbGVtZW50LCBvcHRpb25zLCBhbnlDb250ZW50KSB7XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSBvcHRpb25zLnBhcmVudEtleTpcbiAgICAgIGNhc2Ugb3B0aW9ucy5hdHRyaWJ1dGVzS2V5OlxuICAgICAgICBicmVhazsgLy8gc2tpcCB0byBuZXh0IGtleVxuICAgICAgY2FzZSBvcHRpb25zLnRleHRLZXk6XG4gICAgICAgIGlmIChvcHRpb25zLmluZGVudFRleHQgfHwgYW55Q29udGVudCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrOyAvLyBza2lwIHRvIG5leHQga2V5XG4gICAgICBjYXNlIG9wdGlvbnMuY2RhdGFLZXk6XG4gICAgICAgIGlmIChvcHRpb25zLmluZGVudENkYXRhIHx8IGFueUNvbnRlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhazsgLy8gc2tpcCB0byBuZXh0IGtleVxuICAgICAgY2FzZSBvcHRpb25zLmluc3RydWN0aW9uS2V5OlxuICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRJbnN0cnVjdGlvbiB8fCBhbnlDb250ZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7IC8vIHNraXAgdG8gbmV4dCBrZXlcbiAgICAgIGNhc2Ugb3B0aW9ucy5kb2N0eXBlS2V5OlxuICAgICAgY2FzZSBvcHRpb25zLmNvbW1lbnRLZXk6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gd3JpdGVFbGVtZW50Q29tcGFjdChlbGVtZW50LCBuYW1lLCBvcHRpb25zLCBkZXB0aCwgaW5kZW50KSB7XG4gIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgY3VycmVudEVsZW1lbnROYW1lID0gbmFtZTtcbiAgdmFyIGVsZW1lbnROYW1lID0gJ2VsZW1lbnROYW1lRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmVsZW1lbnROYW1lRm4obmFtZSwgZWxlbWVudCkgOiBuYW1lO1xuICBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IGVsZW1lbnQgPT09IG51bGwgfHwgZWxlbWVudCA9PT0gJycpIHtcbiAgICByZXR1cm4gJ2Z1bGxUYWdFbXB0eUVsZW1lbnRGbicgaW4gb3B0aW9ucyAmJiBvcHRpb25zLmZ1bGxUYWdFbXB0eUVsZW1lbnRGbihuYW1lLCBlbGVtZW50KSB8fCBvcHRpb25zLmZ1bGxUYWdFbXB0eUVsZW1lbnQgPyAnPCcgKyBlbGVtZW50TmFtZSArICc+PC8nICsgZWxlbWVudE5hbWUgKyAnPicgOiAnPCcgKyBlbGVtZW50TmFtZSArICcvPic7XG4gIH1cbiAgdmFyIHhtbCA9IFtdO1xuICBpZiAobmFtZSkge1xuICAgIHhtbC5wdXNoKCc8JyArIGVsZW1lbnROYW1lKTtcbiAgICBpZiAodHlwZW9mIGVsZW1lbnQgIT09ICdvYmplY3QnKSB7XG4gICAgICB4bWwucHVzaCgnPicgKyB3cml0ZVRleHQoZWxlbWVudCxvcHRpb25zKSArICc8LycgKyBlbGVtZW50TmFtZSArICc+Jyk7XG4gICAgICByZXR1cm4geG1sLmpvaW4oJycpO1xuICAgIH1cbiAgICBpZiAoZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldKSB7XG4gICAgICB4bWwucHVzaCh3cml0ZUF0dHJpYnV0ZXMoZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldLCBvcHRpb25zLCBkZXB0aCkpO1xuICAgIH1cbiAgICB2YXIgd2l0aENsb3NpbmdUYWcgPSBoYXNDb250ZW50Q29tcGFjdChlbGVtZW50LCBvcHRpb25zLCB0cnVlKSB8fCBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0gJiYgZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldWyd4bWw6c3BhY2UnXSA9PT0gJ3ByZXNlcnZlJztcbiAgICBpZiAoIXdpdGhDbG9zaW5nVGFnKSB7XG4gICAgICBpZiAoJ2Z1bGxUYWdFbXB0eUVsZW1lbnRGbicgaW4gb3B0aW9ucykge1xuICAgICAgICB3aXRoQ2xvc2luZ1RhZyA9IG9wdGlvbnMuZnVsbFRhZ0VtcHR5RWxlbWVudEZuKG5hbWUsIGVsZW1lbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2l0aENsb3NpbmdUYWcgPSBvcHRpb25zLmZ1bGxUYWdFbXB0eUVsZW1lbnQ7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh3aXRoQ2xvc2luZ1RhZykge1xuICAgICAgeG1sLnB1c2goJz4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgeG1sLnB1c2goJy8+Jyk7XG4gICAgICByZXR1cm4geG1sLmpvaW4oJycpO1xuICAgIH1cbiAgfVxuICB4bWwucHVzaCh3cml0ZUVsZW1lbnRzQ29tcGFjdChlbGVtZW50LCBvcHRpb25zLCBkZXB0aCArIDEsIGZhbHNlKSk7XG4gIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgY3VycmVudEVsZW1lbnROYW1lID0gbmFtZTtcbiAgaWYgKG5hbWUpIHtcbiAgICB4bWwucHVzaCgoaW5kZW50ID8gd3JpdGVJbmRlbnRhdGlvbihvcHRpb25zLCBkZXB0aCwgZmFsc2UpIDogJycpICsgJzwvJyArIGVsZW1lbnROYW1lICsgJz4nKTtcbiAgfVxuICByZXR1cm4geG1sLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUVsZW1lbnRzQ29tcGFjdChlbGVtZW50LCBvcHRpb25zLCBkZXB0aCwgZmlyc3RMaW5lKSB7XG4gIHZhciBpLCBrZXksIG5vZGVzLCB4bWwgPSBbXTtcbiAgZm9yIChrZXkgaW4gZWxlbWVudCkge1xuICAgIGlmIChlbGVtZW50Lmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIG5vZGVzID0gaXNBcnJheShlbGVtZW50W2tleV0pID8gZWxlbWVudFtrZXldIDogW2VsZW1lbnRba2V5XV07XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbm9kZXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgICAgY2FzZSBvcHRpb25zLmRlY2xhcmF0aW9uS2V5OiB4bWwucHVzaCh3cml0ZURlY2xhcmF0aW9uKG5vZGVzW2ldLCBvcHRpb25zLCBkZXB0aCkpOyBicmVhaztcbiAgICAgICAgY2FzZSBvcHRpb25zLmluc3RydWN0aW9uS2V5OiB4bWwucHVzaCgob3B0aW9ucy5pbmRlbnRJbnN0cnVjdGlvbiA/IHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkgOiAnJykgKyB3cml0ZUluc3RydWN0aW9uKG5vZGVzW2ldLCBvcHRpb25zLCBkZXB0aCkpOyBicmVhaztcbiAgICAgICAgY2FzZSBvcHRpb25zLmF0dHJpYnV0ZXNLZXk6IGNhc2Ugb3B0aW9ucy5wYXJlbnRLZXk6IGJyZWFrOyAvLyBza2lwXG4gICAgICAgIGNhc2Ugb3B0aW9ucy50ZXh0S2V5OiB4bWwucHVzaCgob3B0aW9ucy5pbmRlbnRUZXh0ID8gd3JpdGVJbmRlbnRhdGlvbihvcHRpb25zLCBkZXB0aCwgZmlyc3RMaW5lKSA6ICcnKSArIHdyaXRlVGV4dChub2Rlc1tpXSwgb3B0aW9ucykpOyBicmVhaztcbiAgICAgICAgY2FzZSBvcHRpb25zLmNkYXRhS2V5OiB4bWwucHVzaCgob3B0aW9ucy5pbmRlbnRDZGF0YSA/IHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkgOiAnJykgKyB3cml0ZUNkYXRhKG5vZGVzW2ldLCBvcHRpb25zKSk7IGJyZWFrO1xuICAgICAgICBjYXNlIG9wdGlvbnMuZG9jdHlwZUtleTogeG1sLnB1c2god3JpdGVJbmRlbnRhdGlvbihvcHRpb25zLCBkZXB0aCwgZmlyc3RMaW5lKSArIHdyaXRlRG9jdHlwZShub2Rlc1tpXSwgb3B0aW9ucykpOyBicmVhaztcbiAgICAgICAgY2FzZSBvcHRpb25zLmNvbW1lbnRLZXk6IHhtbC5wdXNoKHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkgKyB3cml0ZUNvbW1lbnQobm9kZXNbaV0sIG9wdGlvbnMpKTsgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IHhtbC5wdXNoKHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkgKyB3cml0ZUVsZW1lbnRDb21wYWN0KG5vZGVzW2ldLCBrZXksIG9wdGlvbnMsIGRlcHRoLCBoYXNDb250ZW50Q29tcGFjdChub2Rlc1tpXSwgb3B0aW9ucykpKTtcbiAgICAgICAgfVxuICAgICAgICBmaXJzdExpbmUgPSBmaXJzdExpbmUgJiYgIXhtbC5sZW5ndGg7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiB4bWwuam9pbignJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGpzLCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucyk7XG4gIHZhciB4bWwgPSBbXTtcbiAgY3VycmVudEVsZW1lbnQgPSBqcztcbiAgY3VycmVudEVsZW1lbnROYW1lID0gJ19yb290Xyc7XG4gIGlmIChvcHRpb25zLmNvbXBhY3QpIHtcbiAgICB4bWwucHVzaCh3cml0ZUVsZW1lbnRzQ29tcGFjdChqcywgb3B0aW9ucywgMCwgdHJ1ZSkpO1xuICB9IGVsc2Uge1xuICAgIGlmIChqc1tvcHRpb25zLmRlY2xhcmF0aW9uS2V5XSkge1xuICAgICAgeG1sLnB1c2god3JpdGVEZWNsYXJhdGlvbihqc1tvcHRpb25zLmRlY2xhcmF0aW9uS2V5XSwgb3B0aW9ucywgMCkpO1xuICAgIH1cbiAgICBpZiAoanNbb3B0aW9ucy5lbGVtZW50c0tleV0gJiYganNbb3B0aW9ucy5lbGVtZW50c0tleV0ubGVuZ3RoKSB7XG4gICAgICB4bWwucHVzaCh3cml0ZUVsZW1lbnRzKGpzW29wdGlvbnMuZWxlbWVudHNLZXldLCBvcHRpb25zLCAwLCAheG1sLmxlbmd0aCkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4geG1sLmpvaW4oJycpO1xufTtcbiIsInZhciBqczJ4bWwgPSByZXF1aXJlKCcuL2pzMnhtbC5qcycpO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoanNvbiwgb3B0aW9ucykge1xyXG4gIGlmIChqc29uIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICBqc29uID0ganNvbi50b1N0cmluZygpO1xyXG4gIH1cclxuICB2YXIganMgPSBudWxsO1xyXG4gIGlmICh0eXBlb2YgKGpzb24pID09PSAnc3RyaW5nJykge1xyXG4gICAgdHJ5IHtcclxuICAgICAganMgPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBKU09OIHN0cnVjdHVyZSBpcyBpbnZhbGlkJyk7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGpzID0ganNvbjtcclxuICB9XHJcbiAgcmV0dXJuIGpzMnhtbChqcywgb3B0aW9ucyk7XHJcbn07XHJcbiIsInZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9hcnJheS1oZWxwZXInKS5pc0FycmF5O1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGNvcHlPcHRpb25zOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgdmFyIGtleSwgY29weSA9IHt9O1xyXG4gICAgZm9yIChrZXkgaW4gb3B0aW9ucykge1xyXG4gICAgICBpZiAob3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgY29weVtrZXldID0gb3B0aW9uc1trZXldO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29weTtcclxuICB9LFxyXG5cclxuICBlbnN1cmVGbGFnRXhpc3RzOiBmdW5jdGlvbiAoaXRlbSwgb3B0aW9ucykge1xyXG4gICAgaWYgKCEoaXRlbSBpbiBvcHRpb25zKSB8fCB0eXBlb2Ygb3B0aW9uc1tpdGVtXSAhPT0gJ2Jvb2xlYW4nKSB7XHJcbiAgICAgIG9wdGlvbnNbaXRlbV0gPSBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBlbnN1cmVTcGFjZXNFeGlzdHM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAoISgnc3BhY2VzJyBpbiBvcHRpb25zKSB8fCAodHlwZW9mIG9wdGlvbnMuc3BhY2VzICE9PSAnbnVtYmVyJyAmJiB0eXBlb2Ygb3B0aW9ucy5zcGFjZXMgIT09ICdzdHJpbmcnKSkge1xyXG4gICAgICBvcHRpb25zLnNwYWNlcyA9IDA7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZW5zdXJlQWx3YXlzQXJyYXlFeGlzdHM6IGZ1bmN0aW9uIChvcHRpb25zKSB7XHJcbiAgICBpZiAoISgnYWx3YXlzQXJyYXknIGluIG9wdGlvbnMpIHx8ICh0eXBlb2Ygb3B0aW9ucy5hbHdheXNBcnJheSAhPT0gJ2Jvb2xlYW4nICYmICFpc0FycmF5KG9wdGlvbnMuYWx3YXlzQXJyYXkpKSkge1xyXG4gICAgICBvcHRpb25zLmFsd2F5c0FycmF5ID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZW5zdXJlS2V5RXhpc3RzOiBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICBpZiAoIShrZXkgKyAnS2V5JyBpbiBvcHRpb25zKSB8fCB0eXBlb2Ygb3B0aW9uc1trZXkgKyAnS2V5J10gIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIG9wdGlvbnNba2V5ICsgJ0tleSddID0gb3B0aW9ucy5jb21wYWN0ID8gJ18nICsga2V5IDoga2V5O1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGNoZWNrRm5FeGlzdHM6IGZ1bmN0aW9uIChrZXksIG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBrZXkgKyAnRm4nIGluIG9wdGlvbnM7XHJcbiAgfVxyXG5cclxufTtcclxuIiwidmFyIHNheCA9IHJlcXVpcmUoJ3NheCcpO1xyXG52YXIgZXhwYXQgLyo9IHJlcXVpcmUoJ25vZGUtZXhwYXQnKTsqLyA9IHsgb246IGZ1bmN0aW9uICgpIHsgfSwgcGFyc2U6IGZ1bmN0aW9uICgpIHsgfSB9O1xyXG52YXIgaGVscGVyID0gcmVxdWlyZSgnLi9vcHRpb25zLWhlbHBlcicpO1xyXG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vYXJyYXktaGVscGVyJykuaXNBcnJheTtcclxuXHJcbnZhciBvcHRpb25zO1xyXG52YXIgcHVyZUpzUGFyc2VyID0gdHJ1ZTtcclxudmFyIGN1cnJlbnRFbGVtZW50O1xyXG5cclxuZnVuY3Rpb24gdmFsaWRhdGVPcHRpb25zKHVzZXJPcHRpb25zKSB7XHJcbiAgb3B0aW9ucyA9IGhlbHBlci5jb3B5T3B0aW9ucyh1c2VyT3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZURlY2xhcmF0aW9uJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZUluc3RydWN0aW9uJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZUF0dHJpYnV0ZXMnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlVGV4dCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVDb21tZW50Jywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZUNkYXRhJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZURvY3R5cGUnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnY29tcGFjdCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdhbHdheXNDaGlsZHJlbicsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdhZGRQYXJlbnQnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygndHJpbScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCduYXRpdmVUeXBlJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ25hdGl2ZVR5cGVBdHRyaWJ1dGVzJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ3Nhbml0aXplJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2luc3RydWN0aW9uSGFzQXR0cmlidXRlcycsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdjYXB0dXJlU3BhY2VzQmV0d2VlbkVsZW1lbnRzJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUFsd2F5c0FycmF5RXhpc3RzKG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ2RlY2xhcmF0aW9uJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnaW5zdHJ1Y3Rpb24nLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdhdHRyaWJ1dGVzJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygndGV4dCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ2NvbW1lbnQnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdjZGF0YScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ2RvY3R5cGUnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCd0eXBlJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnbmFtZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ2VsZW1lbnRzJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygncGFyZW50Jywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2RvY3R5cGUnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnaW5zdHJ1Y3Rpb24nLCBvcHRpb25zKTtcclxuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnY2RhdGEnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnY29tbWVudCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCd0ZXh0Jywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2luc3RydWN0aW9uTmFtZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdlbGVtZW50TmFtZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdhdHRyaWJ1dGVOYW1lJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2F0dHJpYnV0ZVZhbHVlJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2F0dHJpYnV0ZXMnLCBvcHRpb25zKTtcclxuICByZXR1cm4gb3B0aW9ucztcclxufVxyXG5cclxuZnVuY3Rpb24gbmF0aXZlVHlwZSh2YWx1ZSkge1xyXG4gIHZhciBuVmFsdWUgPSBOdW1iZXIodmFsdWUpO1xyXG4gIGlmICghaXNOYU4oblZhbHVlKSkge1xyXG4gICAgcmV0dXJuIG5WYWx1ZTtcclxuICB9XHJcbiAgdmFyIGJWYWx1ZSA9IHZhbHVlLnRvTG93ZXJDYXNlKCk7XHJcbiAgaWYgKGJWYWx1ZSA9PT0gJ3RydWUnKSB7XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxuICB9IGVsc2UgaWYgKGJWYWx1ZSA9PT0gJ2ZhbHNlJykge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxuICByZXR1cm4gdmFsdWU7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZEZpZWxkKHR5cGUsIHZhbHVlKSB7XHJcbiAgdmFyIGtleTtcclxuICBpZiAob3B0aW9ucy5jb21wYWN0KSB7XHJcbiAgICBpZiAoXHJcbiAgICAgICFjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dICYmXHJcbiAgICAgIChpc0FycmF5KG9wdGlvbnMuYWx3YXlzQXJyYXkpID8gb3B0aW9ucy5hbHdheXNBcnJheS5pbmRleE9mKG9wdGlvbnNbdHlwZSArICdLZXknXSkgIT09IC0xIDogb3B0aW9ucy5hbHdheXNBcnJheSlcclxuICAgICkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dID0gW107XHJcbiAgICB9XHJcbiAgICBpZiAoY3VycmVudEVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSAmJiAhaXNBcnJheShjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dKSkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dID0gW2N1cnJlbnRFbGVtZW50W29wdGlvbnNbdHlwZSArICdLZXknXV1dO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGUgKyAnRm4nIGluIG9wdGlvbnMgJiYgdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xyXG4gICAgICB2YWx1ZSA9IG9wdGlvbnNbdHlwZSArICdGbiddKHZhbHVlLCBjdXJyZW50RWxlbWVudCk7XHJcbiAgICB9XHJcbiAgICBpZiAodHlwZSA9PT0gJ2luc3RydWN0aW9uJyAmJiAoJ2luc3RydWN0aW9uRm4nIGluIG9wdGlvbnMgfHwgJ2luc3RydWN0aW9uTmFtZUZuJyBpbiBvcHRpb25zKSkge1xyXG4gICAgICBmb3IgKGtleSBpbiB2YWx1ZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICBpZiAoJ2luc3RydWN0aW9uRm4nIGluIG9wdGlvbnMpIHtcclxuICAgICAgICAgICAgdmFsdWVba2V5XSA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25Gbih2YWx1ZVtrZXldLCBrZXksIGN1cnJlbnRFbGVtZW50KTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciB0ZW1wID0gdmFsdWVba2V5XTtcclxuICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tleV07XHJcbiAgICAgICAgICAgIHZhbHVlW29wdGlvbnMuaW5zdHJ1Y3Rpb25OYW1lRm4oa2V5LCB0ZW1wLCBjdXJyZW50RWxlbWVudCldID0gdGVtcDtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChpc0FycmF5KGN1cnJlbnRFbGVtZW50W29wdGlvbnNbdHlwZSArICdLZXknXV0pKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50W29wdGlvbnNbdHlwZSArICdLZXknXV0ucHVzaCh2YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICghY3VycmVudEVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0pIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0gPSBbXTtcclxuICAgIH1cclxuICAgIHZhciBlbGVtZW50ID0ge307XHJcbiAgICBlbGVtZW50W29wdGlvbnMudHlwZUtleV0gPSB0eXBlO1xyXG4gICAgaWYgKHR5cGUgPT09ICdpbnN0cnVjdGlvbicpIHtcclxuICAgICAgZm9yIChrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnRbb3B0aW9ucy5uYW1lS2V5XSA9ICdpbnN0cnVjdGlvbk5hbWVGbicgaW4gb3B0aW9ucyA/IG9wdGlvbnMuaW5zdHJ1Y3Rpb25OYW1lRm4oa2V5LCB2YWx1ZSwgY3VycmVudEVsZW1lbnQpIDoga2V5O1xyXG4gICAgICBpZiAob3B0aW9ucy5pbnN0cnVjdGlvbkhhc0F0dHJpYnV0ZXMpIHtcclxuICAgICAgICBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0gPSB2YWx1ZVtrZXldW29wdGlvbnMuYXR0cmlidXRlc0tleV07XHJcbiAgICAgICAgaWYgKCdpbnN0cnVjdGlvbkZuJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0gPSBvcHRpb25zLmluc3RydWN0aW9uRm4oZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldLCBrZXksIGN1cnJlbnRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaWYgKCdpbnN0cnVjdGlvbkZuJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICB2YWx1ZVtrZXldID0gb3B0aW9ucy5pbnN0cnVjdGlvbkZuKHZhbHVlW2tleV0sIGtleSwgY3VycmVudEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbGVtZW50W29wdGlvbnMuaW5zdHJ1Y3Rpb25LZXldID0gdmFsdWVba2V5XTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHR5cGUgKyAnRm4nIGluIG9wdGlvbnMpIHtcclxuICAgICAgICB2YWx1ZSA9IG9wdGlvbnNbdHlwZSArICdGbiddKHZhbHVlLCBjdXJyZW50RWxlbWVudCk7XHJcbiAgICAgIH1cclxuICAgICAgZWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dID0gdmFsdWU7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5hZGRQYXJlbnQpIHtcclxuICAgICAgZWxlbWVudFtvcHRpb25zLnBhcmVudEtleV0gPSBjdXJyZW50RWxlbWVudDtcclxuICAgIH1cclxuICAgIGN1cnJlbnRFbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldLnB1c2goZWxlbWVudCk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYW5pcHVsYXRlQXR0cmlidXRlcyhhdHRyaWJ1dGVzKSB7XHJcbiAgaWYgKCdhdHRyaWJ1dGVzRm4nIGluIG9wdGlvbnMgJiYgYXR0cmlidXRlcykge1xyXG4gICAgYXR0cmlidXRlcyA9IG9wdGlvbnMuYXR0cmlidXRlc0ZuKGF0dHJpYnV0ZXMsIGN1cnJlbnRFbGVtZW50KTtcclxuICB9XHJcbiAgaWYgKChvcHRpb25zLnRyaW0gfHwgJ2F0dHJpYnV0ZVZhbHVlRm4nIGluIG9wdGlvbnMgfHwgJ2F0dHJpYnV0ZU5hbWVGbicgaW4gb3B0aW9ucyB8fCBvcHRpb25zLm5hdGl2ZVR5cGVBdHRyaWJ1dGVzKSAmJiBhdHRyaWJ1dGVzKSB7XHJcbiAgICB2YXIga2V5O1xyXG4gICAgZm9yIChrZXkgaW4gYXR0cmlidXRlcykge1xyXG4gICAgICBpZiAoYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudHJpbSkgYXR0cmlidXRlc1trZXldID0gYXR0cmlidXRlc1trZXldLnRyaW0oKTtcclxuICAgICAgICBpZiAob3B0aW9ucy5uYXRpdmVUeXBlQXR0cmlidXRlcykge1xyXG4gICAgICAgICAgYXR0cmlidXRlc1trZXldID0gbmF0aXZlVHlwZShhdHRyaWJ1dGVzW2tleV0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoJ2F0dHJpYnV0ZVZhbHVlRm4nIGluIG9wdGlvbnMpIGF0dHJpYnV0ZXNba2V5XSA9IG9wdGlvbnMuYXR0cmlidXRlVmFsdWVGbihhdHRyaWJ1dGVzW2tleV0sIGtleSwgY3VycmVudEVsZW1lbnQpO1xyXG4gICAgICAgIGlmICgnYXR0cmlidXRlTmFtZUZuJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICB2YXIgdGVtcCA9IGF0dHJpYnV0ZXNba2V5XTtcclxuICAgICAgICAgIGRlbGV0ZSBhdHRyaWJ1dGVzW2tleV07XHJcbiAgICAgICAgICBhdHRyaWJ1dGVzW29wdGlvbnMuYXR0cmlidXRlTmFtZUZuKGtleSwgYXR0cmlidXRlc1trZXldLCBjdXJyZW50RWxlbWVudCldID0gdGVtcDtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIGF0dHJpYnV0ZXM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24pIHtcclxuICB2YXIgYXR0cmlidXRlcyA9IHt9O1xyXG4gIGlmIChpbnN0cnVjdGlvbi5ib2R5ICYmIChpbnN0cnVjdGlvbi5uYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd4bWwnIHx8IG9wdGlvbnMuaW5zdHJ1Y3Rpb25IYXNBdHRyaWJ1dGVzKSkge1xyXG4gICAgdmFyIGF0dHJzUmVnRXhwID0gLyhbXFx3Oi1dKylcXHMqPVxccyooPzpcIihbXlwiXSopXCJ8JyhbXiddKiknfChcXHcrKSlcXHMqL2c7XHJcbiAgICB2YXIgbWF0Y2g7XHJcbiAgICB3aGlsZSAoKG1hdGNoID0gYXR0cnNSZWdFeHAuZXhlYyhpbnN0cnVjdGlvbi5ib2R5KSkgIT09IG51bGwpIHtcclxuICAgICAgYXR0cmlidXRlc1ttYXRjaFsxXV0gPSBtYXRjaFsyXSB8fCBtYXRjaFszXSB8fCBtYXRjaFs0XTtcclxuICAgIH1cclxuICAgIGF0dHJpYnV0ZXMgPSBtYW5pcHVsYXRlQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcclxuICB9XHJcbiAgaWYgKGluc3RydWN0aW9uLm5hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3htbCcpIHtcclxuICAgIGlmIChvcHRpb25zLmlnbm9yZURlY2xhcmF0aW9uKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGN1cnJlbnRFbGVtZW50W29wdGlvbnMuZGVjbGFyYXRpb25LZXldID0ge307XHJcbiAgICBpZiAoT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50W29wdGlvbnMuZGVjbGFyYXRpb25LZXldW29wdGlvbnMuYXR0cmlidXRlc0tleV0gPSBhdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuYWRkUGFyZW50KSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50W29wdGlvbnMuZGVjbGFyYXRpb25LZXldW29wdGlvbnMucGFyZW50S2V5XSA9IGN1cnJlbnRFbGVtZW50O1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAob3B0aW9ucy5pZ25vcmVJbnN0cnVjdGlvbikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy50cmltKSB7XHJcbiAgICAgIGluc3RydWN0aW9uLmJvZHkgPSBpbnN0cnVjdGlvbi5ib2R5LnRyaW0oKTtcclxuICAgIH1cclxuICAgIHZhciB2YWx1ZSA9IHt9O1xyXG4gICAgaWYgKG9wdGlvbnMuaW5zdHJ1Y3Rpb25IYXNBdHRyaWJ1dGVzICYmIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aCkge1xyXG4gICAgICB2YWx1ZVtpbnN0cnVjdGlvbi5uYW1lXSA9IHt9O1xyXG4gICAgICB2YWx1ZVtpbnN0cnVjdGlvbi5uYW1lXVtvcHRpb25zLmF0dHJpYnV0ZXNLZXldID0gYXR0cmlidXRlcztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhbHVlW2luc3RydWN0aW9uLm5hbWVdID0gaW5zdHJ1Y3Rpb24uYm9keTtcclxuICAgIH1cclxuICAgIGFkZEZpZWxkKCdpbnN0cnVjdGlvbicsIHZhbHVlKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uU3RhcnRFbGVtZW50KG5hbWUsIGF0dHJpYnV0ZXMpIHtcclxuICB2YXIgZWxlbWVudDtcclxuICBpZiAodHlwZW9mIG5hbWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICBhdHRyaWJ1dGVzID0gbmFtZS5hdHRyaWJ1dGVzO1xyXG4gICAgbmFtZSA9IG5hbWUubmFtZTtcclxuICB9XHJcbiAgYXR0cmlidXRlcyA9IG1hbmlwdWxhdGVBdHRyaWJ1dGVzKGF0dHJpYnV0ZXMpO1xyXG4gIGlmICgnZWxlbWVudE5hbWVGbicgaW4gb3B0aW9ucykge1xyXG4gICAgbmFtZSA9IG9wdGlvbnMuZWxlbWVudE5hbWVGbihuYW1lLCBjdXJyZW50RWxlbWVudCk7XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLmNvbXBhY3QpIHtcclxuICAgIGVsZW1lbnQgPSB7fTtcclxuICAgIGlmICghb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMgJiYgT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XHJcbiAgICAgIGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSA9IHt9O1xyXG4gICAgICB2YXIga2V5O1xyXG4gICAgICBmb3IgKGtleSBpbiBhdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldW2tleV0gPSBhdHRyaWJ1dGVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoXHJcbiAgICAgICEobmFtZSBpbiBjdXJyZW50RWxlbWVudCkgJiZcclxuICAgICAgKGlzQXJyYXkob3B0aW9ucy5hbHdheXNBcnJheSkgPyBvcHRpb25zLmFsd2F5c0FycmF5LmluZGV4T2YobmFtZSkgIT09IC0xIDogb3B0aW9ucy5hbHdheXNBcnJheSlcclxuICAgICkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtuYW1lXSA9IFtdO1xyXG4gICAgfVxyXG4gICAgaWYgKGN1cnJlbnRFbGVtZW50W25hbWVdICYmICFpc0FycmF5KGN1cnJlbnRFbGVtZW50W25hbWVdKSkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtuYW1lXSA9IFtjdXJyZW50RWxlbWVudFtuYW1lXV07XHJcbiAgICB9XHJcbiAgICBpZiAoaXNBcnJheShjdXJyZW50RWxlbWVudFtuYW1lXSkpIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbbmFtZV0ucHVzaChlbGVtZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50W25hbWVdID0gZWxlbWVudDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKCFjdXJyZW50RWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XSkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XSA9IFtdO1xyXG4gICAgfVxyXG4gICAgZWxlbWVudCA9IHt9O1xyXG4gICAgZWxlbWVudFtvcHRpb25zLnR5cGVLZXldID0gJ2VsZW1lbnQnO1xyXG4gICAgZWxlbWVudFtvcHRpb25zLm5hbWVLZXldID0gbmFtZTtcclxuICAgIGlmICghb3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzICYmIGF0dHJpYnV0ZXMgJiYgT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoKSB7XHJcbiAgICAgIGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSA9IGF0dHJpYnV0ZXM7XHJcbiAgICB9XHJcbiAgICBpZiAob3B0aW9ucy5hbHdheXNDaGlsZHJlbikge1xyXG4gICAgICBlbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldID0gW107XHJcbiAgICB9XHJcbiAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XS5wdXNoKGVsZW1lbnQpO1xyXG4gIH1cclxuICBlbGVtZW50W29wdGlvbnMucGFyZW50S2V5XSA9IGN1cnJlbnRFbGVtZW50OyAvLyB3aWxsIGJlIGRlbGV0ZWQgaW4gb25FbmRFbGVtZW50KCkgaWYgIW9wdGlvbnMuYWRkUGFyZW50XHJcbiAgY3VycmVudEVsZW1lbnQgPSBlbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBvblRleHQodGV4dCkge1xyXG4gIGlmIChvcHRpb25zLmlnbm9yZVRleHQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKCF0ZXh0LnRyaW0oKSAmJiAhb3B0aW9ucy5jYXB0dXJlU3BhY2VzQmV0d2VlbkVsZW1lbnRzKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLnRyaW0pIHtcclxuICAgIHRleHQgPSB0ZXh0LnRyaW0oKTtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMubmF0aXZlVHlwZSkge1xyXG4gICAgdGV4dCA9IG5hdGl2ZVR5cGUodGV4dCk7XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLnNhbml0aXplKSB7XHJcbiAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC8mL2csICcmYW1wOycpLnJlcGxhY2UoLzwvZywgJyZsdDsnKS5yZXBsYWNlKC8+L2csICcmZ3Q7Jyk7XHJcbiAgfVxyXG4gIGFkZEZpZWxkKCd0ZXh0JywgdGV4dCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uQ29tbWVudChjb21tZW50KSB7XHJcbiAgaWYgKG9wdGlvbnMuaWdub3JlQ29tbWVudCkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAob3B0aW9ucy50cmltKSB7XHJcbiAgICBjb21tZW50ID0gY29tbWVudC50cmltKCk7XHJcbiAgfVxyXG4gIGFkZEZpZWxkKCdjb21tZW50JywgY29tbWVudCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRW5kRWxlbWVudChuYW1lKSB7XHJcbiAgdmFyIHBhcmVudEVsZW1lbnQgPSBjdXJyZW50RWxlbWVudFtvcHRpb25zLnBhcmVudEtleV07XHJcbiAgaWYgKCFvcHRpb25zLmFkZFBhcmVudCkge1xyXG4gICAgZGVsZXRlIGN1cnJlbnRFbGVtZW50W29wdGlvbnMucGFyZW50S2V5XTtcclxuICB9XHJcbiAgY3VycmVudEVsZW1lbnQgPSBwYXJlbnRFbGVtZW50O1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkNkYXRhKGNkYXRhKSB7XHJcbiAgaWYgKG9wdGlvbnMuaWdub3JlQ2RhdGEpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMudHJpbSkge1xyXG4gICAgY2RhdGEgPSBjZGF0YS50cmltKCk7XHJcbiAgfVxyXG4gIGFkZEZpZWxkKCdjZGF0YScsIGNkYXRhKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25Eb2N0eXBlKGRvY3R5cGUpIHtcclxuICBpZiAob3B0aW9ucy5pZ25vcmVEb2N0eXBlKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGRvY3R5cGUgPSBkb2N0eXBlLnJlcGxhY2UoL14gLywgJycpO1xyXG4gIGlmIChvcHRpb25zLnRyaW0pIHtcclxuICAgIGRvY3R5cGUgPSBkb2N0eXBlLnRyaW0oKTtcclxuICB9XHJcbiAgYWRkRmllbGQoJ2RvY3R5cGUnLCBkb2N0eXBlKTtcclxufVxyXG5cclxuZnVuY3Rpb24gb25FcnJvcihlcnJvcikge1xyXG4gIGVycm9yLm5vdGUgPSBlcnJvcjsgLy9jb25zb2xlLmVycm9yKGVycm9yKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoeG1sLCB1c2VyT3B0aW9ucykge1xyXG5cclxuICB2YXIgcGFyc2VyID0gcHVyZUpzUGFyc2VyID8gc2F4LnBhcnNlcih0cnVlLCB7fSkgOiBwYXJzZXIgPSBuZXcgZXhwYXQuUGFyc2VyKCdVVEYtOCcpO1xyXG4gIHZhciByZXN1bHQgPSB7fTtcclxuICBjdXJyZW50RWxlbWVudCA9IHJlc3VsdDtcclxuXHJcbiAgb3B0aW9ucyA9IHZhbGlkYXRlT3B0aW9ucyh1c2VyT3B0aW9ucyk7XHJcblxyXG4gIGlmIChwdXJlSnNQYXJzZXIpIHtcclxuICAgIHBhcnNlci5vcHQgPSB7c3RyaWN0RW50aXRpZXM6IHRydWV9O1xyXG4gICAgcGFyc2VyLm9ub3BlbnRhZyA9IG9uU3RhcnRFbGVtZW50O1xyXG4gICAgcGFyc2VyLm9udGV4dCA9IG9uVGV4dDtcclxuICAgIHBhcnNlci5vbmNvbW1lbnQgPSBvbkNvbW1lbnQ7XHJcbiAgICBwYXJzZXIub25jbG9zZXRhZyA9IG9uRW5kRWxlbWVudDtcclxuICAgIHBhcnNlci5vbmVycm9yID0gb25FcnJvcjtcclxuICAgIHBhcnNlci5vbmNkYXRhID0gb25DZGF0YTtcclxuICAgIHBhcnNlci5vbmRvY3R5cGUgPSBvbkRvY3R5cGU7XHJcbiAgICBwYXJzZXIub25wcm9jZXNzaW5naW5zdHJ1Y3Rpb24gPSBvbkluc3RydWN0aW9uO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBwYXJzZXIub24oJ3N0YXJ0RWxlbWVudCcsIG9uU3RhcnRFbGVtZW50KTtcclxuICAgIHBhcnNlci5vbigndGV4dCcsIG9uVGV4dCk7XHJcbiAgICBwYXJzZXIub24oJ2NvbW1lbnQnLCBvbkNvbW1lbnQpO1xyXG4gICAgcGFyc2VyLm9uKCdlbmRFbGVtZW50Jywgb25FbmRFbGVtZW50KTtcclxuICAgIHBhcnNlci5vbignZXJyb3InLCBvbkVycm9yKTtcclxuICAgIC8vcGFyc2VyLm9uKCdzdGFydENkYXRhJywgb25TdGFydENkYXRhKTtcclxuICAgIC8vcGFyc2VyLm9uKCdlbmRDZGF0YScsIG9uRW5kQ2RhdGEpO1xyXG4gICAgLy9wYXJzZXIub24oJ2VudGl0eURlY2wnLCBvbkVudGl0eURlY2wpO1xyXG4gIH1cclxuXHJcbiAgaWYgKHB1cmVKc1BhcnNlcikge1xyXG4gICAgcGFyc2VyLndyaXRlKHhtbCkuY2xvc2UoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKCFwYXJzZXIucGFyc2UoeG1sKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1hNTCBwYXJzaW5nIGVycm9yOiAnICsgcGFyc2VyLmdldEVycm9yKCkpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgaWYgKHJlc3VsdFtvcHRpb25zLmVsZW1lbnRzS2V5XSkge1xyXG4gICAgdmFyIHRlbXAgPSByZXN1bHRbb3B0aW9ucy5lbGVtZW50c0tleV07XHJcbiAgICBkZWxldGUgcmVzdWx0W29wdGlvbnMuZWxlbWVudHNLZXldO1xyXG4gICAgcmVzdWx0W29wdGlvbnMuZWxlbWVudHNLZXldID0gdGVtcDtcclxuICAgIGRlbGV0ZSByZXN1bHQudGV4dDtcclxuICB9XHJcblxyXG4gIHJldHVybiByZXN1bHQ7XHJcblxyXG59O1xyXG4iLCJ2YXIgaGVscGVyID0gcmVxdWlyZSgnLi9vcHRpb25zLWhlbHBlcicpO1xyXG52YXIgeG1sMmpzID0gcmVxdWlyZSgnLi94bWwyanMnKTtcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlT3B0aW9ucyAodXNlck9wdGlvbnMpIHtcclxuICB2YXIgb3B0aW9ucyA9IGhlbHBlci5jb3B5T3B0aW9ucyh1c2VyT3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZVNwYWNlc0V4aXN0cyhvcHRpb25zKTtcclxuICByZXR1cm4gb3B0aW9ucztcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih4bWwsIHVzZXJPcHRpb25zKSB7XHJcbiAgdmFyIG9wdGlvbnMsIGpzLCBqc29uLCBwYXJlbnRLZXk7XHJcbiAgb3B0aW9ucyA9IHZhbGlkYXRlT3B0aW9ucyh1c2VyT3B0aW9ucyk7XHJcbiAganMgPSB4bWwyanMoeG1sLCBvcHRpb25zKTtcclxuICBwYXJlbnRLZXkgPSAnY29tcGFjdCcgaW4gb3B0aW9ucyAmJiBvcHRpb25zLmNvbXBhY3QgPyAnX3BhcmVudCcgOiAncGFyZW50JztcclxuICAvLyBwYXJlbnRLZXkgPSBwdGlvbnMuY29tcGFjdCA/ICdfcGFyZW50JyA6ICdwYXJlbnQnOyAvLyBjb25zaWRlciB0aGlzXHJcbiAgaWYgKCdhZGRQYXJlbnQnIGluIG9wdGlvbnMgJiYgb3B0aW9ucy5hZGRQYXJlbnQpIHtcclxuICAgIGpzb24gPSBKU09OLnN0cmluZ2lmeShqcywgZnVuY3Rpb24gKGssIHYpIHsgcmV0dXJuIGsgPT09IHBhcmVudEtleT8gJ18nIDogdjsgfSwgb3B0aW9ucy5zcGFjZXMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBqc29uID0gSlNPTi5zdHJpbmdpZnkoanMsIG51bGwsIG9wdGlvbnMuc3BhY2VzKTtcclxuICB9XHJcbiAgcmV0dXJuIGpzb24ucmVwbGFjZSgvXFx1MjAyOC9nLCAnXFxcXHUyMDI4JykucmVwbGFjZSgvXFx1MjAyOS9nLCAnXFxcXHUyMDI5Jyk7XHJcbn07XHJcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgb29wID0gYWNlLnJlcXVpcmUoXCJhY2UvbGliL29vcFwiKTtcbnZhciBUZXh0TW9kZSA9IGFjZS5yZXF1aXJlKFwiYWNlL21vZGUvdGV4dFwiKS5Nb2RlO1xudmFyIFNGWkhpZ2hsaWdodFJ1bGVzID0gcmVxdWlyZShcIi4vc2Z6X2hpZ2hsaWdodF9ydWxlc1wiKS5TRlpIaWdobGlnaHRSdWxlcztcbnZhciBGb2xkTW9kZSA9IHJlcXVpcmUoXCIuL3Nmel9mb2xkaW5nX21vZGVcIikuRm9sZE1vZGU7XG5cbnZhciBNb2RlID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLkhpZ2hsaWdodFJ1bGVzID0gU0ZaSGlnaGxpZ2h0UnVsZXM7XG4gIHRoaXMuZm9sZGluZ1J1bGVzID0gbmV3IEZvbGRNb2RlKCk7XG59O1xub29wLmluaGVyaXRzKE1vZGUsIFRleHRNb2RlKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5saW5lQ29tbWVudFN0YXJ0ID0gXCIvL1wiO1xuXG4gIHRoaXMuJGlkID0gXCJhY2UvbW9kZS9zZnpcIjtcbn0pLmNhbGwoTW9kZS5wcm90b3R5cGUpO1xuXG5tb2R1bGUuZXhwb3J0cy5Nb2RlID0gTW9kZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgb29wID0gYWNlLnJlcXVpcmUoXCJhY2UvbGliL29vcFwiKTtcbnZhciBSYW5nZSA9IGFjZS5yZXF1aXJlKFwiYWNlL3JhbmdlXCIpLlJhbmdlO1xudmFyIEJhc2VGb2xkTW9kZSA9IGFjZS5yZXF1aXJlKFwiYWNlL21vZGUvZm9sZGluZy9mb2xkX21vZGVcIikuRm9sZE1vZGU7XG52YXIgRm9sZE1vZGUgPSAoZXhwb3J0cy5Gb2xkTW9kZSA9IGZ1bmN0aW9uIChjb21tZW50UmVnZXgpIHtcbiAgaWYgKGNvbW1lbnRSZWdleCkge1xuICAgIHRoaXMuZm9sZGluZ1N0YXJ0TWFya2VyID0gbmV3IFJlZ0V4cChcbiAgICAgIHRoaXMuZm9sZGluZ1N0YXJ0TWFya2VyLnNvdXJjZS5yZXBsYWNlKFxuICAgICAgICAvXFx8W158XSo/JC8sXG4gICAgICAgIFwifFwiICsgY29tbWVudFJlZ2V4LnN0YXJ0XG4gICAgICApXG4gICAgKTtcbiAgICB0aGlzLmZvbGRpbmdTdG9wTWFya2VyID0gbmV3IFJlZ0V4cChcbiAgICAgIHRoaXMuZm9sZGluZ1N0b3BNYXJrZXIuc291cmNlLnJlcGxhY2UoL1xcfFtefF0qPyQvLCBcInxcIiArIGNvbW1lbnRSZWdleC5lbmQpXG4gICAgKTtcbiAgfVxufSk7XG5vb3AuaW5oZXJpdHMoRm9sZE1vZGUsIEJhc2VGb2xkTW9kZSk7XG4oZnVuY3Rpb24gKCkge1xuICB0aGlzLmZvbGRpbmdTdGFydE1hcmtlciA9IC8oW1xce1xcW1xcKF0pW15cXH1cXF1cXCldKiR8XlxccyooXFwvXFwqKS87XG4gIHRoaXMuZm9sZGluZ1N0b3BNYXJrZXIgPSAvXlteXFxbXFx7XFwoXSooW1xcfVxcXVxcKV0pfF5bXFxzXFwqXSooXFwqXFwvKS87XG4gIHRoaXMuc2luZ2xlTGluZUJsb2NrQ29tbWVudFJlID0gL15cXHMqKFxcL1xcKikuKlxcKlxcL1xccyokLztcbiAgdGhpcy50cmlwbGVTdGFyQmxvY2tDb21tZW50UmUgPSAvXlxccyooXFwvXFwqXFwqXFwqKS4qXFwqXFwvXFxzKiQvO1xuICB0aGlzLnN0YXJ0UmVnaW9uUmUgPSAvXlxccyooXFwvXFwqfFxcL1xcLykjP3JlZ2lvblxcYi87XG4gIHRoaXMuX2dldEZvbGRXaWRnZXRCYXNlID0gdGhpcy5nZXRGb2xkV2lkZ2V0O1xuICB0aGlzLmdldEZvbGRXaWRnZXQgPSBmdW5jdGlvbiAoc2Vzc2lvbiwgZm9sZFN0eWxlLCByb3cpIHtcbiAgICB2YXIgbGluZSA9IHNlc3Npb24uZ2V0TGluZShyb3cpO1xuICAgIGlmICh0aGlzLnNpbmdsZUxpbmVCbG9ja0NvbW1lbnRSZS50ZXN0KGxpbmUpKSB7XG4gICAgICBpZiAoXG4gICAgICAgICF0aGlzLnN0YXJ0UmVnaW9uUmUudGVzdChsaW5lKSAmJlxuICAgICAgICAhdGhpcy50cmlwbGVTdGFyQmxvY2tDb21tZW50UmUudGVzdChsaW5lKVxuICAgICAgKVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gICAgdmFyIGZ3ID0gdGhpcy5fZ2V0Rm9sZFdpZGdldEJhc2Uoc2Vzc2lvbiwgZm9sZFN0eWxlLCByb3cpO1xuICAgIGlmICghZncgJiYgdGhpcy5zdGFydFJlZ2lvblJlLnRlc3QobGluZSkpIHJldHVybiBcInN0YXJ0XCI7IC8vIGxpbmVDb21tZW50UmVnaW9uU3RhcnRcbiAgICByZXR1cm4gZnc7XG4gIH07XG4gIHRoaXMuZ2V0Rm9sZFdpZGdldFJhbmdlID0gZnVuY3Rpb24gKHNlc3Npb24sIGZvbGRTdHlsZSwgcm93LCBmb3JjZU11bHRpbGluZSkge1xuICAgIHZhciBsaW5lID0gc2Vzc2lvbi5nZXRMaW5lKHJvdyk7XG4gICAgaWYgKHRoaXMuc3RhcnRSZWdpb25SZS50ZXN0KGxpbmUpKVxuICAgICAgcmV0dXJuIHRoaXMuZ2V0Q29tbWVudFJlZ2lvbkJsb2NrKHNlc3Npb24sIGxpbmUsIHJvdyk7XG4gICAgdmFyIG1hdGNoID0gbGluZS5tYXRjaCh0aGlzLmZvbGRpbmdTdGFydE1hcmtlcik7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICB2YXIgaSA9IG1hdGNoLmluZGV4O1xuICAgICAgaWYgKG1hdGNoWzFdKSByZXR1cm4gdGhpcy5vcGVuaW5nQnJhY2tldEJsb2NrKHNlc3Npb24sIG1hdGNoWzFdLCByb3csIGkpO1xuICAgICAgdmFyIHJhbmdlID0gc2Vzc2lvbi5nZXRDb21tZW50Rm9sZFJhbmdlKHJvdywgaSArIG1hdGNoWzBdLmxlbmd0aCwgMSk7XG4gICAgICBpZiAocmFuZ2UgJiYgIXJhbmdlLmlzTXVsdGlMaW5lKCkpIHtcbiAgICAgICAgaWYgKGZvcmNlTXVsdGlsaW5lKSB7XG4gICAgICAgICAgcmFuZ2UgPSB0aGlzLmdldFNlY3Rpb25SYW5nZShzZXNzaW9uLCByb3cpO1xuICAgICAgICB9IGVsc2UgaWYgKGZvbGRTdHlsZSAhPSBcImFsbFwiKSByYW5nZSA9IG51bGw7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmFuZ2U7XG4gICAgfVxuICAgIGlmIChmb2xkU3R5bGUgPT09IFwibWFya2JlZ2luXCIpIHJldHVybjtcbiAgICB2YXIgbWF0Y2ggPSBsaW5lLm1hdGNoKHRoaXMuZm9sZGluZ1N0b3BNYXJrZXIpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgdmFyIGkgPSBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aDtcbiAgICAgIGlmIChtYXRjaFsxXSkgcmV0dXJuIHRoaXMuY2xvc2luZ0JyYWNrZXRCbG9jayhzZXNzaW9uLCBtYXRjaFsxXSwgcm93LCBpKTtcbiAgICAgIHJldHVybiBzZXNzaW9uLmdldENvbW1lbnRGb2xkUmFuZ2Uocm93LCBpLCAtMSk7XG4gICAgfVxuICB9O1xuICB0aGlzLmdldFNlY3Rpb25SYW5nZSA9IGZ1bmN0aW9uIChzZXNzaW9uLCByb3cpIHtcbiAgICB2YXIgbGluZSA9IHNlc3Npb24uZ2V0TGluZShyb3cpO1xuICAgIHZhciBzdGFydEluZGVudCA9IGxpbmUuc2VhcmNoKC9cXFMvKTtcbiAgICB2YXIgc3RhcnRSb3cgPSByb3c7XG4gICAgdmFyIHN0YXJ0Q29sdW1uID0gbGluZS5sZW5ndGg7XG4gICAgcm93ID0gcm93ICsgMTtcbiAgICB2YXIgZW5kUm93ID0gcm93O1xuICAgIHZhciBtYXhSb3cgPSBzZXNzaW9uLmdldExlbmd0aCgpO1xuICAgIHdoaWxlICgrK3JvdyA8IG1heFJvdykge1xuICAgICAgbGluZSA9IHNlc3Npb24uZ2V0TGluZShyb3cpO1xuICAgICAgdmFyIGluZGVudCA9IGxpbmUuc2VhcmNoKC9cXFMvKTtcbiAgICAgIGlmIChpbmRlbnQgPT09IC0xKSBjb250aW51ZTtcbiAgICAgIGlmIChzdGFydEluZGVudCA+IGluZGVudCkgYnJlYWs7XG4gICAgICB2YXIgc3ViUmFuZ2UgPSB0aGlzLmdldEZvbGRXaWRnZXRSYW5nZShzZXNzaW9uLCBcImFsbFwiLCByb3cpO1xuICAgICAgaWYgKHN1YlJhbmdlKSB7XG4gICAgICAgIGlmIChzdWJSYW5nZS5zdGFydC5yb3cgPD0gc3RhcnRSb3cpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmIChzdWJSYW5nZS5pc011bHRpTGluZSgpKSB7XG4gICAgICAgICAgcm93ID0gc3ViUmFuZ2UuZW5kLnJvdztcbiAgICAgICAgfSBlbHNlIGlmIChzdGFydEluZGVudCA9PSBpbmRlbnQpIHtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZW5kUm93ID0gcm93O1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFJhbmdlKFxuICAgICAgc3RhcnRSb3csXG4gICAgICBzdGFydENvbHVtbixcbiAgICAgIGVuZFJvdyxcbiAgICAgIHNlc3Npb24uZ2V0TGluZShlbmRSb3cpLmxlbmd0aFxuICAgICk7XG4gIH07XG4gIHRoaXMuZ2V0Q29tbWVudFJlZ2lvbkJsb2NrID0gZnVuY3Rpb24gKHNlc3Npb24sIGxpbmUsIHJvdykge1xuICAgIHZhciBzdGFydENvbHVtbiA9IGxpbmUuc2VhcmNoKC9cXHMqJC8pO1xuICAgIHZhciBtYXhSb3cgPSBzZXNzaW9uLmdldExlbmd0aCgpO1xuICAgIHZhciBzdGFydFJvdyA9IHJvdztcbiAgICB2YXIgcmUgPSAvXlxccyooPzpcXC9cXCp8XFwvXFwvfC0tKSM/KGVuZCk/cmVnaW9uXFxiLztcbiAgICB2YXIgZGVwdGggPSAxO1xuICAgIHdoaWxlICgrK3JvdyA8IG1heFJvdykge1xuICAgICAgbGluZSA9IHNlc3Npb24uZ2V0TGluZShyb3cpO1xuICAgICAgdmFyIG0gPSByZS5leGVjKGxpbmUpO1xuICAgICAgaWYgKCFtKSBjb250aW51ZTtcbiAgICAgIGlmIChtWzFdKSBkZXB0aC0tO1xuICAgICAgZWxzZSBkZXB0aCsrO1xuICAgICAgaWYgKCFkZXB0aCkgYnJlYWs7XG4gICAgfVxuICAgIHZhciBlbmRSb3cgPSByb3c7XG4gICAgaWYgKGVuZFJvdyA+IHN0YXJ0Um93KSB7XG4gICAgICByZXR1cm4gbmV3IFJhbmdlKHN0YXJ0Um93LCBzdGFydENvbHVtbiwgZW5kUm93LCBsaW5lLmxlbmd0aCk7XG4gICAgfVxuICB9O1xufSkuY2FsbChGb2xkTW9kZS5wcm90b3R5cGUpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBvb3AgPSBhY2UucmVxdWlyZShcImFjZS9saWIvb29wXCIpO1xudmFyIFRleHRIaWdobGlnaHRSdWxlcyA9IGFjZS5yZXF1aXJlKFwiYWNlL21vZGUvdGV4dF9oaWdobGlnaHRfcnVsZXNcIikuVGV4dEhpZ2hsaWdodFJ1bGVzO1xudmFyIFNGWkhpZ2hsaWdodFJ1bGVzID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLiRydWxlcyA9IHtcbiAgICBzdGFydDogW1xuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNjb21tZW50XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNoZWFkZXJzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoxX3NvdW5kLXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6MV9pbnN0cnVtZW50LXNldHRpbmdzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoxX3JlZ2lvbi1sb2dpY1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6MV9wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoxX21vZHVsYXRpb25cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejFfZWZmZWN0c1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6Ml9kaXJlY3RpdmVzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoyX3NvdW5kLXNvdXJjZVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6Ml9pbnN0cnVtZW50LXNldHRpbmdzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoyX3JlZ2lvbi1sb2dpY1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6Ml9wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoyX21vZHVsYXRpb25cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejJfY3VydmVzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNhcmlhX2luc3RydW1lbnQtc2V0dGluZ3NcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI2FyaWFfcmVnaW9uLWxvZ2ljXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNhcmlhX3BlcmZvcm1hbmNlLXBhcmFtZXRlcnNcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI2FyaWFfbW9kdWxhdGlvblwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjYXJpYV9jdXJ2ZXNcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI2FyaWFfZWZmZWN0c1wiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2NvbW1lbnRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFwvXFwqLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uY29tbWVudC5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFwqXFwvLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwiY29tbWVudC5ibG9jay5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcInB1bmN0dWF0aW9uLndoaXRlc3BhY2UuY29tbWVudC5sZWFkaW5nLnNmelwiLFxuICAgICAgICAgIFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLygoPzpbXFxzXSspPykoXFwvXFwvKSg/OlxccyooPz1cXHN8JCkpPy8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJjb21tZW50LmxpbmUuZG91YmxlLXNsYXNoLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC8oPz0kKS8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcImNvbW1lbnQubGluZS5kb3VibGUtc2xhc2guc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNoZWFkZXJzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLnNmelwiLFxuICAgICAgICAgIFwia2V5d29yZC5jb250cm9sLiQyLnNmelwiLFxuICAgICAgICAgIFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50YWcuYmVnaW4uc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKDwpKGNvbnRyb2x8Z2xvYmFsfG1hc3Rlcnxncm91cHxyZWdpb258Y3VydmV8ZWZmZWN0fG1pZGkpKD4pLyxcbiAgICAgICAgY29tbWVudDogXCJIZWFkZXJzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvPC4qKD8hKD86Y29udHJvbHxnbG9iYWx8bWFzdGVyfGdyb3VwfHJlZ2lvbnxjdXJ2ZXxlZmZlY3R8bWlkaSkpPi8sXG4gICAgICAgIGNvbW1lbnQ6IFwiTm9uLWNvbXBsaWFudCBoZWFkZXJzXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6MV9zb3VuZC1zb3VyY2VcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogL1xcYihzYW1wbGUpKD0/KS8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvKD89KD86XFxzXFwvXFwvfCQpKS8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHNhbXBsZSk6IChhbnkgc3RyaW5nKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmRlbGF5KD86X3JhbmRvbXxfb25jY1xcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoZGVsYXl8ZGVsYXlfcmFuZG9tfGRlbGF5X29uY2NOKTogKDAgdG8gMTAwIHBlcmNlbnQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5zb3VuZC1zb3VyY2UuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxib2Zmc2V0KD86X3JhbmRvbXxfb25jY1xcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKG9mZnNldHxvZmZzZXRfcmFuZG9tfG9mZnNldF9vbmNjTik6ICgwIHRvIDQyOTQ5NjcyOTYgc2FtcGxlIHVuaXRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmVuZFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZV9vcl9uZWcxXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZW5kKTogKC0xIHRvIDQyOTQ5NjcyOTYgc2FtcGxlIHVuaXRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmNvdW50XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X3Bvc2l0aXZlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoY291bnQpOiAoMCB0byA0Mjk0OTY3Mjk2IGxvb3BzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmxvb3BfbW9kZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19sb29wX21vZGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGxvb3BfbW9kZSk6IChub19sb29wfG9uZV9zaG90fGxvb3BfY29udGludW91c3xsb29wX3N1c3RhaW4pXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5zb3VuZC1zb3VyY2UuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9vcF9zdGFydHxsb29wX2VuZClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGxvb3Bfc3RhcnR8bG9vcF9lbmQpOiAoMCB0byA0Mjk0OTY3Mjk2IHNhbXBsZSB1bml0cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpzeW5jX2JlYXRzfHN5bmNfb2Zmc2V0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMzJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzeW5jX2JlYXRzfHN5bmNfb2Zmc2V0KTogKDAgdG8gMzIgYmVhdHMpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6MV9pbnN0cnVtZW50LXNldHRpbmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpncm91cHxwb2x5cGhvbnlfZ3JvdXB8b2ZmX2J5KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoZ3JvdXB8cG9seXBob255X2dyb3VwfG9mZl9ieSk6ICgwIHRvIDQyOTQ5NjcyOTYgc2FtcGxlIHVuaXRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJvZmZfbW9kZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19mYXN0LW5vcm1hbC10aW1lXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAob2ZmX21vZGUpOiAoZmFzdHxub3JtYWwpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYm91dHB1dFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEwMjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChvdXRwdXQpOiAoMCB0byAxMDI0IE1JREkgTm9kZXMpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6MV9yZWdpb24tbG9naWNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMua2V5LW1hcHBpbmcuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86a2V5fGxva2V5fGhpa2V5KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN19vcl9zdHJpbmdfbm90ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoa2V5fGxva2V5fGhpa2V5KTogKDAgdG8gMTI3IE1JREkgTm90ZSBvciBDLTEgdG8gRyM5IE5vdGUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMua2V5LW1hcHBpbmcuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG92ZWx8aGl2ZWwpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG92ZXxoaXZlbCk6ICgwIHRvIDEyNyBNSURJIFZlbG9jaXR5KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpsb2NoYW58aGljaGFuKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8xLTE2XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG9jaGFufGhpY2hhbik6ICgxIHRvIDE2IE1JREkgQ2hhbm5lbClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG98aGkpY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG9jY058aGljY04pOiAoMCB0byAxMjcgTUlESSBDb250cm9sbGVyKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpsb2JlbmR8aGliZW5kKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWc4MTkyLTgxOTJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsb2JlbmR8aGliZW5kKTogKC04MTkyIHRvIDgxOTIgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMubWlkaS1jb25kaXRpb25zLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnN3Xyg/Omxva2V5fGhpa2V5fGxhc3R8ZG93bnx1cHxwcmV2aW91cylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdfb3Jfc3RyaW5nX25vdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKHN3X2xva2V5fHN3X2hpa2V5fHN3X2xhc3R8c3dfZG93bnxzd191cHxzd19wcmV2aW91cyk6ICgwIHRvIDEyNyBNSURJIE5vdGUgb3IgQy0xIHRvIEcjOSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJzd192ZWxcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfY3VycmVudC1wcmV2aW91c1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHN3X3ZlbCk6IChjdXJyZW50fHByZXZpb3VzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLmludGVybmFsLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9icG18aGlicG0pXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC01MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsb2JwbXxoaWJwbSk6ICgwIHRvIDUwMCBCUE0pXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMuaW50ZXJuYWwtY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpsb2NoYW5hZnR8aGljaGFuYWZ0fGxvcG9seWFmdHxoaXBvbHlhZnQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChsb2NoYW5hZnR8aGljaGFuYWZ0fGxvcG9seWFmdHxoaXBvbHlhZnQpOiAoMCB0byAxMjcgTUlESSBDb250cm9sbGVyKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLmludGVybmFsLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9yYW5kfGhpcmFuZClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTFcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsb3JhbmR8aGlyYW5kKTogKDAgdG8gMSBmbG9hdClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5pbnRlcm5hbC1jb25kaXRpb25zLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OnNlcV9sZW5ndGh8c2VxX3Bvc2l0aW9uKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8xLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHNlcV9sZW5ndGh8c2VxX3Bvc2l0aW9uKTogKDEgdG8gMTAwIGJlYXRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLnRyaWdnZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnRyaWdnZXJcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfYXR0YWNrLXJlbGVhc2UtZmlyc3QtbGVnYXRvXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodHJpZ2dlcik6IChhdHRhY2t8cmVsZWFzZXxmaXJzdHxsZWdhdG8pXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMudHJpZ2dlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxib25fKD86bG98aGkpY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzEtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAob25fbG9jY058b25faGljY04pOiAoLTEgdG8gMTI3IE1JREkgQ29udHJvbGxlcilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzZnoxX3BlcmZvcm1hbmNlLXBhcmFtZXRlcnNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpwYW58cG9zaXRpb258d2lkdGh8YW1wX3ZlbHRyYWNrKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzEwMC0xMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKHBhbnxwb3NpdGlvbnx3aWR0aHxhbXBfdmVsdHJhY2spOiAoLTEwMCB0byAxMDAgcGVyY2VudClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnZvbHVtZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzE0NC02XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodm9sdW1lKTogKC0xNDQgdG8gNiBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmFtcF9rZXljZW50ZXJcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdfb3Jfc3RyaW5nX25vdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGFtcF9rZXljZW50ZXIpOiAoMCB0byAxMjcgTUlESSBOb3RlIG9yIEMtMSB0byBHIzkgTm90ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmFtcF9rZXl0cmFja1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzk2LTEyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYW1wX2tleXRyYWNrKTogKC05NiB0byAxMiBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmFtcF92ZWxjdXJ2ZV8oPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0xXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYW1wX3ZlbGN1cnZlX04pOiAoMCB0byAxIGN1cnZlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiYW1wX3JhbmRvbVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMjRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChhbXBfcmFuZG9tKTogKDAgdG8gMjQgZEIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJnYWluX29uY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMTQ0LTQ4XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZ2Fpbl9vbmNjTik6ICgtMTQ0IHRvIDQ4IGRCKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxicnRfZGVjYXlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTIwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHJ0X2RlY2F5KTogKDAgdG8gMjAwIGRCKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86eGZfY2NjdXJ2ZXx4Zl9rZXljdXJ2ZXx4Zl92ZWxjdXJ2ZSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfZ2Fpbi1wb3dlclwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHhmX2NjY3VydmV8eGZfa2V5Y3VydmV8eGZfdmVsY3VydmUpOiAoZ2Fpbnxwb3dlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86eGZpbl9sb2NjKD86XFxkezEsM30pP3x4ZmluX2hpY2MoPzpcXGR7MSwzfSk/fHhmb3V0X2xvY2MoPzpcXGR7MSwzfSk/fHhmb3V0X2hpY2MoPzpcXGR7MSwzfSk/fHhmaW5fbG9rZXl8eGZpbl9oaWtleXx4Zm91dF9sb2tleXx4Zm91dF9oaWtleXx4ZmluX2xvdmVsfHhmaW5faGl2ZWx8eGZvdXRfbG92ZWx8eGZvdXRfaGl2ZWwpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6ICh4ZmluX2xvY2NOfHhmaW5faGljY058eGZvdXRfbG9jY058eGZvdXRfaGljY058eGZpbl9sb2tleXx4ZmluX2hpa2V5fHhmb3V0X2xva2V5fHhmb3V0X2hpa2V5fHhmaW5fbG92ZWx8eGZpbl9oaXZlbHx4Zm91dF9sb3ZlbHx4Zm91dF9oaXZlbCk6ICgwIHRvIDEyNyBNSURJIFZlbG9jaXR5KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86eGZpbl9sb2tleXx4ZmluX2hpa2V5fHhmb3V0X2xva2V5fHhmb3V0X2hpa2V5KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN19vcl9zdHJpbmdfbm90ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoeGZpbl9sb2tleXx4ZmluX2hpa2V5fHhmb3V0X2xva2V5fHhmb3V0X2hpa2V5KTogKDAgdG8gMTI3IE1JREkgTm90ZSBvciBDLTEgdG8gRyM5IE5vdGUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLnBpdGNoLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmJlbmRfdXB8YmVuZF9kb3dufHBpdGNoX3ZlbHRyYWNrKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWc5NjAwLTk2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGJlbmRfdXB8YmVuZF9kb3dufHBpdGNoX3ZlbHRyYWNrKTogKC05NjAwIHRvIDk2MDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLnBpdGNoLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmJlbmRfc3RlcFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8xLTEyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChiZW5kX3N0ZXApOiAoMSB0byAxMjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJwaXRjaF9rZXljZW50ZXJcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdfb3Jfc3RyaW5nX25vdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChwaXRjaF9rZXljZW50ZXIpOiAoMCB0byAxMjcgTUlESSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJwaXRjaF9rZXl0cmFja1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxMjAwLTEyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChwaXRjaF9rZXl0cmFjayk6ICgtMTIwMCB0byAxMjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJwaXRjaF9yYW5kb21cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC05NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocGl0Y2hfcmFuZG9tKTogKDAgdG8gOTYwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxidHJhbnNwb3NlXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzEyNy0xMjdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6ICh0cmFuc3Bvc2UpOiAoLTEyNyB0byAxMjcgTUlESSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJ0dW5lXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzk2MDAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHR1bmUpOiAoLTI0MDAgdG8gMjQwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZmlsdGVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJjdXRvZmZcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGN1dG9mZik6ICgwIHRvIGFyYml0cmFyeSBIeilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZmlsdGVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpjdXRvZmZfb25jYyg/OlxcZHsxLDN9KT98Y3V0b2ZmX2NoYW5hZnR8Y3V0b2ZmX3BvbHlhZnQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzk2MDAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoY3V0b2ZmX29uY2NOfGN1dG9mZl9jaGFuYWZ0fGN1dG9mZl9wb2x5YWZ0KTogKC05NjAwIHRvIDk2MDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZmlsX2tleXRyYWNrXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTIwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGZpbF9rZXl0cmFjayk6ICgwIHRvIDEyMDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZmlsX2tleWNlbnRlclxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN19vcl9zdHJpbmdfbm90ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGZpbF9rZXljZW50ZXIpOiAoMCB0byAxMjcgTUlESSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5maWx0ZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmZpbF9yYW5kb21cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC05NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZmlsX3JhbmRvbSk6ICgwIHRvIDk2MDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZmlsX3R5cGVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfbHBmLWhwZi1icGYtYnJmXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChmaWxfdHlwZSk6IChscGZfMXB8aHBmXzFwfGxwZl8ycHxocGZfMnB8YnBmXzJwfGJyZl8ycClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZmlsdGVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJmaWxfdmVsdHJhY2tcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfbmVnOTYwMC05NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZmlsX3ZlbHRyYWNrKTogKC05NjAwIHRvIDk2MDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxicmVzb25hbmNlXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC00MFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHJlc29uYW5jZSk6ICgwIHRvIDQwIGRCKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5lcS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzplcTFfZnJlcXxlcTJfZnJlcXxlcTNfZnJlcSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTMwMDAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZXExX2ZyZXF8ZXEyX2ZyZXF8ZXEzX2ZyZXEpOiAoMCB0byAzMDAwMCBIeilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZXEuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGIoPzplcVsxLTNdX2ZyZXFfb25jYyg/OlxcZHsxLDN9KT98ZXExX3ZlbDJmcmVxfGVxMl92ZWwyZnJlcXxlcTNfdmVsMmZyZXEpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMzAwMDAtMzAwMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGVxMV9mcmVxX29uY2NOfGVxMl9mcmVxX29uY2NOfGVxM19mcmVxX29uY2NOfGVxMV92ZWwyZnJlcXxlcTJfdmVsMmZyZXF8ZXEzX3ZlbDJmcmVxKTogKC0zMDAwMCB0byAzMDAwMCBIeilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZXEuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86ZXExX2J3fGVxMl9id3xlcTNfYncpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC00XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZXExX2J3fGVxMl9id3xlcTNfYncpOiAoMC4wMDAxIHRvIDQgb2N0YXZlcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZXEuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGIoPzplcVsxLTNdX2J3X29uY2MoPzpcXGR7MSwzfSk/fGVxMV92ZWwyYnd8ZXEyX3ZlbDJid3xlcTNfdmVsMmJ3KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzQtNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoZXExX2J3X29uY2NOfGVxMl9id19vbmNjTnxlcTNfYndfb25jY058ZXExX3ZlbDJid3xlcTJfdmVsMmJ3fGVxM192ZWwyYncpOiAoLTMwMDAwIHRvIDMwMDAwIEh6KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5lcS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzplcVsxLTNdXyg/OnZlbDIpP2dhaW58ZXFbMS0zXV9nYWluX29uY2MoPzpcXGR7MSwzfSk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzk2LTI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChlcTFfZ2FpbnxlcTJfZ2FpbnxlcTNfZ2FpbnxlcTFfZ2Fpbl9vbmNjTnxlcTJfZ2Fpbl9vbmNjTnxlcTNfZ2Fpbl9vbmNjTnxlcTFfdmVsMmdhaW58ZXEyX3ZlbDJnYWlufGVxM192ZWwyZ2Fpbik6ICgtOTYgdG8gMjQgZEIpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6MV9tb2R1bGF0aW9uXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86YW1wZWd8ZmlsZWd8cGl0Y2hlZylfKD86KD86YXR0YWNrfGRlY2F5fGRlbGF5fGhvbGR8cmVsZWFzZXxzdGFydHxzdXN0YWluKSg/Ol9vbmNjKD86XFxkezEsM30pPyk/fHZlbDIoPzphdHRhY2t8ZGVjYXl8ZGVsYXl8aG9sZHxyZWxlYXNlfHN0YXJ0fHN1c3RhaW4pKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChhbXBlZ19kZWxheV9vbmNjTnxhbXBlZ19hdHRhY2tfb25jY058YW1wZWdfaG9sZF9vbmNjTnxhbXBlZ19kZWNheV9vbmNjTnxhbXBlZ19yZWxlYXNlX29uY2NOfGFtcGVnX3ZlbDJkZWxheXxhbXBlZ192ZWwyYXR0YWNrfGFtcGVnX3ZlbDJob2xkfGFtcGVnX3ZlbDJkZWNheXxhbXBlZ192ZWwycmVsZWFzZXxwaXRjaGVnX3ZlbDJkZWxheXxwaXRjaGVnX3ZlbDJhdHRhY2t8cGl0Y2hlZ192ZWwyaG9sZHxwaXRjaGVnX3ZlbDJkZWNheXxwaXRjaGVnX3ZlbDJyZWxlYXNlfGZpbGVnX3ZlbDJkZWxheXxmaWxlZ192ZWwyYXR0YWNrfGZpbGVnX3ZlbDJob2xkfGZpbGVnX3ZlbDJkZWNheXxmaWxlZ192ZWwycmVsZWFzZSk6ICgwIHRvIDEwMCBzZWNvbmRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86cGl0Y2hlZ19kZXB0aHxmaWxlZ19kZXB0aHxwaXRjaGVnX3ZlbDJkZXB0aHxmaWxlZ192ZWwyZGVwdGgpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzEyMDAwLTEyMDAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChwaXRjaGVnX2RlcHRofGZpbGVnX2RlcHRofHBpdGNoZWdfdmVsMmRlcHRofGZpbGVnX3ZlbDJkZXB0aCk6ICgtMTIwMDAgdG8gMTIwMDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJhbXBsZm9fKD86ZGVwdGgoPzpjYyg/OlxcZHsxLDN9KT8pP3xkZXB0aCg/OmNoYW58cG9seSlhZnQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMjAtMjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGFtcGxmb19kZXB0aHxhbXBsZm9fZGVwdGhjY058YW1wbGZvX2RlcHRoY2hhbmFmdHxhbXBsZm9fZGVwdGhwb2x5YWZ0KTogKC0yMCB0byAyMCBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86ZmlsbGZvfHBpdGNobGZvKV8oPzpkZXB0aCg/Oig/Ol9vbik/Y2MoPzpcXGR7MSwzfSk/KT98ZGVwdGgoPzpjaGFufHBvbHkpYWZ0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxMjAwLTEyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKHBpdGNobGZvX2RlcHRofHBpdGNobGZvX2RlcHRoY2NOfHBpdGNobGZvX2RlcHRoY2hhbmFmdHxwaXRjaGxmb19kZXB0aHBvbHlhZnR8ZmlsbGZvX2RlcHRofGZpbGxmb19kZXB0aGNjTnxmaWxsZm9fZGVwdGhjaGFuYWZ0fGZpbGxmb19kZXB0aHBvbHlhZnQpOiAoLTEyMDAgdG8gMTIwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86KD86YW1wbGZvfGZpbGxmb3xwaXRjaGxmbylfKD86ZnJlcXwoPzpjYyg/OlxcZHsxLDN9KT8pPyl8ZnJlcSg/OmNoYW58cG9seSlhZnQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMjAwLTIwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoYW1wbGZvX2ZyZXFjY058YW1wbGZvX2ZyZXFjaGFuYWZ0fGFtcGxmb19mcmVxcG9seWFmdHxwaXRjaGxmb19mcmVxY2NOfHBpdGNobGZvX2ZyZXFjaGFuYWZ0fHBpdGNobGZvX2ZyZXFwb2x5YWZ0fGZpbGxmb19mcmVxY2NOfGZpbGxmb19mcmVxY2hhbmFmdHxmaWxsZm9fZnJlcXBvbHlhZnQpOiAoLTIwMCB0byAyMDAgSHopXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzphbXBsZm98ZmlsbGZvfHBpdGNobGZvKV8oPzpkZWxheXxmYWRlKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChhbXBsZm9fZGVsYXl8YW1wbGZvX2ZhZGV8cGl0Y2hsZm9fZGVsYXl8cGl0Y2hsZm9fZmFkZXxmaWxsZm9fZGVsYXl8ZmlsbGZvX2ZhZGUpOiAoMCB0byAxMDAgc2Vjb25kcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmFtcGxmb19mcmVxfHBpdGNobGZvX2ZyZXF8ZmlsbGZvX2ZyZXEpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0yMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoYW1wbGZvX2ZyZXF8cGl0Y2hsZm9fZnJlcXxmaWxsZm9fZnJlcSk6ICgwIHRvIDIwIEh6KVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejFfZWZmZWN0c1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmVmZmVjdHMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86ZWZmZWN0MXxlZmZlY3QyKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZWZmZWN0MXxlZmZlY3QyKTogKDAgdG8gMTAwIHBlcmNlbnQpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6Ml9kaXJlY3RpdmVzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcIm1ldGEucHJlcHJvY2Vzc29yLmRlZmluZS5zZnpcIixcbiAgICAgICAgICBcIm1ldGEuZ2VuZXJpYy5kZWZpbmUuc2Z6XCIsXG4gICAgICAgICAgXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnZhcmlhYmxlLnNmelwiLFxuICAgICAgICAgIFwibWV0YS5wcmVwcm9jZXNzb3Iuc3RyaW5nLnNmelwiLFxuICAgICAgICAgIFwibWV0YS5nZW5lcmljLmRlZmluZS5zZnpcIixcbiAgICAgICAgICBcIm1ldGEucHJlcHJvY2Vzc29yLnN0cmluZy5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oXFwjZGVmaW5lKShcXHMrKShcXCQpKFteXFxzXSspKFxccyspKC4rKVxcYi8sXG4gICAgICAgIGNvbW1lbnQ6IFwiI2RlZmluZSBzdGF0ZW1lbnRcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJtZXRhLnByZXByb2Nlc3Nvci5pbXBvcnQuc2Z6XCIsXG4gICAgICAgICAgXCJtZXRhLmdlbmVyaWMuaW5jbHVkZS5zZnpcIixcbiAgICAgICAgICBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLnNmelwiLFxuICAgICAgICAgIFwibWV0YS5wcmVwcm9jZXNzb3Iuc3RyaW5nLnNmelwiLFxuICAgICAgICAgIFwibWV0YS5wcmVwcm9jZXNzb3Iuc3RyaW5nLnNmelwiLFxuICAgICAgICAgIFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuZW5kLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyhcXCNpbmNsdWRlKShcXHMrKShcIikoLispKD89XFwuc2Z6KShcXC5zZnpoPykoXCIpLyxcbiAgICAgICAgY29tbWVudDogXCIjaW5jbHVkZSBzdGF0ZW1lbnRcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLm90aGVyLmNvbnN0YW50LnNmelwiLFxuICAgICAgICByZWdleDogL1xcJFteXFxzXFw9XSsvLFxuICAgICAgICBjb21tZW50OiBcImRlZmluZWQgdmFyaWFibGVcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzZnoyX3NvdW5kLXNvdXJjZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJ2YXJpYWJsZS5sYW5ndWFnZS5zb3VuZC1zb3VyY2UuJDEuc2Z6XCIsXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvXFxiKGRlZmF1bHRfcGF0aCkoPT8pLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC8oPz0oPzpcXHNcXC9cXC98JCkpLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZGVmYXVsdF9wYXRoKTogYW55IHN0cmluZ1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLnNhbXBsZS1wbGF5YmFjay4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJkaXJlY3Rpb25cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfZm9yd2FyZC1yZXZlcnNlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZGlyZWN0aW9uKTogKGZvcndhcmR8cmV2ZXJzZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS5zYW1wbGUtcGxheWJhY2suJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxibG9vcF9jb3VudFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxvb3BfY291bnQpOiAoMCB0byA0Mjk0OTY3Mjk2IGxvb3BzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLnNhbXBsZS1wbGF5YmFjay4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJsb29wX3R5cGVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfZm9yd2FyZC1iYWNrd2FyZC1hbHRlcm5hdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsb29wX3R5cGUpOiAoZm9yd2FyZHxiYWNrd2FyZHxhbHRlcm5hdGUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5zb3VuZC1zb3VyY2Uuc2FtcGxlLXBsYXliYWNrLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYm1kNVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19tZDVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChtZDUpOiAoMTI4LWJpdCBoZXggbWQ1IGhhc2gpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6Ml9pbnN0cnVtZW50LXNldHRpbmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJvY3RhdmVfb2Zmc2V0XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzEwLTEwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAob2N0YXZlX29mZnNldCk6ICgtMTAgdG8gMTAgb2N0YXZlcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLiQxLnNmelwiLFxuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogL1xcYihyZWdpb25fbGFiZWx8bGFiZWxfY2MoPzpcXGR7MSwzfSk/KSg9PykvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogLyg/PSg/Olxcc1xcL1xcL3wkKSkvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChyZWdpb25fbGFiZWx8bGFiZWxfY2NOKTogKGFueSBzdHJpbmcpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnNldF9jYyg/OlxcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzZXRfY2NOKTogKDAgdG8gMTI3IE1JREkgQ29udHJvbGxlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3Mudm9pY2UtbGlmZWN5Y2xlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OnBvbHlwaG9ueXxub3RlX3BvbHlwaG9ueSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChwb2x5cGhvbnl8bm90ZV9wb2x5cGhvbnkpOiAoMCB0byAxMjcgdm9pY2VzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy52b2ljZS1saWZlY3ljbGUuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bm90ZV9zZWxmbWFza3xydF9kZWFkKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19vbi1vZmZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChub3RlX3NlbGZtYXNrfHJ0X2RlYWQpOiAob258b2ZmKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejJfcmVnaW9uLWxvZ2ljXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpzdXN0YWluX3N3fHNvc3RlbnV0b19zdylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfb24tb2ZmXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoc3VzdGFpbl9zd3xzb3N0ZW51dG9fc3cpOiAob258b2ZmKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpsb3Byb2d8aGlwcm9nKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxvcHJvZ3xoaXByb2cpOiAoMCB0byAxMjcgTUlESSBwcm9ncmFtKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejJfcGVyZm9ybWFuY2UtcGFyYW1ldGVyc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnZvbHVtZV9vbmNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzE0NC02XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodm9sdW1lX29uY2NOKTogKC0xNDQgdG8gNiBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnBoYXNlXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX25vcm1hbC1pbnZlcnRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChwaGFzZSk6IChub3JtYWx8aW52ZXJ0KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxid2lkdGhfb25jYyg/OlxcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcxMDAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAod2lkdGhfb25jY04pOiAoLTEwMCB0byAxMDAgcGVyY2VudClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiYmVuZF9zbW9vdGhcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC05NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYmVuZF9zbW9vdGgpOiAoMCB0byA5NjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpiZW5kX3N0ZXB1cHxiZW5kX3N0ZXBkb3duKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8xLTEyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChiZW5kX3N0ZXB1cHxiZW5kX3N0ZXBkb3duKTogKDEgdG8gMTIwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZmlsdGVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpjdXRvZmYyfGN1dG9mZjJfb25jYyg/OlxcZHsxLDN9KT8pXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChjdXRvZmYyfGN1dG9mZjJfb25jY04pOiAoMCB0byBhcmJpdHJhcnkgSHopXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGIoPzpyZXNvbmFuY2Vfb25jYyg/OlxcZHsxLDN9KT98cmVzb25hbmNlMnxyZXNvbmFuY2UyX29uY2MoPzpcXGR7MSwzfSk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtNDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKHJlc29uYW5jZV9vbmNjTnxyZXNvbmFuY2UyfHJlc29uYW5jZTJfb25jY04pOiAoMCB0byA0MCBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZmlsdGVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJmaWwyX3R5cGVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfbHBmLWhwZi1icGYtYnJmXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChmaWwyX3R5cGUpOiAobHBmXzFwfGhwZl8xcHxscGZfMnB8aHBmXzJwfGJwZl8ycHxicmZfMnApXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6Ml9tb2R1bGF0aW9uXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmVnXFxkezJ9Xyg/OmN1cnZlfGxvb3B8cG9pbnRzfHN1c3RhaW4pXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X3Bvc2l0aXZlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZWdOXyhjdXJ2ZXxsb29wfHBvaW50c3xzdXN0YWluKSk6IChwb3NpdGl2ZSBpbnQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmVudmVsb3BlLWdlbmVyYXRvcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZWdcXGR7Mn1fbGV2ZWxcXGQqKD86X29uY2MoPzpcXGR7MSwzfSk/KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcxLTFcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChlZ05fbGV2ZWx8ZWdOX2xldmVsX29uY2NYKTogKC0xIHRvIDEgZmxvYXQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmVudmVsb3BlLWdlbmVyYXRvcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZWdcXGR7Mn1fc2hhcGVcXGQrXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMTAtMTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChlZ05fc2hhcGVYKTogKC0xMCB0byAxMCBudW1iZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmVudmVsb3BlLWdlbmVyYXRvcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZWdcXGR7Mn1fdGltZVxcZCooPzpfb25jYyg/OlxcZHsxLDN9KT8pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZWdOX3RpbWV8ZWdOX3RpbWVfb25jY1gpOiAoMCB0byAxMDAgc2Vjb25kcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmxmb1xcZHsyfV8oPzp3YXZlfGNvdW50fGZyZXFfKD86c21vb3RofHN0ZXApY2MoPzpcXGR7MSwzfSk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAobGZvTl93YXZlfGxmb05fY291bnR8bGZvTl9mcmVxfGxmb05fZnJlcV9vbmNjWHxsZm9OX2ZyZXFfc21vb3RoY2NYKTogKHBvc2l0aXZlIGludClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmxmb1xcZHsyfV9mcmVxKD86X29uY2MoPzpcXGR7MSwzfSk/KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcyMC0yMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxmb05fZnJlcXxsZm9OX2ZyZXFfb25jY04pOiAoLTIwIHRvIDIwIEh6KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bGZvXFxkezJ9Xyg/OmRlbGF5fGZhZGUpKD86X29uY2MoPzpcXGR7MSwzfSk/KT98Y291bnQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0xMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGxmb05fZGVsYXl8bGZvTl9kZWxheV9vbmNjWHxsZm9OX2ZhZGV8bGZvTl9mYWRlX29uY2NYKTogKDAgdG8gMTAwIHNlY29uZHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpsZm9cXGR7Mn1fcGhhc2UoPzpfb25jYyg/OlxcZHsxLDN9KT8pP3xjb3VudClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTFcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsZm9OX3BoYXNlfGxmb05fcGhhc2Vfb25jY1gpOiAoMCB0byAxIG51bWJlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24uZW52ZWxvcGUtZ2VuZXJhdG9ycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYmVnXFxkezJ9Xyg/Oig/OmRlcHRoX2xmb3xkZXB0aGFkZF9sZm98ZnJlcV9sZm8pfCg/OmFtcGxpdHVkZXxkZXB0aHxkZXB0aF9sZm98ZGVwdGhhZGRfbGZvfGZyZXFfbGZvfHBpdGNofGN1dG9mZjI/fGVxWzEtM11mcmVxfGVxWzEtM11id3xlcVsxLTNdZ2FpbnxwYW58cmVzb25hbmNlMj98dm9sdW1lfHdpZHRoKSg/Ol9vbmNjKD86XFxkezEsM30pPyk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X2FueVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG90aGVyIGVnIGRlc3RpbmF0aW9ucyk6IChhbnkgZmxvYXQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYmxmb1xcZHsyfV8oPzooPzpkZXB0aF9sZm98ZGVwdGhhZGRfbGZvfGZyZXFfbGZvKXwoPzphbXBsaXR1ZGV8ZGVjaW18Yml0cmVkfGRlcHRoX2xmb3xkZXB0aGFkZF9sZm98ZnJlcV9sZm98cGl0Y2h8Y3V0b2ZmMj98ZXFbMS0zXWZyZXF8ZXFbMS0zXWJ3fGVxWzEtM11nYWlufHBhbnxyZXNvbmFuY2UyP3x2b2x1bWV8d2lkdGgpKD86X29uY2MoPzpcXGR7MSwzfSk/KT8pXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfYW55XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAob3RoZXIgbGZvIGRlc3RpbmF0aW9ucyk6IChhbnkgZmxvYXQpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6Ml9jdXJ2ZXNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5jdXJ2ZXMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxidlswLTldezN9XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0xXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodk4pOiAoMCB0byAxIG51bWJlcilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNhcmlhX2luc3RydW1lbnQtc2V0dGluZ3NcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmhpbnRfW0Etel9dKlxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X2FueVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGhpbnRfKTogKGFueSBudW1iZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OnNldF98bG98aGkpaGRjYyg/OlxcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9hbnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzZXRfaGRjY058bG9oZGNjTnxoaWhkY2NOKTogKGFueSBudW1iZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OnN1c3RhaW5fY2N8c29zdGVudXRvX2NjfHN1c3RhaW5fbG98c29zdGVudXRvX2xvKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoc3VzdGFpbl9jY3xzb3N0ZW51dG9fY2N8c3VzdGFpbl9sb3xzb3N0ZW51dG9fbG8pOiAoMCB0byAxMjcgTUlESSBieXRlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJzd19vY3RhdmVfb2Zmc2V0XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzEwLTEwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoc3dfb2N0YXZlX29mZnNldCk6ICgtMTAgdG8gMTAgb2N0YXZlcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3Mudm9pY2UtbGlmZWN5Y2xlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYm9mZl9jdXJ2ZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG9mZl9jdXJ2ZSk6ICgwIHRvIGFueSBjdXJ2ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3Mudm9pY2UtbGlmZWN5Y2xlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/Om9mZl9zaGFwZXxvZmZfdGltZSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcxMC0xMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG9mZl9zaGFwZXxvZmZfdGltZSk6ICgtMTAgdG8gMTAgbnVtYmVyKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2FyaWFfcmVnaW9uLWxvZ2ljXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpzd19kZWZhdWx0fHN3X2xvbGFzdHxzd19oaWxhc3QpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChzd19kZWZhdWx0fHN3X2xvbGFzdHxzd19oaWxhc3QpOiAoMCB0byAxMjcgTUlESSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJzd19sYWJlbFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19hbnlfY29udGludW91c1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHN3X2xhYmVsKTogKGFueSBzdHJpbmcpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMubWlkaS1jb25kaXRpb25zLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnZhclxcZHsyfV9jdXJ2ZWNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHZhck5OX2N1cnZlY2NYKTogKDAgdG8gYW55IGN1cnZlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJ2YXJcXGR7Mn1fbW9kXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2FkZC1tdWx0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodmFyTk5fbW9kKTogKGFkZHxtdWx0KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/OnZhclxcZHsyfV9vbmNjKD86XFxkezEsM30pP3x2YXJcXGR7Mn1fKD86cGl0Y2h8Y3V0b2ZmfHJlc29uYW5jZXxjdXRvZmYyfHJlc29uYW5jZTJ8ZXFbMS0zXWZyZXF8ZXFbMS0zXWJ3fGVxWzEtM11nYWlufHZvbHVtZXxhbXBsaXR1ZGV8cGFufHdpZHRoKSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9hbnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6ICh2YXJOTl9vbmNjWHx2YXJOTl90YXJnZXQpOiAoYW55IGZsb2F0KVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2FyaWFfcGVyZm9ybWFuY2UtcGFyYW1ldGVyc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86YW1wbGl0dWRlfGFtcGxpdHVkZV9vbmNjKD86XFxkezEsM30pP3xnbG9iYWxfYW1wbGl0dWRlfG1hc3Rlcl9hbXBsaXR1ZGV8Z3JvdXBfYW1wbGl0dWRlKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChhbXBsaXR1ZGV8YW1wbGl0dWRlX29uY2NOfGdsb2JhbF9hbXBsaXR1ZGV8bWFzdGVyX2FtcGxpdHVkZXxncm91cF9hbXBsaXR1ZGUpOiAoMCB0byAxMDAgcGVyY2VudClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmFtcGxpdHVkZV9jdXJ2ZWNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGFtcGxpdHVkZV9jdXJ2ZWNjTik6IChhbnkgcG9zaXRpdmUgY3VydmUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJhbXBsaXR1ZGVfc21vb3RoY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGFtcGxpdHVkZV9zbW9vdGhjY04pOiAoMCB0byA5NjAwIG51bWJlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnBhbl9sYXdcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfYmFsYW5jZS1tbWFcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChwYW5fbGF3KTogKGJhbGFuY2V8bW1hKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86Z2xvYmFsX3ZvbHVtZXxtYXN0ZXJfdm9sdW1lfGdyb3VwX3ZvbHVtZXx2b2x1bWVfb25jYyg/OlxcZHsxLDN9KT8pXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMTQ0LTZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGdsb2JhbF92b2x1bWV8bWFzdGVyX3ZvbHVtZXxncm91cF92b2x1bWV8dm9sdW1lX29uY2NOKTogKC0xNDQgdG8gNiBkQilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNhcmlhX21vZHVsYXRpb25cIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmVudmVsb3BlLWdlbmVyYXRvcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGIoPzphbXBlZ19hdHRhY2tfc2hhcGV8YW1wZWdfZGVjYXlfc2hhcGV8YW1wZWdfcmVsZWFzZV9zaGFwZXxlZ1xcZHsyfV9zaGFwZVxcZCspXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMTAtMTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGFtcGVnX2F0dGFja19zaGFwZXxhbXBlZ19kZWNheV9zaGFwZXxhbXBlZ19yZWxlYXNlX3NoYXBlfGVnTl9zaGFwZVgpOiAoLTEwIHRvIDEwIGZsb2F0KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmFtcGVnX3JlbGVhc2VfemVyb3xhbXBlZ19kZWNheV96ZXJvKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19vbi1vZmZcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChhbXBlZ19yZWxlYXNlX3plcm98YW1wZWdfZGVjYXlfemVybyk6ICh0cnVlfGZhbHNlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxibGZvXFxkezJ9Xyg/Om9mZnNldHxyYXRpb3xzY2FsZSkyP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X2FueVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAobGZvTl9vZmZzZXR8bGZvTl9vZmZzZXQyfGxmb05fcmF0aW98bGZvTl9yYXRpbzJ8bGZvTl9zY2FsZXxsZm9OX3NjYWxlMik6IChhbnkgZmxvYXQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJsZm9cXGR7Mn1fd2F2ZTI/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobGZvTl93YXZlfGxmb05fd2F2Mik6ICgwIHRvIDEyNyBNSURJIE51bWJlcilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNhcmlhX2N1cnZlc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmN1cnZlcy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJjdXJ2ZV9pbmRleFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGN1cnZlX2luZGV4KTogKGFueSBwb3NpdGl2ZSBpbnRlZ2VyKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2FyaWFfZWZmZWN0c1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmVmZmVjdHMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxicGFyYW1fb2Zmc2V0XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X2FueVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHBhcmFtX29mZnNldCk6IChhbnkgaW50ZWdlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmVmZmVjdHMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxidmVuZG9yX3NwZWNpZmljXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2FueV9jb250aW51b3VzXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodmVuZG9yX3NwZWNpZmljKTogKGFueSB0byBjb250aW51b3VzIHN0cmluZylcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWczMDAwMC0zMDAwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD0pKC0/KD88IVxcLilcXGIoPzozMDAwMHwoPzpbMC05XXxbMS05XVswLTldezEsM318MlswLTldezR9KSg/OlxcLlxcZCopPylcXGIpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9LT8oPzwhXFwuKVxcYig/OjMwMDAwfCg/OlswLTldfFsxLTldWzAtOV17MSwzfXwyWzAtOV17NH0pKD86XFwuXFxkKik/KVxcYlxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWcxNDQtNDhcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtKD88IVxcLikoPzoxNDR8KD86WzEtOV18WzEtOF1bMC05XXw5WzAtOV18MVswLTRdWzAtM10pKD86XFwuXFxkKik/KVxcYnxcXGIoPzwhXFwuKSg/OjQ4fCg/OlswLTldfFsxLTNdWzAtOV18NFswLTddKSg/OlxcLlxcZCopPylcXGIpLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9KD86LSg/PCFcXC4pKD86MTQ0fCg/OlsxLTldfFsxLThdWzAtOV18OVswLTldfDFbMC00XVswLTNdKSg/OlxcLlxcZCopPylcXGJ8XFxiKD88IVxcLikoPzo0OHwoPzpbMC05XXxbMS0zXVswLTldfDRbMC03XSkoPzpcXC5cXGQqKT8pXFxiKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMTQ0LTZcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtKD88IVxcLikoPzoxNDR8KD86WzEtOV18WzEtOF1bMC05XXw5WzAtOV18MVswLTRdWzAtM10pKD86XFwuXFxkKik/KVxcYnxcXGIoPzwhXFwuKSg/OjZ8WzAtNV0oPzpcXC5cXGQqKT9cXGIpKS8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/Oi0oPzwhXFwuKSg/OjE0NHwoPzpbMS05XXxbMS04XVswLTldfDlbMC05XXwxWzAtNF1bMC0zXSkoPzpcXC5cXGQqKT8pXFxifFxcYig/PCFcXC4pKD86NnxbMC01XSg/OlxcLlxcZCopP1xcYikpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWcyMDAtMjAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/KD88IVxcLikoPzoyMDB8KD86WzAtOV18WzEtOV1bMC05XXsxLDJ9KSg/OlxcLlxcZCopPykpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9LT8oPzwhXFwuKSg/OjIwMHwoPzpbMC05XXxbMS05XVswLTldezEsMn0pKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWcxMDAtMTAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/KD88IVxcLikoPzoxMDB8KD86WzAtOV18WzEtOV1bMC05XSkoPzpcXC5cXGQqKT8pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tPyg/PCFcXC4pKD86MTAwfCg/OlswLTldfFsxLTldWzAtOV0pKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWc5Ni0xMlwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD0pKC0oPzwhXFwuKSg/Ojk2fCg/OlsxLTldfFsxLThdWzAtOV18OVswLTVdKSg/OlxcLlxcZCopPylcXGJ8XFxiKD88IVxcLikoPzoxMnwoPzpbMC05XXwxWzAxXSkoPzpcXC5cXGQqKT9cXGIpKS8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/Oi0oPzwhXFwuKSg/Ojk2fCg/OlsxLTldfFsxLThdWzAtOV18OVswLTVdKSg/OlxcLlxcZCopPylcXGJ8XFxiKD88IVxcLikoPzoxMnwoPzpbMC05XXwxWzAxXSkoPzpcXC5cXGQqKT9cXGIpKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnOTYtMjRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtKD88IVxcLikoPzo5NnwoPzpbMS05XXxbMS04XVswLTldfDlbMC01XSkoPzpcXC5cXGQqKT8pXFxifFxcYig/PCFcXC4pKD86MjR8KD86WzAtOV18MVswLTldfDJbMC0zXSkoPzpcXC5cXGQqKT9cXGIpKS8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/Oi0oPzwhXFwuKSg/Ojk2fCg/OlsxLTldfFsxLThdWzAtOV18OVswLTVdKSg/OlxcLlxcZCopPylcXGJ8XFxiKD88IVxcLikoPzoyNHwoPzpbMC05XXwxWzAtOV18MlswLTNdKSg/OlxcLlxcZCopP1xcYikpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWcyMC0yMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtPyg/PCFcXC4pKD86MjB8MT9bMC05XSg/OlxcLlxcZCopPykpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPS0/KD88IVxcLikoPzoyMHwxP1swLTldKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWcxMC0xMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtPyg/PCFcXC4pKD86MTB8WzAtOV0oPzpcXC5cXGQqKT8pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tPyg/PCFcXC4pKD86MTB8WzAtOV0oPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0X25lZzQtNFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtPyg/PCFcXC4pKD86NHxbMC0zXSg/OlxcLlxcZCopPykpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPS0/KD88IVxcLikoPzo0fFswLTNdKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWcxLTFcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT8oPzwhXFwuKSg/OjF8MCg/OlxcLlxcZCopPykpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPS0/KD88IVxcLikoPzoxfDAoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtMVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDF8MCg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD88IVxcLikoPzoxfDAoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtNFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDR8WzAtM10oPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/PCFcXC4pKD86NHxbMC0zXSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC0yMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDIwfCg/OlswLTldfDFbMC05XSkoPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/PCFcXC4pKD86MjR8KD86WzAtOV18MVswLTldKSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC0yNFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDI0fCg/OlswLTldfDFbMC05XXwyWzAtM10pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzwhXFwuKSg/OjI0fCg/OlswLTldfDFbMC05XXwyWzAtM10pKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF8wLTMyXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKD88IVxcLikoMzJ8KD86WzAtOV18MVswLTldfDJbMC05XXwzWzAtMV0pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/PCFcXC4pKD86MzJ8KD86WzAtOV18MVswLTldfDJbMC05XXwzWzAtMV0pKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF8wLTQwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKD88IVxcLikoNDB8KD86WzAtOV18WzEtM11bMC05XSkoPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/PCFcXC4pKD86NDB8KD86WzAtOV18WzEtM11bMC05XSkoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtMTAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKD88IVxcLikoMTAwfCg/OlswLTldfFsxLTldWzAtOV0pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzwhXFwuKSg/OjEwMHwoPzpbMC05XXxbMS05XVswLTldKSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC0yMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoPzwhXFwuKSgyMDB8KD86WzAtOV18WzEtOV1bMC05XXwxWzAtOV17Mn0pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/PCFcXC4pKD86MjAwfCg/OlswLTldfFsxLTldWzAtOV18MVswLTldezJ9KSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC01MDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSg/PCFcXC4pKDUwMHwoPzpbMC05XXxbMS04XVswLTldfDlbMC05XXxbMS00XVswLTldezJ9KSg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzwhXFwuKSg/OjUwMHwoPzpbMC05XXxbMS04XVswLTldfDlbMC05XXxbMS00XVswLTldezJ9KSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC0zMDAwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD0pKD88IVxcLilcXGIoMzAwMDB8KD86WzAtOV18WzEtOV1bMC05XXsxLDN9fDJbMC05XXs0fSkoPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9KD88IVxcLilcXGIoPzozMDAwMHwoPzpbMC05XXxbMS05XVswLTldezEsM318MlswLTldezR9KSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfcG9zaXRpdmVcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoXFxkKyg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9XFxkKyg/OlxcLlxcZCopP1xcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9hbnlcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT9cXGJcXGQrKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tP1xcYlxcZCsoPzpcXC5cXGQqKT9cXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X25lZzEyMDAwLTEyMDAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT9cXGIoPzoxMjAwMHxbMC05XXxbMS05XVswLTldezEsM318MVswMV1bMC05XXszfSkpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPS0/XFxiKD86MTIwMDB8WzAtOV18WzEtOV1bMC05XXsxLDN9fDFbMDFdWzAtOV17M30pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF9uZWc5NjAwLTk2MDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD0pKC0/KD86WzAtOV18WzEtOV1bMC05XXsxLDJ9fFsxLThdWzAtOV17M318OVswLTVdWzAtOV17Mn18OTYwMCkpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9LT8oPzpbMC05XXxbMS05XVswLTldezEsMn18WzEtOF1bMC05XXszfXw5WzAtNV1bMC05XXsyfXw5NjAwKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfbmVnODE5Mi04MTkyXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtPyg/OlswLTldfFsxLTldWzAtOV18WzEtOV1bMC05XXsyfXxbMS03XVswLTldezN9fDgwWzAtOV17Mn18ODFbMC04XVswLTldfDgxOVswLTJdKSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0tPyg/OlswLTldfFsxLTldWzAtOV18WzEtOV1bMC05XXsyfXxbMS03XVswLTldezN9fDgwWzAtOV17Mn18ODFbMC04XVswLTldfDgxOVswLTJdKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfbmVnMTIwMC0xMjAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT9cXGIoPzoxMjAwfFswLTldfFsxLTldWzAtOV17MSwyfXwxWzAxXVswLTldezJ9KSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9LT9cXGIoPzoxMjAwfFswLTldfFsxLTldWzAtOV17MSwyfXwxWzAxXVswLTldezJ9KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfbmVnMTAwLTEwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/XFxiKD86MTAwfFswLTldfFsxLTldWzAtOV0pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tP1xcYig/OjEwMHxbMC05XXxbMS05XVswLTldKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfbmVnMTAtMTBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtP1xcYig/OjEwfFswLTldKSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9LT9cXGIoPzoxMHxbMC05XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X25lZzEtMTI3XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLTF8WzAtOV18WzEtOF1bMC05XXw5WzAtOV18MVswMV1bMC05XXwxMlswLTddKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzotMXxbMC05XXxbMS04XVswLTldfDlbMC05XXwxWzAxXVswLTldfDEyWzAtN10pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF9uZWcxMjctMTI3XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT9cXGIoPzpbMC05XXxbMS04XVswLTldfDlbMC05XXwxWzAxXVswLTldfDEyWzAtN10pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPS0/XFxiKD86WzAtOV18WzEtOF1bMC05XXw5WzAtOV18MVswMV1bMC05XXwxMlswLTddKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfMC0xMjdcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KShbMC05XXxbMS04XVswLTldfDlbMC05XXwxWzAxXVswLTldfDEyWzAtN10pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OlswLTldfFsxLThdWzAtOV18OVswLTldfDFbMDFdWzAtOV18MTJbMC03XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50XzAtMTI3X29yX3N0cmluZ19ub3RlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgoPzpbMC05XXxbMS04XVswLTldfDlbMC05XXwxWzAxXVswLTldfDEyWzAtN10pfFtjZGVmZ2FiQ0RFRkdBQl1cXCM/KD86LTF8WzAtOV0pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/Oig/OlswLTldfFsxLThdWzAtOV18OVswLTldfDFbMDFdWzAtOV18MTJbMC03XSl8W2NkZWZnYWJDREVGR0FCXVxcIz8oPzotMXxbMC05XSkpXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF8wLTEwMjRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvPSg/OlswLTldfFsxLTldWzAtOV18WzEtOV1bMC05XXsyfXwxMFswMV1bMC05XXwxMDJbMC00XSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzpbMC05XXxbMS05XVswLTldfFsxLTldWzAtOV17Mn18MTBbMDFdWzAtOV18MTAyWzAtNF0pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF8wLTEyMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgxMjAwfFswLTldfFsxLTldWzAtOV17MSwyfXwxWzAxXVswLTl7Mn1dKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzoxMjAwfFswLTldfFsxLTldWzAtOV17MSwyfXwxWzAxXVswLTldezJ9XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50XzAtOTYwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKFswLTldfFsxLTldWzAtOV17MSwyfXxbMS04XVswLTldezN9fDlbMC01XVswLTldezJ9fDk2MDApXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9KD86WzAtOV18WzEtOV1bMC05XXsxLDJ9fFsxLThdWzAtOV17M318OVswLTVdWzAtOV17Mn18OTYwMClcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50XzEtMTZcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvPSg/OlsxLTldfDFbMC02XSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86WzEtOV18MVswLTZdKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfMS0xMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvPSg/OjEwMHxbMS05XXxbMS05XVswLTldKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzoxMDB8WzEtOV18WzEtOV1bMC05XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50XzEtMTIwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgcmVnZXg6IC89KD86MTIwMHxbMC05XXxbMS05XVswLTldezEsMn18MVswMV1bMC05XXsyfSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86MTIwMHxbMC05XXxbMS05XVswLTldezEsMn18MVswMV1bMC05XXsyfSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X3Bvc2l0aXZlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoXFxkKylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPzooPyFcXGQrKS4pKiQvLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF9wb3NpdGl2ZV9vcl9uZWcxXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLTF8XFxkKylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPzooPyEoPzotMXxcXGQrKVxcYikuKSokLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfYW55XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT9cXGJcXGQrKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/Oig/IS0/XFxiXFxkKykuKSokLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfYWRkLW11bHRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1wia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLCBcInN0cmluZy51bnF1b3RlZC5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKGFkZHxtdWx0KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzphZGR8bXVsdCkpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19hdHRhY2stcmVsZWFzZS1maXJzdC1sZWdhdG9cIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1wia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLCBcInN0cmluZy51bnF1b3RlZC5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKGF0dGFja3xyZWxlYXNlfGZpcnN0fGxlZ2F0bylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86YXR0YWNrfHJlbGVhc2V8Zmlyc3R8bGVnYXRvKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2JhbGFuY2UtbW1hXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShiYWxhbmNlfG1tYSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86YmFsYW5jZXxtbWEpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfY3VycmVudC1wcmV2aW91c1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoY3VycmVudHxwcmV2aW91cylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86Y3VycmVudHxwcmV2aW91cykpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19mYXN0LW5vcm1hbC10aW1lXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShmYXN0fG5vcm1hbHx0aW1lKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzpmYXN0fG5vcm1hbHx0aW1lKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2ZvcndhcmQtYmFja3dhcmQtYWx0ZXJuYXRlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShmb3J3YXJkfGJhY2t3YXJkfGFsdGVybmF0ZSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86Zm9yd2FyZHxiYWNrd2FyZHxhbHRlcm5hdGUpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfZm9yd2FyZC1yZXZlcnNlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShmb3J3YXJkfHJldmVyc2UpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OmZvcndhcmR8cmV2ZXJzZSkpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19nYWluLXBvd2VyXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShnYWlufHBvd2VyKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzpnYWlufHBvd2VyKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2xvb3BfbW9kZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkobm9fbG9vcHxvbmVfc2hvdHxsb29wX2NvbnRpbnVvdXN8bG9vcF9zdXN0YWluKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzpub19sb29wfG9uZV9zaG90fGxvb3BfY29udGludW91c3xsb29wX3N1c3RhaW4pKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfbHBmLWhwZi1icGYtYnJmXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShscGZfMXB8aHBmXzFwfGxwZl8ycHxocGZfMnB8YnBmXzJwfGJyZl8ycClcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86bHBmXzFwfGhwZl8xcHxscGZfMnB8aHBmXzJwfGJwZl8ycHxicmZfMnApKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfbWQ1XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShbYWJjZGVmMC05XXszMn0pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPVthYmNkZWYwLTldezMyfSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX25vcm1hbC1pbnZlcnRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1wia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLCBcInN0cmluZy51bnF1b3RlZC5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKG5vcm1hbHxpbnZlcnQpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/Om5vcm1hbHxpbnZlcnQpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfb24tb2ZmXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KSh0cnVlfGZhbHNlfG9ufG9mZnwwfDEpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OnRydWV8ZmFsc2V8b258b2ZmfDB8MSkpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19ub3RlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcubm90ZS5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKFtjZGVmZ2FiQ0RFRkdBQl1cXCM/KD86LTF8WzAtOV0pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT1bY2RlZmdhYkNERUZHQUJdXFwjPyg/Oi0xfFswLTldKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2FueV9jb250aW51b3VzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcubm90ZS5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKFteXFxzXSspXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPVteXFxzXSspLiovLFxuICAgICAgfSxcbiAgICBdLFxuICB9O1xuICB0aGlzLm5vcm1hbGl6ZVJ1bGVzKCk7XG59O1xuU0ZaSGlnaGxpZ2h0UnVsZXMubWV0YURhdGEgPSB7XG4gICRzY2hlbWE6XG4gICAgXCJodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vbWFydGlucmluZy90bWxhbmd1YWdlL21hc3Rlci90bWxhbmd1YWdlLmpzb25cIixcbiAgbmFtZTogXCJTRlpcIixcbiAgc2NvcGVOYW1lOiBcInNvdXJjZS5zZnpcIixcbn07XG5vb3AuaW5oZXJpdHMoU0ZaSGlnaGxpZ2h0UnVsZXMsIFRleHRIaWdobGlnaHRSdWxlcyk7XG5cbmV4cG9ydHMuU0ZaSGlnaGxpZ2h0UnVsZXMgPSBTRlpIaWdobGlnaHRSdWxlcztcbiIsImNvbnN0IGU9KCgpPT57aWYoXCJ1bmRlZmluZWRcIj09dHlwZW9mIHNlbGYpcmV0dXJuITE7aWYoXCJ0b3BcImluIHNlbGYmJnNlbGYhPT10b3ApdHJ5e3RvcH1jYXRjaChlKXtyZXR1cm4hMX1yZXR1cm5cInNob3dPcGVuRmlsZVBpY2tlclwiaW4gc2VsZn0pKCksdD1lP1Byb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gbH0pOlByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gdn0pO2FzeW5jIGZ1bmN0aW9uIG4oLi4uZSl7cmV0dXJuKGF3YWl0IHQpLmRlZmF1bHQoLi4uZSl9Y29uc3Qgcj1lP1Byb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4geX0pOlByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gYn0pO2FzeW5jIGZ1bmN0aW9uIGkoLi4uZSl7cmV0dXJuKGF3YWl0IHIpLmRlZmF1bHQoLi4uZSl9Y29uc3QgYT1lP1Byb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gbX0pOlByb21pc2UucmVzb2x2ZSgpLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4ga30pO2FzeW5jIGZ1bmN0aW9uIG8oLi4uZSl7cmV0dXJuKGF3YWl0IGEpLmRlZmF1bHQoLi4uZSl9Y29uc3Qgcz1hc3luYyBlPT57Y29uc3QgdD1hd2FpdCBlLmdldEZpbGUoKTtyZXR1cm4gdC5oYW5kbGU9ZSx0fTt2YXIgYz1hc3luYyhlPVt7fV0pPT57QXJyYXkuaXNBcnJheShlKXx8KGU9W2VdKTtjb25zdCB0PVtdO2UuZm9yRWFjaCgoZSxuKT0+e3Rbbl09e2Rlc2NyaXB0aW9uOmUuZGVzY3JpcHRpb258fFwiRmlsZXNcIixhY2NlcHQ6e319LGUubWltZVR5cGVzP2UubWltZVR5cGVzLm1hcChyPT57dFtuXS5hY2NlcHRbcl09ZS5leHRlbnNpb25zfHxbXX0pOnRbbl0uYWNjZXB0W1wiKi8qXCJdPWUuZXh0ZW5zaW9uc3x8W119KTtjb25zdCBuPWF3YWl0IHdpbmRvdy5zaG93T3BlbkZpbGVQaWNrZXIoe2lkOmVbMF0uaWQsc3RhcnRJbjplWzBdLnN0YXJ0SW4sdHlwZXM6dCxtdWx0aXBsZTplWzBdLm11bHRpcGxlfHwhMSxleGNsdWRlQWNjZXB0QWxsT3B0aW9uOmVbMF0uZXhjbHVkZUFjY2VwdEFsbE9wdGlvbnx8ITF9KSxyPWF3YWl0IFByb21pc2UuYWxsKG4ubWFwKHMpKTtyZXR1cm4gZVswXS5tdWx0aXBsZT9yOnJbMF19LGw9e19fcHJvdG9fXzpudWxsLGRlZmF1bHQ6Y307ZnVuY3Rpb24gdShlKXtmdW5jdGlvbiB0KGUpe2lmKE9iamVjdChlKSE9PWUpcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBUeXBlRXJyb3IoZStcIiBpcyBub3QgYW4gb2JqZWN0LlwiKSk7dmFyIHQ9ZS5kb25lO3JldHVybiBQcm9taXNlLnJlc29sdmUoZS52YWx1ZSkudGhlbihmdW5jdGlvbihlKXtyZXR1cm57dmFsdWU6ZSxkb25lOnR9fSl9cmV0dXJuIHU9ZnVuY3Rpb24oZSl7dGhpcy5zPWUsdGhpcy5uPWUubmV4dH0sdS5wcm90b3R5cGU9e3M6bnVsbCxuOm51bGwsbmV4dDpmdW5jdGlvbigpe3JldHVybiB0KHRoaXMubi5hcHBseSh0aGlzLnMsYXJndW1lbnRzKSl9LHJldHVybjpmdW5jdGlvbihlKXt2YXIgbj10aGlzLnMucmV0dXJuO3JldHVybiB2b2lkIDA9PT1uP1Byb21pc2UucmVzb2x2ZSh7dmFsdWU6ZSxkb25lOiEwfSk6dChuLmFwcGx5KHRoaXMucyxhcmd1bWVudHMpKX0sdGhyb3c6ZnVuY3Rpb24oZSl7dmFyIG49dGhpcy5zLnJldHVybjtyZXR1cm4gdm9pZCAwPT09bj9Qcm9taXNlLnJlamVjdChlKTp0KG4uYXBwbHkodGhpcy5zLGFyZ3VtZW50cykpfX0sbmV3IHUoZSl9Y29uc3QgcD1hc3luYyhlLHQsbj1lLm5hbWUscik9Pntjb25zdCBpPVtdLGE9W107dmFyIG8scz0hMSxjPSExO3RyeXtmb3IodmFyIGwsZD1mdW5jdGlvbihlKXt2YXIgdCxuLHIsaT0yO2ZvcihcInVuZGVmaW5lZFwiIT10eXBlb2YgU3ltYm9sJiYobj1TeW1ib2wuYXN5bmNJdGVyYXRvcixyPVN5bWJvbC5pdGVyYXRvcik7aS0tOyl7aWYobiYmbnVsbCE9KHQ9ZVtuXSkpcmV0dXJuIHQuY2FsbChlKTtpZihyJiZudWxsIT0odD1lW3JdKSlyZXR1cm4gbmV3IHUodC5jYWxsKGUpKTtuPVwiQEBhc3luY0l0ZXJhdG9yXCIscj1cIkBAaXRlcmF0b3JcIn10aHJvdyBuZXcgVHlwZUVycm9yKFwiT2JqZWN0IGlzIG5vdCBhc3luYyBpdGVyYWJsZVwiKX0oZS52YWx1ZXMoKSk7cz0hKGw9YXdhaXQgZC5uZXh0KCkpLmRvbmU7cz0hMSl7Y29uc3Qgbz1sLnZhbHVlLHM9YCR7bn0vJHtvLm5hbWV9YDtcImZpbGVcIj09PW8ua2luZD9hLnB1c2goby5nZXRGaWxlKCkudGhlbih0PT4odC5kaXJlY3RvcnlIYW5kbGU9ZSx0LmhhbmRsZT1vLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LFwid2Via2l0UmVsYXRpdmVQYXRoXCIse2NvbmZpZ3VyYWJsZTohMCxlbnVtZXJhYmxlOiEwLGdldDooKT0+c30pKSkpOlwiZGlyZWN0b3J5XCIhPT1vLmtpbmR8fCF0fHxyJiZyKG8pfHxpLnB1c2gocChvLHQscyxyKSl9fWNhdGNoKGUpe2M9ITAsbz1lfWZpbmFsbHl7dHJ5e3MmJm51bGwhPWQucmV0dXJuJiZhd2FpdCBkLnJldHVybigpfWZpbmFsbHl7aWYoYyl0aHJvdyBvfX1yZXR1cm5bLi4uKGF3YWl0IFByb21pc2UuYWxsKGkpKS5mbGF0KCksLi4uYXdhaXQgUHJvbWlzZS5hbGwoYSldfTt2YXIgZD1hc3luYyhlPXt9KT0+e2UucmVjdXJzaXZlPWUucmVjdXJzaXZlfHwhMSxlLm1vZGU9ZS5tb2RlfHxcInJlYWRcIjtjb25zdCB0PWF3YWl0IHdpbmRvdy5zaG93RGlyZWN0b3J5UGlja2VyKHtpZDplLmlkLHN0YXJ0SW46ZS5zdGFydEluLG1vZGU6ZS5tb2RlfSk7cmV0dXJuKGF3YWl0KGF3YWl0IHQudmFsdWVzKCkpLm5leHQoKSkuZG9uZT9bdF06cCh0LGUucmVjdXJzaXZlLHZvaWQgMCxlLnNraXBEaXJlY3RvcnkpfSx5PXtfX3Byb3RvX186bnVsbCxkZWZhdWx0OmR9LGY9YXN5bmMoZSx0PVt7fV0sbj1udWxsLHI9ITEsaT1udWxsKT0+e0FycmF5LmlzQXJyYXkodCl8fCh0PVt0XSksdFswXS5maWxlTmFtZT10WzBdLmZpbGVOYW1lfHxcIlVudGl0bGVkXCI7Y29uc3QgYT1bXTtsZXQgbz1udWxsO2lmKGUgaW5zdGFuY2VvZiBCbG9iJiZlLnR5cGU/bz1lLnR5cGU6ZS5oZWFkZXJzJiZlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpJiYobz1lLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpKSx0LmZvckVhY2goKGUsdCk9PnthW3RdPXtkZXNjcmlwdGlvbjplLmRlc2NyaXB0aW9ufHxcIkZpbGVzXCIsYWNjZXB0Ont9fSxlLm1pbWVUeXBlcz8oMD09PXQmJm8mJmUubWltZVR5cGVzLnB1c2gobyksZS5taW1lVHlwZXMubWFwKG49PnthW3RdLmFjY2VwdFtuXT1lLmV4dGVuc2lvbnN8fFtdfSkpOm8/YVt0XS5hY2NlcHRbb109ZS5leHRlbnNpb25zfHxbXTphW3RdLmFjY2VwdFtcIiovKlwiXT1lLmV4dGVuc2lvbnN8fFtdfSksbil0cnl7YXdhaXQgbi5nZXRGaWxlKCl9Y2F0Y2goZSl7aWYobj1udWxsLHIpdGhyb3cgZX1jb25zdCBzPW58fGF3YWl0IHdpbmRvdy5zaG93U2F2ZUZpbGVQaWNrZXIoe3N1Z2dlc3RlZE5hbWU6dFswXS5maWxlTmFtZSxpZDp0WzBdLmlkLHN0YXJ0SW46dFswXS5zdGFydEluLHR5cGVzOmEsZXhjbHVkZUFjY2VwdEFsbE9wdGlvbjp0WzBdLmV4Y2x1ZGVBY2NlcHRBbGxPcHRpb258fCExfSk7IW4mJmkmJmkocyk7Y29uc3QgYz1hd2FpdCBzLmNyZWF0ZVdyaXRhYmxlKCk7aWYoXCJzdHJlYW1cImluIGUpe2NvbnN0IHQ9ZS5zdHJlYW0oKTtyZXR1cm4gYXdhaXQgdC5waXBlVG8oYyksc31yZXR1cm5cImJvZHlcImluIGU/KGF3YWl0IGUuYm9keS5waXBlVG8oYykscyk6KGF3YWl0IGMud3JpdGUoYXdhaXQgZSksYXdhaXQgYy5jbG9zZSgpLHMpfSxtPXtfX3Byb3RvX186bnVsbCxkZWZhdWx0OmZ9LHc9YXN5bmMoZT1be31dKT0+KEFycmF5LmlzQXJyYXkoZSl8fChlPVtlXSksbmV3IFByb21pc2UoKHQsbik9Pntjb25zdCByPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiKTtyLnR5cGU9XCJmaWxlXCI7Y29uc3QgaT1bLi4uZS5tYXAoZT0+ZS5taW1lVHlwZXN8fFtdKSwuLi5lLm1hcChlPT5lLmV4dGVuc2lvbnN8fFtdKV0uam9pbigpO3IubXVsdGlwbGU9ZVswXS5tdWx0aXBsZXx8ITEsci5hY2NlcHQ9aXx8XCJcIixyLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsZG9jdW1lbnQuYm9keS5hcHBlbmQocik7Y29uc3QgYT1lPT57XCJmdW5jdGlvblwiPT10eXBlb2YgbyYmbygpLHQoZSl9LG89ZVswXS5sZWdhY3lTZXR1cCYmZVswXS5sZWdhY3lTZXR1cChhLCgpPT5vKG4pLHIpLHM9KCk9Pnt3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIscyksci5yZW1vdmUoKX07ci5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKT0+e3dpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZm9jdXNcIixzKX0pLHIuYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCgpPT57d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLHMpLHIucmVtb3ZlKCksYShyLm11bHRpcGxlP0FycmF5LmZyb20oci5maWxlcyk6ci5maWxlc1swXSl9KSxcInNob3dQaWNrZXJcImluIEhUTUxJbnB1dEVsZW1lbnQucHJvdG90eXBlP3Iuc2hvd1BpY2tlcigpOnIuY2xpY2soKX0pKSx2PXtfX3Byb3RvX186bnVsbCxkZWZhdWx0Ond9LGg9YXN5bmMoZT1be31dKT0+KEFycmF5LmlzQXJyYXkoZSl8fChlPVtlXSksZVswXS5yZWN1cnNpdmU9ZVswXS5yZWN1cnNpdmV8fCExLG5ldyBQcm9taXNlKCh0LG4pPT57Y29uc3Qgcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7ci50eXBlPVwiZmlsZVwiLHIud2Via2l0ZGlyZWN0b3J5PSEwO2NvbnN0IGk9ZT0+e1wiZnVuY3Rpb25cIj09dHlwZW9mIGEmJmEoKSx0KGUpfSxhPWVbMF0ubGVnYWN5U2V0dXAmJmVbMF0ubGVnYWN5U2V0dXAoaSwoKT0+YShuKSxyKTtyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwoKT0+e2xldCB0PUFycmF5LmZyb20oci5maWxlcyk7ZVswXS5yZWN1cnNpdmU/ZVswXS5yZWN1cnNpdmUmJmVbMF0uc2tpcERpcmVjdG9yeSYmKHQ9dC5maWx0ZXIodD0+dC53ZWJraXRSZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpLmV2ZXJ5KHQ9PiFlWzBdLnNraXBEaXJlY3Rvcnkoe25hbWU6dCxraW5kOlwiZGlyZWN0b3J5XCJ9KSkpKTp0PXQuZmlsdGVyKGU9PjI9PT1lLndlYmtpdFJlbGF0aXZlUGF0aC5zcGxpdChcIi9cIikubGVuZ3RoKSxpKHQpfSksXCJzaG93UGlja2VyXCJpbiBIVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZT9yLnNob3dQaWNrZXIoKTpyLmNsaWNrKCl9KSksYj17X19wcm90b19fOm51bGwsZGVmYXVsdDpofSxQPWFzeW5jKGUsdD17fSk9PntBcnJheS5pc0FycmF5KHQpJiYodD10WzBdKTtjb25zdCBuPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO2xldCByPWU7XCJib2R5XCJpbiBlJiYocj1hd2FpdCBhc3luYyBmdW5jdGlvbihlLHQpe2NvbnN0IG49ZS5nZXRSZWFkZXIoKSxyPW5ldyBSZWFkYWJsZVN0cmVhbSh7c3RhcnQ6ZT0+YXN5bmMgZnVuY3Rpb24gdCgpe3JldHVybiBuLnJlYWQoKS50aGVuKCh7ZG9uZTpuLHZhbHVlOnJ9KT0+e2lmKCFuKXJldHVybiBlLmVucXVldWUociksdCgpO2UuY2xvc2UoKX0pfSgpfSksaT1uZXcgUmVzcG9uc2UociksYT1hd2FpdCBpLmJsb2IoKTtyZXR1cm4gbi5yZWxlYXNlTG9jaygpLG5ldyBCbG9iKFthXSx7dHlwZTp0fSl9KGUuYm9keSxlLmhlYWRlcnMuZ2V0KFwiY29udGVudC10eXBlXCIpKSksbi5kb3dubG9hZD10LmZpbGVOYW1lfHxcIlVudGl0bGVkXCIsbi5ocmVmPVVSTC5jcmVhdGVPYmplY3RVUkwoYXdhaXQgcik7Y29uc3QgaT0oKT0+e1wiZnVuY3Rpb25cIj09dHlwZW9mIGEmJmEoKX0sYT10LmxlZ2FjeVNldHVwJiZ0LmxlZ2FjeVNldHVwKGksKCk9PmEoKSxuKTtyZXR1cm4gbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwoKT0+e3NldFRpbWVvdXQoKCk9PlVSTC5yZXZva2VPYmplY3RVUkwobi5ocmVmKSwzZTQpLGkoKX0pLG4uY2xpY2soKSxudWxsfSxrPXtfX3Byb3RvX186bnVsbCxkZWZhdWx0OlB9O2V4cG9ydHtpIGFzIGRpcmVjdG9yeU9wZW4saCBhcyBkaXJlY3RvcnlPcGVuTGVnYWN5LGQgYXMgZGlyZWN0b3J5T3Blbk1vZGVybixuIGFzIGZpbGVPcGVuLHcgYXMgZmlsZU9wZW5MZWdhY3ksYyBhcyBmaWxlT3Blbk1vZGVybixvIGFzIGZpbGVTYXZlLFAgYXMgZmlsZVNhdmVMZWdhY3ksZiBhcyBmaWxlU2F2ZU1vZGVybixlIGFzIHN1cHBvcnRlZH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGxheWVyID0gZXhwb3J0cy5JbnRlcmZhY2UgPSBleHBvcnRzLkVkaXRvciA9IHZvaWQgMDtcbmNvbnN0IEVkaXRvcl8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9FZGl0b3JcIik7XG5leHBvcnRzLkVkaXRvciA9IEVkaXRvcl8xLmRlZmF1bHQ7XG5jb25zdCBJbnRlcmZhY2VfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvSW50ZXJmYWNlXCIpO1xuZXhwb3J0cy5JbnRlcmZhY2UgPSBJbnRlcmZhY2VfMS5kZWZhdWx0O1xuY29uc3QgUGxheWVyXzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL1BsYXllclwiKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyXzEuZGVmYXVsdDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==