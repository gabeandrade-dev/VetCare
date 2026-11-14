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
    });
    
    periodoLabels.forEach(label => {
      label.textContent = isAnual ? "/mês (faturamento anual)" : "/mês";
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
