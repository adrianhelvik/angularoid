var mockDOM = require( './mockDOM' );
var assert = require('assert');

module.exports = function(error, jsString, cb) {
    if (error)
        return console.log('Could not inject agular dependencies. Got error before.');

    var args = getArgs( jsString );

    jsString += ';module.exports.inject = [' + args.map(arg => '\'' + arg + '\'').toString() + '];';

    cb( null, jsString );
}

function getArgs( jsString ) {
    mockDOM.enable();

    jsString += ';return module.exports;';

    var fn = new Function('module', 'exports', jsString);
    var mod = { exports: {} };

    var str;

    (function () {
        fn.call( window, mod, mod.exports );
        assert( typeof mod.exports == 'function', 'A function must be exported from each file.' );
        str = mod.exports.toString();
    }).call(mockDOM.getWindow());

    mockDOM.disable();

    var args = str.substring( str.indexOf('(') + 1, str.indexOf(')') );

    return args.split(',');
}
