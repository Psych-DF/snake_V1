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

let snake, direction, nextMoveTime = 0;
let food, score = 0, scoreText;
let gameStarted = false, gameOver = false;
let startText, gameOverText, leaderboardText;

function preload() {}

function create() {
  direction = 'RIGHT';
  score = 0;
  gameStarted = false;
  gameOver = false;
  snake = [];

  startText = this.add.text(200, 200, 'Press SPACE to Start', {
    font: '16px Arial',
    fill: '#ffffff'
  }).setOrigin(0.5);

  scoreText = this.add.text(10, 10, '', {
    font: '16px Arial',
    fill: '#ffffff'
  });

  gameOverText = this.add.text(200, 180, '', {
    font: '20px Arial',
    fill: '#ff0000',
    align: 'center'
  }).setOrigin(0.5);

  leaderboardText = this.add.text(200, 220, '', {
    font: '14px Courier',
    fill: '#00ffcc',
    align: 'center'
  }).setOrigin(0.5);

  this.input.keyboard.on('keydown-SPACE', () => {
    if (!gameStarted) startGame.call(this);
  });

  this.input.keyboard.on('keydown-R', () => {
    if (gameOver) this.scene.restart();
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

  snake = [
    this.add.rectangle(200, 200, 20, 20, 0x00ff00),
    this.add.rectangle(180, 200, 20, 20, 0x00cc00),
    this.add.rectangle(160, 200, 20, 20, 0x009900)
  ];

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

  if (
    newX < 0 || newX >= 400 || newY < 0 || newY >= 400 ||
    snake.some(seg => seg.x === newX && seg.y === newY)
  ) {
    handleGameOver.call(this);
    return;
  }

  const newHead = this.add.rectangle(newX, newY, 20, 20, 0x00ff00);
  snake.unshift(newHead);

  if (newX === food.x && newY === food.y) {
    score++;
    scoreText.setText('Score: ' + score);

    food.setPosition(
      Phaser.Math.Snap.To(Math.random() * 400, 20),
      Phaser.Math.Snap.To(Math.random() * 400, 20)
    );
  } else {
    snake.pop().destroy();
  }
}

async function handleGameOver() {
  gameOver = true;
  gameOverText.setText('Game Over\nPress R to Retry');
  console.log('[Game Over] Score:', score);

  try {
    const leaderboard = await fetch('/api/leaderboard').then(res => res.json());
    console.log('[Leaderboard]:', leaderboard);

    const lowestTopScore = leaderboard[9]?.score || 0;
    const qualifies = score > lowestTopScore || leaderboard.length < 10;
    console.log('[Score Qualifies?]', qualifies);

    if (qualifies) {
      let initials = prompt('New High Score! Enter 3-letter initials:');
      if (!initials) return;
      initials = initials.toUpperCase().slice(0, 3);
      console.log('[Submitting Initials]:', initials);

      const res = await fetch('/api/submit-score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ initials, score })
      });

      const data = await res.json();
      console.log('[Submit Response]:', data);
    }

    const updatedBoard = await fetch('/api/leaderboard').then(res => res.json());
    displayLeaderboard(updatedBoard);
  } catch (err) {
    console.error('[Error submitting score]', err);
  }
}

function displayLeaderboard(data) {
  const lines = ['🏆 TOP 10 SCORES 🏆'];
  data.forEach((entry, i) => {
    lines.push(`${i + 1}. ${entry.initials.padEnd(3)} - ${entry.score}`);
  });
  leaderboardText.setText(lines.join('\n'));
}
