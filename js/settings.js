define([
    "log"
], function(Log){
    Log.write('SETTINGS loaded');

    return {
        testsCssFolder: "js/tests/css/",
        templatesFolder: "js/tests/templates/"
    };
});