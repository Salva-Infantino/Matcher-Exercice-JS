import "./styles.css";

const grid = document.getElementById("grid");
const livescounter = document.getElementById("lifecounter");
const winscreen = document.getElementById("winscreen");
const losescreen = document.getElementById("losescreen");
const symbols = ["🐙", "🐝", "🐷", "🐌", "🐸", "🐠", "🐘", "🦄"];
const hiddensymbol = "❔";
const time = document.getElementById("time");
const winTime = document.getElementById("winTime");
const looseTime = document.getElementById("looseTime");

let game = [];
let completedgame = [];
let selection = [];
let waiter;
let lives = 4;
let t;
let s = 0;
let m = 0;

console.log(game);

init();

function init() {
  updateLives();
  createGame();
  resetTime();
  startTime();

  grid.addEventListener("click", handleClick);
  losescreen.addEventListener("click", handleUIclick);
  winscreen.addEventListener("click", handleUIclick);
}

function resetGame() {
  lives = 4;
  game = [];
  completedgame = [];
  selection = [];
  winscreen.classList.remove("active");
  losescreen.classList.remove("active");
  time.classList.remove("hidden");
  updateLives();
  createGame();
  resetTime();
  startTime();
}

function handleUIclick(ev) {
  if (ev.target.tagName === "BUTTON") {
    resetGame();
  }
}

function handleClick(ev) {
  if (
    waiter !== undefined ||
    !ev.target.getAttribute("data-index") ||
    selection[0] === ev.target.getAttribute("data-index")
  ) {
    return;
  }
  selection.push(ev.target.getAttribute("data-index"));
  ev.target.classList.add("selected");
  ev.target.innerHTML = game[ev.target.getAttribute("data-index")];

  if (selection.length >= 2) {
    const found = grid.querySelectorAll(
      `div[data-index="${selection[0]}"], div[data-index="${selection[1]}"]`
    );
    if (compareSelection()) {
      found[0].classList.add("found");
      found[1].classList.add("found");

      completedgame = [...completedgame, ...selection];
      checkGame();
      lives++;
      updateLives();
    } else {
      found[0].classList.add("error");
      found[1].classList.add("error");

      lives--;
      updateLives();

      waiter = setTimeout(() => {
        found[0].classList.remove("error", "selected");
        found[1].classList.remove("error", "selected");
        found[0].innerHTML = hiddensymbol;
        found[1].innerHTML = hiddensymbol;

        clearTimeout(waiter);
        waiter = undefined;

        if (lives <= 0) {
          endGame();
        }
      }, 1000);
    }
    selection = [];
  }
}

function compareSelection() {
  if (game[selection[0]] === game[selection[1]]) {
    console.log("YES !");
    return true;
  }
  console.log("NAY...");
  return false;
}

function checkGame() {
  if (completedgame.length === game.length) {
    winGame();
  }
}
function endGame() {
  console.log("YOU LOOSE !");
  losescreen.classList.add("active");
  stopTime();
  looseTime.innerHTML = time.innerHTML;
  time.classList.add("hidden");
}

function winGame() {
  console.log("YOU WIN !");
  winscreen.classList.add("active");
  stopTime();
  winTime.innerHTML = time.innerHTML;
}

function createGame() {
  [...symbols, ...symbols].forEach(el => {
    if (Math.random() > 0.5) {
      game = [...game, el];
    } else {
      game = [el, ...game];
    }
  });

  let newhtml = "";
  game.forEach((el, eli) => {
    newhtml += `<div data-index="${eli}">${hiddensymbol}</div>`;
  });
  grid.innerHTML = newhtml;

  console.log(game);
}

function updateLives() {
  console.log("lives: " + lives);
  livescounter.innerHTML = "";
  for (let i = 0; i < lives; i++) {
    livescounter.innerHTML += "❤️";
  }
}

function startTime() {
  t = setInterval(update_time, 1000);
}

function update_time() {
  s += 1;
  time.innerHTML = m + ":" + s;
  if (s < 10) {
    time.innerHTML = m + ":0" + s;
  }
  if (s > 59) {
    s = 0;
    m += 1;
    time.innerHTML = m + s;
  }
  if (m < 10) {
    time.innerHTML = "0" + m + ":" + s;
  }
  if (m < 10 && s < 10) {
    time.innerHTML = "0" + m + ":0" + s;
  }
}

function stopTime() {
  clearInterval(t);
}

function resetTime() {
  clearInterval(t);
  s = 0;
}
