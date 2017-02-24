/**
 * Created by Andrew on 2017-02-09.
 *
 * user.js - Holds the user's data that has been sent to the client.
 */

var user = {
    init: function(user_data){
        this.username = user_data.username;
        this.email = user_data.email;
        this.id = user_data.id;
        this.session_token = user_data.sessionToken;
        this.cards = user_data.cards;
    },
    init_opponent: function(opponent_data){
        this.opponent.username = opponent_data.username;
        this.opponent.character_type = opponent_data.characterType;
        this.opponent.rating = opponent_data.rating;
    },
    opponent: {
        username: "Player2",
        character_type: null,
        rating: null
    }
};