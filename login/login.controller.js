'use strict'

var app = angular.module('myApp'); 


app.controller('LoginController', LoginController); 

LoginController.$inject = ['$scope','googleService', 
                      '$rootScope', '$location', 
                      'userPersistenceService', '$window']; 
function LoginController($scope, googleService, $rootScope, $location, userPersistenceService, $window) {
  
  var whiteListEmails = [ "parima08@gmail.com", "centres.mgmt@sradharampur.org", "aniruddh.mehta90@gmail.com", 
                    "jhalakprdept@gmail.com", "ahmedabad@srloveandcare.org", 
                   " bengaluru@srloveandcare.org", "canada@srloveandcare.org", "chennai@srloveandcare.org", "dubai@srloveandcare.org", 
                   "hongkong@srloveandcare.org", "muscat@srloveandcare.org", "singapore@srloveandcare.org", 
                   "surat@srloveandcare.org", "uk@srloveandcare.org", "vadodara@srloveandcare.org", 
                   "admin.srlc@srloveandcare.org", "npgosalia75@gmail.com", "uksupport@sradharampur.org"];

  var whiteListDomains = ["shrimadrajchandramission.org", "srdivinetouch.org"];
  var blackListEmails = [];
  //var blackListEmails = ["sandiego@shrimadrajchandramission.org"]
  $window.init = function(){
      if(userPersistenceService.getUserNameData()){
        $scope.isSignedIn = true
      }
      else{
        $scope.isSignedIn = false; 
      }

    function loginUser(){
      $rootScope.validUser= true;
    }

    function preventUserFromLogin(){
      $rootScope.validUser= false;
      alert("You are not authorized to log in. Contact your adminstrator.");
      $scope.signOut();
    }


    function validateUser(userEmail){
      //if they are in the domain name, sign them in if they are not on the blacklisted emails
      var domainName = whiteListDomains.find(function(el){ return userEmail.indexOf(el) != -1});
      console.log("domainName", domainName);
      if(domainName){
        console.log("blackListEmails", blackListEmails);
        if(blackListEmails.indexOf(userEmail) === -1){
          console.log("not black listed email");
          if(domainName === "srdivinetouch.org"){
            $rootScope.srdUser = true;
          }
          loginUser();
          return true;
        }
        console.log("in the blacklisted emails");
      }
      //if it's a white listed email, sign them in: 
      if((whiteListEmails.indexOf(userEmail) !== -1)){
        console.log("white listed email");
        loginUser();
        return true;
      }
      console.log("logging user out");
      preventUserFromLogin();
      return false;
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
            var redirect = validateUser($rootScope.loggedInUser.email, $rootScope.loggedInUser.fullName); 
            if(redirect){
              userPersistenceService.setCookieData(profile.w3.ig, profile.w3.U3, $rootScope.srdUser); 
              console.log("Redirecting"); 
              $location.path('/home').replace(); 
            }
          });
        };

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
  "$cookies", "$rootScope" , function($cookies, $rootScope) {

    return {
      setCookieData: function(userName, userEmail, srdUser) {
        $cookies.put("userName", userName);
        $cookies.put("userEmail", userEmail);
        $cookies.put("srdUser", srdUser);
      },
      getUserNameData: function() {
        return $cookies.get("userName");
      },
      getUserEmailData: function(){
        return $cookies.get("userEmail");
      },
      getSrdUserData: function(){
        return $cookies.get("srdUser");
      },
      clearCookieData: function() {
        console.log("Clearing Cookie Data")
        $cookies.remove("userName");
        $cookies.remove("userEmail"); 
      },
    }
  }
]);
