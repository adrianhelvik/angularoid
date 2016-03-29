module.exports = function ($http) {
    this.get = function(id) {
        return $http.get('articles/' + id);
    };

    this.all = function() {
        return $http.get('articles');
    };
}
