var app = angular.module('myApp'); 
app.controller('DetailsController', DetailsController);

DetailsController.$inject = ['$scope', '$routeParams','$location', 
					'objectDetailsService', 'subpageDetails', '$http', '$sce']; 
function DetailsController($scope, $routeParams, $location, 
objectDetailsService, subpageDetails, $http, $sce){
	console.log("Details Controller"); 
	var option2 = false;
	$scope.convertInvitationPDF = false; 
	var name = $routeParams.name.replace(/_/g, " "); 
	console.log(name);
	if(name.slice(-1) == "1"){
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
	// $scope.supportedLogoCountries = [
	// 			{"country": "General", "vertical": , "horizontal":}, 
	// 			{"country": "USA", "vertical": , "horizontal":}, 
	// 			{"country": "UK", "vertical": , "horizontal":}, 
	// 			{"country": "Canada", "vertical": , "horizontal":}, 
	// 			{"country": "General", "vertical": , "horizontal":}, 
	// 			{"country": "General", "vertical": , "horizontal":}, 
	// 			{"USA", "Canada", "UK", 
	// 				"Hong Kong", "Australia", "Singapore"]
	
	$scope.supportedLogos = {
		"Australia" : 	{"vertical": "srmd_australia.png", 
						"horizontal":"australiaHorizontalLogo.png" },
		"Canada" :  	{"vertical": "srmd_canada.png", 
						"horizontal":"canadaHorizontalLogo.png" },
		"Hong Kong" : 	{"vertical": "srmd_hongKong.png", 
						"horizontal":"hongKongHorizontalLogo.png" },
		"Singapore" : 	{"vertical": "srmd_singapore.png", 
						"horizontal": "singaporeHorizontalLogo.png" },
		"USA" : 		{"vertical": "srmd_usa.png", 
						"horizontal": "usaHorizontalLogo.png" },
		"UK" : 			{"vertical": "srmd_uk.png", 
						"horizontal": "ukHorizontalLogo.png" },
		"General" : {"vertical": "srmd_general_eng.png",  
					"gujaratiVertical":"srmd_general_guj.png", 
					"hindiVertical": "srmd_general_hindi.png",
					"horizontal":"generalHorizontalLogo.png",
					"gujaratiHorizontal": "gujaratiHorizontalLogo.png", 
					"hindiHorizontal": "hindiHorizontalLogo.png"},
	};
	$scope.supportedLogoCountries = Object.keys($scope.supportedLogos);
	
	$scope.swamivatsalyaTextLanguage = {
		"gujarati": {
			"Lunch": "પ્રવચન પછી સ્વામિવાત્સલ્યનો લાભ લેવા વિનંતી",
			"Dinner": "પ્રવચન પહેલા સ્વામિવાત્સલ્યનો લાભ લેવા વિનંતી",
		},
		"hindi": {
			"Lunch": "प्रवचन के पश्चात कृपया स्वामीवात्सल्य का लाभ लिजिएगा",
			"Dinner": "प्रवचन के पूर्व कृपया स्वामीवात्सल्य का लाभ लिजिएगा",
		},
		"english": {
			"Lunch": "Swamivatsalya (Lunch) has been arranged from", 
			"Dinner":"Swamivatsalya (Dinner) has been arranged from",
		}
	}

	
	

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
		console.log("*************The Object Details are: "); 				
		console.log(objectDetailsService.getData()); 
		$scope.object = objectDetailsService.getObject(); 
		console.log($scope.object); 
		if(option2 == true){
			$scope.object.imageLink = $scope.object.secondaryImageLink; 
			$scope.object.worksheetIndex = $scope.object.secondaryWorksheetIndex; 
		}
		$scope.language = $scope.object.language; 
		//$scope.swamivatsalyaText = $scope.swamivatsalyaTextLanguage[$scope.language];
		objectDetailsService.loadFormInfoAsync(spreadsheetId, $scope.object.worksheetIndex)
		.then(function(){
			$scope.formInfo = objectDetailsService.getFormInfo(); 
			$scope.font = $scope.formInfo; 
			var fonts = $scope.formInfo.map(function(d) { return d['font'].trim(); });
			$scope.fonts = fonts.filter(onlyUnique); 
			loadFonts($scope.fonts);
			console.log("FORM INFO" + $scope.formInfo.length); 
			if($scope.language != "" && $scope.language != "english"){
				loadTransliteration(); 
			}
			canvasSetup(); 
			$('.canvas-container').height($scope.pageDetails.canvasHeight); 
			$('#progress_bar').height($scope.pageDetails.canvasHeight)
								.width($scope.pageDetails.canvasWidth);
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
   		startProgressBar(); 
   		var canvas = $("#canvas")[0];
		console.log(canvas); 
		$.each($('#myForm').serializeArray(), function(i, field) {
		    values[field.name] = field.value;
		});
		var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		resizeCanvas(canvas); 
		img.onload = function(){
			drawImageScaled(values, img, canvas)
			console.log("Image onload function")
	         
	     };
	    img.backgroundLoad($scope.object.imageLink);
	    //img.src = $scope.object.imageLink;
	}

	var drawImageScaled = function(values, img, canvas) { 
	   	ctx = canvas.getContext('2d'); 
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(img, 0,0, img.width, img.height, 0, 0, canvas.width, canvas.height); 
		ctx.scale($scope.pageDetails.scale, $scope.pageDetails.scale);
		console.log("*******************"); 
		console.log($scope.formInfo); 
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
				if(field.id == "srmd_logo" || field.id == "srmd_horizontal_logo"){
					addSrmdLogoToCanvas(ctx, field, positionX, positionY); 
					continue; 
				}
				if(field.id == "upload_logo"){
					//console.log("upload_logo: " + field.value); 
					src = $("img.upload_logo").attr('src');
					if(src){
						addLogoToCanvas(ctx, src , positionX, positionY); 
						continue; 
					}
				}
				if(field.id == "swamivatsalya"){
					//ctx.fillText("प्रवचन के पश्चात कृपया स्वामीवात्सल्य का लाभ लिजिएगा", 10, 10);
					var key = $('input[name="swamivatsalya"]:checked').val()
					var swamiText = $scope.swamivatsalyaTextLanguage[$scope.language][key];
					if(swamiText && ($scope.language === "english")){
						var startTime = $('#swamivatsalya_startTiming_' + key).val() || "12pm";; 
						var endTime = $('#swamivatsalya_endTiming_' + key).val() || "2pm";; 
						swamiText = swamiText + " " + startTime + " to " +  endTime; 	
					}
					//var startTime = 
					//var endTime = $('#swamivatsalya_endTiming').val() || "1pm";
					values[field.fieldName] = swamiText;
					//"प्रवचन के पश्चात कृपया स्वामीवात्सल्य का लाभ लिजिएगा"
					//values[field.fieldName] = beginningText + " " + startTime + " to " +  endTime; 	
					//values['blah'] = blah; 
				}
				var fontSize = parseInt(field.fontSize); //* $scope.pageDetails.scale; 
				var fontWeight = field.fontWeight; 
				console.log(fontSize); 
				ctx.font = fontWeight.toString() + " " + fontSize.toString() + "pt " + field.font;

				ctx.fillStyle = field.fontColor; 
				ctx.textAlign = field.textAlign; 
				ctx.lineHeight = ctx.font; 
				ctx.letterSpacing = field.letterSpacing + "px";
				console.log("letterspacing: " + field.letterSpacing); 
				//console.log(field.fieldName); 
				//console.log(values[field.fieldName]);

				if(field.endPositionX){
					console.log("it has an endPositionX"); 
					var endPositionX = field.endPositionX; 
					var width = Math.abs(positionX - endPositionX); 
					if(values[field.fieldName]){
						ctx.fillText(values[field.fieldName], positionX, positionY, width);
					}
					else{
						ctx.fillText(field.placeholderText, positionX, positionY, width);
					}
				}
				else{
					if(values[field.fieldName]){
						ctx.fillText(values[field.fieldName], positionX, positionY);
					}
					else{
						ctx.fillText(field.placeholderText, positionX, positionY);
					}
				}

				
			}

			completeProgressBar();

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
	}

	var downloadCanvas = function(){
		var canvas = $("#canvas")[0];
		//var ctx = canvas.getContext('2d');
		var download = $('#download'); 
		if($scope.convertInvitationPDF == true){
			var imgData = canvas.toDataURL("image/jpeg");
			console.log("I get here");
			var pdf = new jsPDF({format: [1000, 633]});
			pdf.internal.scaleFactor = 4;
			var canvasScale = $scope.pageDetails.scale/2
			pdf.addImage(imgData, 'PNG', 0, 0, 
				$scope.pageDetails.canvasWidth * canvasScale,
			 	$scope.pageDetails.canvasHeight * canvasScale);
			pdf.addPage(); 
			pdf.addImage(imgData, 'PNG', (
				$scope.pageDetails.canvasWidth * -1) - 110, 0, 
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
				addFileToGoogleDrive(blob);
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
		console.log("LOADING ANOTHER LANGUAGE")
		google.load("elements", "1", {
    		packages: "transliteration",
    		callback: onLoadLanguage
		});
	}

	var onLoadLanguage = function() {
        console.log("Onload"); 
        var destinationLanguage; 
        if($scope.language == "gujarati"){
        	destinationLanguage = google.elements.transliteration.LanguageCode.GUJARATI;
        }
        else if ($scope.language ==  "hindi"){
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
  		control.makeTransliteratable(arrayOfIds);
    }

    var addSrmdLogoToCanvas = function(ctx, field, x, y){
    	//RESIZE THE IMAGE
    	var srmdLogo = new Image(); 
    	console.log("ADDED SRMD LOGO"); 
    	console.log("THIS CHANGED"); 
    	console.log(field.id + " placeholder: " + field.placeholderText)
    	var width, height; 
    	if($scope.convertInvitationPDF){
    		if($scope.language == "hindi"){
    			width = 100; 
    			height = 58; 
	    	}
	    	else if ($scope.language == "gujarati"){
	    		console.log("GUJARATI: width: " + width + "height: " + height)
	    		width = 100; 
	    		height = 78;
	    	}
	    	else{
	    		width = 150; 
	    		height = 44; 
	    	}
    	}
    	else{
    		if($scope.language == "hindi"){
	    		width = 120; 
	    		height = 70; 
	    	}
	    	else if ($scope.language == "gujarati"){
	    		console.log("GUJARATI: width: " + width + "height: " + height)
	    		width = 120; 
	    		height = 70;
	    	}
	    	else{
	    		width = 207; 
	    		height = 60; 
	    	}
    	}
    	

    	srmdLogo.onload = function(){
    		if(field.placeholderText == "horizontal"){
				ctx.drawImage(srmdLogo, x, y, width, height);

    		}
    		else{
    			ctx.drawImage(srmdLogo, x, y, 69, 80);
    		}		
    	};
    	var src = ""
    	if($scope.language == "hindi"){
    		src =  (field.placeholderText == "horizontal")? $scope.supportedLogos["General"].hindiHorizontal : $scope.supportedLogos["General"].hindiVertical;		
    	}
    	else if($scope.language == "gujarati"){
    		src = (field.placeholderText == "horizontal")? $scope.supportedLogos["General"].gujaratiHorizontal : $scope.supportedLogos["General"].gujaratiVertical;
    	}
    	else{
    		console.log(field.id);
    		var country = $("input[name='"+ field.id +"']:checked").val(); 
    		if(country){
    			var srcs = $scope.supportedLogos[country]; 		
    			src = (field.placeholderText == "horizontal")? srcs.horizontal : srcs.vertical;
    		}
    		else{
    			srcs = $scope.supportedLogos["General"];
    			src = (field.placeholderText == "horizontal")? srcs.horizontal : srcs.vertical;
    		}
    	}
    	srmdLogo.src = "../img/logos/" + src
    	console.log(srmdLogo.src); 
    	console.log("End of drawing the logo!"); 
    }

    var addLogoToCanvas = function(ctx, src, x, y){
    	logo = new Image(); 
    	console.log("Adding Logo to the Canvas");
    	//CHANGE THE DIMENSIONS OF THE UPLOADED LOGO
    	logo.onload = function(){
    		ctx.drawImage(logo, x, y, 60, 60);
    	};
    	logo.src = src; 
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

	Image.prototype.backgroundLoad = function(url){
        var thisImg = this;
        var xmlHTTP = new XMLHttpRequest();
        //var oldPercentage = 0
        xmlHTTP.open('GET', url,true);
        xmlHTTP.responseType = 'arraybuffer';
        xmlHTTP.onload = function(e) { 
        	console.log("Finished loading the object here");
            var blob = new Blob([this.response]);
            thisImg.src = window.URL.createObjectURL(blob);
        };
        xmlHTTP.onprogress = function(e) {
            
            thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
        	var percentage = (thisImg.completedPercentage-10) + "%"
        	updateProgressBar(percentage);
        	console.log("#######" +  thisImg.completedPercentage);
        };
        xmlHTTP.onloadstart = function() {
            console.log("#######STARTING" );
            //$('#progress_bar .progress .progress-bar').attr('aria-valuenow', 0);
            //$('#progress_bar .progress .progress-bar').style.width = "0%";
            thisImg.completedPercentage = 0;
        };
        xmlHTTP.send();
    };

    Image.prototype.completedPercentage = 0;

    function updateProgressBar(percentage){
    	$('#progress_bar .progress .progress-bar').width(percentage);
    }

    function completeProgressBar(){
    	$('#progress_bar .progress .progress-bar').width("100%");
    	$('#progress_bar').hide(); 
    }

    function startProgressBar(){
    	$('#progress_bar').show(); 
    }

    // function addFileToGoogleDrive(blob){
    	
    // 	var baseURL = "https://docs.google.com/forms/u/7/d/e/1FAIpQLSdd8CruVCXXMDiq-WxI0LWfba46D_AxcDcIv1A1uWKBmbR_bg/formResponse?"; 
    // 	//var submitRef = "&submit=7948761085603042000"
    // 	var submitRef = "&submit=6722382392673483684"
    // 	var nameField = "entry.141331330";
    // 	var emailField = "entry.124033596";
    // 	var fileField = "entry.109833877";	

    // 	var submitURL = baseURL +  nameField + "=" + "parima" + "&" +
				// 				   emailField + "=" + "parima08@gmail.com" + "&" +
				// 				   fileField + "=" + blob + "&" +
				// 				   submitRef;

    //     var form = $(document.body).append(form);
    //     form.action = submitURL; 
    //     form.submit();
    //     //xmlHTTP.open('POST', submitURL, true);

    // 	////////////////////

    	
    // }

    function addFileToGoogleDrive(file){
      var reader = new FileReader(); 
      reader.onload = function(evt) {
	    console.log("About to send the file");
	    sendFileToGoogleDrive(evt.target.result);
	  };
	  reader.readAsBinaryString(file);
    }
    
    function sendFileToGoogleDrive(file){
    	console.log("addFileToGoogleDrive 1");
    	var url = "https://script.google.com/a/shrimadrajchandramission.com/macros/s/AKfycbxrRdFQUlYGaWbtC20EmDWUezCb6xyI0LRUZtOov2WFgqZx1peO/exec"
    	console.log(file);
    	var data = $.param({
            fileName: $scope.pageDetails.name,
            file: file
        });
        //file: file
            var config = {
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            }
            console.log("About to send the request")
            $http.post(url, data, config)
            .then(function(){
            	console.log("returned from posting");
            	console.log(data);
            });
        };
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
//};
