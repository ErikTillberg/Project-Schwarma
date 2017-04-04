

var sword;
var playerCharcter;
var playerCharcter2;
var playerCharacterShadow;
var playerCharacterShadow2;

/**
 * Handles the character match up screen.
 * namespace
 * @type {{preload: pick_state.preload, create: pick_state.create, back_btn_click: pick_state.back_btn_click, submit_btn_click: pick_state.submit_btn_click}}
 */
var match_up_state = {
 
    preload: function() {

       console.log("match_up_state: preload");
    },

    create: function() {

        menuclick = game.add.audio('menuclick');
        menuclick.volume = 0.2;

        // Set the background color of the canvas.
        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        // Add the menu background to screen
        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        // Add the character sprite and add animations
        playerCharcter = game.add.sprite(950, 400,  pickCharacter ( user.opponent.character_type));
        playerCharcter.anchor.setTo(0.5, 0.5);
        playerCharcter.scale.setTo(1.5,1.5);
        playerCharacterShadow = game.add.sprite(playerCharcter.x, playerCharcter.y + 62, 'Shadow');
        playerCharacterShadow.anchor.setTo(0.5, 0.5);
        playerCharacterShadow.scale.setTo(1.5,1.5);
        var walk = playerCharcter.animations.add('walk');
        playerCharcter.animations.play('walk', 5, true);


        var char1StatText = game.add.bitmapText(playerCharcter.x, playerCharcter.y + 140, 'carrier_command_black','LEVEL: '+ user.opponenr.rating,20);
        char1StatText.anchor.setTo(0.5, 0.5);
        char1StatText.align = 'center';


        playerCharcter2 = game.add.sprite(330, 400, pickCharacter ( user.character_type));
        playerCharcter2.anchor.setTo(0.5, 0.5);
        playerCharcter2.scale.setTo(1.5,1.5);
        playerCharacterShadow2 = game.add.sprite(playerCharcter2.x, playerCharcter2.y + 62, 'Shadow');
        playerCharacterShadow2.anchor.setTo(0.5, 0.5);
        playerCharacterShadow2.scale.setTo(1.5,1.5);
        var walk = playerCharcter2.animations.add('walk');
        playerCharcter2.animations.play('walk', 5, true);

        var char2StatText = game.add.bitmapText(playerCharcter2.x, playerCharcter2.y + 140, 'carrier_command_black','LEVEL: ' + user.rating,20);
        char2StatText.anchor.setTo(0.5, 0.5);
        char2StatText.align = 'center';


        // Add the title text to the screen                
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','BATTLE MATCH UP',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        var vsText = game.add.bitmapText(640, 360, 'carrier_command_black','VS',60);
        vsText.anchor.setTo(0.5, 0.5);
        vsText.align = 'center';

        var user1Text = game.add.bitmapText(playerCharcter.x -100, playerCharcter.y - 200, 'carrier_command_black',user.opponent.username,25);
        vsText.anchor.setTo(0.5, 0.5);
        vsText.align = 'center';

        var user2Text = game.add.bitmapText(playerCharcter2.x -100, playerCharcter2.y - 200, 'carrier_command_black',user.username,25);
        vsText.anchor.setTo(0.5, 0.5);
        vsText.align = 'center';


        // Add a submit button to the screen, and when clicked launch submit_button_click function
        this.submit_btn = game.add.button(submitX, submitY,  'Submit_button', this.submit_btn_click, this, 2, 1, 0);

        // Add a home button to the screen, and when clicked launch back_btn_clickfunction
        this.back_btn= game.add.button(homeX, homeY,  'Home_button', this.back_btn_click, this, 2, 1, 0);
    },

    // Handles back button click. Transitions the game to the load state.
    back_btn_click: function(){

        menuclick.play();
        console.log("signup_state: signin_btn_click");
        game.state.start("load");
    },

    // Handles submit button click. Transitions the game to the signup state.
    submit_btn_click: function(){

        menuclick.play();
        game.state.start("pre_battle");
    },
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

/**
 * Function picks what character sprite to load.
 * @param charName
 * @returns {string}
 */
function pickCharacter ( charName ){

    if (charName == 'warrior'){
        return 'Knight';
    }

    else if (charName == 'thief'){
        return 'Thief';
    }

    else {
        return 'Wizard';
    }
}


