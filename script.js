function startGame() {
    localStorage.setItem("gameStarted", true);
    document.getElementById('tutorial').style.display = 'none';
}
function initializeGame() {
    if (localStorage.getItem('gameStarted'), localStorage.getItem('wateredPlant'), localStorage.getItem('plantSize'), localStorage.getItem('score'), localStorage.getItem('theme'), localStorage.getItem('currentPlant')) {
        document.getElementById('tutorial').style.display = 'none';
        document.getElementById('plant').style.display = 'block';
        document.getElementById('plant').style.fontSize = `${localStorage.getItem('plantSize')}px`;
        document.getElementById('score').innerHTML = localStorage.getItem('score');
        document.body.classList.toggle(localStorage.getItem('theme'));
        document.getElementById('plant').innerHTML = localStorage.getItem('currentPlant');
    }
    else {
        document.getElementById('tutorial').style.display = 'flex';
    }
}
function openTutorial() {
    document.getElementById('tutorial').style.display = 'flex';
    document.getElementById('tutorial').ariaHidden = false;
}
function waterPlant() {
    let plant = document.getElementById('plant');
    let plantsize = parseInt(window.getComputedStyle(plant, null).getPropertyValue('font-size'));
    let score = document.getElementById('score');
    plant.style.display = 'block';
    plant.style.fontSize = `${plantsize + 5}px`;
    var btn = document.getElementById('waterplant');
    btn.disabled = true;
    setTimeout(() => {
        btn.disabled = false;
    }, 5000);
    localStorage.setItem('plantSize', plantsize);
    localStorage.setItem('wateredPlant', true);
    // if plant is watered, add 5 points to the score
    score.innerHTML = parseInt(score.innerHTML) + 5;
    localStorage.setItem('score', score.innerHTML);
    // if audio is available, play the sound
    let audio = new Audio('watering_plant.mp3');
    audio.play();
    // if plant hasn't been watered for 1 day, reduce the size of the plant
    localStorage.setItem('lastWatered', new Date());
    // compare the last watered date with current date
    var currentTime = new Date();
    var lastWatered = new Date(localStorage.getItem('lastWatered'));
    // calculate the time difference
    var difference = currentTime - lastWatered;
    // if difference is greater than 1 day, change the size of the plant
    if (difference > 24 * 3600 * 1000) {
        plant.style.fontSize = `${plantsize - 5}px`;
        localStorage.setItem('plantSize', plantsize - 5);
        localStorage.setItem('score', parseInt(score.innerHTML) - 5);
    }
    // if font size is 80px, change the innerHTML of the plant
    if (plantsize === 80) {
        plant.innerHTML = '🪴';
    }
    // if font size is 150px, change the innerHTML of the plant
    if (plantsize === 150) {
        plant.innerHTML = '🌴';
    }
    localStorage.setItem('currentPlant', plant.innerHTML);
}
// every 5 minutes, a flower will appear on the screen. if the user clicks on the flower, 10 points will be added to the score, and the size of the plant will increase by 10px
function flower() {
    let flower = document.createElement('p');
    flower.innerHTML = '🌸';
    flower.style.position = 'absolute';
    flower.style.top = '-20px';
    flower.style.left = `${Math.random() * window.innerWidth}px`;
    flower.style.fontSize = `${Math.random() * 100}px`;
    flower.style.cursor = 'pointer';
    document.body.appendChild(flower);
    flower.addEventListener('click', () => {
        document.body.removeChild(flower);
        score.innerHTML = parseInt(score.innerHTML) + 10;
        localStorage.setItem('score', score.innerHTML);
        let plant = document.getElementById('plant');
        let plantsize = parseInt(window.getComputedStyle(plant, null).getPropertyValue('font-size'));
        plant.style.fontSize = `${plantsize + 10}px`;
        localStorage.setItem('plantSize', plantsize);
    });
}
// call the flower function every 5 minutes
setInterval(flower, 300000);
function resetGame() {
    localStorage.removeItem('gameStarted');
    localStorage.removeItem('wateredPlant');
    localStorage.removeItem('plantSize');
    localStorage.removeItem('score');
    localStorage.removeItem('lastWatered');
    location.reload();
}

