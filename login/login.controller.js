'use strict'

var app = angular.module('myApp'); 


app.controller('LoginController', LoginController); 

LoginController.$inject = ['$scope','googleService', 
                      '$rootScope', '$location', 
                      'userPersistenceService', '$window']; 
function LoginController($scope, googleService, $rootScope, $location, userPersistenceService, $window) {
  
  var whiteListEmails = [ "parima08@gmail.com", "centres.mgmt@sradharampur.org", "aniruddh.mehta90@gmail.com", 
                    "jhalakprdept@gmail.com", "supersup1388@gmail.com", "s170496@gmail.com", "anitashah92@gmail.com", 
                    "anushka96mehta@gmail.com", "sayam.jhaveri26@gmail.com", "aryan.shah@anarl.com", 
                    "shivjas123@gmail.com", "ahmedabad@srloveandcare.org", 
                   " bengaluru@srloveandcare.org", "canada@srloveandcare.org", "chennai@srloveandcare.org", "dubai@srloveandcare.org", 
                   "hongkong@srloveandcare.org", "muscat@srloveandcare.org", "singapore@srloveandcare.org", 
                   "surat@srloveandcare.org", "uk@srloveandcare.org", "vadodara@srloveandcare.org", 
                   "admin.srlc@srloveandcare.org", "npgosalia75@gmail.com", "uksupport@sradharampur.org"];

  var whiteListDomains = ["shrimadrajchandramission.org", "srdivinetouch.org"]; 
  $window.init = function(){
      console.log("In Init"); 
      if(userPersistenceService.getUserNameData()){
        $scope.isSignedIn = true
      }
      else{
        $scope.isSignedIn = false; 
      }

    function checkRestrictDomainName(userEmail){
      console.log("checkRestrictDomainName"); 
      var domainName = whiteListDomains.find(function(el){ return userEmail.indexOf(el) != -1});
      //comment this out!
      $rootScope.srdUser = false; 
      if(domainName){
         $rootScope.validUser = true; 
         alert(domainName);
        if( domainName === "srdivinetouch.org"){
          $rootScope.srdUser = true; 
        }
      }
      else{
        $rootScope.validUser = false; 
      }
      console.log("Valid User? " + $rootScope.validUser.toString() );
    }
    function validateUser(userEmail){
      checkRestrictDomainName(userEmail); 
      //userEmail.indexOf("shrimadrajchandramission.org") == -1)
      console.log("Is it in whitelisted emails? : " + (whiteListEmails.indexOf(userEmail) == -1).toString() )
      if(!$rootScope.validUser){
        if((whiteListEmails.indexOf(userEmail) == -1)){
          console.log("This email should not be allowed to sign in");
          $scope.signOut(); 
          alert("You are not a valid user. You must have a shrimadrajchandramission.org email address!");
          return false;
        }
        else{
          return true; 
        }
      }
      else{
        console.log("This email is allowed"); 
        console.log("apply the cookie")
        return true; 
      }
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
