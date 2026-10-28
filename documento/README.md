# Projeto - VetCare (clínica veterinária)

[Como o site da clínica funcionaria e como resolveria problemas e quais seriam eles?]

---

- Facilita os agendamentos de consultas, exames e vacinas;
- Possibilita que o cliente conheça nosso trabalho, antes de realizar um agendamento;
- Clínica particular que cobra pelos serviços, mas oferece um “plano de saúde animal” que garante x quantidade de consultas e exames no mês;
- Não possui público alvo ou nicho específico, já que é aberta para todos os donos de pets;

---

- Nossa especialidade é em clínica geral, fazendo atendimentos mais simples;
- Somente atendimento hospitalar (sem banho e tosa);
- Atendemos qualquer tipo de animal;

# Paginação do site (não está completamente definido)

-Menu

-Quem somos

-Serviços

-Plano VetCare

-Perfil

**Obs.:** Para a aba “Serviços”, pensamos em dividir os tipos de serviços em blocos, como no exemplo da foto acima. Algo entre 6 a 8 tipos de serviço. Eu me responsabilizei a desenvolver esta parte do site.

!image.png

# Ferramenta para desenvolvimento e manutenção do código

Trabalharemos utilizando o Visual Studio Code, compartilhando o mesmo código num repositório do GitHub onde eu, Henrique e Gabriel Pessoa, teremos acesso. Me disponibilizei a criar esse repositório. Vou precisar da sua ajuda para saber como estruturar o código base, como criar esse repositório no Git, como dar acesso ao Henrique e ao Gabriel e como vamos fazer a manutenção dele simultaneamente.

# Etapas iniciais

Não sabemos ainda por onde começar. Peço que leia os arquivos em anexo que te enviei aqui. São arquivos relacionados ao projeto. Em [LDP_unitalo] você encontra tudo o que o meu professor de linguagem de programação passou até o momento. Tudo o que eu fizer nesse projeto, precisa ter base no conteúdo dessas aulas do meu professor (em linguagem C). Já no documento que está anexado, você encontra o modelo de documento que o professor disponibilizou para que preenchêssemos o [nosso] documento do projeto. Baseado nisso, por onde você nos aconselharia dar os primeiros passos para o desenvolvimento? 

# Resumo da reunião - 09/10

( Gabriel Pessoa = Gabriel 

Gabriel Andrade (Eu) = Biel

Henrique Feitosa = Henrique

### Itens de Ação

- [ ]  Gabriel criar o repositório no GitHub e enviar o link para o grupo no WhatsApp
- [ ]  Gabriel atualizar o ClickUp com as evidências e decisões da Fase 1
- [ ]  Gabriel enviar o site de referência no WhatsApp para o grupo revisar e validar
- [ ]  Gabriel desenvolver o *home* do site
- [ ]  Biel desenvolver a *página de serviços*
- [ ]  Henrique desenvolver a *página de cadastro* de animais e donos
- [ ]  Cada integrante desenhar um esboço (wireframe) da sua página no papel ou digitalmente e compartilhar com o grupo
- [ ]  Confirmar com Henrique o horário das calls semanais de sexta

### Visão Geral

- Primeira reunião de planejamento do projeto de faculdade: desenvolvimento de um site para clínica veterinária chamado *VetCare*
- Participantes: Gabriel (Biel), Henrique e um terceiro integrante — todos consentiram com a gravação
- Objetivo da reunião: definir identidade visual, escopo, páginas, infraestrutura e divisão de tarefas

### Decisões Tomadas

- *Propósito do site:* facilitar o contato da clínica com o cliente para agendamentos de consultas e exames
- *Especialidade:* clínica geral (hospitalar), sem foco em banho e tosa; diferencial seria atender *animais diversos* (não apenas cães e gatos)
- *Integração com WhatsApp:* descartada por ora, pois a API da Meta é paga
- *ODS da ONU:* o projeto será relacionado ao *ODS 3 (Saúde e Bem-Estar)* para constar na introdução do documento e nos slides de apresentação
- *Infraestrutura:* será tratada de forma *fictícia* para fins do documento, sem necessidade de aprofundar aspectos como custo de equipamentos e cabeamento
- *Layout do site:* estrutura de *página única com scroll*, onde o menu direciona o usuário para seções da mesma página (home, quem somos, serviços etc.) em vez de páginas separadas

### Identidade Visual

- *Nome:* VetCare (conforme já consta no documento)
- *Paleta de cores:* tons de *azul e verde* — azul por transmitir confiança e sofisticação, verde por remeter à natureza; sugestão do chat: azul escuro com verde petróleo
- *Tipografia:* a ser definida na hora do desenvolvimento, com preferência por fontes com pontas arredondadas para transmitir conforto visual

### Páginas e Funcionalidades do Site

- *Home* — tela inicial do site
- *Quem Somos* — sobre a empresa (mencionar que é um trabalho de faculdade)
- *Serviços* — listagem de especialidades (foco em clínica geral); máximo de ~3 a 5 serviços para não complexificar
- *Cadastro* — cadastro de animal e dono; formulário com campos como espécie (ex: cão, gato, ave), raça opcional ou livre, nome do dono e contato
- *Plano de Saúde* — aba com planos mensais de consultas (ex: pague X por mês, tenha Y consultas)
- *Rodapé* — endereço fictício com link para o Google Maps, e-mail de contato criado pelo grupo (ex: ClinicaVetCareGHG)
- *Sustentabilidade / ODS:* criar uma aba simples com texto sobre o ODS 3, para demonstrar ao professor que o tema foi abordado

### Tecnologia e Infraestrutura

- *Linguagens:* C (back-end, conforme orientação do professor Paulo/Rodinei) e HTML/CSS (front-end)
- *Repositório:* GitHub — a ser criado por Gabriel; todos devem ter acesso e cada um sobe seu código individualmente
- *Armazenamento de dados:* banco de dados simples; possibilidade de vincular a uma planilha Google Sheets para histórico
- *Hospedagem:* provavelmente em servidor de máquina virtual, conforme orientação do professor Rodrigo
- *Uso de IA:* permitido pelo professor, desde que o grupo entenda e revise o código gerado, sem simplesmente copiar e colar
- *Abordagem de desenvolvimento:* cada integrante desenvolve sua parte separadamente e depois une tudo; é essencial definir o padrão técnico antes de começar

### Organização e Próximas Reuniões

- *Ferramenta de gestão:* ClickUp, com as 7 fases do projeto; todos os três têm acesso
- *Comunicação:* WhatsApp para atualizações rápidas; quem não puder entrar na call manda o que fez no grupo
- *Calls semanais:* previstas para *sextas-feiras*; horário pode ser ajustado caso necessário, com sábado como alternativa
- *Próxima fase (Fase 2):* validar o site de referência e adaptar para a identidade do VetCare; deve ser curta e possivelmente concluída na semana seguinte
- *Fase 3:* criação das páginas propriamente dita, com cada integrante desenvolvendo sua parte