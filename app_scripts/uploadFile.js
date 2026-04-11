/*
* Current located here: 
* https://script.google.com/u/2/home/projects/1YHb2k9KFY2LdkcsYvRBuB__cdgTeAP00lGpgiSY2KBW4Mz1uXxD_uyFR/edit
* centres.techsupport@srmd.org (password ask Nidhi for)
*/


var SPREADSHEET_FILE_ID = '1l_TfHmZoaDo5z4BuG22TM8cWTibNQJ076uGd6TKpaWc';
var SHEET_TO_WRITE_DATA = "Sheet1" ;
var ADMIN_EMAIL = "parima08@gmail.com";
var PR_EMAIL = 'centres@shrimadrajchandramission.org'; 
//var PR_SUPPORT_EMAIL = 'prsupport@shrimadrajchandramission.org'; 
var TECH_EMAIL = 'centres.techsupport@shrimadrajchandramission.org';
var SRD_EMAIL = 'technology@divinetouch.srmd.org';
var FOLDER_ID = '1huhnjlRvtpeIC4CPBuw1Qi7zb7NNL_TP';

function doGet(e){
  var params = JSON.stringify(e);
  Logger.log("params " + params.toString()); 
  var data = params["data"];
  //var filename =...;
  //var blob = Maps.newStaticMap().setCenter('76 9th Avenue, New York NY').getBlob();
  uploadFile(data); 
}

function doPost(e) {
  try{
    Logger.log("e: " + JSON.stringify(e) );
    var fileName = e.parameter.fileName || "hello";
    Logger.log("Filename is: " + fileName); 
    var file = e.parameter.file;
    //var section = e.parameter.section || "other";
    var uploader = "unknown";
    if(e.parameter.uploader){
      uploader = e.parameter.uploader; 
    };
    var userEmail = "unknown";
    if(e.parameter.userEmail){
       userEmail = e.parameter.userEmail; 
    }
    Logger.log("Uploader: " + uploader); 
    Logger.log("Email: " + userEmail);
    var newFileName = fileName + " - " + uploader;
    uploadFile(file, newFileName, uploader, userEmail, fileName);
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  catch(error){
    email();
    return ContentService.createTextOutput("NOT OK").setMimeType(ContentService.MimeType.JAVASCRIPT);   
  }
}

function uploadFile(data, fileName, uploader, userEmail, orginalFileName) {
  
  try {
    //https://drive.google.com/open?id=
    //var mFolderId = "0B-Hig070yW4KczFiNExjcnVqVlE";
    var mFolderId = FOLDER_ID;
    var folder = DriveApp.getFolderById(mFolderId);
    
    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7), Utilities.Charset.UTF_8),
        blob = Utilities.newBlob(bytes, contentType, fileName),
        file = folder.createFile(blob);
    
    var fileLink = file.getUrl(); 
    Logger.log("File link: " + fileLink); 
    
    
    Logger.log("Type of file " + contentType); 
    
    //var blobNew = Utilities.newBlob(data);
    //var translatedData = Blob.setDataFromString(data)
    //var file = folder.createFile(fileName, blobNew);    
    
    //file.setDescription("Uploaded by " + form.myName);
    Logger.log("Successfully uploaded this file");    
    
    writeToFile(fileLink, uploader, userEmail, orginalFileName); 
    
    //return "File uploaded successfully " + file.getUrl();
    
  } catch (error) {
    Logger.log("Could not upload the file: " + error.toString());
    email(); 
    return ContentService.createTextOutput("NOT OK").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  
  try{
    emailSuccess(uploader, userEmail, fileLink, PR_EMAIL);
    //emailSuccess(uploader, userEmail, fileLink, PR_SUPPORT_EMAIL); 
    emailSuccess(uploader, userEmail, fileLink, TECH_EMAIL); 
    emailSuccess(uploader, userEmail, fileLink, ADMIN_EMAIL); 
    if(userEmail.indexOf("srdivinetouch") > -1){
      Logger.log("Going to email the SRD EMAIL");
      emailSuccess(uploader, userEmail, fileLink, SRD_EMAIL);
    };
    return ContentService.createTextOutput("OK").setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  catch(error){
    Logger.log("Could not send email: " + error.toString());
    email(); 
    return ContentService.createTextOutput("NOT OK").setMimeType(ContentService.MimeType.JAVASCRIPT);
  } 
}

function writeToFile(fileLink, uploader, userEmail, fileName){
  var innerArray = [];  
  var timeStamp = new Date();
  innerArray.push(timeStamp); 
  innerArray.push(uploader); 
  innerArray.push(userEmail); 
  innerArray.push(fileLink);
  innerArray.push(fileName);
  var ss = SpreadsheetApp.openById(SPREADSHEET_FILE_ID); 
  var sheet = ss.getSheetByName(SHEET_TO_WRITE_DATA);//Set name in Code.gs file
  sheet.appendRow(innerArray);
}

function email(){
    var subject = 'Google Drive Error Log';
    var body = Logger.getLog();
    MailApp.sendEmail(ADMIN_EMAIL, subject, body);
}

function emailSuccess(uploader, userEmail, fileLink, toEmail){
   var subject = 'New Design Studio Asset created by ' + uploader;
   var body = "Hello, <br /> You can view the new uploaded image here: " +  fileLink;
   body = body + "<br /> In case there are any issues with the image, please email the creator here: " + userEmail; 
   body = body + "<br /> Thank you!" 
   MailApp.sendEmail({
     to: toEmail,
     subject: subject,
     htmlBody: body,
   });
}
