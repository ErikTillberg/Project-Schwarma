/**
 * Created by Andrew on 2017-02-09.
 * Modified by Bryon on 2017-02-24.
 */


var signin_state = {

    preload: function(){
        console.log("signin_state: preload");
    },

    create: function(){
        console.log("signin_state: create");
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
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','SIGN IN',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        // Initialize the debug_console
        debug_console.init_log();
        debug_console.debug_log("You're on the signin screen.");

        // Add the username text input field to the screen
        this.username_input = game.add.inputField(sword.x - 115, sword.y - 80, {
            font: '30px VT323',
            fill: '#212121',
            width: 200,
            padding: 10,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'USERNAME'
        });

        // Add the password text input field to the screen
        this.password_input = game.add.inputField(sword.x - 115, sword.y - 30, {
            font: '30px VT323',
            fill: '#212121',
            width: 200,
            padding: 10,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'PASSWORD',
            type: PhaserInput.InputType.password
        });

        // Add a signin button to the screen, and when clicked launch submit_button function
        this.signin_btn = game.add.button(game.world.centerX+250, 450, 'Submit_button', this.signin_btn_click, this, 2, 1, 0);
      
        // Add a signup button to the screen, and when clicked launch Home_button function
        this.back_btn= game.add.button(game.world.centerX-530, 450, 'Home_button', this.back_btn_click, this, 2, 1, 0);
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
    back_btn_click: function(){

        console.log("signin_state: back_btn_click");
        game.state.start("load");

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