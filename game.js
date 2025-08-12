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

let platforms = [
  { x: 0, y: 350, width: 800, height: 50 }
];

let keys = {};
let score = 0;

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function drawPlayer() {
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawPlatforms() {
  ctx.fillStyle = 'lime';
  platforms.forEach(p => {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  });
}

function updatePlayer() {
  player.dy += player.gravity;
  player.y += player.dy;

  // Jump
  if (keys['Space'] && player.grounded) {
    player.dy = player.jumpPower;
    player.grounded = false;
  }

  // Collision
  player.grounded = false;
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height < p.y + player.height &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.grounded = true;
    }
  });

  // Move right
  if (keys['ArrowRight']) {
    player.x += 5;
    score++;
  }

  // Move left
  if (keys['ArrowLeft']) {
    player.x -= 5;
    score = Math.max(0, score - 1);
  }

  // Boundaries
  if (player.y > canvas.height) {
    alert(`Game Over! Score: ${score}`);
    player.x = 50;
    player.y = 300;
    score = 0;
  }
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlatforms();
  drawPlayer();
  updatePlayer();
  drawScore();
  requestAnimationFrame(gameLoop);
}

gameLoop();
