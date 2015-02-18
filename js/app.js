// actual width of character is 61px

// Initiate some global variables
var level = 1; // Start at level 1
var minSpeed = 0.3; // minimum bug speed; increases every level
var maxSpeed = 0.9; // maximum bug speed; increases every level

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}
rowArray = [56, 139, 222]; // array of y values for each row of bugs

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.


    /* This moves the bug by its speed * dt * a factor of 230
       Each time the bug goes off the right side of the screen, it is given
       a new random speed between the max and min
    */
    // 230 has no significance, it just seemed to be the right factor
    // to make the game playable
    this.x += 230 * this.speed * dt;
    if (this.x > 500) { // bug goes off of canvas
      this.x = 0
      //credit: http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
      var row = rowArray[Math.floor(Math.random() * rowArray.length)];
      this.y = row
      // Choose a random speed between a min and max each time the bug starts at the left of the screen
      this.speed = (Math.random() * (maxSpeed - minSpeed) + minSpeed);
      // credit: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

/* PLAYER FUNCTIONS */
// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    this.sprite = 'images/char-boy.png';
}
Player.prototype.update = function(dt) {
  // if collision, player dies
  if ((Math.floor(allEnemies[0].x) < this.x + 35) && (Math.floor(allEnemies[0].x) > this.x - 35) && Math.floor(allEnemies[0].y) == this.y) {
    playerDies(player);
  }
  if ((Math.floor(allEnemies[1].x) < this.x + 35) && (Math.floor(allEnemies[1].x) > this.x - 35) && Math.floor(allEnemies[1].y) == this.y) {
    playerDies(player);
  }
  if ((Math.floor(allEnemies[2].x) < this.x + 35) && (Math.floor(allEnemies[2].x) > this.x - 35) && Math.floor(allEnemies[2].y) == this.y) {
    playerDies(player);
  }

  // if player reaches top row
  // (I would have liked to not have harded code these variables, but it took a lot of time
  //   to figure out the exact widths of the graphics because there was some
  //   transparent part of each image)
  if (this.y == -27) {
    y = true; // y is just a variable used to check if the player landed on the tile or water
    winningTileArray.forEach(function(tile) {
      if (player.x == tile.x) {
        levelUp();
        y = false;
      }
    });
    if (y == true) {
      playerDies(player);
    }
  }
}

Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}
Player.prototype.handleInput = function(key) {
  switch(key) {
    case 'up':
      if (player.y <= -22) {
        player.y = -27;
      } else {
        player.y -= 83;
      }
      break;
    case 'down':
      if (player.y >= 388) {
        player.y = 388;
      } else {
        player.y += 83;
      }
      break;
    case 'left':
      if (player.x <= 0) {
        player.x = 0;
      } else {
        player.x -= 101;
      }
      break
    case 'right':
      if (player.x >= 400) {
        player.x = 404;
      } else {
        player.x += 101;
      }
      break
    }
}

// This function moves the player back to starting position after they die or
// complete a level.
var resetPlayer = function(player) {
  player.x = (ctx.canvas.width / 2) - (101/2);
  player.y = 388;
};


// Create a new class of tiles on the top row that a player must land on to beat a level.
// I thought it was weird that the player could go in the water, so I made it so
// the player dies if they go in the water, they must land on the 'tiles'
var WinningTile = function() {
  this.sprite = 'images/wood.png'
}

WinningTile.prototype.update = function(dt) {
}

// Draw the tiles on the screen
WinningTile.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

/* Instantiate enemy objects at random x values
   Speed is initially set to 1, but is changed every time the bug crosses the screen
 */
allEnemies = [];
var enemy = new Enemy();
allEnemies.push(enemy);
enemy.x = -50;
enemy.y = rowArray[0];
enemy.speed = 1;
var enemy2 = new Enemy();
allEnemies.push(enemy2);
enemy2.x = 250;
enemy2.y = rowArray[1];
enemy2.speed = 1;
var enemy3 = new Enemy();
allEnemies.push(enemy3);
enemy3.x = -150;
enemy3.y = rowArray[2];
enemy3.speed = 1;

/* Instantiate player objects */
var player = new Player();
player.x = (ctx.canvas.width / 2) - (101/2);//(player.sprite.width);//(505/2)-(101/2)
// player.y = (ctx.canvas.height - 83);
// I wanted to not make these locations hard coded, but was difficult
// because of the transpart parts of the graphic images
player.y = 388;
player.lives = 3; // players start with 3 lives


// This is a simple function that gets a random column number
var getRandomColumn = function(numCols) {
  return Math.floor(Math.random() * (numCols - 1))
}

/* Instantiate tile objects
   On the first level there are four tiles randomly placed on the top row.
   The player must land on one of these tiles to beat the level.
   Each level, the number or possible tiles is reduced by one, making the level harder
*/

// Initialize some global variables
numWinningTiles = numCols
var testArray = [];
var winningTileArray = []; // an array of tiles, similar to the allEnemies[] array
// This function creates the number of tiles based on the level and randomly assigns
// them to a column
var makeWinningTiles = function(numWinningTiles) {
  // create an array of columns, one for each tile
  for (var i = 0; i < numWinningTiles; i++) {
    testArray.push(i);
  }
  col = getRandomColumn(testArray.length); // pick a random column
  var index = testArray.indexOf(col);
  testArray.splice(index, 1); // remove one tile
  for (var i = 0; i < testArray.length; i++) {
    var winningTile = new WinningTile();
    winningTile.x = testArray[i] * 101; // tiles are placed in random columns
    winningTile.y = 50; // all tiles on the top row
    winningTileArray.push(winningTile);
  }
}
// Create the tiles at the start of the game
if (level == 1) {
  makeWinningTiles(numWinningTiles);
}

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

/* This function is called each time the player reaches the wooden tiles
   and goes on to the next level
*/
function levelUp() {
  level += 1;
  if (level == 5) {
    alert("You win! Refresh to play again.");
  }
  document.getElementById("level").innerHTML = level;
  resetPlayer(player);
  winningTileArray = []; // reset winningTileArray
  testArray = []; // reset the array
  numWinningTiles -= 1; // reduce number of winning tiles every level
  makeWinningTiles(numWinningTiles); // redraw the tiles
  // increase bug speed by 0.3 each level
  minSpeed += 0.3;
  maxSpeed += 0.3;
}

/* This function is called whenever a player dies by hitting a bug or falling
   in the water
*/
function playerDies(player) {
  alert("You died. Hit ok to continue.")
  resetPlayer(player);
  player.lives -= 1;
  document.getElementById("lives").innerHTML = player.lives;
  if (player.lives == 0) {
    alert("You lose! Don't hit the bugs or fall in the water. You must get to the brown wood to complete the level. Refesh to try again.");
  }
}

// I wanted to add more functionality, but after watching multiple office hours and
// reading forums, I still could not figure out how to start and stop the game,
// so I just used alert() instead.

// credit: http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_floor