// ---- HELPERS -- //

/**
 * Helper function returning the file ext string
 */
function getFileExt(file) {
    //this.file = file;
    return file.name.split('.').pop();
}

/**
 * @return true if the @param file is an html file
 */
function isHTML(file){
    return (file.name.lastIndexOf(".html") > -1);
}

/**
 * @return true if the @param file is a directory
 */
function isDir(file){
    return false;
}

/**
 * @param file to check is manifest
 * @return true if the file is named manifest.js
 */
function isManifest(file){
    return (file.name == "manifest.js");
}

/**
 * @returns true if the file is an fla
 */
function isFLA(file) {
    //Check for FLA
    return (file.name.lastIndexOf(".fla") > -1);
}

/**
 * returns true if the file is a hidden MACOSX folder
 */
function isOSXFolder(file) {
    return (!(file.name.substr(file.name.lastIndexOf("/") - 8, 8) == "__MACOSX"));
}

/**
 * @param the file to check for animate call
 * @return true if there is an http://animate call
 */
function hasInsecureAnimateCall(file) {

    var htmlText = file.asText();
    return (htmlText.lastIndexOf("http://animate.adobe.com/") > -1);
}

/**
 * Searches file for api reference
 * @param file to search
 * @returns true if file contains the ft api
 */
function hasAPI(file) {
    var htmlText = file.asText();
    if (htmlText.lastIndexOf("html5API.js") > -1) {
        return true;
    }
}

/**
 * adds the ft api to the file directly below the body tag
 * @param file to add api to
 * @returns updated file with the api script tag added
 */
function addAPI(file) {
    var htmlText = file.asText();
    htmlText.lastIndexOf("<");
    return htmlText;
}

/**
 * removes any extension behind
 * @param file to remove ext
 * @returns file name without extension
 */
function removeExtension(file){
    var lastDotPosition = file.name.lastIndexOf(".");
    if (lastDotPosition === -1) return file.name;
    else return file.name.substr(0, lastDotPosition);
}

/**
 * Removes all non A-Z, 0-9 non-sensitive chars
 * @param filename - original string containing possible removable chars
 * @return reformatted filename
 */
function rmSpecialChars(file) {

    //store as a new var to see if the filename has been altered
    var newFN = file.name.split(' ').join('_');

    if (newFN != file.name) {
        log.message(file, "Found and removed whitespace");
    }

    newFN = file.name.replace(/[^\w.-]+/g, "");

    if (newFN != file.name) {
        log.message(file, "Found and removed special characters");
    }

    return newFN;
}

/**
 * replaces the insecure animate string with a secure one
 * @param file to replace
 * @returns updated htmlText of file containing a secure call
 */
function replaceAnimateCall(file) {
    var end = htmlText.lastIndexOf("</html>")
    var animateReplace = "https://animate.adobe.com/"
    htmlText = [htmlText.slice(0, animate - 1), '"' + animateReplace, htmlText.slice(animate + animateReplace.length - 1, end + 7)].join('');
    return htmlText;
}

/**
 * finds redundant subfolders
 * @param file
 */
function findSubFolder(file) {
    //FIND SUBFOLDER INDEX
    if (subfolder) {
        for (var f = 0; f < files.length; f++) {
            if (files[f].name == subfolderName + "/") {
                subfolderIndex = f;
                break;
            }
        }
    }
}

/**
 * set the HTML filename to be compared against the manifest file;
 * @returns the html filename
 */
function htmlFN(zFList) {
    var htmlFN;
    for (var fn in zFList.files) {
        if ((fn.lastIndexOf('.html') > -1) && fn[0] != '_'){
            htmlFN = fn;
        }
    }
    return htmlFN;
}

/**
 * checks if the html filename matches the manifest.js reference
 * @param man the manifest file to look inside
 * @param html the html file to check the name of
 * @returns true if the html matches the manifest reference
 */
function manMatchesHTML(man, htmlFN) {

        var manT = man.asText();
        var manFN = manT.match(/"filename":".*"/);
        print(manFN);
}

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
            //  document.getElementById("manifestDialog").innerHTML = "No manifest ` was detected in your adfile. Please enter the width and height for the adfile below:<br><br>" + fileName;
            //  console.log("file name for manifest: " + fileName);
            //  $("#dialog").dialog("open");
        }
        newManifest = 'FT.manifest({\n"filename": "' + htmlFile + '",\n"width": ' + width + ',\n"height": ' + height + ',\n"clickTagCount": 1\n});'
    }
}

/**
 * creates the Manifest Modal and hides it
 */
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

/**
 * Validates the users input for width and height, checking if the values are common
 * and returning the appropriate warning/error
 */
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

// --- END HELPERS --- //