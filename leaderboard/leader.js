import { signOut, auth, onAuthStateChanged, ref, set, onValue, db } from "../Create-AuthenticateUsers/API.js";
const leaderboardContainer = document.querySelector(".bottom-container");
//handle speed condition
const time60s = document.querySelector(".sixty");
const time30s = document.querySelector(".thirty");
const time15s = document.querySelector(".fifteen");
//check
let is60 = false;
let is30 = false;
let is15 = false;

(function bootUp() {
    is60 = true;
    getData(objectToArray)
    time60s.style.color = "#63aaca";
})();

const sign_out = document.querySelector(".signout");
sign_out.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = "../Create-AuthenticateUsers/login.html"
    }).catch((error) => {
        console.log(error)
    });
})

//get data from db and call a function that generates an array of data
function getData(callback) {
    const players = ref(db, 'users/');
    onValue(players, (snapshot) => { //db ref, callback
        const data = snapshot.val();
        callback(data);
    })
}
//sWpm 60
//tWpm 30
//fWpm 15

function objectToArray(data) {
    let result = Object.keys(data).map((key) => data[key]);
    let SortedPlayers, amountOfPlayers;
    const collection60 = [];
    const collection30 = [];
    const collection15 = [];
    for(const player of result) {
        collection60.push({score: player.sixty[0], name: player.username});
        collection30.push({score: player.thirty[0], name: player.username});
        collection15.push({score: player.fifteen[0], name: player.username});
    }
    if (is60) {
        SortedPlayers = sortData(collection60, 60);
    } else if (is30) {
        SortedPlayers = sortData(collection30, 30);
    } else {
        SortedPlayers = sortData(collection15, 15);
    }
    if(SortedPlayers.length < 10) {
        amountOfPlayers = SortedPlayers.length;
    } else {
        amountOfPlayers = 10;
    }
    for(let position = 0; position < amountOfPlayers; position++) {
        let currentPlayer = SortedPlayers[position];
        console.log(SortedPlayers)
        if(is60) {
            renderResults(position + 1, currentPlayer.name, Math.floor(currentPlayer.score.score), getDate()) 
            console.log("render 60")
        } else if (is30) {
            renderResults(position + 1, currentPlayer.name, Math.floor(currentPlayer.score.score), getDate()) 
            console.log("render 30")
        } else {
            renderResults(position + 1, currentPlayer.name, Math.floor(currentPlayer.score.score), getDate()) 
            console.log("render 15")
        }
    }
}

//gets the current date day month year
function getDate() {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = today.getUTCDate();
    const monthName = months[today.getUTCMonth()];
    const year = today.getUTCFullYear();
  
    return (`${day} ${monthName} ${year}`);
}

function renderResults(position, username, wpm, date) {
    appendStandingHTML(position, username, wpm, date);
}

time60s.addEventListener('click', showRaceTime);
time30s.addEventListener('click', showRaceTime);
time15s.addEventListener('click', showRaceTime);

function showRaceTime() {
    this.style.color = "#63aaca";
    const fadedColor = "rgba(255, 255, 255, 0.397)";
    if (this.textContent === "60") {
        time30s.style.color = fadedColor;
        time15s.style.color = fadedColor;
        is60 = true;
        is30 = false;
        is15 = false;
        reRenderScores()
    } else if (this.textContent === "30") {
        time60s.style.color = fadedColor;
        time15s.style.color = fadedColor;
        is60 = false;
        is30 = true;
        is15 = false;
        reRenderScores()
    } else {
        time60s.style.color = fadedColor;
        time30s.style.color = fadedColor;
        is60 = false;
        is30 = false;
        is15 = true;
        reRenderScores()
    }
}


function sortData(data, seconds) {
    let sortedArray;
    switch(seconds) {
        case 60: 
            sortedArray = data.sort((p1, p2) => (p1.score.score < p2.score.score) ? 1 : (p1.score.score > p2.score.score) ? -1 : 0); //sixty
            break;
        case 30:
            sortedArray = data.sort((p1, p2) => (p1.score.score < p2.score.score) ? 1 : (p1.score.score > p2.score.score) ? -1 : 0); // thirty
            break;
        case 15:
            sortedArray = data.sort((p1, p2) => (p1.score.score < p2.score.score) ? 1 : (p1.score.score > p2.score.score) ? -1 : 0); // fifteen
            break;
    }

    return sortedArray;
}

function reRenderScores() {
    leaderboardContainer.textContent = "";
    getData(objectToArray)
}

//create html
function appendStandingHTML(position, username, wpm, date) {
    
    const standingContainer = document.createElement("div");
    if(position % 2 === 0) {
        standingContainer.classList.add("standing-container");
        standingContainer.style.color = "rgb(160, 160, 160)";
    } else {
        standingContainer.classList.add("standing-container");
        standingContainer.style.color = "#3e6c81"; 
    }
    
    const positionSpan = document.createElement("span");
    positionSpan.classList.add("position");
    positionSpan.textContent = position;
    
    const usernameSpan = document.createElement("span");
    usernameSpan.classList.add("username");
    usernameSpan.textContent = username;
    
    const wpmSpan = document.createElement("span");
    wpmSpan.classList.add("wpm");
    wpmSpan.textContent = wpm;
    
    const dateSpan = document.createElement("span");
    dateSpan.classList.add("date");
    dateSpan.textContent = date;
    
    standingContainer.appendChild(positionSpan);
    standingContainer.appendChild(usernameSpan);
    standingContainer.appendChild(wpmSpan);
    standingContainer.appendChild(dateSpan);
    
    leaderboardContainer.appendChild(standingContainer);
}