import { auth } from "../firebase/firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Usuário logado:", user.email);
  } else {
    console.log("Ninguém logado");
  }
});
