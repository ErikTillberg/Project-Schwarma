/**
 * Created by Andrew on 2017-02-09.
 */

var load_state = {

    preload: function() {

        // TODO load game assets here when they exist
        game.load.bitmapFont('');
        game.plugins.add(PhaserInput.Plugin);
        game.load.image('red_button_img','assets/buttons/big-buttons/01-red-normal.png');
        game.load.image('green_field', 'assets/sizetest.png');

    },

    create: function() {

        // Launch into either the signin or signup state, depending on whether the user
        // Already has an account or not. Determined by flag inside localStorage.

        if (window.localStorage['new_user']) {
            if(JSON.parse(window.localStorage['new_user']) === false){
                console.log("Returning user found, loading signin screen.");
                game.state.start("signin");
            }else{
                // Set the flag so its checked if the user does not sign up before coming back to this point.
                console.log("New user found, loading signup screen.");
                window.localStorage['new_user'] = JSON.stringify(true);
                game.state.start("signup");
            }
        }else{
            // Set the flag so its checked if the user does not sign up before coming back to this point.
            console.log("New user found, loading signup screen.");
            window.localStorage['new_user'] = JSON.stringify(true);
            game.state.start("signup");
        }
    }
};
