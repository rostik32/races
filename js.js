const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
car.classList.add('car');


start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 3,
};

function startGame() {
    start.classList.add('hide');
    setting.start = true;
    gameArea.appendChild(car);
    if (setting.start) {
        requestAnimationFrame(playGame);
    }
}

function playGame() {
    console.log('Play game!');
    requestAnimationFrame(playGame);
}

function startRun(event) {
    event.preventDefault();
    console.log(event.key);
    keys[event.key] = true;
}

function stopRun(event) {
    event.preventDefault();
    console.log(event.key);
    keys[event.key] = false;
}
