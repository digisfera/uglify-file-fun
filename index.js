var filerw = require('file-rw'),
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
  if(!callback && _.isFunction(options)) {
    callback = options;
    options = null;
  }

  options = options || {};
  callback = callback || function() {};

  if(_.isString(inputFiles)) { inputFiles = [ inputFiles ]; }

  filerw.readFilesUtf8(inputFiles, function(err, filesData) {

    var data = null;
    var sourceMapFile = null;

    if(filesData.length > 1) {
      //More than one file, we can't handle sourcemaps in this case yet
      data = filesData.join(';');
      options.sourceMapFile = false;
    }
    else {
      data = filesData[0];
      if(options.sourceMapFile) {
        options.inputFileForSourceMap = inputFiles[0];
        options.outputFileForSourceMap = outputFile;

        sourceMapFile = options.sourceMapFile || outputFile + '.map';
        options.sourceMapFile = sourceMapFile;
      }
    }

    var result = uglifyData(data, options);


    if(result.map && sourceMapFile) {
      filerw.mkWriteFiles([[ outputFile, result.code ], [sourceMapFile, result.map]], function(err, success) {
        if(err) { callback(err); }
        else { callback(null, {
          outputFile: outputFile,
          sourceMapFile: sourceMapFile,
          outputData: result.code,
          sourceMapData: result.map
        });}
      });
    }
    else {
      filerw.mkWriteFile(outputFile, result.code, function(err, success){
        if(err) { callback(err); }
        else { callback(null, {
          outputFile: outputFile,
          outputData: result.code
        });}
      });
    }

  });
}