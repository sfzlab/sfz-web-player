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
