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
let primeiraCarga = true;

/* ==========================================================
   LEITURA DO JSON
   ========================================================== */
function paraNumero(valor) {
  const n = Number(String(valor ?? "0").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/* Pega o primeiro campo que existir, entre vários nomes possíveis */
function pegar(obj, chaves) {
  for (const chave of chaves) {
    if (obj[chave] !== undefined && obj[chave] !== null && obj[chave] !== "") {
      return obj[chave];
    }
  }
  return "";
}

/* Aceita "AAAA-MM-DD" (com ou sem hora) e "DD/MM/AAAA" -> devolve "AAAA-MM-DD" */
function normalizarData(valor) {
  const texto = String(valor ?? "").trim();

  if (/^\d{4}-\d{2}-\d{2}/.test(texto)) return texto.slice(0, 10);

  const br = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})/);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;

  return "";
}

function normalizar(a, nomeAnimal) {
  return {
    animal: nomeAnimal || pegar(a, ["animal", "nomePet", "pet"]) || "—",
    data: normalizarData(pegar(a, ["data", "dataAtendimento", "dataConsulta", "dataHora"])),
    servico: pegar(a, ["servico", "tipoServico", "procedimento", "descricao"]),
    valor: paraNumero(pegar(a, ["valor", "preco", "valorCobrado"])),
    custo: paraNumero(pegar(a, ["custo", "custos"])),
  };
}

/* Junta várias listas possíveis de um objeto em uma só */
function listasDe(obj, chaves) {
  return chaves.flatMap((chave) => (Array.isArray(obj?.[chave]) ? obj[chave] : []));
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
      listasDe(pet, ["atendimentos", "consultas", "historico"]).forEach((a) =>
        lista.push(normalizar(a, pet.nome))
      );
    });
  });

  // Formato 2: lista de atendimentos na raiz, ligada ao pet pelo idPet
  const daRaiz = Array.isArray(dados) ? dados : listasDe(dados, ["atendimentos", "consultas"]);
  daRaiz.forEach((a) => lista.push(normalizar(a, nomesPorId[a.idPet])));

  // Só mantém atendimentos com data válida
  return lista.filter((a) => a.data);
}

/* Na primeira leitura, se o mês atual não tem dados, abre o mês mais recente que tenha */
function escolherMesInicial() {
  if (!atendimentosCache.length) return;

  const temNoMes = atendimentosCache.some((a) => a.data.startsWith(campoMes.value));
  if (temNoMes) return;

  const maisRecente = atendimentosCache.map((a) => a.data).sort().pop();
  campoMes.value = maisRecente.slice(0, 7);
}

async function carregar() {
  try {
    // cache: "no-store" garante que o navegador leia o arquivo atualizado
    const resposta = await fetch(ARQUIVO_JSON, { cache: "no-store" });
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    const dados = await resposta.json();
    atendimentosCache = extrairAtendimentos(dados);
    elVazio.textContent = "Nenhum atendimento neste mês. Escolha outro mês.";

    if (primeiraCarga) {
      primeiraCarga = false;
      escolherMesInicial();
    }
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