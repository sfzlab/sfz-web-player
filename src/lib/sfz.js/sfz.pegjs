start
  = __ instrument:Instrument __ { return instrument; }

Instrument
  = elements:SourceElements? {

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
    }

SourceElements
  = head:SourceElement tail:(__ SourceElement)* {
      var result = [head];
      for (var i = 0; i < tail.length; i++) {
        result.push(tail[i][1]);
      }
      return result;
    }

SourceElement
  = Comment
  / Header
  / OpcodeDirective

SourceCharacter
  = .

Header "header"
 = Global / Master / Region / Group / Curve / AriaCustomHeader

Global
 = "<global>"

Master
 = "<master>"

Region
 = "<region>"

Group
 = "<group>"

Curve
 = "<curve>"

OpcodeDirective "opcode directive"
  = "sample=" value:Filepath { return { sample: value } }
  / "key=" value:MidiNoteValue {
    return { lokey: value, hikey: value, pitch_keycenter: value }
  }
  / "sw_vel=" value:("current" / "previous") { return { sw_vel: value } }
  / "sw_trigger=" value:(
    "attack" / "release" / "first" / "legato"
  ) { return { sw_trigger: value } }
  / "off_mode=" value:("fast" / "normal") { return { off_mode: value } }
  / DelayCcDirective
  / OffsetCcDirective
  / LoopModeDirective
  / PitchLfoDepthCcDirective
  / PitchLfoFreqCcDirective
  / "fil_type=" value:(
    "lpf_1p" / "hpf_1p" / "lpf_2p" / "hpf_2p" / "bpf_2p" / "brf_2p"
    ) { return { fil_type: value } }
  / CutoffCcDirective
  / MidiNoteOpcodeDirective
  / FloatOpcodeDirective
  / IntegerOpcodeDirective
  / CurveOpcodeDirective
  / SequentialFloatDirective
  / SequentialIntegerDirective
  / AriaDefaultPathOpcode
  / AriaCustomTextOpcode
  / AriaCurveOpcode
  / FlexEgOpcode
  / LfoOpcode

MidiNoteOpcodeDirective
  = name:MidiNoteOpcode "=" value:MidiNoteValue {
    var param = {}
    param[name] = value
    return param
  }

FloatOpcodeDirective
  = name:FloatOpcode "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

IntegerOpcodeDirective
  = name:IntegerOpcode "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

CurveOpcodeDirective
  = name:CurveOpcode "=" value:("gain" / "power") {
    var param = {}
    param[name] = value
    return param
  }

CurveOpcode
  = "xf_keycurve"
  / "xf_velcurve"
  / "xf_cccurve"

MidiNoteOpcode "midi note opcode"
  = "lokey"
  / "hikey"
  / "pitch_keycenter"
  / "sw_lokey"
  / "sw_hikey"
  / "sw_last"
  / "sw_down"
  / "sw_up"
  / "sw_previous"
  / "octave_offset"
  / "note_offset"

