//These two variables are to help determine the enemy's movement direction
var enemyRight = 'right';
var enemyLeft = 'left';

//These variabless are used to set the bounds of the board.
var upperBound = -9;
var lowerBound = 406;
var rightBound = 402.5;
var leftBound = 2.5;

//Variable used to record what level character is on
var gameLevel = 1;

// gameState, gsPause and gsPlay are all variables used for the game state.  Specifically to tell if the game 
// should be paused or in play.
var gsPause = 'paused';
var gsPlay = 'play';
var gameState = gsPlay;

//Enemy class holds the specifications of enemies.
var Enemy = function(x, y, speed, direction) {
  if (direction === enemyRight) {
    this.sprite = 'images/enemy-bug-right.png';
  } else if (direction === enemyLeft) {
    this.sprite = 'images/enemy-bug-left.png';
  }
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.direction = direction;
  this.width = 75; //width of the bug sprite is actually 101, but making it 75 is close to where the characters actually touch.
};

//Update function updates the character's movement, checks that the enemy is within map bounds and checks for collisions.
Enemy.prototype.update = function(dt) {

  // As the character reaches the water, the game levels up.  As the game levels up, the characters move faster.
  var multiplier = gameLevel / 10 + 1;

  //Movement update for enemies moving right
  if (this.direction === enemyRight) {
    this.x += this.speed * dt * multiplier;
  }

  //Movement update for enemies moving left
  if (this.direction === enemyLeft) {
    this.x -= this.speed * dt * multiplier;
  }

  this.checkBounds();
  this.checkCollisions();
};

//Render renders the enemy on the map.
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//checkBounds checks to see if the enemy has left the map and resets the enemy's X position to move across the map again.
Enemy.prototype.checkBounds = function() {
  //Check bounds for enemies moving right
  if (this.direction === enemyRight && this.x >= 515) {
    this.x = -100;
  }

  //Check bounds for enemies moving left
  if (this.direction === enemyLeft && this.x <= -100) {
    this.x = 650;
  }
};

//checkCollisions checks to see if the enemy has collided with the player's character, and calls resetPlayer if a collision occurs.
Enemy.prototype.checkCollisions = function() {
  if ((this.x + this.width) > player.positionX &&
    (this.x < player.positionX + player.width) &&
    (player.positionY - this.y === 10)) { //Probably different from most games, but I lowered the character so it appears within each square
    player.resetPlayer();
  }
};

//Player class used to store the specifications of the player.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  //TODO: I know the canvas width is 505 and height is 606.
  //TODO: I feel these initial positions should be calculated dynamically, but using ctx.canvas.width/height
  //TODO: does not seem to work.  I can reason out that it is out of scope from this function, but in player.render()
  //TODO: it is in scope.  Trying to figure this out, but spent about 10 hours on it and I need to move on for the moment
  //TODO: so this is becoming a TODO.  Update 9/26: I think the scoping issue might have to do with the prototype chain.  Reasearching.
  this.positionX = (505 / 2) - 50; //Initial X position
  this.positionY = 606 - 200; //Initial Y position
  this.moveX = 0;
  this.moveY = 0;
  this.width = 75; // Like the bug sprite, 101 is the actual width.  But 75 seems to be a good number to make the characters visibly collide.
  this.score = 0;
};

//resetPlayer is used to reset the player back to the beginning position on the map.
Player.prototype.resetPlayer = function() {
  this.positionX = (505 / 2) - 50;
  this.positionY = 606 - 200;
};

//playerScored adds to the characters score when called, updates the score on the webpate and then calls resetPlayer and levelUp
Player.prototype.playerScored = function() {
  //Thought about using jQuery to append the score to the webpage, but it seemed like a lot for just a score, and I thought I would try my hand at
  //doing it without jQuery's help.
  var displayScore = document.getElementById('displayScore');
  this.score += 10;
  displayScore.innerHTML = this.score;
  this.resetPlayer();
  levelUp();
};

//render displays the character on the map.
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

//TODO: Currently, handleInput takes care of two different pieces of logic.  First, it sets the number of pixels the player will be moved.
//TODO: Second, it also checks where the player is and prevents the player from moving off the board.  I probably need to create a method
//TODO: to handle the validation that the player will not move off the board.
//handleInput() takes in the keyCode, determines which key was pressed and sets the number of pixels the player will move.
Player.prototype.handleInput = function(keyCode) {
  if (keyCode === 'up') {
    if (this.positionY === upperBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 0;
      this.moveY = -83;
    }
  } else if (keyCode === 'down') {
    if (this.positionY === lowerBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 0;
      this.moveY = 83;
    }
  } else if (keyCode === 'left') {
    if (this.positionX === leftBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = -100;
      this.moveY = 0;
    }
  } else if (keyCode === 'right') {
    if (this.positionX === rightBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 100;
      this.moveY = 0;
    }
  } else if (keyCode === 'spacebar') {
    updateGameState();
  }
};

//update updates the player's position by adding the amoune the player is supposed to move to the player's current position
//update then checks to see if the player scored and calls playerScored, if so.  Then resets the player's move variables to 0.
Player.prototype.update = function() {
  this.positionX += this.moveX;
  this.positionY += this.moveY;

  //Handles when a player scores.
  if (this.positionY === upperBound) {
    this.playerScored();
  }

  this.moveX = 0;
  this.moveY = 0;
};

// allEnemies is the array that holds the enemy variables
var allEnemies = [
  //TODO: Create way to randomnly generate enemies?
  //Enemy constuctor takes 4 arguments: x, y, speed and direction. 
  //y = 230 is first row
  //y = 147 is second row
  //y = 64 is third row
  enemy1 = new Enemy(1, 230, 100, enemyRight), // 1st row
  enemy2 = new Enemy(550, 147, 200, enemyLeft), // 2nd row
  enemy3 = new Enemy(-75, 64, 250, enemyRight), // 3rd row
  enemy4 = new Enemy(750, 147, 75, enemyLeft), // 2nd row
  enemy5 = new Enemy(-250, 64, 100, enemyRight), //3rd row
];

//Create a new player instance
var player = new Player();

//levelUp is called by playerScore when the player reaches the water.  This increases the game level.
var levelUp = function() {
  gameLevel += 1;
};

//updateGameState toggles the game state from play to pause and vice versa when the spacebar is pressed
var updateGameState = function() {
  if (gameState === gsPause) {
    gameState = gsPlay;
  } else if (gameState === gsPlay) {
    gameState = gsPause;
  }
};

//Event listener that looks for key presses.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    32: 'spacebar',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});