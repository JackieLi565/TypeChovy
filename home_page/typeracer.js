import {auth, onAuthStateChanged, ref, set, onValue, db } from "../Create-AuthenticateUsers/API.js";
import { getDate, getCurrentTime } from "./Date-Time.js";
import { getQuote, getWords } from "./gameAPI.js";
import { hideScore, 
    hideGameContainer, 
    showGameContainer,
    hideSpeedSelection,
    showSpeedSelection 
} from "./handleUI.js";
import { getSessionUser, getSessionUser2, logOut } from "./getUserSession.js";
import { displayResults } from "./displayResults.js";
//**Constants */
const display = document.querySelector(".quote-display");
const input = document.querySelector(".quote-input");
const clock = document.querySelector(".timer");
const reset = document.querySelector("#restart");
const sign_out = document.querySelector(".signout");
const scoreboard = document.querySelector(".scoreboard");
const time60s = document.querySelector(".sixty");
const time30s = document.querySelector(".thirty");
const time15s = document.querySelector(".fifteen");

//**Global Let */
let started = true;
let timerID;
let quote;
let correct = true;
let arrayQuote;
let clockTime;
let wpm;
let wp30s;
let wp15s;
//check
let is60 = false;
let is30 = false;
let is15 = false;

//**Booting Page */
(() => {
    nextQuote();
    time60s.style.color = "#63aaca";
    clockTime = 60;
    is60 = true;
})();

//**Event Listeners */
reset.addEventListener('click', resetRace);
input.addEventListener('input', gameLogicHandler);
time60s.addEventListener('click', setRaceSpeed);
time30s.addEventListener('click', setRaceSpeed);
time15s.addEventListener('click', setRaceSpeed);
sign_out.addEventListener('click', logOut)

//**Getting Fetching*/
async function nextQuote() {
    quote = await getQuote();
    console.log(quote)
    display.textContent = ""; //clears and displays new quote
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.textContent = char;//puts char in span
        display.appendChild(charSpan) //puts char & span on display
    })
    input.value = null;
}

//**Setting up game modes */
function startClock() {
    const startTime = new Date();
    clock.style.display = "block"
    clock.textContent = clockTime;
    timerID = setInterval(() => {
        let seconds = clockTime - getCurrentTime(startTime);
        if (seconds >= 0) {
            clock.textContent = seconds;
        } else {
            showScore(arrayQuote);
        }
    }, 1000)
}

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

function gameLogicHandler() {
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

function showScore(arrayQuote) {
    clearInterval(timerID)
    let correctChar = 0;

    hideGameContainer();
    scoreboard.style.display = "flex";
    const totalChar = quote.length;

    arrayQuote.forEach(char => {
        if (char.classList.contains('correct')) {
            correctChar++;
        }
    })
    wpm = (correctChar / 5) / 1;
    wp30s = (correctChar / 5) / 0.5;
    wp15s = (correctChar / 5) / 0.15;
    
    if (is60) {
        getSessionUser(getData)
        displayResults(correctChar, totalChar, wpm);
    } else if (is30) {
        getSessionUser(getData)
        displayResults(correctChar, totalChar, wp30s);
    } else if (is15) {
        getSessionUser(getData)
        displayResults(correctChar, totalChar, wp15s);
    }    
}

//reset the race
function resetRace() {    
    showGameContainer();
    hideScore();
    nextQuote();
    showSpeedSelection();
    started = true;
    clearInterval(timerID)
    clock.style.display = "none"
}

function updateUserData(data) {
    let sortedArray;
    let sessionAttempt;
    if(is60) {
        sortedArray = sortPlayerScores(data.sixty);
        sessionAttempt = {date: getDate(), score: Math.floor(wpm)};
    } else if (is30) {
        sortedArray = sortPlayerScores(data.thirty);
        sessionAttempt = {date: getDate(), score: Math.floor(wp30s)};
    } else {
        sortedArray = sortPlayerScores(data.fifteen);
        sessionAttempt = {date: getDate(), score: Math.floor(wp15s)};
    }
    const finalData = replaceObject(sessionAttempt, sortedArray)
    console.log(sortedArray)
    if(finalData >= 0) {
       getSessionUser2(updateUserScores, sessionAttempt, finalData)
    } else {
        console.log("lower than best")
    }
}

function updateUserScores(user, attempt, index) {
    let reference;
    if(is60) {
        reference = ref(db,`users/${user.uid}/sixty/${index}`);
    }
    else if (is30) {
        reference = ref(db,`users/${user.uid}/thirty/${index}`);
    } else {
        reference = ref(db,`users/${user.uid}/fifteen/${index}`);
    }
    set(reference, {
        date: attempt.date,
        score: attempt.score
    })
}

//get userdata
function getData(user) {
    const players = ref(db, 'users/' + user.uid );
    onValue(players, (snapshot) => { //db ref, callback
        const data = snapshot.val();
        updateUserData(data)
    })
}

//sorting
function sortPlayerScores(array) {
    return array.sort((a, b) => b.score - a.score);
}

function replaceObject(newObject, objectArray) {
    for (let i = 0; i < objectArray.length; i++) {
        if (objectArray[i].score < newObject.score) {
            objectArray[i] = newObject;
            return i;
        }
    }
    return -1;
}




 








