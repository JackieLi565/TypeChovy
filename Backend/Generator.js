const fs = require('fs');
const randomWords = require('random-words');
const words = randomWords({ exactly: 400 });
const wordsObject = { words };
const jsonString = JSON.stringify(wordsObject);

fs.writeFile('randomwords.json', jsonString, err => {
  if (err) {
    console.error(err);
  } else {
    console.log('File written successfully');
  }
});