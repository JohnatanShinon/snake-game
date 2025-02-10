// Seleciona o canvas e obtém o contexto 2D para desenhar
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Define o tamanho de cada bloco da cobra e da comida
const box = 20;

// Inicializa a cobra com uma única posição
let snake = [
  { x: 9 * box, y: 10 * box }, // Posição inicial da cabeça
];

// Define a direção inicial da cobra
let direction = 'RIGHT';

// Função para verificar se a posição da comida é válida
function isFoodPositionValid(foodPosition, snakeBody) {
  for (let segment of snakeBody) {
    if (foodPosition.x === segment.x && foodPosition.y === segment.y) {
      return false; // Posição inválida: comida está sobre a cobra
    }
  }
  return true; // Posição válida
}

// Função para gerar uma nova posição para a comida
function generateFood(snakeBody) {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * 19 + 1) * box,
      y: Math.floor(Math.random() * 19 + 1) * box,
    };
  } while (!isFoodPositionValid(newFood, snakeBody)); // Repete até encontrar uma posição válida
  return newFood;
}

// Gera a primeira comida em uma posição aleatória
let food = generateFood(snake);

// Inicializa a pontuação
let score = 0;

// Seleciona o elemento de pontuação no HTML
const scoreElement = document.getElementById('score');

// Seleciona o botão de reiniciar
const restartButton = document.getElementById('restart-button');

// Função para controlar a direção da cobra com base nas teclas ou botões
function changeDirection(newDirection) {
  if (
    (newDirection === 'LEFT' && direction !== 'RIGHT') ||
    (newDirection === 'UP' && direction !== 'DOWN') ||
    (newDirection === 'RIGHT' && direction !== 'LEFT') ||
    (newDirection === 'DOWN' && direction !== 'UP')
  ) {
    direction = newDirection;
  }
}

// Adiciona um listener para capturar as teclas pressionadas
document.addEventListener('keydown', (event) => {
  const key = event.keyCode;
  if (key === 37) changeDirection('LEFT'); // Tecla seta esquerda
  if (key === 38) changeDirection('UP'); // Tecla seta para cima
  if (key === 39) changeDirection('RIGHT'); // Tecla seta direita
  if (key === 40) changeDirection('DOWN'); // Tecla seta para baixo
});

// Adiciona listeners para os botões direcionais
document.getElementById('up').addEventListener('click', () => changeDirection('UP'));
document.getElementById('down').addEventListener('click', () => changeDirection('DOWN'));
document.getElementById('left').addEventListener('click', () => changeDirection('LEFT'));
document.getElementById('right').addEventListener('click', () => changeDirection('RIGHT'));

// Função para verificar colisões da cabeça com o corpo
function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

// Função principal que desenha e atualiza o jogo
function draw() {
  // Limpa o canvas a cada quadro
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha a cobra
  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? '#32CD32' : '#FFFFFF'; // Cor diferente para a cabeça
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
    ctx.strokeStyle = '#2a5298';
    ctx.strokeRect(snake[i].x, snake[i].y, box, box);
  }

  // Desenha a comida
  ctx.fillStyle = '#FF0000';
  ctx.fillRect(food.x, food.y, box, box);

  // Cria a nova cabeça com base na direção
  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'DOWN') head.y += box;

  // Verifica se a cobra comeu a comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    food = generateFood(snake); // Gera uma nova comida em uma posição válida
  } else {
    snake.pop(); // Remove a última parte da cobra se não comeu a comida
  }

  // Adiciona a nova cabeça ao início da cobra
  snake.unshift(head);

  // Verifica colisões com as paredes ou consigo mesma
  if (
    head.x < 0 ||
    head.x >= canvas.width ||
    head.y < 0 ||
    head.y >= canvas.height ||
    collision(head, snake)
  ) {
    clearInterval(game);
    alert('Game Over! Sua pontuação: ' + score);
  }
}

// Inicia o jogo com um intervalo de 100ms para atualizar a tela
let game = setInterval(draw, 100);

// Adiciona um listener para o botão de reiniciar
restartButton.addEventListener('click', () => {
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = 'RIGHT';
  food = generateFood(snake); // Gera uma nova comida em uma posição válida
  score = 0;
  scoreElement.textContent = score;
  clearInterval(game);
  game = setInterval(draw, 100);
});