$(document).ready(function(){
     
    // client id 
    var clientId = "391288600919-j8hdeut0bslb4s0094l97uaic29k5adg.apps.googleusercontent.com";

    // redirect_uri
    var redirecting_uri = "https://localhost/oauth_assignment/DriveUpload/Upload.html";

    // scope 
    var drive_scope = "https://www.googleapis.com/auth/drive";

    // the url to which the user is redirected to
    var url = "https://localhost/oauth_assignment/DriveUpload/Upload.html";


    // Button event listner
    $("#login").click(function(){

       // invoke signIn method
       signIn(clientId,redirecting_uri,drive_scope,url);

    });

    function signIn(clientId,redirecting_uri,drive_scope,url){
 
       url = "https://accounts.google.com/o/oauth2/v2/auth?redirect_uri="+redirecting_uri
       +"&prompt=consent&response_type=code&client_id="+clientId+"&scope="+drive_scope
       +"&access_type=offline";

       window.location = url;
    }



});