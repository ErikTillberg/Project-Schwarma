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
    }
};