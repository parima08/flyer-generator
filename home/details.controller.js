var app = angular.module('myApp'); 
app.controller('DetailsController', DetailsController);

DetailsController.$inject = ['$scope', '$routeParams','$location', 
					'objectDetailsService', 'pageDetails']; 
function DetailsController($scope, $routeParams, $location, 
	objectDetailsService, pageDetails){
	console.log("Details Controller"); 
	var name = $routeParams.name.replace(/_/g, " "); 
	console.log(name); 
	var section = $location.path()
		.replace(/[^/]*$/, " ")
		.replace(/\//g, ''); 
	section = camelize(section).replace(/-/g, ""); 
	$scope.pageDetails = pageDetails[section]; 

	//if the page is loading Logos on the page, we can pull supported countries
	//from ehre
	$scope.supportedLogoCountries = ["General", "USA", "Canada", "UK"]
	var spreadsheetId = pageDetails[section]['spreadsheetId']; 
	var thumbnailWidth = pageDetails[section]['thumbnailWidth']; 
	var thumbnailHeight = pageDetails[section]['thumbnailHeight']; 
	//var radioOptions = pageDetails[section]['radioOptions'];
	console.log(spreadsheetId); 
	objectDetailsService.lookupObjectByNameAsync(spreadsheetId, name, thumbnailWidth, thumbnailHeight)
	.then(function(){
		console.log("loaded"); 				
		console.log(objectDetailsService.getData()); 
		$scope.object = objectDetailsService.getObject(); 
		console.log("object"); 
		console.log($scope.object); 
		$scope.language = $scope.object.language; 
		objectDetailsService.loadFormInfoAsync(spreadsheetId, $scope.object.worksheetIndex)
		.then(function(){
			$scope.formInfo = objectDetailsService.getFormInfo(); 
			if($scope.language != ""){
				loadTransliteration(); 
			}
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

	$scope.openSidebar = function($event){
		if($('.sidebar-form').hasClass("sidebar-open")){
			$('.sidebar-form').removeClass("sidebar-open"); 
			$('.pusher').removeClass("sidebar-open"); 
		}
		else{
			$('.sidebar-form').addClass("sidebar-open"); 
			$('.pusher').addClass("sidebar-open"); 
		}
    }

    function camelize(str) {
	  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
	    if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
	    return index == 0 ? match.toLowerCase() : match.toUpperCase();
	  });
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
			console.log(canvas.width / $scope.pageDetails.canvasWidth ); 
			console.log(canvas.height/ $scope.pageDetails.canvasHeight);
			positionX = field.positionX * (canvas.width / $scope.pageDetails.canvasWidth ); 
			positionY = field.positionY * (canvas.height/ $scope.pageDetails.canvasHeight ); 

			if(field.id == "srmd_logo"){
				addSrmdLogoToCanvas(ctx, field.id, positionX, positionY); 
				break; 
			}
			if(field.id == "upload_logo"){
				addLogoToCanvas(ctx, "blah", positionX, positionY); 
				break; 
			}

			var fontSize = parseInt(field.fontSize) * 3.5; 
			var fontWeight = field.fontWeight; 
			console.log(fontSize); 
			ctx.font = fontWeight.toString() + " " + fontSize.toString() + "pt " + field.font;
			//TBD: LOAD FONTS DYNAMICALLY - FROM GOOGLE FONTS 
			ctx.fillStyle = field.fontColor; 
			ctx.textAlign = field.textAlign; 
			ctx.lineHeight = ctx.font; 
			ctx.letterSpacing = field.letterSpacing + "px";
			console.log("letterspacing: " + field.letterSpacing); 
			console.log(field.fieldName); 
			console.log(values[field.fieldName]); 


			//if the field name is COUNTRY/RADIO remove it from the list
			//and add it to the end. 
			//or maybe we can do the country by the type of file? - if it's a flyer


			if(values[field.fieldName]){
				var text; 
				// if(field.ad ditionalRequiredText){
				// 	text = field.additionalRequiredText + values[field.fieldName]
				// }
				// else{
				// 	text = values[field.fieldName]
				// }
				ctx.fillText(values[field.fieldName], positionX, positionY)
			}
			else{
				ctx.fillText(field.placeholderText, positionX, positionY)
			}
		}
	}

	var resizeCanvas = function(canvas){
		canvas_width_shld_be= $scope.pageDetails.canvasWidth; 
		canvas_height_shld_be = $scope.pageDetails.canvasHeight;
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

	var loadTransliteration = function(){
		google.load("elements", "1", {
    	packages: "transliteration",
    	callback: onLoad
		});
	}

	var onLoad = function() {
        console.log("Onload"); 
        var destinationLanguage; 
        if($scope.language ==="Gujarati"){
        	destinationLanguage = google.elements.transliteration.LanguageCode.GUJARATI;
        }
        else if ($scope.language === "Hindi"){
        	destinationLanguage = google.elements.transliteration.LanguageCode.HINDI; 
        }
        else{
        	destinationLanguage = ""; 
        }

        var options = {
            sourceLanguage:
                google.elements.transliteration.LanguageCode.ENGLISH,
            destinationLanguage:
                [destinationLanguage],
            shortcutKey: 'ctrl+g',
            transliterationEnabled: true
        };
 
        // Create an instance on TransliterationControl with the required
        // options.
        var control =
            new google.elements.transliteration.TransliterationControl(options);
 		
 		var arrayOfIds = []; 
 		for(var i = 0; i < $scope.formInfo.length; i++){
 			//arrayOfIds.push($scope.formInfo[i].fieldName.toLowerCase().replace(/ /g,"_").toString());
 			arrayOfIds.push($scope.formInfo[i].id);; 
 		}
 		console.log("arrayOfIds: " + arrayOfIds.toString()); 
 		console.log(arrayOfIds); 
        // Enable transliteration in the textbox with id
        // 'transliterateTextarea'.
        //control.makeTransliteratable(arrayOfIds);
        // Enable transliteration in the textbox with id
        // 'transliterateTextarea'.
      
  		control.makeTransliteratable(arrayOfIds);
    }

    var addSrmdLogoToCanvas = function(ctx, fieldId, x, y){
    	//RESIZE THE IMAGE
    	var srmdLogo = new Image(); 
    	console.log("ADDED SRMD LOGO"); 
    	srmdLogo.onload = function(){
    		ctx.drawImage(srmdLogo, x, y, 235, 270);
    	}; 
    	switch($("input[name='srmd_logo']:checked").val()){
    		case $scope.supportedLogoCountries[1]:
    			srmdLogo.src = "../img/logos/srmd_usa.png"
    			break; 
    		case $scope.supportedLogoCountries[2]:
    			srmdLogo.src = "../img/logos/srmd_canada.png"
    			break; 
    		case $scope.supportedLogoCountries[3]: 
    			srmdLogo.src = "../img/logos/srmd_uk.png"
    			break; 
    		case $scope.supportedLogoCountries[0]: 
    		default: 
    			srmdLogo.src = "../img/logos/srmd_usa.png"
    			break; 
    	}
    	console.log(srmdLogo.src); 
    	console.log("End of drawing the logo!"); 
    }

    var addLogoToCanvas = function(ctx, imageFile, x, y){
    	logo = new Image(); 
    	console.log("Adding Logo to the Canvas"); 
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
};
