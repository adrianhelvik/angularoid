module.exports = function (articles) {
    var vm = this;
    
    articles.all()
    .then(response => vm.articles = response.data);
}
