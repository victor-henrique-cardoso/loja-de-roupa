import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBl7fBea3zLnkZC8_lDF37b74b1mi2q58",
  authDomain: "closetguirra.firebaseapp.com",
  projectId: "closetguirra",
  storageBucket: "closetguirra.firebasestorage.app",
  messagingSenderId: "1068153970137",
  appId: "1:1068153970137:web:d9757f9520897dc6eb0dc8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
