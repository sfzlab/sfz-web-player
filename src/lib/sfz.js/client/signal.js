var Signal = function(opts){
  this.context = opts.context
  if (typeof opts.value == "undefined") opts.value == 1

  var buffer = opts.context.createBuffer(1, 1024, opts.context.sampleRate)

  var data = buffer.getChannelData(0)

  for (var i=0; i < data.length; i++) {
    data[i] = opts.value
  }

  this.buffer = buffer
  this.loop = true
}

var SignalFactory = function(opts){
  var source = opts.context.createBufferSource()
  Signal.call(source, opts)

  return source
}

module.exports = SignalFactory
