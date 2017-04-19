'use strict';


// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version', 
  'ngLoadScript',
  'ui.bootstrap', 
]).config(config)
.run(run); 

config.$inject = ['$routeProvider', '$locationProvider'];
function config($routeProvider, $locationProvider){
	$locationProvider.hashPrefix('');
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
        .otherwise({ redirectTo: '/home' });

    // $locationProvider.html5Mode({
    //   enabled: true,
    //   requireBase: true
    // });
}

run.$inject = ['$rootScope', '$location']; 
function run($rootScope, $location){
  // HOME_URL = "/home"; 
  // DHARMAYATRA_URL = "/dharmayatra"; 
  // LOGIN_URL + "/login"


  //var postLogInRoute; 
  console.log("In Run"); 
  if($location.path()){
    $rootScope.postLogInRoute =  $location.path();
  }else{
    $rootScope.postLogInRoute =  '/home';
  }
  console.log("postLogInRoute: " + $rootScope.postLogInRoute )
  $rootScope.postLogInRoute =  $location.path() || "/home";
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
	   console.log("in routeChangeStart"); 
     //console.log($rootScope.loggedInUser.name); 
    if ($rootScope.loggedInUser == null) {
      console.log("no logged in user"); 
        // no logged user, redirect to /login
        if ( next.templateUrl === "partials/login.html") {
        } else {
          console.log("$location.path: " + $location.path()); 
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
