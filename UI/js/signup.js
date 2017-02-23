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

        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        var background = game.add.sprite(0,0, 'menu_background');

        var background = game.add.sprite(0,0, 'menu_background');

        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        var num = randomInt(0, 4);
        
        var sword = game.add.sprite( 640, 460,'Sword');
        sword.frame = num;
        sword.anchor.setTo(0.5, 0.5);
        sword.scale.setTo(1.2, 1.2);

        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','SIGN UP',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';
        // Initialize the debug_console
        debug_console.init_log();
        debug_console.debug_log("You're on the signup screen.");

        // Add input fields for email, username, password and confirm password.
        this.username_input = game.add.inputField(sword.x - 115, sword.y - 140, {
            font: '18px Ariel',
            fill: '#212121',
            width: 180,
            padding: 20,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'USER NAME'
        });

        this.email_input = game.add.inputField(sword.x - 115, sword.y - 80, {
            font: '18px Arial',
            fill: '#212121',
            width: 180,
            padding: 20,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'EMAIL'
        });

        this.password_input = game.add.inputField(sword.x - 115, sword.y - 20,  {
            font: '18px Arial',
            fill: '#212121',
            width: 180,
            padding: 20,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'PASSWORD',
            type: PhaserInput.InputType.password
        });

        this.confirm_password_input = game.add.inputField(sword.x - 115, sword.y +40, {
            font: '18px Arial',
            fill: '#212121',
            width: 180,
            padding: 20,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'CONFIRM PASS',
            type: PhaserInput.InputType.password
        });

        // Add a signup button to the screen
         this.signin_btn = game.add.button(game.world.centerX+250, 450, 'Submit_button', this.signup_btn_click, this, 2, 1, 0);
        //this.signin_btn_text = game.add.bitmapText(this.signin_btn.x + this.signin_btn.width/4, this.signin_btn.y + this.signin_btn.height/3, 'carrier_command','SUBMIT',20);

        // Add a signup button to the screen
        this.back_btn= game.add.button(game.world.centerX-530, 450, 'Home_button', this.back_btn_click, this, 2, 1, 0);
       //this.back_btn_text = game.add.bitmapText(this.back_btn.x + this.back_btn.width/4, this.back_btn.y + this.back_btn.height/3, 'carrier_command','BACK',20);
    },

    // Handles signup button click. Sends an ajax request to the server after extracting user data from input fields
    signup_btn_click: function(){

        console.log("signup_state: signup_btn_click");
        debug_console.message_log("Signing up...");
        var username = this.username_input.value;
        var email = this.email_input.value;
        var password = this.password_input.value;
        var confirm_password = this.confirm_password_input.value;

         console.log("Character: " + character);

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

            // Send the request to the server
            $.ajax({
                type: "POST",
                crossDomain: true,
                dataType: 'json',
                url: server.signup_endpoint(username, email, password, character),
                success: this.signup_success,
                error: this.signup_failure
            });
        }
    },

    // Handles signin button click. Transitions the game to the signin state.
    back_btn_click: function(){

        console.log("signup_state: signin_btn_click");
        game.state.start("load");

    },

    // Displays a success message to the user and transitions to the signin state
    signup_success: function(data, textStatus, jqXHR){

        // TODO remove this check when server returns error code on null data
        if (data === null) {
            this.signup_failure(null, null, "The server returned a null data object."); // TODO fix this to pass a proper error object instead of a string
            console.log("Data was null, could not sign up.");
            return;
        }

        console.log("signup_state: signup_success");
        console.log(data);
        console.log(textStatus);

        user.init(data);

        // Navigate the user to the main menu state, save a boolean flag in localStorage to indicate this is not longer
        // A new user, next time they will arrive on the login screen.
        window.localStorage['new_user'] = JSON.stringify(false);
        console.log(JSON.parse(window.localStorage['new_user']));
        debug_console.message_log("Signed in as: " + user.username);
        game.state.start("main_menu");
    },

    // Displays an error message to the user
    signup_failure: function(jqXHR, textStatus, error){

        console.error("signup_state: signup_failure");
        debug_console.error_log("Failed to signup:" + error);
        return;

    }
};
