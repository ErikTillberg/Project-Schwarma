/**
 * Created by Andrew on 2017-02-09.
 * Modified by Bryon on 2017-02-22.
 */


var nouns = ["ninja", "pancake", "statue", "unicorn", "rainbows", "laser", "bunny", "captain", "nibblets", "cupcake", "carrot", "gnomes", "glitter", "potato", "salad", "toejam", "beets", "toilet", "eggs",  "dragons", "jellybeans", "snakes", "dolls", "bushes", "cookies", "apples", "ice cream", "ukulele", "kazoo", "banjo", "circus", "trampoline", "schwarma"];
var load_state = {
 

    preload: function() {

        // TODO load game assets here when they exist
        game.plugins.add(PhaserInput.Plugin);
        game.load.image('red_button_img','assets/buttons/big-buttons/01-red-normal.png');
        game.load.image('green_field', 'assets/sizetest.png');
        game.load.image('Background', 'assets/Art/BackGround1.png');
        game.load.image('HUD', 'assets/Art/HUD1.png');
        game.load.image('Shadow', 'assets/Art/shadow.png');

        game.load.image('Home_button', 'assets/Art/home_button.png');
        game.load.image('Submit_button', 'assets/Art/submit_button.png');
        game.load.image('ArroeRight', 'Assets/Art/arrowRight.png');
        game.load.image('ArrowLeft', 'Assets/Art/arrowLeft.png');

        game.load.spritesheet('Knight', 'assets/Art/KnightSpriteSheet.png', 384, 384);
        game.load.spritesheet('Thief', 'assets/Art/ThiefSpriteSheet.png', 384, 384);
        game.load.spritesheet('Wizard', 'assets/Art/WizardSpriteSheet.png', 384, 384);
        game.load.spritesheet('Knife', 'assets/Art/KnifeSpriteSheet.png', 100, 100);
        game.load.spritesheet('Fireball', 'assets/Art/FireBallSS.png', 102.5, 50);
        game.load.spritesheet('Flash', 'assets/Art/FlashSpriteSheet.png', 100, 100);
        game.load.spritesheet('Banner', 'assets/Art/banner_ss.png', 1000, 386);

        game.load.spritesheet('Sword', 'assets/Art/sword_ss.png', 750, 750);
        game.load.spritesheet('Button_back', 'assets/Art/button_ss.png', 200, 70);
        game.load.image('menu_background', 'assets/Art/menu_background.png');

        game.load.bitmapFont('carrier_command', 'assets/fonts/carrier_command.png', 'assets/fonts/carrier_command.xml');
        game.load.bitmapFont('carrier_command_black', 'assets/Fonts/carrier_command_black.png', 'assets/Fonts/carrier_command.xml');
    },

    create: function() {

        game.stage.backgroundColor = 'rgb(255, 255, 255)';

        var name = randomName (nouns);

        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        var num = randomInt(0, 4);

        var sword = game.add.sprite( 640, 460,'Sword');
        sword.frame = num;
        sword.anchor.setTo(0.5, 0.5);
        sword.scale.setTo(1.2, 1.2);

        
        /*var button1 = game.add.sprite(banner.x,425 ,'Button_back',signin_btn_click);
        button1.frame = num;
        button1.anchor.setTo(0.5, 0.5);
        button1.inputEnabled = true;
        button1.events.onInputDown.add(signin_btn_click, this);

        var button2= game.add.sprite(banner.x,485,'Button_back');
        button2.frame = num;
        button2.anchor.setTo(0.5, 0.5);
        button2.inputEnabled = true;
        button2.events.onInputDown.add(signup_btn_click, this);*/
                       
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','PROJECT ' + name,40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        var signInText = game.add.bitmapText(banner.x, 415, 'carrier_command_black','SIGN IN',25);
        signInText.anchor.setTo(0.5, 0.5);
        signInText.align = 'center';
        signInText.inputEnabled = true;
        signInText.events.onInputDown.add(signin_btn_click, this);


        var signUpText = game.add.bitmapText(banner.x, 475, 'carrier_command_black','SIGN UP',25);
        signUpText.anchor.setTo(0.5, 0.5);
        signUpText.align = 'center'; 
        signUpText.inputEnabled = true;
        signUpText.events.onInputDown.add(signup_btn_click, this);

        
        // Launch into either the signin or signup state, depending on whether the user
        // Already has an account or not. Determined by flag inside localStorage.

       /*if (window.localStorage['new_user']) {
            if(JSON.parse(window.localStorage['new_user']) === false){
                console.log("Returning user found, loading signin screen.");
                game.state.start('signin');
            }else{
                // Set the flag so its checked if the user does not sign up before coming back to this point.
                console.log("New user found, loading signup screen.");
                window.localStorage['new_user'] = JSON.stringify(true);
                game.state.start('signup');
            }
        }else{
            // Set the flag so its checked if the user does not sign up before coming back to this point.
            console.log("New user found, loading signup screen.");
            window.localStorage['new_user'] = JSON.stringify(true);
            game.state.start('signup');
        }*/
    },

};

function randomName (list) {

    var i = Math.floor(Math.random() * list.length);
    return list[i];
}

function randomInt (min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function signin_btn_click (){

    console.log("signin_state: signin_btn_click");
    game.state.start("signin");
}

function signup_btn_click(){

        console.log("signin_state: signup_btn_click");
        game.state.start("pick_char");
}