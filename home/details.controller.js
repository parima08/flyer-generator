var app = angular.module('myApp');
app.controller('DetailsController', DetailsController);

DetailsController.$inject = ['$scope', '$routeParams', '$location',
	'objectDetailsService', 'subpageDetails', '$http', '$sce', '$q', '$rootScope'];
function DetailsController($scope, $routeParams, $location,
	objectDetailsService, subpageDetails, $http, $sce, $q, $rootScope) {
	console.log("Details Controller");
	var option2 = false;
	$scope.convertInvitationPDF = false;
	var name = $routeParams.name.replace(/_/g, " ");
	if (name.slice(-1) == "1") {
		option2 = true;
		name = name.slice(0, name.lastIndexOf("1")).trim();
	}
	console.log("DetailsController: Asset Name ", name);
	var section = $location.path()
		.replace(/[^/]*$/, " ")
		.replace(/\//g, '');
	section = camelize(section).replace(/-/g, "");

	if (section === "invitations" || section === "invitations6x6") {
		$scope.convertInvitationPDF = true;
		$scope.pdf6x6 = false;
		if (section === "invitations6x6") {
			$scope.pdf6x6 = true;
		}
	}

	$scope.pageDetails = subpageDetails["/" + section];
	$scope.pageDetails.name = name;

	$scope.supportedLogoCountries = ["General"]

	let logo_sizes = {
		"vertical": {
			"w": 69, "h": 80,
			"pdfw": 60, "pdfh": 70,
			'gujw': 60, "gujh": 70,
			'hindiw': 60, "hindih": 70
		},
		"horizontal": {
			"w": 207, "h": 60,
			"pdfw": 150, "pdfh": 44,
			'gujw': 120, "gujh": 70,
			'hindiw': 120, "hindih": 70
		},
		"centered": {
			"w": 178, "h": 100,
			"pdfw": 178, "pdfh": 100,
			'gujw': 178, "gujh": 100,
			'hindiw': 178, "hindih": 100
		},
	}

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
			"Dinner": "Swamivatsalya (Dinner) has been arranged from",
		}
	};
	$scope.swadhyaykarInfo = [
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Kinjalji",
			image: "Atmarpit_Kinjalji.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત કિંજલજી",
			hindiName: "आत्मार्पित किंजलजी",
			checked: true,
		},

		{
			swadhyaykarName: "Swadhyaykar Atmarpit Rajuji",
			image: "Atmarpit_Rajuji.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત રાજુજી",
			hindiName: "आत्मार्पित राजुजी",
		},
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Shivaniji",
			image: "Atmarpit_Shivaniji.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત શિવાનીજી",
			hindiName: "आत्मार्पित शिवानीजी",
		},
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Smrutiji",
			image: "Atmarpit_Smrutiji.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત સ્મૃિતજી",
			hindiName: "स्वाध्यायकार आत्मार्पित स्मृतिजी",
		},
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Siddhiji",
			image: "Atmarpit_Siddhiji.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત સિદ્ધિજી",
			hindiName: "स्वाध्यायकार આત્માર્પિત सिद्धिजी",
		},
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Fagunji",
			image: "Atmarpit_Fagunji.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત ફાગુનજી",
			hindiName: "स्वाध्यायकार आत्मार्पित फागुनजी",
		},
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Vidhiben",
			image: "Atmarpit_Vidhi.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત વિધિબેન",
			hindiName: "स्वाध्यायकार आत्मार्पित विधिबहन",
		},
		{
			swadhyaykarName: "Swadhyaykar Atmarpit Harshadbhai",
			image: "Atmarpit_Harshadbhai.png",
			gujName: "સ્વાધ્યાયકાર આત્માર્પિત હર્શદભાઈ",
			hindiName: "स्वाध्यायकार आत्मार्पित हर्षदभाई",
		},
		{
			swadhyaykarName: "Swadhyaykar Vanprastha Dr. Bhavnaben Shah",
			image: "Bhavnaben_Shah.png",
			gujName: "સ્વાધ્યાયકાર વાનપ્રસ્થ ડો. ભાવનાબેન શાહ ",
			hindiName: "स्वाध्यायकार वानप्रस्थ डॉ. भावनाबहन शाह",
		},
		{
			swadhyaykarName: "Swadhyaykar Vanprastha Dilipbhai Jasani",
			image: "Dilipbhai_Jasani.png",
			gujName: "સ્વાધ્યાયકાર વાનપ્રસ્થ દિલિપભાઈ જસાણી",
			hindiName: "स्वाध्यायकार वानप्रस्थ दिलिपभाई जसाणी",
		},
		{
			swadhyaykarName: "Swadhyaykar Vanprastha Dilipbhai Pasad",
			image: "Dilipbhai_Pasad.png",
			gujName: "સ્વાધ્યાયકાર વાનપ્રસ્થ દિલિપભાઈ જસાણી પાસદ",
			hindiName: "स्वाध्यायकार वानप्रस्थ दिलिपभाई पासद",
		},
		{
			swadhyaykarName: "Swadhyaykar Vanprastha Dr. Piyushbhai Shah",
			image: "Piyushbhai_Shah.png",
			gujName: "સ્વાધ્યાયકાર વાનપ્રસ્થ ડો. પિયુષભાઈ શાહ",
			hindiName: "स्वाध्यायकार वानप्रस्थ डॉ. पीयूषभाई शाह ",
			checked: false,
		},

	]


	var spreadsheetId = $scope.pageDetails.spreadsheetId;
	//var radioOptions = pageDetails[section]['radioOptions'];
	console.log("SpreadsheetId, name ", spreadsheetId, name);
	objectDetailsService.lookupObjectByNameAsync(spreadsheetId, name, $scope.pageDetails)
		.then(function () {
			$scope.object = objectDetailsService.getObject();
			console.log("scope object", $scope.object);
			if (option2 == true) {
				console.log("2nd: This is a second option");
				$scope.object.imageLink = $scope.object.secondaryImageLink;
				$scope.object.worksheetIndex = $scope.object.secondaryWorksheetIndex;
			}
			$scope.language = $scope.object.language;

			$scope.pageDetails['thumbnailHeight'] = $scope.object.thumbnailWidth;
			$scope.pageDetails['thumbnailWidth'] = $scope.object.thumbnailHeight;
			$scope.pageDetails['canvasHeight'] = $scope.object.canvasHeight;
			$scope.pageDetails['canvasWidth'] = $scope.object.canvasWidth;
			//$scope.swamivatsalyaText = $scope.swamivatsalyaTextLanguage[$scope.language];
			objectDetailsService.loadFormInfoAsync(spreadsheetId, $scope.object.worksheetIndex)
				.then(function () {
					$scope.formInfo = objectDetailsService.getFormInfo();
					$scope.font = $scope.formInfo;
					var fonts = $scope.formInfo.map(function (d) { return d['font'].trim(); });
					$scope.fonts = fonts.filter(onlyUnique).filter(String);
					loadFonts($scope.fonts);
					console.log('language', $scope.language);
					if ($scope.language && $scope.language !== "english") {
						loadTransliteration();
					}
					canvasSetup();
					$('.canvas-container').height($scope.pageDetails.canvasHeight);
					$('#progress_bar').height($scope.pageDetails.canvasHeight)
						.width($scope.pageDetails.canvasWidth);
				});
		});

	var values = {};

	$scope.submitForm = function () {
		console.log("submitForm");
		canvasSetup();
	}

	$scope.download = function () {
		console.log("Downloading...")
		downloadCanvas();
	}

	$scope.openSidebar = function ($event) {
		if ($('.sidebar-form').hasClass("sidebar-open")) {
			$('.sidebar-form').removeClass("sidebar-open");
			$('.pusher').removeClass("sidebar-open");
		}
		else {
			$('.sidebar-form').addClass("sidebar-open");
			$('.pusher').addClass("sidebar-open");
		}
	}

	function camelize(str) {
		return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
			if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
			return index == 0 ? match.toLowerCase() : match.toUpperCase();
		});
	}

	var canvasSetup = function () {
		startProgressBar();
		var canvas = $("#canvas")[0];
		console.log(canvas);
		$.each($('#myForm').serializeArray(), function (i, field) {
			values[field.name] = field.value;
		});
		var img = new Image();
		img.setAttribute('crossOrigin', 'anonymous');
		resizeCanvas(canvas, $scope.pageDetails.scale);
		img.onload = function () {
			drawImageScaled(values, img, canvas, $scope.pageDetails.scale)
			console.log("Image onload function")
		};
		console.log("IMAGE LINK: " + $scope.object.imageLink);
		img.backgroundLoad($scope.object.imageLink);
		//img.src = $scope.object.imageLink;
	}

	var drawImageScaled = function (values, img, canvas, scale) {
		var deferred = $q.defer();
		var loadSRMDLogo, loadUploadLogo, loadSwadhyaykar, loadMomentoPhoto;
		ctx = canvas.getContext('2d');
		ctx.imageSmoothingEnabled = true;
		ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
		ctx.setTransform(scale, 0, 0, scale, 0, 0);
		$('.sidebar-form').height($('body').height() - 112 - 50 - 15);
		//ctx.scale($scope.pageDetails.scale/2, $scope.pageDetails.scale/2);
		//ctx.scale($scope.pageDetails.scale/2, $scope.pageDetails.scale/2);
		console.log("******************* WORKSHEET OBJECT");
		console.log($scope.formInfo);
		for (var i = 0; i < $scope.formInfo.length; i++) {
			field = $scope.formInfo[i];
			positionX = field.positionX; //* $scope.pageDetails.scale; 
			positionY = field.positionY; //* $scope.pageDetails.scale * 1.05;

			if (field.id == "srmd_logo" || field.id == "srmd_horizontal_logo") {
				loadSRMDLogo = $q.defer();
				console.log("loading the image... ", loadSRMDLogo)
				addSrmdLogoToCanvas(ctx, field, positionX, positionY, loadSRMDLogo)
					.then(function () {
						console.log("loaded the image...");
					});
				continue;
			}
			if (field.id == "momento_photo") {
				src = $('img.momento_photo').attr('src');
				if (src) {
					addImageToCanvas(ctx, src, positionX, positionY, 100, 130);
				}
				continue;
			}
			if (field.id == "upload_logo") {
				src = $("img.upload_logo").attr('src');
				if (src) {
					addImageToCanvas(ctx, src, positionX, positionY, 60, 60);
				}
				continue;
			}
			if (field.id == "swamivatsalya") {
				var key = $('input[name="swamivatsalya"]:checked').val()
				var swamiText = $scope.swamivatsalyaTextLanguage[$scope.language][key] || $scope.swamivatsalyaTextLanguage[$scope.language][0];
				if (swamiText && ($scope.language === "english")) {
					var startTime = $('#swamivatsalya_startTiming_' + key).val() || "12pm";;
					var endTime = $('#swamivatsalya_endTiming_' + key).val() || "2pm";;
					swamiText = swamiText + " " + startTime + " to " + endTime;
				}
				values[field.fieldName] = swamiText;
				//"प्रवचन के पश्चात कृपया स्वामीवात्सल्य का लाभ लिजिएगा"
				//values[field.fieldName] = beginningText + " " + startTime + " to " +  endTime; 	
				//values['blah'] = blah; 
			}
			if (field.id == "swadhyaykar") {
				//alert("Swadhyaykar");
				let srcInput = $('input[name="swadhyaykar"]:checked').val();
				let src = "../img/swadhyaykars/" + srcInput;
				if (src) {
					addImageToCanvas(ctx, src, positionX, positionY, 103.7, 85);
				}
			}
			if (field.id == "swadhyaykar_new") {
				let srcInput = $('input[name="swadhyaykar"]:checked').val()
				let src = "../img/swadhyaykars-new/" + srcInput
				if (src) {
					addImageToCanvas(ctx, src, positionX, positionY, 103.7, 85);
				}
			}

			var fontSize = parseInt(field.fontSize) || 12;
			var fontWeight = field.fontWeight;
			ctx.fillStyle = field.fontColor;
			ctx.textAlign = field.textAlign;
			ctx.letterSpacing = field.letterSpacing ? `${field.letterSpacing}px` : '';
			ctx.font = `${fontWeight || 400} ${fontSize}pt ${field.font}`;
			ctx.save();
			//console.log(field);
			if (field.id == "swadhyaykar_name") {
				let name = $('input[name="swadhyaykar"]:checked').data('name');
				let jsonSwadhyaykarPerson = $scope.swadhyaykarInfo.filter(function (data) {
					return data.swadhyaykarName === name
				})[0];
				console.log("jsonSwadhyaykarPerson", jsonSwadhyaykarPerson);
				var swadhyaykarName;
				switch ($scope.language) {
					case "gujarati":
						swadhyaykarName = jsonSwadhyaykarPerson.gujName
						break;
					case "hindi":
						swadhyaykarName = jsonSwadhyaykarPerson.hindiName
						break;
					default:
						swadhyaykarName = name;
						//swadhyaykarName = jsonSwadhyaykarPerson.gujName
						break;

				}
				ctx.font = `${fontWeight || ''} ${fontSize || ''}pt ${field.font}`;
				console.log('CTX FONT', ctx.font);
				ctx.save();
				ctx.fillText(swadhyaykarName, positionX, positionY, width);
			}
			else {
				if (field.endPositionX) {
					var endPositionX = field.endPositionX;
					var width = Math.abs(positionX - endPositionX);
					if (values[field.fieldName]) {
						ctx.fillText(values[field.fieldName], positionX, positionY, width);
					}
					else {
						ctx.fillText(field.placeholderText, positionX, positionY, width);
					}
				}
				else {
					if (values[field.fieldName]) {
						ctx.fillText(values[field.fieldName], positionX, positionY);
					}
					else {
						ctx.fillText(field.placeholderText, positionX, positionY);
					}
				}
			}
		}
		//console.log("loadSRMDLogo", loadSRMDLogo)
		//hack to make sure that the logo has been loaded
		//before downloading...
		setTimeout(function () {
			completeProgressBar();
			deferred.resolve();
		}, 1000);
		return deferred.promise;
	}

	var resizeCanvas = function (canvas, scale_ratio) {
		canvas.style.width = $scope.pageDetails.canvasWidth + "px";
		canvas.style.height = $scope.pageDetails.canvasHeight + "px";
		canvas.width = $scope.pageDetails.canvasWidth * (scale_ratio);
		canvas.height = $scope.pageDetails.canvasHeight * (scale_ratio);
	}

	var downloadCanvas = function () {
		var canvas = $("#canvas")[0];
		//var ctx = canvas.getContext('2d');
		var download = $('#download');
		if ($scope.convertInvitationPDF == true) {
			var imgData = canvas.toDataURL("image/jpeg");
			var pdf;
			if ($scope.pdf6x6) {
				pdf = new jsPDF({ format: [1000, 985] });
				pdf.internal.scaleFactor = 4;
				var canvasScale = $scope.pageDetails.scale / 2
				pdf.addImage(imgData, 'PNG', 0, 0,
					$scope.pageDetails.canvasWidth * canvasScale,
					$scope.pageDetails.canvasHeight * canvasScale);
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', (
					$scope.pageDetails.canvasWidth * -1) - 60, 0,
					$scope.pageDetails.canvasWidth * canvasScale,
					$scope.pageDetails.canvasHeight * canvasScale);
			}
			else {
				pdf = new jsPDF({ format: [1000, 633] });
				pdf.internal.scaleFactor = 4;
				var canvasScale = $scope.pageDetails.scale / 2
				pdf.addImage(imgData, 'PNG', 0, 0,
					$scope.pageDetails.canvasWidth * canvasScale,
					$scope.pageDetails.canvasHeight * canvasScale);
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', (
					$scope.pageDetails.canvasWidth * -1) - 110, 0,
					$scope.pageDetails.canvasWidth * canvasScale,
					$scope.pageDetails.canvasHeight * canvasScale);
			}
			pdf.save($scope.pageDetails.name + ".pdf")
			var a = document.createElement("a");
			a.target = "_blank";
			a.href = pdf.output('datauri');
			a.setAttribute("download", $scope.pageDetails.name);
			uploadFile();
		}
		else {
			enableLoader();
			createHighResCanvas();
		}
	}

	var loadTransliteration = function () {
		google.load("elements", "1", {
			packages: "transliteration",
			callback: onLoadLanguage
		});
	}

	var onLoadLanguage = function () {
		console.log("onLoadLanguage");
		var destinationLanguage;
		if ($scope.language == "gujarati") {
			destinationLanguage = google.elements.transliteration.LanguageCode.GUJARATI;
		}
		else if ($scope.language == "hindi") {
			destinationLanguage = google.elements.transliteration.LanguageCode.HINDI;
		}
		else {
			destinationLanguage = google.elements.transliteration.LanguageCode.ENGLISH;
		}

		//alert(destinationLanguage);

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
		var idsToExclude = ["email", "srmd_logo", "upload_logo", "swamivatsalya", "swadhyaykar_name", "swadhyaykar", "momento_photo", "swadhyaykar_new"];
		for (var i = 0; i < $scope.formInfo.length; i++) {
			if (!idsToExclude.includes($scope.formInfo[i].id)) {
				arrayOfIds.push($scope.formInfo[i].id);;
			}
		}
		control.makeTransliteratable(arrayOfIds);
		control.enableTransliteration();
	}



	var addSrmdLogoToCanvas = function (ctx, field, x, y, loadSRMDLogo) {
		var loadingImage = $q.defer();
		//RESIZE THE IMAGE
		var srmdLogo = new Image();
		console.log("Adding SRMD Logo...");
		console.log(field.id + " placeholder: " + field.placeholderText)
		let width, height;
		let src = ""
		let logo_type = field.placeholderText.split(" ");
		let orientation = (logo_type[0] || "horizontal").toLowerCase();
		let type = (logo_type[1] || "white_text").toLowerCase();
		switch ($scope.language) {
			case "hindi":
				src = orientation + "/" + type + "/" + "hindi.png";
				width = field.width || logo_sizes[orientation]["hindiw"];
				height = field.height || logo_sizes[orientation]["hindih"];
				break;
			case "gujarati":
				src = orientation + "/" + type + "/" + "gujarati.png";
				width = field.width || logo_sizes[orientation]["gujw"];
				height = field.height || logo_sizes[orientation]["gujh"];
				break;
			default:
				var country = $("input[name='" + field.id + "']:checked").val() ?
					$("input[name='" + field.id + "']:checked").val()
						.replace(' ', '')
						.toLowerCase() : "general";

				src = orientation + "/" + type + "/" + country + ".png";
				console.log("orientation: " + orientation);
				width = field.width || ($scope.convertInvitationPDF ? logo_sizes[orientation]["pdfw"] :
					logo_sizes[orientation]["w"]);
				height = field.height || ($scope.convertInvitationPDF ? logo_sizes[orientation]["pdfh"] :
					logo_sizes[orientation]["h"]);
				break;
		}


		srmdLogo.onload = function () {
			ctx.drawImage(srmdLogo, x, y, width, height);
			loadSRMDLogo.resolve();
			loadingImage.resolve();
		};

		srmdLogo.src = "../img/logos/" + src
		return loadingImage.promise;
	}

	var addImageToCanvas = function (ctx, src, x, y, width, height) {
		logo = new Image();
		console.log("Adding Sponsor Logo to the Canvas");
		//CHANGE THE DIMENSIONS OF THE UPLOADED LOGO
		logo.onload = function () {
			ctx.drawImage(logo, x, y, width, height);
		};
		logo.src = src;
	}

	function loadFonts(fonts) {
		fonts = fonts.filter(a => a != '').map(f => f.charAt(0).toUpperCase() + f.slice(1));
		WebFont.load({
			google: {
				families: fonts
			}
		});
	}

	function onlyUnique(value, index, self) {
		return self.indexOf(value) === index;
	}

	Image.prototype.backgroundLoad = function (url) {
		console.log("The URL being loaded is: ", url);
		var thisImg = this;
		var xmlHTTP = new XMLHttpRequest();
		//var oldPercentage = 0
		xmlHTTP.open('GET', url, true);
		xmlHTTP.responseType = 'arraybuffer';
		xmlHTTP.onload = function (e) {
			console.log("Finished loading the image - about to render");
			//thisImg.src = this.response; 
			var blob = new Blob([this.response]);
			thisImg.src = window.URL.createObjectURL(blob);
			$scope.imgSrc = thisImg.src;
		};
		xmlHTTP.onprogress = function (e) {
			thisImg.completedPercentage = parseInt((e.loaded / e.total) * 100);
			if (thisImg.completedPercentage >= 90) {
				thisImg.completedPercentage = 90;
			}
			updateProgressBar(thisImg.completedPercentage);
			console.log("#######" + thisImg.completedPercentage);
		};
		xmlHTTP.onloadstart = function () {
			console.log("#######STARTING");
			//$('#progress_bar .progress .progress-bar').attr('aria-valuenow', 0);
			//$('#progress_bar .progress .progress-bar').style.width = "0%";
			thisImg.completedPercentage = 0;
		};
		xmlHTTP.send();
	};

	Image.prototype.completedPercentage = 0;

	function updateProgressBar(percentage) {
		var percentageString = percentage.toString() + "%";
		$('#progress_bar .progress .progress-bar').css("width", percentageString);
	}

	function completeProgressBar() {
		$('#progress_bar .progress .progress-bar').width("100%");
		$('#progress_bar').hide();
	}

	function startProgressBar() {
		$('#progress_bar').show();
	}

	var createHighResCanvas = function () {
		console.log("Create HighRes Canvas")
		var newScale = $scope.pageDetails.scale * 2;
		var newCanvas = document.createElement('canvas');
		resizeCanvas(newCanvas, newScale);
		var img = new Image();
		img.setAttribute('crossOrigin', 'use-credentials');
		img.onload = function () {
			drawImageScaled(values, img, newCanvas, newScale).then(function () {
				newCanvas.toBlob(function (blob) {
					console.log("Starting to convert the blob...");
					var url = URL.createObjectURL(blob);
					var link = document.createElement("a");
					link.href = url;
					link.setAttribute("download", $scope.pageDetails.name);
					link.click();
					//link.remove();
					disableLoader();
				}, 'image/jpeg');
			});
			uploadFile();
			console.log("Image onload function")
		};
		console.log("The url being loaded is", $scope.object.imageLink);
		img.backgroundLoad($scope.object.imageLink);

	}

	function uploadFile() {
		console.log("0. Upload File")
		var canvas = $('#canvas')[0];
		canvas.toBlob(function (blob) {
			var url = URL.createObjectURL(blob);
			addFileToGoogleDrive(blob);
		}, 'image/jpeg');

	}

	function disableLoader() {
		$("#loader").css("display", "none");
		$('.content').css("overflow", "scroll");
	}

	function enableLoader() {
		$("#loader").css("display", "block");
		$('.content').css("overflow", "hidden");
	}

	function addFileToGoogleDrive(file) {
		var reader = new FileReader();
		reader.onload = function (evt) {
			console.log("1. About to send the file");
			sendFileToGoogleDrive(evt.target.result);
		};
		reader.readAsDataURL(file);
	}

	function sendFileToGoogleDrive(file) {
		console.log("2. addFileToGoogleDrive 1");
		var url = "https://script.google.com/a/shrimadrajchandramission.com/macros/s/AKfycbxrRdFQUlYGaWbtC20EmDWUezCb6xyI0LRUZtOov2WFgqZx1peO/exec"
		console.log("Username: " + $rootScope.loggedInUser.fullName);
		console.log("Email: " + $rootScope.loggedInUser.email);
		//console.log(file.toString());
		var data = $.param({
			fileName: $scope.pageDetails.name,
			uploader: $rootScope.loggedInUser.email,
			userEmail: $rootScope.loggedInUser.fullName,
			file: file
		});
		// console.log(data);
		var config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;'
			}
		}
		//'application/x-www-form-urlencoded;'
		console.log("3. About to send the request")
		$http.post(url, data, config).then(function () {
			console.log("4. returned from posting");
			console.log(data);
		}).then(function (result) {
			console.log(result);
		});
	};

}//end file
