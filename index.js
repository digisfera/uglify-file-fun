var fileFun = require('file-fun'),
    UglifyJS = require("uglify-js");

exports.sync = function(contents, options) {
  options = options || {};
  options.fromString = true;

  var concatted = contents.join(';');

  var minified = UglifyJS.minify(concatted, options).code;
  return minified
}
exports.globsToFile = fileFun.sync_globsToFile(exports.sync)
exports.filesToFile = fileFun.sync_filesToFile(exports.sync)
exports.async = fileFun.sync_async(exports.sync)