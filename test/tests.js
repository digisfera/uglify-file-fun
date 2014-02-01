var expect = require('chai').expect,
    rimraf = require('rimraf');

uglifyFiles = require('../index')

describe('uglify-file-fun', function() {

  before(function() {
    rimraf.sync( __dirname + "/tmp");
  });

  it('should minify a single file', function(done) {
    var inFile = __dirname + "/files/script.js",
        outFile = __dirname + "/tmp/script.min.js";
        
    uglifyFiles(inFile, outFile, function(err, result) {
      expect(err).to.be.not.ok
      expect(result).to.have.property('outputFile').that.equals(outFile)
      expect(result).to.have.property('outputData').with.length.greaterThan(0)
      done();
    });
  });

  it('should minify and concatenate multiple files', function(done) {
    var inFile1 = __dirname + "/files/script.js",
        inFile2 = __dirname + "/files/script2.js",
        outFile = __dirname + "/tmp/script2.min.js";

    uglifyFiles([ inFile1, inFile2 ], outFile, function(err, result) {
      expect(err).to.be.not.ok
      expect(result).to.have.property('outputFile').that.equals(outFile)
      expect(result).to.have.property('outputData').with.length.greaterThan(0)
      done()
    });
  });


  it('should export source map', function(done) {
    var inFile = __dirname + "/files/script.js",
        outFile = __dirname + "/tmp/script3.min.js",
        sourceMapFile = __dirname + "/tmp/script3.map";

    uglifyFiles(inFile, outFile, { sourceMapFile: sourceMapFile }, function(err, result) {
      expect(err).to.be.not.ok
      expect(result).to.have.property('outputFile').that.equals(outFile)
      expect(result).to.have.property('outputData').with.length.greaterThan(0)
      expect(result).to.have.property('sourceMapFile').that.equals(sourceMapFile)
      expect(result).to.have.property('sourceMapData').with.length.greaterThan(0)
      done();
    });
  });
});
