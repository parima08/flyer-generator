
var app = angular.module('myApp'); 

app.controller('ArticlesController', ArticlesController);

app.service('articleDetailsService', function($http, $q, $sce){
	var articlesData = []; 
	var articleDetails = []; 

	var loadArticleInfoAsync = function(spreadsheetId){
		console.log("loadArticleInfoAysnc");
		var deffered = $q.defer();
		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/od6/public/values?alt=json-in-script"
  		$sce.trustAsResourceUrl(url)
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
		articleInfo.articleDetailsLink = articleInfo.name.replace(/ /g,"_"); 
		if(articleInfo.articleLink){
			var id = articleInfo.articleLink.split("id=")[1]
			articleInfo.iframeLink = "https://drive.google.com/file/d/" + id + "/preview"; 
		}
		return articleInfo; 
  	}

	return {
		loadArticleInfoAsync: loadArticleInfoAsync, 
		getArticlesData: getArticlesData,
		loadArticleDetails: loadArticleDetails,
		lookupArticleByName: lookupArticleByName, 
		getArticleDetails: getArticleDetails 
	}
}); 

ArticlesController.$inject = ['$scope', '$rootScope', '$location', '$http', 
						'$sce', 'articleDetailsService', 'pageDetails', '$routeParams']; 
function ArticlesController($scope, $rootScope, $location, 
	$http, $sce, articleDetailsService, pageDetails, $routeParams){
	console.log("Articles Controller"); 
	$scope.title = "Articles Page";
	var spreadsheetId = pageDetails['articles'].spreadsheetId;
	console.log("SpreadsheetId: " + spreadsheetId); 
	console.log("LOCATION PATH"); 
	
	if($location.path() == "/articles"){
		articleDetailsService.loadArticleInfoAsync(spreadsheetId).then(function(){
			$scope.articles = articleDetailsService.getArticlesData(); 
		});
	}
	else{
		var articleName = $routeParams.name.replace(/_/g, " "); 
		articleDetailsService.lookupArticleByName(spreadsheetId, articleName).then(function(){
			$scope.articleDetails = articleDetailsService.getArticleDetails();	
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
		var centerName = encodeURIComponent($('#centerEmail').val()); 
		var centerEmail = encodeURIComponent($('#centerName').val()); 
		var requestReason = encodeURIComponent($('#requestReason').val()); 

		var articleName = encodeURIComponent($('#articleName').val()); 
		var articleLink = encodeURIComponent($('#articleLink').val()); 
		console.log(centerName); 


		var baseURL = "https://docs.google.com/forms/u/7/d/e/1FAIpQLSdd8CruVCXXMDiq-WxI0LWfba46D_AxcDcIv1A1uWKBmbR_bg/formResponse?"; 
		var submitRef = "&submit=-2838550462772200653";
		var articleLinkID = "entry.1734546770"; 
		var articleNameID = "entry.1745447166"; 
		var centerNameID = "entry.2114019815"; 
		var centerEmailID = "entry.550354372"; 
		var requestReasonID = "entry.2009048180";

		var submitURL = baseURL + articleLinkID + "=" + articleLink + "&" + 
								   articleNameID + "=" + articleName + "&" +
								   centerNameID + "=" + centerName + "&" +
								   centerEmailID + "=" + centerEmail + "&" +
								   requestReasonID + "=" + requestReason + "&" +
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

	//https://docs.google.com/forms/d/e/1FAIpQLSdd8CruVCXXMDiq-WxI0LWfba46D_AxcDcIv1A1uWKBmbR_bg/viewform?usp=pp_url&entry.1745447166=hello&entry.2114019815&entry.550354372&entry.2009048180

}
