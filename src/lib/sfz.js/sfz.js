var sfz = {
  name: 'sfz'
}
  , Parser = require("./parser")

sfz.Instrument = require("./instrument")

sfz.parse = function(str, driver, audioContext){
  var instrumentDefinition = Parser.parse(str)
  console.log('instrumentDefinition', instrumentDefinition);
  if (driver) instrumentDefinition.driver = driver
  if (audioContext) instrumentDefinition.audioContext = audioContext
  return new sfz.Instrument(instrumentDefinition)
}


module.exports = sfz
