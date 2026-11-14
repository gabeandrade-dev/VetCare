document.addEventListener("DOMContentLoaded", () => {
  const switchToggle = document.getElementById("switch-plano");
  const valorLabels = document.querySelectorAll(".valor");
  const periodoLabels = document.querySelectorAll(".periodo");

  // Toggle de preços
  switchToggle.addEventListener("change", () => {
    const isAnual = switchToggle.checked;

    document.querySelectorAll(".card-plano").forEach(card => {
      const valor = isAnual ? card.dataset.anual : card.dataset.mensal;
      card.querySelector(".valor").textContent = valor;

      // Exibe o total anual (preço mensal x 12)
      const totalAnual = parseFloat(card.dataset.mensal.replace(",", ".")) * 12;
      const annualTotalEl = card.querySelector(".annual-total .valor-anual-total");
      if (annualTotalEl) {
        annualTotalEl.textContent = totalAnual.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL"
        });
      }
    });

    periodoLabels.forEach(label => {
      label.textContent = isAnual ? "/mês (faturamento anual)" : "/mês";
    });

    // Mostra/oculta o total anual
    document.querySelectorAll(".annual-total").forEach(el => {
      el.style.display = isAnual ? "block" : "none";
    });
  });

  // Accordion FAQ
  document.querySelectorAll(".faq-pergunta").forEach(button => {
    button.addEventListener("click", () => {
      const item = button.parentElement;
      item.classList.toggle("ativo");
    });
  });
});