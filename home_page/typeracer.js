import { signOut, auth } from "../Create-AuthenticateUsers/API.js";

const API_url = "http://api.quotable.io/random?minLength=200";
const display = document.querySelector(".quote-display");
const input = document.querySelector(".quote-input");
const clock = document.querySelector(".timer");
const reset = document.querySelector("#restart");
const sign_out = document.querySelector(".signout")

let startTime;
let counter = 0;
let started = true;
let timerID;

nextQuote()
input.addEventListener('input', () => {
    if (started) {
        startClock(); //reset timer
        started = false;
    }
    let correct = true;
    const arrayQuote = display.querySelectorAll('span') //get all spans
    const arrayValue = input.value.split('') //array of inputs by char
    
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
 
    if (correct) {
        resetRace();
    }
    
})

sign_out.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../Create-AuthenticateUsers/login.html"
    }).catch((error) => {
        console.log(error)
    });
})

reset.addEventListener('click', resetRace);

async function nextQuote() {
    const quote = await getQuote();
    display.textContent = ""; //clears and displays new quote
    quote.split('').forEach(char => {
        const charSpan = document.createElement('span')
        charSpan.textContent = char;//puts char in span
        display.appendChild(charSpan) //puts char & span on display
    })
    input.value = null;
}



function getQuote() {
    return fetch(API_url)
    .then(response => response.json())
    .then(object => object.content)
}

function checkCorrect() {
    //make function that checks if the list is true
    }

function startClock() {
    startTime = new Date();
    clock.style.display = "block"
    clock.textContent = '30';
    timerID = setInterval(() => {
        let seconds = 30 - getCurrentTime();
        if (seconds >= 0) {
            clock.textContent = seconds;
        } else {
            clock.textContent = "NTL"
        }
    }, 1000)
}

function getCurrentTime() {
    return Math.floor((new Date() - startTime) / 1000) //in seconds
}

function resetRace() {
    nextQuote();
    started = true;
    clearInterval(timerID)
    clock.style.display = "none"
    counter = 0;
}

