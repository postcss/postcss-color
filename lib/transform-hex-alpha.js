/**
 * Module dependencies.
 */
var color = require("color")

/**
 * Constantes
 */
var HEX_ALPHA_RE = /#([0-9a-f]{4}(?:[0-9a-f]{4})?)\b/i
var DECIMAL_PRECISION = 100000 // 5 decimals

/**
 * transform RGBA hexadecimal notations (#RRGGBBAA or #RGBA) to rgba().
 *
 * @param  {String} string declaration value
 * @return {String}        converted declaration value to rgba()
 */
module.exports = function transformHexAlpha(string) {
  var m = HEX_ALPHA_RE.exec(string)
  if (!m) {
    return string
  }

  var hex = m[1]

  return string.slice(0, m.index) + hexaToRgba(hex) + transformHexAlpha(string.slice(m.index + 1 + hex.length))
}

/**
 * transform RGBA or RRGGBBAA to rgba()
 *
 * @param  {String} hex RGBA or RRGGBBAA
 * @return {String}     converted value to rgba()
 */
function hexaToRgba(hex) {
  if (hex.length === 3) {
    hex += "f"
  }
  if (hex.length === 4) {
    var h0 = hex.charAt(0)
    var h1 = hex.charAt(1)
    var h2 = hex.charAt(2)
    var h3 = hex.charAt(3)
    hex = h0 + h0 + h1 + h1 + h2 + h2 + h3 + h3
  }
  if (hex.length === 6) {
    hex += "ff"
  }
  var rgb = []
  for (var i = 0, l = hex.length; i < l; i += 2) {
    rgb.push(Math.round(parseInt(hex.substr(i, 2), 16) / (i === 6 ? 255 : 1) * DECIMAL_PRECISION) / DECIMAL_PRECISION)
  }

  return color({r: rgb[0], g: rgb[1], b: rgb[2], a: rgb[3]}).rgbaString()
}
