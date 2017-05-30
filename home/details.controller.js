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

	var values = {};

	$scope.submitForm = function(){
		console.log("submitForm"); 
		canvasSetup(); 
	}

	$scope.download = function(){
		console.log("Downloading...")
		downloadCanvas(); 
	}

   	var canvasSetup = function(){
   		var canvas = $("#canvas")[0];
		console.log(canvas); 
		//var context = canvas.getContext('2d');
		//context.imageSmoothingEnabled = false;
		$.each($('#myForm').serializeArray(), function(i, field) {
		    values[field.name] = field.value;
		});
		var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		resizeCanvas(canvas); ; 
		img.onload = function(){
	         drawImageScaled(values, img, canvas)
	     };
	    img.src = $scope.object.imageLink; 
	    //img.setAttribute('crossOrigin', 'anonymous');
	}

	var drawImageScaled = function(values, img, canvas) {
	   	image_ratio = img.height/img.width; 
	   	//scale_ratio = 2; 
	   	//canvas_width_shld_be = 500; 
	   	// canvas_height_shld_be = image_ratio * canvas_width_shld_be; 
	   	// canvas.style.width = canvas_width_shld_be + "px"; 
	   	// canvas.style.height = canvas_height_shld_be + "px"; 
	   	// canvas.width = canvas_width_shld_be * scale_ratio; 
	   	// canvas.height = canvas_height_shld_be * scale_ratio; 
	   	ctx = canvas.getContext('2d'); 
	   	ctx.scale(scale_ratio, scale_ratio); 
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, canvas.width, canvas.height); 
		console.log("*******" + img.width); 
		console.log("*******" + img.height); 
		console.log("*******" + canvas.width);
		console.log("*******" + canvas.height);

		for(var i = 0; i <  $scope.formInfo.length; i++) {
			field = $scope.formInfo[i]; 
			var fontSize = parseInt(field.fontSize) * 3.5; 
			console.log(fontSize); 
			ctx.font = fontSize.toString() + "pt " + field.font; 
			ctx.fillStyle = field.fontColor; 
			ctx.textAlign = field.textAlign; 
			ctx.lineHeight = ctx.font; 
			canvasWidthRatio = canvas.width
			console.log(canvas.width / 500 ); 
			console.log(canvas.height/ 693);
			positionX = field.positionX * (canvas.width / 500 ); 
			positionY = field.positionY * (canvas.height / 693 ); 
			//positionXY = field.position.split(','); 
			//positionX = positionXY[0] * 4; 
			//positionY = positionXY[1] * 4; 
			console.log(field.fieldName); 
			console.log(values[field.fieldName]); 
			if(values[field.fieldName]){
				ctx.fillText(values[field.fieldName], positionX, positionY)
			}
			else{
				ctx.fillText(field.placeholderText, positionX, positionY)
			}
		}
	}

	var resizeCanvas = function(canvas){
		canvas_width_shld_be= 500; 
		canvas_height_shld_be = 693;
		scale_ratio = 4;  
		//canvas_height_shld_be = image_ratio * canvas_width_shld_be; 
	   	canvas.style.width = canvas_width_shld_be + "px"; 
	   	canvas.style.height = canvas_height_shld_be + "px"; 
	   	canvas.width = canvas_width_shld_be * scale_ratio; 
	   	canvas.height = canvas_height_shld_be * scale_ratio;
	   	ctx = canvas.getContext('2d'); 
	   	ctx.scale(.25, .25);
	   	//ctx.scale(scale_ratio, scale_ratio);  
	}

	var downloadCanvas = function(){
		var canvas = $("#canvas")[0];
		var download = $('#download'); 
		var img    = canvas.toDataURL("image/jpeg"); 
		download.attr("href", img);
		download.attr("download", "flyer.png");
	}

	// var changeResolution = function(canvas, scaleFactor) {
	//     // Set up CSS size if it's not set up already
	//     if (!canvas.style.width)
	//         canvas.style.width = canvas.width + 'px';
	//     if (!canvas.style.height)
	//         canvas.style.height = canvas.height + 'px';

	//     canvas.width = Math.ceil(canvas.width * scaleFactor);
	//     canvas.height = Math.ceil(canvas.height * scaleFactor);
	//     var ctx = canvas.getContext('2d');
	//     ctx.scale(scaleFactor, scaleFactor);
	// }
}