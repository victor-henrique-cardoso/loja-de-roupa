import { db } from "../../firebase/firebase.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaPedidos");

async function listarPedidos() {
  const snap = await getDocs(collection(db, "pedidos"));
  lista.innerHTML = "";

  snap.forEach(d => {
    const p = d.data();

    lista.innerHTML += `
      <div class="item">
        Total: R$ ${p.total} <br>
        Status: ${p.status}
        <select onchange="mudar('${d.id}', this.value)">
          <option>Pendente</option>
          <option>Preparando</option>
          <option>Enviado</option>
          <option>Entregue</option>
        </select>
      </div>
    `;
  });
}

window.mudar = async (id, status) => {
  await updateDoc(doc(db, "pedidos", id), { status });
};

listarPedidos();
