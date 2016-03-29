module.exports = function getAngularFiletype(fileName) {
    var temp = fileName.split('/');
    temp = temp[temp.length - 1];

    var split = temp.split('.');
    return split[split.length - 2];
}
