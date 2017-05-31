'use strict';
var app = angular.module('myApp'); 

app.controller('HomeController', HomeController);

app.factory('spreadsheetIdListing', function(){
	var spreadSheetIds = {}; 
	spreadSheetIds.dharmayatra = "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg"; 
	return spreadSheetIds; 
});

// app.service('objectDetailService', function() {
//   var objects = [];

//   var addObject = function(newObj) {
//       objects.push(newObj);
//   };

//   var getObject = function(name){
//   	  console.log(objects); 
//       for(var i = 0; i < objects.length; i++){
//       	console.log(objects[i]); 
//       	if(objects[i].name == name){
//       		return objects[i]
//       	}
//       }
//       return ""; 
//   };


//   return {
//     addObject: addObject,
//     getObject: getObject
//   };

// });

app.service("objectDetailsService", function($http, $q, $sce){
	var jsonData = []; 
	var objectDetailsService = {}; 
	var lookUpObject = {}; 
	var formInfo = []; 

	var loadDataAsync = function(spreadsheetID){
		var deffered = $q.defer();
		jsonData = []; 
		console.log("loading data from gsheets"); 
		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetID +"/od6/public/values?alt=json-in-script"
		$sce.trustAsResourceUrl(url)
		$http.jsonp(url)
			.then(function(data, status){
				data = data.data
				for(var i = 0; i < data.feed.entry.length; i++){
					jsonData.push(grabObjectInfo(data.feed.entry[i])); 
				}
				deffered.resolve();
			}); 
			return deffered.promise;
	}; 

	var getData = function() { 
		return jsonData 
	}

	var getObject = function(){
		return lookUpObject; 
	}

	var getFormInfo = function(){
		return formInfo; 
	}

  	var lookupObjectByNameAsync = function(spreadsheetId, name){
  		var deffered = $q.defer();
  		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/od6/public/values?alt=json-in-script"
  		$sce.trustAsResourceUrl(url)
  		$http.jsonp(url)
			.then(function(data, status){
				data = data.data		
				for(var i = 0; i < data.feed.entry.length; i++){
					if(data.feed.entry[i].gsx$name.$t == name){
						lookUpObject = grabObjectInfo(data.feed.entry[i]); 
						break;
					} 
				}
				deffered.resolve();
			}
		); 
		return deffered.promise;
  	}

  	var grabObjectInfo = function(jsonElement){
  		var mObject = {}
  		mObject.name = jsonElement.gsx$name.$t; 
  		//var linkId = jsonElement.gsx$linkid.$t; 
  		var awsLinkPath = jsonElement.gsx$awslinkpath.$t; 
  		if(awsLinkPath != ""){
			//mObject.imageLink = "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/" + filePath; 
			mObject.imageLink = "https://s3.amazonaws.com/srmd-flyer-generator/" + awsLinkPath; 
			//mObject.imageLink = "https://srmd-flyer-generator.s3.amazonaws.com/" + filePath; 
			mObject.thumbnailLink=  "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/200x300/" + awsLinkPath; 

			//mObject.imageLink = "https://drive.google.com/uc?export=view&id=" + linkId;  //0B05JMUbC2KVqQ0FZajhKOU0zU2c
		}
		else{
			console.log("The linkID is empty"); 
		}
		if(jsonElement.gsx$language){
			mObject.language = jsonElement.gsx$language.$t
		}
  		mObject.worksheetIndex = jsonElement.gsx$worksheetindex.$t; 
  		return mObject
  	}

  	var loadFormInfoAsync = function(spreadsheetId, worksheetIndex){
  		var deffered = $q.defer();
  		formInfo = []; 
  		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/"+ worksheetIndex +
  						"/public/values?alt=json-in-script"
  		$http.jsonp(url)
		.then(function(data, status){
			data = data.data
			console.log("Data: "); 	
			console.log(data); 	
			console.log("status: "); 	
			console.log(status); 
			for(var i = 0; i < data.feed.entry.length; i++){
				var formFieldInfo = {}
				formFieldInfo.fieldName = data.feed.entry[i].gsx$fieldname.$t; 
				formFieldInfo.placeholderText = data.feed.entry[i].gsx$placeholdertext.$t;
				formFieldInfo.fontColor = data.feed.entry[i].gsx$fontcolor.$t; 
				formFieldInfo.fontSize = data.feed.entry[i].gsx$fontsize.$t
				formFieldInfo.fontWeight = data.feed.entry[i].gsx$fontweight.$t
				formFieldInfo.font = data.feed.entry[i].gsx$font.$t
				formFieldInfo.textAlign = data.feed.entry[i].gsx$textalign.$t
				formFieldInfo.positionX = data.feed.entry[i].gsx$positionx.$t; 
				formFieldInfo.positionY = data.feed.entry[i].gsx$positiony.$t; 
				formFieldInfo.id = formFieldInfo.fieldName.toLowerCase().replace(/ /g,"_").toString();
				if(data.feed.entry[i].gsx$linespacing){
					formFieldInfo.lineSpacing = data.feed.entry[i].gsx$linespacing.$t; 
				}
				if( data.feed.entry[i].gsx$instructions){
					formFieldInfo.instructions = data.feed.entry[i].gsx$instructions.$t
				}
				// if(data.feed.entry[i].gsx$additionalrequiredtext){
				// 	formFieldInfo.additionalRequiredText = data.feed.entry[i].gsx$additionalrequiredtext.$t
				// }
				formInfo.push(formFieldInfo);
			}
			deffered.resolve();
		}); 
		return deffered.promise;
  	}

  	//TBD
  	// var lookupObjectById = function(spreadsheetId, id){
  	// 	var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetID +"/od6/public/values?alt=json-in-script&\callback=JSON_CALLBACK"
  	// 	http.jsonp(url)
			// .then(function(data, status){
			// 	var flyer = {}
			// 	flyer = data.feed.entry[id]
			// 	return flyer; 
			// }); 
  	// }

  	return{
  		loadDataAsync : loadDataAsync,
  		getData: getData,  
  		lookupObjectByNameAsync: lookupObjectByNameAsync, 
  		loadFormInfoAsync: loadFormInfoAsync, 
  		getObject: getObject, 
  		getFormInfo: getFormInfo
  	};
}); 


