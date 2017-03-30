/**
 * Created by Andrew on 2017-02-09.
 *
 */

/**
 * Singleton Object holds client user data that must persist between game states.
 * @type {{init: user.init, init_opponent: user.init_opponent, opponent: {username: string, character_type: string, rating: number}}}
 * @namespace
 */
var user = {
    /**
     * Initializes data of the user.
     * @param {Object} user_data JSON object from meta-server with user information.
     */
    init: function(user_data){
        this.username = user_data.username;
        this.email = user_data.email;
        this.id = user_data.id;
        this.session_token = user_data.sessionToken;
        this.cards = user_data.cards;
        this.character_type = user_data.characterType;
        this.rating = user_data.rating;
        this.gear = user_data.equipment;

        this.equipped_gear = {
            equipped_boots: user_data.equippedBoots,
            equipped_chest: user_data.equippedChest,
            equipped_weapon: user_data.equippedWeapon
        };

        this.mobility_modifier = user_data.mobility_modifier;
        this.mobility_percentage = user_data.mobility_percentage;
        this.attack_modifier = user_data.attack_modifier;
        this.attack_percentage = user_data.attack_percentage;
        this.defense_modifier = user_data.defence_modifier; // not a typo
        this.defense_percentage = user_data.defense_percentage; // not a typo
        this.coins = user_data.coins;

        console.log(this);
    },
    /**
     * Initializes data of the current opponent.
     * @param {Object} opponent_data JSON object from meta-server with opponent information.
     */
    init_opponent: function(opponent_data){
        this.opponent.username = opponent_data.username;
        this.opponent.character_type = opponent_data.characterType;
        this.opponent.rating = opponent_data.rating;

        this.opponent.rating = opponent_data.rating;
        this.opponent.gear = opponent_data.equipment;
        this.opponent.equipped_gear = {
            equipped_boots: opponent_data.equippedBoots,
            equipped_chest: opponent_data.equippedChest,
            equipped_weapon: opponent_data.equippedWeapon
        };

        this.opponent.mobility_modifier = opponent_data.mobility_modifier;
        this.opponent.mobility_percentage = opponent_data.mobility_percentage;
        this.opponent.attack_modifier = opponent_data.attack_modifier;
        this.opponent.attack_percentage = opponent_data.attack_percentage;
        this.opponent.defense_modifier = opponent_data.defence_modifier;
        this.opponent.defense_percentage = opponent_data.defense_percentage;
        this.opponent.coins = opponent_data.coins;

        console.log(this.opponent);
    },
    /**
     * Holds data of the current opponent.
     */
    opponent: {
        username: "Player2", // Default which shows up inside the battle test, overwritten when match is found
        character_type: 'thief',
        rating: null
    },
    /**
     * Save the battle_id of the current battle.
     * @param battle_id
     */
    init_battle: function(battle_id) {
        console.log("Player joined battle: " + battle_id);
        this.battle_id = battle_id;
    },
    /**
     * Save the simulation data of the completed battle. Accessed from the battle_system to animate the battle.
     * @param battle_simulation - JSON data from meta-server used to animate the battle results.
     */
    init_simulation: function(battle_simulation) {
        this.simulation_data = battle_simulation;
    }
};