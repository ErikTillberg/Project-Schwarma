/**
* Created by Bryon on 2017-02-03.
*/

// output provided by the sim server
var battleData = user.simulation_data;
var storedData =[
    {"action":"defense","player":"1","number":"21.5981"},
    {"action":"attack","player":"2","number":"0"},
    {"action":"defense","player":"2","number":"3.55549"},
    {"action":"attack","player":"2","number":"0"},
    {"action":"attack","player":"1","number":"0"},
    {"action":"attack","player":"2","number":"0"},
    {"action":"attack","player":"1","number":"0"},
    {"action":"attack","player":"2","number":"0"},
    {"action":"attack","player":"2","number":"0"},
    {"action":"movePlayer","player":"1","number":"1"},
    {"action":"movePlayer","player":"1","number":"1"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"movePlayer","player":"1","number":"1"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"movePlayer","player":"1","number":"1"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"attack","player":"1","number":"0"},
    {"action":"attack","player":"1","number":"0"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"attack","player":"1","number":"0"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"movePlayer","player":"1","number":"1"},
    {"action":"movePlayer","player":"2","number":"5"},
    {"action":"attack","player":"1","number":"0"},
    {}
]

var playerOne;
var playerTwo;
var playerOneShadow;
var playerTwoShadow;
var playerOneProj;
var playerTwoProj;
var background;
var HUD1;

var playerOneFacing = 'right';
var playerTwoFacing = 'left';

var canIdle = true;
var canShoot = false;
var movePlayerX;
var playerOneLoc = 0;
var playerTwoLoc = 4;

var palyerMoveArray = [140, 390, 640, 890, 1140];
var animationTimer;
var animationCheck;
var playerSpacing = 60;
var attachCheck;

var actionText;
var playerOneText;
var playerTwoText;

var playerOneHPText;
var playerTwoHPText;

var winnerText;
var winTextVisible = false;

var playerOneHP = 100;
var playerTwoHP = 100;

var playerNum;

var i = 0; 
var delayTimer = 4000;

var cardWin;

var attackCloseSound;
var attackFarSound;
var blockSound;
var jumpSound;
var rollSound;
var walkSound;
var winMusic;
var battleMusic;
var healSound;

var playerFirst;
var playerSecond;
var winner;
var reward;

var sim;


