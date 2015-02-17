// actual width of character is 61px
var testF = function() {
  console.log("testF");
  main();
}
var level = 1; // Start at level 1
var previousLevel = 0;
var start = false;
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

    this.x += 230 * this.speed * dt;
    // this.x += 230 * this.speed * dt;
    if (this.x > 500) {
      this.x = 0
      //credit: http://stackoverflow.com/questions/4550505/getting-random-value-from-an-array
      var row = rowArray[Math.floor(Math.random() * rowArray.length)];
      this.y = row
      // Choose a random speed between a min and max each time the bug starts at the left of the screen
      this.speed = (Math.random() * (0.9 - 0.3) + 0.3); // max = 0.9, min = 0.3
      // credit: http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
    }
}

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // this.x = 0;
    // this.y = 0;
    this.sprite = 'images/char-boy.png';
}
Player.prototype.update = function(dt) {
  // if collision, move back to 'home'
  if ((Math.floor(allEnemies[0].x) < this.x + 35) && (Math.floor(allEnemies[0].x) > this.x - 35) && Math.floor(allEnemies[0].y) == this.y) {
    resetPlayer(this);
    this.lives -= 1;
    document.getElementById("lives").innerHTML = this.lives;
  }
  if ((Math.floor(allEnemies[1].x) < this.x + 35) && (Math.floor(allEnemies[1].x) > this.x - 35) && Math.floor(allEnemies[1].y) == this.y) {
    resetPlayer(this);
    this.lives -= 1;
    document.getElementById("lives").innerHTML = this.lives;
  }
  if ((Math.floor(allEnemies[2].x) < this.x + 35) && (Math.floor(allEnemies[2].x) > this.x - 35) && Math.floor(allEnemies[2].y) == this.y) {
    resetPlayer(this);
    this.lives -= 1;
    console.log(window.ctx.canvas.width); // KEEP RUNNING WITH THIS
    document.getElementById("lives").innerHTML = this.lives;
  }

  if (this.y == -27) {
    winningTileArray.forEach(function(tile) {
      if (player.x == tile.x) {
        previousLevel = level;
        console.log("prevlevel= " + previousLevel + "level= " + level)
        levelUp();
      }
    });
    if (previousLevel == level) {
      console.log("player dies")
      resetPlayer(this);
      this.lives -= 1;
      document.getElementById("lives").innerHTML = this.lives;
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
            console.log(player.y);
            break;
        case 'down':
          if (player.y >= 388) {
            player.y = 388;
          } else {
          player.y += 83;
          }
          console.log(player.y);
            break;
        case 'left':
          if (player.x <= 0) {
            player.x = 0;
          } else {
            player.x -= 101;
          }
          console.log(player.x);
          break
        case 'right':
          if (player.x >= 400) {
            player.x = 404;
          } else {
            player.x += 101;
          }
          console.log(player.x);
            break
    }
}
var resetPlayer = function(player) {
  player.x = (ctx.canvas.width / 2) - (101/2);
  player.y = 388;
};

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

var player = new Player();
player.x = (ctx.canvas.width / 2) - (101/2);//(player.sprite.width);//(505/2)-(101/2)
// player.y = (ctx.canvas.height - 83);
// player.x = 202;
player.y = 388;
player.lives = 3;

var getRandomColumn = function(numCols) {
  return Math.floor(Math.random() * (numCols - 1))
}

numWinningTiles = numCols // initialize numWinningTiles to be col - 1
var testArray = [];
var winningTileArray = [];
var makeWinningTiles = function(numWinningTiles) {
  console.log("makeWinningTiles " + numWinningTiles)
  // var winningTileArray = [];
  // i = winningTileArray.length;
  // var testArray = [];
  for (var i = 0; i < numWinningTiles; i++) {
    testArray.push(i);
  }
  console.log(testArray);
  // for (var i = 0; i < (numCols - numWinningTiles + 1); i++) {
    col = getRandomColumn(testArray.length);
    console.log("col " + col);
    var index = testArray.indexOf(col);
    console.log("index " + index);
    testArray.splice(index, 1);
    console.log("testArray " + testArray);
  // };
  for (var i = 0; i < testArray.length; i++) {
    var winningTile = new WinningTile();
    winningTile.x = testArray[i] * 101;
    winningTile.y = 50;
    winningTileArray.push(winningTile);
    console.log("#wintiles = " + winningTileArray.length);
  }
}
if (level == 1) {
  makeWinningTiles(numWinningTiles);
  console.log("level1")
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
    // console.log(e.keyCode);
});

function levelUp() {
  level += 1;
  document.getElementById("level").innerHTML = level;
  resetPlayer(player);
  // reset winningTileArray
  winningTileArray = [];
  testArray = [];
  // numWinningTiles -= 1
  // remake winning tiles function
  numWinningTiles -= 1;
  makeWinningTiles(numWinningTiles);
}

// function randomIntFromInterval(1,100) {
//     return Math.floor(Math.random()*(max-min+1)+min);
// }

// credit: http://www.w3schools.com/jsref/tryit.asp?filename=tryjsref_floor