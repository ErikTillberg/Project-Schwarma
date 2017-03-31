/**
 * Created by Andrew on 2017-03-09.
 */

var pre_battle_state = {

    battle_socket: null,

    // Determines the row and column positions of cards in each category
    attack_card_x: 100,
    mobility_card_x: 450,
    defense_card_x: 825,
    card_y: 200,
    card_y_offset: 200,

    // trigger button offsets from their corresponding cards
    trigger_next_btn_x_offset: 190,
    trigger_prev_btn_x_offset: 130,
    trigger_btn_y_offset: 40,
    trigger_text_x: 200,
    trigger_text_y: 160,
    trigger_text_x_offset: 360,
    trigger_text_y_offset: 200,
    trigger_font: 'carrier_command_black',
    trigger_font_size: 10,

    // Determines which slot is currently being swapped
    current_slot: 0,
    current_type: "attack",

    // Settings for roll percentages
    roll_text_x: 75,
    roll_text_y: 50,
    roll_text_x_offset: 380,
    roll_text_font: 'carrier_command_black',
    roll_text_font_size: 16,
    roll_button_y: 33,
    roll_btn_scale: 0.4,

    // Determines the size of grid elements in the card selectors
    selector_x_offset: 200,
    selector_y_offset: 200,
    selector_columns: 6,
    selector_rows: 3,

    // Trigger button scale
    trigger_btn_scale: 0.5,

    // Stores indexes into the user.cards array (same for other card types below)
    mobility_cards: [],
    // Stores indexes into the triggers array
    mobility_triggers: [],

    attack_cards: [],
    attack_triggers: [],

    defense_cards: [],
    defense_triggers: [],

    countdown_time_remaining: 30,

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
    roll_percentages: [35, 30, 35],

    preload: function() {

        console.log("pre_battle_state: preload");

    },
    create: function() {

        console.log("pre_battle_state: create");

        menuclick = game.add.audio('menuclick');
        menuclick.volume = 0.2;

        cardclick = game.add.audio('cardclick');
        cardclick.volume = 0.2;

        var background = game.add.sprite(0,0, 'menu_background');
        this.countdown_time_remaining = 30;

        // Open the battleSocket
        this.battle_socket = server.battle_socket();

        this.init_cards();
        this.init_triggers();
        this.init_card_selectors();

        // Put all of the buttons on screen for selecting triggers
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

        this.submit_button = game.add.button(1120, 640, 'Submit_button', pre_battle_state.battle_start, this, 2, 1, 0).scale.setTo(0.5, 0.5);

        // Put the category name and roll chance on the screen
        this.attack_roll_text = game.add.bitmapText(this.roll_text_x, this.roll_text_y, this.roll_text_font, "ATTACK " + this.roll_percentages[0] + "%", this.roll_text_font_size);
        this.mobility_roll_text = game.add.bitmapText(this.roll_text_x + this.roll_text_x_offset, this.roll_text_y, this.roll_text_font, "MOBILITY " + this.roll_percentages[1] + "%", this.roll_text_font_size);
        this.defense_roll_text = game.add.bitmapText(this.roll_text_x + this.roll_text_x_offset*2, this.roll_text_y, this.roll_text_font, "DEFENSE " + this.roll_percentages[2] + "%", this.roll_text_font_size);

        this.attack_increase_roll = game.add.button(this.roll_text_x + 200, this.roll_button_y, 'ArroeRight', function() {pre_battle_state.increase_roll("attack")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);
        this.attack_decrease_roll = game.add.button(this.roll_text_x - 50, this.roll_button_y, 'ArrowLeft', function() {pre_battle_state.decrease_roll("attack")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);

        this.defense_increase_roll = game.add.button(this.roll_text_x + this.roll_text_x_offset*2 + 220, this.roll_button_y, 'ArroeRight', function() {pre_battle_state.increase_roll("defense")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);
        this.defense_decrease_roll = game.add.button(this.roll_text_x + this.roll_text_x_offset*2 - 50, this.roll_button_y, 'ArrowLeft', function() {pre_battle_state.decrease_roll("defense")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);

        this.mobility_increase_roll = game.add.button(this.roll_text_x + this.roll_text_x_offset + 240, this.roll_button_y, 'ArroeRight', function() {pre_battle_state.increase_roll("mobility")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);
        this.mobility_decrease_roll = game.add.button(this.roll_text_x + this.roll_text_x_offset - 50, this.roll_button_y, 'ArrowLeft', function() {pre_battle_state.decrease_roll("mobility")}).scale.setTo(this.roll_btn_scale, this.roll_btn_scale);

        this.total_roll = game.add.bitmapText(1120, 50, this.roll_text_font, this.roll_percentages[0] + this.roll_percentages[1] + this.roll_percentages[2] + "%", this.roll_text_font_size);
        this.countdown_timer_text = game.add.bitmapText(1130, 600, this.roll_text_font, this.countdown_time_remaining, this.roll_text_font_size);

        this.countdown_timer = setInterval(this.update_timer, 1000);

    },
    /**
     * The player is ready to start the fight (or time has expired), send their chosen loadout to the server.
     */
    battle_start: function() {

        clearInterval(this.countdown_timer);

        var user_cards = [];
        console.log(this.defense_triggers);

        var categories = ["attack", "mobility", "defense"];

        // Increase roll percentages at random until they are at 100.
        while(pre_battle_state.roll_percentages[0] + pre_battle_state.roll_percentages[1] + pre_battle_state.roll_percentages[2] < 100) {
            pre_battle_state.increase_roll(categories[Math.floor((Math.random() * 3))]);
        }

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
            att_attribute: (this.roll_percentages[0] /100).toFixed(2),
            mov_attribute: (this.roll_percentages[1] /100).toFixed(2),
            def_attribute: (this.roll_percentages[2] /100).toFixed(2)};

        console.log(battle_object);

        // Send a message to start the battle along the battle_socket
        this.battle_socket.send(JSON.stringify(battle_object));
    },

    /**
     * Message received from the meta-server along the battle_socket.
     * @param message JSON object containing a data attribute which has the message type and message within.
     */
    battle_message: function(message) {

        var response = JSON.parse(message.data);
        console.log(message);

        // Check to see if this is a standard message or one that means we can start the battle
        if (response.type === "Battle Data") {

            // If the battle data is not defined, just return to the main menu.
            if (response.message === undefined) {
                console.log("====BATTLE UNDEFINED====");
                console.log("Battle could not start. Simulation data was undefined.");
                console.log(response.message);
                game.state.start("main_menu");
            }else{
                console.log("====BATTLE START====");
                user.init_simulation(JSON.parse(response.message));
                console.log(response.message);
                game.state.start("battle_system");
            }

        }else{
            console.log("====MESSAGE FROM META-SERVER====");
            console.log("type: " + response.type);
            console.log(response.message);
        }
    },
    /**
     * Handles closing of the battle websocket, returns the user to the main menu
     */
    battle_end: function() {
        console.log("battle end.");
        console.log("Battle socket closed.");
    },
    /**
     * Update the timer on screen, send the user's loadout as-is when the timer reaches 0.
     */
    update_timer: function() {

        console.log("update_timer");
        console.log(pre_battle_state.countdown_time_remaining);

        if (pre_battle_state.countdown_time_remaining > 0) {
            pre_battle_state.countdown_time_remaining--;
            pre_battle_state.countdown_timer_text.text = pre_battle_state.countdown_time_remaining;
        } else {
            clearInterval(pre_battle_state.countdown_timer);
            pre_battle_state.battle_start();
        }
    },
    /**
     * Put the first 3 cards of each type into the slots, render them to the canvas.
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

        this.attack_selector.add(game.add.sprite(-100,-100, 'menu_background'));
        this.defense_selector.add(game.add.sprite(-100,-100, 'menu_background'));
        this.mobility_selector.add(game.add.sprite(-100,-100, 'menu_background'));


        this.mobility_selector.x = 90;
        this.mobility_selector.y = 200;

        this.defense_selector.x = 90;
        this.defense_selector.y = 200;

        this.attack_selector.x = 90;
        this.attack_selector.y = 200;

        for (var i = 0; i < user.cards.length; i++) {

            if (user.cards[i].type === "attack") {
                console.log("Adding attack card: " + num_attack_cards);
                this.attack_selector.add(this.selector_card_wrapper(user.cards[i], num_attack_cards, i));
                num_attack_cards++;

            }else if (user.cards[i].type === "mobility") {
                console.log("Adding mobility card: " + num_mobility_cards);
                this.mobility_selector.add(this.selector_card_wrapper(user.cards[i], num_mobility_cards, i));
                num_mobility_cards++;

            }else if (user.cards[i].type === "defense") {
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

        // Place text for each card trigger
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

    /**
     * Iterate through the trigger array to find the next value, looping back to the beginning if necessary. Update the text on screen.
     * @param trigger_slot 0, 1, or 2. Determines which slot for the given category is being updated.
     * @param card_type Attack, Defense, or Mobility, determines the category of card the trigger is attached to.
     */
    next_trigger: function(trigger_slot, card_type) {
        console.log("NEXT TRIGGER: " + trigger_slot + ":" + card_type);

        var trigger_index;
        var trigger_text_array = [];
        menuclick.play();

        // Determine what type of card we need to update, increment the trigger index
        if (card_type === "attack") {

            trigger_text_array = this.attack_trigger_text;

            if (this.attack_triggers[trigger_slot] < this.triggers.length-1) {
                this.attack_triggers[trigger_slot]++;

            }else{
                this.attack_triggers[trigger_slot] = 0;
            }

            trigger_index = this.attack_triggers[trigger_slot];

        }else if (card_type === "mobility") {

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
    /**
     * Iterate through the trigger array to find the previous value, looping to the end if necessary. Update the text on screen.
     * @param trigger_slot 0, 1, or 2. Determines which slot for the given category is being updated.
     * @param card_type Attack, Defense, or Mobility, determines the category of card the trigger is attached to.
     */
    previous_trigger: function(trigger_slot, card_type) {
        console.log("PREVIOUS TRIGGER: " + trigger_slot + ":" + card_type);

        var trigger_text_array = [];
        var trigger_index;
        menuclick.play();

        if (card_type === "attack") {

            trigger_text_array = this.attack_trigger_text;

            if (this.attack_triggers[trigger_slot] > 0) {
                this.attack_triggers[trigger_slot]--;
            }else{
                this.attack_triggers[trigger_slot] = this.triggers.length;
            }

            trigger_index = this.attack_triggers[trigger_slot];

        }else if (card_type === "mobility") {

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
    /**
     * Increases the roll percentage corresponding to type by 5%
     * @param type The card category we want to increase the roll for
     */
    increase_roll: function(type) {

        menuclick.play();
        var roll_index = 0;

        if (type === "attack") {
            roll_index = 0;
        }else if(type === "mobility") {
            roll_index = 1;
        }else{
            roll_index = 2;
        }

        // Only increase the roll if it is legal (no sum of categories over 100%)
        if((this.roll_percentages[0] + this.roll_percentages[1] + this.roll_percentages[2]) < 100 && pre_battle_state.roll_percentages[roll_index] < 100) {
            pre_battle_state.roll_percentages[roll_index] += 5;

            if (type === "attack") {
                pre_battle_state.attack_roll_text.text = "ATTACK " + pre_battle_state.roll_percentages[0] + "%";
            }else if(type === "mobility") {
                pre_battle_state.mobility_roll_text.text = "MOBILITY " + pre_battle_state.roll_percentages[1] + "%";
            }else{
                pre_battle_state.defense_roll_text.text = "DEFENSE " + pre_battle_state.roll_percentages[2] + "%";
            }
        }

        pre_battle_state.total_roll.text =  this.roll_percentages[0] + this.roll_percentages[1] + this.roll_percentages[2] + "%";
    },
    /**
     * Decreases the roll percentage corresponding to type by 5%
     * @param type The card category we want to decrease the roll for
     */
    decrease_roll: function(type) {

        menuclick.play();
        var roll_index = 0;

        if (type === "attack") {
            roll_index = 0;
        }else if(type === "mobility") {
            roll_index = 1;
        }else{
            roll_index = 2;
        }

        // Only increase the roll if it is legal (no sum of categories less than 100%)
        if((this.roll_percentages[0] + this.roll_percentages[1] + this.roll_percentages[2]) > 0 && pre_battle_state.roll_percentages[roll_index] > 0) {
            pre_battle_state.roll_percentages[roll_index] -= 5;

            if (type === "attack") {
                pre_battle_state.attack_roll_text.text = "ATTACK " + pre_battle_state.roll_percentages[0] + "%";
            }else if(type === "mobility") {
                pre_battle_state.mobility_roll_text.text = "MOBILITY " + pre_battle_state.roll_percentages[1] + "%";
            }else{
                pre_battle_state.defense_roll_text.text = "DEFENSE " + pre_battle_state.roll_percentages[2] + "%";
            }
        }

        pre_battle_state.total_roll.text =  this.roll_percentages[0] + this.roll_percentages[1] + this.roll_percentages[2] + "%";

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
            card_data.statBonus.bonus.toFixed(2),
            card_data.elementalStatBonus.bonus.toFixed(2));

        new_card.scale.setTo(0.7, 0.7);
        new_card.inputEnabled = true;
        new_card.slot = slot;
        new_card.type = card_data.type;
        new_card.events.onInputDown.add(this.slot_card_click);
        new_card.shadow.scale.setTo(0.7, 0.7);

        return new_card;
    },
    /**
     * Set the current_slot and current_type attributes and then open the card selector group for that card type.
     * @param target The target of the click event, should be a card object
     */
    slot_card_click: function(target) {

        console.log(target.type + " card " + target.slot + " clicked.");
        cardclick.play();

        this.current_slot = target.slot;
        this.current_type = target.type;

        // Determine which selector to make visible to the user and bring it to the front of the canvas
        if (this.current_type === "attack") {
            pre_battle_state.attack_selector.visible = true;
            game.world.bringToTop(pre_battle_state.attack_selector);
        }else if (this.current_type === "defense"){
            pre_battle_state.defense_selector.visible = true;
            game.world.bringToTop(pre_battle_state.defense_selector);
        }else if (this.current_type === "mobility") {
            pre_battle_state.mobility_selector.visible = true;
            game.world.bringToTop(pre_battle_state.mobility_selector);
        }
    },
    /**
     * Takes a card JSON object and its place in the sequence of Cards within its category, and returns a constructed Card that
     * is in the proper slot within the category's card selector.
     * @param card_data Card JSON data
     * @param card_num The index in which the card appears amongst all cards within its type, also its location within the selector
     * @param card_list_index The index in which the card appears amongst all cards the player has
     */
    selector_card_wrapper: function(card_data, card_num, card_list_index) {

        console.log("selector_card_wrapper");

        // Determine where to render the card within the selector, based on its card_num and constants
        var card_x = (card_num % this.selector_columns) * this.selector_x_offset;
        var card_y = Math.floor(card_num / this.selector_rows) * this.selector_y_offset;

        // Create a new card object
        var new_card = new card(game,
            card_x,
            card_y,
            card_data.elementalStatBonus.element,
            card_data.type,
            card_data.name,
            card_data.statBonus.bonus.toFixed(2),
            card_data.elementalStatBonus.bonus.toFixed(2));

        // Append some custom data to the card to make assignments and look-ups easier in the click handler.
        new_card.list_index = card_list_index;
        new_card.card_num = card_num;
        new_card.scale.setTo(0.7, 0.7);
        new_card.shadow.scale.setTo(0.7, 0.7);

        // Hide the shadows in the selector
        new_card.shadow.visible = false;

        new_card.inputEnabled = true;
        new_card.events.onInputDown.add(this.selector_card_click);

        return new_card;
    },
    /**
     * Handles the user clicking on a card in a selector menu. Assigns the clicked card to a slot and renders it.
     * @param target Event target, should be a card within a card selector
     */
    selector_card_click: function(target) {

        console.log(this.current_type + " card chosen for slot " + this.current_slot + ".");
        cardclick.play();

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