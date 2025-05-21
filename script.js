const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');
const startButton = document.querySelector('#startButton');

let score = 0;
let timeLeft = 30;
let gameInterval;
let moleInterval;
let isPlaying = false;

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole() {
    const index = Math.floor(Math.random() * holes.length);
    const hole = holes[index];
    
    if (hole.classList.contains('up')) {
        return randomHole();
    }
    
    return hole;
}

function peep() {
    const time = randomTime(500, 1000);
    const hole = randomHole();
    hole.classList.add('up');
    
    setTimeout(() => {
        hole.classList.remove('up');
        if (isPlaying) peep();
    }, time);
}

function startGame() {
    if (isPlaying) return;
    
    isPlaying = true;
    score = 0;
    timeLeft = 30;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    startButton.textContent = '게임 중...';
    startButton.disabled = true;
    
    peep();
    
    gameInterval = setInterval(() => {
        timeLeft--;
        timeElement.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    holes.forEach(hole => hole.classList.remove('up'));
    startButton.textContent = '다시 시작';
    startButton.disabled = false;
    alert(`게임 종료! 최종 점수: ${score}점`);
}

function bonk(e) {
    if (!isPlaying) return;
    if (!e.isTrusted) return;
    
    const mole = this.parentElement;
    if (!mole.classList.contains('up')) return;
    
    score++;
    scoreElement.textContent = score;
    mole.classList.remove('up');
    
    this.classList.add('bonked');
    setTimeout(() => {
        this.classList.remove('bonked');
    }, 100);
}

moles.forEach(mole => mole.addEventListener('click', bonk));
startButton.addEventListener('click', startGame); 