HomeController.$inject = ['$scope', '$rootScope', '$location', '$http', 
						'$sce', 'objectDetailsService', 
						'spreadsheetIdListing', 'userPersistenceService']; 
function HomeController($scope, $rootScope, $location, 
	$http, $sce, objectDetailsService, 
	spreadsheetIdListing, userPersistenceService){
	$scope.isHomePage = false; 
	console.log("HomeController");
	console.log(userPersistenceService.getUserNameData());
	console.log($location.path());  

	$scope.saveMaterial = function(currObj){
		console.log("Saving the object"); 
		// objectDetailService.addObject(currObj);
		// console.log(currObj); 
		var locationPath = $location.path().toString(); 
		//$rootScope.postLogInRoute = locationPath ;
		console.log("Save Material LocationPath: " + locationPath); 
		$location.path('/dharmayatra/' +  currObj.name.replace(/ /g,"_")).replace(); 
		//var newPath = locationPath + "/" + currObj.name.replace(/ /g,"_"); 
		//$window.location.href = newPath; 
		//$location.path(newPath).replace(); 
		//$scope.apply(); 
	}

	switch($location.path()){
		case '/dharmayatra':
			$scope.title = "Dharmayatra Page";
			var spreadsheetId = spreadsheetIdListing.dharmayatra; 
			console.log("Grabbing flyers again"); 
			console.log(objectDetailsService); 
			console.log(spreadsheetIdListing); 
			objectDetailsService.loadDataAsync(spreadsheetId).then(function(){
				console.log("loaded"); 
				console.log("inside get Data: "); 
				console.log(objectDetailsService.getData()); 
				$scope.flyers = objectDetailsService.getData(); 
				console.log("flyers: "); 
				console.log($scope.flyers);
			}); 
			

			break;; 
		case '/articles': 
			$scope.title = "Articles Page"; 
			break; 
		case '/home': 
		case '/':
			$scope.isHomePage = true; 
			console.log("Home Page"); 
			$scope.title = "Home Page"; 
			break; 
		default: 
			$scope.title = "Coming Soon";
	}; 

	

	
}