/**
* Manages game assets and rendering of all battle animations.
* @namespace
* @type {{preload: battle_system_state.preload, create: battle_system_state.create, update: battle_system_state.update}}
*/
var battle_system_state = {

    /**
     * Currently empty. Overrides Phaser state preload method.
     */
    preload: function(){
        console.log("battle_system_state: preload");
    },

    /**
     * Initializes sprites, animations and text elements for the battle system. Overrides Phaser state create method.
     */
    create: function() {
        console.log("battle_system_state: create");

        console.log(battleData)


        playerFirst = user.battle_metadata.player1;
        playerSecond = user.battle_metadata.player2;
        winner = user.battle_metadata.winner;
        reward = user.battle_metadata.reward;

        console.log('First player: ' + playerFirst);
        console.log('Second player: ' + playerSecond)
        console.log('Winner: ' + winner);
        console.log('Reward: ' + reward);

        // add music to state
        menumusic.pause();

        battleMusic = game.add.audio('battlewmusic');
        battleMusic.loopFull(0.05);

        attackCloseSound = game.add.audio('attackclose');
        attackCloseSound.volume = 0.25;

        attackFarSound = game.add.audio('attackfar');
        attackFarSound.volume = 0.25;

        blockSound = game.add.audio('block');
        blockSound.volume = 0.25;

        jumpSound = game.add.audio('jump');
        jumpSound.volume = 0.15;

        rollSound = game.add.audio('roll');
        rollSound.volume = 0.15;

        walkSound = game.add.audio('walk');
        walkSound.volume = 0.15;

        winMusic = game.add.audio('winmusic');
        winMusic.volume = 0.15;

        healSound = game.add.audio('heal');
        healSound.volume = 0.25;

        // See if we have real battle data, otherwise use the card coded values
        if (user.simulation_data !== undefined) {
            console.log("Loading battle data from the meta-server's response.");
            battleData = user.simulation_data;
        }
        else{
            battleData = storedData;
        }

        // Add the menu background and HUD to screen
        background = game.add.sprite(0,0, 'Background');
        HUD1 = game.add.sprite(645, 580, 'HUD');
        HUD1.anchor.setTo(0.5, 0.5);

        sim = game.add.sprite(640, 360, 'sim');
        sim.anchor.setTo(0.5, 0.5);
        //sim.visible = false;
        sim.animations.add('simStuff', [0, 1, 2, 3,4,5,6,7,8,9]);



        // get who is first player and set sprites/text accordingly
        if (playerFirst == user.opponent.username){
            console.log('first player: ' + playerFirst);
            console.log(user.opponent.character_type);

            // Add the players projectiles to the screen and set them invisible, add the animation.
            playerOneProj = game.add.sprite(140 - playerSpacing, 360, pickCharWeapon(user.opponent.character_type));
            playerOneProj.anchor.setTo(0.5, 0.5);
            playerOneProj.visible = false;
            playerOneProj.animations.add('shootRight', [0, 1, 2, 3]);
            playerOneProj.animations.add('shootLeft', [7, 6, 5, 4]);

            playerTwoProj = game.add.sprite(1140 + playerSpacing, 360, pickCharWeapon(user.character_type));
            playerTwoProj.anchor.setTo(0.5, 0.5);
            playerTwoProj.visible = false;
            playerTwoProj.animations.add('shootRight', [0, 1, 2, 3]);
            playerTwoProj.animations.add('shootLeft', [7, 6, 5, 4]);

            // Add the players to the screen, and att the animations
            playerTwo = game.add.sprite(1140 + playerSpacing, 360, pickCharacter(user.character_type));
            playerTwo.anchor.setTo(0.5, 0.5);
            playerTwo.animations.add('attackRight', [0, 1, 2, 3, 4]);
            playerTwo.animations.add('attackLeft', [41, 40, 39, 38, 37]);
            playerTwo.animations.add('idleRight', [8, 9, 10, 11]);
            playerTwo.animations.add('idleLeft', [33, 32, 31, 30]);
            playerTwo.animations.add('walkRight', [18, 19, 20]);
            playerTwo.animations.add('walkLeft', [23, 22, 21]);
            playerTwo.animations.add('jumpRight', [12, 13, 14]);
            playerTwo.animations.add('jumpLeft', [29, 28, 27]);
            playerTwo.animations.add('dieRight', [6, 7]);
            playerTwo.animations.add('dieLeft', [35, 34]);
            playerTwo.animations.add('rollRight', [15, 16, 17]);
            playerTwo.animations.add('rollLeft', [26, 25, 24]);
            playerTwo.animations.add('blockRight', [5]);
            playerTwo.animations.add('blockLeft', [36]);

            playerOne = game.add.sprite(140 - playerSpacing, 360, pickCharacter(user.opponent.character_type));
            playerOne.anchor.setTo(0.5, 0.5);
            playerOne.animations.add('attackRight', [0, 1, 2, 3, 4]);
            playerOne.animations.add('attackLeft', [41, 40, 39, 38, 37]);
            playerOne.animations.add('idleRight', [8, 9, 10, 11]);
            playerOne.animations.add('idleLeft', [33, 32, 31, 30]);
            playerOne.animations.add('walkRight', [18, 19, 20]);
            playerOne.animations.add('walkLeft', [23, 22, 21]);
            playerOne.animations.add('jumpRight', [12, 13, 14]);
            playerOne.animations.add('jumpLeft', [29, 28, 27]);
            playerOne.animations.add('dieRight', [6, 7]);
            playerOne.animations.add('dieLeft', [35, 34]);
            playerOne.animations.add('rollRight', [15, 16, 17]);
            playerOne.animations.add('rollLeft', [26, 25, 24]);
            playerOne.animations.add('blockRight', [5]);
            playerOne.animations.add('blockLeft', [36]);

            // Add the players text to the screen.
            playerOneText = game.add.bitmapText(305, 580, 'carrier_command', user.opponent.username + '\n\nHP: ' + playerOneHP, 20);
            playerOneText.anchor.setTo(0.5, 0.5);
            playerOneText.align = 'left';

            playerTwoText = game.add.bitmapText(1005, 580, 'carrier_command', user.username + '\n\nHP: ' + playerTwoHP, 20);
            playerTwoText.anchor.setTo(0.5, 0.5);
            playerTwoText.align = 'right';
        }

        else {

            console.log('First player: ' + playerFirst);
            console.log(user.character_type);

            // Add the players projectiles to the screen and set them invisible, add the animation.
            playerOneProj = game.add.sprite(140 - playerSpacing, 360, pickCharWeapon(user.character_type));
            playerOneProj.anchor.setTo(0.5, 0.5);
            playerOneProj.visible = false;
            playerOneProj.animations.add('shootRight', [0, 1, 2, 3]);
            playerOneProj.animations.add('shootLeft', [7, 6, 5, 4]);

            playerTwoProj = game.add.sprite(1140 + playerSpacing, 360, pickCharWeapon(user.opponent.character_type));
            playerTwoProj.anchor.setTo(0.5, 0.5);
            playerTwoProj.visible = false;
            playerTwoProj.animations.add('shootRight', [0, 1, 2, 3]);
            playerTwoProj.animations.add('shootLeft', [7, 6, 5, 4]);

            // Add the players to the screen, and att the animations
            playerTwo = game.add.sprite(1140 + playerSpacing, 360, pickCharacter(user.opponent.character_type));
            playerTwo.anchor.setTo(0.5, 0.5);
            playerTwo.animations.add('attackRight', [0, 1, 2, 3, 4]);
            playerTwo.animations.add('attackLeft', [41, 40, 39, 38, 37]);
            playerTwo.animations.add('idleRight', [8, 9, 10, 11]);
            playerTwo.animations.add('idleLeft', [33, 32, 31, 30]);
            playerTwo.animations.add('walkRight', [18, 19, 20]);
            playerTwo.animations.add('walkLeft', [23, 22, 21]);
            playerTwo.animations.add('jumpRight', [12, 13, 14]);
            playerTwo.animations.add('jumpLeft', [29, 28, 27]);
            playerTwo.animations.add('dieRight', [6, 7]);
            playerTwo.animations.add('dieLeft', [35, 34]);
            playerTwo.animations.add('rollRight', [15, 16, 17]);
            playerTwo.animations.add('rollLeft', [26, 25, 24]);
            playerTwo.animations.add('blockRight', [5]);
            playerTwo.animations.add('blockLeft', [36]);

            playerOne = game.add.sprite(140 - playerSpacing, 360, pickCharacter(user.character_type));
            playerOne.anchor.setTo(0.5, 0.5);
            playerOne.animations.add('attackRight', [0, 1, 2, 3, 4]);
            playerOne.animations.add('attackLeft', [41, 40, 39, 38, 37]);
            playerOne.animations.add('idleRight', [8, 9, 10, 11]);
            playerOne.animations.add('idleLeft', [33, 32, 31, 30]);
            playerOne.animations.add('walkRight', [18, 19, 20]);
            playerOne.animations.add('walkLeft', [23, 22, 21]);
            playerOne.animations.add('jumpRight', [12, 13, 14]);
            playerOne.animations.add('jumpLeft', [29, 28, 27]);
            playerOne.animations.add('dieRight', [6, 7]);
            playerOne.animations.add('dieLeft', [35, 34]);
            playerOne.animations.add('rollRight', [15, 16, 17]);
            playerOne.animations.add('rollLeft', [26, 25, 24]);
            playerOne.animations.add('blockRight', [5]);
            playerOne.animations.add('blockLeft', [36]);

            // Add the players text to the screen.
            playerOneText = game.add.bitmapText(305, 580, 'carrier_command', user.username + '\n\nHP: ' + playerOneHP, 20);
            playerOneText.anchor.setTo(0.5, 0.5);
            playerOneText.align = 'left';

            playerTwoText = game.add.bitmapText(1005, 580, 'carrier_command', user.opponent.username + '\n\nHP: ' + playerTwoHP, 20);
            playerTwoText.anchor.setTo(0.5, 0.5);
            playerTwoText.align = 'right';
        }

        // Add the players shasows to the screen.
        playerOneShadow = game.add.sprite(140 - playerSpacing, 405, 'Shadow');
        playerTwoShadow = game.add.sprite(1140 + playerSpacing, 405, 'Shadow');
        playerOneShadow.anchor.setTo(0.5, 0.5);
        playerTwoShadow.anchor.setTo(0.5, 0.5);

       /* // Add the players projectiles to the screen and set them invisible, add the animation.
        playerOneProj = game.add.sprite(140 - playerSpacing, 360, pickCharWeapon ( user.character_type));
        playerOneProj.anchor.setTo(0.5, 0.5);
        playerOneProj.visible = false;
        playerOneProj.animations.add('shootRight', [0, 1, 2, 3]);
        playerOneProj.animations.add('shootLeft', [7, 6, 5, 4]);

        playerTwoProj = game.add.sprite(1140 + playerSpacing, 360, pickCharWeapon ( user.opponent.character_type));
        playerTwoProj.anchor.setTo(0.5, 0.5);
        playerTwoProj.visible = false;
        playerTwoProj.animations.add('shootRight', [0, 1, 2, 3]);
        playerTwoProj.animations.add('shootLeft', [7, 6, 5, 4]);

        // Add the players to the screen, and att the animations
        playerTwo = game.add.sprite(1140 + playerSpacing, 360, pickCharacter (  user.opponent.character_type));
        playerTwo.anchor.setTo(0.5, 0.5);
        playerTwo.animations.add('attackRight', [0, 1, 2, 3, 4]);
        playerTwo.animations.add('attackLeft', [41, 40, 39, 38, 37]);
        playerTwo.animations.add('idleRight', [8, 9, 10, 11]);
        playerTwo.animations.add('idleLeft', [33, 32, 31, 30]);
        playerTwo.animations.add('walkRight', [18, 19, 20]);
        playerTwo.animations.add('walkLeft', [23, 22, 21]);
        playerTwo.animations.add('jumpRight', [12, 13, 14]);
        playerTwo.animations.add('jumpLeft', [29, 28, 27]);
        playerTwo.animations.add('dieRight', [6, 7]);
        playerTwo.animations.add('dieLeft', [35, 34]);
        playerTwo.animations.add('rollRight', [15, 16, 17]);
        playerTwo.animations.add('rollLeft', [26, 25, 24]);
        playerTwo.animations.add('blockRight', [5]);
        playerTwo.animations.add('blockLeft', [36]);

        playerOne = game.add.sprite(140 - playerSpacing, 360, pickCharacter ( user.character_type));
        playerOne.anchor.setTo(0.5, 0.5);
        playerOne.animations.add('attackRight', [0, 1, 2, 3, 4]);
        playerOne.animations.add('attackLeft', [41, 40, 39, 38, 37]);
        playerOne.animations.add('idleRight', [8, 9, 10, 11]);
        playerOne.animations.add('idleLeft', [33, 32, 31, 30]);
        playerOne.animations.add('walkRight', [18, 19, 20]);
        playerOne.animations.add('walkLeft', [23, 22, 21]);
        playerOne.animations.add('jumpRight', [12, 13, 14]);
        playerOne.animations.add('jumpLeft', [29, 28, 27]);
        playerOne.animations.add('dieRight', [6, 7]);
        playerOne.animations.add('dieLeft', [35, 34]);
        playerOne.animations.add('rollRight', [15, 16, 17]);
        playerOne.animations.add('rollLeft', [26, 25, 24]);
        playerOne.animations.add('blockRight', [5]);
        playerOne.animations.add('blockLeft', [36]);*/


        // Add the actionText to the screen
        actionText = game.add.bitmapText(645, 580, 'carrier_command', 'Simulating Battle', 20);
        actionText.anchor.setTo(0.5, 0.5);
        actionText.align = 'center';

        // Add the players text to the screen.
       /* playerOneText = game.add.bitmapText(305, 580, 'carrier_command', user.username + '\n\nHP: ' + playerOneHP, 10);
        playerOneText.anchor.setTo(0.5, 0.5);
        playerOneText.align = 'left';

        playerTwoText = game.add.bitmapText(1005, 580, 'carrier_command', user.opponent.username + '\n\nHP: ' + playerTwoHP, 10);
        playerTwoText.anchor.setTo(0.5, 0.5);
        playerTwoText.align = 'right';*/

        // Add the player HPText (the numbers above the head when they get hit) to the screen, set to invisible.
        playerOneHPText = game.add.bitmapText((140 - playerSpacing), 200, 'carrier_command', ' ' , 15);
        playerOneHPText.anchor.setTo(0.5, 0.5);
        playerOneHPText.visible = false;

        playerTwoHPText = game.add.bitmapText((1140 + playerSpacing), 200, 'carrier_command', ' ', 15);
        playerTwoHPText.anchor.setTo(0.5, 0.5);
        playerTwoHPText.visible = false;

        winnerText = game.add.bitmapText(640, 180, 'carrier_command', ' ', 5);
        winnerText.anchor.setTo(0.5, 0.5);
        winnerText.visible = false;

        // Run the battleLoop function.

        battleLoop(battleData);   
        playSim();


    },

    /**
     * Handles orientation of player sprites, projectile lifecycle, shadow movement and idle animations for character sprites.
     */
    update: function() {

        // Check the players.x coordinate to see witch way to face the characters, and make them face each other.
        if (playerOne.x < playerTwo.x){

            playerOneFacing = 'right';
            playerTwoFacing = 'left';
        }

        else {

            playerOneFacing = 'left';
            playerTwoFacing = 'right';
        }

        // Update the shadows.x to the same as the players so they move when the player moves.
        playerOneShadow.x = playerOne.x;
        playerTwoShadow.x = playerTwo.x;

        playerOneHPText.x = playerOne.x;
        playerTwoHPText.x = playerTwo.x;

        if ( playerOneHP > 100){
            playerOneHP = 100;
        }

        if ( playerTwoHP > 100){
            playerTwoHP = 100;
        }

        // Update the playersText
        if (playerFirst == user.opponent.username) {

            playerOneText.setText(user.opponent.username + '\n\nHP: ' + playerOneHP);
            playerTwoText.setText(user.username + '\n\nHP: ' + playerTwoHP);
        }

        else{

            playerOneText.setText(user.username + '\n\nHP: ' + playerOneHP);
            playerTwoText.setText(user.opponent.username + '\n\nHP: ' + playerTwoHP);
        }


        // If canIdle is ture play the idle animation the way the player is facing
        if ( canIdle ) {

            if ( playerOneFacing == 'right' ){

                playerOne.animations.play('idleRight', 5, true);
                playerTwo.animations.play('idleLeft', 5, true);
            }

        else {

                playerOne.animations.play('idleLeft', 5, true);
                playerTwo.animations.play('idleRight', 5, true);
            }
        }

        // Set the player projectiles to invisible.
        if ( !canShoot ) {

            playerOneProj.x = playerOne.x;
            playerTwoProj.x = playerTwo.x;
            playerOneProj.visible = false;
            playerTwoProj.visible = false;
        }

        if ( winTextVisible ) {

            if (winnerText.fontSize < 40)
            {
                winnerText.fontSize += 1;
            }
        }
    }
};

