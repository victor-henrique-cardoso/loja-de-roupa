import { db } from "./firebase/firebase.js";
import { collection, getDocs } from 
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const querySnapshot = await getDocs(collection(db, "produtos"));

querySnapshot.forEach(doc => {
  console.log(doc.id, doc.data());
});
