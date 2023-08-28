module.exports = {
  load: function(url, callback){
    var request = new XMLHttpRequest()
    request.open("GET", url, true)
    request.responseType = "text"

    var loader = this

    request.onload = function(){
      var pathString = request.response.replace(/\\/g,"/")
      callback(pathString)
    }

    request.send()
  }
}
