/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/fileList.scss":
/*!*******************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/fileList.scss ***!
  \*******************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

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
___CSS_LOADER_EXPORT___.push([module.id, "@charset \"UTF-8\";\n.fileList {\n  --spacing: 1rem;\n  --radius: 10px;\n  font-size: var(--spacing);\n}\n\n.fileList li {\n  display: block;\n  position: relative;\n  padding-left: calc(2 * var(--spacing) - var(--radius) - 2px);\n}\n\n.fileList ul {\n  margin-left: calc(var(--radius) - var(--spacing));\n  padding-left: 0;\n}\n\n.fileList ul li {\n  border-left: 2px solid #ddd;\n}\n\n.fileList ul li:last-child {\n  border-color: transparent;\n}\n\n.fileList ul li::before {\n  content: \"\";\n  display: block;\n  position: absolute;\n  top: calc(var(--spacing) / -2);\n  left: -2px;\n  width: calc(var(--spacing) + 2px);\n  height: calc(var(--spacing) + 1px);\n  border: solid #ddd;\n  border-width: 0 0 2px 2px;\n}\n\n.fileList summary {\n  display: block;\n  cursor: pointer;\n}\n\n.fileList summary::marker,\n.fileList summary::-webkit-details-marker {\n  display: none;\n}\n\n.fileList summary:focus {\n  outline: none;\n}\n\n.fileList summary:focus-visible {\n  outline: 1px dotted #000;\n}\n\n.fileList li::after,\n.fileList summary::before {\n  display: block;\n  position: absolute;\n  top: calc(var(--spacing) / 2 - var(--radius));\n  left: calc(var(--spacing) - var(--radius) - 1px);\n  width: calc(2 * var(--radius));\n  height: calc(2 * var(--radius));\n  background: #ddd;\n}\n\n.fileList summary::before {\n  content: \"+\";\n  z-index: 1;\n  background: #696;\n  color: #fff;\n  line-height: calc(2 * var(--radius) - 2px);\n  text-align: center;\n}\n\n.fileList details[open] > summary::before {\n  content: \"−\";\n}", "",{"version":3,"sources":["webpack://./src/components/fileList.scss"],"names":[],"mappings":"AAAA,gBAAgB;AAAhB;EACE,eAAA;EACA,cAAA;EACA,yBAAA;AAEF;;AACA;EACE,cAAA;EACA,kBAAA;EACA,4DAAA;AAEF;;AACA;EACE,iDAAA;EACA,eAAA;AAEF;;AACA;EACE,2BAAA;AAEF;;AACA;EACE,yBAAA;AAEF;;AACA;EACE,WAAA;EACA,cAAA;EACA,kBAAA;EACA,8BAAA;EACA,UAAA;EACA,iCAAA;EACA,kCAAA;EACA,kBAAA;EACA,yBAAA;AAEF;;AACA;EACE,cAAA;EACA,eAAA;AAEF;;AACA;;EAEE,aAAA;AAEF;;AACA;EACE,aAAA;AAEF;;AACA;EACE,wBAAA;AAEF;;AACA;;EAEE,cAAA;EACA,kBAAA;EACA,6CAAA;EACA,gDAAA;EACA,8BAAA;EACA,+BAAA;EACA,gBAAA;AAEF;;AACA;EACE,YAAA;EACA,UAAA;EACA,gBAAA;EACA,WAAA;EACA,0CAAA;EACA,kBAAA;AAEF;;AACA;EACE,YAAA;AAEF","sourcesContent":[".fileList{\n  --spacing : 1rem;\n  --radius  : 10px;\n  font-size: var(--spacing);\n}\n\n.fileList li{\n  display      : block;\n  position     : relative;\n  padding-left : calc(2 * var(--spacing) - var(--radius) - 2px);\n}\n\n.fileList ul{\n  margin-left  : calc(var(--radius) - var(--spacing));\n  padding-left : 0;\n}\n\n.fileList ul li{\n  border-left : 2px solid #ddd;\n}\n\n.fileList ul li:last-child{\n  border-color : transparent;\n}\n\n.fileList ul li::before{\n  content      : '';\n  display      : block;\n  position     : absolute;\n  top          : calc(var(--spacing) / -2);\n  left         : -2px;\n  width        : calc(var(--spacing) + 2px);\n  height       : calc(var(--spacing) + 1px);\n  border       : solid #ddd;\n  border-width : 0 0 2px 2px;\n}\n\n.fileList summary{\n  display : block;\n  cursor  : pointer;\n}\n\n.fileList summary::marker,\n.fileList summary::-webkit-details-marker{\n  display : none;\n}\n\n.fileList summary:focus{\n  outline : none;\n}\n\n.fileList summary:focus-visible{\n  outline : 1px dotted #000;\n}\n\n.fileList li::after,\n.fileList summary::before{\n  display       : block;\n  position      : absolute;\n  top           : calc(var(--spacing) / 2 - var(--radius));\n  left          : calc(var(--spacing) - var(--radius) - 1px);\n  width         : calc(2 * var(--radius));\n  height        : calc(2 * var(--radius));\n  background    : #ddd;\n}\n\n.fileList summary::before{\n  content     : '+';\n  z-index     : 1;\n  background  : #696;\n  color       : #fff;\n  line-height : calc(2 * var(--radius) - 2px);\n  text-align  : center;\n}\n\n.fileList details[open] > summary::before{\n  content : '−';\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/instrumentList.scss":
/*!*************************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/instrumentList.scss ***!
  \*************************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

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
___CSS_LOADER_EXPORT___.push([module.id, ".instrumentList {\n  background-color: #e8f2e8;\n}\n\n.instrumentList li {\n  cursor: pointer;\n}\n.instrumentList li:hover {\n  background-color: #fff;\n}", "",{"version":3,"sources":["webpack://./src/components/instrumentList.scss"],"names":[],"mappings":"AAAA;EACE,yBAAA;AACF;;AAEA;EACE,eAAA;AACF;AACE;EACE,sBAAA;AACJ","sourcesContent":[".instrumentList {\n  background-color: #e8f2e8;\n}\n\n.instrumentList li {\n  cursor: pointer;\n\n  &:hover {\n    background-color: #fff;\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss ***!
  \*****************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "body {\n  background-color: #f4f4f4;\n  margin: 0;\n}\n\n.container {\n  background-color: #fff;\n  padding: 1rem;\n}", "",{"version":3,"sources":["webpack://./src/index.scss"],"names":[],"mappings":"AAEA;EACE,yBAHW;EAIX,SAAA;AADF;;AAIA;EACE,sBAAA;EACA,aAAA;AADF","sourcesContent":["$body-color: #f4f4f4;\n\nbody {\n  background-color: $body-color;\n  margin: 0;\n}\n\n.container {\n  background-color: #fff;\n  padding: 1rem;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



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

/***/ "./src/components/fileList.scss":
/*!**************************************!*\
  !*** ./src/components/fileList.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fileList_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./fileList.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/fileList.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fileList_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fileList_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fileList_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_fileList_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/components/instrumentList.scss":
/*!********************************************!*\
  !*** ./src/components/instrumentList.scss ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

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
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_instrumentList_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./instrumentList.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/components/instrumentList.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_instrumentList_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_instrumentList_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_instrumentList_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_instrumentList_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./src/index.scss":
/*!************************!*\
  !*** ./src/index.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!../node_modules/sass-loader/dist/cjs.js!./index.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/index.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_index_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



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

/***/ "./src/components/component.ts":
/*!*************************************!*\
  !*** ./src/components/component.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var event_1 = __webpack_require__(/*! ./event */ "./src/components/event.ts");
var Component = /** @class */ (function (_super) {
    __extends(Component, _super);
    function Component(className) {
        var _this = _super.call(this) || this;
        _this.el = document.createElement("div");
        _this.getEl().className = className;
        return _this;
    }
    Component.prototype.getEl = function () {
        return this.el;
    };
    return Component;
}(event_1.default));
exports["default"] = Component;


/***/ }),

