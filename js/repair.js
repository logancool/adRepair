/**
 * The function that calls all repair task
 * @param file to repair
 * @returns true when finished
 */
function repair(file) {

    //variable holder for repaired zip file list
    var rFiles = [];

    //initial and load file reader
    var reader = new FileReader();
    reader.onload = function (e) {

        var zFList = new JSZip(e.target.result);

        for (var fn in zFList.files) {

            var file = zFList.files[fn];

            /*-------BEGIN CHECKS -----*/
            if (isFLA(file)) {
                zFList.remove(file);
                log.message("FLA file found and removed");
            }

            //
            else if (isHTML(file)) {

                file.name = rmSpecialChars(file);

                if (hasInsecureAnimateCall(file)) {
                    replaceAnimateCall(file);
                    log.error(file, "Replaced insecure call")
                }
                if (!(hasAPI(file))) {
                    addAPI(file);
                    log.error(file, "Api was not found")
                }
            }

            else if (isManifest(file)) {
                if (!(manMatchesHTML(htmlFN(),file))) {
                    log.error(file, "Manifest filename did not match html filename");
                }
            }

            else if (isOSXFolder(file)) {
                //removeOSXFolder(file);
                log.error(file, "Hidden folder found and removed");
            }

            else if (isDir(file)) {
                findSubFolder(file);
                log.warning(file, "Nested directory was found and was updated to root")
            }

            //Push each file being repaired into an array called rFiles
            rFiles.push(file);

        }

        //print(messages);
        //print(warnings);
        print(errors);

        /*---FINISH ZIPPING AND ALLOW DOWNLOAD --*/
        makeZip();
        download();
    };

    reader.readAsArrayBuffer(file);
}

//temp
function print(content) {
    console.log(content);
}