# Página de Plano de Saúde Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Criar a nova página de planos de saúde (`plano-de-saude.html`), acompanhada de estilos CSS dedicados (`css/plano-de-saude.css`) e interatividade em JS (`js/plano-de-saude.js`) para a chave mensal/anual e sanfona de FAQ.

**Architecture:** A aplicação é um site estático HTML5 com inclusão modular de componentes (topo/rodapé via `js/include.js`). A nova página consumirá as variáveis globais de `css/padrao.css`, `css/topo.css` e `css/rodape.css`, agregando um CSS específico para os cards de planos, tabela comparativa e FAQ, além de um script leve para alternância de preços e respostas sanfonadas.

**Tech Stack:** HTML5 semântico, CSS3 (CSS Grid, Flexbox, Custom Properties), Vanilla JavaScript (ES6+).

**Spec:** `docs/superpowers/specs/2026-11-13-plano-de-saude-design.md`

## Global Constraints
- Seguir o padrão visual do projeto VetCare utilizando variáveis de `css/padrao.css` (`--cor-azul: #0e3b5c;`, `--cor-verde: #3fa66b;`, `--cor-fundo: #f6faf9;`, etc.).
- Carregar topo e rodapé dinamicamente usando os atributos `data-include="components/header.html"` e `data-include="components/footer.html"`.
- Manter acessibilidade e responsividade completa (layout adaptável para móbile e desktop).
- Garantir ortografia correta em português com acentuação integral.

## Review Focus
1. **Alternância de preços Mensal/Anual:** Garantir que o valor exibido e o rótulo de período mudem corretamente nos 3 cards sem quebrar a formatação visual.
2. **Responsividade da Tabela Comparativa:** Impedir estouro de layout em telas móbile através de rolagem horizontal suave (`overflow-x: auto`) ou grid adaptável.
3. **Interatividade do FAQ Accordion:** Garantir que o clique expanda e recolha uma pergunta por vez de forma acessível e legível.
4. **Alinhamento dos Botões de CTA:** Manter os botões dos cards de plano perfeitamente alinhados na base, mesmo com diferenças na quantidade de itens de benefícios.
5. **Carregamento de Componentes:** Confirmar que `js/include.js` e `js/menu.js` carregam corretamente junto com `js/plano-de-saude.js`.

---

### Task 1: Criar a estrutura HTML semântica da página (`site/plano-de-saude.html`)

**Files:**
- Create: `site/plano-de-saude.html`

**Interfaces:**
- Consumes: `components/header.html`, `components/footer.html`, `css/padrao.css`, `css/topo.css`, `css/rodape.css`
- Produces: Estrutura semântica para a página de Planos de Saúde com IDs/Classes para manipulação no CSS e JS (`#toggle-plano`, `.preco-valor`, `.preco-periodo`, `.faq-item`, etc.).

- [ ] **Step 1: Criar o arquivo `site/plano-de-saude.html`**

Estruturar a página com doctype HTML5, meta tags, importação das folhas de estilo, container principal `<main>`, hero section com chaveador mensal/anual, grid de 3 cards (Básico, Essencial com tag de destaque "Mais Escolhido", e Plus), tabela comparativa de cobertura, grid de diferenciais VetCare, seção de FAQ (Perguntas Frequentes) e inclusão dos scripts `js/include.js`, `js/menu.js` e `js/plano-de-saude.js`.

- [ ] **Step 2: Verificar a marcação dos elementos interativos no HTML**

Confirmar que o toggle de periodicidade possui id `#toggle-plano` (ou checkbox `#switch-plano`), que os cards possuem atributos `data-preco-mensal` e `data-preco-anual`, e que os itens do FAQ possuem a classe `.faq-item` com botões `.faq-pergunta` e divs `.faq-resposta`.

- [ ] **Step 3: Testar abertura estática da página no navegador ou validar sintaxe HTML**

