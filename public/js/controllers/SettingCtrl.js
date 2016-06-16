'use strict';

angular.module('SettingCtrl', ['SettingService', 'ngCookies']).controller('SettingController', [
  '$scope', 'Setting', '$cookieStore',
  function($scope, Setting, $cookieStore) {
    $scope.genres = ['Action', 'Adventure', 'Comedy', 'Fantasy', 'Sci-Fi','Music', 'Drama', 'Documentary', 'Biography', 'Crime', 'Mystery','Thriller', 'Drama', 'Romance', 'Crime'];
    $scope.user_info = ['Action', 'Adventure', 'Comedy', 'Music', 'Drama', 'Documentary', 'Biography', 'Crime', 'Mystery','Thriller', 'Drama', 'Romance', 'Crime'];

    $scope.states = [];
    var len1 = $scope.genres.length;
    var len2 = $scope.user_info.length;
    for(var i=0;i<len1;i++) {
      var chk = false;
      for(var j=i+1;j<len2;j++) {
        if($scope.genres[i] == $scope.user_info[j]) {
          chk = true;
        }
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

    $scope.toggle = function () {
        this.genre.state =! this.genre.state; // 반대 부호로
    };

    $scope.saveInfo = function() {
      var new_user_info = [];
      for(var i in $scope.states) {
        if($scope.states[i].state) {
          new_user_info.push($scope.states[i].name);
        }
      }

      Setting.saveStatus({
        name : $cookieStore.get('User'),
        genres : new_user_info
      }, $cookieStore.get('Token'));
    }



  }]);
