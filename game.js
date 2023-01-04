const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');

window.addEventListener('load', startGame);
window.addEventListener('resize', startGame);

let canvasSize = (window.innerHeight > window.innerWidth) ? window.innerWidth * 0.75: window.innerHeight * 0.75;
function startGame(){
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);

  const elementsSize = canvasSize / 10;
  game.font = elementsSize + 'px Impact';
  game.textAlign = 'end';
  let map = maps[0]
  let mapRow = map.trim().split('\n');
  const mapRowCols = mapRow.map(row => row.trim().split(''));

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
          console.log({playerPosition});
        }
      };

      game.fillText(emoji, posX, posY);
      movePlayer();
    })
  });


};
//Botones del juego
let teclaUp = document.querySelector('#up');
let teclaLeft = document.querySelector('#left');
let teclaRight = document.querySelector('#right');
let teclaDown = document.querySelector('#down');

function movePlayer() {
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);

}

//Eventos del teclado
window.addEventListener('keydown', key); 
//Eventos de botones
teclaUp.addEventListener('click', moveUp);
teclaLeft.addEventListener('click', moveLeft);
teclaRight.addEventListener('click', moveRight);
teclaDown.addEventListener('click', moveDown);

//Funcion limpiar mapa


//Funciones movimiento

function key(e){
  if (e.key == 'ArrowUp') moveUp();
  else if (e.key == 'ArrowLeft') moveLeft();
  else if (e.key == 'ArrowRight') moveRight();
  else if (e.key == 'ArrowDown') moveDown();
}
function moveUp(){
  playerPosition.y -= (canvasSize/10);
  startGame()
}
function moveLeft(){
  playerPosition.x -= (canvasSize/10);
  startGame()
}
function moveRight(){
  playerPosition.x += (canvasSize/10);
  startGame()
}
function moveDown(){
  playerPosition.y += (canvasSize/10);
  startGame()
}

//Crear personaje objeto

const playerPosition = {
  x: undefined ,
  y: undefined ,
}