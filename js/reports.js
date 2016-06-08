var errors = {};
var warnings = {};
var messages = {};

var log = {
    error: function (root, file, message) {
        //if array is empty, create it
        if (errors[root.name] == null) {
            errors[root.name] = [];
        }
        errors[root.name].push([file.name, message]);
    },
    warning: function (root, file, message) {
        //if array is empty, create it
        if (warnings[root.name] == null) {
            warnings[root.name] = [];
        }
        warnings[root.name].push([file.name, message]);
    },
    message: function (root, fn, msg) {
        //if array is empty, create it
        if (messages[root.name] == null) {
            messages[root.name] = [];
        }
        messages[root.name].push([fn, msg]);
    }
};

/**
 * Validates the users input for width and height, checking if the values are common
 * and returning the appropriate warning/error
 */
function valManDims(root, file, w, h) {
    if (!(isIn(w, COMMON_WIDTH))) {
        print(w);
        log.warning(root, file, '\'' + w + "px' is not a common width but was set.");
    }

    if (!(isIn(h, COMMON_HEIGHT))) {
        log.warning(root, file, '\'' + h + "px' is not a common height but was set.");
    }
}

function createContentNode(root, zFList) {
    var fn = rmSC(removeExtension(root.name));
    var listContent = '\
            <div class="panel-heading" role="tab" id="heading">\
                <h4 class="panel-title">\
                    <a class="accordian collapsed" data-toggle="collapse" style="vertical-align: -webkit-baseline-middle; data-parent="#accordion" href="' + '#' + fn + '"\
                       aria-expanded="false" aria-controls=' + fn + '>\
                        ' + root.name + " " + rEFlag(root.name) + " " + rWFlag(root.name) + " " + rMFlag(root.name) + rDButton(fn) + '\
                    </a>\
                </h4>\
            </div>\
            <div id=' + fn + ' class="panel-collapse collapse" role="tabpanel" aria-labelledby="heading">'
        + rErrors(root.name) + rWarnings(root.name) + rMessages(root.name) +
        '</div>';
    return listContent;
}

function createManModal(rootFN) {
    var modalContent = '\
        <div class="modal fade" role="dialog" data-backdrop="static" data-keyboard="false" id="' + rootFN + '" data-toggle="modal">\
            <div class="modal-dialog">\
                <div class="modal-content">\
                    <div class="modal-header"><h4>Create manifest.js for: </h4><i>' + rootFN + '.zip</i> </div>\
                    <div class="modal-body"> No manifest file was detected. Please enter the width and height for the adfile below:\
                    <form data-toggle="validator" role="form">\
                        <div class="form-group">\
                            <div class="form-group col-sm-6">\
                                <label class="control-label">Width</label>\
                                    <input type="text" class="form-control" name="manW" placeholder=\'728\' required>\
                            </div>\
                            <div class="form-group col-sm-6">\
                                <label class="control-label">Height</label>\
                                <input type="text" class="form-control" name="manH" placeholder=\'90\' required>\
                            </div>\
                        </div>\
                        <div class="form-group">\
                            <button type="submit" id="manBtn" disabled="disabled" class="pull-right btn btn-primary">Submit</button>\
                        </div>\
                    </form>\
                </div>\
            </div>\
            </div>\
        </div>';
    return modalContent;
}
/**
 * Converts the string array into a html list
 * @param string array of issues (warnings, messages, errors)
 * @returns {string} the formatted list of issues
 */
function listPrint(string) {
    var output = '<ul>';
    for (var i = 0; i < string.length; i++) {
        output = output + '<span style="color:#000000"><li><span style="font-weight: bold">' + string[i][0] + '</span> : ' + string[i][1] + '</li></span>';
    }
    return output + '</ul>';
}

function report(rootFN, root, zFList) {

    // create dropdown node
    $('#rFiles').append(createContentNode(root, zFList));

    // create download button
    var fn = rmSC(removeExtension(root.name));
    var dBtn = document.getElementById('d' + fn);
    dBtn.addEventListener("click", function () {
        download(rootFN, zFList)
    });

    //stop loading
    document.getElementById('loading').style.display = "none";

    //show the list
    document.getElementById('rFiles-container').style.display = "block";


}

function rEFlag(fn) {
    if (errors[fn] != null) {
        return '<span class="label label-danger label-as-badge">' + errors[fn].length + '</span>';
    }
    else return '';
}
function rWFlag(fn) {
    if (warnings[fn] != null) {
        return '<span class="label label-warning label-as-badge">' + warnings[fn].length + '</span>';
    }
    else return '';
}
function rMFlag(fn) {
    if (messages[fn] != null) {
        return '<span class="label label-success label-as-badge">' + messages[fn].length + '</span>';
    }
    else return '';
}
function rErrors(fn) {
    if (errors[fn] != null) {
        return '<div class="alert alert-danger fade in"><h5>Errors: </h5>' + listPrint(errors[fn]) + '</div>';
    }
    else return '';
}
function rWarnings(fn) {
    if (warnings[fn] != null) {
        return '<div class="alert alert-warning fade in"><h5>Warnings: </h5> ' + listPrint(warnings[fn]) + '</div>';
    }
    else return '';
}
function rMessages(fn) {
    if (messages[fn] != null) {
        return '<div class="alert alert-success fade in"><h5>Message: </h5> ' + listPrint(messages[fn]) + '</div>';
    }
    else return '';
}
function rDButton(fn) {
    return '<a href="#">\
        <span id="d' + fn + '" class="glyphicon glyphicon-download-alt pull-right"></span>\
    </a>';
}

