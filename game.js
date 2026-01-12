let combo = 1;
let lastTap = 0;
let score = 0;
let time = 10;
let difficulty = 1;
let playing = false;
let timerInterval;

const menu = document.getElementById("menu");
const hud = document.getElementById("hud");
const target = document.getElementById("target");
const gameOver = document.getElementById("gameOver");
const scoreEl = document.getElementById("score");
const timerEl = document.getElementById("timer");
const finalScore = document.getElementById("finalScore");
const bestScoreEl = document.getElementById("bestScore");

const clickSound = new Audio("https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg");

showBestScore();

function startGame() {
  score = 0;
  time = 10;
  difficulty = 1;
  playing = true;

  menu.classList.remove("active");
  gameOver.classList.remove("active");
  hud.classList.remove("hidden");
  target.classList.remove("hidden");

  scoreEl.textContent = score;
  timerEl.textContent = time;

  moveTarget();

  timerInterval = setInterval(gameLoop, 1000);
}

function gameLoop() {
  time--;
  timerEl.textContent = time;

  if (time <= 3) {
  timerEl.style.color = "#ff5252";
  timerEl.style.animation = "pulse 0.5s infinite";
  }

  if (time <= 0) {
    endGame();
  }
}

function tap() {
  if (!playing) return;

  const now = Date.now();
  combo = (now - lastTap < 500) ? Math.min(combo + 1, 5) : 1;
  lastTap = now;

  score += combo;
  scoreEl.textContent = score;

  scoreEl.classList.add("pulse");
  setTimeout(() => scoreEl.classList.remove("pulse"), 200);

  target.classList.add("hit");
  setTimeout(() => target.classList.remove("hit"), 150);

  if (navigator.vibrate) navigator.vibrate(20);

  createParticle("+" + combo);

  moveTarget();
}



target.addEventListener("click", tap);
target.addEventListener("touchstart", tap);

function moveTarget() {
  const size = Math.max(60, 120 - difficulty * 10);
  target.style.width = size + "px";
  target.style.height = size + "px";

  const maxX = window.innerWidth - size;
  const maxY = window.innerHeight - size;

  target.style.left = Math.random() * maxX + "px";
  target.style.top = Math.random() * maxY + "px";
}

function endGame() {
  playing = false;
  clearInterval(timerInterval);

  target.classList.add("hidden");
  hud.classList.add("hidden");
  gameOver.classList.add("active");

  finalScore.textContent = `Pontuação: ${score}`;
  saveBestScore();
}

function restart() {
  menu.classList.add("active");
  gameOver.classList.remove("active");
  showBestScore();
}

function saveBestScore() {
  const best = Math.max(score, localStorage.getItem("bestScore") || 0);
  localStorage.setItem("bestScore", best);
}

function showBestScore() {
  const best = localStorage.getItem("bestScore") || 0;
  bestScoreEl.textContent = `🏆 Recorde: ${best}`;
}

function createParticle(text) {
  const p = document.createElement("div");
  p.className = "particle";
  p.textContent = text;

  const rect = target.getBoundingClientRect();
  p.style.left = rect.left + rect.width / 2 + "px";
  p.style.top = rect.top + "px";

  document.body.appendChild(p);
  setTimeout(() => p.remove(), 600);
}

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
