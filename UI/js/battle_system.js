
var playerOne;
var playerTwo;
var playerOneShadow;
var playerTwoShadow;
var playerOneProj;
var playerTwoProj;
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

var playerNum;

var battle_system_state = {

    preload: function(){
        console.log("battle_system_state: preload");
    },

    create: function() {
        console.log("battle_system_state: create");

        var background = game.add.sprite(0,0, 'Background');
        playerOneShadow = game.add.sprite(140 - playerSpacing, 405, 'Shadow');
        playerTwoShadow = game.add.sprite(1140 + playerSpacing, 405, 'Shadow');
        playerOneShadow.anchor.setTo(0.5, 0.5);
        playerTwoShadow.anchor.setTo(0.5, 0.5);

        playerOneProj = game.add.sprite(140 - playerSpacing, 360,'Flash');
        playerOneProj.anchor.setTo(0.5, 0.5);
        playerOneProj.visible = false;
        playerOneProj.animations.add('shootRight', [0, 1, 2, 3]);
        playerOneProj.animations.add('shootLeft', [7, 6, 5, 4]);

        playerTwoProj = game.add.sprite(1140 + playerSpacing, 360,'Knife');
        playerTwoProj.anchor.setTo(0.5, 0.5);
        playerTwoProj.visible = false;
        playerTwoProj.animations.add('shootRight', [0, 1, 2, 3]);
        playerTwoProj.animations.add('shootLeft', [7, 6, 5, 4]);

        playerTwo= game.add.sprite(1140 + playerSpacing, 360, 'Thief');
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

        playerOne = game.add.sprite(140 - playerSpacing, 360, 'Knight');
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

        var HUD1 = game.add.sprite(645, 580, 'HUD');
        HUD1.anchor.setTo(0.5, 0.5);
        // TODO re-enable the text
        actionText = game.add.bitmapText(645, 580, 'carrier_command','Action Text\n\nGoes Here',20);
        actionText.anchor.setTo(0.5, 0.5);
        actionText.align = 'center';

        playerOneText = game.add.bitmapText(305, 580, 'carrier_command','Player\n\nOne\n\nInfo\n\nGoes\n\nHere',10);
        playerOneText.anchor.setTo(0.5, 0.5);
        playerOneText.align = 'left';

        playerTwoText = game.add.bitmapText(1005, 580, 'carrier_command','Player\n\nTwo\n\nInfo\n\nGoes\n\nHere',10);
        playerTwoText.anchor.setTo(0.5, 0.5);
        playerTwoText.align = 'right';

        playerOneHPText = game.add.bitmapText((140 - playerSpacing), 200, 'carrier_command',"-23",20);
        playerOneHPText.anchor.setTo(0.5, 0.5);
        playerOneHPText.visible = false;

        playerTwoHPText = game.add.bitmapText((1140 + playerSpacing), 200, 'carrier_command',"-16",20);
        playerTwoHPText.anchor.setTo(0.5, 0.5);
        playerTwoHPText.visible = false;
    },

    update: function() {
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

        // Input for testing

        if (game.input.keyboard.isDown(Phaser.Keyboard.ONE))
        {
            movePlayer(playerOne, 0);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.TWO))
        {
            movePlayer(playerOne, 1);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.THREE))
        {
            movePlayer(playerOne, 2);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.FOUR))
        {
            movePlayer(playerOne, 3);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE))
        {
            movePlayer(playerOne, 4);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.Q))
        {
            movePlayer(playerTwo, 0);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.W))
        {
            movePlayer(playerTwo, 1);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.E))
        {
            movePlayer(playerTwo, 2);
        }

        else if (game.input.keyboard.isDown(Phaser.Keyboard.R))
        {
            movePlayer(playerTwo, 3);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.T))
        {
            movePlayer(playerTwo, 4);
        }
        else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
        {
            attack(playerTwo);
        }
        else if  (game.input.keyboard.isDown(Phaser.Keyboard.A))
        {
            attack(playerOne);
        }
        else if  (game.input.keyboard.isDown(Phaser.Keyboard.D))
        {
            die(playerOne);
        }
        else if  (game.input.keyboard.isDown(Phaser.Keyboard.F))
        {
            die(playerTwo);
        }
        else if  (game.input.keyboard.isDown(Phaser.Keyboard.B))
        {
            block( playerOne);

        }
        else if  (game.input.keyboard.isDown(Phaser.Keyboard.N))
        {
            block(playerTwo);
        }

        else
        {

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

            if ( !canShoot ) {

                playerOneProj.x = playerOne.x;
                playerTwoProj.x = playerTwo.x;
                playerOneProj.visible = false;
                playerTwoProj.visible = false;
            }


        }
    }
};

