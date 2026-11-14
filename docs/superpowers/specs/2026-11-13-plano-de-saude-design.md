# Design Spec: Página de Plano de Saúde VetCare

**Data:** 13/11/2026
**Status:** Aprovado

---

## 1. Visão Geral
Criar a nova página `plano-de-saude.html` para a clínica veterinária VetCare, permitindo aos tutores consultar os planos de saúde disponíveis (Básico, Essencial e Plus), visualizar a comparação entre eles, simular cobrança mensal/anual e esclarecer dúvidas com uma seção de FAQ.

---

## 2. Requisitos da Página

### 2.1 Estrutura Semântica (HTML5)
* `header` dinâmico via `<header class="topo" data-include="components/header.html"></header>`
* `footer` dinâmico via `<footer class="rodape" data-include="components/footer.html"></footer>`
* Scripts base: `js/include.js` e `js/menu.js`
* Novo script exclusivo: `js/plano-de-saude.js`
* Novo CSS exclusivo: `css/plano-de-saude.css` (importando `padrao.css`, `topo.css` e `rodape.css`)

### 2.2 Seções
1. **Hero Section:**
   - Título: *"Tranquilidade e proteção para quem sempre cuida de você"*
   - Subtítulo explicativo
   - Seletor/Toggle de cobrança: **Cobrança Mensal** vs. **Cobrança Anual (15% OFF)**

2. **Cards de Planos (3 Colunas):**
   - **Plano Básico:** R$ 59,90/mês (R$ 50,90/mês no anual). Benefícios: 3 consultas clínicas/ano, Vacinas essenciais (V10/V8 e Raiva), Exames simples de rotina, 10% OFF em demais procedimentos. CTA: *"Contratar Básico"*.
   - **Plano Essencial (Destaque "Mais Escolhido"):** R$ 119,90/mês (R$ 101,90/mês no anual). Benefícios: Consultas ilimitadas + 2 especialistas/ano, Vacinas completas, Exames de Imagem (Raio-X/Ultrassom), Limpeza de tártaro (1x a cada 2 anos), Atendimento emergencial comercial. CTA: *"Contratar Essencial"*.
   - **Plano Plus:** R$ 199,90/mês (R$ 169,90/mês no anual). Benefícios: Consultas gerais e especializadas ilimitadas, Exames e vacinas completos, Internação e cirurgias de médio/grande porte, Urgência 24h, Limpeza de tártaro anual, 20% OFF no 2º pet. CTA: *"Contratar Plus"*.

3. **Tabela Comparativa de Cobertura:**
   - Comparativo detalhado dos serviços por plano (Consultas, Vacinas, Exames Simples, Exames de Imagem, Cirurgia/Internação, Emergência 24h, Desconto Pet Adicional).

4. **Diferenciais VetCare (Grid de Vantagens):**
   - Sem carência para vacinas essenciais
   - Rede própria e corpo clínico qualificado
   - Desconto progressivo para múltiplos pets
   - Atendimento humanizado e preventivo

5. **FAQ (Perguntas Frequentes Sanfonadas):**
   - Pergunta 1: *Como funciona a carência dos planos?*
   - Pergunta 2: *Posso incluir mais de um pet no mesmo plano?*
   - Pergunta 3: *Como é feita a cobrança no plano anual?*
   - Pergunta 4: *Qual a forma de contratação dos planos?*

---

## 3. Comportamento Interativo (JavaScript)
- **Chaveador Mensal / Anual:** Atualiza os preços e labels nos 3 cards sem recarregar a página ao alternar o toggle.
- **Accordion do FAQ:** Clique na pergunta altera a classe `ativa` ou atributo `open`/`aria-expanded`, expandindo ou recolhendo a resposta suavemente.

---

## 4. Estilo & Identidade Visual (CSS)
- Cores de `--cor-azul`, `--cor-verde`, `--cor-fundo`, `--cor-branco`, `--cor-texto`, `--cor-borda` declaradas em `padrao.css`.
- Destaque visual sutil para o card do **Plano Essencial** (borda verde/azul destacada, badge *"Mais Escolhido"*, leve sombra elevada).
- Responsividade total para dispositivos móveis (grids responsivos, tabela scrollável no mobile se necessário, cards em 1 coluna em telas pequenas).
