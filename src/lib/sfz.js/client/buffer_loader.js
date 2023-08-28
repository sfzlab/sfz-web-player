function BufferLoader(urlList, callback, audioContext){
  this.audioContext = audioContext
  this.urlList = urlList
  this.onload = callback
  this.bufferList = new Array()
  this.loadCount = 0
}

BufferLoader.cache = {}

BufferLoader.prototype.loadBuffer = function(url, index, retries){
  var self = this
  var saneUrl = url.split("?date")[0]
  if (BufferLoader.cache[saneUrl]) {
    return this.onload([BufferLoader.cache[saneUrl]])
  }

  var request = new XMLHttpRequest()
  request.open("GET", url, true)
  request.responseType = "arraybuffer"

  var loader = this

  request.onload = function(){
    self.audioContext.decodeAudioData(
      request.response,
      function(buffer){
        if (!buffer) return;
        loader.bufferList[index] = buffer
        BufferLoader.cache[saneUrl] = buffer
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList)
      }, function(e){}
    )
  }

  request.send()
}

BufferLoader.prototype.load = function(){
  for (var i = 0; i < this.urlList.length; ++i)
  this.loadBuffer(this.urlList[i], i, 0)
}

module.exports = BufferLoader
