var app = angular.module('myApp'); 
app.controller('DetailsController', DetailsController);

DetailsController.$inject = ['$scope', '$routeParams','$location', 
					'objectDetailsService', 'subpageDetails', '$q']; 
function DetailsController($scope, $routeParams, $location, 
objectDetailsService, subpageDetails, $q){
	console.log("Details Controller"); 
	var option2 = false;
	$scope.convertInvitationPDF = false; 
	var name = $routeParams.name.replace(/_/g, " "); 
	console.log(name);
	if(name.includes("1")){
		option2 = true; 
		name = name.replace("1", "").trim();  
	}
	console.log(name); 
	var section = $location.path()
		.replace(/[^/]*$/, " ")
		.replace(/\//g, ''); 
	section = camelize(section).replace(/-/g, ""); 

	if(section==="invitations"){
		$scope.convertInvitationPDF = true; 
	}

	$scope.pageDetails = subpageDetails["/" + section]; 
	$scope.pageDetails.name = name; 
	//if the page is loading Logos on the page, we can pull supported countries
	//from ehre
	$scope.supportedLogoCountries = ["General", "USA", "Canada", "UK"]
	
	

	var spreadsheetId = $scope.pageDetails.spreadsheetId; 
	var dimensions = objectDetailsService.calculateAssetSize($scope.pageDetails['width'], $scope.pageDetails['height']); 
	$scope.pageDetails['thumbnailHeight'] = dimensions.thumbnailHeight;
	$scope.pageDetails['thumbnailWidth'] = dimensions.thumbnailWidth;
	$scope.pageDetails['canvasHeight'] = dimensions.canvasHeight; 
	$scope.pageDetails['canvasWidth'] = dimensions.canvasWidth; 
	//var radioOptions = pageDetails[section]['radioOptions'];
	console.log(spreadsheetId); 
	objectDetailsService.lookupObjectByNameAsync(spreadsheetId, name, 
												$scope.pageDetails.thumbnailWidth, 
												$scope.pageDetails.thumbnailHeight) 
	.then(function(){
		console.log("loaded"); 				
		console.log(objectDetailsService.getData()); 
		$scope.object = objectDetailsService.getObject(); 
		console.log("object"); 
		console.log($scope.object); 
		if(option2 == true){
			$scope.object.imageLink = $scope.object.secondaryImageLink; 
			$scope.object.worksheetIndex = $scope.object.secondaryWorksheetIndex; 
		}
		$scope.language = $scope.object.language; 
		objectDetailsService.loadFormInfoAsync(spreadsheetId, $scope.object.worksheetIndex)
		.then(function(){
			$scope.formInfo = objectDetailsService.getFormInfo(); 
			$scope.font = $scope.formInfo; 
			var fonts = $scope.formInfo.map(function(d) { return d['font']; });
			$scope.fonts = fonts.filter(onlyUnique); 
			loadFonts($scope.fonts);
			console.log("FORM INFO" + $scope.formInfo.length); 
			if($scope.language != ""){
				loadTransliteration(); 
			}
			canvasSetup(); 

			// var second_canvas = $('#second_canvas')[0];
			// var second_ctx = second_canvas.getContext('2d');
			$('.canvas-container').height($scope.pageDetails.canvasHeight); 
			// second_ctx.width = $scope.pageDetails.canvasWidth; 
			// second_ctx.height = $scope.pageDetails.canvasHeight; 
			// second_ctx.scale(2, 2); 
			// second_ctx.fillText("HELLO", 100, 100);
			//second_ctx.setTransform(2, 0, 0, 2, 0, 0);
			//var second_canvas = document.getElementById('second_canvas');
			

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
	   	ctx = canvas.getContext('2d'); 
		ctx.imageSmoothingEnabled = true;
		var image_width = img.width; 
		var image_height = img.height; 
		//ctx.setTransform(2, 0, 0, 2, 0, 0);
		ctx.drawImage(img, 0,0, image_width, image_height, 0, 0, canvas.width, canvas.height); 
		ctx.scale($scope.pageDetails.scale, $scope.pageDetails.scale); 
		
		loadFont($scope.formInfo[0].font).then(function(){
			for(var i = 0; i <  $scope.formInfo.length; i++) {
				console.log("fieldNumber: " + i + "/" + $scope.formInfo.length); 
				field = $scope.formInfo[i]; 
				console.log("THE SCALE FACTOR IS: "); 
				console.log(canvas.width / $scope.pageDetails.canvasWidth ); 
				console.log(canvas.height/ $scope.pageDetails.canvasHeight);
				positionX = field.positionX; //* $scope.pageDetails.scale; 
				positionY = field.positionY; //* $scope.pageDetails.scale * 1.05;
				//positionX = field.positionX * (canvas.width / $scope.pageDetails.canvasWidth ); 
				//positionY = field.positionY * (canvas.height/ $scope.pageDetails.canvasHeight ); 
				console.log("fieldId: " + field.id); 
				if(field.id == "srmd_logo"){
					addSrmdLogoToCanvas(ctx, field.id, positionX, positionY); 
					continue; 
				}
				if(field.id == "upload_logo"){
					//console.log("upload_logo: " + field.value); 
					src = $("img.upload_logo").attr('src');
					addLogoToCanvas(ctx, src , positionX, positionY); 
					continue; 
				}

				//TBD: LOAD FONTS DYNAMICALLY - FROM GOOGLE FONTS 
				

				var fontSize = parseInt(field.fontSize); //* $scope.pageDetails.scale; 
				var fontWeight = field.fontWeight; 
				console.log(fontSize); 
				ctx.font = fontWeight.toString() + " " + fontSize.toString() + "pt " + field.font;

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
		});
	}

	var resizeCanvas = function(canvas){
		canvas_width_shld_be= $scope.pageDetails.canvasWidth; 
		canvas_height_shld_be = $scope.pageDetails.canvasHeight;
		scale_ratio =  $scope.pageDetails.scale || 10;  
		//canvas_height_shld_be = image_ratio * canvas_width_shld_be; 
	   	canvas.style.width = canvas_width_shld_be + "px"; 
	   	canvas.style.height = canvas_height_shld_be + "px"; 
	   	scaled_width = canvas_width_shld_be * (scale_ratio); 
	   	scaled_height = canvas_height_shld_be * (scale_ratio); 
	   	canvas.width = scaled_width ; 
	   	canvas.height = scaled_height;
	   	ctx = canvas.getContext('2d')
	   	//ctx.scale(6, 6); 
	   	//scaleFactor = dpi / 96;
	   	//ctx.scale((1/6), (1/6));
	   	//ctx.scale(scale_ratio, scale_ratio);  
	}

	var downloadCanvas = function(){
		var canvas = $("#canvas")[0];
		//var ctx = canvas.getContext('2d');
		var download = $('#download'); 
		if($scope.convertInvitationPDF == true){
			var imgData = canvas.toDataURL("image/jpeg");
			console.log("I get here");
			var pdf = new jsPDF({format: [996, 680]});
			pdf.internal.scaleFactor = 4;
			var canvasScale = $scope.pageDetails.scale/2
			pdf.addImage(imgData, 'PNG', 0, 0, 
				$scope.pageDetails.canvasWidth * canvasScale,
			 	$scope.pageDetails.canvasHeight * canvasScale);
			pdf.addPage(); 
			pdf.addImage(imgData, 'PNG', (
				$scope.pageDetails.canvasWidth * -.5) - 30, 0, 
				$scope.pageDetails.canvasWidth * canvasScale,
			 	$scope.pageDetails.canvasHeight * canvasScale);
			pdf.save($scope.pageDetails.name + ".pdf")
			var a = document.createElement("a");
			a.target = "_blank";
		    a.href = pdf.output('datauri');
		    a.setAttribute("download", $scope.pageDetails.name);
		    //a.click();

			//download.attr("href", pdf.output('datauri'));
		}
		else{
			var download = $('#download');
			
			// var second_canvas = document.getElementById('second_canvas');
			// var second_ctx = second_canvas.getContext('2d'); 
			// second_ctx.scale($scope.pageDetails.scale, $scope.pageDetails.scale);
			// var ctx = canvas.getContext('2d');
			// ctx.drawImage(second_canvas, 0, 0);
			
			// var third_canvas =  $('#third_canvas')[0];
			// var third_ctx = third_canvas.getContext('2d');
			// third_ctx.width = $scope.pageDetails.canvasWidth; 
			// third_ctx.height = $scope.pageDetails.canvasHeight; 
			// third_ctx.style.width = 
			// third_ctx.drawImage(canvas, 0, 0); 
			// third_ctx.drawImage(second_canvas, 0, 0); 

			canvas.toBlob(function(blob) {
				var url = URL.createObjectURL(blob);
				var link = document.createElement("a");
				link.href = url; 
				console.log("the URL HAS BEEN CREATED: " + url); 
				//download.attr("href", url);
				//download.attr("download", "flyer.jpeg");
		// Set to whatever file name you want
				console.log("DOWNLOADING"); 
			    link.setAttribute("download", $scope.pageDetails.name);
			    link.click(); 
			}, 'image/jpeg');

		}
	}

	var loadTransliteration = function(){
		if($scope.language !== "english"){
			google.load("elements", "1", {
	    		packages: "transliteration",
	    		callback: onLoad
			});
		}
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
        	destinationLanguage = google.elements.transliteration.LanguageCode.ENGLISH; 
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
    		ctx.drawImage(srmdLogo, x, y, 69, 80);
    	}; 
    	switch($("input[name='srmd_logo']:checked").val()){
    		case $scope.supportedLogoCountries[1]:
    			srmdLogo.src = "../img/logos/srmd_general_eng.png"
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

    var addLogoToCanvas = function(ctx, src, x, y){
    	logo = new Image(); 
    	console.log("Adding Logo to the Canvas");
    	//CHANGE THE DIMENSIONS OF THE UPLOADED LOGO
    	logo.onload = function(){
    		ctx.drawImage(logo, x, y, 235, 270);
    	};
    	logo.src = src; 
    }

    var loadFont = function(font){
    	var deffered = $q.defer(); 
    	console.log("THE FONT IS: " + font); 
		var loadFont = function(font) {
		  WebFont.load({
		    google: {
		      families: [font]
		    }
		  });
		};
    	deffered.resolve(); 
    	return deffered.promise; 
    }

    function loadFonts(fonts){
	 console.log("FONTS ARE: " + fonts); 
	 WebFont.load({
	    google: { 
	      families: fonts 
	    }
	 });    
    }

    function onlyUnique(value, index, self) { 
	    return self.indexOf(value) === index;
	}

 //    function setDPI(canvas, dpi) {
 //    // Set up CSS size.
	//     canvas.style.width = canvas.style.width || canvas.width + 'px';
	//     canvas.style.height = canvas.style.height || canvas.height + 'px';

	//     // Get size information.
	//     var scaleFactor = dpi / 96;
	//     var width = parseFloat(canvas.style.width);
	//     var height = parseFloat(canvas.style.height);

	//     // Backup the canvas contents.
	//     var oldScale = canvas.width / width;
	//     var backupScale = scaleFactor / oldScale;
	//     var backup = canvas.cloneNode(false);
	//     backup.getContext('2d').drawImage(canvas, 0, 0);

	//     // Resize the canvas.
	//     var ctx = canvas.getContext('2d');
	//     canvas.width = Math.ceil(width * scaleFactor);
	//     canvas.height = Math.ceil(height * scaleFactor);

	//     // Redraw the canvas image and scale future draws.
	//     ctx.setTransform(backupScale, 0, 0, backupScale, 0, 0);
	//     ctx.drawImage(backup, 0, 0);
	//     ctx.setTransform(scaleFactor, 0, 0, scaleFactor, 0, 0);
	// }


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