/**
 * Function moves the player sprite to the x location in playerMove arrya [num]
 * @param sprite
 * @param moveNum
 */
function movePlayer ( sprite, moveNum ){


	setPlayerNumber ( sprite );
    // Decide what player sprite to move.
    if ( sprite == playerOne ){

        movePlayerX = ( palyerMoveArray[moveNum] - playerSpacing);
        animationCheck = (moveNum - playerOneLoc);
        animationTimer = Math.abs(animationCheck);
        //playerNum = user.username;
        console.log('AnimationtimerPlayerOne:' + animationTimer);
    }

    else {

        movePlayerX = (palyerMoveArray[moveNum] + playerSpacing);
        animationCheck = (moveNum - playerTwoLoc);
        animationTimer = Math.abs(animationCheck);
      //  playerNum = user.opponent.username;
        console.log('AnimationtimerPlayerTwo:' + animationTimer);
    }

    canIdle = false;

    // Move player sprite via teen.
    game.add.tween(sprite).to({ x: movePlayerX}, (1000 * animationTimer), Phaser.Easing.Linear.None, true);

    // Play different animation based on how far player is way from space they are moving to.
    if ( animationCheck > 0 && animationTimer <= 2){

        sprite.animations.play('walkRight', 5, true);
        walkSound.loopFull(0.15);
    }

    else if (  animationCheck > 0 && animationTimer < 4 && animationTimer >= 3) {

        sprite.animations.play('rollRight', 5, true);
        rollSound.loopFull(0.15);
    }

    else if (  animationCheck > 0 && animationTimer >= 4 ) {

        sprite.animations.play('jumpRight', 5, true);
        jumpSound.loopFull(0.15);
    }

    else if(  animationCheck < 0 && animationTimer < 4 && animationTimer >= 3) {

        sprite.animations.play('rollLeft', 5, true);
        rollSound.loopFull(0.15);
    }

    else if (  animationCheck < 0 && animationTimer >= 4 ) {

        sprite.animations.play('jumpLeft', 5, true);
        jumpSound.loopFull(0.15);
    }

    else {

        sprite.animations.play('walkLeft', 5, true);
        walkSound.loopFull(0.15);
    }

    // Update action text.
    actionText.setText(playerNum + "\n\nMOVES TO\n\nSPOT " + (moveNum + 1) );

    // set the player location after the sprite moves to the right location
    game.time.events.add( (1000 * animationTimer), (function() { setPlayerLoc( sprite, moveNum); canIdle = true; jumpSound.stop(); rollSound.stop(); walkSound.stop(); console.log(sprite.x);}), this );
}

