/**
* Created by Bryon on 2017-02-03.
*/


// Sample output provided by the sim server
var battleData = [

        {"action":"attack","player":"playerOne","number":"17"},
        {"action":"movePlayer","player":"playerTwo","number":"3"},
        {"action":"attack","player":"playerOne","number":"6"},
        {"action":"movePlayer","player":"playerTwo","number":"4"},
        {"action":"movePlayer","player":"playerOne","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"3"},
        {"action":"movePlayer","player":"playerOne","number":"1"},
        {"action":"attack","player":"playerTwo","number":"8"},
        {"action":"movePlayer","player":"playerOne","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"4"},
        {"action":"attack","player":"playerOne","number":"23"},
        {"action":"movePlayer","player":"playerTwo","number":"3"},
        {"action":"movePlayer","player":"playerOne","number":"1"},
        {"action":"attack","player":"playerTwo","number":"5"},
        {"action":"attack","player":"playerOne","number":"11"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"attack","player":"playerTwo","number":"19"},
        {"action":"attack","player":"playerOne","number":"11"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"attack","player":"playerOne","number":"15"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"attack","player":"playerTwo","number":"7"},
        {"action":"attack","player":"playerOne","number":"10"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"attack","player":"playerTwo","number":"12"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"attack","player":"playerOne","number":"2"},
        {"action":"attack","player":"playerTwo","number":"11"},
        {"action":"attack","player":"playerTwo","number":"3"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"attack","player":"playerOne","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"movePlayer","player":"playerTwo","number":"2"},
        {"action":"attack","player":"playerTwo","number":"7"},
        {"action":"movePlayer","player":"playerTwo","number":"1"},
        {"action":"attack","player":"playerOne","number":"3"},
        {"action":"die","player":"playerTwo","number":"20"}
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

var playerOneHP = 100;
var playerTwoHP = 100;

var playerNum;

var i = 0; 
var delayTimer = 4000;

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

        // Add the menu background to screen
        background = game.add.sprite(0,0, 'Background');

        // Add the players shasows to the screen.
        playerOneShadow = game.add.sprite(140 - playerSpacing, 405, 'Shadow');
        playerTwoShadow = game.add.sprite(1140 + playerSpacing, 405, 'Shadow');
        playerOneShadow.anchor.setTo(0.5, 0.5);
        playerTwoShadow.anchor.setTo(0.5, 0.5);

        // Add the players projectiles to the screen and set them invisible, add the animation.
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
        playerOne.animations.add('blockLeft', [36]);

        // Add the HUD to the screen
        HUD1 = game.add.sprite(645, 580, 'HUD');
        HUD1.anchor.setTo(0.5, 0.5);
        
        // Add the actionText to the screen
        actionText = game.add.bitmapText(645, 580, 'carrier_command', 'Simulating Battle', 20);
        actionText.anchor.setTo(0.5, 0.5);
        actionText.align = 'center';

        // Add the players text to the screen.
        playerOneText = game.add.bitmapText(305, 580, 'carrier_command', user.username + '\n\nHP: ' + playerOneHP, 10);
        playerOneText.anchor.setTo(0.5, 0.5);
        playerOneText.align = 'left';

        playerTwoText = game.add.bitmapText(1005, 580, 'carrier_command', user.opponent.username + '\n\nHP: ' + playerTwoHP, 10);
        playerTwoText.anchor.setTo(0.5, 0.5);
        playerTwoText.align = 'right';

        // Add the player HPText (the numbers above the head when they get hit) to the screen, set to invisible.
        playerOneHPText = game.add.bitmapText((140 - playerSpacing), 200, 'carrier_command', ' ' , 20);
        playerOneHPText.anchor.setTo(0.5, 0.5);
        playerOneHPText.visible = false;

        playerTwoHPText = game.add.bitmapText((1140 + playerSpacing), 200, 'carrier_command', ' ', 20);
        playerTwoHPText.anchor.setTo(0.5, 0.5);
        playerTwoHPText.visible = false;

        // Run the battleLoop function.
        battleLoop(battleData);   

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

        // Update the playersText
        playerOneText.setText (user.username + '\n\nHP: ' + playerOneHP );
        playerTwoText.setText (user.opponent.username + '\n\nHP: ' + playerTwoHP );


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
    }
};

/*function update() {


    if (playerOne.x < playerTwo.x){

        playerOneFacing = 'right';
        playerTwoFacing = 'left';
    }

    else {

        playerOneFacing = 'left';
        playerTwoFacing = 'right';
    }

    playerOneShadow.x = playerOne.x;
    playerTwoShadow.x = playerTwo.x;

    playerOneHPText.x = playerOne.x;
    playerTwoHPText.x = playerTwo.x;

    playerOneText.setText ('Player\n\nOne\n\nHP: ' + playerOneHP );
    playerTwoText.setText ('Player\n\nTwo\n\nHP: ' + playerTwoHP );

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
}*/

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
    }

    else if (  animationCheck > 0 && animationTimer < 4 && animationTimer >= 3) {

        sprite.animations.play('rollRight', 5, true);
    }

    else if (  animationCheck > 0 && animationTimer >= 4 ) {

        sprite.animations.play('jumpRight', 5, true);
    }

    else if(  animationCheck < 0 && animationTimer < 4 && animationTimer >= 3) {

        sprite.animations.play('rollLeft', 5, true);
    }

    else if (  animationCheck < 0 && animationTimer >= 4 ) {

        sprite.animations.play('jumpLeft', 5, true);
    }

    else {

        sprite.animations.play('walkLeft', 5, true);
    }

    // Update action text.
    actionText.setText(playerNum + "\n\n MOVE TO\n\nSPOT " + moveNum );

    // set the player location after the sprite moves to the right location
    game.time.events.add( (1000 * animationTimer), (function() { setPlayerLoc( sprite, moveNum); canIdle = true;  console.log(sprite.x);}), this );
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
    actionText.setText(playerNum + "\n\n ATTACK" );
}

