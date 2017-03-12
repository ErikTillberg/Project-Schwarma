/**
 * Created by Andrew on 2017-03-09.
 */

var pre_battle_state = {

    battle_socket: null,

    attack_card_x: 220,
    mobility_card_x: 700,
    defense_card_x: 1100,
    card_y: 150,
    card_y_offset: 200,

    // Stores indexes into the user.cards array (same for other card types below)
    mobility_cards: [],
    // Stores indexes into the triggers array
    mobility_triggers: [],

    attack_cards: [],
    attack_triggers: [],

    defense_cards: [],
    defense_triggers: [],

    triggers: ["Low Player HP", "High Player HP", "Close", "Far", "Low Opponent HP", "High Opponent HP"],
    roll_percentages: [0.33, 0.33, 0.33],

    preload: function() {

        console.log("pre_battle_state: preload");

    },
    create: function() {

        console.log("pre_battle_state: create");

        // Open the battleSocket
        this.battle_socket = server.battle_socket();

        this.init_cards();
        this.init_triggers();

        // Put all of the button on screen for selecting cards
        // This includes left and right for 3 cards in each category, and a left and right for each trigger

        this.attack_1_next_card = game.add.button(20, 0, 'ArroeRight', function() {pre_battle_state.next_card(0, "attack")});
        this.attack_2_next_card = game.add.button(20, 200, 'ArroeRight', function() {pre_battle_state.next_card(1, "attack")});
        this.attack_3_next_card = game.add.button(20, 400, 'ArroeRight', function() {pre_battle_state.next_card(2, "attack")});

        this.attack_button_array = [this.attack_1_next_card, this.attack_2_next_card, this.attack_3_next_card];

        this.attack_1_next_trigger = game.add.button(20, 100, 'ArroeRight', function() {pre_battle_state.next_trigger(0, "attack")});
        this.attack_2_next_trigger = game.add.button(20, 300, 'ArroeRight', function() {pre_battle_state.next_trigger(1, "attack")});
        this.attack_3_next_trigger = game.add.button(20, 500, 'ArroeRight', function() {pre_battle_state.next_trigger(2, "attack")});

        this.mobility_1_next_card = game.add.button(500, 0, 'ArroeRight', function() {pre_battle_state.next_card(0, "mobility")});
        this.mobility_2_next_card = game.add.button(500, 200, 'ArroeRight', function() {pre_battle_state.next_card(1, "mobility")});
        this.mobility_3_next_card = game.add.button(500, 400, 'ArroeRight', function() {pre_battle_state.next_card(2, "mobility")});

        this.mobility_button_array = [this.mobility_1_next_card, this.mobility_2_next_card, this.mobility_3_next_card];

        this.mobility_1_next_trigger = game.add.button(500, 100, 'ArroeRight', function() {pre_battle_state.next_trigger(0, "mobility")});
        this.mobility_2_next_trigger = game.add.button(500, 300, 'ArroeRight', function() {pre_battle_state.next_trigger(1, "mobility")});
        this.mobility_3_next_trigger = game.add.button(500, 500, 'ArroeRight', function() {pre_battle_state.next_trigger(2, "mobility")});

        this.defense_1_next_card = game.add.button(900, 0, 'ArroeRight', function() {pre_battle_state.next_card(0, "defense")});
        this.defense_2_next_card = game.add.button(900, 200, 'ArroeRight', function() {pre_battle_state.next_card(1, "defense")});
        this.defense_3_next_card = game.add.button(900, 400, 'ArroeRight', function() {pre_battle_state.next_card(2, "defense")});

        this.defense_button_array = [this.defense_1_next_card, this.defense_2_next_card, this.defense_3_next_card];

        this.defense_1_next_trigger = game.add.button(900, 100, 'ArroeRight', function() {pre_battle_state.next_trigger(0, "defense")});
        this.defense_2_next_trigger = game.add.button(900, 300, 'ArroeRight', function() {pre_battle_state.next_trigger(1, "defense")});
        this.defense_3_next_trigger = game.add.button(900, 500, 'ArroeRight', function() {pre_battle_state.next_trigger(2, "defense")});

        this.submit_button = game.add.button(1100, 600, 'Submit_button', pre_battle_state.battle_start, this, 2, 1, 0);

    },
    battle_start: function() {

        var user_cards = [];
        console.log(this.defense_triggers);

        // Set the player's mobility cards
        for (var i = 0; i < 3; i++) {
            user_cards[i] = user.cards[this.mobility_cards[i]];
            user_cards[i].trigger = this.triggers[this.mobility_triggers[i]];
        }

        // Set the player's attack cards
        for (var j = i; j < i + 3; j++) {
            user_cards[j] = user.cards[this.attack_cards[j % 3]];
            user_cards[j].trigger = this.triggers[this.attack_triggers[j % 3]];
        }

        // Set the player's defense cards
        for (var k = j; k < j + 3; k++) {
            user_cards[k] = user.cards[this.defense_cards[k % 3]];
            user_cards[k].trigger = this.triggers[this.defense_triggers[k % 3]];
        }

        console.log("USER CARDS:");
        console.log(user_cards);

        // Send a message to start the battle along the battle_socket
        this.battle_socket.send(JSON.stringify({battle_id: user.battle_id, username: user.username, user_cards: user_cards}));

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
                this.card_wrapper(user.cards[i], attack_slot);
                attack_slot++;

            }else if (user.cards[i].type == "mobility" && mobility_slot < 3) {
                console.log("Adding mobility card: " + mobility_slot);
                this.mobility_cards[mobility_slot] = i;
                this.card_wrapper(user.cards[i], mobility_slot);
                mobility_slot++;

            }else if (user.cards[i].type == "defense" && defense_slot < 3) {
                console.log("Adding defense card: " + mobility_slot);
                this.defense_cards[defense_slot] = i;
                this.card_wrapper(user.cards[i], defense_slot);
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
     * Put some triggers in place for each card
     */
    init_triggers: function() {

        console.log("init triggers");

        this.attack_triggers = [0, 1, 2];

        this.mobility_triggers = [0, 1, 2];

        this.defense_triggers = [0, 1, 2];

    },
    /**
     * Finds the next card of given type in the user's cards that isn't currently selected in another slot
     * Sets the current mobility slot to its index value in the card array, and then renders that card to the screen.
     */
    next_card: function(card_slot, card_type) {
        console.log("NEXT CARD: " + card_slot + ":" + card_type);

        var card_type_array = [];
        var slot_array = [];

        // Select the card type array that matches the given card type
        if (card_type == "attack") {
            card_type_array = this.attack_cards;
        }else if (card_type == "mobility") {
            card_type_array = this.mobility_cards;
        }else{
            card_type_array = this.defense_cards;
        }

        // Find the next card in the user's card set that matches the given type and is not in use
        for( var i = card_type_array[card_slot] + 1; i < user.cards.length; i++) {

            // We have found another card of the same type
            if (user.cards[i].type == card_type) {

                slot_array = [];

                // Find the indices of the other 2 slots within this type
                if (card_slot == 0) {
                    slot_array = [1, 2];
                }else if (card_slot == 1) {
                    slot_array = [0, 2];
                }else{
                    slot_array = [1, 2];
                }

                // Select this card if it is not already in another slot
                // if (slot_array[0] != i &&
                //     slot_array[1] != i) {
                //
                //     card_type_array[card_slot] = i;
                //     this.card_wrapper(user.cards[i], card_slot);
                //     return;
                // }

                card_type_array[card_slot] = i;
                this.card_wrapper(user.cards[i], card_slot);
                console.log("NEXT CARD: " + card_slot + ":" + card_type + ":" + user.cards[i].name);
                return;
            }
        }

        console.log("First part of list: " + card_type_array[card_slot]);
        // Find the next card in the user's card set that matches the given type and is not in use
        for( var j = 0; j < card_type_array[card_slot]; j++) {

            // We have found another card of the same type

            console.log(user.cards[j].type + "==" + card_type);

            if (user.cards[j].type == card_type) {
                console.log("Found card type 2.");
                slot_array = [];

                // Find the indices of the other 2 slots within this type
                if (card_slot == 0) {
                    slot_array = [1, 2];
                }else if (card_slot == 1) {
                    slot_array = [0, 2];
                }else{
                    slot_array = [1, 2];
                }

                // Select this card if it is not already in another slot
                // if (slot_array[0] != j &&
                //     slot_array[1] != j) {
                //
                //     card_type_array[card_slot] = j;
                //     this.card_wrapper(user.cards[j], card_slot);
                //     return;
                // }

                card_type_array[card_slot] = j;
                this.card_wrapper(user.cards[j], card_slot);
                console.log("NEXT CARD: " + card_slot + ":" + card_type + ":" + user.cards[j].name);
                return;
            }
        }
    },
    next_trigger: function(trigger_slot, card_type) {
        console.log("NEXT TRIGGER: " + trigger_slot + ":" + card_type);

        var trigger_type_array = [];

        if (card_type == "attack") {
            trigger_type_array = this.attack_triggers;
        }else if (card_type == "mobility") {
            trigger_type_array = this.mobility_triggers;
        }else{
            trigger_type_array = this.defense_triggers;
        }

        if (trigger_type_array[trigger_slot] < this.triggers.length-1) {
            trigger_type_array[trigger_slot]++;
        }else{
            trigger_type_array[trigger_slot] = 0;
        }

        console.log(card_type + " trigger " + trigger_slot + ":" + this.triggers[trigger_type_array[trigger_slot]]);

        // Update the card trigger text
        this.trigger_wrapper(card_type, trigger_slot);
    },
    /**
     * Takes a card slot and type and renders that card on screen.
     * Locations of the cards on screen is determined by their type and slot, doesn't need to be passed.
     */
    card_wrapper: function(card_data, slot) {

        console.log("card_wrapper");

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
            card_data.elementalStatBonusList[0].element,
            card_data.type,
            card_data.name,
            card_data.elementalStatBonusList[0].bonus.toFixed(2),
            card_data.statBonusList[0].bonus.toFixed(2));

        game.add.existing(new_card);
    },

    /**
     * Takes a card type and slot and renders the trigger text.
     * Locations of the trigger text is determined by the type and slot.
     * @param card_type
     * @param slot
     */
    trigger_wrapper: function(card_type, slot) {

    }
};