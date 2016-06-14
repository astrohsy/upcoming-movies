angular.module('MainCtrl', ['ReviewService', 'ngCookies'])
.controller('MainController', function($scope, Review, $cookieStore, $route) {
  $scope.reviews = [];

  $scope.token = $cookieStore.get('Token');
  $scope.calDate = function(openDate) {
    var date = new Date();
    if(date >= openDate) {

      return 'Already Released';
    }
    else {

      return Math.round((openDate-date.getTime()) / 86400000) + ' Days Left to be Released';
    }
  }

  Review.get($scope.token).then(function(response) {
    $scope.reviews = response.data['reviews'];
  });



});
