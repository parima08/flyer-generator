'use strict';
var app = angular.module('myApp'); 

app.controller('HomeController', HomeController);

// app.directive("flyerTemplate", function(){
// 	attribute: 
// }); 


HomeController.$inject = ['$scope', '$rootScope', '$location', '$http', '$sce']; 
function HomeController($scope, $rootScope, $location, $http, $sce){
	console.log("HomeController");
	console.log($rootScope.loggedInUser.fullName);
	console.log($location.url()); 
	var spreadsheetID; 
	
	var hello = function(){
		console.log("hello"); 
	}

	var importGSS = function(data){
		console.log(data); 
	}; 

	var loadData = function(spreadsheetID){ 
		console.log(spreadsheetID); 
		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetID +"/od6/public/values?alt=json-in-script&\callback=JSON_CALLBACK"
		$sce.trustAsResourceUrl(url)
		$http.jsonp(url)
			.success(function(data, status){
				console.log(data); 
				console.log(data.feed.entry);
				var flyers = []; 
				for(var i = 0; i < data.feed.entry.length; i++){
					var flyer = {}
					flyer.name = data.feed.entry[i].gsx$name.$t; 
					var linkId = data.feed.entry[i].gsx$linkid.$t; 
					if(linkId != null){
						flyer.link = "https://drive.google.com/uc?export=view&id=" + linkId;  //0B05JMUbC2KVqQ0FZajhKOU0zU2c
					}
					flyers.push(flyer); 
				}
				$scope.flyers = flyers; 
				//return data; 
			}); 
	}; 


	switch($location.url()){
		case '/dharmayatra':
			$scope.title = "Dharmayatra Page";
			spreadsheetID = "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg"
			loadData(spreadsheetID); 
			break;
		case '/home':
			$scope.title = "Home Page";
			break; 
		default: 
			$scope.title = "Undefined";
	}; 

	

	
}