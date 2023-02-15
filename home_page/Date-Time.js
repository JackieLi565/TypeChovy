function getDate() {
    const today = new Date();
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const day = today.getUTCDate();
    const monthName = months[today.getUTCMonth()];
    const year = today.getUTCFullYear();
  
    return (`${day} ${monthName} ${year}`);
}

function getCurrentTime(startTime) {
    return Math.floor((new Date() - startTime) / 1000) //in seconds
}

export {getDate, getCurrentTime}