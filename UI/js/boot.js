/**
 * Created by Andrew on 2017-02-09.
 */

// Create a new Phaser game instance
var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'gameDiv');

// Set the default character to mage so one is always sent on signup.
var character = 'mage';

// Create game all the game states and attach them to the game object.
// Game states point to js modules that handle all the operations of a single screen.
game.state.add('load', load_state);
game.state.add('signup', signup_state);
game.state.add('pick_char', pick_state);
game.state.add('signin', signin_state);
game.state.add('main_menu', main_menu_state);
game.state.add('gear_menu', gear_menu_state);
game.state.add('battle_system', battle_system_state);

// Start the load state to import game assets
game.state.start("load");
