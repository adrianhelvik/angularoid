#!usr/local/bin/node

var assert = require('assert');
var fs = require('fs');
var glob = require('glob');
var fileNameToCamelCase = require('./fileNameToCamelCase').capitalized;
var getAngularFiletype = require('./getAngularFiletype');
var path = require('path');
var mkdirp = require('mkdirp');
var injectAngularDeps = require('./injectAngularDeps');
var chalk = require('chalk');

var argv = require('yargs')
    .usage('Usage: --source=[source folder] --dest=[destination folder] --entry=[entry file to be created] --module=[name of the angular module to be used] --verbose')
    .demand(['source', 'dest', 'entry', 'module'])
    .default('entry', '[dest/]entry.js')
    .default('module', 'app')
    .argv;

var debug = {
    log: ! argv.verbose ? function() {} : function (value) {
    console.log( chalk.yellow('[verbose]: ' + [].reduce.call(arguments, (a, b) => a + '\n' + b ) ) );
} };

if (argv.entry === '[dest/]entry.js')
    argv.entry = stripTrailing(argv.dest, '/') + '/entry.js';

argv.entry = path.resolve(argv.entry);

debug.log('Writing entry file to:', argv.entry);

parseFiles(argv, (err) => {
    if (err)
        console.log(err);
});

function parseFiles(argv, cb) {
    glob(argv.source + `/**/*.*.js`, (err, files) => {
        files = files.filter( file => file.split('.').filter(item => item).length >= 3 );

        debug.log( 'Files:\n  ' + files.join('\n  ') );

        if (err) {
            console.log(err);
            process.exit(1);
        }

        createEntry(null, files, argv, storeEntry);

        files.forEach( file => {
            createDir(null, file, argv.source, argv.dest, () => {
                parseFile(file);
            } );
        } );
    });
}

function getDest(argv, file) {
    return path.resolve( argv.dest + '/' + path.relative(argv.source, file) );
}

function store(destination, result) {
    fs.writeFile(destination, result, (err) => {
        if (err)
            console.log('Could not store file to ' + destination + '\n', err);
    });
}

function createEntry(error, files, argv, cb) {
    process.nextTick(() => {
        if (error)
            return console.log('Could not create entry', error);

        var content = 'module.exports = [\n';

        files.forEach(file => {
            var relativePath = path.relative(argv.entry + '/..', getDest(argv, file));

            content += `    require('./${relativePath}'),\n`
        });

        content = stripTrailing( content.trim(), ',' ) + '\n];';

        cb && cb(null, argv.entry, content);
    });
}

function storeEntry(error, entry, content, cb) {
    fs.writeFile(entry, content, (err) => {
        if (err)
            return console.log('Could not write entry file!', err);
        cb && cb();
    });
}

function stripTrailing(str, character) {
    while (str.length && str[str.length - 1] === character)
        str = str.substring(0, str.length - 1);

    return str;
}

function parseFile(file) {
    var type = getAngularFiletype(file);
    var name = fileNameToCamelCase(argv.source, file);

    fs.readFile(file, (err, data) => {
        if (err)
            return console.log(err);

        injectAngularDeps(null, data, (err, data) => {
            if (err)
                return console.log('Could not inject angular dependencies');

            var result =
`;(function() {
if (typeof module == 'undefined')
    var module = {};
if (typeof angular == 'undefined' && typeof require != 'undefined')
    var angular = require('angular');
${data.toString()}
;angular.module('${argv.module}').${type}('${name}', module.exports);
})();`;

            store(getDest(argv, file), result);
        });
    });
}

function createDir(err, file, from, to, cb) {
    var tmp = file.split(/\/|\\/g);
    tmp.pop();
    newDir = path.relative(path.relative(tmp.join('/'), from), to);

    mkdirp(newDir, cb);
}
