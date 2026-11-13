/* ==========================================================
   agendamentos.js - lógica da página de agendamentos
   - página restrita a clientes: exige login (o menu.js já
     redireciona para login.html sem sessão) e bloqueia o
     administrador, que é redirecionado para a Home.
   ========================================================== */

(function () {
  const CHAVE_SESSAO = "vetcare_sessao";
  let sessao = null;
  try {
    sessao = JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
  } catch (erro) {
    sessao = null;
  }

  // Sem sessão: o menu.js já redireciona para o login.
  // Administrador: agendamento é de responsabilidade do cliente.
  if (sessao && sessao.perfil === "admin") {
    location.replace("index.html");
    return;
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const servicoParam = urlParams.get("servico");

  const servicoSelecionadoEl = document.getElementById("servicoSelecionado");
  const btnTrocarServico = document.getElementById("btnTrocarServico");
  const formAgendamento = document.getElementById("formAgendamento");
  const msgAgendamento = document.getElementById("msgAgendamento");
  const listaContainer = document.getElementById("agendamentos-lista");
  const totalAgendamentosEl = document.getElementById("totalAgendamentos");

  // Nome padrão ou o que veio na URL
  let servicoAtual = servicoParam ? decodificarServico(servicoParam) : "Consulta Veterinária";
  servicoSelecionadoEl.textContent = servicoAtual;

  // Se o usuário clicar em "trocar", permite escolher outro digitando ou limpa
  btnTrocarServico.addEventListener("click", () => {
    const novoServico = prompt("Digite o nome do serviço desejado:", servicoAtual);
    if (novoServico && novoServico.trim() !== "") {
      servicoAtual = novoServico.trim();
      servicoSelecionadoEl.textContent = servicoAtual;
    }
  });

  // Carrega e exibe os agendamentos salvos no localStorage
  atualizarListaAgendamentos();

  // Manipula o envio do formulário
  formAgendamento.addEventListener("submit", (e) => {
    e.preventDefault();

    const nomeTutor = document.getElementById("nomeTutor").value.trim();
    const nomePet = document.getElementById("nomePet").value.trim();
    const dataAgendamento = document.getElementById("dataAgendamento").value;
    const horaAgendamento = document.getElementById("horaAgendamento").value;
    const observacoes = document.getElementById("observacoes").value.trim();

    if (!nomeTutor || !nomePet || !dataAgendamento || !horaAgendamento) {
      mostrarMensaj("Preencha todos os campos obrigatórios (*).", "erro");
      return;
    }

    const novoAgendamento = {
      id: Date.now(),
      servico: servicoAtual,
      tutor: nomeTutor,
      pet: nomePet,
      data: dataAgendamento,
      hora: horaAgendamento,
      observacoes: observacoes || "Nenhuma observação."
    };

    // Salva no localStorage
    let agendamentos = JSON.parse(localStorage.getItem("vetcare_agendamentos")) || [];
    agendamentos.push(novoAgendamento);
    localStorage.setItem("vetcare_agendamentos", JSON.stringify(agendamentos));

    mostrarMensaj("Agendamento realizado com sucesso!", "sucesso");
    formAgendamento.reset();
    servicoSelecionadoEl.textContent = servicoAtual;

    atualizarListaAgendamentos();
  });

  function decodificarServico(slug) {
    const mapa = {
      "consulta-veterinaria": "Consulta Veterinária",
      "exames-laboratoriais": "Exames Laboratoriais",
      "exames-de-imagem": "Exames de Imagem",
      "vacinacao": "Vacinação",
      "cirurgia": "Cirurgia",
      "pronto-atendimento-24h": "Pronto Atendimento 24h",
      "internamento": "Internamento",
      "consulta-especializada": "Consulta Especializada"
    };
    return mapa[slug] || decodeURIComponent(slug).replace(/-/g, " ");
  }

  function mostrarMensaj(texto, tipo) {
    msgAgendamento.textContent = texto;
    msgAgendamento.className = tipo;
    setTimeout(() => {
      msgAgendamento.className = "";
      msgAgendamento.textContent = "";
    }, 4000);
  }

  function atualizarListaAgendamentos() {
    const agendamentos = JSON.parse(localStorage.getItem("vetcare_agendamentos")) || [];

    if (agendamentos.length === 0) {
      totalAgendamentosEl.textContent = "Nenhum agendamento realizado";
      listaContainer.innerHTML = `<div class="agendamento-vazio">Nenhum agendamento cadastrado até o momento.</div>`;
      return;
    }

    totalAgendamentosEl.textContent = `${agendamentos.length} agendamento(s)`;
    listaContainer.innerHTML = "";

    // Mostra do mais recente para o mais antigo
    agendamentos.reverse().forEach((item) => {
      const dataFormatada = item.data.split("-").reverse().join("/");

      const card = document.createElement("div");
      card.className = "agendamento-card-item";
      card.innerHTML = `
        <div class="agendamento-info">
          <h3>Pet: ${escapeHtml(item.pet)} (Tutor: ${escapeHtml(item.tutor)})</h3>
          <p><strong>Data:</strong> ${dataFormatada} às ${escapeHtml(item.hora)}</p>
          <p><strong>Observações:</strong> ${escapeHtml(item.observacoes)}</p>
        </div>
        <span class="agendamento-badge">${escapeHtml(item.servico)}</span>
      `;
      listaContainer.appendChild(card);
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>'"]/g,
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
