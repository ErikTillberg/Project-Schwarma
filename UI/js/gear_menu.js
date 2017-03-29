/**
 * Created by Bryon on 2017-03-06.
 */

card = function (game, x, y, element, cardtype, title, num1, num2) {

    var textArray = title.split(" ");
    var space = " ";
    var xOffset;

    this.element = element;
    this.cardtype = cardtype;
    this.title = title;
    this.num1 = num1;
    this.num2 = num2;


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
    if ( cardtype == 'attack'){
        Card_item.frame = 2;
    }
    else if (cardtype == 'defence'){
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

    var textNum1 = game.add.bitmapText(-20, 85, 'carrier_command_black', cardtype + ':' + '+' + num1, 9);
    textNum1.anchor.setTo(0.5, 0.5);
    textNum1.align = 'left';
    this.addChild(textNum1);

    if ( element != '') {

        var textNum2 = game.add.bitmapText(-20, 105, 'carrier_command_black', element + ':' + '+' + num2, 9);
        textNum2.anchor.setTo(0.5, 0.5);
        textNum2.align = 'left';
        this.addChild(textNum2);
    }

    if ( this.x > 640 ){

        xOffset = -10;
    }
    else {
        xOffset = +10;
    }

    this.shadow = game.add.sprite(this.x + xOffset, this.y + 8, 'Card');
    this.shadow.anchor.set(0.5);
    this.shadow.tint = 0x000000;
    this.shadow.alpha = 0.4;
};

card.prototype = Object.create(Phaser.Sprite.prototype);
card.prototype.constructor = card;

var cardDefence;
var cardAttack;
var cardMobility;

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

        this.signin_btn = game.add.button(submitX, submitY, 'Submit_button', this.submit_btn_click, this, 2, 1, 0);
        this.back_btn= game.add.button(homeX, homeY, 'Home_button', this.back_btn_click, this, 2, 1, 0);

        player = game.add.sprite(640, 420,  pickCharacter (  user.character_type));
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(1.5, 1.5);
        playerShadow = game.add.sprite(player.x, player.y + 60, 'Shadow');
        playerShadow.anchor.setTo(0.5, 0.5);
        playerShadow.scale.setTo(1.5, 1.5);
        var walk = player.animations.add('walk');
        player.animations.play('walk', 3, true);

        cardMobility = new card(game, 1040, 160, 'water', 'mobility', 'Fast boots of Head-scratching Effectiveness', +2, +13);
        game.add.existing(cardMobility);
        //cardMobility.scale.setTo(0.8, 0.8);
        cardMobility.inputEnabled = true;
        cardMobility.events.onInputDown.add(this.card_click, {card: this.card});

        var mobilityText = game.add.bitmapText(cardMobility.x, cardMobility.y + 160, 'carrier_command','boots',20);
        mobilityText.anchor.setTo(0.5, 0.5);
        mobilityText.align = 'center';


        cardAttack = new card(game, 1040, 520, 'fire', 'attack', 'big sword of Stupid Stuff', +1, +13);
        game.add.existing(cardAttack);
        //cardAttack.scale.setTo(0.8, 0.8);
        cardAttack.inputEnabled = true;
        cardAttack.events.onInputDown.add(this.card_click, {card: this.card});

        var attackText = game.add.bitmapText(cardAttack.x, cardAttack.y - 160, 'carrier_command','weapon',20);
        attackText.anchor.setTo(0.5, 0.5);
        attackText.align = 'center';

        cardDefence = new card(game, 240, 360, 'earth', 'defence', 'small shield of Boring Thing', +1, +13);
        game.add.existing(cardDefence);
        //cardDefence.scale.setTo(0.8, 0.8);
        cardDefence.inputEnabled = true;
        cardDefence.events.onInputDown.add(this.card_click, {card: this.card});

        var defenceText = game.add.bitmapText(cardDefence.x, cardDefence.y + 160, 'carrier_command','armour',20);
        defenceText.anchor.setTo(0.5, 0.5);
        defenceText.align = 'center';

        var infoText = game.add.bitmapText(banner.x, banner.y - 50 ,'carrier_command_black','Click card to change gear',15);
        infoText.anchor.setTo(0.5, 0.5);
        infoText.align = 'center';

        var statText = game.add.bitmapText(player.x, player.y + 170 ,'carrier_command','Attack: 1\n\nDefence: 2\n\nMobility: 3', 20);
        statText.anchor.setTo(0.5, 0.5);
        statText.align = 'center';

        debug_console.init_log();
        debug_console.debug_log("You're on the gear menu screen. Signed in as: " + user.username);

    },

    card_click: function (card){

        card.shadow.destroy();
        card.destroy();
        console.log("trigger_state: card_click " + card.cardtype);

    },

   submit_btn_click: function(){

       console.log("trigger_state: submit_btn_click");



    },

    back_btn_click: function(){

        console.log("main_menu_state: back_btn_click");
        game.state.start("main_menu");
    }

};






