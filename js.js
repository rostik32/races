const MAX_ENEMY = 7;
const HEIGHT_ELEM = 100;

const score = document.querySelector('.score');
const start = document.querySelector('.start');
const gameArea = document.querySelector('.gameArea');
const car = document.createElement('div');
const form = document.querySelector('.form');
const startButton = document.querySelector('.form__button');
const gameVolume = document.querySelector('.form__volume');
const username = document.querySelector('.form__username');

const audio = document.createElement('audio');
const crashSound = document.createElement('audio');

audio.src = 'sounds/sound.mp3';
document.body.append(audio);
car.classList.add('car');

crashSound.src = 'sounds/crash.mp3'
document.body.append(crashSound);


startButton.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);
const countSection = document.documentElement.clientHeight / HEIGHT_ELEM;
gameArea.style.height = countSection * HEIGHT_ELEM;

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    speed: 10,
    traffic: 3,
    volume: 0.5,
    username: '',
};


form.addEventListener('input', () => {
    let complexity = +form.querySelector('.form__complexity:checked').value;
    setting.speed = complexity;
    switch (complexity) {
        case 10:
            setting.traffic = 3;
            break;
        case 15:
            setting.traffic = 5;
            break;
        case 25:
            setting.traffic = 5;
            break;
    };
    setting.volume = gameVolume.value / 100;
    setting.username = username.value;
    console.log(setting.username);
});


function sendData() {
    let user = {
        username: `${setting.username}`,
        score: `${setting.score}`
    };

    let json = JSON.stringify(user);
    const request = new XMLHttpRequest();
    request.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    request.open('POST', 'score.php');
    request.send(json);
}

function getQuantityElementElements(heightElement) {
    return (gameArea.offsetHeight / heightElement) + 1;
}

function startGame(evt) {
    evt.preventDefault();
    start.classList.add('hide');
    gameArea.innerHTML = '';
    audio.currentTime = 0;
    audio.volume = setting.volume;
    audio.play();


    for (let i = 0; i < getQuantityElementElements(HEIGHT_ELEM); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * HEIGHT_ELEM) + 'px';
        line.style.height = (HEIGHT_ELEM / 2) + 'px';
        line.y = i * HEIGHT_ELEM;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < setting.traffic; i++) {
        const enemy = document.createElement('div');
        const randomEnemy = randomInteger(1, MAX_ENEMY);

        enemy.classList.add('enemy');
        enemy.y = -HEIGHT_ELEM * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - HEIGHT_ELEM / 2)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `url("image/enemy${randomEnemy}.png") no-repeat center / contain`;
        gameArea.append(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.append(car);
    car.style.left = gameArea.offsetWidth / 2 - car.offsetWidth / 2 + 'px';
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    if (setting.start) {
        requestAnimationFrame(playGame);
    }
}

function playGame() {

    if (setting.start) {
        setting.score += setting.speed;
        score.textContent = 'СЧЁТ: ' + Math.floor(setting.score / 100);

        moveRoad();
        moveEnemy();
        if (keys.ArrowLeft && setting.x > 0) {
            setting.x -= setting.speed / 3;
        }

        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)) {
            setting.x += setting.speed / 3;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)) {
            setting.y += setting.speed / 3;
        }

        if (keys.ArrowUp && setting.y > 0) {
            setting.y -= setting.speed / 3;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }

}

function startRun(event) {


    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
}

function stopRun(event) {

    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
}

function moveRoad() {
    let lines = document.querySelectorAll('.line');

    lines.forEach((line) => {
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if (line.y >= gameArea.offsetHeight) {
            line.y = -100;
        }
    });
}

function randomInteger(min, max) {
    // случайное число от min до (max+1)
    let rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

function moveEnemy() {
    let enemies = document.querySelectorAll('.enemy');

    enemies.forEach((enemy) => {
        let carRect = car.getBoundingClientRect();
        let enemyRect = enemy.getBoundingClientRect();

        if (carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top) {
            audio.pause();
            crashSound.volume = setting.volume;
            crashSound.play();
            setting.start = false;
            setTimeout(() => {
                score.textContent = 'Вы набрали ' + Math.floor(setting.score / 100) + ' очков';
                score.style.fontSize = '20px';
                start.classList.remove('hide');
            }, 1000);
            sendData();
        }

        enemy.y += setting.speed / 2;
        enemy.style.top = enemy.y + 'px';

        if (enemy.y >= gameArea.offsetHeight) {
            const randomEnemy = randomInteger(1, MAX_ENEMY);;
            enemy.style.background = `url("image/enemy${randomEnemy}.png") no-repeat center / contain`;
            enemy.y = -HEIGHT_ELEM * setting.traffic;
            enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - enemy.offsetWidth)) + 'px';
        }
    });
}