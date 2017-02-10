/**
 * Created by Andrew on 2017-02-09.
 */

// Displays simple messages at the bottom of the canvas for the user/developer.

console.log("debug_log");

var debug_console = {

    debug_mode: true,
    font_string: "10px Arial",

    init_log: function(){
        console.log("debug_console: init_log");
        this.output_box = game.add.text(20, 700, "");
    },

    // Outputs the message to the canvas if debug_mode is true, otherwise writes it to the js console
    debug_log: function(message){

        if (this.debug_mode){
            this.message_log(message);
            console.log(message);
        }else{
            console.log(message);
        }
    },

    // Outputs an info message on the canvas for the user to see
    message_log: function(message){
        console.log("debug_console: message_log");
        this.output_box.setText(message);
        this.output_box.setStyle({font: this.font_string, fill: "white"});

    },

    // Outputs an error message on the canvas for the user to see
    error_log: function(message){
        this.output_box.setText(message);
        this.output_box.setStyle({font: this.font_string, fill: "red"});
    }
};