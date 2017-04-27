'use strict';


// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version', 
  'ngLoadScript',
  'ui.bootstrap', 
  'angular.filter'
]).config(config)
.run(run); 


config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider){
	//$locationProvider.hashPrefix('!');
	$routeProvider
        .when('/', {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        })
        .when("/#", {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        })
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        })
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'login/login.view.html',
            controllerAs: 'vm'
        })
        .when('/dharmayatra', {
            controller: 'HomeController',
            templateUrl: 'home/home.view.html',
            controllerAs: 'vm'
        })
        .when('/dharmayatra/:name', {
            controller: 'DetailsController', 
            templateUrl: 'home/details.view.html',
            controllerAs: 'vm'
        })
        .otherwise({ redirectTo: '/home' });

    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: false
    // });
}

run.$inject = ['$rootScope', '$location']; 
function run($rootScope, $location){
  console.log("*****In RUN******"); 
  console.log("The location path is: " + $location.path()); 
  $rootScope.postLoginRoute =  $location.path();
	console.log("postLoginRoute just set to (in Run) : " + $rootScope.postLoginRoute); 
  $rootScope.$on( "$routeChangeStart", function(event, next, current) {
	   console.log("in routeChangeStart"); 
     console.log("The next template is: " + next.templateUrl); 
     console.log("postLogInRoute in routeChangeStart is: " + $rootScope.postLoginRoute); 
     //console.log($rootScope.loggedInUser.name); 
    if ($rootScope.loggedInUser == null) {
      console.log("no logged in user"); 
        if ( next.templateUrl === "login/login.view.html") {
           console.log("The location path already is login and the next template matches"); 
        } 
        else {
          console.log("$location.path is not login, so redirecting - it is: " + $location.path()); 
          $location.path('/login');
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
