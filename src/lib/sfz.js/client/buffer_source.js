var _ = require("underscore")

var pitchToFreq = function(pitch){
  return Math.pow(2, (pitch-69)/12.0) * 440
}

var BufferSource = function(opts){
  this.buffer = opts.buffer
  this.opts = opts
  this.bend = opts.bend

  this.updatePlaybackRate = function(){
    var opts = this.opts
    var cents = ((opts.pitch - opts.keycenter) * opts.keytrack) + opts.tune
    cents += (opts.veltrack * opts.velocity / 127)

    var bendRange = 8191
      , bendDepth = opts.bend_up

    if (this.bend < 0) {
      bendRange = -8192
      bendDepth = opts.bend_down
    }

    cents += bendDepth * this.bend / bendRange

    var noteFreq = pitchToFreq(opts.pitch + opts.transpose) * Math.pow((Math.pow(2, 1/1200)), cents)
      , playbackRate = noteFreq / pitchToFreq(opts.keycenter)

    this.playbackRate.value = playbackRate
  }

  this.pitchBend = function(bend){
    this.bend = bend
    this.updatePlaybackRate()
  }

  this.updatePlaybackRate()
}


var BufferSourceFactory = function(opts){
  var source = opts.context.createBufferSource()
  BufferSource.call(source, opts)

  return source
}

module.exports = BufferSourceFactory
