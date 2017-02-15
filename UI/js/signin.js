/**
 * Created by Andrew on 2017-02-09.
 */


var signin_state = {

    preload: function(){
        console.log("signin_state: preload");

    },

    create: function(){
        console.log("signin_state: create");
        tilesprite = game.add.tileSprite(0, 0, 1280, 720, 'green_field');
        // Initialize the debug_console
        debug_console.init_log();
        debug_console.debug_log("You're on the signin screen.");

        this.username_input = game.add.inputField(game.world.centerX-200, game.world.centerY-300, {
            font: '18px Arial',
            fill: '#212121',
            width: 400,
            padding: 20,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Username'
        });

        this.password_input = game.add.inputField(game.world.centerX-200, game.world.centerY-240, {
            font: '18px Arial',
            fill: '#212121',
            width: 400,
            padding: 20,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Password',
            type: PhaserInput.InputType.password
        });

        // Add a signin button to the screen
        this.signin_btn = game.add.button(game.world.centerX-130, 400, 'red_button_img', this.signin_btn_click, this, 2, 1, 0);

        // Add a signup button to the screen
        this.signup_btn = game.add.button(game.world.width-330, 580, 'red_button_img', this.signup_btn_click, this, 2, 1, 0);
    },

    // Handles signin button click. Sends an ajax request to the server after extracting user data from input fields
    signin_btn_click: function(){

        console.log("signin_state: signin_btn_click");
        debug_console.message_log("Signing in...");
        var username = this.username_input.value;
        var password = this.password_input.value;

        // Perform some simple validation on the inputs
        if (username === "") {
            debug_console.error_log("Username is required.");
        }else if (password === "") {
            debug_console.error_log("Password is required");
        }else{

            // Send the request to the server
            $.ajax({
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                url: server.signin_endpoint(username, password),
                success: this.signin_success,
                error: this.signin_failure
            });
        }
    },

    // Handles signup button click. Transitions the game to the signup state.
    signup_btn_click: function(){

        console.log("signin_state: signup_btn_click");
        game.state.start("signup");

    },

    // Displays a success message to the user and transitions to the main menu
    signin_success: function(data, textStatus, jqXHR){

        // TODO remove this check when server returns error code on null data
        if (data === null) {
            this.signin_failure("","","The server returned a null data object.");
            return;
        }

        console.log("signin_state: signin_success");
        console.log(data);
        console.log(textStatus);

        user.init(data);

        // Navigate the user to the main menu state, save a boolean flag in localStorage to indicate this is no longer
        debug_console.message_log("Signed in as: " + user.username);
        game.state.start("main_menu");
    },

    // Displays an error message to the user
    signin_failure: function(jqXHR, textStatus, error){

        console.error("signin_state: signin_failure");
        debug_console.error_log("Failed to signin:" + error);

    }
};