/***/ "./src/components/event.ts":
/*!*********************************!*\
  !*** ./src/components/event.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Event = /** @class */ (function () {
    function Event() {
        this.events = {};
    }
    Event.prototype.addEvent = function (type, func) {
        if (!this.events[type]) {
            this.events[type] = [];
        }
        this.events[type].push(func);
    };
    Event.prototype.removeEvent = function (type, func) {
        var _this = this;
        if (this.events[type]) {
            if (func) {
                this.events[type].forEach(function (eventFunc, index) {
                    if (eventFunc === func) {
                        _this.events[type].splice(index, 1);
                        return true;
                    }
                });
            }
            else {
                delete this.events[type];
            }
        }
    };
    Event.prototype.dispatchEvent = function (type, data) {
        var _this = this;
        if (this.events[type]) {
            this.events[type].forEach(function (eventFunc) {
                eventFunc({ data: data, target: _this, type: type });
            });
        }
    };
    return Event;
}());
exports["default"] = Event;


/***/ }),

/***/ "./src/components/fileList.ts":
/*!************************************!*\
  !*** ./src/components/fileList.ts ***!
  \************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var component_1 = __webpack_require__(/*! ./component */ "./src/components/component.ts");
__webpack_require__(/*! ./fileList.scss */ "./src/components/fileList.scss");
var FileList = /** @class */ (function (_super) {
    __extends(FileList, _super);
    function FileList() {
        var _this = _super.call(this, "fileList") || this;
        _this.files = [];
        _this.filesNested = {};
        _this.instrument = {};
        return _this;
    }
    FileList.prototype.render = function () {
        var div = document.createElement("div");
        div.innerHTML = this.instrument.repo;
        var ul = this.createTree(this.filesNested);
        ul.className = "tree";
        div.appendChild(ul);
        this.getEl().replaceChildren();
        this.getEl().appendChild(div);
    };
    FileList.prototype.createTree = function (filesNested) {
        var ul = document.createElement("ul");
        for (var key in filesNested) {
            var li = document.createElement("li");
            if (Object.keys(filesNested[key]).length > 0) {
                var details = document.createElement("details");
                var summary = document.createElement("summary");
                summary.innerHTML = key;
                details.appendChild(summary);
                details.appendChild(this.createTree(filesNested[key]));
                li.appendChild(details);
            }
            else {
                li.innerHTML = key;
            }
            ul.appendChild(li);
        }
        return ul;
    };
    FileList.prototype.fileLoad = function (eventData) {
        return __awaiter(this, void 0, void 0, function () {
            var response, githubTree;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch("https://api.github.com/repos/".concat(eventData.data.repo, "/git/trees/main?recursive=1"))];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        githubTree = _a.sent();
                        this.files = githubTree.tree;
                        this.files.forEach(function (p) {
                            return p.path
                                .split("/")
                                .reduce(function (o, k) { return (o[k] = o[k] || {}); }, _this.filesNested);
                        });
                        this.instrument = eventData.data;
                        console.log();
                        this.render();
                        return [2 /*return*/];
                }
            });
        });
    };
    return FileList;
}(component_1.default));
exports["default"] = FileList;


/***/ }),

/***/ "./src/components/instrumentList.ts":
/*!******************************************!*\
  !*** ./src/components/instrumentList.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var component_1 = __webpack_require__(/*! ./component */ "./src/components/component.ts");
__webpack_require__(/*! ./instrumentList.scss */ "./src/components/instrumentList.scss");
var instruments = __webpack_require__(/*! ../data/instruments.json */ "./src/data/instruments.json");
var InstrumentList = /** @class */ (function (_super) {
    __extends(InstrumentList, _super);
    function InstrumentList() {
        var _this = _super.call(this, "instrumentList") || this;
        _this.plugins = instruments.objects;
        _this.render();
        return _this;
    }
    InstrumentList.prototype.render = function () {
        var _this = this;
        var ul = document.createElement("ul");
        Object.keys(this.plugins).forEach(function (pluginId) {
            var li = document.createElement("li");
            li.innerHTML = _this.pluginLatest(pluginId).name;
            li.addEventListener("click", function () {
                _this.dispatchEvent("click", _this.pluginLatest(pluginId));
            });
            ul.appendChild(li);
        });
        this.getEl().appendChild(ul);
    };
    InstrumentList.prototype.pluginLatest = function (pluginId) {
        var pluginEntry = this.plugins[pluginId];
        return pluginEntry.versions[pluginEntry.version];
    };
    return InstrumentList;
}(component_1.default));
exports["default"] = InstrumentList;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var component_1 = __webpack_require__(/*! ./components/component */ "./src/components/component.ts");
var instrumentList_1 = __webpack_require__(/*! ./components/instrumentList */ "./src/components/instrumentList.ts");
var fileList_1 = __webpack_require__(/*! ./components/fileList */ "./src/components/fileList.ts");
__webpack_require__(/*! ./index.scss */ "./src/index.scss");
var Index = /** @class */ (function (_super) {
    __extends(Index, _super);
    function Index() {
        var _this = _super.call(this, "index") || this;
        _this.render();
        return _this;
    }
    Index.prototype.render = function () {
        var fileList = new fileList_1.default();
        var instrumentList = new instrumentList_1.default();
        instrumentList.addEvent("click", function (eventData) {
            fileList.fileLoad(eventData);
        });
        this.getEl().appendChild(instrumentList.getEl());
        this.getEl().appendChild(fileList.getEl());
    };
    return Index;
}(component_1.default));
var index = new Index();
document.body.appendChild(index.getEl());
exports["default"] = Index;


/***/ }),

/***/ "./src/data/instruments.json":
/*!***********************************!*\
  !*** ./src/data/instruments.json ***!
  \***********************************/
