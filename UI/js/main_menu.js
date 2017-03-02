/**
 * Created by Andrew on 2017-02-09.
 */

var main_menu_state = {

    matchmaking_active: false,
    matchmaking_time: 0,
    matchmaking_socket: null,

    preload: function(){
        console.log("main_menu_state: preload");
    },

    create: function(){
        console.log("main_menu_state: create");

        // Set the background color of the canvas.
        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        // Add the menu background to screen
        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        var num = randomInt(0, 4);
       
       	// Add the sword/sheild art to the screen, picking randomly from sword_ss sprite sheet
        var sword = game.add.sprite( 640, 460,'Sword');
        sword.frame = num;
        sword.anchor.setTo(0.5, 0.5);
        sword.scale.setTo(1.2, 1.2);
        
        // Add the title text to the screen
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','MAIN MENU',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        debug_console.init_log();
        debug_console.debug_log("You're on the main menu screen. Signed in as: " + user.username);

         // Button to select the gear screen, currently invisible because it goes notwhere    
        this.gear_btn_text = game.add.bitmapText(banner.x, 475, 'carrier_command_black','GEAR',22);
        this.gear_btn_text.align = 'center';
        this.gear_btn_text.anchor.set(0.5, 0.5);
        this.gear_btn_text.inputEnabled = true;
        this.gear_btn_text.events.onInputDown.add(this.gear_btn_click, this);
        this.gear_btn_text.visible = false;

        // Matchmaking button, visible while matchmaking is not taking place, hidden during matchmaking to show cancel button
        this.matchmaking_btn_text = game.add.bitmapText(banner.x, 415, 'carrier_command_black','FIND MATCH',22);
        this.matchmaking_btn_text.align = 'center';
        this.matchmaking_btn_text.anchor.set(0.5, 0.5);
        this.matchmaking_btn_text.inputEnabled = true;
        this.matchmaking_btn_text.events.onInputDown.add(this.matchmaking_btn_click, this);

        // Brings the user to a test battle screen
        this.battle_btn_text = game.add.bitmapText(banner.x, 475, 'carrier_command_black','BATTLE SYSTEM\nDEMO',18);
        this.battle_btn_text.align = 'center';
        this.battle_btn_text.anchor.set(0.5, 0.5);
        this.battle_btn_text.inputEnabled = true;
        this.battle_btn_text.events.onInputDown.add(this.battle_btn_click, this);
       
        // Shown when matchmaking is in progress so it can be cancelled
        this.matchmaking_cancel_btn_text = game.add.bitmapText(banner.x, 415, 'carrier_command_black','CANCEL',22);
        this.matchmaking_cancel_btn_text.align = 'center';
        this.matchmaking_cancel_btn_text.anchor.set(0.5, 0.5);
        this.matchmaking_cancel_btn_text.inputEnabled = true;
        this.matchmaking_cancel_btn_text.events.onInputDown.add(this.cancel_matchmaking, this);
        this.matchmaking_cancel_btn_text.visible = false;

        this.back_btn= game.add.button(game.world.centerX-530, 450, 'Home_button', this.back_btn_click, this, 2, 1, 0);
    },

    // Move to the select gear screen, only if there is no matchmaking currently in progress
    gear_btn_click: function() {

        console.log("main_menu: gear_btn_click");

        if (!this.matchmaking_active) {
            game.state.start("gear");
        }else{
            debug_console.error_log("Cannot change gear while you are looking for a match.");
        }
    },

    // Open a web socket for the matchmaking tunnel, then send a matchmaking request message
    // TODO change the text on the button and the event handler to cancel_matchmaking
    matchmaking_btn_click: function() {

        console.log("main_menu: matchmaking_btn_click");

        // Send an initial matchmaking request to the server, then poll for the match to be ready
        this.matchmaking_active = true;

        // Socket is now open
        this.matchmaking_socket = server.matchmaking_socket();

        // Send a request to start matchmaking to the server
        // TODO insert the message when a JSON spec is agreed upon
        // this.matchmaking_socket.send("Hello server.");

        this.matchmaking_timer_id = setInterval(this.matchmaking_timer, server.matchmaking_timer_interval);

        // TODO test if this actually changes the event handler
        this.matchmaking_cancel_btn_text.visible = true;
        this.matchmaking_btn_text.visible =false;

        return;
    },

    // Handles messages being received from the web socket
    // Parse the message and take different actions based on what is sent.
    matchmaking_message: function(message) {

        console.log("main_menu: matchmaking_message");

        // var message = JSON.parse(response.data);
        var response = JSON.parse(message.data);

        // Parse the message type
        if (response.type == "match_found") {
            console.log(response);

            // Close the websocket now that we have the opponents data
            main_menu_state.cancel_matchmaking();

            var opponent = response.message;
            debug_console.message_log("Found match. Opponent is " + opponent.username);
            console.log(opponent);
            user.init_opponent(opponent);
            game.state.start('battle_system');

            return;

        }else if (response.type == "error") {
            console.log(response.message);
        }else if(response.type == "success") {
            console.log(response.message);
        }else{
            console.log("Malformed or unrecognized message type from server.");
            console.log(response.message);
        }
    },

    // Send a message to the server to cancel the current matchmaking request, closing the WebSocket
    cancel_matchmaking: function() {

        console.log("main_menu: cancel_matchmaking");

        // This will trigger the matchmaking_end callback for onclose event
        this.matchmaking_socket.close(4000, "User cancelled matchmaking.");

        debug_console.message_log("Matchmaking cancelled.");

        // Clear matchmaking metadata
        this.matchmaking_active = false;
        this.matchmaking_time = 0;

        // Clear the timer that is updating the matchmaking elapsed time
        clearInterval(this.matchmaking_timer_id);

        this.matchmaking_cancel_btn_text.visible = false;
        this.matchmaking_btn_text.visible = true;

    },

    // Clean up after closing the matchmaking socket: reset timer, clear matchmaking flag, output message to the user
    matchmaking_end: function(object) {
        console.log("main_menu: matchmaking_end");

        console.log("Matchmaking socket closed.\nCode: " + object.code + "\nMessage: " + object.reason);
        debug_console.message_log(object.reason);
        this.matchmaking_socket = null;
    },

    // Update the canvas log with the elapsed time spent in matchmaking in seconds
    matchmaking_timer: function() {

        main_menu_state.matchmaking_time += server.matchmaking_timer_interval/1000;
        debug_console.message_log("Time in matchmaking: " + String(main_menu_state.matchmaking_time) + " seconds.");
    },

     back_btn_click: function(){

        console.log("signin_state: signup_btn_click");
        game.state.start("load");
    },

    // Loads the battle_system state
    battle_btn_click: function() {
        console.log("main_menu: battle_btn_click");
        game.state.start("battle_system");
    }
};

/**
 * Function creates a random integer between min and max and returns it.
 * @param min
 * @param max
 * @returns {integer}
 */
function randomInt (min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
