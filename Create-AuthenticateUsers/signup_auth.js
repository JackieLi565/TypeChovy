import { 
  auth,
  db,
  ref,
  set,
  createUserWithEmailAndPassword
} from "./API";

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
      addUsertoDB(username, username, email_signup)
      //SignUP(email_signup, password_signup);
    }

}) 

function SignUP(email, password) {
  createUserWithEmailAndPassword(auth, email, password).then((user_info) => {
    console.log(`${user_info.user} joined`)
    window.location.href = "../home_page/homePage.html";
  }).catch(error => {
    console.log("Failed to add user", error)
  })
}

function addUsertoDB(userId, username, email) {
  
  const reference = ref(db,'users/' + userId);

  set(reference, {
    username: username,
    email: email,
    points: 0
  });
}




