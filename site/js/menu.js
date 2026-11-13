/* ==========================================================
   menu.js - topo do site (todas as páginas)
   - protege a página: sem login, vai para o login.html
   - páginas com <body data-acesso="admin"> só abrem para o admin
   - abre e fecha o menu no celular e marca a página atual
   - cria a bolinha de perfil com menu (Perfil, Faturamento, Sair)
   Roda só depois que o topo foi carregado pelo include.js.
   ========================================================== */

(function () {
  const CHAVE_SESSAO = "vetcare_sessao";

  function lerSessao() {
    try {
      return JSON.parse(sessionStorage.getItem(CHAVE_SESSAO));
    } catch (erro) {
      return null;
    }
  }

  const sessao = lerSessao();
  const acessoExigido = document.body.dataset.acesso;

  // Proteção da página
  if (!sessao) {
    location.replace("login.html");
    return;
  }
  if (acessoExigido && sessao.perfil !== acessoExigido) {
    location.replace("index.html");
    return;
  }

  document.addEventListener("componentes-carregados", () => {
    iniciarMenu();
    criarPerfil();
  });

  /* ---------- Menu principal ---------- */
  function iniciarMenu() {
    const botao = document.querySelector(".topo__botao");
    const menu = document.querySelector(".topo__menu");
    if (!botao || !menu) return;

    function alternarMenu(abrir) {
      menu.classList.toggle("topo__menu--aberto", abrir);
      botao.setAttribute("aria-expanded", String(abrir));
      botao.setAttribute("aria-label", abrir ? "Fechar menu" : "Abrir menu");
    }

    botao.addEventListener("click", () => {
      alternarMenu(!menu.classList.contains("topo__menu--aberto"));
    });

    // Fecha o menu ao clicar em um link ou apertar Esc
    menu.addEventListener("click", (evento) => {
      if (evento.target.closest("a")) alternarMenu(false);
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") alternarMenu(false);
    });

    // Marca o link da página atual (ex.: sustentabilidade.html)
    const paginaAtual = location.pathname.split("/").pop() || "index.html";
    menu.querySelectorAll("a").forEach((link) => {
      if (link.getAttribute("href") === paginaAtual) {
        link.classList.add("ativo");
        link.setAttribute("aria-current", "page");
      }
    });

    // Esconde links restritos a um perfil (ex.: faturamento = admin,
    // agendamento = cliente). O atributo data-somente diz qual perfil pode ver.
    if (sessao && sessao.perfil) {
      document.querySelectorAll("[data-somente]").forEach((link) => {
        if (link.getAttribute("data-somente") !== sessao.perfil) {
          link.parentElement.remove();
        }
      });
    }
  }

  /* ---------- Bolinha de perfil ---------- */
  const ESTILOS_PERFIL = `
    .topo [hidden] { display: none !important; }
    .topo__perfil { position: relative; margin-left: 1rem; }
    .topo__avatar {
      display: grid; place-items: center;
      width: 42px; height: 42px; padding: 0;
      border: 2px solid var(--topo-verde); border-radius: 50%;
      background: var(--topo-azul); color: var(--topo-branco);
      font: inherit; cursor: pointer; transition: background 0.2s;
    }
    .topo__avatar:hover { background: var(--topo-azul-medio); }
    .topo__avatar svg { display: block; width: 24px; height: 24px; }
    .topo__perfil-menu {
      position: absolute; top: calc(100% + 0.6rem); right: 0; z-index: 110;
      min-width: 12.5rem; padding: 0.5rem;
      background: var(--topo-branco); border: 1px solid var(--topo-borda);
      border-radius: 14px; box-shadow: 0 14px 34px rgba(14, 59, 92, 0.16);
    }
    .topo__perfil-nome {
      display: flex; flex-direction: column;
      margin: 0 0 0.35rem; padding: 0.5rem 0.75rem 0.6rem;
      border-bottom: 1px solid var(--topo-borda);
      font-size: 0.95rem; color: var(--topo-texto);
    }
    .topo__perfil-nome span { font-size: 0.8rem; color: #4d6070; }
    .topo__perfil-menu a, .topo__sair {
      display: block; width: 100%; padding: 0.6rem 0.75rem;
      border: 0; border-radius: 10px; background: none;
      font: inherit; font-weight: 500; text-align: left; text-decoration: none;
      color: var(--topo-texto); cursor: pointer;
      transition: background 0.2s, color 0.2s;
    }
    .topo__perfil-menu a:hover, .topo__sair:hover {
      background: var(--topo-verde-claro); color: var(--topo-azul);
    }
    @media (prefers-reduced-motion: reduce) {
      .topo__avatar, .topo__perfil-menu a, .topo__sair { transition: none; }
    }
    @media (max-width: 860px) {
      .topo__perfil { order: 2; margin-left: auto; margin-right: 0.75rem; }
      .topo__botao { order: 3; }
    }
  `;

  function criarPerfil() {
    const topo = document.querySelector(".topo__container") || document.querySelector(".topo");
    if (!topo) return;

    // Remove qualquer bolinha antiga que tenha vindo do header.html
    document.querySelectorAll(".topo__perfil").forEach((antiga) => antiga.remove());

    // Coloca os estilos da bolinha na página (uma vez só)
    if (!document.getElementById("topo-perfil-estilos")) {
      const estilo = document.createElement("style");
      estilo.id = "topo-perfil-estilos";
      estilo.textContent = ESTILOS_PERFIL;
      document.head.appendChild(estilo);
    }

    const ehAdmin = sessao.perfil === "admin";

    const area = document.createElement("div");
    area.className = "topo__perfil";
    area.innerHTML = `
      <button class="topo__avatar" type="button" aria-expanded="false" aria-haspopup="true" aria-controls="menu-perfil" aria-label="Abrir menu do perfil">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="9" r="4" fill="currentColor"/>
          <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="currentColor"/>
        </svg>
      </button>
      <div class="topo__perfil-menu" id="menu-perfil" hidden>
        <p class="topo__perfil-nome"><strong></strong><span></span></p>
        <a href="perfil.html">Perfil</a>
        ${ehAdmin ? '<a href="faturamento.html">Faturamento</a>' : ""}
        <button class="topo__sair" type="button">Sair</button>
      </div>
    `;

    area.querySelector(".topo__perfil-nome strong").textContent = sessao.nome;
    area.querySelector(".topo__perfil-nome span").textContent = ehAdmin ? "Administrador" : "Cliente";
    topo.appendChild(area);

    const botao = area.querySelector(".topo__avatar");
    const painel = area.querySelector(".topo__perfil-menu");

    function alternarPerfil(abrir) {
      painel.hidden = !abrir;
      botao.setAttribute("aria-expanded", String(abrir));
    }

    botao.addEventListener("click", (evento) => {
      evento.stopPropagation();
      alternarPerfil(painel.hidden);
    });
    document.addEventListener("click", (evento) => {
      if (!area.contains(evento.target)) alternarPerfil(false);
    });
    document.addEventListener("keydown", (evento) => {
      if (evento.key === "Escape") alternarPerfil(false);
    });

    // Sair: apaga a sessão e volta para o login
    area.querySelector(".topo__sair").addEventListener("click", () => {
      sessionStorage.removeItem(CHAVE_SESSAO);
      location.href = "login.html";
    });
  }
})();