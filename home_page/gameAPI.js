const RandomWordAPI = "../Backend/randomwords.json";
const API_url = "http://api.quotable.io/random?minLength=200";

function getQuote() {
    return fetch(API_url)
    .then(response => response.json())
    .then(object => object.content)
}

function getWords() {
    return fetch(RandomWordAPI)
    .then(response => response.json())
    .then(object => object)
}

export {getWords, getQuote}