function update() {


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

    // Input for testing

    if (game.input.keyboard.isDown(Phaser.Keyboard.ONE))
    {
        movePlayer(playerOne, 0);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.TWO))
    {
        movePlayer(playerOne, 1);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.THREE))
    {
        movePlayer(playerOne, 2);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.FOUR))
    {
        movePlayer(playerOne, 3);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.FIVE))
    {
        movePlayer(playerOne, 4);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.Q))
    {
        movePlayer(playerTwo, 0);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        movePlayer(playerTwo, 1);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.E))
    {
        movePlayer(playerTwo, 2);
    }

    else if (game.input.keyboard.isDown(Phaser.Keyboard.R))
    {
        movePlayer(playerTwo, 3);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.T))
    {
        movePlayer(playerTwo, 4);
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        attack(playerTwo);
    }
    else if  (game.input.keyboard.isDown(Phaser.Keyboard.A))
    {
        attack(playerOne);
    }
    else if  (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        die(playerOne);
    }
    else if  (game.input.keyboard.isDown(Phaser.Keyboard.F))
    {
        die(playerTwo);
    }
    else if  (game.input.keyboard.isDown(Phaser.Keyboard.B))
    {
        block( playerOne);

    }
    else if  (game.input.keyboard.isDown(Phaser.Keyboard.N))
    {
        block(playerTwo);
    }

    else
    {

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

        if ( !canShoot ) {

            playerOneProj.x = playerOne.x;
            playerTwoProj.x = playerTwo.x;
            playerOneProj.visible = false;
            playerTwoProj.visible = false;
        }


    }
}

function movePlayer ( sprite, moveNum ){

    if ( sprite == playerOne ){

        movePlayerX = ( palyerMoveArray[moveNum] - playerSpacing);
        animationCheck = (moveNum - playerOneLoc);
        animationTimer = Math.abs(animationCheck);
        playerNum = 1;
        console.log('AnimationtimerPlayerOne:' + animationTimer);
    }

    else {

        movePlayerX = (palyerMoveArray[moveNum] + playerSpacing);
        animationCheck = (moveNum - playerTwoLoc);
        animationTimer = Math.abs(animationCheck);
        playerNum = 2;
        console.log('AnimationtimerPlayerTwo:' + animationTimer);
    }

    canIdle = false;

    game.add.tween(sprite).to({ x: movePlayerX}, (1000 * animationTimer), Phaser.Easing.Linear.None, true);

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

    actionText.setText("PLAYER " + playerNum + " MOVE TO\n\nSPOT " + moveNum );


    game.time.events.add( (1000 * animationTimer), (function() { setPlayerLoc( sprite, moveNum); canIdle = true;  console.log(sprite.x);}), this );
}

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

function attack( sprite ){

    attackCheck = Math.abs(playerOneLoc - playerTwoLoc);

    setPlayerNumber ( sprite );

    if ( attackCheck < 1){

        attackClose ( sprite );
    }

    else{

        attackFar ( sprite) ;
    }

    actionText.setText("PLAYER " + playerNum + " ATTACK" );
}

