var errors = warnings = messages = {};
var log = {
    error: function (file, message) {
        //if array is empty, create it
        if (errors[file.name] == null) {
            errors[file.name] = [];

        }
        errors[file.name].push(message);
    },
    warning: function (file, message) {
        //if array is empty, create it
        if (warnings[file.name] == null) {
            warnings[file.name] = [];
        }
        warnings[file.name].push(file.name, message);
    },
    message: function (file, msg) {
        //if array is empty, create it
        if (errors[file.name] == null) {
            errors[file.name] = [];
        }
        messages[file.name].push(msg);
    }
};

function createContentNode(file){
    var listContent = '\
            <div class="panel-heading" role="tab" id="heading">\
                <h4 class="panel-title">\
                    <a class="collapsed" data-toggle="collapse" data-parent="#accordion" href="#cFile"\
                       aria-expanded="false" aria-controls="cFile">\
                        ' + file.name + rEFlag(file.name) + rWFlag(file.name) + rWFlag(file.name) + '\
                    </a>\
                </h4>\
            </div>\
            <div id="cFile" class="panel-collapse collapse transparent" role="tabpanel" aria-labelledby="heading">\
\
                <div class="alert alert-danger fade in">\
                    ' + rErrors(file.name) + '\
                </div>\
                <div class="alert alert-warning fade in">\
                    ' + rWarnings(file.name) + '\
                </div>\
                <div class="alert alert-success fade in">\
                    ' + rMessages(file.name) + '\
                </div>\
            </div>';
    return listContent;
}

function report(file){
    print(file);

    document.getElementById('rFiles').innerHTML = document.getElementById('rFiles').innerHTML + createContentNode(file);

    //stop loading
    document.getElementById('loading').style.display = "none";

    //show the list
    document.getElementById('rFiles-container').style.display = "block";


    //update download button
    document.getElementById('dwnldAll').style.display = "block";

}

function rEFlag(fn){
    if (errors[fn] != null) {
        return '<span class="label label-danger label-as-badge">' + errors[fn] + '</span>';
    }
    else return '';
}

function rWFlag(fn){
    if (warnings[fn] != null) {
        return '<span class="label label-warning label-as-badge">' + warnings[fn]+ '</span>';
    }
    else return '';
}

function rMFlag(fn){
    if (messages[fn] != null) {
        return '<span class="label label-success label-as-badge">' + messages[fn] + '</span>';
    }
    else return '';
}
function rErrors(fn){
    return '<h5>Errors: </h5> ' + errors[fn];
}
function rWarnings(fn){
    return '<h5>Warnings: </h5> ' + warnings[fn];
}
function rMessages(fn){
    return '<h5>Message: </h5> ' + messages[fn];
}

