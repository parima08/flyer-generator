'use strict';
var app = angular.module('myApp'); 

app.controller('HomeController', HomeController);

//TBD: CREATE A FACTORY FOR VARIOUS SIZES 
//OR A CALCULATOR FROM FEET INTO PIXELS. 
//get rid of the static and make a call to the calculator? 



// app.factory("assetDetails", function(){
// 	var assetDetails = {}; 
// 	assetDetails.dharmayatra = {
// 		spreadsheetId: "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg", width: 4, height: 6,  
// 	}
// 	assetDetails.banners4x6 = {
// 		spreadsheetId: "1mJoJ0Rb8FtZeEhHpt6wByFFMTFLd5KF8Nl1nEWnksZM", width: 6, height: 4, 
// 	}; 
// 	assetDetails.banners6x10 = {
// 		spreadsheetId: "blah", width: 10, height: 6, 
// 	}
// 	assetDetails.articles = {
// 		spreadsheetId: "1KcE5rNKGrTX4EVmdb-4KmZnpmJ8h92YQ8_mgpVt_FAE"
// 	}; 
// 	return assetDetails; 
// }); 


// app.factory('assetSize', function(){
// 	var assetSize = {}; 
// 	assetSize.flyers = {
// 		thumbnailWidth: 200, 
// 		thumbnailHeight: 300, 
// 		canvasWidth: 500, 
// 		canvasHeight: 693
// 	}
// 	//6x10; 
// 	assetSize.bannerBig = {
// 		thumbnailWidth: 200, 
// 		thumbnailHeight: 120, 
// 		canvasWidth: 834, 
// 		canvasHeight: 500 
// 	};

// 	//4x6
// 	assetSize.bannerSmall = {
// 		thumbnailWidth: 499.8, 
// 		thumbnailHeight: 333.2, 
// 		canvasWidth: 834, 
// 		canvasHeight: 500 
// 	};

// 	assetSize.standee = {};
// 	assetSize.invitation = {}; 
// 	return assetSize; 
// }); 

//pass in assetSize into pageDetails? 
// app.factory('pageDetails', ['assetSize', function(assetSize){
// 	var pageDetails = {}; 
// 	pageDetails.dharmayatra = Object.assign({
// 		spreadsheetId: "1k24IRyWNX_OJtXCLVLvWzh36YtQcag20dE9v_9V6LCg", 
// 	}, assetSize.flyers); 
// 	pageDetails.banners = {
// 		spreadsheetId: "1ZJfpP4N5f6kbFj93Xhj0ptMLkqlcIeapsdKiLRDcFq8", 
// 		thumbnailWidth: 200, 
// 		thumbnailHeight: 120, 
// 		canvasWidth: 834, 
// 		canvasHeight: 500 
// 	}; 
// 	pageDetails.invitations = {
// 		spreadsheetId: "1nfrfZ-TIXRJXl5lshiBRgOpKIpdT7k1Txe0X0z8g24k", 
// 		thumbnailWidth: 200, 
// 		thumbnailHeight: 132, 
// 		canvasWidth: 757, 
// 		canvasHeight: 500
// 	}; 
// 	pageDetails.articles = {
// 		spreadsheetId: "1KcE5rNKGrTX4EVmdb-4KmZnpmJ8h92YQ8_mgpVt_FAE"
// 	}; 
// 	pageDetails.srdFlyers = {
// 		spreadsheetId: "1OR8SnYpxaAuhT1j7Cgm_hqYIxw6ry6nr5c6rtJWklNQ", 
// 		thumbnailWidth: 200, 
// 		thumbnailHeight: 300, 
// 		canvasWidth: 500, 
// 		canvasHeight: 693
// 	}; 
// 	pageDetails.banners6x10 = Object.assign({
// 		spreadsheetId: "1jL69EN-uNUtvmG1rAtKFjLZ7feqblrW-j8rhbu1VhOE"
// 	}, assetSize.bannerBig); 
// 	pageDetails.banners4x6 = Object.assign({
// 		spreadsheetId: "1mJoJ0Rb8FtZeEhHpt6wByFFMTFLd5KF8Nl1nEWnksZM"
// 	}, assetSize.bannerSmall); 

