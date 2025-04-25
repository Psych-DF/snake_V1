const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 400,
  backgroundColor: "#000000",
  parent: "game-container",
  scene: {
    create,
    update
  }
};

const game = new Phaser.Game(config);

let snake = [];
let direction = 'RIGHT';
let nextMoveTime = 0;
const speed = 100;
let food;

function create() {
  const scene = this;

  // Create snake (3 segments)
  snake = [
    this.add.rectangle(200, 200, 20, 20, 0x00ff00),
    this.add.rectangle(180, 200, 20, 20, 0x00cc00),
    this.add.rectangle(160, 200, 20, 20, 0x009900)
  ];

  // Input keys
  this.input.keyboard.on('keydown', function (e) {
    if (e.code === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (e.code === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
    if (e.code === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (e.code === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  });

  // Create food
  food = this.add.rectangle(300, 300, 20, 20, 0xff0000);
}

function update(time) {
  if (time < nextMoveTime) return;

  nextMoveTime = time + speed;

  const head = snake[0];
  const newX = head.x + (direction === 'LEFT' ? -20 : direction === 'RIGHT' ? 20 : 0);
  const newY = head.y + (direction === 'UP' ? -20 : direction === 'DOWN' ? 20 : 0);

  // Check collision with self or walls
  if (newX < 0 || newX >= 400 || newY < 0 || newY >= 400 || snake.some(s => s.x === newX && s.y === newY)) {
    game.scene.pause();
    alert("Game Over");
    return;
  }

  const newHead = game.scene.scenes[0].add.rectangle(newX, newY, 20, 20, 0x00ff00);
  snake.unshift(newHead);

  // Check food collision
  if (newX === food.x && newY === food.y) {
    food.setPosition(
      Phaser.Math.Snap.To(Math.random() * 400, 20),
      Phaser.Math.Snap.To(Math.random() * 400, 20)
    );
  } else {
    snake.pop().destroy();
  }
}
