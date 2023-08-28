var BufferSource = require("./buffer_source")
  , Filter = require("./filter")
  , Amplifier = require("./amplifier")
  , Panner = require("./panner")
  , Equalizer = require("./equalizer")

var voiceNumber = 0

var sampleRate = 48000

var model = function(buffer, region, noteOn, audioContext, bend){
  this.audioContext = audioContext
  this.voiceId = "voice" + voiceNumber
  voiceNumber += 1

  this.output = audioContext.createGain()

  this.setupSource(buffer, region, noteOn, bend)
  this.setupFilter(region, noteOn)
  this.setupAmp(region, noteOn)
  this.setupPanner(region, noteOn)
  this.setupEqualizer(region, noteOn)

  if (region.offset && region.end) {
    this.offset = region.offset / sampleRate
    this.end = region.end / sampleRate
    this.duration = this.end - this.offset
  }

  if (this.filter) {
    this.source.connect(this.filter)
    this.filter.connect(this.amp.input)
  } else {
    this.source.connect(this.amp.input)
  }

  this.amp.connect(this.panner)
  this.panner.connect(this.equalizer.input)
  this.equalizer.connect(this.output)
}

model.prototype.setupSource = function(buffer, region, noteOn, bend){
  this.source = new BufferSource({
    context: this.audioContext,
    buffer: buffer,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.pitch_keycenter,
    keytrack: region.pitch_keytrack,
    transpose: region.transpose,
    tune: region.tune,
    veltrack: region.pitch_veltrack,
    bend: bend,
    bend_up: region.bend_up,
    bend_down: region.bend_down,
    bend_step: region.bend_step
  })

  if (region.loop_start && region.loop_end && region.loop_mode == "loop_continuous") {
    this.source.loopStart = region.loop_start / sampleRate
    this.source.loopEnd = region.loop_end / sampleRate
    this.source.loop = true
  }
}

model.prototype.setupAmp = function(region, noteOn){
  this.amp = new Amplifier({
    context: this.audioContext,
    pitch: noteOn.pitch,
    velocity: noteOn.velocity,
    keycenter: region.amp_keycenter,
    keytrack: region.amp_keytrack,
    veltrack: region.amp_veltrack,
    eg_delay: region.ampeg_delay,
    eg_start: region.ampeg_start,
    eg_attack: region.ampeg_attack,
    eg_hold: region.ampeg_hold,
    eg_decay: region.ampeg_decay,
    eg_sustain: region.ampeg_sustain,
    eg_release: region.ampeg_release,
    eg_vel2delay: region.ampeg_vel2delay,
    eg_vel2attack: region.ampeg_vel2attack,
    eg_vel2hold: region.ampeg_vel2hold,
    eg_vel2decay: region.ampeg_vel2decay,
    eg_vel2sustain: region.ampeg_vel2sustain,
    eg_vel2release: region.ampeg_vel2release,
    lfo_delay: region.amplfo_delay,
    lfo_fade: region.amplfo_fade,
    lfo_freq: region.amplfo_freq,
    lfo_depth: region.amplfo_depth,
    lfo_depthchanaft: region.amplfo_depthchanaft,
    lfo_depthpolyaft: region.amplfo_depthpolyaft,
    lfo_freqchanaft: region.amplfo_freqchanaft,
    lfo_freqpolyaft: region.amplfo_freqpolyaft
  })
}

model.prototype.setupFilter = function(region, noteOn){
  if (!region.cutoff) return;

  this.filter = new Filter({
    context: this.audioContext,
    type: region.fil_type,
    cutoff: region.cutoff,
    cutoff_chanaft: region.cutoff_chanaft,
    cutoff_polyaft: region.cutoff_polyaft,
    resonance: region.resonance,
    keytrack: region.fil_keytrack,
    keycenter: region.fil_keycenter,
    veltrack: region.fil_veltrack,
    random: region.fil_random,
    eg_delay: region.fileg_delay,
    eg_start: region.fileg_start,
    eg_attack: region.fileg_attack,
    eg_hold: region.fileg_hold,
    eg_decay: region.fileg_decay,
    eg_sustain: region.fileg_sustain,
    eg_release: region.fileg_release,
    eg_vel2delay: region.fileg_vel2delay,
    eg_vel2attack: region.fileg_vel2attack,
    eg_vel2hold: region.fileg_vel2hold,
    eg_vel2decay: region.fileg_vel2decay,
    eg_vel2sustain: region.fileg_vel2sustain,
    eg_vel2release: region.fileg_vel2release,
    lfo_delay: region.fillfo_delay,
    lfo_fade: region.fillfo_fade,
    lfo_freq: region.fillfo_freq,
    lfo_depth: region.fillfo_depth,
    lfo_depthchanaft: region.fillfo_depthchanaft,
    lfo_depthpolyaft: region.fillfo_depthpolyaft,
    lfo_freqchanaft: region.fillfo_freqchanaft,
    lfo_freqpolyaft: region.fillfo_freqpolyaft
  }, noteOn)
}

model.prototype.setupPanner = function(region, noteOn){
  this.panner = new Panner({
    context: this.audioContext,
    pan: region.pan,
    width: region.width,
    position: region.position
  })
}

model.prototype.setupEqualizer = function(region, noteOn){
  this.equalizer = new Equalizer({
    context: this.audioContext,
    velocity: noteOn.velocity,
    freq1: region.eq1_freq,
    freq2: region.eq2_freq,
    freq3: region.eq3_freq,
    vel2freq1: region.eq1_vel2freq,
    vel2freq2: region.eq2_vel2freq,
    vel2freq3: region.eq3_vel2freq,
    bw1: region.eq1_bw,
    bw2: region.eq2_bw,
    bw3: region.eq3_bw,
    gain1: region.eq1_gain,
    gain2: region.eq2_gain,
    gain3: region.eq3_gain,
    vel2gain1: region.eq1_vel2gain,
    vel2gain2: region.eq2_vel2gain,
    vel2gain3: region.eq3_vel2gain
  })
}

model.prototype.start = function(){
  var self = this
  var onended = function(){
    self.source.stop()
    self.destroy()
  }
  this.amp.trigger(onended)
  if (this.filter) this.filter.trigger()
  if (this.offset && this.duration) {
    this.source.start(0, this.offset, this.duration)
  } else {
    this.source.start(0)
  }
}

model.prototype.stop = function(){
  this.amp.triggerRelease()
}

model.prototype.connect = function(destination, output){
  this.output.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.equalizer.disconnect(output)
}

model.prototype.destroy = function(){
  if (this.filter) this.filter.destroy()
  this.amp.destroy()
  this.panner.disconnect()
  this.equalizer.destroy()

  this.source = null
  this.filter = null
  this.amp = null
  this.panner = null
  this.equalizer = null

  if (this.onended) this.onended()
}

model.prototype.pitchBend = function(bend){
  this.source.pitchBend(bend)
}

module.exports = model
