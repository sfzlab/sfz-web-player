var _ = require("underscore")
  , AudioMath = require("./audio_math")

var defaults = {
  delay: 0,
  fade: 0,
  freq: 0,
  hold: 0,
  depth: 0,
  depthchanaft: 0,
  depthpolyaft: 0,
  freqchanaft: 0,
  freqpolyaft: 0
}

var LFO = function(opts){
  this.context = opts.context
  _.extend(this, opts)
  _.defaults(this, defaults)

  this.oscillator = this.context.createOscillator()
  this.oscillator.frequency.value = this.freq
  this.gainNode = this.context.createGain()
  this.oscillator.connect(this.gainNode)
}

LFO.prototype.start = function(){
  var now = this.context.currentTime
    , delayTime = now + this.delay
    , fadeTime = delayTime + this.fade

  this.gainNode.gain.setValueAtTime(0, now)
  this.gainNode.gain.setValueAtTime(0, delayTime)
  this.gainNode.gain.linearRampToValueAtTime(this.depth, fadeTime)
  this.oscillator.start(delayTime)
}

LFO.prototype.connect = function(param){
  this.gainNode.connect(param)
}

LFO.prototype.destroy = function(){
  this.oscillator.stop()
  this.oscillator.disconnect()
  this.gainNode.disconnect()
}

module.exports = LFO
