var  _ = require("underscore")

console.log('_', _);

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

//_.times(128, function(i){
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

_.times(128, function(i){
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
_.times(128, function(i){
  _.each(seqPerformanceParameters, function(paramName){
    Parameter.performanceParameters.push(paramName + i)
  })
})

var defaultValues = {}
_.each(defaults, function(settings, name){
  defaultValues[name] = settings.value
})
Parameter.defaultValues = defaultValues


module.exports = Parameter
