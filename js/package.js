function zipAll(zList) {
    for (var i = 0; i < zList.length; i++) {
        var content = zList[i][1].generate({
            type: "blob"
        });

        // see FileSaver.js
        saveAs(content, zList[i][0]);
    }
}

function download(fn, zFList) {

    var content = zFList.generate({
        type: "blob"
    });

    // see FileSaver.js
    saveAs(content, fn);
}