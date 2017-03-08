/**
 * Created by Andrew on 2017-02-09.
 */

/**
 * Displays simple messages at the bottom of the canvas for the user/developer. Currently, must be initialized inside each state. Must be initialized after drawing
 * any backgrounds so text does not wind up in the background.
 * @namespace
 * @type {{debug_mode: boolean, font_string: string, init_log: debug_console.init_log, debug_log: debug_console.debug_log, message_log: debug_console.message_log, error_log: debug_console.error_log}}
 */
var debug_console = {

    debug_mode: true,
    font_string: "14px Arial",

    /**
     * Builds a Phaser game text object inside the canvas for message writing.
     */
    init_log: function(){
        console.log("debug_console: init_log");
        this.output_box = game.add.text(40, 660, "");
    },

    /**
     * Outputs the message to the canvas if debug_mode is true, otherwise writes it to the js console.
     * @param {String} message
     */
    debug_log: function(message){

        if (this.debug_mode){
            this.message_log(message);
            console.log(message);
        }else{
            console.log(message);
        }
    },

    /**
     * Outputs the message to the canvas.
     * @param {String} message
     */
    message_log: function(message){
        console.log("debug_console: message_log");
        this.output_box.setText(message);
        this.output_box.setStyle({font: this.font_string, fill: "white"});

    },

    /**
     * Outputs an error message to the canvas.
     * @param {String} message
     */
    error_log: function(message){
        this.output_box.setText(message);
        this.output_box.setStyle({font: this.font_string, fill: "red"});
    }
};