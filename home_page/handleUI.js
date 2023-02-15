const container = document.querySelector(".container");
const race_speed = document.querySelector(".race-speed");
const scoreboard = document.querySelector(".scoreboard");

function hideScore() {
    scoreboard.style.display = "none";
}

//hide game container
function hideGameContainer() {
    container.style.display = "none";
}

//show game container
function showGameContainer() {
    container.style.display = "block";
}

function hideSpeedSelection() {
    race_speed.style.visibility = "hidden";
}

function showSpeedSelection() {
    race_speed.style.visibility = "visible";
}

export {
    hideScore,
    hideGameContainer,
    showGameContainer,
    hideSpeedSelection,
    showSpeedSelection
}