/**
 * Function sets the players location (0-4)
 * @param sprite
 * @param moveNum
 */
function setPlayerLoc( sprite, moveNum){

    if ( sprite == playerOne ){

        playerOneLoc = moveNum;
    }

    else {

        playerTwoLoc = moveNum;
    }

    console.log('PLayer One Loc: ' + playerOneLoc);
    console.log('PLayer Two Loc: ' + playerTwoLoc);
}

/**
 * Function call right attack function (close/far) base on the two players location.
 * @param sprite
 * @param damageNum
 */
function attack( sprite, damageNum ){

    // Calculate the distance between the two players.
    attackCheck = Math.abs(playerOneLoc - playerTwoLoc);

    setPlayerNumber ( sprite );

    // If they are < 1 call the attackClose function, if farther call the attackFar function.
    if ( attackCheck < 1){

        attackClose ( sprite, damageNum );
    }

    else{

        attackFar ( sprite, damageNum) ;
    }

    // Update the actionText.
    actionText.setText(playerNum + "\n\nATTACKS" );
}

/**
 * Function decides what sprite to animate and what version(left, right) of the attack animation to play
 * @param sprite
 * @param damageNum
 */
function attackClose( sprite, damageNum ){

    attackCloseSound.play();
    canIdle = false;

    // Pick sprite and animation to play, when animation is done call the block function.
    if ( playerOneFacing == 'right' && sprite == playerOne ){

        sprite.animations.play('attackRight', 5, false);
        game.time.events.add( 500, (function() { block( playerTwo, damageNum ); canShoot = false;}), this );
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo ){ 

        sprite.animations.play('attackRight', 5, false);
        game.time.events.add( 500, (function() { block( playerOne, damageNum ); canShoot = false;}), this );
    }

    else if (  playerOneFacing == 'left' && sprite == playerOne){

        sprite.animations.play('attackLeft', 5, false);
        game.time.events.add( 500, (function() { block( playerTwo, damageNum ); canShoot = false;}), this );
    }

    else {

        sprite.animations.play('attackLeft', 5, false);
        game.time.events.add( 500, (function() { block( playerOne, damageNum ); canShoot = false;}), this );
    }

            //delayTimer = 500;
}

