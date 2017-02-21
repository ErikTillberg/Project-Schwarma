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
        tilesprite = game.add.tileSprite(0, 0, 1280, 720, 'green_field');

        debug_console.init_log();
        debug_console.debug_log("You're on the main menu screen. Signed in as: " + user.username);

        this.gear_btn = game.add.button(game.world.centerX-130, 400, 'red_button_img', this.gear_btn_click, this, 2, 1, 0);
        this.gear_btn.anchor.set(0.5, 0.5);
        this.gear_btn_text = game.add.bitmapText(this.gear_btn.x, this.gear_btn.y, 'carrier_command', 'Gear', 20);
        this.gear_btn_text.anchor.set(0.5, 0.5);

        this.matchmaking_btn = game.add.button(game.world.centerX-130, 400, 'red_button_img', this.matchmaking_btn_click, this, 2, 1, 0);
        this.matchmaking_btn_text = game.add.bitmapText(this.matchmaking_btn.x + this.matchmaking_btn.width/4, this.matchmaking_btn.y + this.matchmaking_btn.height/3, 'carrier_command','Find Match',20);
        this.battle_btn = game.add.button(game.world.centerX+130, 600, 'red_button_img', this.battle_btn_click, this, 2, 1, 0);
        this.battle_btn_text = game.add.bitmapText(this.battle_btn.x + this.battle_btn.width/5, this.battle_btn.y + this.battle_btn.height/4, 'carrier_command','Battle Test',20);

        this.matchmaking_cancel_btn = game.add.button(game.world.centerX-130, 400, 'red_button_img', this.cancel_matchmaking, this, 2, 1, 0);
        this.matchmaking_cancel_btn_text = game.add.bitmapText(this.matchmaking_cancel_btn.x + this.matchmaking_cancel_btn.width/4, this.matchmaking_cancel_btn.y + this.matchmaking_cancel_btn.height/3, 'carrier_command','Cancel',20);
        this.matchmaking_cancel_btn.visible = false;
        this.matchmaking_cancel_btn_text.visible = false;

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

        this.matchmaking_timer_id = setInterval(this.matchmaking_timer, server.matchmaking_timer_interval);

        // TODO test if this actually changes the event handler
        this.matchmaking_cancel_btn.visible = true;
        this.matchmaking_cancel_btn_text.visible = true;

        this.matchmaking_btn.visible = false;
        this.matchmaking_btn_text.visible =false;

        return;
    },

    // Handles messages being received from the web socket
    // Parse the message and take different actions based on what is sent.
    matchmaking_message: function(response) {

        console.log("main_menu: matchmaking_message");

        // TODO parse the message when it returns
        // var message = JSON.parse(response.data);
        console.log(response);

        //
        // if (response.data.type == "matchfound") {
        //     console.log(response.data.message);
        // }else if (response.data.type == "error") {
        //     console.log(response.data.message);
        // }else{
        //     console.log("Malformed or unrecognized message type from server.");
        // }

    },

    // Send a message to the server to cancel the current matchmaking request and close the web socket
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

        this.matchmaking_cancel_btn.visible = false;
        this.matchmaking_cancel_btn_text.visible = false;

        this.matchmaking_btn.visible = true;
        this.matchmaking_btn_text.visible = true;

    },

    // Clean up after closing the matchmaking socket
    matchmaking_end: function(code, message) {

        console.log("main_menu: matchmaking_end");
        console.log("Matchmaking socket closed.\nCode: " + code + "\nMessage: " + message);
        this.matchmaking_socket = null;

    },

    // Update the canvas log with the elapsed time in matchmaking
    matchmaking_timer: function() {

        main_menu_state.matchmaking_time += server.matchmaking_timer_interval/1000;
        debug_console.message_log("Time in matchmaking: " + String(main_menu_state.matchmaking_time) + " seconds.");
    },

    battle_btn_click: function() {
        console.log("main_menu: battle_btn_click");
        game.state.start("battle_system");
    }
};
