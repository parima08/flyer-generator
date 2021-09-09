'use strict';
var app = angular.module('myApp');

app.controller('HomeController', HomeController);

app.service("objectDetailsService", function ($http, $q, $sce) {
	var jsonData = [];
	var objectDetailsService = {};
	var lookUpObject = {};
	var formInfo = [];

	var loadDataAsync = function (spreadsheetID, sectionDetails) {
		var deffered = $q.defer();
		var english = [];
		var hindi = [];
		var gujarati = [];
		jsonData = [];
		console.log("loading data from gsheets");
		//let sheetTitle;
		let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}\?key\=AIzaSyC7_gUUo-CWg4IMJnohsRAqNnKPvoJ4pLo`
		fetch(url).then(response => response.json())
			.then(data => {
				let sheetTitle = data.sheets[0].properties.title
				return sheetTitle
			})
			.catch(error => {
				// console.error('Error', error)
			})
			.then(title => {
				let sheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetID}/values/${title}\?key\=AIzaSyC7_gUUo-CWg4IMJnohsRAqNnKPvoJ4pLo`
				fetch(sheetDataUrl).then(response => response.json())
					.then(data => {
						const values = data.values;
						console.log(values);
						//gets rid of the first line
						const rowHeader = values.splice(0, 1)[0];
						console.log(rowHeader);
						const map = rowHeader.reduce((acc, currVal, currIndex) => {
							console.log(currVal);
							acc[currVal] = currIndex;
							return acc;
						}, {})
						values.forEach(el => {
							const asset = massageData(el, sectionDetails, map);
							switch (el[map.language].toLowerCase().trim()) {
								case 'hindi':
									hindi.push(asset);
									break;
								case 'gujarti':
									gujarati.push(asset);
									break;
								case 'english':
									english.push(asset);
									break;
							}
						})
						jsonData = [english, gujarati, hindi];
						deffered.resolve();
					})
					.catch(error => {
						// console.error('Error', error)
					})
			})


		return deffered.promise;
	};

	var getData = function () {
		return jsonData
	}

	var getObject = function () {
		return lookUpObject;
	}

	var getFormInfo = function () {
		return formInfo;
	}


	var lookupObjectByNameAsync = function (spreadsheetId, name, sectionDetails) {
		var deffered = $q.defer();

		let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}\?key\=AIzaSyC7_gUUo-CWg4IMJnohsRAqNnKPvoJ4pLo`
		fetch(url).then(response => response.json())
			.then(data => {
				let sheetTitle = data.sheets[0].properties.title
				return sheetTitle
			})
			.catch(error => {
				// console.error('Error', error)
			})
			.then(title => {
				let sheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${title}\?key\=AIzaSyC7_gUUo-CWg4IMJnohsRAqNnKPvoJ4pLo`
				fetch(sheetDataUrl).then(response => response.json())
					.then(data => {
						const values = data.values;
						console.log(values);
						//gets rid of the first line
						const rowHeader = values.splice(0, 1)[0];
						console.log(rowHeader);
						const map = rowHeader.reduce((acc, currVal, currIndex) => {
							acc[currVal] = currIndex;
							return acc;
						}, {})
						const element = values.find(el => el[map.name] === name);
						lookUpObject = massageData(element, sectionDetails, map);
						deffered.resolve();
					})
					.catch(error => {
						// console.error('Error', error)
					})
			})
		return deffered.promise;
	}

	// var lookupObjectByNameAsync = function (spreadsheetId, name, sectionDetails) {
	// 	var deffered = $q.defer();
	// 	var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetId + "/od6/public/values?alt=json-in-script"
	// 	console.log("lookUpObjectByNameAysnc");
	// 	$sce.trustAsResourceUrl(url);
	// 	$http.jsonp(url)
	// 		.then(function (data, status) {
	// 			data = data.data;
	// 			console.log("data", data);
	// 			for (var i = 0; i < data.feed.entry.length; i++) {
	// 				console.log("Name", data.feed.entry[i].gsx$name.$t);
	// 				if (data.feed.entry[i].gsx$name.$t.trim() == name) {
	// 					lookUpObject = grabObjectInfo(data.feed.entry[i], sectionDetails);
	// 					console.log("lookUpobject", lookUpObject);
	// 					break;
	// 				}
	// 			}
	// 			deffered.resolve();
	// 		}
	// 		);
	// 	return deffered.promise;
	// }
	var massageData = function (el, sectionDetails, map) {
		const width = el[map.width] || sectionDetails.width;
		const height = el[map.height] || sectionDetails.height;
		const dimensions = calculateAssetSize(width, height);
		const name = el[map.name].trim();
		const awsLinkPath = el[map.awsLinkPath].trim();
		const secondaryLinkPath = el[map.secondaryAwsLinkPath].trim();
		const thumbnailHeight = dimensions['thumbnailHeight'];
		const thumbnailWidth = dimensions['thumbnailWidth'];

		const a = {
			name,
			awsLinkPath,
			secondaryLinkPath,
			width,
			height,
			dimensions,
			thumbnailWidth,
			thumbnailWidth,
			canvasHeight: dimensions['canvasHeight'],
			canvasWidth: dimensions['canvasWidth'],
			imageLink: `https://s3.amazonaws.com/srmd-flyer-generator/${awsLinkPath}`,
			thumbnailLink: `http://srmd-flyer-generator.s3-website-us-east-1.amazonaws.com/${thumbnailWidth}x${thumbnailHeight}/${awsLinkPath}`,
			worksheetIndex: el[map.worksheetIndex],
		}
		if (secondaryLinkPath) {
			a.twoOptions = true;
			a.secondaryImageLink = `https://s3.amazonaws.com/srmd-flyer-generator/${awsLinkPath}`,
				a.secondaryButtonDescription = el[map.secondaryButtonDescription].trim();
			a.secondaryWorksheetIndex = el[map.secondaryWorksheetIndex].trim();
		}
		return a;
	}

	var loadFormInfoAsync = function (spreadsheetId, worksheetIndex) {

		var deffered = $q.defer();
		formInfo = [];
		if (!worksheetIndex) {
			worksheetIndex = 2;
		}

		let url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}\?key\=AIzaSyC7_gUUo-CWg4IMJnohsRAqNnKPvoJ4pLo`
		fetch(url).then(response => response.json())
			.then(data => {
				const index = parseInt(worksheetIndex) - 1;
				let sheetTitle = data.sheets[index].properties.title
				console.log({ worksheetIndex, sheetTitle });
				return sheetTitle
			})
			.catch(error => {
				// console.error('Error', error)
			})
			.then(title => {
				console.log("loadFormInfoAsync")
				let sheetDataUrl = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${title}\?key\=AIzaSyC7_gUUo-CWg4IMJnohsRAqNnKPvoJ4pLo`
				fetch(sheetDataUrl).then(response => response.json())
					.then(data => {
						const values = data.values;
						console.log(values);
						//gets rid of the first line
						const rowHeader = values.splice(0, 1)[0];
						console.log(rowHeader);
						const map = rowHeader.reduce((acc, currVal, currIndex) => {
							acc[currVal] = currIndex;
							return acc;
						}, {})

						values.forEach(el => {
							const formFieldInfo = massageFormField(el, map);
							formInfo.push(formFieldInfo);
						})
						//const formInfo = getFormInfo(element, sectionDetails, map);
						deffered.resolve();
					})
					.catch(error => {
						// console.error('Error', error)
					})
			})


		// var url = "https://spreadsheets.google.com/feeds/list/" + spreadsheetId + "/" + worksheetIndex +
		// 	"/public/values?alt=json-in-script"
		// $http.jsonp(url)
		// 	.then(function (data, status) {
		// 		data = data.data
		// 		console.log("Data: ", data);
		// 		//console.log("status: ", status); 
		// 		for (var i = 0; i < data.feed.entry.length; i++) {
		// 			var formFieldInfo = {}
		// 			formFieldInfo.fieldName = data.feed.entry[i].gsx$fieldname.$t.trim();
		// 			formFieldInfo.placeholderText = data.feed.entry[i].gsx$placeholdertext.$t.trim();
		// 			formFieldInfo.fontColor = (data.feed.entry[i].gsx$fontcolor.$t).trim();
		// 			formFieldInfo.fontSize = (data.feed.entry[i].gsx$fontsize.$t).trim();
		// 			formFieldInfo.fontWeight = (data.feed.entry[i].gsx$fontweight.$t).trim();
		// 			formFieldInfo.font = (data.feed.entry[i].gsx$font.$t).trim();
		// 			formFieldInfo.textAlign = data.feed.entry[i].gsx$textalign.$t.trim();
		// 			formFieldInfo.positionX = data.feed.entry[i].gsx$positionx.$t.trim();
		// 			formFieldInfo.positionY = data.feed.entry[i].gsx$positiony.$t.trim();
		// 			formFieldInfo.id = formFieldInfo.fieldName.toLowerCase().replace(/ /g, "_").toString();
		// 			//console.log("FieldName is: ", formFieldInfo.id);
		// 			if (data.feed.entry[i].gsx$letterspacing) {
		// 				formFieldInfo.letterSpacing = data.feed.entry[i].gsx$letterspacing.$t.trim();
		// 			}

		// 			// For Logo Sizes: 
		// 			formFieldInfo.width = data.feed.entry[i].gsx$width && data.feed.entry[i].gsx$width.$t ?
		// 				data.feed.entry[i].gsx$width.$t.trim()
		// 				: null;
		// 			formFieldInfo.height = data.feed.entry[i].gsx$height && data.feed.entry[i].gsx$height.$t ?
		// 				data.feed.entry[i].gsx$height.$t.trim()
		// 				: null;

		// 			//console.log("Width: " + formFieldInfo.width + " Height: " + formFieldInfo.height);


		// 			if (data.feed.entry[i].gsx$endpositionx && data.feed.entry[i].gsx$endpositionx.$t) {
		// 				//alert(data.feed.entry[i].gsx$endpositionx.$t); 
		// 				formFieldInfo.endPositionX = data.feed.entry[i].gsx$endpositionx.$t.trim();
		// 			}
		// 			//console.log(data.feed.entry[i].gsx$letterspacing.$t);
		// 			if (data.feed.entry[i].gsx$instructions) {
		// 				formFieldInfo.instructions = data.feed.entry[i].gsx$instructions.$t.trim();
		// 			}
		// 			// if(data.feed.entry[i].gsx$additionalrequiredtext){
		// 			// 	formFieldInfo.additionalRequiredText = data.feed.entry[i].gsx$additionalrequiredtext.$t
		// 			// }
		// 			//console.log("***********************");
		// 			formInfo.push(formFieldInfo);
		// 		}

		// 		console.log("All the data for the form: ", formInfo);
		// 		deffered.resolve();
		// 	});
		return deffered.promise;
	}

	var massageFormField = (el, map) => {
		const fieldName = el[map.fieldName]?.trim()
		let font = el[map?.font]?.trim()
		font = font.charAt(0).toUpperCase() + font.slice(1)
		return {
			fieldName,
			placeholderText: el[map?.placeholderText]?.trim(),
			fontColor: el[map?.fontColor]?.trim(),
			fontWeight: el[map?.fontWeight]?.trim(),
			fontSize: el[map?.fontSize]?.trim(),
			font,
			textAlign: el[map.textAlign]?.trim(),
			positionX: el[map.positionX]?.trim(),
			positionY: el[map.positionY]?.trim(),
			id: fieldName.toLowerCase().replace(/ /g, "_").toString(),
			width: el[map?.width]?.trim(),
			height: el[map?.height]?.trim(),
			endPositionX: el[map?.endPositionX]?.trim(),
			endPositionY: el[map?.endPositionY]?.trim(),
			instructions: el[map?.instructions]?.trim(),
			additionalRequiredText: el[map?.additionalRequiredText]?.trim()
		}
	}

	var calculateAssetSize = function (width, height) {
		console.log("Calculating asset size!");
		var canvasWidth, canvasHeight;
		if (width > height) {
			canvasHeight = 500;
			canvasWidth = Math.round(canvasHeight * (width / height));
		}
		else {
			canvasWidth = 500;
			canvasHeight = Math.round(canvasWidth * (height / width));
		}
		var thumbnailWidth = 200;
		var thumbnailHeight = Math.round(thumbnailWidth * (canvasHeight / canvasWidth));
		return {
			"canvasHeight": canvasHeight,
			"canvasWidth": canvasWidth,
			"thumbnailHeight": thumbnailHeight,
			"thumbnailWidth": thumbnailWidth
		}
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

	return {
		loadDataAsync: loadDataAsync,
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
	$http, $sce, objectDetailsService, userPersistenceService, subpageDetails) {
	$scope.isHomePage = false;
	$scope.tabTitles = ["English", "Gujarati", "Hindi"];

	console.log("HomeController");
	//console.log(userPersistenceService.getUserNameData());
	console.log($location.path());

	$scope.saveMaterial = function (currObj, option) {

		console.log("Saving the object");
		// objectDetailService.addObject(currObj);
		// console.log(currObj); 
		var optionUrl = ""
		if (option == 1) {
			optionUrl = "_1";
		}
		var locationPath = $location.path().toString();
		$location.path(locationPath + '/' + currObj.name.replace(/ /g, "_") + optionUrl).replace();
	}

	if ($location.path() === "/" || $location.path() === '/home') {
		$scope.isHomePage = true;
		console.log("Home Page");
		$scope.title = "Home Page";
	}
	else {
		var sectionDetails = subpageDetails[$location.path()];
		if (sectionDetails.title == "Articles") {
			//deal with articles
		}
		else if (sectionDetails.width) {
			$scope.title = sectionDetails.title;
			//$scope.title = $location.path().toString().replace(/\//g, '').charAt(0).toUpperCase(); 
			//var dimensions = objectDetailsService.calculateAssetSize(sectionDetails['width'], sectionDetails['height']); 
			objectDetailsService.loadDataAsync(sectionDetails.spreadsheetId, sectionDetails).then(function () {
				$scope.flyers = null;
				console.log("Flyers should be null: ", $scope.flyers);
				console.log("Returned Data from " + sectionDetails.spreadsheetId +
					" " + sectionDetails.title + " ", objectDetailsService.getData());
				$scope.flyers = objectDetailsService.getData();
				console.log("assets: ", $scope.flyers);
			});
		} else {
			$scope.title = "Coming Soon";
		};
	}
}