/**
 * Function decides what sprite to animate and what version(left, right) of the attack animation to play.
 * Function also plays the right projectile animation.
 * @param sprite
 * @param damageNum
 */
function attackFar( sprite, damageNum){

    attackFarSound.play();
    canIdle = false;
    canShoot = true;
            
    var animationTimer2 = attackCheck

    // Pick sprite and animations to play, when animation is done call the block function.
    if (  playerOneFacing == 'right' && sprite == playerOne){

        playerOneProj.visible = true;
        sprite.animations.play('attackRight', 5, false);
        playerOneProj.animations.play('shootRight', 10, true);
        game.add.tween(playerOneProj).to({ x: playerTwo.x}, (500 * animationTimer2 ), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerTwo, damageNum); canShoot = false;}), this ); 
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo){

        playerTwoProj.visible = true;
        sprite.animations.play('attackRight', 5, false);
        playerTwoProj.animations.play('shootRight', 5, true);
        game.add.tween(playerTwoProj).to({ x: playerOne.x}, (500 * animationTimer2), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerOne, damageNum ); canShoot = false;}), this );
    }

    else if (  playerOneFacing == 'left' && sprite == playerOne){

        playerOneProj.visible = true;
        sprite.animations.play('attackLeft', 5, false);
        playerOneProj.animations.play('shootLeft', 5, true);
        game.add.tween(playerOneProj).to({ x: playerTwo.x}, (500 * animationTimer2), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerTwo, damageNum ); canShoot = false;}), this ); 
    }

    else {

        playerTwoProj.visible = true;
        sprite.animations.play('attackLeft', 5, false);
        playerTwoProj.animations.play('shootLeft', 10, true);
        game.add.tween(playerTwoProj).to({ x: playerOne.x}, (500 * animationTimer2), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerOne, damageNum ); canShoot = false;}), this );
    }

            //delayTimer = 500 * animationTimer2;
}

