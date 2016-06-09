//common dimensions (value)
var COMMON_WIDTH = [1, 88, 120, 120, 125, 160, 180, 234, 240, 250, 300, 336, 468, 728];
var COMMON_HEIGHT = [1, 31, 60, 90, 125, 150, 240, 250, 280, 400, 600];
var noWarning = [true, true];

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
function isHTML(file) {
    return (file.name.lastIndexOf(".html") > -1);
}

/**
 * @return true if the @param file is a directory
 */
function isDir(file) {

    return false;
}

/**
 * @param file to check is manifest
 * @return true if the file is named manifest.js
 */
function isManifest(file) {
    return (file.name === "manifest.js");
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
    return (file.name.startsWith('__MACOSX'));
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

    var api = "\<script src=\"http://cdn.flashtalking.com/frameworks/js/api/2/10/html5API.js\"></script>";
    var bodyMatch = file.asText().match(/(<body.*>)/gm);
    if (bodyMatch) {
        return file.asText().replace(/(<body.*>)/gm, bodyMatch + api);
    }
    else {
        return file.asText();
    }
}

/**
 * removes any extension behind
 * @param file to remove ext
 * @returns file name without extension
 */
function removeExtension(fn) {
    var lastDotPosition = fn.lastIndexOf(".");
    if (lastDotPosition === -1) return fn;
    else return fn.substr(0, lastDotPosition);
}

/**
 * Removes all non A-Z, 0-9 non-sensitive chars
 * @param filename - original string containing possible removable chars
 * @param root the root file to link in the log
 * @return reformatted filename
 */
function rmSpecialChars(root, file) {

    //store as a new var to see if the filename has been altered
    var wsFN = file.name.split(' ').join('_');

    if (wsFN != file.name) {
        log.message(root, file.name, "Found and replaced whitespace with underscore");
    }
    var wsFN = file.name.split(' ').join('_');
    var spFN = wsFN.replace(/[^\w.-]+/g, "");

    if (spFN != wsFN) {
        log.message(root, file.name, "Found and removed special characters");
    }
    return spFN;
}

/**
 * Removes any characters that are not 0-9 or a-z or .,/ in the string
 * @param fn the filename to reformat
 * @returns {string} the formmated string
 */
function rmSC(fn){
    return fn.split(' ').join('_').replace(/[^\w.-]+/g, "");
}

/**
 * replaces the insecure animate string with a secure one
 * @param file to replace
 * @returns updated htmlText of file containing a secure call
 */
function replaceAnimateCall(file) {
    return file.asText().replace("http://animate.adobe.com/", "https://animate.adobe.com/");
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
function findHtmlFN(root, zFList) {
    var htmlFN;
    for (var fn in zFList.files) {
        if ((fn.lastIndexOf('.html') > -1) && fn[0] != '_') {
            htmlFN = rmSpecialChars(root, zFList.files[fn]);
            zFList.files[fn].name = htmlFN;
        }
    }
    return htmlFN;
}

/**
 * checks if the html filename matches the manifest.js reference
 * if it doesn't it will match it
 * @param man the manifest file to look inside
 * @param html the html file to check the name of
 * @returns true if the html matches the manifest reference
 */
function matchManHTML(root, man, htmlFN) {

    var manMatch = /"filename".*:.*"(.*)"/gm;
    var manT = man.asText();
    var manFN = manMatch.exec(manT)[1];
    if (manFN != null) {
        if (manFN != htmlFN) {
            manT = man.asText().replace(manFN, htmlFN);
            log.error(root, man, "Manifest filename did not match html filename");
        }
    }
    else {
        log.error(root, man, "The manifest doesn't contain a properly formatted filename.");
    }
    return manT;
}

/**
 * Finds any dimensions in the html filename (if there is any)
 * @param hFN the html filename to check
 * @returns {Array|{index: number, input: string}} the dimensions as an array (w,h)
 */
function findManDim(hFN) {
    var findWH = /([[0-9]+)x([[0-9]+)/;
    var match = findWH.exec(hFN);
    return match;
}

/**
 * Creates the text used in the newly created manifest file.
 * @param hFN the html filename
 * @param w width to add
 * @param h height to add
 * @returns {string} the html text to return
 */
function createManT(hFN, w, h) {

    var manT = 'FT.manifest({\n"filename": "' +
        hFN + '",\n"width": ' +
        w + ',\n"height": ' +
        h + ',\n"clickTagCount": 1\n});';

    return manT;
}

/**
 * creates the Manifest Modal and hides it
 */
function addManModalVal(rootFN) {

    //create the validation fields
    $('#' + rootFN).formValidation({
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
    $('#' + rootFN).on('err.field.fv', function (e, data) {
        $('.warn[data-field=' + data.field + ']').remove();
        if (data.field = 'manW') {
            noWarning[0] = true;
        }
        else if (data.field = 'manH') {
            noWarning[1] = true;
        }
    });

    // This event will be triggered when the field passes given validator
    $('#' + rootFN).on('success.field.fv', function (e, data) {

        //The live value of the users input
        var input = parseInt(data.element[0].value);

        //if the user is in width and input is not in common and warning hasn't been displayed
        if (data.field == 'manW') {
            if (!(isIn(input, COMMON_WIDTH))) {
                if (noWarning[0]) {
                    addWarning(data);
                    noWarning[0] = false;
                }
            }
            else {
                removeWarning(data);
                noWarning[0] = true;
            }
        }
        else if ((data.field == 'manH')) {
            if (!(isIn(input, COMMON_HEIGHT))){
                if (noWarning[1]) {
                    addWarning(data);
                    noWarning[1] = false;
                }
            }
            else {
                removeWarning(data);
                noWarning[1] = true;
            }
        }

    });

    // Mark the field as invalid
    function addWarning(data) {
        data.element
            .closest('.form-group')
            .removeClass('has-success')
            .addClass('has-warning help-block validMessage')

        //add message
        var $span = $('<small/>')
            .attr('data-field', data.field)
            .attr('class', "warn")
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
            .addClass('has-success'); // add success!
        $('.warn[data-field=' + data.field + ']').remove();
    }
}
/**
 * checks if there is a window.open in the code
 * @param file html or js to check
 * @returns {boolean} true if there is a clicktag, false otherwise
 */
function hasExtClickTag(file){
    if (file.asText().indexOf("clickTag") != -1) {
        return true;
    }
    else {
        return false;
    }
}

/**
 * Finds the exxternal clicktag call and replaces it with myFT.clickTag()
 * @param file to replace clicktag in
 */
function replaceExtClickTag(file) {
    //TODO: implement clicktag regex match
}

/**
 * Checks if the value is in the array
 * @param value (string/int) to check
 * @param array of integers (used to list above
 * @returns {boolean}
 */
function isIn(value, array) {
    if (array.indexOf(parseInt(value)) != -1) {
        return true;
    }
    else {
        return false;
    }
}

// --- END HELPERS --- //