function makeZip() {

    var zip = new JSZip();

    if (subfolder != true) {
        for (i = 0; i < files.length; i++) {
            var fla = files[i].name.lastIndexOf(".fla");
            if (manifestWrite == true && files[i].name == manifestFile) {
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
    } else {
        console.log("SUBFOLDER NAME: " + subfolderName)
        for (i = 0; i < files.length; i++) {
            var fla = files[i].name.lastIndexOf(".fla");
            if (manifestWrite == true && files[i].name == manifestFile) {
                zip.file(files[i].name.substring(subfolderName.length + 1), manifestText);
            } else {
                if (files[i].name.substr(macIndex, 8) != "__MACOSX" && files[i].name.substr(0, 8) != "__MACOSX" && files[i].name != orgHTML && files[i].name.substr(files[i].name.length - 4) != "html" && files[i].name != subfolderName + "/" && fla <= -1) {
                    zip.file(files[i].name.substring(subfolderName.length + 1), files[i].asUint8Array());
                }

            }
            if (manifestFound != true) {
                zip.file("manifest.js", newManifest);
            }
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

}

function download() {
    var inputFile = document.getElementById("inputFile");
    for (var i = 0; i < inputFile.files.length; i++) {
        saveAs(zipArrayContent[i], zipArrayFilename[i]);
    }
}