app.controller('MailerController', MailerController);

app.service('getMailersService', function($http, $q, $sce){
  let mailers = [];

  var loadMailers = function(){
    let deffered = $q.defer();
    const spreadsheetId = '1ApFCiULRH5KCC7tCcYG3678efLFeYxIORTwgnAGo5Vo';
    const url = "https://spreadsheets.google.com/feeds/list/"+ spreadsheetId +"/od6/public/values?alt=json-in-script";
    $sce.trustAsResourceUrl(url)
    $http.jsonp(url)
      .then(function(data, status){
        data = data.data;
        for(var i = 0; i < data.feed.entry.length; i++){
          var entry = data.feed.entry[i];
          var entryInfo = getEntryInfo(entry);
          mailers.push(entryInfo);
        }
        deffered.resolve();
      });
    return deffered.promise;
  }

  const getEntryInfo = function(entry){
    const entryInfo = {};
    entryInfo.name = entry.gsx$name.$t || '';
    entryInfo.link = entry.gsx$link.$t || '';
    return entryInfo;
  }

  const getMailersObject = function(){
    return mailers;
  }

  return {
    loadMailers,
    getMailersObject,
  }
});

MailerController.$inject = ['$scope', 'getMailersService', '$location'];
function MailerController($scope, getMailersService, $location){
  if($location.path() === '/mailers' || !$scope.activeMailer){
    getMailersService.loadMailers().then( () => {
      $scope.mailers = getMailersService.getMailersObject();
    });
  }

  $scope.goToMailer = function(currObj){
    var locationPath = $location.path().toString();
    $scope.activeMailer = currObj;
    $location.path(locationPath + '/ ' + currObj.name.replace(/ /g,"_")).replace();
  }
}
