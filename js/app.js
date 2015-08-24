//These two variables are to help determine the enemy's movement direction
var enemyRight = 'right';
var enemyLeft = 'left';

//These variabless are used to set the bounds of the board.
var upperBound = -9
var lowerBound = 406
var rightBound = 402.5
var leftBound = 2.5

var Enemy = function(x, y, speed, direction) {
  if (direction === enemyRight) {
    this.sprite = 'images/enemy-bug-right.png';
  }

  if (direction === enemyLeft) {
    this.sprite = 'images/enemy-bug-left.png';
  }
  this.x = x;
  this.y = y;
  this.speed = speed;
  this.direction = direction;
  this.width = 75; //width of the bug sprite is actually 101, but making it 75 is close to where the characters actually touch.
}

Enemy.prototype.update = function(dt) {
  //Movement update for enemies moving right
  if (this.direction === enemyRight) {
    this.x += this.speed * dt;
  }

  //Movement update for enemies moving left
  if (this.direction === enemyLeft) {
    this.x -= this.speed * dt;
  }

  this.checkBounds();
  this.checkCollisions();
}

Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.checkBounds = function() {
  //Check bounds for enemies moving right
  if (this.direction === enemyRight && this.x >= 515) {
    this.x = -100;
  }

  //Check bounds for enemies moving left
  if (this.direction === enemyLeft && this.x <= -100) {
    this.x = 650;
  }
}

Enemy.prototype.checkCollisions = function() {
  if ((this.x + this.width) > player.positionX && 
     (this.x < player.positionX + player.width) && 
     (player.positionY - this.y === 10) ){ //Probably different from most games, but I lowered the character so it appears within each square
    player.resetPlayer();
  }
}

var Player = function() {
  this.sprite = 'images/char-boy.png';
  //TODO: I know the canvas width is 505 and height is 606.
  //TODO: I feel these initial positions should be calculated dynamically, but using ctx.canvas.width/height
  //TODO: does not seem to work.  I can reason out that it is out of scope from this function, but in player.render()
  //TODO: it is in scope.  Trying to figure this out, but spent about 10 hours on it and I need to move on for the moment
  //TODO: so this is becoming a TODO.
  this.positionX = (505 / 2) - 50; //Initial X position
  this.positionY = 606 - 200; //Initial Y position
  this.moveX = 0;
  this.moveY = 0;
  this.width = 75; // Like the bug sprite, 101 is the actual width, but 75 seems to be a good number to make the characters visibly collide.
  this.score = 0;
}

Player.prototype.resetPlayer = function() {
  this.positionX = (505 / 2) - 50;
  this.positionY = 606 - 200;
}

Player.prototype.playerScored = function() {
  //Thought about using jQuery to append the score to the webpage, but it seemed like a lot for just a score, and I thought I would try my hand at
  //doing it without jQuery's help.
  var myScore = document.getElementById('myScore');
  this.score += 10;
  myScore.innerHTML = this.score;
  this.resetPlayer();
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

//TODO: Currently, handleInput takes care of two different pieces of logic.  First, it sets the number of pixels the player will be moved.
//TODO: Second, it also checks where the player is and prevents the player from moving off the board.  I probably need to create a method
//TODO: to handle the validation that the player will not move off the board.
//handleInput() takes in the keyCode, determines which key was pressed and sets the number of pixels the player will move.
Player.prototype.handleInput = function(keyCode) {
  if (keyCode === 'up'){
    if (this.positionY === upperBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 0;
      this.moveY = -83;
    }
  } else if (keyCode === 'down'){
      if (this.positionY === lowerBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 0;
      this.moveY = 83;
    }
  } else if (keyCode === 'left'){
    if (this.positionX === leftBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = -100;
      this.moveY = 0;
    }
  } else if (keyCode === 'right'){
    if (this.positionX === rightBound) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 100;
      this.moveY = 0;
    }
  }
}

Player.prototype.update = function() {
  this.positionX += this.moveX;
  this.positionY += this.moveY;

  //Handles when a player scores.
  if (this.positionY === upperBound) {
    this.playerScored();
  }

  this.moveX = 0;
  this.moveY = 0;
}

var allEnemies = [
  //TODO: Create way to randomnly generate enemies?
  //Enemy constuctor takes 3 arguments: x, y, and speed. 
  //y = 230 is first row
  //y = 147 is second row
  //y = 64 is third row
  enemy1 = new Enemy(1, 230, 100, enemyRight), // 1st row
  enemy2 = new Enemy(550, 147, 200, enemyLeft), // 2nd row
  enemy3 = new Enemy(-75, 64, 250, enemyRight), // 3rd row
  enemy4 = new Enemy(750, 147, 75, enemyLeft), // 2nd row
  enemy5 = new Enemy(-250, 64, 100, enemyRight), //3rd row
];
var player = new Player();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});