'use strict';

var app = angular.module('myApp'); 
var auth2;

app.controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$window', '$rootScope', '$location'];
function LoginController($scope, $window, $rootScope, $location){
    
    $scope.user = {};


    var postLogInRoute; 

    $window.appStart = function() {
        console.log('appStart()');
        gapi.load('auth2', initSigninV2);
    };

    var initSigninV2 = function() {
        console.log('initSigninV2()');
        auth2 = gapi.auth2.getAuthInstance();
        auth2.isSignedIn.listen(signinChanged);
        auth2.currentUser.listen(userChanged);

        if(auth2.isSignedIn.get() == true) {
            auth2.signIn();
        }
    };

    var signinChanged = function(isSignedIn) {
        console.log('signinChanged() = ' + isSignedIn);
        if(isSignedIn) {
            console.log('the user must be signed in to print this');
            var googleUser = auth2.currentUser.get();
            var authResponse = googleUser.getAuthResponse();
            var profile = googleUser.getBasicProfile();
            $rootScope.loggedInUser = profile; 
            $rootScope.loggedInUser.fullName  = profile.getName(); 
            $rootScope.loggedInUser.email  = profile.getEmail(); 
            
            console.log("Trying to redirect")
            postLogInRoute = $rootScope.postLogInRoute
            $location.path(postLogInRoute).replace();
            postLogInRoute = null; 
            $scope.$apply(); 


            // $scope.user.id          = profile.getId();
            // $scope.user.fullName    = profile.getName();
            // $scope.user.firstName   = profile.getGivenName();
            // $scope.user.lastName    = profile.getFamilyName();
            // $scope.user.photo       = profile.getImageUrl();
            // $scope.user.email       = profile.getEmail();
            // $scope.user.domain      = googleUser.getHostedDomain();
            // $scope.$digest();
            // console.log($rootScope); 
           
            // console.log("postLogInRoot" + postLogInRoot); 
            // 
            // postLogInRoute = null;
            
        } else {
            console.log('the user must not be signed in if this is printing');
            $scope.user = {};
            $scope.$digest();
        }
    };

    var userChanged = function(user) {
        console.log('userChanged()');
    };
    
    $scope.signOut = function() {
        console.log('signOut()');
        auth2.signOut().then(function() {
            signinChanged(false);    
        });
        console.log(auth2);
    };

    // $scope.on("signOut", function(){
    //     $scope.signOut(); 
    // })
    
    $scope.disconnect = function() {
        console.log('disconnect()');
        auth2.disconnect().then(function() {
            signinChanged(false);
        });
        console.log(auth2);
    };
};