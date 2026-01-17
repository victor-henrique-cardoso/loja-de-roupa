import { auth, db } from "../firebase/firebase.js";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const btnLogin = document.getElementById("btnLogin");
const btnCadastrar = document.getElementById("btnCadastrar");
const msg = document.getElementById("msg");

// =======================
// LOGIN
// =======================
if (btnLogin) {
  btnLogin.onclick = async (e) => {
    e.preventDefault();

    const email = document.getElementById("emailLogin").value;
    const senha = document.getElementById("senhaLogin").value;

    try {
      const cred = await signInWithEmailAndPassword(auth, email, senha);

      // 🔍 busca o usuário no Firestore
      const userRef = doc(db, "users", cred.user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        msg.innerText = "Usuário sem permissão";
        return;
      }

      const role = userSnap.data().role;

      msg.innerText = "Login feito com sucesso 🚀";

      setTimeout(() => {
        if (role === "admin") {
          window.location.href = "src/auth/admin/painel/dashboard.html";
        } else {
          window.location.href = "home.html";
        }
      }, 800);

    } catch (error) {
      msg.innerText = "Email ou senha inválidos";
    }
  };
}

// =======================
// CADASTRO (cliente)
// =======================
if (btnCadastrar) {
  btnCadastrar.onclick = async (e) => {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, senha);

      await setDoc(doc(db, "users", cred.user.uid), {
        nome,
        email,
        role: "cliente", // 👈 sempre cliente no cadastro
        criadoEm: serverTimestamp()
      });

      msg.innerText = "Conta criada com sucesso 🔥";

      setTimeout(() => {
        window.location.href = "home.html";
      }, 800);

    } catch (error) {
      msg.innerText = error.message;
    }
  };
}

// =======================
// PREVINE SUBMIT PADRÃO
// =======================
document.getElementById("loginForm")?.addEventListener("submit", e => {
  e.preventDefault();
});

document.getElementById("registerForm")?.addEventListener("submit", e => {
  e.preventDefault();
});
