/**
 * Created by Andrew on 2017-02-09.
 */

var main_menu_state = {

    preload: function(){
        console.log("main_menu_state: preload");

    },

    create: function(){
        console.log("main_menu_state: create");
        tilesprite = game.add.tileSprite(0, 0, 1280, 720, 'green_field');

        debug_console.init_log();
        debug_console.debug_log("You're on the main menu screen. Signed in as: " + user.username);
    }
};