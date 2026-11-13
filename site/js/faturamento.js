/* ==========================================================
   faturamento.js
   - Lê SOMENTE o dados_clinica.json
   - Recalcula cards e tabela a cada leitura
   - Relê o arquivo sozinho para pegar novos registros
   ========================================================== */

const ARQUIVO_JSON = "dados_clinica.json"; // caminho relativo ao faturamento.html
const INTERVALO_ATUALIZACAO = 5000;        // 5 segundos

/* ---------- Elementos ---------- */
const campoMes = document.getElementById("mes");
const elLucro = document.getElementById("lucro");
const elQtd = document.getElementById("qtd");
const elMedio = document.getElementById("medio");
const elLinhas = document.getElementById("linhas");
const elVazio = document.getElementById("vazio");

let atendimentosCache = [];

/* ==========================================================
   LEITURA DO JSON
   ========================================================== */
function paraNumero(valor) {
  const n = Number(String(valor ?? "0").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

function normalizar(a, nomeAnimal) {
  return {
    animal: nomeAnimal || a.animal || a.nomePet || "—",
    data: String(a.data ?? a.dataAtendimento ?? "").slice(0, 10), // AAAA-MM-DD
    servico: a.servico ?? a.tipoServico ?? "",
    valor: paraNumero(a.valor),
    custo: paraNumero(a.custo),
  };
}

/* Converte o JSON inteiro em uma lista simples de atendimentos */
function extrairAtendimentos(dados) {
  const lista = [];
  const nomesPorId = {};

  const tutores = Array.isArray(dados?.tutores) ? dados.tutores : [];

  tutores.forEach((tutor) => {
    (tutor.pets || []).forEach((pet) => {
      const idPet = pet.idPet ?? pet.id;
      nomesPorId[idPet] = pet.nome;

      // Formato 1: atendimentos dentro de cada pet
      (pet.atendimentos || []).forEach((a) => lista.push(normalizar(a, pet.nome)));
    });
  });

  // Formato 2: lista de atendimentos na raiz, ligada ao pet pelo idPet
  const daRaiz = Array.isArray(dados) ? dados : dados?.atendimentos || [];
  daRaiz.forEach((a) => lista.push(normalizar(a, nomesPorId[a.idPet])));

  return lista;
}

async function carregar() {
  try {
    // cache: "no-store" garante que o navegador leia o arquivo atualizado
    const resposta = await fetch(ARQUIVO_JSON, { cache: "no-store" });
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    const dados = await resposta.json();
    atendimentosCache = extrairAtendimentos(dados);
    elVazio.textContent = "Nenhum atendimento neste mês. Escolha outro mês.";
  } catch (erro) {
    console.error("Não foi possível ler o dados_clinica.json:", erro);
    atendimentosCache = [];
    elVazio.textContent =
      "Não foi possível ler o dados_clinica.json. Abra a página por um servidor local (ex.: Live Server).";
  }
  renderizar();
}

/* ==========================================================
   FORMATAÇÃO
   ========================================================== */
const moeda = (n) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const formatarData = (iso) => iso.split("-").reverse().join("/");

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

/* ==========================================================
   TELA
   ========================================================== */
function renderizar() {
  const mes = campoMes.value; // "AAAA-MM"

  const doMes = atendimentosCache
    .filter((a) => a.data.startsWith(mes))
    .sort((a, b) => a.data.localeCompare(b.data));

  const totalCobrado = doMes.reduce((soma, a) => soma + a.valor, 0);
  const totalCustos = doMes.reduce((soma, a) => soma + a.custo, 0);

  elLucro.textContent = moeda(totalCobrado - totalCustos);
  elQtd.textContent = doMes.length;
  elMedio.textContent = moeda(doMes.length ? totalCobrado / doMes.length : 0);

  elLinhas.innerHTML = doMes
    .map(
      (a) => `
      <tr>
        <td>${formatarData(a.data)}</td>
        <td>${escapar(a.animal)}</td>
        <td>${escapar(a.servico)}</td>
        <td>${moeda(a.valor)}</td>
      </tr>`
    )
    .join("");

  elVazio.hidden = doMes.length > 0;
}

/* ==========================================================
   ATUALIZAÇÃO AUTOMÁTICA
   ========================================================== */
campoMes.addEventListener("change", renderizar);

// Relê o arquivo de tempos em tempos
setInterval(carregar, INTERVALO_ATUALIZACAO);

// Relê ao voltar para a aba
document.addEventListener("visibilitychange", () => {
  if (!document.hidden) carregar();
});

/* ---------- Inicialização ---------- */
if (!campoMes.value) campoMes.value = new Date().toISOString().slice(0, 7);
carregar();
/* ==========================================================
   LEITURA DO JSON
   ========================================================== */
const ARQUIVO_JSON = "dados_clinica.json"; // caminho relativo ao cadastro.html
