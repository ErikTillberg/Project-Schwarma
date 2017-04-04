/**
 * Created by Bryon on 2017-04-03.
 *
 */

var creditText;
/**
 * Loads when the user decided to sign in from the load state landing screen. Handles user interface and server communication pertaining to sign in operations.
 * @type {{preload: signin_state.preload, create: signin_state.create, signin_btn_click: signin_state.signin_btn_click, back_btn_click: signin_state.back_btn_click, signin_success: signin_state.signin_success, signin_failure: signin_state.signin_failure}}
 * @namespace
 */
var credit_state = {

    /**
     * Currently empty. Overrides Phaser state preload method.
     */
    preload: function(){
        console.log("credit_state: preload");
    },
    /**
     * Initializes sprites, buttons, text and event handlers for the signin state. Overrides Phaser state create method.
     */
    create: function(){
        console.log("credit_state: create");
        // Set the background color of the canvas.
        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        // Add the menu background to screen
        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = 4;
        banner.anchor.setTo(0.5, 0.5);

        // Add the title text to the screen
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','CREDITS',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        creditText = game.add.bitmapText(banner.x, banner.y + 250, 'carrier_command_black','UI TEAM\n\n\nANDREW\n' +
            '\n Bryon\n\n\nMETA-SERVER TEAM\n\n\nERIK\n\nFRANCESCO\n\n\nSIM-SERVER TEAM\n\n\nCHRIS\n\nManuel',20);
        creditText.anchor.setTo(0.5, 0.5);
        creditText.align = 'center';

        // Add a signup button to the screen, and when clicked launch Home_button function
        this.back_btn= game.add.button(homeX, homeY, 'Home_button', this.back_btn_click, this, 2, 1, 0);

    },


    back_btn_click: function() {

    console.log("signin_state: back_btn_click");
    game.state.start('load');
    }
};


