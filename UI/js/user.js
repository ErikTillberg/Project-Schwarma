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
    },
    /**
     * Initializes data of the current opponent.
     * @param {Object} opponent_data JSON object from meta-server with opponent information.
     */
    init_opponent: function(opponent_data){
        this.opponent.username = opponent_data.username;
        this.opponent.character_type = opponent_data.characterType;
        this.opponent.rating = opponent_data.rating;
    },
    /**
     * Holds data of the current opponent.
     */
    opponent: {
        username: "Player2", // Default which shows up inside the battle test, overwritten when match is found
        character_type: 'thief',
        rating: null
    }
};