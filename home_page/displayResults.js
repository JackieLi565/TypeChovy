const wpm_display = document.querySelector(".wpm-score");
const char_display = document.querySelector(".char-score");
const accuracy_display = document.querySelector(".acc-score");

function displayResults (correctChar, totalChar, speed) {
    char_display.textContent = `${correctChar} of ${totalChar}`
    wpm_display.textContent = Math.floor(speed);
    accuracy_display.textContent = `${Math.floor((correctChar/totalChar)*100)}%`
}

export {displayResults}