/**
 * Function decides what sprite to animate and what version(left, right) of the die animation to play.
 * @param sprite
 * @param dieTimer
 */
function die( sprite, dieTimer ){

    canIdle = false;

    setPlayerNumber ( sprite );

    // Pick sprite and animations to play, and update action text.
    if ( playerOneFacing == 'right' && sprite == playerOne ){

        sprite.animations.play('dieRight', 5, false);
        win (playerTwo);
        actionText.setText(winner + '\n\nWINS THE BATTLE');
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo ){

        sprite.animations.play('dieRight', 5, false);
        win (playerOne);
        actionText.setText(winner + '\n\nWINS THE BATTLE');
    }

    else if ( playerOneFacing == 'left' && sprite == playerOne ){

        sprite.animations.play('dieLeft', 5, false);
        win (playerTwo);
        actionText.setText(winner + '\n\nWINS THE BATTLE');
    }

    else{

        sprite.animations.play('dieLeft', 5, false);
        win (playerOne);
        actionText.setText(winner + '\n\nWINS THE BATTLE');
    }

    //actionText.setText("PLAYER " + playerNum + " DEAD");

    // Pause for dieTimer seconds
    //game.time.events.add( dieTimer * 1000 , (function() { canIdle = true; }), this );
 }

 /**
 * Function decides what sprite to animate and what version(left, right) of the block animation to play.
 * @param sprite
 * @param damageNum
 */
function block( sprite, damageNum){

     canIdle = false;
     blockSound.play();

    setPlayerNumber ( sprite );

    // Pick sprite and animations to play, and update HP based on damageNum, set HPText to visable and update it.
    if ( playerOneFacing == 'right' && sprite == playerOne){

        sprite.animations.play('blockRight', 5, true);
        playerOneHPText.setText('-' + parseInt(damageNum));
        playerOneHP -= parseInt(damageNum);
        playerOneHPText.visible = true;
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo){

        sprite.animations.play('blockRight', 5, true);
        playerTwoHPText.setText('-' + parseInt(damageNum));
        playerTwoHP -= parseInt(damageNum);
        playerTwoHPText.visible = true;
    }

     else if ( playerOneFacing == 'left' && sprite == playerOne){

        sprite.animations.play('blockLeft', 5, true);
        playerOneHPText.setText('-'+ parseInt(damageNum));
        playerOneHP -= parseInt(damageNum);
        playerOneHPText.visible = true;
    }

    else {

        sprite.animations.play('blockLeft', 5, true);
        playerTwoHPText.setText('-' + parseInt(damageNum));
        playerTwoHP -= parseInt(damageNum);
        playerTwoHPText.visible = true;              
    }

    // Update actionText.
   // actionText.setText(playerNum +"\n\nBLOCKS");

    // Set HPText to invisible after animation plays.
   game.time.events.add( 1000, (function() { canIdle = true; playerOneHPText.visible = false; playerTwoHPText.visible = false}), this );
}

/**
 * Function sets the player number based on what sprite.
 * @param sprite
 */
function setPlayerNumber( sprite ){

    if ( sprite == playerOne ){

        playerNum =  playerFirst;
    }

    else{

        playerNum = playerSecond;
    }
}

/**
 * Function decides what sprite to animate and what version(left, right) of the block animation to play.
 * @param sprite
 * @param damageNum
 */
function heal( sprite, healNum){

    canIdle = false;
    healSound.play();

    setPlayerNumber ( sprite );

    // Pick sprite and animations to play, and update HP based on damageNum, set HPText to visable and update it.
    if ( playerOneFacing == 'right' && sprite == playerOne){

        sprite.animations.play('blockRight', 5, true);
        playerOneHPText.setText('+' +parseInt(healNum));
        playerOneHP += parseInt(healNum);
        playerOneHPText.visible = true;
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo){

        sprite.animations.play('blockRight', 5, true);
        playerTwoHPText.setText('+' + parseInt(healNum));
        playerTwoHP += parseInt(healNum);
        playerTwoHPText.visible = true;
    }

    else if ( playerOneFacing == 'left' && sprite == playerOne){

        sprite.animations.play('blockLeft', 5, true);
        playerOneHPText.setText('+'+ parseInt(healNum));
        playerOneHP += parseInt(healNum);
        playerOneHPText.visible = true;
    }

    else {

        sprite.animations.play('blockLeft', 5, true);
        playerTwoHPText.setText('+' + parseInt(healNum));
        playerTwoHP += parseInt(healNum);
        playerTwoHPText.visible = true;
    }

    // Update actionText.
    actionText.setText(playerNum +"\n\nHEALS");

    // Set HPText to invisible after animation plays.
    game.time.events.add( 1000, (function() { canIdle = true; playerOneHPText.visible = false; playerTwoHPText.visible = false}), this );
}

