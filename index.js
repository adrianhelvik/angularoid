var assert = require('assert');
var fs = require('fs');
var glob = require('glob');
var fileNameToCamelCase = require('./fileNameToCamelCase').capitalized;
var getAngularFiletype = require('./getAngularFiletype');
var path = require('path');
var mkdirp = require('mkdirp');

var argv = require('yargs')
    .usage('Usage: --source=[source folder] --dest=[destination folder] --entry=[entry file to be created] --module=[name of the angular module to be used]')
    .demand(['source', 'dest', 'entry', 'module'])
    .default('entry', '[dest/]entry.js')
    .default('module', 'app')
    .argv;

if (argv.entry === '[dest/]entry.js')
    argv.entry = stripTrailing(argv.dest, '/') + '/entry.js';

console.log('Writing entry file to:', argv.entry);

parseFiles(argv, (err) => {
    if (err)
        console.log(err);
});

function parseFiles(argv, cb) {
    glob(argv.source + `/**/*.*.js`, (err, files) => {
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
    fs.writeFile(destination, result);
}

function createEntry(error, files, argv, cb) {
    process.nextTick(() => {
        if (error)
            return console.log('Could not create entry', error);

        var content = 'module.exports = [';

        files.forEach(file => {
            var relativePath = path.relative(argv.entry + '/..', getDest(argv, file));

            content += `require('./${relativePath}'), `
        });

        content = stripTrailing( content.trim(), ',' ) + '];';

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
        var result =
`;
if (typeof angular == 'undefined')
    var angular = require('angular');

${data.toString()};

angular.module("${argv.module}").${type}('${name}', module.exports);`;

            store(getDest(argv, file), result);
    });
}

function createDir(err, file, from, to, cb) {
    var tmp = file.split(/\/|\\/g);
    tmp.pop();
    newDir = path.relative(path.relative(tmp.join('/'), from), to);

    mkdirp(newDir, cb);
}
