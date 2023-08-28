var BufferLoader = require("./buffer_loader")
  , Voice = require("./voice")
  , _ = require("underscore")

var player = function(instrument, audioContext){
  this.context = audioContext
  var sampleUrls = _.uniq(instrument.samples())
  this.loadBuffers(sampleUrls)
  this.voicesToRelease = {}
  this.activeVoices = window.voices = {}
  this.bend = 0
}

player.prototype.loadBuffers = function(urls){
  this.samples = urls
  // urls = _.map(urls, function(url){ return encodeURIComponent(url) })
  urls = _.filter(urls, function(url){ return url.includes('*') ? false : url; })
  var loader = new BufferLoader(urls, this.onBuffersLoaded.bind(this), this.context)
  loader.load()
}

player.prototype.onBuffersLoaded = function(buffers){
  console.log('onBuffersLoaded', buffers);
  var self = this
  this.buffers = {}

  _.each(this.samples, function(url, i){
    self.buffers[url] = buffers[i]
  })
  console.log('onBuffersLoaded2', this.samples, this.buffers);
}

player.prototype.play = function(region, noteOn){
  console.log('play', region, noteOn);
  var buffer = this.buffers[region.sample]
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[noteOn.pitch] = voicesToRelease[noteOn.pitch] || []

  var voice = new Voice(buffer, region, noteOn, this.context, this.bend)
  self.activeVoices[voice.voiceId] = voice
  voice.onended = function(){
    delete self.activeVoices[voice.voiceId]
  }
  if (region.trigger == "attack") {
    voicesToRelease[noteOn.pitch].push(voice)
  }
  voice.connect(this.context.destination)
  voice.start()
}

player.prototype.stop = function(pitch){
  var self = this
  var voicesToRelease = this.voicesToRelease
  voicesToRelease[pitch] = voicesToRelease[pitch] || []

  _.each(voicesToRelease[pitch], function(voice){
    voice.stop()
  })
  voicesToRelease[pitch] = []
  //var voiceToRelase = voicesToRelease[noteOn.pitch][region.regionId]
  //if (voiceToRelase) voiceToRelase.stop()
  //voicesToRelease[noteOn.pitch][region.regionId] = null
}

player.prototype.pitchBend = function(channel, bend){
  _.invoke(this.activeVoices, "pitchBend", bend)
  this.bend = bend
}

module.exports = player
