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
		//var topOffset = $('.imageFindXy img').offset().top; 
		//console.log(topOffset); 
		$('.imageFindXy img').on("mousemove", function(e){
			//console.log("x: " + e.clientX, "y: " + e.clientY)
			//console.log(e); 
			var yCoords = e.pageY - 166; 
			$('.imageCoords').html("<h1>x: " + e.pageX +  " y: " + yCoords + "</h1>"); 
		}); 
	}

	
}