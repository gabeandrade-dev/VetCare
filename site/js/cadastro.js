/* ==========================================================
   cadastro.js
   - Lê SOMENTE o arquivo dados_clinica.json (sem localStorage)
   - Mostra os cadastros na tela
   - Busca, atualização e exclusão
   ========================================================== */

/* ---------- Elementos ---------- */
const form = document.getElementById("formCadastro");
const msg = document.getElementById("msg");
const msgLista = document.getElementById("msgLista");
const listaCards = document.getElementById("listaCards");
const contador = document.getElementById("contador");
const campoBusca = document.getElementById("busca");
const btnAtualizar = document.getElementById("btnAtualizar");
const inputCpf = document.getElementById("cpfTutor");
const inputTelefone = document.getElementById("contatoTutor");

let cadastrosCache = [];

function carregarCadastros() {
  return cadastrosCache;
}

/* Converte o JSON { "tutores": [...] } para a lista usada na tela */
function converterDados(dados) {
  if (dados && Array.isArray(dados.tutores)) {
    const lista = [];
    dados.tutores.forEach((tutor) => {
      (tutor.pets || []).forEach((pet) => {
        lista.push({
          id: pet.idPet || pet.id || 0,
          tutor: {
            nome: tutor.nome || "",
            cpf: tutor.cpf || "",
            telefone: tutor.telefone || "",
            endereco: tutor.endereco || "",
          },
          pet: {
            nome: pet.nome || "",
            tipo: pet.especie || "",
            idade: pet.idade || 0,
            sexo: pet.sexo || "",
            peso: pet.peso || 0,
            porte: pet.raca || "",
          },
          saude: {
            temAlergia: pet.temAlergia || "nao",
            possuiDoenca: pet.possuiDoenca || "nao",
            foiCastrado: pet.foiCastrado || "nao",
          },
          dataCadastro: pet.dataCadastro || tutor.dataCadastro || "",
        });
      });
    });
    return lista;
  }
  return Array.isArray(dados) ? dados : [];
}

/* Lê o arquivo dados_clinica.json */
async function iniciar() {
  try {
    // cache: "no-store" garante que o navegador leia o arquivo atualizado
    const resposta = await fetch(ARQUIVO_JSON, { cache: "no-store" });
    if (!resposta.ok) throw new Error("HTTP " + resposta.status);
    cadastrosCache = converterDados(await resposta.json());
  } catch (erro) {
    console.error("Não foi possível carregar os dados:", erro);
    cadastrosCache = [];
    mostrarMensagem(
      msgLista,
      "Não foi possível ler o dados_clinica.json. Abra a página por um servidor local (ex.: Live Server).",
      "erro"
    );
  }

  renderizarLista();
}

function gerarId(cadastros) {
  const maior = cadastros.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
  return maior + 1;
}

/* ==========================================================
   MÁSCARAS E VALIDAÇÃO
   ========================================================== */
function somenteNumeros(valor) {
  return String(valor).replace(/\D/g, "");
}

function mascaraCPF(valor) {
  return somenteNumeros(valor)
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mascaraTelefone(valor) {
  const n = somenteNumeros(valor).slice(0, 11);
  if (n.length <= 10) {
    return n.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
  }
  return n.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
}

function cpfValido(cpf) {
  const n = somenteNumeros(cpf);
  if (n.length !== 11 || /^(\d)\1{10}$/.test(n)) return false;

  const calcularDigito = (base) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (base.length + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcularDigito(n.slice(0, 9));
  const d2 = calcularDigito(n.slice(0, 10));
  return d1 === Number(n[9]) && d2 === Number(n[10]);
}

inputCpf.addEventListener("input", () => {
  inputCpf.value = mascaraCPF(inputCpf.value);
});

inputTelefone.addEventListener("input", () => {
  inputTelefone.value = mascaraTelefone(inputTelefone.value);
});

/* ==========================================================
   MENSAGENS
   ========================================================== */
function mostrarMensagem(elemento, texto, tipo = "sucesso") {
  elemento.textContent = texto;
  elemento.className = tipo; // "sucesso" ou "erro"
  clearTimeout(elemento._timer);
  elemento._timer = setTimeout(() => {
    elemento.textContent = "";
    elemento.className = "";
  }, 4000);
}

/* ==========================================================
   LER O FORMULÁRIO -> OBJETO JSON
   ========================================================== */
function lerFormulario() {
  const dados = new FormData(form);

  return {
    tutor: {
      nome: dados.get("nomeTutor").trim(),
      cpf: dados.get("cpfTutor").trim(),
      telefone: dados.get("contatoTutor").trim(),
      endereco: dados.get("enderecoTutor").trim(),
    },
    pet: {
      tipo: dados.get("tipoAnimal").trim(),
      nome: dados.get("nomePet").trim(),
      idade: dados.get("idadePet"),
      sexo: dados.get("sexoPet"),
      peso: dados.get("pesoAnimal"),
      porte: dados.get("tamanhoPet"),
    },
    saude: {
      temAlergia: dados.get("temAlergia"),
      possuiDoenca: dados.get("possuiDoenca"),
      foiCastrado: dados.get("foiCastrado"),
    },
  };
}

/* ==========================================================
   CADASTRAR (apenas na tela, até recarregar a página)
   ========================================================== */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const novo = lerFormulario();

  if (!cpfValido(novo.tutor.cpf)) {
    mostrarMensagem(msg, "CPF inválido. Confira os números digitados.", "erro");
    inputCpf.focus();
    return;
  }

  const cadastros = carregarCadastros();

  const cpfDuplicado = cadastros.some(
    (c) =>
      somenteNumeros(c.tutor.cpf) === somenteNumeros(novo.tutor.cpf) &&
      c.pet.nome.toLowerCase() === novo.pet.nome.toLowerCase()
  );
  if (cpfDuplicado) {
    mostrarMensagem(msg, "Este pet já está cadastrado para esse CPF.", "erro");
    return;
  }

  novo.id = gerarId(cadastros);
  novo.dataCadastro = new Date().toISOString();

  cadastros.push(novo);

  form.reset();
  mostrarMensagem(msg, `Cadastro #${novo.id} realizado com sucesso!`);
  renderizarLista();
});

