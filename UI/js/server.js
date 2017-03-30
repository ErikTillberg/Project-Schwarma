/**
 * Created by Andrew on 2017-02-09.
 *
 */

/**
 * Singleton Object holds meta-server configuration information. Creates connection strings for various endpoints and determines what IP is used for connection.
 * @namespace
 * @type {{production_mode: boolean, host_name: null, port: null, matchmaking_timer_interval: number, signup_endpoint: server.signup_endpoint, signin_endpoint: server.signin_endpoint, matchmaking_socket: server.matchmaking_socket}}
 */
var server = {

    production_mode: true, // switch to false to use local host
    host_name: null,
    port: null,
    ssl_mode: true,
    protocol: null,

    matchmaking_timer_interval: 1000, // controls how often the timer on screen updates with elapsed time

    /**
     * Builds a URL with query string for meta-server user signup.
     * @param {String} username
     * @param {String} email
     * @param {String} password
     * @param {String} character_class Starting class chosen by the user on signup.
     * @returns {String} A connection string for the meta-server signup endpoint.
     */
    signup_endpoint: function (username, email, password, character_class) {

        return server.protocol + this.host_name + this.port
            + "/signup"
            + "?username=" + username
            + "&email=" + email
            + "&password=" + password
            + "&characterType=" + character_class;
    },

    /**
     * Builds a URL with query string for meta-server user signin.
     * @param {String} username
     * @param {String} password
     * @returns {String} A connection string for the meta-server signin endpoint.
     */
    signin_endpoint: function (username, password) {

        return server.protocol + this.host_name + this.port
            + "/login"
            + "?username=" + username
            + "&password=" + password;
    },

    /**
     * Establishes a WebSocket connection with the meta-server matchmaking endpoint.
     * @returns {WebSocket} A WebSocket with connection opened with the meta-server's matchmaking endpoint.
     */
    matchmaking_socket: function () {

        var web_socket;
        web_socket = new WebSocket("ws://" + this.host_name + this.port + "/matchmaking");
        web_socket.onmessage = main_menu_state.matchmaking_message;
        web_socket.onclose = main_menu_state.matchmaking_end;

        web_socket.onopen = function() {
            web_socket.send(JSON.stringify({type: 'start', id: user.id, sessionToken: user.session_token})); // Send the user ID
        };

        return web_socket;
    },

    battle_socket: function() {

        var web_socket;
        web_socket = new WebSocket("ws://" + this.host_name + this.port + "/battleSocket");
        web_socket.onmessage = pre_battle_state.battle_message;
        web_socket.onclose = pre_battle_state.battle_end;

        web_socket.onopen = function() {
            console.log("Connection with the battleSocket is open.");
            console.log("Starting battle: " + user.battle_id + " with " + user.opponent.username);
        };

        return web_socket;
    },

    /**
     * Initializes the proper host_name and port based on the production_mode flag.
     */
    init_server: function() {
        console.log("Server init.");
        server.host_name = server.production_mode === true ? "schwarma-meta-server.herokuapp.com": "localhost";
        server.port = server.production_mode === true ? "" : ":9000";
        server.protocol = server.ssl_mode === true ? "https://" : "http://";
        console.log("Production: " + server.production_mode);
        console.log("Host name: " + server.host_name);
    },
    gear_endpoint: function() {
        return server.protocol + this.host_name + this.port
                + "/setActiveEquipment";
    },
    delete_card_endpoint: function() {
        return server.protocol + this.host_name + ":" + this.port + "/deleteCard" + "?username=" + user.username
    },
    delete_equipment_endpoint: function() {
        return server.protocol + this.host_name + ":" + this.port + "/deleteEquipment" + "?username" + user.username
    }
};
// Initialize the server
server.init_server();
