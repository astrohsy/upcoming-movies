angular.module('ReviewService', []).factory('Review', ['$http', function($http) {

 return {
    get : function(token) {
      return $http.get('/api/reviews', {
        headers: {'x-access-token' : token}
    });
  }}}]);
