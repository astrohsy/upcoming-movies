'use strict';

angular.module('SettingCtrl', ['SettingService', 'ngCookies']).controller('SettingController', [
  '$scope', 'Setting', '$cookieStore',
  function($scope, Setting, $cookieStore) {
    $scope.genres = ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Sci-Fi','Music', 'Documentary', 'Biography', 'Mystery','Thriller', 'Drama', 'Romance', 'Crime']
    $scope.states = [];

    Setting.getStatus({name: $cookieStore.get('User')} ,$cookieStore.get('Token')).then(function(response){
      $scope.userInfo = response.data.genre;

      var len1 = $scope.genres.length;
      var len2 = $scope.userInfo.length;

      for(var i=0;i<len1;i++) {
        var chk = false;
        if($scope.userInfo.indexOf($scope.genres[i]) == -1) {
          chk = true;
        }

        if(chk) {
          $scope.states.push({name : $scope.genres[i],
                              state : false});
        }
        else {
          $scope.states.push({name : $scope.genres[i],
                              state : true});
          }
       }

       console.log($scope.states);
    });

    $scope.toggle = function () {
        this.genre.state =! this.genre.state; // 반대 부호로
        saveInfo();
    };

    function saveInfo() {
      var new_user_info = [];
      for(var i=0;i<$scope.states.length; i++) {
        if($scope.states[i].state) {
          new_user_info.push($scope.states[i].name);
        }
      }

      Setting.saveStatus({
        username : $cookieStore.get('User'),
        genres : new_user_info
      }, $cookieStore.get('Token'));
    }



  }]);
