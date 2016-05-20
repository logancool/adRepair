function makeZip(zFList) {

    var zip = new JSZip();

    var content = zip.generate({
        type: "blob"
    });

    // see FileSaver.js

    //zipArrayContent.push(content);
    //zipArrayFilename.push(fileName);
    //saveAs(content, fileName);

}

function download() {
    var inputFile = document.getElementById("inputFile");
    for (var i = 0; i < inputFile.files.length; i++) {
        saveAs(zipArrayContent[i], zipArrayFilename[i]);
    }
}