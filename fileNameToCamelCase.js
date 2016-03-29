var camelCase = require('camelcase');
var assert = require('assert');
var path = require('path');
var capitalize = require('capitalize');

function fileNameToCamelCase(relativeDir, fileName) {
    assert(fileName);
    assert(relativeDir);
    return camelCase(path.relative(relativeDir, fileName).replace(/\.js$/, '').replace(/\.|\//g, '-'));
}

assert.equal( fileNameToCamelCase('sample/src/', 'controllers/foo.controller.js'), 'controllersFooController' );

module.exports = fileNameToCamelCase;
module.exports.capitalized = function(relativeDir, fileName) {
    return capitalize( fileNameToCamelCase(relativeDir, fileName) );
}