FloatOpcode "float opcode"
  = "fillfo_delay"
  / "fillfo_fade"
  / "fillfo_freq"
  / "fillfo_freqcc1"
  / "fillfo_freqcc2"
  / "lorand"
  / "hirand"
  / "lotimer"
  / "hitimer"
  / "lobpm"
  / "hibpm"
  / "delay_random"
  / "delay_cc1"
  / "delay_cc2"
  / "delay"
  / "sync_beats"
  / "sync_offset"
  / "pitcheg_delay"
  / "pitcheg_start"
  / "pitcheg_attack"
  / "pitcheg_hold"
  / "pitcheg_decay"
  / "pitcheg_sustain"
  / "pitcheg_release"
  / "pitcheg_vel2delay"
  / "pitcheg_vel2attack"
  / "pitcheg_vel2hold"
  / "pitcheg_vel2decay"
  / "pitcheg_vel2sustain"
  / "pitchlfo_delay"
  / "pitchlfo_fade"
  / "pitchlfo_freqcc1"
  / "pitchlfo_freqcc60"
  / "pitchlfo_freqchanaft"
  / "pitchlfo_freqpolyaft"
  / "pitchlfo_freq"
  / "cutoff"
  / "resonance"
  / "fileg_delay"
  / "fileg_start"
  / "fileg_attack"
  / "fileg_hold"
  / "fileg_decay"
  / "fileg_sustain"
  / "fileg_release"
  / "fileg_vel2delay"
  / "fileg_vel2attack"
  / "fileg_vel2hold"
  / "fileg_vel2decay"
  / "fileg_vel2sustain"
  / "fileg_vel2release"
  / "volume"
  / "pan"
  / "width"
  / "position"
  / "amp_keytrack"
  / "amp_veltrack"
  / "amp_velcurve_1"
  / "amp_velcurve_127"
  / "amp_random"
  / "rt_decay"
  / "ampeg_delay"
  / "ampeg_start"
  / "ampeg_attack"
  / "ampeg_hold"
  / "ampeg_decay"
  / "ampeg_sustain"
  / "ampeg_release"
  / "ampeg_vel2delay"
  / "ampeg_vel2attack"
  / "ampeg_vel2hold"
  / "ampeg_vel2decay"
  / "ampeg_vel2sustain"
  / "ampeg_vel2release"
  / "amplfo_delay"
  / "amplfo_fade"
  / "amplfo_depthchanaft"
  / "amplfo_depthpolyaft"
  / "amplfo_depth"
  / "amplfo_freqchanaft"
  / "amplfo_freqpolyaft"
  / "amplfo_freq"
  / "eq1_freq"
  / "eq2_freq"
  / "eq3_freq"
  / "eq1_vel2freq"
  / "eq2_vel2freq"
  / "eq3_vel2freq"
  / "eq1_bw"
  / "eq2_bw"
  / "eq3_bw"
  / "eq1_gain"
  / "eq2_gain"
  / "eq3_gain"
  / "eq1_vel2gain"
  / "eq2_vel2gain"
  / "eq3_vel2gain"
  / "effect1"
  / "effect2"
  / AriaCustomFloatOpcode

IntegerOpcode "integer opcode"
  = "fillfo_depthcc1"
  / "fillfo_depthcc60"
  / "fillfo_freqchanaft"
  / "fillfo_freqpolyaft"
  / "fillfo_freqchanaft"
  / "fillfo_freqpolyaft"
  / "fillfo_depth"
  / "lovel"
  / "hivel"
  / "lobend"
  / "hibend"
  / "lochanaft"
  / "hichanaft"
  / "lochan"
  / "hichan"
  / "loprog"
  / "hiprog"
  / "lopolyaft"
  / "hipolyaft"
  / "seq_length"
  / "seq_position"
  / "group"
  / "off_by"
  / "offset_random"
  / "offset_cc1"
  / "offset_cc64"
  / "offset"
  / "end"
  / "count"
  / "loop_start"
  / "loop_end"
  / "transpose"
  / "tune"
  / "tune"
  / "pitch_keytrack"
  / "pitch_veltrack"
  / "pitch_random"
  / "bend_up"
  / "bend_down"
  / "pitcheg_depth"
  / "fileg_depth"
  / "fileg_vel2depth"
  / "fil_keytrack"
  / "fil_keycenter"
  / "fil_veltrack"
  / "fil_random"
  / "cutoff_cc1"
  / "cutoff_cc2"
  / "cutoff_chanaft"
  / "cutoff_polyaft"
  / "pitchlfo_depthcc1"
  / "pitchlfo_depthcc60"
  / "pitchlfo_depthchanaft"
  / "pitchlfo_depthpolyaft"
  / "pitchlfo_depth"
  / "pitcheg_vel2depth"
  / "amp_keycenter"
  / "output"
  / "xfin_lokey"
  / "xfin_hikey"
  / "xfin_lovel"
  / "xfin_hivel"
  / "xfout_lovel"
  / "xfout_hivel"
  / AriaCustomIntegerOpcode