// 	pageDetails.srlcFlyers = Object.assign({spreadsheetId: "blah"}, assetSize.flyers)
//  	return pageDetails; 
//  }]); 

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
					switch(mObject.language.toLowerCase()){
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
  		mObject.name = jsonElement.gsx$name.$t; 
  		var secondaryLinkPath = ""
  		//var linkId = jsonElement.gsx$linkid.$t; 
  		var awsLinkPath = jsonElement.gsx$awslinkpath.$t; 
  		if(jsonElement.gsx$secondaryawslinkpath){
  			 secondaryLinkPath = jsonElement.gsx$secondaryawslinkpath.$t;
  		}
  		if(awsLinkPath != ""){
			//mObject.imageLink = "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/" + filePath; 
			mObject.imageLink = "https://s3.amazonaws.com/srmd-flyer-generator/" + awsLinkPath; 
			//mObject.imageLink = "https://srmd-flyer-generator.s3.amazonaws.com/" + filePath; 
			mObject.thumbnailLink=  "http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/" + thumbnailWidth +  "x" + thumbnailHeight + "/" + awsLinkPath; 

			//mObject.imageLink = "https://drive.google.com/uc?export=view&id=" + linkId;  //0B05JMUbC2KVqQ0FZajhKOU0zU2c
		}
		if(secondaryLinkPath){
			mObject.twoOptions = true; 
			mObject.secondaryImageLink = "https://s3.amazonaws.com/srmd-flyer-generator/" + secondaryLinkPath; 
			mObject.secondaryButtonDescription = jsonElement.gsx$secondarybuttondescription.$t; 
			mObject.secondaryWorksheetIndex = jsonElement.gsx$secondaryworksheetindex.$t;
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
				console.log("FieldName is: " + formFieldInfo.id);
				if(data.feed.entry[i].gsx$letterspacing){
					formFieldInfo.letterSpacing = data.feed.entry[i].gsx$letterspacing.$t; 
				}

				if(data.feed.entry[i].gsx$endpositionx && data.feed.entry[i].gsx$endpositionx.$t){
					//alert(data.feed.entry[i].gsx$endpositionx.$t); 
					formFieldInfo.endPositionX = data.feed.entry[i].gsx$endpositionx.$t; 
				}
				//console.log(data.feed.entry[i].gsx$letterspacing.$t);
				if( data.feed.entry[i].gsx$instructions){
					formFieldInfo.instructions = data.feed.entry[i].gsx$instructions.$t
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

	// var populatePage = function(section){
	// 	//var sectionDetails = assetDetails[section]
	// 	var dimensions = objectDetailsService.calculateAssetSize(sectionDetails[width], sectionDetails[height]); 
	// 	var thumbnailWidth = dimensions[thumbnailWidth]; 
	// 	var thumbnailHeight = dimensions[thumbnailHeight]; 
	// 	//var thumbnailWidth = pageDetails[section][width]
	// 	//var thumbnailHeight = pageDetails[section]['thumbnailHeight']; 
	// 	//var spreadsheetId = pageDetails[section]['spreadsheetId']; 
	// 	// var thumbnailWidth = pageDetails[section]['thumbnailWidth']; 
	// 	// var thumbnailHeight = pageDetails[section]['thumbnailHeight']; 
	// 	objectDetailsService.loadDataAsync(spreadsheetId, thumbnailWidth, thumbnailHeight).then(function(){
	// 		console.log("loaded"); 
	// 		console.log("inside get Data: "); 
	// 		console.log(objectDetailsService.getData()); 
	// 		$scope.flyers = objectDetailsService.getData(); 
	// 		console.log("flyers: "); 
	// 		console.log($scope.flyers);
	// 	}); 
	// };


	//TODO: Refactor the switch statement on the route URL
	//[a,b,c,d,e].indexOf(x) with the location path. 
	//
	console.log("I get here!"); 
	if($location.path() === "/" || $location.path() === '/home' ){
			$scope.isHomePage = true; 
			console.log("Home Page"); 
			$scope.title = "Home Page"; 
	}
	else{
		var sectionDetails = subpageDetails[$location.path()];
		if(sectionDetails == "Articles"){
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

	// switch($location.path()){
	// 	case '/dharmayatra':
	// 		$scope.title = "Dharmayatra Page";	
	// 		populatePage("dharmayatra"); 
	// 		break;
	// 	case '/banners': 
	// 		console.log("in banners"); 
	// 		$scope.title = "Banner Page";
	// 		populatePage("banners"); 
	// 		break;
	// 	case '/banners6x10':
	// 		console.log("banners 6x10"); 
	// 		$scope.title = "Banners 6x10"; 
	// 		populatePage("banners6x10");
	// 		break; 
	// 	case '/banners4x6':
	// 		$scope.title = "Banners 4x6";
	// 		populatePage("banners4x6"); 
	// 		break; 
	// 	case '/invitations': 
	// 		$scope.title = "Invitations";
	// 		populatePage("invitations"); 
	// 		break; 
	// 	case '/srd-flyers': 
	// 		$scope.title = "SRD Flyers"; 
	// 		populatePage("srdFlyers"); 
	// 		break;
	// 	case '/standees': 
	// 		$scope.title = "Standees"; 
	// 		break;
	// 	case '/home': 
	// 	case '/':
	// 		$scope.isHomePage = true; 
	// 		console.log("Home Page"); 
	// 		$scope.title = "Home Page"; 
	// 		break; 
	// 	default: 
	// 		$scope.title = "Coming Soon";
	// }; 	
}