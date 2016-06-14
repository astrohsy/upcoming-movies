'use strict'

angular.module('LoginCtrl', ['LoginService', 'ngCookies'])
  .service('Info', function() {
    this.data = { auth : false, name : "" };

    this.setAuth = function(_auth) {
      this.data.auth = _auth;
    };

    this.getAuth = function() {
      return this.data.auth;
    };
  })
  .controller('LoginController',
    ['$scope', 'Login', '$cookieStore','$window', '$rootScope',
    function($scope, Login, $cookieStore, $window, $rootScope) {

      $scope.submitLogin = function() {

        Login.getToken($scope.login.email, $scope.login.password).then(
          function(response) {
            if(response.data['success'] == true) {
              $cookieStore.put('Token', response.data.token); // 쿠키에 세이브
              $cookieStore.put('User', $scope.login.email);
              $window.location.href='/home';  //redirect to home.html
            }
            else {
              $window.alert(response.data.message);
            }
          }
        );
      };

      $scope.checkLogin = function() {
        if($cookieStore.get('Token')) {
          $rootScope.myAuth = true;
          $rootScope.username = $cookieStore.get('User');
        }
        else {
          $rootScope.myAuth = false;
        }
      };

      $scope.myLogout = function() {

        $cookieStore.remove('Token');
        $rootScope.myAuth = false;
      };

// Register User
      $scope.register = function() {
        if($scope.login.email == "" || $scope.login.password == "") {
          $window.alert('No Blank!');
        }
        else {
          Login.putUser($scope.login.email, $scope.login.password).then(function() {
            $window.alert('Register Completed');
        });
      }
    }
    }]);
