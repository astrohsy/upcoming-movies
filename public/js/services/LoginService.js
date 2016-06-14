angular.module('LoginService', [])
.factory('Login', ['$http', function($http) {
  return {
    getToken : function(name, password) {
      var data = { name: name, password: password}
      return $http.post('/api/authenticate', data, {});
    },

    getAllUsers: function(token) {
      return $http.get('/api/users')
    }
  }}])
