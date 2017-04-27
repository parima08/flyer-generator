var app = angular.module('myApp'); 
app.controller('DetailsController', DetailsController);

DetailsController.$inject = ['$scope', '$routeParams','$location', 'objectDetailsService', 
'spreadsheetIdListing']
function DetailsController($scope, $routeParams, $location, 
	objectDetailsService, spreadsheetIdListing){
	console.log("Details Controller"); 
	var name = $routeParams.name.replace(/_/g, " "); 
	console.log(name); 
	var section = $location.path()
		.replace(/[^/]*$/, "")
		.replace(/\//g, ''); 
	var spreadsheetId = spreadsheetIdListing[section]; 
	console.log(spreadsheetId); 
	objectDetailsService.lookupObjectByNameAsync(spreadsheetId, name)
	.then(function(){
		console.log("loaded"); 				
		console.log(objectDetailsService.getData()); 
		$scope.object = objectDetailsService.getObject(); 
		console.log("object"); 
		console.log($scope.object); 
		objectDetailsService.loadFormInfoAsync(spreadsheetId, $scope.object.worksheetIndex)
		.then(function(){
			$scope.formInfo = objectDetailsService.getFormInfo(); 
			canvasSetup(); 
		});
	}); 

   	var canvasSetup = function(){
   		var canvas = $("#canvas")[0];
		console.log(canvas); 
		var context = canvas.getContext('2d');
		context.imageSmoothingEnabled = false;
		var img = new Image();
		values = {date: "hello", time: "yay", location1: "", location2: "", location3: ""}
		img.onload = function(){
	         drawImageScaled(values, img, context)
	     };
	    img.src = $scope.object.imageLink; 
	}

	var drawImageScaled = function(values, img, ctx) {
	   	var canvas = ctx.canvas ;
	   	image_ratio = img.height/img.width; 
	   	canvas_width_shld_be = 500; 
	   	canvas_height_shld_be = image_ratio * canvas_width_shld_be; 
	   	ctx.canvas.width = canvas_width_shld_be; 
	   	ctx.canvas.height = canvas_height_shld_be; 
		ctx.imageSmoothingEnabled = false;
		ctx.drawImage(img, 0,0, canvas.width, canvas.height)

		for(var i = 0; i <  $scope.formInfo.length; i++) {
			field = $scope.formInfo[i]; 
			ctx.font = field.fontSize + " " + field.font; 
			ctx.fillStyle = field.fontColor; 
			ctx.textAlign = field.textAlign; 
			positionXY = field.position.split(','); 
			positionX = positionXY[0]; 
			positionY = positionXY[1]; 
			ctx.fillText(values[ctx.name], positionX, positionY)
		}
		// //DATE
		// ctx.font = "12pt Noto Serif";
		// ctx.fillStyle = GOLD;
		// ctx.textAlign = "right";
		// ctx.fillText(values[DATE], canvas.width - 212, canvas.height - 212, 400);
	  	
		// //TIMINGS
		// ctx.font = "12pt Noto Serif";
		// ctx.fillStyle = "white"
		// ctx.textAlign = "left";
		// ctx.fillText(values[TIME], canvas.width - 200, canvas.height - 212, 400);

		// //LOCATION1
		// ctx.font = "12pt Noto Serif";
		// ctx.fillStyle = "white"
		// ctx.textAlign = "right";
		// ctx.fillText(values[LOCATION1], canvas.width - 50, canvas.height - 170, 400);
		// //LOCATION2
		// ctx.fillText(values[LOCATION2], canvas.width - 50, canvas.height - 150, 400);

		// //LOCATION3
		// ctx.fillText(values[LOCATION3], canvas.width - 50, canvas.height - 130, 400);


	}
}