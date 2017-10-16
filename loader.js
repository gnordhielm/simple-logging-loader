

module.exports = function simpleLoggingLoader(source, sourceMap) {

  if (this.cacheable) this.cacheable()

  // var result = _matchAndReplace(this, source)

  // this.callback(null, result, sourceMap)
  // return

  return _matchAndReplace(source)

}


function _matchAndReplace(str) {
  var result = str

  // declarations
  var declareRegex = /(.*function\s+(.\w+)\s*\(.*\s*{)\s*(["'])log\3/ig
  result = result.replace(declareRegex, `$1 console.log("$2", arguments)`)
  
 // anonymous/expressions
  var anonymousRegex = /(.*function\s*\(.*\s*{)\s*(["'])log\2/ig
  result = result.replace(anonymousRegex, `$1 console.log("anonymous", arguments)`)
  
  // es6
  var es6Regex = /(.*=>\s*{)\s*(["'])log\2/ig
  result = result.replace(es6Regex, `$1 console.log("anonymous", arguments)`)
  
  // else
  var plainRegex = /(["'])log\1/ig
  result = result.replace(plainRegex, "")
  
  return result
}

