'use strict';


// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'ngLoadScript',
  'ui.bootstrap',
  'ngCookies',
  'imageupload'
]).config(config)
  .run(run);

myApp.directive('onErrorSrc', function () {
  return {
    link: function (scope, element, attrs) {
      element.bind('error', function () {
        if (attrs.src != attrs.onErrorSrc) {
          attrs.$set('src', attrs.onErrorSrc);
        }
      });
    }
  }
});

config.$inject = ['$routeProvider', '$locationProvider',
  '$sceDelegateProvider', 'subpageDetailsProvider', '$qProvider'];
function config($routeProvider, $locationProvider,
  $sceDelegateProvider, subpageDetailsProvider, $qProvider) {
  $locationProvider.hashPrefix('');
  $sceDelegateProvider.resourceUrlWhitelist(['**']);
  $qProvider.errorOnUnhandledRejections(false);
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
    .when('/login', {
      controller: 'LoginController',
      templateUrl: 'login/login.view.html',
      controllerAs: 'vm'
    })
    .when('/xy-coords', {
      controller: "XyCoordController",
      templateUrl: 'utils/xy-finder.view.html',
      controllerAs: "vm"
    })
    .when('/articles', {
      controller: "ArticlesController",
      templateUrl: 'home/articles.view.html',
      controllerAs: "vm"
    })
    .when('/articles/:name', {
      controller: "ArticlesController",
      templateUrl: 'home/article_detail.view.html',
      controllerAs: "vm"
    })
    .otherwise({ redirectTo: '/home' });;

  //DETAILS 
  var subpages = Object.keys(subpageDetailsProvider.$get());
  for (var i = 0; i < subpages.length; i++) {
    $routeProvider.when(subpages[i], {
      controller: 'HomeController',
      templateUrl: 'home/home.view.html',
      controllerAs: 'vm'
    })
      .when(subpages[i] + '/:name', {
        controller: 'DetailsController',
        templateUrl: 'home/details.view.html',
        controllerAs: 'vm'
      });
  };

  // $locationProvider.html5Mode({
  //   enabled: true,
  //   requireBase: false
  // });
}

run.$inject = ['$rootScope', '$location', 'googleService', 'userPersistenceService'];
function run($rootScope, $location, googleService, userPersistenceService) {
  console.log("*****In RUN******");
  console.log("The location path is: " + $location.path());
  $rootScope.postLoginRoute = $location.path();
  console.log("postLoginRoute just set to (in Run) : " + $rootScope.postLoginRoute);
  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    console.log("in routeChangeStart");
    console.log("The next template is: " + next.templateUrl);
    console.log("postLogInRoute in routeChangeStart is: " + $rootScope.postLoginRoute);
    //console.log($rootScope.loggedInUser.name); 
    // if ($rootScope.loggedInUser == null) {
    if (userPersistenceService.getUserNameData() == null) {
      console.log("no logged in user");
      if (next.templateUrl === "login/login.view.html") {
        console.log("The location path already is login and the next template matches");
      }
      else {
        console.log("$location.path is not login, so redirecting - it is: " + $location.path());
        $location.path('/login');
      }
    }
    else {
      //if SRD user, restrict access: 
      if (userPersistenceService.getSrdUserData() === "true") {
        if (next.originalPath.indexOf("srd") == -1 && !(next.originalPath === "/") && !(next.originalPath == "/login")) {
          alert("You cannot access this page. Restricted for SRD users");
          $location.path('/');
        }
      }
      console.log(userPersistenceService.getUserNameData());
      console.log(userPersistenceService.getUserEmailData());
      $rootScope.loggedInUser = {};
      $rootScope.loggedInUser.email = userPersistenceService.getUserEmailData();
      $rootScope.loggedInUser.fullName = userPersistenceService.getUserNameData();
      $rootScope.rajUphaar = userPersistenceService.getRajUphaar();
      console.log("app.js - location: ", $rootScope.loggedInUser);
    }
  });

  //write all the names of the url - and the pageDetails for each one... 
  //make a factory of subpage - inject it above and also inject into this function. 
  //then return the pageDetails of the according section - you have to pass in 
  // the section 
  //or rather create a factory for all the details and then do a lookup through the calculator here.




  $rootScope.$on('$locationChangeSuccess', function () {
    $rootScope.actualLocation = $location.path();
  });

  $rootScope.$watch(function () { return $location.path() }, function (newLocation, oldLocation) {
    if ($rootScope.actualLocation === newLocation) {
      //if the old location has several sublayers, then go the last layer
      var ol_split = oldLocation.split("/")
      if (ol_split.length >= 3) {
        var correctLocation = "";
        for (var i = 0; i < ol_split.length - 1; i++) {
          console.log(ol_split[i]);
          correctLocation = correctLocation + ol_split[i] + "/";
        }
        console.log(correctLocation);
        $location.path(correctLocation);
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
