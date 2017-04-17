'use strict';
var app = angular.module('myApp'); 

app.controller('HomeController', HomeController);

HomeController.$inject = ['$scope', '$rootScope']; 
function HomeController($scope, $rootScope){
	console.log("HomeController");
	console.log($rootScope.loggedInUser.fullName);
	$scope.title = "Home Page"; 
}