/**
 * Function decides what sprite to animate and what version(left, right) of the attack animation to play
 * @param sprite
 * @param damageNum
 */
function attackClose( sprite, damageNum ){ 

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
       // win(playerTwo);
        actionText.setText(user.opponent.username + '\n\n WINS THE BATTLE');

    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo ){

        sprite.animations.play('dieRight', 5, false);
        //win(playerOne);
        actionText.setText(user.username + '\n\n WINS THE BATTLE');
    }

    else if ( playerOneFacing == 'left' && sprite == playerOne ){

        sprite.animations.play('dieLeft', 5, false);
       // win(playerTwo);
        actionText.setText(user.opponent.username + '\n\n WINS THE BATTLE');

    }

    else{

        sprite.animations.play('dieLeft', 5, false);
       // win(playerOne);
        actionText.setText(user.username + '\n\n WINS THE BATTLE');
    }

    //actionText.setText("PLAYER " + playerNum + " DEAD");

    // Pause for dieTimer seconds
    game.time.events.add( dieTimer * 1000 , (function() { canIdle = true; }), this );
}

/**
 * Function decides what sprite to animate and what version(left, right) of the block animation to play.
 * @param sprite
 * @param damageNum
 */
function block( sprite, damageNum){

    canIdle = false;

    setPlayerNumber ( sprite );

    // Pick sprite and animations to play, and update HP based on damageNum, set HPText to visable and update it.
    if ( playerOneFacing == 'right' && sprite == playerOne){

        sprite.animations.play('blockRight', 5, true);
        playerOneHPText.setText('-' + damageNum);
        playerOneHP -= parseInt(damageNum);
        playerOneHPText.visible = true;
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo){

        sprite.animations.play('blockRight', 5, true);
        playerTwoHPText.setText('-' + damageNum);
        playerTwoHP -= parseInt(damageNum);
        playerTwoHPText.visible = true;
    }

     else if ( playerOneFacing == 'left' && sprite == playerOne){

        sprite.animations.play('blockLeft', 5, true);
        playerOneHPText.setText('-'+damageNum);
        playerOneHP -= parseInt(damageNum);
        playerOneHPText.visible = true;
    }

    else {

        sprite.animations.play('blockLeft', 5, true);
        playerTwoHPText.setText('-' + damageNum);
        playerTwoHP -= parseInt(damageNum);
        playerTwoHPText.visible = true;              
    }

    // Update actionText.
    actionText.setText(playerNum +"\n\n BLOCK ");

    // Set HPText to invisible after animation plays.
    game.time.events.add( 1000, (function() { canIdle = true; playerOneHPText.visible = false; playerTwoHPText.visible = false}), this ); 
}

/**
 * Function sets the player number based on what sprite.
 * @param sprite
 */
function setPlayerNumber( sprite ){

    if ( sprite == playerOne){

        playerNum =  user.username;
    }

    else{

        playerNum = user.opponent.username;
    }
}

/**
 * Function loops through battleObj and picks what sprite, and what function to call based on
 * what is in thr obj. It delayes 4 sec after each loop to let the animations plat out.
 * @param battleObj
 */
function battleLoop ( battleObj ) {  

    setTimeout(function () { 

        // Call movePlayer function
        if (battleObj[i].action == 'movePlayer') {

            if (battleObj[i].player == 'playerOne'){

                player = playerOne;
            }
            else{ player = playerTwo;}
                             
            movePlayer(player, battleObj[i].number - 1); 
        }

        // Call attack function
        else if (battleObj[i].action == 'attack') {

            if (battleObj[i].player == 'playerOne') {

                player = playerOne;
            }
            else {
                player = playerTwo;
            }

            attack(player, battleObj[i].number);
        }

        // Call block function.
        else if (battleObj[i].action == 'block'){

            if ( battleObj[i].player == 'playerOne'){

                player = playerOne;
            }
            else { player = playerTwo;}
             
            block(player, battleObj[i].number); 
        }

        // Call die function
        else {

            if ( battleObj[i].player== 'playerOne'){

                player = playerOne;
            }
            else { player = playerTwo;}

            die (player, battleObj[i].number);
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
 * @returns {*}
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

