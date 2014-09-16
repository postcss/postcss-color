var fs = require("fs")

var test = require("tape")

var postcss = require("postcss")
var plugin = require("..")

function filename(name) { return "test/" + name + ".css" }
function read(name) { return fs.readFileSync(name, "utf8") }

function compareFixtures(t, name, msg, opts, postcssOpts) {
  postcssOpts = postcssOpts || {}
  postcssOpts.from = filename("fixtures/" + name)
  opts = opts || {}
  var actual = postcss().use(plugin(opts)).process(read(postcssOpts.from), postcssOpts).css
  var expected = read(filename("fixtures/" + name + ".expected"))
  fs.writeFile(filename("fixtures/" + name + ".actual"), actual)
  t.equal(actual, expected, msg)
}

test("color()", function(t) {
  compareFixtures(t, "color", "should transform color()")
  t.end()
})

test("hex alpha (#RRGGBBAA or #RGBA)", function(t) {
  compareFixtures(t, "hex-alpha", "should transform #RRGGBBAA and #RGBA")
  t.end()
})

test("hwb()", function(t) {
  compareFixtures(t, "hwb", "should transform hwb()")
  t.end()
})

test("rebeccapurple", function(t) {
  compareFixtures(t, "rebeccapurple", "should transform rebeccapurple")
  t.end()
})


test("all features at once", function(t) {
  compareFixtures(t, "all", "should transform all colors")
  t.end()
})

test("throw errors", function(t) {
  t.throws(function() {
    return postcss(plugin()).process(read(filename("fixtures/error"))).css
  }, /Unable to parse color from string/, "throws a readable error when a color can't be parsed")

  t.end()
})
