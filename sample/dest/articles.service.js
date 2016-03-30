;(function() {
if (typeof module == 'undefined')
    var module = {};
if (typeof angular == 'undefined' && typeof require != 'undefined')
    var angular = require('angular');
module.exports = function ($http) {
    this.get = function(id) {
        return $http.get('articles/' + id);
    };

    this.all = function() {
        return $http.get('articles');
    };
}
;module.exports.inject = ['$http'];
;angular.module('app').service('ArticlesService', module.exports);
})();