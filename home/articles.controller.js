
//var app = angular.module('myApp'); 

app.controller('ArticlesController', ArticlesController);

app.service('articleDetailsService', function($http, $q, $sce){
	var articlesData = []; 
	var articleDetails = []; 
	var articleText = [];

	var loadArticleInfoAsync = function(spreadsheetId){
		console.log("loadArticleInfoAysnc");
		var deffered = $q.defer();
		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/od6/public/values?alt=json-in-script"
  		$sce.trustAsResourceUrl(url)
  		console.log("Loading Article Info Async");
  		$http.jsonp(url)
			.then(function(data, status){
				data = data.data;  
				for(var i = 0; i < data.feed.entry.length; i++){			
					var article = data.feed.entry[i]; 
					var articleInfo = grabArticleInfo(article); 
					//articleInfo.iframeLink = "http://docs.google.com/gview?url=" + articleInfo.articleLink + "&embedded=true"
					articlesData.push(articleInfo); 
				}
				deffered.resolve();
			}
		); 
		return deffered.promise;
	}

	var getArticlesData = function(){
		return articlesData; 
	}

	var loadArticleDetails = function(article){
		articleDetails = article; 
	}

	var getArticleDetails = function(){
		return articleDetails; 
	}

	var lookupArticleByName = function(spreadsheetId, name){
		console.log("lookupArticleByName");
  		var deffered = $q.defer();
  		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/od6/public/values?alt=json-in-script"
  		$sce.trustAsResourceUrl(url)
  		$http.jsonp(url)
			.then(function(data, status){
				data = data.data		
				for(var i = 0; i < data.feed.entry.length; i++){
					if(data.feed.entry[i].gsx$name.$t == name){
						articleDetails = grabArticleInfo(data.feed.entry[i]); 
						break;
					} 
				}
				deffered.resolve();
			}
		); 
		return deffered.promise;
  	}

  	var grabArticleInfo = function(article){
  		var articleInfo = {}

		articleInfo.name = article.gsx$name.$t ? article.gsx$name.$t : ""; 
		articleInfo.month = article.gsx$month.$t ? article.gsx$month.$t : ""; 
		articleInfo.year = article.gsx$year.$t ? article.gsx$year.$t : ""; 
		articleInfo.wordCount = article.gsx$wordcount.$t ? article.gsx$wordcount.$t : ""; 
		articleInfo.magazineSection = article.gsx$magazinesection.$t ? article.gsx$magazinesection.$t : ""; 
		articleInfo.category = article.gsx$category.$t ? article.gsx$category.$t : ""; 
		articleInfo.subcategory =article.gsx$subcategory.$t ? article.gsx$subcategory.$t : ""; 
		articleInfo.language = article.gsx$language.$t ? article.gsx$language.$t : ""; 
		articleInfo.articleLink = article.gsx$articlelink.$t ? article.gsx$articlelink.$t : ""; 
		
		//articleInfo.articleDetailsLink = articleInfo.name.replace(/ /g,"_"); 
		articleInfo.documentLink = article.gsx$documentlink.$t ?  article.gsx$documentlink.$t : articleInfo.articleLink; 
		// if(articleInfo.articleLink){
		// 	var id = articleInfo.articleLink.split("id=")[1]; 
		// 	articleInfo.articleSpreadsheetId = id; 
		// 	articleInfo.iframeLink = "https://drive.google.com/file/d/" + id + "/preview"; 
		// }
		return articleInfo; 
  	}

  	var loadArticleText = function(articleId){
  		//var accessToken = gapi.auth.getToken().access_token;
  		console.log("get here"); 
  		var deffered = $q.defer();
  		//var articleId2 = "1ViQmsD0Dl2Z1RcCNlPLS2rpW2ZHcsU2arEDmx9u3yLM"
  		var articleId2 = "1wiImif3tsB1crvS95P9gI29Iy0P_AnrJ1B5t-mW_QCA"
  		var format = "txt"
  		var url = "https://docs.google.com/document/d/"+articleId2+"/export?format=pdf"
  		var xhr = new XMLHttpRequest();
    	xhr.open('GET', url);
    	xhr.onload = function() {
	      //articleText = to_unicode(xhr.responseText); 
	      
	      console.log(articleText);
	      deffered.resolve();
	    };
	    xhr.send();

	    return deffered.promise;
  	}

  	var getArticleText = function(){
  		return articleText; 
  	}

  //var _0x9e25=["\x66\x6F\x6E\x74\x5F\x6E\x6D","\x67\x65\x74\x45\x6C\x65\x6D\x65\x6E\x74\x42\x79\x49\x64","\x76\x61\x6C\x75\x65","\x73\x65\x6C\x65\x63\x74\x65\x64\x49\x6E\x64\x65\x78","\x6F\x70\x74\x69\x6F\x6E\x73","\x67\x6F\x70\x69\x6B\x61","\x66\x6F\x6E\x74\x46\x61\x6D\x69\x6C\x79","\x73\x74\x79\x6C\x65","\x6C\x65\x67\x61\x63\x79\x5F\x74\x65\x78\x74","\x42\x20\x42\x68\x61\x72\x61\x74\x69\x20\x47\x6F\x70\x69\x6B\x61\x54\x77\x6F","\x6B\x72\x69\x73\x68\x6E\x61","\x4B\x72\x69\x73\x68\x6E\x61","\x73\x68\x79\x61\x6D\x61","\x41\x6B\x72\x75\x74\x69\x47\x75\x6A\x53\x68\x79\x61\x6D\x61"];
   //var from_unicode = function(){ var _0x1067x2=document[_0x9e25[1]](_0x9e25[0]),_0x1067x2=_0x1067x2[_0x9e25[4]][_0x1067x2[_0x9e25[3]]][_0x9e25[2]];_0x9e25[5]== _0x1067x2&& (document[_0x9e25[1]](_0x9e25[8])[_0x9e25[7]][_0x9e25[6]]= _0x9e25[9],Convert_Unicode_to_Gopika());_0x9e25[10]== _0x1067x2&& (document[_0x9e25[1]](_0x9e25[8])[_0x9e25[7]][_0x9e25[6]]= _0x9e25[11],Convert_Unicode_to_Krishna());_0x9e25[12]== _0x1067x2&& (document[_0x9e25[1]](_0x9e25[8])[_0x9e25[7]][_0x9e25[6]]= _0x9e25[13],Convert_Unicode_to_Shyama())}
   //var to_unicode = function()
   //{var _0x1067x2=document[_0x9e25[1]](_0x9e25[0]),_0x1067x2=_0x1067x2[_0x9e25[4]][_0x1067x2[_0x9e25[3]]][_0x9e25[2]];_0x9e25[5]== _0x1067x2&& convert_to_unicode();_0x9e25[10]== _0x1067x2&& convert_krishna_to_unicode();_0x9e25[12]== _0x1067x2&& convert_Shyama_to_unicode()}
	return {
		loadArticleInfoAsync: loadArticleInfoAsync, 
		getArticlesData: getArticlesData,
		loadArticleDetails: loadArticleDetails,
		lookupArticleByName: lookupArticleByName, 
		getArticleDetails: getArticleDetails, 
		loadArticleText: loadArticleText,
		getArticleText: getArticleText
	}
}); 

