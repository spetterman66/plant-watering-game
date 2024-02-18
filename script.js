function startGame() {
    localStorage.setItem("gameStarted", true);
    document.getElementById('tutorial').style.display = 'none';
}
function initializeGame() {
    if (localStorage.getItem('gameStarted'), localStorage.getItem('wateredPlant'), localStorage.getItem('plantSize'), localStorage.getItem('score')) {
        document.getElementById('tutorial').style.display = 'none';
        document.getElementById('plant').style.display = 'block';
        document.getElementById('plant').style.fontSize = `${localStorage.getItem('plantSize')}px`;
        document.getElementById('score').innerHTML = localStorage.getItem('score');
    }
    else {
        document.getElementById('tutorial').style.display = 'flex';
    }
}
function openTutorial() {
    document.getElementById('tutorial').style.display = 'flex';
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
    localStorage.setItem('lastWatered' , new Date());
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
}
function resetGame() {
    localStorage.removeItem('gameStarted');
    localStorage.removeItem('wateredPlant');
    localStorage.removeItem('plantSize');
    localStorage.removeItem('score');
    localStorage.removeItem('lastWatered');
    location.reload();
}
