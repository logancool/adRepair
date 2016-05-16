function createManifest() {
    //IF NO MANIFEST EXISTS CREATE ONE
    var width = "";
    var height = "";

    var indices = [];
    var indices2 = [];

    for (var d = 0; d < fileName.length; d++) {
        if (fileName[d] === "x") indices.push(d);
    }

    for (var c = 0; c < mainHTML.length; c++) {
        if (mainHTML[c] === "x") indices2.push(c);
    }
    if (manifestFound != true) {
        noManifestFound = true;
        //CHECK MAIN FILE NAME FOR DIMENSIONS
        for (x = 0; x < indices.length; x++) {
            if (Number(fileName.substr(indices[x] - 3, 3) % 1) == 0) {
                width = fileName.substr(indices[x] - 3, 3);
            }
            //Check 2 or 3 characters past the x to determine the height
            if (Number(fileName.substr(indices[x] + 1, 3) % 1) == 0 && fileName[indices[x] + 3] != ".") {
                height = fileName.substr(indices[x] + 1, 3);
                fileName[indices[x] + 3]
            } else if (Number(fileName.substr(indices[x] + 1, 2) % 1) == 0) {
                height = fileName.substr(indices[x] + 1, 2);
            }
        }
        //CHECK MAIN HTML FILE NAME FOR DIMENSIONS
        for (var y = 0; y < indices2.length; y++) {
            if (Number(mainHTML.substr(indices2[y] - 3, 3) % 1) == 0 && width == "") {
                width = mainHTML.substr(indices2[y] - 3, 3);
            }
            //Check 2 or 3 characters past the x to determine the height
            if (height == "") {
                if (Number(mainHTML.substr(indices2[y] + 1, 3) % 1) == 0 && mainHTML[indices2[y] + 3] != ".") {
                    height = mainHTML.substr(indices2[y] + 1, 3);
                } else if (Number(mainHTML.substr(indices2[y] + 1, 2) % 1) == 0) {
                    height = mainHTML.substr(indices2[y] + 1, 2);
                }
            }
        }
        if (width == "" && height == "") {
            // document.getElementById("background").style.display = "block";
            //  document.getElementById("manifestDialog").innerHTML = "No manifest file was detected in your adfile. Please enter the width and height for the adfile below:<br><br>" + fileName;
            //  console.log("file name for manifest: " + fileName);
            //  $("#dialog").dialog("open");
        }
        newManifest = 'FT.manifest({\n"filename": "' + htmlFile + '",\n"width": ' + width + ',\n"height": ' + height + ',\n"clickTagCount": 1\n});'
    }
}

//Create Mainfest Modal
function createManModal() {
    // Get the modal
    var modal = document.getElementById('qModal');

    // Get the button that opens the modal
    var btn = document.getElementById("qBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

//Validate Manifest Dimensions
function valManDims() {

    //returns true if the value is in the array
    function isIn(value, array) {
        if (array.indexOf(value) != -1) {
            return true;
        }
        else {
            return false;
        }
    }

    //returns if the width or height (dim) is a common dimension (value)
    function isCommonDim(dim, value) {
        if (dim == 'manW') {
            var commonW = [1, 88, 120, 120, 125, 160, 180, 234, 240, 250, 300, 336, 468, 728];
            if (isIn(value, commonW)) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (dim == 'manH') {
            var commonH = [1, 31, 60, 90, 125, 150, 240, 250, 280, 400, 600];
            if (isIn(value, commonH)) {
                return true;
            }
            else {
                return false;
            }
        }
        else return false;
    }

    $('#manModal').formValidation({
        framework: 'bootstrap',
        icon: {
            valid: 'glyphicon glyphicon-ok',
            invalid: 'glyphicon glyphicon-remove',

            validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
            manW: {
                validMessage: 'Warning: the value entered is an uncommon width',
                validators: {
                    notEmpty: {
                        message: 'A width is required'
                    },
                    between: {
                        min: 1,
                        max: 9999,
                        message: 'The width must be a number between 1 and 9999'
                    },
                    integer: {
                        min: 0,
                        message: 'The value is not an integer',
                        // The default separators
                        thousandsSeparator: '',
                        decimalSeparator: '.'
                    }
                }
            },
            manH: {
                validMessage: 'Warning: the value entered is an uncommon height',
                validators: {
                    notEmpty: {
                        message: 'A height is required'
                    },
                    between: {
                        min: 1,
                        max: 9999,
                        message: 'The height must be a number between 1 and 9999'
                    },
                    integer: {
                        min: 0,
                        message: 'The value is not an integer',
                        // The default separators
                        thousandsSeparator: '',
                        decimalSeparator: '.'
                    },
                    // The warning message
                    warning: {
                        message: 'Warning: the value entered is an uncommon height'
                    }
                }
            }
        }
    });
    // This event will be triggered when the field passes given validator
    $('#manModal').on('success.field.fv', function (e, data) {

        // Mark the field as invalid
        function addWarning(data) {
            data.element
                .closest('.form-group')
                .removeClass('has-success')
                .addClass('has-warning help-block validMessage')
            //add message
            var $span = $('<small/>')
                .attr('data-field', data.field)
                .insertAfter(data.element);
            // Retrieve the valid message via getOptions()
            var message = data.bv.getOptions(data.field).validMessage;

            if (message) {
                $span.html(message);
            }
        }

        function removeWarning(data) {
            data.element     // Get the field element
                .closest('.form-group')     // Get the field parent
                .removeClass('has-warning help-block validMessage') //remove the warning
                .addClass('has-success') // add success!
        }

        //The live value of the users input
        var input = parseInt(data.element[0].value);

        //check if there's warnings for either field
        if (!(isCommonDim(data.field, input))) {
            // The width is not common - add warning
            addWarning(data);
        }
        //reset to green
        else {
            removeWarning(data);
        }
    });
}

function repair(file) {

    //variable holder for repaired zip file list
    var rFiles = [];

    //initial and load file reader
    var reader = new FileReader();
    reader.onload = function (e) {

        var zFList = new JSZip(e.target.result);

        for (var filename in zFList.files) {
            //TODO: check filename for each file in list
            var file = zFList.files[filename];

            /*-------BEGIN CHECKS -----*/

            if (isFLA(file)){
                log.message("FLA file found and removed");
                //continue?
            }

            //
            else if (isHTML(file)){
                rmSpecialChars(file);
                if (hasHtmlAnimateCall(file) && !(animateCallIsSecure(file))){
                    //replaceAnimateCall(file);
                    log.error(file, "Replaced insecure call")
                }
                if (!(hasAPI(file))){
                    //addAPI(file);
                    log.error(file, "Api was not found")
                }
            }

            //
            else if (isManifest(file)){
                if (!(manMatchesHTML(file, htmlFN))){
                    log.error(file, "Manifest filename did not match html filename");
                }
            }

            else if (isOSXFolder(file)) {
                //removeOSXFolder(file);
                log.error(file, "Hidden folder found and removed");
            }

            else if (isDir(file)){
                findSubFolder(file);
                log.warning(file, "Nested directory was found and was updated to root")
            }

            //Push each file being repaired into an array called rFiles
            rFiles.push(file);

        }
        if (noManifest()){
            //createManifest();
            createManModal();
            valManDims();
        }

        /*---FINISH ZIPPING AND ALLOW DOWNLOAD --*/
        makeZip();
        checkZip();
        download();
    };
    reader.readAsArrayBuffer(file);
}