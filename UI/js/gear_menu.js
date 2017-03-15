/**
 * Created by Bryon on 2017-03-06.
 */

card = function (game, x, y, element, type, text, num1, num2) {

    var text1 = text;
    var textArray = text1.split(" ");
    var space = " ";

    Phaser.Sprite.call(this, game, x, y, 'Card');
   // this.frame = frame;
    if ( element == 'fire'){
        this.frame = 1;
    }
    else if (element == 'water'){
        this.frame = 3;
    }
    else if (element == 'earth'){
        this.frame = 0;
    }
    else{
        this.frame = 2;
    }
    this.anchor.setTo(0.5, 0.5);

    var Card_item = game.add.sprite(0, 0, 'Card_Item');
    Card_item.anchor.setTo(0.5, 0.5);

    if ( type == 'attack'){
        Card_item.frame = 2;
    }
    else if (type == 'defence'){
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

    if ( element != '') {

        var textNum2 = game.add.bitmapText(-20, 105, 'carrier_command_black', element + ':' + '+' + num2, 9);
        textNum2.anchor.setTo(0.5, 0.5);
        textNum2.align = 'left';
        this.addChild(textNum2);
    }

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


        this.signin_btn = game.add.button(game.world.centerX+250, 600, 'Submit_button', this.submit_btn_click, this, 2, 1, 0);
        this.back_btn= game.add.button(game.world.centerX-530, 600, 'Home_button', this.back_btn_click, this, 2, 1, 0);

        var card1 = new card(game, 800, 360, 'water', 'mobility', 'Mobility card of Head-scratching Effectiveness', +10, +13);
        game.add.existing(card1);

        var card2 = new card(game, 1100, 360, 'fire', 'attack', 'Attack card of Stupid Stuff', 10, 13);
        game.add.existing(card2);

        var card3 = new card(game, 200, 360, 'earth', 'defence', 'Defence card of Total Strangeness', 10, 13);
        game.add.existing(card3);

        var card4 = new card(game, 500, 360, 'none', 'defence', 'Defence card of Boring Thing', 10, 13);
        game.add.existing(card4);

    },

   submit_btn_click: function(){

       console.log("trigger_state: submit_btn_click");
    },

    back_btn_click: function(){

        console.log("main_menu_state: back_btn_click");
        game.state.start("main_menu");
    }

};



