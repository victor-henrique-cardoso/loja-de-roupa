// ===============================
// 🔥 IMPORTS FIREBASE
// ===============================
import { db } from "../../firebase/firebase.js";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
    updateDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
let produtoEditandoId = null;

// ===============================
// 🔹 ELEMENTOS DO DOM
// ===============================
const grid = document.getElementById("productsGrid");
const formProduto = document.getElementById("formProduto");

const modal = document.getElementById("modalProduto");
const btnAbrir = document.querySelector(".btn-add-product");
const btnFechar = document.querySelector(".close-modal");
const btnCancelar = document.getElementById("btnCancelar");


// ===============================
// 🎨 CORES (ARRAY)
// ===============================
const cores = [];
const inputCor = document.getElementById("corInput");
const listaCores = document.getElementById("listaCores");
const btnAddCor = document.getElementById("addCor");

btnAddCor.onclick = () => {
  const cor = inputCor.value.trim();
  if (!cor) return;

  cores.push(cor);
  inputCor.value = "";
  renderCores();
};

function renderCores() {
  listaCores.innerHTML = "";

  cores.forEach((cor, index) => {
    listaCores.innerHTML += `
      <span class="tag-cor">
        ${cor}
        <button type="button" onclick="removerCor(${index})">x</button>
      </span>
    `;
  });
}

window.removerCor = (index) => {
  cores.splice(index, 1);
  renderCores();
};


// ===============================
// 📦 MODAL
// ===============================
btnAbrir.onclick = () => {
  modal.style.display = "flex";
};

function fecharModal() {
  document.querySelector(".modal-header h2").innerText = "Novo Produto";

  modal.style.display = "none";
  produtoEditandoId = null;
document.querySelector(".btn-submit").innerText = "Adicionar Produto";

}

btnFechar.onclick = fecharModal;
btnCancelar.onclick = fecharModal;

window.onclick = (e) => {
  if (e.target === modal) fecharModal();
};


// ===============================
// 🛒 SALVAR PRODUTO
// ===============================
formProduto.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const preco = Number(document.getElementById("preco").value);
  const categoria = document.getElementById("categoria").value;
  const descricao = document.getElementById("descricao").value;
const imagens = [];
document.querySelectorAll(".imagem-url").forEach(input => {
  if (input.value.trim() !== "") {
    imagens.push(input.value.trim());
  }
});


  const tamanhos = [];
  document
    .querySelectorAll(".sizes input:checked")
    .forEach(cb => tamanhos.push(cb.value));

  if (tamanhos.length === 0 || cores.length === 0) {
    alert("Preencha tamanhos e cores");
    return;
  }

  try {
    if (produtoEditandoId) {
      // 🔄 EDITAR
      await updateDoc(doc(db, "produtos", produtoEditandoId), {
        nome,
        preco,
        categoria,
        descricao,
       imagens,
        tamanhos,
        cores
      });

      produtoEditandoId = null;
    } else {
      // ➕ NOVO
      await addDoc(collection(db, "produtos"), {
        nome,
        preco,
        categoria,
        descricao,
    imagens,

        tamanhos,
        cores,
        criadoEm: serverTimestamp()
      });
    }

    formProduto.reset();
    cores.length = 0;
    renderCores();
    fecharModal();
    carregarProdutos();

    document.querySelector(".btn-submit").innerText = "Adicionar Produto";

  } catch (error) {
    console.error(error);
    alert("Erro ao salvar produto");
  }
});



// ===============================
// 📋 LISTAR PRODUTOS
// ===============================
async function carregarProdutos() {
  grid.innerHTML = "";

  const snapshot = await getDocs(collection(db, "produtos"));

  snapshot.forEach((docSnap) => {
    const p = docSnap.data();

    grid.innerHTML += `
      <div class="product-card">
        <div class="product-info">
          <img src="${p.imagens?.[0] || ''}" alt="${p.nome}">

          <div class="details">
            <h3>${p.nome}</h3>
            <p>${p.categoria}</p>
            <span class="price">R$ ${p.preco.toFixed(2)}</span>
          </div>
        </div>

        <div class="product-actions">
          <button class="edit" onclick="editarProduto('${docSnap.id}')">
            <i class="fa-solid fa-pen"></i> Editar
          </button>

          <button class="delete" onclick="excluirProduto('${docSnap.id}')">
            <i class="fa-solid fa-trash"></i> Excluir
          </button>
        </div>
      </div>
    `;
  });
}


// ===============================
// 🗑️ EXCLUIR PRODUTO
// ===============================
window.excluirProduto = async (id) => {
  if (!confirm("Tem certeza que deseja excluir este produto?")) return;

  await deleteDoc(doc(db, "produtos", id));
  carregarProdutos();
};


// ===============================
// ✏️ EDITAR (DEPOIS A GENTE FAZ)
// ===============================
window.editarProduto = async (id) => {
  document.querySelector(".modal-header h2").innerText = "Editar Produto";

  produtoEditandoId = id;

  const ref = doc(db, "produtos", id);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    alert("Produto não encontrado");
    return;
  }

  const p = snap.data();

  // preencher campos
  document.getElementById("nome").value = p.nome;
  document.getElementById("preco").value = p.preco;
  document.getElementById("categoria").value = p.categoria;
  document.getElementById("descricao").value = p.descricao;
 document.querySelectorAll(".imagem-url").forEach((input, index) => {
  input.value = p.imagens?.[index] || "";
});

  // tamanhos
  document.querySelectorAll(".sizes input").forEach(cb => {
    cb.checked = p.tamanhos.includes(cb.value);
  });

  // cores
  cores.length = 0;
  p.cores.forEach(cor => cores.push(cor));
  renderCores();

  // trocar texto do botão
  document.querySelector(".btn-submit").innerText = "Salvar Alterações";

  modal.style.display = "flex";
};




// ===============================
// 🚀 INIT
// ===============================
carregarProdutos();

