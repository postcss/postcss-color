/**
 * Module dependencies.
 */
var transformColor = require("./lib/transform-color")
var transformHexAlpha = require("./lib/transform-hex-alpha")
var transformHwb = require("./lib/transform-hwb")
var transformRebeccapurple = require("./lib/transform-rebeccapurple")

/**
 * Expose plugin, normalizeOptions & transformDecl
 */
module.exports = plugin
module.exports.normalizeOptions = normalizeOptions
module.exports.transformDecl = transformDecl

/**
 * PostCSS plugin to convert colors
 *
 * @param {Object} options
 */
function plugin(options) {
  normalizeOptions(options)

  return function(style) {
    style.eachDecl()
  }
}

/**
 * normalize options
 *
 * @param {Object} options
 */
function normalizeOptions(options) {
  options = options || {}
  options.rebeccapurple = options.rebeccapurple !== undefined ? options.rebeccapurple : true
  options.hwb = options.hwb !== undefined ? options.hwb : true
  options.hexAlpha = options.hexAlpha !== undefined ? options.hexAlpha : true
  options.color = options.color !== undefined ? options.color : true
}

/**
 * Transform colors to rgb() or rgba()  on a declaration object
 *
 * @param {Object} dec
 */
function transformDecl(dec) {
  if (!dec.value) {
    return
  }

  dec.value = transform(dec.value, dec.source, options)
}

/**
 * Transform colors to rgb() or rgba() on a declaration value
 *
 * @param {String} string
 * @return {String}
 */
function transform(string, source, options) {
  // order of transformation is important

  if (options.rebeccapurple && string.indexOf("rebeccapurple") > -1) {
    string = transformRebeccapurple(string, source)
  }

  if (options.hwb && string.indexOf("hwb(") > -1) {
    string = transformHwb(string, source)
  }

  if (options.hexAlpha && string.indexOf("#") > -1) {
    string = transformHexAlpha(string, source)
  }

  if (options.color && string.indexOf("color(") > -1) {
    string = transformColor(string, source)
  }

  return string
}
