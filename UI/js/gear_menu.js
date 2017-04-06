/**
 * Created by Bryon on 2017-03-06.
 */

/**
 * prototype for card creation
 *
 * @param game
 * @param x
 * @param y
 * @param element
 * @param cardtype
 * @param title
 * @param num1
 * @param num2
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
    if ( cardtype == 'attack' || cardtype == 'weapon'){
        Card_item.frame = 2;
    }
    else if (cardtype == 'defense' || cardtype == 'shield'){
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

    if (parseInt(num1) > 0) {

        var textNum1 = game.add.bitmapText(-20, 85, 'carrier_command_black', cardtype + ':' + '+' + num1, 9);
        textNum1.anchor.setTo(0.5, 0.5);
        textNum1.align = 'left';
        this.addChild(textNum1);
    }

    if ( element != '' && parseInt(num2) > 0 || cardtype == 'mobility') {

        if (cardtype == 'mobility') {
            var textNum2 = game.add.bitmapText(-20, 105, 'carrier_command_black', "Dir" + ': ' + num2, 9);
            textNum2.anchor.setTo(0.5, 0.5);
            textNum2.align = 'left';
            this.addChild(textNum2);
        }else{
            var textNum2 = game.add.bitmapText(-20, 105, 'carrier_command_black', element + ':' + '+' + num2, 9);
            textNum2.anchor.setTo(0.5, 0.5);
            textNum2.align = 'left';
            this.addChild(textNum2);
        }

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
var attackTxt;
var mobilityTxt;
var defenceTxt;
var statText;

var gear_menu_state = {

    // Determines the size of grid elements in the card selectors
    selector_x_offset: 200,
    selector_y_offset: 200,
    selector_columns: 6,
    selector_rows: 2,

    shield_card: 0,
    weapon_card: 0,
    boot_card: 0,

    current_type: 0,
    current_slot: 0,

    preload: function(){
        console.log("gear_menu_state: preload");
    },

    create: function(){
        console.log("gear_menu_state: create");

        // Add sounds
        click = game.add.audio('menuclick');
        menuclick.volume = 0.2;

        cardclick = game.add.audio('cardclick');
        cardclick.volume = 0.2;

        // Add background
        game.stage.backgroundColor = 'rgb(255, 255, 255)';
        var background = game.add.sprite(0,0, 'menu_background');

        // Add banner sprite
        var banner = game.add.sprite(640,210,'Banner');
        banner.frame = randomInt(0, 4);
        banner.anchor.setTo(0.5, 0.5);

        // Add ttile text (text on banner)
        var titleText = game.add.bitmapText(banner.x, banner.y - 100, 'carrier_command_black','GEAR MENU',40);
        titleText.anchor.setTo(0.5, 0.5);
        titleText.align = 'center';

        // Add character sprite and animations
        player = game.add.sprite(640, 420,  pickCharacter (  user.character_type));
        player.anchor.setTo(0.5, 0.5);
        player.scale.setTo(1.5, 1.5);
        playerShadow = game.add.sprite(player.x, player.y + 60, 'Shadow');
        playerShadow.anchor.setTo(0.5, 0.5);
        playerShadow.scale.setTo(1.5, 1.5);
        var walk = player.animations.add('walk');
        player.animations.play('walk', 3, true);

        // Set attackTxt, mobilityTxt, defenceTxt base on character type
        if (user.character_type == 'warrior'){

            attackTxt = 3;
            mobilityTxt = 1;
            defenceTxt = 2;
        }

        else if (user.character_type == 'thief' ){

            attackTxt = 2;
            mobilityTxt = 3;
            defenceTxt = 1;
        }

        else{

            attackTxt = 1;
            mobilityTxt = 3;
            defenceTxt = 2;
        }

        // Add cards to screen
        cardMobility = new card(game, 1040, 160,
            user.equipped_gear.equipped_boots.elementalStatBonus.element,
            'boots', user.equipped_gear.equipped_boots.name,
            user.equipped_gear.equipped_boots.statBonus.bonus.toFixed(1),
            user.equipped_gear.equipped_boots.elementalStatBonus.bonus.toFixed(1));

        game.add.existing(cardMobility);
        //cardMobility.scale.setTo(0.8, 0.8);
        cardMobility.inputEnabled = true;
        cardMobility.events.onInputDown.add(this.card_click, {card: this.card});

        // Add mobilityTxt to screen
        var mobilityText = game.add.bitmapText(cardMobility.x, cardMobility.y + 160, 'carrier_command_black','boots',20);

        mobilityText.anchor.setTo(0.5, 0.5);
        mobilityText.align = 'center';

        // cardAttack = new card(game, 1040, 520, 'fire', 'attack', 'big sword of Stupid Stuff', +1, +13);

        cardAttack = new card(game, 1040, 520,
            user.equipped_gear.equipped_weapon.elementalStatBonus.element,
            'weapon',
            user.equipped_gear.equipped_weapon.name,
            user.equipped_gear.equipped_weapon.statBonus.bonus.toFixed(1),
            user.equipped_gear.equipped_weapon.elementalStatBonus.bonus.toFixed(1));

        game.add.existing(cardAttack);
        //cardAttack.scale.setTo(0.8, 0.8);
        cardAttack.inputEnabled = true;
        cardAttack.events.onInputDown.add(this.card_click, {card: this.card});

        // Add attackTxt to screen
        var attackText = game.add.bitmapText(cardAttack.x, cardAttack.y - 160, 'carrier_command_black','weapon',20);
        attackText.anchor.setTo(0.5, 0.5);
        attackText.align = 'center';

        // cardDefence = new card(game, 240, 360, 'earth', 'defence', 'small shield of Boring Thing', +1, +13);

        cardDefence = new card(game, 240, 360,
            user.equipped_gear.equipped_chest.elementalStatBonus.element,
            'shield', user.equipped_gear.equipped_chest.name,
            user.equipped_gear.equipped_chest.statBonus.bonus.toFixed(1),
            user.equipped_gear.equipped_chest.elementalStatBonus.bonus.toFixed(1));

        game.add.existing(cardDefence);
        //cardDefence.scale.setTo(0.8, 0.8);
        cardDefence.inputEnabled = true;
        cardDefence.events.onInputDown.add(this.card_click, {card: this.card});

        // Add defencText to screen
        var defenceText = game.add.bitmapText(cardDefence.x, cardDefence.y + 160, 'carrier_command_black','armour',20);
        defenceText.anchor.setTo(0.5, 0.5);
        defenceText.align = 'center';

        // Add text under the title on banner
        var infoText = game.add.bitmapText(banner.x, banner.y - 50 ,'carrier_command_black','Click card to change gear',15);
        infoText.anchor.setTo(0.5, 0.5);
        infoText.align = 'center';

        // Add stst text to screen
        statText = game.add.bitmapText(player.x, player.y + 170 ,'carrier_command_black','Attack:' + attackTxt+ '\n\nDefence: ' + defenceTxt + '\n\nMobility: ' + mobilityTxt, 20);
        statText.anchor.setTo(0.5, 0.5);
        statText.align = 'center';

        // Add submit button to screen
        this.signin_btn = game.add.button(submitX, submitY, 'Submit_button', this.submit_btn_click, this, 2, 1, 0);

        // Add home button to screen
        this.back_btn= game.add.button(homeX, homeY, 'Home_button', this.back_btn_click, this, 2, 1, 0);

        debug_console.init_log();
        debug_console.debug_log("Signed in as: " + user.username);

        // Initalize card selector
        this.init_card_selectors();

    },

    /**
     *  update tattackText, defenceTxt, mobilityTxt
     */
    update: function() {

        statText.setText('Attack:' + attackTxt + '\n\nDefence: ' + defenceTxt + '\n\nMobility: ' + mobilityTxt);
    },

    // Builds groups for cards in each category we can pull up when the user needs to select a car
    init_card_selectors: function() {

        var num_weapon_cards = 0;
        var num_chest_cards = 0;
        var num_boot_cards = 0;

        var banner_x = 540;
        var banner_y = -220;
        var banner_font_size = 25;

        this.weapon_selector = game.add.group();
        this.chest_selector = game.add.group();
        this.boot_selector = game.add.group();

        this.weapon_selector.add(game.add.sprite(-120,-300, 'menu_background'));
        this.chest_selector.add(game.add.sprite(-120,-300, 'menu_background'));
        this.boot_selector.add(game.add.sprite(-120,-300, 'menu_background'));

        var weapon_banner = game.add.sprite(banner_x, banner_y, 'Banner');
        weapon_banner.frame = 2;
        weapon_banner.scale.setTo(0.5, 0.5);
        weapon_banner.anchor.setTo(0.5, 0.2);

        var weapon_text = game.add.bitmapText(weapon_banner.x, weapon_banner.y, 'carrier_command_black', "WEAPON", banner_font_size);
        weapon_text.anchor.setTo(0.5, 0);

        var boot_banner = game.add.sprite(banner_x, banner_y, 'Banner');
        boot_banner.frame = 3;
        boot_banner.scale.setTo(0.5, 0.5);
        boot_banner.anchor.setTo(0.5, 0.2);

        var boot_text = game.add.bitmapText(weapon_banner.x, weapon_banner.y, 'carrier_command_black', "BOOTS", banner_font_size);
        boot_text.anchor.setTo(0.5, 0);

        var chest_banner = game.add.sprite(banner_x, banner_y, 'Banner');
        chest_banner.frame = 1;
        chest_banner.scale.setTo(0.5, 0.5);
        chest_banner.anchor.setTo(0.5, 0.2);

        var chest_text = game.add.bitmapText(weapon_banner.x, weapon_banner.y, 'carrier_command_black', "ARMOUR", banner_font_size);
        chest_text.anchor.setTo(0.5, 0);

        this.weapon_selector.add(weapon_banner);
        this.boot_selector.add(boot_banner);
        this.chest_selector.add(chest_banner);

        this.weapon_selector.add(weapon_text);
        this.boot_selector.add(boot_text);
        this.chest_selector.add(chest_text);

        this.boot_selector.x = 120;
        this.boot_selector.y = 300;

        this.chest_selector.x = 120;
        this.chest_selector.y = 300;

        this.weapon_selector.x = 120;
        this.weapon_selector.y = 300;

        for (var i = 0; i < user.gear.length; i++) {

            if (user.gear[i].type == "weapon") {
                console.log("Adding weapon card: " + num_weapon_cards);
                this.weapon_selector.add(this.selector_card_wrapper(user.gear[i], num_weapon_cards, i));
                num_weapon_cards++;

            }else if (user.gear[i].type == "boots") {
                console.log("Adding boot card: " + num_boot_cards);
                this.boot_selector.add(this.selector_card_wrapper(user.gear[i], num_boot_cards, i));
                num_boot_cards++;

            }else if (user.gear[i].type == "shield") {
                console.log("Adding chest card: " + num_chest_cards);
                this.chest_selector.add(this.selector_card_wrapper(user.gear[i], num_chest_cards, i));
                num_chest_cards++;
            }
        }

        this.weapon_selector.visible = false;
        this.boot_selector.visible = false;
        this.chest_selector.visible = false;

    },

    /**
     * Takes a card slot and type and renders that card on screen.
     *
     */
    card_wrapper: function(gear_data) {

        var card_x;
        var card_y;

        if (gear_data.type == "weapon") {
            card_x = 1040;
            card_y = 520;
        }else if(gear_data.type == "boots") {
            card_x = 1040;
            card_y = 160;
        }else {
            card_x = 240;
            card_y = 360;
        }

        new_card = new card(game,
            card_x,
            card_y,
            gear_data.elementalStatBonus.element,
            gear_data.type,
            gear_data.name,
            gear_data.statBonus.bonus.toFixed(1),
            gear_data.elementalStatBonus.bonus.toFixed(1));

        //cardMobility.scale.setTo(0.8, 0.8);
        new_card.inputEnabled = true;
        new_card.events.onInputDown.add(gear_menu_state.card_click, {card: this.card});

        new_card.type = gear_data.type;

        return new_card;

    },

    /**
     * Takes a card JSON object and its place in the sequence of Cards within its category, and returns a constructed Card that
     * is in the proper slot within the category's card selector.
     * @param card_data Card JSON data
     * @param card_num The index in which the card appears amongst all cards within its type, also its location within the selector
     * @param card_list_index The index in which the card appears amongst all cards the player has
     */
    selector_card_wrapper: function(gear_data, gear_num, gear_list_index) {

        console.log("selector_card_wrapper");

        var card_x = (gear_num % this.selector_columns) * this.selector_x_offset;
        var card_y = Math.floor(gear_num / this.selector_columns) * this.selector_y_offset;

        var new_card = new card(game,
            card_x,
            card_y,
            gear_data.elementalStatBonus.element,
            gear_data.type,
            gear_data.name,
            gear_data.statBonus.bonus.toFixed(2),
            gear_data.elementalStatBonus.bonus.toFixed(2));

        // Append some custom data to the card to make assignments and look-ups easier in the click handler.
        new_card.list_index = gear_list_index;
        new_card.card_num = gear_num;
        new_card.scale.setTo(0.7, 0.7);
        new_card.shadow.scale.setTo(0.7, 0.7);
        new_card.shadow.visible = false;

        new_card.inputEnabled = true;
        new_card.events.onInputDown.add(this.selector_card_click);

        return new_card;

    },

    /**
     * Set the current_slot and current_type attributes and then open the card selector group for that card type.
     * @param target The target of the click event, should be a card object
     */
    card_click: function (target){

        // target.shadow.destroy();
        // target.destroy();
        cardclick.play();
        console.log(target);
        console.log("trigger_state: card_click " + target.cardtype);

        console.log(target.cardtype + " card clicked.");

        this.current_type = target.cardtype;

        if (this.current_type == "weapon") {
            gear_menu_state.weapon_selector.visible = true;
            game.world.bringToTop(gear_menu_state.weapon_selector);
        }else if (this.current_type == "shield"){
            gear_menu_state.chest_selector.visible = true;
            game.world.bringToTop(gear_menu_state.chest_selector);
        }else if (this.current_type == "boots") {
            gear_menu_state.boot_selector.visible = true;
            game.world.bringToTop(gear_menu_state.boot_selector);
        }
    },

    /**
     * Handles the user clicking on a card in a selector menu. Assigns the clicked card to a slot and renders it.
     * @param target Event target, should be a card within a card selector
     */
    selector_card_click: function(target) {

        console.log(target.cardtype + " card chosen.");
        cardclick.play();

        // Change the card rendered in the given slot
        game.add.existing(gear_menu_state.card_wrapper(user.gear[target.list_index]));

        // Hide the card selectors
        gear_menu_state.weapon_selector.visible = false;
        gear_menu_state.boot_selector.visible = false;
        gear_menu_state.chest_selector.visible = false;

        // Update the status of the chosen cards array
        if (target.cardtype == "weapon") {
            gear_menu_state.weapon_card = target.list_index;
        }else if (target.cardtype == "boots") {
            gear_menu_state.boot_card = target.list_index;
        }else{
            gear_menu_state.shield_card = target.list_index;
        }
    },


   submit_btn_click: function(){

       console.log("trigger_state: submit_btn_click");
       menuclick.play();

       console.log("Username: " + user.username);
       console.log(user.gear[gear_menu_state.shield_card]);
       console.log(user.gear[gear_menu_state.weapon_card]);
       console.log(user.gear[gear_menu_state.boot_card]);

       // Make a call to the server to submit the current gear selection
       $.ajax({
           type: "POST",
           crossDomain: true,
           dataType: 'application/json',
           url: server.gear_endpoint(),
           data: JSON.stringify({
               username: user.username,
               equippedChest: "\"" + JSON.stringify(user.gear[gear_menu_state.shield_card]) + "\"",
               equippedWeapon: "\"" + JSON.stringify(user.gear[gear_menu_state.weapon_card]) + "\"",
               equippedBoots: "\"" +  JSON.stringify(user.gear[gear_menu_state.boot_card]) + "\""
           }),
           success: this.set_equipment_success,
           error: this.set_equipment_failure
       });

    },


    set_equipment_success: function(data, textStatus, jqXHR) {

            console.log("Set Equipment success");

            user.equipped_gear.equipped_chest = user.gear[gear_menu_state.shield_card];
            user.equipped_gear.equipped_weapon = user.gear[gear_menu_state.weapon_card];
            user.equipped_gear.equipped_boots = user.gear[gear_menu_state.boot_card];

            console.log(user);
            game.state.start("main_menu");
    },

    set_equipment_failure: function(jqXHR, textStatus, error) {

       console.log("Set equipment failure");

        user.equipped_gear.equipped_chest = user.gear[gear_menu_state.shield_card];
        user.equipped_gear.equipped_weapon = user.gear[gear_menu_state.weapon_card];
        user.equipped_gear.equipped_boots = user.gear[gear_menu_state.boot_card];
        console.log(textStatus);
       console.log(error);
       console.log(jqXHR);

        game.state.start("main_menu");
    },

    /**
     * Transitions user to main_menu state
     */
    back_btn_click: function(){

        menuclick.play();
        console.log("main_menu_state: back_btn_click");
        game.state.start("main_menu");
    }
};






