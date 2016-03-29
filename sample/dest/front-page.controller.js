;
if (typeof angular == 'undefined')
    var angular = require('angular');

module.exports = function (articles) {
    var vm = this;
    
    articles.all()
    .then(response => vm.articles = response.data);
}
;

angular.module("app").controller('FrontPageController', module.exports);