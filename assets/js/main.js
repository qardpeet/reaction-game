const state = {
  clickTimestamps: [],
  cells: [],
  currentlyActiveCell: null,
  size: 20,
  speed: 5,
  active: true,
  clicks: [Date.now()]
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
  const area = state.size * state.size;
  const randomCell = Math.floor(Math.random() * area);

  state.cells[state.currentlyActiveCell].active = false;
  let oldCell = document.getElementById(state.currentlyActiveCell);
  oldCell.classList.remove("active");

  state.cells[randomCell].active = true;
  let newCell = document.getElementById(randomCell);
  newCell.classList.add("active");

  state.clicks.push(Date.now());
  state.currentlyActiveCell = randomCell;
}

function handleCellClick(e) {
  const id = Number(e.target.getAttribute("id"));

  if (id === state.currentlyActiveCell) {
    next();
  } else {
    console.log("no :(");
  }
}

function tick() {
  const clickInterval = Date.now() - state.clicks[state.clicks.length - 1];

  if (clickInterval > state.speed * 1000) {
    alert("you lost");
    return;
  }

  setTimeout(function() {
    tick();
  }, 50);
}

initializeCells();
populatePage();

let cells = document.getElementsByClassName("cell");

for (let cellElement of cells) {
  cellElement.addEventListener("click", handleCellClick, false);
}

tick();
