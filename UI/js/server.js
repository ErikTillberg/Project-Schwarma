/**
 * Created by Andrew on 2017-02-09.
 *
 *
 */


var server = {

    production_mode: false, // switch to false to use local host
    host_name: null,
    port: null,

    matchmaking_timer_interval: 1000, // controls how often the timer on screen updates with elapsed time

    // Builds a url with query string for signing up on the server
    // TODO incorporate character class when its available
    signup_endpoint: function (username, email, password, character_class) {
        return "http://" + this.host_name + this.port
            + "/signup"
            + "?username=" + username
            + "&email=" + email
            + "&password=" + password;
    },

    // Builds a url with query stirng for signing in on the server
    signin_endpoint: function (username, password) {

        return "http://" + this.host_name + this.port
            + "/login"
            + "?username=" + username
            + "&password=" + password;
    },

    matchmake_start_endpoint: function () {

        return "http://" + this.host_name + this.port + "/matchmake_start"

    },

    matchmake_poll_endpoint: function () {

        return "http://" + this.host_name + this.port + "/matchmake_poll"

    },

    matchmake_cancel_endpoint: function () {

        return "http://" + this.host_name + this.port + "/matchmake_cancel"

    },

    // Creates an returns a web socket that connects to the matchmaking endpoint
    matchmaking_socket: function () {

        var web_socket;
        web_socket = new WebSocket("ws://" + this.host_name + this.port + "/matchmaking");
        web_socket.onmessage = main_menu_state.matchmaking_message;
        web_socket.onclose = main_menu_state.matchmaking_end;

        web_socket.onopen = function() {
            web_socket.send(JSON.stringify({type: 'start', id: user.id, sessionToken: user.session_token})); // Send the user ID
        };

        return web_socket;
    }
};

// Initialize the server endpoint string based on the production mode flag at the top.
(function(){
    console.log("Server init.");
    server.host_name = server.production_mode === true ? "schwarma-meta-server.herokuapp.com": "l92.168.101.167";
    server.port = server.production_mode === true ? "" : ":9000";
    console.log("Production: " + server.production_mode);
    console.log("Host name: " + server.host_name);
}());
