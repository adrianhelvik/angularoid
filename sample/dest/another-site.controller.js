;(function() {
if (typeof module == 'undefined')
    var module = {};
if (typeof angular == 'undefined' && typeof require != 'undefined')
    var angular = require('angular');
module.exports = function ($state) {
    var vm = this;

    vm.goBack = function () {
        $state.go( 'myPreviousState' );
    }
}
;module.exports.inject = ['$state'];
;angular.module('app').controller('AnotherSiteController', module.exports);
})();