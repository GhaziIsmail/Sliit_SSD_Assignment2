$(document).ready(function(){
    

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const redirecting_uri = "https://localhost/oauth_assignment/DriveUpload/Upload.html" // the redirect uri;
    const clientSecret = "2gKk2wmMv-fVlSc4tt5msf0p"; //client secret
    const drive_scope = "https://www.googleapis.com/auth/drive";
    var access_token= "";
    var clientID = "391288600919-j8hdeut0bslb4s0094l97uaic29k5adg.apps.googleusercontent.com"//client id;
    

    $.ajax({
        type: 'POST',
        url: "https://www.googleapis.com/oauth2/v4/token",
        data: {code:code
            ,redirect_uri:redirecting_uri,
            client_secret:clientSecret,
        client_id:clientID,
        scope:drive_scope,
        grant_type:"authorization_code"},
        dataType: "json",
        success: function(resultData) {
                       
           localStorage.setItem("accessToken",resultData.access_token);
           localStorage.setItem("refreshToken",resultData.refreshToken);
           localStorage.setItem("expires_in",resultData.expires_in);
           window.history.pushState({}, document.title, "/GitLoginApp/" + "upload.html");
              
        }
  });

    var Upload = function (file) {
        this.file = file;
    };
    
    Upload.prototype.getType = function() {
        localStorage.setItem("type",this.file.type);
        return this.file.type;
    };
    Upload.prototype.getSize = function() {
        localStorage.setItem("size",this.file.size);
        return this.file.size;
    };
    Upload.prototype.getName = function() {
        return this.file.name;
    };
    Upload.prototype.doUpload = function () {
        var that = this;
        var form_the_Data = new FormData();
    
        form_the_Data.append("file", this.file, this.getName());
        form_the_Data.append("upload_file", true);
    
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Bearer" + " " + localStorage.getItem("accessToken"));
                
            },
            url: "https://www.googleapis.com/upload/drive/v2/files",
            data:{
                uploadType:"media"
            },
            xhr: function () {
                var my_Xhr = $.ajaxSettings.xhr();
                if (my_Xhr.upload) {
                    my_Xhr.upload.addEventListener('progress', that.handlingProgress, false);
                }
                return my_Xhr;
            },
            success: function (data) {
                console.log(data);
            },
            error: function (error) {
                console.log(error);
            },
            async: true,
            data: form_the_Data,
            cache: false,
            contentType: false,
            processData: false,
            timeout: 60000
        });
    };

    function doIncrement(increment) {
        w = parseInt(document.getElementById('progressBar').style.width);
        document.getElementById('progressBar').style.width= (w + increment) +'%';
        $("#progressBar")
        .text((w + increment)+"% Complete");
      }
      
    Upload.prototype.handlingProgress = function (event) {
        var percentage = 0;
        var position = event.loaded || event.position;
        var tot = event.total;
        var progressBarID = "#progressBar";
        if (event.lengthComputable) {
            percentage = Math.ceil(position / tot * 100);
            setTimeout(doIncrement(percentage),1000);
        }
        // update progressbars classes so it fits your code
       // $(progressBarID + " .progress-bar").css("width", +percentage + "%");
       // $(progressBarID + " .status").text(percentage + "%");
    };

    $("#upload").on("click", function (e) {
        var file = $("#files")[0].files[0];
        var fileUpload = new Upload(file);
       
        // execute upload
        fileUpload.doUpload();
    });
    
});