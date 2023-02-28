"use strict";

var Ace = require('ace-builds/src-noconflict/ace');
var oop = Ace.require("ace/lib/oop");
var TextMode = Ace.require("ace/mode/text").Mode;
var SFZHighlightRules = require("./sfz_highlight_rules").SFZHighlightRules;
var FoldMode = require("./sfz_folding_mode").FoldMode;

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
