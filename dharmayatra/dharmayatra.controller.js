'use strict';

var app = angular.module('myApp'); 

app.controller('DharmayatraController', DharmayatraController);

DharmayatraController.$inject = ['$scope', '$http']; 
function DharmayatraController($scope, $http){
	console.log("In Dharmayatra Controller"); 
	$scope.title = "Dharmayatra Controller"
	
	$scope.fn_load = function(){
		console.log("fn_load"); 
		alert("hello");
	}
	//getData(); 
	$scope.getData = function(){
		 $http({method: 'JSONP', url: url}).
			success(function(data, status) {
				$scope.items = data.entries;
			}).
			error(function(data, status) {
				console.log(data || "Request failed");
			});     
	} 


	angular.element(document).ready(function () {
       fn_load(); 
     }); 

	//var getData = function(){
		// console.log("in getData()"); 
		// var spreadsheetID = "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg"
		// var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetID +"/od6/public/values?alt=json-in-script&callback=importGSS"
		// $.getJSON(url, function(data) {
		// 	console.log(data)
		// 	var entry = data.feed.entry;

		// 	$(entry).each(function(){
		// 	// Column names are name, age, etc.
		// 	$('.results').prepend('<h2>'+this.gsx$name.$t+'</h2><p>'+this.gsx$age.$t+'</p>');
		// });	
	//}
	
}