form.addEventListener("reset", () => {
  msg.textContent = "";
  msg.className = "";
});

/* ==========================================================
   EXIBIR OS CADASTROS NA TELA
   ========================================================== */
function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = texto ?? "";
  return div.innerHTML;
}

function simNao(valor) {
  if (valor === "sim") return "Sim";
  if (valor === "nao") return "Não";
  return "—";
}

function rotuloSexo(valor) {
  if (valor === "macho") return "Macho";
  if (valor === "femea") return "Fêmea";
  return "—";
}

function formatarData(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function criarCard(c) {
  const item = (rotulo, valor) =>
    `<div class="dado"><span class="dado-rotulo">${rotulo}</span><span class="dado-valor">${valor}</span></div>`;

  return `
    <article class="card" data-id="${c.id}">
      <header class="card-topo">
        <h3>🐾 ${escapar(c.pet.nome)} <small>(${escapar(c.pet.tipo)})</small></h3>
        <span class="card-id">#${c.id}</span>
      </header>

      <div class="card-corpo">

        <section class="card-secao">
          <h4>Tutor</h4>
          <div class="dados-grid">
            ${item("Nome", escapar(c.tutor.nome))}
            ${item("CPF", escapar(c.tutor.cpf))}
            ${item("Telefone", escapar(c.tutor.telefone))}
            ${item("Endereço", escapar(c.tutor.endereco) || "—")}
          </div>
        </section>

        <section class="card-secao">
          <h4>Pet</h4>
          <div class="dados-grid">
            ${item("Idade", c.pet.idade ? escapar(c.pet.idade) : "—")}
            ${item("Sexo", rotuloSexo(c.pet.sexo))}
            ${item("Peso", c.pet.peso ? escapar(c.pet.peso) + " kg" : "—")}
            ${item("Porte", escapar(c.pet.porte) || "—")}
          </div>
        </section>

        <section class="card-secao">
          <h4>Saúde</h4>
          <div class="dados-grid">
            ${item("Alergia", simNao(c.saude.temAlergia))}
            ${item("Doença", simNao(c.saude.possuiDoenca))}
            ${item("Castrado", simNao(c.saude.foiCastrado))}
          </div>
        </section>

      </div>

      <footer class="card-rodape">
        <small>Cadastrado em ${formatarData(c.dataCadastro)}</small>
        <button type="button" class="btn btn-limpar" data-acao="excluir" data-id="${c.id}">Excluir</button>
      </footer>
    </article>
  `;
}

function filtrarCadastros(cadastros, termo) {
  const t = termo.trim().toLowerCase();
  if (!t) return cadastros;

  const tNumeros = somenteNumeros(t);

  return cadastros.filter((c) => {
    const cpfNumeros = somenteNumeros(c.tutor.cpf);
    return (
      String(c.id) === t.replace("#", "") ||
      c.tutor.nome.toLowerCase().includes(t) ||
      c.pet.nome.toLowerCase().includes(t) ||
      (tNumeros && cpfNumeros.includes(tNumeros))
    );
  });
}

function renderizarLista() {
  const todos = carregarCadastros();
  const filtrados = filtrarCadastros(todos, campoBusca.value);

  // mais recentes primeiro
  filtrados.sort((a, b) => b.id - a.id);

  contador.textContent =
    todos.length === 0
      ? "Nenhum cadastro realizado"
      : `${filtrados.length} de ${todos.length} cadastro(s)`;

  if (filtrados.length === 0) {
    listaCards.innerHTML = `<p class="vazio">${
      todos.length === 0 ? "Ainda não há cadastros." : "Nenhum resultado para a busca."
    }</p>`;
    return;
  }

  listaCards.innerHTML = filtrados.map(criarCard).join("");
}

/* ==========================================================
   EXCLUIR, BUSCAR E ATUALIZAR
   ========================================================== */
listaCards.addEventListener("click", (e) => {
  const botao = e.target.closest("[data-acao='excluir']");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  if (!confirm(`Deseja excluir o cadastro #${id}?`)) return;

  cadastrosCache = carregarCadastros().filter((c) => c.id !== id);
  renderizarLista();
  mostrarMensagem(msgLista, `Cadastro #${id} excluído.`);
});

campoBusca.addEventListener("input", renderizarLista);

// Relê o dados_clinica.json
btnAtualizar.addEventListener("click", async () => {
  campoBusca.value = "";
  await iniciar();
  mostrarMensagem(msgLista, "Lista atualizada.");
});

/* ---------- Inicialização ---------- */
iniciar();