Validar se as tags HTML5 estão fechadas corretamente e sem erros de sintaxe.

- [ ] **Step 4: Commit**

```bash
git add site/plano-de-saude.html
git commit -m "feat: adiciona estrutura HTML semântica para plano-de-saude.html"
```

---

### Task 2: Estilizar a página de Plano de Saúde (`site/css/plano-de-saude.css`)

**Files:**
- Create: `site/css/plano-de-saude.css`
- Consumes: `site/css/padrao.css` (`--cor-azul`, `--cor-verde`, etc.)

**Interfaces:**
- Produces: CSS exclusivo para Hero, Cards de Preços, Toggle Switch, Badge de Destaque, Tabela Comparativa, Diferenciais e Accordion do FAQ.

- [ ] **Step 1: Criar o arquivo `site/css/plano-de-saude.css` com estilos do Hero e Toggle**

Estilizar a section Hero com fundo suave, tipografia destacada e o componente Switch Mensal/Anual (com indicativo visual de "15% OFF" destacado).

- [ ] **Step 2: Estilizar os Cards de Planos e Alinhamento de CTA**

Desenvolver o layout dos 3 cards utilizando CSS Grid / Flexbox. Aplicar destaque especial ao card central (**Essencial**): sombra elevada, borda destacada em `--cor-verde` e selo/badge *"Mais Escolhido"*. Garantir que os botões de contratação fiquem alinhados na base dos cards (`margin-top: auto` ou flexbox `space-between`).

- [ ] **Step 3: Estilizar Tabela Comparativa, Diferenciais e FAQ Accordion**

Aplicar estilos limpos para a tabela de cobertura (linhas zebradas ou bordas suaves, ícones de verificação), cards de diferenciais com ícones e transições suaves de `max-height` e `opacity` para as respostas expandidas do FAQ.

- [ ] **Step 4: Adicionar Media Queries para Responsividade Móvel**

Garantir que em telas < 768px os 3 cards fiquem em 1 coluna, a tabela comparativa permita rolagem horizontal sem quebrar a largura da tela, e o toggle permaneça centralizado e legível.

- [ ] **Step 5: Commit**

```bash
git add site/css/plano-de-saude.css
git commit -m "style: adiciona estilização moderna e responsiva em plano-de-saude.css"
```

---

### Task 3: Criar script interativo (`site/js/plano-de-saude.js`)

**Files:**
- Create: `site/js/plano-de-saude.js`

**Interfaces:**
- Consumes: Elementos HTML (`#switch-plano` ou `#toggle-plano`, `.preco-valor`, `.preco-periodo`, `.faq-pergunta`, `.faq-item`).
- Produces: Event listeners para chaveamento dinâmico de valores Mensal vs Anual e abertura/fechamento das sanfonas do FAQ.

- [ ] **Step 1: Implementar o chaveador de preço Mensal / Anual**

Escrever a função que escuta o evento de alteração (`change` ou `click`) no toggle. Quando selecionado Anual:
- Atualizar o valor de R$ 59,90 -> R$ 50,90 (Básico)
- R$ 119,90 -> R$ 101,90 (Essencial)
- R$ 199,90 -> R$ 169,90 (Plus)
- Alterar o texto do período para `/mês (faturamento anual)` e vice-versa.

- [ ] **Step 2: Implementar a interatividade do Accordion (FAQ)**

Escrever a função que escuta cliques em `.faq-pergunta`, alternando a classe `.ativa` ou `.aberto` no `.faq-item` correspondente. Garantir que ao abrir uma pergunta, as outras possam ser recolhidas ou mantidas independentes.

- [ ] **Step 3: Validar execução sem erros no console**

Verificar no navegador se não ocorrem exceções `null` ou `undefined` de manipuladores de eventos.

- [ ] **Step 4: Commit**

```bash
git add site/js/plano-de-saude.js
git commit -m "feat: adiciona interatividade de precos e FAQ em plano-de-saude.js"
```
