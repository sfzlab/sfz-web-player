var  Parameter = require("./parameter")
  , _ = require("underscore")

function extend(target, source){
  target = target || {};
  for (var prop in source) {
    if (typeof source[prop] === 'object') {
      target[prop] = extend(target[prop], source[prop]);
    } else {
      target[prop] = source[prop];
    }
  }
  return target;
}

Region = function(opts){
  this.sample = {}
  this.inputControls = {}
  this.performanceParameters = {}
  _.extend(this, opts)
  _.defaults(this, Parameter.defaultValues)
}

module.exports = Region
