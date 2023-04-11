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
