const clickSound = new Audio("./assets/media/click.wav");
const loseSound = new Audio("./assets/media/fail.wav");

const state = {
  clicksHistory: [],
  cells: [],
  clicks: [],
  currentlyActiveCell: null,
  size: 4,
  speed: 0.85,
  active: false
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

  let cells = document.getElementsByClassName("cell");

  for (let cellElement of cells) {
    cellElement.addEventListener("click", handleCellClick, false);
  }
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
  state.clicksHistory.push({
    playedAt: Date.now(),
    clicks: state.clicks
  });

  state.cells = [];
  state.clicks = [];

  loseSound.play();

  let menuElement = document.getElementById("menu");
  let scoreElement = document.getElementById("score");
  let reactionTimeElement = document.getElementById("reaction-time-score");
  let userSpeed = document.getElementById("user-speed");
  let userSize = document.getElementById("user-size");

  userSpeed.value = state.speed;
  userSize.value = state.size;

  let lastRecordedClicks =
    state.clicksHistory[state.clicksHistory.length - 1].clicks;

  scoreElement.innerHTML = `score: ${lastRecordedClicks.length}`;
  reactionTimeElement.innerHTML = `average reaction time: ${calculateReactionTime(
    lastRecordedClicks
  )}ms`;
  menuElement.classList.add("active");
}

function play() {
  let userSpeed = document.getElementById("user-speed").value;
  let userSize = document.getElementById("user-size").value;

  state.speed = userSpeed;
  state.size = userSize;

  initializeCells();
  populatePage();

  let menuElement = document.getElementById("menu");
  menuElement.classList.remove("active");
}

function calculateReactionTime(clicks) {
  if (clicks.length < 2) return 0;

  let count = 0;

  for (let i = clicks.length - 1; i > 0; i--) {
    count += clicks[i] - clicks[i - 1];
  }

  return Math.round(count / (clicks.length - 1));
}

function tick() {
  if (state.cells.length) {
    const clickInterval = Date.now() - state.clicks[state.clicks.length - 1];

    if (clickInterval > state.speed * 1000) lose();
  }

  setTimeout(function() {
    tick();
  }, 50);
}

tick();

let playButton = document.getElementById("play-button");
playButton.addEventListener("click", play, false);
