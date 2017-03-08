/**
 * Created by Bryon on 2017-03-06.
 */

card = function (game, x, y, element, type, text, num1, num2) {

    var text1 = text;
    var textArray = text1.split(" ");
    var space = " ";

    Phaser.Sprite.call(this, game, x, y, 'Card');
   // this.frame = frame;
    if ( element == 'Fire'){
        this.frame = 1;
    }
    else if (element == 'Water'){
        this.frame = 3;
    }
    else if (element == 'Earth'){
        this.frame = 0;
    }
    else{
        this.frame = 2;
    }
    this.anchor.setTo(0.5, 0.5);

    var Card_item = game.add.sprite(0, 0, 'Card_Item');
    Card_item.anchor.setTo(0.5, 0.5);
    if ( type == 'Attack'){
        Card_item.frame = 2;
    }
    else if (type == 'Defend'){
        Card_item.frame = 0;
    }
    else{
        Card_item.frame = 1;
    }

    this.addChild(Card_item);

    var textdone = game.add.bitmapText(0, -90, 'carrier_command_black', textArray[0] + space + textArray[1] + '\n\n' + textArray[2] + '\n\n' + textArray[3] + '\n\n' + textArray[4] , 9);
    textdone.anchor.setTo(0.5, 0.5);
    textdone.align = 'center';
    this.addChild(textdone);

    var textNum1 = game.add.bitmapText(-20, 85, 'carrier_command_black', type + ':' + '+' + num1, 9);
    textNum1.anchor.setTo(0.5, 0.5);
    textNum1.align = 'left';
    this.addChild(textNum1);

    var textNum2 = game.add.bitmapText(-20, 105, 'carrier_command_black', element + ':' + '+' + num2, 9);
    textNum2.anchor.setTo(0.5, 0.5);
    textNum2.align = 'left';
    this.addChild(textNum2);
};

card.prototype = Object.create(Phaser.Sprite.prototype);
card.prototype.constructor = card;

var gear_menu_state = {

    preload: function(){
        console.log("gear_menu_state: preload");
    },

    create: function(){
        console.log("gear_menu_state: create");

        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        var background = game.add.sprite(0,0, 'menu_background');

        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','GEAR MENU',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        debug_console.init_log();
        debug_console.debug_log("You're on the gear menu screen. Signed in as: " + user.username);


        this.signin_btn = game.add.button(game.world.centerX+250, 450, 'Submit_button', this.submit_btn_click, this, 2, 1, 0);
        this.back_btn= game.add.button(game.world.centerX-530, 450, 'Home_button', this.back_btn_click, this, 2, 1, 0);

        var card1 = new card(game, 640, 360, 'Water', 'Mobility', 'Mobility card of Head-scratching Effectiveness', +10, +13);
        game.add.existing(card1);

        var card2 = new card(game, 1000, 360, 'Fire', 'Attack', 'Attack card of Stupid Stuff', +10, +13);
        game.add.existing(card2);


    },

   submit_btn_click: function(){

       console.log("trigger_state: submit_btn_click");
       //var card1 = makeCard('hi', 'earth', 'dd ',1,2, 640, 360);
    },

    back_btn_click: function(){

        console.log("main_menu_state: back_btn_click");
        game.state.start("main_menu");
    }

};



