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

/***/ "./node_modules/@sfz-tools/core/dist/api.js":
/*!**************************************************!*\
  !*** ./node_modules/@sfz-tools/core/dist/api.js ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.apiText = exports.apiJson = exports.apiBuffer = exports.apiArrayBuffer = void 0;
const node_fetch_1 = __importDefault(__webpack_require__(/*! node-fetch */ "./node_modules/node-fetch/browser.js"));
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/@sfz-tools/core/dist/utils.js");
async function apiArrayBuffer(url) {
    (0, utils_1.log)('⤓', url);
    return (0, node_fetch_1.default)(url).then((res) => res.arrayBuffer());
}
exports.apiArrayBuffer = apiArrayBuffer;
async function apiBuffer(url) {
    (0, utils_1.log)('⤓', url);
    return (0, node_fetch_1.default)(url).then((res) => res.buffer());
}
exports.apiBuffer = apiBuffer;
async function apiJson(url) {
    (0, utils_1.log)('⤓', url);
    return (0, node_fetch_1.default)(url).then((res) => res.json());
}
exports.apiJson = apiJson;
async function apiText(url) {
    (0, utils_1.log)('⤓', url);
    return (0, node_fetch_1.default)(url).then((res) => res.text());
}
exports.apiText = apiText;
//# sourceMappingURL=api.js.map

/***/ }),

/***/ "./node_modules/@sfz-tools/core/dist/parse.js":
/*!****************************************************!*\
  !*** ./node_modules/@sfz-tools/core/dist/parse.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseVariables = exports.parseSfz = exports.parseSetLoader = exports.parseSegment = exports.parseSanitize = exports.parseOpcodeObject = exports.parseLoad = exports.parseIncludes = exports.parseHeaders = exports.parseHeader = exports.parseDefines = void 0;
const api_1 = __webpack_require__(/*! ./api */ "./node_modules/@sfz-tools/core/dist/api.js");
const parse_1 = __webpack_require__(/*! ./types/parse */ "./node_modules/@sfz-tools/core/dist/types/parse.js");
const utils_1 = __webpack_require__(/*! ./utils */ "./node_modules/@sfz-tools/core/dist/utils.js");
const DEBUG = false;
const variables = {};
let fileReadString = api_1.apiText;
function parseDefines(contents) {
    const defines = contents.match(/(?<=#define ).+(?=\r|\n)/g);
    if (!defines)
        return contents;
    for (const define of defines) {
        if (DEBUG)
            console.log(define);
        const val = define.split(' ');
        variables[val[0]] = val[1];
    }
    return contents;
}
exports.parseDefines = parseDefines;
function parseHeader(input) {
    return input.replace(/<| |>/g, '');
}
exports.parseHeader = parseHeader;
function parseHeaders(headers, prefix) {
    const regions = [];
    let defaultPath = '';
    let globalObj = {};
    let masterObj = {};
    let controlObj = {};
    let groupObj = {};
    headers.forEach((header) => {
        if (header.name === parse_1.ParseHeaderNames.global) {
            globalObj = parseOpcodeObject(header.elements);
        }
        else if (header.name === parse_1.ParseHeaderNames.master) {
            masterObj = parseOpcodeObject(header.elements);
        }
        else if (header.name === parse_1.ParseHeaderNames.control) {
            controlObj = parseOpcodeObject(header.elements);
            if (controlObj.default_path)
                defaultPath = controlObj.default_path;
        }
        else if (header.name === parse_1.ParseHeaderNames.group) {
            groupObj = parseOpcodeObject(header.elements);
        }
        else if (header.name === parse_1.ParseHeaderNames.region) {
            const regionObj = parseOpcodeObject(header.elements);
            const mergedObj = Object.assign({}, globalObj, masterObj, controlObj, groupObj, regionObj);
            if (mergedObj.sample) {
                if (prefix && !mergedObj.sample.startsWith(prefix)) {
                    mergedObj.sample = (0, utils_1.pathJoin)(prefix, defaultPath, mergedObj.sample);
                }
                else if (!mergedObj.sample.startsWith(defaultPath)) {
                    mergedObj.sample = (0, utils_1.pathJoin)(defaultPath, mergedObj.sample);
                }
            }
            regions.push(mergedObj);
        }
    });
    return regions;
}
exports.parseHeaders = parseHeaders;
async function parseIncludes(contents, prefix = '') {
    contents = parseDefines(contents);
    const includes = contents.match(/#include "(.+?)"/g);
    if (!includes)
        return contents;
    for (const include of includes) {
        const includePaths = include.match(/(?<=")(.*?)(?=")/g);
        if (!includePaths)
            continue;
        if (includePaths[0].includes('$'))
            includePaths[0] = parseVariables(includePaths[0], variables);
        const subcontent = await parseLoad(includePaths[0], prefix);
        const subcontentFlat = await parseIncludes(subcontent, prefix);
        contents = contents.replace(include, subcontentFlat);
    }
    return contents;
}
exports.parseIncludes = parseIncludes;
async function parseLoad(includePath, prefix) {
    const pathJoined = (0, utils_1.pathJoin)(prefix, includePath);
    let file = '';
    if (pathJoined.startsWith('http'))
        file = await (0, api_1.apiText)(pathJoined);
    else if (fileReadString)
        file = fileReadString(pathJoined);
    else
        file = await (0, api_1.apiText)(pathJoined);
    return file;
}
exports.parseLoad = parseLoad;
function parseOpcodeObject(opcodes) {
    const properties = {};
    opcodes.forEach((opcode) => {
        if (!isNaN(opcode.attributes.value)) {
            properties[opcode.attributes.name] = Number(opcode.attributes.value);
        }
        else {
            properties[opcode.attributes.name] = opcode.attributes.value;
        }
    });
    return properties;
}
exports.parseOpcodeObject = parseOpcodeObject;
function parseSanitize(contents) {
    // Remove comments.
    contents = contents.replace(/\/\*[\s\S]*?\*\/|(?<=[^:])\/\/.*|^\/\/.*/g, '');
    // Remove new lines and returns.
    contents = contents.replace(/(\r?\n|\r)+/g, ' ');
    // Ensure there are always spaces after <header>.
    contents = contents.replace(/>(?! )/g, '> ');
    // Replace multiple spaces/tabs with single space.
    contents = contents.replace(/( |\t)+/g, ' ');
    // Trim whitespace.
    return contents.trim();
}
exports.parseSanitize = parseSanitize;
function parseSegment(segment) {
    if (segment.includes('"'))
        segment = segment.replace(/"/g, '');
    if (segment.includes('$'))
        segment = parseVariables(segment, variables);
    return segment;
}
exports.parseSegment = parseSegment;
function parseSetLoader(func) {
    fileReadString = func;
}
exports.parseSetLoader = parseSetLoader;
async function parseSfz(contents, prefix = '') {
    let element = {};
    const elements = [];
    const contentsFlat = await parseIncludes(contents, prefix);
    const santized = parseSanitize(contentsFlat);
    const segments = santized.split(' ');
    for (let i = 0; i < segments.length; i++) {
        const segment = parseSegment(segments[i]);
        if (segment.charAt(0) === '/') {
            if (DEBUG)
                console.log('comment:', segment);
        }
        else if (segment === '#define') {
            const key = segments[i + 1];
            const val = segments[i + 2];
            if (DEBUG)
                console.log('define:', key, val);
            variables[key] = val;
            i += 2;
        }
        else if (segment.charAt(0) === '<') {
            element = {
                type: 'element',
                name: parseHeader(segment),
                elements: [],
            };
            if (DEBUG)
                console.log('header:', element.name);
            elements.push(element);
        }
        else {
            if (!element.elements)
                element.elements = [];
            const opcode = segment.split('=');
            if (DEBUG)
                console.log('opcode:', opcode);
            // If orphaned string, add on to previous opcode value.
            if (opcode.length === 1 && element.elements.length && opcode[0] !== '') {
                element.elements[element.elements.length - 1].attributes.value += ' ' + opcode[0];
            }
            else {
                element.elements.push({
                    type: 'element',
                    name: 'opcode',
                    attributes: {
                        name: opcode[0],
                        value: opcode[1],
                    },
                });
            }
        }
    }
    if (elements.length > 0)
        return elements;
    return element;
}
exports.parseSfz = parseSfz;
function parseVariables(input, vars) {
    for (const key in vars) {
        const regEx = new RegExp('\\' + key, 'g');
        input = input.replace(regEx, vars[key]);
    }
    return input;
}
exports.parseVariables = parseVariables;
//# sourceMappingURL=parse.js.map

/***/ }),

/***/ "./node_modules/@sfz-tools/core/dist/types/parse.js":
/*!**********************************************************!*\
  !*** ./node_modules/@sfz-tools/core/dist/types/parse.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParseHeaderNames = void 0;
var ParseHeaderNames;
(function (ParseHeaderNames) {
    ParseHeaderNames["region"] = "region";
    ParseHeaderNames["group"] = "group";
    ParseHeaderNames["control"] = "control";
    ParseHeaderNames["global"] = "global";
    ParseHeaderNames["curve"] = "curve";
    ParseHeaderNames["effect"] = "effect";
    ParseHeaderNames["master"] = "master";
    ParseHeaderNames["midi"] = "midi";
    ParseHeaderNames["sample"] = "sample";
})(ParseHeaderNames || (ParseHeaderNames = {}));
exports.ParseHeaderNames = ParseHeaderNames;
//# sourceMappingURL=parse.js.map

/***/ }),

/***/ "./node_modules/@sfz-tools/core/dist/utils.js":
/*!****************************************************!*\
  !*** ./node_modules/@sfz-tools/core/dist/utils.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pitchToMidi = exports.pathReplaceVariables = exports.pathJoin = exports.pathGetSubDirectory = exports.pathGetRoot = exports.pathGetFilename = exports.pathGetExt = exports.pathGetDirectory = exports.normalizeXml = exports.normalizeLineEnds = exports.midiNameToNum = exports.logDisable = exports.logEnable = exports.log = exports.findNumber = exports.findCaseInsentive = exports.encodeHashes = exports.LINE_END = exports.IS_WIN = void 0;
const IS_WIN = typeof process !== 'undefined' && process.platform === 'win32';
exports.IS_WIN = IS_WIN;
const LINE_END = IS_WIN ? '\r\n' : '\n';
exports.LINE_END = LINE_END;
let LOGGING_ENABLED = false;
function encodeHashes(item) {
    return item.replace(/#/g, encodeURIComponent('#'));
}
exports.encodeHashes = encodeHashes;
function findCaseInsentive(items, match) {
    return items.findIndex((item) => {
        return item.toLowerCase() === match.toLowerCase();
    });
}
exports.findCaseInsentive = findCaseInsentive;
function findNumber(input) {
    const matches = input.match(/\d+/g);
    return Number(matches[0]);
}
exports.findNumber = findNumber;
function log(...args) {
    if (LOGGING_ENABLED) {
        console.log(...args);
    }
}
exports.log = log;
function logEnable(...args) {
    LOGGING_ENABLED = true;
}
exports.logEnable = logEnable;
function logDisable(...args) {
    LOGGING_ENABLED = false;
}
exports.logDisable = logDisable;
function midiNameToNum(name) {
    if (!name)
        return 0;
    if (typeof name === 'number')
        return name;
    const mapPitches = {
        C: 0,
        D: 2,
        E: 4,
        F: 5,
        G: 7,
        A: 9,
        B: 11,
    };
    const letter = name[0];
    let pc = mapPitches[letter.toUpperCase()];
    const mapMods = { b: -1, '#': 1 };
    const mod = name[1];
    const trans = mapMods[mod] || 0;
    pc += trans;
    const octave = parseInt(name.slice(name.length - 1), 10);
    if (octave) {
        return pc + 12 * (octave + 1);
    }
    else {
        return ((pc % 12) + 12) % 12;
    }
}
exports.midiNameToNum = midiNameToNum;
function normalizeLineEnds(input) {
    if (IS_WIN)
        return input.replace(/\r?\n/g, LINE_END);
    return input;
}
exports.normalizeLineEnds = normalizeLineEnds;
function normalizeXml(input) {
    input = normalizeLineEnds(input);
    return input.replace(/\/>/g, ' />') + LINE_END;
}
exports.normalizeXml = normalizeXml;
function pathGetDirectory(pathItem, separator = '/') {
    return pathItem.substring(0, pathItem.lastIndexOf(separator));
}
exports.pathGetDirectory = pathGetDirectory;
function pathGetExt(pathItem) {
    return pathItem.substring(pathItem.lastIndexOf('.') + 1);
}
exports.pathGetExt = pathGetExt;
function pathGetFilename(str, separator = '/') {
    let base = str.substring(str.lastIndexOf(separator) + 1);
    if (base.lastIndexOf('.') !== -1) {
        base = base.substring(0, base.lastIndexOf('.'));
    }
    return base;
}
exports.pathGetFilename = pathGetFilename;
function pathGetRoot(item, separator = '/') {
    return item.substring(0, item.indexOf(separator) + 1);
}
exports.pathGetRoot = pathGetRoot;
function pathGetSubDirectory(item, dir) {
    return item.replace(dir, '');
}
exports.pathGetSubDirectory = pathGetSubDirectory;
function pathJoin(...segments) {
    const parts = segments.reduce((partItems, segment) => {
        // Replace backslashes with forward slashes
        if (segment.includes('\\')) {
            segment = segment.replace(/\\/g, '/');
        }
        // Remove leading slashes from non-first part.
        if (partItems.length > 0) {
            segment = segment.replace(/^\//, '');
        }
        // Remove trailing slashes.
        segment = segment.replace(/\/$/, '');
        return partItems.concat(segment.split('/'));
    }, []);
    const resultParts = [];
    for (let part of parts) {
        if (part === 'https:' || part === 'http:')
            part += '/';
        if (part === '')
            continue;
        if (part === '.')
            continue;
        if (part === resultParts[resultParts.length - 1])
            continue;
        if (part === '..') {
            const partRemoved = resultParts.pop();
            if (partRemoved === '')
                resultParts.pop();
            continue;
        }
        resultParts.push(part);
    }
    return resultParts.join('/');
}
exports.pathJoin = pathJoin;
function pathReplaceVariables(str, items) {
    if (Array.isArray(items)) {
        items.forEach((item, itemIndex) => {
            str = str.replace(`$item[${itemIndex}]`, item);
        });
    }
    else {
        Object.keys(items).forEach((key) => {
            str = str.replace(`$${key}`, items[key]);
        });
    }
    return str;
}
exports.pathReplaceVariables = pathReplaceVariables;
function pitchToMidi(pitch) {
    // A4 = 440 Hz, 69 MIDI note
    const A4_HZ = 440;
    const A4_MIDI = 69;
    // The number of semitones between the given pitch and A4
    const semitones = Math.log2(pitch / A4_HZ) * 12;
    // The MIDI note number
    const midiNote = A4_MIDI + semitones;
    return Math.round(midiNote);
}
exports.pitchToMidi = pitchToMidi;
//# sourceMappingURL=utils.js.map

/***/ }),

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
___CSS_LOADER_EXPORT___.push([module.id, ".interface {\n  background-color: #000;\n  color: #fff;\n  font-size: 14px;\n  font-family: Arial, Helvetica, sans-serif;\n  position: relative;\n  user-select: none;\n}\n\n.interface img,\n.interface span,\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  position: absolute;\n}\n\n.interface img {\n  z-index: 1;\n}\n\n.interface .loadingScreen {\n  display: none;\n}\n\n.interface.loading .loadingScreen {\n  align-items: center;\n  background-color: rgba(0, 0, 0, 0.5);\n  display: flex;\n  justify-content: center;\n  position: absolute;\n  right: 1rem;\n  top: 0.5rem;\n  z-index: 5;\n}\n\n.interface.loading .keyboard {\n  opacity: 0.2;\n}\n\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  z-index: 2;\n}\n\n.interface span {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  z-index: 3;\n}\n\n.interface .tabs {\n  align-content: flex-start;\n  color: #fff;\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.interface .radiotab {\n  position: absolute;\n  opacity: 0;\n}\n\n.interface .label {\n  width: 100%;\n  cursor: pointer;\n  padding: 0.5rem 1rem;\n  text-align: center;\n}\n\n.interface .label:hover {\n  background-color: #222;\n}\n\n.interface .radiotab:checked + .label {\n  background-color: #333;\n}\n\n.interface .panel {\n  background-color: #333;\n  position: relative;\n  display: none;\n  width: 100%;\n  height: 0;\n  padding-bottom: 42.58%;\n}\n\n.interface .radiotab:checked + .label + .panel {\n  display: block;\n}\n\n.interface .panel {\n  order: 99;\n}\n\n.interface .label {\n  width: auto;\n}\n\n.interface .default-title {\n  font-size: 2rem;\n  font-weight: bold;\n  height: 100%;\n  width: 100%;\n}", "",{"version":3,"sources":["webpack://./src/components/Interface.scss"],"names":[],"mappings":"AAAA;EACE,sBAAA;EACA,WAAA;EACA,eAAA;EACA,yCAAA;EACA,kBAAA;EACA,iBAAA;AACF;;AAEA;;;;;EAKE,kBAAA;AACF;;AAGA;EACE,UAAA;AAAF;;AAGA;EACE,aAAA;AAAF;;AAGA;EACE,mBAAA;EACA,oCAAA;EACA,aAAA;EACA,uBAAA;EACA,kBAAA;EACA,WAAA;EACA,WAAA;EACA,UAAA;AAAF;;AAGA;EACE,YAAA;AAAF;;AAGA;;;EAGE,UAAA;AAAF;;AAGA;EACE,mBAAA;EACA,aAAA;EACA,uBAAA;EACA,UAAA;AAAF;;AAGA;EACE,yBAAA;EACA,WAAA;EACA,aAAA;EACA,eAAA;AAAF;;AAGA;EACE,kBAAA;EACA,UAAA;AAAF;;AAGA;EACE,WAAA;EACA,eAAA;EACA,oBAAA;EACA,kBAAA;AAAF;;AAGA;EACE,sBAAA;AAAF;;AAGA;EACE,sBAAA;AAAF;;AAGA;EACE,sBAAA;EACA,kBAAA;EACA,aAAA;EACA,WAAA;EACA,SAAA;EACA,sBAAA;AAAF;;AAGA;EACE,cAAA;AAAF;;AAGA;EACE,SAAA;AAAF;;AAEA;EACE,WAAA;AACF;;AAEA;EACE,eAAA;EACA,iBAAA;EACA,YAAA;EACA,WAAA;AACF","sourcesContent":[".interface {\n  background-color: #000;\n  color: #fff;\n  font-size: 14px;\n  font-family: Arial, Helvetica, sans-serif;\n  position: relative;\n  user-select: none;\n}\n\n.interface img,\n.interface span,\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  position: absolute;\n  // transform: translate(-50%, -50%);\n}\n\n.interface img {\n  z-index: 1;\n}\n\n.interface .loadingScreen {\n  display: none;\n}\n\n.interface.loading .loadingScreen {\n  align-items: center;\n  background-color: rgba(0, 0, 0, .5);\n  display: flex;\n  justify-content: center;\n  position: absolute;\n  right: 1rem;\n  top: 0.5rem;\n  z-index: 5;\n}\n\n.interface.loading .keyboard {\n  opacity: .2;\n}\n\n.interface webaudio-knob,\n.interface webaudio-slider,\n.interface webaudio-switch {\n  z-index: 2;\n}\n\n.interface span {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  z-index: 3;\n}\n\n.interface .tabs {\n  align-content: flex-start;\n  color: #fff;\n  display: flex;\n  flex-wrap: wrap;\n}\n\n.interface .radiotab {\n  position: absolute;\n  opacity: 0;\n}\n\n.interface .label {\n  width: 100%;\n  cursor: pointer;\n  padding: 0.5rem 1rem;\n  text-align: center;\n}\n\n.interface .label:hover {\n  background-color: #222;\n}\n\n.interface .radiotab:checked + .label {\n  background-color: #333;\n}\n\n.interface .panel {\n  background-color: #333;\n  position: relative;\n  display: none;\n  width: 100%;\n  height: 0;\n  padding-bottom: 42.58%; // 330px / 775px\n}\n\n.interface .radiotab:checked + .label + .panel {\n  display: block;\n}\n\n.interface .panel {\n  order: 99;\n}\n.interface .label {\n  width: auto;\n}\n\n.interface .default-title {\n  font-size: 2rem;\n  font-weight: bold;\n  height: 100%;\n  width: 100%;\n}\n"],"sourceRoot":""}]);
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

/***/ "./node_modules/node-fetch/browser.js":
/*!********************************************!*\
  !*** ./node_modules/node-fetch/browser.js ***!
  \********************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";


// ref: https://github.com/tc39/proposal-global
var getGlobal = function () {
	// the only reliable means to get the global object is
	// `Function('return this')()`
	// However, this causes CSP violations in Chrome apps.
	if (typeof self !== 'undefined') { return self; }
	if (typeof window !== 'undefined') { return window; }
	if (typeof __webpack_require__.g !== 'undefined') { return __webpack_require__.g; }
	throw new Error('unable to locate global object');
}

var globalObject = getGlobal();

module.exports = exports = globalObject.fetch;

// Needed for TypeScript and Webpack.
if (globalObject.fetch) {
	exports["default"] = globalObject.fetch.bind(globalObject);
}

exports.Headers = globalObject.Headers;
exports.Request = globalObject.Request;
exports.Response = globalObject.Response;


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
const player_1 = __webpack_require__(/*! ../types/player */ "./src/types/player.ts");
const event_1 = __webpack_require__(/*! ./event */ "./src/components/event.ts");
const fileLoader_1 = __webpack_require__(/*! ../utils/fileLoader */ "./src/utils/fileLoader.ts");
const Sample_1 = __webpack_require__(/*! ./Sample */ "./src/components/Sample.ts");
const utils_1 = __webpack_require__(/*! @sfz-tools/core/dist/utils */ "./node_modules/@sfz-tools/core/dist/utils.js");
const parse_1 = __webpack_require__(/*! @sfz-tools/core/dist/parse */ "./node_modules/@sfz-tools/core/dist/parse.js");
class Audio extends event_1.default {
    constructor(options) {
        super();
        this.preload = player_1.AudioPreload.ON_DEMAND;
        this.regions = [];
        this.bend = 0;
        this.chanaft = 64;
        this.polyaft = 64;
        this.bpm = 120;
        this.regionDefaults = {
            lochan: 0,
            hichan: 15,
            lokey: 0,
            hikey: 127,
            lovel: 0,
            hivel: 127,
            lobend: -8192,
            hibend: 8192,
            lochanaft: 0,
            hichanaft: 127,
            lopolyaft: 0,
            hipolyaft: 127,
            lorand: 0,
            hirand: 1,
            lobpm: 0,
            hibpm: 500,
        };
        if (!window.AudioContext)
            window.alert('Browser does not support WebAudio');
        this.context = new window.AudioContext();
        if (window.webAudioControlsWidgetManager) {
            window.webAudioControlsWidgetManager.addMidiListener((event) => this.onKeyboard(event));
        }
        else {
            console.log('webaudio-controls not found, add to a <script> tag.');
        }
        if (options.loader) {
            this.loader = options.loader;
        }
        else {
            this.loader = new fileLoader_1.default();
        }
        // Use shared loader
        // parseSetLoader(this.loader);
        if (options.root)
            this.loader.setRoot(options.root);
        if (options.file) {
            const file = this.loader.addFile(options.file);
            this.showFile(file);
        }
        if (options.preload)
            this.preload = options.preload;
    }
    showFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.dispatchEvent('preload', {
                status: `Loading sfz files`,
            });
            this.dispatchEvent('loading', true);
            file = yield this.loader.getFile(file);
            if (!file)
                return;
            console.log('showFile', file);
            const prefix = (0, utils_1.pathGetDirectory)(file.path);
            console.log('prefix', prefix);
            let headers = [];
            if (file.ext === 'sfz') {
                headers = yield (0, parse_1.parseSfz)(file === null || file === void 0 ? void 0 : file.contents, prefix);
                console.log('headers', headers);
            }
            else if (file.ext === 'json') {
                headers = JSON.parse(file === null || file === void 0 ? void 0 : file.contents).elements;
            }
            this.regions = (0, parse_1.parseHeaders)(headers, prefix);
            console.log('regions', this.regions);
            console.log('preload', this.preload);
            if (this.preload === player_1.AudioPreload.SEQUENTIAL) {
                yield this.preloadFiles(this.regions);
            }
            else {
                this.dispatchEvent('keyboardMap', this.getKeyboardMap(this.regions));
            }
            this.dispatchEvent('loading', false);
        });
    }
    getKeyboardMap(regions) {
        const keyboardMap = {};
        regions.forEach((region) => {
            this.updateKeyboardMap(region, keyboardMap);
        });
        return keyboardMap;
    }
    updateKeyboardMap(region, keyboardMap) {
        if (!region.lokey && region.key)
            region.lokey = region.key;
        if (!region.hikey && region.key)
            region.hikey = region.key;
        const merged = Object.assign({}, this.regionDefaults, region);
        for (let i = merged.lokey; i <= merged.hikey; i += 1) {
            keyboardMap[i] = true;
        }
    }
    preloadFiles(regions) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyboardMap = {};
            this.dispatchEvent('keyboardMap', keyboardMap);
            let start = 0;
            const end = Object.keys(regions).length - 1;
            for (const key in regions) {
                this.dispatchEvent('preload', {
                    status: `Loading audio files: ${start} of ${end}`,
                });
                const samplePath = regions[key].sample;
                if (!samplePath || samplePath.includes('*'))
                    continue;
                yield this.loader.getFile(samplePath, true);
                start += 1;
                this.updateKeyboardMap(regions[key], keyboardMap);
                this.dispatchEvent('keyboardMap', keyboardMap);
            }
        });
    }
    checkRegion(region, controlEvent, rand) {
        return (region.sample != null &&
            region.lochan <= controlEvent.channel &&
            region.hichan >= controlEvent.channel &&
            region.lokey <= controlEvent.note &&
            region.hikey >= controlEvent.note &&
            region.lovel <= controlEvent.velocity &&
            region.hivel >= controlEvent.velocity &&
            region.lobend <= this.bend &&
            region.hibend >= this.bend &&
            region.lochanaft <= this.chanaft &&
            region.hichanaft >= this.chanaft &&
            region.lopolyaft <= this.polyaft &&
            region.hipolyaft >= this.polyaft &&
            region.lorand <= rand &&
            region.hirand >= rand &&
            region.lobpm <= this.bpm &&
            region.hibpm >= this.bpm);
    }
    checkRegions(regions, controlEvent) {
        const random = Math.random();
        return regions.filter((region) => {
            if (!region.lokey && region.key)
                region.lokey = region.key;
            if (!region.hikey && region.key)
                region.hikey = region.key;
            const merged = Object.assign({}, this.regionDefaults, region);
            return this.checkRegion(merged, controlEvent, random);
        });
    }
    onKeyboard(event) {
        const controlEvent = {
            channel: 1,
            note: event.data[1],
            velocity: event.data[0] === 128 ? 0 : event.data[2],
        };
        this.update(controlEvent);
        this.dispatchEvent('change', controlEvent);
    }
    update(event) {
        return __awaiter(this, void 0, void 0, function* () {
            // prototype using samples
            if (event.velocity === 0) {
                return;
            }
            console.log('event', event);
            const regionsFiltered = this.checkRegions(this.regions, event);
            console.log('regionsFiltered', regionsFiltered);
            if (!regionsFiltered.length)
                return;
            const randomSample = Math.floor(Math.random() * regionsFiltered.length);
            const keySample = regionsFiltered[randomSample];
            console.log('keySample', keySample);
            const fileRef = this.loader.files[keySample.sample];
            const newFile = yield this.loader.getFile(fileRef || keySample.sample, true);
            const sample = new Sample_1.default(this.context, newFile === null || newFile === void 0 ? void 0 : newFile.contents, keySample);
            sample.setPlaybackRate(event);
            sample.play();
        });
    }
    reset() {
        // this.sampler.stop();
        // this.keys = [];
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
        super('editor');
        if (!window.ace) {
            console.log('Ace editor not found, add to a <script> tag.');
        }
        this.fileEl = document.createElement('div');
        this.fileEl.className = 'fileList';
        this.getEl().appendChild(this.fileEl);
        this.aceEl = document.createElement('div');
        this.aceEl.className = 'ace';
        if (window.ace) {
            this.ace = window.ace.edit(this.aceEl, {
                theme: 'ace/theme/monokai',
            });
        }
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
            if (file.ext === 'sfz') {
                const SfzMode = (__webpack_require__(/*! ../lib/mode-sfz */ "./src/lib/mode-sfz.js").Mode);
                this.ace.session.setMode(new SfzMode());
            }
            else {
                const modelist = window.ace.require('ace/ext/modelist');
                if (!modelist) {
                    window.alert('Ace modelist not found, add to a <script> tag.');
                }
                const mode = modelist.getModeForPath(file.path).mode;
                this.ace.session.setMode(mode);
            }
            this.ace.setOption('value', file.contents);
        });
    }
    createTree(root, files, filesTree) {
        const ul = document.createElement('ul');
        for (const key in filesTree) {
            let filePath = root + '/' + key;
            if (filePath.startsWith('/'))
                filePath = filePath.slice(1);
            const li = document.createElement('li');
            if (Object.keys(filesTree[key]).length > 0) {
                const details = document.createElement('details');
                const summary = document.createElement('summary');
                summary.innerHTML = key;
                details.appendChild(summary);
                details.appendChild(this.createTree(filePath, files, filesTree[key]));
                li.appendChild(details);
            }
            else {
                li.innerHTML = key;
                li.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
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
        const ul = this.createTree('', this.loader.files, this.loader.filesTree);
        ul.className = 'tree';
        this.fileEl.appendChild(ul);
    }
    reset() {
        this.fileEl.replaceChildren();
        this.ace.setOption('value', '');
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
        super('interface');
        this.width = 775;
        this.height = 330;
        this.keyboardMap = {};
        this.instrument = {};
        this.tabs = document.createElement('div');
        this.tabs.className = 'tabs';
        this.addTab('Info');
        this.addTab('Controls');
        this.getEl().appendChild(this.tabs);
        this.addKeyboard();
        this.loadingScreen = document.createElement('div');
        this.loadingScreen.className = 'loadingScreen';
        this.getEl().appendChild(this.loadingScreen);
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
        else {
            this.reset();
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
        return Math.min(Number(val1) / val2, 1) * 100 + '%';
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
            const img = document.createElement('img');
            img.setAttribute('draggable', 'false');
            img.setAttribute('style', `left: ${relative.left}; top: ${relative.top}; width: ${relative.width}; height: ${relative.height};`);
            yield this.addImageAtr(img, 'src', image.image);
            return img;
        });
    }
    addImageAtr(img, attribute, path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loader.root.startsWith('http')) {
                img.setAttribute(attribute, this.loader.root + 'GUI/' + path);
            }
            else {
                const file = this.loader.files['GUI/' + path];
                if (file && 'handle' in file) {
                    img.setAttribute(attribute, URL.createObjectURL(file.handle));
                }
            }
        });
    }
    addControl(type, element) {
        const relative = this.toRelative(element);
        const el = document.createElement(`webaudio-${type}`);
        if ('image' in element)
            this.addImageAtr(el, 'src', element.image);
        if ('image_bg' in element)
            this.addImageAtr(el, 'src', element.image_bg);
        if ('image_handle' in element)
            this.addImageAtr(el, 'knobsrc', element.image_handle);
        if ('frames' in element) {
            el.setAttribute('value', '0');
            el.setAttribute('max', Number(element.frames) - 1);
            el.setAttribute('step', '1');
            el.setAttribute('sprites', Number(element.frames) - 1);
            el.setAttribute('tooltip', '%d');
        }
        if ('orientation' in element) {
            const dir = element.orientation === 'vertical' ? 'vert' : 'horz';
            el.setAttribute('direction', dir);
        }
        if ('x' in element) {
            el.setAttribute('style', `left: ${relative.left}; top: ${relative.top};`);
        }
        if ('w' in element) {
            el.setAttribute('height', element.h);
            el.setAttribute('width', element.w);
        }
        return el;
    }
    addKeyboard() {
        const keyboard = document.createElement('webaudio-keyboard');
        keyboard.setAttribute('keys', '88');
        keyboard.setAttribute('height', '70');
        keyboard.setAttribute('width', '775');
        keyboard.addEventListener('change', (event) => {
            const controlEvent = {
                channel: 1,
                note: event.note[1],
                velocity: event.note[0] ? 100 : 0,
            };
            this.dispatchEvent('change', controlEvent);
        });
        this.getEl().appendChild(keyboard);
        this.keyboard = keyboard;
        window.addEventListener('resize', () => this.resizeKeyboard());
        window.setTimeout(() => this.resizeKeyboard());
    }
    resizeKeyboard() {
        const keyboardMapKeys = Object.keys(this.keyboardMap);
        const keyStart = Number(keyboardMapKeys[0]);
        const keyEnd = Number(keyboardMapKeys[keyboardMapKeys.length - 1]);
        const keysFit = Math.floor(this.getEl().clientWidth / 13);
        const keysRange = keyEnd - keyStart;
        const keysDiff = Math.floor(keysFit / 2 - keysRange / 2);
        this.keyboard.min = Math.max(keyStart - keysDiff, 0);
        this.keyboard.keys = keysFit;
        this.keyboard.width = this.getEl().clientWidth;
        for (let i = 0; i < 200; i += 1) {
            this.keyboard.setdisabledvalues(!this.keyboardMap[i], Number(i));
        }
        this.keyboard.redraw();
    }
    setKeyboard(event) {
        this.keyboard.setNote(event.velocity, event.note);
    }
    setLoadingState(loading) {
        if (loading)
            this.getEl().classList.add('loading');
        else
            this.getEl().classList.remove('loading');
    }
    setKeyboardMap(map) {
        this.keyboardMap = map;
        this.resizeKeyboard();
    }
    setLoadingText(text) {
        this.loadingScreen.innerHTML = text;
    }
    addTab(name) {
        const input = document.createElement('input');
        input.className = 'radiotab';
        if (name === 'Info')
            input.setAttribute('checked', 'checked');
        input.type = 'radio';
        input.id = name.toLowerCase();
        input.name = 'tabs';
        this.tabs.appendChild(input);
        const label = document.createElement('label');
        label.className = 'label';
        label.setAttribute('for', name.toLowerCase());
        label.innerHTML = name;
        this.tabs.appendChild(label);
        const div = document.createElement('div');
        div.className = 'panel';
        this.tabs.appendChild(div);
    }
    addText(text) {
        const relative = this.toRelative(text);
        const span = document.createElement('span');
        span.setAttribute('style', `left: ${relative.left}; top: ${relative.top}; width: ${relative.width}; height: ${relative.height}; color: ${text.color_text};`);
        span.innerHTML = text.text;
        return span;
    }
    parseXML(file) {
        if (!file)
            return {};
        const fileParsed = (0, xml_js_1.xml2js)(file.contents);
        return this.findElements({}, fileParsed.elements);
    }
    reset(title) {
        const panels = this.tabs.getElementsByClassName('panel');
        for (const panel of panels) {
            panel.replaceChildren();
        }
        const info = this.tabs.getElementsByClassName('panel')[0];
        const span = document.createElement('span');
        span.className = 'default-title';
        span.innerHTML = title || 'sfz instrument';
        info.appendChild(span);
    }
    setupInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.instrument.AriaGUI)
                return;
            const info = this.tabs.getElementsByClassName('panel')[0];
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
            const controls = this.tabs.getElementsByClassName('panel')[1];
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
            window.addEventListener('resize', () => this.resizeControls());
            window.setTimeout(() => this.resizeControls());
        });
    }
    resizeControls() {
        const width = Math.floor(this.getEl().clientWidth / 25);
        const sliderWidth = Math.floor(this.getEl().clientWidth / 65);
        const sliderHeight = Math.floor(this.getEl().clientHeight / 3.5);
        const controls = this.tabs.getElementsByClassName('panel')[1];
        controls.childNodes.forEach((control) => {
            if (control.nodeName === 'WEBAUDIO-KNOB' || control.nodeName === 'WEBAUDIO-SWITCH') {
                control.width = control.height = width;
            }
            else if (control.nodeName === 'WEBAUDIO-SLIDER') {
                control.width = sliderWidth;
                control.height = sliderHeight;
            }
        });
    }
    findElements(list, nodes) {
        nodes.forEach((node) => {
            if (node.type === 'element') {
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
const fileLoader_1 = __webpack_require__(/*! ../utils/fileLoader */ "./src/utils/fileLoader.ts");
const Audio_1 = __webpack_require__(/*! ./Audio */ "./src/components/Audio.ts");
const utils_1 = __webpack_require__(/*! @sfz-tools/core/dist/utils */ "./node_modules/@sfz-tools/core/dist/utils.js");
const api_1 = __webpack_require__(/*! @sfz-tools/core/dist/api */ "./node_modules/@sfz-tools/core/dist/api.js");
class Player extends component_1.default {
    constructor(id, options) {
        var _a;
        super('player');
        this.loader = new fileLoader_1.default();
        if (options.audio)
            this.setupAudio(options.audio);
        if (options.header)
            this.setupHeader(options.header);
        if (options.interface)
            this.setupInterface(options.interface);
        if (options.editor)
            this.setupEditor(options.editor);
        (_a = document.getElementById(id)) === null || _a === void 0 ? void 0 : _a.appendChild(this.getEl());
        if (options.instrument) {
            this.loadRemoteInstrument(options.instrument);
        }
    }
    setupAudio(options) {
        options.loader = this.loader;
        this.audio = new Audio_1.default(options);
        this.audio.addEvent('change', (event) => {
            if (this.interface)
                this.interface.setKeyboard(event.data);
        });
        this.audio.addEvent('keyboardMap', (event) => {
            if (this.interface)
                this.interface.setKeyboardMap(event.data);
        });
        this.audio.addEvent('preload', (event) => {
            if (this.interface)
                this.interface.setLoadingText(event.data.status);
        });
        this.audio.addEvent('loading', (event) => {
            if (this.interface)
                this.interface.setLoadingState(event.data);
        });
    }
    setupInterface(options) {
        options.loader = this.loader;
        this.interface = new Interface_1.default(options);
        this.interface.addEvent('change', (event) => {
            if (this.audio)
                this.audio.update(event.data);
        });
        this.getEl().appendChild(this.interface.getEl());
        this.interface.setLoadingState(true);
    }
    setupEditor(options) {
        options.loader = this.loader;
        this.editor = new Editor_1.default(options);
        this.getEl().appendChild(this.editor.getEl());
    }
    setupHeader(options) {
        const div = document.createElement('div');
        div.className = 'header';
        if (options.local) {
            const inputLocal = document.createElement('input');
            inputLocal.type = 'button';
            inputLocal.value = 'Local directory';
            inputLocal.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                yield this.loadLocalInstrument();
            }));
            div.appendChild(inputLocal);
        }
        if (options.remote) {
            const inputRemote = document.createElement('input');
            inputRemote.type = 'button';
            inputRemote.value = 'Remote directory';
            inputRemote.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                const id = window.prompt('Enter a GitHub owner/repo', 'studiorack/black-and-green-guitars');
                if (id)
                    yield this.loadRemoteInstrument({
                        branch: 'compact',
                        id,
                        name: 'Custom',
                    });
            }));
            div.appendChild(inputRemote);
        }
        if (options.presets) {
            const inputPresets = document.createElement('select');
            options.presets.forEach((preset) => {
                const inputOption = document.createElement('option');
                inputOption.innerHTML = preset.name;
                if (preset.selected)
                    inputOption.selected = true;
                inputPresets.appendChild(inputOption);
            });
            inputPresets.addEventListener('change', (e) => __awaiter(this, void 0, void 0, function* () {
                const preset = options.presets[inputPresets.selectedIndex];
                yield this.loadRemoteInstrument(preset);
            }));
            div.appendChild(inputPresets);
        }
        this.getEl().appendChild(div);
    }
    loadLocalInstrument() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blobs = (yield (0, browser_fs_access_1.directoryOpen)({
                    recursive: true,
                }));
                console.log(`${blobs.length} files selected.`);
                this.loadDirectory((0, utils_1.pathGetRoot)(blobs[0].webkitRelativePath), blobs);
            }
            catch (err) {
                if (err.name !== 'AbortError') {
                    return console.error(err);
                }
                console.log('The user aborted a request.');
            }
        });
    }
    loadRemoteInstrument(preset) {
        return __awaiter(this, void 0, void 0, function* () {
            const branch = preset.branch || 'compact';
            const response = yield (0, api_1.apiJson)(`https://api.github.com/repos/${preset.id}/git/trees/${branch}?recursive=1`);
            const paths = response.tree.map((file) => `https://raw.githubusercontent.com/${preset.id}/${branch}/${file.path}`);
            yield this.loadDirectory(`https://raw.githubusercontent.com/${preset.id}/${branch}/`, paths);
        });
    }
    loadDirectory(root, files) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let audioFile;
            let audioFileDepth = 1000;
            let audioFileJson;
            let audioFileJsonDepth = 1000;
            let interfaceFile;
            let interfaceFileDepth = 1000;
            for (const file of files) {
                const path = typeof file === 'string' ? file : file.webkitRelativePath;
                const depth = ((_a = path.match(/\//g)) === null || _a === void 0 ? void 0 : _a.length) || 0;
                if ((0, utils_1.pathGetExt)(path) === 'sfz' && depth < audioFileDepth) {
                    audioFile = file;
                    audioFileDepth = depth;
                }
                if (path.endsWith('.sfz.json') && depth < audioFileJsonDepth) {
                    audioFileJson = file;
                    audioFileJsonDepth = depth;
                }
                if ((0, utils_1.pathGetExt)(path) === 'xml' && depth < interfaceFileDepth) {
                    interfaceFile = file;
                    interfaceFileDepth = depth;
                }
            }
            console.log('audioFile', audioFile);
            console.log('audioFileJson', audioFileJson);
            console.log('interfaceFile', interfaceFile);
            this.loader.resetFiles();
            this.loader.setRoot(root);
            this.loader.addDirectory(files);
            if (this.interface) {
                if (interfaceFile) {
                    const file = this.interface.loader.addFile(interfaceFile);
                    yield this.interface.showFile(file);
                    this.interface.render();
                }
                else {
                    this.interface.reset();
                }
            }
            if (this.editor) {
                const defaultFile = audioFile || interfaceFile;
                if (defaultFile) {
                    const file = this.editor.loader.addFile(defaultFile);
                    yield this.editor.showFile(file);
                    this.editor.render();
                }
                else {
                    this.editor.reset();
                }
            }
            if (this.audio) {
                const audioFilePriority = audioFileJson || audioFile;
                if (audioFilePriority) {
                    const file = this.audio.loader.addFile(audioFilePriority);
                    yield this.audio.showFile(file);
                }
                else {
                    this.audio.reset();
                }
            }
        });
    }
}
exports["default"] = Player;


/***/ }),

/***/ "./src/components/Sample.ts":
/*!**********************************!*\
  !*** ./src/components/Sample.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
class Sample {
    constructor(context, buffer, region) {
        this.sampleRate = 48000;
        this.sampleDefaults = {
            bend_down: -200,
            bend_up: 200,
            pitch_keycenter: 0,
            pitch_keytrack: 0,
            tune: 0,
            transpose: 0,
            velocity: 0,
            veltrack: 0,
        };
        this.context = context;
        this.region = Object.assign({}, this.sampleDefaults, region);
        this.source = this.context.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.context.destination);
    }
    getCents(note, bend) {
        const pitch = (note - this.region.pitch_keycenter) * this.region.pitch_keytrack + this.region.tune;
        let cents = pitch + (this.region.veltrack * this.region.velocity) / 127;
        if (bend < 0) {
            cents += (-8192 * bend) / this.region.bend_down;
        }
        else {
            cents += (8192 * bend) / this.region.bend_up;
        }
        return Math.pow(Math.pow(2, 1 / 1200), cents);
    }
    pitchToFreq(pitch) {
        return Math.pow(2, (pitch - 69) / 12.0) * 440;
    }
    setPlaybackRate(event, bend = 0) {
        if (!this.region.pitch_keycenter)
            this.region.pitch_keycenter = event.note;
        const cents = this.getCents(event.note, bend);
        const frequency = this.pitchToFreq(event.note + this.region.transpose) * cents;
        const rate = frequency / this.pitchToFreq(this.region.pitch_keycenter);
        console.log('playbackRate', rate);
        this.source.playbackRate.value = rate;
    }
    play() {
        if (this.region.offset && this.region.end) {
            const offset = Number(this.region.offset) / this.sampleRate;
            const end = Number(this.region.end) / this.sampleRate;
            const duration = end - offset;
            this.source.start(0, offset, duration);
        }
        else {
            this.source.start(0);
        }
    }
    stop() {
        this.source.stop();
    }
}
exports["default"] = Sample;


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
        this.el = document.createElement('div');
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

/***/ "./src/types/player.ts":
/*!*****************************!*\
  !*** ./src/types/player.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AudioPreload = void 0;
var AudioPreload;
(function (AudioPreload) {
    // No preloading, samples is loaded when key is pressed.
    AudioPreload["ON_DEMAND"] = "on-demand";
    // Loop through each key, and preload one sample for each key.
    AudioPreload["PROGRESSIVE"] = "progressive";
    // Loop through order of the file, and preload each sample.
    AudioPreload["SEQUENTIAL"] = "sequential";
})(AudioPreload || (AudioPreload = {}));
exports.AudioPreload = AudioPreload;


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
const fs_1 = __webpack_require__(/*! fs */ "?7a2c");
const api_1 = __webpack_require__(/*! @sfz-tools/core/dist/api */ "./node_modules/@sfz-tools/core/dist/api.js");
const utils_1 = __webpack_require__(/*! @sfz-tools/core/dist/utils */ "./node_modules/@sfz-tools/core/dist/utils.js");
class FileLoader {
    constructor() {
        this.files = {};
        this.filesTree = {};
        this.root = '';
        if (window.AudioContext) {
            this.audio = new window.AudioContext();
        }
    }
    addDirectory(files) {
        files.forEach((file) => this.addFile(file));
    }
    addFile(file) {
        const path = decodeURI(typeof file === 'string' ? file : file.webkitRelativePath);
        if (path === this.root)
            return;
        const fileKey = (0, utils_1.pathGetSubDirectory)(path, this.root);
        if (typeof file === 'string') {
            this.files[fileKey] = {
                ext: (0, utils_1.pathGetExt)(file),
                contents: null,
                path,
            };
        }
        else {
            this.files[fileKey] = {
                ext: (0, utils_1.pathGetExt)(file.webkitRelativePath),
                contents: null,
                path,
                handle: file,
            };
        }
        this.addToFileTree(fileKey);
        return this.files[fileKey];
    }
    addFileContents(file, contents) {
        const path = decodeURI(file);
        const fileKey = (0, utils_1.pathGetSubDirectory)(path, this.root);
        this.files[fileKey] = {
            ext: (0, utils_1.pathGetExt)(path),
            contents,
            path,
        };
        return this.files[fileKey];
    }
    addFilesContents(directory, filenames) {
        filenames.forEach((filename) => {
            this.addFileContents(directory + filename, (0, fs_1.readFileSync)(directory + filename).toString());
        });
    }
    addToFileTree(key) {
        key.split('/').reduce((o, k) => (o[k] = o[k] || {}), this.filesTree);
    }
    loadFileLocal(file, buffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file.handle)
                return file;
            if (buffer === true) {
                const arrayBuffer = yield file.handle.arrayBuffer();
                if (this.audio && arrayBuffer) {
                    file.contents = yield this.audio.decodeAudioData(arrayBuffer);
                }
            }
            else {
                file.contents = yield file.handle.text();
            }
            return file;
        });
    }
    loadFileRemote(file, buffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (buffer === true) {
                const arrayBuffer = yield (0, api_1.apiArrayBuffer)((0, utils_1.encodeHashes)(file.path));
                if (this.audio) {
                    file.contents = yield this.audio.decodeAudioData(arrayBuffer);
                }
            }
            else {
                file.contents = yield (0, api_1.apiText)((0, utils_1.encodeHashes)(file.path));
            }
            return file;
        });
    }
    getFile(file, buffer = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!file)
                return;
            if (typeof file === 'string') {
                if ((0, utils_1.pathGetExt)(file).length === 0)
                    return;
                const fileKey = (0, utils_1.pathGetSubDirectory)(file, this.root);
                let fileRef = this.files[fileKey];
                if (!fileRef)
                    fileRef = this.addFile(file);
                if (fileRef === null || fileRef === void 0 ? void 0 : fileRef.contents)
                    return fileRef;
                if (file.startsWith('http'))
                    return yield this.loadFileRemote(fileRef, buffer);
                return yield this.loadFileLocal(fileRef, buffer);
            }
            if (file.contents)
                return file;
            if ('handle' in file)
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

/***/ "?7a2c":
/*!********************!*\
  !*** fs (ignored) ***!
  \********************/
/***/ (() => {

/* (ignored) */

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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixZQUFZO0FBQzlCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQSx3Q0FBd0MsU0FBUztBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0IsaUJBQWlCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxpQkFBaUI7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixTQUFTO0FBQzNCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsU0FBUztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQsRUFBRTtBQUNuRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCLFNBQVM7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QixlQUFlO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLHlCQUF5QixRQUFRO0FBQ2pDO0FBQ0Esc0JBQXNCLGVBQWU7QUFDckM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWMsWUFBWTtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUEsc0JBQXNCLFNBQVM7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBLHNCQUFzQixTQUFTO0FBQy9CO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7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O0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsZ0hBQXVDO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qjs7QUFFN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWCxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELE9BQU87QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUTtBQUNSO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlELG1CQUFtQjtBQUNwRSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxVQUFVO0FBQ1Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVk7QUFDWjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0EsWUFBWTtBQUNaO0FBQ0EsWUFBWTtBQUNaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTs7QUFFTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLFlBQVksT0FBTyxzQkFBc0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsUUFBUTtBQUNSO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxDQUFDLEVBQUUsTUFBOEIsR0FBRyxDQUFhLENBQUM7Ozs7Ozs7Ozs7O0FDNWhEbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxjQUFjLG1CQUFPLENBQUMsMERBQVM7O0FBRS9CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7Ozs7QUNsSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFYTs7QUFFYjs7QUFFQSxhQUFhLHNGQUE2QjtBQUMxQzs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkIsc0NBQXNDLHNDQUFzQztBQUN6RztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDdFNBLE1BQWtHO0FBQ2xHLE1BQXdGO0FBQ3hGLE1BQStGO0FBQy9GLE1BQWtIO0FBQ2xILE1BQTJHO0FBQzNHLE1BQTJHO0FBQzNHLE1BQW1KO0FBQ25KO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsNkhBQU87Ozs7QUFJNkY7QUFDckgsT0FBTyxpRUFBZSw2SEFBTyxJQUFJLG9JQUFjLEdBQUcsb0lBQWMsWUFBWSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6QjdFLE1BQWtHO0FBQ2xHLE1BQXdGO0FBQ3hGLE1BQStGO0FBQy9GLE1BQWtIO0FBQ2xILE1BQTJHO0FBQzNHLE1BQTJHO0FBQzNHLE1BQXNKO0FBQ3RKO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsZ0lBQU87Ozs7QUFJZ0c7QUFDeEgsT0FBTyxpRUFBZSxnSUFBTyxJQUFJLHVJQUFjLEdBQUcsdUlBQWMsWUFBWSxFQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN6QjdFLE1BQWtHO0FBQ2xHLE1BQXdGO0FBQ3hGLE1BQStGO0FBQy9GLE1BQWtIO0FBQ2xILE1BQTJHO0FBQzNHLE1BQTJHO0FBQzNHLE1BQW1KO0FBQ25KO0FBQ0E7O0FBRUE7O0FBRUEsNEJBQTRCLHFHQUFtQjtBQUMvQyx3QkFBd0Isa0hBQWE7O0FBRXJDLHVCQUF1Qix1R0FBYTtBQUNwQztBQUNBLGlCQUFpQiwrRkFBTTtBQUN2Qiw2QkFBNkIsc0dBQWtCOztBQUUvQyxhQUFhLDBHQUFHLENBQUMsNkhBQU87Ozs7QUFJNkY7QUFDckgsT0FBTyxpRUFBZSw2SEFBTyxJQUFJLG9JQUFjLEdBQUcsb0lBQWMsWUFBWSxFQUFDOzs7Ozs7Ozs7Ozs7QUMxQmhFOztBQUViOztBQUVBO0FBQ0E7O0FBRUEsa0JBQWtCLHdCQUF3QjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLGtCQUFrQixpQkFBaUI7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9CQUFvQiw0QkFBNEI7QUFDaEQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEscUJBQXFCLDZCQUE2QjtBQUNsRDs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7O0FDdkdhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUN0Q2E7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7O0FDVmE7O0FBRWI7QUFDQTtBQUNBLGNBQWMsS0FBd0MsR0FBRyxzQkFBaUIsR0FBRyxDQUFJOztBQUVqRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNYYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0Q7QUFDbEQ7O0FBRUE7QUFDQSwwQ0FBMEM7QUFDMUM7O0FBRUE7O0FBRUE7QUFDQSxpRkFBaUY7QUFDakY7O0FBRUE7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7O0FBRUE7QUFDQSx5REFBeUQ7QUFDekQsSUFBSTs7QUFFSjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ3JFYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7OztBQ2ZhO0FBQ2I7QUFDQSw0QkFBNEIsK0RBQStELGlCQUFpQjtBQUM1RztBQUNBLG9DQUFvQyxNQUFNLCtCQUErQixZQUFZO0FBQ3JGLG1DQUFtQyxNQUFNLG1DQUFtQyxZQUFZO0FBQ3hGLGdDQUFnQztBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBLDhDQUE2QyxFQUFFLGFBQWEsRUFBQztBQUM3RCxpQkFBaUIsbUJBQU8sQ0FBQyw4Q0FBaUI7QUFDMUMsZ0JBQWdCLG1CQUFPLENBQUMsMENBQVM7QUFDakMscUJBQXFCLG1CQUFPLENBQUMsc0RBQXFCO0FBQ2xELGlCQUFpQixtQkFBTyxDQUFDLDRDQUFVO0FBQ25DLGdCQUFnQixtQkFBTyxDQUFDLGdGQUE0QjtBQUNwRCxnQkFBZ0IsbUJBQU8sQ0FBQyxnRkFBNEI7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsbUNBQW1DLG1CQUFtQjtBQUN0RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9ELE9BQU8sS0FBSyxJQUFJO0FBQ3BFLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsMENBQTBDLElBQUk7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSwyQ0FBMkMsSUFBSTtBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EsbUNBQW1DLElBQUk7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxzQ0FBc0MsSUFBSTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0EscUNBQXFDLElBQUk7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxpQ0FBaUMsSUFBSTtBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsSUFBSSxrQkFBa0IsSUFBSSxtQkFBbUIsSUFBSSxtQkFBbUIsSUFBSTtBQUN2RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxzQ0FBc0MsSUFBSTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxJQUFJO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxJQUFJO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0Esa0VBQWtFLElBQUk7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1R0FBdUcsSUFBSTtBQUMzRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLDRDQUE0QyxJQUFJO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsSUFBSTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsOERBQThELElBQUk7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLElBQUk7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLDhCQUE4QixJQUFJO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsSUFBSTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLGtDQUFrQyxJQUFJO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFD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TztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXO0FBQ1g7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVEQUF1RCxJQUFJLFFBQVEsRUFBRTtBQUNyRSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsdURBQXVELElBQUksUUFBUSxFQUFFO0FBQ3JFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELElBQUk7QUFDNUQsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRCxJQUFJO0FBQ3ZELE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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SUFBSSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ3RFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUMsSUFBSSxZQUFZLEVBQUUsYUFBYSxFQUFFO0FBQ3BFLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQyxJQUFJLFlBQVksRUFBRTtBQUM1RCxPQUFPO0FBQ1A7QUFDQTtBQUNBLDZDQUE2QyxJQUFJLFlBQVksRUFBRTtBQUMvRCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7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QUE0Qix1QkFBdUIsZUFBZSxJQUFJLDhCQUE4QixVQUFVLEVBQUUsR0FBRyxxQ0FBcUMscUNBQXFDLE9BQU8sRUFBRSw4R0FBOEcsYUFBYSwwQkFBMEIsNkNBQTZDLHVDQUF1QyxvREFBb0QsaUJBQWlCLElBQUksMEJBQWtPOzs7Ozs7O1VDQW4zTDtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTs7Ozs7Ozs7Ozs7O0FDQWE7QUFDYiw4Q0FBNkMsRUFBRSxhQUFhLEVBQUM7QUFDN0QsY0FBYyxHQUFHLGlCQUFpQixHQUFHLGNBQWM7QUFDbkQsaUJBQWlCLG1CQUFPLENBQUMsdURBQXFCO0FBQzlDLGNBQWM7QUFDZCxvQkFBb0IsbUJBQU8sQ0FBQyw2REFBd0I7QUFDcEQsaUJBQWlCO0FBQ2pCLGlCQUFpQixtQkFBTyxDQUFDLHVEQUFxQjtBQUM5QyxjQUFjIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vU2Z6L3dlYnBhY2svdW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbiIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvQHNmei10b29scy9jb3JlL2Rpc3QvYXBpLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9Ac2Z6LXRvb2xzL2NvcmUvZGlzdC9wYXJzZS5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvQHNmei10b29scy9jb3JlL2Rpc3QvdHlwZXMvcGFyc2UuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL0BzZnotdG9vbHMvY29yZS9kaXN0L3V0aWxzLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvaW5kZXguanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9FZGl0b3Iuc2NzcyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9JbnRlcmZhY2Uuc2NzcyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuc2NzcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9lbWl0dGVyLWNvbXBvbmVudC9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvbm9kZS1mZXRjaC9icm93c2VyLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9zYWZlLWJ1ZmZlci9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc2F4L2xpYi9zYXguanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3N0cmVhbS9pbmRleC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc3RyaW5nX2RlY29kZXIvbGliL3N0cmluZ19kZWNvZGVyLmpzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL0VkaXRvci5zY3NzPzNjOTciLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvSW50ZXJmYWNlLnNjc3M/ZjYzYyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuc2Nzcz81OThhIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvQXVkaW8udHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvRWRpdG9yLnRzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL0ludGVyZmFjZS50cyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2NvbXBvbmVudHMvU2FtcGxlLnRzIiwid2VicGFjazovL1Nmei8uL3NyYy9jb21wb25lbnRzL2NvbXBvbmVudC50cyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvY29tcG9uZW50cy9ldmVudC50cyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvdHlwZXMvaW50ZXJmYWNlLnRzIiwid2VicGFjazovL1Nmei8uL3NyYy90eXBlcy9wbGF5ZXIudHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL3V0aWxzL2ZpbGVMb2FkZXIudHMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3htbC1qcy9saWIvYXJyYXktaGVscGVyLmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy94bWwtanMvbGliL2luZGV4LmpzIiwid2VicGFjazovL1Nmei8uL25vZGVfbW9kdWxlcy94bWwtanMvbGliL2pzMnhtbC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMveG1sLWpzL2xpYi9qc29uMnhtbC5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMveG1sLWpzL2xpYi9vcHRpb25zLWhlbHBlci5qcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMveG1sLWpzL2xpYi94bWwyanMuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vbm9kZV9tb2R1bGVzL3htbC1qcy9saWIveG1sMmpzb24uanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2xpYi9tb2RlLXNmei5qcyIsIndlYnBhY2s6Ly9TZnovLi9zcmMvbGliL3Nmel9mb2xkaW5nX21vZGUuanMiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2xpYi9zZnpfaGlnaGxpZ2h0X3J1bGVzLmpzIiwid2VicGFjazovL1Nmei9pZ25vcmVkfC9ob21lL3J1bm5lci93b3JrL3Nmei13ZWItcGxheWVyL3Nmei13ZWItcGxheWVyL3NyYy91dGlsc3xmcyIsIndlYnBhY2s6Ly9TZnovLi9ub2RlX21vZHVsZXMvYnJvd3Nlci1mcy1hY2Nlc3MvZGlzdC9pbmRleC5tb2Rlcm4uanMiLCJ3ZWJwYWNrOi8vU2Z6L3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL1Nmei93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9TZnovd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL1Nmei93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL1Nmei93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL1Nmei93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL1Nmei93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vU2Z6Ly4vc3JjL2luZGV4LnRzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtdLCBmYWN0b3J5KTtcblx0ZWxzZSBpZih0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcpXG5cdFx0ZXhwb3J0c1tcIlNmelwiXSA9IGZhY3RvcnkoKTtcblx0ZWxzZVxuXHRcdHJvb3RbXCJTZnpcIl0gPSBmYWN0b3J5KCk7XG59KSh0aGlzLCAoKSA9PiB7XG5yZXR1cm4gIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19pbXBvcnREZWZhdWx0ID0gKHRoaXMgJiYgdGhpcy5fX2ltcG9ydERlZmF1bHQpIHx8IGZ1bmN0aW9uIChtb2QpIHtcbiAgICByZXR1cm4gKG1vZCAmJiBtb2QuX19lc01vZHVsZSkgPyBtb2QgOiB7IFwiZGVmYXVsdFwiOiBtb2QgfTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLmFwaVRleHQgPSBleHBvcnRzLmFwaUpzb24gPSBleHBvcnRzLmFwaUJ1ZmZlciA9IGV4cG9ydHMuYXBpQXJyYXlCdWZmZXIgPSB2b2lkIDA7XG5jb25zdCBub2RlX2ZldGNoXzEgPSBfX2ltcG9ydERlZmF1bHQocmVxdWlyZShcIm5vZGUtZmV0Y2hcIikpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCIuL3V0aWxzXCIpO1xuYXN5bmMgZnVuY3Rpb24gYXBpQXJyYXlCdWZmZXIodXJsKSB7XG4gICAgKDAsIHV0aWxzXzEubG9nKSgn4qSTJywgdXJsKTtcbiAgICByZXR1cm4gKDAsIG5vZGVfZmV0Y2hfMS5kZWZhdWx0KSh1cmwpLnRoZW4oKHJlcykgPT4gcmVzLmFycmF5QnVmZmVyKCkpO1xufVxuZXhwb3J0cy5hcGlBcnJheUJ1ZmZlciA9IGFwaUFycmF5QnVmZmVyO1xuYXN5bmMgZnVuY3Rpb24gYXBpQnVmZmVyKHVybCkge1xuICAgICgwLCB1dGlsc18xLmxvZykoJ+KkkycsIHVybCk7XG4gICAgcmV0dXJuICgwLCBub2RlX2ZldGNoXzEuZGVmYXVsdCkodXJsKS50aGVuKChyZXMpID0+IHJlcy5idWZmZXIoKSk7XG59XG5leHBvcnRzLmFwaUJ1ZmZlciA9IGFwaUJ1ZmZlcjtcbmFzeW5jIGZ1bmN0aW9uIGFwaUpzb24odXJsKSB7XG4gICAgKDAsIHV0aWxzXzEubG9nKSgn4qSTJywgdXJsKTtcbiAgICByZXR1cm4gKDAsIG5vZGVfZmV0Y2hfMS5kZWZhdWx0KSh1cmwpLnRoZW4oKHJlcykgPT4gcmVzLmpzb24oKSk7XG59XG5leHBvcnRzLmFwaUpzb24gPSBhcGlKc29uO1xuYXN5bmMgZnVuY3Rpb24gYXBpVGV4dCh1cmwpIHtcbiAgICAoMCwgdXRpbHNfMS5sb2cpKCfipJMnLCB1cmwpO1xuICAgIHJldHVybiAoMCwgbm9kZV9mZXRjaF8xLmRlZmF1bHQpKHVybCkudGhlbigocmVzKSA9PiByZXMudGV4dCgpKTtcbn1cbmV4cG9ydHMuYXBpVGV4dCA9IGFwaVRleHQ7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hcGkuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBhcnNlVmFyaWFibGVzID0gZXhwb3J0cy5wYXJzZVNmeiA9IGV4cG9ydHMucGFyc2VTZXRMb2FkZXIgPSBleHBvcnRzLnBhcnNlU2VnbWVudCA9IGV4cG9ydHMucGFyc2VTYW5pdGl6ZSA9IGV4cG9ydHMucGFyc2VPcGNvZGVPYmplY3QgPSBleHBvcnRzLnBhcnNlTG9hZCA9IGV4cG9ydHMucGFyc2VJbmNsdWRlcyA9IGV4cG9ydHMucGFyc2VIZWFkZXJzID0gZXhwb3J0cy5wYXJzZUhlYWRlciA9IGV4cG9ydHMucGFyc2VEZWZpbmVzID0gdm9pZCAwO1xuY29uc3QgYXBpXzEgPSByZXF1aXJlKFwiLi9hcGlcIik7XG5jb25zdCBwYXJzZV8xID0gcmVxdWlyZShcIi4vdHlwZXMvcGFyc2VcIik7XG5jb25zdCB1dGlsc18xID0gcmVxdWlyZShcIi4vdXRpbHNcIik7XG5jb25zdCBERUJVRyA9IGZhbHNlO1xuY29uc3QgdmFyaWFibGVzID0ge307XG5sZXQgZmlsZVJlYWRTdHJpbmcgPSBhcGlfMS5hcGlUZXh0O1xuZnVuY3Rpb24gcGFyc2VEZWZpbmVzKGNvbnRlbnRzKSB7XG4gICAgY29uc3QgZGVmaW5lcyA9IGNvbnRlbnRzLm1hdGNoKC8oPzw9I2RlZmluZSApLisoPz1cXHJ8XFxuKS9nKTtcbiAgICBpZiAoIWRlZmluZXMpXG4gICAgICAgIHJldHVybiBjb250ZW50cztcbiAgICBmb3IgKGNvbnN0IGRlZmluZSBvZiBkZWZpbmVzKSB7XG4gICAgICAgIGlmIChERUJVRylcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlZmluZSk7XG4gICAgICAgIGNvbnN0IHZhbCA9IGRlZmluZS5zcGxpdCgnICcpO1xuICAgICAgICB2YXJpYWJsZXNbdmFsWzBdXSA9IHZhbFsxXTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnRzO1xufVxuZXhwb3J0cy5wYXJzZURlZmluZXMgPSBwYXJzZURlZmluZXM7XG5mdW5jdGlvbiBwYXJzZUhlYWRlcihpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC88fCB8Pi9nLCAnJyk7XG59XG5leHBvcnRzLnBhcnNlSGVhZGVyID0gcGFyc2VIZWFkZXI7XG5mdW5jdGlvbiBwYXJzZUhlYWRlcnMoaGVhZGVycywgcHJlZml4KSB7XG4gICAgY29uc3QgcmVnaW9ucyA9IFtdO1xuICAgIGxldCBkZWZhdWx0UGF0aCA9ICcnO1xuICAgIGxldCBnbG9iYWxPYmogPSB7fTtcbiAgICBsZXQgbWFzdGVyT2JqID0ge307XG4gICAgbGV0IGNvbnRyb2xPYmogPSB7fTtcbiAgICBsZXQgZ3JvdXBPYmogPSB7fTtcbiAgICBoZWFkZXJzLmZvckVhY2goKGhlYWRlcikgPT4ge1xuICAgICAgICBpZiAoaGVhZGVyLm5hbWUgPT09IHBhcnNlXzEuUGFyc2VIZWFkZXJOYW1lcy5nbG9iYWwpIHtcbiAgICAgICAgICAgIGdsb2JhbE9iaiA9IHBhcnNlT3Bjb2RlT2JqZWN0KGhlYWRlci5lbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaGVhZGVyLm5hbWUgPT09IHBhcnNlXzEuUGFyc2VIZWFkZXJOYW1lcy5tYXN0ZXIpIHtcbiAgICAgICAgICAgIG1hc3Rlck9iaiA9IHBhcnNlT3Bjb2RlT2JqZWN0KGhlYWRlci5lbGVtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoaGVhZGVyLm5hbWUgPT09IHBhcnNlXzEuUGFyc2VIZWFkZXJOYW1lcy5jb250cm9sKSB7XG4gICAgICAgICAgICBjb250cm9sT2JqID0gcGFyc2VPcGNvZGVPYmplY3QoaGVhZGVyLmVsZW1lbnRzKTtcbiAgICAgICAgICAgIGlmIChjb250cm9sT2JqLmRlZmF1bHRfcGF0aClcbiAgICAgICAgICAgICAgICBkZWZhdWx0UGF0aCA9IGNvbnRyb2xPYmouZGVmYXVsdF9wYXRoO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGhlYWRlci5uYW1lID09PSBwYXJzZV8xLlBhcnNlSGVhZGVyTmFtZXMuZ3JvdXApIHtcbiAgICAgICAgICAgIGdyb3VwT2JqID0gcGFyc2VPcGNvZGVPYmplY3QoaGVhZGVyLmVsZW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChoZWFkZXIubmFtZSA9PT0gcGFyc2VfMS5QYXJzZUhlYWRlck5hbWVzLnJlZ2lvbikge1xuICAgICAgICAgICAgY29uc3QgcmVnaW9uT2JqID0gcGFyc2VPcGNvZGVPYmplY3QoaGVhZGVyLmVsZW1lbnRzKTtcbiAgICAgICAgICAgIGNvbnN0IG1lcmdlZE9iaiA9IE9iamVjdC5hc3NpZ24oe30sIGdsb2JhbE9iaiwgbWFzdGVyT2JqLCBjb250cm9sT2JqLCBncm91cE9iaiwgcmVnaW9uT2JqKTtcbiAgICAgICAgICAgIGlmIChtZXJnZWRPYmouc2FtcGxlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHByZWZpeCAmJiAhbWVyZ2VkT2JqLnNhbXBsZS5zdGFydHNXaXRoKHByZWZpeCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkT2JqLnNhbXBsZSA9ICgwLCB1dGlsc18xLnBhdGhKb2luKShwcmVmaXgsIGRlZmF1bHRQYXRoLCBtZXJnZWRPYmouc2FtcGxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIW1lcmdlZE9iai5zYW1wbGUuc3RhcnRzV2l0aChkZWZhdWx0UGF0aCkpIHtcbiAgICAgICAgICAgICAgICAgICAgbWVyZ2VkT2JqLnNhbXBsZSA9ICgwLCB1dGlsc18xLnBhdGhKb2luKShkZWZhdWx0UGF0aCwgbWVyZ2VkT2JqLnNhbXBsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmVnaW9ucy5wdXNoKG1lcmdlZE9iaik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVnaW9ucztcbn1cbmV4cG9ydHMucGFyc2VIZWFkZXJzID0gcGFyc2VIZWFkZXJzO1xuYXN5bmMgZnVuY3Rpb24gcGFyc2VJbmNsdWRlcyhjb250ZW50cywgcHJlZml4ID0gJycpIHtcbiAgICBjb250ZW50cyA9IHBhcnNlRGVmaW5lcyhjb250ZW50cyk7XG4gICAgY29uc3QgaW5jbHVkZXMgPSBjb250ZW50cy5tYXRjaCgvI2luY2x1ZGUgXCIoLis/KVwiL2cpO1xuICAgIGlmICghaW5jbHVkZXMpXG4gICAgICAgIHJldHVybiBjb250ZW50cztcbiAgICBmb3IgKGNvbnN0IGluY2x1ZGUgb2YgaW5jbHVkZXMpIHtcbiAgICAgICAgY29uc3QgaW5jbHVkZVBhdGhzID0gaW5jbHVkZS5tYXRjaCgvKD88PVwiKSguKj8pKD89XCIpL2cpO1xuICAgICAgICBpZiAoIWluY2x1ZGVQYXRocylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAoaW5jbHVkZVBhdGhzWzBdLmluY2x1ZGVzKCckJykpXG4gICAgICAgICAgICBpbmNsdWRlUGF0aHNbMF0gPSBwYXJzZVZhcmlhYmxlcyhpbmNsdWRlUGF0aHNbMF0sIHZhcmlhYmxlcyk7XG4gICAgICAgIGNvbnN0IHN1YmNvbnRlbnQgPSBhd2FpdCBwYXJzZUxvYWQoaW5jbHVkZVBhdGhzWzBdLCBwcmVmaXgpO1xuICAgICAgICBjb25zdCBzdWJjb250ZW50RmxhdCA9IGF3YWl0IHBhcnNlSW5jbHVkZXMoc3ViY29udGVudCwgcHJlZml4KTtcbiAgICAgICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKGluY2x1ZGUsIHN1YmNvbnRlbnRGbGF0KTtcbiAgICB9XG4gICAgcmV0dXJuIGNvbnRlbnRzO1xufVxuZXhwb3J0cy5wYXJzZUluY2x1ZGVzID0gcGFyc2VJbmNsdWRlcztcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlTG9hZChpbmNsdWRlUGF0aCwgcHJlZml4KSB7XG4gICAgY29uc3QgcGF0aEpvaW5lZCA9ICgwLCB1dGlsc18xLnBhdGhKb2luKShwcmVmaXgsIGluY2x1ZGVQYXRoKTtcbiAgICBsZXQgZmlsZSA9ICcnO1xuICAgIGlmIChwYXRoSm9pbmVkLnN0YXJ0c1dpdGgoJ2h0dHAnKSlcbiAgICAgICAgZmlsZSA9IGF3YWl0ICgwLCBhcGlfMS5hcGlUZXh0KShwYXRoSm9pbmVkKTtcbiAgICBlbHNlIGlmIChmaWxlUmVhZFN0cmluZylcbiAgICAgICAgZmlsZSA9IGZpbGVSZWFkU3RyaW5nKHBhdGhKb2luZWQpO1xuICAgIGVsc2VcbiAgICAgICAgZmlsZSA9IGF3YWl0ICgwLCBhcGlfMS5hcGlUZXh0KShwYXRoSm9pbmVkKTtcbiAgICByZXR1cm4gZmlsZTtcbn1cbmV4cG9ydHMucGFyc2VMb2FkID0gcGFyc2VMb2FkO1xuZnVuY3Rpb24gcGFyc2VPcGNvZGVPYmplY3Qob3Bjb2Rlcykge1xuICAgIGNvbnN0IHByb3BlcnRpZXMgPSB7fTtcbiAgICBvcGNvZGVzLmZvckVhY2goKG9wY29kZSkgPT4ge1xuICAgICAgICBpZiAoIWlzTmFOKG9wY29kZS5hdHRyaWJ1dGVzLnZhbHVlKSkge1xuICAgICAgICAgICAgcHJvcGVydGllc1tvcGNvZGUuYXR0cmlidXRlcy5uYW1lXSA9IE51bWJlcihvcGNvZGUuYXR0cmlidXRlcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzW29wY29kZS5hdHRyaWJ1dGVzLm5hbWVdID0gb3Bjb2RlLmF0dHJpYnV0ZXMudmFsdWU7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcHJvcGVydGllcztcbn1cbmV4cG9ydHMucGFyc2VPcGNvZGVPYmplY3QgPSBwYXJzZU9wY29kZU9iamVjdDtcbmZ1bmN0aW9uIHBhcnNlU2FuaXRpemUoY29udGVudHMpIHtcbiAgICAvLyBSZW1vdmUgY29tbWVudHMuXG4gICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKC9cXC9cXCpbXFxzXFxTXSo/XFwqXFwvfCg/PD1bXjpdKVxcL1xcLy4qfF5cXC9cXC8uKi9nLCAnJyk7XG4gICAgLy8gUmVtb3ZlIG5ldyBsaW5lcyBhbmQgcmV0dXJucy5cbiAgICBjb250ZW50cyA9IGNvbnRlbnRzLnJlcGxhY2UoLyhcXHI/XFxufFxccikrL2csICcgJyk7XG4gICAgLy8gRW5zdXJlIHRoZXJlIGFyZSBhbHdheXMgc3BhY2VzIGFmdGVyIDxoZWFkZXI+LlxuICAgIGNvbnRlbnRzID0gY29udGVudHMucmVwbGFjZSgvPig/ISApL2csICc+ICcpO1xuICAgIC8vIFJlcGxhY2UgbXVsdGlwbGUgc3BhY2VzL3RhYnMgd2l0aCBzaW5nbGUgc3BhY2UuXG4gICAgY29udGVudHMgPSBjb250ZW50cy5yZXBsYWNlKC8oIHxcXHQpKy9nLCAnICcpO1xuICAgIC8vIFRyaW0gd2hpdGVzcGFjZS5cbiAgICByZXR1cm4gY29udGVudHMudHJpbSgpO1xufVxuZXhwb3J0cy5wYXJzZVNhbml0aXplID0gcGFyc2VTYW5pdGl6ZTtcbmZ1bmN0aW9uIHBhcnNlU2VnbWVudChzZWdtZW50KSB7XG4gICAgaWYgKHNlZ21lbnQuaW5jbHVkZXMoJ1wiJykpXG4gICAgICAgIHNlZ21lbnQgPSBzZWdtZW50LnJlcGxhY2UoL1wiL2csICcnKTtcbiAgICBpZiAoc2VnbWVudC5pbmNsdWRlcygnJCcpKVxuICAgICAgICBzZWdtZW50ID0gcGFyc2VWYXJpYWJsZXMoc2VnbWVudCwgdmFyaWFibGVzKTtcbiAgICByZXR1cm4gc2VnbWVudDtcbn1cbmV4cG9ydHMucGFyc2VTZWdtZW50ID0gcGFyc2VTZWdtZW50O1xuZnVuY3Rpb24gcGFyc2VTZXRMb2FkZXIoZnVuYykge1xuICAgIGZpbGVSZWFkU3RyaW5nID0gZnVuYztcbn1cbmV4cG9ydHMucGFyc2VTZXRMb2FkZXIgPSBwYXJzZVNldExvYWRlcjtcbmFzeW5jIGZ1bmN0aW9uIHBhcnNlU2Z6KGNvbnRlbnRzLCBwcmVmaXggPSAnJykge1xuICAgIGxldCBlbGVtZW50ID0ge307XG4gICAgY29uc3QgZWxlbWVudHMgPSBbXTtcbiAgICBjb25zdCBjb250ZW50c0ZsYXQgPSBhd2FpdCBwYXJzZUluY2x1ZGVzKGNvbnRlbnRzLCBwcmVmaXgpO1xuICAgIGNvbnN0IHNhbnRpemVkID0gcGFyc2VTYW5pdGl6ZShjb250ZW50c0ZsYXQpO1xuICAgIGNvbnN0IHNlZ21lbnRzID0gc2FudGl6ZWQuc3BsaXQoJyAnKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlZ21lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHNlZ21lbnQgPSBwYXJzZVNlZ21lbnQoc2VnbWVudHNbaV0pO1xuICAgICAgICBpZiAoc2VnbWVudC5jaGFyQXQoMCkgPT09ICcvJykge1xuICAgICAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjb21tZW50OicsIHNlZ21lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHNlZ21lbnQgPT09ICcjZGVmaW5lJykge1xuICAgICAgICAgICAgY29uc3Qga2V5ID0gc2VnbWVudHNbaSArIDFdO1xuICAgICAgICAgICAgY29uc3QgdmFsID0gc2VnbWVudHNbaSArIDJdO1xuICAgICAgICAgICAgaWYgKERFQlVHKVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdkZWZpbmU6Jywga2V5LCB2YWwpO1xuICAgICAgICAgICAgdmFyaWFibGVzW2tleV0gPSB2YWw7XG4gICAgICAgICAgICBpICs9IDI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoc2VnbWVudC5jaGFyQXQoMCkgPT09ICc8Jykge1xuICAgICAgICAgICAgZWxlbWVudCA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnZWxlbWVudCcsXG4gICAgICAgICAgICAgICAgbmFtZTogcGFyc2VIZWFkZXIoc2VnbWVudCksXG4gICAgICAgICAgICAgICAgZWxlbWVudHM6IFtdLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGlmIChERUJVRylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaGVhZGVyOicsIGVsZW1lbnQubmFtZSk7XG4gICAgICAgICAgICBlbGVtZW50cy5wdXNoKGVsZW1lbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFlbGVtZW50LmVsZW1lbnRzKVxuICAgICAgICAgICAgICAgIGVsZW1lbnQuZWxlbWVudHMgPSBbXTtcbiAgICAgICAgICAgIGNvbnN0IG9wY29kZSA9IHNlZ21lbnQuc3BsaXQoJz0nKTtcbiAgICAgICAgICAgIGlmIChERUJVRylcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb3Bjb2RlOicsIG9wY29kZSk7XG4gICAgICAgICAgICAvLyBJZiBvcnBoYW5lZCBzdHJpbmcsIGFkZCBvbiB0byBwcmV2aW91cyBvcGNvZGUgdmFsdWUuXG4gICAgICAgICAgICBpZiAob3Bjb2RlLmxlbmd0aCA9PT0gMSAmJiBlbGVtZW50LmVsZW1lbnRzLmxlbmd0aCAmJiBvcGNvZGVbMF0gIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50c1tlbGVtZW50LmVsZW1lbnRzLmxlbmd0aCAtIDFdLmF0dHJpYnV0ZXMudmFsdWUgKz0gJyAnICsgb3Bjb2RlWzBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudC5lbGVtZW50cy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2VsZW1lbnQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiAnb3Bjb2RlJyxcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogb3Bjb2RlWzBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IG9wY29kZVsxXSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAoZWxlbWVudHMubGVuZ3RoID4gMClcbiAgICAgICAgcmV0dXJuIGVsZW1lbnRzO1xuICAgIHJldHVybiBlbGVtZW50O1xufVxuZXhwb3J0cy5wYXJzZVNmeiA9IHBhcnNlU2Z6O1xuZnVuY3Rpb24gcGFyc2VWYXJpYWJsZXMoaW5wdXQsIHZhcnMpIHtcbiAgICBmb3IgKGNvbnN0IGtleSBpbiB2YXJzKSB7XG4gICAgICAgIGNvbnN0IHJlZ0V4ID0gbmV3IFJlZ0V4cCgnXFxcXCcgKyBrZXksICdnJyk7XG4gICAgICAgIGlucHV0ID0gaW5wdXQucmVwbGFjZShyZWdFeCwgdmFyc1trZXldKTtcbiAgICB9XG4gICAgcmV0dXJuIGlucHV0O1xufVxuZXhwb3J0cy5wYXJzZVZhcmlhYmxlcyA9IHBhcnNlVmFyaWFibGVzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlBhcnNlSGVhZGVyTmFtZXMgPSB2b2lkIDA7XG52YXIgUGFyc2VIZWFkZXJOYW1lcztcbihmdW5jdGlvbiAoUGFyc2VIZWFkZXJOYW1lcykge1xuICAgIFBhcnNlSGVhZGVyTmFtZXNbXCJyZWdpb25cIl0gPSBcInJlZ2lvblwiO1xuICAgIFBhcnNlSGVhZGVyTmFtZXNbXCJncm91cFwiXSA9IFwiZ3JvdXBcIjtcbiAgICBQYXJzZUhlYWRlck5hbWVzW1wiY29udHJvbFwiXSA9IFwiY29udHJvbFwiO1xuICAgIFBhcnNlSGVhZGVyTmFtZXNbXCJnbG9iYWxcIl0gPSBcImdsb2JhbFwiO1xuICAgIFBhcnNlSGVhZGVyTmFtZXNbXCJjdXJ2ZVwiXSA9IFwiY3VydmVcIjtcbiAgICBQYXJzZUhlYWRlck5hbWVzW1wiZWZmZWN0XCJdID0gXCJlZmZlY3RcIjtcbiAgICBQYXJzZUhlYWRlck5hbWVzW1wibWFzdGVyXCJdID0gXCJtYXN0ZXJcIjtcbiAgICBQYXJzZUhlYWRlck5hbWVzW1wibWlkaVwiXSA9IFwibWlkaVwiO1xuICAgIFBhcnNlSGVhZGVyTmFtZXNbXCJzYW1wbGVcIl0gPSBcInNhbXBsZVwiO1xufSkoUGFyc2VIZWFkZXJOYW1lcyB8fCAoUGFyc2VIZWFkZXJOYW1lcyA9IHt9KSk7XG5leHBvcnRzLlBhcnNlSGVhZGVyTmFtZXMgPSBQYXJzZUhlYWRlck5hbWVzO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGFyc2UuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLnBpdGNoVG9NaWRpID0gZXhwb3J0cy5wYXRoUmVwbGFjZVZhcmlhYmxlcyA9IGV4cG9ydHMucGF0aEpvaW4gPSBleHBvcnRzLnBhdGhHZXRTdWJEaXJlY3RvcnkgPSBleHBvcnRzLnBhdGhHZXRSb290ID0gZXhwb3J0cy5wYXRoR2V0RmlsZW5hbWUgPSBleHBvcnRzLnBhdGhHZXRFeHQgPSBleHBvcnRzLnBhdGhHZXREaXJlY3RvcnkgPSBleHBvcnRzLm5vcm1hbGl6ZVhtbCA9IGV4cG9ydHMubm9ybWFsaXplTGluZUVuZHMgPSBleHBvcnRzLm1pZGlOYW1lVG9OdW0gPSBleHBvcnRzLmxvZ0Rpc2FibGUgPSBleHBvcnRzLmxvZ0VuYWJsZSA9IGV4cG9ydHMubG9nID0gZXhwb3J0cy5maW5kTnVtYmVyID0gZXhwb3J0cy5maW5kQ2FzZUluc2VudGl2ZSA9IGV4cG9ydHMuZW5jb2RlSGFzaGVzID0gZXhwb3J0cy5MSU5FX0VORCA9IGV4cG9ydHMuSVNfV0lOID0gdm9pZCAwO1xuY29uc3QgSVNfV0lOID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMic7XG5leHBvcnRzLklTX1dJTiA9IElTX1dJTjtcbmNvbnN0IExJTkVfRU5EID0gSVNfV0lOID8gJ1xcclxcbicgOiAnXFxuJztcbmV4cG9ydHMuTElORV9FTkQgPSBMSU5FX0VORDtcbmxldCBMT0dHSU5HX0VOQUJMRUQgPSBmYWxzZTtcbmZ1bmN0aW9uIGVuY29kZUhhc2hlcyhpdGVtKSB7XG4gICAgcmV0dXJuIGl0ZW0ucmVwbGFjZSgvIy9nLCBlbmNvZGVVUklDb21wb25lbnQoJyMnKSk7XG59XG5leHBvcnRzLmVuY29kZUhhc2hlcyA9IGVuY29kZUhhc2hlcztcbmZ1bmN0aW9uIGZpbmRDYXNlSW5zZW50aXZlKGl0ZW1zLCBtYXRjaCkge1xuICAgIHJldHVybiBpdGVtcy5maW5kSW5kZXgoKGl0ZW0pID0+IHtcbiAgICAgICAgcmV0dXJuIGl0ZW0udG9Mb3dlckNhc2UoKSA9PT0gbWF0Y2gudG9Mb3dlckNhc2UoKTtcbiAgICB9KTtcbn1cbmV4cG9ydHMuZmluZENhc2VJbnNlbnRpdmUgPSBmaW5kQ2FzZUluc2VudGl2ZTtcbmZ1bmN0aW9uIGZpbmROdW1iZXIoaW5wdXQpIHtcbiAgICBjb25zdCBtYXRjaGVzID0gaW5wdXQubWF0Y2goL1xcZCsvZyk7XG4gICAgcmV0dXJuIE51bWJlcihtYXRjaGVzWzBdKTtcbn1cbmV4cG9ydHMuZmluZE51bWJlciA9IGZpbmROdW1iZXI7XG5mdW5jdGlvbiBsb2coLi4uYXJncykge1xuICAgIGlmIChMT0dHSU5HX0VOQUJMRUQpIHtcbiAgICAgICAgY29uc29sZS5sb2coLi4uYXJncyk7XG4gICAgfVxufVxuZXhwb3J0cy5sb2cgPSBsb2c7XG5mdW5jdGlvbiBsb2dFbmFibGUoLi4uYXJncykge1xuICAgIExPR0dJTkdfRU5BQkxFRCA9IHRydWU7XG59XG5leHBvcnRzLmxvZ0VuYWJsZSA9IGxvZ0VuYWJsZTtcbmZ1bmN0aW9uIGxvZ0Rpc2FibGUoLi4uYXJncykge1xuICAgIExPR0dJTkdfRU5BQkxFRCA9IGZhbHNlO1xufVxuZXhwb3J0cy5sb2dEaXNhYmxlID0gbG9nRGlzYWJsZTtcbmZ1bmN0aW9uIG1pZGlOYW1lVG9OdW0obmFtZSkge1xuICAgIGlmICghbmFtZSlcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgaWYgKHR5cGVvZiBuYW1lID09PSAnbnVtYmVyJylcbiAgICAgICAgcmV0dXJuIG5hbWU7XG4gICAgY29uc3QgbWFwUGl0Y2hlcyA9IHtcbiAgICAgICAgQzogMCxcbiAgICAgICAgRDogMixcbiAgICAgICAgRTogNCxcbiAgICAgICAgRjogNSxcbiAgICAgICAgRzogNyxcbiAgICAgICAgQTogOSxcbiAgICAgICAgQjogMTEsXG4gICAgfTtcbiAgICBjb25zdCBsZXR0ZXIgPSBuYW1lWzBdO1xuICAgIGxldCBwYyA9IG1hcFBpdGNoZXNbbGV0dGVyLnRvVXBwZXJDYXNlKCldO1xuICAgIGNvbnN0IG1hcE1vZHMgPSB7IGI6IC0xLCAnIyc6IDEgfTtcbiAgICBjb25zdCBtb2QgPSBuYW1lWzFdO1xuICAgIGNvbnN0IHRyYW5zID0gbWFwTW9kc1ttb2RdIHx8IDA7XG4gICAgcGMgKz0gdHJhbnM7XG4gICAgY29uc3Qgb2N0YXZlID0gcGFyc2VJbnQobmFtZS5zbGljZShuYW1lLmxlbmd0aCAtIDEpLCAxMCk7XG4gICAgaWYgKG9jdGF2ZSkge1xuICAgICAgICByZXR1cm4gcGMgKyAxMiAqIChvY3RhdmUgKyAxKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiAoKHBjICUgMTIpICsgMTIpICUgMTI7XG4gICAgfVxufVxuZXhwb3J0cy5taWRpTmFtZVRvTnVtID0gbWlkaU5hbWVUb051bTtcbmZ1bmN0aW9uIG5vcm1hbGl6ZUxpbmVFbmRzKGlucHV0KSB7XG4gICAgaWYgKElTX1dJTilcbiAgICAgICAgcmV0dXJuIGlucHV0LnJlcGxhY2UoL1xccj9cXG4vZywgTElORV9FTkQpO1xuICAgIHJldHVybiBpbnB1dDtcbn1cbmV4cG9ydHMubm9ybWFsaXplTGluZUVuZHMgPSBub3JtYWxpemVMaW5lRW5kcztcbmZ1bmN0aW9uIG5vcm1hbGl6ZVhtbChpbnB1dCkge1xuICAgIGlucHV0ID0gbm9ybWFsaXplTGluZUVuZHMoaW5wdXQpO1xuICAgIHJldHVybiBpbnB1dC5yZXBsYWNlKC9cXC8+L2csICcgLz4nKSArIExJTkVfRU5EO1xufVxuZXhwb3J0cy5ub3JtYWxpemVYbWwgPSBub3JtYWxpemVYbWw7XG5mdW5jdGlvbiBwYXRoR2V0RGlyZWN0b3J5KHBhdGhJdGVtLCBzZXBhcmF0b3IgPSAnLycpIHtcbiAgICByZXR1cm4gcGF0aEl0ZW0uc3Vic3RyaW5nKDAsIHBhdGhJdGVtLmxhc3RJbmRleE9mKHNlcGFyYXRvcikpO1xufVxuZXhwb3J0cy5wYXRoR2V0RGlyZWN0b3J5ID0gcGF0aEdldERpcmVjdG9yeTtcbmZ1bmN0aW9uIHBhdGhHZXRFeHQocGF0aEl0ZW0pIHtcbiAgICByZXR1cm4gcGF0aEl0ZW0uc3Vic3RyaW5nKHBhdGhJdGVtLmxhc3RJbmRleE9mKCcuJykgKyAxKTtcbn1cbmV4cG9ydHMucGF0aEdldEV4dCA9IHBhdGhHZXRFeHQ7XG5mdW5jdGlvbiBwYXRoR2V0RmlsZW5hbWUoc3RyLCBzZXBhcmF0b3IgPSAnLycpIHtcbiAgICBsZXQgYmFzZSA9IHN0ci5zdWJzdHJpbmcoc3RyLmxhc3RJbmRleE9mKHNlcGFyYXRvcikgKyAxKTtcbiAgICBpZiAoYmFzZS5sYXN0SW5kZXhPZignLicpICE9PSAtMSkge1xuICAgICAgICBiYXNlID0gYmFzZS5zdWJzdHJpbmcoMCwgYmFzZS5sYXN0SW5kZXhPZignLicpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2U7XG59XG5leHBvcnRzLnBhdGhHZXRGaWxlbmFtZSA9IHBhdGhHZXRGaWxlbmFtZTtcbmZ1bmN0aW9uIHBhdGhHZXRSb290KGl0ZW0sIHNlcGFyYXRvciA9ICcvJykge1xuICAgIHJldHVybiBpdGVtLnN1YnN0cmluZygwLCBpdGVtLmluZGV4T2Yoc2VwYXJhdG9yKSArIDEpO1xufVxuZXhwb3J0cy5wYXRoR2V0Um9vdCA9IHBhdGhHZXRSb290O1xuZnVuY3Rpb24gcGF0aEdldFN1YkRpcmVjdG9yeShpdGVtLCBkaXIpIHtcbiAgICByZXR1cm4gaXRlbS5yZXBsYWNlKGRpciwgJycpO1xufVxuZXhwb3J0cy5wYXRoR2V0U3ViRGlyZWN0b3J5ID0gcGF0aEdldFN1YkRpcmVjdG9yeTtcbmZ1bmN0aW9uIHBhdGhKb2luKC4uLnNlZ21lbnRzKSB7XG4gICAgY29uc3QgcGFydHMgPSBzZWdtZW50cy5yZWR1Y2UoKHBhcnRJdGVtcywgc2VnbWVudCkgPT4ge1xuICAgICAgICAvLyBSZXBsYWNlIGJhY2tzbGFzaGVzIHdpdGggZm9yd2FyZCBzbGFzaGVzXG4gICAgICAgIGlmIChzZWdtZW50LmluY2x1ZGVzKCdcXFxcJykpIHtcbiAgICAgICAgICAgIHNlZ21lbnQgPSBzZWdtZW50LnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgbGVhZGluZyBzbGFzaGVzIGZyb20gbm9uLWZpcnN0IHBhcnQuXG4gICAgICAgIGlmIChwYXJ0SXRlbXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgc2VnbWVudCA9IHNlZ21lbnQucmVwbGFjZSgvXlxcLy8sICcnKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBSZW1vdmUgdHJhaWxpbmcgc2xhc2hlcy5cbiAgICAgICAgc2VnbWVudCA9IHNlZ21lbnQucmVwbGFjZSgvXFwvJC8sICcnKTtcbiAgICAgICAgcmV0dXJuIHBhcnRJdGVtcy5jb25jYXQoc2VnbWVudC5zcGxpdCgnLycpKTtcbiAgICB9LCBbXSk7XG4gICAgY29uc3QgcmVzdWx0UGFydHMgPSBbXTtcbiAgICBmb3IgKGxldCBwYXJ0IG9mIHBhcnRzKSB7XG4gICAgICAgIGlmIChwYXJ0ID09PSAnaHR0cHM6JyB8fCBwYXJ0ID09PSAnaHR0cDonKVxuICAgICAgICAgICAgcGFydCArPSAnLyc7XG4gICAgICAgIGlmIChwYXJ0ID09PSAnJylcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAocGFydCA9PT0gJy4nKVxuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIGlmIChwYXJ0ID09PSByZXN1bHRQYXJ0c1tyZXN1bHRQYXJ0cy5sZW5ndGggLSAxXSlcbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICBpZiAocGFydCA9PT0gJy4uJykge1xuICAgICAgICAgICAgY29uc3QgcGFydFJlbW92ZWQgPSByZXN1bHRQYXJ0cy5wb3AoKTtcbiAgICAgICAgICAgIGlmIChwYXJ0UmVtb3ZlZCA9PT0gJycpXG4gICAgICAgICAgICAgICAgcmVzdWx0UGFydHMucG9wKCk7XG4gICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHRQYXJ0cy5wdXNoKHBhcnQpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0UGFydHMuam9pbignLycpO1xufVxuZXhwb3J0cy5wYXRoSm9pbiA9IHBhdGhKb2luO1xuZnVuY3Rpb24gcGF0aFJlcGxhY2VWYXJpYWJsZXMoc3RyLCBpdGVtcykge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGl0ZW1zKSkge1xuICAgICAgICBpdGVtcy5mb3JFYWNoKChpdGVtLCBpdGVtSW5kZXgpID0+IHtcbiAgICAgICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKGAkaXRlbVske2l0ZW1JbmRleH1dYCwgaXRlbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmtleXMoaXRlbXMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UoYCQke2tleX1gLCBpdGVtc1trZXldKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBzdHI7XG59XG5leHBvcnRzLnBhdGhSZXBsYWNlVmFyaWFibGVzID0gcGF0aFJlcGxhY2VWYXJpYWJsZXM7XG5mdW5jdGlvbiBwaXRjaFRvTWlkaShwaXRjaCkge1xuICAgIC8vIEE0ID0gNDQwIEh6LCA2OSBNSURJIG5vdGVcbiAgICBjb25zdCBBNF9IWiA9IDQ0MDtcbiAgICBjb25zdCBBNF9NSURJID0gNjk7XG4gICAgLy8gVGhlIG51bWJlciBvZiBzZW1pdG9uZXMgYmV0d2VlbiB0aGUgZ2l2ZW4gcGl0Y2ggYW5kIEE0XG4gICAgY29uc3Qgc2VtaXRvbmVzID0gTWF0aC5sb2cyKHBpdGNoIC8gQTRfSFopICogMTI7XG4gICAgLy8gVGhlIE1JREkgbm90ZSBudW1iZXJcbiAgICBjb25zdCBtaWRpTm90ZSA9IEE0X01JREkgKyBzZW1pdG9uZXM7XG4gICAgcmV0dXJuIE1hdGgucm91bmQobWlkaU5vdGUpO1xufVxuZXhwb3J0cy5waXRjaFRvTWlkaSA9IHBpdGNoVG9NaWRpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dXRpbHMuanMubWFwIiwiJ3VzZSBzdHJpY3QnXG5cbmV4cG9ydHMuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcbmV4cG9ydHMudG9CeXRlQXJyYXkgPSB0b0J5dGVBcnJheVxuZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gZnJvbUJ5dGVBcnJheVxuXG52YXIgbG9va3VwID0gW11cbnZhciByZXZMb29rdXAgPSBbXVxudmFyIEFyciA9IHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJyA/IFVpbnQ4QXJyYXkgOiBBcnJheVxuXG52YXIgY29kZSA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJ1xuZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvZGUubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcbiAgbG9va3VwW2ldID0gY29kZVtpXVxuICByZXZMb29rdXBbY29kZS5jaGFyQ29kZUF0KGkpXSA9IGlcbn1cblxuLy8gU3VwcG9ydCBkZWNvZGluZyBVUkwtc2FmZSBiYXNlNjQgc3RyaW5ncywgYXMgTm9kZS5qcyBkb2VzLlxuLy8gU2VlOiBodHRwczovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9CYXNlNjQjVVJMX2FwcGxpY2F0aW9uc1xucmV2TG9va3VwWyctJy5jaGFyQ29kZUF0KDApXSA9IDYyXG5yZXZMb29rdXBbJ18nLmNoYXJDb2RlQXQoMCldID0gNjNcblxuZnVuY3Rpb24gZ2V0TGVucyAoYjY0KSB7XG4gIHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cbiAgaWYgKGxlbiAlIDQgPiAwKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0JylcbiAgfVxuXG4gIC8vIFRyaW0gb2ZmIGV4dHJhIGJ5dGVzIGFmdGVyIHBsYWNlaG9sZGVyIGJ5dGVzIGFyZSBmb3VuZFxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9iZWF0Z2FtbWl0L2Jhc2U2NC1qcy9pc3N1ZXMvNDJcbiAgdmFyIHZhbGlkTGVuID0gYjY0LmluZGV4T2YoJz0nKVxuICBpZiAodmFsaWRMZW4gPT09IC0xKSB2YWxpZExlbiA9IGxlblxuXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSB2YWxpZExlbiA9PT0gbGVuXG4gICAgPyAwXG4gICAgOiA0IC0gKHZhbGlkTGVuICUgNClcblxuICByZXR1cm4gW3ZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW5dXG59XG5cbi8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuZnVuY3Rpb24gYnl0ZUxlbmd0aCAoYjY0KSB7XG4gIHZhciBsZW5zID0gZ2V0TGVucyhiNjQpXG4gIHZhciB2YWxpZExlbiA9IGxlbnNbMF1cbiAgdmFyIHBsYWNlSG9sZGVyc0xlbiA9IGxlbnNbMV1cbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIF9ieXRlTGVuZ3RoIChiNjQsIHZhbGlkTGVuLCBwbGFjZUhvbGRlcnNMZW4pIHtcbiAgcmV0dXJuICgodmFsaWRMZW4gKyBwbGFjZUhvbGRlcnNMZW4pICogMyAvIDQpIC0gcGxhY2VIb2xkZXJzTGVuXG59XG5cbmZ1bmN0aW9uIHRvQnl0ZUFycmF5IChiNjQpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVucyA9IGdldExlbnMoYjY0KVxuICB2YXIgdmFsaWRMZW4gPSBsZW5zWzBdXG4gIHZhciBwbGFjZUhvbGRlcnNMZW4gPSBsZW5zWzFdXG5cbiAgdmFyIGFyciA9IG5ldyBBcnIoX2J5dGVMZW5ndGgoYjY0LCB2YWxpZExlbiwgcGxhY2VIb2xkZXJzTGVuKSlcblxuICB2YXIgY3VyQnl0ZSA9IDBcblxuICAvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG4gIHZhciBsZW4gPSBwbGFjZUhvbGRlcnNMZW4gPiAwXG4gICAgPyB2YWxpZExlbiAtIDRcbiAgICA6IHZhbGlkTGVuXG5cbiAgdmFyIGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgdG1wID1cbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSldIDw8IDE4KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPDwgMTIpIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDIpXSA8PCA2KSB8XG4gICAgICByZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDMpXVxuICAgIGFycltjdXJCeXRlKytdID0gKHRtcCA+PiAxNikgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSAodG1wID4+IDgpICYgMHhGRlxuICAgIGFycltjdXJCeXRlKytdID0gdG1wICYgMHhGRlxuICB9XG5cbiAgaWYgKHBsYWNlSG9sZGVyc0xlbiA9PT0gMikge1xuICAgIHRtcCA9XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkpXSA8PCAyKSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAxKV0gPj4gNClcbiAgICBhcnJbY3VyQnl0ZSsrXSA9IHRtcCAmIDB4RkZcbiAgfVxuXG4gIGlmIChwbGFjZUhvbGRlcnNMZW4gPT09IDEpIHtcbiAgICB0bXAgPVxuICAgICAgKHJldkxvb2t1cFtiNjQuY2hhckNvZGVBdChpKV0gPDwgMTApIHxcbiAgICAgIChyZXZMb29rdXBbYjY0LmNoYXJDb2RlQXQoaSArIDEpXSA8PCA0KSB8XG4gICAgICAocmV2TG9va3VwW2I2NC5jaGFyQ29kZUF0KGkgKyAyKV0gPj4gMilcbiAgICBhcnJbY3VyQnl0ZSsrXSA9ICh0bXAgPj4gOCkgJiAweEZGXG4gICAgYXJyW2N1ckJ5dGUrK10gPSB0bXAgJiAweEZGXG4gIH1cblxuICByZXR1cm4gYXJyXG59XG5cbmZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG4gIHJldHVybiBsb29rdXBbbnVtID4+IDE4ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gPj4gMTIgJiAweDNGXSArXG4gICAgbG9va3VwW251bSA+PiA2ICYgMHgzRl0gK1xuICAgIGxvb2t1cFtudW0gJiAweDNGXVxufVxuXG5mdW5jdGlvbiBlbmNvZGVDaHVuayAodWludDgsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHRtcFxuICB2YXIgb3V0cHV0ID0gW11cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpICs9IDMpIHtcbiAgICB0bXAgPVxuICAgICAgKCh1aW50OFtpXSA8PCAxNikgJiAweEZGMDAwMCkgK1xuICAgICAgKCh1aW50OFtpICsgMV0gPDwgOCkgJiAweEZGMDApICtcbiAgICAgICh1aW50OFtpICsgMl0gJiAweEZGKVxuICAgIG91dHB1dC5wdXNoKHRyaXBsZXRUb0Jhc2U2NCh0bXApKVxuICB9XG4gIHJldHVybiBvdXRwdXQuam9pbignJylcbn1cblxuZnVuY3Rpb24gZnJvbUJ5dGVBcnJheSAodWludDgpIHtcbiAgdmFyIHRtcFxuICB2YXIgbGVuID0gdWludDgubGVuZ3RoXG4gIHZhciBleHRyYUJ5dGVzID0gbGVuICUgMyAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuICB2YXIgcGFydHMgPSBbXVxuICB2YXIgbWF4Q2h1bmtMZW5ndGggPSAxNjM4MyAvLyBtdXN0IGJlIG11bHRpcGxlIG9mIDNcblxuICAvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG4gIGZvciAodmFyIGkgPSAwLCBsZW4yID0gbGVuIC0gZXh0cmFCeXRlczsgaSA8IGxlbjI7IGkgKz0gbWF4Q2h1bmtMZW5ndGgpIHtcbiAgICBwYXJ0cy5wdXNoKGVuY29kZUNodW5rKHVpbnQ4LCBpLCAoaSArIG1heENodW5rTGVuZ3RoKSA+IGxlbjIgPyBsZW4yIDogKGkgKyBtYXhDaHVua0xlbmd0aCkpKVxuICB9XG5cbiAgLy8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuICBpZiAoZXh0cmFCeXRlcyA9PT0gMSkge1xuICAgIHRtcCA9IHVpbnQ4W2xlbiAtIDFdXG4gICAgcGFydHMucHVzaChcbiAgICAgIGxvb2t1cFt0bXAgPj4gMl0gK1xuICAgICAgbG9va3VwWyh0bXAgPDwgNCkgJiAweDNGXSArXG4gICAgICAnPT0nXG4gICAgKVxuICB9IGVsc2UgaWYgKGV4dHJhQnl0ZXMgPT09IDIpIHtcbiAgICB0bXAgPSAodWludDhbbGVuIC0gMl0gPDwgOCkgKyB1aW50OFtsZW4gLSAxXVxuICAgIHBhcnRzLnB1c2goXG4gICAgICBsb29rdXBbdG1wID4+IDEwXSArXG4gICAgICBsb29rdXBbKHRtcCA+PiA0KSAmIDB4M0ZdICtcbiAgICAgIGxvb2t1cFsodG1wIDw8IDIpICYgMHgzRl0gK1xuICAgICAgJz0nXG4gICAgKVxuICB9XG5cbiAgcmV0dXJuIHBhcnRzLmpvaW4oJycpXG59XG4iLCIvKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxodHRwczovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG5cbid1c2Ugc3RyaWN0J1xuXG5jb25zdCBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxuY29uc3QgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuY29uc3QgY3VzdG9tSW5zcGVjdFN5bWJvbCA9XG4gICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBTeW1ib2xbJ2ZvciddID09PSAnZnVuY3Rpb24nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgID8gU3ltYm9sWydmb3InXSgnbm9kZWpzLnV0aWwuaW5zcGVjdC5jdXN0b20nKSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIGRvdC1ub3RhdGlvblxuICAgIDogbnVsbFxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gU2xvd0J1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5cbmNvbnN0IEtfTUFYX0xFTkdUSCA9IDB4N2ZmZmZmZmZcbmV4cG9ydHMua01heExlbmd0aCA9IEtfTUFYX0xFTkdUSFxuXG4vKipcbiAqIElmIGBCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVGA6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBQcmludCB3YXJuaW5nIGFuZCByZWNvbW1lbmQgdXNpbmcgYGJ1ZmZlcmAgdjQueCB3aGljaCBoYXMgYW4gT2JqZWN0XG4gKiAgICAgICAgICAgICAgIGltcGxlbWVudGF0aW9uIChtb3N0IGNvbXBhdGlibGUsIGV2ZW4gSUU2KVxuICpcbiAqIEJyb3dzZXJzIHRoYXQgc3VwcG9ydCB0eXBlZCBhcnJheXMgYXJlIElFIDEwKywgRmlyZWZveCA0KywgQ2hyb21lIDcrLCBTYWZhcmkgNS4xKyxcbiAqIE9wZXJhIDExLjYrLCBpT1MgNC4yKy5cbiAqXG4gKiBXZSByZXBvcnQgdGhhdCB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHR5cGVkIGFycmF5cyBpZiB0aGUgYXJlIG5vdCBzdWJjbGFzc2FibGVcbiAqIHVzaW5nIF9fcHJvdG9fXy4gRmlyZWZveCA0LTI5IGxhY2tzIHN1cHBvcnQgZm9yIGFkZGluZyBuZXcgcHJvcGVydGllcyB0byBgVWludDhBcnJheWBcbiAqIChTZWU6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOCkuIElFIDEwIGxhY2tzIHN1cHBvcnRcbiAqIGZvciBfX3Byb3RvX18gYW5kIGhhcyBhIGJ1Z2d5IHR5cGVkIGFycmF5IGltcGxlbWVudGF0aW9uLlxuICovXG5CdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCA9IHR5cGVkQXJyYXlTdXBwb3J0KClcblxuaWYgKCFCdWZmZXIuVFlQRURfQVJSQVlfU1VQUE9SVCAmJiB0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICB0eXBlb2YgY29uc29sZS5lcnJvciA9PT0gJ2Z1bmN0aW9uJykge1xuICBjb25zb2xlLmVycm9yKFxuICAgICdUaGlzIGJyb3dzZXIgbGFja3MgdHlwZWQgYXJyYXkgKFVpbnQ4QXJyYXkpIHN1cHBvcnQgd2hpY2ggaXMgcmVxdWlyZWQgYnkgJyArXG4gICAgJ2BidWZmZXJgIHY1LnguIFVzZSBgYnVmZmVyYCB2NC54IGlmIHlvdSByZXF1aXJlIG9sZCBicm93c2VyIHN1cHBvcnQuJ1xuICApXG59XG5cbmZ1bmN0aW9uIHR5cGVkQXJyYXlTdXBwb3J0ICgpIHtcbiAgLy8gQ2FuIHR5cGVkIGFycmF5IGluc3RhbmNlcyBjYW4gYmUgYXVnbWVudGVkP1xuICB0cnkge1xuICAgIGNvbnN0IGFyciA9IG5ldyBVaW50OEFycmF5KDEpXG4gICAgY29uc3QgcHJvdG8gPSB7IGZvbzogZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfSB9XG4gICAgT2JqZWN0LnNldFByb3RvdHlwZU9mKHByb3RvLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbiAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYXJyLCBwcm90bylcbiAgICByZXR1cm4gYXJyLmZvbygpID09PSA0MlxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEJ1ZmZlci5wcm90b3R5cGUsICdwYXJlbnQnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gKCkge1xuICAgIGlmICghQnVmZmVyLmlzQnVmZmVyKHRoaXMpKSByZXR1cm4gdW5kZWZpbmVkXG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyXG4gIH1cbn0pXG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdWZmZXIucHJvdG90eXBlLCAnb2Zmc2V0Jywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIUJ1ZmZlci5pc0J1ZmZlcih0aGlzKSkgcmV0dXJuIHVuZGVmaW5lZFxuICAgIHJldHVybiB0aGlzLmJ5dGVPZmZzZXRcbiAgfVxufSlcblxuZnVuY3Rpb24gY3JlYXRlQnVmZmVyIChsZW5ndGgpIHtcbiAgaWYgKGxlbmd0aCA+IEtfTUFYX0xFTkdUSCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgXCInICsgbGVuZ3RoICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgY29uc3QgYnVmID0gbmV3IFVpbnQ4QXJyYXkobGVuZ3RoKVxuICBPYmplY3Quc2V0UHJvdG90eXBlT2YoYnVmLCBCdWZmZXIucHJvdG90eXBlKVxuICByZXR1cm4gYnVmXG59XG5cbi8qKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBoYXZlIHRoZWlyXG4gKiBwcm90b3R5cGUgY2hhbmdlZCB0byBgQnVmZmVyLnByb3RvdHlwZWAuIEZ1cnRoZXJtb3JlLCBgQnVmZmVyYCBpcyBhIHN1YmNsYXNzIG9mXG4gKiBgVWludDhBcnJheWAsIHNvIHRoZSByZXR1cm5lZCBpbnN0YW5jZXMgd2lsbCBoYXZlIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBtZXRob2RzXG4gKiBhbmQgdGhlIGBVaW50OEFycmF5YCBtZXRob2RzLiBTcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdFxuICogcmV0dXJucyBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBUaGUgYFVpbnQ4QXJyYXlgIHByb3RvdHlwZSByZW1haW5zIHVubW9kaWZpZWQuXG4gKi9cblxuZnVuY3Rpb24gQnVmZmVyIChhcmcsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICAvLyBDb21tb24gY2FzZS5cbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZ09yT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBzdHJpbmcuIFJlY2VpdmVkIHR5cGUgbnVtYmVyJ1xuICAgICAgKVxuICAgIH1cbiAgICByZXR1cm4gYWxsb2NVbnNhZmUoYXJnKVxuICB9XG4gIHJldHVybiBmcm9tKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyIC8vIG5vdCB1c2VkIGJ5IHRoaXMgaW1wbGVtZW50YXRpb25cblxuZnVuY3Rpb24gZnJvbSAodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aCkge1xuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBmcm9tU3RyaW5nKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0KVxuICB9XG5cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyh2YWx1ZSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5Vmlldyh2YWx1ZSlcbiAgfVxuXG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgZmlyc3QgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBzdHJpbmcsIEJ1ZmZlciwgQXJyYXlCdWZmZXIsIEFycmF5LCAnICtcbiAgICAgICdvciBBcnJheS1saWtlIE9iamVjdC4gUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB2YWx1ZSlcbiAgICApXG4gIH1cblxuICBpZiAoaXNJbnN0YW5jZSh2YWx1ZSwgQXJyYXlCdWZmZXIpIHx8XG4gICAgICAodmFsdWUgJiYgaXNJbnN0YW5jZSh2YWx1ZS5idWZmZXIsIEFycmF5QnVmZmVyKSkpIHtcbiAgICByZXR1cm4gZnJvbUFycmF5QnVmZmVyKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBpZiAodHlwZW9mIFNoYXJlZEFycmF5QnVmZmVyICE9PSAndW5kZWZpbmVkJyAmJlxuICAgICAgKGlzSW5zdGFuY2UodmFsdWUsIFNoYXJlZEFycmF5QnVmZmVyKSB8fFxuICAgICAgKHZhbHVlICYmIGlzSW5zdGFuY2UodmFsdWUuYnVmZmVyLCBTaGFyZWRBcnJheUJ1ZmZlcikpKSkge1xuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIodmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAgICdUaGUgXCJ2YWx1ZVwiIGFyZ3VtZW50IG11c3Qgbm90IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlIG51bWJlcidcbiAgICApXG4gIH1cblxuICBjb25zdCB2YWx1ZU9mID0gdmFsdWUudmFsdWVPZiAmJiB2YWx1ZS52YWx1ZU9mKClcbiAgaWYgKHZhbHVlT2YgIT0gbnVsbCAmJiB2YWx1ZU9mICE9PSB2YWx1ZSkge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh2YWx1ZU9mLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG4gIH1cblxuICBjb25zdCBiID0gZnJvbU9iamVjdCh2YWx1ZSlcbiAgaWYgKGIpIHJldHVybiBiXG5cbiAgaWYgKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1ByaW1pdGl2ZSAhPSBudWxsICYmXG4gICAgICB0eXBlb2YgdmFsdWVbU3ltYm9sLnRvUHJpbWl0aXZlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBCdWZmZXIuZnJvbSh2YWx1ZVtTeW1ib2wudG9QcmltaXRpdmVdKCdzdHJpbmcnKSwgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcbiAgICAnVGhlIGZpcnN0IGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIEFycmF5QnVmZmVyLCBBcnJheSwgJyArXG4gICAgJ29yIEFycmF5LWxpa2UgT2JqZWN0LiBSZWNlaXZlZCB0eXBlICcgKyAodHlwZW9mIHZhbHVlKVxuICApXG59XG5cbi8qKlxuICogRnVuY3Rpb25hbGx5IGVxdWl2YWxlbnQgdG8gQnVmZmVyKGFyZywgZW5jb2RpbmcpIGJ1dCB0aHJvd3MgYSBUeXBlRXJyb3JcbiAqIGlmIHZhbHVlIGlzIGEgbnVtYmVyLlxuICogQnVmZmVyLmZyb20oc3RyWywgZW5jb2RpbmddKVxuICogQnVmZmVyLmZyb20oYXJyYXkpXG4gKiBCdWZmZXIuZnJvbShidWZmZXIpXG4gKiBCdWZmZXIuZnJvbShhcnJheUJ1ZmZlclssIGJ5dGVPZmZzZXRbLCBsZW5ndGhdXSlcbiAqKi9cbkJ1ZmZlci5mcm9tID0gZnVuY3Rpb24gKHZhbHVlLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGZyb20odmFsdWUsIGVuY29kaW5nT3JPZmZzZXQsIGxlbmd0aClcbn1cblxuLy8gTm90ZTogQ2hhbmdlIHByb3RvdHlwZSAqYWZ0ZXIqIEJ1ZmZlci5mcm9tIGlzIGRlZmluZWQgdG8gd29ya2Fyb3VuZCBDaHJvbWUgYnVnOlxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvcHVsbC8xNDhcbk9iamVjdC5zZXRQcm90b3R5cGVPZihCdWZmZXIucHJvdG90eXBlLCBVaW50OEFycmF5LnByb3RvdHlwZSlcbk9iamVjdC5zZXRQcm90b3R5cGVPZihCdWZmZXIsIFVpbnQ4QXJyYXkpXG5cbmZ1bmN0aW9uIGFzc2VydFNpemUgKHNpemUpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wic2l6ZVwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBudW1iZXInKVxuICB9IGVsc2UgaWYgKHNpemUgPCAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyBzaXplICsgJ1wiIGlzIGludmFsaWQgZm9yIG9wdGlvbiBcInNpemVcIicpXG4gIH1cbn1cblxuZnVuY3Rpb24gYWxsb2MgKHNpemUsIGZpbGwsIGVuY29kaW5nKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgaWYgKHNpemUgPD0gMCkge1xuICAgIHJldHVybiBjcmVhdGVCdWZmZXIoc2l6ZSlcbiAgfVxuICBpZiAoZmlsbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT25seSBwYXkgYXR0ZW50aW9uIHRvIGVuY29kaW5nIGlmIGl0J3MgYSBzdHJpbmcuIFRoaXNcbiAgICAvLyBwcmV2ZW50cyBhY2NpZGVudGFsbHkgc2VuZGluZyBpbiBhIG51bWJlciB0aGF0IHdvdWxkXG4gICAgLy8gYmUgaW50ZXJwcmV0ZWQgYXMgYSBzdGFydCBvZmZzZXQuXG4gICAgcmV0dXJuIHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZydcbiAgICAgID8gY3JlYXRlQnVmZmVyKHNpemUpLmZpbGwoZmlsbCwgZW5jb2RpbmcpXG4gICAgICA6IGNyZWF0ZUJ1ZmZlcihzaXplKS5maWxsKGZpbGwpXG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplKVxufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqIGFsbG9jKHNpemVbLCBmaWxsWywgZW5jb2RpbmddXSlcbiAqKi9cbkJ1ZmZlci5hbGxvYyA9IGZ1bmN0aW9uIChzaXplLCBmaWxsLCBlbmNvZGluZykge1xuICByZXR1cm4gYWxsb2Moc2l6ZSwgZmlsbCwgZW5jb2RpbmcpXG59XG5cbmZ1bmN0aW9uIGFsbG9jVW5zYWZlIChzaXplKSB7XG4gIGFzc2VydFNpemUoc2l6ZSlcbiAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcihzaXplIDwgMCA/IDAgOiBjaGVja2VkKHNpemUpIHwgMClcbn1cblxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIEJ1ZmZlcihudW0pLCBieSBkZWZhdWx0IGNyZWF0ZXMgYSBub24temVyby1maWxsZWQgQnVmZmVyIGluc3RhbmNlLlxuICogKi9cbkJ1ZmZlci5hbGxvY1Vuc2FmZSA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuLyoqXG4gKiBFcXVpdmFsZW50IHRvIFNsb3dCdWZmZXIobnVtKSwgYnkgZGVmYXVsdCBjcmVhdGVzIGEgbm9uLXplcm8tZmlsbGVkIEJ1ZmZlciBpbnN0YW5jZS5cbiAqL1xuQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIHJldHVybiBhbGxvY1Vuc2FmZShzaXplKVxufVxuXG5mdW5jdGlvbiBmcm9tU3RyaW5nIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmICh0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnIHx8IGVuY29kaW5nID09PSAnJykge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gIH1cblxuICBpZiAoIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgfVxuXG4gIGNvbnN0IGxlbmd0aCA9IGJ5dGVMZW5ndGgoc3RyaW5nLCBlbmNvZGluZykgfCAwXG4gIGxldCBidWYgPSBjcmVhdGVCdWZmZXIobGVuZ3RoKVxuXG4gIGNvbnN0IGFjdHVhbCA9IGJ1Zi53cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuXG4gIGlmIChhY3R1YWwgIT09IGxlbmd0aCkge1xuICAgIC8vIFdyaXRpbmcgYSBoZXggc3RyaW5nLCBmb3IgZXhhbXBsZSwgdGhhdCBjb250YWlucyBpbnZhbGlkIGNoYXJhY3RlcnMgd2lsbFxuICAgIC8vIGNhdXNlIGV2ZXJ5dGhpbmcgYWZ0ZXIgdGhlIGZpcnN0IGludmFsaWQgY2hhcmFjdGVyIHRvIGJlIGlnbm9yZWQuIChlLmcuXG4gICAgLy8gJ2FieHhjZCcgd2lsbCBiZSB0cmVhdGVkIGFzICdhYicpXG4gICAgYnVmID0gYnVmLnNsaWNlKDAsIGFjdHVhbClcbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5TGlrZSAoYXJyYXkpIHtcbiAgY29uc3QgbGVuZ3RoID0gYXJyYXkubGVuZ3RoIDwgMCA/IDAgOiBjaGVja2VkKGFycmF5Lmxlbmd0aCkgfCAwXG4gIGNvbnN0IGJ1ZiA9IGNyZWF0ZUJ1ZmZlcihsZW5ndGgpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICBidWZbaV0gPSBhcnJheVtpXSAmIDI1NVxuICB9XG4gIHJldHVybiBidWZcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5VmlldyAoYXJyYXlWaWV3KSB7XG4gIGlmIChpc0luc3RhbmNlKGFycmF5VmlldywgVWludDhBcnJheSkpIHtcbiAgICBjb25zdCBjb3B5ID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXlWaWV3KVxuICAgIHJldHVybiBmcm9tQXJyYXlCdWZmZXIoY29weS5idWZmZXIsIGNvcHkuYnl0ZU9mZnNldCwgY29weS5ieXRlTGVuZ3RoKVxuICB9XG4gIHJldHVybiBmcm9tQXJyYXlMaWtlKGFycmF5Vmlldylcbn1cblxuZnVuY3Rpb24gZnJvbUFycmF5QnVmZmVyIChhcnJheSwgYnl0ZU9mZnNldCwgbGVuZ3RoKSB7XG4gIGlmIChieXRlT2Zmc2V0IDwgMCB8fCBhcnJheS5ieXRlTGVuZ3RoIDwgYnl0ZU9mZnNldCkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdcIm9mZnNldFwiIGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kcycpXG4gIH1cblxuICBpZiAoYXJyYXkuYnl0ZUxlbmd0aCA8IGJ5dGVPZmZzZXQgKyAobGVuZ3RoIHx8IDApKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1wibGVuZ3RoXCIgaXMgb3V0c2lkZSBvZiBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGxldCBidWZcbiAgaWYgKGJ5dGVPZmZzZXQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgIGJ1ZiA9IG5ldyBVaW50OEFycmF5KGFycmF5KVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQpXG4gIH0gZWxzZSB7XG4gICAgYnVmID0gbmV3IFVpbnQ4QXJyYXkoYXJyYXksIGJ5dGVPZmZzZXQsIGxlbmd0aClcbiAgfVxuXG4gIC8vIFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlXG4gIE9iamVjdC5zZXRQcm90b3R5cGVPZihidWYsIEJ1ZmZlci5wcm90b3R5cGUpXG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG5mdW5jdGlvbiBmcm9tT2JqZWN0IChvYmopIHtcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihvYmopKSB7XG4gICAgY29uc3QgbGVuID0gY2hlY2tlZChvYmoubGVuZ3RoKSB8IDBcbiAgICBjb25zdCBidWYgPSBjcmVhdGVCdWZmZXIobGVuKVxuXG4gICAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBidWZcbiAgICB9XG5cbiAgICBvYmouY29weShidWYsIDAsIDAsIGxlbilcbiAgICByZXR1cm4gYnVmXG4gIH1cblxuICBpZiAob2JqLmxlbmd0aCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiBvYmoubGVuZ3RoICE9PSAnbnVtYmVyJyB8fCBudW1iZXJJc05hTihvYmoubGVuZ3RoKSkge1xuICAgICAgcmV0dXJuIGNyZWF0ZUJ1ZmZlcigwKVxuICAgIH1cbiAgICByZXR1cm4gZnJvbUFycmF5TGlrZShvYmopXG4gIH1cblxuICBpZiAob2JqLnR5cGUgPT09ICdCdWZmZXInICYmIEFycmF5LmlzQXJyYXkob2JqLmRhdGEpKSB7XG4gICAgcmV0dXJuIGZyb21BcnJheUxpa2Uob2JqLmRhdGEpXG4gIH1cbn1cblxuZnVuY3Rpb24gY2hlY2tlZCAobGVuZ3RoKSB7XG4gIC8vIE5vdGU6IGNhbm5vdCB1c2UgYGxlbmd0aCA8IEtfTUFYX0xFTkdUSGAgaGVyZSBiZWNhdXNlIHRoYXQgZmFpbHMgd2hlblxuICAvLyBsZW5ndGggaXMgTmFOICh3aGljaCBpcyBvdGhlcndpc2UgY29lcmNlZCB0byB6ZXJvLilcbiAgaWYgKGxlbmd0aCA+PSBLX01BWF9MRU5HVEgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignQXR0ZW1wdCB0byBhbGxvY2F0ZSBCdWZmZXIgbGFyZ2VyIHRoYW4gbWF4aW11bSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAnc2l6ZTogMHgnICsgS19NQVhfTEVOR1RILnRvU3RyaW5nKDE2KSArICcgYnl0ZXMnKVxuICB9XG4gIHJldHVybiBsZW5ndGggfCAwXG59XG5cbmZ1bmN0aW9uIFNsb3dCdWZmZXIgKGxlbmd0aCkge1xuICBpZiAoK2xlbmd0aCAhPSBsZW5ndGgpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBlcWVxZXFcbiAgICBsZW5ndGggPSAwXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlci5hbGxvYygrbGVuZ3RoKVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiBpc0J1ZmZlciAoYikge1xuICByZXR1cm4gYiAhPSBudWxsICYmIGIuX2lzQnVmZmVyID09PSB0cnVlICYmXG4gICAgYiAhPT0gQnVmZmVyLnByb3RvdHlwZSAvLyBzbyBCdWZmZXIuaXNCdWZmZXIoQnVmZmVyLnByb3RvdHlwZSkgd2lsbCBiZSBmYWxzZVxufVxuXG5CdWZmZXIuY29tcGFyZSA9IGZ1bmN0aW9uIGNvbXBhcmUgKGEsIGIpIHtcbiAgaWYgKGlzSW5zdGFuY2UoYSwgVWludDhBcnJheSkpIGEgPSBCdWZmZXIuZnJvbShhLCBhLm9mZnNldCwgYS5ieXRlTGVuZ3RoKVxuICBpZiAoaXNJbnN0YW5jZShiLCBVaW50OEFycmF5KSkgYiA9IEJ1ZmZlci5mcm9tKGIsIGIub2Zmc2V0LCBiLmJ5dGVMZW5ndGgpXG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGEpIHx8ICFCdWZmZXIuaXNCdWZmZXIoYikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcImJ1ZjFcIiwgXCJidWYyXCIgYXJndW1lbnRzIG11c3QgYmUgb25lIG9mIHR5cGUgQnVmZmVyIG9yIFVpbnQ4QXJyYXknXG4gICAgKVxuICB9XG5cbiAgaWYgKGEgPT09IGIpIHJldHVybiAwXG5cbiAgbGV0IHggPSBhLmxlbmd0aFxuICBsZXQgeSA9IGIubGVuZ3RoXG5cbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IE1hdGgubWluKHgsIHkpOyBpIDwgbGVuOyArK2kpIHtcbiAgICBpZiAoYVtpXSAhPT0gYltpXSkge1xuICAgICAgeCA9IGFbaV1cbiAgICAgIHkgPSBiW2ldXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuXG4gIGlmICh4IDwgeSkgcmV0dXJuIC0xXG4gIGlmICh5IDwgeCkgcmV0dXJuIDFcbiAgcmV0dXJuIDBcbn1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiBpc0VuY29kaW5nIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdsYXRpbjEnOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIGNvbmNhdCAobGlzdCwgbGVuZ3RoKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShsaXN0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wibGlzdFwiIGFyZ3VtZW50IG11c3QgYmUgYW4gQXJyYXkgb2YgQnVmZmVycycpXG4gIH1cblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gQnVmZmVyLmFsbG9jKDApXG4gIH1cblxuICBsZXQgaVxuICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICBsZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgIGxlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5hbGxvY1Vuc2FmZShsZW5ndGgpXG4gIGxldCBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgKytpKSB7XG4gICAgbGV0IGJ1ZiA9IGxpc3RbaV1cbiAgICBpZiAoaXNJbnN0YW5jZShidWYsIFVpbnQ4QXJyYXkpKSB7XG4gICAgICBpZiAocG9zICsgYnVmLmxlbmd0aCA+IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICAgICAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkgYnVmID0gQnVmZmVyLmZyb20oYnVmKVxuICAgICAgICBidWYuY29weShidWZmZXIsIHBvcylcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFVpbnQ4QXJyYXkucHJvdG90eXBlLnNldC5jYWxsKFxuICAgICAgICAgIGJ1ZmZlcixcbiAgICAgICAgICBidWYsXG4gICAgICAgICAgcG9zXG4gICAgICAgIClcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYnVmKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJsaXN0XCIgYXJndW1lbnQgbXVzdCBiZSBhbiBBcnJheSBvZiBCdWZmZXJzJylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmNvcHkoYnVmZmVyLCBwb3MpXG4gICAgfVxuICAgIHBvcyArPSBidWYubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZmZlclxufVxuXG5mdW5jdGlvbiBieXRlTGVuZ3RoIChzdHJpbmcsIGVuY29kaW5nKSB7XG4gIGlmIChCdWZmZXIuaXNCdWZmZXIoc3RyaW5nKSkge1xuICAgIHJldHVybiBzdHJpbmcubGVuZ3RoXG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhzdHJpbmcpIHx8IGlzSW5zdGFuY2Uoc3RyaW5nLCBBcnJheUJ1ZmZlcikpIHtcbiAgICByZXR1cm4gc3RyaW5nLmJ5dGVMZW5ndGhcbiAgfVxuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gJ3N0cmluZycpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFxuICAgICAgJ1RoZSBcInN0cmluZ1wiIGFyZ3VtZW50IG11c3QgYmUgb25lIG9mIHR5cGUgc3RyaW5nLCBCdWZmZXIsIG9yIEFycmF5QnVmZmVyLiAnICtcbiAgICAgICdSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2Ygc3RyaW5nXG4gICAgKVxuICB9XG5cbiAgY29uc3QgbGVuID0gc3RyaW5nLmxlbmd0aFxuICBjb25zdCBtdXN0TWF0Y2ggPSAoYXJndW1lbnRzLmxlbmd0aCA+IDIgJiYgYXJndW1lbnRzWzJdID09PSB0cnVlKVxuICBpZiAoIW11c3RNYXRjaCAmJiBsZW4gPT09IDApIHJldHVybiAwXG5cbiAgLy8gVXNlIGEgZm9yIGxvb3AgdG8gYXZvaWQgcmVjdXJzaW9uXG4gIGxldCBsb3dlcmVkQ2FzZSA9IGZhbHNlXG4gIGZvciAoOzspIHtcbiAgICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGxlblxuICAgICAgY2FzZSAndXRmOCc6XG4gICAgICBjYXNlICd1dGYtOCc6XG4gICAgICAgIHJldHVybiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aFxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIGxlbiAqIDJcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBsZW4gPj4+IDFcbiAgICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICAgIHJldHVybiBiYXNlNjRUb0J5dGVzKHN0cmluZykubGVuZ3RoXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHtcbiAgICAgICAgICByZXR1cm4gbXVzdE1hdGNoID8gLTEgOiB1dGY4VG9CeXRlcyhzdHJpbmcpLmxlbmd0aCAvLyBhc3N1bWUgdXRmOFxuICAgICAgICB9XG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGhcblxuZnVuY3Rpb24gc2xvd1RvU3RyaW5nIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICBsZXQgbG93ZXJlZENhc2UgPSBmYWxzZVxuXG4gIC8vIE5vIG5lZWQgdG8gdmVyaWZ5IHRoYXQgXCJ0aGlzLmxlbmd0aCA8PSBNQVhfVUlOVDMyXCIgc2luY2UgaXQncyBhIHJlYWQtb25seVxuICAvLyBwcm9wZXJ0eSBvZiBhIHR5cGVkIGFycmF5LlxuXG4gIC8vIFRoaXMgYmVoYXZlcyBuZWl0aGVyIGxpa2UgU3RyaW5nIG5vciBVaW50OEFycmF5IGluIHRoYXQgd2Ugc2V0IHN0YXJ0L2VuZFxuICAvLyB0byB0aGVpciB1cHBlci9sb3dlciBib3VuZHMgaWYgdGhlIHZhbHVlIHBhc3NlZCBpcyBvdXQgb2YgcmFuZ2UuXG4gIC8vIHVuZGVmaW5lZCBpcyBoYW5kbGVkIHNwZWNpYWxseSBhcyBwZXIgRUNNQS0yNjIgNnRoIEVkaXRpb24sXG4gIC8vIFNlY3Rpb24gMTMuMy4zLjcgUnVudGltZSBTZW1hbnRpY3M6IEtleWVkQmluZGluZ0luaXRpYWxpemF0aW9uLlxuICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCB8fCBzdGFydCA8IDApIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICAvLyBSZXR1cm4gZWFybHkgaWYgc3RhcnQgPiB0aGlzLmxlbmd0aC4gRG9uZSBoZXJlIHRvIHByZXZlbnQgcG90ZW50aWFsIHVpbnQzMlxuICAvLyBjb2VyY2lvbiBmYWlsIGJlbG93LlxuICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgaWYgKGVuZCA9PT0gdW5kZWZpbmVkIHx8IGVuZCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgfVxuXG4gIGlmIChlbmQgPD0gMCkge1xuICAgIHJldHVybiAnJ1xuICB9XG5cbiAgLy8gRm9yY2UgY29lcmNpb24gdG8gdWludDMyLiBUaGlzIHdpbGwgYWxzbyBjb2VyY2UgZmFsc2V5L05hTiB2YWx1ZXMgdG8gMC5cbiAgZW5kID4+Pj0gMFxuICBzdGFydCA+Pj49IDBcblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuICcnXG4gIH1cblxuICBpZiAoIWVuY29kaW5nKSBlbmNvZGluZyA9ICd1dGY4J1xuXG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmNvZGluZykge1xuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGhleFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gdXRmOFNsaWNlKHRoaXMsIHN0YXJ0LCBlbmQpXG5cbiAgICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgICAgcmV0dXJuIGFzY2lpU2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAnbGF0aW4xJzpcbiAgICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICAgIHJldHVybiBsYXRpbjFTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgICByZXR1cm4gYmFzZTY0U2xpY2UodGhpcywgc3RhcnQsIGVuZClcblxuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuIHV0ZjE2bGVTbGljZSh0aGlzLCBzdGFydCwgZW5kKVxuXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAobG93ZXJlZENhc2UpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1Vua25vd24gZW5jb2Rpbmc6ICcgKyBlbmNvZGluZylcbiAgICAgICAgZW5jb2RpbmcgPSAoZW5jb2RpbmcgKyAnJykudG9Mb3dlckNhc2UoKVxuICAgICAgICBsb3dlcmVkQ2FzZSA9IHRydWVcbiAgICB9XG4gIH1cbn1cblxuLy8gVGhpcyBwcm9wZXJ0eSBpcyB1c2VkIGJ5IGBCdWZmZXIuaXNCdWZmZXJgIChhbmQgdGhlIGBpcy1idWZmZXJgIG5wbSBwYWNrYWdlKVxuLy8gdG8gZGV0ZWN0IGEgQnVmZmVyIGluc3RhbmNlLiBJdCdzIG5vdCBwb3NzaWJsZSB0byB1c2UgYGluc3RhbmNlb2YgQnVmZmVyYFxuLy8gcmVsaWFibHkgaW4gYSBicm93c2VyaWZ5IGNvbnRleHQgYmVjYXVzZSB0aGVyZSBjb3VsZCBiZSBtdWx0aXBsZSBkaWZmZXJlbnRcbi8vIGNvcGllcyBvZiB0aGUgJ2J1ZmZlcicgcGFja2FnZSBpbiB1c2UuIFRoaXMgbWV0aG9kIHdvcmtzIGV2ZW4gZm9yIEJ1ZmZlclxuLy8gaW5zdGFuY2VzIHRoYXQgd2VyZSBjcmVhdGVkIGZyb20gYW5vdGhlciBjb3B5IG9mIHRoZSBgYnVmZmVyYCBwYWNrYWdlLlxuLy8gU2VlOiBodHRwczovL2dpdGh1Yi5jb20vZmVyb3NzL2J1ZmZlci9pc3N1ZXMvMTU0XG5CdWZmZXIucHJvdG90eXBlLl9pc0J1ZmZlciA9IHRydWVcblxuZnVuY3Rpb24gc3dhcCAoYiwgbiwgbSkge1xuICBjb25zdCBpID0gYltuXVxuICBiW25dID0gYlttXVxuICBiW21dID0gaVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAxNiA9IGZ1bmN0aW9uIHN3YXAxNiAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSAyICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAxNi1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSAyKSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMSlcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXAzMiA9IGZ1bmN0aW9uIHN3YXAzMiAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA0ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiAzMi1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSA0KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgMylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgMilcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnN3YXA2NCA9IGZ1bmN0aW9uIHN3YXA2NCAoKSB7XG4gIGNvbnN0IGxlbiA9IHRoaXMubGVuZ3RoXG4gIGlmIChsZW4gJSA4ICE9PSAwKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0J1ZmZlciBzaXplIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA2NC1iaXRzJylcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSArPSA4KSB7XG4gICAgc3dhcCh0aGlzLCBpLCBpICsgNylcbiAgICBzd2FwKHRoaXMsIGkgKyAxLCBpICsgNilcbiAgICBzd2FwKHRoaXMsIGkgKyAyLCBpICsgNSlcbiAgICBzd2FwKHRoaXMsIGkgKyAzLCBpICsgNClcbiAgfVxuICByZXR1cm4gdGhpc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcgKCkge1xuICBjb25zdCBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICBpZiAobGVuZ3RoID09PSAwKSByZXR1cm4gJydcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHJldHVybiB1dGY4U2xpY2UodGhpcywgMCwgbGVuZ3RoKVxuICByZXR1cm4gc2xvd1RvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cylcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0xvY2FsZVN0cmluZyA9IEJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmdcblxuQnVmZmVyLnByb3RvdHlwZS5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMgKGIpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIoYikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBCdWZmZXInKVxuICBpZiAodGhpcyA9PT0gYikgcmV0dXJuIHRydWVcbiAgcmV0dXJuIEJ1ZmZlci5jb21wYXJlKHRoaXMsIGIpID09PSAwXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uIGluc3BlY3QgKCkge1xuICBsZXQgc3RyID0gJydcbiAgY29uc3QgbWF4ID0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFU1xuICBzdHIgPSB0aGlzLnRvU3RyaW5nKCdoZXgnLCAwLCBtYXgpLnJlcGxhY2UoLyguezJ9KS9nLCAnJDEgJykudHJpbSgpXG4gIGlmICh0aGlzLmxlbmd0aCA+IG1heCkgc3RyICs9ICcgLi4uICdcbiAgcmV0dXJuICc8QnVmZmVyICcgKyBzdHIgKyAnPidcbn1cbmlmIChjdXN0b21JbnNwZWN0U3ltYm9sKSB7XG4gIEJ1ZmZlci5wcm90b3R5cGVbY3VzdG9tSW5zcGVjdFN5bWJvbF0gPSBCdWZmZXIucHJvdG90eXBlLmluc3BlY3Rcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5jb21wYXJlID0gZnVuY3Rpb24gY29tcGFyZSAodGFyZ2V0LCBzdGFydCwgZW5kLCB0aGlzU3RhcnQsIHRoaXNFbmQpIHtcbiAgaWYgKGlzSW5zdGFuY2UodGFyZ2V0LCBVaW50OEFycmF5KSkge1xuICAgIHRhcmdldCA9IEJ1ZmZlci5mcm9tKHRhcmdldCwgdGFyZ2V0Lm9mZnNldCwgdGFyZ2V0LmJ5dGVMZW5ndGgpXG4gIH1cbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAnVGhlIFwidGFyZ2V0XCIgYXJndW1lbnQgbXVzdCBiZSBvbmUgb2YgdHlwZSBCdWZmZXIgb3IgVWludDhBcnJheS4gJyArXG4gICAgICAnUmVjZWl2ZWQgdHlwZSAnICsgKHR5cGVvZiB0YXJnZXQpXG4gICAgKVxuICB9XG5cbiAgaWYgKHN0YXJ0ID09PSB1bmRlZmluZWQpIHtcbiAgICBzdGFydCA9IDBcbiAgfVxuICBpZiAoZW5kID09PSB1bmRlZmluZWQpIHtcbiAgICBlbmQgPSB0YXJnZXQgPyB0YXJnZXQubGVuZ3RoIDogMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRoaXNTdGFydCA9IDBcbiAgfVxuICBpZiAodGhpc0VuZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdGhpc0VuZCA9IHRoaXMubGVuZ3RoXG4gIH1cblxuICBpZiAoc3RhcnQgPCAwIHx8IGVuZCA+IHRhcmdldC5sZW5ndGggfHwgdGhpc1N0YXJ0IDwgMCB8fCB0aGlzRW5kID4gdGhpcy5sZW5ndGgpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb3V0IG9mIHJhbmdlIGluZGV4JylcbiAgfVxuXG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCAmJiBzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMFxuICB9XG4gIGlmICh0aGlzU3RhcnQgPj0gdGhpc0VuZCkge1xuICAgIHJldHVybiAtMVxuICB9XG4gIGlmIChzdGFydCA+PSBlbmQpIHtcbiAgICByZXR1cm4gMVxuICB9XG5cbiAgc3RhcnQgPj4+PSAwXG4gIGVuZCA+Pj49IDBcbiAgdGhpc1N0YXJ0ID4+Pj0gMFxuICB0aGlzRW5kID4+Pj0gMFxuXG4gIGlmICh0aGlzID09PSB0YXJnZXQpIHJldHVybiAwXG5cbiAgbGV0IHggPSB0aGlzRW5kIC0gdGhpc1N0YXJ0XG4gIGxldCB5ID0gZW5kIC0gc3RhcnRcbiAgY29uc3QgbGVuID0gTWF0aC5taW4oeCwgeSlcblxuICBjb25zdCB0aGlzQ29weSA9IHRoaXMuc2xpY2UodGhpc1N0YXJ0LCB0aGlzRW5kKVxuICBjb25zdCB0YXJnZXRDb3B5ID0gdGFyZ2V0LnNsaWNlKHN0YXJ0LCBlbmQpXG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgIGlmICh0aGlzQ29weVtpXSAhPT0gdGFyZ2V0Q29weVtpXSkge1xuICAgICAgeCA9IHRoaXNDb3B5W2ldXG4gICAgICB5ID0gdGFyZ2V0Q29weVtpXVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoeCA8IHkpIHJldHVybiAtMVxuICBpZiAoeSA8IHgpIHJldHVybiAxXG4gIHJldHVybiAwXG59XG5cbi8vIEZpbmRzIGVpdGhlciB0aGUgZmlyc3QgaW5kZXggb2YgYHZhbGAgaW4gYGJ1ZmZlcmAgYXQgb2Zmc2V0ID49IGBieXRlT2Zmc2V0YCxcbi8vIE9SIHRoZSBsYXN0IGluZGV4IG9mIGB2YWxgIGluIGBidWZmZXJgIGF0IG9mZnNldCA8PSBgYnl0ZU9mZnNldGAuXG4vL1xuLy8gQXJndW1lbnRzOlxuLy8gLSBidWZmZXIgLSBhIEJ1ZmZlciB0byBzZWFyY2hcbi8vIC0gdmFsIC0gYSBzdHJpbmcsIEJ1ZmZlciwgb3IgbnVtYmVyXG4vLyAtIGJ5dGVPZmZzZXQgLSBhbiBpbmRleCBpbnRvIGBidWZmZXJgOyB3aWxsIGJlIGNsYW1wZWQgdG8gYW4gaW50MzJcbi8vIC0gZW5jb2RpbmcgLSBhbiBvcHRpb25hbCBlbmNvZGluZywgcmVsZXZhbnQgaXMgdmFsIGlzIGEgc3RyaW5nXG4vLyAtIGRpciAtIHRydWUgZm9yIGluZGV4T2YsIGZhbHNlIGZvciBsYXN0SW5kZXhPZlxuZnVuY3Rpb24gYmlkaXJlY3Rpb25hbEluZGV4T2YgKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZywgZGlyKSB7XG4gIC8vIEVtcHR5IGJ1ZmZlciBtZWFucyBubyBtYXRjaFxuICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIC0xXG5cbiAgLy8gTm9ybWFsaXplIGJ5dGVPZmZzZXRcbiAgaWYgKHR5cGVvZiBieXRlT2Zmc2V0ID09PSAnc3RyaW5nJykge1xuICAgIGVuY29kaW5nID0gYnl0ZU9mZnNldFxuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gZWxzZSBpZiAoYnl0ZU9mZnNldCA+IDB4N2ZmZmZmZmYpIHtcbiAgICBieXRlT2Zmc2V0ID0gMHg3ZmZmZmZmZlxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAtMHg4MDAwMDAwMCkge1xuICAgIGJ5dGVPZmZzZXQgPSAtMHg4MDAwMDAwMFxuICB9XG4gIGJ5dGVPZmZzZXQgPSArYnl0ZU9mZnNldCAvLyBDb2VyY2UgdG8gTnVtYmVyLlxuICBpZiAobnVtYmVySXNOYU4oYnl0ZU9mZnNldCkpIHtcbiAgICAvLyBieXRlT2Zmc2V0OiBpdCBpdCdzIHVuZGVmaW5lZCwgbnVsbCwgTmFOLCBcImZvb1wiLCBldGMsIHNlYXJjaCB3aG9sZSBidWZmZXJcbiAgICBieXRlT2Zmc2V0ID0gZGlyID8gMCA6IChidWZmZXIubGVuZ3RoIC0gMSlcbiAgfVxuXG4gIC8vIE5vcm1hbGl6ZSBieXRlT2Zmc2V0OiBuZWdhdGl2ZSBvZmZzZXRzIHN0YXJ0IGZyb20gdGhlIGVuZCBvZiB0aGUgYnVmZmVyXG4gIGlmIChieXRlT2Zmc2V0IDwgMCkgYnl0ZU9mZnNldCA9IGJ1ZmZlci5sZW5ndGggKyBieXRlT2Zmc2V0XG4gIGlmIChieXRlT2Zmc2V0ID49IGJ1ZmZlci5sZW5ndGgpIHtcbiAgICBpZiAoZGlyKSByZXR1cm4gLTFcbiAgICBlbHNlIGJ5dGVPZmZzZXQgPSBidWZmZXIubGVuZ3RoIC0gMVxuICB9IGVsc2UgaWYgKGJ5dGVPZmZzZXQgPCAwKSB7XG4gICAgaWYgKGRpcikgYnl0ZU9mZnNldCA9IDBcbiAgICBlbHNlIHJldHVybiAtMVxuICB9XG5cbiAgLy8gTm9ybWFsaXplIHZhbFxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWwgPSBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICB9XG5cbiAgLy8gRmluYWxseSwgc2VhcmNoIGVpdGhlciBpbmRleE9mIChpZiBkaXIgaXMgdHJ1ZSkgb3IgbGFzdEluZGV4T2ZcbiAgaWYgKEJ1ZmZlci5pc0J1ZmZlcih2YWwpKSB7XG4gICAgLy8gU3BlY2lhbCBjYXNlOiBsb29raW5nIGZvciBlbXB0eSBzdHJpbmcvYnVmZmVyIGFsd2F5cyBmYWlsc1xuICAgIGlmICh2YWwubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gLTFcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5SW5kZXhPZihidWZmZXIsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDB4RkYgLy8gU2VhcmNoIGZvciBhIGJ5dGUgdmFsdWUgWzAtMjU1XVxuICAgIGlmICh0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaWYgKGRpcikge1xuICAgICAgICByZXR1cm4gVWludDhBcnJheS5wcm90b3R5cGUuaW5kZXhPZi5jYWxsKGJ1ZmZlciwgdmFsLCBieXRlT2Zmc2V0KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFVpbnQ4QXJyYXkucHJvdG90eXBlLmxhc3RJbmRleE9mLmNhbGwoYnVmZmVyLCB2YWwsIGJ5dGVPZmZzZXQpXG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcnJheUluZGV4T2YoYnVmZmVyLCBbdmFsXSwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGRpcilcbiAgfVxuXG4gIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ZhbCBtdXN0IGJlIHN0cmluZywgbnVtYmVyIG9yIEJ1ZmZlcicpXG59XG5cbmZ1bmN0aW9uIGFycmF5SW5kZXhPZiAoYXJyLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCBkaXIpIHtcbiAgbGV0IGluZGV4U2l6ZSA9IDFcbiAgbGV0IGFyckxlbmd0aCA9IGFyci5sZW5ndGhcbiAgbGV0IHZhbExlbmd0aCA9IHZhbC5sZW5ndGhcblxuICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpXG4gICAgaWYgKGVuY29kaW5nID09PSAndWNzMicgfHwgZW5jb2RpbmcgPT09ICd1Y3MtMicgfHxcbiAgICAgICAgZW5jb2RpbmcgPT09ICd1dGYxNmxlJyB8fCBlbmNvZGluZyA9PT0gJ3V0Zi0xNmxlJykge1xuICAgICAgaWYgKGFyci5sZW5ndGggPCAyIHx8IHZhbC5sZW5ndGggPCAyKSB7XG4gICAgICAgIHJldHVybiAtMVxuICAgICAgfVxuICAgICAgaW5kZXhTaXplID0gMlxuICAgICAgYXJyTGVuZ3RoIC89IDJcbiAgICAgIHZhbExlbmd0aCAvPSAyXG4gICAgICBieXRlT2Zmc2V0IC89IDJcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiByZWFkIChidWYsIGkpIHtcbiAgICBpZiAoaW5kZXhTaXplID09PSAxKSB7XG4gICAgICByZXR1cm4gYnVmW2ldXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBidWYucmVhZFVJbnQxNkJFKGkgKiBpbmRleFNpemUpXG4gICAgfVxuICB9XG5cbiAgbGV0IGlcbiAgaWYgKGRpcikge1xuICAgIGxldCBmb3VuZEluZGV4ID0gLTFcbiAgICBmb3IgKGkgPSBieXRlT2Zmc2V0OyBpIDwgYXJyTGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChyZWFkKGFyciwgaSkgPT09IHJlYWQodmFsLCBmb3VuZEluZGV4ID09PSAtMSA/IDAgOiBpIC0gZm91bmRJbmRleCkpIHtcbiAgICAgICAgaWYgKGZvdW5kSW5kZXggPT09IC0xKSBmb3VuZEluZGV4ID0gaVxuICAgICAgICBpZiAoaSAtIGZvdW5kSW5kZXggKyAxID09PSB2YWxMZW5ndGgpIHJldHVybiBmb3VuZEluZGV4ICogaW5kZXhTaXplXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoZm91bmRJbmRleCAhPT0gLTEpIGkgLT0gaSAtIGZvdW5kSW5kZXhcbiAgICAgICAgZm91bmRJbmRleCA9IC0xXG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmIChieXRlT2Zmc2V0ICsgdmFsTGVuZ3RoID4gYXJyTGVuZ3RoKSBieXRlT2Zmc2V0ID0gYXJyTGVuZ3RoIC0gdmFsTGVuZ3RoXG4gICAgZm9yIChpID0gYnl0ZU9mZnNldDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBmb3VuZCA9IHRydWVcbiAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdmFsTGVuZ3RoOyBqKyspIHtcbiAgICAgICAgaWYgKHJlYWQoYXJyLCBpICsgaikgIT09IHJlYWQodmFsLCBqKSkge1xuICAgICAgICAgIGZvdW5kID0gZmFsc2VcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoZm91bmQpIHJldHVybiBpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIC0xXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyAodmFsLCBieXRlT2Zmc2V0LCBlbmNvZGluZykge1xuICByZXR1cm4gdGhpcy5pbmRleE9mKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpICE9PSAtMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiBpbmRleE9mICh2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nKSB7XG4gIHJldHVybiBiaWRpcmVjdGlvbmFsSW5kZXhPZih0aGlzLCB2YWwsIGJ5dGVPZmZzZXQsIGVuY29kaW5nLCB0cnVlKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmxhc3RJbmRleE9mID0gZnVuY3Rpb24gbGFzdEluZGV4T2YgKHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcpIHtcbiAgcmV0dXJuIGJpZGlyZWN0aW9uYWxJbmRleE9mKHRoaXMsIHZhbCwgYnl0ZU9mZnNldCwgZW5jb2RpbmcsIGZhbHNlKVxufVxuXG5mdW5jdGlvbiBoZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgY29uc3QgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGxldCBpXG4gIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7ICsraSkge1xuICAgIGNvbnN0IHBhcnNlZCA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBpZiAobnVtYmVySXNOYU4ocGFyc2VkKSkgcmV0dXJuIGlcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBwYXJzZWRcbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiB1dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBhc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIGJhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB1Y3MyV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcsIGJ1Zi5sZW5ndGggLSBvZmZzZXQpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gd3JpdGUgKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcpXG4gIGlmIChvZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgbGVuZ3RoID0gdGhpcy5sZW5ndGhcbiAgICBvZmZzZXQgPSAwXG4gIC8vIEJ1ZmZlciN3cml0ZShzdHJpbmcsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKGxlbmd0aCA9PT0gdW5kZWZpbmVkICYmIHR5cGVvZiBvZmZzZXQgPT09ICdzdHJpbmcnKSB7XG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBsZW5ndGggPSB0aGlzLmxlbmd0aFxuICAgIG9mZnNldCA9IDBcbiAgLy8gQnVmZmVyI3dyaXRlKHN0cmluZywgb2Zmc2V0WywgbGVuZ3RoXVssIGVuY29kaW5nXSlcbiAgfSBlbHNlIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gICAgaWYgKGlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGxlbmd0aCA9IGxlbmd0aCA+Pj4gMFxuICAgICAgaWYgKGVuY29kaW5nID09PSB1bmRlZmluZWQpIGVuY29kaW5nID0gJ3V0ZjgnXG4gICAgfSBlbHNlIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgJ0J1ZmZlci53cml0ZShzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXRbLCBsZW5ndGhdKSBpcyBubyBsb25nZXIgc3VwcG9ydGVkJ1xuICAgIClcbiAgfVxuXG4gIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmIChsZW5ndGggPT09IHVuZGVmaW5lZCB8fCBsZW5ndGggPiByZW1haW5pbmcpIGxlbmd0aCA9IHJlbWFpbmluZ1xuXG4gIGlmICgoc3RyaW5nLmxlbmd0aCA+IDAgJiYgKGxlbmd0aCA8IDAgfHwgb2Zmc2V0IDwgMCkpIHx8IG9mZnNldCA+IHRoaXMubGVuZ3RoKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0F0dGVtcHQgdG8gd3JpdGUgb3V0c2lkZSBidWZmZXIgYm91bmRzJylcbiAgfVxuXG4gIGlmICghZW5jb2RpbmcpIGVuY29kaW5nID0gJ3V0ZjgnXG5cbiAgbGV0IGxvd2VyZWRDYXNlID0gZmFsc2VcbiAgZm9yICg7Oykge1xuICAgIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICAgIGNhc2UgJ2hleCc6XG4gICAgICAgIHJldHVybiBoZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICd1dGY4JzpcbiAgICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgICAgcmV0dXJuIHV0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuXG4gICAgICBjYXNlICdhc2NpaSc6XG4gICAgICBjYXNlICdsYXRpbjEnOlxuICAgICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgICAgcmV0dXJuIGFzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgICAgLy8gV2FybmluZzogbWF4TGVuZ3RoIG5vdCB0YWtlbiBpbnRvIGFjY291bnQgaW4gYmFzZTY0V3JpdGVcbiAgICAgICAgcmV0dXJuIGJhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG5cbiAgICAgIGNhc2UgJ3VjczInOlxuICAgICAgY2FzZSAndWNzLTInOlxuICAgICAgY2FzZSAndXRmMTZsZSc6XG4gICAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICAgIHJldHVybiB1Y3MyV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcblxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKGxvd2VyZWRDYXNlKSB0aHJvdyBuZXcgVHlwZUVycm9yKCdVbmtub3duIGVuY29kaW5nOiAnICsgZW5jb2RpbmcpXG4gICAgICAgIGVuY29kaW5nID0gKCcnICsgZW5jb2RpbmcpLnRvTG93ZXJDYXNlKClcbiAgICAgICAgbG93ZXJlZENhc2UgPSB0cnVlXG4gICAgfVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gdG9KU09OICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG5mdW5jdGlvbiBiYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuICBjb25zdCByZXMgPSBbXVxuXG4gIGxldCBpID0gc3RhcnRcbiAgd2hpbGUgKGkgPCBlbmQpIHtcbiAgICBjb25zdCBmaXJzdEJ5dGUgPSBidWZbaV1cbiAgICBsZXQgY29kZVBvaW50ID0gbnVsbFxuICAgIGxldCBieXRlc1BlclNlcXVlbmNlID0gKGZpcnN0Qnl0ZSA+IDB4RUYpXG4gICAgICA/IDRcbiAgICAgIDogKGZpcnN0Qnl0ZSA+IDB4REYpXG4gICAgICAgICAgPyAzXG4gICAgICAgICAgOiAoZmlyc3RCeXRlID4gMHhCRilcbiAgICAgICAgICAgICAgPyAyXG4gICAgICAgICAgICAgIDogMVxuXG4gICAgaWYgKGkgKyBieXRlc1BlclNlcXVlbmNlIDw9IGVuZCkge1xuICAgICAgbGV0IHNlY29uZEJ5dGUsIHRoaXJkQnl0ZSwgZm91cnRoQnl0ZSwgdGVtcENvZGVQb2ludFxuXG4gICAgICBzd2l0Y2ggKGJ5dGVzUGVyU2VxdWVuY2UpIHtcbiAgICAgICAgY2FzZSAxOlxuICAgICAgICAgIGlmIChmaXJzdEJ5dGUgPCAweDgwKSB7XG4gICAgICAgICAgICBjb2RlUG9pbnQgPSBmaXJzdEJ5dGVcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAyOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHgxRikgPDwgMHg2IHwgKHNlY29uZEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweDdGKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAzOlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGlmICgoc2Vjb25kQnl0ZSAmIDB4QzApID09PSAweDgwICYmICh0aGlyZEJ5dGUgJiAweEMwKSA9PT0gMHg4MCkge1xuICAgICAgICAgICAgdGVtcENvZGVQb2ludCA9IChmaXJzdEJ5dGUgJiAweEYpIDw8IDB4QyB8IChzZWNvbmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKHRoaXJkQnl0ZSAmIDB4M0YpXG4gICAgICAgICAgICBpZiAodGVtcENvZGVQb2ludCA+IDB4N0ZGICYmICh0ZW1wQ29kZVBvaW50IDwgMHhEODAwIHx8IHRlbXBDb2RlUG9pbnQgPiAweERGRkYpKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSA0OlxuICAgICAgICAgIHNlY29uZEJ5dGUgPSBidWZbaSArIDFdXG4gICAgICAgICAgdGhpcmRCeXRlID0gYnVmW2kgKyAyXVxuICAgICAgICAgIGZvdXJ0aEJ5dGUgPSBidWZbaSArIDNdXG4gICAgICAgICAgaWYgKChzZWNvbmRCeXRlICYgMHhDMCkgPT09IDB4ODAgJiYgKHRoaXJkQnl0ZSAmIDB4QzApID09PSAweDgwICYmIChmb3VydGhCeXRlICYgMHhDMCkgPT09IDB4ODApIHtcbiAgICAgICAgICAgIHRlbXBDb2RlUG9pbnQgPSAoZmlyc3RCeXRlICYgMHhGKSA8PCAweDEyIHwgKHNlY29uZEJ5dGUgJiAweDNGKSA8PCAweEMgfCAodGhpcmRCeXRlICYgMHgzRikgPDwgMHg2IHwgKGZvdXJ0aEJ5dGUgJiAweDNGKVxuICAgICAgICAgICAgaWYgKHRlbXBDb2RlUG9pbnQgPiAweEZGRkYgJiYgdGVtcENvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICAgICAgICAgIGNvZGVQb2ludCA9IHRlbXBDb2RlUG9pbnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNvZGVQb2ludCA9PT0gbnVsbCkge1xuICAgICAgLy8gd2UgZGlkIG5vdCBnZW5lcmF0ZSBhIHZhbGlkIGNvZGVQb2ludCBzbyBpbnNlcnQgYVxuICAgICAgLy8gcmVwbGFjZW1lbnQgY2hhciAoVStGRkZEKSBhbmQgYWR2YW5jZSBvbmx5IDEgYnl0ZVxuICAgICAgY29kZVBvaW50ID0gMHhGRkZEXG4gICAgICBieXRlc1BlclNlcXVlbmNlID0gMVxuICAgIH0gZWxzZSBpZiAoY29kZVBvaW50ID4gMHhGRkZGKSB7XG4gICAgICAvLyBlbmNvZGUgdG8gdXRmMTYgKHN1cnJvZ2F0ZSBwYWlyIGRhbmNlKVxuICAgICAgY29kZVBvaW50IC09IDB4MTAwMDBcbiAgICAgIHJlcy5wdXNoKGNvZGVQb2ludCA+Pj4gMTAgJiAweDNGRiB8IDB4RDgwMClcbiAgICAgIGNvZGVQb2ludCA9IDB4REMwMCB8IGNvZGVQb2ludCAmIDB4M0ZGXG4gICAgfVxuXG4gICAgcmVzLnB1c2goY29kZVBvaW50KVxuICAgIGkgKz0gYnl0ZXNQZXJTZXF1ZW5jZVxuICB9XG5cbiAgcmV0dXJuIGRlY29kZUNvZGVQb2ludHNBcnJheShyZXMpXG59XG5cbi8vIEJhc2VkIG9uIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzIyNzQ3MjcyLzY4MDc0MiwgdGhlIGJyb3dzZXIgd2l0aFxuLy8gdGhlIGxvd2VzdCBsaW1pdCBpcyBDaHJvbWUsIHdpdGggMHgxMDAwMCBhcmdzLlxuLy8gV2UgZ28gMSBtYWduaXR1ZGUgbGVzcywgZm9yIHNhZmV0eVxuY29uc3QgTUFYX0FSR1VNRU5UU19MRU5HVEggPSAweDEwMDBcblxuZnVuY3Rpb24gZGVjb2RlQ29kZVBvaW50c0FycmF5IChjb2RlUG9pbnRzKSB7XG4gIGNvbnN0IGxlbiA9IGNvZGVQb2ludHMubGVuZ3RoXG4gIGlmIChsZW4gPD0gTUFYX0FSR1VNRU5UU19MRU5HVEgpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShTdHJpbmcsIGNvZGVQb2ludHMpIC8vIGF2b2lkIGV4dHJhIHNsaWNlKClcbiAgfVxuXG4gIC8vIERlY29kZSBpbiBjaHVua3MgdG8gYXZvaWQgXCJjYWxsIHN0YWNrIHNpemUgZXhjZWVkZWRcIi5cbiAgbGV0IHJlcyA9ICcnXG4gIGxldCBpID0gMFxuICB3aGlsZSAoaSA8IGxlbikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFxuICAgICAgU3RyaW5nLFxuICAgICAgY29kZVBvaW50cy5zbGljZShpLCBpICs9IE1BWF9BUkdVTUVOVFNfTEVOR1RIKVxuICAgIClcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbmZ1bmN0aW9uIGFzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBsZXQgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAobGV0IGkgPSBzdGFydDsgaSA8IGVuZDsgKytpKSB7XG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldICYgMHg3RilcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGxhdGluMVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgbGV0IHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIGhleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgY29uc3QgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIGxldCBvdXQgPSAnJ1xuICBmb3IgKGxldCBpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgIG91dCArPSBoZXhTbGljZUxvb2t1cFRhYmxlW2J1ZltpXV1cbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGNvbnN0IGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIGxldCByZXMgPSAnJ1xuICAvLyBJZiBieXRlcy5sZW5ndGggaXMgb2RkLCB0aGUgbGFzdCA4IGJpdHMgbXVzdCBiZSBpZ25vcmVkIChzYW1lIGFzIG5vZGUuanMpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoIC0gMTsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyAoYnl0ZXNbaSArIDFdICogMjU2KSlcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiBzbGljZSAoc3RhcnQsIGVuZCkge1xuICBjb25zdCBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IH5+c3RhcnRcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB+fmVuZFxuXG4gIGlmIChzdGFydCA8IDApIHtcbiAgICBzdGFydCArPSBsZW5cbiAgICBpZiAoc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgfSBlbHNlIGlmIChzdGFydCA+IGxlbikge1xuICAgIHN0YXJ0ID0gbGVuXG4gIH1cblxuICBpZiAoZW5kIDwgMCkge1xuICAgIGVuZCArPSBsZW5cbiAgICBpZiAoZW5kIDwgMCkgZW5kID0gMFxuICB9IGVsc2UgaWYgKGVuZCA+IGxlbikge1xuICAgIGVuZCA9IGxlblxuICB9XG5cbiAgaWYgKGVuZCA8IHN0YXJ0KSBlbmQgPSBzdGFydFxuXG4gIGNvbnN0IG5ld0J1ZiA9IHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZClcbiAgLy8gUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2VcbiAgT2JqZWN0LnNldFByb3RvdHlwZU9mKG5ld0J1ZiwgQnVmZmVyLnByb3RvdHlwZSlcblxuICByZXR1cm4gbmV3QnVmXG59XG5cbi8qXG4gKiBOZWVkIHRvIG1ha2Ugc3VyZSB0aGF0IGJ1ZmZlciBpc24ndCB0cnlpbmcgdG8gd3JpdGUgb3V0IG9mIGJvdW5kcy5cbiAqL1xuZnVuY3Rpb24gY2hlY2tPZmZzZXQgKG9mZnNldCwgZXh0LCBsZW5ndGgpIHtcbiAgaWYgKChvZmZzZXQgJSAxKSAhPT0gMCB8fCBvZmZzZXQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignb2Zmc2V0IGlzIG5vdCB1aW50JylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RyeWluZyB0byBhY2Nlc3MgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50TEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludExFID0gZnVuY3Rpb24gcmVhZFVJbnRMRSAob2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcblxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXRdXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB3aGlsZSAoKytpIDwgYnl0ZUxlbmd0aCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIGldICogbXVsXG4gIH1cblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnRCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50QkUgPSBmdW5jdGlvbiByZWFkVUludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgY2hlY2tPZmZzZXQob2Zmc2V0LCBieXRlTGVuZ3RoLCB0aGlzLmxlbmd0aClcbiAgfVxuXG4gIGxldCB2YWwgPSB0aGlzW29mZnNldCArIC0tYnl0ZUxlbmd0aF1cbiAgbGV0IG11bCA9IDFcbiAgd2hpbGUgKGJ5dGVMZW5ndGggPiAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgdmFsICs9IHRoaXNbb2Zmc2V0ICsgLS1ieXRlTGVuZ3RoXSAqIG11bFxuICB9XG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50OCA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIHJlYWRVSW50OCAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAxLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MTZMRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIHJlYWRVSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XSB8ICh0aGlzW29mZnNldCArIDFdIDw8IDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gcmVhZFVJbnQxNkJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDIsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCA4KSB8IHRoaXNbb2Zmc2V0ICsgMV1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVWludDMyTEUgPVxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiByZWFkVUludDMyTEUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG5cbiAgcmV0dXJuICgodGhpc1tvZmZzZXRdKSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAxXSA8PCA4KSB8XG4gICAgICAodGhpc1tvZmZzZXQgKyAyXSA8PCAxNikpICtcbiAgICAgICh0aGlzW29mZnNldCArIDNdICogMHgxMDAwMDAwKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVaW50MzJCRSA9XG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIHJlYWRVSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSAqIDB4MTAwMDAwMCkgK1xuICAgICgodGhpc1tvZmZzZXQgKyAxXSA8PCAxNikgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDgpIHxcbiAgICB0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdVSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnVUludDY0TEUgKG9mZnNldCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgY29uc3QgZmlyc3QgPSB0aGlzW29mZnNldF1cbiAgY29uc3QgbGFzdCA9IHRoaXNbb2Zmc2V0ICsgN11cbiAgaWYgKGZpcnN0ID09PSB1bmRlZmluZWQgfHwgbGFzdCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYm91bmRzRXJyb3Iob2Zmc2V0LCB0aGlzLmxlbmd0aCAtIDgpXG4gIH1cblxuICBjb25zdCBsbyA9IGZpcnN0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMjRcblxuICBjb25zdCBoaSA9IHRoaXNbKytvZmZzZXRdICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICBsYXN0ICogMiAqKiAyNFxuXG4gIHJldHVybiBCaWdJbnQobG8pICsgKEJpZ0ludChoaSkgPDwgQmlnSW50KDMyKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEJpZ1VJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdVSW50NjRCRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IGhpID0gZmlyc3QgKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICB0aGlzWysrb2Zmc2V0XVxuXG4gIGNvbnN0IGxvID0gdGhpc1srK29mZnNldF0gKiAyICoqIDI0ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogMTYgK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiA4ICtcbiAgICBsYXN0XG5cbiAgcmV0dXJuIChCaWdJbnQoaGkpIDw8IEJpZ0ludCgzMikpICsgQmlnSW50KGxvKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50TEUgPSBmdW5jdGlvbiByZWFkSW50TEUgKG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgYnl0ZUxlbmd0aCwgdGhpcy5sZW5ndGgpXG5cbiAgbGV0IHZhbCA9IHRoaXNbb2Zmc2V0XVxuICBsZXQgbXVsID0gMVxuICBsZXQgaSA9IDBcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB2YWwgKz0gdGhpc1tvZmZzZXQgKyBpXSAqIG11bFxuICB9XG4gIG11bCAqPSAweDgwXG5cbiAgaWYgKHZhbCA+PSBtdWwpIHZhbCAtPSBNYXRoLnBvdygyLCA4ICogYnl0ZUxlbmd0aClcblxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludEJFID0gZnVuY3Rpb24gcmVhZEludEJFIChvZmZzZXQsIGJ5dGVMZW5ndGgsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBieXRlTGVuZ3RoID0gYnl0ZUxlbmd0aCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIGJ5dGVMZW5ndGgsIHRoaXMubGVuZ3RoKVxuXG4gIGxldCBpID0gYnl0ZUxlbmd0aFxuICBsZXQgbXVsID0gMVxuICBsZXQgdmFsID0gdGhpc1tvZmZzZXQgKyAtLWldXG4gIHdoaWxlIChpID4gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHZhbCArPSB0aGlzW29mZnNldCArIC0taV0gKiBtdWxcbiAgfVxuICBtdWwgKj0gMHg4MFxuXG4gIGlmICh2YWwgPj0gbXVsKSB2YWwgLT0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpXG5cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gcmVhZEludDggKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMSwgdGhpcy5sZW5ndGgpXG4gIGlmICghKHRoaXNbb2Zmc2V0XSAmIDB4ODApKSByZXR1cm4gKHRoaXNbb2Zmc2V0XSlcbiAgcmV0dXJuICgoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTEpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiByZWFkSW50MTZMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCAyLCB0aGlzLmxlbmd0aClcbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXRdIHwgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOClcbiAgcmV0dXJuICh2YWwgJiAweDgwMDApID8gdmFsIHwgMHhGRkZGMDAwMCA6IHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gcmVhZEludDE2QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgMiwgdGhpcy5sZW5ndGgpXG4gIGNvbnN0IHZhbCA9IHRoaXNbb2Zmc2V0ICsgMV0gfCAodGhpc1tvZmZzZXRdIDw8IDgpXG4gIHJldHVybiAodmFsICYgMHg4MDAwKSA/IHZhbCB8IDB4RkZGRjAwMDAgOiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIHJlYWRJbnQzMkxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDQsIHRoaXMubGVuZ3RoKVxuXG4gIHJldHVybiAodGhpc1tvZmZzZXRdKSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMV0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDJdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgM10gPDwgMjQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiByZWFkSW50MzJCRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcblxuICByZXR1cm4gKHRoaXNbb2Zmc2V0XSA8PCAyNCkgfFxuICAgICh0aGlzW29mZnNldCArIDFdIDw8IDE2KSB8XG4gICAgKHRoaXNbb2Zmc2V0ICsgMl0gPDwgOCkgfFxuICAgICh0aGlzW29mZnNldCArIDNdKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRCaWdJbnQ2NExFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHJlYWRCaWdJbnQ2NExFIChvZmZzZXQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIHZhbGlkYXRlTnVtYmVyKG9mZnNldCwgJ29mZnNldCcpXG4gIGNvbnN0IGZpcnN0ID0gdGhpc1tvZmZzZXRdXG4gIGNvbnN0IGxhc3QgPSB0aGlzW29mZnNldCArIDddXG4gIGlmIChmaXJzdCA9PT0gdW5kZWZpbmVkIHx8IGxhc3QgPT09IHVuZGVmaW5lZCkge1xuICAgIGJvdW5kc0Vycm9yKG9mZnNldCwgdGhpcy5sZW5ndGggLSA4KVxuICB9XG5cbiAgY29uc3QgdmFsID0gdGhpc1tvZmZzZXQgKyA0XSArXG4gICAgdGhpc1tvZmZzZXQgKyA1XSAqIDIgKiogOCArXG4gICAgdGhpc1tvZmZzZXQgKyA2XSAqIDIgKiogMTYgK1xuICAgIChsYXN0IDw8IDI0KSAvLyBPdmVyZmxvd1xuXG4gIHJldHVybiAoQmlnSW50KHZhbCkgPDwgQmlnSW50KDMyKSkgK1xuICAgIEJpZ0ludChmaXJzdCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDI0KVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkQmlnSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiByZWFkQmlnSW50NjRCRSAob2Zmc2V0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICB2YWxpZGF0ZU51bWJlcihvZmZzZXQsICdvZmZzZXQnKVxuICBjb25zdCBmaXJzdCA9IHRoaXNbb2Zmc2V0XVxuICBjb25zdCBsYXN0ID0gdGhpc1tvZmZzZXQgKyA3XVxuICBpZiAoZmlyc3QgPT09IHVuZGVmaW5lZCB8fCBsYXN0ID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIHRoaXMubGVuZ3RoIC0gOClcbiAgfVxuXG4gIGNvbnN0IHZhbCA9IChmaXJzdCA8PCAyNCkgKyAvLyBPdmVyZmxvd1xuICAgIHRoaXNbKytvZmZzZXRdICogMiAqKiAxNiArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDggK1xuICAgIHRoaXNbKytvZmZzZXRdXG5cbiAgcmV0dXJuIChCaWdJbnQodmFsKSA8PCBCaWdJbnQoMzIpKSArXG4gICAgQmlnSW50KHRoaXNbKytvZmZzZXRdICogMiAqKiAyNCArXG4gICAgdGhpc1srK29mZnNldF0gKiAyICoqIDE2ICtcbiAgICB0aGlzWysrb2Zmc2V0XSAqIDIgKiogOCArXG4gICAgbGFzdClcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiByZWFkRmxvYXRMRSAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tPZmZzZXQob2Zmc2V0LCA0LCB0aGlzLmxlbmd0aClcbiAgcmV0dXJuIGllZWU3NTQucmVhZCh0aGlzLCBvZmZzZXQsIHRydWUsIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gcmVhZEZsb2F0QkUgKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrT2Zmc2V0KG9mZnNldCwgNCwgdGhpcy5sZW5ndGgpXG4gIHJldHVybiBpZWVlNzU0LnJlYWQodGhpcywgb2Zmc2V0LCBmYWxzZSwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gcmVhZERvdWJsZUxFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgdHJ1ZSwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gcmVhZERvdWJsZUJFIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja09mZnNldChvZmZzZXQsIDgsIHRoaXMubGVuZ3RoKVxuICByZXR1cm4gaWVlZTc1NC5yZWFkKHRoaXMsIG9mZnNldCwgZmFsc2UsIDUyLCA4KVxufVxuXG5mdW5jdGlvbiBjaGVja0ludCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBleHQsIG1heCwgbWluKSB7XG4gIGlmICghQnVmZmVyLmlzQnVmZmVyKGJ1ZikpIHRocm93IG5ldyBUeXBlRXJyb3IoJ1wiYnVmZmVyXCIgYXJndW1lbnQgbXVzdCBiZSBhIEJ1ZmZlciBpbnN0YW5jZScpXG4gIGlmICh2YWx1ZSA+IG1heCB8fCB2YWx1ZSA8IG1pbikgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1widmFsdWVcIiBhcmd1bWVudCBpcyBvdXQgb2YgYm91bmRzJylcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludExFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50TEUgPSBmdW5jdGlvbiB3cml0ZVVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBtYXhCeXRlcyA9IE1hdGgucG93KDIsIDggKiBieXRlTGVuZ3RoKSAtIDFcbiAgICBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBtYXhCeXRlcywgMClcbiAgfVxuXG4gIGxldCBtdWwgPSAxXG4gIGxldCBpID0gMFxuICB0aGlzW29mZnNldF0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKCsraSA8IGJ5dGVMZW5ndGggJiYgKG11bCAqPSAweDEwMCkpIHtcbiAgICB0aGlzW29mZnNldCArIGldID0gKHZhbHVlIC8gbXVsKSAmIDB4RkZcbiAgfVxuXG4gIHJldHVybiBvZmZzZXQgKyBieXRlTGVuZ3RoXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50QkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnRCRSA9IGZ1bmN0aW9uIHdyaXRlVUludEJFICh2YWx1ZSwgb2Zmc2V0LCBieXRlTGVuZ3RoLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgYnl0ZUxlbmd0aCA9IGJ5dGVMZW5ndGggPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNvbnN0IG1heEJ5dGVzID0gTWF0aC5wb3coMiwgOCAqIGJ5dGVMZW5ndGgpIC0gMVxuICAgIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGJ5dGVMZW5ndGgsIG1heEJ5dGVzLCAwKVxuICB9XG5cbiAgbGV0IGkgPSBieXRlTGVuZ3RoIC0gMVxuICBsZXQgbXVsID0gMVxuICB0aGlzW29mZnNldCArIGldID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgtLWkgPj0gMCAmJiAobXVsICo9IDB4MTAwKSkge1xuICAgIHRoaXNbb2Zmc2V0ICsgaV0gPSAodmFsdWUgLyBtdWwpICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQ4ID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uIHdyaXRlVUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweGZmLCAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgMVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDE2TEUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVVSW50MTZMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4ZmZmZiwgMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVpbnQxNkJFID1cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlVUludDE2QkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAyLCAweGZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAyXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVaW50MzJMRSA9XG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZVVJbnQzMkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgNCwgMHhmZmZmZmZmZiwgMClcbiAgdGhpc1tvZmZzZXQgKyAzXSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVWludDMyQkUgPVxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gd3JpdGVVSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4ZmZmZmZmZmYsIDApXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSA+Pj4gMjQpXG4gIHRoaXNbb2Zmc2V0ICsgMV0gPSAodmFsdWUgPj4+IDE2KVxuICB0aGlzW29mZnNldCArIDJdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDNdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDRcbn1cblxuZnVuY3Rpb24gd3J0QmlnVUludDY0TEUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbWluLCBtYXgpIHtcbiAgY2hlY2tJbnRCSSh2YWx1ZSwgbWluLCBtYXgsIGJ1Ziwgb2Zmc2V0LCA3KVxuXG4gIGxldCBsbyA9IE51bWJlcih2YWx1ZSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0KytdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGxvXG4gIGxldCBoaSA9IE51bWJlcih2YWx1ZSA+PiBCaWdJbnQoMzIpICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQrK10gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldCsrXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0KytdID0gaGlcbiAgcmV0dXJuIG9mZnNldFxufVxuXG5mdW5jdGlvbiB3cnRCaWdVSW50NjRCRSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBtaW4sIG1heCkge1xuICBjaGVja0ludEJJKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIDcpXG5cbiAgbGV0IGxvID0gTnVtYmVyKHZhbHVlICYgQmlnSW50KDB4ZmZmZmZmZmYpKVxuICBidWZbb2Zmc2V0ICsgN10gPSBsb1xuICBsbyA9IGxvID4+IDhcbiAgYnVmW29mZnNldCArIDZdID0gbG9cbiAgbG8gPSBsbyA+PiA4XG4gIGJ1ZltvZmZzZXQgKyA1XSA9IGxvXG4gIGxvID0gbG8gPj4gOFxuICBidWZbb2Zmc2V0ICsgNF0gPSBsb1xuICBsZXQgaGkgPSBOdW1iZXIodmFsdWUgPj4gQmlnSW50KDMyKSAmIEJpZ0ludCgweGZmZmZmZmZmKSlcbiAgYnVmW29mZnNldCArIDNdID0gaGlcbiAgaGkgPSBoaSA+PiA4XG4gIGJ1ZltvZmZzZXQgKyAyXSA9IGhpXG4gIGhpID0gaGkgPj4gOFxuICBidWZbb2Zmc2V0ICsgMV0gPSBoaVxuICBoaSA9IGhpID4+IDhcbiAgYnVmW29mZnNldF0gPSBoaVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnVUludDY0TEUgPSBkZWZpbmVCaWdJbnRNZXRob2QoZnVuY3Rpb24gd3JpdGVCaWdVSW50NjRMRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NExFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIEJpZ0ludCgwKSwgQmlnSW50KCcweGZmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdVSW50NjRCRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ1VJbnQ2NEJFICh2YWx1ZSwgb2Zmc2V0ID0gMCkge1xuICByZXR1cm4gd3J0QmlnVUludDY0QkUodGhpcywgdmFsdWUsIG9mZnNldCwgQmlnSW50KDApLCBCaWdJbnQoJzB4ZmZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludExFID0gZnVuY3Rpb24gd3JpdGVJbnRMRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICBsZXQgaSA9IDBcbiAgbGV0IG11bCA9IDFcbiAgbGV0IHN1YiA9IDBcbiAgdGhpc1tvZmZzZXRdID0gdmFsdWUgJiAweEZGXG4gIHdoaWxlICgrK2kgPCBieXRlTGVuZ3RoICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpIC0gMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludEJFID0gZnVuY3Rpb24gd3JpdGVJbnRCRSAodmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjb25zdCBsaW1pdCA9IE1hdGgucG93KDIsICg4ICogYnl0ZUxlbmd0aCkgLSAxKVxuXG4gICAgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgYnl0ZUxlbmd0aCwgbGltaXQgLSAxLCAtbGltaXQpXG4gIH1cblxuICBsZXQgaSA9IGJ5dGVMZW5ndGggLSAxXG4gIGxldCBtdWwgPSAxXG4gIGxldCBzdWIgPSAwXG4gIHRoaXNbb2Zmc2V0ICsgaV0gPSB2YWx1ZSAmIDB4RkZcbiAgd2hpbGUgKC0taSA+PSAwICYmIChtdWwgKj0gMHgxMDApKSB7XG4gICAgaWYgKHZhbHVlIDwgMCAmJiBzdWIgPT09IDAgJiYgdGhpc1tvZmZzZXQgKyBpICsgMV0gIT09IDApIHtcbiAgICAgIHN1YiA9IDFcbiAgICB9XG4gICAgdGhpc1tvZmZzZXQgKyBpXSA9ICgodmFsdWUgLyBtdWwpID4+IDApIC0gc3ViICYgMHhGRlxuICB9XG5cbiAgcmV0dXJuIG9mZnNldCArIGJ5dGVMZW5ndGhcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiB3cml0ZUludDggKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAxLCAweDdmLCAtMHg4MClcbiAgaWYgKHZhbHVlIDwgMCkgdmFsdWUgPSAweGZmICsgdmFsdWUgKyAxXG4gIHRoaXNbb2Zmc2V0XSA9ICh2YWx1ZSAmIDB4ZmYpXG4gIHJldHVybiBvZmZzZXQgKyAxXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gd3JpdGVJbnQxNkxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkgY2hlY2tJbnQodGhpcywgdmFsdWUsIG9mZnNldCwgMiwgMHg3ZmZmLCAtMHg4MDAwKVxuICB0aGlzW29mZnNldF0gPSAodmFsdWUgJiAweGZmKVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlID4+PiA4KVxuICByZXR1cm4gb2Zmc2V0ICsgMlxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MTZCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDIsIDB4N2ZmZiwgLTB4ODAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiA4KVxuICB0aGlzW29mZnNldCArIDFdID0gKHZhbHVlICYgMHhmZilcbiAgcmV0dXJuIG9mZnNldCArIDJcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiB3cml0ZUludDMyTEUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHZhbHVlID0gK3ZhbHVlXG4gIG9mZnNldCA9IG9mZnNldCA+Pj4gMFxuICBpZiAoIW5vQXNzZXJ0KSBjaGVja0ludCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCA0LCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlICYgMHhmZilcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gOClcbiAgdGhpc1tvZmZzZXQgKyAyXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgPj4+IDI0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uIHdyaXRlSW50MzJCRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIGNoZWNrSW50KHRoaXMsIHZhbHVlLCBvZmZzZXQsIDQsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICBpZiAodmFsdWUgPCAwKSB2YWx1ZSA9IDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDFcbiAgdGhpc1tvZmZzZXRdID0gKHZhbHVlID4+PiAyNClcbiAgdGhpc1tvZmZzZXQgKyAxXSA9ICh2YWx1ZSA+Pj4gMTYpXG4gIHRoaXNbb2Zmc2V0ICsgMl0gPSAodmFsdWUgPj4+IDgpXG4gIHRoaXNbb2Zmc2V0ICsgM10gPSAodmFsdWUgJiAweGZmKVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlQmlnSW50NjRMRSA9IGRlZmluZUJpZ0ludE1ldGhvZChmdW5jdGlvbiB3cml0ZUJpZ0ludDY0TEUgKHZhbHVlLCBvZmZzZXQgPSAwKSB7XG4gIHJldHVybiB3cnRCaWdVSW50NjRMRSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCAtQmlnSW50KCcweDgwMDAwMDAwMDAwMDAwMDAnKSwgQmlnSW50KCcweDdmZmZmZmZmZmZmZmZmZmYnKSlcbn0pXG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVCaWdJbnQ2NEJFID0gZGVmaW5lQmlnSW50TWV0aG9kKGZ1bmN0aW9uIHdyaXRlQmlnSW50NjRCRSAodmFsdWUsIG9mZnNldCA9IDApIHtcbiAgcmV0dXJuIHdydEJpZ1VJbnQ2NEJFKHRoaXMsIHZhbHVlLCBvZmZzZXQsIC1CaWdJbnQoJzB4ODAwMDAwMDAwMDAwMDAwMCcpLCBCaWdJbnQoJzB4N2ZmZmZmZmZmZmZmZmZmZicpKVxufSlcblxuZnVuY3Rpb24gY2hlY2tJRUVFNzU0IChidWYsIHZhbHVlLCBvZmZzZXQsIGV4dCwgbWF4LCBtaW4pIHtcbiAgaWYgKG9mZnNldCArIGV4dCA+IGJ1Zi5sZW5ndGgpIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbmRleCBvdXQgb2YgcmFuZ2UnKVxuICBpZiAob2Zmc2V0IDwgMCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICB2YWx1ZSA9ICt2YWx1ZVxuICBvZmZzZXQgPSBvZmZzZXQgPj4+IDBcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGNoZWNrSUVFRTc1NChidWYsIHZhbHVlLCBvZmZzZXQsIDQsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxuICByZXR1cm4gb2Zmc2V0ICsgNFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uIHdyaXRlRmxvYXRMRSAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIHdyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gd3JpdGVGbG9hdEJFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIHdyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgdmFsdWUgPSArdmFsdWVcbiAgb2Zmc2V0ID0gb2Zmc2V0ID4+PiAwXG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBjaGVja0lFRUU3NTQoYnVmLCB2YWx1ZSwgb2Zmc2V0LCA4LCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxuICByZXR1cm4gb2Zmc2V0ICsgOFxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiB3cml0ZURvdWJsZUxFICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uIHdyaXRlRG91YmxlQkUgKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiB3cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uIGNvcHkgKHRhcmdldCwgdGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCFCdWZmZXIuaXNCdWZmZXIodGFyZ2V0KSkgdGhyb3cgbmV3IFR5cGVFcnJvcignYXJndW1lbnQgc2hvdWxkIGJlIGEgQnVmZmVyJylcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldFN0YXJ0ID49IHRhcmdldC5sZW5ndGgpIHRhcmdldFN0YXJ0ID0gdGFyZ2V0Lmxlbmd0aFxuICBpZiAoIXRhcmdldFN0YXJ0KSB0YXJnZXRTdGFydCA9IDBcbiAgaWYgKGVuZCA+IDAgJiYgZW5kIDwgc3RhcnQpIGVuZCA9IHN0YXJ0XG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm4gMFxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCB0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuIDBcblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGlmICh0YXJnZXRTdGFydCA8IDApIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcigndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIH1cbiAgaWYgKHN0YXJ0IDwgMCB8fCBzdGFydCA+PSB0aGlzLmxlbmd0aCkgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ0luZGV4IG91dCBvZiByYW5nZScpXG4gIGlmIChlbmQgPCAwKSB0aHJvdyBuZXcgUmFuZ2VFcnJvcignc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRTdGFydCA8IGVuZCAtIHN0YXJ0KSB7XG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldFN0YXJ0ICsgc3RhcnRcbiAgfVxuXG4gIGNvbnN0IGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKHRoaXMgPT09IHRhcmdldCAmJiB0eXBlb2YgVWludDhBcnJheS5wcm90b3R5cGUuY29weVdpdGhpbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIFVzZSBidWlsdC1pbiB3aGVuIGF2YWlsYWJsZSwgbWlzc2luZyBmcm9tIElFMTFcbiAgICB0aGlzLmNvcHlXaXRoaW4odGFyZ2V0U3RhcnQsIHN0YXJ0LCBlbmQpXG4gIH0gZWxzZSB7XG4gICAgVWludDhBcnJheS5wcm90b3R5cGUuc2V0LmNhbGwoXG4gICAgICB0YXJnZXQsXG4gICAgICB0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpLFxuICAgICAgdGFyZ2V0U3RhcnRcbiAgICApXG4gIH1cblxuICByZXR1cm4gbGVuXG59XG5cbi8vIFVzYWdlOlxuLy8gICAgYnVmZmVyLmZpbGwobnVtYmVyWywgb2Zmc2V0WywgZW5kXV0pXG4vLyAgICBidWZmZXIuZmlsbChidWZmZXJbLCBvZmZzZXRbLCBlbmRdXSlcbi8vICAgIGJ1ZmZlci5maWxsKHN0cmluZ1ssIG9mZnNldFssIGVuZF1dWywgZW5jb2RpbmddKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gZmlsbCAodmFsLCBzdGFydCwgZW5kLCBlbmNvZGluZykge1xuICAvLyBIYW5kbGUgc3RyaW5nIGNhc2VzOlxuICBpZiAodHlwZW9mIHZhbCA9PT0gJ3N0cmluZycpIHtcbiAgICBpZiAodHlwZW9mIHN0YXJ0ID09PSAnc3RyaW5nJykge1xuICAgICAgZW5jb2RpbmcgPSBzdGFydFxuICAgICAgc3RhcnQgPSAwXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVuZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGVuY29kaW5nID0gZW5kXG4gICAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICAgIH1cbiAgICBpZiAoZW5jb2RpbmcgIT09IHVuZGVmaW5lZCAmJiB0eXBlb2YgZW5jb2RpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdlbmNvZGluZyBtdXN0IGJlIGEgc3RyaW5nJylcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBlbmNvZGluZyA9PT0gJ3N0cmluZycgJiYgIUJ1ZmZlci5pc0VuY29kaW5nKGVuY29kaW5nKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuY29kaW5nKVxuICAgIH1cbiAgICBpZiAodmFsLmxlbmd0aCA9PT0gMSkge1xuICAgICAgY29uc3QgY29kZSA9IHZhbC5jaGFyQ29kZUF0KDApXG4gICAgICBpZiAoKGVuY29kaW5nID09PSAndXRmOCcgJiYgY29kZSA8IDEyOCkgfHxcbiAgICAgICAgICBlbmNvZGluZyA9PT0gJ2xhdGluMScpIHtcbiAgICAgICAgLy8gRmFzdCBwYXRoOiBJZiBgdmFsYCBmaXRzIGludG8gYSBzaW5nbGUgYnl0ZSwgdXNlIHRoYXQgbnVtZXJpYyB2YWx1ZS5cbiAgICAgICAgdmFsID0gY29kZVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlb2YgdmFsID09PSAnbnVtYmVyJykge1xuICAgIHZhbCA9IHZhbCAmIDI1NVxuICB9IGVsc2UgaWYgKHR5cGVvZiB2YWwgPT09ICdib29sZWFuJykge1xuICAgIHZhbCA9IE51bWJlcih2YWwpXG4gIH1cblxuICAvLyBJbnZhbGlkIHJhbmdlcyBhcmUgbm90IHNldCB0byBhIGRlZmF1bHQsIHNvIGNhbiByYW5nZSBjaGVjayBlYXJseS5cbiAgaWYgKHN0YXJ0IDwgMCB8fCB0aGlzLmxlbmd0aCA8IHN0YXJ0IHx8IHRoaXMubGVuZ3RoIDwgZW5kKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ091dCBvZiByYW5nZSBpbmRleCcpXG4gIH1cblxuICBpZiAoZW5kIDw9IHN0YXJ0KSB7XG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIHN0YXJ0ID0gc3RhcnQgPj4+IDBcbiAgZW5kID0gZW5kID09PSB1bmRlZmluZWQgPyB0aGlzLmxlbmd0aCA6IGVuZCA+Pj4gMFxuXG4gIGlmICghdmFsKSB2YWwgPSAwXG5cbiAgbGV0IGlcbiAgaWYgKHR5cGVvZiB2YWwgPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gc3RhcnQ7IGkgPCBlbmQ7ICsraSkge1xuICAgICAgdGhpc1tpXSA9IHZhbFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBjb25zdCBieXRlcyA9IEJ1ZmZlci5pc0J1ZmZlcih2YWwpXG4gICAgICA/IHZhbFxuICAgICAgOiBCdWZmZXIuZnJvbSh2YWwsIGVuY29kaW5nKVxuICAgIGNvbnN0IGxlbiA9IGJ5dGVzLmxlbmd0aFxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSB2YWx1ZSBcIicgKyB2YWwgK1xuICAgICAgICAnXCIgaXMgaW52YWxpZCBmb3IgYXJndW1lbnQgXCJ2YWx1ZVwiJylcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGVuZCAtIHN0YXJ0OyArK2kpIHtcbiAgICAgIHRoaXNbaSArIHN0YXJ0XSA9IGJ5dGVzW2kgJSBsZW5dXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXNcbn1cblxuLy8gQ1VTVE9NIEVSUk9SU1xuLy8gPT09PT09PT09PT09PVxuXG4vLyBTaW1wbGlmaWVkIHZlcnNpb25zIGZyb20gTm9kZSwgY2hhbmdlZCBmb3IgQnVmZmVyLW9ubHkgdXNhZ2VcbmNvbnN0IGVycm9ycyA9IHt9XG5mdW5jdGlvbiBFIChzeW0sIGdldE1lc3NhZ2UsIEJhc2UpIHtcbiAgZXJyb3JzW3N5bV0gPSBjbGFzcyBOb2RlRXJyb3IgZXh0ZW5kcyBCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoKSB7XG4gICAgICBzdXBlcigpXG5cbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnbWVzc2FnZScsIHtcbiAgICAgICAgdmFsdWU6IGdldE1lc3NhZ2UuYXBwbHkodGhpcywgYXJndW1lbnRzKSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgICAgfSlcblxuICAgICAgLy8gQWRkIHRoZSBlcnJvciBjb2RlIHRvIHRoZSBuYW1lIHRvIGluY2x1ZGUgaXQgaW4gdGhlIHN0YWNrIHRyYWNlLlxuICAgICAgdGhpcy5uYW1lID0gYCR7dGhpcy5uYW1lfSBbJHtzeW19XWBcbiAgICAgIC8vIEFjY2VzcyB0aGUgc3RhY2sgdG8gZ2VuZXJhdGUgdGhlIGVycm9yIG1lc3NhZ2UgaW5jbHVkaW5nIHRoZSBlcnJvciBjb2RlXG4gICAgICAvLyBmcm9tIHRoZSBuYW1lLlxuICAgICAgdGhpcy5zdGFjayAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC1leHByZXNzaW9uc1xuICAgICAgLy8gUmVzZXQgdGhlIG5hbWUgdG8gdGhlIGFjdHVhbCBuYW1lLlxuICAgICAgZGVsZXRlIHRoaXMubmFtZVxuICAgIH1cblxuICAgIGdldCBjb2RlICgpIHtcbiAgICAgIHJldHVybiBzeW1cbiAgICB9XG5cbiAgICBzZXQgY29kZSAodmFsdWUpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnY29kZScsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgdG9TdHJpbmcgKCkge1xuICAgICAgcmV0dXJuIGAke3RoaXMubmFtZX0gWyR7c3ltfV06ICR7dGhpcy5tZXNzYWdlfWBcbiAgICB9XG4gIH1cbn1cblxuRSgnRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTJyxcbiAgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBpZiAobmFtZSkge1xuICAgICAgcmV0dXJuIGAke25hbWV9IGlzIG91dHNpZGUgb2YgYnVmZmVyIGJvdW5kc2BcbiAgICB9XG5cbiAgICByZXR1cm4gJ0F0dGVtcHQgdG8gYWNjZXNzIG1lbW9yeSBvdXRzaWRlIGJ1ZmZlciBib3VuZHMnXG4gIH0sIFJhbmdlRXJyb3IpXG5FKCdFUlJfSU5WQUxJRF9BUkdfVFlQRScsXG4gIGZ1bmN0aW9uIChuYW1lLCBhY3R1YWwpIHtcbiAgICByZXR1cm4gYFRoZSBcIiR7bmFtZX1cIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgbnVtYmVyLiBSZWNlaXZlZCB0eXBlICR7dHlwZW9mIGFjdHVhbH1gXG4gIH0sIFR5cGVFcnJvcilcbkUoJ0VSUl9PVVRfT0ZfUkFOR0UnLFxuICBmdW5jdGlvbiAoc3RyLCByYW5nZSwgaW5wdXQpIHtcbiAgICBsZXQgbXNnID0gYFRoZSB2YWx1ZSBvZiBcIiR7c3RyfVwiIGlzIG91dCBvZiByYW5nZS5gXG4gICAgbGV0IHJlY2VpdmVkID0gaW5wdXRcbiAgICBpZiAoTnVtYmVyLmlzSW50ZWdlcihpbnB1dCkgJiYgTWF0aC5hYnMoaW5wdXQpID4gMiAqKiAzMikge1xuICAgICAgcmVjZWl2ZWQgPSBhZGROdW1lcmljYWxTZXBhcmF0b3IoU3RyaW5nKGlucHV0KSlcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBpbnB1dCA9PT0gJ2JpZ2ludCcpIHtcbiAgICAgIHJlY2VpdmVkID0gU3RyaW5nKGlucHV0KVxuICAgICAgaWYgKGlucHV0ID4gQmlnSW50KDIpICoqIEJpZ0ludCgzMikgfHwgaW5wdXQgPCAtKEJpZ0ludCgyKSAqKiBCaWdJbnQoMzIpKSkge1xuICAgICAgICByZWNlaXZlZCA9IGFkZE51bWVyaWNhbFNlcGFyYXRvcihyZWNlaXZlZClcbiAgICAgIH1cbiAgICAgIHJlY2VpdmVkICs9ICduJ1xuICAgIH1cbiAgICBtc2cgKz0gYCBJdCBtdXN0IGJlICR7cmFuZ2V9LiBSZWNlaXZlZCAke3JlY2VpdmVkfWBcbiAgICByZXR1cm4gbXNnXG4gIH0sIFJhbmdlRXJyb3IpXG5cbmZ1bmN0aW9uIGFkZE51bWVyaWNhbFNlcGFyYXRvciAodmFsKSB7XG4gIGxldCByZXMgPSAnJ1xuICBsZXQgaSA9IHZhbC5sZW5ndGhcbiAgY29uc3Qgc3RhcnQgPSB2YWxbMF0gPT09ICctJyA/IDEgOiAwXG4gIGZvciAoOyBpID49IHN0YXJ0ICsgNDsgaSAtPSAzKSB7XG4gICAgcmVzID0gYF8ke3ZhbC5zbGljZShpIC0gMywgaSl9JHtyZXN9YFxuICB9XG4gIHJldHVybiBgJHt2YWwuc2xpY2UoMCwgaSl9JHtyZXN9YFxufVxuXG4vLyBDSEVDSyBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBjaGVja0JvdW5kcyAoYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgdmFsaWRhdGVOdW1iZXIob2Zmc2V0LCAnb2Zmc2V0JylcbiAgaWYgKGJ1ZltvZmZzZXRdID09PSB1bmRlZmluZWQgfHwgYnVmW29mZnNldCArIGJ5dGVMZW5ndGhdID09PSB1bmRlZmluZWQpIHtcbiAgICBib3VuZHNFcnJvcihvZmZzZXQsIGJ1Zi5sZW5ndGggLSAoYnl0ZUxlbmd0aCArIDEpKVxuICB9XG59XG5cbmZ1bmN0aW9uIGNoZWNrSW50QkkgKHZhbHVlLCBtaW4sIG1heCwgYnVmLCBvZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgaWYgKHZhbHVlID4gbWF4IHx8IHZhbHVlIDwgbWluKSB7XG4gICAgY29uc3QgbiA9IHR5cGVvZiBtaW4gPT09ICdiaWdpbnQnID8gJ24nIDogJydcbiAgICBsZXQgcmFuZ2VcbiAgICBpZiAoYnl0ZUxlbmd0aCA+IDMpIHtcbiAgICAgIGlmIChtaW4gPT09IDAgfHwgbWluID09PSBCaWdJbnQoMCkpIHtcbiAgICAgICAgcmFuZ2UgPSBgPj0gMCR7bn0gYW5kIDwgMiR7bn0gKiogJHsoYnl0ZUxlbmd0aCArIDEpICogOH0ke259YFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmFuZ2UgPSBgPj0gLSgyJHtufSAqKiAkeyhieXRlTGVuZ3RoICsgMSkgKiA4IC0gMX0ke259KSBhbmQgPCAyICoqIGAgK1xuICAgICAgICAgICAgICAgIGAkeyhieXRlTGVuZ3RoICsgMSkgKiA4IC0gMX0ke259YFxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZSA9IGA+PSAke21pbn0ke259IGFuZCA8PSAke21heH0ke259YFxuICAgIH1cbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9PVVRfT0ZfUkFOR0UoJ3ZhbHVlJywgcmFuZ2UsIHZhbHVlKVxuICB9XG4gIGNoZWNrQm91bmRzKGJ1Ziwgb2Zmc2V0LCBieXRlTGVuZ3RoKVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU51bWJlciAodmFsdWUsIG5hbWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgZXJyb3JzLkVSUl9JTlZBTElEX0FSR19UWVBFKG5hbWUsICdudW1iZXInLCB2YWx1ZSlcbiAgfVxufVxuXG5mdW5jdGlvbiBib3VuZHNFcnJvciAodmFsdWUsIGxlbmd0aCwgdHlwZSkge1xuICBpZiAoTWF0aC5mbG9vcih2YWx1ZSkgIT09IHZhbHVlKSB7XG4gICAgdmFsaWRhdGVOdW1iZXIodmFsdWUsIHR5cGUpXG4gICAgdGhyb3cgbmV3IGVycm9ycy5FUlJfT1VUX09GX1JBTkdFKHR5cGUgfHwgJ29mZnNldCcsICdhbiBpbnRlZ2VyJywgdmFsdWUpXG4gIH1cblxuICBpZiAobGVuZ3RoIDwgMCkge1xuICAgIHRocm93IG5ldyBlcnJvcnMuRVJSX0JVRkZFUl9PVVRfT0ZfQk9VTkRTKClcbiAgfVxuXG4gIHRocm93IG5ldyBlcnJvcnMuRVJSX09VVF9PRl9SQU5HRSh0eXBlIHx8ICdvZmZzZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYD49ICR7dHlwZSA/IDEgOiAwfSBhbmQgPD0gJHtsZW5ndGh9YCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlKVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmNvbnN0IElOVkFMSURfQkFTRTY0X1JFID0gL1teKy8wLTlBLVphLXotX10vZ1xuXG5mdW5jdGlvbiBiYXNlNjRjbGVhbiAoc3RyKSB7XG4gIC8vIE5vZGUgdGFrZXMgZXF1YWwgc2lnbnMgYXMgZW5kIG9mIHRoZSBCYXNlNjQgZW5jb2RpbmdcbiAgc3RyID0gc3RyLnNwbGl0KCc9JylbMF1cbiAgLy8gTm9kZSBzdHJpcHMgb3V0IGludmFsaWQgY2hhcmFjdGVycyBsaWtlIFxcbiBhbmQgXFx0IGZyb20gdGhlIHN0cmluZywgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHN0ciA9IHN0ci50cmltKCkucmVwbGFjZShJTlZBTElEX0JBU0U2NF9SRSwgJycpXG4gIC8vIE5vZGUgY29udmVydHMgc3RyaW5ncyB3aXRoIGxlbmd0aCA8IDIgdG8gJydcbiAgaWYgKHN0ci5sZW5ndGggPCAyKSByZXR1cm4gJydcbiAgLy8gTm9kZSBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgYmFzZTY0IHN0cmluZ3MgKG1pc3NpbmcgdHJhaWxpbmcgPT09KSwgYmFzZTY0LWpzIGRvZXMgbm90XG4gIHdoaWxlIChzdHIubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgIHN0ciA9IHN0ciArICc9J1xuICB9XG4gIHJldHVybiBzdHJcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cmluZywgdW5pdHMpIHtcbiAgdW5pdHMgPSB1bml0cyB8fCBJbmZpbml0eVxuICBsZXQgY29kZVBvaW50XG4gIGNvbnN0IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcbiAgbGV0IGxlYWRTdXJyb2dhdGUgPSBudWxsXG4gIGNvbnN0IGJ5dGVzID0gW11cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgY29kZVBvaW50ID0gc3RyaW5nLmNoYXJDb2RlQXQoaSlcblxuICAgIC8vIGlzIHN1cnJvZ2F0ZSBjb21wb25lbnRcbiAgICBpZiAoY29kZVBvaW50ID4gMHhEN0ZGICYmIGNvZGVQb2ludCA8IDB4RTAwMCkge1xuICAgICAgLy8gbGFzdCBjaGFyIHdhcyBhIGxlYWRcbiAgICAgIGlmICghbGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgICAvLyBubyBsZWFkIHlldFxuICAgICAgICBpZiAoY29kZVBvaW50ID4gMHhEQkZGKSB7XG4gICAgICAgICAgLy8gdW5leHBlY3RlZCB0cmFpbFxuICAgICAgICAgIGlmICgodW5pdHMgLT0gMykgPiAtMSkgYnl0ZXMucHVzaCgweEVGLCAweEJGLCAweEJEKVxuICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgIH0gZWxzZSBpZiAoaSArIDEgPT09IGxlbmd0aCkge1xuICAgICAgICAgIC8vIHVucGFpcmVkIGxlYWRcbiAgICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgICBjb250aW51ZVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdmFsaWQgbGVhZFxuICAgICAgICBsZWFkU3Vycm9nYXRlID0gY29kZVBvaW50XG5cbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgLy8gMiBsZWFkcyBpbiBhIHJvd1xuICAgICAgaWYgKGNvZGVQb2ludCA8IDB4REMwMCkge1xuICAgICAgICBpZiAoKHVuaXRzIC09IDMpID4gLTEpIGJ5dGVzLnB1c2goMHhFRiwgMHhCRiwgMHhCRClcbiAgICAgICAgbGVhZFN1cnJvZ2F0ZSA9IGNvZGVQb2ludFxuICAgICAgICBjb250aW51ZVxuICAgICAgfVxuXG4gICAgICAvLyB2YWxpZCBzdXJyb2dhdGUgcGFpclxuICAgICAgY29kZVBvaW50ID0gKGxlYWRTdXJyb2dhdGUgLSAweEQ4MDAgPDwgMTAgfCBjb2RlUG9pbnQgLSAweERDMDApICsgMHgxMDAwMFxuICAgIH0gZWxzZSBpZiAobGVhZFN1cnJvZ2F0ZSkge1xuICAgICAgLy8gdmFsaWQgYm1wIGNoYXIsIGJ1dCBsYXN0IGNoYXIgd2FzIGEgbGVhZFxuICAgICAgaWYgKCh1bml0cyAtPSAzKSA+IC0xKSBieXRlcy5wdXNoKDB4RUYsIDB4QkYsIDB4QkQpXG4gICAgfVxuXG4gICAgbGVhZFN1cnJvZ2F0ZSA9IG51bGxcblxuICAgIC8vIGVuY29kZSB1dGY4XG4gICAgaWYgKGNvZGVQb2ludCA8IDB4ODApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMSkgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChjb2RlUG9pbnQpXG4gICAgfSBlbHNlIGlmIChjb2RlUG9pbnQgPCAweDgwMCkge1xuICAgICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG4gICAgICBieXRlcy5wdXNoKFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2IHwgMHhDMCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTAwMDApIHtcbiAgICAgIGlmICgodW5pdHMgLT0gMykgPCAwKSBicmVha1xuICAgICAgYnl0ZXMucHVzaChcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyB8IDB4RTAsXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDYgJiAweDNGIHwgMHg4MCxcbiAgICAgICAgY29kZVBvaW50ICYgMHgzRiB8IDB4ODBcbiAgICAgIClcbiAgICB9IGVsc2UgaWYgKGNvZGVQb2ludCA8IDB4MTEwMDAwKSB7XG4gICAgICBpZiAoKHVuaXRzIC09IDQpIDwgMCkgYnJlYWtcbiAgICAgIGJ5dGVzLnB1c2goXG4gICAgICAgIGNvZGVQb2ludCA+PiAweDEyIHwgMHhGMCxcbiAgICAgICAgY29kZVBvaW50ID4+IDB4QyAmIDB4M0YgfCAweDgwLFxuICAgICAgICBjb2RlUG9pbnQgPj4gMHg2ICYgMHgzRiB8IDB4ODAsXG4gICAgICAgIGNvZGVQb2ludCAmIDB4M0YgfCAweDgwXG4gICAgICApXG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2RlIHBvaW50JylcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnl0ZXNcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgY29uc3QgYnl0ZUFycmF5ID0gW11cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyArK2kpIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyLCB1bml0cykge1xuICBsZXQgYywgaGksIGxvXG4gIGNvbnN0IGJ5dGVBcnJheSA9IFtdXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgKytpKSB7XG4gICAgaWYgKCh1bml0cyAtPSAyKSA8IDApIGJyZWFrXG5cbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShiYXNlNjRjbGVhbihzdHIpKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgbGV0IGlcbiAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgKytpKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKSBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbi8vIEFycmF5QnVmZmVyIG9yIFVpbnQ4QXJyYXkgb2JqZWN0cyBmcm9tIG90aGVyIGNvbnRleHRzIChpLmUuIGlmcmFtZXMpIGRvIG5vdCBwYXNzXG4vLyB0aGUgYGluc3RhbmNlb2ZgIGNoZWNrIGJ1dCB0aGV5IHNob3VsZCBiZSB0cmVhdGVkIGFzIG9mIHRoYXQgdHlwZS5cbi8vIFNlZTogaHR0cHM6Ly9naXRodWIuY29tL2Zlcm9zcy9idWZmZXIvaXNzdWVzLzE2NlxuZnVuY3Rpb24gaXNJbnN0YW5jZSAob2JqLCB0eXBlKSB7XG4gIHJldHVybiBvYmogaW5zdGFuY2VvZiB0eXBlIHx8XG4gICAgKG9iaiAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3RvciAhPSBudWxsICYmIG9iai5jb25zdHJ1Y3Rvci5uYW1lICE9IG51bGwgJiZcbiAgICAgIG9iai5jb25zdHJ1Y3Rvci5uYW1lID09PSB0eXBlLm5hbWUpXG59XG5mdW5jdGlvbiBudW1iZXJJc05hTiAob2JqKSB7XG4gIC8vIEZvciBJRTExIHN1cHBvcnRcbiAgcmV0dXJuIG9iaiAhPT0gb2JqIC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2VsZi1jb21wYXJlXG59XG5cbi8vIENyZWF0ZSBsb29rdXAgdGFibGUgZm9yIGB0b1N0cmluZygnaGV4JylgXG4vLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9mZXJvc3MvYnVmZmVyL2lzc3Vlcy8yMTlcbmNvbnN0IGhleFNsaWNlTG9va3VwVGFibGUgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCBhbHBoYWJldCA9ICcwMTIzNDU2Nzg5YWJjZGVmJ1xuICBjb25zdCB0YWJsZSA9IG5ldyBBcnJheSgyNTYpXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgMTY7ICsraSkge1xuICAgIGNvbnN0IGkxNiA9IGkgKiAxNlxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMTY7ICsraikge1xuICAgICAgdGFibGVbaTE2ICsgal0gPSBhbHBoYWJldFtpXSArIGFscGhhYmV0W2pdXG4gICAgfVxuICB9XG4gIHJldHVybiB0YWJsZVxufSkoKVxuXG4vLyBSZXR1cm4gbm90IGZ1bmN0aW9uIHdpdGggRXJyb3IgaWYgQmlnSW50IG5vdCBzdXBwb3J0ZWRcbmZ1bmN0aW9uIGRlZmluZUJpZ0ludE1ldGhvZCAoZm4pIHtcbiAgcmV0dXJuIHR5cGVvZiBCaWdJbnQgPT09ICd1bmRlZmluZWQnID8gQnVmZmVyQmlnSW50Tm90RGVmaW5lZCA6IGZuXG59XG5cbmZ1bmN0aW9uIEJ1ZmZlckJpZ0ludE5vdERlZmluZWQgKCkge1xuICB0aHJvdyBuZXcgRXJyb3IoJ0JpZ0ludCBub3Qgc3VwcG9ydGVkJylcbn1cbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLmVkaXRvciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjcyODIyO1xcbiAgY29sb3I6ICNmZmY7XFxuICBmb250LXNpemU6IDExcHg7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBoZWlnaHQ6IDM2NXB4O1xcbn1cXG5cXG4uZWRpdG9yIC5hY2Uge1xcbiAgZmxleC1iYXNpczogNzUlO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCB7XFxuICAtLXNwYWNpbmc6IDFyZW07XFxuICAtLXJhZGl1czogN3B4O1xcbiAgZmxleC1iYXNpczogMjUlO1xcbiAgcGFkZGluZzogMC41cmVtO1xcbiAgb3ZlcmZsb3cteTogYXV0bztcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgdWwge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgbGkge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgcGFkZGluZzogMC4yNXJlbSAwLjVyZW07XFxufVxcbi5lZGl0b3IgLmZpbGVMaXN0IGxpOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyMjI7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGxpIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgcGFkZGluZy1sZWZ0OiBjYWxjKDIgKiB2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAycHgpO1xcbiAgd2hpdGUtc3BhY2U6IG5vd3JhcDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgdWwgbGkge1xcbiAgYm9yZGVyLWxlZnQ6IDJweCBzb2xpZCAjZGRkO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCB1bCBsaTpsYXN0LWNoaWxkIHtcXG4gIGJvcmRlci1jb2xvcjogdHJhbnNwYXJlbnQ7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHVsIGxpOjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIlxcXCI7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogY2FsYyh2YXIoLS1zcGFjaW5nKSAvIC00KTtcXG4gIGxlZnQ6IC0ycHg7XFxuICB3aWR0aDogY2FsYyh2YXIoLS1zcGFjaW5nKSArIDJweCk7XFxuICBoZWlnaHQ6IGNhbGModmFyKC0tc3BhY2luZykgKyAxcHgpO1xcbiAgYm9yZGVyOiBzb2xpZCAjZGRkO1xcbiAgYm9yZGVyLXdpZHRoOiAwIDAgMnB4IDJweDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTo6bWFya2VyLFxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6Oi13ZWJraXQtZGV0YWlscy1tYXJrZXIge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTpmb2N1cyB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5OmZvY3VzLXZpc2libGUge1xcbiAgb3V0bGluZTogMXB4IGRvdHRlZCAjMDAwO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBsaTo6YWZ0ZXIsXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTo6YmVmb3JlIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiBjYWxjKHZhcigtLXNwYWNpbmcpIC8gMiAtIHZhcigtLXJhZGl1cykpO1xcbiAgbGVmdDogY2FsYyh2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAxcHgpO1xcbiAgd2lkdGg6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykpO1xcbiAgaGVpZ2h0OiBjYWxjKDIgKiB2YXIoLS1yYWRpdXMpKTtcXG4gIGJhY2tncm91bmQ6ICNkZGQ7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiPlxcXCI7XFxuICB6LWluZGV4OiAxO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzI3MjgyMjtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgbGluZS1oZWlnaHQ6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykgLSAycHgpO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbGVmdDogNXB4O1xcbiAgdG9wOiA3cHg7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGRldGFpbHNbb3Blbl0gPiBzdW1tYXJ5OjpiZWZvcmUge1xcbiAgdHJhbnNmb3JtOiByb3RhdGUoOTBkZWcpO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY29tcG9uZW50cy9FZGl0b3Iuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHlCQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSx5Q0FBQTtFQUNBLGFBQUE7RUFDQSxhQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7QUFDRjs7QUFFQTtFQUNFLFNBQUE7RUFDQSxVQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0VBQ0EsdUJBQUE7QUFDRjtBQUNFO0VBQ0Usc0JBQUE7QUFDSjs7QUFHQTtFQUNFLGNBQUE7RUFDQSxrQkFBQTtFQUNBLDREQUFBO0VBQ0EsbUJBQUE7QUFBRjs7QUFHQTtFQUNFLDJCQUFBO0FBQUY7O0FBR0E7RUFDRSx5QkFBQTtBQUFGOztBQUdBO0VBQ0UsV0FBQTtFQUNBLGNBQUE7RUFDQSxrQkFBQTtFQUNBLDhCQUFBO0VBQ0EsVUFBQTtFQUNBLGlDQUFBO0VBQ0Esa0NBQUE7RUFDQSxrQkFBQTtFQUNBLHlCQUFBO0FBQUY7O0FBR0E7RUFDRSxjQUFBO0VBQ0EsZUFBQTtBQUFGOztBQUdBOztFQUVFLGFBQUE7QUFBRjs7QUFHQTtFQUNFLGFBQUE7QUFBRjs7QUFHQTtFQUNFLHdCQUFBO0FBQUY7O0FBR0E7O0VBRUUsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsNkNBQUE7RUFDQSxnREFBQTtFQUNBLDhCQUFBO0VBQ0EsK0JBQUE7RUFDQSxnQkFBQTtBQUFGOztBQUdBO0VBQ0UsWUFBQTtFQUNBLFVBQUE7RUFDQSx5QkFBQTtFQUNBLFdBQUE7RUFDQSwwQ0FBQTtFQUNBLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFFBQUE7QUFBRjs7QUFHQTtFQUVFLHdCQUFBO0FBREZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmVkaXRvciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjcyODIyO1xcbiAgY29sb3I6ICNmZmY7XFxuICBmb250LXNpemU6IDExcHg7XFxuICBmb250LWZhbWlseTogQXJpYWwsIEhlbHZldGljYSwgc2Fucy1zZXJpZjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBoZWlnaHQ6IDM2NXB4O1xcbn1cXG5cXG4uZWRpdG9yIC5hY2Uge1xcbiAgZmxleC1iYXNpczogNzUlO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCB7XFxuICAtLXNwYWNpbmc6IDFyZW07XFxuICAtLXJhZGl1czogN3B4O1xcbiAgZmxleC1iYXNpczogMjUlO1xcbiAgcGFkZGluZzogMC41cmVtO1xcbiAgb3ZlcmZsb3cteTogYXV0bztcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgdWwge1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgbGkge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgcGFkZGluZzogMC4yNXJlbSAwLjVyZW07XFxuXFxuICAmOmhvdmVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogIzIyMjtcXG4gIH1cXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgbGkge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBwYWRkaW5nLWxlZnQ6IGNhbGMoMiAqIHZhcigtLXNwYWNpbmcpIC0gdmFyKC0tcmFkaXVzKSAtIDJweCk7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCB1bCBsaSB7XFxuICBib3JkZXItbGVmdDogMnB4IHNvbGlkICNkZGQ7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHVsIGxpOmxhc3QtY2hpbGQge1xcbiAgYm9yZGVyLWNvbG9yOiB0cmFuc3BhcmVudDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgdWwgbGk6OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiBjYWxjKHZhcigtLXNwYWNpbmcpIC8gLTQpO1xcbiAgbGVmdDogLTJweDtcXG4gIHdpZHRoOiBjYWxjKHZhcigtLXNwYWNpbmcpICsgMnB4KTtcXG4gIGhlaWdodDogY2FsYyh2YXIoLS1zcGFjaW5nKSArIDFweCk7XFxuICBib3JkZXI6IHNvbGlkICNkZGQ7XFxuICBib3JkZXItd2lkdGg6IDAgMCAycHggMnB4O1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5IHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5OjptYXJrZXIsXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTo6LXdlYmtpdC1kZXRhaWxzLW1hcmtlciB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5OmZvY3VzIHtcXG4gIG91dGxpbmU6IG5vbmU7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IHN1bW1hcnk6Zm9jdXMtdmlzaWJsZSB7XFxuICBvdXRsaW5lOiAxcHggZG90dGVkICMwMDA7XFxufVxcblxcbi5lZGl0b3IgLmZpbGVMaXN0IGxpOjphZnRlcixcXG4uZWRpdG9yIC5maWxlTGlzdCBzdW1tYXJ5OjpiZWZvcmUge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICB0b3A6IGNhbGModmFyKC0tc3BhY2luZykgLyAyIC0gdmFyKC0tcmFkaXVzKSk7XFxuICBsZWZ0OiBjYWxjKHZhcigtLXNwYWNpbmcpIC0gdmFyKC0tcmFkaXVzKSAtIDFweCk7XFxuICB3aWR0aDogY2FsYygyICogdmFyKC0tcmFkaXVzKSk7XFxuICBoZWlnaHQ6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykpO1xcbiAgYmFja2dyb3VuZDogI2RkZDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3Qgc3VtbWFyeTo6YmVmb3JlIHtcXG4gIGNvbnRlbnQ6IFxcXCI+XFxcIjtcXG4gIHotaW5kZXg6IDE7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMjcyODIyO1xcbiAgY29sb3I6ICNmZmY7XFxuICBsaW5lLWhlaWdodDogY2FsYygyICogdmFyKC0tcmFkaXVzKSAtIDJweCk7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBsZWZ0OiA1cHg7XFxuICB0b3A6IDdweDtcXG59XFxuXFxuLmVkaXRvciAuZmlsZUxpc3QgZGV0YWlsc1tvcGVuXSA+IHN1bW1hcnk6OmJlZm9yZSB7XFxuICAvLyBjb250ZW50IDogJ+KIkic7XFxuICB0cmFuc2Zvcm06IHJvdGF0ZSg5MGRlZyk7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi5pbnRlcmZhY2Uge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZm9udC1zaXplOiAxNHB4O1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXG59XFxuXFxuLmludGVyZmFjZSBpbWcsXFxuLmludGVyZmFjZSBzcGFuLFxcbi5pbnRlcmZhY2Ugd2ViYXVkaW8ta25vYixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLXNsaWRlcixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLXN3aXRjaCB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxufVxcblxcbi5pbnRlcmZhY2UgaW1nIHtcXG4gIHotaW5kZXg6IDE7XFxufVxcblxcbi5pbnRlcmZhY2UgLmxvYWRpbmdTY3JlZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmludGVyZmFjZS5sb2FkaW5nIC5sb2FkaW5nU2NyZWVuIHtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIDAuNSk7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICByaWdodDogMXJlbTtcXG4gIHRvcDogMC41cmVtO1xcbiAgei1pbmRleDogNTtcXG59XFxuXFxuLmludGVyZmFjZS5sb2FkaW5nIC5rZXlib2FyZCB7XFxuICBvcGFjaXR5OiAwLjI7XFxufVxcblxcbi5pbnRlcmZhY2Ugd2ViYXVkaW8ta25vYixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLXNsaWRlcixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLXN3aXRjaCB7XFxuICB6LWluZGV4OiAyO1xcbn1cXG5cXG4uaW50ZXJmYWNlIHNwYW4ge1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHotaW5kZXg6IDM7XFxufVxcblxcbi5pbnRlcmZhY2UgLnRhYnMge1xcbiAgYWxpZ24tY29udGVudDogZmxleC1zdGFydDtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZGlzcGxheTogZmxleDtcXG4gIGZsZXgtd3JhcDogd3JhcDtcXG59XFxuXFxuLmludGVyZmFjZSAucmFkaW90YWIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgb3BhY2l0eTogMDtcXG59XFxuXFxuLmludGVyZmFjZSAubGFiZWwge1xcbiAgd2lkdGg6IDEwMCU7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuICBwYWRkaW5nOiAwLjVyZW0gMXJlbTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmludGVyZmFjZSAubGFiZWw6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzIyMjtcXG59XFxuXFxuLmludGVyZmFjZSAucmFkaW90YWI6Y2hlY2tlZCArIC5sYWJlbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbn1cXG5cXG4uaW50ZXJmYWNlIC5wYW5lbCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMzMzO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgZGlzcGxheTogbm9uZTtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgaGVpZ2h0OiAwO1xcbiAgcGFkZGluZy1ib3R0b206IDQyLjU4JTtcXG59XFxuXFxuLmludGVyZmFjZSAucmFkaW90YWI6Y2hlY2tlZCArIC5sYWJlbCArIC5wYW5lbCB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLmludGVyZmFjZSAucGFuZWwge1xcbiAgb3JkZXI6IDk5O1xcbn1cXG5cXG4uaW50ZXJmYWNlIC5sYWJlbCB7XFxuICB3aWR0aDogYXV0bztcXG59XFxuXFxuLmludGVyZmFjZSAuZGVmYXVsdC10aXRsZSB7XFxuICBmb250LXNpemU6IDJyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY29tcG9uZW50cy9JbnRlcmZhY2Uuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHNCQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSx5Q0FBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7QUFDRjs7QUFFQTs7Ozs7RUFLRSxrQkFBQTtBQUNGOztBQUdBO0VBQ0UsVUFBQTtBQUFGOztBQUdBO0VBQ0UsYUFBQTtBQUFGOztBQUdBO0VBQ0UsbUJBQUE7RUFDQSxvQ0FBQTtFQUNBLGFBQUE7RUFDQSx1QkFBQTtFQUNBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLFdBQUE7RUFDQSxVQUFBO0FBQUY7O0FBR0E7RUFDRSxZQUFBO0FBQUY7O0FBR0E7OztFQUdFLFVBQUE7QUFBRjs7QUFHQTtFQUNFLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsVUFBQTtBQUFGOztBQUdBO0VBQ0UseUJBQUE7RUFDQSxXQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7QUFBRjs7QUFHQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtBQUFGOztBQUdBO0VBQ0UsV0FBQTtFQUNBLGVBQUE7RUFDQSxvQkFBQTtFQUNBLGtCQUFBO0FBQUY7O0FBR0E7RUFDRSxzQkFBQTtBQUFGOztBQUdBO0VBQ0Usc0JBQUE7QUFBRjs7QUFHQTtFQUNFLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsV0FBQTtFQUNBLFNBQUE7RUFDQSxzQkFBQTtBQUFGOztBQUdBO0VBQ0UsY0FBQTtBQUFGOztBQUdBO0VBQ0UsU0FBQTtBQUFGOztBQUVBO0VBQ0UsV0FBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLGlCQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaW50ZXJmYWNlIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGZvbnQtc2l6ZTogMTRweDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxufVxcblxcbi5pbnRlcmZhY2UgaW1nLFxcbi5pbnRlcmZhY2Ugc3BhbixcXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLWtub2IsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zbGlkZXIsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zd2l0Y2gge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgLy8gdHJhbnNmb3JtOiB0cmFuc2xhdGUoLTUwJSwgLTUwJSk7XFxufVxcblxcbi5pbnRlcmZhY2UgaW1nIHtcXG4gIHotaW5kZXg6IDE7XFxufVxcblxcbi5pbnRlcmZhY2UgLmxvYWRpbmdTY3JlZW4ge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmludGVyZmFjZS5sb2FkaW5nIC5sb2FkaW5nU2NyZWVuIHtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDAsIC41KTtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHJpZ2h0OiAxcmVtO1xcbiAgdG9wOiAwLjVyZW07XFxuICB6LWluZGV4OiA1O1xcbn1cXG5cXG4uaW50ZXJmYWNlLmxvYWRpbmcgLmtleWJvYXJkIHtcXG4gIG9wYWNpdHk6IC4yO1xcbn1cXG5cXG4uaW50ZXJmYWNlIHdlYmF1ZGlvLWtub2IsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zbGlkZXIsXFxuLmludGVyZmFjZSB3ZWJhdWRpby1zd2l0Y2gge1xcbiAgei1pbmRleDogMjtcXG59XFxuXFxuLmludGVyZmFjZSBzcGFuIHtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBkaXNwbGF5OiBmbGV4O1xcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XFxuICB6LWluZGV4OiAzO1xcbn1cXG5cXG4uaW50ZXJmYWNlIC50YWJzIHtcXG4gIGFsaWduLWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGRpc3BsYXk6IGZsZXg7XFxuICBmbGV4LXdyYXA6IHdyYXA7XFxufVxcblxcbi5pbnRlcmZhY2UgLnJhZGlvdGFiIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIG9wYWNpdHk6IDA7XFxufVxcblxcbi5pbnRlcmZhY2UgLmxhYmVsIHtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbiAgcGFkZGluZzogMC41cmVtIDFyZW07XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxufVxcblxcbi5pbnRlcmZhY2UgLmxhYmVsOmhvdmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMyMjI7XFxufVxcblxcbi5pbnRlcmZhY2UgLnJhZGlvdGFiOmNoZWNrZWQgKyAubGFiZWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG59XFxuXFxuLmludGVyZmFjZSAucGFuZWwge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzMzMztcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGRpc3BsYXk6IG5vbmU7XFxuICB3aWR0aDogMTAwJTtcXG4gIGhlaWdodDogMDtcXG4gIHBhZGRpbmctYm90dG9tOiA0Mi41OCU7IC8vIDMzMHB4IC8gNzc1cHhcXG59XFxuXFxuLmludGVyZmFjZSAucmFkaW90YWI6Y2hlY2tlZCArIC5sYWJlbCArIC5wYW5lbCB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuLmludGVyZmFjZSAucGFuZWwge1xcbiAgb3JkZXI6IDk5O1xcbn1cXG4uaW50ZXJmYWNlIC5sYWJlbCB7XFxuICB3aWR0aDogYXV0bztcXG59XFxuXFxuLmludGVyZmFjZSAuZGVmYXVsdC10aXRsZSB7XFxuICBmb250LXNpemU6IDJyZW07XFxuICBmb250LXdlaWdodDogYm9sZDtcXG4gIGhlaWdodDogMTAwJTtcXG4gIHdpZHRoOiAxMDAlO1xcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiLy8gSW1wb3J0c1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzXCI7XG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG4vLyBNb2R1bGVcbl9fX0NTU19MT0FERVJfRVhQT1JUX19fLnB1c2goW21vZHVsZS5pZCwgXCIucGxheWVyIC5oZWFkZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogIzAwMDtcXG4gIGNvbG9yOiAjZmZmO1xcbiAgZm9udC1zaXplOiAxMXB4O1xcbiAgZm9udC1mYW1pbHk6IEFyaWFsLCBIZWx2ZXRpY2EsIHNhbnMtc2VyaWY7XFxuICBwYWRkaW5nOiAxcmVtO1xcbn1cXG5cXG4ucGxheWVyIC5oZWFkZXIgaW5wdXQge1xcbiAgbWFyZ2luLXJpZ2h0OiAxcmVtO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY29tcG9uZW50cy9QbGF5ZXIuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHNCQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7RUFDQSx5Q0FBQTtFQUNBLGFBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0FBQ0ZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLnBsYXllciAuaGVhZGVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICMwMDA7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGZvbnQtc2l6ZTogMTFweDtcXG4gIGZvbnQtZmFtaWx5OiBBcmlhbCwgSGVsdmV0aWNhLCBzYW5zLXNlcmlmO1xcbiAgcGFkZGluZzogMXJlbTtcXG59XFxuXFxuLnBsYXllciAuaGVhZGVyIGlucHV0IHtcXG4gIG1hcmdpbi1yaWdodDogMXJlbTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbi8qKlxuICogRXhwb3NlIGBFbWl0dGVyYC5cbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVtaXR0ZXI7XG5cbi8qKlxuICogSW5pdGlhbGl6ZSBhIG5ldyBgRW1pdHRlcmAuXG4gKlxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5mdW5jdGlvbiBFbWl0dGVyKG9iaikge1xuICBpZiAob2JqKSByZXR1cm4gbWl4aW4ob2JqKTtcbn07XG5cbi8qKlxuICogTWl4aW4gdGhlIGVtaXR0ZXIgcHJvcGVydGllcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKiBAYXBpIHByaXZhdGVcbiAqL1xuXG5mdW5jdGlvbiBtaXhpbihvYmopIHtcbiAgZm9yICh2YXIga2V5IGluIEVtaXR0ZXIucHJvdG90eXBlKSB7XG4gICAgb2JqW2tleV0gPSBFbWl0dGVyLnByb3RvdHlwZVtrZXldO1xuICB9XG4gIHJldHVybiBvYmo7XG59XG5cbi8qKlxuICogTGlzdGVuIG9uIHRoZSBnaXZlbiBgZXZlbnRgIHdpdGggYGZuYC5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGZuXG4gKiBAcmV0dXJuIHtFbWl0dGVyfVxuICogQGFwaSBwdWJsaWNcbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5vbiA9XG5FbWl0dGVyLnByb3RvdHlwZS5hZGRFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICAodGhpcy5fY2FsbGJhY2tzW2V2ZW50XSA9IHRoaXMuX2NhbGxiYWNrc1tldmVudF0gfHwgW10pXG4gICAgLnB1c2goZm4pO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQWRkcyBhbiBgZXZlbnRgIGxpc3RlbmVyIHRoYXQgd2lsbCBiZSBpbnZva2VkIGEgc2luZ2xlXG4gKiB0aW1lIHRoZW4gYXV0b21hdGljYWxseSByZW1vdmVkLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHBhcmFtIHtGdW5jdGlvbn0gZm5cbiAqIEByZXR1cm4ge0VtaXR0ZXJ9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbihldmVudCwgZm4pe1xuICB2YXIgc2VsZiA9IHRoaXM7XG4gIHRoaXMuX2NhbGxiYWNrcyA9IHRoaXMuX2NhbGxiYWNrcyB8fCB7fTtcblxuICBmdW5jdGlvbiBvbigpIHtcbiAgICBzZWxmLm9mZihldmVudCwgb24pO1xuICAgIGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cblxuICBvbi5mbiA9IGZuO1xuICB0aGlzLm9uKGV2ZW50LCBvbik7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZW1vdmUgdGhlIGdpdmVuIGNhbGxiYWNrIGZvciBgZXZlbnRgIG9yIGFsbFxuICogcmVnaXN0ZXJlZCBjYWxsYmFja3MuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IGV2ZW50XG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmblxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUub2ZmID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbkVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG5FbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVFdmVudExpc3RlbmVyID0gZnVuY3Rpb24oZXZlbnQsIGZuKXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuXG4gIC8vIGFsbFxuICBpZiAoMCA9PSBhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgdGhpcy5fY2FsbGJhY2tzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBzcGVjaWZpYyBldmVudFxuICB2YXIgY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XTtcbiAgaWYgKCFjYWxsYmFja3MpIHJldHVybiB0aGlzO1xuXG4gIC8vIHJlbW92ZSBhbGwgaGFuZGxlcnNcbiAgaWYgKDEgPT0gYXJndW1lbnRzLmxlbmd0aCkge1xuICAgIGRlbGV0ZSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gcmVtb3ZlIHNwZWNpZmljIGhhbmRsZXJcbiAgdmFyIGNiO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xuICAgIGNiID0gY2FsbGJhY2tzW2ldO1xuICAgIGlmIChjYiA9PT0gZm4gfHwgY2IuZm4gPT09IGZuKSB7XG4gICAgICBjYWxsYmFja3Muc3BsaWNlKGksIDEpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBFbWl0IGBldmVudGAgd2l0aCB0aGUgZ2l2ZW4gYXJncy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gZXZlbnRcbiAqIEBwYXJhbSB7TWl4ZWR9IC4uLlxuICogQHJldHVybiB7RW1pdHRlcn1cbiAqL1xuXG5FbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuICB0aGlzLl9jYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3MgfHwge307XG4gIHZhciBhcmdzID0gW10uc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpXG4gICAgLCBjYWxsYmFja3MgPSB0aGlzLl9jYWxsYmFja3NbZXZlbnRdO1xuXG4gIGlmIChjYWxsYmFja3MpIHtcbiAgICBjYWxsYmFja3MgPSBjYWxsYmFja3Muc2xpY2UoMCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNhbGxiYWNrcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xuICAgICAgY2FsbGJhY2tzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBSZXR1cm4gYXJyYXkgb2YgY2FsbGJhY2tzIGZvciBgZXZlbnRgLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7QXJyYXl9XG4gKiBAYXBpIHB1YmxpY1xuICovXG5cbkVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKGV2ZW50KXtcbiAgdGhpcy5fY2FsbGJhY2tzID0gdGhpcy5fY2FsbGJhY2tzIHx8IHt9O1xuICByZXR1cm4gdGhpcy5fY2FsbGJhY2tzW2V2ZW50XSB8fCBbXTtcbn07XG5cbi8qKlxuICogQ2hlY2sgaWYgdGhpcyBlbWl0dGVyIGhhcyBgZXZlbnRgIGhhbmRsZXJzLlxuICpcbiAqIEBwYXJhbSB7U3RyaW5nfSBldmVudFxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqIEBhcGkgcHVibGljXG4gKi9cblxuRW1pdHRlci5wcm90b3R5cGUuaGFzTGlzdGVuZXJzID0gZnVuY3Rpb24oZXZlbnQpe1xuICByZXR1cm4gISEgdGhpcy5saXN0ZW5lcnMoZXZlbnQpLmxlbmd0aDtcbn07XG4iLCIvKiEgaWVlZTc1NC4gQlNELTMtQ2xhdXNlIExpY2Vuc2UuIEZlcm9zcyBBYm91a2hhZGlqZWggPGh0dHBzOi8vZmVyb3NzLm9yZy9vcGVuc291cmNlPiAqL1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24gKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG1cbiAgdmFyIGVMZW4gPSAobkJ5dGVzICogOCkgLSBtTGVuIC0gMVxuICB2YXIgZU1heCA9ICgxIDw8IGVMZW4pIC0gMVxuICB2YXIgZUJpYXMgPSBlTWF4ID4+IDFcbiAgdmFyIG5CaXRzID0gLTdcbiAgdmFyIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMFxuICB2YXIgZCA9IGlzTEUgPyAtMSA6IDFcbiAgdmFyIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV1cblxuICBpICs9IGRcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBzID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBlTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSAoZSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKVxuICBlID4+PSAoLW5CaXRzKVxuICBuQml0cyArPSBtTGVuXG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSAobSAqIDI1NikgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCkge31cblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXNcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpXG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKVxuICAgIGUgPSBlIC0gZUJpYXNcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKVxufVxuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24gKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjXG4gIHZhciBlTGVuID0gKG5CeXRlcyAqIDgpIC0gbUxlbiAtIDFcbiAgdmFyIGVNYXggPSAoMSA8PCBlTGVuKSAtIDFcbiAgdmFyIGVCaWFzID0gZU1heCA+PiAxXG4gIHZhciBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMClcbiAgdmFyIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKVxuICB2YXIgZCA9IGlzTEUgPyAxIDogLTFcbiAgdmFyIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDBcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKVxuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwXG4gICAgZSA9IGVNYXhcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMilcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS1cbiAgICAgIGMgKj0gMlxuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gY1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcylcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKytcbiAgICAgIGMgLz0gMlxuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDBcbiAgICAgIGUgPSBlTWF4XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICgodmFsdWUgKiBjKSAtIDEpICogTWF0aC5wb3coMiwgbUxlbilcbiAgICAgIGUgPSBlICsgZUJpYXNcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pXG4gICAgICBlID0gMFxuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpIHt9XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbVxuICBlTGVuICs9IG1MZW5cbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KSB7fVxuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyOFxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vIHJlZjogaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtZ2xvYmFsXG52YXIgZ2V0R2xvYmFsID0gZnVuY3Rpb24gKCkge1xuXHQvLyB0aGUgb25seSByZWxpYWJsZSBtZWFucyB0byBnZXQgdGhlIGdsb2JhbCBvYmplY3QgaXNcblx0Ly8gYEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClgXG5cdC8vIEhvd2V2ZXIsIHRoaXMgY2F1c2VzIENTUCB2aW9sYXRpb25zIGluIENocm9tZSBhcHBzLlxuXHRpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSB7IHJldHVybiBzZWxmOyB9XG5cdGlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gd2luZG93OyB9XG5cdGlmICh0eXBlb2YgZ2xvYmFsICE9PSAndW5kZWZpbmVkJykgeyByZXR1cm4gZ2xvYmFsOyB9XG5cdHRocm93IG5ldyBFcnJvcigndW5hYmxlIHRvIGxvY2F0ZSBnbG9iYWwgb2JqZWN0Jyk7XG59XG5cbnZhciBnbG9iYWxPYmplY3QgPSBnZXRHbG9iYWwoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gZ2xvYmFsT2JqZWN0LmZldGNoO1xuXG4vLyBOZWVkZWQgZm9yIFR5cGVTY3JpcHQgYW5kIFdlYnBhY2suXG5pZiAoZ2xvYmFsT2JqZWN0LmZldGNoKSB7XG5cdGV4cG9ydHMuZGVmYXVsdCA9IGdsb2JhbE9iamVjdC5mZXRjaC5iaW5kKGdsb2JhbE9iamVjdCk7XG59XG5cbmV4cG9ydHMuSGVhZGVycyA9IGdsb2JhbE9iamVjdC5IZWFkZXJzO1xuZXhwb3J0cy5SZXF1ZXN0ID0gZ2xvYmFsT2JqZWN0LlJlcXVlc3Q7XG5leHBvcnRzLlJlc3BvbnNlID0gZ2xvYmFsT2JqZWN0LlJlc3BvbnNlO1xuIiwiLyohIHNhZmUtYnVmZmVyLiBNSVQgTGljZW5zZS4gRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnL29wZW5zb3VyY2U+ICovXG4vKiBlc2xpbnQtZGlzYWJsZSBub2RlL25vLWRlcHJlY2F0ZWQtYXBpICovXG52YXIgYnVmZmVyID0gcmVxdWlyZSgnYnVmZmVyJylcbnZhciBCdWZmZXIgPSBidWZmZXIuQnVmZmVyXG5cbi8vIGFsdGVybmF0aXZlIHRvIHVzaW5nIE9iamVjdC5rZXlzIGZvciBvbGQgYnJvd3NlcnNcbmZ1bmN0aW9uIGNvcHlQcm9wcyAoc3JjLCBkc3QpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykge1xuICAgIGRzdFtrZXldID0gc3JjW2tleV1cbiAgfVxufVxuaWYgKEJ1ZmZlci5mcm9tICYmIEJ1ZmZlci5hbGxvYyAmJiBCdWZmZXIuYWxsb2NVbnNhZmUgJiYgQnVmZmVyLmFsbG9jVW5zYWZlU2xvdykge1xuICBtb2R1bGUuZXhwb3J0cyA9IGJ1ZmZlclxufSBlbHNlIHtcbiAgLy8gQ29weSBwcm9wZXJ0aWVzIGZyb20gcmVxdWlyZSgnYnVmZmVyJylcbiAgY29weVByb3BzKGJ1ZmZlciwgZXhwb3J0cylcbiAgZXhwb3J0cy5CdWZmZXIgPSBTYWZlQnVmZmVyXG59XG5cbmZ1bmN0aW9uIFNhZmVCdWZmZXIgKGFyZywgZW5jb2RpbmdPck9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cblNhZmVCdWZmZXIucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShCdWZmZXIucHJvdG90eXBlKVxuXG4vLyBDb3B5IHN0YXRpYyBtZXRob2RzIGZyb20gQnVmZmVyXG5jb3B5UHJvcHMoQnVmZmVyLCBTYWZlQnVmZmVyKVxuXG5TYWZlQnVmZmVyLmZyb20gPSBmdW5jdGlvbiAoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKHR5cGVvZiBhcmcgPT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBub3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHJldHVybiBCdWZmZXIoYXJnLCBlbmNvZGluZ09yT2Zmc2V0LCBsZW5ndGgpXG59XG5cblNhZmVCdWZmZXIuYWxsb2MgPSBmdW5jdGlvbiAoc2l6ZSwgZmlsbCwgZW5jb2RpbmcpIHtcbiAgaWYgKHR5cGVvZiBzaXplICE9PSAnbnVtYmVyJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FyZ3VtZW50IG11c3QgYmUgYSBudW1iZXInKVxuICB9XG4gIHZhciBidWYgPSBCdWZmZXIoc2l6ZSlcbiAgaWYgKGZpbGwgIT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgZW5jb2RpbmcgPT09ICdzdHJpbmcnKSB7XG4gICAgICBidWYuZmlsbChmaWxsLCBlbmNvZGluZylcbiAgICB9IGVsc2Uge1xuICAgICAgYnVmLmZpbGwoZmlsbClcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgYnVmLmZpbGwoMClcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cblNhZmVCdWZmZXIuYWxsb2NVbnNhZmUgPSBmdW5jdGlvbiAoc2l6ZSkge1xuICBpZiAodHlwZW9mIHNpemUgIT09ICdudW1iZXInKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQXJndW1lbnQgbXVzdCBiZSBhIG51bWJlcicpXG4gIH1cbiAgcmV0dXJuIEJ1ZmZlcihzaXplKVxufVxuXG5TYWZlQnVmZmVyLmFsbG9jVW5zYWZlU2xvdyA9IGZ1bmN0aW9uIChzaXplKSB7XG4gIGlmICh0eXBlb2Ygc2l6ZSAhPT0gJ251bWJlcicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdBcmd1bWVudCBtdXN0IGJlIGEgbnVtYmVyJylcbiAgfVxuICByZXR1cm4gYnVmZmVyLlNsb3dCdWZmZXIoc2l6ZSlcbn1cbiIsIjsoZnVuY3Rpb24gKHNheCkgeyAvLyB3cmFwcGVyIGZvciBub24tbm9kZSBlbnZzXG4gIHNheC5wYXJzZXIgPSBmdW5jdGlvbiAoc3RyaWN0LCBvcHQpIHsgcmV0dXJuIG5ldyBTQVhQYXJzZXIoc3RyaWN0LCBvcHQpIH1cbiAgc2F4LlNBWFBhcnNlciA9IFNBWFBhcnNlclxuICBzYXguU0FYU3RyZWFtID0gU0FYU3RyZWFtXG4gIHNheC5jcmVhdGVTdHJlYW0gPSBjcmVhdGVTdHJlYW1cblxuICAvLyBXaGVuIHdlIHBhc3MgdGhlIE1BWF9CVUZGRVJfTEVOR1RIIHBvc2l0aW9uLCBzdGFydCBjaGVja2luZyBmb3IgYnVmZmVyIG92ZXJydW5zLlxuICAvLyBXaGVuIHdlIGNoZWNrLCBzY2hlZHVsZSB0aGUgbmV4dCBjaGVjayBmb3IgTUFYX0JVRkZFUl9MRU5HVEggLSAobWF4KGJ1ZmZlciBsZW5ndGhzKSksXG4gIC8vIHNpbmNlIHRoYXQncyB0aGUgZWFybGllc3QgdGhhdCBhIGJ1ZmZlciBvdmVycnVuIGNvdWxkIG9jY3VyLiAgVGhpcyB3YXksIGNoZWNrcyBhcmVcbiAgLy8gYXMgcmFyZSBhcyByZXF1aXJlZCwgYnV0IGFzIG9mdGVuIGFzIG5lY2Vzc2FyeSB0byBlbnN1cmUgbmV2ZXIgY3Jvc3NpbmcgdGhpcyBib3VuZC5cbiAgLy8gRnVydGhlcm1vcmUsIGJ1ZmZlcnMgYXJlIG9ubHkgdGVzdGVkIGF0IG1vc3Qgb25jZSBwZXIgd3JpdGUoKSwgc28gcGFzc2luZyBhIHZlcnlcbiAgLy8gbGFyZ2Ugc3RyaW5nIGludG8gd3JpdGUoKSBtaWdodCBoYXZlIHVuZGVzaXJhYmxlIGVmZmVjdHMsIGJ1dCB0aGlzIGlzIG1hbmFnZWFibGUgYnlcbiAgLy8gdGhlIGNhbGxlciwgc28gaXQgaXMgYXNzdW1lZCB0byBiZSBzYWZlLiAgVGh1cywgYSBjYWxsIHRvIHdyaXRlKCkgbWF5LCBpbiB0aGUgZXh0cmVtZVxuICAvLyBlZGdlIGNhc2UsIHJlc3VsdCBpbiBjcmVhdGluZyBhdCBtb3N0IG9uZSBjb21wbGV0ZSBjb3B5IG9mIHRoZSBzdHJpbmcgcGFzc2VkIGluLlxuICAvLyBTZXQgdG8gSW5maW5pdHkgdG8gaGF2ZSB1bmxpbWl0ZWQgYnVmZmVycy5cbiAgc2F4Lk1BWF9CVUZGRVJfTEVOR1RIID0gNjQgKiAxMDI0XG5cbiAgdmFyIGJ1ZmZlcnMgPSBbXG4gICAgJ2NvbW1lbnQnLCAnc2dtbERlY2wnLCAndGV4dE5vZGUnLCAndGFnTmFtZScsICdkb2N0eXBlJyxcbiAgICAncHJvY0luc3ROYW1lJywgJ3Byb2NJbnN0Qm9keScsICdlbnRpdHknLCAnYXR0cmliTmFtZScsXG4gICAgJ2F0dHJpYlZhbHVlJywgJ2NkYXRhJywgJ3NjcmlwdCdcbiAgXVxuXG4gIHNheC5FVkVOVFMgPSBbXG4gICAgJ3RleHQnLFxuICAgICdwcm9jZXNzaW5naW5zdHJ1Y3Rpb24nLFxuICAgICdzZ21sZGVjbGFyYXRpb24nLFxuICAgICdkb2N0eXBlJyxcbiAgICAnY29tbWVudCcsXG4gICAgJ29wZW50YWdzdGFydCcsXG4gICAgJ2F0dHJpYnV0ZScsXG4gICAgJ29wZW50YWcnLFxuICAgICdjbG9zZXRhZycsXG4gICAgJ29wZW5jZGF0YScsXG4gICAgJ2NkYXRhJyxcbiAgICAnY2xvc2VjZGF0YScsXG4gICAgJ2Vycm9yJyxcbiAgICAnZW5kJyxcbiAgICAncmVhZHknLFxuICAgICdzY3JpcHQnLFxuICAgICdvcGVubmFtZXNwYWNlJyxcbiAgICAnY2xvc2VuYW1lc3BhY2UnXG4gIF1cblxuICBmdW5jdGlvbiBTQVhQYXJzZXIgKHN0cmljdCwgb3B0KSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNBWFBhcnNlcikpIHtcbiAgICAgIHJldHVybiBuZXcgU0FYUGFyc2VyKHN0cmljdCwgb3B0KVxuICAgIH1cblxuICAgIHZhciBwYXJzZXIgPSB0aGlzXG4gICAgY2xlYXJCdWZmZXJzKHBhcnNlcilcbiAgICBwYXJzZXIucSA9IHBhcnNlci5jID0gJydcbiAgICBwYXJzZXIuYnVmZmVyQ2hlY2tQb3NpdGlvbiA9IHNheC5NQVhfQlVGRkVSX0xFTkdUSFxuICAgIHBhcnNlci5vcHQgPSBvcHQgfHwge31cbiAgICBwYXJzZXIub3B0Lmxvd2VyY2FzZSA9IHBhcnNlci5vcHQubG93ZXJjYXNlIHx8IHBhcnNlci5vcHQubG93ZXJjYXNldGFnc1xuICAgIHBhcnNlci5sb29zZUNhc2UgPSBwYXJzZXIub3B0Lmxvd2VyY2FzZSA/ICd0b0xvd2VyQ2FzZScgOiAndG9VcHBlckNhc2UnXG4gICAgcGFyc2VyLnRhZ3MgPSBbXVxuICAgIHBhcnNlci5jbG9zZWQgPSBwYXJzZXIuY2xvc2VkUm9vdCA9IHBhcnNlci5zYXdSb290ID0gZmFsc2VcbiAgICBwYXJzZXIudGFnID0gcGFyc2VyLmVycm9yID0gbnVsbFxuICAgIHBhcnNlci5zdHJpY3QgPSAhIXN0cmljdFxuICAgIHBhcnNlci5ub3NjcmlwdCA9ICEhKHN0cmljdCB8fCBwYXJzZXIub3B0Lm5vc2NyaXB0KVxuICAgIHBhcnNlci5zdGF0ZSA9IFMuQkVHSU5cbiAgICBwYXJzZXIuc3RyaWN0RW50aXRpZXMgPSBwYXJzZXIub3B0LnN0cmljdEVudGl0aWVzXG4gICAgcGFyc2VyLkVOVElUSUVTID0gcGFyc2VyLnN0cmljdEVudGl0aWVzID8gT2JqZWN0LmNyZWF0ZShzYXguWE1MX0VOVElUSUVTKSA6IE9iamVjdC5jcmVhdGUoc2F4LkVOVElUSUVTKVxuICAgIHBhcnNlci5hdHRyaWJMaXN0ID0gW11cblxuICAgIC8vIG5hbWVzcGFjZXMgZm9ybSBhIHByb3RvdHlwZSBjaGFpbi5cbiAgICAvLyBpdCBhbHdheXMgcG9pbnRzIGF0IHRoZSBjdXJyZW50IHRhZyxcbiAgICAvLyB3aGljaCBwcm90b3MgdG8gaXRzIHBhcmVudCB0YWcuXG4gICAgaWYgKHBhcnNlci5vcHQueG1sbnMpIHtcbiAgICAgIHBhcnNlci5ucyA9IE9iamVjdC5jcmVhdGUocm9vdE5TKVxuICAgIH1cblxuICAgIC8vIG1vc3RseSBqdXN0IGZvciBlcnJvciByZXBvcnRpbmdcbiAgICBwYXJzZXIudHJhY2tQb3NpdGlvbiA9IHBhcnNlci5vcHQucG9zaXRpb24gIT09IGZhbHNlXG4gICAgaWYgKHBhcnNlci50cmFja1Bvc2l0aW9uKSB7XG4gICAgICBwYXJzZXIucG9zaXRpb24gPSBwYXJzZXIubGluZSA9IHBhcnNlci5jb2x1bW4gPSAwXG4gICAgfVxuICAgIGVtaXQocGFyc2VyLCAnb25yZWFkeScpXG4gIH1cblxuICBpZiAoIU9iamVjdC5jcmVhdGUpIHtcbiAgICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGZ1bmN0aW9uIEYgKCkge31cbiAgICAgIEYucHJvdG90eXBlID0gb1xuICAgICAgdmFyIG5ld2YgPSBuZXcgRigpXG4gICAgICByZXR1cm4gbmV3ZlxuICAgIH1cbiAgfVxuXG4gIGlmICghT2JqZWN0LmtleXMpIHtcbiAgICBPYmplY3Qua2V5cyA9IGZ1bmN0aW9uIChvKSB7XG4gICAgICB2YXIgYSA9IFtdXG4gICAgICBmb3IgKHZhciBpIGluIG8pIGlmIChvLmhhc093blByb3BlcnR5KGkpKSBhLnB1c2goaSlcbiAgICAgIHJldHVybiBhXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hlY2tCdWZmZXJMZW5ndGggKHBhcnNlcikge1xuICAgIHZhciBtYXhBbGxvd2VkID0gTWF0aC5tYXgoc2F4Lk1BWF9CVUZGRVJfTEVOR1RILCAxMClcbiAgICB2YXIgbWF4QWN0dWFsID0gMFxuICAgIGZvciAodmFyIGkgPSAwLCBsID0gYnVmZmVycy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIHZhciBsZW4gPSBwYXJzZXJbYnVmZmVyc1tpXV0ubGVuZ3RoXG4gICAgICBpZiAobGVuID4gbWF4QWxsb3dlZCkge1xuICAgICAgICAvLyBUZXh0L2NkYXRhIG5vZGVzIGNhbiBnZXQgYmlnLCBhbmQgc2luY2UgdGhleSdyZSBidWZmZXJlZCxcbiAgICAgICAgLy8gd2UgY2FuIGdldCBoZXJlIHVuZGVyIG5vcm1hbCBjb25kaXRpb25zLlxuICAgICAgICAvLyBBdm9pZCBpc3N1ZXMgYnkgZW1pdHRpbmcgdGhlIHRleHQgbm9kZSBub3csXG4gICAgICAgIC8vIHNvIGF0IGxlYXN0IGl0IHdvbid0IGdldCBhbnkgYmlnZ2VyLlxuICAgICAgICBzd2l0Y2ggKGJ1ZmZlcnNbaV0pIHtcbiAgICAgICAgICBjYXNlICd0ZXh0Tm9kZSc6XG4gICAgICAgICAgICBjbG9zZVRleHQocGFyc2VyKVxuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ2NkYXRhJzpcbiAgICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uY2RhdGEnLCBwYXJzZXIuY2RhdGEpXG4gICAgICAgICAgICBwYXJzZXIuY2RhdGEgPSAnJ1xuICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgIGNhc2UgJ3NjcmlwdCc6XG4gICAgICAgICAgICBlbWl0Tm9kZShwYXJzZXIsICdvbnNjcmlwdCcsIHBhcnNlci5zY3JpcHQpXG4gICAgICAgICAgICBwYXJzZXIuc2NyaXB0ID0gJydcbiAgICAgICAgICAgIGJyZWFrXG5cbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZXJyb3IocGFyc2VyLCAnTWF4IGJ1ZmZlciBsZW5ndGggZXhjZWVkZWQ6ICcgKyBidWZmZXJzW2ldKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBtYXhBY3R1YWwgPSBNYXRoLm1heChtYXhBY3R1YWwsIGxlbilcbiAgICB9XG4gICAgLy8gc2NoZWR1bGUgdGhlIG5leHQgY2hlY2sgZm9yIHRoZSBlYXJsaWVzdCBwb3NzaWJsZSBidWZmZXIgb3ZlcnJ1bi5cbiAgICB2YXIgbSA9IHNheC5NQVhfQlVGRkVSX0xFTkdUSCAtIG1heEFjdHVhbFxuICAgIHBhcnNlci5idWZmZXJDaGVja1Bvc2l0aW9uID0gbSArIHBhcnNlci5wb3NpdGlvblxuICB9XG5cbiAgZnVuY3Rpb24gY2xlYXJCdWZmZXJzIChwYXJzZXIpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGJ1ZmZlcnMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBwYXJzZXJbYnVmZmVyc1tpXV0gPSAnJ1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoQnVmZmVycyAocGFyc2VyKSB7XG4gICAgY2xvc2VUZXh0KHBhcnNlcilcbiAgICBpZiAocGFyc2VyLmNkYXRhICE9PSAnJykge1xuICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jZGF0YScsIHBhcnNlci5jZGF0YSlcbiAgICAgIHBhcnNlci5jZGF0YSA9ICcnXG4gICAgfVxuICAgIGlmIChwYXJzZXIuc2NyaXB0ICE9PSAnJykge1xuICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25zY3JpcHQnLCBwYXJzZXIuc2NyaXB0KVxuICAgICAgcGFyc2VyLnNjcmlwdCA9ICcnXG4gICAgfVxuICB9XG5cbiAgU0FYUGFyc2VyLnByb3RvdHlwZSA9IHtcbiAgICBlbmQ6IGZ1bmN0aW9uICgpIHsgZW5kKHRoaXMpIH0sXG4gICAgd3JpdGU6IHdyaXRlLFxuICAgIHJlc3VtZTogZnVuY3Rpb24gKCkgeyB0aGlzLmVycm9yID0gbnVsbDsgcmV0dXJuIHRoaXMgfSxcbiAgICBjbG9zZTogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy53cml0ZShudWxsKSB9LFxuICAgIGZsdXNoOiBmdW5jdGlvbiAoKSB7IGZsdXNoQnVmZmVycyh0aGlzKSB9XG4gIH1cblxuICB2YXIgU3RyZWFtXG4gIHRyeSB7XG4gICAgU3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJykuU3RyZWFtXG4gIH0gY2F0Y2ggKGV4KSB7XG4gICAgU3RyZWFtID0gZnVuY3Rpb24gKCkge31cbiAgfVxuXG4gIHZhciBzdHJlYW1XcmFwcyA9IHNheC5FVkVOVFMuZmlsdGVyKGZ1bmN0aW9uIChldikge1xuICAgIHJldHVybiBldiAhPT0gJ2Vycm9yJyAmJiBldiAhPT0gJ2VuZCdcbiAgfSlcblxuICBmdW5jdGlvbiBjcmVhdGVTdHJlYW0gKHN0cmljdCwgb3B0KSB7XG4gICAgcmV0dXJuIG5ldyBTQVhTdHJlYW0oc3RyaWN0LCBvcHQpXG4gIH1cblxuICBmdW5jdGlvbiBTQVhTdHJlYW0gKHN0cmljdCwgb3B0KSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFNBWFN0cmVhbSkpIHtcbiAgICAgIHJldHVybiBuZXcgU0FYU3RyZWFtKHN0cmljdCwgb3B0KVxuICAgIH1cblxuICAgIFN0cmVhbS5hcHBseSh0aGlzKVxuXG4gICAgdGhpcy5fcGFyc2VyID0gbmV3IFNBWFBhcnNlcihzdHJpY3QsIG9wdClcbiAgICB0aGlzLndyaXRhYmxlID0gdHJ1ZVxuICAgIHRoaXMucmVhZGFibGUgPSB0cnVlXG5cbiAgICB2YXIgbWUgPSB0aGlzXG5cbiAgICB0aGlzLl9wYXJzZXIub25lbmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBtZS5lbWl0KCdlbmQnKVxuICAgIH1cblxuICAgIHRoaXMuX3BhcnNlci5vbmVycm9yID0gZnVuY3Rpb24gKGVyKSB7XG4gICAgICBtZS5lbWl0KCdlcnJvcicsIGVyKVxuXG4gICAgICAvLyBpZiBkaWRuJ3QgdGhyb3csIHRoZW4gbWVhbnMgZXJyb3Igd2FzIGhhbmRsZWQuXG4gICAgICAvLyBnbyBhaGVhZCBhbmQgY2xlYXIgZXJyb3IsIHNvIHdlIGNhbiB3cml0ZSBhZ2Fpbi5cbiAgICAgIG1lLl9wYXJzZXIuZXJyb3IgPSBudWxsXG4gICAgfVxuXG4gICAgdGhpcy5fZGVjb2RlciA9IG51bGxcblxuICAgIHN0cmVhbVdyYXBzLmZvckVhY2goZnVuY3Rpb24gKGV2KSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobWUsICdvbicgKyBldiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gbWUuX3BhcnNlclsnb24nICsgZXZdXG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKGgpIHtcbiAgICAgICAgICBpZiAoIWgpIHtcbiAgICAgICAgICAgIG1lLnJlbW92ZUFsbExpc3RlbmVycyhldilcbiAgICAgICAgICAgIG1lLl9wYXJzZXJbJ29uJyArIGV2XSA9IGhcbiAgICAgICAgICAgIHJldHVybiBoXG4gICAgICAgICAgfVxuICAgICAgICAgIG1lLm9uKGV2LCBoKVxuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlXG4gICAgICB9KVxuICAgIH0pXG4gIH1cblxuICBTQVhTdHJlYW0ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShTdHJlYW0ucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBTQVhTdHJlYW1cbiAgICB9XG4gIH0pXG5cbiAgU0FYU3RyZWFtLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgaWYgKHR5cGVvZiBCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIHR5cGVvZiBCdWZmZXIuaXNCdWZmZXIgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIEJ1ZmZlci5pc0J1ZmZlcihkYXRhKSkge1xuICAgICAgaWYgKCF0aGlzLl9kZWNvZGVyKSB7XG4gICAgICAgIHZhciBTRCA9IHJlcXVpcmUoJ3N0cmluZ19kZWNvZGVyJykuU3RyaW5nRGVjb2RlclxuICAgICAgICB0aGlzLl9kZWNvZGVyID0gbmV3IFNEKCd1dGY4JylcbiAgICAgIH1cbiAgICAgIGRhdGEgPSB0aGlzLl9kZWNvZGVyLndyaXRlKGRhdGEpXG4gICAgfVxuXG4gICAgdGhpcy5fcGFyc2VyLndyaXRlKGRhdGEudG9TdHJpbmcoKSlcbiAgICB0aGlzLmVtaXQoJ2RhdGEnLCBkYXRhKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBTQVhTdHJlYW0ucHJvdG90eXBlLmVuZCA9IGZ1bmN0aW9uIChjaHVuaykge1xuICAgIGlmIChjaHVuayAmJiBjaHVuay5sZW5ndGgpIHtcbiAgICAgIHRoaXMud3JpdGUoY2h1bmspXG4gICAgfVxuICAgIHRoaXMuX3BhcnNlci5lbmQoKVxuICAgIHJldHVybiB0cnVlXG4gIH1cblxuICBTQVhTdHJlYW0ucHJvdG90eXBlLm9uID0gZnVuY3Rpb24gKGV2LCBoYW5kbGVyKSB7XG4gICAgdmFyIG1lID0gdGhpc1xuICAgIGlmICghbWUuX3BhcnNlclsnb24nICsgZXZdICYmIHN0cmVhbVdyYXBzLmluZGV4T2YoZXYpICE9PSAtMSkge1xuICAgICAgbWUuX3BhcnNlclsnb24nICsgZXZdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBbYXJndW1lbnRzWzBdXSA6IEFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cylcbiAgICAgICAgYXJncy5zcGxpY2UoMCwgMCwgZXYpXG4gICAgICAgIG1lLmVtaXQuYXBwbHkobWUsIGFyZ3MpXG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmVhbS5wcm90b3R5cGUub24uY2FsbChtZSwgZXYsIGhhbmRsZXIpXG4gIH1cblxuICAvLyB0aGlzIHJlYWxseSBuZWVkcyB0byBiZSByZXBsYWNlZCB3aXRoIGNoYXJhY3RlciBjbGFzc2VzLlxuICAvLyBYTUwgYWxsb3dzIGFsbCBtYW5uZXIgb2YgcmlkaWN1bG91cyBudW1iZXJzIGFuZCBkaWdpdHMuXG4gIHZhciBDREFUQSA9ICdbQ0RBVEFbJ1xuICB2YXIgRE9DVFlQRSA9ICdET0NUWVBFJ1xuICB2YXIgWE1MX05BTUVTUEFDRSA9ICdodHRwOi8vd3d3LnczLm9yZy9YTUwvMTk5OC9uYW1lc3BhY2UnXG4gIHZhciBYTUxOU19OQU1FU1BBQ0UgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nXG4gIHZhciByb290TlMgPSB7IHhtbDogWE1MX05BTUVTUEFDRSwgeG1sbnM6IFhNTE5TX05BTUVTUEFDRSB9XG5cbiAgLy8gaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLXhtbC8jTlQtTmFtZVN0YXJ0Q2hhclxuICAvLyBUaGlzIGltcGxlbWVudGF0aW9uIHdvcmtzIG9uIHN0cmluZ3MsIGEgc2luZ2xlIGNoYXJhY3RlciBhdCBhIHRpbWVcbiAgLy8gYXMgc3VjaCwgaXQgY2Fubm90IGV2ZXIgc3VwcG9ydCBhc3RyYWwtcGxhbmUgY2hhcmFjdGVycyAoMTAwMDAtRUZGRkYpXG4gIC8vIHdpdGhvdXQgYSBzaWduaWZpY2FudCBicmVha2luZyBjaGFuZ2UgdG8gZWl0aGVyIHRoaXMgIHBhcnNlciwgb3IgdGhlXG4gIC8vIEphdmFTY3JpcHQgbGFuZ3VhZ2UuICBJbXBsZW1lbnRhdGlvbiBvZiBhbiBlbW9qaS1jYXBhYmxlIHhtbCBwYXJzZXJcbiAgLy8gaXMgbGVmdCBhcyBhbiBleGVyY2lzZSBmb3IgdGhlIHJlYWRlci5cbiAgdmFyIG5hbWVTdGFydCA9IC9bOl9BLVphLXpcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRdL1xuXG4gIHZhciBuYW1lQm9keSA9IC9bOl9BLVphLXpcXHUwMEMwLVxcdTAwRDZcXHUwMEQ4LVxcdTAwRjZcXHUwMEY4LVxcdTAyRkZcXHUwMzcwLVxcdTAzN0RcXHUwMzdGLVxcdTFGRkZcXHUyMDBDLVxcdTIwMERcXHUyMDcwLVxcdTIxOEZcXHUyQzAwLVxcdTJGRUZcXHUzMDAxLVxcdUQ3RkZcXHVGOTAwLVxcdUZEQ0ZcXHVGREYwLVxcdUZGRkRcXHUwMEI3XFx1MDMwMC1cXHUwMzZGXFx1MjAzRi1cXHUyMDQwLlxcZC1dL1xuXG4gIHZhciBlbnRpdHlTdGFydCA9IC9bIzpfQS1aYS16XFx1MDBDMC1cXHUwMEQ2XFx1MDBEOC1cXHUwMEY2XFx1MDBGOC1cXHUwMkZGXFx1MDM3MC1cXHUwMzdEXFx1MDM3Ri1cXHUxRkZGXFx1MjAwQy1cXHUyMDBEXFx1MjA3MC1cXHUyMThGXFx1MkMwMC1cXHUyRkVGXFx1MzAwMS1cXHVEN0ZGXFx1RjkwMC1cXHVGRENGXFx1RkRGMC1cXHVGRkZEXS9cbiAgdmFyIGVudGl0eUJvZHkgPSAvWyM6X0EtWmEtelxcdTAwQzAtXFx1MDBENlxcdTAwRDgtXFx1MDBGNlxcdTAwRjgtXFx1MDJGRlxcdTAzNzAtXFx1MDM3RFxcdTAzN0YtXFx1MUZGRlxcdTIwMEMtXFx1MjAwRFxcdTIwNzAtXFx1MjE4RlxcdTJDMDAtXFx1MkZFRlxcdTMwMDEtXFx1RDdGRlxcdUY5MDAtXFx1RkRDRlxcdUZERjAtXFx1RkZGRFxcdTAwQjdcXHUwMzAwLVxcdTAzNkZcXHUyMDNGLVxcdTIwNDAuXFxkLV0vXG5cbiAgZnVuY3Rpb24gaXNXaGl0ZXNwYWNlIChjKSB7XG4gICAgcmV0dXJuIGMgPT09ICcgJyB8fCBjID09PSAnXFxuJyB8fCBjID09PSAnXFxyJyB8fCBjID09PSAnXFx0J1xuICB9XG5cbiAgZnVuY3Rpb24gaXNRdW90ZSAoYykge1xuICAgIHJldHVybiBjID09PSAnXCInIHx8IGMgPT09ICdcXCcnXG4gIH1cblxuICBmdW5jdGlvbiBpc0F0dHJpYkVuZCAoYykge1xuICAgIHJldHVybiBjID09PSAnPicgfHwgaXNXaGl0ZXNwYWNlKGMpXG4gIH1cblxuICBmdW5jdGlvbiBpc01hdGNoIChyZWdleCwgYykge1xuICAgIHJldHVybiByZWdleC50ZXN0KGMpXG4gIH1cblxuICBmdW5jdGlvbiBub3RNYXRjaCAocmVnZXgsIGMpIHtcbiAgICByZXR1cm4gIWlzTWF0Y2gocmVnZXgsIGMpXG4gIH1cblxuICB2YXIgUyA9IDBcbiAgc2F4LlNUQVRFID0ge1xuICAgIEJFR0lOOiBTKyssIC8vIGxlYWRpbmcgYnl0ZSBvcmRlciBtYXJrIG9yIHdoaXRlc3BhY2VcbiAgICBCRUdJTl9XSElURVNQQUNFOiBTKyssIC8vIGxlYWRpbmcgd2hpdGVzcGFjZVxuICAgIFRFWFQ6IFMrKywgLy8gZ2VuZXJhbCBzdHVmZlxuICAgIFRFWFRfRU5USVRZOiBTKyssIC8vICZhbXAgYW5kIHN1Y2guXG4gICAgT1BFTl9XQUtBOiBTKyssIC8vIDxcbiAgICBTR01MX0RFQ0w6IFMrKywgLy8gPCFCTEFSR1xuICAgIFNHTUxfREVDTF9RVU9URUQ6IFMrKywgLy8gPCFCTEFSRyBmb28gXCJiYXJcbiAgICBET0NUWVBFOiBTKyssIC8vIDwhRE9DVFlQRVxuICAgIERPQ1RZUEVfUVVPVEVEOiBTKyssIC8vIDwhRE9DVFlQRSBcIi8vYmxhaFxuICAgIERPQ1RZUEVfRFREOiBTKyssIC8vIDwhRE9DVFlQRSBcIi8vYmxhaFwiIFsgLi4uXG4gICAgRE9DVFlQRV9EVERfUVVPVEVEOiBTKyssIC8vIDwhRE9DVFlQRSBcIi8vYmxhaFwiIFsgXCJmb29cbiAgICBDT01NRU5UX1NUQVJUSU5HOiBTKyssIC8vIDwhLVxuICAgIENPTU1FTlQ6IFMrKywgLy8gPCEtLVxuICAgIENPTU1FTlRfRU5ESU5HOiBTKyssIC8vIDwhLS0gYmxhaCAtXG4gICAgQ09NTUVOVF9FTkRFRDogUysrLCAvLyA8IS0tIGJsYWggLS1cbiAgICBDREFUQTogUysrLCAvLyA8IVtDREFUQVsgc29tZXRoaW5nXG4gICAgQ0RBVEFfRU5ESU5HOiBTKyssIC8vIF1cbiAgICBDREFUQV9FTkRJTkdfMjogUysrLCAvLyBdXVxuICAgIFBST0NfSU5TVDogUysrLCAvLyA8P2hpXG4gICAgUFJPQ19JTlNUX0JPRFk6IFMrKywgLy8gPD9oaSB0aGVyZVxuICAgIFBST0NfSU5TVF9FTkRJTkc6IFMrKywgLy8gPD9oaSBcInRoZXJlXCIgP1xuICAgIE9QRU5fVEFHOiBTKyssIC8vIDxzdHJvbmdcbiAgICBPUEVOX1RBR19TTEFTSDogUysrLCAvLyA8c3Ryb25nIC9cbiAgICBBVFRSSUI6IFMrKywgLy8gPGFcbiAgICBBVFRSSUJfTkFNRTogUysrLCAvLyA8YSBmb29cbiAgICBBVFRSSUJfTkFNRV9TQVdfV0hJVEU6IFMrKywgLy8gPGEgZm9vIF9cbiAgICBBVFRSSUJfVkFMVUU6IFMrKywgLy8gPGEgZm9vPVxuICAgIEFUVFJJQl9WQUxVRV9RVU9URUQ6IFMrKywgLy8gPGEgZm9vPVwiYmFyXG4gICAgQVRUUklCX1ZBTFVFX0NMT1NFRDogUysrLCAvLyA8YSBmb289XCJiYXJcIlxuICAgIEFUVFJJQl9WQUxVRV9VTlFVT1RFRDogUysrLCAvLyA8YSBmb289YmFyXG4gICAgQVRUUklCX1ZBTFVFX0VOVElUWV9ROiBTKyssIC8vIDxmb28gYmFyPVwiJnF1b3Q7XCJcbiAgICBBVFRSSUJfVkFMVUVfRU5USVRZX1U6IFMrKywgLy8gPGZvbyBiYXI9JnF1b3RcbiAgICBDTE9TRV9UQUc6IFMrKywgLy8gPC9hXG4gICAgQ0xPU0VfVEFHX1NBV19XSElURTogUysrLCAvLyA8L2EgICA+XG4gICAgU0NSSVBUOiBTKyssIC8vIDxzY3JpcHQ+IC4uLlxuICAgIFNDUklQVF9FTkRJTkc6IFMrKyAvLyA8c2NyaXB0PiAuLi4gPFxuICB9XG5cbiAgc2F4LlhNTF9FTlRJVElFUyA9IHtcbiAgICAnYW1wJzogJyYnLFxuICAgICdndCc6ICc+JyxcbiAgICAnbHQnOiAnPCcsXG4gICAgJ3F1b3QnOiAnXCInLFxuICAgICdhcG9zJzogXCInXCJcbiAgfVxuXG4gIHNheC5FTlRJVElFUyA9IHtcbiAgICAnYW1wJzogJyYnLFxuICAgICdndCc6ICc+JyxcbiAgICAnbHQnOiAnPCcsXG4gICAgJ3F1b3QnOiAnXCInLFxuICAgICdhcG9zJzogXCInXCIsXG4gICAgJ0FFbGlnJzogMTk4LFxuICAgICdBYWN1dGUnOiAxOTMsXG4gICAgJ0FjaXJjJzogMTk0LFxuICAgICdBZ3JhdmUnOiAxOTIsXG4gICAgJ0FyaW5nJzogMTk3LFxuICAgICdBdGlsZGUnOiAxOTUsXG4gICAgJ0F1bWwnOiAxOTYsXG4gICAgJ0NjZWRpbCc6IDE5OSxcbiAgICAnRVRIJzogMjA4LFxuICAgICdFYWN1dGUnOiAyMDEsXG4gICAgJ0VjaXJjJzogMjAyLFxuICAgICdFZ3JhdmUnOiAyMDAsXG4gICAgJ0V1bWwnOiAyMDMsXG4gICAgJ0lhY3V0ZSc6IDIwNSxcbiAgICAnSWNpcmMnOiAyMDYsXG4gICAgJ0lncmF2ZSc6IDIwNCxcbiAgICAnSXVtbCc6IDIwNyxcbiAgICAnTnRpbGRlJzogMjA5LFxuICAgICdPYWN1dGUnOiAyMTEsXG4gICAgJ09jaXJjJzogMjEyLFxuICAgICdPZ3JhdmUnOiAyMTAsXG4gICAgJ09zbGFzaCc6IDIxNixcbiAgICAnT3RpbGRlJzogMjEzLFxuICAgICdPdW1sJzogMjE0LFxuICAgICdUSE9STic6IDIyMixcbiAgICAnVWFjdXRlJzogMjE4LFxuICAgICdVY2lyYyc6IDIxOSxcbiAgICAnVWdyYXZlJzogMjE3LFxuICAgICdVdW1sJzogMjIwLFxuICAgICdZYWN1dGUnOiAyMjEsXG4gICAgJ2FhY3V0ZSc6IDIyNSxcbiAgICAnYWNpcmMnOiAyMjYsXG4gICAgJ2FlbGlnJzogMjMwLFxuICAgICdhZ3JhdmUnOiAyMjQsXG4gICAgJ2FyaW5nJzogMjI5LFxuICAgICdhdGlsZGUnOiAyMjcsXG4gICAgJ2F1bWwnOiAyMjgsXG4gICAgJ2NjZWRpbCc6IDIzMSxcbiAgICAnZWFjdXRlJzogMjMzLFxuICAgICdlY2lyYyc6IDIzNCxcbiAgICAnZWdyYXZlJzogMjMyLFxuICAgICdldGgnOiAyNDAsXG4gICAgJ2V1bWwnOiAyMzUsXG4gICAgJ2lhY3V0ZSc6IDIzNyxcbiAgICAnaWNpcmMnOiAyMzgsXG4gICAgJ2lncmF2ZSc6IDIzNixcbiAgICAnaXVtbCc6IDIzOSxcbiAgICAnbnRpbGRlJzogMjQxLFxuICAgICdvYWN1dGUnOiAyNDMsXG4gICAgJ29jaXJjJzogMjQ0LFxuICAgICdvZ3JhdmUnOiAyNDIsXG4gICAgJ29zbGFzaCc6IDI0OCxcbiAgICAnb3RpbGRlJzogMjQ1LFxuICAgICdvdW1sJzogMjQ2LFxuICAgICdzemxpZyc6IDIyMyxcbiAgICAndGhvcm4nOiAyNTQsXG4gICAgJ3VhY3V0ZSc6IDI1MCxcbiAgICAndWNpcmMnOiAyNTEsXG4gICAgJ3VncmF2ZSc6IDI0OSxcbiAgICAndXVtbCc6IDI1MixcbiAgICAneWFjdXRlJzogMjUzLFxuICAgICd5dW1sJzogMjU1LFxuICAgICdjb3B5JzogMTY5LFxuICAgICdyZWcnOiAxNzQsXG4gICAgJ25ic3AnOiAxNjAsXG4gICAgJ2lleGNsJzogMTYxLFxuICAgICdjZW50JzogMTYyLFxuICAgICdwb3VuZCc6IDE2MyxcbiAgICAnY3VycmVuJzogMTY0LFxuICAgICd5ZW4nOiAxNjUsXG4gICAgJ2JydmJhcic6IDE2NixcbiAgICAnc2VjdCc6IDE2NyxcbiAgICAndW1sJzogMTY4LFxuICAgICdvcmRmJzogMTcwLFxuICAgICdsYXF1byc6IDE3MSxcbiAgICAnbm90JzogMTcyLFxuICAgICdzaHknOiAxNzMsXG4gICAgJ21hY3InOiAxNzUsXG4gICAgJ2RlZyc6IDE3NixcbiAgICAncGx1c21uJzogMTc3LFxuICAgICdzdXAxJzogMTg1LFxuICAgICdzdXAyJzogMTc4LFxuICAgICdzdXAzJzogMTc5LFxuICAgICdhY3V0ZSc6IDE4MCxcbiAgICAnbWljcm8nOiAxODEsXG4gICAgJ3BhcmEnOiAxODIsXG4gICAgJ21pZGRvdCc6IDE4MyxcbiAgICAnY2VkaWwnOiAxODQsXG4gICAgJ29yZG0nOiAxODYsXG4gICAgJ3JhcXVvJzogMTg3LFxuICAgICdmcmFjMTQnOiAxODgsXG4gICAgJ2ZyYWMxMic6IDE4OSxcbiAgICAnZnJhYzM0JzogMTkwLFxuICAgICdpcXVlc3QnOiAxOTEsXG4gICAgJ3RpbWVzJzogMjE1LFxuICAgICdkaXZpZGUnOiAyNDcsXG4gICAgJ09FbGlnJzogMzM4LFxuICAgICdvZWxpZyc6IDMzOSxcbiAgICAnU2Nhcm9uJzogMzUyLFxuICAgICdzY2Fyb24nOiAzNTMsXG4gICAgJ1l1bWwnOiAzNzYsXG4gICAgJ2Zub2YnOiA0MDIsXG4gICAgJ2NpcmMnOiA3MTAsXG4gICAgJ3RpbGRlJzogNzMyLFxuICAgICdBbHBoYSc6IDkxMyxcbiAgICAnQmV0YSc6IDkxNCxcbiAgICAnR2FtbWEnOiA5MTUsXG4gICAgJ0RlbHRhJzogOTE2LFxuICAgICdFcHNpbG9uJzogOTE3LFxuICAgICdaZXRhJzogOTE4LFxuICAgICdFdGEnOiA5MTksXG4gICAgJ1RoZXRhJzogOTIwLFxuICAgICdJb3RhJzogOTIxLFxuICAgICdLYXBwYSc6IDkyMixcbiAgICAnTGFtYmRhJzogOTIzLFxuICAgICdNdSc6IDkyNCxcbiAgICAnTnUnOiA5MjUsXG4gICAgJ1hpJzogOTI2LFxuICAgICdPbWljcm9uJzogOTI3LFxuICAgICdQaSc6IDkyOCxcbiAgICAnUmhvJzogOTI5LFxuICAgICdTaWdtYSc6IDkzMSxcbiAgICAnVGF1JzogOTMyLFxuICAgICdVcHNpbG9uJzogOTMzLFxuICAgICdQaGknOiA5MzQsXG4gICAgJ0NoaSc6IDkzNSxcbiAgICAnUHNpJzogOTM2LFxuICAgICdPbWVnYSc6IDkzNyxcbiAgICAnYWxwaGEnOiA5NDUsXG4gICAgJ2JldGEnOiA5NDYsXG4gICAgJ2dhbW1hJzogOTQ3LFxuICAgICdkZWx0YSc6IDk0OCxcbiAgICAnZXBzaWxvbic6IDk0OSxcbiAgICAnemV0YSc6IDk1MCxcbiAgICAnZXRhJzogOTUxLFxuICAgICd0aGV0YSc6IDk1MixcbiAgICAnaW90YSc6IDk1MyxcbiAgICAna2FwcGEnOiA5NTQsXG4gICAgJ2xhbWJkYSc6IDk1NSxcbiAgICAnbXUnOiA5NTYsXG4gICAgJ251JzogOTU3LFxuICAgICd4aSc6IDk1OCxcbiAgICAnb21pY3Jvbic6IDk1OSxcbiAgICAncGknOiA5NjAsXG4gICAgJ3Jobyc6IDk2MSxcbiAgICAnc2lnbWFmJzogOTYyLFxuICAgICdzaWdtYSc6IDk2MyxcbiAgICAndGF1JzogOTY0LFxuICAgICd1cHNpbG9uJzogOTY1LFxuICAgICdwaGknOiA5NjYsXG4gICAgJ2NoaSc6IDk2NyxcbiAgICAncHNpJzogOTY4LFxuICAgICdvbWVnYSc6IDk2OSxcbiAgICAndGhldGFzeW0nOiA5NzcsXG4gICAgJ3Vwc2loJzogOTc4LFxuICAgICdwaXYnOiA5ODIsXG4gICAgJ2Vuc3AnOiA4MTk0LFxuICAgICdlbXNwJzogODE5NSxcbiAgICAndGhpbnNwJzogODIwMSxcbiAgICAnenduaic6IDgyMDQsXG4gICAgJ3p3aic6IDgyMDUsXG4gICAgJ2xybSc6IDgyMDYsXG4gICAgJ3JsbSc6IDgyMDcsXG4gICAgJ25kYXNoJzogODIxMSxcbiAgICAnbWRhc2gnOiA4MjEyLFxuICAgICdsc3F1byc6IDgyMTYsXG4gICAgJ3JzcXVvJzogODIxNyxcbiAgICAnc2JxdW8nOiA4MjE4LFxuICAgICdsZHF1byc6IDgyMjAsXG4gICAgJ3JkcXVvJzogODIyMSxcbiAgICAnYmRxdW8nOiA4MjIyLFxuICAgICdkYWdnZXInOiA4MjI0LFxuICAgICdEYWdnZXInOiA4MjI1LFxuICAgICdidWxsJzogODIyNixcbiAgICAnaGVsbGlwJzogODIzMCxcbiAgICAncGVybWlsJzogODI0MCxcbiAgICAncHJpbWUnOiA4MjQyLFxuICAgICdQcmltZSc6IDgyNDMsXG4gICAgJ2xzYXF1byc6IDgyNDksXG4gICAgJ3JzYXF1byc6IDgyNTAsXG4gICAgJ29saW5lJzogODI1NCxcbiAgICAnZnJhc2wnOiA4MjYwLFxuICAgICdldXJvJzogODM2NCxcbiAgICAnaW1hZ2UnOiA4NDY1LFxuICAgICd3ZWllcnAnOiA4NDcyLFxuICAgICdyZWFsJzogODQ3NixcbiAgICAndHJhZGUnOiA4NDgyLFxuICAgICdhbGVmc3ltJzogODUwMSxcbiAgICAnbGFycic6IDg1OTIsXG4gICAgJ3VhcnInOiA4NTkzLFxuICAgICdyYXJyJzogODU5NCxcbiAgICAnZGFycic6IDg1OTUsXG4gICAgJ2hhcnInOiA4NTk2LFxuICAgICdjcmFycic6IDg2MjksXG4gICAgJ2xBcnInOiA4NjU2LFxuICAgICd1QXJyJzogODY1NyxcbiAgICAnckFycic6IDg2NTgsXG4gICAgJ2RBcnInOiA4NjU5LFxuICAgICdoQXJyJzogODY2MCxcbiAgICAnZm9yYWxsJzogODcwNCxcbiAgICAncGFydCc6IDg3MDYsXG4gICAgJ2V4aXN0JzogODcwNyxcbiAgICAnZW1wdHknOiA4NzA5LFxuICAgICduYWJsYSc6IDg3MTEsXG4gICAgJ2lzaW4nOiA4NzEyLFxuICAgICdub3Rpbic6IDg3MTMsXG4gICAgJ25pJzogODcxNSxcbiAgICAncHJvZCc6IDg3MTksXG4gICAgJ3N1bSc6IDg3MjEsXG4gICAgJ21pbnVzJzogODcyMixcbiAgICAnbG93YXN0JzogODcyNyxcbiAgICAncmFkaWMnOiA4NzMwLFxuICAgICdwcm9wJzogODczMyxcbiAgICAnaW5maW4nOiA4NzM0LFxuICAgICdhbmcnOiA4NzM2LFxuICAgICdhbmQnOiA4NzQzLFxuICAgICdvcic6IDg3NDQsXG4gICAgJ2NhcCc6IDg3NDUsXG4gICAgJ2N1cCc6IDg3NDYsXG4gICAgJ2ludCc6IDg3NDcsXG4gICAgJ3RoZXJlNCc6IDg3NTYsXG4gICAgJ3NpbSc6IDg3NjQsXG4gICAgJ2NvbmcnOiA4NzczLFxuICAgICdhc3ltcCc6IDg3NzYsXG4gICAgJ25lJzogODgwMCxcbiAgICAnZXF1aXYnOiA4ODAxLFxuICAgICdsZSc6IDg4MDQsXG4gICAgJ2dlJzogODgwNSxcbiAgICAnc3ViJzogODgzNCxcbiAgICAnc3VwJzogODgzNSxcbiAgICAnbnN1Yic6IDg4MzYsXG4gICAgJ3N1YmUnOiA4ODM4LFxuICAgICdzdXBlJzogODgzOSxcbiAgICAnb3BsdXMnOiA4ODUzLFxuICAgICdvdGltZXMnOiA4ODU1LFxuICAgICdwZXJwJzogODg2OSxcbiAgICAnc2RvdCc6IDg5MDEsXG4gICAgJ2xjZWlsJzogODk2OCxcbiAgICAncmNlaWwnOiA4OTY5LFxuICAgICdsZmxvb3InOiA4OTcwLFxuICAgICdyZmxvb3InOiA4OTcxLFxuICAgICdsYW5nJzogOTAwMSxcbiAgICAncmFuZyc6IDkwMDIsXG4gICAgJ2xveic6IDk2NzQsXG4gICAgJ3NwYWRlcyc6IDk4MjQsXG4gICAgJ2NsdWJzJzogOTgyNyxcbiAgICAnaGVhcnRzJzogOTgyOSxcbiAgICAnZGlhbXMnOiA5ODMwXG4gIH1cblxuICBPYmplY3Qua2V5cyhzYXguRU5USVRJRVMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgIHZhciBlID0gc2F4LkVOVElUSUVTW2tleV1cbiAgICB2YXIgcyA9IHR5cGVvZiBlID09PSAnbnVtYmVyJyA/IFN0cmluZy5mcm9tQ2hhckNvZGUoZSkgOiBlXG4gICAgc2F4LkVOVElUSUVTW2tleV0gPSBzXG4gIH0pXG5cbiAgZm9yICh2YXIgcyBpbiBzYXguU1RBVEUpIHtcbiAgICBzYXguU1RBVEVbc2F4LlNUQVRFW3NdXSA9IHNcbiAgfVxuXG4gIC8vIHNob3J0aGFuZFxuICBTID0gc2F4LlNUQVRFXG5cbiAgZnVuY3Rpb24gZW1pdCAocGFyc2VyLCBldmVudCwgZGF0YSkge1xuICAgIHBhcnNlcltldmVudF0gJiYgcGFyc2VyW2V2ZW50XShkYXRhKVxuICB9XG5cbiAgZnVuY3Rpb24gZW1pdE5vZGUgKHBhcnNlciwgbm9kZVR5cGUsIGRhdGEpIHtcbiAgICBpZiAocGFyc2VyLnRleHROb2RlKSBjbG9zZVRleHQocGFyc2VyKVxuICAgIGVtaXQocGFyc2VyLCBub2RlVHlwZSwgZGF0YSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsb3NlVGV4dCAocGFyc2VyKSB7XG4gICAgcGFyc2VyLnRleHROb2RlID0gdGV4dG9wdHMocGFyc2VyLm9wdCwgcGFyc2VyLnRleHROb2RlKVxuICAgIGlmIChwYXJzZXIudGV4dE5vZGUpIGVtaXQocGFyc2VyLCAnb250ZXh0JywgcGFyc2VyLnRleHROb2RlKVxuICAgIHBhcnNlci50ZXh0Tm9kZSA9ICcnXG4gIH1cblxuICBmdW5jdGlvbiB0ZXh0b3B0cyAob3B0LCB0ZXh0KSB7XG4gICAgaWYgKG9wdC50cmltKSB0ZXh0ID0gdGV4dC50cmltKClcbiAgICBpZiAob3B0Lm5vcm1hbGl6ZSkgdGV4dCA9IHRleHQucmVwbGFjZSgvXFxzKy9nLCAnICcpXG4gICAgcmV0dXJuIHRleHRcbiAgfVxuXG4gIGZ1bmN0aW9uIGVycm9yIChwYXJzZXIsIGVyKSB7XG4gICAgY2xvc2VUZXh0KHBhcnNlcilcbiAgICBpZiAocGFyc2VyLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgIGVyICs9ICdcXG5MaW5lOiAnICsgcGFyc2VyLmxpbmUgK1xuICAgICAgICAnXFxuQ29sdW1uOiAnICsgcGFyc2VyLmNvbHVtbiArXG4gICAgICAgICdcXG5DaGFyOiAnICsgcGFyc2VyLmNcbiAgICB9XG4gICAgZXIgPSBuZXcgRXJyb3IoZXIpXG4gICAgcGFyc2VyLmVycm9yID0gZXJcbiAgICBlbWl0KHBhcnNlciwgJ29uZXJyb3InLCBlcilcbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICBmdW5jdGlvbiBlbmQgKHBhcnNlcikge1xuICAgIGlmIChwYXJzZXIuc2F3Um9vdCAmJiAhcGFyc2VyLmNsb3NlZFJvb3QpIHN0cmljdEZhaWwocGFyc2VyLCAnVW5jbG9zZWQgcm9vdCB0YWcnKVxuICAgIGlmICgocGFyc2VyLnN0YXRlICE9PSBTLkJFR0lOKSAmJlxuICAgICAgKHBhcnNlci5zdGF0ZSAhPT0gUy5CRUdJTl9XSElURVNQQUNFKSAmJlxuICAgICAgKHBhcnNlci5zdGF0ZSAhPT0gUy5URVhUKSkge1xuICAgICAgZXJyb3IocGFyc2VyLCAnVW5leHBlY3RlZCBlbmQnKVxuICAgIH1cbiAgICBjbG9zZVRleHQocGFyc2VyKVxuICAgIHBhcnNlci5jID0gJydcbiAgICBwYXJzZXIuY2xvc2VkID0gdHJ1ZVxuICAgIGVtaXQocGFyc2VyLCAnb25lbmQnKVxuICAgIFNBWFBhcnNlci5jYWxsKHBhcnNlciwgcGFyc2VyLnN0cmljdCwgcGFyc2VyLm9wdClcbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICBmdW5jdGlvbiBzdHJpY3RGYWlsIChwYXJzZXIsIG1lc3NhZ2UpIHtcbiAgICBpZiAodHlwZW9mIHBhcnNlciAhPT0gJ29iamVjdCcgfHwgIShwYXJzZXIgaW5zdGFuY2VvZiBTQVhQYXJzZXIpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2JhZCBjYWxsIHRvIHN0cmljdEZhaWwnKVxuICAgIH1cbiAgICBpZiAocGFyc2VyLnN0cmljdCkge1xuICAgICAgZXJyb3IocGFyc2VyLCBtZXNzYWdlKVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIG5ld1RhZyAocGFyc2VyKSB7XG4gICAgaWYgKCFwYXJzZXIuc3RyaWN0KSBwYXJzZXIudGFnTmFtZSA9IHBhcnNlci50YWdOYW1lW3BhcnNlci5sb29zZUNhc2VdKClcbiAgICB2YXIgcGFyZW50ID0gcGFyc2VyLnRhZ3NbcGFyc2VyLnRhZ3MubGVuZ3RoIC0gMV0gfHwgcGFyc2VyXG4gICAgdmFyIHRhZyA9IHBhcnNlci50YWcgPSB7IG5hbWU6IHBhcnNlci50YWdOYW1lLCBhdHRyaWJ1dGVzOiB7fSB9XG5cbiAgICAvLyB3aWxsIGJlIG92ZXJyaWRkZW4gaWYgdGFnIGNvbnRhaWxzIGFuIHhtbG5zPVwiZm9vXCIgb3IgeG1sbnM6Zm9vPVwiYmFyXCJcbiAgICBpZiAocGFyc2VyLm9wdC54bWxucykge1xuICAgICAgdGFnLm5zID0gcGFyZW50Lm5zXG4gICAgfVxuICAgIHBhcnNlci5hdHRyaWJMaXN0Lmxlbmd0aCA9IDBcbiAgICBlbWl0Tm9kZShwYXJzZXIsICdvbm9wZW50YWdzdGFydCcsIHRhZylcbiAgfVxuXG4gIGZ1bmN0aW9uIHFuYW1lIChuYW1lLCBhdHRyaWJ1dGUpIHtcbiAgICB2YXIgaSA9IG5hbWUuaW5kZXhPZignOicpXG4gICAgdmFyIHF1YWxOYW1lID0gaSA8IDAgPyBbICcnLCBuYW1lIF0gOiBuYW1lLnNwbGl0KCc6JylcbiAgICB2YXIgcHJlZml4ID0gcXVhbE5hbWVbMF1cbiAgICB2YXIgbG9jYWwgPSBxdWFsTmFtZVsxXVxuXG4gICAgLy8gPHggXCJ4bWxuc1wiPVwiaHR0cDovL2Zvb1wiPlxuICAgIGlmIChhdHRyaWJ1dGUgJiYgbmFtZSA9PT0gJ3htbG5zJykge1xuICAgICAgcHJlZml4ID0gJ3htbG5zJ1xuICAgICAgbG9jYWwgPSAnJ1xuICAgIH1cblxuICAgIHJldHVybiB7IHByZWZpeDogcHJlZml4LCBsb2NhbDogbG9jYWwgfVxuICB9XG5cbiAgZnVuY3Rpb24gYXR0cmliIChwYXJzZXIpIHtcbiAgICBpZiAoIXBhcnNlci5zdHJpY3QpIHtcbiAgICAgIHBhcnNlci5hdHRyaWJOYW1lID0gcGFyc2VyLmF0dHJpYk5hbWVbcGFyc2VyLmxvb3NlQ2FzZV0oKVxuICAgIH1cblxuICAgIGlmIChwYXJzZXIuYXR0cmliTGlzdC5pbmRleE9mKHBhcnNlci5hdHRyaWJOYW1lKSAhPT0gLTEgfHxcbiAgICAgIHBhcnNlci50YWcuYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShwYXJzZXIuYXR0cmliTmFtZSkpIHtcbiAgICAgIHBhcnNlci5hdHRyaWJOYW1lID0gcGFyc2VyLmF0dHJpYlZhbHVlID0gJydcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGlmIChwYXJzZXIub3B0LnhtbG5zKSB7XG4gICAgICB2YXIgcW4gPSBxbmFtZShwYXJzZXIuYXR0cmliTmFtZSwgdHJ1ZSlcbiAgICAgIHZhciBwcmVmaXggPSBxbi5wcmVmaXhcbiAgICAgIHZhciBsb2NhbCA9IHFuLmxvY2FsXG5cbiAgICAgIGlmIChwcmVmaXggPT09ICd4bWxucycpIHtcbiAgICAgICAgLy8gbmFtZXNwYWNlIGJpbmRpbmcgYXR0cmlidXRlLiBwdXNoIHRoZSBiaW5kaW5nIGludG8gc2NvcGVcbiAgICAgICAgaWYgKGxvY2FsID09PSAneG1sJyAmJiBwYXJzZXIuYXR0cmliVmFsdWUgIT09IFhNTF9OQU1FU1BBQ0UpIHtcbiAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlcixcbiAgICAgICAgICAgICd4bWw6IHByZWZpeCBtdXN0IGJlIGJvdW5kIHRvICcgKyBYTUxfTkFNRVNQQUNFICsgJ1xcbicgK1xuICAgICAgICAgICAgJ0FjdHVhbDogJyArIHBhcnNlci5hdHRyaWJWYWx1ZSlcbiAgICAgICAgfSBlbHNlIGlmIChsb2NhbCA9PT0gJ3htbG5zJyAmJiBwYXJzZXIuYXR0cmliVmFsdWUgIT09IFhNTE5TX05BTUVTUEFDRSkge1xuICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLFxuICAgICAgICAgICAgJ3htbG5zOiBwcmVmaXggbXVzdCBiZSBib3VuZCB0byAnICsgWE1MTlNfTkFNRVNQQUNFICsgJ1xcbicgK1xuICAgICAgICAgICAgJ0FjdHVhbDogJyArIHBhcnNlci5hdHRyaWJWYWx1ZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdGFnID0gcGFyc2VyLnRhZ1xuICAgICAgICAgIHZhciBwYXJlbnQgPSBwYXJzZXIudGFnc1twYXJzZXIudGFncy5sZW5ndGggLSAxXSB8fCBwYXJzZXJcbiAgICAgICAgICBpZiAodGFnLm5zID09PSBwYXJlbnQubnMpIHtcbiAgICAgICAgICAgIHRhZy5ucyA9IE9iamVjdC5jcmVhdGUocGFyZW50Lm5zKVxuICAgICAgICAgIH1cbiAgICAgICAgICB0YWcubnNbbG9jYWxdID0gcGFyc2VyLmF0dHJpYlZhbHVlXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gZGVmZXIgb25hdHRyaWJ1dGUgZXZlbnRzIHVudGlsIGFsbCBhdHRyaWJ1dGVzIGhhdmUgYmVlbiBzZWVuXG4gICAgICAvLyBzbyBhbnkgbmV3IGJpbmRpbmdzIGNhbiB0YWtlIGVmZmVjdC4gcHJlc2VydmUgYXR0cmlidXRlIG9yZGVyXG4gICAgICAvLyBzbyBkZWZlcnJlZCBldmVudHMgY2FuIGJlIGVtaXR0ZWQgaW4gZG9jdW1lbnQgb3JkZXJcbiAgICAgIHBhcnNlci5hdHRyaWJMaXN0LnB1c2goW3BhcnNlci5hdHRyaWJOYW1lLCBwYXJzZXIuYXR0cmliVmFsdWVdKVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBpbiBub24teG1sbnMgbW9kZSwgd2UgY2FuIGVtaXQgdGhlIGV2ZW50IHJpZ2h0IGF3YXlcbiAgICAgIHBhcnNlci50YWcuYXR0cmlidXRlc1twYXJzZXIuYXR0cmliTmFtZV0gPSBwYXJzZXIuYXR0cmliVmFsdWVcbiAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uYXR0cmlidXRlJywge1xuICAgICAgICBuYW1lOiBwYXJzZXIuYXR0cmliTmFtZSxcbiAgICAgICAgdmFsdWU6IHBhcnNlci5hdHRyaWJWYWx1ZVxuICAgICAgfSlcbiAgICB9XG5cbiAgICBwYXJzZXIuYXR0cmliTmFtZSA9IHBhcnNlci5hdHRyaWJWYWx1ZSA9ICcnXG4gIH1cblxuICBmdW5jdGlvbiBvcGVuVGFnIChwYXJzZXIsIHNlbGZDbG9zaW5nKSB7XG4gICAgaWYgKHBhcnNlci5vcHQueG1sbnMpIHtcbiAgICAgIC8vIGVtaXQgbmFtZXNwYWNlIGJpbmRpbmcgZXZlbnRzXG4gICAgICB2YXIgdGFnID0gcGFyc2VyLnRhZ1xuXG4gICAgICAvLyBhZGQgbmFtZXNwYWNlIGluZm8gdG8gdGFnXG4gICAgICB2YXIgcW4gPSBxbmFtZShwYXJzZXIudGFnTmFtZSlcbiAgICAgIHRhZy5wcmVmaXggPSBxbi5wcmVmaXhcbiAgICAgIHRhZy5sb2NhbCA9IHFuLmxvY2FsXG4gICAgICB0YWcudXJpID0gdGFnLm5zW3FuLnByZWZpeF0gfHwgJydcblxuICAgICAgaWYgKHRhZy5wcmVmaXggJiYgIXRhZy51cmkpIHtcbiAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdVbmJvdW5kIG5hbWVzcGFjZSBwcmVmaXg6ICcgK1xuICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHBhcnNlci50YWdOYW1lKSlcbiAgICAgICAgdGFnLnVyaSA9IHFuLnByZWZpeFxuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gcGFyc2VyLnRhZ3NbcGFyc2VyLnRhZ3MubGVuZ3RoIC0gMV0gfHwgcGFyc2VyXG4gICAgICBpZiAodGFnLm5zICYmIHBhcmVudC5ucyAhPT0gdGFnLm5zKSB7XG4gICAgICAgIE9iamVjdC5rZXlzKHRhZy5ucykuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29ub3Blbm5hbWVzcGFjZScsIHtcbiAgICAgICAgICAgIHByZWZpeDogcCxcbiAgICAgICAgICAgIHVyaTogdGFnLm5zW3BdXG4gICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgICAgLy8gaGFuZGxlIGRlZmVycmVkIG9uYXR0cmlidXRlIGV2ZW50c1xuICAgICAgLy8gTm90ZTogZG8gbm90IGFwcGx5IGRlZmF1bHQgbnMgdG8gYXR0cmlidXRlczpcbiAgICAgIC8vICAgaHR0cDovL3d3dy53My5vcmcvVFIvUkVDLXhtbC1uYW1lcy8jZGVmYXVsdGluZ1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBwYXJzZXIuYXR0cmliTGlzdC5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIG52ID0gcGFyc2VyLmF0dHJpYkxpc3RbaV1cbiAgICAgICAgdmFyIG5hbWUgPSBudlswXVxuICAgICAgICB2YXIgdmFsdWUgPSBudlsxXVxuICAgICAgICB2YXIgcXVhbE5hbWUgPSBxbmFtZShuYW1lLCB0cnVlKVxuICAgICAgICB2YXIgcHJlZml4ID0gcXVhbE5hbWUucHJlZml4XG4gICAgICAgIHZhciBsb2NhbCA9IHF1YWxOYW1lLmxvY2FsXG4gICAgICAgIHZhciB1cmkgPSBwcmVmaXggPT09ICcnID8gJycgOiAodGFnLm5zW3ByZWZpeF0gfHwgJycpXG4gICAgICAgIHZhciBhID0ge1xuICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgIHByZWZpeDogcHJlZml4LFxuICAgICAgICAgIGxvY2FsOiBsb2NhbCxcbiAgICAgICAgICB1cmk6IHVyaVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlcmUncyBhbnkgYXR0cmlidXRlcyB3aXRoIGFuIHVuZGVmaW5lZCBuYW1lc3BhY2UsXG4gICAgICAgIC8vIHRoZW4gZmFpbCBvbiB0aGVtIG5vdy5cbiAgICAgICAgaWYgKHByZWZpeCAmJiBwcmVmaXggIT09ICd4bWxucycgJiYgIXVyaSkge1xuICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnVW5ib3VuZCBuYW1lc3BhY2UgcHJlZml4OiAnICtcbiAgICAgICAgICAgIEpTT04uc3RyaW5naWZ5KHByZWZpeCkpXG4gICAgICAgICAgYS51cmkgPSBwcmVmaXhcbiAgICAgICAgfVxuICAgICAgICBwYXJzZXIudGFnLmF0dHJpYnV0ZXNbbmFtZV0gPSBhXG4gICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uYXR0cmlidXRlJywgYSlcbiAgICAgIH1cbiAgICAgIHBhcnNlci5hdHRyaWJMaXN0Lmxlbmd0aCA9IDBcbiAgICB9XG5cbiAgICBwYXJzZXIudGFnLmlzU2VsZkNsb3NpbmcgPSAhIXNlbGZDbG9zaW5nXG5cbiAgICAvLyBwcm9jZXNzIHRoZSB0YWdcbiAgICBwYXJzZXIuc2F3Um9vdCA9IHRydWVcbiAgICBwYXJzZXIudGFncy5wdXNoKHBhcnNlci50YWcpXG4gICAgZW1pdE5vZGUocGFyc2VyLCAnb25vcGVudGFnJywgcGFyc2VyLnRhZylcbiAgICBpZiAoIXNlbGZDbG9zaW5nKSB7XG4gICAgICAvLyBzcGVjaWFsIGNhc2UgZm9yIDxzY3JpcHQ+IGluIG5vbi1zdHJpY3QgbW9kZS5cbiAgICAgIGlmICghcGFyc2VyLm5vc2NyaXB0ICYmIHBhcnNlci50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzY3JpcHQnKSB7XG4gICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuU0NSSVBUXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlRFWFRcbiAgICAgIH1cbiAgICAgIHBhcnNlci50YWcgPSBudWxsXG4gICAgICBwYXJzZXIudGFnTmFtZSA9ICcnXG4gICAgfVxuICAgIHBhcnNlci5hdHRyaWJOYW1lID0gcGFyc2VyLmF0dHJpYlZhbHVlID0gJydcbiAgICBwYXJzZXIuYXR0cmliTGlzdC5sZW5ndGggPSAwXG4gIH1cblxuICBmdW5jdGlvbiBjbG9zZVRhZyAocGFyc2VyKSB7XG4gICAgaWYgKCFwYXJzZXIudGFnTmFtZSkge1xuICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdXZWlyZCBlbXB0eSBjbG9zZSB0YWcuJylcbiAgICAgIHBhcnNlci50ZXh0Tm9kZSArPSAnPC8+J1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAocGFyc2VyLnNjcmlwdCkge1xuICAgICAgaWYgKHBhcnNlci50YWdOYW1lICE9PSAnc2NyaXB0Jykge1xuICAgICAgICBwYXJzZXIuc2NyaXB0ICs9ICc8LycgKyBwYXJzZXIudGFnTmFtZSArICc+J1xuICAgICAgICBwYXJzZXIudGFnTmFtZSA9ICcnXG4gICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuU0NSSVBUXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25zY3JpcHQnLCBwYXJzZXIuc2NyaXB0KVxuICAgICAgcGFyc2VyLnNjcmlwdCA9ICcnXG4gICAgfVxuXG4gICAgLy8gZmlyc3QgbWFrZSBzdXJlIHRoYXQgdGhlIGNsb3NpbmcgdGFnIGFjdHVhbGx5IGV4aXN0cy5cbiAgICAvLyA8YT48Yj48L2M+PC9iPjwvYT4gd2lsbCBjbG9zZSBldmVyeXRoaW5nLCBvdGhlcndpc2UuXG4gICAgdmFyIHQgPSBwYXJzZXIudGFncy5sZW5ndGhcbiAgICB2YXIgdGFnTmFtZSA9IHBhcnNlci50YWdOYW1lXG4gICAgaWYgKCFwYXJzZXIuc3RyaWN0KSB7XG4gICAgICB0YWdOYW1lID0gdGFnTmFtZVtwYXJzZXIubG9vc2VDYXNlXSgpXG4gICAgfVxuICAgIHZhciBjbG9zZVRvID0gdGFnTmFtZVxuICAgIHdoaWxlICh0LS0pIHtcbiAgICAgIHZhciBjbG9zZSA9IHBhcnNlci50YWdzW3RdXG4gICAgICBpZiAoY2xvc2UubmFtZSAhPT0gY2xvc2VUbykge1xuICAgICAgICAvLyBmYWlsIHRoZSBmaXJzdCB0aW1lIGluIHN0cmljdCBtb2RlXG4gICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnVW5leHBlY3RlZCBjbG9zZSB0YWcnKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBkaWRuJ3QgZmluZCBpdC4gIHdlIGFscmVhZHkgZmFpbGVkIGZvciBzdHJpY3QsIHNvIGp1c3QgYWJvcnQuXG4gICAgaWYgKHQgPCAwKSB7XG4gICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ1VubWF0Y2hlZCBjbG9zaW5nIHRhZzogJyArIHBhcnNlci50YWdOYW1lKVxuICAgICAgcGFyc2VyLnRleHROb2RlICs9ICc8LycgKyBwYXJzZXIudGFnTmFtZSArICc+J1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICByZXR1cm5cbiAgICB9XG4gICAgcGFyc2VyLnRhZ05hbWUgPSB0YWdOYW1lXG4gICAgdmFyIHMgPSBwYXJzZXIudGFncy5sZW5ndGhcbiAgICB3aGlsZSAocy0tID4gdCkge1xuICAgICAgdmFyIHRhZyA9IHBhcnNlci50YWcgPSBwYXJzZXIudGFncy5wb3AoKVxuICAgICAgcGFyc2VyLnRhZ05hbWUgPSBwYXJzZXIudGFnLm5hbWVcbiAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uY2xvc2V0YWcnLCBwYXJzZXIudGFnTmFtZSlcblxuICAgICAgdmFyIHggPSB7fVxuICAgICAgZm9yICh2YXIgaSBpbiB0YWcubnMpIHtcbiAgICAgICAgeFtpXSA9IHRhZy5uc1tpXVxuICAgICAgfVxuXG4gICAgICB2YXIgcGFyZW50ID0gcGFyc2VyLnRhZ3NbcGFyc2VyLnRhZ3MubGVuZ3RoIC0gMV0gfHwgcGFyc2VyXG4gICAgICBpZiAocGFyc2VyLm9wdC54bWxucyAmJiB0YWcubnMgIT09IHBhcmVudC5ucykge1xuICAgICAgICAvLyByZW1vdmUgbmFtZXNwYWNlIGJpbmRpbmdzIGludHJvZHVjZWQgYnkgdGFnXG4gICAgICAgIE9iamVjdC5rZXlzKHRhZy5ucykuZm9yRWFjaChmdW5jdGlvbiAocCkge1xuICAgICAgICAgIHZhciBuID0gdGFnLm5zW3BdXG4gICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jbG9zZW5hbWVzcGFjZScsIHsgcHJlZml4OiBwLCB1cmk6IG4gfSlcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHQgPT09IDApIHBhcnNlci5jbG9zZWRSb290ID0gdHJ1ZVxuICAgIHBhcnNlci50YWdOYW1lID0gcGFyc2VyLmF0dHJpYlZhbHVlID0gcGFyc2VyLmF0dHJpYk5hbWUgPSAnJ1xuICAgIHBhcnNlci5hdHRyaWJMaXN0Lmxlbmd0aCA9IDBcbiAgICBwYXJzZXIuc3RhdGUgPSBTLlRFWFRcbiAgfVxuXG4gIGZ1bmN0aW9uIHBhcnNlRW50aXR5IChwYXJzZXIpIHtcbiAgICB2YXIgZW50aXR5ID0gcGFyc2VyLmVudGl0eVxuICAgIHZhciBlbnRpdHlMQyA9IGVudGl0eS50b0xvd2VyQ2FzZSgpXG4gICAgdmFyIG51bVxuICAgIHZhciBudW1TdHIgPSAnJ1xuXG4gICAgaWYgKHBhcnNlci5FTlRJVElFU1tlbnRpdHldKSB7XG4gICAgICByZXR1cm4gcGFyc2VyLkVOVElUSUVTW2VudGl0eV1cbiAgICB9XG4gICAgaWYgKHBhcnNlci5FTlRJVElFU1tlbnRpdHlMQ10pIHtcbiAgICAgIHJldHVybiBwYXJzZXIuRU5USVRJRVNbZW50aXR5TENdXG4gICAgfVxuICAgIGVudGl0eSA9IGVudGl0eUxDXG4gICAgaWYgKGVudGl0eS5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgaWYgKGVudGl0eS5jaGFyQXQoMSkgPT09ICd4Jykge1xuICAgICAgICBlbnRpdHkgPSBlbnRpdHkuc2xpY2UoMilcbiAgICAgICAgbnVtID0gcGFyc2VJbnQoZW50aXR5LCAxNilcbiAgICAgICAgbnVtU3RyID0gbnVtLnRvU3RyaW5nKDE2KVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZW50aXR5ID0gZW50aXR5LnNsaWNlKDEpXG4gICAgICAgIG51bSA9IHBhcnNlSW50KGVudGl0eSwgMTApXG4gICAgICAgIG51bVN0ciA9IG51bS50b1N0cmluZygxMClcbiAgICAgIH1cbiAgICB9XG4gICAgZW50aXR5ID0gZW50aXR5LnJlcGxhY2UoL14wKy8sICcnKVxuICAgIGlmIChpc05hTihudW0pIHx8IG51bVN0ci50b0xvd2VyQ2FzZSgpICE9PSBlbnRpdHkpIHtcbiAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXIgZW50aXR5JylcbiAgICAgIHJldHVybiAnJicgKyBwYXJzZXIuZW50aXR5ICsgJzsnXG4gICAgfVxuXG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ29kZVBvaW50KG51bSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGJlZ2luV2hpdGVTcGFjZSAocGFyc2VyLCBjKSB7XG4gICAgaWYgKGMgPT09ICc8Jykge1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5PUEVOX1dBS0FcbiAgICAgIHBhcnNlci5zdGFydFRhZ1Bvc2l0aW9uID0gcGFyc2VyLnBvc2l0aW9uXG4gICAgfSBlbHNlIGlmICghaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAvLyBoYXZlIHRvIHByb2Nlc3MgdGhpcyBhcyBhIHRleHQgbm9kZS5cbiAgICAgIC8vIHdlaXJkLCBidXQgaGFwcGVucy5cbiAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnTm9uLXdoaXRlc3BhY2UgYmVmb3JlIGZpcnN0IHRhZy4nKVxuICAgICAgcGFyc2VyLnRleHROb2RlID0gY1xuICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gY2hhckF0IChjaHVuaywgaSkge1xuICAgIHZhciByZXN1bHQgPSAnJ1xuICAgIGlmIChpIDwgY2h1bmsubGVuZ3RoKSB7XG4gICAgICByZXN1bHQgPSBjaHVuay5jaGFyQXQoaSlcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdFxuICB9XG5cbiAgZnVuY3Rpb24gd3JpdGUgKGNodW5rKSB7XG4gICAgdmFyIHBhcnNlciA9IHRoaXNcbiAgICBpZiAodGhpcy5lcnJvcikge1xuICAgICAgdGhyb3cgdGhpcy5lcnJvclxuICAgIH1cbiAgICBpZiAocGFyc2VyLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIGVycm9yKHBhcnNlcixcbiAgICAgICAgJ0Nhbm5vdCB3cml0ZSBhZnRlciBjbG9zZS4gQXNzaWduIGFuIG9ucmVhZHkgaGFuZGxlci4nKVxuICAgIH1cbiAgICBpZiAoY2h1bmsgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiBlbmQocGFyc2VyKVxuICAgIH1cbiAgICBpZiAodHlwZW9mIGNodW5rID09PSAnb2JqZWN0Jykge1xuICAgICAgY2h1bmsgPSBjaHVuay50b1N0cmluZygpXG4gICAgfVxuICAgIHZhciBpID0gMFxuICAgIHZhciBjID0gJydcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgYyA9IGNoYXJBdChjaHVuaywgaSsrKVxuICAgICAgcGFyc2VyLmMgPSBjXG5cbiAgICAgIGlmICghYykge1xuICAgICAgICBicmVha1xuICAgICAgfVxuXG4gICAgICBpZiAocGFyc2VyLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgcGFyc2VyLnBvc2l0aW9uKytcbiAgICAgICAgaWYgKGMgPT09ICdcXG4nKSB7XG4gICAgICAgICAgcGFyc2VyLmxpbmUrK1xuICAgICAgICAgIHBhcnNlci5jb2x1bW4gPSAwXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyc2VyLmNvbHVtbisrXG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgc3dpdGNoIChwYXJzZXIuc3RhdGUpIHtcbiAgICAgICAgY2FzZSBTLkJFR0lOOlxuICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQkVHSU5fV0hJVEVTUEFDRVxuICAgICAgICAgIGlmIChjID09PSAnXFx1RkVGRicpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGJlZ2luV2hpdGVTcGFjZShwYXJzZXIsIGMpXG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQkVHSU5fV0hJVEVTUEFDRTpcbiAgICAgICAgICBiZWdpbldoaXRlU3BhY2UocGFyc2VyLCBjKVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLlRFWFQ6XG4gICAgICAgICAgaWYgKHBhcnNlci5zYXdSb290ICYmICFwYXJzZXIuY2xvc2VkUm9vdCkge1xuICAgICAgICAgICAgdmFyIHN0YXJ0aSA9IGkgLSAxXG4gICAgICAgICAgICB3aGlsZSAoYyAmJiBjICE9PSAnPCcgJiYgYyAhPT0gJyYnKSB7XG4gICAgICAgICAgICAgIGMgPSBjaGFyQXQoY2h1bmssIGkrKylcbiAgICAgICAgICAgICAgaWYgKGMgJiYgcGFyc2VyLnRyYWNrUG9zaXRpb24pIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIucG9zaXRpb24rK1xuICAgICAgICAgICAgICAgIGlmIChjID09PSAnXFxuJykge1xuICAgICAgICAgICAgICAgICAgcGFyc2VyLmxpbmUrK1xuICAgICAgICAgICAgICAgICAgcGFyc2VyLmNvbHVtbiA9IDBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgcGFyc2VyLmNvbHVtbisrXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXIudGV4dE5vZGUgKz0gY2h1bmsuc3Vic3RyaW5nKHN0YXJ0aSwgaSAtIDEpXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChjID09PSAnPCcgJiYgIShwYXJzZXIuc2F3Um9vdCAmJiBwYXJzZXIuY2xvc2VkUm9vdCAmJiAhcGFyc2VyLnN0cmljdCkpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuT1BFTl9XQUtBXG4gICAgICAgICAgICBwYXJzZXIuc3RhcnRUYWdQb3NpdGlvbiA9IHBhcnNlci5wb3NpdGlvblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZShjKSAmJiAoIXBhcnNlci5zYXdSb290IHx8IHBhcnNlci5jbG9zZWRSb290KSkge1xuICAgICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ1RleHQgZGF0YSBvdXRzaWRlIG9mIHJvb3Qgbm9kZS4nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGMgPT09ICcmJykge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlRFWFRfRU5USVRZXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwYXJzZXIudGV4dE5vZGUgKz0gY1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5TQ1JJUFQ6XG4gICAgICAgICAgLy8gb25seSBub24tc3RyaWN0XG4gICAgICAgICAgaWYgKGMgPT09ICc8Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TQ1JJUFRfRU5ESU5HXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zY3JpcHQgKz0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5TQ1JJUFRfRU5ESU5HOlxuICAgICAgICAgIGlmIChjID09PSAnLycpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ0xPU0VfVEFHXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zY3JpcHQgKz0gJzwnICsgY1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TQ1JJUFRcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuT1BFTl9XQUtBOlxuICAgICAgICAgIC8vIGVpdGhlciBhIC8sID8sICEsIG9yIHRleHQgaXMgY29taW5nIG5leHQuXG4gICAgICAgICAgaWYgKGMgPT09ICchJykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TR01MX0RFQ0xcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCA9ICcnXG4gICAgICAgICAgfSBlbHNlIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIC8vIHdhaXQgZm9yIGl0Li4uXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuT1BFTl9UQUdcbiAgICAgICAgICAgIHBhcnNlci50YWdOYW1lID0gY1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJy8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNMT1NFX1RBR1xuICAgICAgICAgICAgcGFyc2VyLnRhZ05hbWUgPSAnJ1xuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJz8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlBST0NfSU5TVFxuICAgICAgICAgICAgcGFyc2VyLnByb2NJbnN0TmFtZSA9IHBhcnNlci5wcm9jSW5zdEJvZHkgPSAnJ1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ1VuZW5jb2RlZCA8JylcbiAgICAgICAgICAgIC8vIGlmIHRoZXJlIHdhcyBzb21lIHdoaXRlc3BhY2UsIHRoZW4gYWRkIHRoYXQgaW4uXG4gICAgICAgICAgICBpZiAocGFyc2VyLnN0YXJ0VGFnUG9zaXRpb24gKyAxIDwgcGFyc2VyLnBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgIHZhciBwYWQgPSBwYXJzZXIucG9zaXRpb24gLSBwYXJzZXIuc3RhcnRUYWdQb3NpdGlvblxuICAgICAgICAgICAgICBjID0gbmV3IEFycmF5KHBhZCkuam9pbignICcpICsgY1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VyLnRleHROb2RlICs9ICc8JyArIGNcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuVEVYVFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5TR01MX0RFQ0w6XG4gICAgICAgICAgaWYgKChwYXJzZXIuc2dtbERlY2wgKyBjKS50b1VwcGVyQ2FzZSgpID09PSBDREFUQSkge1xuICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25vcGVuY2RhdGEnKVxuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5DREFUQVxuICAgICAgICAgICAgcGFyc2VyLnNnbWxEZWNsID0gJydcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSA9ICcnXG4gICAgICAgICAgfSBlbHNlIGlmIChwYXJzZXIuc2dtbERlY2wgKyBjID09PSAnLS0nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNPTU1FTlRcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ID0gJydcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCA9ICcnXG4gICAgICAgICAgfSBlbHNlIGlmICgocGFyc2VyLnNnbWxEZWNsICsgYykudG9VcHBlckNhc2UoKSA9PT0gRE9DVFlQRSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5ET0NUWVBFXG4gICAgICAgICAgICBpZiAocGFyc2VyLmRvY3R5cGUgfHwgcGFyc2VyLnNhd1Jvb3QpIHtcbiAgICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsXG4gICAgICAgICAgICAgICAgJ0luYXBwcm9wcmlhdGVseSBsb2NhdGVkIGRvY3R5cGUgZGVjbGFyYXRpb24nKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcGFyc2VyLmRvY3R5cGUgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnNnbWxEZWNsID0gJydcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25zZ21sZGVjbGFyYXRpb24nLCBwYXJzZXIuc2dtbERlY2wpXG4gICAgICAgICAgICBwYXJzZXIuc2dtbERlY2wgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfSBlbHNlIGlmIChpc1F1b3RlKGMpKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlNHTUxfREVDTF9RVU9URURcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCArPSBjXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zZ21sRGVjbCArPSBjXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLlNHTUxfREVDTF9RVU9URUQ6XG4gICAgICAgICAgaWYgKGMgPT09IHBhcnNlci5xKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlNHTUxfREVDTFxuICAgICAgICAgICAgcGFyc2VyLnEgPSAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBwYXJzZXIuc2dtbERlY2wgKz0gY1xuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkRPQ1RZUEU6XG4gICAgICAgICAgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgICBlbWl0Tm9kZShwYXJzZXIsICdvbmRvY3R5cGUnLCBwYXJzZXIuZG9jdHlwZSlcbiAgICAgICAgICAgIHBhcnNlci5kb2N0eXBlID0gdHJ1ZSAvLyBqdXN0IHJlbWVtYmVyIHRoYXQgd2Ugc2F3IGl0LlxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZXIuZG9jdHlwZSArPSBjXG4gICAgICAgICAgICBpZiAoYyA9PT0gJ1snKSB7XG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuRE9DVFlQRV9EVERcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNRdW90ZShjKSkge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkRPQ1RZUEVfUVVPVEVEXG4gICAgICAgICAgICAgIHBhcnNlci5xID0gY1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5ET0NUWVBFX1FVT1RFRDpcbiAgICAgICAgICBwYXJzZXIuZG9jdHlwZSArPSBjXG4gICAgICAgICAgaWYgKGMgPT09IHBhcnNlci5xKSB7XG4gICAgICAgICAgICBwYXJzZXIucSA9ICcnXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkRPQ1RZUEVcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuRE9DVFlQRV9EVEQ6XG4gICAgICAgICAgcGFyc2VyLmRvY3R5cGUgKz0gY1xuICAgICAgICAgIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuRE9DVFlQRVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNRdW90ZShjKSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5ET0NUWVBFX0RURF9RVU9URURcbiAgICAgICAgICAgIHBhcnNlci5xID0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5ET0NUWVBFX0RURF9RVU9URUQ6XG4gICAgICAgICAgcGFyc2VyLmRvY3R5cGUgKz0gY1xuICAgICAgICAgIGlmIChjID09PSBwYXJzZXIucSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5ET0NUWVBFX0RURFxuICAgICAgICAgICAgcGFyc2VyLnEgPSAnJ1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5DT01NRU5UOlxuICAgICAgICAgIGlmIChjID09PSAnLScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ09NTUVOVF9FTkRJTkdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VyLmNvbW1lbnQgKz0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5DT01NRU5UX0VORElORzpcbiAgICAgICAgICBpZiAoYyA9PT0gJy0nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNPTU1FTlRfRU5ERURcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ID0gdGV4dG9wdHMocGFyc2VyLm9wdCwgcGFyc2VyLmNvbW1lbnQpXG4gICAgICAgICAgICBpZiAocGFyc2VyLmNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jb21tZW50JywgcGFyc2VyLmNvbW1lbnQpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXIuY29tbWVudCA9ICcnXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ICs9ICctJyArIGNcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ09NTUVOVFxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5DT01NRU5UX0VOREVEOlxuICAgICAgICAgIGlmIChjICE9PSAnPicpIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnTWFsZm9ybWVkIGNvbW1lbnQnKVxuICAgICAgICAgICAgLy8gYWxsb3cgPCEtLSBibGFoIC0tIGJsb28gLS0+IGluIG5vbi1zdHJpY3QgbW9kZSxcbiAgICAgICAgICAgIC8vIHdoaWNoIGlzIGEgY29tbWVudCBvZiBcIiBibGFoIC0tIGJsb28gXCJcbiAgICAgICAgICAgIHBhcnNlci5jb21tZW50ICs9ICctLScgKyBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNPTU1FTlRcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNEQVRBOlxuICAgICAgICAgIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQ0RBVEFfRU5ESU5HXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSArPSBjXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNEQVRBX0VORElORzpcbiAgICAgICAgICBpZiAoYyA9PT0gJ10nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNEQVRBX0VORElOR18yXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSArPSAnXScgKyBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNEQVRBXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNEQVRBX0VORElOR18yOlxuICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIGlmIChwYXJzZXIuY2RhdGEpIHtcbiAgICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25jZGF0YScsIHBhcnNlci5jZGF0YSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29uY2xvc2VjZGF0YScpXG4gICAgICAgICAgICBwYXJzZXIuY2RhdGEgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnXScpIHtcbiAgICAgICAgICAgIHBhcnNlci5jZGF0YSArPSAnXSdcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyc2VyLmNkYXRhICs9ICddXScgKyBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNEQVRBXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLlBST0NfSU5TVDpcbiAgICAgICAgICBpZiAoYyA9PT0gJz8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlBST0NfSU5TVF9FTkRJTkdcbiAgICAgICAgICB9IGVsc2UgaWYgKGlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5QUk9DX0lOU1RfQk9EWVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJzZXIucHJvY0luc3ROYW1lICs9IGNcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuUFJPQ19JTlNUX0JPRFk6XG4gICAgICAgICAgaWYgKCFwYXJzZXIucHJvY0luc3RCb2R5ICYmIGlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgY29udGludWVcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc/Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5QUk9DX0lOU1RfRU5ESU5HXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5wcm9jSW5zdEJvZHkgKz0gY1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5QUk9DX0lOU1RfRU5ESU5HOlxuICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIGVtaXROb2RlKHBhcnNlciwgJ29ucHJvY2Vzc2luZ2luc3RydWN0aW9uJywge1xuICAgICAgICAgICAgICBuYW1lOiBwYXJzZXIucHJvY0luc3ROYW1lLFxuICAgICAgICAgICAgICBib2R5OiBwYXJzZXIucHJvY0luc3RCb2R5XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcGFyc2VyLnByb2NJbnN0TmFtZSA9IHBhcnNlci5wcm9jSW5zdEJvZHkgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5URVhUXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5wcm9jSW5zdEJvZHkgKz0gJz8nICsgY1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5QUk9DX0lOU1RfQk9EWVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5PUEVOX1RBRzpcbiAgICAgICAgICBpZiAoaXNNYXRjaChuYW1lQm9keSwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci50YWdOYW1lICs9IGNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV3VGFnKHBhcnNlcilcbiAgICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgICAgb3BlblRhZyhwYXJzZXIpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICcvJykge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLk9QRU5fVEFHX1NMQVNIXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXIgaW4gdGFnIG5hbWUnKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLk9QRU5fVEFHX1NMQVNIOlxuICAgICAgICAgIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyLCB0cnVlKVxuICAgICAgICAgICAgY2xvc2VUYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ZvcndhcmQtc2xhc2ggaW4gb3BlbmluZyB0YWcgbm90IGZvbGxvd2VkIGJ5ID4nKVxuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCOlxuICAgICAgICAgIC8vIGhhdmVuJ3QgcmVhZCB0aGUgYXR0cmlidXRlIG5hbWUgeWV0LlxuICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJy8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLk9QRU5fVEFHX1NMQVNIXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5hdHRyaWJOYW1lID0gY1xuICAgICAgICAgICAgcGFyc2VyLmF0dHJpYlZhbHVlID0gJydcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCX05BTUVcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdJbnZhbGlkIGF0dHJpYnV0ZSBuYW1lJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCX05BTUU6XG4gICAgICAgICAgaWYgKGMgPT09ICc9Jykge1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfVkFMVUVcbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdBdHRyaWJ1dGUgd2l0aG91dCB2YWx1ZScpXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliVmFsdWUgPSBwYXJzZXIuYXR0cmliTmFtZVxuICAgICAgICAgICAgYXR0cmliKHBhcnNlcilcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9OQU1FX1NBV19XSElURVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNNYXRjaChuYW1lQm9keSwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5hdHRyaWJOYW1lICs9IGNcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdJbnZhbGlkIGF0dHJpYnV0ZSBuYW1lJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCX05BTUVfU0FXX1dISVRFOlxuICAgICAgICAgIGlmIChjID09PSAnPScpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCX1ZBTFVFXG4gICAgICAgICAgfSBlbHNlIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnQXR0cmlidXRlIHdpdGhvdXQgdmFsdWUnKVxuICAgICAgICAgICAgcGFyc2VyLnRhZy5hdHRyaWJ1dGVzW3BhcnNlci5hdHRyaWJOYW1lXSA9ICcnXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliVmFsdWUgPSAnJ1xuICAgICAgICAgICAgZW1pdE5vZGUocGFyc2VyLCAnb25hdHRyaWJ1dGUnLCB7XG4gICAgICAgICAgICAgIG5hbWU6IHBhcnNlci5hdHRyaWJOYW1lLFxuICAgICAgICAgICAgICB2YWx1ZTogJydcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliTmFtZSA9ICcnXG4gICAgICAgICAgICBpZiAoYyA9PT0gJz4nKSB7XG4gICAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgICAgcGFyc2VyLmF0dHJpYk5hbWUgPSBjXG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCX05BTUVcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBhdHRyaWJ1dGUgbmFtZScpXG4gICAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkFUVFJJQl9WQUxVRTpcbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNRdW90ZShjKSkge1xuICAgICAgICAgICAgcGFyc2VyLnEgPSBjXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9RVU9URURcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RyaWN0RmFpbChwYXJzZXIsICdVbnF1b3RlZCBhdHRyaWJ1dGUgdmFsdWUnKVxuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfVkFMVUVfVU5RVU9URURcbiAgICAgICAgICAgIHBhcnNlci5hdHRyaWJWYWx1ZSA9IGNcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQVRUUklCX1ZBTFVFX1FVT1RFRDpcbiAgICAgICAgICBpZiAoYyAhPT0gcGFyc2VyLnEpIHtcbiAgICAgICAgICAgIGlmIChjID09PSAnJicpIHtcbiAgICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfVkFMVUVfRU5USVRZX1FcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHBhcnNlci5hdHRyaWJWYWx1ZSArPSBjXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBhdHRyaWIocGFyc2VyKVxuICAgICAgICAgIHBhcnNlci5xID0gJydcbiAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9DTE9TRURcbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfQ0xPU0VEOlxuICAgICAgICAgIGlmIChpc1doaXRlc3BhY2UoYykpIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgfSBlbHNlIGlmIChjID09PSAnPicpIHtcbiAgICAgICAgICAgIG9wZW5UYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoYyA9PT0gJy8nKSB7XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLk9QRU5fVEFHX1NMQVNIXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnTm8gd2hpdGVzcGFjZSBiZXR3ZWVuIGF0dHJpYnV0ZXMnKVxuICAgICAgICAgICAgcGFyc2VyLmF0dHJpYk5hbWUgPSBjXG4gICAgICAgICAgICBwYXJzZXIuYXR0cmliVmFsdWUgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5BVFRSSUJfTkFNRVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ludmFsaWQgYXR0cmlidXRlIG5hbWUnKVxuICAgICAgICAgIH1cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfVU5RVU9URUQ6XG4gICAgICAgICAgaWYgKCFpc0F0dHJpYkVuZChjKSkge1xuICAgICAgICAgICAgaWYgKGMgPT09ICcmJykge1xuICAgICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9FTlRJVFlfVVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgcGFyc2VyLmF0dHJpYlZhbHVlICs9IGNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgfVxuICAgICAgICAgIGF0dHJpYihwYXJzZXIpXG4gICAgICAgICAgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgb3BlblRhZyhwYXJzZXIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IFMuQVRUUklCXG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnRpbnVlXG5cbiAgICAgICAgY2FzZSBTLkNMT1NFX1RBRzpcbiAgICAgICAgICBpZiAoIXBhcnNlci50YWdOYW1lKSB7XG4gICAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vdE1hdGNoKG5hbWVTdGFydCwgYykpIHtcbiAgICAgICAgICAgICAgaWYgKHBhcnNlci5zY3JpcHQpIHtcbiAgICAgICAgICAgICAgICBwYXJzZXIuc2NyaXB0ICs9ICc8LycgKyBjXG4gICAgICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gUy5TQ1JJUFRcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ludmFsaWQgdGFnbmFtZSBpbiBjbG9zaW5nIHRhZy4nKVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBwYXJzZXIudGFnTmFtZSA9IGNcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGMgPT09ICc+Jykge1xuICAgICAgICAgICAgY2xvc2VUYWcocGFyc2VyKVxuICAgICAgICAgIH0gZWxzZSBpZiAoaXNNYXRjaChuYW1lQm9keSwgYykpIHtcbiAgICAgICAgICAgIHBhcnNlci50YWdOYW1lICs9IGNcbiAgICAgICAgICB9IGVsc2UgaWYgKHBhcnNlci5zY3JpcHQpIHtcbiAgICAgICAgICAgIHBhcnNlci5zY3JpcHQgKz0gJzwvJyArIHBhcnNlci50YWdOYW1lXG4gICAgICAgICAgICBwYXJzZXIudGFnTmFtZSA9ICcnXG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLlNDUklQVFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzV2hpdGVzcGFjZShjKSkge1xuICAgICAgICAgICAgICBzdHJpY3RGYWlsKHBhcnNlciwgJ0ludmFsaWQgdGFnbmFtZSBpbiBjbG9zaW5nIHRhZycpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXJzZXIuc3RhdGUgPSBTLkNMT1NFX1RBR19TQVdfV0hJVEVcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuQ0xPU0VfVEFHX1NBV19XSElURTpcbiAgICAgICAgICBpZiAoaXNXaGl0ZXNwYWNlKGMpKSB7XG4gICAgICAgICAgICBjb250aW51ZVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoYyA9PT0gJz4nKSB7XG4gICAgICAgICAgICBjbG9zZVRhZyhwYXJzZXIpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXJzIGluIGNsb3NpbmcgdGFnJylcbiAgICAgICAgICB9XG4gICAgICAgICAgY29udGludWVcblxuICAgICAgICBjYXNlIFMuVEVYVF9FTlRJVFk6XG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfRU5USVRZX1E6XG4gICAgICAgIGNhc2UgUy5BVFRSSUJfVkFMVUVfRU5USVRZX1U6XG4gICAgICAgICAgdmFyIHJldHVyblN0YXRlXG4gICAgICAgICAgdmFyIGJ1ZmZlclxuICAgICAgICAgIHN3aXRjaCAocGFyc2VyLnN0YXRlKSB7XG4gICAgICAgICAgICBjYXNlIFMuVEVYVF9FTlRJVFk6XG4gICAgICAgICAgICAgIHJldHVyblN0YXRlID0gUy5URVhUXG4gICAgICAgICAgICAgIGJ1ZmZlciA9ICd0ZXh0Tm9kZSdcbiAgICAgICAgICAgICAgYnJlYWtcblxuICAgICAgICAgICAgY2FzZSBTLkFUVFJJQl9WQUxVRV9FTlRJVFlfUTpcbiAgICAgICAgICAgICAgcmV0dXJuU3RhdGUgPSBTLkFUVFJJQl9WQUxVRV9RVU9URURcbiAgICAgICAgICAgICAgYnVmZmVyID0gJ2F0dHJpYlZhbHVlJ1xuICAgICAgICAgICAgICBicmVha1xuXG4gICAgICAgICAgICBjYXNlIFMuQVRUUklCX1ZBTFVFX0VOVElUWV9VOlxuICAgICAgICAgICAgICByZXR1cm5TdGF0ZSA9IFMuQVRUUklCX1ZBTFVFX1VOUVVPVEVEXG4gICAgICAgICAgICAgIGJ1ZmZlciA9ICdhdHRyaWJWYWx1ZSdcbiAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoYyA9PT0gJzsnKSB7XG4gICAgICAgICAgICBwYXJzZXJbYnVmZmVyXSArPSBwYXJzZUVudGl0eShwYXJzZXIpXG4gICAgICAgICAgICBwYXJzZXIuZW50aXR5ID0gJydcbiAgICAgICAgICAgIHBhcnNlci5zdGF0ZSA9IHJldHVyblN0YXRlXG4gICAgICAgICAgfSBlbHNlIGlmIChpc01hdGNoKHBhcnNlci5lbnRpdHkubGVuZ3RoID8gZW50aXR5Qm9keSA6IGVudGl0eVN0YXJ0LCBjKSkge1xuICAgICAgICAgICAgcGFyc2VyLmVudGl0eSArPSBjXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0cmljdEZhaWwocGFyc2VyLCAnSW52YWxpZCBjaGFyYWN0ZXIgaW4gZW50aXR5IG5hbWUnKVxuICAgICAgICAgICAgcGFyc2VyW2J1ZmZlcl0gKz0gJyYnICsgcGFyc2VyLmVudGl0eSArIGNcbiAgICAgICAgICAgIHBhcnNlci5lbnRpdHkgPSAnJ1xuICAgICAgICAgICAgcGFyc2VyLnN0YXRlID0gcmV0dXJuU3RhdGVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250aW51ZVxuXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKHBhcnNlciwgJ1Vua25vd24gc3RhdGU6ICcgKyBwYXJzZXIuc3RhdGUpXG4gICAgICB9XG4gICAgfSAvLyB3aGlsZVxuXG4gICAgaWYgKHBhcnNlci5wb3NpdGlvbiA+PSBwYXJzZXIuYnVmZmVyQ2hlY2tQb3NpdGlvbikge1xuICAgICAgY2hlY2tCdWZmZXJMZW5ndGgocGFyc2VyKVxuICAgIH1cbiAgICByZXR1cm4gcGFyc2VyXG4gIH1cblxuICAvKiEgaHR0cDovL210aHMuYmUvZnJvbWNvZGVwb2ludCB2MC4xLjAgYnkgQG1hdGhpYXMgKi9cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFTdHJpbmcuZnJvbUNvZGVQb2ludCkge1xuICAgIChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgc3RyaW5nRnJvbUNoYXJDb2RlID0gU3RyaW5nLmZyb21DaGFyQ29kZVxuICAgICAgdmFyIGZsb29yID0gTWF0aC5mbG9vclxuICAgICAgdmFyIGZyb21Db2RlUG9pbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBNQVhfU0laRSA9IDB4NDAwMFxuICAgICAgICB2YXIgY29kZVVuaXRzID0gW11cbiAgICAgICAgdmFyIGhpZ2hTdXJyb2dhdGVcbiAgICAgICAgdmFyIGxvd1N1cnJvZ2F0ZVxuICAgICAgICB2YXIgaW5kZXggPSAtMVxuICAgICAgICB2YXIgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxuICAgICAgICBpZiAoIWxlbmd0aCkge1xuICAgICAgICAgIHJldHVybiAnJ1xuICAgICAgICB9XG4gICAgICAgIHZhciByZXN1bHQgPSAnJ1xuICAgICAgICB3aGlsZSAoKytpbmRleCA8IGxlbmd0aCkge1xuICAgICAgICAgIHZhciBjb2RlUG9pbnQgPSBOdW1iZXIoYXJndW1lbnRzW2luZGV4XSlcbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAhaXNGaW5pdGUoY29kZVBvaW50KSB8fCAvLyBgTmFOYCwgYCtJbmZpbml0eWAsIG9yIGAtSW5maW5pdHlgXG4gICAgICAgICAgICBjb2RlUG9pbnQgPCAwIHx8IC8vIG5vdCBhIHZhbGlkIFVuaWNvZGUgY29kZSBwb2ludFxuICAgICAgICAgICAgY29kZVBvaW50ID4gMHgxMEZGRkYgfHwgLy8gbm90IGEgdmFsaWQgVW5pY29kZSBjb2RlIHBvaW50XG4gICAgICAgICAgICBmbG9vcihjb2RlUG9pbnQpICE9PSBjb2RlUG9pbnQgLy8gbm90IGFuIGludGVnZXJcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHRocm93IFJhbmdlRXJyb3IoJ0ludmFsaWQgY29kZSBwb2ludDogJyArIGNvZGVQb2ludClcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGNvZGVQb2ludCA8PSAweEZGRkYpIHsgLy8gQk1QIGNvZGUgcG9pbnRcbiAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGNvZGVQb2ludClcbiAgICAgICAgICB9IGVsc2UgeyAvLyBBc3RyYWwgY29kZSBwb2ludDsgc3BsaXQgaW4gc3Vycm9nYXRlIGhhbHZlc1xuICAgICAgICAgICAgLy8gaHR0cDovL21hdGhpYXNieW5lbnMuYmUvbm90ZXMvamF2YXNjcmlwdC1lbmNvZGluZyNzdXJyb2dhdGUtZm9ybXVsYWVcbiAgICAgICAgICAgIGNvZGVQb2ludCAtPSAweDEwMDAwXG4gICAgICAgICAgICBoaWdoU3Vycm9nYXRlID0gKGNvZGVQb2ludCA+PiAxMCkgKyAweEQ4MDBcbiAgICAgICAgICAgIGxvd1N1cnJvZ2F0ZSA9IChjb2RlUG9pbnQgJSAweDQwMCkgKyAweERDMDBcbiAgICAgICAgICAgIGNvZGVVbml0cy5wdXNoKGhpZ2hTdXJyb2dhdGUsIGxvd1N1cnJvZ2F0ZSlcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGluZGV4ICsgMSA9PT0gbGVuZ3RoIHx8IGNvZGVVbml0cy5sZW5ndGggPiBNQVhfU0laRSkge1xuICAgICAgICAgICAgcmVzdWx0ICs9IHN0cmluZ0Zyb21DaGFyQ29kZS5hcHBseShudWxsLCBjb2RlVW5pdHMpXG4gICAgICAgICAgICBjb2RlVW5pdHMubGVuZ3RoID0gMFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0XG4gICAgICB9XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICAgICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoU3RyaW5nLCAnZnJvbUNvZGVQb2ludCcsIHtcbiAgICAgICAgICB2YWx1ZTogZnJvbUNvZGVQb2ludCxcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIFN0cmluZy5mcm9tQ29kZVBvaW50ID0gZnJvbUNvZGVQb2ludFxuICAgICAgfVxuICAgIH0oKSlcbiAgfVxufSkodHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gdGhpcy5zYXggPSB7fSA6IGV4cG9ydHMpXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxudmFyIEVtaXR0ZXIgPSByZXF1aXJlKCdlbWl0dGVyJyk7XG5cbmZ1bmN0aW9uIFN0cmVhbSgpIHtcbiAgRW1pdHRlci5jYWxsKHRoaXMpO1xufVxuU3RyZWFtLnByb3RvdHlwZSA9IG5ldyBFbWl0dGVyKCk7XG5tb2R1bGUuZXhwb3J0cyA9IFN0cmVhbTtcbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuNC54XG5TdHJlYW0uU3RyZWFtID0gU3RyZWFtO1xuXG5TdHJlYW0ucHJvdG90eXBlLnBpcGUgPSBmdW5jdGlvbihkZXN0LCBvcHRpb25zKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzO1xuXG4gIGZ1bmN0aW9uIG9uZGF0YShjaHVuaykge1xuICAgIGlmIChkZXN0LndyaXRhYmxlKSB7XG4gICAgICBpZiAoZmFsc2UgPT09IGRlc3Qud3JpdGUoY2h1bmspICYmIHNvdXJjZS5wYXVzZSkge1xuICAgICAgICBzb3VyY2UucGF1c2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2RhdGEnLCBvbmRhdGEpO1xuXG4gIGZ1bmN0aW9uIG9uZHJhaW4oKSB7XG4gICAgaWYgKHNvdXJjZS5yZWFkYWJsZSAmJiBzb3VyY2UucmVzdW1lKSB7XG4gICAgICBzb3VyY2UucmVzdW1lKCk7XG4gICAgfVxuICB9XG5cbiAgZGVzdC5vbignZHJhaW4nLCBvbmRyYWluKTtcblxuICAvLyBJZiB0aGUgJ2VuZCcgb3B0aW9uIGlzIG5vdCBzdXBwbGllZCwgZGVzdC5lbmQoKSB3aWxsIGJlIGNhbGxlZCB3aGVuXG4gIC8vIHNvdXJjZSBnZXRzIHRoZSAnZW5kJyBvciAnY2xvc2UnIGV2ZW50cy4gIE9ubHkgZGVzdC5lbmQoKSBvbmNlLlxuICBpZiAoIWRlc3QuX2lzU3RkaW8gJiYgKCFvcHRpb25zIHx8IG9wdGlvbnMuZW5kICE9PSBmYWxzZSkpIHtcbiAgICBzb3VyY2Uub24oJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub24oJ2Nsb3NlJywgb25jbG9zZSk7XG4gIH1cblxuICB2YXIgZGlkT25FbmQgPSBmYWxzZTtcbiAgZnVuY3Rpb24gb25lbmQoKSB7XG4gICAgaWYgKGRpZE9uRW5kKSByZXR1cm47XG4gICAgZGlkT25FbmQgPSB0cnVlO1xuXG4gICAgZGVzdC5lbmQoKTtcbiAgfVxuXG5cbiAgZnVuY3Rpb24gb25jbG9zZSgpIHtcbiAgICBpZiAoZGlkT25FbmQpIHJldHVybjtcbiAgICBkaWRPbkVuZCA9IHRydWU7XG5cbiAgICBpZiAodHlwZW9mIGRlc3QuZGVzdHJveSA9PT0gJ2Z1bmN0aW9uJykgZGVzdC5kZXN0cm95KCk7XG4gIH1cblxuICAvLyBkb24ndCBsZWF2ZSBkYW5nbGluZyBwaXBlcyB3aGVuIHRoZXJlIGFyZSBlcnJvcnMuXG4gIGZ1bmN0aW9uIG9uZXJyb3IoZXIpIHtcbiAgICBjbGVhbnVwKCk7XG4gICAgaWYgKCF0aGlzLmhhc0xpc3RlbmVycygnZXJyb3InKSkge1xuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCBzdHJlYW0gZXJyb3IgaW4gcGlwZS5cbiAgICB9XG4gIH1cblxuICBzb3VyY2Uub24oJ2Vycm9yJywgb25lcnJvcik7XG4gIGRlc3Qub24oJ2Vycm9yJywgb25lcnJvcik7XG5cbiAgLy8gcmVtb3ZlIGFsbCB0aGUgZXZlbnQgbGlzdGVuZXJzIHRoYXQgd2VyZSBhZGRlZC5cbiAgZnVuY3Rpb24gY2xlYW51cCgpIHtcbiAgICBzb3VyY2Uub2ZmKCdkYXRhJywgb25kYXRhKTtcbiAgICBkZXN0Lm9mZignZHJhaW4nLCBvbmRyYWluKTtcblxuICAgIHNvdXJjZS5vZmYoJ2VuZCcsIG9uZW5kKTtcbiAgICBzb3VyY2Uub2ZmKCdjbG9zZScsIG9uY2xvc2UpO1xuXG4gICAgc291cmNlLm9mZignZXJyb3InLCBvbmVycm9yKTtcbiAgICBkZXN0Lm9mZignZXJyb3InLCBvbmVycm9yKTtcblxuICAgIHNvdXJjZS5vZmYoJ2VuZCcsIGNsZWFudXApO1xuICAgIHNvdXJjZS5vZmYoJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgICBkZXN0Lm9mZignZW5kJywgY2xlYW51cCk7XG4gICAgZGVzdC5vZmYoJ2Nsb3NlJywgY2xlYW51cCk7XG4gIH1cblxuICBzb3VyY2Uub24oJ2VuZCcsIGNsZWFudXApO1xuICBzb3VyY2Uub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5vbignZW5kJywgY2xlYW51cCk7XG4gIGRlc3Qub24oJ2Nsb3NlJywgY2xlYW51cCk7XG5cbiAgZGVzdC5lbWl0KCdwaXBlJywgc291cmNlKTtcblxuICAvLyBBbGxvdyBmb3IgdW5peC1saWtlIHVzYWdlOiBBLnBpcGUoQikucGlwZShDKVxuICByZXR1cm4gZGVzdDtcbn1cbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbi8qPHJlcGxhY2VtZW50PiovXG5cbnZhciBCdWZmZXIgPSByZXF1aXJlKCdzYWZlLWJ1ZmZlcicpLkJ1ZmZlcjtcbi8qPC9yZXBsYWNlbWVudD4qL1xuXG52YXIgaXNFbmNvZGluZyA9IEJ1ZmZlci5pc0VuY29kaW5nIHx8IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBlbmNvZGluZyA9ICcnICsgZW5jb2Rpbmc7XG4gIHN3aXRjaCAoZW5jb2RpbmcgJiYgZW5jb2RpbmcudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6Y2FzZSAndXRmOCc6Y2FzZSAndXRmLTgnOmNhc2UgJ2FzY2lpJzpjYXNlICdiaW5hcnknOmNhc2UgJ2Jhc2U2NCc6Y2FzZSAndWNzMic6Y2FzZSAndWNzLTInOmNhc2UgJ3V0ZjE2bGUnOmNhc2UgJ3V0Zi0xNmxlJzpjYXNlICdyYXcnOlxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTtcblxuZnVuY3Rpb24gX25vcm1hbGl6ZUVuY29kaW5nKGVuYykge1xuICBpZiAoIWVuYykgcmV0dXJuICd1dGY4JztcbiAgdmFyIHJldHJpZWQ7XG4gIHdoaWxlICh0cnVlKSB7XG4gICAgc3dpdGNoIChlbmMpIHtcbiAgICAgIGNhc2UgJ3V0ZjgnOlxuICAgICAgY2FzZSAndXRmLTgnOlxuICAgICAgICByZXR1cm4gJ3V0ZjgnO1xuICAgICAgY2FzZSAndWNzMic6XG4gICAgICBjYXNlICd1Y3MtMic6XG4gICAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgICAgcmV0dXJuICd1dGYxNmxlJztcbiAgICAgIGNhc2UgJ2xhdGluMSc6XG4gICAgICBjYXNlICdiaW5hcnknOlxuICAgICAgICByZXR1cm4gJ2xhdGluMSc7XG4gICAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgY2FzZSAnYXNjaWknOlxuICAgICAgY2FzZSAnaGV4JzpcbiAgICAgICAgcmV0dXJuIGVuYztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmIChyZXRyaWVkKSByZXR1cm47IC8vIHVuZGVmaW5lZFxuICAgICAgICBlbmMgPSAoJycgKyBlbmMpLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIHJldHJpZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxufTtcblxuLy8gRG8gbm90IGNhY2hlIGBCdWZmZXIuaXNFbmNvZGluZ2Agd2hlbiBjaGVja2luZyBlbmNvZGluZyBuYW1lcyBhcyBzb21lXG4vLyBtb2R1bGVzIG1vbmtleS1wYXRjaCBpdCB0byBzdXBwb3J0IGFkZGl0aW9uYWwgZW5jb2RpbmdzXG5mdW5jdGlvbiBub3JtYWxpemVFbmNvZGluZyhlbmMpIHtcbiAgdmFyIG5lbmMgPSBfbm9ybWFsaXplRW5jb2RpbmcoZW5jKTtcbiAgaWYgKHR5cGVvZiBuZW5jICE9PSAnc3RyaW5nJyAmJiAoQnVmZmVyLmlzRW5jb2RpbmcgPT09IGlzRW5jb2RpbmcgfHwgIWlzRW5jb2RpbmcoZW5jKSkpIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZzogJyArIGVuYyk7XG4gIHJldHVybiBuZW5jIHx8IGVuYztcbn1cblxuLy8gU3RyaW5nRGVjb2RlciBwcm92aWRlcyBhbiBpbnRlcmZhY2UgZm9yIGVmZmljaWVudGx5IHNwbGl0dGluZyBhIHNlcmllcyBvZlxuLy8gYnVmZmVycyBpbnRvIGEgc2VyaWVzIG9mIEpTIHN0cmluZ3Mgd2l0aG91dCBicmVha2luZyBhcGFydCBtdWx0aS1ieXRlXG4vLyBjaGFyYWN0ZXJzLlxuZXhwb3J0cy5TdHJpbmdEZWNvZGVyID0gU3RyaW5nRGVjb2RlcjtcbmZ1bmN0aW9uIFN0cmluZ0RlY29kZXIoZW5jb2RpbmcpIHtcbiAgdGhpcy5lbmNvZGluZyA9IG5vcm1hbGl6ZUVuY29kaW5nKGVuY29kaW5nKTtcbiAgdmFyIG5iO1xuICBzd2l0Y2ggKHRoaXMuZW5jb2RpbmcpIHtcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICAgIHRoaXMudGV4dCA9IHV0ZjE2VGV4dDtcbiAgICAgIHRoaXMuZW5kID0gdXRmMTZFbmQ7XG4gICAgICBuYiA9IDQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICd1dGY4JzpcbiAgICAgIHRoaXMuZmlsbExhc3QgPSB1dGY4RmlsbExhc3Q7XG4gICAgICBuYiA9IDQ7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgdGhpcy50ZXh0ID0gYmFzZTY0VGV4dDtcbiAgICAgIHRoaXMuZW5kID0gYmFzZTY0RW5kO1xuICAgICAgbmIgPSAzO1xuICAgICAgYnJlYWs7XG4gICAgZGVmYXVsdDpcbiAgICAgIHRoaXMud3JpdGUgPSBzaW1wbGVXcml0ZTtcbiAgICAgIHRoaXMuZW5kID0gc2ltcGxlRW5kO1xuICAgICAgcmV0dXJuO1xuICB9XG4gIHRoaXMubGFzdE5lZWQgPSAwO1xuICB0aGlzLmxhc3RUb3RhbCA9IDA7XG4gIHRoaXMubGFzdENoYXIgPSBCdWZmZXIuYWxsb2NVbnNhZmUobmIpO1xufVxuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChidWYpIHtcbiAgaWYgKGJ1Zi5sZW5ndGggPT09IDApIHJldHVybiAnJztcbiAgdmFyIHI7XG4gIHZhciBpO1xuICBpZiAodGhpcy5sYXN0TmVlZCkge1xuICAgIHIgPSB0aGlzLmZpbGxMYXN0KGJ1Zik7XG4gICAgaWYgKHIgPT09IHVuZGVmaW5lZCkgcmV0dXJuICcnO1xuICAgIGkgPSB0aGlzLmxhc3ROZWVkO1xuICAgIHRoaXMubGFzdE5lZWQgPSAwO1xuICB9IGVsc2Uge1xuICAgIGkgPSAwO1xuICB9XG4gIGlmIChpIDwgYnVmLmxlbmd0aCkgcmV0dXJuIHIgPyByICsgdGhpcy50ZXh0KGJ1ZiwgaSkgOiB0aGlzLnRleHQoYnVmLCBpKTtcbiAgcmV0dXJuIHIgfHwgJyc7XG59O1xuXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5lbmQgPSB1dGY4RW5kO1xuXG4vLyBSZXR1cm5zIG9ubHkgY29tcGxldGUgY2hhcmFjdGVycyBpbiBhIEJ1ZmZlclxuU3RyaW5nRGVjb2Rlci5wcm90b3R5cGUudGV4dCA9IHV0ZjhUZXh0O1xuXG4vLyBBdHRlbXB0cyB0byBjb21wbGV0ZSBhIHBhcnRpYWwgbm9uLVVURi04IGNoYXJhY3RlciB1c2luZyBieXRlcyBmcm9tIGEgQnVmZmVyXG5TdHJpbmdEZWNvZGVyLnByb3RvdHlwZS5maWxsTGFzdCA9IGZ1bmN0aW9uIChidWYpIHtcbiAgaWYgKHRoaXMubGFzdE5lZWQgPD0gYnVmLmxlbmd0aCkge1xuICAgIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZCwgMCwgdGhpcy5sYXN0TmVlZCk7XG4gICAgcmV0dXJuIHRoaXMubGFzdENoYXIudG9TdHJpbmcodGhpcy5lbmNvZGluZywgMCwgdGhpcy5sYXN0VG90YWwpO1xuICB9XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZCwgMCwgYnVmLmxlbmd0aCk7XG4gIHRoaXMubGFzdE5lZWQgLT0gYnVmLmxlbmd0aDtcbn07XG5cbi8vIENoZWNrcyB0aGUgdHlwZSBvZiBhIFVURi04IGJ5dGUsIHdoZXRoZXIgaXQncyBBU0NJSSwgYSBsZWFkaW5nIGJ5dGUsIG9yIGFcbi8vIGNvbnRpbnVhdGlvbiBieXRlLiBJZiBhbiBpbnZhbGlkIGJ5dGUgaXMgZGV0ZWN0ZWQsIC0yIGlzIHJldHVybmVkLlxuZnVuY3Rpb24gdXRmOENoZWNrQnl0ZShieXRlKSB7XG4gIGlmIChieXRlIDw9IDB4N0YpIHJldHVybiAwO2Vsc2UgaWYgKGJ5dGUgPj4gNSA9PT0gMHgwNikgcmV0dXJuIDI7ZWxzZSBpZiAoYnl0ZSA+PiA0ID09PSAweDBFKSByZXR1cm4gMztlbHNlIGlmIChieXRlID4+IDMgPT09IDB4MUUpIHJldHVybiA0O1xuICByZXR1cm4gYnl0ZSA+PiA2ID09PSAweDAyID8gLTEgOiAtMjtcbn1cblxuLy8gQ2hlY2tzIGF0IG1vc3QgMyBieXRlcyBhdCB0aGUgZW5kIG9mIGEgQnVmZmVyIGluIG9yZGVyIHRvIGRldGVjdCBhblxuLy8gaW5jb21wbGV0ZSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3Rlci4gVGhlIHRvdGFsIG51bWJlciBvZiBieXRlcyAoMiwgMywgb3IgNClcbi8vIG5lZWRlZCB0byBjb21wbGV0ZSB0aGUgVVRGLTggY2hhcmFjdGVyIChpZiBhcHBsaWNhYmxlKSBhcmUgcmV0dXJuZWQuXG5mdW5jdGlvbiB1dGY4Q2hlY2tJbmNvbXBsZXRlKHNlbGYsIGJ1ZiwgaSkge1xuICB2YXIgaiA9IGJ1Zi5sZW5ndGggLSAxO1xuICBpZiAoaiA8IGkpIHJldHVybiAwO1xuICB2YXIgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMTtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkgfHwgbmIgPT09IC0yKSByZXR1cm4gMDtcbiAgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkgc2VsZi5sYXN0TmVlZCA9IG5iIC0gMjtcbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgaWYgKC0taiA8IGkgfHwgbmIgPT09IC0yKSByZXR1cm4gMDtcbiAgbmIgPSB1dGY4Q2hlY2tCeXRlKGJ1ZltqXSk7XG4gIGlmIChuYiA+PSAwKSB7XG4gICAgaWYgKG5iID4gMCkge1xuICAgICAgaWYgKG5iID09PSAyKSBuYiA9IDA7ZWxzZSBzZWxmLmxhc3ROZWVkID0gbmIgLSAzO1xuICAgIH1cbiAgICByZXR1cm4gbmI7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG5cbi8vIFZhbGlkYXRlcyBhcyBtYW55IGNvbnRpbnVhdGlvbiBieXRlcyBmb3IgYSBtdWx0aS1ieXRlIFVURi04IGNoYXJhY3RlciBhc1xuLy8gbmVlZGVkIG9yIGFyZSBhdmFpbGFibGUuIElmIHdlIHNlZSBhIG5vbi1jb250aW51YXRpb24gYnl0ZSB3aGVyZSB3ZSBleHBlY3Rcbi8vIG9uZSwgd2UgXCJyZXBsYWNlXCIgdGhlIHZhbGlkYXRlZCBjb250aW51YXRpb24gYnl0ZXMgd2UndmUgc2VlbiBzbyBmYXIgd2l0aFxuLy8gYSBzaW5nbGUgVVRGLTggcmVwbGFjZW1lbnQgY2hhcmFjdGVyICgnXFx1ZmZmZCcpLCB0byBtYXRjaCB2OCdzIFVURi04IGRlY29kaW5nXG4vLyBiZWhhdmlvci4gVGhlIGNvbnRpbnVhdGlvbiBieXRlIGNoZWNrIGlzIGluY2x1ZGVkIHRocmVlIHRpbWVzIGluIHRoZSBjYXNlXG4vLyB3aGVyZSBhbGwgb2YgdGhlIGNvbnRpbnVhdGlvbiBieXRlcyBmb3IgYSBjaGFyYWN0ZXIgZXhpc3QgaW4gdGhlIHNhbWUgYnVmZmVyLlxuLy8gSXQgaXMgYWxzbyBkb25lIHRoaXMgd2F5IGFzIGEgc2xpZ2h0IHBlcmZvcm1hbmNlIGluY3JlYXNlIGluc3RlYWQgb2YgdXNpbmcgYVxuLy8gbG9vcC5cbmZ1bmN0aW9uIHV0ZjhDaGVja0V4dHJhQnl0ZXMoc2VsZiwgYnVmLCBwKSB7XG4gIGlmICgoYnVmWzBdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICBzZWxmLmxhc3ROZWVkID0gMDtcbiAgICByZXR1cm4gJ1xcdWZmZmQnO1xuICB9XG4gIGlmIChzZWxmLmxhc3ROZWVkID4gMSAmJiBidWYubGVuZ3RoID4gMSkge1xuICAgIGlmICgoYnVmWzFdICYgMHhDMCkgIT09IDB4ODApIHtcbiAgICAgIHNlbGYubGFzdE5lZWQgPSAxO1xuICAgICAgcmV0dXJuICdcXHVmZmZkJztcbiAgICB9XG4gICAgaWYgKHNlbGYubGFzdE5lZWQgPiAyICYmIGJ1Zi5sZW5ndGggPiAyKSB7XG4gICAgICBpZiAoKGJ1ZlsyXSAmIDB4QzApICE9PSAweDgwKSB7XG4gICAgICAgIHNlbGYubGFzdE5lZWQgPSAyO1xuICAgICAgICByZXR1cm4gJ1xcdWZmZmQnO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG4vLyBBdHRlbXB0cyB0byBjb21wbGV0ZSBhIG11bHRpLWJ5dGUgVVRGLTggY2hhcmFjdGVyIHVzaW5nIGJ5dGVzIGZyb20gYSBCdWZmZXIuXG5mdW5jdGlvbiB1dGY4RmlsbExhc3QoYnVmKSB7XG4gIHZhciBwID0gdGhpcy5sYXN0VG90YWwgLSB0aGlzLmxhc3ROZWVkO1xuICB2YXIgciA9IHV0ZjhDaGVja0V4dHJhQnl0ZXModGhpcywgYnVmLCBwKTtcbiAgaWYgKHIgIT09IHVuZGVmaW5lZCkgcmV0dXJuIHI7XG4gIGlmICh0aGlzLmxhc3ROZWVkIDw9IGJ1Zi5sZW5ndGgpIHtcbiAgICBidWYuY29weSh0aGlzLmxhc3RDaGFyLCBwLCAwLCB0aGlzLmxhc3ROZWVkKTtcbiAgICByZXR1cm4gdGhpcy5sYXN0Q2hhci50b1N0cmluZyh0aGlzLmVuY29kaW5nLCAwLCB0aGlzLmxhc3RUb3RhbCk7XG4gIH1cbiAgYnVmLmNvcHkodGhpcy5sYXN0Q2hhciwgcCwgMCwgYnVmLmxlbmd0aCk7XG4gIHRoaXMubGFzdE5lZWQgLT0gYnVmLmxlbmd0aDtcbn1cblxuLy8gUmV0dXJucyBhbGwgY29tcGxldGUgVVRGLTggY2hhcmFjdGVycyBpbiBhIEJ1ZmZlci4gSWYgdGhlIEJ1ZmZlciBlbmRlZCBvbiBhXG4vLyBwYXJ0aWFsIGNoYXJhY3RlciwgdGhlIGNoYXJhY3RlcidzIGJ5dGVzIGFyZSBidWZmZXJlZCB1bnRpbCB0aGUgcmVxdWlyZWRcbi8vIG51bWJlciBvZiBieXRlcyBhcmUgYXZhaWxhYmxlLlxuZnVuY3Rpb24gdXRmOFRleHQoYnVmLCBpKSB7XG4gIHZhciB0b3RhbCA9IHV0ZjhDaGVja0luY29tcGxldGUodGhpcywgYnVmLCBpKTtcbiAgaWYgKCF0aGlzLmxhc3ROZWVkKSByZXR1cm4gYnVmLnRvU3RyaW5nKCd1dGY4JywgaSk7XG4gIHRoaXMubGFzdFRvdGFsID0gdG90YWw7XG4gIHZhciBlbmQgPSBidWYubGVuZ3RoIC0gKHRvdGFsIC0gdGhpcy5sYXN0TmVlZCk7XG4gIGJ1Zi5jb3B5KHRoaXMubGFzdENoYXIsIDAsIGVuZCk7XG4gIHJldHVybiBidWYudG9TdHJpbmcoJ3V0ZjgnLCBpLCBlbmQpO1xufVxuXG4vLyBGb3IgVVRGLTgsIGEgcmVwbGFjZW1lbnQgY2hhcmFjdGVyIGlzIGFkZGVkIHdoZW4gZW5kaW5nIG9uIGEgcGFydGlhbFxuLy8gY2hhcmFjdGVyLlxuZnVuY3Rpb24gdXRmOEVuZChidWYpIHtcbiAgdmFyIHIgPSBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xuICBpZiAodGhpcy5sYXN0TmVlZCkgcmV0dXJuIHIgKyAnXFx1ZmZmZCc7XG4gIHJldHVybiByO1xufVxuXG4vLyBVVEYtMTZMRSB0eXBpY2FsbHkgbmVlZHMgdHdvIGJ5dGVzIHBlciBjaGFyYWN0ZXIsIGJ1dCBldmVuIGlmIHdlIGhhdmUgYW4gZXZlblxuLy8gbnVtYmVyIG9mIGJ5dGVzIGF2YWlsYWJsZSwgd2UgbmVlZCB0byBjaGVjayBpZiB3ZSBlbmQgb24gYSBsZWFkaW5nL2hpZ2hcbi8vIHN1cnJvZ2F0ZS4gSW4gdGhhdCBjYXNlLCB3ZSBuZWVkIHRvIHdhaXQgZm9yIHRoZSBuZXh0IHR3byBieXRlcyBpbiBvcmRlciB0b1xuLy8gZGVjb2RlIHRoZSBsYXN0IGNoYXJhY3RlciBwcm9wZXJseS5cbmZ1bmN0aW9uIHV0ZjE2VGV4dChidWYsIGkpIHtcbiAgaWYgKChidWYubGVuZ3RoIC0gaSkgJSAyID09PSAwKSB7XG4gICAgdmFyIHIgPSBidWYudG9TdHJpbmcoJ3V0ZjE2bGUnLCBpKTtcbiAgICBpZiAocikge1xuICAgICAgdmFyIGMgPSByLmNoYXJDb2RlQXQoci5sZW5ndGggLSAxKTtcbiAgICAgIGlmIChjID49IDB4RDgwMCAmJiBjIDw9IDB4REJGRikge1xuICAgICAgICB0aGlzLmxhc3ROZWVkID0gMjtcbiAgICAgICAgdGhpcy5sYXN0VG90YWwgPSA0O1xuICAgICAgICB0aGlzLmxhc3RDaGFyWzBdID0gYnVmW2J1Zi5sZW5ndGggLSAyXTtcbiAgICAgICAgdGhpcy5sYXN0Q2hhclsxXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gICAgICAgIHJldHVybiByLnNsaWNlKDAsIC0xKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHI7XG4gIH1cbiAgdGhpcy5sYXN0TmVlZCA9IDE7XG4gIHRoaXMubGFzdFRvdGFsID0gMjtcbiAgdGhpcy5sYXN0Q2hhclswXSA9IGJ1ZltidWYubGVuZ3RoIC0gMV07XG4gIHJldHVybiBidWYudG9TdHJpbmcoJ3V0ZjE2bGUnLCBpLCBidWYubGVuZ3RoIC0gMSk7XG59XG5cbi8vIEZvciBVVEYtMTZMRSB3ZSBkbyBub3QgZXhwbGljaXRseSBhcHBlbmQgc3BlY2lhbCByZXBsYWNlbWVudCBjaGFyYWN0ZXJzIGlmIHdlXG4vLyBlbmQgb24gYSBwYXJ0aWFsIGNoYXJhY3Rlciwgd2Ugc2ltcGx5IGxldCB2OCBoYW5kbGUgdGhhdC5cbmZ1bmN0aW9uIHV0ZjE2RW5kKGJ1Zikge1xuICB2YXIgciA9IGJ1ZiAmJiBidWYubGVuZ3RoID8gdGhpcy53cml0ZShidWYpIDogJyc7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSB7XG4gICAgdmFyIGVuZCA9IHRoaXMubGFzdFRvdGFsIC0gdGhpcy5sYXN0TmVlZDtcbiAgICByZXR1cm4gciArIHRoaXMubGFzdENoYXIudG9TdHJpbmcoJ3V0ZjE2bGUnLCAwLCBlbmQpO1xuICB9XG4gIHJldHVybiByO1xufVxuXG5mdW5jdGlvbiBiYXNlNjRUZXh0KGJ1ZiwgaSkge1xuICB2YXIgbiA9IChidWYubGVuZ3RoIC0gaSkgJSAzO1xuICBpZiAobiA9PT0gMCkgcmV0dXJuIGJ1Zi50b1N0cmluZygnYmFzZTY0JywgaSk7XG4gIHRoaXMubGFzdE5lZWQgPSAzIC0gbjtcbiAgdGhpcy5sYXN0VG90YWwgPSAzO1xuICBpZiAobiA9PT0gMSkge1xuICAgIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICB9IGVsc2Uge1xuICAgIHRoaXMubGFzdENoYXJbMF0gPSBidWZbYnVmLmxlbmd0aCAtIDJdO1xuICAgIHRoaXMubGFzdENoYXJbMV0gPSBidWZbYnVmLmxlbmd0aCAtIDFdO1xuICB9XG4gIHJldHVybiBidWYudG9TdHJpbmcoJ2Jhc2U2NCcsIGksIGJ1Zi5sZW5ndGggLSBuKTtcbn1cblxuZnVuY3Rpb24gYmFzZTY0RW5kKGJ1Zikge1xuICB2YXIgciA9IGJ1ZiAmJiBidWYubGVuZ3RoID8gdGhpcy53cml0ZShidWYpIDogJyc7XG4gIGlmICh0aGlzLmxhc3ROZWVkKSByZXR1cm4gciArIHRoaXMubGFzdENoYXIudG9TdHJpbmcoJ2Jhc2U2NCcsIDAsIDMgLSB0aGlzLmxhc3ROZWVkKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8vIFBhc3MgYnl0ZXMgb24gdGhyb3VnaCBmb3Igc2luZ2xlLWJ5dGUgZW5jb2RpbmdzIChlLmcuIGFzY2lpLCBsYXRpbjEsIGhleClcbmZ1bmN0aW9uIHNpbXBsZVdyaXRlKGJ1Zikge1xuICByZXR1cm4gYnVmLnRvU3RyaW5nKHRoaXMuZW5jb2RpbmcpO1xufVxuXG5mdW5jdGlvbiBzaW1wbGVFbmQoYnVmKSB7XG4gIHJldHVybiBidWYgJiYgYnVmLmxlbmd0aCA/IHRoaXMud3JpdGUoYnVmKSA6ICcnO1xufSIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vRWRpdG9yLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9FZGl0b3Iuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vSW50ZXJmYWNlLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9JbnRlcmZhY2Uuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vUGxheWVyLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9QbGF5ZXIuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgcGxheWVyXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvcGxheWVyXCIpO1xuY29uc3QgZXZlbnRfMSA9IHJlcXVpcmUoXCIuL2V2ZW50XCIpO1xuY29uc3QgZmlsZUxvYWRlcl8xID0gcmVxdWlyZShcIi4uL3V0aWxzL2ZpbGVMb2FkZXJcIik7XG5jb25zdCBTYW1wbGVfMSA9IHJlcXVpcmUoXCIuL1NhbXBsZVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiQHNmei10b29scy9jb3JlL2Rpc3QvdXRpbHNcIik7XG5jb25zdCBwYXJzZV8xID0gcmVxdWlyZShcIkBzZnotdG9vbHMvY29yZS9kaXN0L3BhcnNlXCIpO1xuY2xhc3MgQXVkaW8gZXh0ZW5kcyBldmVudF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wcmVsb2FkID0gcGxheWVyXzEuQXVkaW9QcmVsb2FkLk9OX0RFTUFORDtcbiAgICAgICAgdGhpcy5yZWdpb25zID0gW107XG4gICAgICAgIHRoaXMuYmVuZCA9IDA7XG4gICAgICAgIHRoaXMuY2hhbmFmdCA9IDY0O1xuICAgICAgICB0aGlzLnBvbHlhZnQgPSA2NDtcbiAgICAgICAgdGhpcy5icG0gPSAxMjA7XG4gICAgICAgIHRoaXMucmVnaW9uRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBsb2NoYW46IDAsXG4gICAgICAgICAgICBoaWNoYW46IDE1LFxuICAgICAgICAgICAgbG9rZXk6IDAsXG4gICAgICAgICAgICBoaWtleTogMTI3LFxuICAgICAgICAgICAgbG92ZWw6IDAsXG4gICAgICAgICAgICBoaXZlbDogMTI3LFxuICAgICAgICAgICAgbG9iZW5kOiAtODE5MixcbiAgICAgICAgICAgIGhpYmVuZDogODE5MixcbiAgICAgICAgICAgIGxvY2hhbmFmdDogMCxcbiAgICAgICAgICAgIGhpY2hhbmFmdDogMTI3LFxuICAgICAgICAgICAgbG9wb2x5YWZ0OiAwLFxuICAgICAgICAgICAgaGlwb2x5YWZ0OiAxMjcsXG4gICAgICAgICAgICBsb3JhbmQ6IDAsXG4gICAgICAgICAgICBoaXJhbmQ6IDEsXG4gICAgICAgICAgICBsb2JwbTogMCxcbiAgICAgICAgICAgIGhpYnBtOiA1MDAsXG4gICAgICAgIH07XG4gICAgICAgIGlmICghd2luZG93LkF1ZGlvQ29udGV4dClcbiAgICAgICAgICAgIHdpbmRvdy5hbGVydCgnQnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IFdlYkF1ZGlvJyk7XG4gICAgICAgIHRoaXMuY29udGV4dCA9IG5ldyB3aW5kb3cuQXVkaW9Db250ZXh0KCk7XG4gICAgICAgIGlmICh3aW5kb3cud2ViQXVkaW9Db250cm9sc1dpZGdldE1hbmFnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy53ZWJBdWRpb0NvbnRyb2xzV2lkZ2V0TWFuYWdlci5hZGRNaWRpTGlzdGVuZXIoKGV2ZW50KSA9PiB0aGlzLm9uS2V5Ym9hcmQoZXZlbnQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd3ZWJhdWRpby1jb250cm9scyBub3QgZm91bmQsIGFkZCB0byBhIDxzY3JpcHQ+IHRhZy4nKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5sb2FkZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyID0gb3B0aW9ucy5sb2FkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IG5ldyBmaWxlTG9hZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIC8vIFVzZSBzaGFyZWQgbG9hZGVyXG4gICAgICAgIC8vIHBhcnNlU2V0TG9hZGVyKHRoaXMubG9hZGVyKTtcbiAgICAgICAgaWYgKG9wdGlvbnMucm9vdClcbiAgICAgICAgICAgIHRoaXMubG9hZGVyLnNldFJvb3Qob3B0aW9ucy5yb290KTtcbiAgICAgICAgaWYgKG9wdGlvbnMuZmlsZSkge1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMubG9hZGVyLmFkZEZpbGUob3B0aW9ucy5maWxlKTtcbiAgICAgICAgICAgIHRoaXMuc2hvd0ZpbGUoZmlsZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucHJlbG9hZClcbiAgICAgICAgICAgIHRoaXMucHJlbG9hZCA9IG9wdGlvbnMucHJlbG9hZDtcbiAgICB9XG4gICAgc2hvd0ZpbGUoZmlsZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdwcmVsb2FkJywge1xuICAgICAgICAgICAgICAgIHN0YXR1czogYExvYWRpbmcgc2Z6IGZpbGVzYCxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdsb2FkaW5nJywgdHJ1ZSk7XG4gICAgICAgICAgICBmaWxlID0geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZShmaWxlKTtcbiAgICAgICAgICAgIGlmICghZmlsZSlcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2hvd0ZpbGUnLCBmaWxlKTtcbiAgICAgICAgICAgIGNvbnN0IHByZWZpeCA9ICgwLCB1dGlsc18xLnBhdGhHZXREaXJlY3RvcnkpKGZpbGUucGF0aCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncHJlZml4JywgcHJlZml4KTtcbiAgICAgICAgICAgIGxldCBoZWFkZXJzID0gW107XG4gICAgICAgICAgICBpZiAoZmlsZS5leHQgPT09ICdzZnonKSB7XG4gICAgICAgICAgICAgICAgaGVhZGVycyA9IHlpZWxkICgwLCBwYXJzZV8xLnBhcnNlU2Z6KShmaWxlID09PSBudWxsIHx8IGZpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZpbGUuY29udGVudHMsIHByZWZpeCk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2hlYWRlcnMnLCBoZWFkZXJzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGZpbGUuZXh0ID09PSAnanNvbicpIHtcbiAgICAgICAgICAgICAgICBoZWFkZXJzID0gSlNPTi5wYXJzZShmaWxlID09PSBudWxsIHx8IGZpbGUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZpbGUuY29udGVudHMpLmVsZW1lbnRzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5yZWdpb25zID0gKDAsIHBhcnNlXzEucGFyc2VIZWFkZXJzKShoZWFkZXJzLCBwcmVmaXgpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lvbnMnLCB0aGlzLnJlZ2lvbnMpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3ByZWxvYWQnLCB0aGlzLnByZWxvYWQpO1xuICAgICAgICAgICAgaWYgKHRoaXMucHJlbG9hZCA9PT0gcGxheWVyXzEuQXVkaW9QcmVsb2FkLlNFUVVFTlRJQUwpIHtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnByZWxvYWRGaWxlcyh0aGlzLnJlZ2lvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdrZXlib2FyZE1hcCcsIHRoaXMuZ2V0S2V5Ym9hcmRNYXAodGhpcy5yZWdpb25zKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2xvYWRpbmcnLCBmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRLZXlib2FyZE1hcChyZWdpb25zKSB7XG4gICAgICAgIGNvbnN0IGtleWJvYXJkTWFwID0ge307XG4gICAgICAgIHJlZ2lvbnMuZm9yRWFjaCgocmVnaW9uKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtleWJvYXJkTWFwKHJlZ2lvbiwga2V5Ym9hcmRNYXApO1xuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGtleWJvYXJkTWFwO1xuICAgIH1cbiAgICB1cGRhdGVLZXlib2FyZE1hcChyZWdpb24sIGtleWJvYXJkTWFwKSB7XG4gICAgICAgIGlmICghcmVnaW9uLmxva2V5ICYmIHJlZ2lvbi5rZXkpXG4gICAgICAgICAgICByZWdpb24ubG9rZXkgPSByZWdpb24ua2V5O1xuICAgICAgICBpZiAoIXJlZ2lvbi5oaWtleSAmJiByZWdpb24ua2V5KVxuICAgICAgICAgICAgcmVnaW9uLmhpa2V5ID0gcmVnaW9uLmtleTtcbiAgICAgICAgY29uc3QgbWVyZ2VkID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5yZWdpb25EZWZhdWx0cywgcmVnaW9uKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IG1lcmdlZC5sb2tleTsgaSA8PSBtZXJnZWQuaGlrZXk7IGkgKz0gMSkge1xuICAgICAgICAgICAga2V5Ym9hcmRNYXBbaV0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHByZWxvYWRGaWxlcyhyZWdpb25zKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCBrZXlib2FyZE1hcCA9IHt9O1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KCdrZXlib2FyZE1hcCcsIGtleWJvYXJkTWFwKTtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IDA7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSBPYmplY3Qua2V5cyhyZWdpb25zKS5sZW5ndGggLSAxO1xuICAgICAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gcmVnaW9ucykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgncHJlbG9hZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzOiBgTG9hZGluZyBhdWRpbyBmaWxlczogJHtzdGFydH0gb2YgJHtlbmR9YCxcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zdCBzYW1wbGVQYXRoID0gcmVnaW9uc1trZXldLnNhbXBsZTtcbiAgICAgICAgICAgICAgICBpZiAoIXNhbXBsZVBhdGggfHwgc2FtcGxlUGF0aC5pbmNsdWRlcygnKicpKVxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmxvYWRlci5nZXRGaWxlKHNhbXBsZVBhdGgsIHRydWUpO1xuICAgICAgICAgICAgICAgIHN0YXJ0ICs9IDE7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVLZXlib2FyZE1hcChyZWdpb25zW2tleV0sIGtleWJvYXJkTWFwKTtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2tleWJvYXJkTWFwJywga2V5Ym9hcmRNYXApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgY2hlY2tSZWdpb24ocmVnaW9uLCBjb250cm9sRXZlbnQsIHJhbmQpIHtcbiAgICAgICAgcmV0dXJuIChyZWdpb24uc2FtcGxlICE9IG51bGwgJiZcbiAgICAgICAgICAgIHJlZ2lvbi5sb2NoYW4gPD0gY29udHJvbEV2ZW50LmNoYW5uZWwgJiZcbiAgICAgICAgICAgIHJlZ2lvbi5oaWNoYW4gPj0gY29udHJvbEV2ZW50LmNoYW5uZWwgJiZcbiAgICAgICAgICAgIHJlZ2lvbi5sb2tleSA8PSBjb250cm9sRXZlbnQubm90ZSAmJlxuICAgICAgICAgICAgcmVnaW9uLmhpa2V5ID49IGNvbnRyb2xFdmVudC5ub3RlICYmXG4gICAgICAgICAgICByZWdpb24ubG92ZWwgPD0gY29udHJvbEV2ZW50LnZlbG9jaXR5ICYmXG4gICAgICAgICAgICByZWdpb24uaGl2ZWwgPj0gY29udHJvbEV2ZW50LnZlbG9jaXR5ICYmXG4gICAgICAgICAgICByZWdpb24ubG9iZW5kIDw9IHRoaXMuYmVuZCAmJlxuICAgICAgICAgICAgcmVnaW9uLmhpYmVuZCA+PSB0aGlzLmJlbmQgJiZcbiAgICAgICAgICAgIHJlZ2lvbi5sb2NoYW5hZnQgPD0gdGhpcy5jaGFuYWZ0ICYmXG4gICAgICAgICAgICByZWdpb24uaGljaGFuYWZ0ID49IHRoaXMuY2hhbmFmdCAmJlxuICAgICAgICAgICAgcmVnaW9uLmxvcG9seWFmdCA8PSB0aGlzLnBvbHlhZnQgJiZcbiAgICAgICAgICAgIHJlZ2lvbi5oaXBvbHlhZnQgPj0gdGhpcy5wb2x5YWZ0ICYmXG4gICAgICAgICAgICByZWdpb24ubG9yYW5kIDw9IHJhbmQgJiZcbiAgICAgICAgICAgIHJlZ2lvbi5oaXJhbmQgPj0gcmFuZCAmJlxuICAgICAgICAgICAgcmVnaW9uLmxvYnBtIDw9IHRoaXMuYnBtICYmXG4gICAgICAgICAgICByZWdpb24uaGlicG0gPj0gdGhpcy5icG0pO1xuICAgIH1cbiAgICBjaGVja1JlZ2lvbnMocmVnaW9ucywgY29udHJvbEV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHJhbmRvbSA9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgIHJldHVybiByZWdpb25zLmZpbHRlcigocmVnaW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXJlZ2lvbi5sb2tleSAmJiByZWdpb24ua2V5KVxuICAgICAgICAgICAgICAgIHJlZ2lvbi5sb2tleSA9IHJlZ2lvbi5rZXk7XG4gICAgICAgICAgICBpZiAoIXJlZ2lvbi5oaWtleSAmJiByZWdpb24ua2V5KVxuICAgICAgICAgICAgICAgIHJlZ2lvbi5oaWtleSA9IHJlZ2lvbi5rZXk7XG4gICAgICAgICAgICBjb25zdCBtZXJnZWQgPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnJlZ2lvbkRlZmF1bHRzLCByZWdpb24pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hlY2tSZWdpb24obWVyZ2VkLCBjb250cm9sRXZlbnQsIHJhbmRvbSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBvbktleWJvYXJkKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xFdmVudCA9IHtcbiAgICAgICAgICAgIGNoYW5uZWw6IDEsXG4gICAgICAgICAgICBub3RlOiBldmVudC5kYXRhWzFdLFxuICAgICAgICAgICAgdmVsb2NpdHk6IGV2ZW50LmRhdGFbMF0gPT09IDEyOCA/IDAgOiBldmVudC5kYXRhWzJdLFxuICAgICAgICB9O1xuICAgICAgICB0aGlzLnVwZGF0ZShjb250cm9sRXZlbnQpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoJ2NoYW5nZScsIGNvbnRyb2xFdmVudCk7XG4gICAgfVxuICAgIHVwZGF0ZShldmVudCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgLy8gcHJvdG90eXBlIHVzaW5nIHNhbXBsZXNcbiAgICAgICAgICAgIGlmIChldmVudC52ZWxvY2l0eSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdldmVudCcsIGV2ZW50KTtcbiAgICAgICAgICAgIGNvbnN0IHJlZ2lvbnNGaWx0ZXJlZCA9IHRoaXMuY2hlY2tSZWdpb25zKHRoaXMucmVnaW9ucywgZXZlbnQpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZ2lvbnNGaWx0ZXJlZCcsIHJlZ2lvbnNGaWx0ZXJlZCk7XG4gICAgICAgICAgICBpZiAoIXJlZ2lvbnNGaWx0ZXJlZC5sZW5ndGgpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgcmFuZG9tU2FtcGxlID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmVnaW9uc0ZpbHRlcmVkLmxlbmd0aCk7XG4gICAgICAgICAgICBjb25zdCBrZXlTYW1wbGUgPSByZWdpb25zRmlsdGVyZWRbcmFuZG9tU2FtcGxlXTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdrZXlTYW1wbGUnLCBrZXlTYW1wbGUpO1xuICAgICAgICAgICAgY29uc3QgZmlsZVJlZiA9IHRoaXMubG9hZGVyLmZpbGVzW2tleVNhbXBsZS5zYW1wbGVdO1xuICAgICAgICAgICAgY29uc3QgbmV3RmlsZSA9IHlpZWxkIHRoaXMubG9hZGVyLmdldEZpbGUoZmlsZVJlZiB8fCBrZXlTYW1wbGUuc2FtcGxlLCB0cnVlKTtcbiAgICAgICAgICAgIGNvbnN0IHNhbXBsZSA9IG5ldyBTYW1wbGVfMS5kZWZhdWx0KHRoaXMuY29udGV4dCwgbmV3RmlsZSA9PT0gbnVsbCB8fCBuZXdGaWxlID09PSB2b2lkIDAgPyB2b2lkIDAgOiBuZXdGaWxlLmNvbnRlbnRzLCBrZXlTYW1wbGUpO1xuICAgICAgICAgICAgc2FtcGxlLnNldFBsYXliYWNrUmF0ZShldmVudCk7XG4gICAgICAgICAgICBzYW1wbGUucGxheSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIC8vIHRoaXMuc2FtcGxlci5zdG9wKCk7XG4gICAgICAgIC8vIHRoaXMua2V5cyA9IFtdO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEF1ZGlvO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnJlcXVpcmUoXCIuL0VkaXRvci5zY3NzXCIpO1xuY29uc3QgY29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRcIik7XG5jb25zdCBmaWxlTG9hZGVyXzEgPSByZXF1aXJlKFwiLi4vdXRpbHMvZmlsZUxvYWRlclwiKTtcbmNsYXNzIEVkaXRvciBleHRlbmRzIGNvbXBvbmVudF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIoJ2VkaXRvcicpO1xuICAgICAgICBpZiAoIXdpbmRvdy5hY2UpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBY2UgZWRpdG9yIG5vdCBmb3VuZCwgYWRkIHRvIGEgPHNjcmlwdD4gdGFnLicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZmlsZUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZmlsZUVsLmNsYXNzTmFtZSA9ICdmaWxlTGlzdCc7XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZCh0aGlzLmZpbGVFbCk7XG4gICAgICAgIHRoaXMuYWNlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy5hY2VFbC5jbGFzc05hbWUgPSAnYWNlJztcbiAgICAgICAgaWYgKHdpbmRvdy5hY2UpIHtcbiAgICAgICAgICAgIHRoaXMuYWNlID0gd2luZG93LmFjZS5lZGl0KHRoaXMuYWNlRWwsIHtcbiAgICAgICAgICAgICAgICB0aGVtZTogJ2FjZS90aGVtZS9tb25va2FpJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZCh0aGlzLmFjZUVsKTtcbiAgICAgICAgaWYgKG9wdGlvbnMubG9hZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IG9wdGlvbnMubG9hZGVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIgPSBuZXcgZmlsZUxvYWRlcl8xLmRlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5yb290KVxuICAgICAgICAgICAgdGhpcy5sb2FkZXIuc2V0Um9vdChvcHRpb25zLnJvb3QpO1xuICAgICAgICBpZiAob3B0aW9ucy5kaXJlY3RvcnkpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyLmFkZERpcmVjdG9yeShvcHRpb25zLmRpcmVjdG9yeSk7XG4gICAgICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLmZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmxvYWRlci5hZGRGaWxlKG9wdGlvbnMuZmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNob3dGaWxlKGZpbGUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3dGaWxlKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGZpbGUgPSB5aWVsZCB0aGlzLmxvYWRlci5nZXRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgaWYgKCFmaWxlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGlmIChmaWxlLmV4dCA9PT0gJ3NmeicpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBTZnpNb2RlID0gcmVxdWlyZSgnLi4vbGliL21vZGUtc2Z6JykuTW9kZTtcbiAgICAgICAgICAgICAgICB0aGlzLmFjZS5zZXNzaW9uLnNldE1vZGUobmV3IFNmek1vZGUoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb25zdCBtb2RlbGlzdCA9IHdpbmRvdy5hY2UucmVxdWlyZSgnYWNlL2V4dC9tb2RlbGlzdCcpO1xuICAgICAgICAgICAgICAgIGlmICghbW9kZWxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFsZXJ0KCdBY2UgbW9kZWxpc3Qgbm90IGZvdW5kLCBhZGQgdG8gYSA8c2NyaXB0PiB0YWcuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnN0IG1vZGUgPSBtb2RlbGlzdC5nZXRNb2RlRm9yUGF0aChmaWxlLnBhdGgpLm1vZGU7XG4gICAgICAgICAgICAgICAgdGhpcy5hY2Uuc2Vzc2lvbi5zZXRNb2RlKG1vZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5hY2Uuc2V0T3B0aW9uKCd2YWx1ZScsIGZpbGUuY29udGVudHMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgY3JlYXRlVHJlZShyb290LCBmaWxlcywgZmlsZXNUcmVlKSB7XG4gICAgICAgIGNvbnN0IHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gZmlsZXNUcmVlKSB7XG4gICAgICAgICAgICBsZXQgZmlsZVBhdGggPSByb290ICsgJy8nICsga2V5O1xuICAgICAgICAgICAgaWYgKGZpbGVQYXRoLnN0YXJ0c1dpdGgoJy8nKSlcbiAgICAgICAgICAgICAgICBmaWxlUGF0aCA9IGZpbGVQYXRoLnNsaWNlKDEpO1xuICAgICAgICAgICAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgICAgICAgaWYgKE9iamVjdC5rZXlzKGZpbGVzVHJlZVtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGV0YWlscyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RldGFpbHMnKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzdW1tYXJ5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3VtbWFyeScpO1xuICAgICAgICAgICAgICAgIHN1bW1hcnkuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgICAgICAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoc3VtbWFyeSk7XG4gICAgICAgICAgICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVRyZWUoZmlsZVBhdGgsIGZpbGVzLCBmaWxlc1RyZWVba2V5XSkpO1xuICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgICAgICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLnNob3dGaWxlKGZpbGVzW2ZpbGVQYXRoXSk7XG4gICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bDtcbiAgICB9XG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLmZpbGVFbC5yZXBsYWNlQ2hpbGRyZW4oKTtcbiAgICAgICAgdGhpcy5maWxlRWwuaW5uZXJIVE1MID0gdGhpcy5sb2FkZXIucm9vdDtcbiAgICAgICAgY29uc3QgdWwgPSB0aGlzLmNyZWF0ZVRyZWUoJycsIHRoaXMubG9hZGVyLmZpbGVzLCB0aGlzLmxvYWRlci5maWxlc1RyZWUpO1xuICAgICAgICB1bC5jbGFzc05hbWUgPSAndHJlZSc7XG4gICAgICAgIHRoaXMuZmlsZUVsLmFwcGVuZENoaWxkKHVsKTtcbiAgICB9XG4gICAgcmVzZXQoKSB7XG4gICAgICAgIHRoaXMuZmlsZUVsLnJlcGxhY2VDaGlsZHJlbigpO1xuICAgICAgICB0aGlzLmFjZS5zZXRPcHRpb24oJ3ZhbHVlJywgJycpO1xuICAgIH1cbn1cbmV4cG9ydHMuZGVmYXVsdCA9IEVkaXRvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgZnVuY3Rpb24gYWRvcHQodmFsdWUpIHsgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgUCA/IHZhbHVlIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZSh2YWx1ZSk7IH0pOyB9XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5yZXF1aXJlKFwiLi9JbnRlcmZhY2Uuc2Nzc1wiKTtcbmNvbnN0IHhtbF9qc18xID0gcmVxdWlyZShcInhtbC1qc1wiKTtcbmNvbnN0IGNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50XCIpO1xuY29uc3QgaW50ZXJmYWNlXzEgPSByZXF1aXJlKFwiLi4vdHlwZXMvaW50ZXJmYWNlXCIpO1xuY29uc3QgZmlsZUxvYWRlcl8xID0gcmVxdWlyZShcIi4uL3V0aWxzL2ZpbGVMb2FkZXJcIik7XG5jbGFzcyBJbnRlcmZhY2UgZXh0ZW5kcyBjb21wb25lbnRfMS5kZWZhdWx0IHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKCdpbnRlcmZhY2UnKTtcbiAgICAgICAgdGhpcy53aWR0aCA9IDc3NTtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSAzMzA7XG4gICAgICAgIHRoaXMua2V5Ym9hcmRNYXAgPSB7fTtcbiAgICAgICAgdGhpcy5pbnN0cnVtZW50ID0ge307XG4gICAgICAgIHRoaXMudGFicyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB0aGlzLnRhYnMuY2xhc3NOYW1lID0gJ3RhYnMnO1xuICAgICAgICB0aGlzLmFkZFRhYignSW5mbycpO1xuICAgICAgICB0aGlzLmFkZFRhYignQ29udHJvbHMnKTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKHRoaXMudGFicyk7XG4gICAgICAgIHRoaXMuYWRkS2V5Ym9hcmQoKTtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMubG9hZGluZ1NjcmVlbi5jbGFzc05hbWUgPSAnbG9hZGluZ1NjcmVlbic7XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZCh0aGlzLmxvYWRpbmdTY3JlZW4pO1xuICAgICAgICBpZiAob3B0aW9ucy5sb2FkZXIpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZGVyID0gb3B0aW9ucy5sb2FkZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlciA9IG5ldyBmaWxlTG9hZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChvcHRpb25zLnJvb3QpXG4gICAgICAgICAgICB0aGlzLmxvYWRlci5zZXRSb290KG9wdGlvbnMucm9vdCk7XG4gICAgICAgIGlmIChvcHRpb25zLmRpcmVjdG9yeSlcbiAgICAgICAgICAgIHRoaXMubG9hZGVyLmFkZERpcmVjdG9yeShvcHRpb25zLmRpcmVjdG9yeSk7XG4gICAgICAgIGlmIChvcHRpb25zLmZpbGUpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmxvYWRlci5hZGRGaWxlKG9wdGlvbnMuZmlsZSk7XG4gICAgICAgICAgICB0aGlzLnNob3dGaWxlKGZpbGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNob3dGaWxlKGZpbGUpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGZpbGUgPSB5aWVsZCB0aGlzLmxvYWRlci5nZXRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgdGhpcy5pbnN0cnVtZW50ID0gdGhpcy5wYXJzZVhNTChmaWxlKTtcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIHRoaXMuc2V0dXBJbmZvKCk7XG4gICAgICAgIHRoaXMuc2V0dXBDb250cm9scygpO1xuICAgIH1cbiAgICB0b1BlcmNlbnRhZ2UodmFsMSwgdmFsMikge1xuICAgICAgICByZXR1cm4gTWF0aC5taW4oTnVtYmVyKHZhbDEpIC8gdmFsMiwgMSkgKiAxMDAgKyAnJSc7XG4gICAgfVxuICAgIHRvUmVsYXRpdmUoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbGVmdDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC54LCB0aGlzLndpZHRoKSxcbiAgICAgICAgICAgIHRvcDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC55LCB0aGlzLmhlaWdodCksXG4gICAgICAgICAgICB3aWR0aDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC53LCB0aGlzLndpZHRoKSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy50b1BlcmNlbnRhZ2UoZWxlbWVudC5oLCB0aGlzLmhlaWdodCksXG4gICAgICAgIH07XG4gICAgfVxuICAgIGFkZEltYWdlKGltYWdlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBjb25zdCByZWxhdGl2ZSA9IHRoaXMudG9SZWxhdGl2ZShpbWFnZSk7XG4gICAgICAgICAgICBjb25zdCBpbWcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoJ2RyYWdnYWJsZScsICdmYWxzZScpO1xuICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgbGVmdDogJHtyZWxhdGl2ZS5sZWZ0fTsgdG9wOiAke3JlbGF0aXZlLnRvcH07IHdpZHRoOiAke3JlbGF0aXZlLndpZHRofTsgaGVpZ2h0OiAke3JlbGF0aXZlLmhlaWdodH07YCk7XG4gICAgICAgICAgICB5aWVsZCB0aGlzLmFkZEltYWdlQXRyKGltZywgJ3NyYycsIGltYWdlLmltYWdlKTtcbiAgICAgICAgICAgIHJldHVybiBpbWc7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRJbWFnZUF0cihpbWcsIGF0dHJpYnV0ZSwgcGF0aCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKHRoaXMubG9hZGVyLnJvb3Quc3RhcnRzV2l0aCgnaHR0cCcpKSB7XG4gICAgICAgICAgICAgICAgaW1nLnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIHRoaXMubG9hZGVyLnJvb3QgKyAnR1VJLycgKyBwYXRoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmxvYWRlci5maWxlc1snR1VJLycgKyBwYXRoXTtcbiAgICAgICAgICAgICAgICBpZiAoZmlsZSAmJiAnaGFuZGxlJyBpbiBmaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGltZy5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUuaGFuZGxlKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgYWRkQ29udHJvbCh0eXBlLCBlbGVtZW50KSB7XG4gICAgICAgIGNvbnN0IHJlbGF0aXZlID0gdGhpcy50b1JlbGF0aXZlKGVsZW1lbnQpO1xuICAgICAgICBjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoYHdlYmF1ZGlvLSR7dHlwZX1gKTtcbiAgICAgICAgaWYgKCdpbWFnZScgaW4gZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuYWRkSW1hZ2VBdHIoZWwsICdzcmMnLCBlbGVtZW50LmltYWdlKTtcbiAgICAgICAgaWYgKCdpbWFnZV9iZycgaW4gZWxlbWVudClcbiAgICAgICAgICAgIHRoaXMuYWRkSW1hZ2VBdHIoZWwsICdzcmMnLCBlbGVtZW50LmltYWdlX2JnKTtcbiAgICAgICAgaWYgKCdpbWFnZV9oYW5kbGUnIGluIGVsZW1lbnQpXG4gICAgICAgICAgICB0aGlzLmFkZEltYWdlQXRyKGVsLCAna25vYnNyYycsIGVsZW1lbnQuaW1hZ2VfaGFuZGxlKTtcbiAgICAgICAgaWYgKCdmcmFtZXMnIGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgndmFsdWUnLCAnMCcpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdtYXgnLCBOdW1iZXIoZWxlbWVudC5mcmFtZXMpIC0gMSk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3N0ZXAnLCAnMScpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdzcHJpdGVzJywgTnVtYmVyKGVsZW1lbnQuZnJhbWVzKSAtIDEpO1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKCd0b29sdGlwJywgJyVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCdvcmllbnRhdGlvbicgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgZGlyID0gZWxlbWVudC5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJyA/ICd2ZXJ0JyA6ICdob3J6JztcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnZGlyZWN0aW9uJywgZGlyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoJ3gnIGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBgbGVmdDogJHtyZWxhdGl2ZS5sZWZ0fTsgdG9wOiAke3JlbGF0aXZlLnRvcH07YCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCd3JyBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsIGVsZW1lbnQuaCk7XG4gICAgICAgICAgICBlbC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgZWxlbWVudC53KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfVxuICAgIGFkZEtleWJvYXJkKCkge1xuICAgICAgICBjb25zdCBrZXlib2FyZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3dlYmF1ZGlvLWtleWJvYXJkJyk7XG4gICAgICAgIGtleWJvYXJkLnNldEF0dHJpYnV0ZSgna2V5cycsICc4OCcpO1xuICAgICAgICBrZXlib2FyZC5zZXRBdHRyaWJ1dGUoJ2hlaWdodCcsICc3MCcpO1xuICAgICAgICBrZXlib2FyZC5zZXRBdHRyaWJ1dGUoJ3dpZHRoJywgJzc3NScpO1xuICAgICAgICBrZXlib2FyZC5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xFdmVudCA9IHtcbiAgICAgICAgICAgICAgICBjaGFubmVsOiAxLFxuICAgICAgICAgICAgICAgIG5vdGU6IGV2ZW50Lm5vdGVbMV0sXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IGV2ZW50Lm5vdGVbMF0gPyAxMDAgOiAwLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudCgnY2hhbmdlJywgY29udHJvbEV2ZW50KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZChrZXlib2FyZCk7XG4gICAgICAgIHRoaXMua2V5Ym9hcmQgPSBrZXlib2FyZDtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMucmVzaXplS2V5Ym9hcmQoKSk7XG4gICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHRoaXMucmVzaXplS2V5Ym9hcmQoKSk7XG4gICAgfVxuICAgIHJlc2l6ZUtleWJvYXJkKCkge1xuICAgICAgICBjb25zdCBrZXlib2FyZE1hcEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmtleWJvYXJkTWFwKTtcbiAgICAgICAgY29uc3Qga2V5U3RhcnQgPSBOdW1iZXIoa2V5Ym9hcmRNYXBLZXlzWzBdKTtcbiAgICAgICAgY29uc3Qga2V5RW5kID0gTnVtYmVyKGtleWJvYXJkTWFwS2V5c1trZXlib2FyZE1hcEtleXMubGVuZ3RoIC0gMV0pO1xuICAgICAgICBjb25zdCBrZXlzRml0ID0gTWF0aC5mbG9vcih0aGlzLmdldEVsKCkuY2xpZW50V2lkdGggLyAxMyk7XG4gICAgICAgIGNvbnN0IGtleXNSYW5nZSA9IGtleUVuZCAtIGtleVN0YXJ0O1xuICAgICAgICBjb25zdCBrZXlzRGlmZiA9IE1hdGguZmxvb3Ioa2V5c0ZpdCAvIDIgLSBrZXlzUmFuZ2UgLyAyKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZC5taW4gPSBNYXRoLm1heChrZXlTdGFydCAtIGtleXNEaWZmLCAwKTtcbiAgICAgICAgdGhpcy5rZXlib2FyZC5rZXlzID0ga2V5c0ZpdDtcbiAgICAgICAgdGhpcy5rZXlib2FyZC53aWR0aCA9IHRoaXMuZ2V0RWwoKS5jbGllbnRXaWR0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyMDA7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5rZXlib2FyZC5zZXRkaXNhYmxlZHZhbHVlcyghdGhpcy5rZXlib2FyZE1hcFtpXSwgTnVtYmVyKGkpKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmtleWJvYXJkLnJlZHJhdygpO1xuICAgIH1cbiAgICBzZXRLZXlib2FyZChldmVudCkge1xuICAgICAgICB0aGlzLmtleWJvYXJkLnNldE5vdGUoZXZlbnQudmVsb2NpdHksIGV2ZW50Lm5vdGUpO1xuICAgIH1cbiAgICBzZXRMb2FkaW5nU3RhdGUobG9hZGluZykge1xuICAgICAgICBpZiAobG9hZGluZylcbiAgICAgICAgICAgIHRoaXMuZ2V0RWwoKS5jbGFzc0xpc3QuYWRkKCdsb2FkaW5nJyk7XG4gICAgICAgIGVsc2VcbiAgICAgICAgICAgIHRoaXMuZ2V0RWwoKS5jbGFzc0xpc3QucmVtb3ZlKCdsb2FkaW5nJyk7XG4gICAgfVxuICAgIHNldEtleWJvYXJkTWFwKG1hcCkge1xuICAgICAgICB0aGlzLmtleWJvYXJkTWFwID0gbWFwO1xuICAgICAgICB0aGlzLnJlc2l6ZUtleWJvYXJkKCk7XG4gICAgfVxuICAgIHNldExvYWRpbmdUZXh0KHRleHQpIHtcbiAgICAgICAgdGhpcy5sb2FkaW5nU2NyZWVuLmlubmVySFRNTCA9IHRleHQ7XG4gICAgfVxuICAgIGFkZFRhYihuYW1lKSB7XG4gICAgICAgIGNvbnN0IGlucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgaW5wdXQuY2xhc3NOYW1lID0gJ3JhZGlvdGFiJztcbiAgICAgICAgaWYgKG5hbWUgPT09ICdJbmZvJylcbiAgICAgICAgICAgIGlucHV0LnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdjaGVja2VkJyk7XG4gICAgICAgIGlucHV0LnR5cGUgPSAncmFkaW8nO1xuICAgICAgICBpbnB1dC5pZCA9IG5hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaW5wdXQubmFtZSA9ICd0YWJzJztcbiAgICAgICAgdGhpcy50YWJzLmFwcGVuZENoaWxkKGlucHV0KTtcbiAgICAgICAgY29uc3QgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsYWJlbCcpO1xuICAgICAgICBsYWJlbC5jbGFzc05hbWUgPSAnbGFiZWwnO1xuICAgICAgICBsYWJlbC5zZXRBdHRyaWJ1dGUoJ2ZvcicsIG5hbWUudG9Mb3dlckNhc2UoKSk7XG4gICAgICAgIGxhYmVsLmlubmVySFRNTCA9IG5hbWU7XG4gICAgICAgIHRoaXMudGFicy5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuY2xhc3NOYW1lID0gJ3BhbmVsJztcbiAgICAgICAgdGhpcy50YWJzLmFwcGVuZENoaWxkKGRpdik7XG4gICAgfVxuICAgIGFkZFRleHQodGV4dCkge1xuICAgICAgICBjb25zdCByZWxhdGl2ZSA9IHRoaXMudG9SZWxhdGl2ZSh0ZXh0KTtcbiAgICAgICAgY29uc3Qgc3BhbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICAgICAgc3Bhbi5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYGxlZnQ6ICR7cmVsYXRpdmUubGVmdH07IHRvcDogJHtyZWxhdGl2ZS50b3B9OyB3aWR0aDogJHtyZWxhdGl2ZS53aWR0aH07IGhlaWdodDogJHtyZWxhdGl2ZS5oZWlnaHR9OyBjb2xvcjogJHt0ZXh0LmNvbG9yX3RleHR9O2ApO1xuICAgICAgICBzcGFuLmlubmVySFRNTCA9IHRleHQudGV4dDtcbiAgICAgICAgcmV0dXJuIHNwYW47XG4gICAgfVxuICAgIHBhcnNlWE1MKGZpbGUpIHtcbiAgICAgICAgaWYgKCFmaWxlKVxuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICBjb25zdCBmaWxlUGFyc2VkID0gKDAsIHhtbF9qc18xLnhtbDJqcykoZmlsZS5jb250ZW50cyk7XG4gICAgICAgIHJldHVybiB0aGlzLmZpbmRFbGVtZW50cyh7fSwgZmlsZVBhcnNlZC5lbGVtZW50cyk7XG4gICAgfVxuICAgIHJlc2V0KHRpdGxlKSB7XG4gICAgICAgIGNvbnN0IHBhbmVscyA9IHRoaXMudGFicy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYW5lbCcpO1xuICAgICAgICBmb3IgKGNvbnN0IHBhbmVsIG9mIHBhbmVscykge1xuICAgICAgICAgICAgcGFuZWwucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgaW5mbyA9IHRoaXMudGFicy5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdwYW5lbCcpWzBdO1xuICAgICAgICBjb25zdCBzcGFuID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICBzcGFuLmNsYXNzTmFtZSA9ICdkZWZhdWx0LXRpdGxlJztcbiAgICAgICAgc3Bhbi5pbm5lckhUTUwgPSB0aXRsZSB8fCAnc2Z6IGluc3RydW1lbnQnO1xuICAgICAgICBpbmZvLmFwcGVuZENoaWxkKHNwYW4pO1xuICAgIH1cbiAgICBzZXR1cEluZm8oKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuaW5zdHJ1bWVudC5BcmlhR1VJKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSB0aGlzLnRhYnMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFuZWwnKVswXTtcbiAgICAgICAgICAgIGluZm8ucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlID0geWllbGQgdGhpcy5sb2FkZXIuZ2V0RmlsZSh0aGlzLmxvYWRlci5yb290ICsgdGhpcy5pbnN0cnVtZW50LkFyaWFHVUlbMF0ucGF0aCk7XG4gICAgICAgICAgICBjb25zdCBmaWxlWG1sID0geWllbGQgdGhpcy5wYXJzZVhNTChmaWxlKTtcbiAgICAgICAgICAgIGluZm8uYXBwZW5kQ2hpbGQoeWllbGQgdGhpcy5hZGRJbWFnZShmaWxlWG1sLlN0YXRpY0ltYWdlWzBdKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXR1cENvbnRyb2xzKCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLmluc3RydW1lbnQuQXJpYVByb2dyYW0pXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgY29uc3QgY29udHJvbHMgPSB0aGlzLnRhYnMuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgncGFuZWwnKVsxXTtcbiAgICAgICAgICAgIGNvbnRyb2xzLnJlcGxhY2VDaGlsZHJlbigpO1xuICAgICAgICAgICAgY29uc3QgZmlsZSA9IHlpZWxkIHRoaXMubG9hZGVyLmdldEZpbGUodGhpcy5sb2FkZXIucm9vdCArIHRoaXMuaW5zdHJ1bWVudC5BcmlhUHJvZ3JhbVswXS5ndWkpO1xuICAgICAgICAgICAgY29uc3QgZmlsZVhtbCA9IHlpZWxkIHRoaXMucGFyc2VYTUwoZmlsZSk7XG4gICAgICAgICAgICBpZiAoZmlsZVhtbC5Lbm9iKVxuICAgICAgICAgICAgICAgIGZpbGVYbWwuS25vYi5mb3JFYWNoKChrbm9iKSA9PiBjb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmFkZENvbnRyb2woaW50ZXJmYWNlXzEuUGxheWVyRWxlbWVudHMuS25vYiwga25vYikpKTtcbiAgICAgICAgICAgIGlmIChmaWxlWG1sLk9uT2ZmQnV0dG9uKVxuICAgICAgICAgICAgICAgIGZpbGVYbWwuT25PZmZCdXR0b24uZm9yRWFjaCgoYnV0dG9uKSA9PiBjb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmFkZENvbnRyb2woaW50ZXJmYWNlXzEuUGxheWVyRWxlbWVudHMuU3dpdGNoLCBidXR0b24pKSk7XG4gICAgICAgICAgICBpZiAoZmlsZVhtbC5TbGlkZXIpXG4gICAgICAgICAgICAgICAgZmlsZVhtbC5TbGlkZXIuZm9yRWFjaCgoc2xpZGVyKSA9PiBjb250cm9scy5hcHBlbmRDaGlsZCh0aGlzLmFkZENvbnRyb2woaW50ZXJmYWNlXzEuUGxheWVyRWxlbWVudHMuU2xpZGVyLCBzbGlkZXIpKSk7XG4gICAgICAgICAgICBpZiAoZmlsZVhtbC5TdGF0aWNJbWFnZSlcbiAgICAgICAgICAgICAgICBmaWxlWG1sLlN0YXRpY0ltYWdlLmZvckVhY2goKGltYWdlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7IHJldHVybiBjb250cm9scy5hcHBlbmRDaGlsZCh5aWVsZCB0aGlzLmFkZEltYWdlKGltYWdlKSk7IH0pKTtcbiAgICAgICAgICAgIGlmIChmaWxlWG1sLlN0YXRpY1RleHQpXG4gICAgICAgICAgICAgICAgZmlsZVhtbC5TdGF0aWNUZXh0LmZvckVhY2goKHRleHQpID0+IGNvbnRyb2xzLmFwcGVuZENoaWxkKHRoaXMuYWRkVGV4dCh0ZXh0KSkpO1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHRoaXMucmVzaXplQ29udHJvbHMoKSk7XG4gICAgICAgICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB0aGlzLnJlc2l6ZUNvbnRyb2xzKCkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmVzaXplQ29udHJvbHMoKSB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gTWF0aC5mbG9vcih0aGlzLmdldEVsKCkuY2xpZW50V2lkdGggLyAyNSk7XG4gICAgICAgIGNvbnN0IHNsaWRlcldpZHRoID0gTWF0aC5mbG9vcih0aGlzLmdldEVsKCkuY2xpZW50V2lkdGggLyA2NSk7XG4gICAgICAgIGNvbnN0IHNsaWRlckhlaWdodCA9IE1hdGguZmxvb3IodGhpcy5nZXRFbCgpLmNsaWVudEhlaWdodCAvIDMuNSk7XG4gICAgICAgIGNvbnN0IGNvbnRyb2xzID0gdGhpcy50YWJzLmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3BhbmVsJylbMV07XG4gICAgICAgIGNvbnRyb2xzLmNoaWxkTm9kZXMuZm9yRWFjaCgoY29udHJvbCkgPT4ge1xuICAgICAgICAgICAgaWYgKGNvbnRyb2wubm9kZU5hbWUgPT09ICdXRUJBVURJTy1LTk9CJyB8fCBjb250cm9sLm5vZGVOYW1lID09PSAnV0VCQVVESU8tU1dJVENIJykge1xuICAgICAgICAgICAgICAgIGNvbnRyb2wud2lkdGggPSBjb250cm9sLmhlaWdodCA9IHdpZHRoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoY29udHJvbC5ub2RlTmFtZSA9PT0gJ1dFQkFVRElPLVNMSURFUicpIHtcbiAgICAgICAgICAgICAgICBjb250cm9sLndpZHRoID0gc2xpZGVyV2lkdGg7XG4gICAgICAgICAgICAgICAgY29udHJvbC5oZWlnaHQgPSBzbGlkZXJIZWlnaHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmaW5kRWxlbWVudHMobGlzdCwgbm9kZXMpIHtcbiAgICAgICAgbm9kZXMuZm9yRWFjaCgobm9kZSkgPT4ge1xuICAgICAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ2VsZW1lbnQnKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFsaXN0W25vZGUubmFtZV0pXG4gICAgICAgICAgICAgICAgICAgIGxpc3Rbbm9kZS5uYW1lXSA9IFtdO1xuICAgICAgICAgICAgICAgIGxpc3Rbbm9kZS5uYW1lXS5wdXNoKG5vZGUuYXR0cmlidXRlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAobm9kZS5lbGVtZW50cykge1xuICAgICAgICAgICAgICAgIHRoaXMuZmluZEVsZW1lbnRzKGxpc3QsIG5vZGUuZWxlbWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gSW50ZXJmYWNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICBmdW5jdGlvbiBhZG9wdCh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBQID8gdmFsdWUgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHZhbHVlKTsgfSk7IH1cbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBhZG9wdChyZXN1bHQudmFsdWUpLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNvbnN0IGNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50XCIpO1xuY29uc3QgRWRpdG9yXzEgPSByZXF1aXJlKFwiLi9FZGl0b3JcIik7XG5jb25zdCBJbnRlcmZhY2VfMSA9IHJlcXVpcmUoXCIuL0ludGVyZmFjZVwiKTtcbnJlcXVpcmUoXCIuL1BsYXllci5zY3NzXCIpO1xuY29uc3QgYnJvd3Nlcl9mc19hY2Nlc3NfMSA9IHJlcXVpcmUoXCJicm93c2VyLWZzLWFjY2Vzc1wiKTtcbmNvbnN0IGZpbGVMb2FkZXJfMSA9IHJlcXVpcmUoXCIuLi91dGlscy9maWxlTG9hZGVyXCIpO1xuY29uc3QgQXVkaW9fMSA9IHJlcXVpcmUoXCIuL0F1ZGlvXCIpO1xuY29uc3QgdXRpbHNfMSA9IHJlcXVpcmUoXCJAc2Z6LXRvb2xzL2NvcmUvZGlzdC91dGlsc1wiKTtcbmNvbnN0IGFwaV8xID0gcmVxdWlyZShcIkBzZnotdG9vbHMvY29yZS9kaXN0L2FwaVwiKTtcbmNsYXNzIFBsYXllciBleHRlbmRzIGNvbXBvbmVudF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKGlkLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfYTtcbiAgICAgICAgc3VwZXIoJ3BsYXllcicpO1xuICAgICAgICB0aGlzLmxvYWRlciA9IG5ldyBmaWxlTG9hZGVyXzEuZGVmYXVsdCgpO1xuICAgICAgICBpZiAob3B0aW9ucy5hdWRpbylcbiAgICAgICAgICAgIHRoaXMuc2V0dXBBdWRpbyhvcHRpb25zLmF1ZGlvKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuaGVhZGVyKVxuICAgICAgICAgICAgdGhpcy5zZXR1cEhlYWRlcihvcHRpb25zLmhlYWRlcik7XG4gICAgICAgIGlmIChvcHRpb25zLmludGVyZmFjZSlcbiAgICAgICAgICAgIHRoaXMuc2V0dXBJbnRlcmZhY2Uob3B0aW9ucy5pbnRlcmZhY2UpO1xuICAgICAgICBpZiAob3B0aW9ucy5lZGl0b3IpXG4gICAgICAgICAgICB0aGlzLnNldHVwRWRpdG9yKG9wdGlvbnMuZWRpdG9yKTtcbiAgICAgICAgKF9hID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoaWQpKSA9PT0gbnVsbCB8fCBfYSA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2EuYXBwZW5kQ2hpbGQodGhpcy5nZXRFbCgpKTtcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5zdHJ1bWVudCkge1xuICAgICAgICAgICAgdGhpcy5sb2FkUmVtb3RlSW5zdHJ1bWVudChvcHRpb25zLmluc3RydW1lbnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHNldHVwQXVkaW8ob3B0aW9ucykge1xuICAgICAgICBvcHRpb25zLmxvYWRlciA9IHRoaXMubG9hZGVyO1xuICAgICAgICB0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvXzEuZGVmYXVsdChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5hdWRpby5hZGRFdmVudCgnY2hhbmdlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmZhY2UpXG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmZhY2Uuc2V0S2V5Ym9hcmQoZXZlbnQuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmF1ZGlvLmFkZEV2ZW50KCdrZXlib2FyZE1hcCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJmYWNlKVxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLnNldEtleWJvYXJkTWFwKGV2ZW50LmRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5hdWRpby5hZGRFdmVudCgncHJlbG9hZCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJmYWNlKVxuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLnNldExvYWRpbmdUZXh0KGV2ZW50LmRhdGEuc3RhdHVzKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuYXVkaW8uYWRkRXZlbnQoJ2xvYWRpbmcnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyZmFjZSlcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyZmFjZS5zZXRMb2FkaW5nU3RhdGUoZXZlbnQuZGF0YSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXR1cEludGVyZmFjZShvcHRpb25zKSB7XG4gICAgICAgIG9wdGlvbnMubG9hZGVyID0gdGhpcy5sb2FkZXI7XG4gICAgICAgIHRoaXMuaW50ZXJmYWNlID0gbmV3IEludGVyZmFjZV8xLmRlZmF1bHQob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuaW50ZXJmYWNlLmFkZEV2ZW50KCdjaGFuZ2UnLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmF1ZGlvKVxuICAgICAgICAgICAgICAgIHRoaXMuYXVkaW8udXBkYXRlKGV2ZW50LmRhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKHRoaXMuaW50ZXJmYWNlLmdldEVsKCkpO1xuICAgICAgICB0aGlzLmludGVyZmFjZS5zZXRMb2FkaW5nU3RhdGUodHJ1ZSk7XG4gICAgfVxuICAgIHNldHVwRWRpdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgb3B0aW9ucy5sb2FkZXIgPSB0aGlzLmxvYWRlcjtcbiAgICAgICAgdGhpcy5lZGl0b3IgPSBuZXcgRWRpdG9yXzEuZGVmYXVsdChvcHRpb25zKTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKHRoaXMuZWRpdG9yLmdldEVsKCkpO1xuICAgIH1cbiAgICBzZXR1cEhlYWRlcihvcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkaXYuY2xhc3NOYW1lID0gJ2hlYWRlcic7XG4gICAgICAgIGlmIChvcHRpb25zLmxvY2FsKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dExvY2FsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICAgICAgICAgIGlucHV0TG9jYWwudHlwZSA9ICdidXR0b24nO1xuICAgICAgICAgICAgaW5wdXRMb2NhbC52YWx1ZSA9ICdMb2NhbCBkaXJlY3RvcnknO1xuICAgICAgICAgICAgaW5wdXRMb2NhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICAgICAgeWllbGQgdGhpcy5sb2FkTG9jYWxJbnN0cnVtZW50KCk7XG4gICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICBkaXYuYXBwZW5kQ2hpbGQoaW5wdXRMb2NhbCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMucmVtb3RlKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dFJlbW90ZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICAgICAgICBpbnB1dFJlbW90ZS50eXBlID0gJ2J1dHRvbic7XG4gICAgICAgICAgICBpbnB1dFJlbW90ZS52YWx1ZSA9ICdSZW1vdGUgZGlyZWN0b3J5JztcbiAgICAgICAgICAgIGlucHV0UmVtb3RlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBpZCA9IHdpbmRvdy5wcm9tcHQoJ0VudGVyIGEgR2l0SHViIG93bmVyL3JlcG8nLCAnc3R1ZGlvcmFjay9ibGFjay1hbmQtZ3JlZW4tZ3VpdGFycycpO1xuICAgICAgICAgICAgICAgIGlmIChpZClcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5sb2FkUmVtb3RlSW5zdHJ1bWVudCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmFuY2g6ICdjb21wYWN0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogJ0N1c3RvbScsXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgZGl2LmFwcGVuZENoaWxkKGlucHV0UmVtb3RlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5wcmVzZXRzKSB7XG4gICAgICAgICAgICBjb25zdCBpbnB1dFByZXNldHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICAgICAgICAgIG9wdGlvbnMucHJlc2V0cy5mb3JFYWNoKChwcmVzZXQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBpbnB1dE9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgICAgIGlucHV0T3B0aW9uLmlubmVySFRNTCA9IHByZXNldC5uYW1lO1xuICAgICAgICAgICAgICAgIGlmIChwcmVzZXQuc2VsZWN0ZWQpXG4gICAgICAgICAgICAgICAgICAgIGlucHV0T3B0aW9uLnNlbGVjdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpbnB1dFByZXNldHMuYXBwZW5kQ2hpbGQoaW5wdXRPcHRpb24pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBpbnB1dFByZXNldHMuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBwcmVzZXQgPSBvcHRpb25zLnByZXNldHNbaW5wdXRQcmVzZXRzLnNlbGVjdGVkSW5kZXhdO1xuICAgICAgICAgICAgICAgIHlpZWxkIHRoaXMubG9hZFJlbW90ZUluc3RydW1lbnQocHJlc2V0KTtcbiAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgIGRpdi5hcHBlbmRDaGlsZChpbnB1dFByZXNldHMpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH1cbiAgICBsb2FkTG9jYWxJbnN0cnVtZW50KCkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBjb25zdCBibG9icyA9ICh5aWVsZCAoMCwgYnJvd3Nlcl9mc19hY2Nlc3NfMS5kaXJlY3RvcnlPcGVuKSh7XG4gICAgICAgICAgICAgICAgICAgIHJlY3Vyc2l2ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7YmxvYnMubGVuZ3RofSBmaWxlcyBzZWxlY3RlZC5gKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWREaXJlY3RvcnkoKDAsIHV0aWxzXzEucGF0aEdldFJvb3QpKGJsb2JzWzBdLndlYmtpdFJlbGF0aXZlUGF0aCksIGJsb2JzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyLm5hbWUgIT09ICdBYm9ydEVycm9yJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnVGhlIHVzZXIgYWJvcnRlZCBhIHJlcXVlc3QuJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsb2FkUmVtb3RlSW5zdHJ1bWVudChwcmVzZXQpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgICAgIGNvbnN0IGJyYW5jaCA9IHByZXNldC5icmFuY2ggfHwgJ2NvbXBhY3QnO1xuICAgICAgICAgICAgY29uc3QgcmVzcG9uc2UgPSB5aWVsZCAoMCwgYXBpXzEuYXBpSnNvbikoYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vcmVwb3MvJHtwcmVzZXQuaWR9L2dpdC90cmVlcy8ke2JyYW5jaH0/cmVjdXJzaXZlPTFgKTtcbiAgICAgICAgICAgIGNvbnN0IHBhdGhzID0gcmVzcG9uc2UudHJlZS5tYXAoKGZpbGUpID0+IGBodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vJHtwcmVzZXQuaWR9LyR7YnJhbmNofS8ke2ZpbGUucGF0aH1gKTtcbiAgICAgICAgICAgIHlpZWxkIHRoaXMubG9hZERpcmVjdG9yeShgaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tLyR7cHJlc2V0LmlkfS8ke2JyYW5jaH0vYCwgcGF0aHMpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgbG9hZERpcmVjdG9yeShyb290LCBmaWxlcykge1xuICAgICAgICB2YXIgX2E7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBsZXQgYXVkaW9GaWxlO1xuICAgICAgICAgICAgbGV0IGF1ZGlvRmlsZURlcHRoID0gMTAwMDtcbiAgICAgICAgICAgIGxldCBhdWRpb0ZpbGVKc29uO1xuICAgICAgICAgICAgbGV0IGF1ZGlvRmlsZUpzb25EZXB0aCA9IDEwMDA7XG4gICAgICAgICAgICBsZXQgaW50ZXJmYWNlRmlsZTtcbiAgICAgICAgICAgIGxldCBpbnRlcmZhY2VGaWxlRGVwdGggPSAxMDAwO1xuICAgICAgICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZpbGVzKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgcGF0aCA9IHR5cGVvZiBmaWxlID09PSAnc3RyaW5nJyA/IGZpbGUgOiBmaWxlLndlYmtpdFJlbGF0aXZlUGF0aDtcbiAgICAgICAgICAgICAgICBjb25zdCBkZXB0aCA9ICgoX2EgPSBwYXRoLm1hdGNoKC9cXC8vZykpID09PSBudWxsIHx8IF9hID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfYS5sZW5ndGgpIHx8IDA7XG4gICAgICAgICAgICAgICAgaWYgKCgwLCB1dGlsc18xLnBhdGhHZXRFeHQpKHBhdGgpID09PSAnc2Z6JyAmJiBkZXB0aCA8IGF1ZGlvRmlsZURlcHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvRmlsZSA9IGZpbGU7XG4gICAgICAgICAgICAgICAgICAgIGF1ZGlvRmlsZURlcHRoID0gZGVwdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChwYXRoLmVuZHNXaXRoKCcuc2Z6Lmpzb24nKSAmJiBkZXB0aCA8IGF1ZGlvRmlsZUpzb25EZXB0aCkge1xuICAgICAgICAgICAgICAgICAgICBhdWRpb0ZpbGVKc29uID0gZmlsZTtcbiAgICAgICAgICAgICAgICAgICAgYXVkaW9GaWxlSnNvbkRlcHRoID0gZGVwdGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICgoMCwgdXRpbHNfMS5wYXRoR2V0RXh0KShwYXRoKSA9PT0gJ3htbCcgJiYgZGVwdGggPCBpbnRlcmZhY2VGaWxlRGVwdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaW50ZXJmYWNlRmlsZSA9IGZpbGU7XG4gICAgICAgICAgICAgICAgICAgIGludGVyZmFjZUZpbGVEZXB0aCA9IGRlcHRoO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdhdWRpb0ZpbGUnLCBhdWRpb0ZpbGUpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2F1ZGlvRmlsZUpzb24nLCBhdWRpb0ZpbGVKc29uKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdpbnRlcmZhY2VGaWxlJywgaW50ZXJmYWNlRmlsZSk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlci5yZXNldEZpbGVzKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRlci5zZXRSb290KHJvb3QpO1xuICAgICAgICAgICAgdGhpcy5sb2FkZXIuYWRkRGlyZWN0b3J5KGZpbGVzKTtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyZmFjZSkge1xuICAgICAgICAgICAgICAgIGlmIChpbnRlcmZhY2VGaWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGUgPSB0aGlzLmludGVyZmFjZS5sb2FkZXIuYWRkRmlsZShpbnRlcmZhY2VGaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgeWllbGQgdGhpcy5pbnRlcmZhY2Uuc2hvd0ZpbGUoZmlsZSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJmYWNlLnJlbmRlcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnRlcmZhY2UucmVzZXQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3IpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkZWZhdWx0RmlsZSA9IGF1ZGlvRmlsZSB8fCBpbnRlcmZhY2VGaWxlO1xuICAgICAgICAgICAgICAgIGlmIChkZWZhdWx0RmlsZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxlID0gdGhpcy5lZGl0b3IubG9hZGVyLmFkZEZpbGUoZGVmYXVsdEZpbGUpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmVkaXRvci5zaG93RmlsZShmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lZGl0b3IucmVuZGVyKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVkaXRvci5yZXNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmF1ZGlvKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgYXVkaW9GaWxlUHJpb3JpdHkgPSBhdWRpb0ZpbGVKc29uIHx8IGF1ZGlvRmlsZTtcbiAgICAgICAgICAgICAgICBpZiAoYXVkaW9GaWxlUHJpb3JpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsZSA9IHRoaXMuYXVkaW8ubG9hZGVyLmFkZEZpbGUoYXVkaW9GaWxlUHJpb3JpdHkpO1xuICAgICAgICAgICAgICAgICAgICB5aWVsZCB0aGlzLmF1ZGlvLnNob3dGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hdWRpby5yZXNldCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gUGxheWVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jbGFzcyBTYW1wbGUge1xuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQsIGJ1ZmZlciwgcmVnaW9uKSB7XG4gICAgICAgIHRoaXMuc2FtcGxlUmF0ZSA9IDQ4MDAwO1xuICAgICAgICB0aGlzLnNhbXBsZURlZmF1bHRzID0ge1xuICAgICAgICAgICAgYmVuZF9kb3duOiAtMjAwLFxuICAgICAgICAgICAgYmVuZF91cDogMjAwLFxuICAgICAgICAgICAgcGl0Y2hfa2V5Y2VudGVyOiAwLFxuICAgICAgICAgICAgcGl0Y2hfa2V5dHJhY2s6IDAsXG4gICAgICAgICAgICB0dW5lOiAwLFxuICAgICAgICAgICAgdHJhbnNwb3NlOiAwLFxuICAgICAgICAgICAgdmVsb2NpdHk6IDAsXG4gICAgICAgICAgICB2ZWx0cmFjazogMCxcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgdGhpcy5yZWdpb24gPSBPYmplY3QuYXNzaWduKHt9LCB0aGlzLnNhbXBsZURlZmF1bHRzLCByZWdpb24pO1xuICAgICAgICB0aGlzLnNvdXJjZSA9IHRoaXMuY29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgICAgdGhpcy5zb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgICB0aGlzLnNvdXJjZS5jb25uZWN0KHRoaXMuY29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgfVxuICAgIGdldENlbnRzKG5vdGUsIGJlbmQpIHtcbiAgICAgICAgY29uc3QgcGl0Y2ggPSAobm90ZSAtIHRoaXMucmVnaW9uLnBpdGNoX2tleWNlbnRlcikgKiB0aGlzLnJlZ2lvbi5waXRjaF9rZXl0cmFjayArIHRoaXMucmVnaW9uLnR1bmU7XG4gICAgICAgIGxldCBjZW50cyA9IHBpdGNoICsgKHRoaXMucmVnaW9uLnZlbHRyYWNrICogdGhpcy5yZWdpb24udmVsb2NpdHkpIC8gMTI3O1xuICAgICAgICBpZiAoYmVuZCA8IDApIHtcbiAgICAgICAgICAgIGNlbnRzICs9ICgtODE5MiAqIGJlbmQpIC8gdGhpcy5yZWdpb24uYmVuZF9kb3duO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY2VudHMgKz0gKDgxOTIgKiBiZW5kKSAvIHRoaXMucmVnaW9uLmJlbmRfdXA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgucG93KE1hdGgucG93KDIsIDEgLyAxMjAwKSwgY2VudHMpO1xuICAgIH1cbiAgICBwaXRjaFRvRnJlcShwaXRjaCkge1xuICAgICAgICByZXR1cm4gTWF0aC5wb3coMiwgKHBpdGNoIC0gNjkpIC8gMTIuMCkgKiA0NDA7XG4gICAgfVxuICAgIHNldFBsYXliYWNrUmF0ZShldmVudCwgYmVuZCA9IDApIHtcbiAgICAgICAgaWYgKCF0aGlzLnJlZ2lvbi5waXRjaF9rZXljZW50ZXIpXG4gICAgICAgICAgICB0aGlzLnJlZ2lvbi5waXRjaF9rZXljZW50ZXIgPSBldmVudC5ub3RlO1xuICAgICAgICBjb25zdCBjZW50cyA9IHRoaXMuZ2V0Q2VudHMoZXZlbnQubm90ZSwgYmVuZCk7XG4gICAgICAgIGNvbnN0IGZyZXF1ZW5jeSA9IHRoaXMucGl0Y2hUb0ZyZXEoZXZlbnQubm90ZSArIHRoaXMucmVnaW9uLnRyYW5zcG9zZSkgKiBjZW50cztcbiAgICAgICAgY29uc3QgcmF0ZSA9IGZyZXF1ZW5jeSAvIHRoaXMucGl0Y2hUb0ZyZXEodGhpcy5yZWdpb24ucGl0Y2hfa2V5Y2VudGVyKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3BsYXliYWNrUmF0ZScsIHJhdGUpO1xuICAgICAgICB0aGlzLnNvdXJjZS5wbGF5YmFja1JhdGUudmFsdWUgPSByYXRlO1xuICAgIH1cbiAgICBwbGF5KCkge1xuICAgICAgICBpZiAodGhpcy5yZWdpb24ub2Zmc2V0ICYmIHRoaXMucmVnaW9uLmVuZCkge1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gTnVtYmVyKHRoaXMucmVnaW9uLm9mZnNldCkgLyB0aGlzLnNhbXBsZVJhdGU7XG4gICAgICAgICAgICBjb25zdCBlbmQgPSBOdW1iZXIodGhpcy5yZWdpb24uZW5kKSAvIHRoaXMuc2FtcGxlUmF0ZTtcbiAgICAgICAgICAgIGNvbnN0IGR1cmF0aW9uID0gZW5kIC0gb2Zmc2V0O1xuICAgICAgICAgICAgdGhpcy5zb3VyY2Uuc3RhcnQoMCwgb2Zmc2V0LCBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNvdXJjZS5zdGFydCgwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLnNvdXJjZS5zdG9wKCk7XG4gICAgfVxufVxuZXhwb3J0cy5kZWZhdWx0ID0gU2FtcGxlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5jb25zdCBldmVudF8xID0gcmVxdWlyZShcIi4vZXZlbnRcIik7XG5jbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBldmVudF8xLmRlZmF1bHQge1xuICAgIGNvbnN0cnVjdG9yKGNsYXNzTmFtZSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfVxuICAgIGdldEVsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbDtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBDb21wb25lbnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmNsYXNzIEV2ZW50IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5ldmVudHMgPSB7fTtcbiAgICB9XG4gICAgYWRkRXZlbnQodHlwZSwgZnVuYykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRzW3R5cGVdLnB1c2goZnVuYyk7XG4gICAgfVxuICAgIHJlbW92ZUV2ZW50KHR5cGUsIGZ1bmMpIHtcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgICAgICBpZiAoZnVuYykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnRzW3R5cGVdLmZvckVhY2goKGV2ZW50RnVuYywgaW5kZXgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGV2ZW50RnVuYyA9PT0gZnVuYykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNbdHlwZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZGlzcGF0Y2hFdmVudCh0eXBlLCBkYXRhKSB7XG4gICAgICAgIGlmICh0aGlzLmV2ZW50c1t0eXBlXSkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0uZm9yRWFjaCgoZXZlbnRGdW5jKSA9PiB7XG4gICAgICAgICAgICAgICAgZXZlbnRGdW5jKHsgZGF0YSwgdGFyZ2V0OiB0aGlzLCB0eXBlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBFdmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5QbGF5ZXJFbGVtZW50cyA9IHZvaWQgMDtcbnZhciBQbGF5ZXJFbGVtZW50cztcbihmdW5jdGlvbiAoUGxheWVyRWxlbWVudHMpIHtcbiAgICBQbGF5ZXJFbGVtZW50c1tcIktleWJvYXJkXCJdID0gXCJrZXlib2FyZFwiO1xuICAgIFBsYXllckVsZW1lbnRzW1wiS25vYlwiXSA9IFwia25vYlwiO1xuICAgIFBsYXllckVsZW1lbnRzW1wiU2xpZGVyXCJdID0gXCJzbGlkZXJcIjtcbiAgICBQbGF5ZXJFbGVtZW50c1tcIlN3aXRjaFwiXSA9IFwic3dpdGNoXCI7XG59KShQbGF5ZXJFbGVtZW50cyB8fCAoUGxheWVyRWxlbWVudHMgPSB7fSkpO1xuZXhwb3J0cy5QbGF5ZXJFbGVtZW50cyA9IFBsYXllckVsZW1lbnRzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkF1ZGlvUHJlbG9hZCA9IHZvaWQgMDtcbnZhciBBdWRpb1ByZWxvYWQ7XG4oZnVuY3Rpb24gKEF1ZGlvUHJlbG9hZCkge1xuICAgIC8vIE5vIHByZWxvYWRpbmcsIHNhbXBsZXMgaXMgbG9hZGVkIHdoZW4ga2V5IGlzIHByZXNzZWQuXG4gICAgQXVkaW9QcmVsb2FkW1wiT05fREVNQU5EXCJdID0gXCJvbi1kZW1hbmRcIjtcbiAgICAvLyBMb29wIHRocm91Z2ggZWFjaCBrZXksIGFuZCBwcmVsb2FkIG9uZSBzYW1wbGUgZm9yIGVhY2gga2V5LlxuICAgIEF1ZGlvUHJlbG9hZFtcIlBST0dSRVNTSVZFXCJdID0gXCJwcm9ncmVzc2l2ZVwiO1xuICAgIC8vIExvb3AgdGhyb3VnaCBvcmRlciBvZiB0aGUgZmlsZSwgYW5kIHByZWxvYWQgZWFjaCBzYW1wbGUuXG4gICAgQXVkaW9QcmVsb2FkW1wiU0VRVUVOVElBTFwiXSA9IFwic2VxdWVudGlhbFwiO1xufSkoQXVkaW9QcmVsb2FkIHx8IChBdWRpb1ByZWxvYWQgPSB7fSkpO1xuZXhwb3J0cy5BdWRpb1ByZWxvYWQgPSBBdWRpb1ByZWxvYWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuY29uc3QgZnNfMSA9IHJlcXVpcmUoXCJmc1wiKTtcbmNvbnN0IGFwaV8xID0gcmVxdWlyZShcIkBzZnotdG9vbHMvY29yZS9kaXN0L2FwaVwiKTtcbmNvbnN0IHV0aWxzXzEgPSByZXF1aXJlKFwiQHNmei10b29scy9jb3JlL2Rpc3QvdXRpbHNcIik7XG5jbGFzcyBGaWxlTG9hZGVyIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5maWxlcyA9IHt9O1xuICAgICAgICB0aGlzLmZpbGVzVHJlZSA9IHt9O1xuICAgICAgICB0aGlzLnJvb3QgPSAnJztcbiAgICAgICAgaWYgKHdpbmRvdy5BdWRpb0NvbnRleHQpIHtcbiAgICAgICAgICAgIHRoaXMuYXVkaW8gPSBuZXcgd2luZG93LkF1ZGlvQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGFkZERpcmVjdG9yeShmaWxlcykge1xuICAgICAgICBmaWxlcy5mb3JFYWNoKChmaWxlKSA9PiB0aGlzLmFkZEZpbGUoZmlsZSkpO1xuICAgIH1cbiAgICBhZGRGaWxlKGZpbGUpIHtcbiAgICAgICAgY29uc3QgcGF0aCA9IGRlY29kZVVSSSh0eXBlb2YgZmlsZSA9PT0gJ3N0cmluZycgPyBmaWxlIDogZmlsZS53ZWJraXRSZWxhdGl2ZVBhdGgpO1xuICAgICAgICBpZiAocGF0aCA9PT0gdGhpcy5yb290KVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICBjb25zdCBmaWxlS2V5ID0gKDAsIHV0aWxzXzEucGF0aEdldFN1YkRpcmVjdG9yeSkocGF0aCwgdGhpcy5yb290KTtcbiAgICAgICAgaWYgKHR5cGVvZiBmaWxlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhpcy5maWxlc1tmaWxlS2V5XSA9IHtcbiAgICAgICAgICAgICAgICBleHQ6ICgwLCB1dGlsc18xLnBhdGhHZXRFeHQpKGZpbGUpLFxuICAgICAgICAgICAgICAgIGNvbnRlbnRzOiBudWxsLFxuICAgICAgICAgICAgICAgIHBhdGgsXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maWxlc1tmaWxlS2V5XSA9IHtcbiAgICAgICAgICAgICAgICBleHQ6ICgwLCB1dGlsc18xLnBhdGhHZXRFeHQpKGZpbGUud2Via2l0UmVsYXRpdmVQYXRoKSxcbiAgICAgICAgICAgICAgICBjb250ZW50czogbnVsbCxcbiAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgIGhhbmRsZTogZmlsZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGRUb0ZpbGVUcmVlKGZpbGVLZXkpO1xuICAgICAgICByZXR1cm4gdGhpcy5maWxlc1tmaWxlS2V5XTtcbiAgICB9XG4gICAgYWRkRmlsZUNvbnRlbnRzKGZpbGUsIGNvbnRlbnRzKSB7XG4gICAgICAgIGNvbnN0IHBhdGggPSBkZWNvZGVVUkkoZmlsZSk7XG4gICAgICAgIGNvbnN0IGZpbGVLZXkgPSAoMCwgdXRpbHNfMS5wYXRoR2V0U3ViRGlyZWN0b3J5KShwYXRoLCB0aGlzLnJvb3QpO1xuICAgICAgICB0aGlzLmZpbGVzW2ZpbGVLZXldID0ge1xuICAgICAgICAgICAgZXh0OiAoMCwgdXRpbHNfMS5wYXRoR2V0RXh0KShwYXRoKSxcbiAgICAgICAgICAgIGNvbnRlbnRzLFxuICAgICAgICAgICAgcGF0aCxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlsZXNbZmlsZUtleV07XG4gICAgfVxuICAgIGFkZEZpbGVzQ29udGVudHMoZGlyZWN0b3J5LCBmaWxlbmFtZXMpIHtcbiAgICAgICAgZmlsZW5hbWVzLmZvckVhY2goKGZpbGVuYW1lKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmFkZEZpbGVDb250ZW50cyhkaXJlY3RvcnkgKyBmaWxlbmFtZSwgKDAsIGZzXzEucmVhZEZpbGVTeW5jKShkaXJlY3RvcnkgKyBmaWxlbmFtZSkudG9TdHJpbmcoKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBhZGRUb0ZpbGVUcmVlKGtleSkge1xuICAgICAgICBrZXkuc3BsaXQoJy8nKS5yZWR1Y2UoKG8sIGspID0+IChvW2tdID0gb1trXSB8fCB7fSksIHRoaXMuZmlsZXNUcmVlKTtcbiAgICB9XG4gICAgbG9hZEZpbGVMb2NhbChmaWxlLCBidWZmZXIgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKCFmaWxlLmhhbmRsZSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgIGlmIChidWZmZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IHlpZWxkIGZpbGUuaGFuZGxlLmFycmF5QnVmZmVyKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXVkaW8gJiYgYXJyYXlCdWZmZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlsZS5jb250ZW50cyA9IHlpZWxkIHRoaXMuYXVkaW8uZGVjb2RlQXVkaW9EYXRhKGFycmF5QnVmZmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBmaWxlLmNvbnRlbnRzID0geWllbGQgZmlsZS5oYW5kbGUudGV4dCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBsb2FkRmlsZVJlbW90ZShmaWxlLCBidWZmZXIgPSBmYWxzZSkge1xuICAgICAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAgICAgaWYgKGJ1ZmZlciA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFycmF5QnVmZmVyID0geWllbGQgKDAsIGFwaV8xLmFwaUFycmF5QnVmZmVyKSgoMCwgdXRpbHNfMS5lbmNvZGVIYXNoZXMpKGZpbGUucGF0aCkpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF1ZGlvKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpbGUuY29udGVudHMgPSB5aWVsZCB0aGlzLmF1ZGlvLmRlY29kZUF1ZGlvRGF0YShhcnJheUJ1ZmZlcik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZmlsZS5jb250ZW50cyA9IHlpZWxkICgwLCBhcGlfMS5hcGlUZXh0KSgoMCwgdXRpbHNfMS5lbmNvZGVIYXNoZXMpKGZpbGUucGF0aCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZpbGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBnZXRGaWxlKGZpbGUsIGJ1ZmZlciA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgICAgICBpZiAoIWZpbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWxlID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgICAgIGlmICgoMCwgdXRpbHNfMS5wYXRoR2V0RXh0KShmaWxlKS5sZW5ndGggPT09IDApXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICBjb25zdCBmaWxlS2V5ID0gKDAsIHV0aWxzXzEucGF0aEdldFN1YkRpcmVjdG9yeSkoZmlsZSwgdGhpcy5yb290KTtcbiAgICAgICAgICAgICAgICBsZXQgZmlsZVJlZiA9IHRoaXMuZmlsZXNbZmlsZUtleV07XG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlUmVmKVxuICAgICAgICAgICAgICAgICAgICBmaWxlUmVmID0gdGhpcy5hZGRGaWxlKGZpbGUpO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlUmVmID09PSBudWxsIHx8IGZpbGVSZWYgPT09IHZvaWQgMCA/IHZvaWQgMCA6IGZpbGVSZWYuY29udGVudHMpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmaWxlUmVmO1xuICAgICAgICAgICAgICAgIGlmIChmaWxlLnN0YXJ0c1dpdGgoJ2h0dHAnKSlcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHlpZWxkIHRoaXMubG9hZEZpbGVSZW1vdGUoZmlsZVJlZiwgYnVmZmVyKTtcbiAgICAgICAgICAgICAgICByZXR1cm4geWllbGQgdGhpcy5sb2FkRmlsZUxvY2FsKGZpbGVSZWYsIGJ1ZmZlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoZmlsZS5jb250ZW50cylcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlsZTtcbiAgICAgICAgICAgIGlmICgnaGFuZGxlJyBpbiBmaWxlKVxuICAgICAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLmxvYWRGaWxlTG9jYWwoZmlsZSwgYnVmZmVyKTtcbiAgICAgICAgICAgIHJldHVybiB5aWVsZCB0aGlzLmxvYWRGaWxlUmVtb3RlKGZpbGUsIGJ1ZmZlcik7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzZXRSb290KGRpcikge1xuICAgICAgICB0aGlzLnJvb3QgPSBkaXI7XG4gICAgfVxuICAgIHJlc2V0RmlsZXMoKSB7XG4gICAgICAgIHRoaXMuZmlsZXMgPSB7fTtcbiAgICAgICAgdGhpcy5maWxlc1RyZWUgPSB7fTtcbiAgICB9XG59XG5leHBvcnRzLmRlZmF1bHQgPSBGaWxlTG9hZGVyO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XHJcblxyXG4gIGlzQXJyYXk6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheSkge1xyXG4gICAgICByZXR1cm4gQXJyYXkuaXNBcnJheSh2YWx1ZSk7XHJcbiAgICB9XHJcbiAgICAvLyBmYWxsYmFjayBmb3Igb2xkZXIgYnJvd3NlcnMgbGlrZSAgSUUgOFxyXG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCggdmFsdWUgKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICB9XHJcblxyXG59O1xyXG4iLCIvKmpzbGludCBub2RlOnRydWUgKi9cclxuXHJcbnZhciB4bWwyanMgPSByZXF1aXJlKCcuL3htbDJqcycpO1xyXG52YXIgeG1sMmpzb24gPSByZXF1aXJlKCcuL3htbDJqc29uJyk7XHJcbnZhciBqczJ4bWwgPSByZXF1aXJlKCcuL2pzMnhtbCcpO1xyXG52YXIganNvbjJ4bWwgPSByZXF1aXJlKCcuL2pzb24yeG1sJyk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICB4bWwyanM6IHhtbDJqcyxcclxuICB4bWwyanNvbjogeG1sMmpzb24sXHJcbiAganMyeG1sOiBqczJ4bWwsXHJcbiAganNvbjJ4bWw6IGpzb24yeG1sXHJcbn07XHJcbiIsInZhciBoZWxwZXIgPSByZXF1aXJlKCcuL29wdGlvbnMtaGVscGVyJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vYXJyYXktaGVscGVyJykuaXNBcnJheTtcblxudmFyIGN1cnJlbnRFbGVtZW50LCBjdXJyZW50RWxlbWVudE5hbWU7XG5cbmZ1bmN0aW9uIHZhbGlkYXRlT3B0aW9ucyh1c2VyT3B0aW9ucykge1xuICB2YXIgb3B0aW9ucyA9IGhlbHBlci5jb3B5T3B0aW9ucyh1c2VyT3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVEZWNsYXJhdGlvbicsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlSW5zdHJ1Y3Rpb24nLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZUF0dHJpYnV0ZXMnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZVRleHQnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZUNvbW1lbnQnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZUNkYXRhJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVEb2N0eXBlJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdjb21wYWN0Jywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpbmRlbnRUZXh0Jywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpbmRlbnRDZGF0YScsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaW5kZW50QXR0cmlidXRlcycsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaW5kZW50SW5zdHJ1Y3Rpb24nLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2Z1bGxUYWdFbXB0eUVsZW1lbnQnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ25vUXVvdGVzRm9yTmF0aXZlQXR0cmlidXRlcycsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlU3BhY2VzRXhpc3RzKG9wdGlvbnMpO1xuICBpZiAodHlwZW9mIG9wdGlvbnMuc3BhY2VzID09PSAnbnVtYmVyJykge1xuICAgIG9wdGlvbnMuc3BhY2VzID0gQXJyYXkob3B0aW9ucy5zcGFjZXMgKyAxKS5qb2luKCcgJyk7XG4gIH1cbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnZGVjbGFyYXRpb24nLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnaW5zdHJ1Y3Rpb24nLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnYXR0cmlidXRlcycsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCd0ZXh0Jywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ2NvbW1lbnQnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnY2RhdGEnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnZG9jdHlwZScsIG9wdGlvbnMpO1xuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCd0eXBlJywgb3B0aW9ucyk7XG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ25hbWUnLCBvcHRpb25zKTtcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnZWxlbWVudHMnLCBvcHRpb25zKTtcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2RvY3R5cGUnLCBvcHRpb25zKTtcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2luc3RydWN0aW9uJywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdjZGF0YScsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnY29tbWVudCcsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygndGV4dCcsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnaW5zdHJ1Y3Rpb25OYW1lJywgb3B0aW9ucyk7XG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdlbGVtZW50TmFtZScsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnYXR0cmlidXRlTmFtZScsIG9wdGlvbnMpO1xuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnYXR0cmlidXRlVmFsdWUnLCBvcHRpb25zKTtcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2F0dHJpYnV0ZXMnLCBvcHRpb25zKTtcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2Z1bGxUYWdFbXB0eUVsZW1lbnQnLCBvcHRpb25zKTtcbiAgcmV0dXJuIG9wdGlvbnM7XG59XG5cbmZ1bmN0aW9uIHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkge1xuICByZXR1cm4gKCFmaXJzdExpbmUgJiYgb3B0aW9ucy5zcGFjZXMgPyAnXFxuJyA6ICcnKSArIEFycmF5KGRlcHRoICsgMSkuam9pbihvcHRpb25zLnNwYWNlcyk7XG59XG5cbmZ1bmN0aW9uIHdyaXRlQXR0cmlidXRlcyhhdHRyaWJ1dGVzLCBvcHRpb25zLCBkZXB0aCkge1xuICBpZiAob3B0aW9ucy5pZ25vcmVBdHRyaWJ1dGVzKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGlmICgnYXR0cmlidXRlc0ZuJyBpbiBvcHRpb25zKSB7XG4gICAgYXR0cmlidXRlcyA9IG9wdGlvbnMuYXR0cmlidXRlc0ZuKGF0dHJpYnV0ZXMsIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpO1xuICB9XG4gIHZhciBrZXksIGF0dHIsIGF0dHJOYW1lLCBxdW90ZSwgcmVzdWx0ID0gW107XG4gIGZvciAoa2V5IGluIGF0dHJpYnV0ZXMpIHtcbiAgICBpZiAoYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGF0dHJpYnV0ZXNba2V5XSAhPT0gbnVsbCAmJiBhdHRyaWJ1dGVzW2tleV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgcXVvdGUgPSBvcHRpb25zLm5vUXVvdGVzRm9yTmF0aXZlQXR0cmlidXRlcyAmJiB0eXBlb2YgYXR0cmlidXRlc1trZXldICE9PSAnc3RyaW5nJyA/ICcnIDogJ1wiJztcbiAgICAgIGF0dHIgPSAnJyArIGF0dHJpYnV0ZXNba2V5XTsgLy8gZW5zdXJlIG51bWJlciBhbmQgYm9vbGVhbiBhcmUgY29udmVydGVkIHRvIFN0cmluZ1xuICAgICAgYXR0ciA9IGF0dHIucmVwbGFjZSgvXCIvZywgJyZxdW90OycpO1xuICAgICAgYXR0ck5hbWUgPSAnYXR0cmlidXRlTmFtZUZuJyBpbiBvcHRpb25zID8gb3B0aW9ucy5hdHRyaWJ1dGVOYW1lRm4oa2V5LCBhdHRyLCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KSA6IGtleTtcbiAgICAgIHJlc3VsdC5wdXNoKChvcHRpb25zLnNwYWNlcyAmJiBvcHRpb25zLmluZGVudEF0dHJpYnV0ZXM/IHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgrMSwgZmFsc2UpIDogJyAnKSk7XG4gICAgICByZXN1bHQucHVzaChhdHRyTmFtZSArICc9JyArIHF1b3RlICsgKCdhdHRyaWJ1dGVWYWx1ZUZuJyBpbiBvcHRpb25zID8gb3B0aW9ucy5hdHRyaWJ1dGVWYWx1ZUZuKGF0dHIsIGtleSwgY3VycmVudEVsZW1lbnROYW1lLCBjdXJyZW50RWxlbWVudCkgOiBhdHRyKSArIHF1b3RlKTtcbiAgICB9XG4gIH1cbiAgaWYgKGF0dHJpYnV0ZXMgJiYgT2JqZWN0LmtleXMoYXR0cmlidXRlcykubGVuZ3RoICYmIG9wdGlvbnMuc3BhY2VzICYmIG9wdGlvbnMuaW5kZW50QXR0cmlidXRlcykge1xuICAgIHJlc3VsdC5wdXNoKHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZhbHNlKSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVEZWNsYXJhdGlvbihkZWNsYXJhdGlvbiwgb3B0aW9ucywgZGVwdGgpIHtcbiAgY3VycmVudEVsZW1lbnQgPSBkZWNsYXJhdGlvbjtcbiAgY3VycmVudEVsZW1lbnROYW1lID0gJ3htbCc7XG4gIHJldHVybiBvcHRpb25zLmlnbm9yZURlY2xhcmF0aW9uID8gJycgOiAgJzw/JyArICd4bWwnICsgd3JpdGVBdHRyaWJ1dGVzKGRlY2xhcmF0aW9uW29wdGlvbnMuYXR0cmlidXRlc0tleV0sIG9wdGlvbnMsIGRlcHRoKSArICc/Pic7XG59XG5cbmZ1bmN0aW9uIHdyaXRlSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24sIG9wdGlvbnMsIGRlcHRoKSB7XG4gIGlmIChvcHRpb25zLmlnbm9yZUluc3RydWN0aW9uKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIGluc3RydWN0aW9uKSB7XG4gICAgaWYgKGluc3RydWN0aW9uLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICB2YXIgaW5zdHJ1Y3Rpb25OYW1lID0gJ2luc3RydWN0aW9uTmFtZUZuJyBpbiBvcHRpb25zID8gb3B0aW9ucy5pbnN0cnVjdGlvbk5hbWVGbihrZXksIGluc3RydWN0aW9uW2tleV0sIGN1cnJlbnRFbGVtZW50TmFtZSwgY3VycmVudEVsZW1lbnQpIDoga2V5O1xuICBpZiAodHlwZW9mIGluc3RydWN0aW9uW2tleV0gPT09ICdvYmplY3QnKSB7XG4gICAgY3VycmVudEVsZW1lbnQgPSBpbnN0cnVjdGlvbjtcbiAgICBjdXJyZW50RWxlbWVudE5hbWUgPSBpbnN0cnVjdGlvbk5hbWU7XG4gICAgcmV0dXJuICc8PycgKyBpbnN0cnVjdGlvbk5hbWUgKyB3cml0ZUF0dHJpYnV0ZXMoaW5zdHJ1Y3Rpb25ba2V5XVtvcHRpb25zLmF0dHJpYnV0ZXNLZXldLCBvcHRpb25zLCBkZXB0aCkgKyAnPz4nO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0cnVjdGlvblZhbHVlID0gaW5zdHJ1Y3Rpb25ba2V5XSA/IGluc3RydWN0aW9uW2tleV0gOiAnJztcbiAgICBpZiAoJ2luc3RydWN0aW9uRm4nIGluIG9wdGlvbnMpIGluc3RydWN0aW9uVmFsdWUgPSBvcHRpb25zLmluc3RydWN0aW9uRm4oaW5zdHJ1Y3Rpb25WYWx1ZSwga2V5LCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KTtcbiAgICByZXR1cm4gJzw/JyArIGluc3RydWN0aW9uTmFtZSArIChpbnN0cnVjdGlvblZhbHVlID8gJyAnICsgaW5zdHJ1Y3Rpb25WYWx1ZSA6ICcnKSArICc/Pic7XG4gIH1cbn1cblxuZnVuY3Rpb24gd3JpdGVDb21tZW50KGNvbW1lbnQsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuaWdub3JlQ29tbWVudCA/ICcnIDogJzwhLS0nICsgKCdjb21tZW50Rm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmNvbW1lbnRGbihjb21tZW50LCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KSA6IGNvbW1lbnQpICsgJy0tPic7XG59XG5cbmZ1bmN0aW9uIHdyaXRlQ2RhdGEoY2RhdGEsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuaWdub3JlQ2RhdGEgPyAnJyA6ICc8IVtDREFUQVsnICsgKCdjZGF0YUZuJyBpbiBvcHRpb25zID8gb3B0aW9ucy5jZGF0YUZuKGNkYXRhLCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KSA6IGNkYXRhLnJlcGxhY2UoJ11dPicsICddXV1dPjwhW0NEQVRBWz4nKSkgKyAnXV0+Jztcbn1cblxuZnVuY3Rpb24gd3JpdGVEb2N0eXBlKGRvY3R5cGUsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIG9wdGlvbnMuaWdub3JlRG9jdHlwZSA/ICcnIDogJzwhRE9DVFlQRSAnICsgKCdkb2N0eXBlRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmRvY3R5cGVGbihkb2N0eXBlLCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KSA6IGRvY3R5cGUpICsgJz4nO1xufVxuXG5mdW5jdGlvbiB3cml0ZVRleHQodGV4dCwgb3B0aW9ucykge1xuICBpZiAob3B0aW9ucy5pZ25vcmVUZXh0KSByZXR1cm4gJyc7XG4gIHRleHQgPSAnJyArIHRleHQ7IC8vIGVuc3VyZSBOdW1iZXIgYW5kIEJvb2xlYW4gYXJlIGNvbnZlcnRlZCB0byBTdHJpbmdcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvJmFtcDsvZywgJyYnKTsgLy8gZGVzYW5pdGl6ZSB0byBhdm9pZCBkb3VibGUgc2FuaXRpemF0aW9uXG4gIHRleHQgPSB0ZXh0LnJlcGxhY2UoLyYvZywgJyZhbXA7JykucmVwbGFjZSgvPC9nLCAnJmx0OycpLnJlcGxhY2UoLz4vZywgJyZndDsnKTtcbiAgcmV0dXJuICd0ZXh0Rm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLnRleHRGbih0ZXh0LCBjdXJyZW50RWxlbWVudE5hbWUsIGN1cnJlbnRFbGVtZW50KSA6IHRleHQ7XG59XG5cbmZ1bmN0aW9uIGhhc0NvbnRlbnQoZWxlbWVudCwgb3B0aW9ucykge1xuICB2YXIgaTtcbiAgaWYgKGVsZW1lbnQuZWxlbWVudHMgJiYgZWxlbWVudC5lbGVtZW50cy5sZW5ndGgpIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgZWxlbWVudC5lbGVtZW50cy5sZW5ndGg7ICsraSkge1xuICAgICAgc3dpdGNoIChlbGVtZW50LmVsZW1lbnRzW2ldW29wdGlvbnMudHlwZUtleV0pIHtcbiAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRUZXh0KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7IC8vIHNraXAgdG8gbmV4dCBrZXlcbiAgICAgIGNhc2UgJ2NkYXRhJzpcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5kZW50Q2RhdGEpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhazsgLy8gc2tpcCB0byBuZXh0IGtleVxuICAgICAgY2FzZSAnaW5zdHJ1Y3Rpb24nOlxuICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRJbnN0cnVjdGlvbikge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrOyAvLyBza2lwIHRvIG5leHQga2V5XG4gICAgICBjYXNlICdkb2N0eXBlJzpcbiAgICAgIGNhc2UgJ2NvbW1lbnQnOlxuICAgICAgY2FzZSAnZWxlbWVudCc6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gd3JpdGVFbGVtZW50KGVsZW1lbnQsIG9wdGlvbnMsIGRlcHRoKSB7XG4gIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcbiAgY3VycmVudEVsZW1lbnROYW1lID0gZWxlbWVudC5uYW1lO1xuICB2YXIgeG1sID0gW10sIGVsZW1lbnROYW1lID0gJ2VsZW1lbnROYW1lRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmVsZW1lbnROYW1lRm4oZWxlbWVudC5uYW1lLCBlbGVtZW50KSA6IGVsZW1lbnQubmFtZTtcbiAgeG1sLnB1c2goJzwnICsgZWxlbWVudE5hbWUpO1xuICBpZiAoZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldKSB7XG4gICAgeG1sLnB1c2god3JpdGVBdHRyaWJ1dGVzKGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSwgb3B0aW9ucywgZGVwdGgpKTtcbiAgfVxuICB2YXIgd2l0aENsb3NpbmdUYWcgPSBlbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldICYmIGVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0ubGVuZ3RoIHx8IGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSAmJiBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV1bJ3htbDpzcGFjZSddID09PSAncHJlc2VydmUnO1xuICBpZiAoIXdpdGhDbG9zaW5nVGFnKSB7XG4gICAgaWYgKCdmdWxsVGFnRW1wdHlFbGVtZW50Rm4nIGluIG9wdGlvbnMpIHtcbiAgICAgIHdpdGhDbG9zaW5nVGFnID0gb3B0aW9ucy5mdWxsVGFnRW1wdHlFbGVtZW50Rm4oZWxlbWVudC5uYW1lLCBlbGVtZW50KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2l0aENsb3NpbmdUYWcgPSBvcHRpb25zLmZ1bGxUYWdFbXB0eUVsZW1lbnQ7XG4gICAgfVxuICB9XG4gIGlmICh3aXRoQ2xvc2luZ1RhZykge1xuICAgIHhtbC5wdXNoKCc+Jyk7XG4gICAgaWYgKGVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0gJiYgZWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XS5sZW5ndGgpIHtcbiAgICAgIHhtbC5wdXNoKHdyaXRlRWxlbWVudHMoZWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XSwgb3B0aW9ucywgZGVwdGggKyAxKSk7XG4gICAgICBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gICAgICBjdXJyZW50RWxlbWVudE5hbWUgPSBlbGVtZW50Lm5hbWU7XG4gICAgfVxuICAgIHhtbC5wdXNoKG9wdGlvbnMuc3BhY2VzICYmIGhhc0NvbnRlbnQoZWxlbWVudCwgb3B0aW9ucykgPyAnXFxuJyArIEFycmF5KGRlcHRoICsgMSkuam9pbihvcHRpb25zLnNwYWNlcykgOiAnJyk7XG4gICAgeG1sLnB1c2goJzwvJyArIGVsZW1lbnROYW1lICsgJz4nKTtcbiAgfSBlbHNlIHtcbiAgICB4bWwucHVzaCgnLz4nKTtcbiAgfVxuICByZXR1cm4geG1sLmpvaW4oJycpO1xufVxuXG5mdW5jdGlvbiB3cml0ZUVsZW1lbnRzKGVsZW1lbnRzLCBvcHRpb25zLCBkZXB0aCwgZmlyc3RMaW5lKSB7XG4gIHJldHVybiBlbGVtZW50cy5yZWR1Y2UoZnVuY3Rpb24gKHhtbCwgZWxlbWVudCkge1xuICAgIHZhciBpbmRlbnQgPSB3cml0ZUluZGVudGF0aW9uKG9wdGlvbnMsIGRlcHRoLCBmaXJzdExpbmUgJiYgIXhtbCk7XG4gICAgc3dpdGNoIChlbGVtZW50LnR5cGUpIHtcbiAgICBjYXNlICdlbGVtZW50JzogcmV0dXJuIHhtbCArIGluZGVudCArIHdyaXRlRWxlbWVudChlbGVtZW50LCBvcHRpb25zLCBkZXB0aCk7XG4gICAgY2FzZSAnY29tbWVudCc6IHJldHVybiB4bWwgKyBpbmRlbnQgKyB3cml0ZUNvbW1lbnQoZWxlbWVudFtvcHRpb25zLmNvbW1lbnRLZXldLCBvcHRpb25zKTtcbiAgICBjYXNlICdkb2N0eXBlJzogcmV0dXJuIHhtbCArIGluZGVudCArIHdyaXRlRG9jdHlwZShlbGVtZW50W29wdGlvbnMuZG9jdHlwZUtleV0sIG9wdGlvbnMpO1xuICAgIGNhc2UgJ2NkYXRhJzogcmV0dXJuIHhtbCArIChvcHRpb25zLmluZGVudENkYXRhID8gaW5kZW50IDogJycpICsgd3JpdGVDZGF0YShlbGVtZW50W29wdGlvbnMuY2RhdGFLZXldLCBvcHRpb25zKTtcbiAgICBjYXNlICd0ZXh0JzogcmV0dXJuIHhtbCArIChvcHRpb25zLmluZGVudFRleHQgPyBpbmRlbnQgOiAnJykgKyB3cml0ZVRleHQoZWxlbWVudFtvcHRpb25zLnRleHRLZXldLCBvcHRpb25zKTtcbiAgICBjYXNlICdpbnN0cnVjdGlvbic6XG4gICAgICB2YXIgaW5zdHJ1Y3Rpb24gPSB7fTtcbiAgICAgIGluc3RydWN0aW9uW2VsZW1lbnRbb3B0aW9ucy5uYW1lS2V5XV0gPSBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0gPyBlbGVtZW50IDogZWxlbWVudFtvcHRpb25zLmluc3RydWN0aW9uS2V5XTtcbiAgICAgIHJldHVybiB4bWwgKyAob3B0aW9ucy5pbmRlbnRJbnN0cnVjdGlvbiA/IGluZGVudCA6ICcnKSArIHdyaXRlSW5zdHJ1Y3Rpb24oaW5zdHJ1Y3Rpb24sIG9wdGlvbnMsIGRlcHRoKTtcbiAgICB9XG4gIH0sICcnKTtcbn1cblxuZnVuY3Rpb24gaGFzQ29udGVudENvbXBhY3QoZWxlbWVudCwgb3B0aW9ucywgYW55Q29udGVudCkge1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBlbGVtZW50KSB7XG4gICAgaWYgKGVsZW1lbnQuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgc3dpdGNoIChrZXkpIHtcbiAgICAgIGNhc2Ugb3B0aW9ucy5wYXJlbnRLZXk6XG4gICAgICBjYXNlIG9wdGlvbnMuYXR0cmlidXRlc0tleTpcbiAgICAgICAgYnJlYWs7IC8vIHNraXAgdG8gbmV4dCBrZXlcbiAgICAgIGNhc2Ugb3B0aW9ucy50ZXh0S2V5OlxuICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRUZXh0IHx8IGFueUNvbnRlbnQpIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhazsgLy8gc2tpcCB0byBuZXh0IGtleVxuICAgICAgY2FzZSBvcHRpb25zLmNkYXRhS2V5OlxuICAgICAgICBpZiAob3B0aW9ucy5pbmRlbnRDZGF0YSB8fCBhbnlDb250ZW50KSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7IC8vIHNraXAgdG8gbmV4dCBrZXlcbiAgICAgIGNhc2Ugb3B0aW9ucy5pbnN0cnVjdGlvbktleTpcbiAgICAgICAgaWYgKG9wdGlvbnMuaW5kZW50SW5zdHJ1Y3Rpb24gfHwgYW55Q29udGVudCkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrOyAvLyBza2lwIHRvIG5leHQga2V5XG4gICAgICBjYXNlIG9wdGlvbnMuZG9jdHlwZUtleTpcbiAgICAgIGNhc2Ugb3B0aW9ucy5jb21tZW50S2V5OlxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIHdyaXRlRWxlbWVudENvbXBhY3QoZWxlbWVudCwgbmFtZSwgb3B0aW9ucywgZGVwdGgsIGluZGVudCkge1xuICBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gIGN1cnJlbnRFbGVtZW50TmFtZSA9IG5hbWU7XG4gIHZhciBlbGVtZW50TmFtZSA9ICdlbGVtZW50TmFtZUZuJyBpbiBvcHRpb25zID8gb3B0aW9ucy5lbGVtZW50TmFtZUZuKG5hbWUsIGVsZW1lbnQpIDogbmFtZTtcbiAgaWYgKHR5cGVvZiBlbGVtZW50ID09PSAndW5kZWZpbmVkJyB8fCBlbGVtZW50ID09PSBudWxsIHx8IGVsZW1lbnQgPT09ICcnKSB7XG4gICAgcmV0dXJuICdmdWxsVGFnRW1wdHlFbGVtZW50Rm4nIGluIG9wdGlvbnMgJiYgb3B0aW9ucy5mdWxsVGFnRW1wdHlFbGVtZW50Rm4obmFtZSwgZWxlbWVudCkgfHwgb3B0aW9ucy5mdWxsVGFnRW1wdHlFbGVtZW50ID8gJzwnICsgZWxlbWVudE5hbWUgKyAnPjwvJyArIGVsZW1lbnROYW1lICsgJz4nIDogJzwnICsgZWxlbWVudE5hbWUgKyAnLz4nO1xuICB9XG4gIHZhciB4bWwgPSBbXTtcbiAgaWYgKG5hbWUpIHtcbiAgICB4bWwucHVzaCgnPCcgKyBlbGVtZW50TmFtZSk7XG4gICAgaWYgKHR5cGVvZiBlbGVtZW50ICE9PSAnb2JqZWN0Jykge1xuICAgICAgeG1sLnB1c2goJz4nICsgd3JpdGVUZXh0KGVsZW1lbnQsb3B0aW9ucykgKyAnPC8nICsgZWxlbWVudE5hbWUgKyAnPicpO1xuICAgICAgcmV0dXJuIHhtbC5qb2luKCcnKTtcbiAgICB9XG4gICAgaWYgKGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSkge1xuICAgICAgeG1sLnB1c2god3JpdGVBdHRyaWJ1dGVzKGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSwgb3B0aW9ucywgZGVwdGgpKTtcbiAgICB9XG4gICAgdmFyIHdpdGhDbG9zaW5nVGFnID0gaGFzQ29udGVudENvbXBhY3QoZWxlbWVudCwgb3B0aW9ucywgdHJ1ZSkgfHwgZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldICYmIGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XVsneG1sOnNwYWNlJ10gPT09ICdwcmVzZXJ2ZSc7XG4gICAgaWYgKCF3aXRoQ2xvc2luZ1RhZykge1xuICAgICAgaWYgKCdmdWxsVGFnRW1wdHlFbGVtZW50Rm4nIGluIG9wdGlvbnMpIHtcbiAgICAgICAgd2l0aENsb3NpbmdUYWcgPSBvcHRpb25zLmZ1bGxUYWdFbXB0eUVsZW1lbnRGbihuYW1lLCBlbGVtZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHdpdGhDbG9zaW5nVGFnID0gb3B0aW9ucy5mdWxsVGFnRW1wdHlFbGVtZW50O1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAod2l0aENsb3NpbmdUYWcpIHtcbiAgICAgIHhtbC5wdXNoKCc+Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHhtbC5wdXNoKCcvPicpO1xuICAgICAgcmV0dXJuIHhtbC5qb2luKCcnKTtcbiAgICB9XG4gIH1cbiAgeG1sLnB1c2god3JpdGVFbGVtZW50c0NvbXBhY3QoZWxlbWVudCwgb3B0aW9ucywgZGVwdGggKyAxLCBmYWxzZSkpO1xuICBjdXJyZW50RWxlbWVudCA9IGVsZW1lbnQ7XG4gIGN1cnJlbnRFbGVtZW50TmFtZSA9IG5hbWU7XG4gIGlmIChuYW1lKSB7XG4gICAgeG1sLnB1c2goKGluZGVudCA/IHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZhbHNlKSA6ICcnKSArICc8LycgKyBlbGVtZW50TmFtZSArICc+Jyk7XG4gIH1cbiAgcmV0dXJuIHhtbC5qb2luKCcnKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVFbGVtZW50c0NvbXBhY3QoZWxlbWVudCwgb3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkge1xuICB2YXIgaSwga2V5LCBub2RlcywgeG1sID0gW107XG4gIGZvciAoa2V5IGluIGVsZW1lbnQpIHtcbiAgICBpZiAoZWxlbWVudC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBub2RlcyA9IGlzQXJyYXkoZWxlbWVudFtrZXldKSA/IGVsZW1lbnRba2V5XSA6IFtlbGVtZW50W2tleV1dO1xuICAgICAgZm9yIChpID0gMDsgaSA8IG5vZGVzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIHN3aXRjaCAoa2V5KSB7XG4gICAgICAgIGNhc2Ugb3B0aW9ucy5kZWNsYXJhdGlvbktleTogeG1sLnB1c2god3JpdGVEZWNsYXJhdGlvbihub2Rlc1tpXSwgb3B0aW9ucywgZGVwdGgpKTsgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3B0aW9ucy5pbnN0cnVjdGlvbktleTogeG1sLnB1c2goKG9wdGlvbnMuaW5kZW50SW5zdHJ1Y3Rpb24gPyB3cml0ZUluZGVudGF0aW9uKG9wdGlvbnMsIGRlcHRoLCBmaXJzdExpbmUpIDogJycpICsgd3JpdGVJbnN0cnVjdGlvbihub2Rlc1tpXSwgb3B0aW9ucywgZGVwdGgpKTsgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3B0aW9ucy5hdHRyaWJ1dGVzS2V5OiBjYXNlIG9wdGlvbnMucGFyZW50S2V5OiBicmVhazsgLy8gc2tpcFxuICAgICAgICBjYXNlIG9wdGlvbnMudGV4dEtleTogeG1sLnB1c2goKG9wdGlvbnMuaW5kZW50VGV4dCA/IHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkgOiAnJykgKyB3cml0ZVRleHQobm9kZXNbaV0sIG9wdGlvbnMpKTsgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3B0aW9ucy5jZGF0YUtleTogeG1sLnB1c2goKG9wdGlvbnMuaW5kZW50Q2RhdGEgPyB3cml0ZUluZGVudGF0aW9uKG9wdGlvbnMsIGRlcHRoLCBmaXJzdExpbmUpIDogJycpICsgd3JpdGVDZGF0YShub2Rlc1tpXSwgb3B0aW9ucykpOyBicmVhaztcbiAgICAgICAgY2FzZSBvcHRpb25zLmRvY3R5cGVLZXk6IHhtbC5wdXNoKHdyaXRlSW5kZW50YXRpb24ob3B0aW9ucywgZGVwdGgsIGZpcnN0TGluZSkgKyB3cml0ZURvY3R5cGUobm9kZXNbaV0sIG9wdGlvbnMpKTsgYnJlYWs7XG4gICAgICAgIGNhc2Ugb3B0aW9ucy5jb21tZW50S2V5OiB4bWwucHVzaCh3cml0ZUluZGVudGF0aW9uKG9wdGlvbnMsIGRlcHRoLCBmaXJzdExpbmUpICsgd3JpdGVDb21tZW50KG5vZGVzW2ldLCBvcHRpb25zKSk7IGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiB4bWwucHVzaCh3cml0ZUluZGVudGF0aW9uKG9wdGlvbnMsIGRlcHRoLCBmaXJzdExpbmUpICsgd3JpdGVFbGVtZW50Q29tcGFjdChub2Rlc1tpXSwga2V5LCBvcHRpb25zLCBkZXB0aCwgaGFzQ29udGVudENvbXBhY3Qobm9kZXNbaV0sIG9wdGlvbnMpKSk7XG4gICAgICAgIH1cbiAgICAgICAgZmlyc3RMaW5lID0gZmlyc3RMaW5lICYmICF4bWwubGVuZ3RoO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4geG1sLmpvaW4oJycpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChqcywgb3B0aW9ucykge1xuICBvcHRpb25zID0gdmFsaWRhdGVPcHRpb25zKG9wdGlvbnMpO1xuICB2YXIgeG1sID0gW107XG4gIGN1cnJlbnRFbGVtZW50ID0ganM7XG4gIGN1cnJlbnRFbGVtZW50TmFtZSA9ICdfcm9vdF8nO1xuICBpZiAob3B0aW9ucy5jb21wYWN0KSB7XG4gICAgeG1sLnB1c2god3JpdGVFbGVtZW50c0NvbXBhY3QoanMsIG9wdGlvbnMsIDAsIHRydWUpKTtcbiAgfSBlbHNlIHtcbiAgICBpZiAoanNbb3B0aW9ucy5kZWNsYXJhdGlvbktleV0pIHtcbiAgICAgIHhtbC5wdXNoKHdyaXRlRGVjbGFyYXRpb24oanNbb3B0aW9ucy5kZWNsYXJhdGlvbktleV0sIG9wdGlvbnMsIDApKTtcbiAgICB9XG4gICAgaWYgKGpzW29wdGlvbnMuZWxlbWVudHNLZXldICYmIGpzW29wdGlvbnMuZWxlbWVudHNLZXldLmxlbmd0aCkge1xuICAgICAgeG1sLnB1c2god3JpdGVFbGVtZW50cyhqc1tvcHRpb25zLmVsZW1lbnRzS2V5XSwgb3B0aW9ucywgMCwgIXhtbC5sZW5ndGgpKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHhtbC5qb2luKCcnKTtcbn07XG4iLCJ2YXIganMyeG1sID0gcmVxdWlyZSgnLi9qczJ4bWwuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGpzb24sIG9wdGlvbnMpIHtcclxuICBpZiAoanNvbiBpbnN0YW5jZW9mIEJ1ZmZlcikge1xyXG4gICAganNvbiA9IGpzb24udG9TdHJpbmcoKTtcclxuICB9XHJcbiAgdmFyIGpzID0gbnVsbDtcclxuICBpZiAodHlwZW9mIChqc29uKSA9PT0gJ3N0cmluZycpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGpzID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgSlNPTiBzdHJ1Y3R1cmUgaXMgaW52YWxpZCcpO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBqcyA9IGpzb247XHJcbiAgfVxyXG4gIHJldHVybiBqczJ4bWwoanMsIG9wdGlvbnMpO1xyXG59O1xyXG4iLCJ2YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vYXJyYXktaGVscGVyJykuaXNBcnJheTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG5cclxuICBjb3B5T3B0aW9uczogZnVuY3Rpb24gKG9wdGlvbnMpIHtcclxuICAgIHZhciBrZXksIGNvcHkgPSB7fTtcclxuICAgIGZvciAoa2V5IGluIG9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGNvcHlba2V5XSA9IG9wdGlvbnNba2V5XTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvcHk7XHJcbiAgfSxcclxuXHJcbiAgZW5zdXJlRmxhZ0V4aXN0czogZnVuY3Rpb24gKGl0ZW0sIG9wdGlvbnMpIHtcclxuICAgIGlmICghKGl0ZW0gaW4gb3B0aW9ucykgfHwgdHlwZW9mIG9wdGlvbnNbaXRlbV0gIT09ICdib29sZWFuJykge1xyXG4gICAgICBvcHRpb25zW2l0ZW1dID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZW5zdXJlU3BhY2VzRXhpc3RzOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKCEoJ3NwYWNlcycgaW4gb3B0aW9ucykgfHwgKHR5cGVvZiBvcHRpb25zLnNwYWNlcyAhPT0gJ251bWJlcicgJiYgdHlwZW9mIG9wdGlvbnMuc3BhY2VzICE9PSAnc3RyaW5nJykpIHtcclxuICAgICAgb3B0aW9ucy5zcGFjZXMgPSAwO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGVuc3VyZUFsd2F5c0FycmF5RXhpc3RzOiBmdW5jdGlvbiAob3B0aW9ucykge1xyXG4gICAgaWYgKCEoJ2Fsd2F5c0FycmF5JyBpbiBvcHRpb25zKSB8fCAodHlwZW9mIG9wdGlvbnMuYWx3YXlzQXJyYXkgIT09ICdib29sZWFuJyAmJiAhaXNBcnJheShvcHRpb25zLmFsd2F5c0FycmF5KSkpIHtcclxuICAgICAgb3B0aW9ucy5hbHdheXNBcnJheSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGVuc3VyZUtleUV4aXN0czogZnVuY3Rpb24gKGtleSwgb3B0aW9ucykge1xyXG4gICAgaWYgKCEoa2V5ICsgJ0tleScgaW4gb3B0aW9ucykgfHwgdHlwZW9mIG9wdGlvbnNba2V5ICsgJ0tleSddICE9PSAnc3RyaW5nJykge1xyXG4gICAgICBvcHRpb25zW2tleSArICdLZXknXSA9IG9wdGlvbnMuY29tcGFjdCA/ICdfJyArIGtleSA6IGtleTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBjaGVja0ZuRXhpc3RzOiBmdW5jdGlvbiAoa2V5LCBvcHRpb25zKSB7XHJcbiAgICByZXR1cm4ga2V5ICsgJ0ZuJyBpbiBvcHRpb25zO1xyXG4gIH1cclxuXHJcbn07XHJcbiIsInZhciBzYXggPSByZXF1aXJlKCdzYXgnKTtcclxudmFyIGV4cGF0IC8qPSByZXF1aXJlKCdub2RlLWV4cGF0Jyk7Ki8gPSB7IG9uOiBmdW5jdGlvbiAoKSB7IH0sIHBhcnNlOiBmdW5jdGlvbiAoKSB7IH0gfTtcclxudmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vb3B0aW9ucy1oZWxwZXInKTtcclxudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL2FycmF5LWhlbHBlcicpLmlzQXJyYXk7XHJcblxyXG52YXIgb3B0aW9ucztcclxudmFyIHB1cmVKc1BhcnNlciA9IHRydWU7XHJcbnZhciBjdXJyZW50RWxlbWVudDtcclxuXHJcbmZ1bmN0aW9uIHZhbGlkYXRlT3B0aW9ucyh1c2VyT3B0aW9ucykge1xyXG4gIG9wdGlvbnMgPSBoZWxwZXIuY29weU9wdGlvbnModXNlck9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVEZWNsYXJhdGlvbicsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVJbnN0cnVjdGlvbicsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVBdHRyaWJ1dGVzJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2lnbm9yZVRleHQnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnaWdub3JlQ29tbWVudCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVDZGF0YScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpZ25vcmVEb2N0eXBlJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ2NvbXBhY3QnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnYWx3YXlzQ2hpbGRyZW4nLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnYWRkUGFyZW50Jywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUZsYWdFeGlzdHMoJ3RyaW0nLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnbmF0aXZlVHlwZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCduYXRpdmVUeXBlQXR0cmlidXRlcycsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdzYW5pdGl6ZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVGbGFnRXhpc3RzKCdpbnN0cnVjdGlvbkhhc0F0dHJpYnV0ZXMnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlRmxhZ0V4aXN0cygnY2FwdHVyZVNwYWNlc0JldHdlZW5FbGVtZW50cycsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVBbHdheXNBcnJheUV4aXN0cyhvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdkZWNsYXJhdGlvbicsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ2luc3RydWN0aW9uJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnYXR0cmlidXRlcycsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ3RleHQnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdjb21tZW50Jywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygnY2RhdGEnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdkb2N0eXBlJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmVuc3VyZUtleUV4aXN0cygndHlwZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ25hbWUnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuZW5zdXJlS2V5RXhpc3RzKCdlbGVtZW50cycsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVLZXlFeGlzdHMoJ3BhcmVudCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdkb2N0eXBlJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2luc3RydWN0aW9uJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2NkYXRhJywgb3B0aW9ucyk7XHJcbiAgaGVscGVyLmNoZWNrRm5FeGlzdHMoJ2NvbW1lbnQnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygndGV4dCcsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdpbnN0cnVjdGlvbk5hbWUnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnZWxlbWVudE5hbWUnLCBvcHRpb25zKTtcclxuICBoZWxwZXIuY2hlY2tGbkV4aXN0cygnYXR0cmlidXRlTmFtZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdhdHRyaWJ1dGVWYWx1ZScsIG9wdGlvbnMpO1xyXG4gIGhlbHBlci5jaGVja0ZuRXhpc3RzKCdhdHRyaWJ1dGVzJywgb3B0aW9ucyk7XHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG5hdGl2ZVR5cGUodmFsdWUpIHtcclxuICB2YXIgblZhbHVlID0gTnVtYmVyKHZhbHVlKTtcclxuICBpZiAoIWlzTmFOKG5WYWx1ZSkpIHtcclxuICAgIHJldHVybiBuVmFsdWU7XHJcbiAgfVxyXG4gIHZhciBiVmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gIGlmIChiVmFsdWUgPT09ICd0cnVlJykge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfSBlbHNlIGlmIChiVmFsdWUgPT09ICdmYWxzZScpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbiAgcmV0dXJuIHZhbHVlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRGaWVsZCh0eXBlLCB2YWx1ZSkge1xyXG4gIHZhciBrZXk7XHJcbiAgaWYgKG9wdGlvbnMuY29tcGFjdCkge1xyXG4gICAgaWYgKFxyXG4gICAgICAhY3VycmVudEVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSAmJlxyXG4gICAgICAoaXNBcnJheShvcHRpb25zLmFsd2F5c0FycmF5KSA/IG9wdGlvbnMuYWx3YXlzQXJyYXkuaW5kZXhPZihvcHRpb25zW3R5cGUgKyAnS2V5J10pICE9PSAtMSA6IG9wdGlvbnMuYWx3YXlzQXJyYXkpXHJcbiAgICApIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSA9IFtdO1xyXG4gICAgfVxyXG4gICAgaWYgKGN1cnJlbnRFbGVtZW50W29wdGlvbnNbdHlwZSArICdLZXknXV0gJiYgIWlzQXJyYXkoY3VycmVudEVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSkpIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSA9IFtjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dXTtcclxuICAgIH1cclxuICAgIGlmICh0eXBlICsgJ0ZuJyBpbiBvcHRpb25zICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdmFsdWUgPSBvcHRpb25zW3R5cGUgKyAnRm4nXSh2YWx1ZSwgY3VycmVudEVsZW1lbnQpO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGUgPT09ICdpbnN0cnVjdGlvbicgJiYgKCdpbnN0cnVjdGlvbkZuJyBpbiBvcHRpb25zIHx8ICdpbnN0cnVjdGlvbk5hbWVGbicgaW4gb3B0aW9ucykpIHtcclxuICAgICAgZm9yIChrZXkgaW4gdmFsdWUpIHtcclxuICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgaWYgKCdpbnN0cnVjdGlvbkZuJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgICAgIHZhbHVlW2tleV0gPSBvcHRpb25zLmluc3RydWN0aW9uRm4odmFsdWVba2V5XSwga2V5LCBjdXJyZW50RWxlbWVudCk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgdGVtcCA9IHZhbHVlW2tleV07XHJcbiAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrZXldO1xyXG4gICAgICAgICAgICB2YWx1ZVtvcHRpb25zLmluc3RydWN0aW9uTmFtZUZuKGtleSwgdGVtcCwgY3VycmVudEVsZW1lbnQpXSA9IHRlbXA7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBpZiAoaXNBcnJheShjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dKSkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zW3R5cGUgKyAnS2V5J11dLnB1c2godmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAoIWN1cnJlbnRFbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50W29wdGlvbnMuZWxlbWVudHNLZXldID0gW107XHJcbiAgICB9XHJcbiAgICB2YXIgZWxlbWVudCA9IHt9O1xyXG4gICAgZWxlbWVudFtvcHRpb25zLnR5cGVLZXldID0gdHlwZTtcclxuICAgIGlmICh0eXBlID09PSAnaW5zdHJ1Y3Rpb24nKSB7XHJcbiAgICAgIGZvciAoa2V5IGluIHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBlbGVtZW50W29wdGlvbnMubmFtZUtleV0gPSAnaW5zdHJ1Y3Rpb25OYW1lRm4nIGluIG9wdGlvbnMgPyBvcHRpb25zLmluc3RydWN0aW9uTmFtZUZuKGtleSwgdmFsdWUsIGN1cnJlbnRFbGVtZW50KSA6IGtleTtcclxuICAgICAgaWYgKG9wdGlvbnMuaW5zdHJ1Y3Rpb25IYXNBdHRyaWJ1dGVzKSB7XHJcbiAgICAgICAgZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldID0gdmFsdWVba2V5XVtvcHRpb25zLmF0dHJpYnV0ZXNLZXldO1xyXG4gICAgICAgIGlmICgnaW5zdHJ1Y3Rpb25GbicgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgZWxlbWVudFtvcHRpb25zLmF0dHJpYnV0ZXNLZXldID0gb3B0aW9ucy5pbnN0cnVjdGlvbkZuKGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSwga2V5LCBjdXJyZW50RWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICgnaW5zdHJ1Y3Rpb25GbicgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgdmFsdWVba2V5XSA9IG9wdGlvbnMuaW5zdHJ1Y3Rpb25Gbih2YWx1ZVtrZXldLCBrZXksIGN1cnJlbnRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZWxlbWVudFtvcHRpb25zLmluc3RydWN0aW9uS2V5XSA9IHZhbHVlW2tleV07XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0eXBlICsgJ0ZuJyBpbiBvcHRpb25zKSB7XHJcbiAgICAgICAgdmFsdWUgPSBvcHRpb25zW3R5cGUgKyAnRm4nXSh2YWx1ZSwgY3VycmVudEVsZW1lbnQpO1xyXG4gICAgICB9XHJcbiAgICAgIGVsZW1lbnRbb3B0aW9uc1t0eXBlICsgJ0tleSddXSA9IHZhbHVlO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuYWRkUGFyZW50KSB7XHJcbiAgICAgIGVsZW1lbnRbb3B0aW9ucy5wYXJlbnRLZXldID0gY3VycmVudEVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XS5wdXNoKGVsZW1lbnQpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gbWFuaXB1bGF0ZUF0dHJpYnV0ZXMoYXR0cmlidXRlcykge1xyXG4gIGlmICgnYXR0cmlidXRlc0ZuJyBpbiBvcHRpb25zICYmIGF0dHJpYnV0ZXMpIHtcclxuICAgIGF0dHJpYnV0ZXMgPSBvcHRpb25zLmF0dHJpYnV0ZXNGbihhdHRyaWJ1dGVzLCBjdXJyZW50RWxlbWVudCk7XHJcbiAgfVxyXG4gIGlmICgob3B0aW9ucy50cmltIHx8ICdhdHRyaWJ1dGVWYWx1ZUZuJyBpbiBvcHRpb25zIHx8ICdhdHRyaWJ1dGVOYW1lRm4nIGluIG9wdGlvbnMgfHwgb3B0aW9ucy5uYXRpdmVUeXBlQXR0cmlidXRlcykgJiYgYXR0cmlidXRlcykge1xyXG4gICAgdmFyIGtleTtcclxuICAgIGZvciAoa2V5IGluIGF0dHJpYnV0ZXMpIHtcclxuICAgICAgaWYgKGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGlmIChvcHRpb25zLnRyaW0pIGF0dHJpYnV0ZXNba2V5XSA9IGF0dHJpYnV0ZXNba2V5XS50cmltKCk7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMubmF0aXZlVHlwZUF0dHJpYnV0ZXMpIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZXNba2V5XSA9IG5hdGl2ZVR5cGUoYXR0cmlidXRlc1trZXldKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCdhdHRyaWJ1dGVWYWx1ZUZuJyBpbiBvcHRpb25zKSBhdHRyaWJ1dGVzW2tleV0gPSBvcHRpb25zLmF0dHJpYnV0ZVZhbHVlRm4oYXR0cmlidXRlc1trZXldLCBrZXksIGN1cnJlbnRFbGVtZW50KTtcclxuICAgICAgICBpZiAoJ2F0dHJpYnV0ZU5hbWVGbicgaW4gb3B0aW9ucykge1xyXG4gICAgICAgICAgdmFyIHRlbXAgPSBhdHRyaWJ1dGVzW2tleV07XHJcbiAgICAgICAgICBkZWxldGUgYXR0cmlidXRlc1trZXldO1xyXG4gICAgICAgICAgYXR0cmlidXRlc1tvcHRpb25zLmF0dHJpYnV0ZU5hbWVGbihrZXksIGF0dHJpYnV0ZXNba2V5XSwgY3VycmVudEVsZW1lbnQpXSA9IHRlbXA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBhdHRyaWJ1dGVzO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkluc3RydWN0aW9uKGluc3RydWN0aW9uKSB7XHJcbiAgdmFyIGF0dHJpYnV0ZXMgPSB7fTtcclxuICBpZiAoaW5zdHJ1Y3Rpb24uYm9keSAmJiAoaW5zdHJ1Y3Rpb24ubmFtZS50b0xvd2VyQ2FzZSgpID09PSAneG1sJyB8fCBvcHRpb25zLmluc3RydWN0aW9uSGFzQXR0cmlidXRlcykpIHtcclxuICAgIHZhciBhdHRyc1JlZ0V4cCA9IC8oW1xcdzotXSspXFxzKj1cXHMqKD86XCIoW15cIl0qKVwifCcoW14nXSopJ3woXFx3KykpXFxzKi9nO1xyXG4gICAgdmFyIG1hdGNoO1xyXG4gICAgd2hpbGUgKChtYXRjaCA9IGF0dHJzUmVnRXhwLmV4ZWMoaW5zdHJ1Y3Rpb24uYm9keSkpICE9PSBudWxsKSB7XHJcbiAgICAgIGF0dHJpYnV0ZXNbbWF0Y2hbMV1dID0gbWF0Y2hbMl0gfHwgbWF0Y2hbM10gfHwgbWF0Y2hbNF07XHJcbiAgICB9XHJcbiAgICBhdHRyaWJ1dGVzID0gbWFuaXB1bGF0ZUF0dHJpYnV0ZXMoYXR0cmlidXRlcyk7XHJcbiAgfVxyXG4gIGlmIChpbnN0cnVjdGlvbi5uYW1lLnRvTG93ZXJDYXNlKCkgPT09ICd4bWwnKSB7XHJcbiAgICBpZiAob3B0aW9ucy5pZ25vcmVEZWNsYXJhdGlvbikge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zLmRlY2xhcmF0aW9uS2V5XSA9IHt9O1xyXG4gICAgaWYgKE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aCkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zLmRlY2xhcmF0aW9uS2V5XVtvcHRpb25zLmF0dHJpYnV0ZXNLZXldID0gYXR0cmlidXRlcztcclxuICAgIH1cclxuICAgIGlmIChvcHRpb25zLmFkZFBhcmVudCkge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtvcHRpb25zLmRlY2xhcmF0aW9uS2V5XVtvcHRpb25zLnBhcmVudEtleV0gPSBjdXJyZW50RWxlbWVudDtcclxuICAgIH1cclxuICB9IGVsc2Uge1xyXG4gICAgaWYgKG9wdGlvbnMuaWdub3JlSW5zdHJ1Y3Rpb24pIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMudHJpbSkge1xyXG4gICAgICBpbnN0cnVjdGlvbi5ib2R5ID0gaW5zdHJ1Y3Rpb24uYm9keS50cmltKCk7XHJcbiAgICB9XHJcbiAgICB2YXIgdmFsdWUgPSB7fTtcclxuICAgIGlmIChvcHRpb25zLmluc3RydWN0aW9uSGFzQXR0cmlidXRlcyAmJiBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKS5sZW5ndGgpIHtcclxuICAgICAgdmFsdWVbaW5zdHJ1Y3Rpb24ubmFtZV0gPSB7fTtcclxuICAgICAgdmFsdWVbaW5zdHJ1Y3Rpb24ubmFtZV1bb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XSA9IGF0dHJpYnV0ZXM7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB2YWx1ZVtpbnN0cnVjdGlvbi5uYW1lXSA9IGluc3RydWN0aW9uLmJvZHk7XHJcbiAgICB9XHJcbiAgICBhZGRGaWVsZCgnaW5zdHJ1Y3Rpb24nLCB2YWx1ZSk7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBvblN0YXJ0RWxlbWVudChuYW1lLCBhdHRyaWJ1dGVzKSB7XHJcbiAgdmFyIGVsZW1lbnQ7XHJcbiAgaWYgKHR5cGVvZiBuYW1lID09PSAnb2JqZWN0Jykge1xyXG4gICAgYXR0cmlidXRlcyA9IG5hbWUuYXR0cmlidXRlcztcclxuICAgIG5hbWUgPSBuYW1lLm5hbWU7XHJcbiAgfVxyXG4gIGF0dHJpYnV0ZXMgPSBtYW5pcHVsYXRlQXR0cmlidXRlcyhhdHRyaWJ1dGVzKTtcclxuICBpZiAoJ2VsZW1lbnROYW1lRm4nIGluIG9wdGlvbnMpIHtcclxuICAgIG5hbWUgPSBvcHRpb25zLmVsZW1lbnROYW1lRm4obmFtZSwgY3VycmVudEVsZW1lbnQpO1xyXG4gIH1cclxuICBpZiAob3B0aW9ucy5jb21wYWN0KSB7XHJcbiAgICBlbGVtZW50ID0ge307XHJcbiAgICBpZiAoIW9wdGlvbnMuaWdub3JlQXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzICYmIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aCkge1xyXG4gICAgICBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0gPSB7fTtcclxuICAgICAgdmFyIGtleTtcclxuICAgICAgZm9yIChrZXkgaW4gYXR0cmlidXRlcykge1xyXG4gICAgICAgIGlmIChhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgIGVsZW1lbnRbb3B0aW9ucy5hdHRyaWJ1dGVzS2V5XVtrZXldID0gYXR0cmlidXRlc1trZXldO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKFxyXG4gICAgICAhKG5hbWUgaW4gY3VycmVudEVsZW1lbnQpICYmXHJcbiAgICAgIChpc0FycmF5KG9wdGlvbnMuYWx3YXlzQXJyYXkpID8gb3B0aW9ucy5hbHdheXNBcnJheS5pbmRleE9mKG5hbWUpICE9PSAtMSA6IG9wdGlvbnMuYWx3YXlzQXJyYXkpXHJcbiAgICApIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbbmFtZV0gPSBbXTtcclxuICAgIH1cclxuICAgIGlmIChjdXJyZW50RWxlbWVudFtuYW1lXSAmJiAhaXNBcnJheShjdXJyZW50RWxlbWVudFtuYW1lXSkpIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbbmFtZV0gPSBbY3VycmVudEVsZW1lbnRbbmFtZV1dO1xyXG4gICAgfVxyXG4gICAgaWYgKGlzQXJyYXkoY3VycmVudEVsZW1lbnRbbmFtZV0pKSB7XHJcbiAgICAgIGN1cnJlbnRFbGVtZW50W25hbWVdLnB1c2goZWxlbWVudCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjdXJyZW50RWxlbWVudFtuYW1lXSA9IGVsZW1lbnQ7XHJcbiAgICB9XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICghY3VycmVudEVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0pIHtcclxuICAgICAgY3VycmVudEVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0gPSBbXTtcclxuICAgIH1cclxuICAgIGVsZW1lbnQgPSB7fTtcclxuICAgIGVsZW1lbnRbb3B0aW9ucy50eXBlS2V5XSA9ICdlbGVtZW50JztcclxuICAgIGVsZW1lbnRbb3B0aW9ucy5uYW1lS2V5XSA9IG5hbWU7XHJcbiAgICBpZiAoIW9wdGlvbnMuaWdub3JlQXR0cmlidXRlcyAmJiBhdHRyaWJ1dGVzICYmIE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpLmxlbmd0aCkge1xyXG4gICAgICBlbGVtZW50W29wdGlvbnMuYXR0cmlidXRlc0tleV0gPSBhdHRyaWJ1dGVzO1xyXG4gICAgfVxyXG4gICAgaWYgKG9wdGlvbnMuYWx3YXlzQ2hpbGRyZW4pIHtcclxuICAgICAgZWxlbWVudFtvcHRpb25zLmVsZW1lbnRzS2V5XSA9IFtdO1xyXG4gICAgfVxyXG4gICAgY3VycmVudEVsZW1lbnRbb3B0aW9ucy5lbGVtZW50c0tleV0ucHVzaChlbGVtZW50KTtcclxuICB9XHJcbiAgZWxlbWVudFtvcHRpb25zLnBhcmVudEtleV0gPSBjdXJyZW50RWxlbWVudDsgLy8gd2lsbCBiZSBkZWxldGVkIGluIG9uRW5kRWxlbWVudCgpIGlmICFvcHRpb25zLmFkZFBhcmVudFxyXG4gIGN1cnJlbnRFbGVtZW50ID0gZWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gb25UZXh0KHRleHQpIHtcclxuICBpZiAob3B0aW9ucy5pZ25vcmVUZXh0KSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmICghdGV4dC50cmltKCkgJiYgIW9wdGlvbnMuY2FwdHVyZVNwYWNlc0JldHdlZW5FbGVtZW50cykge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBpZiAob3B0aW9ucy50cmltKSB7XHJcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLm5hdGl2ZVR5cGUpIHtcclxuICAgIHRleHQgPSBuYXRpdmVUeXBlKHRleHQpO1xyXG4gIH1cclxuICBpZiAob3B0aW9ucy5zYW5pdGl6ZSkge1xyXG4gICAgdGV4dCA9IHRleHQucmVwbGFjZSgvJi9nLCAnJmFtcDsnKS5yZXBsYWNlKC88L2csICcmbHQ7JykucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xyXG4gIH1cclxuICBhZGRGaWVsZCgndGV4dCcsIHRleHQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkNvbW1lbnQoY29tbWVudCkge1xyXG4gIGlmIChvcHRpb25zLmlnbm9yZUNvbW1lbnQpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgaWYgKG9wdGlvbnMudHJpbSkge1xyXG4gICAgY29tbWVudCA9IGNvbW1lbnQudHJpbSgpO1xyXG4gIH1cclxuICBhZGRGaWVsZCgnY29tbWVudCcsIGNvbW1lbnQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBvbkVuZEVsZW1lbnQobmFtZSkge1xyXG4gIHZhciBwYXJlbnRFbGVtZW50ID0gY3VycmVudEVsZW1lbnRbb3B0aW9ucy5wYXJlbnRLZXldO1xyXG4gIGlmICghb3B0aW9ucy5hZGRQYXJlbnQpIHtcclxuICAgIGRlbGV0ZSBjdXJyZW50RWxlbWVudFtvcHRpb25zLnBhcmVudEtleV07XHJcbiAgfVxyXG4gIGN1cnJlbnRFbGVtZW50ID0gcGFyZW50RWxlbWVudDtcclxufVxyXG5cclxuZnVuY3Rpb24gb25DZGF0YShjZGF0YSkge1xyXG4gIGlmIChvcHRpb25zLmlnbm9yZUNkYXRhKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIGlmIChvcHRpb25zLnRyaW0pIHtcclxuICAgIGNkYXRhID0gY2RhdGEudHJpbSgpO1xyXG4gIH1cclxuICBhZGRGaWVsZCgnY2RhdGEnLCBjZGF0YSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRG9jdHlwZShkb2N0eXBlKSB7XHJcbiAgaWYgKG9wdGlvbnMuaWdub3JlRG9jdHlwZSkge1xyXG4gICAgcmV0dXJuO1xyXG4gIH1cclxuICBkb2N0eXBlID0gZG9jdHlwZS5yZXBsYWNlKC9eIC8sICcnKTtcclxuICBpZiAob3B0aW9ucy50cmltKSB7XHJcbiAgICBkb2N0eXBlID0gZG9jdHlwZS50cmltKCk7XHJcbiAgfVxyXG4gIGFkZEZpZWxkKCdkb2N0eXBlJywgZG9jdHlwZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIG9uRXJyb3IoZXJyb3IpIHtcclxuICBlcnJvci5ub3RlID0gZXJyb3I7IC8vY29uc29sZS5lcnJvcihlcnJvcik7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHhtbCwgdXNlck9wdGlvbnMpIHtcclxuXHJcbiAgdmFyIHBhcnNlciA9IHB1cmVKc1BhcnNlciA/IHNheC5wYXJzZXIodHJ1ZSwge30pIDogcGFyc2VyID0gbmV3IGV4cGF0LlBhcnNlcignVVRGLTgnKTtcclxuICB2YXIgcmVzdWx0ID0ge307XHJcbiAgY3VycmVudEVsZW1lbnQgPSByZXN1bHQ7XHJcblxyXG4gIG9wdGlvbnMgPSB2YWxpZGF0ZU9wdGlvbnModXNlck9wdGlvbnMpO1xyXG5cclxuICBpZiAocHVyZUpzUGFyc2VyKSB7XHJcbiAgICBwYXJzZXIub3B0ID0ge3N0cmljdEVudGl0aWVzOiB0cnVlfTtcclxuICAgIHBhcnNlci5vbm9wZW50YWcgPSBvblN0YXJ0RWxlbWVudDtcclxuICAgIHBhcnNlci5vbnRleHQgPSBvblRleHQ7XHJcbiAgICBwYXJzZXIub25jb21tZW50ID0gb25Db21tZW50O1xyXG4gICAgcGFyc2VyLm9uY2xvc2V0YWcgPSBvbkVuZEVsZW1lbnQ7XHJcbiAgICBwYXJzZXIub25lcnJvciA9IG9uRXJyb3I7XHJcbiAgICBwYXJzZXIub25jZGF0YSA9IG9uQ2RhdGE7XHJcbiAgICBwYXJzZXIub25kb2N0eXBlID0gb25Eb2N0eXBlO1xyXG4gICAgcGFyc2VyLm9ucHJvY2Vzc2luZ2luc3RydWN0aW9uID0gb25JbnN0cnVjdGlvbjtcclxuICB9IGVsc2Uge1xyXG4gICAgcGFyc2VyLm9uKCdzdGFydEVsZW1lbnQnLCBvblN0YXJ0RWxlbWVudCk7XHJcbiAgICBwYXJzZXIub24oJ3RleHQnLCBvblRleHQpO1xyXG4gICAgcGFyc2VyLm9uKCdjb21tZW50Jywgb25Db21tZW50KTtcclxuICAgIHBhcnNlci5vbignZW5kRWxlbWVudCcsIG9uRW5kRWxlbWVudCk7XHJcbiAgICBwYXJzZXIub24oJ2Vycm9yJywgb25FcnJvcik7XHJcbiAgICAvL3BhcnNlci5vbignc3RhcnRDZGF0YScsIG9uU3RhcnRDZGF0YSk7XHJcbiAgICAvL3BhcnNlci5vbignZW5kQ2RhdGEnLCBvbkVuZENkYXRhKTtcclxuICAgIC8vcGFyc2VyLm9uKCdlbnRpdHlEZWNsJywgb25FbnRpdHlEZWNsKTtcclxuICB9XHJcblxyXG4gIGlmIChwdXJlSnNQYXJzZXIpIHtcclxuICAgIHBhcnNlci53cml0ZSh4bWwpLmNsb3NlKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIGlmICghcGFyc2VyLnBhcnNlKHhtbCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdYTUwgcGFyc2luZyBlcnJvcjogJyArIHBhcnNlci5nZXRFcnJvcigpKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChyZXN1bHRbb3B0aW9ucy5lbGVtZW50c0tleV0pIHtcclxuICAgIHZhciB0ZW1wID0gcmVzdWx0W29wdGlvbnMuZWxlbWVudHNLZXldO1xyXG4gICAgZGVsZXRlIHJlc3VsdFtvcHRpb25zLmVsZW1lbnRzS2V5XTtcclxuICAgIHJlc3VsdFtvcHRpb25zLmVsZW1lbnRzS2V5XSA9IHRlbXA7XHJcbiAgICBkZWxldGUgcmVzdWx0LnRleHQ7XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG5cclxufTtcclxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vb3B0aW9ucy1oZWxwZXInKTtcclxudmFyIHhtbDJqcyA9IHJlcXVpcmUoJy4veG1sMmpzJyk7XHJcblxyXG5mdW5jdGlvbiB2YWxpZGF0ZU9wdGlvbnMgKHVzZXJPcHRpb25zKSB7XHJcbiAgdmFyIG9wdGlvbnMgPSBoZWxwZXIuY29weU9wdGlvbnModXNlck9wdGlvbnMpO1xyXG4gIGhlbHBlci5lbnN1cmVTcGFjZXNFeGlzdHMob3B0aW9ucyk7XHJcbiAgcmV0dXJuIG9wdGlvbnM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oeG1sLCB1c2VyT3B0aW9ucykge1xyXG4gIHZhciBvcHRpb25zLCBqcywganNvbiwgcGFyZW50S2V5O1xyXG4gIG9wdGlvbnMgPSB2YWxpZGF0ZU9wdGlvbnModXNlck9wdGlvbnMpO1xyXG4gIGpzID0geG1sMmpzKHhtbCwgb3B0aW9ucyk7XHJcbiAgcGFyZW50S2V5ID0gJ2NvbXBhY3QnIGluIG9wdGlvbnMgJiYgb3B0aW9ucy5jb21wYWN0ID8gJ19wYXJlbnQnIDogJ3BhcmVudCc7XHJcbiAgLy8gcGFyZW50S2V5ID0gcHRpb25zLmNvbXBhY3QgPyAnX3BhcmVudCcgOiAncGFyZW50JzsgLy8gY29uc2lkZXIgdGhpc1xyXG4gIGlmICgnYWRkUGFyZW50JyBpbiBvcHRpb25zICYmIG9wdGlvbnMuYWRkUGFyZW50KSB7XHJcbiAgICBqc29uID0gSlNPTi5zdHJpbmdpZnkoanMsIGZ1bmN0aW9uIChrLCB2KSB7IHJldHVybiBrID09PSBwYXJlbnRLZXk/ICdfJyA6IHY7IH0sIG9wdGlvbnMuc3BhY2VzKTtcclxuICB9IGVsc2Uge1xyXG4gICAganNvbiA9IEpTT04uc3RyaW5naWZ5KGpzLCBudWxsLCBvcHRpb25zLnNwYWNlcyk7XHJcbiAgfVxyXG4gIHJldHVybiBqc29uLnJlcGxhY2UoL1xcdTIwMjgvZywgJ1xcXFx1MjAyOCcpLnJlcGxhY2UoL1xcdTIwMjkvZywgJ1xcXFx1MjAyOScpO1xyXG59O1xyXG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG9vcCA9IGFjZS5yZXF1aXJlKFwiYWNlL2xpYi9vb3BcIik7XG52YXIgVGV4dE1vZGUgPSBhY2UucmVxdWlyZShcImFjZS9tb2RlL3RleHRcIikuTW9kZTtcbnZhciBTRlpIaWdobGlnaHRSdWxlcyA9IHJlcXVpcmUoXCIuL3Nmel9oaWdobGlnaHRfcnVsZXNcIikuU0ZaSGlnaGxpZ2h0UnVsZXM7XG52YXIgRm9sZE1vZGUgPSByZXF1aXJlKFwiLi9zZnpfZm9sZGluZ19tb2RlXCIpLkZvbGRNb2RlO1xuXG52YXIgTW9kZSA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5IaWdobGlnaHRSdWxlcyA9IFNGWkhpZ2hsaWdodFJ1bGVzO1xuICB0aGlzLmZvbGRpbmdSdWxlcyA9IG5ldyBGb2xkTW9kZSgpO1xufTtcbm9vcC5pbmhlcml0cyhNb2RlLCBUZXh0TW9kZSk7XG5cbihmdW5jdGlvbiAoKSB7XG4gIHRoaXMubGluZUNvbW1lbnRTdGFydCA9IFwiLy9cIjtcblxuICB0aGlzLiRpZCA9IFwiYWNlL21vZGUvc2Z6XCI7XG59KS5jYWxsKE1vZGUucHJvdG90eXBlKTtcblxubW9kdWxlLmV4cG9ydHMuTW9kZSA9IE1vZGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG9vcCA9IGFjZS5yZXF1aXJlKFwiYWNlL2xpYi9vb3BcIik7XG52YXIgUmFuZ2UgPSBhY2UucmVxdWlyZShcImFjZS9yYW5nZVwiKS5SYW5nZTtcbnZhciBCYXNlRm9sZE1vZGUgPSBhY2UucmVxdWlyZShcImFjZS9tb2RlL2ZvbGRpbmcvZm9sZF9tb2RlXCIpLkZvbGRNb2RlO1xudmFyIEZvbGRNb2RlID0gKGV4cG9ydHMuRm9sZE1vZGUgPSBmdW5jdGlvbiAoY29tbWVudFJlZ2V4KSB7XG4gIGlmIChjb21tZW50UmVnZXgpIHtcbiAgICB0aGlzLmZvbGRpbmdTdGFydE1hcmtlciA9IG5ldyBSZWdFeHAoXG4gICAgICB0aGlzLmZvbGRpbmdTdGFydE1hcmtlci5zb3VyY2UucmVwbGFjZShcbiAgICAgICAgL1xcfFtefF0qPyQvLFxuICAgICAgICBcInxcIiArIGNvbW1lbnRSZWdleC5zdGFydFxuICAgICAgKVxuICAgICk7XG4gICAgdGhpcy5mb2xkaW5nU3RvcE1hcmtlciA9IG5ldyBSZWdFeHAoXG4gICAgICB0aGlzLmZvbGRpbmdTdG9wTWFya2VyLnNvdXJjZS5yZXBsYWNlKC9cXHxbXnxdKj8kLywgXCJ8XCIgKyBjb21tZW50UmVnZXguZW5kKVxuICAgICk7XG4gIH1cbn0pO1xub29wLmluaGVyaXRzKEZvbGRNb2RlLCBCYXNlRm9sZE1vZGUpO1xuKGZ1bmN0aW9uICgpIHtcbiAgdGhpcy5mb2xkaW5nU3RhcnRNYXJrZXIgPSAvKFtcXHtcXFtcXChdKVteXFx9XFxdXFwpXSokfF5cXHMqKFxcL1xcKikvO1xuICB0aGlzLmZvbGRpbmdTdG9wTWFya2VyID0gL15bXlxcW1xce1xcKF0qKFtcXH1cXF1cXCldKXxeW1xcc1xcKl0qKFxcKlxcLykvO1xuICB0aGlzLnNpbmdsZUxpbmVCbG9ja0NvbW1lbnRSZSA9IC9eXFxzKihcXC9cXCopLipcXCpcXC9cXHMqJC87XG4gIHRoaXMudHJpcGxlU3RhckJsb2NrQ29tbWVudFJlID0gL15cXHMqKFxcL1xcKlxcKlxcKikuKlxcKlxcL1xccyokLztcbiAgdGhpcy5zdGFydFJlZ2lvblJlID0gL15cXHMqKFxcL1xcKnxcXC9cXC8pIz9yZWdpb25cXGIvO1xuICB0aGlzLl9nZXRGb2xkV2lkZ2V0QmFzZSA9IHRoaXMuZ2V0Rm9sZFdpZGdldDtcbiAgdGhpcy5nZXRGb2xkV2lkZ2V0ID0gZnVuY3Rpb24gKHNlc3Npb24sIGZvbGRTdHlsZSwgcm93KSB7XG4gICAgdmFyIGxpbmUgPSBzZXNzaW9uLmdldExpbmUocm93KTtcbiAgICBpZiAodGhpcy5zaW5nbGVMaW5lQmxvY2tDb21tZW50UmUudGVzdChsaW5lKSkge1xuICAgICAgaWYgKFxuICAgICAgICAhdGhpcy5zdGFydFJlZ2lvblJlLnRlc3QobGluZSkgJiZcbiAgICAgICAgIXRoaXMudHJpcGxlU3RhckJsb2NrQ29tbWVudFJlLnRlc3QobGluZSlcbiAgICAgIClcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICAgIHZhciBmdyA9IHRoaXMuX2dldEZvbGRXaWRnZXRCYXNlKHNlc3Npb24sIGZvbGRTdHlsZSwgcm93KTtcbiAgICBpZiAoIWZ3ICYmIHRoaXMuc3RhcnRSZWdpb25SZS50ZXN0KGxpbmUpKSByZXR1cm4gXCJzdGFydFwiOyAvLyBsaW5lQ29tbWVudFJlZ2lvblN0YXJ0XG4gICAgcmV0dXJuIGZ3O1xuICB9O1xuICB0aGlzLmdldEZvbGRXaWRnZXRSYW5nZSA9IGZ1bmN0aW9uIChzZXNzaW9uLCBmb2xkU3R5bGUsIHJvdywgZm9yY2VNdWx0aWxpbmUpIHtcbiAgICB2YXIgbGluZSA9IHNlc3Npb24uZ2V0TGluZShyb3cpO1xuICAgIGlmICh0aGlzLnN0YXJ0UmVnaW9uUmUudGVzdChsaW5lKSlcbiAgICAgIHJldHVybiB0aGlzLmdldENvbW1lbnRSZWdpb25CbG9jayhzZXNzaW9uLCBsaW5lLCByb3cpO1xuICAgIHZhciBtYXRjaCA9IGxpbmUubWF0Y2godGhpcy5mb2xkaW5nU3RhcnRNYXJrZXIpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgdmFyIGkgPSBtYXRjaC5pbmRleDtcbiAgICAgIGlmIChtYXRjaFsxXSkgcmV0dXJuIHRoaXMub3BlbmluZ0JyYWNrZXRCbG9jayhzZXNzaW9uLCBtYXRjaFsxXSwgcm93LCBpKTtcbiAgICAgIHZhciByYW5nZSA9IHNlc3Npb24uZ2V0Q29tbWVudEZvbGRSYW5nZShyb3csIGkgKyBtYXRjaFswXS5sZW5ndGgsIDEpO1xuICAgICAgaWYgKHJhbmdlICYmICFyYW5nZS5pc011bHRpTGluZSgpKSB7XG4gICAgICAgIGlmIChmb3JjZU11bHRpbGluZSkge1xuICAgICAgICAgIHJhbmdlID0gdGhpcy5nZXRTZWN0aW9uUmFuZ2Uoc2Vzc2lvbiwgcm93KTtcbiAgICAgICAgfSBlbHNlIGlmIChmb2xkU3R5bGUgIT0gXCJhbGxcIikgcmFuZ2UgPSBudWxsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJhbmdlO1xuICAgIH1cbiAgICBpZiAoZm9sZFN0eWxlID09PSBcIm1hcmtiZWdpblwiKSByZXR1cm47XG4gICAgdmFyIG1hdGNoID0gbGluZS5tYXRjaCh0aGlzLmZvbGRpbmdTdG9wTWFya2VyKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIHZhciBpID0gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGg7XG4gICAgICBpZiAobWF0Y2hbMV0pIHJldHVybiB0aGlzLmNsb3NpbmdCcmFja2V0QmxvY2soc2Vzc2lvbiwgbWF0Y2hbMV0sIHJvdywgaSk7XG4gICAgICByZXR1cm4gc2Vzc2lvbi5nZXRDb21tZW50Rm9sZFJhbmdlKHJvdywgaSwgLTEpO1xuICAgIH1cbiAgfTtcbiAgdGhpcy5nZXRTZWN0aW9uUmFuZ2UgPSBmdW5jdGlvbiAoc2Vzc2lvbiwgcm93KSB7XG4gICAgdmFyIGxpbmUgPSBzZXNzaW9uLmdldExpbmUocm93KTtcbiAgICB2YXIgc3RhcnRJbmRlbnQgPSBsaW5lLnNlYXJjaCgvXFxTLyk7XG4gICAgdmFyIHN0YXJ0Um93ID0gcm93O1xuICAgIHZhciBzdGFydENvbHVtbiA9IGxpbmUubGVuZ3RoO1xuICAgIHJvdyA9IHJvdyArIDE7XG4gICAgdmFyIGVuZFJvdyA9IHJvdztcbiAgICB2YXIgbWF4Um93ID0gc2Vzc2lvbi5nZXRMZW5ndGgoKTtcbiAgICB3aGlsZSAoKytyb3cgPCBtYXhSb3cpIHtcbiAgICAgIGxpbmUgPSBzZXNzaW9uLmdldExpbmUocm93KTtcbiAgICAgIHZhciBpbmRlbnQgPSBsaW5lLnNlYXJjaCgvXFxTLyk7XG4gICAgICBpZiAoaW5kZW50ID09PSAtMSkgY29udGludWU7XG4gICAgICBpZiAoc3RhcnRJbmRlbnQgPiBpbmRlbnQpIGJyZWFrO1xuICAgICAgdmFyIHN1YlJhbmdlID0gdGhpcy5nZXRGb2xkV2lkZ2V0UmFuZ2Uoc2Vzc2lvbiwgXCJhbGxcIiwgcm93KTtcbiAgICAgIGlmIChzdWJSYW5nZSkge1xuICAgICAgICBpZiAoc3ViUmFuZ2Uuc3RhcnQucm93IDw9IHN0YXJ0Um93KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSBpZiAoc3ViUmFuZ2UuaXNNdWx0aUxpbmUoKSkge1xuICAgICAgICAgIHJvdyA9IHN1YlJhbmdlLmVuZC5yb3c7XG4gICAgICAgIH0gZWxzZSBpZiAoc3RhcnRJbmRlbnQgPT0gaW5kZW50KSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGVuZFJvdyA9IHJvdztcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBSYW5nZShcbiAgICAgIHN0YXJ0Um93LFxuICAgICAgc3RhcnRDb2x1bW4sXG4gICAgICBlbmRSb3csXG4gICAgICBzZXNzaW9uLmdldExpbmUoZW5kUm93KS5sZW5ndGhcbiAgICApO1xuICB9O1xuICB0aGlzLmdldENvbW1lbnRSZWdpb25CbG9jayA9IGZ1bmN0aW9uIChzZXNzaW9uLCBsaW5lLCByb3cpIHtcbiAgICB2YXIgc3RhcnRDb2x1bW4gPSBsaW5lLnNlYXJjaCgvXFxzKiQvKTtcbiAgICB2YXIgbWF4Um93ID0gc2Vzc2lvbi5nZXRMZW5ndGgoKTtcbiAgICB2YXIgc3RhcnRSb3cgPSByb3c7XG4gICAgdmFyIHJlID0gL15cXHMqKD86XFwvXFwqfFxcL1xcL3wtLSkjPyhlbmQpP3JlZ2lvblxcYi87XG4gICAgdmFyIGRlcHRoID0gMTtcbiAgICB3aGlsZSAoKytyb3cgPCBtYXhSb3cpIHtcbiAgICAgIGxpbmUgPSBzZXNzaW9uLmdldExpbmUocm93KTtcbiAgICAgIHZhciBtID0gcmUuZXhlYyhsaW5lKTtcbiAgICAgIGlmICghbSkgY29udGludWU7XG4gICAgICBpZiAobVsxXSkgZGVwdGgtLTtcbiAgICAgIGVsc2UgZGVwdGgrKztcbiAgICAgIGlmICghZGVwdGgpIGJyZWFrO1xuICAgIH1cbiAgICB2YXIgZW5kUm93ID0gcm93O1xuICAgIGlmIChlbmRSb3cgPiBzdGFydFJvdykge1xuICAgICAgcmV0dXJuIG5ldyBSYW5nZShzdGFydFJvdywgc3RhcnRDb2x1bW4sIGVuZFJvdywgbGluZS5sZW5ndGgpO1xuICAgIH1cbiAgfTtcbn0pLmNhbGwoRm9sZE1vZGUucHJvdG90eXBlKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgb29wID0gYWNlLnJlcXVpcmUoXCJhY2UvbGliL29vcFwiKTtcbnZhciBUZXh0SGlnaGxpZ2h0UnVsZXMgPSBhY2UucmVxdWlyZShcImFjZS9tb2RlL3RleHRfaGlnaGxpZ2h0X3J1bGVzXCIpLlRleHRIaWdobGlnaHRSdWxlcztcbnZhciBTRlpIaWdobGlnaHRSdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgdGhpcy4kcnVsZXMgPSB7XG4gICAgc3RhcnQ6IFtcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjY29tbWVudFwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjaGVhZGVyc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6MV9zb3VuZC1zb3VyY2VcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejFfaW5zdHJ1bWVudC1zZXR0aW5nc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6MV9yZWdpb24tbG9naWNcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejFfcGVyZm9ybWFuY2UtcGFyYW1ldGVyc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6MV9tb2R1bGF0aW9uXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoxX2VmZmVjdHNcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejJfZGlyZWN0aXZlc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6Ml9zb3VuZC1zb3VyY2VcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejJfaW5zdHJ1bWVudC1zZXR0aW5nc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6Ml9yZWdpb24tbG9naWNcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI3NmejJfcGVyZm9ybWFuY2UtcGFyYW1ldGVyc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjc2Z6Ml9tb2R1bGF0aW9uXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNzZnoyX2N1cnZlc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjYXJpYV9pbnN0cnVtZW50LXNldHRpbmdzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNhcmlhX3JlZ2lvbi1sb2dpY1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaW5jbHVkZTogXCIjYXJpYV9wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNhcmlhX21vZHVsYXRpb25cIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluY2x1ZGU6IFwiI2FyaWFfY3VydmVzXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpbmNsdWRlOiBcIiNhcmlhX2VmZmVjdHNcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNjb21tZW50XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi5jb21tZW50LnNmelwiLFxuICAgICAgICByZWdleDogL1xcL1xcKi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLmNvbW1lbnQuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcKlxcLy8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcImNvbW1lbnQuYmxvY2suc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJwdW5jdHVhdGlvbi53aGl0ZXNwYWNlLmNvbW1lbnQubGVhZGluZy5zZnpcIixcbiAgICAgICAgICBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uY29tbWVudC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oKD86W1xcc10rKT8pKFxcL1xcLykoPzpcXHMqKD89XFxzfCQpKT8vLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwiY29tbWVudC5saW5lLmRvdWJsZS1zbGFzaC5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvKD89JCkvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJjb21tZW50LmxpbmUuZG91YmxlLXNsYXNoLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaGVhZGVyc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRhZy5iZWdpbi5zZnpcIixcbiAgICAgICAgICBcImtleXdvcmQuY29udHJvbC4kMi5zZnpcIixcbiAgICAgICAgICBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGFnLmJlZ2luLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg8KShjb250cm9sfGdsb2JhbHxtYXN0ZXJ8Z3JvdXB8cmVnaW9ufGN1cnZlfGVmZmVjdHxtaWRpKSg+KS8sXG4gICAgICAgIGNvbW1lbnQ6IFwiSGVhZGVyc1wiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLzwuKig/ISg/OmNvbnRyb2x8Z2xvYmFsfG1hc3Rlcnxncm91cHxyZWdpb258Y3VydmV8ZWZmZWN0fG1pZGkpKT4vLFxuICAgICAgICBjb21tZW50OiBcIk5vbi1jb21wbGlhbnQgaGVhZGVyc1wiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejFfc291bmQtc291cmNlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS4kMS5zZnpcIixcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC9cXGIoc2FtcGxlKSg9PykvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogLyg/PSg/Olxcc1xcL1xcL3wkKSkvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzYW1wbGUpOiAoYW55IHN0cmluZylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJkZWxheSg/Ol9yYW5kb218X29uY2NcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0xMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGRlbGF5fGRlbGF5X3JhbmRvbXxkZWxheV9vbmNjTik6ICgwIHRvIDEwMCBwZXJjZW50KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYm9mZnNldCg/Ol9yYW5kb218X29uY2NcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X3Bvc2l0aXZlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChvZmZzZXR8b2Zmc2V0X3JhbmRvbXxvZmZzZXRfb25jY04pOiAoMCB0byA0Mjk0OTY3Mjk2IHNhbXBsZSB1bml0cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJlbmRcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVfb3JfbmVnMVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGVuZCk6ICgtMSB0byA0Mjk0OTY3Mjk2IHNhbXBsZSB1bml0cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJjb3VudFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGNvdW50KTogKDAgdG8gNDI5NDk2NzI5NiBsb29wcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJsb29wX21vZGVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfbG9vcF9tb2RlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChsb29wX21vZGUpOiAobm9fbG9vcHxvbmVfc2hvdHxsb29wX2NvbnRpbnVvdXN8bG9vcF9zdXN0YWluKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/Omxvb3Bfc3RhcnR8bG9vcF9lbmQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X3Bvc2l0aXZlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChsb29wX3N0YXJ0fGxvb3BfZW5kKTogKDAgdG8gNDI5NDk2NzI5NiBzYW1wbGUgdW5pdHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5zb3VuZC1zb3VyY2UuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86c3luY19iZWF0c3xzeW5jX29mZnNldClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTMyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoc3luY19iZWF0c3xzeW5jX29mZnNldCk6ICgwIHRvIDMyIGJlYXRzKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejFfaW5zdHJ1bWVudC1zZXR0aW5nc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3MuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86Z3JvdXB8cG9seXBob255X2dyb3VwfG9mZl9ieSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGdyb3VwfHBvbHlwaG9ueV9ncm91cHxvZmZfYnkpOiAoMCB0byA0Mjk0OTY3Mjk2IHNhbXBsZSB1bml0cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3MuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxib2ZmX21vZGVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfZmFzdC1ub3JtYWwtdGltZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG9mZl9tb2RlKTogKGZhc3R8bm9ybWFsKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJvdXRwdXRcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMDI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAob3V0cHV0KTogKDAgdG8gMTAyNCBNSURJIE5vZGVzKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejFfcmVnaW9uLWxvZ2ljXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLmtleS1tYXBwaW5nLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmtleXxsb2tleXxoaWtleSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdfb3Jfc3RyaW5nX25vdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGtleXxsb2tleXxoaWtleSk6ICgwIHRvIDEyNyBNSURJIE5vdGUgb3IgQy0xIHRvIEcjOSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLmtleS1tYXBwaW5nLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmxvdmVsfGhpdmVsKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxvdmV8aGl2ZWwpOiAoMCB0byAxMjcgTUlESSBWZWxvY2l0eSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9jaGFufGhpY2hhbilcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMS0xNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxvY2hhbnxoaWNoYW4pOiAoMSB0byAxNiBNSURJIENoYW5uZWwpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMubWlkaS1jb25kaXRpb25zLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmxvfGhpKWNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxvY2NOfGhpY2NOKTogKDAgdG8gMTI3IE1JREkgQ29udHJvbGxlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9iZW5kfGhpYmVuZClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfbmVnODE5Mi04MTkyXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG9iZW5kfGhpYmVuZCk6ICgtODE5MiB0byA4MTkyIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJzd18oPzpsb2tleXxoaWtleXxsYXN0fGRvd258dXB8cHJldmlvdXMpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3X29yX3N0cmluZ19ub3RlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChzd19sb2tleXxzd19oaWtleXxzd19sYXN0fHN3X2Rvd258c3dfdXB8c3dfcHJldmlvdXMpOiAoMCB0byAxMjcgTUlESSBOb3RlIG9yIEMtMSB0byBHIzkgTm90ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxic3dfdmVsXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2N1cnJlbnQtcHJldmlvdXNcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzd192ZWwpOiAoY3VycmVudHxwcmV2aW91cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5pbnRlcm5hbC1jb25kaXRpb25zLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmxvYnBtfGhpYnBtKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtNTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG9icG18aGlicG0pOiAoMCB0byA1MDAgQlBNKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLmludGVybmFsLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9jaGFuYWZ0fGhpY2hhbmFmdHxsb3BvbHlhZnR8aGlwb2x5YWZ0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAobG9jaGFuYWZ0fGhpY2hhbmFmdHxsb3BvbHlhZnR8aGlwb2x5YWZ0KTogKDAgdG8gMTI3IE1JREkgQ29udHJvbGxlcilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5pbnRlcm5hbC1jb25kaXRpb25zLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmxvcmFuZHxoaXJhbmQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0xXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG9yYW5kfGhpcmFuZCk6ICgwIHRvIDEgZmxvYXQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5yZWdpb24tbG9naWMuaW50ZXJuYWwtY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpzZXFfbGVuZ3RofHNlcV9wb3NpdGlvbilcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMS0xMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzZXFfbGVuZ3RofHNlcV9wb3NpdGlvbik6ICgxIHRvIDEwMCBiZWF0cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy50cmlnZ2Vycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJ0cmlnZ2VyXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2F0dGFjay1yZWxlYXNlLWZpcnN0LWxlZ2F0b1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHRyaWdnZXIpOiAoYXR0YWNrfHJlbGVhc2V8Zmlyc3R8bGVnYXRvKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLnRyaWdnZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYm9uXyg/OmxvfGhpKWNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG9uX2xvY2NOfG9uX2hpY2NOKTogKC0xIHRvIDEyNyBNSURJIENvbnRyb2xsZXIpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6MV9wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86cGFufHBvc2l0aW9ufHdpZHRofGFtcF92ZWx0cmFjaylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcxMDAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChwYW58cG9zaXRpb258d2lkdGh8YW1wX3ZlbHRyYWNrKTogKC0xMDAgdG8gMTAwIHBlcmNlbnQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJ2b2x1bWVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcxNDQtNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHZvbHVtZSk6ICgtMTQ0IHRvIDYgZEIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJhbXBfa2V5Y2VudGVyXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3X29yX3N0cmluZ19ub3RlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChhbXBfa2V5Y2VudGVyKTogKDAgdG8gMTI3IE1JREkgTm90ZSBvciBDLTEgdG8gRyM5IE5vdGUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJhbXBfa2V5dHJhY2tcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWc5Ni0xMlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGFtcF9rZXl0cmFjayk6ICgtOTYgdG8gMTIgZEIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJhbXBfdmVsY3VydmVfKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGFtcF92ZWxjdXJ2ZV9OKTogKDAgdG8gMSBjdXJ2ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmFtcF9yYW5kb21cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTI0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYW1wX3JhbmRvbSk6ICgwIHRvIDI0IGRCKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZ2Fpbl9vbmNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzE0NC00OFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGdhaW5fb25jY04pOiAoLTE0NCB0byA0OCBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnJ0X2RlY2F5XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0yMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChydF9kZWNheSk6ICgwIHRvIDIwMCBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OnhmX2NjY3VydmV8eGZfa2V5Y3VydmV8eGZfdmVsY3VydmUpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2dhaW4tcG93ZXJcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6ICh4Zl9jY2N1cnZlfHhmX2tleWN1cnZlfHhmX3ZlbGN1cnZlKTogKGdhaW58cG93ZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/OnhmaW5fbG9jYyg/OlxcZHsxLDN9KT98eGZpbl9oaWNjKD86XFxkezEsM30pP3x4Zm91dF9sb2NjKD86XFxkezEsM30pP3x4Zm91dF9oaWNjKD86XFxkezEsM30pP3x4ZmluX2xva2V5fHhmaW5faGlrZXl8eGZvdXRfbG9rZXl8eGZvdXRfaGlrZXl8eGZpbl9sb3ZlbHx4ZmluX2hpdmVsfHhmb3V0X2xvdmVsfHhmb3V0X2hpdmVsKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoeGZpbl9sb2NjTnx4ZmluX2hpY2NOfHhmb3V0X2xvY2NOfHhmb3V0X2hpY2NOfHhmaW5fbG9rZXl8eGZpbl9oaWtleXx4Zm91dF9sb2tleXx4Zm91dF9oaWtleXx4ZmluX2xvdmVsfHhmaW5faGl2ZWx8eGZvdXRfbG92ZWx8eGZvdXRfaGl2ZWwpOiAoMCB0byAxMjcgTUlESSBWZWxvY2l0eSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OnhmaW5fbG9rZXl8eGZpbl9oaWtleXx4Zm91dF9sb2tleXx4Zm91dF9oaWtleSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdfb3Jfc3RyaW5nX25vdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKHhmaW5fbG9rZXl8eGZpbl9oaWtleXx4Zm91dF9sb2tleXx4Zm91dF9oaWtleSk6ICgwIHRvIDEyNyBNSURJIE5vdGUgb3IgQy0xIHRvIEcjOSBOb3RlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpiZW5kX3VwfGJlbmRfZG93bnxwaXRjaF92ZWx0cmFjaylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfbmVnOTYwMC05NjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChiZW5kX3VwfGJlbmRfZG93bnxwaXRjaF92ZWx0cmFjayk6ICgtOTYwMCB0byA5NjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5waXRjaC4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJiZW5kX3N0ZXBcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMS0xMjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYmVuZF9zdGVwKTogKDEgdG8gMTIwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxicGl0Y2hfa2V5Y2VudGVyXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3X29yX3N0cmluZ19ub3RlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocGl0Y2hfa2V5Y2VudGVyKTogKDAgdG8gMTI3IE1JREkgTm90ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxicGl0Y2hfa2V5dHJhY2tcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfbmVnMTIwMC0xMjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocGl0Y2hfa2V5dHJhY2spOiAoLTEyMDAgdG8gMTIwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxicGl0Y2hfcmFuZG9tXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHBpdGNoX3JhbmRvbSk6ICgwIHRvIDk2MDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLnBpdGNoLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnRyYW5zcG9zZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxMjctMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodHJhbnNwb3NlKTogKC0xMjcgdG8gMTI3IE1JREkgTm90ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxidHVuZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWc5NjAwLTk2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6ICh0dW5lKTogKC0yNDAwIHRvIDI0MDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiY3V0b2ZmXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChjdXRvZmYpOiAoMCB0byBhcmJpdHJhcnkgSHopXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86Y3V0b2ZmX29uY2MoPzpcXGR7MSwzfSk/fGN1dG9mZl9jaGFuYWZ0fGN1dG9mZl9wb2x5YWZ0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWc5NjAwLTk2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGN1dG9mZl9vbmNjTnxjdXRvZmZfY2hhbmFmdHxjdXRvZmZfcG9seWFmdCk6ICgtOTYwMCB0byA5NjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5maWx0ZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmZpbF9rZXl0cmFja1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChmaWxfa2V5dHJhY2spOiAoMCB0byAxMjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5maWx0ZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmZpbF9rZXljZW50ZXJcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdfb3Jfc3RyaW5nX25vdGVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChmaWxfa2V5Y2VudGVyKTogKDAgdG8gMTI3IE1JREkgTm90ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZmlsdGVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJmaWxfcmFuZG9tXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGZpbF9yYW5kb20pOiAoMCB0byA5NjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5maWx0ZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmZpbF90eXBlXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2xwZi1ocGYtYnBmLWJyZlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoZmlsX3R5cGUpOiAobHBmXzFwfGhwZl8xcHxscGZfMnB8aHBmXzJwfGJwZl8ycHxicmZfMnApXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZmlsX3ZlbHRyYWNrXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50X25lZzk2MDAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGZpbF92ZWx0cmFjayk6ICgtOTYwMCB0byA5NjAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5maWx0ZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnJlc29uYW5jZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtNDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChyZXNvbmFuY2UpOiAoMCB0byA0MCBkQilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZXEuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86ZXExX2ZyZXF8ZXEyX2ZyZXF8ZXEzX2ZyZXEpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0zMDAwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGVxMV9mcmVxfGVxMl9mcmVxfGVxM19mcmVxKTogKDAgdG8gMzAwMDAgSHopXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmVxLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86ZXFbMS0zXV9mcmVxX29uY2MoPzpcXGR7MSwzfSk/fGVxMV92ZWwyZnJlcXxlcTJfdmVsMmZyZXF8ZXEzX3ZlbDJmcmVxKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzMwMDAwLTMwMDAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChlcTFfZnJlcV9vbmNjTnxlcTJfZnJlcV9vbmNjTnxlcTNfZnJlcV9vbmNjTnxlcTFfdmVsMmZyZXF8ZXEyX3ZlbDJmcmVxfGVxM192ZWwyZnJlcSk6ICgtMzAwMDAgdG8gMzAwMDAgSHopXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmVxLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmVxMV9id3xlcTJfYnd8ZXEzX2J3KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGVxMV9id3xlcTJfYnd8ZXEzX2J3KTogKDAuMDAwMSB0byA0IG9jdGF2ZXMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmVxLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86ZXFbMS0zXV9id19vbmNjKD86XFxkezEsM30pP3xlcTFfdmVsMmJ3fGVxMl92ZWwyYnd8ZXEzX3ZlbDJidylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWc0LTRcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGVxMV9id19vbmNjTnxlcTJfYndfb25jY058ZXEzX2J3X29uY2NOfGVxMV92ZWwyYnd8ZXEyX3ZlbDJid3xlcTNfdmVsMmJ3KTogKC0zMDAwMCB0byAzMDAwMCBIeilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuZXEuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86ZXFbMS0zXV8oPzp2ZWwyKT9nYWlufGVxWzEtM11fZ2Fpbl9vbmNjKD86XFxkezEsM30pPylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWc5Ni0yNFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoZXExX2dhaW58ZXEyX2dhaW58ZXEzX2dhaW58ZXExX2dhaW5fb25jY058ZXEyX2dhaW5fb25jY058ZXEzX2dhaW5fb25jY058ZXExX3ZlbDJnYWlufGVxMl92ZWwyZ2FpbnxlcTNfdmVsMmdhaW4pOiAoLTk2IHRvIDI0IGRCKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejFfbW9kdWxhdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24uZW52ZWxvcGUtZ2VuZXJhdG9ycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/OmFtcGVnfGZpbGVnfHBpdGNoZWcpXyg/Oig/OmF0dGFja3xkZWNheXxkZWxheXxob2xkfHJlbGVhc2V8c3RhcnR8c3VzdGFpbikoPzpfb25jYyg/OlxcZHsxLDN9KT8pP3x2ZWwyKD86YXR0YWNrfGRlY2F5fGRlbGF5fGhvbGR8cmVsZWFzZXxzdGFydHxzdXN0YWluKSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoYW1wZWdfZGVsYXlfb25jY058YW1wZWdfYXR0YWNrX29uY2NOfGFtcGVnX2hvbGRfb25jY058YW1wZWdfZGVjYXlfb25jY058YW1wZWdfcmVsZWFzZV9vbmNjTnxhbXBlZ192ZWwyZGVsYXl8YW1wZWdfdmVsMmF0dGFja3xhbXBlZ192ZWwyaG9sZHxhbXBlZ192ZWwyZGVjYXl8YW1wZWdfdmVsMnJlbGVhc2V8cGl0Y2hlZ192ZWwyZGVsYXl8cGl0Y2hlZ192ZWwyYXR0YWNrfHBpdGNoZWdfdmVsMmhvbGR8cGl0Y2hlZ192ZWwyZGVjYXl8cGl0Y2hlZ192ZWwycmVsZWFzZXxmaWxlZ192ZWwyZGVsYXl8ZmlsZWdfdmVsMmF0dGFja3xmaWxlZ192ZWwyaG9sZHxmaWxlZ192ZWwyZGVjYXl8ZmlsZWdfdmVsMnJlbGVhc2UpOiAoMCB0byAxMDAgc2Vjb25kcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24uZW52ZWxvcGUtZ2VuZXJhdG9ycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/OnBpdGNoZWdfZGVwdGh8ZmlsZWdfZGVwdGh8cGl0Y2hlZ192ZWwyZGVwdGh8ZmlsZWdfdmVsMmRlcHRoKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxMjAwMC0xMjAwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAocGl0Y2hlZ19kZXB0aHxmaWxlZ19kZXB0aHxwaXRjaGVnX3ZlbDJkZXB0aHxmaWxlZ192ZWwyZGVwdGgpOiAoLTEyMDAwIHRvIDEyMDAwIGNlbnRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiYW1wbGZvXyg/OmRlcHRoKD86Y2MoPzpcXGR7MSwzfSk/KT98ZGVwdGgoPzpjaGFufHBvbHkpYWZ0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzIwLTIwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChhbXBsZm9fZGVwdGh8YW1wbGZvX2RlcHRoY2NOfGFtcGxmb19kZXB0aGNoYW5hZnR8YW1wbGZvX2RlcHRocG9seWFmdCk6ICgtMjAgdG8gMjAgZEIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/OmZpbGxmb3xwaXRjaGxmbylfKD86ZGVwdGgoPzooPzpfb24pP2NjKD86XFxkezEsM30pPyk/fGRlcHRoKD86Y2hhbnxwb2x5KWFmdClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfbmVnMTIwMC0xMjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChwaXRjaGxmb19kZXB0aHxwaXRjaGxmb19kZXB0aGNjTnxwaXRjaGxmb19kZXB0aGNoYW5hZnR8cGl0Y2hsZm9fZGVwdGhwb2x5YWZ0fGZpbGxmb19kZXB0aHxmaWxsZm9fZGVwdGhjY058ZmlsbGZvX2RlcHRoY2hhbmFmdHxmaWxsZm9fZGVwdGhwb2x5YWZ0KTogKC0xMjAwIHRvIDEyMDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/Oig/OmFtcGxmb3xmaWxsZm98cGl0Y2hsZm8pXyg/OmZyZXF8KD86Y2MoPzpcXGR7MSwzfSk/KT8pfGZyZXEoPzpjaGFufHBvbHkpYWZ0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzIwMC0yMDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGFtcGxmb19mcmVxY2NOfGFtcGxmb19mcmVxY2hhbmFmdHxhbXBsZm9fZnJlcXBvbHlhZnR8cGl0Y2hsZm9fZnJlcWNjTnxwaXRjaGxmb19mcmVxY2hhbmFmdHxwaXRjaGxmb19mcmVxcG9seWFmdHxmaWxsZm9fZnJlcWNjTnxmaWxsZm9fZnJlcWNoYW5hZnR8ZmlsbGZvX2ZyZXFwb2x5YWZ0KTogKC0yMDAgdG8gMjAwIEh6KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86YW1wbGZvfGZpbGxmb3xwaXRjaGxmbylfKD86ZGVsYXl8ZmFkZSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoYW1wbGZvX2RlbGF5fGFtcGxmb19mYWRlfHBpdGNobGZvX2RlbGF5fHBpdGNobGZvX2ZhZGV8ZmlsbGZvX2RlbGF5fGZpbGxmb19mYWRlKTogKDAgdG8gMTAwIHNlY29uZHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzphbXBsZm9fZnJlcXxwaXRjaGxmb19mcmVxfGZpbGxmb19mcmVxKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGFtcGxmb19mcmVxfHBpdGNobGZvX2ZyZXF8ZmlsbGZvX2ZyZXEpOiAoMCB0byAyMCBIeilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzZnoxX2VmZmVjdHNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5lZmZlY3RzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/OmVmZmVjdDF8ZWZmZWN0MilcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGVmZmVjdDF8ZWZmZWN0Mik6ICgwIHRvIDEwMCBwZXJjZW50KVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejJfZGlyZWN0aXZlc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJtZXRhLnByZXByb2Nlc3Nvci5kZWZpbmUuc2Z6XCIsXG4gICAgICAgICAgXCJtZXRhLmdlbmVyaWMuZGVmaW5lLnNmelwiLFxuICAgICAgICAgIFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi52YXJpYWJsZS5zZnpcIixcbiAgICAgICAgICBcIm1ldGEucHJlcHJvY2Vzc29yLnN0cmluZy5zZnpcIixcbiAgICAgICAgICBcIm1ldGEuZ2VuZXJpYy5kZWZpbmUuc2Z6XCIsXG4gICAgICAgICAgXCJtZXRhLnByZXByb2Nlc3Nvci5zdHJpbmcuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKFxcI2RlZmluZSkoXFxzKykoXFwkKShbXlxcc10rKShcXHMrKSguKylcXGIvLFxuICAgICAgICBjb21tZW50OiBcIiNkZWZpbmUgc3RhdGVtZW50XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwibWV0YS5wcmVwcm9jZXNzb3IuaW1wb3J0LnNmelwiLFxuICAgICAgICAgIFwibWV0YS5nZW5lcmljLmluY2x1ZGUuc2Z6XCIsXG4gICAgICAgICAgXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5zZnpcIixcbiAgICAgICAgICBcIm1ldGEucHJlcHJvY2Vzc29yLnN0cmluZy5zZnpcIixcbiAgICAgICAgICBcIm1ldGEucHJlcHJvY2Vzc29yLnN0cmluZy5zZnpcIixcbiAgICAgICAgICBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oXFwjaW5jbHVkZSkoXFxzKykoXCIpKC4rKSg/PVxcLnNmeikoXFwuc2Z6aD8pKFwiKS8sXG4gICAgICAgIGNvbW1lbnQ6IFwiI2luY2x1ZGUgc3RhdGVtZW50XCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5vdGhlci5jb25zdGFudC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXCRbXlxcc1xcPV0rLyxcbiAgICAgICAgY29tbWVudDogXCJkZWZpbmVkIHZhcmlhYmxlXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc2Z6Ml9zb3VuZC1zb3VyY2VcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLiQxLnNmelwiLFxuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogL1xcYihkZWZhdWx0X3BhdGgpKD0/KS8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvKD89KD86XFxzXFwvXFwvfCQpKS8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGRlZmF1bHRfcGF0aCk6IGFueSBzdHJpbmdcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS5zYW1wbGUtcGxheWJhY2suJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZGlyZWN0aW9uXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2ZvcndhcmQtcmV2ZXJzZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGRpcmVjdGlvbik6IChmb3J3YXJkfHJldmVyc2UpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5zb3VuZC1zb3VyY2Uuc2FtcGxlLXBsYXliYWNrLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmxvb3BfY291bnRcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsb29wX2NvdW50KTogKDAgdG8gNDI5NDk2NzI5NiBsb29wcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnNvdW5kLXNvdXJjZS5zYW1wbGUtcGxheWJhY2suJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxibG9vcF90eXBlXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2ZvcndhcmQtYmFja3dhcmQtYWx0ZXJuYXRlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobG9vcF90eXBlKTogKGZvcndhcmR8YmFja3dhcmR8YWx0ZXJuYXRlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2Uuc291bmQtc291cmNlLnNhbXBsZS1wbGF5YmFjay4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJtZDVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfbWQ1XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobWQ1KTogKDEyOC1iaXQgaGV4IG1kNSBoYXNoKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejJfaW5zdHJ1bWVudC1zZXR0aW5nc1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3MuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxib2N0YXZlX29mZnNldFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxMC0xMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG9jdGF2ZV9vZmZzZXQpOiAoLTEwIHRvIDEwIG9jdGF2ZXMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC9cXGIocmVnaW9uX2xhYmVsfGxhYmVsX2NjKD86XFxkezEsM30pPykoPT8pLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC8oPz0oPzpcXHNcXC9cXC98JCkpLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocmVnaW9uX2xhYmVsfGxhYmVsX2NjTik6IChhbnkgc3RyaW5nKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJzZXRfY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoc2V0X2NjTik6ICgwIHRvIDEyNyBNSURJIENvbnRyb2xsZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLnZvaWNlLWxpZmVjeWNsZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpwb2x5cGhvbnl8bm90ZV9wb2x5cGhvbnkpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtMTI3XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocG9seXBob255fG5vdGVfcG9seXBob255KTogKDAgdG8gMTI3IHZvaWNlcylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3Mudm9pY2UtbGlmZWN5Y2xlLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/Om5vdGVfc2VsZm1hc2t8cnRfZGVhZClcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfb24tb2ZmXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobm90ZV9zZWxmbWFza3xydF9kZWFkKTogKG9ufG9mZilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzZnoyX3JlZ2lvbi1sb2dpY1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86c3VzdGFpbl9zd3xzb3N0ZW51dG9fc3cpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX29uLW9mZlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHN1c3RhaW5fc3d8c29zdGVudXRvX3N3KTogKG9ufG9mZilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bG9wcm9nfGhpcHJvZylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsb3Byb2d8aGlwcm9nKTogKDAgdG8gMTI3IE1JREkgcHJvZ3JhbSlcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzZnoyX3BlcmZvcm1hbmNlLXBhcmFtZXRlcnNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJ2b2x1bWVfb25jYyg/OlxcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9uZWcxNDQtNlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHZvbHVtZV9vbmNjTik6ICgtMTQ0IHRvIDYgZEIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJwaGFzZVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19ub3JtYWwtaW52ZXJ0XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocGhhc2UpOiAobm9ybWFsfGludmVydClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVyLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYndpZHRoX29uY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMTAwLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHdpZHRoX29uY2NOKTogKC0xMDAgdG8gMTAwIHBlcmNlbnQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLnBpdGNoLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmJlbmRfc21vb3RoXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjaW50XzAtOTYwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGJlbmRfc21vb3RoKTogKDAgdG8gOTYwMCBjZW50cylcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMucGl0Y2guJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86YmVuZF9zdGVwdXB8YmVuZF9zdGVwZG93bilcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMS0xMjAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYmVuZF9zdGVwdXB8YmVuZF9zdGVwZG93bik6ICgxIHRvIDEyMDAgY2VudHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86Y3V0b2ZmMnxjdXRvZmYyX29uY2MoPzpcXGR7MSwzfSk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X3Bvc2l0aXZlXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoY3V0b2ZmMnxjdXRvZmYyX29uY2NOKTogKDAgdG8gYXJiaXRyYXJ5IEh6KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5maWx0ZXJzLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86cmVzb25hbmNlX29uY2MoPzpcXGR7MSwzfSk/fHJlc29uYW5jZTJ8cmVzb25hbmNlMl9vbmNjKD86XFxkezEsM30pPylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTQwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChyZXNvbmFuY2Vfb25jY058cmVzb25hbmNlMnxyZXNvbmFuY2UyX29uY2NOKTogKDAgdG8gNDAgZEIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmZpbHRlcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiZmlsMl90eXBlXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2xwZi1ocGYtYnBmLWJyZlwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoZmlsMl90eXBlKTogKGxwZl8xcHxocGZfMXB8bHBmXzJwfGhwZl8ycHxicGZfMnB8YnJmXzJwKVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejJfbW9kdWxhdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24uZW52ZWxvcGUtZ2VuZXJhdG9ycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJlZ1xcZHsyfV8oPzpjdXJ2ZXxsb29wfHBvaW50c3xzdXN0YWluKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9wb3NpdGl2ZVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGVnTl8oY3VydmV8bG9vcHxwb2ludHN8c3VzdGFpbikpOiAocG9zaXRpdmUgaW50KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmVnXFxkezJ9X2xldmVsXFxkKig/Ol9vbmNjKD86XFxkezEsM30pPyk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMS0xXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZWdOX2xldmVsfGVnTl9sZXZlbF9vbmNjWCk6ICgtMSB0byAxIGZsb2F0KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmVnXFxkezJ9X3NoYXBlXFxkK1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzEwLTEwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoZWdOX3NoYXBlWCk6ICgtMTAgdG8gMTAgbnVtYmVyKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmVnXFxkezJ9X3RpbWVcXGQqKD86X29uY2MoPzpcXGR7MSwzfSk/KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGVnTl90aW1lfGVnTl90aW1lX29uY2NYKTogKDAgdG8gMTAwIHNlY29uZHMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJsZm9cXGR7Mn1fKD86d2F2ZXxjb3VudHxmcmVxXyg/OnNtb290aHxzdGVwKWNjKD86XFxkezEsM30pPylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGxmb05fd2F2ZXxsZm9OX2NvdW50fGxmb05fZnJlcXxsZm9OX2ZyZXFfb25jY1h8bGZvTl9mcmVxX3Ntb290aGNjWCk6IChwb3NpdGl2ZSBpbnQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmxmby4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJsZm9cXGR7Mn1fZnJlcSg/Ol9vbmNjKD86XFxkezEsM30pPyk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMjAtMjBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChsZm9OX2ZyZXF8bGZvTl9mcmVxX29uY2NOKTogKC0yMCB0byAyMCBIeilcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYig/Omxmb1xcZHsyfV8oPzpkZWxheXxmYWRlKSg/Ol9vbmNjKD86XFxkezEsM30pPyk/fGNvdW50KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMTAwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChsZm9OX2RlbGF5fGxmb05fZGVsYXlfb25jY1h8bGZvTl9mYWRlfGxmb05fZmFkZV9vbmNjWCk6ICgwIHRvIDEwMCBzZWNvbmRzKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86bGZvXFxkezJ9X3BoYXNlKD86X29uY2MoPzpcXGR7MSwzfSk/KT98Y291bnQpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfMC0xXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAobGZvTl9waGFzZXxsZm9OX3BoYXNlX29uY2NYKTogKDAgdG8gMSBudW1iZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5tb2R1bGF0aW9uLmVudmVsb3BlLWdlbmVyYXRvcnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGJlZ1xcZHsyfV8oPzooPzpkZXB0aF9sZm98ZGVwdGhhZGRfbGZvfGZyZXFfbGZvKXwoPzphbXBsaXR1ZGV8ZGVwdGh8ZGVwdGhfbGZvfGRlcHRoYWRkX2xmb3xmcmVxX2xmb3xwaXRjaHxjdXRvZmYyP3xlcVsxLTNdZnJlcXxlcVsxLTNdYnd8ZXFbMS0zXWdhaW58cGFufHJlc29uYW5jZTI/fHZvbHVtZXx3aWR0aCkoPzpfb25jYyg/OlxcZHsxLDN9KT8pPylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9hbnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChvdGhlciBlZyBkZXN0aW5hdGlvbnMpOiAoYW55IGZsb2F0KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGJsZm9cXGR7Mn1fKD86KD86ZGVwdGhfbGZvfGRlcHRoYWRkX2xmb3xmcmVxX2xmbyl8KD86YW1wbGl0dWRlfGRlY2ltfGJpdHJlZHxkZXB0aF9sZm98ZGVwdGhhZGRfbGZvfGZyZXFfbGZvfHBpdGNofGN1dG9mZjI/fGVxWzEtM11mcmVxfGVxWzEtM11id3xlcVsxLTNdZ2FpbnxwYW58cmVzb25hbmNlMj98dm9sdW1lfHdpZHRoKSg/Ol9vbmNjKD86XFxkezEsM30pPyk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X2FueVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKG90aGVyIGxmbyBkZXN0aW5hdGlvbnMpOiAoYW55IGZsb2F0KVwiLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3NmejJfY3VydmVzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuY3VydmVzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnZbMC05XXszfVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0XzAtMVwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHZOKTogKDAgdG8gMSBudW1iZXIpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjYXJpYV9pbnN0cnVtZW50LXNldHRpbmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJoaW50X1tBLXpfXSpcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9hbnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChoaW50Xyk6IChhbnkgbnVtYmVyKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpzZXRffGxvfGhpKWhkY2MoPzpcXGR7MSwzfSk/XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfYW55XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoc2V0X2hkY2NOfGxvaGRjY058aGloZGNjTik6IChhbnkgbnVtYmVyKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UuaW5zdHJ1bWVudC1zZXR0aW5ncy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpzdXN0YWluX2NjfHNvc3RlbnV0b19jY3xzdXN0YWluX2xvfHNvc3RlbnV0b19sbylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfMC0xMjdcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKHN1c3RhaW5fY2N8c29zdGVudXRvX2NjfHN1c3RhaW5fbG98c29zdGVudXRvX2xvKTogKDAgdG8gMTI3IE1JREkgYnl0ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLmluc3RydW1lbnQtc2V0dGluZ3MuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxic3dfb2N0YXZlX29mZnNldFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9uZWcxMC0xMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHN3X29jdGF2ZV9vZmZzZXQpOiAoLTEwIHRvIDEwIG9jdGF2ZXMpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLnZvaWNlLWxpZmVjeWNsZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJvZmZfY3VydmVcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChvZmZfY3VydmUpOiAoMCB0byBhbnkgY3VydmUpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5pbnN0cnVtZW50LXNldHRpbmdzLnZvaWNlLWxpZmVjeWNsZS4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzpvZmZfc2hhcGV8b2ZmX3RpbWUpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfbmVnMTAtMTBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChvZmZfc2hhcGV8b2ZmX3RpbWUpOiAoLTEwIHRvIDEwIG51bWJlcilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNhcmlhX3JlZ2lvbi1sb2dpY1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiKD86c3dfZGVmYXVsdHxzd19sb2xhc3R8c3dfaGlsYXN0KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoc3dfZGVmYXVsdHxzd19sb2xhc3R8c3dfaGlsYXN0KTogKDAgdG8gMTI3IE1JREkgTm90ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxic3dfbGFiZWxcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfYW55X2NvbnRpbnVvdXNcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChzd19sYWJlbCk6IChhbnkgc3RyaW5nKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucmVnaW9uLWxvZ2ljLm1pZGktY29uZGl0aW9ucy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJ2YXJcXGR7Mn1fY3VydmVjYyg/OlxcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6ICh2YXJOTl9jdXJ2ZWNjWCk6ICgwIHRvIGFueSBjdXJ2ZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxidmFyXFxkezJ9X21vZFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19hZGQtbXVsdFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHZhck5OX21vZCk6IChhZGR8bXVsdClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnJlZ2lvbi1sb2dpYy5taWRpLWNvbmRpdGlvbnMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC9cXGIoPzp2YXJcXGR7Mn1fb25jYyg/OlxcZHsxLDN9KT98dmFyXFxkezJ9Xyg/OnBpdGNofGN1dG9mZnxyZXNvbmFuY2V8Y3V0b2ZmMnxyZXNvbmFuY2UyfGVxWzEtM11mcmVxfGVxWzEtM11id3xlcVsxLTNdZ2Fpbnx2b2x1bWV8YW1wbGl0dWRlfHBhbnx3aWR0aCkpXFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjZmxvYXRfYW55XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAodmFyTk5fb25jY1h8dmFyTk5fdGFyZ2V0KTogKGFueSBmbG9hdClcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNhcmlhX3BlcmZvcm1hbmNlLXBhcmFtZXRlcnNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/OmFtcGxpdHVkZXxhbXBsaXR1ZGVfb25jYyg/OlxcZHsxLDN9KT98Z2xvYmFsX2FtcGxpdHVkZXxtYXN0ZXJfYW1wbGl0dWRlfGdyb3VwX2FtcGxpdHVkZSlcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF8wLTEwMFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6XG4gICAgICAgICAgXCJvcGNvZGVzOiAoYW1wbGl0dWRlfGFtcGxpdHVkZV9vbmNjTnxnbG9iYWxfYW1wbGl0dWRlfG1hc3Rlcl9hbXBsaXR1ZGV8Z3JvdXBfYW1wbGl0dWRlKTogKDAgdG8gMTAwIHBlcmNlbnQpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJhbXBsaXR1ZGVfY3VydmVjYyg/OlxcZHsxLDN9KT9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChhbXBsaXR1ZGVfY3VydmVjY04pOiAoYW55IHBvc2l0aXZlIGN1cnZlKVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UucGVyZm9ybWFuY2UtcGFyYW1ldGVycy5hbXBsaWZpZXIuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiYW1wbGl0dWRlX3Ntb290aGNjKD86XFxkezEsM30pP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTk2MDBcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChhbXBsaXR1ZGVfc21vb3RoY2NOKTogKDAgdG8gOTYwMCBudW1iZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5wZXJmb3JtYW5jZS1wYXJhbWV0ZXJzLmFtcGxpZmllci4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGJwYW5fbGF3XFxiLyxcbiAgICAgICAgcHVzaDogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgICAgcmVnZXg6IC9cXHN8JC8sXG4gICAgICAgICAgICBuZXh0OiBcInBvcFwiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgaW5jbHVkZTogXCIjc3RyaW5nX2JhbGFuY2UtbW1hXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAocGFuX2xhdyk6IChiYWxhbmNlfG1tYSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLnBlcmZvcm1hbmNlLXBhcmFtZXRlcnMuYW1wbGlmaWVycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgL1xcYig/Omdsb2JhbF92b2x1bWV8bWFzdGVyX3ZvbHVtZXxncm91cF92b2x1bWV8dm9sdW1lX29uY2MoPzpcXGR7MSwzfSk/KVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzE0NC02XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChnbG9iYWxfdm9sdW1lfG1hc3Rlcl92b2x1bWV8Z3JvdXBfdm9sdW1lfHZvbHVtZV9vbmNjTik6ICgtMTQ0IHRvIDYgZEIpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjYXJpYV9tb2R1bGF0aW9uXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5lbnZlbG9wZS1nZW5lcmF0b3JzLiQxLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvXFxiKD86YW1wZWdfYXR0YWNrX3NoYXBlfGFtcGVnX2RlY2F5X3NoYXBlfGFtcGVnX3JlbGVhc2Vfc2hhcGV8ZWdcXGR7Mn1fc2hhcGVcXGQrKVxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2Zsb2F0X25lZzEwLTEwXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDpcbiAgICAgICAgICBcIm9wY29kZXM6IChhbXBlZ19hdHRhY2tfc2hhcGV8YW1wZWdfZGVjYXlfc2hhcGV8YW1wZWdfcmVsZWFzZV9zaGFwZXxlZ05fc2hhcGVYKTogKC0xMCB0byAxMCBmbG9hdClcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24uZW52ZWxvcGUtZ2VuZXJhdG9ycy4kMS5zZnpcIixcbiAgICAgICAgcmVnZXg6IC9cXGIoPzphbXBlZ19yZWxlYXNlX3plcm98YW1wZWdfZGVjYXlfemVybylcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNzdHJpbmdfb24tb2ZmXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBkZWZhdWx0VG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgICAgY29tbWVudDogXCJvcGNvZGVzOiAoYW1wZWdfcmVsZWFzZV96ZXJvfGFtcGVnX2RlY2F5X3plcm8pOiAodHJ1ZXxmYWxzZSlcIixcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcInZhcmlhYmxlLmxhbmd1YWdlLm1vZHVsYXRpb24ubGZvLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYmxmb1xcZHsyfV8oPzpvZmZzZXR8cmF0aW98c2NhbGUpMj9cXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNmbG9hdF9hbnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OlxuICAgICAgICAgIFwib3Bjb2RlczogKGxmb05fb2Zmc2V0fGxmb05fb2Zmc2V0MnxsZm9OX3JhdGlvfGxmb05fcmF0aW8yfGxmb05fc2NhbGV8bGZvTl9zY2FsZTIpOiAoYW55IGZsb2F0KVwiLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwidmFyaWFibGUubGFuZ3VhZ2UubW9kdWxhdGlvbi5sZm8uJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxibGZvXFxkezJ9X3dhdmUyP1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF8wLTEyN1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKGxmb05fd2F2ZXxsZm9OX3dhdjIpOiAoMCB0byAxMjcgTUlESSBOdW1iZXIpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjYXJpYV9jdXJ2ZXNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5jdXJ2ZXMuJDEuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvXFxiY3VydmVfaW5kZXhcXGIvLFxuICAgICAgICBwdXNoOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdG9rZW46IFwibWV0YS5vcGNvZGUuc2Z6XCIsXG4gICAgICAgICAgICByZWdleDogL1xcc3wkLyxcbiAgICAgICAgICAgIG5leHQ6IFwicG9wXCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBpbmNsdWRlOiBcIiNpbnRfcG9zaXRpdmVcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChjdXJ2ZV9pbmRleCk6IChhbnkgcG9zaXRpdmUgaW50ZWdlcilcIixcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNhcmlhX2VmZmVjdHNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5lZmZlY3RzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnBhcmFtX29mZnNldFxcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI2ludF9hbnlcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGRlZmF1bHRUb2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICBjb21tZW50OiBcIm9wY29kZXM6IChwYXJhbV9vZmZzZXQpOiAoYW55IGludGVnZXIpXCIsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJ2YXJpYWJsZS5sYW5ndWFnZS5lZmZlY3RzLiQxLnNmelwiLFxuICAgICAgICByZWdleDogL1xcYnZlbmRvcl9zcGVjaWZpY1xcYi8sXG4gICAgICAgIHB1c2g6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB0b2tlbjogXCJtZXRhLm9wY29kZS5zZnpcIixcbiAgICAgICAgICAgIHJlZ2V4OiAvXFxzfCQvLFxuICAgICAgICAgICAgbmV4dDogXCJwb3BcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIGluY2x1ZGU6IFwiI3N0cmluZ19hbnlfY29udGludW91c1wiLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgZGVmYXVsdFRva2VuOiBcIm1ldGEub3Bjb2RlLnNmelwiLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIGNvbW1lbnQ6IFwib3Bjb2RlczogKHZlbmRvcl9zcGVjaWZpYyk6IChhbnkgdG8gY29udGludW91cyBzdHJpbmcpXCIsXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMzAwMDAtMzAwMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtPyg/PCFcXC4pXFxiKD86MzAwMDB8KD86WzAtOV18WzEtOV1bMC05XXsxLDN9fDJbMC05XXs0fSkoPzpcXC5cXGQqKT8pXFxiKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPS0/KD88IVxcLilcXGIoPzozMDAwMHwoPzpbMC05XXxbMS05XVswLTldezEsM318MlswLTldezR9KSg/OlxcLlxcZCopPylcXGJcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMTQ0LTQ4XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPSkoLSg/PCFcXC4pKD86MTQ0fCg/OlsxLTldfFsxLThdWzAtOV18OVswLTldfDFbMC00XVswLTNdKSg/OlxcLlxcZCopPylcXGJ8XFxiKD88IVxcLikoPzo0OHwoPzpbMC05XXxbMS0zXVswLTldfDRbMC03XSkoPzpcXC5cXGQqKT8pXFxiKS8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/Oi0oPzwhXFwuKSg/OjE0NHwoPzpbMS05XXxbMS04XVswLTldfDlbMC05XXwxWzAtNF1bMC0zXSkoPzpcXC5cXGQqKT8pXFxifFxcYig/PCFcXC4pKD86NDh8KD86WzAtOV18WzEtM11bMC05XXw0WzAtN10pKD86XFwuXFxkKik/KVxcYikpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0X25lZzE0NC02XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPSkoLSg/PCFcXC4pKD86MTQ0fCg/OlsxLTldfFsxLThdWzAtOV18OVswLTldfDFbMC00XVswLTNdKSg/OlxcLlxcZCopPylcXGJ8XFxiKD88IVxcLikoPzo2fFswLTVdKD86XFwuXFxkKik/XFxiKSkvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzotKD88IVxcLikoPzoxNDR8KD86WzEtOV18WzEtOF1bMC05XXw5WzAtOV18MVswLTRdWzAtM10pKD86XFwuXFxkKik/KVxcYnxcXGIoPzwhXFwuKSg/OjZ8WzAtNV0oPzpcXC5cXGQqKT9cXGIpKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMjAwLTIwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtPyg/PCFcXC4pKD86MjAwfCg/OlswLTldfFsxLTldWzAtOV17MSwyfSkoPzpcXC5cXGQqKT8pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPS0/KD88IVxcLikoPzoyMDB8KD86WzAtOV18WzEtOV1bMC05XXsxLDJ9KSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMTAwLTEwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtPyg/PCFcXC4pKD86MTAwfCg/OlswLTldfFsxLTldWzAtOV0pKD86XFwuXFxkKik/KSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9LT8oPzwhXFwuKSg/OjEwMHwoPzpbMC05XXxbMS05XVswLTldKSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnOTYtMTJcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtKD88IVxcLikoPzo5NnwoPzpbMS05XXxbMS04XVswLTldfDlbMC01XSkoPzpcXC5cXGQqKT8pXFxifFxcYig/PCFcXC4pKD86MTJ8KD86WzAtOV18MVswMV0pKD86XFwuXFxkKik/XFxiKSkvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzotKD88IVxcLikoPzo5NnwoPzpbMS05XXxbMS04XVswLTldfDlbMC01XSkoPzpcXC5cXGQqKT8pXFxifFxcYig/PCFcXC4pKD86MTJ8KD86WzAtOV18MVswMV0pKD86XFwuXFxkKik/XFxiKSkpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0X25lZzk2LTI0XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPSkoLSg/PCFcXC4pKD86OTZ8KD86WzEtOV18WzEtOF1bMC05XXw5WzAtNV0pKD86XFwuXFxkKik/KVxcYnxcXGIoPzwhXFwuKSg/OjI0fCg/OlswLTldfDFbMC05XXwyWzAtM10pKD86XFwuXFxkKik/XFxiKSkvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzotKD88IVxcLikoPzo5NnwoPzpbMS05XXxbMS04XVswLTldfDlbMC01XSkoPzpcXC5cXGQqKT8pXFxifFxcYig/PCFcXC4pKD86MjR8KD86WzAtOV18MVswLTldfDJbMC0zXSkoPzpcXC5cXGQqKT9cXGIpKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMjAtMjBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT8oPzwhXFwuKSg/OjIwfDE/WzAtOV0oPzpcXC5cXGQqKT8pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tPyg/PCFcXC4pKD86MjB8MT9bMC05XSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMTAtMTBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT8oPzwhXFwuKSg/OjEwfFswLTldKD86XFwuXFxkKik/KSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9LT8oPzwhXFwuKSg/OjEwfFswLTldKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF9uZWc0LTRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT8oPzwhXFwuKSg/OjR8WzAtM10oPzpcXC5cXGQqKT8pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tPyg/PCFcXC4pKD86NHxbMC0zXSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfbmVnMS0xXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/KD88IVxcLikoPzoxfDAoPzpcXC5cXGQqKT8pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tPyg/PCFcXC4pKD86MXwwKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF8wLTFcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoPzwhXFwuKSgxfDAoPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/PCFcXC4pKD86MXwwKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF8wLTRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoPzwhXFwuKSg0fFswLTNdKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzwhXFwuKSg/OjR8WzAtM10oPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtMjBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoPzwhXFwuKSgyMHwoPzpbMC05XXwxWzAtOV0pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzwhXFwuKSg/OjI0fCg/OlswLTldfDFbMC05XSkoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtMjRcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoPzwhXFwuKSgyNHwoPzpbMC05XXwxWzAtOV18MlswLTNdKSg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD88IVxcLikoPzoyNHwoPzpbMC05XXwxWzAtOV18MlswLTNdKSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC0zMlwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDMyfCg/OlswLTldfDFbMC05XXwyWzAtOV18M1swLTFdKSg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzwhXFwuKSg/OjMyfCg/OlswLTldfDFbMC05XXwyWzAtOV18M1swLTFdKSg/OlxcLlxcZCopPylcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfMC00MFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDQwfCg/OlswLTldfFsxLTNdWzAtOV0pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzwhXFwuKSg/OjQwfCg/OlswLTldfFsxLTNdWzAtOV0pKD86XFwuXFxkKik/KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNmbG9hdF8wLTEwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSg/PCFcXC4pKDEwMHwoPzpbMC05XXxbMS05XVswLTldKSg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD88IVxcLikoPzoxMDB8KD86WzAtOV18WzEtOV1bMC05XSkoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtMjAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKD88IVxcLikoMjAwfCg/OlswLTldfFsxLTldWzAtOV18MVswLTldezJ9KSg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzwhXFwuKSg/OjIwMHwoPzpbMC05XXxbMS05XVswLTldfDFbMC05XXsyfSkoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtNTAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPSkoPzwhXFwuKSg1MDB8KD86WzAtOV18WzEtOF1bMC05XXw5WzAtOV18WzEtNF1bMC05XXsyfSkoPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9KD88IVxcLikoPzo1MDB8KD86WzAtOV18WzEtOF1bMC05XXw5WzAtOV18WzEtNF1bMC05XXsyfSkoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0XzAtMzAwMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSg/PCFcXC4pXFxiKDMwMDAwfCg/OlswLTldfFsxLTldWzAtOV17MSwzfXwyWzAtOV17NH0pKD86XFwuXFxkKik/KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/PCFcXC4pXFxiKD86MzAwMDB8KD86WzAtOV18WzEtOV1bMC05XXsxLDN9fDJbMC05XXs0fSkoPzpcXC5cXGQqKT8pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2Zsb2F0X3Bvc2l0aXZlXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKFxcZCsoPzpcXC5cXGQqKT8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPVxcZCsoPzpcXC5cXGQqKT9cXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjZmxvYXRfYW55XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/XFxiXFxkKyg/OlxcLlxcZCopPylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9LT9cXGJcXGQrKD86XFwuXFxkKik/XFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF9uZWcxMjAwMC0xMjAwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/XFxiKD86MTIwMDB8WzAtOV18WzEtOV1bMC05XXsxLDN9fDFbMDFdWzAtOV17M30pKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0tP1xcYig/OjEyMDAwfFswLTldfFsxLTldWzAtOV17MSwzfXwxWzAxXVswLTldezN9KVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfbmVnOTYwMC05NjAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg9KSgtPyg/OlswLTldfFsxLTldWzAtOV17MSwyfXxbMS04XVswLTldezN9fDlbMC01XVswLTldezJ9fDk2MDApKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPS0/KD86WzAtOV18WzEtOV1bMC05XXsxLDJ9fFsxLThdWzAtOV17M318OVswLTVdWzAtOV17Mn18OTYwMClcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X25lZzgxOTItODE5MlwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPSkoLT8oPzpbMC05XXxbMS05XVswLTldfFsxLTldWzAtOV17Mn18WzEtN11bMC05XXszfXw4MFswLTldezJ9fDgxWzAtOF1bMC05XXw4MTlbMC0yXSkpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9LT8oPzpbMC05XXxbMS05XVswLTldfFsxLTldWzAtOV17Mn18WzEtN11bMC05XXszfXw4MFswLTldezJ9fDgxWzAtOF1bMC05XXw4MTlbMC0yXSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X25lZzEyMDAtMTIwMFwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/XFxiKD86MTIwMHxbMC05XXxbMS05XVswLTldezEsMn18MVswMV1bMC05XXsyfSkpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPS0/XFxiKD86MTIwMHxbMC05XXxbMS05XVswLTldezEsMn18MVswMV1bMC05XXsyfSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X25lZzEwMC0xMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KSgtP1xcYig/OjEwMHxbMC05XXxbMS05XVswLTldKSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9LT9cXGIoPzoxMDB8WzAtOV18WzEtOV1bMC05XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X25lZzEwLTEwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoLT9cXGIoPzoxMHxbMC05XSkpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPS0/XFxiKD86MTB8WzAtOV0pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF9uZWcxLTEyN1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0xfFswLTldfFsxLThdWzAtOV18OVswLTldfDFbMDFdWzAtOV18MTJbMC03XSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86LTF8WzAtOV18WzEtOF1bMC05XXw5WzAtOV18MVswMV1bMC05XXwxMlswLTddKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfbmVnMTI3LTEyN1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/XFxiKD86WzAtOV18WzEtOF1bMC05XXw5WzAtOV18MVswMV1bMC05XXwxMlswLTddKSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0tP1xcYig/OlswLTldfFsxLThdWzAtOV18OVswLTldfDFbMDFdWzAtOV18MTJbMC03XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50XzAtMTI3XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoWzAtOV18WzEtOF1bMC05XXw5WzAtOV18MVswMV1bMC05XXwxMlswLTddKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzpbMC05XXxbMS04XVswLTldfDlbMC05XXwxWzAxXVswLTldfDEyWzAtN10pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF8wLTEyN19vcl9zdHJpbmdfbm90ZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPSkoKD86WzAtOV18WzEtOF1bMC05XXw5WzAtOV18MVswMV1bMC05XXwxMlswLTddKXxbY2RlZmdhYkNERUZHQUJdXFwjPyg/Oi0xfFswLTldKSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6XG4gICAgICAgICAgLyg/IT0oPzooPzpbMC05XXxbMS04XVswLTldfDlbMC05XXwxWzAxXVswLTldfDEyWzAtN10pfFtjZGVmZ2FiQ0RFRkdBQl1cXCM/KD86LTF8WzAtOV0pKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfMC0xMDI0XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICByZWdleDogLz0oPzpbMC05XXxbMS05XVswLTldfFsxLTldWzAtOV17Mn18MTBbMDFdWzAtOV18MTAyWzAtNF0pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OlxuICAgICAgICAgIC8oPyE9KD86WzAtOV18WzEtOV1bMC05XXxbMS05XVswLTldezJ9fDEwWzAxXVswLTldfDEwMlswLTRdKVxcYilbXlxcc10qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfMC0xMjAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcbiAgICAgICAgICBcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIixcbiAgICAgICAgICBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zZnpcIixcbiAgICAgICAgXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoMTIwMHxbMC05XXxbMS05XVswLTldezEsMn18MVswMV1bMC05ezJ9XSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86MTIwMHxbMC05XXxbMS05XVswLTldezEsMn18MVswMV1bMC05XXsyfV0pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF8wLTk2MDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1xuICAgICAgICAgIFwia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLFxuICAgICAgICAgIFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICBdLFxuICAgICAgICByZWdleDogLyg9KShbMC05XXxbMS05XVswLTldezEsMn18WzEtOF1bMC05XXszfXw5WzAtNV1bMC05XXsyfXw5NjAwKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDpcbiAgICAgICAgICAvKD8hPSg/OlswLTldfFsxLTldWzAtOV17MSwyfXxbMS04XVswLTldezN9fDlbMC01XVswLTldezJ9fDk2MDApXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF8xLTE2XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICByZWdleDogLz0oPzpbMS05XXwxWzAtNl0pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OlsxLTldfDFbMC02XSlcXGIpW15cXHNdKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50XzEtMTAwXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNmelwiLFxuICAgICAgICByZWdleDogLz0oPzoxMDB8WzEtOV18WzEtOV1bMC05XSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86MTAwfFsxLTldfFsxLTldWzAtOV0pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF8xLTEyMDBcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvPSg/OjEyMDB8WzAtOV18WzEtOV1bMC05XXsxLDJ9fDFbMDFdWzAtOV17Mn0pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OjEyMDB8WzAtOV18WzEtOV1bMC05XXsxLDJ9fDFbMDFdWzAtOV17Mn0pXFxiKVteXFxzXSovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI2ludF9wb3NpdGl2ZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKFxcZCspXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD86KD8hXFxkKykuKSokLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNpbnRfcG9zaXRpdmVfb3JfbmVnMVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0xfFxcZCspXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD86KD8hKD86LTF8XFxkKylcXGIpLikqJC8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjaW50X2FueVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXG4gICAgICAgICAgXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsXG4gICAgICAgICAgXCJjb25zdGFudC5udW1lcmljLmludGVnZXIuc2Z6XCIsXG4gICAgICAgIF0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKC0/XFxiXFxkKylcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPzooPyEtP1xcYlxcZCspLikqJC8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2FkZC1tdWx0XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShhZGR8bXVsdClcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86YWRkfG11bHQpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfYXR0YWNrLXJlbGVhc2UtZmlyc3QtbGVnYXRvXCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShhdHRhY2t8cmVsZWFzZXxmaXJzdHxsZWdhdG8pXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OmF0dGFja3xyZWxlYXNlfGZpcnN0fGxlZ2F0bykpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19iYWxhbmNlLW1tYVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoYmFsYW5jZXxtbWEpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OmJhbGFuY2V8bW1hKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2N1cnJlbnQtcHJldmlvdXNcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1wia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLCBcInN0cmluZy51bnF1b3RlZC5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKGN1cnJlbnR8cHJldmlvdXMpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OmN1cnJlbnR8cHJldmlvdXMpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfZmFzdC1ub3JtYWwtdGltZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoZmFzdHxub3JtYWx8dGltZSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86ZmFzdHxub3JtYWx8dGltZSkpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19mb3J3YXJkLWJhY2t3YXJkLWFsdGVybmF0ZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoZm9yd2FyZHxiYWNrd2FyZHxhbHRlcm5hdGUpXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OmZvcndhcmR8YmFja3dhcmR8YWx0ZXJuYXRlKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2ZvcndhcmQtcmV2ZXJzZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoZm9yd2FyZHxyZXZlcnNlKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzpmb3J3YXJkfHJldmVyc2UpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfZ2Fpbi1wb3dlclwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoZ2Fpbnxwb3dlcilcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86Z2Fpbnxwb3dlcikpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19sb29wX21vZGVcIjogW1xuICAgICAge1xuICAgICAgICB0b2tlbjogW1wia2V5d29yZC5vcGVyYXRvci5hc3NpZ25tZW50LnNmelwiLCBcInN0cmluZy51bnF1b3RlZC5zZnpcIl0sXG4gICAgICAgIHJlZ2V4OiAvKD0pKG5vX2xvb3B8b25lX3Nob3R8bG9vcF9jb250aW51b3VzfGxvb3Bfc3VzdGFpbilcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9KD86bm9fbG9vcHxvbmVfc2hvdHxsb29wX2NvbnRpbnVvdXN8bG9vcF9zdXN0YWluKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX2xwZi1ocGYtYnBmLWJyZlwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkobHBmXzFwfGhwZl8xcHxscGZfMnB8aHBmXzJwfGJwZl8ycHxicmZfMnApXFxiLyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBcImludmFsaWQuc2Z6XCIsXG4gICAgICAgIHJlZ2V4OiAvKD8hPSg/OmxwZl8xcHxocGZfMXB8bHBmXzJwfGhwZl8ycHxicGZfMnB8YnJmXzJwKSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX21kNVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkoW2FiY2RlZjAtOV17MzJ9KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT1bYWJjZGVmMC05XXszMn0pLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19ub3JtYWwtaW52ZXJ0XCI6IFtcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFtcImtleXdvcmQub3BlcmF0b3IuYXNzaWdubWVudC5zZnpcIiwgXCJzdHJpbmcudW5xdW90ZWQuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShub3JtYWx8aW52ZXJ0KVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzpub3JtYWx8aW52ZXJ0KSkuKi8sXG4gICAgICB9LFxuICAgIF0sXG4gICAgXCIjc3RyaW5nX29uLW9mZlwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLnVucXVvdGVkLnNmelwiXSxcbiAgICAgICAgcmVnZXg6IC8oPSkodHJ1ZXxmYWxzZXxvbnxvZmZ8MHwxKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT0oPzp0cnVlfGZhbHNlfG9ufG9mZnwwfDEpKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBcIiNzdHJpbmdfbm90ZVwiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLm5vdGUuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShbY2RlZmdhYkNERUZHQUJdXFwjPyg/Oi0xfFswLTldKSlcXGIvLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdG9rZW46IFwiaW52YWxpZC5zZnpcIixcbiAgICAgICAgcmVnZXg6IC8oPyE9W2NkZWZnYWJDREVGR0FCXVxcIz8oPzotMXxbMC05XSkpLiovLFxuICAgICAgfSxcbiAgICBdLFxuICAgIFwiI3N0cmluZ19hbnlfY29udGludW91c1wiOiBbXG4gICAgICB7XG4gICAgICAgIHRva2VuOiBbXCJrZXl3b3JkLm9wZXJhdG9yLmFzc2lnbm1lbnQuc2Z6XCIsIFwic3RyaW5nLm5vdGUuc2Z6XCJdLFxuICAgICAgICByZWdleDogLyg9KShbXlxcc10rKVxcYi8sXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0b2tlbjogXCJpbnZhbGlkLnNmelwiLFxuICAgICAgICByZWdleDogLyg/IT1bXlxcc10rKS4qLyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcbiAgdGhpcy5ub3JtYWxpemVSdWxlcygpO1xufTtcblNGWkhpZ2hsaWdodFJ1bGVzLm1ldGFEYXRhID0ge1xuICAkc2NoZW1hOlxuICAgIFwiaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL21hcnRpbnJpbmcvdG1sYW5ndWFnZS9tYXN0ZXIvdG1sYW5ndWFnZS5qc29uXCIsXG4gIG5hbWU6IFwiU0ZaXCIsXG4gIHNjb3BlTmFtZTogXCJzb3VyY2Uuc2Z6XCIsXG59O1xub29wLmluaGVyaXRzKFNGWkhpZ2hsaWdodFJ1bGVzLCBUZXh0SGlnaGxpZ2h0UnVsZXMpO1xuXG5leHBvcnRzLlNGWkhpZ2hsaWdodFJ1bGVzID0gU0ZaSGlnaGxpZ2h0UnVsZXM7XG4iLCIvKiAoaWdub3JlZCkgKi8iLCJjb25zdCBlPSgoKT0+e2lmKFwidW5kZWZpbmVkXCI9PXR5cGVvZiBzZWxmKXJldHVybiExO2lmKFwidG9wXCJpbiBzZWxmJiZzZWxmIT09dG9wKXRyeXt0b3B9Y2F0Y2goZSl7cmV0dXJuITF9cmV0dXJuXCJzaG93T3BlbkZpbGVQaWNrZXJcImluIHNlbGZ9KSgpLHQ9ZT9Qcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGx9KTpQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIHZ9KTthc3luYyBmdW5jdGlvbiBuKC4uLmUpe3JldHVybihhd2FpdCB0KS5kZWZhdWx0KC4uLmUpfWNvbnN0IHI9ZT9Qcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIHl9KTpQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGJ9KTthc3luYyBmdW5jdGlvbiBpKC4uLmUpe3JldHVybihhd2FpdCByKS5kZWZhdWx0KC4uLmUpfWNvbnN0IGE9ZT9Qcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIG19KTpQcm9taXNlLnJlc29sdmUoKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGt9KTthc3luYyBmdW5jdGlvbiBvKC4uLmUpe3JldHVybihhd2FpdCBhKS5kZWZhdWx0KC4uLmUpfWNvbnN0IHM9YXN5bmMgZT0+e2NvbnN0IHQ9YXdhaXQgZS5nZXRGaWxlKCk7cmV0dXJuIHQuaGFuZGxlPWUsdH07dmFyIGM9YXN5bmMoZT1be31dKT0+e0FycmF5LmlzQXJyYXkoZSl8fChlPVtlXSk7Y29uc3QgdD1bXTtlLmZvckVhY2goKGUsbik9Pnt0W25dPXtkZXNjcmlwdGlvbjplLmRlc2NyaXB0aW9ufHxcIkZpbGVzXCIsYWNjZXB0Ont9fSxlLm1pbWVUeXBlcz9lLm1pbWVUeXBlcy5tYXAocj0+e3Rbbl0uYWNjZXB0W3JdPWUuZXh0ZW5zaW9uc3x8W119KTp0W25dLmFjY2VwdFtcIiovKlwiXT1lLmV4dGVuc2lvbnN8fFtdfSk7Y29uc3Qgbj1hd2FpdCB3aW5kb3cuc2hvd09wZW5GaWxlUGlja2VyKHtpZDplWzBdLmlkLHN0YXJ0SW46ZVswXS5zdGFydEluLHR5cGVzOnQsbXVsdGlwbGU6ZVswXS5tdWx0aXBsZXx8ITEsZXhjbHVkZUFjY2VwdEFsbE9wdGlvbjplWzBdLmV4Y2x1ZGVBY2NlcHRBbGxPcHRpb258fCExfSkscj1hd2FpdCBQcm9taXNlLmFsbChuLm1hcChzKSk7cmV0dXJuIGVbMF0ubXVsdGlwbGU/cjpyWzBdfSxsPXtfX3Byb3RvX186bnVsbCxkZWZhdWx0OmN9O2Z1bmN0aW9uIHUoZSl7ZnVuY3Rpb24gdChlKXtpZihPYmplY3QoZSkhPT1lKXJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKGUrXCIgaXMgbm90IGFuIG9iamVjdC5cIikpO3ZhciB0PWUuZG9uZTtyZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGUudmFsdWUpLnRoZW4oZnVuY3Rpb24oZSl7cmV0dXJue3ZhbHVlOmUsZG9uZTp0fX0pfXJldHVybiB1PWZ1bmN0aW9uKGUpe3RoaXMucz1lLHRoaXMubj1lLm5leHR9LHUucHJvdG90eXBlPXtzOm51bGwsbjpudWxsLG5leHQ6ZnVuY3Rpb24oKXtyZXR1cm4gdCh0aGlzLm4uYXBwbHkodGhpcy5zLGFyZ3VtZW50cykpfSxyZXR1cm46ZnVuY3Rpb24oZSl7dmFyIG49dGhpcy5zLnJldHVybjtyZXR1cm4gdm9pZCAwPT09bj9Qcm9taXNlLnJlc29sdmUoe3ZhbHVlOmUsZG9uZTohMH0pOnQobi5hcHBseSh0aGlzLnMsYXJndW1lbnRzKSl9LHRocm93OmZ1bmN0aW9uKGUpe3ZhciBuPXRoaXMucy5yZXR1cm47cmV0dXJuIHZvaWQgMD09PW4/UHJvbWlzZS5yZWplY3QoZSk6dChuLmFwcGx5KHRoaXMucyxhcmd1bWVudHMpKX19LG5ldyB1KGUpfWNvbnN0IHA9YXN5bmMoZSx0LG49ZS5uYW1lLHIpPT57Y29uc3QgaT1bXSxhPVtdO3ZhciBvLHM9ITEsYz0hMTt0cnl7Zm9yKHZhciBsLGQ9ZnVuY3Rpb24oZSl7dmFyIHQsbixyLGk9Mjtmb3IoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIFN5bWJvbCYmKG49U3ltYm9sLmFzeW5jSXRlcmF0b3Iscj1TeW1ib2wuaXRlcmF0b3IpO2ktLTspe2lmKG4mJm51bGwhPSh0PWVbbl0pKXJldHVybiB0LmNhbGwoZSk7aWYociYmbnVsbCE9KHQ9ZVtyXSkpcmV0dXJuIG5ldyB1KHQuY2FsbChlKSk7bj1cIkBAYXN5bmNJdGVyYXRvclwiLHI9XCJAQGl0ZXJhdG9yXCJ9dGhyb3cgbmV3IFR5cGVFcnJvcihcIk9iamVjdCBpcyBub3QgYXN5bmMgaXRlcmFibGVcIil9KGUudmFsdWVzKCkpO3M9IShsPWF3YWl0IGQubmV4dCgpKS5kb25lO3M9ITEpe2NvbnN0IG89bC52YWx1ZSxzPWAke259LyR7by5uYW1lfWA7XCJmaWxlXCI9PT1vLmtpbmQ/YS5wdXNoKG8uZ2V0RmlsZSgpLnRoZW4odD0+KHQuZGlyZWN0b3J5SGFuZGxlPWUsdC5oYW5kbGU9byxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxcIndlYmtpdFJlbGF0aXZlUGF0aFwiLHtjb25maWd1cmFibGU6ITAsZW51bWVyYWJsZTohMCxnZXQ6KCk9PnN9KSkpKTpcImRpcmVjdG9yeVwiIT09by5raW5kfHwhdHx8ciYmcihvKXx8aS5wdXNoKHAobyx0LHMscikpfX1jYXRjaChlKXtjPSEwLG89ZX1maW5hbGx5e3RyeXtzJiZudWxsIT1kLnJldHVybiYmYXdhaXQgZC5yZXR1cm4oKX1maW5hbGx5e2lmKGMpdGhyb3cgb319cmV0dXJuWy4uLihhd2FpdCBQcm9taXNlLmFsbChpKSkuZmxhdCgpLC4uLmF3YWl0IFByb21pc2UuYWxsKGEpXX07dmFyIGQ9YXN5bmMoZT17fSk9PntlLnJlY3Vyc2l2ZT1lLnJlY3Vyc2l2ZXx8ITEsZS5tb2RlPWUubW9kZXx8XCJyZWFkXCI7Y29uc3QgdD1hd2FpdCB3aW5kb3cuc2hvd0RpcmVjdG9yeVBpY2tlcih7aWQ6ZS5pZCxzdGFydEluOmUuc3RhcnRJbixtb2RlOmUubW9kZX0pO3JldHVybihhd2FpdChhd2FpdCB0LnZhbHVlcygpKS5uZXh0KCkpLmRvbmU/W3RdOnAodCxlLnJlY3Vyc2l2ZSx2b2lkIDAsZS5za2lwRGlyZWN0b3J5KX0seT17X19wcm90b19fOm51bGwsZGVmYXVsdDpkfSxmPWFzeW5jKGUsdD1be31dLG49bnVsbCxyPSExLGk9bnVsbCk9PntBcnJheS5pc0FycmF5KHQpfHwodD1bdF0pLHRbMF0uZmlsZU5hbWU9dFswXS5maWxlTmFtZXx8XCJVbnRpdGxlZFwiO2NvbnN0IGE9W107bGV0IG89bnVsbDtpZihlIGluc3RhbmNlb2YgQmxvYiYmZS50eXBlP289ZS50eXBlOmUuaGVhZGVycyYmZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSYmKG89ZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSksdC5mb3JFYWNoKChlLHQpPT57YVt0XT17ZGVzY3JpcHRpb246ZS5kZXNjcmlwdGlvbnx8XCJGaWxlc1wiLGFjY2VwdDp7fX0sZS5taW1lVHlwZXM/KDA9PT10JiZvJiZlLm1pbWVUeXBlcy5wdXNoKG8pLGUubWltZVR5cGVzLm1hcChuPT57YVt0XS5hY2NlcHRbbl09ZS5leHRlbnNpb25zfHxbXX0pKTpvP2FbdF0uYWNjZXB0W29dPWUuZXh0ZW5zaW9uc3x8W106YVt0XS5hY2NlcHRbXCIqLypcIl09ZS5leHRlbnNpb25zfHxbXX0pLG4pdHJ5e2F3YWl0IG4uZ2V0RmlsZSgpfWNhdGNoKGUpe2lmKG49bnVsbCxyKXRocm93IGV9Y29uc3Qgcz1ufHxhd2FpdCB3aW5kb3cuc2hvd1NhdmVGaWxlUGlja2VyKHtzdWdnZXN0ZWROYW1lOnRbMF0uZmlsZU5hbWUsaWQ6dFswXS5pZCxzdGFydEluOnRbMF0uc3RhcnRJbix0eXBlczphLGV4Y2x1ZGVBY2NlcHRBbGxPcHRpb246dFswXS5leGNsdWRlQWNjZXB0QWxsT3B0aW9ufHwhMX0pOyFuJiZpJiZpKHMpO2NvbnN0IGM9YXdhaXQgcy5jcmVhdGVXcml0YWJsZSgpO2lmKFwic3RyZWFtXCJpbiBlKXtjb25zdCB0PWUuc3RyZWFtKCk7cmV0dXJuIGF3YWl0IHQucGlwZVRvKGMpLHN9cmV0dXJuXCJib2R5XCJpbiBlPyhhd2FpdCBlLmJvZHkucGlwZVRvKGMpLHMpOihhd2FpdCBjLndyaXRlKGF3YWl0IGUpLGF3YWl0IGMuY2xvc2UoKSxzKX0sbT17X19wcm90b19fOm51bGwsZGVmYXVsdDpmfSx3PWFzeW5jKGU9W3t9XSk9PihBcnJheS5pc0FycmF5KGUpfHwoZT1bZV0pLG5ldyBQcm9taXNlKCh0LG4pPT57Y29uc3Qgcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIik7ci50eXBlPVwiZmlsZVwiO2NvbnN0IGk9Wy4uLmUubWFwKGU9PmUubWltZVR5cGVzfHxbXSksLi4uZS5tYXAoZT0+ZS5leHRlbnNpb25zfHxbXSldLmpvaW4oKTtyLm11bHRpcGxlPWVbMF0ubXVsdGlwbGV8fCExLHIuYWNjZXB0PWl8fFwiXCIsci5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLGRvY3VtZW50LmJvZHkuYXBwZW5kKHIpO2NvbnN0IGE9ZT0+e1wiZnVuY3Rpb25cIj09dHlwZW9mIG8mJm8oKSx0KGUpfSxvPWVbMF0ubGVnYWN5U2V0dXAmJmVbMF0ubGVnYWN5U2V0dXAoYSwoKT0+byhuKSxyKSxzPSgpPT57d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJmb2N1c1wiLHMpLHIucmVtb3ZlKCl9O3IuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCk9Pnt3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImZvY3VzXCIscyl9KSxyLmFkZEV2ZW50TGlzdGVuZXIoXCJjaGFuZ2VcIiwoKT0+e3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZm9jdXNcIixzKSxyLnJlbW92ZSgpLGEoci5tdWx0aXBsZT9BcnJheS5mcm9tKHIuZmlsZXMpOnIuZmlsZXNbMF0pfSksXCJzaG93UGlja2VyXCJpbiBIVE1MSW5wdXRFbGVtZW50LnByb3RvdHlwZT9yLnNob3dQaWNrZXIoKTpyLmNsaWNrKCl9KSksdj17X19wcm90b19fOm51bGwsZGVmYXVsdDp3fSxoPWFzeW5jKGU9W3t9XSk9PihBcnJheS5pc0FycmF5KGUpfHwoZT1bZV0pLGVbMF0ucmVjdXJzaXZlPWVbMF0ucmVjdXJzaXZlfHwhMSxuZXcgUHJvbWlzZSgodCxuKT0+e2NvbnN0IHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlucHV0XCIpO3IudHlwZT1cImZpbGVcIixyLndlYmtpdGRpcmVjdG9yeT0hMDtjb25zdCBpPWU9PntcImZ1bmN0aW9uXCI9PXR5cGVvZiBhJiZhKCksdChlKX0sYT1lWzBdLmxlZ2FjeVNldHVwJiZlWzBdLmxlZ2FjeVNldHVwKGksKCk9PmEobikscik7ci5hZGRFdmVudExpc3RlbmVyKFwiY2hhbmdlXCIsKCk9PntsZXQgdD1BcnJheS5mcm9tKHIuZmlsZXMpO2VbMF0ucmVjdXJzaXZlP2VbMF0ucmVjdXJzaXZlJiZlWzBdLnNraXBEaXJlY3RvcnkmJih0PXQuZmlsdGVyKHQ9PnQud2Via2l0UmVsYXRpdmVQYXRoLnNwbGl0KFwiL1wiKS5ldmVyeSh0PT4hZVswXS5za2lwRGlyZWN0b3J5KHtuYW1lOnQsa2luZDpcImRpcmVjdG9yeVwifSkpKSk6dD10LmZpbHRlcihlPT4yPT09ZS53ZWJraXRSZWxhdGl2ZVBhdGguc3BsaXQoXCIvXCIpLmxlbmd0aCksaSh0KX0pLFwic2hvd1BpY2tlclwiaW4gSFRNTElucHV0RWxlbWVudC5wcm90b3R5cGU/ci5zaG93UGlja2VyKCk6ci5jbGljaygpfSkpLGI9e19fcHJvdG9fXzpudWxsLGRlZmF1bHQ6aH0sUD1hc3luYyhlLHQ9e30pPT57QXJyYXkuaXNBcnJheSh0KSYmKHQ9dFswXSk7Y29uc3Qgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtsZXQgcj1lO1wiYm9keVwiaW4gZSYmKHI9YXdhaXQgYXN5bmMgZnVuY3Rpb24oZSx0KXtjb25zdCBuPWUuZ2V0UmVhZGVyKCkscj1uZXcgUmVhZGFibGVTdHJlYW0oe3N0YXJ0OmU9PmFzeW5jIGZ1bmN0aW9uIHQoKXtyZXR1cm4gbi5yZWFkKCkudGhlbigoe2RvbmU6bix2YWx1ZTpyfSk9PntpZighbilyZXR1cm4gZS5lbnF1ZXVlKHIpLHQoKTtlLmNsb3NlKCl9KX0oKX0pLGk9bmV3IFJlc3BvbnNlKHIpLGE9YXdhaXQgaS5ibG9iKCk7cmV0dXJuIG4ucmVsZWFzZUxvY2soKSxuZXcgQmxvYihbYV0se3R5cGU6dH0pfShlLmJvZHksZS5oZWFkZXJzLmdldChcImNvbnRlbnQtdHlwZVwiKSkpLG4uZG93bmxvYWQ9dC5maWxlTmFtZXx8XCJVbnRpdGxlZFwiLG4uaHJlZj1VUkwuY3JlYXRlT2JqZWN0VVJMKGF3YWl0IHIpO2NvbnN0IGk9KCk9PntcImZ1bmN0aW9uXCI9PXR5cGVvZiBhJiZhKCl9LGE9dC5sZWdhY3lTZXR1cCYmdC5sZWdhY3lTZXR1cChpLCgpPT5hKCksbik7cmV0dXJuIG4uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsKCk9PntzZXRUaW1lb3V0KCgpPT5VUkwucmV2b2tlT2JqZWN0VVJMKG4uaHJlZiksM2U0KSxpKCl9KSxuLmNsaWNrKCksbnVsbH0saz17X19wcm90b19fOm51bGwsZGVmYXVsdDpQfTtleHBvcnR7aSBhcyBkaXJlY3RvcnlPcGVuLGggYXMgZGlyZWN0b3J5T3BlbkxlZ2FjeSxkIGFzIGRpcmVjdG9yeU9wZW5Nb2Rlcm4sbiBhcyBmaWxlT3Blbix3IGFzIGZpbGVPcGVuTGVnYWN5LGMgYXMgZmlsZU9wZW5Nb2Rlcm4sbyBhcyBmaWxlU2F2ZSxQIGFzIGZpbGVTYXZlTGVnYWN5LGYgYXMgZmlsZVNhdmVNb2Rlcm4sZSBhcyBzdXBwb3J0ZWR9O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUGxheWVyID0gZXhwb3J0cy5JbnRlcmZhY2UgPSBleHBvcnRzLkVkaXRvciA9IHZvaWQgMDtcbmNvbnN0IEVkaXRvcl8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9FZGl0b3JcIik7XG5leHBvcnRzLkVkaXRvciA9IEVkaXRvcl8xLmRlZmF1bHQ7XG5jb25zdCBJbnRlcmZhY2VfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvSW50ZXJmYWNlXCIpO1xuZXhwb3J0cy5JbnRlcmZhY2UgPSBJbnRlcmZhY2VfMS5kZWZhdWx0O1xuY29uc3QgUGxheWVyXzEgPSByZXF1aXJlKFwiLi9jb21wb25lbnRzL1BsYXllclwiKTtcbmV4cG9ydHMuUGxheWVyID0gUGxheWVyXzEuZGVmYXVsdDtcbiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==