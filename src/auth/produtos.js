import { db } from "../firebase/firebase.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const lista = document.getElementById("listaProdutos");

// ===============================
// 📦 CARREGAR PRODUTOS
// ===============================
async function carregarProdutos() {
  const querySnapshot = await getDocs(collection(db, "produtos"));

  lista.innerHTML = ""; 

  querySnapshot.forEach((docSnap) => {
    const produto = docSnap.data();

    const card = document.createElement("div");
    card.className = "card";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <div style="position: relative;">
        <img 
          src="${produto.imagens?.[0] || ''}" 
          alt="${produto.nome}"
        >
        <span class="tag">${produto.categoria}</span>
      </div>

      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco.toFixed(2)}</p>
    `;

    card.onclick = () => abrirModalDetalhes(produto);

    lista.appendChild(card);
  });
}

// ===============================
// 🔍 MODAL DETALHES
// ===============================


// ===============================
// ❌ FECHAR MODAL
// ===============================
document.getElementById("fecharDetalhes").onclick = () => {
  document.getElementById("modalDetalhes").style.display = "none";
};

window.onclick = (event) => {
  const modal = document.getElementById("modalDetalhes");
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

// ===============================
// 🚀 INIT
// ===============================
carregarProdutos();


let indexAtual = 0;

function abrirModalDetalhes(produto) {
  const modal = document.getElementById("modalDetalhes");
  const container = document.getElementById("carrosselImagens");

  container.innerHTML = "";
  indexAtual = 0;

  
  if (produto.imagens && produto.imagens.length > 0) {
    produto.imagens.forEach((url) => {
      const img = document.createElement("img");
      img.src = url;
      container.appendChild(img);
    });
  }
  // ===== TAMANHOS =====
const containerTamanhos = document.getElementById("opcoesTamanho");
containerTamanhos.innerHTML = "";

produto.tamanhos?.forEach((tamanho) => {
  const btn = document.createElement("button");
  btn.innerText = tamanho;

  btn.onclick = () => {
    document
      .querySelectorAll("#opcoesTamanho button")
      .forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
  };

  containerTamanhos.appendChild(btn);
});

// ===== CORES =====
const containerCores = document.getElementById("opcoesCor");
containerCores.innerHTML = "";

produto.cores?.forEach((cor) => {
  const btn = document.createElement("button");
  btn.innerText = cor;

  btn.onclick = () => {
    document
      .querySelectorAll("#opcoesCor button")
      .forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
  };

  containerCores.appendChild(btn);
});

  atualizarCarrossel();

  document.getElementById("modalNome").innerText = produto.nome;
  document.getElementById("modalCategoria").innerText = produto.categoria;
  document.getElementById("modalPreco").innerText =
    `R$ ${produto.preco.toFixed(2)}`;

  document.getElementById("modalDescricao").innerText =
    produto.descricao || "Descrição não informada.";

  document.querySelector(".btn-next").onclick = () => {
    const total = container.children.length;
    if (total === 0) return;
    indexAtual = (indexAtual + 1) % total;
    atualizarCarrossel();
  };

  document.querySelector(".btn-prev").onclick = () => {
    const total = container.children.length;
    if (total === 0) return;
    indexAtual = (indexAtual - 1 + total) % total;
    atualizarCarrossel();
  };

  modal.style.display = "flex";
}

function atualizarCarrossel() {
  const container = document.getElementById("carrosselImagens");
  container.style.transform = `translateX(-${indexAtual * 100}%)`;
}

document.querySelector(".btn-next").onclick = () => {
  const total = document.querySelectorAll("#carrosselImagens img").length;
  indexAtual = (indexAtual + 1) % total;
  atualizarCarrossel();
};

document.querySelector(".btn-prev").onclick = () => {
  const total = document.querySelectorAll("#carrosselImagens img").length;
  indexAtual = (indexAtual - 1 + total) % total;
  atualizarCarrossel();
};
