const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: "#000000",
  scene: {
    preload,
    create,
    update
  }
};

const game = new Phaser.Game(config);

let snake;
let direction;
let nextMoveTime = 0;
let food;
let score = 0;
let scoreText;
let gameStarted = false;
let gameOver = false;
let startText;
let gameOverText;

function preload() {}

function create() {
  // Initial values
  direction = 'RIGHT';
  score = 0;
  gameStarted = false;
  gameOver = false;
  snake = [];

  // Add start screen text
  startText = this.add.text(200, 200, 'Press SPACE to Start', {
    font: '16px Arial',
    fill: '#ffffff'
  }).setOrigin(0.5);

  // Score text (start hidden)
  scoreText = this.add.text(10, 10, '', {
    font: '16px Arial',
    fill: '#ffffff'
  });

  // Game over text (start hidden)
  gameOverText = this.add.text(200, 200, '', {
    font: '20px Arial',
    fill: '#ff0000'
  }).setOrigin(0.5);

  // Input listeners
  this.input.keyboard.on('keydown-SPACE', () => {
    if (!gameStarted) {
      startGame.call(this);
    }
  });

  this.input.keyboard.on('keydown-R', () => {
    if (gameOver) {
      this.scene.restart();
    }
  });

  this.input.keyboard.on('keydown', (e) => {
    if (!gameStarted || gameOver) return;
    if (e.code === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.code === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.code === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.code === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  });
}

function startGame() {
  gameStarted = true;
  startText.setVisible(false);
  scoreText.setText('Score: 0');

  // Create initial snake (3 segments)
  snake = [
    this.add.rectangle(200, 200, 20, 20, 0x00ff00),
    this.add.rectangle(180, 200, 20, 20, 0x00cc00),
    this.add.rectangle(160, 200, 20, 20, 0x009900)
  ];

  // Create food
  food = this.add.rectangle(
    Phaser.Math.Snap.To(Math.random() * 400, 20),
    Phaser.Math.Snap.To(Math.random() * 400, 20),
    20, 20, 0xff0000
  );
}

function update(time) {
  if (!gameStarted || gameOver) return;
  if (time < nextMoveTime) return;

  nextMoveTime = time + 100;

  const head = snake[0];
  const newX = head.x + (direction === 'LEFT' ? -20 : direction === 'RIGHT' ? 20 : 0);
  const newY = head.y + (direction === 'UP' ? -20 : direction === 'DOWN' ? 20 : 0);

  // Collision with wall or self
  if (
    newX < 0 || newX >= 400 || newY < 0 || newY >= 400 ||
    snake.some(seg => seg.x === newX && seg.y === newY)
  ) {
    handleGameOver();
    return;
  }

  // Add new head
  const newHead = this.add.rectangle(newX, newY, 20, 20, 0x00ff00);
  snake.unshift(newHead);

  // Check food collision
  if (newX === food.x && newY === food.y) {
    score++;
    scoreText.setText('Score: ' + score);

    food.setPosition(
      Phaser.Math.Snap.To(Math.random() * 400, 20),
      Phaser.Math.Snap.To(Math.random() * 400, 20)
    );
  } else {
    // Remove tail
    snake.pop().destroy();
  }
}

function handleGameOver() {
  gameOver = true;
  gameOverText.setText('Game Over\nPress R to Retry');
}
