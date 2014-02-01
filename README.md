# uglify-files

Uglify files with UglifyJS2

## Installation

    npm install uglify-files

## Usage

### uglify(inputFiles, outputFile, [options], [callback])

* `inputFiles` - file or array of files to uglify
* `outputFile` - file to write with result
* `options` - options for `UglifyJS.minify()` plus the following:
  * `sourceMapFile` - file to write the source map to (currently only supported with a single input file)
* `callback` - function that will be called with `(err, { outputFile, outputData, sourceMapFile, sourceMapData })`


## Example

    var uglifyFiles = require('uglify-files');

    uglifyFiles('f1.js', 'f1.min.js', function(err, result) {
      // result == { outputFile: 'f1.min.js', outputData: '...' }
    })

    uglifyFiles([ 'f1.js', 'f2.js' ], 'out.min.js', function(err, result) {
      // result == { outputFile: 'out.min.js', outputData: '...' }
    })

    uglifyFiles('f1.js', 'f1.min.js', { sourceMapFile: 'f1.map' }, function(err, result) {
      // result == { outputFile: 'f1.min.js', outputData: '...', sourceMapFile: 'f1.map', sourceMapData: '...' }
    })


## TODO

Support source maps for multiple files

Make pull request to [UglifyJS2](https://github.com/mishoo/UglifyJS2) to expose this functionality there, rather than having it on `bin`