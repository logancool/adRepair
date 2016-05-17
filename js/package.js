function makeZip() {
    /*
    var zip = new JSZip();

    for (var i = 0; i < files.length; i++) {
            zip.file(files[i].name, manifestText);
        } else {
            if (files[i].name.substring(0, 8) != "__MACOSX" && files[i].name != orgHTML && files[i].name.substr(files[i].name.length - 4) != "html" && fla <= -1) {
                zip.file(files[i].name, files[i].asUint8Array());
            }
        }
        if (manifestFound != true) {
            zip.file("manifest.js", newManifest);
        }
    }


    zip.file(mainHTML, htmlText);

    var content = zip.generate({
        type: "blob"
    });

    console.log("FILENAME: " + fileName)
    // see FileSaver.js

    zipArrayContent.push(content);
    zipArrayFilename.push(fileName);
    //saveAs(content, fileName);


    f++;
    var inputFile = document.getElementById("inputFile");
    if (f < inputFile.files.length) {
        inputFiles();
    }
    checkZip();
*/
}

function download() {
    var inputFile = document.getElementById("inputFile");
    for (var i = 0; i < inputFile.files.length; i++) {
        saveAs(zipArrayContent[i], zipArrayFilename[i]);
    }
}