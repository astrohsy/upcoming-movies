angular.module('MainCtrl', ['ReviewService', 'SettingService', 'ngCookies'])
.controller('MainController', function($scope, Review, Setting, $cookieStore, $route) {
  $scope.reviews = [];

  $scope.token = $cookieStore.get('Token');
  $scope.calDate = function(openDate) {
    var date = new Date();
    if(date >= openDate) {

      return 'Already Released';
    }
    else {

      return Math.round((openDate-date.getTime()) / 86400000) + ' days left to be released';
    }
  }

  Review.get($scope.token).then(function(response) {
    Setting.getStatus({name : $cookieStore.get('User')}, $cookieStore.get('Token')).then(function(status_response){
        $scope.reviews = [];
        var user_genres = status_response.data.genre;

        var raw_data = response.data['reviews'];
        for(var i = 0; i<raw_data.length; i++) {
          for(var j = 0; j<user_genres.length; j++) {
            if($scope.reviews.indexOf(raw_data[i]) == -1 && raw_data[i].m_genres.indexOf(user_genres[j]) != -1) {
              $scope.reviews.push(raw_data[i]);
            }
          }
        }

        console.log($scope.reviews);
    });
  });



});
