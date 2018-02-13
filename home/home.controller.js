'use strict';
var app = angular.module('myApp'); 

app.controller('HomeController', HomeController);


app.service("objectDetailsService", function($http, $q, $sce){
	var jsonData = []; 
	var objectDetailsService = {}; 
	var lookUpObject = {}; 
	var formInfo = []; 


	var calculateAssetSize = function(width, height){
		//var ratio = 83.3; 
		// var canvasHeight = height * ratio; 
		// var canvasWidth = width *ratio; 
		var canvasWidth, canvasHeight; 
		if(width > height){
			canvasHeight = 500;
			canvasWidth = Math.round(canvasHeight * (width/height)); 
		}
		else{ 
			canvasWidth = 500; 
			canvasHeight = Math.round(canvasWidth * (height/width));
		}
		var thumbnailWidth = 200;
		var thumbnailHeight =  Math.round(thumbnailWidth * (canvasHeight/canvasWidth)); 
		return {
			"canvasHeight": canvasHeight, 
			"canvasWidth": canvasWidth, 
			"thumbnailHeight": thumbnailHeight, 
			"thumbnailWidth": thumbnailWidth
		}
	}

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
					switch(mObject.language.toLowerCase().trim()){
						case 'hindi':
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
				console.log("HINDI:"); 
				console.log(hindi); 
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
  		$sce.trustAsResourceUrl(url);
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
  		mObject.name = jsonElement.gsx$name.$t.trim(); 
  		var secondaryLinkPath = ""
  		//var linkId = jsonElement.gsx$linkid.$t; 
  		var awsLinkPath = jsonElement.gsx$awslinkpath.$t.trim(); 
  		if(jsonElement.gsx$secondaryawslinkpath){
  			 secondaryLinkPath = jsonElement.gsx$secondaryawslinkpath.$t.trim();
  		}
  		if(awsLinkPath != ""){
			mObject.imageLink = "https://s3.amazonaws.com/srmd-flyer-generator/" + awsLinkPath.trim(); 
			mObject.thumbnailLink=  "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/" + thumbnailWidth +  "x" + thumbnailHeight + "/" + awsLinkPath; 
		}
		if(secondaryLinkPath){
			mObject.twoOptions = true; 
			mObject.secondaryImageLink = "https://s3.amazonaws.com/srmd-flyer-generator/" + secondaryLinkPath; 
			mObject.secondaryButtonDescription = jsonElement.gsx$secondarybuttondescription.$t.trim(); 
			mObject.secondaryWorksheetIndex = jsonElement.gsx$secondaryworksheetindex.$t.trim();
		}
		else{
			console.log("The second option does not empty"); 
		}
		if(jsonElement.gsx$language){
			mObject.language = jsonElement.gsx$language.$t.toLowerCase().trim();
		}
  		mObject.worksheetIndex = jsonElement.gsx$worksheetindex.$t; 
  		return mObject
  	}

  	var loadFormInfoAsync = function(spreadsheetId, worksheetIndex){
  		var deffered = $q.defer();
  		formInfo = []; 
  		if(!worksheetIndex){
  			worksheetIndex = 2; 
  		}
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
				formFieldInfo.fieldName = data.feed.entry[i].gsx$fieldname.$t.trim(); 
				formFieldInfo.placeholderText = data.feed.entry[i].gsx$placeholdertext.$t.trim();
				formFieldInfo.fontColor = (data.feed.entry[i].gsx$fontcolor.$t).trim(); 
				formFieldInfo.fontSize = (data.feed.entry[i].gsx$fontsize.$t).trim();
				formFieldInfo.fontWeight = (data.feed.entry[i].gsx$fontweight.$t).trim();
				formFieldInfo.font = (data.feed.entry[i].gsx$font.$t).trim();
				formFieldInfo.textAlign = data.feed.entry[i].gsx$textalign.$t.trim();
				formFieldInfo.positionX = data.feed.entry[i].gsx$positionx.$t.trim(); 
				formFieldInfo.positionY = data.feed.entry[i].gsx$positiony.$t.trim(); 
				formFieldInfo.id = formFieldInfo.fieldName.toLowerCase().replace(/ /g,"_").toString();
				console.log("FieldName is: " + formFieldInfo.id);
				if(data.feed.entry[i].gsx$letterspacing){
					formFieldInfo.letterSpacing = data.feed.entry[i].gsx$letterspacing.$t.trim(); 
				}

				if(data.feed.entry[i].gsx$endpositionx && data.feed.entry[i].gsx$endpositionx.$t){
					//alert(data.feed.entry[i].gsx$endpositionx.$t); 
					formFieldInfo.endPositionX = data.feed.entry[i].gsx$endpositionx.$t.trim(); 
				}
				//console.log(data.feed.entry[i].gsx$letterspacing.$t);
				if( data.feed.entry[i].gsx$instructions){
					formFieldInfo.instructions = data.feed.entry[i].gsx$instructions.$t.trim();
				}
				// if(data.feed.entry[i].gsx$additionalrequiredtext){
				// 	formFieldInfo.additionalRequiredText = data.feed.entry[i].gsx$additionalrequiredtext.$t
				// }
				console.log("***********************");
				console.log(formFieldInfo.toString());
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
  		getFormInfo: getFormInfo,
  		calculateAssetSize: calculateAssetSize,
  	};
}); 

//'spreadsheetIdListing',
HomeController.$inject = ['$scope', '$rootScope', '$location', '$http', 
						'$sce', 'objectDetailsService', 
						 'userPersistenceService', 'subpageDetails']; 
function HomeController($scope, $rootScope, $location, 
	$http, $sce, objectDetailsService, userPersistenceService, subpageDetails){
	$scope.isHomePage = false;
	$scope.tabTitles = ["English", "Hindi", "Gujarati"]; 

	console.log("HomeController");
	//console.log(userPersistenceService.getUserNameData());
	console.log($location.path());  

	$scope.saveMaterial = function(currObj, option){

		console.log("Saving the object"); 
		// objectDetailService.addObject(currObj);
		// console.log(currObj); 
		var optionUrl = ""
		if(option == 1){
			optionUrl = "_1"; 
		}
		var locationPath = $location.path().toString(); 
		$location.path(locationPath + '/' +  currObj.name.replace(/ /g,"_") + optionUrl).replace();
	}

	if($location.path() === "/" || $location.path() === '/home' ){
			$scope.isHomePage = true; 
			console.log("Home Page"); 
			$scope.title = "Home Page"; 
	}
	else{
		var sectionDetails = subpageDetails[$location.path()];
		if(sectionDetails.title == "Articles"){
			//deal with articles
		}
		else if(sectionDetails.width){
			$scope.title = sectionDetails.title; 
			//$scope.title = $location.path().toString().replace(/\//g, '').charAt(0).toUpperCase(); 
			var dimensions = objectDetailsService.calculateAssetSize(sectionDetails['width'], sectionDetails['height']); 
			objectDetailsService.loadDataAsync(sectionDetails.spreadsheetId, dimensions.thumbnailWidth, dimensions.thumbnailHeight).then(function(){
				console.log("loaded"); 
				console.log("inside get Data: "); 
				console.log(objectDetailsService.getData()); 
				$scope.flyers = objectDetailsService.getData(); 
				console.log("flyers: "); 
				console.log($scope.flyers);
			}); 
		}else{
			$scope.title = "Coming Soon"; 
		}; 
	}
}