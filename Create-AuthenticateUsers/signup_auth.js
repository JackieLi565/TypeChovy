import { 
  auth,
  db,
  ref,
  set,
  createUserWithEmailAndPassword
} from "./API.js";

//inputs
const signup = document.querySelector(".sign-up");

//added sign up
signup.addEventListener('click', () => {
    const password_signup = document.querySelector(".password").value;
    const email_signup = document.querySelector(".email").value; 
    const confirmPassword = document.querySelector(".confirm-password").value;
    const username = document.querySelector(".username").value;
    if (password_signup === '' || email_signup === '' || username === '') {
      console.log("one or more empty fields");
    }
    if(password_signup !== confirmPassword) {
      console.log("Passwords dont match");
    } else {
      SignUP(email_signup, password_signup, username);
    }

}) 

function SignUP(email, password, username) {
  createUserWithEmailAndPassword(auth, email, password).then((user_info) => {
    const reference = ref(db,'users/' + user_info.user.uid);
    return set(reference, {
      username: username,
      email: email,
      sixty: [{score: 0, date: 'none'}],
      thirty: [{score: 0, date: 'none'}],
      fifteen: [{score: 0, date: 'none'}],
    });
  }).then(() => {
    window.location.href = "../home_page/homePage.html";
  })
  .catch(error => {
    console.log("Failed to add user", error)
  })
}






