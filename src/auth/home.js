
import { auth, db } from "../firebase/firebase.js";
import { 
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const userNome = document.getElementById("userNome");

onAuthStateChanged(auth, async (user) => {
  if (user) {
    // usuário logado
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      userNome.innerText = docSnap.data().nome;
    }
  } else {
    // NÃO logado → volta pro login
    window.location.href = "index.html";
  }
});

const btnLogout = document.getElementById("btnLogout");

if (btnLogout) {
  btnLogout.addEventListener("click", async () => {
    try {
      await signOut(auth);
      window.location.href = "index.html"; // volta pro login
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  });
}
