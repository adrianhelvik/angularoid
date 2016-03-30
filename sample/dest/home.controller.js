;(function() {
if (typeof module == 'undefined')
    var module = {};
if (typeof angular == 'undefined' && typeof require != 'undefined')
    var angular = require('angular');
module.exports = function (articles) {
    var vm = this;

    articles.all()
    .then(response => vm.articles = response.data);
}
;module.exports.inject = ['articles'];
;angular.module('app').controller('HomeController', module.exports);
})();