/**
 * Function loops through battleObj and picks what sprite, and what function to call based on
 * what is in thr obj. It delayes 4 sec after each loop to let the animations plat out.
 * @param battleObj
 */
function battleLoop ( battleObj ) {

    console.log('Battle Loop Started');

    setTimeout(function () { 

        // Call movePlayer function
        if (battleObj[i].action == 'movePlayer') {

            if (battleObj[i].player == '1'){

                player = playerOne;
            }
            else{ player = playerTwo;}
                             
            movePlayer(player, battleObj[i].number - 1); 
        }

        // Call attack function
        else if (battleObj[i].action == 'attack') {

            if (battleObj[i].player == '1') {

                player = playerOne;
            }
            else {
                player = playerTwo;
            }

            attack(player, battleObj[i].number);
        }

        // Call block function.
        else if (battleObj[i].action == 'block'){

            if ( battleObj[i].player == '1'){

                player = playerOne;
            }
            else { player = playerTwo;}
             
            block(player, battleObj[i].number); 
        }

        // Call the heal function
        else if (battleObj[i].action == 'defense'){

            if ( battleObj[i].player == '1'){

                player = playerOne;
            }
            else { player = playerTwo;}

            heal (player, battleObj[i].number);
        }

        // Find out who won, and call die function on other players sprite, or if it's a tie display tie text.
        else {

            if ( winner == 'none'){

                console.log(winner);
                battleMusic.stop();
                winMusic.loopFull(0.05);

                HUD1.visible = false;
                playerOneText.visible = false;
                playerTwoText.visible = false;
                actionText.visible = false;

                winnerText.setText ('IT WAS A DRAW\nBOTH PLAYERS\nLIVE TO\nDIE ANOTHER\nDAY.....' );
                game.time.events.add( 1000, (function() { winnerText.visible = true; winTextVisible = true; }), this );
                game.time.events.add( 10000, (function() { MatchOver(); }), this );

            }

            else if (winner == user.opponent.username && playerFirst == user.username){

                player = playerOne;
                console.log('winner' + winner);
                console.log('Die1: ' + user.username);
                die (player, 2000);
            }

            else if (winner == user.username && playerFirst == user.username){

                player = playerTwo;
                console.log('Winner:' + winner);
                console.log('Die2:' + user.opponent.username);
                die (player, 2000);
            }

            else if (winner == user.username && playerFirst == user.opponent.username){

                player = playerOne;
                console.log('Winner:' + winner);
                console.log('Die3:' + user.opponent.username);
                die (player, 2000);
            }

            else {
                player = playerTwo;
                console.log('Winner:' + winner);
                console.log('Die4:' + user.username);
                die (player, 2000);
            }
        }

        i++;

        // Loop for the length of battleObj
        if (i < battleObj.length) {  

            battleLoop( battleObj);           
        }                        
    }, delayTimer)
}

/**
 * Function picks what character sprite to load.
 * @param charName
 * @returns {string}
 */
function pickCharacter ( charName ){

    if (charName == 'warrior'){
        return 'Knight';
    }

    else if (charName == 'thief'){
        return 'Thief';
    }

    else {
        return 'Wizard';
    }
}

/**
 * Function picks what character projectile sprite to load.
 * @param charName
 * @returns {string}
 */
function pickCharWeapon ( charName ){

    if (charName == 'warrior'){
        return 'Flash';
    }

    else if (charName == 'thief'){
        return 'Knife';
    }

    else {
        return 'Fireball';
    }
}

/**
 * Function moves the player to the middle of the screen and then plays the jump animation.
 * It also scales the winner message and displays it. It displays the card the player won in battle.
 * @param sprite
 */