ArticlesController.$inject = ['$scope', '$rootScope', '$location', '$http', 
						'$sce', 'articleDetailsService', 'subpageDetails', '$routeParams']; 
function ArticlesController($scope, $rootScope, $location, 
	$http, $sce, articleDetailsService, pageDetails, $routeParams, subpageDetails){
	console.log("Articles Controller"); 
	$scope.title = "Articles Page";
	var pages = [], heights = [], width = 0, height = 0, currentPage = 1;
	var scale = .9;
	//hard coded because it is not a part of the homepage controller
	//var spreadsheetId = "1KcE5rNKGrTX4EVmdb-4KmZnpmJ8h92YQ8_mgpVt_FAE"
	
	var spreadsheetId = "1h0jROmLgXgsBg-9kKkLDSNldXnHQEnPlodQP_X2Ul74"
	console.log("SpreadsheetId: " + spreadsheetId); 
	console.log("LOCATION PATH"); 
	
	if($location.path() == "/articles"){
		articleDetailsService.loadArticleInfoAsync(spreadsheetId).then(function(){
			$scope.articles = articleDetailsService.getArticlesData(); 
		});
	}
	else{
		var articleName = $routeParams.name.replace(/_/g, " "); 
		var canvas = $('.canvas-container'); 
		console.log("SpreadsheetId: " + spreadsheetId);
		articleDetailsService.lookupArticleByName(spreadsheetId, articleName).then(function(){
			$scope.articleDetails = articleDetailsService.getArticleDetails();
			//console.log($scope.articleDetails.articleSpreadsheetId);
			var url  = $scope.articleDetails.articleLink; 
			console.log(url);
			//var url = "https://s3.amazonaws.com/srmd-flyer-generator/articles/english/A+Death+that+Liberates.pdf"
			PDFJS =  window['pdfjs-dist/build/pdf'];
			PDFJS.getDocument(url)
			.then(function(pdf){
				getPage();
			    function getPage() {
			        pdf.getPage(currentPage).then(function(page) {
			            console.log("Printing " + currentPage);
			            var viewport = page.getViewport(scale);
			            // var canvas = document.createElement('canvas'); 
			            var canvas = $("#articleCanvas")[0];
			            var ctx = canvas.getContext('2d');
			            var renderContext = { canvasContext: ctx, viewport: viewport };
			            canvas.height = viewport.height;
			            canvas.width = viewport.width;
			            page.render(renderContext).then(function() {
			                pages.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
			                heights.push(height);
			                height += canvas.height;
			                if (width < canvas.width) width = canvas.width;
				                if (currentPage < pdf.numPages) {
				                    currentPage++;
				                    getPage();
				                }
			                else {
			                    draw(canvas, ctx);
			                }
			            });
			        });
			    }
			}).catch(function(error){
				alert("There was an error in loading the document.");
			}); 
		}); 
	}
	

	$scope.saveArticle = function(currObj){
		console.log("Saving the object"); 
		// objectDetailService.addObject(currObj);
		// console.log(currObj); 
		var locationPath = $location.path().toString(); 
		articleDetailsService.loadArticleDetails(currObj);
		
		//$rootScope.postLogInRoute = locationPath ;
		console.log("Save Material LocationPath: " + locationPath); 
		//$location.path('/dharmayatra/' +  currObj.name.replace(/ /g,"_")).replace(); 
		console.log("***********")
		console.log(locationPath + '/' +  currObj.name.replace(/ /g,"_")); 
		$location.path(locationPath + '/' +  currObj.name.replace(/ /g,"_")).replace(); 	
	}

	$scope.requestArticle = function(formInfo){
		var form = $('#myForm')[0]; 
		var centerName = encodeURIComponent($('#centerName').val()); 
		var centerEmail = encodeURIComponent($('#centerEmail').val()); 
		var requestReason = encodeURIComponent($('#requestReason').val()); 

		var articleName = encodeURIComponent($('#articleName').val()); 
		var articleLink = encodeURIComponent($('#articleLink').val()); 
		var pdfLink = encodeURIComponent($('#pdfLink').val())
		var designed = encodeURIComponent($('input[name=designField]').prop('checked'))
		var publisher = encodeURIComponent($('#publisher').val()); 
		console.log(centerName); 


		var baseURL = "https://docs.google.com/forms/u/7/d/e/1FAIpQLSdd8CruVCXXMDiq-WxI0LWfba46D_AxcDcIv1A1uWKBmbR_bg/formResponse?"; 
		var submitRef = "&submit=-2838550462772200653";
		var articleLinkID = "entry.1734546770"; 
		var pdfLinkID = "entry.2055262418";
		var articleNameID = "entry.1745447166"; 
		var centerNameID = "entry.2114019815"; 
		var centerEmailID = "entry.550354372";
		var requestReasonID = "entry.2009048180";
		var designFieldID = "entry.129906415"; 
		var publisherFieldID = "entry.717206679"

		var submitURL = baseURL +  articleLinkID + "=" + articleLink + "&" + 
								   pdfLinkID + "=" + pdfLink + "&" + 
								   articleNameID + "=" + articleName + "&" +
								   centerNameID + "=" + centerName + "&" +
								   centerEmailID + "=" + centerEmail + "&" +
								   requestReasonID + "=" + requestReason + "&" +
								   designFieldID + "=" + designed + "&" + 
								   publisherFieldID + "=" + publisher + "&" +
								   submitRef; 
		console.log(submitURL);
		console.log(form); 
        form.action=submitURL;
        form.submit(); 

		// var values = []; 
		// var fields = []; 
		// $.each($('#myForm').serializeArray(), function(i, field) {
		//     fields[i] = field.name; 
		//     values[field.name] = field.value;
		// });
	}

	$scope.searchTable = function(){
		  var input, filter, table, tr, td, i;
		  input = document.getElementById("myInput");
		  filter = input.value.toUpperCase();
		  table = document.getElementById("articleTable");
		  tr = table.getElementsByTagName("tr");

		  // Loop through all table rows, and hide those who don't match the search query
		  searchTable(tr, filter); 
		  var closeView = $('.viewAllArticles').css("display", ""); 
	}

	$scope.filterOnPress = function($event){
		var filterString = $event.currentTarget.name.toUpperCase(); 
		//$event.currentTarget.style.background = "red";
		table = document.getElementById("articleTable");
		tr = table.getElementsByTagName("tr");
		var closeView = $('.viewAllArticles').css("display", "block"); 
		searchTable(tr, filterString); 
	}

	var searchTable = function(tr, filter){
		for (i = 0; i < tr.length; i++) {
		    var name = tr[i].getElementsByTagName("td")[0];
		    var category = tr[i].getElementsByTagName("td")[1];
		    var language = tr[i].getElementsByTagName("td")[2];
		    var wordCount = tr[i].getElementsByTagName("td")[3];
		    if (name || category || language || wordCount) {
		      if (name.innerHTML.toUpperCase().indexOf(filter) > -1 || 
		      	  category.innerHTML.toUpperCase().indexOf(filter) > -1 ||
		      	  language.innerHTML.toUpperCase().indexOf(filter) > -1 ) {
		        console.log(language.innerHTML.toUpperCase().indexOf(filter)); 
		        tr[i].style.display = "";
		      }
		      else {
		        tr[i].style.display = "none";
		      }
		    } 
  		}
	}

	function draw(canvas, ctx) {
	    //var canvas = document.createElement('canvas'), ctx = canvas.getContext('2d');
	    canvas.width = width;
	    canvas.height = height;
	    for(var i = 0; i < pages.length; i++)
	        ctx.putImageData(pages[i], 0, heights[i]);
	    //document.body.appendChild(canvas);
	}

	$scope.removeFilter = function(){
		table = document.getElementById("articleTable");
		tr = table.getElementsByTagName("tr")
		for (i = 0; i < tr.length; i++) {
			tr[i].style.display = ""; 
		}
		var closeView = $('.viewAllArticles').css("display", "none"); 
		//$event.currentTarget.style.background = "none";
	}


  
        

	//https://docs.google.com/forms/d/e/1FAIpQLSdd8CruVCXXMDiq-WxI0LWfba46D_AxcDcIv1A1uWKBmbR_bg/viewform?usp=pp_url&entry.1745447166=hello&entry.2114019815&entry.550354372&entry.2009048180

}
