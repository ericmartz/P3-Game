// Enemies our player must avoid
var Enemy = function(x, y, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = speed;
}

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  console.log(dt);
  this.x += this.speed * dt;
  this.checkBounds();
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Enemy.prototype.checkBounds = function() {
  if (this.x >= 515){
    this.x = -100;
  }
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
  this.sprite = 'images/char-boy.png';
  //TODO: I know the canvas width is 505 and height is 606.
  //TODO: I feel these initial positions should be calculated dynamically, but using ctx.canvas.width/height
  //TODO: does not seem to work.  I can reason out that it is out of scope from this function, but in player.render()
  //TODO: it is in scope.  Trying to figure this out, but spent about 10 hours on it and I need to move on for the momoment
  //TODO: so this is becoming a TODO.
  this.positionX = (505 / 2) - 50; //Initial X position
  this.positionY = 606 - 200; //Initial Y position
  this.moveX = 0;
  this.moveY = 0;
}

Player.prototype.playerSafe = function() {
  this.positionX = (505 / 2) - 50;
  this.positionY = 606 - 200;
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.positionX, this.positionY);
};

//TODO: Currently, handleInput takes care of two different pieces of logic.  First, it sets the number of pixels the player will be moved.
//TODO: Second, it also checks where the player is and prevents the player from moving off the board.  I probably need to create a method
//TODO: to handle the validation that the player will not move off the board.
// handleInput() takes in the keyCode, determines which key was pressed and sets the number of pixels the player will move.
Player.prototype.handleInput = function(keyCode) {
  if (keyCode === 'up'){
    if (this.positionY === -9) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 0;
      this.moveY = -83;
    }
  } else if (keyCode === 'down'){
    if (this.positionY === 406) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 0;
      this.moveY = 83;
    }
  } else if (keyCode === 'left'){
    if (this.positionX === 2.5) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = -100;
      this.moveY = 0;
    }
  } else if (keyCode === 'right'){
    if (this.positionX === 402.5) {
      this.moveX = 0;
      this.moveY = 0;
    } else {
      this.moveX = 100;
      this.moveY = 0;
    }
  }
}

Player.prototype.update = function() {
  // console.log(this.positionX);
  // console.log(this.positionY);
  this.positionX += this.moveX;
  this.positionY += this.moveY;

  if (this.positionY === -9) {
    this.playerSafe();
  }

  this.moveX = 0;
  this.moveY = 0;
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
  //TODO: Create way to randamnly generate enemies?  
  enemy1 = new Enemy(1, 230, 100),
  enemy1 = new Enemy(-150, 147, 200)
];
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});