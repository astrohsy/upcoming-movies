angular.module('appRoutes', []).
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){

    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'LoginController'
      })
      .when('/home', {
        templateUrl: '/views/home.html',
        controller: 'MainController'
      })
      .when('/setting', {
        templateUrl: 'views/setting.html',
        controller: 'SettingController'
      }).otherwise({
        redirectTo: "/"
      });

     $locationProvider.html5Mode(true);
  }]);
