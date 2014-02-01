expect = require('chai').expect

uglifyFun = require('../index')

describe 'uglify-file-fun', ->

  it 'should minify a single file', (done) ->
    uglifyFun "#{__dirname}/files/script.js", "#{__dirname}/tmp/script.min.js", { outSourceMap: true }, (err, result) ->
      console.log(err, result)
      done()

  it 'should minify and concatenate multiple files', (done) ->
    uglifyFun [ "#{__dirname}/files/script.js", "#{__dirname}/files/script2.js" ], "#{__dirname}/tmp/script2.min.js", { }, (err, result) ->
      console.log(err, result)
      done()
