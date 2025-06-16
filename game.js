const GRID_SIZE = 9;
const GAME_TIME = 30; // seconds
const WATER_CAN_IMG = 'img/water-can-transparent.png';
const BLACK_DROP_IMG = 'img/black water drop.png'; 

const grid = document.getElementById('grid');
const startBtn = document.getElementById('startGameBtn');
const timerSpan = document.getElementById('timer');
const scoreSpan = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

let timer = GAME_TIME;
let score = 0;
let gameInterval = null;
let moleTimeout = null;
let gameActive = false;

// Create grid cells
function createGrid() {
  grid.innerHTML = '';
  for (let i = 0; i < GRID_SIZE; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.dataset.index = i;
    grid.appendChild(cell);
  }
}
createGrid();

function resetGame() {
  timer = GAME_TIME;
  score = 0;
  timerSpan.textContent = `Time: ${timer}`;
  scoreSpan.textContent = `Score: ${score}`;

  Array.from(grid.children).forEach(cell => cell.innerHTML = '');
  grid.classList.remove('unclickable');
}

function randomInt(max) {
  return Math.floor(Math.random() * max);
}

function showRandomMole() {
  Array.from(grid.children).forEach(cell => cell.innerHTML = '');
  const idx = randomInt(GRID_SIZE);
  const cell = grid.children[idx];
  const isWaterCan = Math.random() < 0.5;
  const img = document.createElement('img');
  img.src = isWaterCan ? WATER_CAN_IMG : BLACK_DROP_IMG;
  img.alt = isWaterCan ? 'Water Can' : 'Black Drop';
  img.className = isWaterCan ? 'water-can' : 'black-drop';
  img.draggable = false;
  cell.appendChild(img);

  cell.onclick = () => {
    if (!gameActive) return;
    
    if (cell.querySelector('img')) {
      if (isWaterCan) {
        score += 10;
      } else {
        score -= 20;
      }
      scoreSpan.textContent = `Score: ${score}`;
      cell.innerHTML = '';
    }
    
  };

  
  moleTimeout = setTimeout(() => {
    cell.innerHTML = '';
  }, 900);
}

function startGame() {
  resetGame();
  gameActive = true;
  startBtn.disabled = true;
  grid.classList.remove('unclickable');

  gameInterval = setInterval(() => {
    timer--;
    timerSpan.textContent = `Time: ${timer}`;
    if (timer <= 0) {
      endGame();
    }
  }, 1000);

  function moleLoop() {
    if (!gameActive) return;
    showRandomMole();
    setTimeout(moleLoop, 900);
  }
  moleLoop();
}

function endGame() {
  gameActive = false;
  clearInterval(gameInterval);
  clearTimeout(moleTimeout);
  Array.from(grid.children).forEach(cell => cell.innerHTML = '');
  startBtn.disabled = false;
  grid.classList.add('unclickable');
}

// Restart button logic
restartBtn.onclick = () => {
  clearInterval(gameInterval);
  clearTimeout(moleTimeout);
  gameActive = false;
  startBtn.disabled = false;
  resetGame();
  grid.classList.remove('unclickable');
};


startBtn.onclick = () => {
  if (!gameActive) {
    startGame();
  }
};
