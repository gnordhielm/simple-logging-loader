
var utils = require('loader-utils')
var SourceMapConsumer = require('source-map').SourceMapConsumer
var SourceMapGenerator = require('source-map').SourceMapGenerator

module.exports = function(source, inputSourceMap) {
  var sourceMapEnabled = this.sourceMap;
  var filename = normalizePath(this.resourcePath);
  this.cacheable && this.cacheable();

  var options = getOptions.call(this, sourceMapEnabled, filename);

  var ngAnnotate = require(options.ngAnnotate);
  var annotateResult = ngAnnotate(source, options);

  if (annotateResult.errors) {
    this.callback(annotateResult.errors);
  } else if (annotateResult.src !== source) {
    var outputSourceMap = mergeSourceMaps.call(this, inputSourceMap, annotateResult.map);
    this.callback(null, annotateResult.src || source, outputSourceMap);
  } else {
    // if ngAnnotate did nothing, return map and result untouched
    this.callback(null, source, inputSourceMap);
  }
};

function getOptions(enableSourceMap) {

	var options = Object.assign({}, utils.getOptions(this))

	if (enableSourceMap) {
	    // options.map = {
	    //   inline: false,
	    //   inFile: filename,
	    // }
	}

	return options
}

// function mergeSourceMaps(inputSourceMap, annotateMap) {
//   var outputSourceMap;
//   var sourceMapEnabled = this.sourceMap;
//   var filename = normalizePath(this.resourcePath);
//   this.cacheable && this.cacheable();

//   if (sourceMapEnabled && !inputSourceMap && annotateMap) {
//     outputSourceMap = annotateMap;
//   }

//   if (sourceMapEnabled && inputSourceMap) {
//     inputSourceMap.sourceRoot = '';
//     inputSourceMap.sources[0] = filename;

//     if (annotateMap) {
//       var generator = SourceMapGenerator.fromSourceMap(new SourceMapConsumer(annotateMap));
//       generator.applySourceMap(new SourceMapConsumer(inputSourceMap), filename);

//       outputSourceMap = generator.toJSON();
//       outputSourceMap.sourceRoot = '';
//       outputSourceMap.file = normalizePath(this.resourcePath);
//     } else {
//       outputSourceMap = inputSourceMap;
//     }
//   }

//   return outputSourceMap;
// }

