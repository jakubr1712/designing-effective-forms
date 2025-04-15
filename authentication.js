  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
  import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";

  const firebaseConfig = {
    
  };

  const app = initializeApp(firebaseConfig);

  const auth = getAuth();
  const provider = new GoogleAuthProvider();


  const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");

const userSignIn = async () => {
    signInWithPopup(auth, provider).then((result) => {
        const user = result.user;
        console.log(user);
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

 
 const userSignOut = async () => {
    signOut(auth).then(() => {
        alert("You have been signed out!")
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    })
 }

 onAuthStateChanged(auth, (user) => {
    if (user) {
        alert("You are authenticated with Google");
        console.log(user);
    const nameParts = user.displayName.split(" ");
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(" ");
        
    document.querySelector("#firstName").value = firstName || "";
    document.querySelector("#lastName").value = lastName || "";
     document.querySelector("#exampleInputEmail1").value = user.email || "";
    }
 })
 
 signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);