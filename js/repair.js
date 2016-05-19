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

        //The list containing all the files in the zip
        var zFList = new JSZip(e.target.result);

        for (var fn in zFList.files) {

            var file = zFList.files[fn];

            /*-------BEGIN CHECKS -----*/
            if (isFLA(file)) {
                zFList.remove(file.name);
                log.message(file, "FLA file found and removed");
            }

            //
            else if (isHTML(file)) {

                file.name = rmSpecialChars(file);

                if (hasInsecureAnimateCall(file)) {

                    log.error(file.name, "Replaced insecure call");


                    var fn = file.name;
                    var fc = replaceAnimateCall(file);

                    zFList.remove(file.name);
                    zFList.file(fn,fc);

                    file = zFList.files[fn];
                }



                if (!(hasAPI(file))) {

                    log.error(file, "Api was not found");

                    fc = addAPI(file);

                    zFList.remove(file.name);
                    zFList.file(fn,fc);

                    file = zFList.files[fn];
                }
            }

            else if (isManifest(file)) {

                var hFN = htmlFN(zFList);

                var fn = file.name;
                var fc = matchManHTML(file, hFN); //ensure the manifest matches the html filename

                zFList.remove(file.name);
                zFList.file(fn,fc);

            }

            else if (isOSXFolder(file)) {

                zFList.remove(file.name);
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
        //print(errors);

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