SequentialFloatDirective
 = name:(n:SequentialFloatOpcode i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

SequentialIntegerDirective
 = name:(n:SequentialIntegerOpcode i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

SequentialFloatOpcode "sequential float opcode"
  = "fillfo_freqcc"
  / "gain_cc"
  / "ampeg_delaycc"
  / "ampeg_startcc"
  / "ampeg_attackcc"
  / "ampeg_holdcc"
  / "ampeg_decaycc"
  / "ampeg_sustaincc"
  / "ampeg_releasecc"
  / "amplfo_depthcc"
  / "amplfo_freqcc"
  / "eq1_freqcc"
  / "eq2_freqcc"
  / "eq3_freqcc"
  / "eq1_bwcc"
  / "eq2_bwcc"
  / "eq3_bwcc"
  / "eq1_gaincc"
  / "eq2_gaincc"
  / "eq3_gaincc"
  / "amp_velcurve_"
  / "amp_velcurve_"

SequentialIntegerOpcode
  = "fillfo_depthcc"
  / "xfin_locc"
  / "xfin_hicc"
  / "xfout_locc"
  / "xfout_hicc"
  / AriaCustomSequentialIntegerOpcode

DelayCcDirective
  = name:(n:"delay_cc" i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

OffsetCcDirective
  = name:(n:"offset_cc" i:Integer { return n + i }) "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

PitchLfoDepthCcDirective
  = name:(n:"pitchlfo_depthcc" i:Integer { return n + i }) "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

PitchLfoFreqCcDirective
  = name:(n:"pitchlfo_freqcc" i:Integer { return n + i }) "=" value:Float {
    var param = {}
    param[name] = value
    return param
  }

CutoffCcDirective
  = name:(n:"cutoff_cc" i:Integer { return n + i }) "=" value:Integer {
    var param = {}
    param[name] = value
    return param
  }

LoopModeDirective
  = "loop_mode" "=" value:(
    "no_loop" / "one_shot" / "loop_continuous" / "loop_sustain"
  ) { return { loop_mode: value } }

MidiNoteValue
 = Integer / MidiNoteName

Integer
  = SignedIntegerAsNumber

Float
  = SignedDecimalLiteral

DecimalDigits
  = DecimalDigit+

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = [eE]

SignedInteger
  = [-+]? DecimalDigits

SignedIntegerAsNumber
  = sign:[-+]? digits:DecimalDigits {
    sign = sign || ""
    return parseInt(sign + digits.join(""), 10)
  }

DecimalLiteral
  = parts:$(DecimalIntegerLiteral "." DecimalDigits? ExponentPart?) {
      return parseFloat(parts);
    }
  / parts:$("." DecimalDigits ExponentPart?)     { return parseFloat(parts); }
  / parts:$(DecimalIntegerLiteral ExponentPart?) { return parseFloat(parts); }

DecimalIntegerLiteral
  = "0" / NonZeroDigit DecimalDigits?

SignedDecimalLiteral
 = sign:[-+]? decimal:DecimalLiteral {
   sign = sign || ""
  return parseFloat(sign + decimal)
 }

MidiNoteName
  = pitch:MidiPitch accidental:MidiAccidental octave:SignedIntegerAsNumber {
    return (pitch + accidental) + (octave + 1) * 12
  }

MidiPitch
  = note:[a-gA-G] {
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
  }

MidiAccidental
  = accidental:[#b]? {
    switch (accidental) {
      case "#":
        return 1
      case "b":
        return -1
      default:
        return 0
    }
  }

Filepath
 = name:Filename ext:FileExtension { return name + ext }

Filename
 = chars:(!FileExtension c:SourceCharacter { return c })+ {
   return chars.join("")
 }

Path
 = "../"

FileExtension
  = ".wav" / ".ogg" / ".mp3"

/* ===== A.1 Lexical Grammar ===== */


WhiteSpace "whitespace"
  = [\t\v\f \u00A0\uFEFF]
  / Zs

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence "end of line"
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028" // line separator
  / "\u2029" // paragraph separator

Comment "comment"
  = MultiLineComment
  / SingleLineComment

MultiLineComment
  = "/*" (!"*/" SourceCharacter)* "*/"

MultiLineCommentNoLineTerminator
  = "/*" (!("*/" / LineTerminator) SourceCharacter)* "*/"

SingleLineComment
  = "//" (!LineTerminator SourceCharacter)*

// Separator, Space
Zs = [\u0020\u00A0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000]

EOS
  = __ ";"
  / _ LineTerminatorSequence
  / _ &"}"
  / __ EOF

EOSNoLineTerminator
  = _ ";"
  / _ LineTerminatorSequence
  / _ &"}"
  / _ EOF

EOF
  = !.

/* Whitespace */

_
  = (WhiteSpace / MultiLineCommentNoLineTerminator / SingleLineComment)*

__
  = (WhiteSpace / LineTerminatorSequence / Comment)*

// Custom Aria opcodes

AriaCustomHeader
 = "<control>"
 / "<curve>"

AriaCustomIntegerOpcode
  = "hint_ram_based"
  / "global_volume"
  / "lfo06_freq"
  / "lfo06_pitch"
  / "lfo06_wave"
  / "lfo06_pitch_oncc129"

AriaCustomFloatOpcode
  = "lfo06_freq"
  / "global_volume"

AriaCustomSequentialIntegerOpcode
  = "set_cc"
  / "lfo06_pitch_oncc"
  / "amplitude_oncc"
  / "amplitude_curvecc"

AriaCustomTextOpcode
  = "region_label=" value:Label { return { region_label: value } }

AriaDefaultPathOpcode
  = "default_path=" value:Path { return { default_path: value } }

Label
 = chars:(!LineTerminatorSequence c:SourceCharacter { return c })+ {
   return chars.join("")
 }

AriaCurveOpcode
  = "v" digits:DecimalDigits "=" value:Float {
    var param = {}
    var name = "v" + digits.join("")
    param[name] = value
    return param
  }

FlexEgOpcode
  = FlexEgCutoff
  / FlexEgSustain
  / FlexEgPitch
  / FlexEgTime
  / FlexEgLevel
  / FlexEgShape

FlexEgCutoff
  = "eg" digits:DecimalDigits "_cutoff=" value:Float {
    var param = {}
    var name = "eg" + digits.join("")
    param[name] = value
    return param
  }

FlexEgSustain
  = "eg" digits:DecimalDigits "_sustain=" value:Float {
    var param = {}
    var name = "eg" + digits.join("")
    param[name] = value
    return param
  }

FlexEgPitch
  = "eg" digits:DecimalDigits "_pitch=" value:Float {
    var param = {}
    var name = "eg" + digits.join("")
    param[name] = value
    return param
  }


FlexEgTime
  = "eg" digits:DecimalDigits "_time" node:Integer "=" value:Float {
    var param = {}
    var name = "eg" + digits.join("") + "_time" + node
    param[name] = value
    return param
  }

FlexEgLevel
  = "eg" digits:DecimalDigits "_level" node:Integer "=" value:Float {
    var param = {}
    var name = "eg" + digits.join("") + "_level" + node
    param[name] = value
    return param
  }

FlexEgShape
  = "eg" digits:DecimalDigits "_shape" node:Integer "=" value:Integer {
    var param = {}
    var name = "eg" + digits.join("") + "_shape" + node
    param[name] = value
    return param
  }

LfoOpcode
  = LfoWave
  / LfoFreq
  / LfoPitch
  / LfoDelay
  / LfoAmplitude
  / LfoCutoff
  / LfoPhase

LfoWave
  = "lfo" digits:DecimalDigits "_wave=" value:Integer {
    var param = {}
    var name = "lfo" + digits.join("") + "_wave"
    param[name] = value
    return param
  }

LfoFreq
  = "lfo" digits:DecimalDigits "_freq=" value:Float {
    var param = {}
    var name = "lfo" + digits.join("") + "_freq"
    param[name] = value
    return param
  }

LfoPitch
  = "lfo" digits:DecimalDigits "_pitch=" value:Integer {
    var param = {}
    var name = "lfo" + digits.join("") + "_pitch"
    param[name] = value
    return param
  }

LfoDelay
  = "lfo" digits:DecimalDigits "_delay=" value:Float {
    var param = {}
    var name = "lfo" + digits.join("") + "_delay"
    param[name] = value
    return param
  }

LfoAmplitude
  = "lfo" digits:DecimalDigits "_amplitude=" value:Float {
    var param = {}
    var name = "lfo" + digits.join("") + "_amplitude"
    param[name] = value
    return param
  }

LfoCutoff
  = "lfo" digits:DecimalDigits "_cutoff=" value:Float {
    var param = {}
    var name = "lfo" + digits.join("") + "_cutoff"
    param[name] = value
    return param
  }

LfoPhase
  = "lfo" digits:DecimalDigits "_phase=" value:Float {
    var param = {}
    var name = "lfo" + digits.join("") + "_phase"
    param[name] = value
    return param
  }
