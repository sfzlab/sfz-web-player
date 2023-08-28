module.exports = {
  dbToGain: function(db){
    return Math.pow(10, (db / 20.0 )) * 1.0
  },

  adjustFreqByCents: function(freq, cents){
    return freq * Math.pow((Math.pow(2, 1/1200)), cents)
  }
}
