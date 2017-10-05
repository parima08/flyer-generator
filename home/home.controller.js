'use strict';
var app = angular.module('myApp'); 

app.controller('HomeController', HomeController);

app.factory('pageDetails', function(){
	var pageDetails = {}; 
	pageDetails.dharmayatra = {
		spreadsheetId: "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg", 
		thumbnailWidth: 200, 
		thumbnailHeight: 300, 
		canvasWidth: 500, 
		canvasHeight: 693
	}; 
	pageDetails.banners = {
		spreadsheetId: "1ZJfpP4N5f6kbFj93Xhj0ptMLkqlcIeapsdKiLRDcFq8", 
		thumbnailWidth: 200, 
		thumbnailHeight: 120, 
		canvasWidth: 834, 
		canvasHeight: 500 
	}; 
	pageDetails.invitations = {
		spreadsheetId: "1nfrfZ-TIXRJXl5lshiBRgOpKIpdT7k1Txe0X0z8g24k", 
		thumbnailWidth: 200, 
		thumbnailHeight: 132, 
		canvasWidth: 757, 
		canvasHeight: 500
	}; 
	pageDetails.articles = {
		spreadsheetId: "1KcE5rNKGrTX4EVmdb-4KmZnpmJ8h92YQ8_mgpVt_FAE"
	}
 	return pageDetails; 
 }); 



app.service("objectDetailsService", function($http, $q, $sce){
	var jsonData = []; 
	var objectDetailsService = {}; 
	var lookUpObject = {}; 
	var formInfo = []; 

	var loadDataAsync = function(spreadsheetID, thumbnailWidth, thumbnailHeight){
		var deffered = $q.defer();
		var english = []; 
		var hindi = []; 
		var gujarati = []; 
		jsonData = []; 
		console.log("loading data from gsheets"); 
		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetID +"/od6/public/values?alt=json-in-script"
		$sce.trustAsResourceUrl(url)
		$http.jsonp(url)
			.then(function(data, status){
				data = data.data
				for(var i = 0; i < data.feed.entry.length; i++){
					var mObject = grabObjectInfo(data.feed.entry[i], thumbnailWidth, thumbnailHeight)
					//jsonData.push(mObject); 
					console.log("Language:" + mObject.language.toLowerCase);
					switch(mObject.language.toLowerCase()){
						case "hindi":
							hindi.push(mObject);
							break;
						case 'gujarati':
							gujarati.push(mObject);
							break; 
						case 'english':
						default:
							english.push(mObject); 
						    break; 
					}
				}
				jsonData.push(english); 
				jsonData.push(hindi); 
				jsonData.push(gujarati); 
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

  	var lookupObjectByNameAsync = function(spreadsheetId, name, thumbnailWidth, thumbnailHeight){
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

  	var grabObjectInfo = function(jsonElement, thumbnailWidth, thumbnailHeight){
  		var mObject = {}
  		mObject.name = jsonElement.gsx$name.$t; 
  		//var linkId = jsonElement.gsx$linkid.$t; 
  		var awsLinkPath = jsonElement.gsx$awslinkpath.$t; 
  		if(awsLinkPath != ""){
			//mObject.imageLink = "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/" + filePath; 
			mObject.imageLink = "https://s3.amazonaws.com/srmd-flyer-generator/" + awsLinkPath; 
			//mObject.imageLink = "https://srmd-flyer-generator.s3.amazonaws.com/" + filePath; 
			mObject.thumbnailLink=  "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/" + thumbnailWidth +  "x" + thumbnailHeight + "/" + awsLinkPath; 

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
				if(data.feed.entry[i].gsx$letterspacing){
					formFieldInfo.letterSpacing = data.feed.entry[i].gsx$letterspacing.$t; 
				}
				console.log(data.feed.entry[i].gsx$letterspacing.$t);
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

//'spreadsheetIdListing',
HomeController.$inject = ['$scope', '$rootScope', '$location', '$http', 
						'$sce', 'objectDetailsService', 
						 'userPersistenceService', 
						'pageDetails']; 
function HomeController($scope, $rootScope, $location, 
	$http, $sce, objectDetailsService, userPersistenceService, pageDetails){
	$scope.isHomePage = false;
	// $scope.tabTitles = { title: "English",
	// 					title: "Hindi", 
	// 					title: "Gujarati"}; 
	$scope.tabTitles = ["English", "Hindi", "Gujarati"]; 
	console.log("HomeController");
	//console.log(userPersistenceService.getUserNameData());
	console.log($location.path());  

	$scope.saveMaterial = function(currObj){
		console.log("Saving the object"); 
		// objectDetailService.addObject(currObj);
		// console.log(currObj); 
		var locationPath = $location.path().toString(); 
		//$rootScope.postLogInRoute = locationPath ;
		console.log("Save Material LocationPath: " + locationPath); 
		//$location.path('/dharmayatra/' +  currObj.name.replace(/ /g,"_")).replace(); 
		console.log("***********")
		console.log(locationPath + '/' +  currObj.name.replace(/ /g,"_")); 
		$location.path(locationPath + '/' +  currObj.name.replace(/ /g,"_")).replace(); 
		//var newPath = locationPath + "/" + currObj.name.replace(/ /g,"_"); 
		//$window.location.href = newPath; 
		//$location.path(newPath).replace(); 
		//$scope.apply(); 
	}

	var populatePage = function(section){
		var spreadsheetId = pageDetails[section]['spreadsheetId']; 
		var thumbnailWidth = pageDetails[section]['thumbnailWidth']; 
		var thumbnailHeight = pageDetails[section]['thumbnailHeight']; 
		objectDetailsService.loadDataAsync(spreadsheetId, thumbnailWidth, thumbnailHeight).then(function(){
			console.log("loaded"); 
			console.log("inside get Data: "); 
			console.log(objectDetailsService.getData()); 
			$scope.flyers = objectDetailsService.getData(); 
			console.log("flyers: "); 
			console.log($scope.flyers);
		}); 
	};


	//TODO: Refactor the switch statement on the route URL
	//[a,b,c,d,e].indexOf(x) with the location path. 
	//

	switch($location.path()){
		case '/dharmayatra':
			$scope.title = "Dharmayatra Page";	
			populatePage("dharmayatra"); 
			break;
		case '/banners': 
			console.log("in banners"); 
			$scope.title = "Banner Page";
			populatePage("banners"); 
			break;
		case '/invitations': 
			$scope.title = "Invitations"
			populatePage("invitations"); 
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