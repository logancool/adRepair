var errors = {};
var warnings = {};
var messages = {};

var log = {
    error: function (root, file, message) {
        //if array is empty, create it
        if (errors[root.name] == null) {
            errors[root.name] = [];
        }
        errors[root.name].push([file.name , message]);
    },
    warning: function (root, file, message) {
        //if array is empty, create it
        if (warnings[root.name] == null) {
            warnings[root.name] = [];
        }
        warnings[root.name].push([file.name, message]);
    },
    message: function (root, file, msg) {
        //if array is empty, create it
        if (messages[root.name] == null) {
            messages[root.name] = [];
        }
        messages[root.name].push([file.name, msg]);
    }
};

function createContentNode(file) {
    var listContent = '\
            <div class="panel-heading" role="tab" id="heading">\
                <h4 class="panel-title">\
                    <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#cFile"\
                       aria-expanded="false" aria-controls="cFile">\
                        ' + file.name + " " + rEFlag(file.name) + rWFlag(file.name) + rWFlag(file.name) + '\
                    </a>\
                </h4>\
            </div>\
            <div id="cFile" class="panel-collapse collapse transparent" role="tabpanel" aria-labelledby="heading">'
                + rErrors(file.name) + rWarnings(file.name) + rMessages(file.name) +
            '</div>';
    return listContent;
}
function pp(string) {
    var output = '<ul>';
    for (var i = 0; i < string.length; i++) {
        output = output + '<li><span style="color:#000000; font-weight: bold">' + string[i][0] + '</span> : ' + string[i][1] + '</li>';
    }
    return output + '</ul>';
}
function report(file) {

    print(errors);

    document.getElementById('rFiles').innerHTML = document.getElementById('rFiles').innerHTML + createContentNode(file);

    //stop loading
    document.getElementById('loading').style.display = "none";

    //show the list
    document.getElementById('rFiles-container').style.display = "block";


    //update download button
    document.getElementById('dwnldAll').style.display = "block";

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
        return '<div class="alert alert-danger fade in"><h5>Errors: </h5>' + pp(errors[fn]) + '</div>';
    }
    else return '';
}

function rWarnings(fn) {
    if (warnings[fn] != null) {
        return '<div class="alert alert-warning fade in"><h5>Warnings: </h5> ' + pp(warnings[fn]) + '</div>';
    }
    else return '';
}
function rMessages(fn) {
    if (messages[fn] != null) {
        return '<div class="alert alert-success fade in"><h5>Message: </h5> ' + pp(messages[fn]) + '</div>';
    }
    else return '';
}

