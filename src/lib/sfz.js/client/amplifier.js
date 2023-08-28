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
