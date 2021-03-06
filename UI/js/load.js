/**
 * Created by Andrew on 2017-02-09.
 * Modified by Bryon on 2017-02-22.
 */


var nouns = ["ninja", "pancake", "statue", "unicorn", "rainbows", "laser", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "beets", "toilet", "eggs",  "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "circus", "trampoline", "schwarma"];
var menumusic;
var menuclick;
var buttonMuteOn;
var buttonMuteOff;
var cardclick;

/**
 * Loads all game assets into Phaser. Launches the landing page for the user to decide where they wish to go next.
 * @namespace
 * @type {{preload: load_state.preload, create: load_state.create}}
 */
var load_state = {

    /**
     * Load game assets (sprite sheets, images, fonts, sounds). Overrides Phaser state preload method.
     */
    preload: function() {

        debug_console.init_log();
        debug_console.message_log("Loading game assets...");

        // TODO load game assets here when they exist
        game.plugins.add(PhaserInput.Plugin);
        game.load.image('red_button_img','assets/buttons/big-buttons/01-red-normal.png');
        game.load.image('Background', 'assets/Art/BackGround1.png');
        game.load.image('HUD', 'assets/Art/HUD1.png');
        game.load.image('Shadow', 'assets/Art/shadow.png');

        game.load.image('Home_button', 'assets/Art/home_button.png');
        game.load.image('Submit_button', 'assets/Art/submit_button.png');
        game.load.image('ArroeRight', 'assets/Art/arrowRight.png');
        game.load.image('ArrowLeft', 'assets/Art/arrowLeft.png');
        game.load.image('muteon', 'assets/Art/muteon.png');
        game.load.image('muteoff', 'assets/Art/muteoff.png');
        game.load.image('plus', 'assets/Art/plus.png');
        game.load.image('minus', 'assets/Art/minus.png');



        game.load.spritesheet('Knight', 'assets/Art/KnightSpriteSheet.png', 384, 384);
        game.load.spritesheet('Thief', 'assets/Art/ThiefSpriteSheet.png', 384, 384);
        game.load.spritesheet('Wizard', 'assets/Art/WizardSpriteSheet.png', 384, 384);
        game.load.spritesheet('Knife', 'assets/Art/KnifeSpriteSheet.png', 100, 100);
        game.load.spritesheet('Fireball', 'assets/Art/FireBallSS.png', 102.5, 50);
        game.load.spritesheet('Flash', 'assets/Art/FlashSpriteSheet.png', 100, 100);
        game.load.spritesheet('Banner', 'assets/Art/banner_ss.png', 1000, 386);
        game.load.spritesheet('sim', 'assets/Art/simSS.png', 600, 100);

        game.load.spritesheet('Sword', 'assets/Art/sword_ss.png', 750, 750);
        game.load.spritesheet('Button_back', 'assets/Art/button_ss.png', 200, 70);

        game.load.spritesheet('Card', 'assets/Art/cardSS.png', 194, 279);
        game.load.spritesheet('Card_Item', 'assets/Art/cardthingSS.png', 100, 100);

        game.load.image('menu_background', 'assets/Art/menu_background.png');

        game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        game.load.bitmapFont('carrier_command_black', 'assets/fonts/carrier_command_black.png', 'assets/fonts/carrier_command.xml');

        game.load.audio('menumusic', 'assets/sounds/menumusic.wav');
        game.load.audio('attackclose', 'assets/sounds/attackclose.wav');
        game.load.audio('attackfar', 'assets/sounds/attackfar.wav');
        game.load.audio('block', 'assets/sounds/block.wav');
        game.load.audio('jump', 'assets/sounds/jump.wav');
        game.load.audio('menuclick', 'assets/sounds/menuclick.wav');
        game.load.audio('winmusic', 'assets/sounds/winmusic.wav');
        game.load.audio('roll', 'assets/sounds/roll.wav');
        game.load.audio('walk', 'assets/sounds/walk.wav');
        game.load.audio('pickchar', 'assets/sounds/charpick.wav');
        game.load.audio('attackclose2', 'assets/sounds/attackclose2.wav');
        game.load.audio('cardclick', 'assets/sounds/cardpick.wav');
        game.load.audio('battlewmusic', 'assets/sounds/battlemusic.wav');
        game.load.audio('heal', 'assets/sounds/heal.wav');
    },

    /**
     * Initialize the landing page. Overrides Phaser state create method.
     */
    create: function() {

        menumusic = game.add.audio('menumusic');
        menumusic.loopFull(0.15);

        menuclick = game.add.audio('menuclick');
        menuclick.volume = 0.2;

        // Set the background color of the canvas.
        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        // Get the name to display by picking randomly from nouns array.
        var name = randomName (nouns);

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

        buttonMuteOn = game.add.sprite(submitX,submitY ,'muteon');
        buttonMuteOn.anchor.setTo(0.5, 0.5);
        buttonMuteOn.inputEnabled = true;
        buttonMuteOn.events.onInputDown.add(muteon_btn_click, this);

	    buttonMuteOff= game.add.sprite(submitX,submitY,'muteoff');
        buttonMuteOff.anchor.setTo(0.5, 0.5);
        buttonMuteOff.inputEnabled = true;
        buttonMuteOff.events.onInputDown.add(muteoff_btn_click, this);
        buttonMuteOff.visible = false;

        // Add the title text to the screen
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','PROJECT ' + name,40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        // Add the sign in text to screen, and when clicked launch sighin_btn_click function
        var signInText = game.add.bitmapText(banner.x, 415, 'carrier_command_black','SIGN IN',25);
        signInText.anchor.setTo(0.5, 0.5);
        signInText.align = 'center';
        signInText.inputEnabled = true;
        signInText.events.onInputDown.add(signin_btn_click, this);

        // Add the sign up text to screen, and when clicked launch sighup_btn_click function
        var signUpText = game.add.bitmapText(banner.x, 475, 'carrier_command_black','SIGN UP',25);
        signUpText.anchor.setTo(0.5, 0.5);
        signUpText.align = 'center'; 
        signUpText.inputEnabled = true;
        signUpText.events.onInputDown.add(signup_btn_click, this);

        var creditText = game.add.bitmapText(150, 650, 'carrier_command_black','CREDITS',20);
        creditText.anchor.setTo(0.5, 0.5);
        creditText.align = 'center';
        creditText.inputEnabled = true;
        creditText.events.onInputDown.add(credit_btn_click, this);
           
    }

};

/**
 * Function creates a rondom integer, then uses it to pick a string from an array list.
 * @param list
 * @returns {string}
 */
function randomName (list) {

    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

/**
 * Function creates a random integer between min and max and returns it.
 * @param min
 * @param max
 * @returns {number}
 */
function randomInt (min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Function sends the user to the signin state.
 */
function signin_btn_click (){

    menuclick.play();
    console.log("signin_state: signin_btn_click");
    game.state.start("signin");
}

/**
 * Function sends the user to the pick_char state.
 */
function signup_btn_click(){

    menuclick.play();
    console.log("signin_state: signup_btn_click");
    game.state.start("pick_char");
}

function muteon_btn_click(){

    menuclick.play();
    console.log("signin_state: muteon_btn_click");
    menumusic.volume = 0;
    buttonMuteOn.visible = false;
    buttonMuteOff.visible = true;

}

function muteoff_btn_click(){

    menuclick.play();
    console.log("signin_state: muteoff_btn_click");
    menumusic.volume = 0.2;
    buttonMuteOn.visible = true;
    buttonMuteOff.visible = false;
}

function credit_btn_click(){

    console.log("signin_state: signup_btn_click");
    game.state.start("credit");
}