/**
 * Created by Andrew on 2017-02-09.
 *
 *
 */


var server = {

    host_name: "localhost",
    port: "9000",
    matchmaking_timer_interval: 1000, // controls how often the timer on screen updates with elapsed time

    // Builds a url with query string for signing up on the server
    // TODO incorporate character class when its available
    signup_endpoint: function(username, email, password, character_class) {
        return "http://" + this.host_name + ":" + this.port
            + "/signup"
            + "?username=" + username
            + "&email=" + email
            + "&password=" + password;
    },

    // Builds a url with query stirng for signing in on the server
    signin_endpoint: function(username, password) {

        return "http://" + this.host_name + ":" + this.port
        + "/login"
        + "?username=" + username
        + "&password=" + password;

    },

    matchmake_start_endpoint: function() {

        return "http://" + this.host_name + ":" + this.port + "/matchmake_start"

    },

    matchmake_poll_endpoint: function() {

        return "http://" + this.host_name + ":" + this.port + "/matchmake_poll"

    },

    matchmake_cancel_endpoint: function() {

        return "http://" + this.host_name + ":" + this.port + "/matchmake_cancel"

    },

    // Creates an returns a web socket that connects to the matchmaking endpoint
    matchmaking_socket: function() {

        var web_socket = new WebSocket("ws://" + this.host_name + this.port + "/matchmaking");
        web_socket.onmessage = main_menu_state.matchmaking_message;
        web_socket.onclose = main_menu_state.matchmaking_end;

    }

};