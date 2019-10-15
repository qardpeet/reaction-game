const clickSound = new Audio("./assets/media/click.wav");
const loseSound = new Audio("./assets/media/fail.wav");

const state = {
  cells: [],
  currentlyActiveCell: null,
  size: 10,
  speed: 1,
  active: false,
  clicks: []
};

function populatePage() {
  let cellsHTML = "";

  for (let cell of state.cells) {
    const isActive = cell.active ? "active" : "";
    cellsHTML += `<div class="cell ${isActive}" id="${cell.id}"></div>`;
  }

  let reactionGameElement = document.getElementById("reaction-game");

  reactionGameElement.style = `grid-template-columns: repeat(${state.size}, 1fr); grid-template-rows: repeat(${state.size}, 1fr)`;
  reactionGameElement.innerHTML = cellsHTML;
}

function initializeCells() {
  const area = state.size * state.size;
  const randomCell = Math.floor(Math.random() * area);

  for (let i = 0; i < area; i++) {
    state.cells.push({
      active: i === randomCell ? true : false,
      id: i
    });
  }

  state.currentlyActiveCell = randomCell;
}

function next() {
  if (!state.active && state.clicks.length == 0) {
    state.active = true;
    tick();
  }

  state.clicks.push(Date.now());

  clickSound.cloneNode().play();

  const area = state.size * state.size;
  const randomCell = Math.floor(Math.random() * area);

  state.cells[state.currentlyActiveCell].active = false;
  let oldCell = document.getElementById(state.currentlyActiveCell);
  oldCell.classList.remove("active");

  state.cells[randomCell].active = true;
  let newCell = document.getElementById(randomCell);
  newCell.classList.add("active");

  state.currentlyActiveCell = randomCell;
}

function handleCellClick(e) {
  const id = Number(e.target.getAttribute("id"));
  e.target.classList.add("clicked");
  setTimeout(function() {
    e.target.classList.remove("clicked");
  }, 100);

  if (id === state.currentlyActiveCell) {
    next();
  } else {
    lose();
  }
}

function lose() {
  state.active = false;

  loseSound.play();

  let menuElement = document.getElementById("menu");
  let scoreElement = document.getElementById("score");
  let reactionTimeElement = document.getElementById("reaction-time-score");

  scoreElement.innerHTML = `score: ${state.clicks.length}`;
  reactionTimeElement.innerHTML = "score";
  menuElement.classList.add("active");
}

function play() {
  state.cells = [];
  state.clicks = [];

  initializeCells();
  populatePage();

  let cells = document.getElementsByClassName("cell");

  for (let cellElement of cells) {
    cellElement.addEventListener("click", handleCellClick, false);
  }

  let menuElement = document.getElementById("menu");
  menuElement.classList.remove("active");
}

function tick() {
  if (!state.active) return;

  const clickInterval = Date.now() - state.clicks[state.clicks.length - 1];

  if (clickInterval > state.speed * 1000) {
    lose();
    return;
  }

  setTimeout(function() {
    tick();
  }, 50);
}

play();

let playButton = document.getElementById("play-button");
playButton.addEventListener("click", play, false);
