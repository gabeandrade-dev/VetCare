/* ==========================================================
   include.js - carrega pedaços de HTML repetidos (topo e rodapé)

   Como usar numa página:
     <header class="topo" data-include="components/header.html"></header>

   O script busca o arquivo indicado em data-include e coloca o
   conteúdo dentro do elemento. Depois avisa as outras partes do
   site com o evento "componentes-carregados".

   Importante: o fetch() só funciona com servidor local
   (ex.: Live Server do VS Code), não abrindo o arquivo com duplo clique.
   ========================================================== */

async function carregarComponentes() {
  const alvos = document.querySelectorAll("[data-include]");

  await Promise.all(
    Array.from(alvos).map(async (alvo) => {
      const caminho = alvo.dataset.include;
      try {
        const resposta = await fetch(caminho);
        if (!resposta.ok) throw new Error("status " + resposta.status);
        alvo.innerHTML = await resposta.text();
      } catch (erro) {
        console.error("Não foi possível carregar " + caminho + ":", erro);
      }
    })
  );

  document.dispatchEvent(new Event("componentes-carregados"));
}

carregarComponentes();
