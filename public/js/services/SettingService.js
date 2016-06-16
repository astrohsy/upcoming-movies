angular.module('SettingService', []).factory('Setting', ['$http', function($http) {

 return {
    saveStatus : function(new_user_info, token) {
      return $http.post('api/status/update', new_user_info, {
        headers: {'x-access-token' : token }});
    },

    getStatus : function(user_json, token) {
      return $http.post('api/status/get', user_json, {
        headers: {'x-access-token' : token }});
    }
  }
}])
