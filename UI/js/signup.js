/**
 * Created by Andrew on 2017-02-09.
 *
 * signup.js - Handles everything to do with the signup process, from taking input to making requests to the server.
 *              Behaves as a phaser game state object, overrides the preload anc create methods.
 */

var signup_state = {

    preload: function(){
        console.log("signup_state: preload");
    },

    create: function(){
        console.log("signup_state: create");

        tilesprite = game.add.tileSprite(0, 0, 1280, 720, 'green_field');

        // Initialize the debug_console
        debug_console.init_log();
        debug_console.debug_log("You're on the signup screen.");

        // Add input fields for email, username, password and confirm password.
        this.username_input = game.add.inputField(game.world.centerX-200, game.world.centerY-300, {
            font: '18px Arial',
            fill: '#212121',
            width: 400,
            padding: 20,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Username'
        });

        this.email_input = game.add.inputField(game.world.centerX-200, game.world.centerY-240, {
            font: '18px Arial',
            fill: '#212121',
            width: 400,
            padding: 20,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Email'
        });

        this.password_input = game.add.inputField(game.world.centerX-200, game.world.centerY-180, {
            font: '18px Arial',
            fill: '#212121',
            width: 400,
            padding: 20,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Password',
            type: PhaserInput.InputType.password
        });

        this.confirm_password_input = game.add.inputField(game.world.centerX-200, game.world.centerY-120, {
            font: '18px Arial',
            fill: '#212121',
            width: 400,
            padding: 20,
            borderWidth: 1,
            borderColor: '#000',
            placeHolder: 'Confirm Password',
            type: PhaserInput.InputType.password
        });

        // Add a signup button to the screen
        this.signup_btn = game.add.button(game.world.centerX-130, 400, 'red_button_img', this.signup_btn_click, this, 2, 1, 0);

        // Add a signin button to the screen
        this.signin_btn = game.add.button(game.world.width-330, 580, 'red_button_img', this.signin_btn_click, this, 2, 1, 0);
    },

    // Handles signup button click. Sends an ajax request to the server after extracting user data from input fields
    signup_btn_click: function(){

        console.log("signup_state: signup_btn_click");
        debug_console.message_log("Signing up...");
        var username = this.username_input.value;
        var email = this.email_input.value;
        var password = this.password_input.value;
        var confirm_password = this.confirm_password_input.value;

        // Perform some simple validation on the inputs
        if (password !== confirm_password) {
            debug_console.error_log("Password and confirm password do not match.");
        }else if (username === "") {
            debug_console.error_log("Username is required.");
        }else if (email == "") {
            debug_console.error_log("Email is required.");
        }else if (password == "") {
            debug_console.error_log("Password is required");
        }else if (confirm_password == "") {
            debug_console.error_log("Confirm password is required");
        }else{

            // Build the URL with query string for signup
            var signup_endpoint = config.server_ip
                + config.signup_endpoint
                + "?username=" + username
                + "&email=" + email
                + "&password=" + password;

            // Send the request to the server
            $.ajax({
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                url: signup_endpoint,
                success: this.signup_success,
                error: this.signup_failure
            });
        }
    },

    // Handles signin button click. Transitions the game to the signin state.
    signin_btn_click: function(){

        console.log("signup_state: signin_btn_click");
        game.state.start("signin");

    },

    // Displays a success message to the user and transitions to the signin state
    signup_success: function(data, textStatus, jqXHR){

        console.log("signup_state: signup_success");
        console.log(data);
        console.log(textStatus);
        console.log(jqXHR);

        user_data = data;
        user.init(user_data);

        // Navigate the user to the main menu state, save a boolean flag in localStorage to indicate this is not longer
        // A new user, next time they will arrive on the login screen.
        window.localStorage['new_user'] = JSON.stringify(false);
        console.log(JSON.parse(window.localStorage['new_user']));
        debug_console.message_log("Signed in as: " + user_data.username);
        game.state.start("main_menu");
    },

    // Displays an error message to the user
    signup_failure: function(jqXHR, textStatus, error){

        console.error("signup_state: signup_failure");
        debug_console.error_log("Failed to signup:" + error);

    }
};
