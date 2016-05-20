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
        warnings.push(file.name, message);
    },
    message: function (file, msg) {
        //if array is empty, create it
        if (errors[file.name] == null) {
            errors[file.name] = [];
        }
        messages[file.name].push(msg);
    }
};