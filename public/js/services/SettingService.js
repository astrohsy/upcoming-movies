angular.module('SettingService', []).factory('Setting', ['$http', function($http) {

 return {
    saveStatus : function(new_user_info, token) {
      $http.post('api/status/update', new_user_info, {
        headers: {'x-access-token' : token }});
    },

    getStatus : function(token) {
      $http.get('api/status/get', {headers: {'x-access-token' : token }});
    }
  }
}])
