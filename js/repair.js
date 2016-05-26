/**
 * The function that calls all repair task
 * @param file to repair
 * @returns true when finished
 */
function repair(file) {

    //variable holder for repaired zip file list
    var root = file;

    //initial and load file reader
    var reader = new FileReader();
    reader.onload = function (e) {

        //The list containing all the files in the zip
        var zFList = new JSZip(e.target.result);

        //TODO: better way to check manifest
        var manifestFound = false;

        for (var fn in zFList.files) {

            var file = zFList.files[fn];
            var hFN = findHtmlFN(root,zFList);


            /*-------BEGIN CHECKS -----*/
            if (isFLA(file)) {
                zFList.remove(file.name);
                log.message(root, file, "FLA file found and removed");
            }

            else if (isHTML(file)) {

                file.name = rmSpecialChars(root, file);

                if (hasInsecureAnimateCall(file)) {

                    log.error(root, file, "Replaced insecure call");

                    var fn = file.name;
                    var fc = replaceAnimateCall(file);

                    //replace content
                    zFList.remove(file.name);
                    zFList.file(fn,fc);

                    //reset file pointer
                    file = zFList.files[fn];
                    file.name = fn;
                }

                if (!(hasAPI(file))) {

                    log.error(root, file, "Api was not found");

                    //reset file content
                    fc = addAPI(file);

                    //replace file in list
                    zFList.remove(file.name);
                    zFList.file(fn,fc);

                    //reset file pointer
                    file = zFList.files[fn];
                    file.name = fn;
                }
            }

            else if (isManifest(file)) {

                var fn = file.name;
                var fc = matchManHTML(root, file, hFN); //ensure the manifest matches the html filename

                zFList.remove(file.name);
                zFList.file(fn,fc);

                manifestFound = true;

            }

            else if (isOSXFolder(file)) {

                zFList.remove(file.name);
                log.error(root, file, "Hidden folder found and removed");
            }
        }

        if (!(manifestFound)){

            //find the dimension in the zip file (if there is any)
            var dim = findManDim(root.name);

            //find the dimension in the html file name (if there is any)
            if (dim == null){
                dim = findManDim(hFN);
            }
            if (dim != null){

                var w = dim[1];
                var h = dim[2];

                //create the text
                var manT = createManT(file,w,h);

                //create the new file
                file = zFList.file("manifest.js", manT);

                //apply warnings if there's any validation issues
                valManDims(root, file, w,h);

            }
            else {
                //Display Manifest Modal
                createManModal();
                $('#manModal').modal('show');
            }
        }

        //print(messages);
        //print(warnings);
        //print(errors);

        /*---FINISH ZIPPING AND ALLOW DOWNLOAD --*/
        //makeZip();
        //download();
        report(root);

    };

    reader.readAsArrayBuffer(file);
}

//temp
function print(content) {
    console.log(content);
}