import { 
  auth,
  signInWithEmailAndPassword 
} from "./API.js";

const signin = document.querySelector(".sign-in");
const errorMsg = document.querySelector(".hidden-error")

signin.addEventListener('click', () => {
    const password_signup = document.querySelector(".signin-password").value;
    const email_signup = document.querySelector(".signin-email").value; 
    SignIN(email_signup, password_signup); 
})

  
function SignIN(email, password) {
    signInWithEmailAndPassword(auth, email, password).then((user_info) => {
      console.log(`${user_info.user} Logged in`)
      window.location.href = "../home_page/homePage.html";
    }).catch(error => {
      errorMsg.style.display = "block";
      console.log("Failed to log in user", error)
    })
}