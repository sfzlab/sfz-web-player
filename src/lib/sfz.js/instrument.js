var  Region = require("./region")
  , NullSynth = require("./null_synth")
  , _ = require("underscore")

model = function(opts){
  opts = opts || {}
  opts.regions = opts.regions || []

  this.regions = _.map(opts.regions, function(regionDefinition){
    return new Region(regionDefinition)
  })

  this.control = opts.control

  this.bend = 0
  this.chanaft = 64
  this.polyaft = 64
  this.bpm = 120

  if (opts.driver) {
    this.synth = new opts.driver(this, opts.audioContext)
  } else {
    this.synth = new NullSynth()
  }
}

model.prototype.shouldPlayRegion = function(region, noteOn, rand){
  return region.sample != null &&
    region.lochan <= noteOn.channel &&
    region.hichan >= noteOn.channel &&
    region.lokey <= noteOn.pitch &&
    region.hikey >= noteOn.pitch &&
    region.lovel <= noteOn.velocity &&
    region.hivel >= noteOn.velocity &&
    region.lobend <= this.bend &&
    region.hibend >= this.bend &&
    region.lochanaft <= this.chanaft &&
    region.hichanaft >= this.chanaft &&
    region.lopolyaft <= this.polyaft &&
    region.hipolyaft >= this.polyaft &&
    region.lorand <= rand &&
    region.hirand >= rand &&
    region.lobpm <= this.bpm &&
    region.hibpm >= this.bpm
}

model.prototype.regionsToPlay = function(noteOn, rand){
  var self = this
  return _.filter(this.regions, function(region){
    return self.shouldPlayRegion(region, noteOn, rand);
  })
}

model.prototype.random = function(){
  return Math.random()
}

model.prototype.noteOn = function(channel, pitch, velocity){
  console.log('noteOn', channel, pitch, velocity);
  var rand = this.random()
  var noteOn = {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  }

  if (noteOn.velocity > 0) {
    var regions = this.regionsToPlay(noteOn, rand)
    _.each(regions, function(region){
      this.play(region, noteOn)
    }.bind(this))
  } else {
    this.stop(noteOn.pitch)
  }
}

model.prototype.play = function(region, noteOn){
  this.synth.play(region, noteOn)
}

model.prototype.stop = function(pitch){
  this.synth.stop(pitch)
}

model.prototype.samples = function(){
  var samples = []
  _.each(this.regions, function(region){
    if (region.sample) samples.push(region.sample)
  })
  return samples
}

model.prototype.pitchBend = function(channel, bend){
  this.synth.pitchBend(channel, bend)
  this.bend = bend
}

model.prototype.connect = function(destination, output){
  this.synth.connect(destination, output)
}

model.prototype.disconnect = function(output){
  this.synth.connect(output)
}

module.exports = model