// make use of the gamepad API to control the game. if the gamepad is connected, the user can water the plant.
if (!('getGamepads' in navigator)) {
    alert('Your browser does not support gamepads. Try using Google Chrome or Mozilla Firefox.');
}
window.addEventListener("gamepadconnected", function (e) {
    console.log("Gamepad connected, index: " + e.gamepad.index);
});

window.addEventListener("gamepaddisconnected", function (e) {
    console.log("Gamepad disconnected, index: " + e.gamepad.index);
});
function checkGamepad() {
    var gp = navigator.getGamepads()[0];
    if (gp) {
        // if any of the four primary buttons are pressed, water the plant
        if (gp.buttons[0].pressed == true || gp.buttons[1].pressed == true || gp.buttons[2].pressed == true || gp.buttons[3].pressed == true) {
            waterPlant();
        }
    }
}
setInterval(checkGamepad, 100);

function saveGame() {
    const gameData = {
        gameStarted: localStorage.getItem('gameStarted'),
        wateredPlant: localStorage.getItem('wateredPlant'),
        plantSize: localStorage.getItem('plantSize'),
        score: localStorage.getItem('score'),
        lastWatered: localStorage.getItem('lastWatered')
    };

    const jsonData = JSON.stringify(gameData);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'gameData.json';
    a.click();

}

function loadGame() {
    const input = document.createElement('input');
    input.type = "file";
    input.accept = "application/json";
    input.click();

    input.onchange = (event) => {
        const file = event.target.files[0];

        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
            const gameData = JSON.parse(reader.result);
            for (let key in gameData) {
                localStorage.setItem(key, gameData[key]);
            }

            location.reload();
        };
    };
}

function toggleTheme() {
    var body = document.body;
    // if the theme is light, change it to dark. save the theme in local storage
    if (localStorage.getItem("theme") === "light") {
        body.classList.toggle('dark');
        localStorage.setItem("theme", "dark");
    }
    else {
        body.classList.toggle('dark');
        localStorage.setItem("theme", "light");
    }
    document.getElementById('toggle-theme').innerHTML = localStorage.getItem("theme") === "light" ? '☀️' : '🌙';
}

// if the space key is pressed, water the plant, then disable the button for 5 seconds
document.body.addEventListener('keydown', e => {
    if (e.code === "Space") waterPlant()
    // if the space key is pressed, don't allow the user to water the plant for 5 seconds
    var btn = document.getElementById('waterplant');
    if (btn.disabled) return;
})
// if the "t" key is pressed, open the tutorial
document.body.addEventListener('keydown', e => {
    if (e.key === "t") openTutorial()
})
// if the "s" key is pressed, save the game
document.body.addEventListener('keydown', e => {
    if (e.key === "s") saveGame()
})
// if the "l" key is pressed, load the game
document.body.addEventListener('keydown', e => {
    if (e.key === "l") loadGame()
})
// if the "?" key is pressed, open the keyboard shortcuts window
document.body.addEventListener('keydown', e => {
    if (e.key === "\\") openKeyboardShortcuts()
    else closeKeyboardShortcuts()
})
// if the "d" key is pressed, toggle the theme
document.body.addEventListener('keydown', e => {
    if (e.key === "d") toggleTheme()
})

function openKeyboardShortcuts() {
    document.getElementById('keyboardshortcuts').style.display = 'flex';
    document.getElementById('keyboardshortcuts').style.ariaHidden = false;
}
function closeKeyboardShortcuts() {
    document.getElementById('keyboardshortcuts').style.display = 'none';
    document.getElementById('keyboardshortcuts').style.ariaHidden = true;
}

// my game is finally complete! i hope you enjoy playing it! 😊
// now, i'm off to plant a real flower 🌺
/* i love comments, don't you? 😊 */
/* come on, play the game instead of reading the comments 😄 */
/* no more comments, promise 😊 */
/* 🏖️🌊 */
/* 💻🌺 */
/* 🌱 */
let spetterman66 = "👋"