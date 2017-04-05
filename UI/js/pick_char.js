
var characterPick = ["Knight", "Wizard", "Thief"];
var i = 0;
var sword;
var playerCharcter;
var playerCharcter2;
var playerCharcter3;
var playerCharacterShadow;
var pickcharSFX;

/**
 * Handles the player's character selection during the signup process.
 * namespace
 * @type {{preload: pick_state.preload, create: pick_state.create, back_btn_click: pick_state.back_btn_click, submit_btn_click: pick_state.submit_btn_click}}
 */
var pick_state = {
 
    preload: function() {

       console.log("pick_state: preload");
    },

    create: function() {

        menuclick = game.add.audio('menuclick');
        menuclick.volume = 0.2;

        pickcharSFX = game.add.audio('pickchar');
        pickcharSFX.volume = 0.25;

        // Set the background color of the canvas.
        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        // Add the menu background to screen
        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        // Add the character sprites and add animations
        playerCharcter = game.add.sprite(640, 400, characterPick[0]);
        playerCharcter.anchor.setTo(0.5, 0.5);
        playerCharacterShadow = game.add.sprite(playerCharcter.x, playerCharcter.y + 42, 'Shadow');
        playerCharacterShadow.anchor.setTo(0.5, 0.5);
        var walk = playerCharcter.animations.add('walk');
        playerCharcter.inputEnabled = true;
        playerCharcter.events.onInputDown.add(pickCharW, this);

        var warriorStatText = game.add.bitmapText(playerCharcter.x, playerCharcter.y + 140, 'carrier_command_black','ATTACK: 3\n\nMOBILITY: 1\n\nDEFENCE: 2',20);
        warriorStatText.anchor.setTo(0.5, 0.5);
        warriorStatText.align = 'center';


        playerCharcter2 = game.add.sprite(260, 400, characterPick[1]);
        playerCharcter2.anchor.setTo(0.5, 0.5);
        playerCharacterShadow = game.add.sprite(playerCharcter2.x, playerCharcter2.y + 42, 'Shadow');
        playerCharacterShadow.anchor.setTo(0.5, 0.5);
        var walk = playerCharcter2.animations.add('walk');
        playerCharcter2.inputEnabled = true;
        playerCharcter2.events.onInputDown.add(pickCharM, this);

        var mageStatText = game.add.bitmapText(playerCharcter2.x, playerCharcter2.y + 140, 'carrier_command_black','ATTACK: 1\n\nMOBILITY: 2\n\nDEFENCE: 3',20);
        mageStatText.anchor.setTo(0.5, 0.5);
        mageStatText.align = 'center';

        playerCharcter3 = game.add.sprite(1020, 400, characterPick[2]);
        playerCharcter3.anchor.setTo(0.5, 0.5);
        playerCharacterShadow = game.add.sprite(playerCharcter3.x, playerCharcter3.y + 42, 'Shadow');
        playerCharacterShadow.anchor.setTo(0.5, 0.5);
        var walk = playerCharcter3.animations.add('walk');
        playerCharcter3.inputEnabled = true;
        playerCharcter3.events.onInputDown.add(pickCharT, this);

        var theifStatText = game.add.bitmapText(playerCharcter3.x, playerCharcter3.y + 140, 'carrier_command_black','ATTACK: 2\n\nMOBILITY: 3\n\nDEFENCE: 1',20);
        theifStatText.anchor.setTo(0.5, 0.5);
        theifStatText.align = 'center';

        
        // Add the title text to the screen                
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','PICK A CHARACTER',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        var titleText = game.add.bitmapText(banner.x, banner.y - 50, 'carrier_command_black','CLICK TO SELECT YOUR CHARACTER',20);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        // Add a submit button to the screen, and when clicked launch submit_button_click function
        this.submit_btn = game.add.button(submitX, submitY,  'Submit_button', this.submit_btn_click, this, 2, 1, 0);

        // Add a home button to the screen, and when clicked launch back_btn_clickfunction
        this.back_btn= game.add.button(homeX, homeY,  'Home_button', this.back_btn_click, this, 2, 1, 0);
    },

    // Handles back button click. Transitions the game to the load state.
    back_btn_click: function(){

        menuclick.play();
        menumusic.stop();
        console.log("signup_state: signin_btn_click");
        game.state.start("load");
    },

    // Handles submit button click. Transitions the game to the signup state.
    submit_btn_click: function(){

        menuclick.play();
        console.log("signup_state: signin_btn_click");
        console.log("charcter: " + character);
        user.character_type = character;
        game.state.start("signup");
    },
};

/**
 * Function scales the sprite., and sets the character with setCharacter function..
 */
function pickCharW (){

    pickcharSFX.play();
    playerCharcter.scale.setTo(1.9,1.9);
    playerCharcter.animations.play('walk', 3, true);

    playerCharcter2.scale.setTo(1,1);
    playerCharcter2.animations.stop(null);

    playerCharcter3.scale.setTo(1,1);
    playerCharcter3.animations.stop(null);

    character = 'warrior';
    console.log("charcter: " + character);

}

function pickCharM (){

    pickcharSFX.play();
    playerCharcter2.scale.setTo(1.9,1.9);
    playerCharcter2.animations.play('walk', 3, true);

    playerCharcter.scale.setTo(1,1);
    playerCharcter.animations.stop(null);

    playerCharcter3.scale.setTo(1,1);
    playerCharcter3.animations.stop(null);

    character = 'mage';
    console.log("charcter: " + character);

}

function pickCharT (){

    pickcharSFX.play();
    playerCharcter3.scale.setTo(1.9,1.9);
    playerCharcter3.animations.play('walk', 3, true);

    playerCharcter2.scale.setTo(1,1);
    playerCharcter2.animations.stop(null);

    playerCharcter.scale.setTo(1,1);
    playerCharcter.animations.stop(null);

    character = 'thief';
    console.log("charcter: " + character);

}


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


