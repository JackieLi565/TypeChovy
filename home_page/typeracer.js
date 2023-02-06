import { signOut, auth, onAuthStateChanged } from "../Create-AuthenticateUsers/API.js";

const API_url = "http://api.quotable.io/random?minLength=200";
const display = document.querySelector(".quote-display");
const input = document.querySelector(".quote-input");
const clock = document.querySelector(".timer");
const reset = document.querySelector("#restart");
const sign_out = document.querySelector(".signout");
const scoreboard = document.querySelector(".scoreboard");
const container = document.querySelector(".container");

let startTime;
let counter = 0;
let started = true;
let timerID;
let quote;
let quoteWords;
let correct = true;
let arrayQuote;
let clockTime;

//check
let is60 = false;
let is30 = false;
let is15 = false;

nextQuote()
input.addEventListener('input', () => {
    if (started) {
        startClock(); //reset timer
        hideSpeedSelection();
        started = false;
    }
    arrayQuote = display.querySelectorAll('span') //get all spans
    const arrayValue = input.value.split('') //array of inputs by char
    
    handleCompareChars(arrayQuote, arrayValue);

    if (correct) {
        hideGameContainer();
        showScore(arrayQuote);
        showSpeedSelection();
    }
    
})

//signout 
sign_out.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../Create-AuthenticateUsers/login.html"
    }).catch((error) => {
        console.log(error)
    });
})

//checks user sign in
auth.onAuthStateChanged(user => {
    console.log(user)
})

reset.addEventListener('click', resetRace);

async function nextQuote() {
    quote = await getQuote();
    display.textContent = ""; //clears and displays new quote
    quoteWords = quote.split(' ');//gets total amount of words
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.textContent = char;//puts char in span
        display.appendChild(charSpan) //puts char & span on display
    })
    input.value = null;
}

function handleCompareChars(arrayQuote, arrayValue) {
    arrayQuote.forEach((char, index) => {
        const charInput = arrayValue[index];
        if(charInput == null) {
            char.classList.remove('correct');
            char.classList.remove('incorrect')
            correct = false
        }
        else if(charInput === char.textContent) {
            char.classList.add('correct');
            char.classList.remove('incorrect')
            correct = true;
        } else {
            char.classList.remove('correct');
            char.classList.add('incorrect');
            correct = false;
        }
    })
}

//show score
function showScore(arrayQuote) {
    clearInterval(timerID)
    const wpm_display = document.querySelector(".wpm-score");
    const char_display = document.querySelector(".char-score");
    const accuracy_display = document.querySelector(".acc-score");
    let correctChar = 0;

    hideGameContainer();
    scoreboard.style.display = "flex";
    const totalChar = quote.length;
    const totalWords = quoteWords.length;

    arrayQuote.forEach(char => {
        if (char.classList.contains('correct')) {
            correctChar++;
        }
    })
    const wpm = (correctChar / 5) / 1;
    const wp30s = (correctChar / 5) / 0.5;
    const wp15s = (correctChar / 5) / 0.15;
    
    if (is60) {
        displayResults(correctChar, totalChar, char_display, wpm_display, accuracy_display, wpm);
    } else if (is30) {
        displayResults(correctChar, totalChar, char_display, wpm_display, accuracy_display, wp30s);
    } else if (is15) {
        displayResults(correctChar, totalChar, char_display, wpm_display, accuracy_display, wp15s);
    }
}
//display the results
function displayResults (correctChar, totalChar, char_display, wpm_display, accuracy_display, speed) {
    char_display.textContent = `${correctChar} of ${totalChar}`
    wpm_display.textContent = Math.floor(speed);
    accuracy_display.textContent = `${Math.floor((correctChar/totalChar)*100)}%`
}

function hideScore() {
    scoreboard.style.display = "none";
}

//hide game container
function hideGameContainer() {
    container.style.display = "none";
}

function showGameContainer() {
    container.style.display = "block";
}

//handle speed condition
const time60s = document.querySelector(".sixty");
const time30s = document.querySelector(".thirty");
const time15s = document.querySelector(".fifteen");

(() => {
    time60s.style.color = "#63aaca";
    clockTime = 60;
    is60 = true;
})()

time60s.addEventListener('click', setRaceSpeed);
time30s.addEventListener('click', setRaceSpeed);
time15s.addEventListener('click', setRaceSpeed);

function setRaceSpeed() {
    this.style.color = "#63aaca";
    const fadedColor = "rgba(255, 255, 255, 0.397)";
    if (this.textContent === "60") {
        clockTime = 60;
        time30s.style.color = fadedColor;
        time15s.style.color = fadedColor;
        is60 = true;
        is30 = false;
        is15 = false;
    } else if (this.textContent === "30") {
        clockTime = 30;
        time60s.style.color = fadedColor;
        time15s.style.color = fadedColor;
        is60 = false;
        is30 = true;
        is15 = false;
    } else {
        clockTime = 15;
        time60s.style.color = fadedColor;
        time30s.style.color = fadedColor;
        is60 = false;
        is30 = false;
        is15 = true;
    }
}

const race_speed = document.querySelector(".race-speed");
function hideSpeedSelection() {
    race_speed.style.visibility = "hidden";
}

function showSpeedSelection() {
    race_speed.style.visibility = "visible";
}

//add score to user database

function getQuote() {
    return fetch(API_url)
    .then(response => response.json())
    .then(object => object.content)
}

function startClock() {
    startTime = new Date();
    clock.style.display = "block"
    clock.textContent = clockTime;
    timerID = setInterval(() => {
        let seconds = clockTime - getCurrentTime();
        console.log(clockTime)
        if (seconds >= 0) {
            clock.textContent = seconds;
        } else {
            showScore(arrayQuote);
        }
    }, 1000)
}

function getCurrentTime() {
    return Math.floor((new Date() - startTime) / 1000) //in seconds
}

function resetRace() {    
    showGameContainer();
    hideScore();
    nextQuote();
    showSpeedSelection();
    started = true;
    clearInterval(timerID)
    clock.style.display = "none"
    counter = 0;
}

