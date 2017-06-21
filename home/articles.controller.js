
var app = angular.module('myApp'); 

app.controller('ArticlesController', ArticlesController);

app.service('articleDetailsService', function($http, $q, $sce){
	var articlesData = []; 

	var loadArticleInfoAsync = function(spreadsheetId){
		console.log("loadArticleInfoAysnc");
		var deffered = $q.defer();
		var url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/od6/public/values?alt=json-in-script"
  		$sce.trustAsResourceUrl(url)
  		$http.jsonp(url)
			.then(function(data, status){
				data = data.data;  
				for(var i = 0; i < data.feed.entry.length; i++){
					var articleInfo = {}
					var article = data.feed.entry[i]; 
					articleInfo.name = article.gsx$name.$t ? article.gsx$name.$t : ""; 
					articleInfo.month = article.gsx$month.$t ? article.gsx$month.$t : ""; 
					articleInfo.year = article.gsx$year.$t ? article.gsx$year.$t : ""; 
					articleInfo.wordCount = article.gsx$wordcount.$t ? article.gsx$wordcount.$t : ""; 
					articleInfo.magazineSection = article.gsx$magazinesection.$t ? article.gsx$magazinesection.$t : ""; 
					articleInfo.category = article.gsx$category.$t ? article.gsx$category.$t : ""; 
					articleInfo.subcategory =article.gsx$subcategory.$t ? article.gsx$subcategory.$t : ""; 
					articleInfo.langauge = article.gsx$language.$t ? article.gsx$language.$t : ""; 
					articleInfo.articleLink = article.gsx$articlelink.$t ? article.gsx$articlelink.$t : ""; 
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

	return {
		loadArticleInfoAsync: loadArticleInfoAsync, 
		getArticlesData: getArticlesData
	}
}); 

ArticlesController.$inject = ['$scope', '$rootScope', '$location', '$http', 
						'$sce', 'articleDetailsService', 'pageDetails']; 
function ArticlesController($scope, $rootScope, $location, 
	$http, $sce, articleDetailsService, pageDetails){
	console.log("Articles Controller"); 
	$scope.title = "Articles Page";
	var spreadsheetId = pageDetails['articles'].spreadsheetId;
	console.log("SpreadsheetId: " + spreadsheetId); 
	articleDetailsService.loadArticleInfoAsync(spreadsheetId).then(function(){
		$scope.articles = articleDetailsService.getArticlesData(); 
	});
}