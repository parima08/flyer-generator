app.controller('MailerController', MailerController);

app.service('getMailersService', function($http, $q, $sce){
  let mailers;
  let html;

  const loadMailers = function(){
    mailers = [];
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

  const loadMailer = function(link){
    const url = 'https://s3.amazonaws.com/srmd-flyer-generator/' + link;
    let deffered = $q.defer();
    //$sce.trustAsResourceUrl(url);
    $http.get(url)
      .then(function(data, status){
        html = data;
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

  const getHtml = function(){
    return html;
  }

  return {
    loadMailers,
    getMailersObject,
    loadMailer,
    getHtml,
  }
});

let mailers;
let activeMailers;
MailerController.$inject = ['$scope', 'getMailersService', '$location', 
  '$rootScope', '$http' ];
function MailerController($scope, getMailersService, $location, $rootScope, $http){
  let values = {};
  let html;

  if(!mailers && $location.path() === '/mailers'){
    getMailersService.loadMailers().then( () => {
      mailers = getMailersService.getMailersObject();
      $scope.mailers = mailers;
    });
  }
  //don't reload the mailers
  else if(mailers && $location.path() === '/mailers'){
    $scope.mailers = mailers;
  }
  //load the individual mailer:
  else if(activeMailer){
    getMailersService.loadMailer(activeMailer.link).then( () => {
      console.log(activeMailer);
      $scope.title = activeMailer.name;
      html = getMailersService.getHtml().data;
      const formEl = $(html).find('[data-form]');
      $scope.formInfo = [];
      for(el of formEl){
        const field = {};

        const formLabel = $(el).data('form');
        console.log('form-label', formLabel);

        field.id = formLabel;
        field.fieldName = formLabel;
        field.placeholderText = $(el).text();

        $scope.formInfo.push(field);
      }
      console.log($scope.formInfo);
    });
  }
  else{
    console.log("Default - should redirect back to a known path");
  }

  $scope.goToMailer = function(currObj){
    console.log("goToMailer");
    var locationPath = $location.path().toString();
    activeMailer = currObj;
    console.log($scope.activeMailer);
    $location.path(locationPath + '/ ' + currObj.name.replace(/ /g,"_")).replace();
  }

  $scope.submitForm = () =>{
    $.each($('#myForm').serializeArray(), function(i, field) {
        values[field.name] = field.value;
    });
    $html = $(html);
    console.log(values);
    const newHtml = $html.find('[data-form]').map( (i, el) => {
      const newText = Object.values(values)[i]
      $(el).text(newText);
    });

    //converts it back into HTML
    const mailerHtml = $('<div />').append($html.clone()).html();
    sendToMailer(mailerHtml);
  }

  function sendToMailer(newHtml) {
    var url = "https://script.google.com/a/shrimadrajchandramission.com/macros/s/AKfycbzNUPWgJEBYOkVtjejxgOyQUSJaEHyRu6a7TJl02R9tiniqYBn0/exec"
    var data = $.param({
        userEmail: $rootScope.loggedInUser.fullName,
    });
    var config = {
        headers : {
          'Content-Type': 'application/json',
        }
    }
    $http.post(url, data).then( () => {
      console.log("returned from posting");
    })
  }
}