/***/ ((module) => {

module.exports = JSON.parse('{"objects":{"freepats/glass/glasses-of-water":{"id":"freepats/glass/glasses-of-water","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"Freepats","homepage":"https://freepats.zenvoid.org","name":"Glasses Of Water","description":"Musical instrument made with glasses of water, recorded with an AKG Perception 120 microphone.","tags":["Instrument","Orchestra","Glass","sfz"],"version":"1.0.0","id":"glasses-of-water","date":"2019-12-27T07:00:00.000Z","files":{"audio":{"name":"Glass-20191227.flac","size":67037},"image":{"name":"Glass-20191227.jpg","size":125355},"linux":{"name":"Glass-20191227.zip","size":10610381},"mac":{"name":"glasses-of-water.zip","size":10610381},"win":{"name":"Glass-20191227.zip","size":10610381}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"freepats/glass"}}},"freepats/hang-d-minor/hang-d-minor":{"id":"freepats/hang-d-minor/hang-d-minor","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"Freepats","homepage":"https://freepats.zenvoid.org","name":"Hang D Minor","description":"Pitched steel percussion instrument tuned in D minor, recorded using a Zoom H1 portable recorder mounted on a tripod.","tags":["Instrument","Orchestra","Hang","sfz"],"version":"1.0.0","id":"hang-d-minor","date":"2022-03-30T07:00:00.000Z","files":{"audio":{"name":"Hang-D-minor-20220330.flac","size":78343},"image":{"name":"Hang-D-minor-20220330.jpg","size":43408},"linux":{"name":"Hang-D-minor-20220330.zip","size":13369709},"mac":{"name":"Hang-D-minor-20220330.zip","size":13369709},"win":{"name":"Hang-D-minor-20220330.zip","size":13369709}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"freepats/hang-d-minor"}}},"freepats/synthesizer-percussion/synthesizer-percussion":{"id":"freepats/synthesizer-percussion/synthesizer-percussion","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"Freepats","homepage":"https://freepats.zenvoid.org","name":"Synthesizer Percussion","description":"Drumkit sounds commonly used in vintage electronic music made with analog synthesizers.","tags":["Instrument","Drums","Electro","sfz"],"version":"1.0.0","id":"synthesizer-percussion","date":"2022-07-18T07:00:00.000Z","files":{"audio":{"name":"SynthesizerPercussion-20220718.flac","size":135815},"image":{"name":"SynthesizerPercussion-20220718.jpg","size":154466},"linux":{"name":"SynthesizerPercussion-20220718.zip","size":1663242},"mac":{"name":"SynthesizerPercussion-20220718.zip","size":1663242},"win":{"name":"SynthesizerPercussion-20220718.zip","size":1663242}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"freepats/synthesizer-percussion"}}},"freepats/upright-piano-kw/upright-piano-kw":{"id":"freepats/upright-piano-kw/upright-piano-kw","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"Freepats","homepage":"https://freepats.zenvoid.org","name":"Upright Piano KW","description":"Kawai upright piano, recorded in a living room using a Zoom H1 portable recorder mounted on a tripod in front of the piano.","tags":["Instrument","Keys","Piano","sfz"],"version":"1.0.0","id":"upright-piano-kw","date":"2022-02-21T07:00:00.000Z","files":{"audio":{"name":"UprightPianoKW-20220221.flac","size":64803},"image":{"name":"UprightPianoKW-20220221.jpg","size":87924},"linux":{"name":"UprightPianoKW-20220221.zip","size":32365885},"mac":{"name":"UprightPianoKW-20220221.zip","size":32365885},"win":{"name":"UprightPianoKW-20220221.zip","size":32365885}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"freepats/upright-piano-kw"}}},"studiorack/salamander-grand-piano/salamander-grand-piano":{"id":"studiorack/salamander-grand-piano/salamander-grand-piano","license":"other","version":"3.0.0","versions":{"3.0.0":{"author":"Alexander Holm","homepage":"https://github.com/sfzinstruments/SalamanderGrandPiano/","name":"Salamander Grand Piano","description":"Yamaha C5, recorded with two AKG c414 disposed in an AB position ~12cm above the strings.","tags":["Instrument","Piano","Yamaha","sfz"],"version":"3.0.0","id":"salamander-grand-piano","date":"2021-09-20T07:00:00.000Z","files":{"audio":{"name":"salamander-grand-piano.flac","size":365662},"image":{"name":"salamander-grand-piano.jpg","size":88748},"linux":{"name":"salamander-grand-piano.zip","size":748416023},"mac":{"name":"salamander-grand-piano.zip","size":748416023},"win":{"name":"salamander-grand-piano.zip","size":748416023}},"release":"v3.0.0","license":{"key":"other","name":"Other","url":"https://choosealicense.com","same":true},"repo":"studiorack/salamander-grand-piano"}}},"freepats/spanish-classical-guitar/spanish-classical-guitar":{"id":"freepats/spanish-classical-guitar/spanish-classical-guitar","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"Freepats","homepage":"https://freepats.zenvoid.org","name":"Spanish Classical Guitar","description":"Spanish classical guitar with nylon strings, recorded with an AKG Perception 120 microphone.","tags":["Instrument","Guitar","Classical","sfz"],"version":"1.0.0","id":"spanish-classical-guitar","date":"2019-06-18T07:00:00.000Z","files":{"audio":{"name":"SpanishClassicalGuitar-20190618.flac","size":75338},"image":{"name":"SpanishClassicalGuitar-20190618.jpg","size":147385},"linux":{"name":"SpanishClassicalGuitar-20190618.zip","size":4944097},"mac":{"name":"SpanishClassicalGuitar-20190618.zip","size":4944097},"win":{"name":"SpanishClassicalGuitar-20190618.zip","size":4944097}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"freepats/spanish-classical-guitar"}}},"studiorack/basic-harmonica/basic-harmonica":{"id":"studiorack/basic-harmonica/basic-harmonica","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"michael02022","homepage":"https://github.com/michael02022/basic-harmonica","name":"Basic Harmonica","description":"Basic harmonica.","tags":["Instrument","Wind","Harmonica","sfz"],"version":"1.0.0","id":"basic-harmonica","date":"2022-10-07T07:00:00.000Z","files":{"audio":{"name":"basic-harmonica.flac","size":100197},"image":{"name":"basic-harmonica.jpg","size":65716},"linux":{"name":"basic-harmonica.zip","size":1404185},"mac":{"name":"basic-harmonica.zip","size":1404185},"win":{"name":"basic-harmonica.zip","size":1404185}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"studiorack/basic-harmonica"}}},"studiorack/jrhodes-3c/jrhodes-3c":{"id":"studiorack/jrhodes-3c/jrhodes-3c","license":"other","version":"1.0.0","versions":{"1.0.0":{"author":"Jeff Learman","homepage":"https://sfzinstruments.github.io/pianos/jrhodes3c","name":"jRhodes3c","description":"1977 Rhodes Mark I Stage 73 piano","tags":["Instrument","Keys","Rhodes","sfz"],"version":"1.0.0","id":"jrhodes-3c","date":"2022-01-02T07:00:00.000Z","files":{"audio":{"name":"jrhodes-3c.flac","size":64422},"image":{"name":"jrhodes-3c.jpg","size":283376},"linux":{"name":"jrhodes-3c.zip","size":17073884},"mac":{"name":"jrhodes-3c.zip","size":17073884},"win":{"name":"jrhodes-3c.zip","size":17073884}},"release":"v1.0.0","license":{"key":"other","name":"Other","url":"https://choosealicense.com","same":true},"repo":"studiorack/jrhodes-3c"}}},"studiorack/avl-percussions/avl-percussions":{"id":"studiorack/avl-percussions/avl-percussions","license":"other","version":"1.1.0","versions":{"1.1.0":{"author":"Glen MacArthur","homepage":"http://www.bandshed.net/avldrumkits","name":"AVL Percussions","description":"11 percussions instruments (Cajon, Woodblock, Handclap, Fingersnap, Bongos, Maracas, Tambourine, Cowbell, Claves, Waterglass) recorded with 5 velocity layers per piece.","tags":["Instrument","Drums","Percussions","sfz"],"version":"1.1.0","id":"avl-percussions","date":"2022-02-21T07:00:00.000Z","files":{"audio":{"name":"avl-percussions.flac","size":193990},"image":{"name":"avl-percussions.jpg","size":159466},"linux":{"name":"avl-percussions.zip","size":1730506},"mac":{"name":"avl-percussions.zip","size":1730506},"win":{"name":"avl-percussions.zip","size":1730506}},"release":"v1.1.0","license":{"key":"other","name":"Other","url":"https://choosealicense.com","same":true},"repo":"studiorack/avl-percussions"}}},"studiorack/naked-drums/naked-drums":{"id":"studiorack/naked-drums/naked-drums","license":"cc-by-4.0","version":"1.0.0","versions":{"1.0.0":{"author":"Wilkinson Audio","homepage":"https://wilkinsonaudio.com/products/naked-drums","name":"Naked Drums","description":"Multi-mic drumkit, with 10 round-robins, up to 5 velocity layers and several mic layers (Direct, OH, Close room, Far rooms, Mid-side and Wide OH).","tags":["Instrument","Drums","sfz"],"version":"1.0.0","id":"naked-drums","date":"2021-11-08T07:00:00.000Z","files":{"audio":{"name":"naked-drums.flac","size":553525},"image":{"name":"naked-drums.jpg","size":24452},"linux":{"name":"naked-drums.zip","size":1283342538},"mac":{"name":"naked-drums.zip","size":1283342538},"win":{"name":"naked-drums.zip","size":1283342538}},"release":"v1.0.0","license":{"key":"cc-by-4.0","name":"Creative Commons Attribution 4.0 International","url":"https://choosealicense.com/licenses/cc-by-4.0","same":false},"repo":"studiorack/naked-drums"}}},"studiorack/splendid-grand-piano/splendid-grand-piano":{"id":"studiorack/splendid-grand-piano/splendid-grand-piano","license":"other","version":"1.0.0","versions":{"1.0.0":{"author":"Akai","homepage":"https://sfzinstruments.github.io/pianos/splendid_grand_piano","name":"Splendid Grand Piano","description":"Steinway piano with 4 velocity layers","tags":["Instrument","Keys","Piano","sfz"],"version":"1.0.0","id":"splendid-grand-piano","date":"2022-01-02T07:00:00.000Z","files":{"audio":{"name":"splendid-grand-piano.flac","size":69723},"image":{"name":"splendid-grand-piano.jpg","size":171264},"linux":{"name":"splendid-grand-piano.zip","size":74736682},"mac":{"name":"splendid-grand-piano.zip","size":74736682},"win":{"name":"splendid-grand-piano.zip","size":74736682}},"release":"v1.0.0","license":{"key":"other","name":"Other","url":"https://choosealicense.com","same":true},"repo":"studiorack/splendid-grand-piano"}}},"studiorack/black-and-green-guitars/black-and-green-guitars":{"id":"studiorack/black-and-green-guitars/black-and-green-guitars","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"DSmolken","homepage":"https://github.com/sfzinstruments/karoryfer.black-and-green-guitars","name":"Black and Green Guitars","description":"Black Hofner Club and Green Gretsch Anniversary electric guitars","tags":["Instrument","Guitar","Electric","sfz"],"version":"1.0.0","id":"black-and-green-guitars","date":"2022-08-08T07:00:00.000Z","files":{"audio":{"name":"black-and-green-guitars.flac","size":64823},"image":{"name":"black-and-green-guitars.jpg","size":100550},"linux":{"name":"black-and-green-guitars.zip","size":292323008},"mac":{"name":"black-and-green-guitars.zip","size":292323008},"win":{"name":"black-and-green-guitars.zip","size":292323008}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"studiorack/black-and-green-guitars"}}},"studiorack/horse-pulse/horse-pulse":{"id":"studiorack/horse-pulse/horse-pulse","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"DSmolken","homepage":"https://github.com/sfzinstruments/Karoryfer.HorsePulse","name":"Horse Pulse","description":"Bass Tagelharpa played pizzicato","tags":["Instrument","String","Pluck","sfz"],"version":"1.0.0","id":"horse-pulse","date":"2022-03-31T07:00:00.000Z","files":{"audio":{"name":"horse-pulse.flac","size":58263},"image":{"name":"horse-pulse.jpg","size":92078},"linux":{"name":"horse-pulse.zip","size":74462529},"mac":{"name":"horse-pulse.zip","size":74462529},"win":{"name":"horse-pulse.zip","size":74462529}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"studiorack/horse-pulse"}}},"studiorack/virtual-playing-orchestra/virtual-playing-orchestra":{"id":"studiorack/virtual-playing-orchestra/virtual-playing-orchestra","license":"gpl-3.0","version":"3.2.2","versions":{"3.2.2":{"author":"Paul Battersby","homepage":"http://virtualplaying.com/virtual-playing-orchestra/","name":"Virtual Playing Orchestra","description":"Orchestral sample library featuring section and solo instruments for woodwinds, brass, strings and percussion","tags":["Instrument","Orchestral","Strings","sfz"],"version":"3.2.2","id":"virtual-playing-orchestra","date":"2020-10-31T07:00:00.000Z","files":{"audio":{"name":"virtual-playing-orchestra.flac","size":137127},"image":{"name":"virtual-playing-orchestra.jpg","size":79890},"linux":{"name":"virtual-playing-orchestra.zip","size":618693714},"mac":{"name":"virtual-playing-orchestra.zip","size":618693714},"win":{"name":"virtual-playing-orchestra.zip","size":618693714}},"release":"v3.2.2","license":{"key":"gpl-3.0","name":"GNU General Public License v3.0","url":"https://choosealicense.com/licenses/gpl-3.0","same":true},"repo":"studiorack/virtual-playing-orchestra"}}},"studiorack/jsteeldrum/jsteel-drum":{"id":"studiorack/jsteeldrum/jsteel-drum","license":"unlicense","version":"2.0.0","versions":{"2.0.0":{"author":"Jeff Learman","homepage":"https://github.com/sfzinstruments/jlearman.SteelDrum","name":"jSteelDrum","description":"C Steel Drum (a.k.a. \'steel pan\') hand-made in Trinidad.","tags":["Instrument","Steel","Drum","sfz"],"version":"2.0.0","id":"jsteel-drum","date":"2022-09-22T07:00:00.000Z","files":{"audio":{"name":"jsteel-drum.flac","size":83358},"image":{"name":"jsteel-drum.jpg","size":222224},"linux":{"name":"jsteel-drum.zip","size":38363496},"mac":{"name":"jsteel-drum.zip","size":38363496},"win":{"name":"jsteel-drum.zip","size":38363496}},"release":"v2.0.0","license":{"key":"unlicense","name":"The Unlicense","url":"https://choosealicense.com/licenses/unlicense","same":false},"repo":"studiorack/jsteeldrum"}}},"studiorack/sams-sonor/sams-sonor":{"id":"studiorack/sams-sonor/sams-sonor","license":"cc-by-sa-4.0","version":"1.0.0","versions":{"1.0.0":{"author":"Sam Greene","homepage":"https://github.com/sfzinstruments/SamsSonor","name":"Sam\'s Sonor","description":"Sonor Force 3001 drum kit sampled with 4 velocity levels for each part.","tags":["Instrument","Drums","Kit","sfz"],"version":"1.0.0","id":"sams-sonor","date":"2021-08-21T07:00:00.000Z","files":{"audio":{"name":"sams-sonor.flac","size":207120},"image":{"name":"sams-sonor.jpg","size":239836},"linux":{"name":"sams-sonor.zip","size":36642874},"mac":{"name":"sams-sonor.zip","size":36642874},"win":{"name":"sams-sonor.zip","size":36642874}},"release":"v1.0.0","license":{"key":"cc-by-sa-4.0","name":"Creative Commons Attribution Share Alike 4.0 International","url":"https://choosealicense.com/licenses/cc-by-sa-4.0","same":true},"repo":"studiorack/sams-sonor"}}},"studiorack/war-tuba/war-tuba":{"id":"studiorack/war-tuba/war-tuba","license":"cc-by-4.0","version":"1.0.0","versions":{"1.0.0":{"author":"DSmolken","homepage":"https://github.com/sfzinstruments/karoryfer.war-tuba","name":"War Tuba","description":"Tuba played by Jakub Lewicki (aka Ignacy Woland of the band Hañba).","tags":["Instrument","Brass","Tuba","sfz"],"version":"1.0.0","id":"war-tuba","date":"2021-09-03T07:00:00.000Z","files":{"audio":{"name":"war-tuba.flac","size":88482},"image":{"name":"war-tuba.jpg","size":69063},"linux":{"name":"war-tuba.zip","size":35601312},"mac":{"name":"war-tuba.zip","size":35601312},"win":{"name":"war-tuba.zip","size":35601312}},"release":"v1.0.0","license":{"key":"cc-by-4.0","name":"Creative Commons Attribution 4.0 International","url":"https://choosealicense.com/licenses/cc-by-4.0","same":false},"repo":"studiorack/war-tuba"}}},"studiorack/avl-drumkits/avl-drumkits":{"id":"studiorack/avl-drumkits/avl-drumkits","license":"other","version":"1.1.0","versions":{"1.1.0":{"author":"Glen MacArthur","homepage":"http://www.bandshed.net/avldrumkits","name":"AVL Drumkits","description":"Black Pearl and Red Zepplin drumkits recorded with 5 velocity layers per kit piece.","tags":["Instrument","Drums","sfz"],"version":"1.1.0","id":"avl-drumkits","date":"2022-02-20T07:00:00.000Z","files":{"audio":{"name":"avl-drumkits.flac","size":696023},"image":{"name":"avl-drumkits.jpg","size":326339},"linux":{"name":"avl-drumkits.zip","size":16017234},"mac":{"name":"avl-drumkits.zip","size":16017234},"win":{"name":"avl-drumkits.zip","size":16017234}},"release":"v1.1.0","license":{"key":"other","name":"Other","url":"https://choosealicense.com","same":true},"repo":"studiorack/avl-drumkits"}}},"studiorack/double-bass/double-bass":{"id":"studiorack/double-bass/double-bass","license":"cc-by-4.0","version":"1.0.0","versions":{"1.0.0":{"author":"DSmolken","homepage":"https://github.com/sfzinstruments/dsmolken.double-bass","name":"Double Bass","description":"1958 Otto Rubner double bass played arco and pizzicato with additional miscellaneous noises.","tags":["Instrument","String","Bass","sfz"],"version":"1.0.0","id":"double-bass","date":"2021-10-07T07:00:00.000Z","files":{"audio":{"name":"double-bass.flac","size":77117},"image":{"name":"double-bass.jpg","size":45157},"linux":{"name":"double-bass.zip","size":79014147},"mac":{"name":"double-bass.zip","size":79014147},"win":{"name":"double-bass.zip","size":79014147}},"release":"v1.0.0","license":{"key":"cc-by-4.0","name":"Creative Commons Attribution 4.0 International","url":"https://choosealicense.com/licenses/cc-by-4.0","same":false},"repo":"studiorack/double-bass"}}},"studiorack/bear-sax/bear-sax":{"id":"studiorack/bear-sax/bear-sax","license":"cc-by-4.0","version":"1.0.0","versions":{"1.0.0":{"author":"DSmolken","homepage":"https://github.com/sfzinstruments/karoryfer.bear-sax","name":"Bear Sax","description":"1926 Conn baritone saxophone including sustained notes and breath noise.","tags":["Instrument","Brass","Saxophone","sfz"],"version":"1.0.0","id":"bear-sax","date":"2021-09-11T07:00:00.000Z","files":{"audio":{"name":"bear-sax.flac","size":86918},"image":{"name":"bear-sax.jpg","size":85425},"linux":{"name":"bear-sax.zip","size":70617479},"mac":{"name":"bear-sax.zip","size":70617479},"win":{"name":"bear-sax.zip","size":70617479}},"release":"v1.0.0","license":{"key":"cc-by-4.0","name":"Creative Commons Attribution 4.0 International","url":"https://choosealicense.com/licenses/cc-by-4.0","same":false},"repo":"studiorack/bear-sax"}}},"studiorack/hungarian-zither/hungarian-zither":{"id":"studiorack/hungarian-zither/hungarian-zither","license":"cc0-1.0","version":"1.0.0","versions":{"1.0.0":{"author":"DSmolken","homepage":"https://github.com/sfzinstruments/hungarian_zither","name":"Hungarian Zither","description":"Hungarian \'prime\' zither. A rectangular instrument with over a dozen strings, mostly tuned to G, with two melody courses and the rest as drones.","tags":["Instrument","Strings","Classical","sfz"],"version":"1.0.0","id":"hungarian-zither","date":"2022-09-13T07:00:00.000Z","files":{"audio":{"name":"hungarian-zither.flac","size":172274},"image":{"name":"hungarian-zither.jpg","size":88693},"linux":{"name":"hungarian-zither.zip","size":181711154},"mac":{"name":"hungarian-zither.zip","size":181711154},"win":{"name":"hungarian-zither.zip","size":181711154}},"release":"v1.0.0","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"studiorack/hungarian-zither"}}},"studiorack/salamander-drumkit/salamander-drumkit":{"id":"studiorack/salamander-drumkit/salamander-drumkit","license":"other","version":"1.0.0","versions":{"1.0.0":{"author":"Rytmenpinne","homepage":"https://rytmenpinne.wordpress.com/sounds-and-such/salamander-drumkit/","name":"Salamander Drumkit","description":"Drumkit recorded in the garage with an acoustic sound/feel.","tags":["Instrument","Drums","sfz"],"version":"1.0.0","id":"salamander-drumkit","date":"2012-02-25T07:00:00.000Z","files":{"audio":{"name":"salamander-drumkit.flac","size":162704},"image":{"name":"salamander-drumkit.jpg","size":94023},"linux":{"name":"salamander-drumkit.zip","size":269599176},"mac":{"name":"salamander-drumkit.zip","size":269599176},"win":{"name":"salamander-drumkit.zip","size":269599176}},"release":"v1.0.0","license":{"key":"other","name":"Other","url":"https://choosealicense.com","same":true},"repo":"studiorack/salamander-drumkit"}}},"studiorack/virtuosity-drums/virtuosity-drums":{"id":"studiorack/virtuosity-drums/virtuosity-drums","license":"cc0-1.0","version":"0.9.23","versions":{"0.9.23":{"author":"Versilian Studios","homepage":"https://vis.versilstudios.com/virtuosity-drums.html","name":"Virtuosity Drums","description":"Contemporary Jazz drum kit library, performed with sticks, recorded at Virtuosity Musical Instruments in Boston, MA.","tags":["Instrument","Drums","Jazz","sfz"],"version":"0.9.23","id":"virtuosity-drums","date":"2021-11-08T07:00:00.000Z","files":{"audio":{"name":"virtuosity-drums.flac","size":821118},"image":{"name":"virtuosity-drums.jpg","size":73357},"linux":{"name":"virtuosity-drums.zip","size":1224065679},"mac":{"name":"virtuosity-drums.zip","size":1224065679},"win":{"name":"virtuosity-drums.zip","size":1224065679}},"release":"v0.9.23","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"studiorack/virtuosity-drums"},"0.9.22":{"author":"Versilian Studios","homepage":"https://vis.versilstudios.com/virtuosity-drums.html","name":"Virtuosity Drums","description":"Contemporary Jazz drum kit library, performed with sticks, recorded at Virtuosity Musical Instruments in Boston, MA.","tags":["Instrument","Drums","Jazz","sfz"],"version":"0.9.22","id":"virtuosity-drums","date":"2021-11-08T07:00:00.000Z","files":{"audio":{"name":"virtuosity-drums.flac","size":821118},"image":{"name":"virtuosity-drums.jpg","size":73357},"linux":{"name":"virtuosity-drums.zip","size":618693714},"mac":{"name":"virtuosity-drums.zip","size":618693714},"win":{"name":"virtuosity-drums.zip","size":618693714}},"release":"v0.9.22","license":{"key":"cc0-1.0","name":"Creative Commons Zero v1.0 Universal","url":"https://choosealicense.com/licenses/cc0-1.0","same":false},"repo":"studiorack/virtuosity-drums"}}}}}');

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
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQSxrQkFBZTs7Ozs7Ozs7Ozs7Ozs7Ozs7VUN6Q2Y7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0E7Ozs7O1dDUEE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx5Q0FBeUMsd0NBQXdDO1dBQ2pGO1dBQ0E7V0FDQTs7Ozs7V0NQQTs7Ozs7V0NBQTtXQUNBO1dBQ0E7V0FDQSx1REFBdUQsaUJBQWlCO1dBQ3hFO1dBQ0EsZ0RBQWdELGFBQWE7V0FDN0Q7Ozs7O1dDTkE7Ozs7O1VFQUE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci8uL3NyYy9jb21wb25lbnRzL2ZpbGVMaXN0LnNjc3MiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvY29tcG9uZW50cy9pbnN0cnVtZW50TGlzdC5zY3NzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyLy4vc3JjL2luZGV4LnNjc3MiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyLy4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanMiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvY29tcG9uZW50cy9maWxlTGlzdC5zY3NzP2FlMGEiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvY29tcG9uZW50cy9pbnN0cnVtZW50TGlzdC5zY3NzP2M1MzgiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvaW5kZXguc2Nzcz83MjIzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qcyIsIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvY29tcG9uZW50cy9jb21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvY29tcG9uZW50cy9ldmVudC50cyIsIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci8uL3NyYy9jb21wb25lbnRzL2ZpbGVMaXN0LnRzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyLy4vc3JjL2NvbXBvbmVudHMvaW5zdHJ1bWVudExpc3QudHMiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3Nmei13ZWItcGxheWVyL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci93ZWJwYWNrL3J1bnRpbWUvbm9uY2UiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zZnotd2ViLXBsYXllci93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2Z6LXdlYi1wbGF5ZXIvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGNoYXJzZXQgXFxcIlVURi04XFxcIjtcXG4uZmlsZUxpc3Qge1xcbiAgLS1zcGFjaW5nOiAxcmVtO1xcbiAgLS1yYWRpdXM6IDEwcHg7XFxuICBmb250LXNpemU6IHZhcigtLXNwYWNpbmcpO1xcbn1cXG5cXG4uZmlsZUxpc3QgbGkge1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBwYWRkaW5nLWxlZnQ6IGNhbGMoMiAqIHZhcigtLXNwYWNpbmcpIC0gdmFyKC0tcmFkaXVzKSAtIDJweCk7XFxufVxcblxcbi5maWxlTGlzdCB1bCB7XFxuICBtYXJnaW4tbGVmdDogY2FsYyh2YXIoLS1yYWRpdXMpIC0gdmFyKC0tc3BhY2luZykpO1xcbiAgcGFkZGluZy1sZWZ0OiAwO1xcbn1cXG5cXG4uZmlsZUxpc3QgdWwgbGkge1xcbiAgYm9yZGVyLWxlZnQ6IDJweCBzb2xpZCAjZGRkO1xcbn1cXG5cXG4uZmlsZUxpc3QgdWwgbGk6bGFzdC1jaGlsZCB7XFxuICBib3JkZXItY29sb3I6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4uZmlsZUxpc3QgdWwgbGk6OmJlZm9yZSB7XFxuICBjb250ZW50OiBcXFwiXFxcIjtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiBjYWxjKHZhcigtLXNwYWNpbmcpIC8gLTIpO1xcbiAgbGVmdDogLTJweDtcXG4gIHdpZHRoOiBjYWxjKHZhcigtLXNwYWNpbmcpICsgMnB4KTtcXG4gIGhlaWdodDogY2FsYyh2YXIoLS1zcGFjaW5nKSArIDFweCk7XFxuICBib3JkZXI6IHNvbGlkICNkZGQ7XFxuICBib3JkZXItd2lkdGg6IDAgMCAycHggMnB4O1xcbn1cXG5cXG4uZmlsZUxpc3Qgc3VtbWFyeSB7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuLmZpbGVMaXN0IHN1bW1hcnk6Om1hcmtlcixcXG4uZmlsZUxpc3Qgc3VtbWFyeTo6LXdlYmtpdC1kZXRhaWxzLW1hcmtlciB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4uZmlsZUxpc3Qgc3VtbWFyeTpmb2N1cyB7XFxuICBvdXRsaW5lOiBub25lO1xcbn1cXG5cXG4uZmlsZUxpc3Qgc3VtbWFyeTpmb2N1cy12aXNpYmxlIHtcXG4gIG91dGxpbmU6IDFweCBkb3R0ZWQgIzAwMDtcXG59XFxuXFxuLmZpbGVMaXN0IGxpOjphZnRlcixcXG4uZmlsZUxpc3Qgc3VtbWFyeTo6YmVmb3JlIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiBjYWxjKHZhcigtLXNwYWNpbmcpIC8gMiAtIHZhcigtLXJhZGl1cykpO1xcbiAgbGVmdDogY2FsYyh2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAxcHgpO1xcbiAgd2lkdGg6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykpO1xcbiAgaGVpZ2h0OiBjYWxjKDIgKiB2YXIoLS1yYWRpdXMpKTtcXG4gIGJhY2tncm91bmQ6ICNkZGQ7XFxufVxcblxcbi5maWxlTGlzdCBzdW1tYXJ5OjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIitcXFwiO1xcbiAgei1pbmRleDogMTtcXG4gIGJhY2tncm91bmQ6ICM2OTY7XFxuICBjb2xvcjogI2ZmZjtcXG4gIGxpbmUtaGVpZ2h0OiBjYWxjKDIgKiB2YXIoLS1yYWRpdXMpIC0gMnB4KTtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG59XFxuXFxuLmZpbGVMaXN0IGRldGFpbHNbb3Blbl0gPiBzdW1tYXJ5OjpiZWZvcmUge1xcbiAgY29udGVudDogXFxcIuKIklxcXCI7XFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jb21wb25lbnRzL2ZpbGVMaXN0LnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsZ0JBQWdCO0FBQWhCO0VBQ0UsZUFBQTtFQUNBLGNBQUE7RUFDQSx5QkFBQTtBQUVGOztBQUNBO0VBQ0UsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsNERBQUE7QUFFRjs7QUFDQTtFQUNFLGlEQUFBO0VBQ0EsZUFBQTtBQUVGOztBQUNBO0VBQ0UsMkJBQUE7QUFFRjs7QUFDQTtFQUNFLHlCQUFBO0FBRUY7O0FBQ0E7RUFDRSxXQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsOEJBQUE7RUFDQSxVQUFBO0VBQ0EsaUNBQUE7RUFDQSxrQ0FBQTtFQUNBLGtCQUFBO0VBQ0EseUJBQUE7QUFFRjs7QUFDQTtFQUNFLGNBQUE7RUFDQSxlQUFBO0FBRUY7O0FBQ0E7O0VBRUUsYUFBQTtBQUVGOztBQUNBO0VBQ0UsYUFBQTtBQUVGOztBQUNBO0VBQ0Usd0JBQUE7QUFFRjs7QUFDQTs7RUFFRSxjQUFBO0VBQ0Esa0JBQUE7RUFDQSw2Q0FBQTtFQUNBLGdEQUFBO0VBQ0EsOEJBQUE7RUFDQSwrQkFBQTtFQUNBLGdCQUFBO0FBRUY7O0FBQ0E7RUFDRSxZQUFBO0VBQ0EsVUFBQTtFQUNBLGdCQUFBO0VBQ0EsV0FBQTtFQUNBLDBDQUFBO0VBQ0Esa0JBQUE7QUFFRjs7QUFDQTtFQUNFLFlBQUE7QUFFRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuZmlsZUxpc3R7XFxuICAtLXNwYWNpbmcgOiAxcmVtO1xcbiAgLS1yYWRpdXMgIDogMTBweDtcXG4gIGZvbnQtc2l6ZTogdmFyKC0tc3BhY2luZyk7XFxufVxcblxcbi5maWxlTGlzdCBsaXtcXG4gIGRpc3BsYXkgICAgICA6IGJsb2NrO1xcbiAgcG9zaXRpb24gICAgIDogcmVsYXRpdmU7XFxuICBwYWRkaW5nLWxlZnQgOiBjYWxjKDIgKiB2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAycHgpO1xcbn1cXG5cXG4uZmlsZUxpc3QgdWx7XFxuICBtYXJnaW4tbGVmdCAgOiBjYWxjKHZhcigtLXJhZGl1cykgLSB2YXIoLS1zcGFjaW5nKSk7XFxuICBwYWRkaW5nLWxlZnQgOiAwO1xcbn1cXG5cXG4uZmlsZUxpc3QgdWwgbGl7XFxuICBib3JkZXItbGVmdCA6IDJweCBzb2xpZCAjZGRkO1xcbn1cXG5cXG4uZmlsZUxpc3QgdWwgbGk6bGFzdC1jaGlsZHtcXG4gIGJvcmRlci1jb2xvciA6IHRyYW5zcGFyZW50O1xcbn1cXG5cXG4uZmlsZUxpc3QgdWwgbGk6OmJlZm9yZXtcXG4gIGNvbnRlbnQgICAgICA6ICcnO1xcbiAgZGlzcGxheSAgICAgIDogYmxvY2s7XFxuICBwb3NpdGlvbiAgICAgOiBhYnNvbHV0ZTtcXG4gIHRvcCAgICAgICAgICA6IGNhbGModmFyKC0tc3BhY2luZykgLyAtMik7XFxuICBsZWZ0ICAgICAgICAgOiAtMnB4O1xcbiAgd2lkdGggICAgICAgIDogY2FsYyh2YXIoLS1zcGFjaW5nKSArIDJweCk7XFxuICBoZWlnaHQgICAgICAgOiBjYWxjKHZhcigtLXNwYWNpbmcpICsgMXB4KTtcXG4gIGJvcmRlciAgICAgICA6IHNvbGlkICNkZGQ7XFxuICBib3JkZXItd2lkdGggOiAwIDAgMnB4IDJweDtcXG59XFxuXFxuLmZpbGVMaXN0IHN1bW1hcnl7XFxuICBkaXNwbGF5IDogYmxvY2s7XFxuICBjdXJzb3IgIDogcG9pbnRlcjtcXG59XFxuXFxuLmZpbGVMaXN0IHN1bW1hcnk6Om1hcmtlcixcXG4uZmlsZUxpc3Qgc3VtbWFyeTo6LXdlYmtpdC1kZXRhaWxzLW1hcmtlcntcXG4gIGRpc3BsYXkgOiBub25lO1xcbn1cXG5cXG4uZmlsZUxpc3Qgc3VtbWFyeTpmb2N1c3tcXG4gIG91dGxpbmUgOiBub25lO1xcbn1cXG5cXG4uZmlsZUxpc3Qgc3VtbWFyeTpmb2N1cy12aXNpYmxle1xcbiAgb3V0bGluZSA6IDFweCBkb3R0ZWQgIzAwMDtcXG59XFxuXFxuLmZpbGVMaXN0IGxpOjphZnRlcixcXG4uZmlsZUxpc3Qgc3VtbWFyeTo6YmVmb3Jle1xcbiAgZGlzcGxheSAgICAgICA6IGJsb2NrO1xcbiAgcG9zaXRpb24gICAgICA6IGFic29sdXRlO1xcbiAgdG9wICAgICAgICAgICA6IGNhbGModmFyKC0tc3BhY2luZykgLyAyIC0gdmFyKC0tcmFkaXVzKSk7XFxuICBsZWZ0ICAgICAgICAgIDogY2FsYyh2YXIoLS1zcGFjaW5nKSAtIHZhcigtLXJhZGl1cykgLSAxcHgpO1xcbiAgd2lkdGggICAgICAgICA6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykpO1xcbiAgaGVpZ2h0ICAgICAgICA6IGNhbGMoMiAqIHZhcigtLXJhZGl1cykpO1xcbiAgYmFja2dyb3VuZCAgICA6ICNkZGQ7XFxufVxcblxcbi5maWxlTGlzdCBzdW1tYXJ5OjpiZWZvcmV7XFxuICBjb250ZW50ICAgICA6ICcrJztcXG4gIHotaW5kZXggICAgIDogMTtcXG4gIGJhY2tncm91bmQgIDogIzY5NjtcXG4gIGNvbG9yICAgICAgIDogI2ZmZjtcXG4gIGxpbmUtaGVpZ2h0IDogY2FsYygyICogdmFyKC0tcmFkaXVzKSAtIDJweCk7XFxuICB0ZXh0LWFsaWduICA6IGNlbnRlcjtcXG59XFxuXFxuLmZpbGVMaXN0IGRldGFpbHNbb3Blbl0gPiBzdW1tYXJ5OjpiZWZvcmV7XFxuICBjb250ZW50IDogJ+KIkic7XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX0VYUE9SVF9fXyA9IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyhfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi5pbnN0cnVtZW50TGlzdCB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZThmMmU4O1xcbn1cXG5cXG4uaW5zdHJ1bWVudExpc3QgbGkge1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4uaW5zdHJ1bWVudExpc3QgbGk6aG92ZXIge1xcbiAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2NvbXBvbmVudHMvaW5zdHJ1bWVudExpc3Quc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQTtFQUNFLHlCQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0FBQ0Y7QUFDRTtFQUNFLHNCQUFBO0FBQ0pcIixcInNvdXJjZXNDb250ZW50XCI6W1wiLmluc3RydW1lbnRMaXN0IHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNlOGYyZTg7XFxufVxcblxcbi5pbnN0cnVtZW50TGlzdCBsaSB7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxuXFxuICAmOmhvdmVyIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZjtcXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjRmNGY0O1xcbiAgbWFyZ2luOiAwO1xcbn1cXG5cXG4uY29udGFpbmVyIHtcXG4gIGJhY2tncm91bmQtY29sb3I6ICNmZmY7XFxuICBwYWRkaW5nOiAxcmVtO1xcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvaW5kZXguc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFFQTtFQUNFLHlCQUhXO0VBSVgsU0FBQTtBQURGOztBQUlBO0VBQ0Usc0JBQUE7RUFDQSxhQUFBO0FBREZcIixcInNvdXJjZXNDb250ZW50XCI6W1wiJGJvZHktY29sb3I6ICNmNGY0ZjQ7XFxuXFxuYm9keSB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkYm9keS1jb2xvcjtcXG4gIG1hcmdpbjogMDtcXG59XFxuXFxuLmNvbnRhaW5lciB7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmO1xcbiAgcGFkZGluZzogMXJlbTtcXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2ZpbGVMaXN0LnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9maWxlTGlzdC5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9pbnN0cnVtZW50TGlzdC5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5zdHJ1bWVudExpc3Quc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vaW5kZXguc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL2luZGV4LnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGV2ZW50XzEgPSByZXF1aXJlKFwiLi9ldmVudFwiKTtcbnZhciBDb21wb25lbnQgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKENvbXBvbmVudCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBDb21wb25lbnQoY2xhc3NOYW1lKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgX3RoaXMuZ2V0RWwoKS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgQ29tcG9uZW50LnByb3RvdHlwZS5nZXRFbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWw7XG4gICAgfTtcbiAgICByZXR1cm4gQ29tcG9uZW50O1xufShldmVudF8xLmRlZmF1bHQpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbXBvbmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEV2ZW50ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEV2ZW50KCkge1xuICAgICAgICB0aGlzLmV2ZW50cyA9IHt9O1xuICAgIH1cbiAgICBFdmVudC5wcm90b3R5cGUuYWRkRXZlbnQgPSBmdW5jdGlvbiAodHlwZSwgZnVuYykge1xuICAgICAgICBpZiAoIXRoaXMuZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZXZlbnRzW3R5cGVdLnB1c2goZnVuYyk7XG4gICAgfTtcbiAgICBFdmVudC5wcm90b3R5cGUucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiAodHlwZSwgZnVuYykge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBpZiAodGhpcy5ldmVudHNbdHlwZV0pIHtcbiAgICAgICAgICAgIGlmIChmdW5jKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ldmVudHNbdHlwZV0uZm9yRWFjaChmdW5jdGlvbiAoZXZlbnRGdW5jLCBpbmRleCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXZlbnRGdW5jID09PSBmdW5jKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5ldmVudHNbdHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZWxldGUgdGhpcy5ldmVudHNbdHlwZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIEV2ZW50LnByb3RvdHlwZS5kaXNwYXRjaEV2ZW50ID0gZnVuY3Rpb24gKHR5cGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuZXZlbnRzW3R5cGVdKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50c1t0eXBlXS5mb3JFYWNoKGZ1bmN0aW9uIChldmVudEZ1bmMpIHtcbiAgICAgICAgICAgICAgICBldmVudEZ1bmMoeyBkYXRhOiBkYXRhLCB0YXJnZXQ6IF90aGlzLCB0eXBlOiB0eXBlIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBFdmVudDtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBFdmVudDtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IGFkb3B0KHJlc3VsdC52YWx1ZSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xudmFyIF9fZ2VuZXJhdG9yID0gKHRoaXMgJiYgdGhpcy5fX2dlbmVyYXRvcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIGJvZHkpIHtcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xuICAgIHJldHVybiBnID0geyBuZXh0OiB2ZXJiKDApLCBcInRocm93XCI6IHZlcmIoMSksIFwicmV0dXJuXCI6IHZlcmIoMikgfSwgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIChnW1N5bWJvbC5pdGVyYXRvcl0gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXM7IH0pLCBnO1xuICAgIGZ1bmN0aW9uIHZlcmIobikgeyByZXR1cm4gZnVuY3Rpb24gKHYpIHsgcmV0dXJuIHN0ZXAoW24sIHZdKTsgfTsgfVxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcbiAgICAgICAgaWYgKGYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJHZW5lcmF0b3IgaXMgYWxyZWFkeSBleGVjdXRpbmcuXCIpO1xuICAgICAgICB3aGlsZSAoZyAmJiAoZyA9IDAsIG9wWzBdICYmIChfID0gMCkpLCBfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBjb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudFwiKTtcbnJlcXVpcmUoXCIuL2ZpbGVMaXN0LnNjc3NcIik7XG52YXIgRmlsZUxpc3QgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEZpbGVMaXN0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEZpbGVMaXN0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBcImZpbGVMaXN0XCIpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmZpbGVzID0gW107XG4gICAgICAgIF90aGlzLmZpbGVzTmVzdGVkID0ge307XG4gICAgICAgIF90aGlzLmluc3RydW1lbnQgPSB7fTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBGaWxlTGlzdC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgZGl2LmlubmVySFRNTCA9IHRoaXMuaW5zdHJ1bWVudC5yZXBvO1xuICAgICAgICB2YXIgdWwgPSB0aGlzLmNyZWF0ZVRyZWUodGhpcy5maWxlc05lc3RlZCk7XG4gICAgICAgIHVsLmNsYXNzTmFtZSA9IFwidHJlZVwiO1xuICAgICAgICBkaXYuYXBwZW5kQ2hpbGQodWwpO1xuICAgICAgICB0aGlzLmdldEVsKCkucmVwbGFjZUNoaWxkcmVuKCk7XG4gICAgICAgIHRoaXMuZ2V0RWwoKS5hcHBlbmRDaGlsZChkaXYpO1xuICAgIH07XG4gICAgRmlsZUxpc3QucHJvdG90eXBlLmNyZWF0ZVRyZWUgPSBmdW5jdGlvbiAoZmlsZXNOZXN0ZWQpIHtcbiAgICAgICAgdmFyIHVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInVsXCIpO1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gZmlsZXNOZXN0ZWQpIHtcbiAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhmaWxlc05lc3RlZFtrZXldKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRldGFpbHMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGV0YWlsc1wiKTtcbiAgICAgICAgICAgICAgICB2YXIgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdW1tYXJ5XCIpO1xuICAgICAgICAgICAgICAgIHN1bW1hcnkuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgICAgICAgICAgIGRldGFpbHMuYXBwZW5kQ2hpbGQoc3VtbWFyeSk7XG4gICAgICAgICAgICAgICAgZGV0YWlscy5hcHBlbmRDaGlsZCh0aGlzLmNyZWF0ZVRyZWUoZmlsZXNOZXN0ZWRba2V5XSkpO1xuICAgICAgICAgICAgICAgIGxpLmFwcGVuZENoaWxkKGRldGFpbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGkuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdWwuYXBwZW5kQ2hpbGQobGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bDtcbiAgICB9O1xuICAgIEZpbGVMaXN0LnByb3RvdHlwZS5maWxlTG9hZCA9IGZ1bmN0aW9uIChldmVudERhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHJlc3BvbnNlLCBnaXRodWJUcmVlO1xuICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIFs0IC8qeWllbGQqLywgZmV0Y2goXCJodHRwczovL2FwaS5naXRodWIuY29tL3JlcG9zL1wiLmNvbmNhdChldmVudERhdGEuZGF0YS5yZXBvLCBcIi9naXQvdHJlZXMvbWFpbj9yZWN1cnNpdmU9MVwiKSldO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IF9hLnNlbnQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCAvKnlpZWxkKi8sIHJlc3BvbnNlLmpzb24oKV07XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgICAgIGdpdGh1YlRyZWUgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmZpbGVzID0gZ2l0aHViVHJlZS50cmVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5maWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHAucGF0aFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCIvXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKG8sIGspIHsgcmV0dXJuIChvW2tdID0gb1trXSB8fCB7fSk7IH0sIF90aGlzLmZpbGVzTmVzdGVkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnN0cnVtZW50ID0gZXZlbnREYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBbMiAvKnJldHVybiovXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gRmlsZUxpc3Q7XG59KGNvbXBvbmVudF8xLmRlZmF1bHQpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEZpbGVMaXN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50XCIpO1xucmVxdWlyZShcIi4vaW5zdHJ1bWVudExpc3Quc2Nzc1wiKTtcbnZhciBpbnN0cnVtZW50cyA9IHJlcXVpcmUoXCIuLi9kYXRhL2luc3RydW1lbnRzLmpzb25cIik7XG52YXIgSW5zdHJ1bWVudExpc3QgPSAvKiogQGNsYXNzICovIChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEluc3RydW1lbnRMaXN0LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEluc3RydW1lbnRMaXN0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzLCBcImluc3RydW1lbnRMaXN0XCIpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLnBsdWdpbnMgPSBpbnN0cnVtZW50cy5vYmplY3RzO1xuICAgICAgICBfdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBJbnN0cnVtZW50TGlzdC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB2YXIgdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwidWxcIik7XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMucGx1Z2lucykuZm9yRWFjaChmdW5jdGlvbiAocGx1Z2luSWQpIHtcbiAgICAgICAgICAgIHZhciBsaSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaVwiKTtcbiAgICAgICAgICAgIGxpLmlubmVySFRNTCA9IF90aGlzLnBsdWdpbkxhdGVzdChwbHVnaW5JZCkubmFtZTtcbiAgICAgICAgICAgIGxpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuZGlzcGF0Y2hFdmVudChcImNsaWNrXCIsIF90aGlzLnBsdWdpbkxhdGVzdChwbHVnaW5JZCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB1bC5hcHBlbmRDaGlsZChsaSk7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmdldEVsKCkuYXBwZW5kQ2hpbGQodWwpO1xuICAgIH07XG4gICAgSW5zdHJ1bWVudExpc3QucHJvdG90eXBlLnBsdWdpbkxhdGVzdCA9IGZ1bmN0aW9uIChwbHVnaW5JZCkge1xuICAgICAgICB2YXIgcGx1Z2luRW50cnkgPSB0aGlzLnBsdWdpbnNbcGx1Z2luSWRdO1xuICAgICAgICByZXR1cm4gcGx1Z2luRW50cnkudmVyc2lvbnNbcGx1Z2luRW50cnkudmVyc2lvbl07XG4gICAgfTtcbiAgICByZXR1cm4gSW5zdHJ1bWVudExpc3Q7XG59KGNvbXBvbmVudF8xLmRlZmF1bHQpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEluc3RydW1lbnRMaXN0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIGNvbXBvbmVudF8xID0gcmVxdWlyZShcIi4vY29tcG9uZW50cy9jb21wb25lbnRcIik7XG52YXIgaW5zdHJ1bWVudExpc3RfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvaW5zdHJ1bWVudExpc3RcIik7XG52YXIgZmlsZUxpc3RfMSA9IHJlcXVpcmUoXCIuL2NvbXBvbmVudHMvZmlsZUxpc3RcIik7XG5yZXF1aXJlKFwiLi9pbmRleC5zY3NzXCIpO1xudmFyIEluZGV4ID0gLyoqIEBjbGFzcyAqLyAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhJbmRleCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBJbmRleCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgXCJpbmRleFwiKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBJbmRleC5wcm90b3R5cGUucmVuZGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmlsZUxpc3QgPSBuZXcgZmlsZUxpc3RfMS5kZWZhdWx0KCk7XG4gICAgICAgIHZhciBpbnN0cnVtZW50TGlzdCA9IG5ldyBpbnN0cnVtZW50TGlzdF8xLmRlZmF1bHQoKTtcbiAgICAgICAgaW5zdHJ1bWVudExpc3QuYWRkRXZlbnQoXCJjbGlja1wiLCBmdW5jdGlvbiAoZXZlbnREYXRhKSB7XG4gICAgICAgICAgICBmaWxlTGlzdC5maWxlTG9hZChldmVudERhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5nZXRFbCgpLmFwcGVuZENoaWxkKGluc3RydW1lbnRMaXN0LmdldEVsKCkpO1xuICAgICAgICB0aGlzLmdldEVsKCkuYXBwZW5kQ2hpbGQoZmlsZUxpc3QuZ2V0RWwoKSk7XG4gICAgfTtcbiAgICByZXR1cm4gSW5kZXg7XG59KGNvbXBvbmVudF8xLmRlZmF1bHQpKTtcbnZhciBpbmRleCA9IG5ldyBJbmRleCgpO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbmRleC5nZXRFbCgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEluZGV4O1xuIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=