
"use strict";

// DPM INTELIGENTE
// Cadastro demonstrativo de protocolos

const state = {
  analises: [],
  documentos: 0
};

// Navegação entre telas
function navigate(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });

  const destino = document.getElementById(pageId);

  if (!destino) {
    console.error("Página não encontrada:", pageId);
    return;
  }

  destino.classList.add("active");

  document.querySelectorAll(".nav-item").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.page === pageId
    );
  });
}

// Eventos do menu
document.querySelectorAll(".nav-item").forEach(button => {
  button.addEventListener("click", () => {
    navigate(button.dataset.page);
  });
});

// Seleção de área
function selectArea(area) {
  const assunto = document.getElementById("assunto");

  assunto.value = area;

  navigate("analise");
}

// Identificação do ZIP
const zipInput = document.getElementById("zipFile");

zipInput.addEventListener("change", () => {
  const arquivo = zipInput.files[0];
  const info = document.getElementById("fileInfo");

  if (!arquivo) {
    info.textContent = "Nenhum arquivo selecionado.";
    return;
  }

  if (!arquivo.name.toLowerCase().endsWith(".zip")) {
    zipInput.value = "";
    info.textContent = "Formato inválido.";
    alert("Selecione um arquivo ZIP.");
    return;
  }

  const tamanho = (arquivo.size / 1024 / 1024).toFixed(2);

  info.textContent =
    arquivo.name + " | " + tamanho + " MB";
});

// Cadastro demonstrativo
const prepareButton =
  document.getElementById("prepareButton");

prepareButton.addEventListener("click", cadastrarProtocolo);

function cadastrarProtocolo() {

  const numero = document
    .getElementById("numero")
    .value.trim();

  const assunto = document
    .getElementById("assunto")
    .value;

  const observacoes = document
    .getElementById("observacoes")
    .value.trim();

  const arquivo = zipInput.files[0];

  const feedback =
    document.getElementById("feedback");

  feedback.textContent = "";

  if (!numero) {
    feedback.textContent =
      "Informe o número do protocolo.";
    return;
  }

  if (!assunto) {
    feedback.textContent =
      "Selecione o assunto do protocolo.";
    return;
  }

  if (!arquivo) {
    feedback.textContent =
      "Selecione um arquivo ZIP.";
    return;
  }

  const registro = {
    id: Date.now(),
    numero: numero,
    assunto: assunto,
    arquivo: arquivo.name,
    observacoes: observacoes,
    data: new Date().toLocaleString("pt-BR")
  };

  state.analises.push(registro);
  state.documentos++;

  atualizarPainel();

  feedback.textContent =
    "Protocolo cadastrado com sucesso no ambiente demonstrativo. O conteúdo do ZIP ainda não foi analisado.";

  feedback.style.color = "#26845c";

  document.getElementById("numero").value = "";
  document.getElementById("assunto").value = "";
  document.getElementById("observacoes").value = "";

  zipInput.value = "";

  document.getElementById("fileInfo").textContent =
    "Nenhum arquivo selecionado.";
}

// Atualização do painel
function atualizarPainel() {

  document.getElementById("totalAnalises").textContent =
    state.analises.length;

  document.getElementById("totalDocumentos").textContent =
    state.documentos;

  document.getElementById("totalRelatorios").textContent =
    "0";

  const history =
    document.getElementById("historyList");

  history.replaceChildren();

  if (state.analises.length === 0) {
    history.textContent =
      "Nenhuma análise registrada.";
    return;
  }

  state.analises.forEach(item => {

    const elemento = document.createElement("div");
    elemento.className = "history-item";

    const titulo = document.createElement("strong");
    titulo.textContent =
      "Protocolo: " + item.numero;

    const detalhes = document.createElement("p");
    detalhes.textContent =
      item.assunto + " | " +
      item.arquivo + " | " +
      item.data;

    elemento.appendChild(titulo);
    elemento.appendChild(detalhes);

    history.appendChild(elemento);
  });
}

// Inicialização
atualizarPainel();

console.log("DPM Inteligente iniciado.");
