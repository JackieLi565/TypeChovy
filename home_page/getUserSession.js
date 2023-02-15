import { auth, onAuthStateChanged, signOut} from "../Create-AuthenticateUsers/API.js";

function getSessionUser(callback) {
    auth.onAuthStateChanged(user => {
        callback(user)
    })
}

function getSessionUser2(callback, attempt, index) {
    auth.onAuthStateChanged(user => {
        callback(user, attempt, index)
    })
}

function logOut() {
    signOut(auth).then(() => {
        window.location.href = "../Create-AuthenticateUsers/login.html"
    }).catch((error) => {
        console.log(error)
    });
}

export {getSessionUser, getSessionUser2, logOut}

