;
if (typeof angular == 'undefined')
    var angular = require('angular');

module.exports = function ($state) {
    var vm = this;

    vm.goBack = function () {
        $state.go( 'myPreviousState' );
    }
}
;

angular.module("app").controller('LoginController', module.exports);