function zipAll(zFList) {

    var content = zFList.generate({
        type: "blob"
    });

    // see FileSaver.js
    saveAs(content, "FT_repaired.zip");

}

function download(fn, zFList) {
    print(zFList);

    var content = zFList.generate({
        type: "blob"
    });

    // see FileSaver.js
    saveAs(content, fn);
}