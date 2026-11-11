/* ==========================================================
   login.js - login SIMULADO, só para a apresentação.
   ========================================================== */

const CHAVE_SESSAO = "vetcare_sessao";

const CONTAS = {
  cliente: { senha: "cliente123", nome: "Cliente", perfil: "cliente", rotulo: "cliente" },
  admin: { senha: "admin123", nome: "Administrador", perfil: "admin", rotulo: "administrador" },
};

// Quem já está logado vai direto para a Home
if (sessionStorage.getItem(CHAVE_SESSAO)) {
  location.replace("index.html");
}

const blocoEscolha = document.getElementById("login-perfis");
const formulario = document.getElementById("form-login");
const texto = document.getElementById("login-texto");
const rotuloEscolhido = document.getElementById("login-escolhido");
const mensagemErro = document.getElementById("login-erro");

let contaEscolhida = null;

function mostrarEscolha() {
  contaEscolhida = null;
  formulario.hidden = true;
  blocoEscolha.hidden = false;
  mensagemErro.hidden = true;
  formulario.senha.value = "";
  texto.textContent = "Escolha como deseja acessar.";
}

function mostrarSenha(chave) {
  contaEscolhida = chave;
  blocoEscolha.hidden = true;
  formulario.hidden = false;
  mensagemErro.hidden = true;
  rotuloEscolhido.textContent = CONTAS[chave].rotulo;
  texto.textContent = "Digite a senha para continuar.";
  formulario.senha.focus();
}

// Clique em um dos dois botões de tipo de acesso
blocoEscolha.addEventListener("click", (evento) => {
  const botao = evento.target.closest("[data-perfil]");
  if (botao) mostrarSenha(botao.dataset.perfil);
});

document.getElementById("login-trocar").addEventListener("click", mostrarEscolha);

formulario.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const conta = CONTAS[contaEscolhida];
  if (!conta || formulario.senha.value !== conta.senha) {
    mensagemErro.hidden = false;
    formulario.senha.value = "";
    formulario.senha.focus();
    return;
  }

  // Guarda só o necessário (nunca a senha)
  sessionStorage.setItem(CHAVE_SESSAO, JSON.stringify({ nome: conta.nome, perfil: conta.perfil }));
  location.href = "index.html";
});