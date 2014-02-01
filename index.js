var fileFun = require('file-fun'),
    _ = require('lodash'),
    path = require('path'),
    UglifyJS = require("uglify-js");

relativePath = function(origFilePath, filePathToCalculate) {
  var p = path.relative(path.dirname(origFilePath), filePathToCalculate);
  return p.split(path.sep).join('/');
}


function uglifyData(data, options) {
  options = options || {};

  var compileOptions = _.omit(options, 'sourceMap', 'sourceMapFile', 'inputFileForSourceMap', 'outputFileForSourceMap');

  compileOptions.fromString = true;

  if(options.sourceMapFile) {
    compileOptions.outSourceMap = relativePath(options.outputFileForSourceMap, options.sourceMapFile);
    compileOptions.output = compileOptions.output || {};
    
    var source_map = UglifyJS.SourceMap({
        file: relativePath(options.sourceMapFile, options.outputFileForSourceMap),
        root: relativePath(options.sourceMapFile, path.dirname(options.inputFileForSourceMap))
        //orig: ORIG_MAP,
    });

    compileOptions.output.source_map = source_map;
  }

  var result = UglifyJS.minify(data, compileOptions);

  if(options.sourceMapFile && result.map) {
    result.code += "\n//# sourceMappingURL="+relativePath(options.outputFileForSourceMap, options.sourceMapFile);
  }

  return result;
}


module.exports = function(inputFiles, outputFile, options, callback) {
  if(_.isString(inputFiles)) { inputFiles = [ inputFiles ]; }

  fileFun.readFilesUtf8(inputFiles, function(err, filesData) {

    var data = null;
    var sourceMapFile = options.sourceMapFile || outputFile + '.map';

    if(filesData.length > 0) {
      //More than one file, we can't handle sourcemaps in this case yet
      data = filesData.join(';');
      options.sourceMap = false;
    }
    else {
      data = filesData[0];
      options.inputFileForSourceMap = inputFiles[0];
      options.outputFileForSourceMap = outputFile;
      options.sourceMapFile = sourceMapFile;
    }

    result = uglifyData(data, options);

    if(result.map) {
      fileFun.mkWriteFiles([[ outputFile, result.code ], [sourceMapFile, result.map]], callback);
    }
    else {
      fileFun.mkWriteFile(outputFile, result.code, callback);
    }

  });
}