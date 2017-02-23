/**
 * Created by Andrew on 2017-02-09.
 */


var signin_state = {

    preload: function(){
        console.log("signin_state: preload");
    },

    create: function(){
        console.log("signin_state: create");
        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        var background = game.add.sprite(0,0, 'menu_background');

        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,225,'Banner');
        banner.frame = randomInt(0, 5);
        banner.anchor.setTo(0.5, 0.5);

        var num = randomInt(0, 5);
        
        var sword = game.add.sprite( 640, 475,'Sword');
        sword.frame = num;
        sword.anchor.setTo(0.5, 0.5);

        var titleText = game.add.bitmapText(banner.x, banner.y - 80, 'carrier_command_black','SIGN IN',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        // Initialize the debug_console
        debug_console.init_log();
        debug_console.debug_log("You're on the signin screen.");

        this.username_input = game.add.inputField(sword.x - 100, sword.y - 80, {
            font: '18px Arial',
            fill: '#212121',
            width: 150,
            padding: 20,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'USERNAME'
        });

        this.password_input = game.add.inputField(sword.x - 100, sword.y - 20, {
            font: '18px Arial',
            fill: '#212121',
            width: 150,
            padding: 20,
            borderWidth: 10,
            borderColor: '#000',
            placeHolder: 'PASSWORD',
            type: PhaserInput.InputType.password
        });

        // Add a signin button to the screen
        this.signin_btn = game.add.button(game.world.centerX+250, 450, 'Submit_button', this.signin_btn_click, this, 2, 1, 0);
        //this.signin_btn_text = game.add.bitmapText(this.signin_btn.x + this.signin_btn.width/4, this.signin_btn.y + this.signin_btn.height/3, 'carrier_command','SUBMIT',20);

        // Add a signup button to the screen
        this.back_btn= game.add.button(game.world.centerX-530, 450, 'Home_button', this.back_btn_click, this, 2, 1, 0);
       //this.back_btn_text = game.add.bitmapText(this.back_btn.x + this.back_btn.width/4, this.back_btn.y + this.back_btn.height/3, 'carrier_command','BACK',20);
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

        console.log("signin_state: signup_btn_click");
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

function randomInt (min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}