'use strict';

var app = angular.module('myApp'); 

app.controller('DharmayatraController', DharmayatraController);

DharmayatraController.$inject = ['$scope']; 
function DharmayatraController($scope){
	console.log("In Dharmayatra Controller"); 
	$scope.title = "Dharmayatra Controller"
}