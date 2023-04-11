"use strict";

var oop = ace.require("ace/lib/oop");
var TextMode = ace.require("ace/mode/text").Mode;
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
