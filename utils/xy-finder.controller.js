'use strict'; 
var app = angular.module('myApp')
app.controller("XyCoordController", XyCoordController); 

XyCoordController.$inject = ['$scope', '$rootScope', 'subpageDetails', 'objectDetailsService']; 

function XyCoordController($scope, $rootScope, subpageDetails, objectDetailsService){
	console.log("XyCoodController"); 
	$scope.sizeOptionsNames =  Object.keys(subpageDetails); 

	$scope.submitImage = function(){
		console.log("Submitting Image"); 
		var formArray = $('#xyform').serializeArray(); 
		console.log(formArray); 
		var imageLink = formArray[1].value; 
		console.log(formArray[0]['name']); 
		var typeOfFile = formArray[0]['value'];
		var fileWidth = subpageDetails[typeOfFile].width; 
		var fileHeight = subpageDetails[typeOfFile].height;
		var dimensions = objectDetailsService.calculateAssetSize(fileWidth, fileHeight); 
		$('.imageFindXy').width(dimensions.canvasWidth); 
		// if(typeOfFile == "banner"){
		// 	$('.imageFindXy').width(834); 
		// }
		// else{
		// 	//assumes that it is a flyer
		// 	$('.imageFindXy').width(500)
		// }
		console.log(imageLink); 
		console.log(typeOfFile); 
		var img = new Image(); 
		img.src = imageLink; 
		$('.imageFindXy').append(img); 
		//var topOffset = $('.imageFindXy img').offset().top; 
		//console.log(topOffset); 
		//var rectDimensions = $('.imageFindXy img').getBoundingClientRect();
		var topOffset = $('.imageFindXy img').offset().top
		$('.imageFindXy img').on("mousemove", function(e){
			//console.log("x: " + e.clientX, "y: " + e.clientY)
			//console.log(e); 
			var yCoords = e.pageY - topOffset; 
			$('.imageCoords').html("<h1>x: " + e.pageX +  " y: " + yCoords + "</h1>"); 
		}); 
	}

	
}