module.exports = function ($state) {
    var vm = this;

    vm.goBack = function () {
        $state.go( 'myPreviousState' );
    }
}
