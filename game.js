const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  color: 'cyan',
  dy: 0,
  gravity: 0.5,
  jumpPower: -10,
  grounded: false
};

let groundY = 350;
let obstacles = [];
let coins = [];
let score = 0;
let speed = 4;
let keys = {};
let frame = 0;

// Sound effects
const jumpSound = new Audio('assets/jump.mp3');
const coinSound = new Audio('assets/coin.mp3');
const crashSound = new Audio('assets/crash.mp3');

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function spawnObstacle() {
  obstacles.push({
    x: canvas.width,
    y: groundY - 30,
    width: 30,
    height: 30,
    color: 'red'
  });
}

function spawnCoin() {
  coins.push({
    x: canvas.width,
    y: groundY - 60 - Math.random() * 40,
    radius: 10,
    color: 'gold'
  });
}

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
  obstacles.forEach(ob => {
    ctx.fillStyle = ob.color;
    ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
  });
}

function drawCoins() {
  coins.forEach(c => {
    ctx.fillStyle = c.color;
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updatePlayer() {
  player.dy += player.gravity;
  player.y += player.dy;

  if (player.y + player.height >= groundY) {
    player.y = groundY - player.height;
    player.dy = 0;
    player.grounded = true;
  }

  if (keys['Space'] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
    jumpSound.play();
  }
}

function updateObstacles() {
  obstacles.forEach(ob => ob.x -= speed);
  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);
}

function updateCoins() {
  coins.forEach(c => c.x -= speed);
  coins = coins.filter(c => c.x + c.radius > 0);
}

function checkCollisions() {
  obstacles.forEach(ob => {
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      crashSound.play();
      alert(`Game Over! Score: ${score}`);
      resetGame();
    }
  });

  coins.forEach((c, i) => {
    let dx = player.x + player.width / 2 - c.x;
    let dy = player.y + player.height / 2 - c.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < c.radius + player.width / 2) {
      score += 10;
      coinSound.play();
      coins.splice(i, 1);
    }
  });
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function resetGame() {
  player.x = 50;
  player.y = 300;
  player.dy = 0;
  score = 0;
  obstacles = [];
  coins = [];
  speed = 4;
  frame = 0;
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawObstacles();
  drawCoins();
  drawScore();

  updatePlayer();
  updateObstacles();
  updateCoins();
  checkCollisions();

  frame++;
  if (frame % 100 === 0) spawnObstacle();
  if (frame % 150 === 0) spawnCoin();
  if (frame % 500 === 0) speed += 0.5;

  requestAnimationFrame(gameLoop);
}

gameLoop();
