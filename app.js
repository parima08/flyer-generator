'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version', 
  'ngLoadScript'
]).config(config)
.run(run); 

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('!');
	$routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/home' });
}

run.$inject = ['$rootScope', '$location']; 
function run($rootScope, $location){
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
	  //console.log($rootScope.loggedInUser.name); 
      if ($rootScope.loggedInUser == null) {
        // no logged user, redirect to /login
        if ( next.templateUrl === "partials/login.html") {
        } else {
          $location.path("/login");
        }
      }
    });
}


 // run.$inject = ['$rootScope', '$location', '$cookieStore', '$http'];
 //    function run($rootScope, $location, $cookieStore, $http) {
 //        // keep user logged in after page refresh
 //        $rootScope.globals = $cookieStore.get('globals') || {};
 //        if ($rootScope.globals.currentUser) {
 //            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
 //        }

 //        $rootScope.$on('$locationChangeStart', function (event, next, current) {
 //            // redirect to login page if not logged in and trying to access a restricted page
 //            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
 //            var loggedIn = $rootScope.globals.currentUser;
 //            if (restrictedPage && !loggedIn) {
 //                $location.path('/login');
 //            }
 //        });
 //    }