function win ( sprite ) {

    canIdle = false;
    battleMusic.stop();
    winMusic.loopFull(0.05);

    HUD1.visible = false;
    playerOneText.visible = false;
    playerTwoText.visible = false;
    actionText.visible = false;

    if (winner == user.username) {

        winnerText.setText(winner + ' you won!');

        if (sprite.x <= 640) {

            sprite.animations.play('rollRight', 5, true);
        }
        else {

            sprite.animations.play('rollLeft', 5, true);
        }

<<<<<<< HEAD
        //cardWin = new card(game, 640, 560, 'Fire', 'AttacK', 'Mobility card of Head-scratching Effectiveness', +10, +13);

=======
        // Add the card to the user object, either in gear or card list
        if (user.battle_metadata.reward.type == "attack" ||
            user.battle_metadata.reward.type == "mobility" ||
            user.battle_metadata.reward.type == "defense") {

            user.cards.push(user.battle_metadata.reward);
        }else{
            user.gear.push(user.battle_metadata.reward);
        }

        //cardWin = new card(game, 640, 560, 'Fire', 'AttacK', 'Mobility card of Head-scratching Effectiveness', +10, +13);

>>>>>>> origin/master
        cardWin = new card(game, 640, 560,
            user.battle_metadata.reward.elementalStatBonus.element,
            user.battle_metadata.reward.type,
            user.battle_metadata.reward.name,
            user.battle_metadata.reward.statBonus.bonus.toFixed(1),
            user.battle_metadata.reward.elementalStatBonus.bonus.toFixed(1));

        game.add.existing(cardWin);
        cardWin.scale.setTo(0.1, 0.1);
        cardWin.shadow.scale.setTo(0.1, 0.1);

        game.add.tween(cardWin.scale).to({x: 1, y: 1}, 2000, Phaser.Easing.Linear.None, true);
        game.add.tween(cardWin.shadow.scale).to({x: 1, y: 1}, 2000, Phaser.Easing.Linear.None, true);
        game.add.tween(sprite).to({x: 640}, 2000, Phaser.Easing.Linear.None, true);
        game.time.events.add(2000, (function () {
            winnerText.visible = true;
            winTextVisible = true;
            sprite.animations.play('jumpLeft', 5, true);
        }), this);
        game.time.events.add(7000, (function () {MatchOver();}), this);
    }

    else{

        winnerText.setText(user.username +' Lost,you loser');

        if (sprite.x <= 640) {

            sprite.animations.play('rollRight', 5, true);
        }
        else {

            sprite.animations.play('rollLeft', 5, true);
        }

        game.add.tween(sprite).to({x: 640}, 2000, Phaser.Easing.Linear.None, true);
        game.time.events.add(2000, (function () {
            winnerText.visible = true;
            winTextVisible = true;
            sprite.animations.play('jumpLeft', 5, true);
        }), this);
        game.time.events.add(7000, (function () {MatchOver();}), this);
    }
}

/**
 * set up the match over stuff, adds the sword/sheild image and input so the user
 * can decide to log out or play another match
 * @constructor
 */
function MatchOver (){

    if( winner == user.username){
        cardWin.visible = false;
    }

    var num = randomInt(0, 4);

    // Add the sword/sheild art to the screen, picking randomly from sword_ss sprite sheet
    var sword = game.add.sprite( 640, 560,'Sword');
    sword.frame = num;
    sword.anchor.setTo(0.5, 0.5);
    sword.scale.setTo(0.8, 0.8);

    // Add the match again text to screen, and when clicked launch rematch_btn_click function
    var matchAgainText = game.add.bitmapText(sword.x, sword.y - 35, 'carrier_command_black','PLAY AGAIN',15);
    matchAgainText.anchor.setTo(0.5, 0.5);
    matchAgainText.align = 'center';
    matchAgainText.inputEnabled = true;
    matchAgainText.events.onInputDown.add(rematch_btn_click, this);

    // Add the log out text to screen, and when clicked launch logout_btn_click function
    var logOutText = game.add.bitmapText(sword.x, sword.y + 15, 'carrier_command_black','LOG OUT',17);
    logOutText.anchor.setTo(0.5, 0.5);
    logOutText.align = 'center';
    logOutText.inputEnabled = true;
    logOutText.events.onInputDown.add(logout_btn_click, this);
}

/**
 * Stops win misic and takes the user back to the main menu state
 */
function rematch_btn_click(){

    menuclick.play();
    winMusic.stop();
    menumusic.resume();
    console.log("battle_state: rematch_btn_click");
    game.state.start("main_menu");
}

/**
 * Stops win music and reloads the game
 */
function logout_btn_click(){

    menuclick.play();
    winMusic.stop();
    console.log("battle_state: logout_btn_click");
    location.reload();
}


/**
 * Sends the card to the meta-server to remove it from the player's inventory
 * @param card JSON card object
 */
function delete_card(card) {

    console.log("Deleting card from player's inventory.");

    $.ajax({

        url: server.delete_card_endpoint(),
        type: "POST",
        data: card,
        success: card_delete_success,
        error: card_delete_error
    });
}

/**
 * Sends the equipment to the meta-server to remove it from the player's inventory
 * @param equipment JSON equipment object
 */
function delete_equipment(equipment) {

    console.log("Deleting equipment from player's inventory.");

    $.ajax({

        url: server.delete_equipment_endpoint(),
        type: "POST",
        data: equipment,
        success: equipment_delete_success,
        error: equipment_delete_error
    });
}

function card_delete_success() {
    console.log("Card properly deleted.")

    // TODO add logic to remove the card from user object
}

function card_delete_error() {
    console.log("Card was not properly deleted.")
}

function equipment_delete_success() {
    console.log("Equipment properly deleted.");
}

function equipment_delete_error() {
    console.log("Equipment was not properly deleted.");
}

function playSim (){
    sim.animations.play('simStuff', 5, true);
    game.time.events.add(3800, (function () {sim.visible = false;}), this);
}