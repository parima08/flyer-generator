'use strict'

var app = angular.module('myApp'); 

app.controller('LoginController', LoginController); 

LoginController.$inject = ['$scope','googleService', 
                      '$rootScope', '$location', 
                      'userPersistenceService', '$window']; 
function LoginController($scope, googleService, $rootScope, $location, userPersistenceService, $window) {
  $window.init = function(){
      console.log("In Init"); 
      if(userPersistenceService.getUserNameData()){
        $scope.isSignedIn = true
      }
      else{
        $scope.isSignedIn = false; 
      }
      //$scope.isSignedIn = false;
      googleService.load().then(function(){
        $scope.signIn = function(){
          console.log("in signin"); 
          googleService.signIn().then(function(){
            console.log("loaded googleservice"); 
            $scope.isSignedIn = googleService.isSignedIn();
            var profile = googleService.getUserProfileInformation(); 
            console.log(profile); 

            $rootScope.loggedInUser = profile; 
            console.log(profile); 
            $rootScope.loggedInUser.fullName = profile.w3.ig ; 
            $rootScope.loggedInUser.email = profile.w3.U3; 
            
            alert($rootScope.loggedInUser.email);
            validateUser($rootScope.loggedInUser.email);

            userPersistenceService.setCookieData(profile.w3.ig, profile.w3.U3); 
            $location.path('/home').replace(); 
            $scope.$apply(); 
            //googleService.getUser
          });
        };

        function validateUser(email){
          if(email === "parima08@gmail.com"){
              alert("THE USER IS NOT VALIDATED");
              //$$scope.signOut(); 
            }
        }
        
        $scope.signOut = function(){
          googleService.signOut().then(function(){
            $scope.isSignedIn = googleService.isSignedIn();
            userPersistenceService.clearCookieData(); 
          });
        };
      });
  }
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

app.factory("userPersistenceService", [
  "$cookies", function($cookies) {

    return {
      setCookieData: function(userName, userEmail) {
        $cookies.put("userName", userName);
        $cookies.put("userEmail", userEmail);
      },
      getUserNameData: function() {
        return $cookies.get("userName");
      },
      getUserEmailData: function(){
        return $cookies.get("userEmail");
      }, 
      clearCookieData: function() {
        console.log("Clearing Cookie Data")
        $cookies.remove("userName");
        $cookies.remove("userEmail"); 
      }
    }
  }
]);
