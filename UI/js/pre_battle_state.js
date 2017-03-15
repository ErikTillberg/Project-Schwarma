/**
 * Created by Andrew on 2017-03-09.
 */

var pre_battle_state = {

    battle_socket: null,

    // Determines the row and column positions of cards in each category
    attack_card_x: 100,
    mobility_card_x: 500,
    defense_card_x: 900,
    card_y: 200,
    card_y_offset: 200,

    // trigger button offsets from their corresponding cards
    trigger_next_btn_x_offset: 140,
    trigger_prev_btn_x_offset: 80,
    trigger_btn_y_offset: 140,
    trigger_text_x: 200,
    trigger_text_y: 160,
    trigger_text_x_offset: 400,
    trigger_text_y_offset: 200,
    trigger_font: 'carrier_command_black',
    trigger_font_size: 12,

    // Determines which slot is currently being swapped
    current_slot: 0,
    current_type: "attack",

    // Settings for roll percentages
    roll_text_x: 100,
    roll_text_y: 50,
    roll_text_x_offset: 400,
    roll_text_font: 'carrier_command_black',
    roll_text_font_size: 20,
    roll_button_y: 33,
    roll_btn_scale: 0.5,

    // Determines the size of grid elements in the card selectors
    selector_x_offset: 200,
    selector_y_offset: 200,
    selector_columns: 6,
    selector_rows: 3,

    // Trigger button scale
    trigger_btn_scale: 0.7,

    // Stores indexes into the user.cards array (same for other card types below)
    mobility_cards: [],
    // Stores indexes into the triggers array
    mobility_triggers: [],

    attack_cards: [],
    attack_triggers: [],

    defense_cards: [],
    defense_triggers: [],

    // List of triggers, name is displayed to the user, condition object is sent to the sim server
    triggers: [
        {
            name: "Low Player HP",
            condition: {
                lhs: "playerHP",
                operator: "<=",
                rhs: "50"
            }
        },
        {
            name: "High Player HP",
            condition: {
                lhs: "playerHP",
                operator: ">",
                rhs: "50"
            }
        },
        {
            name: "Close",
            condition: {
                lhs: "distance",
                operator: "==",
                rhs: "touching"
            }
        },
        {
            name: "Far",
            condition: {
                lhs: "distance",
                operator: ">=",
                rhs: "close"
            }
        },
        {
            name: "Low Enemy HP",
            condition: {
                lhs: "enemyHP",
                operator: "<=",
                rhs: "50"
            }
        },
        {
            name: "High Enemy HP",
            condition: {
                lhs: "enemyHP",
                operator: ">",
                rhs: "50"
            }
        }
    ],
    roll_percentages: [7, 6, 7],

    preload: function() {

        console.log("pre_battle_state: preload");

    },
    create: function() {

        console.log("pre_battle_state: create");

        // Open the battleSocket
        this.battle_socket = server.battle_socket();

        this.init_cards();
        this.init_triggers();
        this.init_card_selectors();

        // Put all of the button on screen for selecting triggers
        // This includes left and right for each card's trigger
        this.attack_1_next_trigger = game.add.button(this.attack_card_x + this.trigger_next_btn_x_offset, 240, 'ArroeRight', function() {pre_battle_state.next_trigger(0, "attack")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.attack_2_next_trigger = game.add.button(this.attack_card_x + this.trigger_next_btn_x_offset, 440, 'ArroeRight', function() {pre_battle_state.next_trigger(1, "attack")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.attack_3_next_trigger = game.add.button(this.attack_card_x + this.trigger_next_btn_x_offset, 640, 'ArroeRight', function() {pre_battle_state.next_trigger(2, "attack")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);

        this.attack_1_previous_trigger = game.add.button(this.attack_card_x + this.trigger_prev_btn_x_offset, 240, 'ArrowLeft', function() {pre_battle_state.previous_trigger(0, "attack")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.attack_2_previous_trigger = game.add.button(this.attack_card_x + this.trigger_prev_btn_x_offset, 440, 'ArrowLeft', function() {pre_battle_state.previous_trigger(1, "attack")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.attack_3_previous_trigger = game.add.button(this.attack_card_x + this.trigger_prev_btn_x_offset, 640, 'ArrowLeft', function() {pre_battle_state.previous_trigger(2, "attack")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);

        this.mobility_1_next_trigger = game.add.button(this.mobility_card_x + this.trigger_next_btn_x_offset, 240, 'ArroeRight', function() {pre_battle_state.next_trigger(0, "mobility")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.mobility_2_next_trigger = game.add.button(this.mobility_card_x + this.trigger_next_btn_x_offset, 440, 'ArroeRight', function() {pre_battle_state.next_trigger(1, "mobility")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.mobility_3_next_trigger = game.add.button(this.mobility_card_x + this.trigger_next_btn_x_offset, 640, 'ArroeRight', function() {pre_battle_state.next_trigger(2, "mobility")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);

        this.mobility_1_previous_trigger = game.add.button(this.mobility_card_x + this.trigger_prev_btn_x_offset, 240, 'ArrowLeft', function() {pre_battle_state.previous_trigger(0, "mobility")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.mobility_2_previous_trigger = game.add.button(this.mobility_card_x + this.trigger_prev_btn_x_offset, 440, 'ArrowLeft', function() {pre_battle_state.previous_trigger(1, "mobility")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.mobility_3_previous_trigger = game.add.button(this.mobility_card_x + this.trigger_prev_btn_x_offset, 640, 'ArrowLeft', function() {pre_battle_state.previous_trigger(2, "mobility")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);

        this.defense_1_next_trigger = game.add.button(this.defense_card_x + this.trigger_next_btn_x_offset, 240, 'ArroeRight', function() {pre_battle_state.next_trigger(0, "defense")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.defense_2_next_trigger = game.add.button(this.defense_card_x + this.trigger_next_btn_x_offset, 440, 'ArroeRight', function() {pre_battle_state.next_trigger(1, "defense")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.defense_3_next_trigger = game.add.button(this.defense_card_x + this.trigger_next_btn_x_offset, 640, 'ArroeRight', function() {pre_battle_state.next_trigger(2, "defense")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);

        this.defense_1_previous_trigger = game.add.button(this.defense_card_x + this.trigger_prev_btn_x_offset, 240, 'ArrowLeft', function() {pre_battle_state.previous_trigger(0, "defense")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.defense_2_previous_trigger = game.add.button(this.defense_card_x + this.trigger_prev_btn_x_offset, 440, 'ArrowLeft', function() {pre_battle_state.previous_trigger(1, "defense")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);
        this.defense_3_previous_trigger = game.add.button(this.defense_card_x + this.trigger_prev_btn_x_offset, 640, 'ArrowLeft', function() {pre_battle_state.previous_trigger(2, "defense")}).scale.setTo(this.trigger_btn_scale, this.trigger_btn_scale);

        this.submit_button = game.add.button(1175, 600, 'Submit_button', pre_battle_state.battle_start, this, 2, 1, 0).scale.setTo(0.7, 0.7);

        // Put the category name and roll chance on the screen
        this.attack_roll_text = game.add.bitmapText(this.roll_text_x, this.roll_text_y, this.roll_text_font, "ATTACK: " + this.roll_percentages[0], this.roll_text_font_size);
        this.mobility_roll_text = game.add.bitmapText(this.roll_text_x + this.roll_text_x_offset, this.roll_text_y, this.roll_text_font, "MOBILITY: " + this.roll_percentages[1], this.roll_text_font_size);
        this.defense_roll_text = game.add.bitmapText(this.roll_text_x + this.roll_text_x_offset*2, this.roll_text_y, this.roll_text_font, "DEFENSE: " + this.roll_percentages[2], this.roll_text_font_size);

        this.attack_increase_roll = game.add.button(this.mobility_card_x - 124, this.roll_button_y, 'ArroeRight', function() {pre_battle_state.increase_roll("attack")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);
        this.attack_decrease_roll = game.add.button(this.attack_card_x - 62, this.roll_button_y, 'ArrowLeft', function() {pre_battle_state.decrease_roll("attack")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);

        this.defense_increase_roll = game.add.button(this.defense_card_x + 270, this.roll_button_y, 'ArroeRight', function() {pre_battle_state.increase_roll("defense")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);
        this.defense_decrease_roll = game.add.button(this.defense_card_x - 62, this.roll_button_y, 'ArrowLeft', function() {pre_battle_state.decrease_roll("defense")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);

        this.mobility_increase_roll = game.add.button(this.defense_card_x - 124, this.roll_button_y, 'ArroeRight', function() {pre_battle_state.increase_roll("mobility")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);
        this.mobility_decrease_roll = game.add.button(this.mobility_card_x - 62, this.roll_button_y, 'ArrowLeft', function() {pre_battle_state.decrease_roll("mobility")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);


    },
    /**
     * The player is ready to start the fight (or time has expired), send their chosen load out to the server.
     */
    battle_start: function() {

        var user_cards = [];
        console.log(this.defense_triggers);

        // Set the player's mobility cards
        for (var i = 0; i < 3; i++) {
            user_cards[i] = {};
            $.extend(true, user_cards[i], user.cards[this.mobility_cards[i]]);
            user_cards[i].trigger = this.triggers[this.mobility_triggers[i]].condition;
        }

        // Set the player's attack cards
        for (var j = i; j < i + 3; j++) {
            user_cards[j] = user.cards[this.attack_cards[j % 3]];
            user_cards[j].trigger = this.triggers[this.attack_triggers[j % 3]].condition;
        }

        // Set the player's defense cards
        for (var k = j; k < j + 3; k++) {
            user_cards[k] = user.cards[this.defense_cards[k % 3]];
            user_cards[k].trigger = this.triggers[this.defense_triggers[k % 3]].condition;
        }

        var battle_object = {battle_id: user.battle_id,
            username: user.username,
            user_cards: JSON.stringify(user_cards),
            att_attribute: (this.roll_percentages[0] * 0.05).toFixed(2),
            mov_attribute: (this.roll_percentages[1] * 0.05).toFixed(2),
            def_attribute: (this.roll_percentages[2] * 0.05).toFixed(2)};

        console.log(battle_object);

        // Send a message to start the battle along the battle_socket
        this.battle_socket.send(JSON.stringify(battle_object));
    },

    clone_card: function(card_data) {


    },

    battle_message: function(message) {

        var response = JSON.parse(message.data);
        console.log(response);

    },
    battle_end: function() {

    },
    /**
     * Put the first 3 cards of each type into the slots
     */
    init_cards: function() {

        console.log("init cards");

        var attack_slot = 0;
        var mobility_slot = 0;
        var defense_slot = 0;

        // Loop through the player's cards and fill in the slots on the screen with the first 3 in each category
        for (var i = 0; i < user.cards.length; i++) {

            if (user.cards[i].type == "attack" && attack_slot < 3) {
                console.log("Adding attack card: " + attack_slot);
                this.attack_cards[attack_slot] = i;
                game.add.existing(this.slot_card_wrapper(user.cards[i], attack_slot));
                attack_slot++;

            }else if (user.cards[i].type == "mobility" && mobility_slot < 3) {
                console.log("Adding mobility card: " + mobility_slot);
                this.mobility_cards[mobility_slot] = i;
                game.add.existing(this.slot_card_wrapper(user.cards[i], mobility_slot));
                mobility_slot++;

            }else if (user.cards[i].type == "defense" && defense_slot < 3) {
                console.log("Adding defense card: " + mobility_slot);
                this.defense_cards[defense_slot] = i;
                game.add.existing(this.slot_card_wrapper(user.cards[i], defense_slot));
                defense_slot++;
            }
        }

        // TODO Make the empty slots do something. They will remain empty for the battle since there are not enough cards
        // But we can render a null card or something.
        if (attack_slot != 2) {

        }
        if (defense_slot != 2) {

        }
        if (mobility_slot != 2) {

        }
    },

    /**
     * Initialize the display groups for each card category the player uses to switch the current card in a slot.
     */
    init_card_selectors: function() {

        var num_attack_cards = 0;
        var num_defense_cards = 0;
        var num_mobility_cards = 0;

        this.attack_selector = game.add.group();
        this.defense_selector = game.add.group();
        this.mobility_selector = game.add.group();

        this.mobility_selector.x = 100;
        this.mobility_selector.y = 200;

        this.defense_selector.x = 100;
        this.defense_selector.y = 200;

        this.attack_selector.x = 100;
        this.attack_selector.y = 200;

        for (var i = 0; i < user.cards.length; i++) {

            if (user.cards[i].type == "attack") {
                console.log("Adding attack card: " + num_attack_cards);
                this.attack_selector.add(this.selector_card_wrapper(user.cards[i], num_attack_cards, i));
                num_attack_cards++;

            }else if (user.cards[i].type == "mobility") {
                console.log("Adding mobility card: " + num_mobility_cards);
                this.mobility_selector.add(this.selector_card_wrapper(user.cards[i], num_mobility_cards, i));
                num_mobility_cards++;

            }else if (user.cards[i].type == "defense") {
                console.log("Adding defense card: " + num_defense_cards);
                this.defense_selector.add(this.selector_card_wrapper(user.cards[i], num_defense_cards, i));
                num_defense_cards++;
            }
        }

        this.attack_selector.visible = false;
        this.mobility_selector.visible = false;
        this.defense_selector.visible = false;
    },

    /**
     * Put some default triggers in place for each card.
     */
    init_triggers: function() {

        console.log("init triggers");

        this.attack_triggers = [0, 1, 2];

        this.mobility_triggers = [0, 1, 2];

        this.defense_triggers = [0, 1, 2];

        this.attack_trigger_text = [
            this.attack_1_trigger = game.add.bitmapText(this.trigger_text_x, this.trigger_text_y, this.trigger_font, this.triggers[0].name, this.trigger_font_size),
            this.attack_2_trigger = game.add.bitmapText(this.trigger_text_x, this.trigger_text_y + this.trigger_text_y_offset, this.trigger_font, this.triggers[1].name, this.trigger_font_size),
            this.attack_3_trigger = game.add.bitmapText(this.trigger_text_x, this.trigger_text_y + this.trigger_text_y_offset*2, this.trigger_font, this.triggers[2].name, this.trigger_font_size)
        ];

        this.mobility_trigger_text = [
            this.mobility_1_trigger = game.add.bitmapText(this.trigger_text_x + this.trigger_text_x_offset, this.trigger_text_y, this.trigger_font, this.triggers[0].name, this.trigger_font_size),
            this.mobility_2_trigger = game.add.bitmapText(this.trigger_text_x + this.trigger_text_x_offset, this.trigger_text_y + this.trigger_text_y_offset, this.trigger_font, this.triggers[1].name, this.trigger_font_size),
            this.mobility_3_trigger = game.add.bitmapText(this.trigger_text_x + this.trigger_text_x_offset, this.trigger_text_y + this.trigger_text_y_offset*2, this.trigger_font, this.triggers[2].name, this.trigger_font_size)
        ];

        this.defense_trigger_text = [

            this.defense_1_trigger = game.add.bitmapText(this.trigger_text_x + this.trigger_text_x_offset*2, this.trigger_text_y, this.trigger_font, this.triggers[0].name, this.trigger_font_size),
            this.defense_2_trigger = game.add.bitmapText(this.trigger_text_x + this.trigger_text_x_offset*2, this.trigger_text_y + this.trigger_text_y_offset, this.trigger_font, this.triggers[1].name, this.trigger_font_size),
            this.defense_3_trigger = game.add.bitmapText(this.trigger_text_x + this.trigger_text_x_offset*2, this.trigger_text_y + this.trigger_text_y_offset*2, this.trigger_font, this.triggers[2].name, this.trigger_font_size)

        ];

    },
    next_trigger: function(trigger_slot, card_type) {
        console.log("NEXT TRIGGER: " + trigger_slot + ":" + card_type);

        var trigger_index;
        var trigger_text_array = [];

        if (card_type == "attack") {

            trigger_text_array = this.attack_trigger_text;

            if (this.attack_triggers[trigger_slot] < this.triggers.length-1) {
                this.attack_triggers[trigger_slot]++;

            }else{
                this.attack_triggers[trigger_slot] = 0;
            }

            trigger_index = this.attack_triggers[trigger_slot];

        }else if (card_type == "mobility") {

            trigger_text_array = this.mobility_trigger_text;

            if (this.mobility_triggers[trigger_slot] < this.triggers.length-1) {
                this.mobility_triggers[trigger_slot]++;
            }else{
                this.mobility_triggers[trigger_slot] = 0;
            }

            trigger_index = this.mobility_triggers[trigger_slot];

        }else{

            trigger_text_array = this.defense_trigger_text;

            if (this.defense_triggers[trigger_slot] < this.triggers.length-1) {
                this.defense_triggers[trigger_slot]++;
            }else{
                this.defense_triggers[trigger_slot] = 0;
            }

            trigger_index = this.defense_triggers[trigger_slot];
        }

        trigger_text_array[trigger_slot].text = this.triggers[trigger_index].name;


        console.log(this.attack_triggers);
        console.log(this.defense_triggers);
        console.log(this.mobility_triggers);

        console.log(card_type + " trigger " + trigger_slot + ":" + this.triggers[trigger_index].name);

    },
    previous_trigger: function(trigger_slot, card_type) {
        console.log("PREVIOUS TRIGGER: " + trigger_slot + ":" + card_type);

        var trigger_text_array = [];
        var trigger_index;

        if (card_type == "attack") {

            trigger_text_array = this.attack_trigger_text;

            if (this.attack_triggers[trigger_slot] > 0) {
                this.attack_triggers[trigger_slot]--;
            }else{
                this.attack_triggers[trigger_slot] = this.triggers.length;
            }

            trigger_index = this.attack_triggers[trigger_slot];

        }else if (card_type == "mobility") {

            trigger_text_array = this.mobility_trigger_text;

            if (this.mobility_triggers[trigger_slot] > 0) {
                this.mobility_triggers[trigger_slot]--;
            }else{
                this.mobility_triggers[trigger_slot] = this.triggers.length;
            }

            trigger_index = this.mobility_triggers[trigger_slot];

        }else{

            trigger_text_array = this.defense_trigger_text;

            if (this.defense_triggers[trigger_slot] > 0) {
                this.defense_triggers[trigger_slot]--;
            }else{
                this.defense_triggers[trigger_slot] = this.triggers.length;
            }

            trigger_index = this.defense_triggers[trigger_slot];
        }

        trigger_text_array[trigger_slot].text = this.triggers[trigger_index].name;
        console.log(this.triggers);

        console.log(card_type + " trigger " + trigger_slot + ":" + this.triggers[trigger_index].name);

    },
    increase_roll: function(type) {

        if (type == "attack") {

            pre_battle_state.roll_percentages[0]++;
            pre_battle_state.attack_roll_text.text = "ATTACK: " + pre_battle_state.roll_percentages[0];

        }else if(type == "mobility") {

            pre_battle_state.roll_percentages[1]++;
            pre_battle_state.mobility_roll_text.text = "MOBILITY: " + pre_battle_state.roll_percentages[1];

        }else{

            pre_battle_state.roll_percentages[2]++;
            pre_battle_state.defense_roll_text.text = "DEFENSE: " + pre_battle_state.roll_percentages[2];

        }
    },
    decrease_roll: function(type) {

        if (type == "attack") {

            pre_battle_state.roll_percentages[0]--;
            pre_battle_state.attack_roll_text.text = "ATTACK: " + pre_battle_state.roll_percentages[0];

        }else if(type == "mobility") {

            pre_battle_state.roll_percentages[1]--;
            pre_battle_state.mobility_roll_text.text = "MOBILITY: " + pre_battle_state.roll_percentages[1];

        }else{

            pre_battle_state.roll_percentages[2]--;
            pre_battle_state.defense_roll_text.text = "DEFENSE: " + pre_battle_state.roll_percentages[2];

        }
    },
    /**
     * Takes a card slot and type and renders that card on screen.
     * Locations of the cards on screen is determined by their type and slot, doesn't need to be passed.
     */
    slot_card_wrapper: function(card_data, slot) {

        console.log("slot_card_wrapper");

        var card_x;

        if (card_data.type == "attack") {
            card_x = this.attack_card_x;
        }else if(card_data.type == "mobility") {
            card_x = this.mobility_card_x;
        }else {
            card_x = this.defense_card_x;
        }

        var card_y = this.card_y + (this.card_y_offset * slot);

        var new_card = new card(game,
            card_x,
            card_y,
            card_data.elementalStatBonus.element,
            card_data.type,
            card_data.name,
            card_data.elementalStatBonus.bonus.toFixed(2),
            card_data.statBonus.bonus.toFixed(2));

        new_card.scale.setTo(0.7, 0.7);
        new_card.inputEnabled = true;
        new_card.slot = slot;
        new_card.type = card_data.type;
        new_card.events.onInputDown.add(this.slot_card_click);

        return new_card;
    },
    /**
     * Set the current_slot and current_type attributes and then open the card selector group for that card type.
     * @param target
     */
    slot_card_click: function(target) {

        console.log(target.type + " card " + target.slot + " clicked.");

        this.current_slot = target.slot;
        this.current_type = target.type;

        if (this.current_type == "attack") {
            pre_battle_state.attack_selector.visible = true;
            game.world.bringToTop(pre_battle_state.attack_selector);
        }else if (this.current_type == "defense"){
            pre_battle_state.defense_selector.visible = true;
            game.world.bringToTop(pre_battle_state.defense_selector);
        }else if (this.current_type == "mobility") {
            pre_battle_state.mobility_selector.visible = true;
            game.world.bringToTop(pre_battle_state.mobility_selector);
        }
    },
    /**
     * Takes a Card and its place in the sequence of Cards within its category, and returns a constructed Card that
     * is in the proper slot within the category's card selector.
     * @param card_data
     * @param card_num
     * @param card_list_index
     */
    selector_card_wrapper: function(card_data, card_num, card_list_index) {

        console.log("selector_card_wrapper");

        var card_x = (card_num % this.selector_columns) * this.selector_x_offset;
        var card_y = Math.floor(card_num / this.selector_rows) * this.selector_y_offset;

        var new_card = new card(game,
            card_x,
            card_y,
            card_data.elementalStatBonus.element,
            card_data.type,
            card_data.name,
            card_data.elementalStatBonus.bonus.toFixed(2),
            card_data.statBonus.bonus.toFixed(2));

        // Append some custom data to the card to make assignments and look-ups easier in the click handler.
        new_card.list_index = card_list_index;
        new_card.card_num = card_num;
        new_card.scale.setTo(0.7, 0.7);

        new_card.inputEnabled = true;
        new_card.events.onInputDown.add(this.selector_card_click);

        return new_card;
    },
    selector_card_click: function(target) {

        console.log(this.current_type + " card chosen for slot " + this.current_slot + ".");

        // Change the card rendered in the given slot
        game.add.existing(pre_battle_state.slot_card_wrapper(user.cards[target.list_index], this.current_slot));

        // Hide the card selectors
        pre_battle_state.attack_selector.visible = false;
        pre_battle_state.mobility_selector.visible = false;
        pre_battle_state.defense_selector.visible = false;

        // Update the status of the chosen cards array
        if (this.current_type == "attack") {
            pre_battle_state.attack_cards[this.current_slot] = target.list_index;
        }else if (this.current_type == "mobility") {
            pre_battle_state.mobility_cards[this.current_slot] = target.list_index;
        }else{
            pre_battle_state.defense_cards[this.current_slot] = target.list_index;
        }
        console.log(pre_battle_state.attack_cards);

    }
};