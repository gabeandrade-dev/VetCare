/* ==========================================================
   menu.js - comportamento do menu do topo
   - abre e fecha o menu no celular
   - marca automaticamente o link da página atual
   Roda só depois que o topo foi carregado pelo include.js.
   ========================================================== */

document.addEventListener("componentes-carregados", () => {
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
});