function attackClose( sprite ){ // Fix

    canIdle = false;

    if ( playerOneFacing == 'right' && sprite == playerOne ){

        sprite.animations.play('attackRight', 5, false);
        game.time.events.add( 500, (function() { block( playerTwo ); canShoot = false;}), this );
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo ){

        sprite.animations.play('attackRight', 5, false);
        game.time.events.add( 500, (function() { block( playerOne ); canShoot = false;}), this );
    }

    else if (  playerOneFacing == 'left' && sprite == playerOne){

        sprite.animations.play('attackLeft', 5, false);
        game.time.events.add( 500, (function() { block( playerTwo ); canShoot = false;}), this );
    }

    else {

        sprite.animations.play('attackLeft', 5, false);
        game.time.events.add( 500, (function() { block( playerOne ); canShoot = false;}), this );
    }
}

function attackFar( sprite ){

    canIdle = false;
    canShoot = true;
    var animationTimer2 = attackCheck;

    if (  playerOneFacing == 'right' && sprite == playerOne){

        playerOneProj.visible = true;
        sprite.animations.play('attackRight', 5, false);
        playerOneProj.animations.play('shootRight', 10, true);
        game.add.tween(playerOneProj).to({ x: playerTwo.x}, (500 * animationTimer2 ), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerTwo ); canShoot = false;}), this );
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo){

        playerTwoProj.visible = true;
        sprite.animations.play('attackRight', 5, false);
        playerTwoProj.animations.play('shootRight', 5, true);
        game.add.tween(playerTwoProj).to({ x: playerOne.x}, (500 * animationTimer2), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerOne ); canShoot = false;}), this );
    }

    else if (  playerOneFacing == 'left' && sprite == playerOne){

        playerOneProj.visible = true;
        sprite.animations.play('attackLeft', 5, false);
        playerOneProj.animations.play('shootLeft', 5, true);
        game.add.tween(playerOneProj).to({ x: playerTwo.x}, (500 * animationTimer2), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerTwo ); canShoot = false;}), this );
    }

    else {

        playerTwoProj.visible = true;
        sprite.animations.play('attackLeft', 5, false);
        playerTwoProj.animations.play('shootLeft', 10, true);
        game.add.tween(playerTwoProj).to({ x: playerOne.x}, (500 * animationTimer2), Phaser.Easing.Linear.None, true);
        game.time.events.add( 500 * animationTimer2, (function() { block( playerOne ); canShoot = false;}), this );
    }
}

function die( sprite ){

    canIdle = false;

    setPlayerNumber ( sprite );

    if ( playerOneFacing == 'right' && sprite == playerOne ){

        sprite.animations.play('dieRight', 5, false);
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo ){

        sprite.animations.play('dieRight', 5, false);
    }

    else {

        sprite.animations.play('dieLeft', 5, false);
    }

    actionText.setText("PLAYER " + playerNum + " DEAD");

    game.time.events.add( 10000, (function() { canIdle = true; }), this );
}

function block( sprite ){

    canIdle = false;

    setPlayerNumber ( sprite );


    if ( playerOneFacing == 'right' && sprite == playerOne){

        sprite.animations.play('blockRight', 5, true);
        playerOneHPText.visible = true;
    }

    else if ( playerTwoFacing == 'right' && sprite == playerTwo){

        sprite.animations.play('blockRight', 5, true);
        playerTwoHPText.visible = true;
    }

    else if ( playerOneFacing == 'left' && sprite == playerOne){

        sprite.animations.play('blockLeft', 5, true);
        playerOneHPText.visible = true;
    }

    else {

        sprite.animations.play('blockLeft', 5, true);
        playerTwoHPText.visible = true;
    }

    actionText.setText("PLAYER " + playerNum +" BLOCK ");

    game.time.events.add( 1000, (function() { canIdle = true; playerOneHPText.visible = false; playerTwoHPText.visible = false}), this );
}

function setPlayerNumber( sprite ){

    if ( sprite == playerOne){

        playerNum = 1;
    }

    else{

        playerNum = 2;
    }
}