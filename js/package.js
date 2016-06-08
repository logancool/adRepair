function zipAll(fList) {

    var content = fList.generate({
        type: "blob"
    });

    // see FileSaver.js
    saveAs(content, "FT_repaired.zip");

}

function download(fn, zFList) {

    var content = zFList.generate({
        type: "blob"
    });

    // see FileSaver.js
    saveAs(content, fn);
}