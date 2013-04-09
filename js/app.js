define([
   "jquery",
   "ui",
   "tests/Tests",
   "string",
   "log"
], function($, Ui, Tests, String, Log){
    Log.write('app loaded');

    //------------------------------------------------------------------------------------------------------------------
    //UI events


    $('.nav .menuItem').on('click', function(){
        var menuId = $(this).attr('id').match(/^menu-(.*)$/)[1];
        var testName = String.ucword(menuId);
        Log.write('activating MENU: ' + menuId + ", test name: " + testName);

        Ui.Menu.activate(menuId);
        Tests[testName].load();
    });
    //------------------------------------------------------------------------------------------------------------------
    
    return {
        Tests: Tests
    };
});