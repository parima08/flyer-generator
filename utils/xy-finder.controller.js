'use strict'; 
var app = angular.module('myApp')
app.controller("XyCoordController", XyCoordController); 

XyCoordController.$inject = ['$scope', '$rootScope']; 

function XyCoordController($scope){
	console.log("XyCoodController"); 
	$scope.submitImage = function(){
		console.log("Submitting Image"); 
		var imageLink = $('#xyform').serializeArray()[0].value
		console.log(imageLink); 
		var img = new Image(); 
		img.src = imageLink; 
		$('.imageFindXy').append(img); 
		$('.imageFindXy img').on("mousemove", function(e){
			console.log("x: " + e.clientX, "y: " + e.clientY)
			$('.imageCoords').html("<h1>x: " + e.clientX +  "y: " + e.clientY + "</h1>"); 
		}); 
	}

	
}