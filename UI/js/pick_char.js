
var characterPick = ["Knight", "Wizard", "Thief"];
var i = 0;
var sword;
var playerCharcter;


var pick_state = {
 
    preload: function() {

       console.log("pick_state: preload");
    },

    create: function() {

        setCharacter (i);

        game.stage.backgroundColor = 'rgb(255, 255, 255)';

                 
        var background = game.add.sprite(0,0, 'menu_background');
        var banner = game.add.sprite(640,225,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        var num = randomInt(0, 4);
        
        var sword = game.add.sprite( 640, 480,'Sword');
        sword.frame = num;
        sword.anchor.setTo(0.5, 0.5);

        playerCharcter = game.add.sprite(640, sword.y + 20, characterPick[i]); 
        playerCharcter.anchor.setTo(0.5, 0.5);

        var walk = playerCharcter.animations.add('walk');
        playerCharcter.animations.play('walk', 3, true);

        var arrowRight = game.add.sprite( game.world.centerX+250, playerCharcter.y+80, 'ArroeRight');
        arrowRight.inputEnabled = true;
        arrowRight.events.onInputDown.add(pickRight, this);
               
        var arrowLeft = game.add.sprite( game.world.centerX-350, playerCharcter.y+80, 'ArrowLeft');
        arrowLeft.inputEnabled = true;
        arrowLeft.events.onInputDown.add(pickLeft, this);
                        
        var titleText = game.add.bitmapText(640, 150, 'carrier_command_black','PICK A CHARATCER',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        this.submit_btn = game.add.button(game.world.centerX+250, 450,  'Submit_button', this.submit_btn_click, this, 2, 1, 0);
        this.back_btn= game.add.button(game.world.centerX-530, 450,  'Home_button', this.back_btn_click, this, 2, 1, 0);
    },

    back_btn_click: function(){

        console.log("signup_state: signin_btn_click");
        game.state.start("load");
    },

    submit_btn_click: function(){

        console.log("signup_state: signin_btn_click");
        console.log("charcter: " + character);
        game.state.start("signup");
    },
};

function pickRight () {

    i++;
   
    if (i > 2 ){

        i = 0;
    }

    playerCharcter.destroy();
    playerCharcter = game.add.sprite(640, sword.y + 20, characterPick[i]); 
    playerCharcter.anchor.setTo(0.5, 0.5);
    walk = playerCharcter.animations.add('walk');
    playerCharcter.animations.play('walk', 3, true);

    setCharacter ( i );
}

function pickLeft () {

    i--;

    if (i < 0 ){

        i = 2;
    }

    playerCharcter.destroy();
    playerCharcter = game.add.sprite(640, sword.y+20, characterPick[i]); 
    playerCharcter.anchor.setTo(0.5, 0.5);
    walk = playerCharcter.animations.add('walk');
    playerCharcter.animations.play('walk', 3, true);


    setCharacter (i);
}

 function randomInt (min, max) {

    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setCharacter (num){

    if (num == 0){
        character = 'warrior';
    }

    else if (num == 1){
        character = 'mage';
    }

    else{

        character = 'theif';
    }
}

