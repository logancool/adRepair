var errors = warnings = messages = {};
var log = {
    error: function (file, message) {
        //if array is empty, create it
        if (errors[file.name] == null) {
            errors[file.name] = [];

        }
        errors[file.name].push(message);
    },
    warning: function (file, message) {
        //if array is empty, create it
        if (warnings[file.name] == null) {
            warnings[file.name] = [];
        }
        warnings.push(file.name, message);
    },
    message: function (file, msg) {
        //if array is empty, create it
        if (errors[file.name] == null) {
            errors[file.name] = [];
        }
        messages[file.name].push(msg);
    }
};

function generateErrors() {

    var errorList = document.getElementById("errorList");
    var mainErrors = document.getElementById("mainErrors");
    var check = document.getElementById("check");
    var uploadMessage = document.getElementById("uploadMessage");
    var downloadButton = document.getElementById("download");

    if (subfolder) {
        problems.push("Subfolders detected and removed");
    }
    if (specialCharacters) {
        problems.push("Special characters found and removed");
    }
    if (whiteSpace) {
        problems.push("Whitespaces found and removed")
    }
    if (noManifestFound) {
        problems.push("No manifest file found");
    }
    if (fileNameMismatch) {
        problems.push("Filename mismatch found");
    }
    if (nonSecureCalls) {
        problems.push("Nonsecure Edge Animate call detected and replaced")
    }
    if (flaFound) {

    }

    if (apiArray.length >= 1 && f > apiArray.length) {
        uploadMessage.innerHTML = "Upload the following files to the <b>Base Files</b> tab:<br><br>";
        for (var aa = 0; aa < apiArray.length; aa++) {
            uploadMessage.innerHTML += '<span style="font-size:13px">' + apiArray[aa] + '</span><br>';
        }
        uploadMessage.innerHTML += "<br>Upload the following files to the <b>Standard Ads</b> tab:<br><br>";
        for (var aa = 0; aa < nonApiArray.length; aa++) {
            uploadMessage.innerHTML += '<span style="font-size:13px">' + nonApiArray[aa] + '</span><br>';
        }
        uploadMessage.innerHTML += "<br>"
    }
    if (apiArray.length > 1 && f == apiArray.length) {
        uploadMessage.innerHTML = "Please upload your files to the <b>Base Files</b> tab";
    }
    if (apiArray.length == 1 && f == 1) {
        uploadMessage.innerHTML = "Please upload your file to the <b>Base Files</b> tab";
    }
    if (apiArray.length < 1) {
        if (f > 1) {
            uploadMessage.innerHTML = "Please upload your files to the <b>Standard Ads</b> tab";
        } else {
            uploadMessage.innerHTML = "Please upload your file to the <b>Standard Ads</b> tab";
        }
    }


    TweenLite.to(check, 1, {
        alpha: 1,
        ease: Power2.easeOut
    });
    TweenLite.to(check, .8, {
        scaleX: 0,
        ease: Power4.easeIn,
        delay: .2
    });
    TweenLite.to(check, .5, {
        scaleX: 1,
        ease: Power4.easeOut,
        delay: 1
    });
    TweenLite.to(mainErrors, .5, {
        alpha: 1,
        delay: 1
    });
    TweenLite.to(errorList, .5, {
        alpha: 1,
        delay: 1.5
    });
    TweenLite.to(uploadMessage, .5, {
        alpha: 1,
        delay: 1.8
    });
    if (problems.length > 0) {
        downloadButton.style.display = "block";
        TweenLite.to(downloadButton, .5, {
            alpha: 1,
            delay: 2
        });
    }

    checkAnimated = true;

    if (problems.length == 1) {
        mainErrors.innerHTML += problems.length + " issue detected and resolved<br><b>";
    }
    if (problems.length > 1) {
        mainErrors.innerHTML += problems.length + " issues detected and resolved<br><b>";
    }
    if (problems.length <= 0) {
        mainErrors.innerHTML += "No issues detected";
    }
    for (e = 0; e < problems.length; e++) {
        errorList.innerHTML += problems[e] + "<br>";
    }
}
