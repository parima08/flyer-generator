'use strict'

var app = angular.module('myApp'); 

app.controller('LoginController', LoginController); 

LoginController.$inject = ['$scope','googleService', 
                      '$rootScope', '$location']; 
function LoginController($scope, googleService, $rootScope, $location) {
  $scope.isSignedIn = false;
  googleService.load().then(function(){
    $scope.signIn = function(){
      googleService.signIn().then(function(){
        $scope.isSignedIn = googleService.isSignedIn();
        var profile = googleService.getUserProfileInformation(); 
        console.log(profile); 
        $rootScope.loggedInUser = profile; 
        $rootScope.loggedInUser.fullName = profile.w3.U3; 
        $rootScope.loggedInUser.email = profile.w3.ig; 
        $location.path('/home').replace(); 
        $scope.$apply(); 
        //googleService.getUser
      });
    };
    
    $scope.signOut = function(){
      googleService.signOut().then(function(){
        $scope.isSignedIn = googleService.isSignedIn();
      });
    };
  });
}; 

app.service('googleService', ['$q', function ($q) {
    var self = this;
    this.load = function(){
      var deferred = $q.defer();
      gapi.load('auth2', function(){
        var auth2 = gapi.auth2.init();
        //normally I'd just pass resolve and reject, but page keeps crashing (probably gapi bug)
        auth2.then(function(){
          deferred.resolve();
        });
        addAuth2Functions(auth2);
      });
      return deferred.promise;
    };
    
    function addAuth2Functions(auth2){
      self.signIn = function() {
        var deferred = $q.defer();
        auth2.signIn().then(deferred.resolve, deferred.reject);
        return deferred.promise;
      };

      self.getUserProfileInformation = function(){
        if(auth2.isSignedIn.get()){
          console.log("The User is signed in"); 
          return auth2.currentUser.get(); 
        }
      }; 
      
      self.isSignedIn = function(){
        return auth2.isSignedIn.get();
      };

      self.signOut = function(){
        var deferred = $q.defer();
        auth2.signOut().then(deferred.resolve, deferred.reject);
        return deferred.promise;
      };
    }
    
}]);
