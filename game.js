const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;

let timeStart;
let timePlayer;
let timeInterval;

// Selector de vidas
const spanLive = document.querySelector('#lives');
// Selector de tiempo
const spanTime = document.querySelector('#time');

// Selector de record
const spanRecord = document.querySelector('#record');
const pResult = document.querySelector('#result');
//Crear personaje objeto
const playerPosition = {
  x: undefined ,
  y: undefined ,
}

const gifPosition = {
  x: undefined ,
  y: undefined ,

}

let enemyPosition = [];

function setCanvasSize() {

  canvasSize = (window.innerHeight > window.innerWidth) ? Math.round(window.innerWidth * 0.7): Math.round(window.innerHeight * 0.7);
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  elementsSize = Math.round(canvasSize / 10);
  startGame();
  playerPosition.x = undefined;
  playerPosition.y = undefined;
}


function startGame(){
  game.font = elementsSize + 'px Impact';
  game.textAlign = 'end';
  let map = maps[level]
  showLives();
  showTime();
  showRecord();

  if (!map){
    gameWin();
    return;
  }
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord()
  }

  let mapRow = map.trim().split('\n');
  const mapRowCols = mapRow.map(row => row.trim().split(''));

  
  enemyPosition = []
  game.clearRect(0,0,canvasSize,canvasSize)

  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI ) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O'){ 
        if(!playerPosition.x && !playerPosition.y){
          playerPosition.x = posX;
          playerPosition.y = posY;
        }
      } else if (col == 'I') {
        gifPosition.x = posX;
        gifPosition.y = posY;
      } else if (col == 'X') {
        enemyPosition.push({
          x: posX,
          y: posY,
        })
      }

      game.fillText(emoji, posX, posY);
    })
  });
  movePlayer();


};
//Botones del juego
let teclaUp = document.querySelector('#up');
let teclaLeft = document.querySelector('#left');
let teclaRight = document.querySelector('#right');
let teclaDown = document.querySelector('#down');
//Condision cuando ganamos pasar de nivel
function levelWin(){
  level++;
  startGame();
}

function gameWin(){
  clearInterval(timeInterval);
  const recordTime = localStorage.getItem('record_time');
  const playerTime = Date.now() - timeStart;
  
  
  if (recordTime){
    if (recordTime > playerTime){
      localStorage.setItem('record_time', playerTime)
      pResult.innerHTML = 'NIVEL SUPERADO';
    } else {
      pResult.innerHTML = 'TIEMPO NO SUPERADO INTENTALO DE NUEVO';
    }
  } else {
    localStorage.setItem('record_time', playerTime)

  }
}

function levelFail(){
  lives--;
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = 0;
  };
  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function showLives(){
  spanLive.innerHTML = emojis['HEART'].repeat(lives);
}
function showTime(){
  spanTime.innerHTML = Date.now() - timeStart;
}
function showRecord(){
  spanRecord.innerHTML = localStorage.getItem('record_time');
}

function movePlayer() {
  const gifColisionX = (playerPosition.x) == (gifPosition.x);
  const gifColisionY = (playerPosition.y) == (gifPosition.y);
  const colisionGif = gifColisionX && gifColisionY;
  if(colisionGif){
    levelWin();
  }

  const enemyColision = enemyPosition.find(enemy => {
    const enemyColisionX = enemy.x == playerPosition.x;
    const enemyColisionY = enemy.y == playerPosition.y;
    return enemyColisionX && enemyColisionY;
  });
  if(enemyColision){
    levelFail();
  }
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

}



//Eventos del teclado
window.addEventListener('keydown', key); 
//Eventos de botones
teclaUp.addEventListener('click', moveUp);
teclaLeft.addEventListener('click', moveLeft);
teclaRight.addEventListener('click', moveRight);
teclaDown.addEventListener('click', moveDown);

//Funciones movimiento

function key(e){
  if (e.key == 'ArrowUp') moveUp();
  else if (e.key == 'ArrowLeft') moveLeft();
  else if (e.key == 'ArrowRight') moveRight();
  else if (e.key == 'ArrowDown') moveDown();
}
function moveUp(){
  if (playerPosition.y > (elementsSize)) playerPosition.y -= (elementsSize);
  startGame()
}
function moveLeft(){
  if (playerPosition.x > (elementsSize)) playerPosition.x -= (elementsSize);
  startGame()
}
function moveRight(){
  if (playerPosition.x < (canvasSize)) playerPosition.x += (elementsSize);
  startGame()
}
function moveDown(){
  if (playerPosition.y < (canvasSize)) playerPosition.y += (elementsSize);
  startGame()
}