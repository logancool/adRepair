/**
 * The function that zips all the zip files repaired and downloads them to the user
 * @param zList the list of JSZip objects with their names
 */
function zipAll(zList) {
    for (var i = 0; i < zList.length; i++) {
        var content = zList[i][1].generate({
            type: "blob"
        });

        // see FileSaver.js
        saveAs(content, zList[i][0]);
    }
}

/**
 * Downloads the file given (used when clicking the download glyphicon on the right part of the content node
 * @param fn the filename to call the zip
 * @param zFList the JSZip object to convert to zip
 */
function download(fn, zFList) {

    var content = zFList.generate({
        type: "blob"
    });

    // see FileSaver.js
    saveAs(content, fn);
}