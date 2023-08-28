var _ = require("underscore")
  , EnvelopeGenerator = require("./envelope_generator")
  , LFO = require("./lfo")
  , Signal = require("./signal")
  , AudioMath = require("./audio_math")


var defaults = {
  pan: 0,
  width: 0,
  position: 0
}

var Panner = function(opts){
  _.extend(this, opts)
  _.defaults(this, defaults)

  this.updatePosition = function(position){
    this.panningModel = "equalpower"
    this.distanceModel = "linear"

    var xDeg = position * 45.0
    var zDeg = xDeg + 90
    if (zDeg > 90) zDeg = 180 - zDeg

    var scale = 10
    var x = Math.sin(xDeg * (Math.PI / 180)) * scale

    this.setPosition(x, 0, -1)
  }

  this.updatePosition(this.position)
}


var PannerFactory = function(opts){
  var panner = opts.context.createPanner()
  //Panner.call(panner, opts)

  return panner
}

module.exports = PannerFactory
