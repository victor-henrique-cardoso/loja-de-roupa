import { auth } from "../../firebase/firebase.js";
import {
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const btnLogout = document.getElementById("btnLogout");

btnLogout.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "/index.html";
});
