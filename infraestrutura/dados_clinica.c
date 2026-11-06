#include <stdio.h>
#include <string.h>

void exportarJson();

/* ---------- Limites do sistema ---------- */
#define MAX_ANIMAIS       10
#define MAX_SERVICOS      10
#define MAX_ATENDIMENTOS  10

/* ---------- Structs: o formato de cada registro ---------- */
typedef struct {
    int  id;
    char nome[50];
    char especie[20];
    char raca[30];
    int  idade;
    char tutor[60];
    char telefone[20];
} Animal;

typedef struct {
    int   id;
    char  nome[50];
    float preco;
} Servico;

typedef struct {
    int  id;
    int  idAnimal;        /* numero do animal atendido */
    int  idServico;       /* numero do servico realizado */
    int  data;            /* AAAAMMDD, ex.: 20260920 */
    char descricao[200];
    char veterinario[50];
} Atendimento;

/* ---------- Vetores globais: as "tabelas" ---------- */
Animal      animais[MAX_ANIMAIS];
Servico     servicos[MAX_SERVICOS];
Atendimento atendimentos[MAX_ATENDIMENTOS];

/* Quantos registros estao em uso em cada vetor */
int totalAnimais = 0;
int totalServicos = 0;
int totalAtendimentos = 0;

int fimEntrada = 0;       /* vira 1 se a entrada do teclado acabar */

/* ============================================================
   ARQUIVOS
   Cada vetor e gravado em um arquivo .dat: primeiro a
   quantidade de registros, depois os registros.
   "wb" = escrever em binario, "rb" = ler em binario.
   Ao abrir o programa, os dados voltam do arquivo.
   ============================================================ */

void salvarAnimais() {
    FILE *arq;
    arq = fopen("animais.dat", "wb");
    if (arq == NULL) {
        printf("Erro ao gravar animais.dat\n");
        return;
    }
    fwrite(&totalAnimais, sizeof(int), 1, arq);
    fwrite(animais, sizeof(Animal), totalAnimais, arq);
    fclose(arq);
}

void carregarAnimais() {
    FILE *arq;
    int lidos;
    arq = fopen("animais.dat", "rb");
    if (arq == NULL) return;                  /* primeira vez: ainda nao existe */
    if (fread(&totalAnimais, sizeof(int), 1, arq) != 1) {
        totalAnimais = 0;
        fclose(arq);
        return;
    }
    if (totalAnimais < 0 || totalAnimais > MAX_ANIMAIS) totalAnimais = MAX_ANIMAIS;
    lidos = fread(animais, sizeof(Animal), totalAnimais, arq);
    totalAnimais = lidos;
    fclose(arq);
}

void salvarServicos() {
    FILE *arq;
    arq = fopen("servicos.dat", "wb");
    if (arq == NULL) {
        printf("Erro ao gravar servicos.dat\n");
        return;
    }
    fwrite(&totalServicos, sizeof(int), 1, arq);
    fwrite(servicos, sizeof(Servico), totalServicos, arq);
    fclose(arq);
}

void carregarServicos() {
    FILE *arq;
    int lidos;
    arq = fopen("servicos.dat", "rb");
    if (arq == NULL) return;
    if (fread(&totalServicos, sizeof(int), 1, arq) != 1) {
        totalServicos = 0;
        fclose(arq);
        return;
    }
    if (totalServicos < 0 || totalServicos > MAX_SERVICOS) totalServicos = MAX_SERVICOS;
    lidos = fread(servicos, sizeof(Servico), totalServicos, arq);
    totalServicos = lidos;
    fclose(arq);
}

void salvarAtendimentos() {
    FILE *arq;
    arq = fopen("atendimentos.dat", "wb");
    if (arq == NULL) {
        printf("Erro ao gravar atendimentos.dat\n");
        return;
    }
    fwrite(&totalAtendimentos, sizeof(int), 1, arq);
    fwrite(atendimentos, sizeof(Atendimento), totalAtendimentos, arq);
    fclose(arq);
}

void carregarAtendimentos() {
    FILE *arq;
    int lidos;
    arq = fopen("atendimentos.dat", "rb");
    if (arq == NULL) return;
    if (fread(&totalAtendimentos, sizeof(int), 1, arq) != 1) {
        totalAtendimentos = 0;
        fclose(arq);
        return;
    }
    if (totalAtendimentos < 0 || totalAtendimentos > MAX_ATENDIMENTOS)
        totalAtendimentos = MAX_ATENDIMENTOS;
    lidos = fread(atendimentos, sizeof(Atendimento), totalAtendimentos, arq);
    totalAtendimentos = lidos;
    fclose(arq);
}

/* ============================================================
   LEITURA DO TECLADO
   ============================================================ */

/* Descarta o que sobrou na linha (principalmente o Enter). */
void limparBuffer() {
    int c;
    c = getchar();
    while (c != '\n' && c != EOF) {
        c = getchar();
    }
}

/* Le um texto com espacos. 'destino' e um PONTEIRO para o vetor
   de char onde o texto sera guardado. */
void lerTexto(char *destino, int tamanho) {
    int n;
    if (fgets(destino, tamanho, stdin) == NULL) {
        destino[0] = '\0';
        fimEntrada = 1;
        return;
    }
    n = strlen(destino);
    if (n > 0 && destino[n - 1] == '\n') {
        destino[n - 1] = '\0';                /* tira o Enter do final */
    } else {
        limparBuffer();                       /* digitou mais do que cabe */
    }
}

/* Le um numero inteiro. Se digitar letras, devolve 0. */
int lerInteiro() {
    int valor, r;
    r = scanf("%d", &valor);
    if (r == EOF) {
        fimEntrada = 1;
        return 0;
    }
    if (r != 1) valor = 0;
    limparBuffer();
    return valor;
}

/* Le um numero com ponto decimal (ex.: 45.50). Invalido = -1. */
float lerReal() {
    float valor;
    int r;
    r = scanf("%f", &valor);
    if (r == EOF) {
        fimEntrada = 1;
        return -1;
    }
    if (r != 1) valor = -1;
    limparBuffer();
    return valor;
}

/* Troca as letras maiusculas por minusculas, andando pelo texto
   com um PONTEIRO. Serve para a pesquisa nao diferenciar "Rex" de "REX". */
void minusculas(char *texto) {
    char *p;
    for (p = texto; *p != '\0'; p++) {
        if (*p >= 'A' && *p <= 'Z') {
            *p = *p + 32;
        }
    }
}

/* ============================================================
   DATAS
   A data e guardada como um unico numero AAAAMMDD.
   Assim, comparar datas e so comparar numeros.
   ============================================================ */

int diasNoMes(int mes, int ano) {
    if (mes == 2) {
        if ((ano % 4 == 0 && ano % 100 != 0) || ano % 400 == 0) {
            return 29;
        }
        return 28;
    }
    if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
        return 30;
    }
    return 31;
}

/* Pergunta dia, mes e ano e guarda o resultado em *data.
   'data' e um PONTEIRO para a variavel do chamador: assim a funcao
   consegue alterar o valor la fora. Devolve 1 se valida, 0 se nao. */
int lerData(int *data) {
    int dia, mes, ano;

    printf("  Dia: ");
    dia = lerInteiro();
    printf("  Mes: ");
    mes = lerInteiro();
    printf("  Ano: ");
    ano = lerInteiro();

    if (ano < 1900 || ano > 2100 || mes < 1 || mes > 12) {
        printf(">> Data invalida.\n");
        return 0;
    }
    if (dia < 1 || dia > diasNoMes(mes, ano)) {
        printf(">> Data invalida.\n");
        return 0;
    }

    *data = ano * 10000 + mes * 100 + dia;
    return 1;
}

void mostrarData(int data) {
    printf("%02d/%02d/%04d", data % 100, (data / 100) % 100, data / 10000);
}

/* Pergunta se quer filtrar por periodo. Sem filtro: de 0 ate 99999999.
   Os dois ponteiros devolvem o periodo escolhido. */
int lerPeriodo(int *inicio, int *fim) {
    int opcao;

    *inicio = 0;
    *fim = 99999999;

    printf("Filtrar por periodo? (1 = sim, 0 = mostrar tudo): ");
    opcao = lerInteiro();

    if (opcao == 1) {
        printf("Data inicial:\n");
        if (lerData(inicio) == 0) return 0;
        printf("Data final:\n");
        if (lerData(fim) == 0) return 0;
        if (*inicio > *fim) {
            printf(">> A data inicial e maior que a final.\n");
            return 0;
        }
    }
    return 1;
}

int dentroDoPeriodo(int data, int inicio, int fim) {
    if (data >= inicio && data <= fim) {
        return 1;
    }
    return 0;
}

/* ============================================================
   BUSCAS
   Percorrem o vetor ate achar o id. Devolvem a POSICAO no
   vetor, ou -1 se nao encontrarem.
   ============================================================ */

int buscarAnimal(int id) {
    int i;
    for (i = 0; i < totalAnimais; i++) {
        if (animais[i].id == id) return i;
    }
    return -1;
}

int buscarServico(int id) {
    int i;
    for (i = 0; i < totalServicos; i++) {
        if (servicos[i].id == id) return i;
    }
    return -1;
}

/* ============================================================
   ANIMAIS
   ============================================================ */

/* Recebe um PONTEIRO para um animal e mostra seus dados.
   Com ponteiro de struct usa-se "->" em vez de ".". */
void mostrarAnimal(Animal *a) {
    printf("%-4d %-20.20s %-10.10s %-16.16s %-5d %-20.20s %-14.14s\n",
           a->id, a->nome, a->especie, a->raca, a->idade, a->tutor, a->telefone);
}

void cabecalhoAnimais() {
    printf("\n%-4s %-20s %-10s %-16s %-5s %-20s %-14s\n",
           "ID", "Nome", "Especie", "Raca", "Idade", "Tutor", "Telefone");
    printf("---------------------------------------------------------------------------------------\n");
}

/* ---------- OPCAO 1: cadastrar animal ---------- */
void cadastrarAnimal() {
    Animal *a;

    if (totalAnimais >= MAX_ANIMAIS) {
        printf(">> Limite de %d animais atingido.\n", MAX_ANIMAIS);
        return;
    }

    a = &animais[totalAnimais];               /* ponteiro para a proxima posicao livre */

    printf("\n--- Cadastrar animal ---\n");
    printf("Nome: ");
    lerTexto(a->nome, sizeof(a->nome));
    if (a->nome[0] == '\0') {
        printf(">> O nome e obrigatorio.\n");
        return;
    }
    printf("Especie (cao, gato...): ");
    lerTexto(a->especie, sizeof(a->especie));
    printf("Raca: ");
    lerTexto(a->raca, sizeof(a->raca));
    printf("Idade (anos): ");
    a->idade = lerInteiro();
    if (a->idade < 0 || a->idade > 60) {
        a->idade = 0;
    }
    printf("Tutor: ");
    lerTexto(a->tutor, sizeof(a->tutor));
    printf("Telefone: ");
    lerTexto(a->telefone, sizeof(a->telefone));

    a->id = totalAnimais + 1;
    totalAnimais++;
    salvarAnimais();
    printf(">> Animal cadastrado com ID %d.\n", a->id);
    salvarAnimais();
    exportarJson();
    printf(">> Animal cadastrado com ID %d.\n", a->id);
}

/* ---------- OPCAO 2: listar animais ---------- */
void listarAnimais() {
    int i;

    if (totalAnimais == 0) {
        printf("\n>> Nenhum animal cadastrado.\n");
        return;
    }
    cabecalhoAnimais();
    for (i = 0; i < totalAnimais; i++) {
        mostrarAnimal(&animais[i]);           /* & = endereco do animal i */
    }
    printf("\nTotal: %d animal(is)\n", totalAnimais);
}

/* ---------- OPCAO 3: pesquisar animal ----------
   strstr(texto, trecho) procura um trecho dentro do texto:
   devolve NULL se nao achar. */
void pesquisarAnimal() {
    char termo[60];
    char nome[60];
    char tutor[60];
    int i, achou;

    printf("\n--- Pesquisar animal ---\n");
    printf("Nome do animal ou do tutor: ");
    lerTexto(termo, sizeof(termo));
    if (termo[0] == '\0') {
        printf(">> Digite algo para pesquisar.\n");
        return;
    }
    minusculas(termo);

    achou = 0;
    for (i = 0; i < totalAnimais; i++) {
        strcpy(nome, animais[i].nome);
        strcpy(tutor, animais[i].tutor);
        minusculas(nome);
        minusculas(tutor);

        if (strstr(nome, termo) != NULL || strstr(tutor, termo) != NULL) {
            if (achou == 0) {
                cabecalhoAnimais();
            }
            mostrarAnimal(&animais[i]);
            achou++;
        }
    }

    if (achou == 0) {
        printf(">> Nenhum animal encontrado.\n");
    } else {
        printf("\n%d resultado(s)\n", achou);
    }
}

/* ============================================================
   SERVICOS
   ============================================================ */

void listarServicos() {
    int i;

    if (totalServicos == 0) {
        printf("\n>> Nenhum servico registrado.\n");
        return;
    }
    printf("\n%-4s %-30s %12s\n", "ID", "Servico", "Preco");
    printf("--------------------------------------------------\n");
    for (i = 0; i < totalServicos; i++) {
        printf("%-4d %-30.30s R$ %9.2f\n",
               servicos[i].id, servicos[i].nome, servicos[i].preco);
    }
}

/* ---------- OPCAO 5: registrar servico ---------- */
void registrarServico() {
    Servico *s;

    if (totalServicos >= MAX_SERVICOS) {
        printf(">> Limite de %d servicos atingido.\n", MAX_SERVICOS);
        return;
        salvarServicos();
        exportarJson();
    }

    s = &servicos[totalServicos];

    printf("\n--- Registrar servico ---\n");
    printf("Nome do servico: ");
    lerTexto(s->nome, sizeof(s->nome));
    if (s->nome[0] == '\0') {
        printf(">> O nome e obrigatorio.\n");
        return;
    }
    printf("Preco (use ponto, ex.: 45.50): ");
    s->preco = lerReal();
    if (s->preco < 0) {
        printf(">> Preco invalido.\n");
        return;
    }

    s->id = totalServicos + 1;
    totalServicos++;
    salvarServicos();
    printf(">> Servico registrado com ID %d.\n", s->id);
}

/* ============================================================
   ATENDIMENTOS
   ============================================================ */

/* ---------- OPCAO 4: registrar atendimento ----------
   So aceita se o animal e o servico existirem. */
void registrarAtendimento() {
    Atendimento *at;
    int idAnimal, idServico, posAnimal, posServico;

    if (totalAtendimentos >= MAX_ATENDIMENTOS) {
        printf(">> Limite de %d atendimentos atingido.\n", MAX_ATENDIMENTOS);
        return;
    }
    if (totalAnimais == 0 || totalServicos == 0) {
        printf(">> Cadastre pelo menos um animal e um servico antes.\n");
        return;
    }

    printf("\n--- Registrar atendimento ---\n");
    listarAnimais();
    listarServicos();

    printf("\nID do animal: ");
    idAnimal = lerInteiro();
    posAnimal = buscarAnimal(idAnimal);
    if (posAnimal < 0) {
        printf(">> Animal nao encontrado.\n");
        return;
        salvarAtendimentos();
        exportarJson();
    }

    printf("ID do servico: ");
    idServico = lerInteiro();
    posServico = buscarServico(idServico);
    if (posServico < 0) {
        printf(">> Servico nao encontrado.\n");
        return;
    }

    at = &atendimentos[totalAtendimentos];

    printf("Data do atendimento:\n");
    if (lerData(&at->data) == 0) {            /* passa o ENDERECO do campo data */
        return;
    }
    printf("Descricao: ");
    lerTexto(at->descricao, sizeof(at->descricao));
    printf("Veterinario: ");
    lerTexto(at->veterinario, sizeof(at->veterinario));

    at->id = totalAtendimentos + 1;
    at->idAnimal = idAnimal;
    at->idServico = idServico;
    totalAtendimentos++;
    salvarAtendimentos();

    printf(">> Atendimento %d registrado: %s - %s (R$ %.2f)\n",
           at->id, animais[posAnimal].nome,
           servicos[posServico].nome, servicos[posServico].preco);
}

/* ---------- OPCAO 6: consultar historico ----------
   O atendimento guarda so os numeros do animal e do servico.
   Para mostrar os NOMES, buscamos nos outros vetores. */
void consultarHistorico() {
    int id, posAnimal, posServico, i, achou;
    float total;
    char *nomeServico;
    float preco;
    Atendimento *at;

    printf("\n--- Historico do animal ---\n");
    if (totalAnimais == 0) {
        printf(">> Nenhum animal cadastrado.\n");
        return;
    }
    listarAnimais();

    printf("\nID do animal: ");
    id = lerInteiro();
    posAnimal = buscarAnimal(id);
    if (posAnimal < 0) {
        printf(">> Animal nao encontrado.\n");
        return;
    }

    printf("\nHistorico de %s (tutor: %s)\n", animais[posAnimal].nome, animais[posAnimal].tutor);
    printf("%-12s %-20s %-14s %-22s %s\n", "Data", "Servico", "Veterinario", "Descricao", "Valor");
    printf("--------------------------------------------------------------------------------\n");

    achou = 0;
    total = 0;
    for (i = 0; i < totalAtendimentos; i++) {
        at = &atendimentos[i];
        if (at->idAnimal != id) continue;     /* pula os de outros animais */

        posServico = buscarServico(at->idServico);
        if (posServico >= 0) {
            nomeServico = servicos[posServico].nome;   /* ponteiro para o texto */
            preco = servicos[posServico].preco;
        } else {
            nomeServico = "(removido)";
            preco = 0;
        }

        mostrarData(at->data);
        printf("   %-20.20s %-14.14s %-22.22s R$ %.2f\n",
               nomeServico, at->veterinario, at->descricao, preco);
        total = total + preco;
        achou++;
    }

    if (achou == 0) {
        printf(">> Este animal ainda nao tem atendimentos.\n");
    } else {
        printf("\n%d atendimento(s) - total gasto: R$ %.2f\n", achou, total);
    }
}

/* ============================================================
   RELATORIO E FATURAMENTO
   ============================================================ */

/* ---------- OPCAO 7: relatorio de atendimentos ---------- */
void relatorioAtendimentos() {
    int inicio, fim, i, j, posAnimal, posServico;
    int qtd, qtdAnimais, jaContado;
    int vistos[MAX_ATENDIMENTOS];             /* animais ja contados */
    char *nomeAnimal;
    char *nomeServico;
    Atendimento *at;

    printf("\n--- Relatorio de atendimentos ---\n");
    if (lerPeriodo(&inicio, &fim) == 0) return;   /* & = passa o endereco */

    printf("\n%-12s %-20s %-20s %-14s\n", "Data", "Animal", "Servico", "Veterinario");
    printf("---------------------------------------------------------------\n");

    qtd = 0;
    qtdAnimais = 0;
    for (i = 0; i < totalAtendimentos; i++) {
        at = &atendimentos[i];
        if (dentroDoPeriodo(at->data, inicio, fim) == 0) continue;

        posAnimal = buscarAnimal(at->idAnimal);
        posServico = buscarServico(at->idServico);
        if (posAnimal >= 0) nomeAnimal = animais[posAnimal].nome;
        else nomeAnimal = "(removido)";
        if (posServico >= 0) nomeServico = servicos[posServico].nome;
        else nomeServico = "(removido)";

        mostrarData(at->data);
        printf("   %-20.20s %-20.20s %-14.14s\n", nomeAnimal, nomeServico, at->veterinario);
        qtd++;

        /* conta cada animal uma unica vez */
        jaContado = 0;
        for (j = 0; j < qtdAnimais; j++) {
            if (vistos[j] == at->idAnimal) jaContado = 1;
        }
        if (jaContado == 0) {
            vistos[qtdAnimais] = at->idAnimal;
            qtdAnimais++;
        }
    }

    if (qtd == 0) {
        printf(">> Nenhum atendimento no periodo.\n");
    } else {
        printf("\nTotal: %d atendimento(s) para %d animal(is)\n", qtd, qtdAnimais);
    }
}

/* ---------- OPCAO 8: faturamento ----------
   Para cada atendimento do periodo, acha o servico e soma o preco. */
void faturamento() {
    int inicio, fim, i, posServico;
    float somaServico[MAX_SERVICOS];
    int qtdServico[MAX_SERVICOS];
    float totalGeral;

    printf("\n--- Faturamento ---\n");
    if (lerPeriodo(&inicio, &fim) == 0) return;

    for (i = 0; i < MAX_SERVICOS; i++) {
        somaServico[i] = 0;
        qtdServico[i] = 0;
    }

    totalGeral = 0;
    for (i = 0; i < totalAtendimentos; i++) {
        if (dentroDoPeriodo(atendimentos[i].data, inicio, fim) == 0) continue;

        posServico = buscarServico(atendimentos[i].idServico);
        if (posServico < 0) continue;

        somaServico[posServico] = somaServico[posServico] + servicos[posServico].preco;
        qtdServico[posServico]++;
        totalGeral = totalGeral + servicos[posServico].preco;
    }

    printf("\n%-30s %6s %14s\n", "Servico", "Qtd", "Subtotal");
    printf("------------------------------------------------\n");
    for (i = 0; i < totalServicos; i++) {
        if (qtdServico[i] > 0) {
            printf("%-30.30s %6d R$ %11.2f\n", servicos[i].nome, qtdServico[i], somaServico[i]);
        }
    }
    printf("------------------------------------------------\n");
    printf("%-30s %6s R$ %11.2f\n", "TOTAL", "", totalGeral);
}

/* ============================================================
   EXPORTAR JSON
   Escreve todos os dados em dados_clinica.json.
   ============================================================ */

/* Escreve uma string entre aspas, escapando caracteres especiais do JSON */
void escreverJsonString(FILE *f, const char *s) {
    fputc('"', f);
    for (; *s; s++) {
        switch (*s) {
            case '"':  fputs("\\\"", f); break;
            case '\\': fputs("\\\\", f); break;
            case '\n': fputs("\\n", f);  break;
            case '\r': fputs("\\r", f);  break;
            case '\t': fputs("\\t", f);  break;
            default:   fputc(*s, f);
        }
    }
    fputc('"', f);
}

/* Escreve a data AAAAMMDD como "AAAA-MM-DD" */
void escreverJsonData(FILE *f, int data) {
    fprintf(f, "\"%04d-%02d-%02d\"", data / 10000, (data / 100) % 100, data % 100);
}

/* ---------- OPCAO 9: exportar JSON ---------- */
void exportarJson() {
    FILE *f;
    int i, posServico;
    Animal *a;
    Servico *s;
    Atendimento *t;

    f = fopen("site/dados_clinica.json", "w");
    if (f == NULL) {
        printf(">> Erro ao criar dados_clinica.json\n");
        return;
    }

    /* ---------- animais ---------- */
    fprintf(f, "{\n  \"animais\": [\n");
    for (i = 0; i < totalAnimais; i++) {
        a = &animais[i];
        fprintf(f, "    {\n");
        fprintf(f, "      \"id\": %d,\n", a->id);
        fprintf(f, "      \"nome\": ");     escreverJsonString(f, a->nome);     fprintf(f, ",\n");
        fprintf(f, "      \"especie\": ");  escreverJsonString(f, a->especie);  fprintf(f, ",\n");
        fprintf(f, "      \"raca\": ");     escreverJsonString(f, a->raca);     fprintf(f, ",\n");
        fprintf(f, "      \"idade\": %d,\n", a->idade);
        fprintf(f, "      \"tutor\": ");    escreverJsonString(f, a->tutor);    fprintf(f, ",\n");
        fprintf(f, "      \"telefone\": "); escreverJsonString(f, a->telefone); fprintf(f, "\n");
        fprintf(f, "    }%s\n", (i < totalAnimais - 1) ? "," : "");
    }
    fprintf(f, "  ],\n");

    /* ---------- servicos ---------- */
    fprintf(f, "  \"servicos\": [\n");
    for (i = 0; i < totalServicos; i++) {
        s = &servicos[i];
        fprintf(f, "    {\n");
        fprintf(f, "      \"id\": %d,\n", s->id);
        fprintf(f, "      \"nome\": "); escreverJsonString(f, s->nome); fprintf(f, ",\n");
        fprintf(f, "      \"preco\": %.2f\n", s->preco);
        fprintf(f, "    }%s\n", (i < totalServicos - 1) ? "," : "");
    }
    fprintf(f, "  ],\n");

    /* ---------- atendimentos ---------- */
    fprintf(f, "  \"atendimentos\": [\n");
    for (i = 0; i < totalAtendimentos; i++) {
        t = &atendimentos[i];
        posServico = buscarServico(t->idServico);

        fprintf(f, "    {\n");
        fprintf(f, "      \"id\": %d,\n", t->id);
        fprintf(f, "      \"id_animal\": %d,\n", t->idAnimal);
        fprintf(f, "      \"id_servico\": %d,\n", t->idServico);
        fprintf(f, "      \"data\": "); escreverJsonData(f, t->data); fprintf(f, ",\n");
        fprintf(f, "      \"descricao\": ");   escreverJsonString(f, t->descricao);   fprintf(f, ",\n");
        fprintf(f, "      \"veterinario\": "); escreverJsonString(f, t->veterinario); fprintf(f, ",\n");
        if (posServico >= 0) {
            fprintf(f, "      \"servico\": "); escreverJsonString(f, servicos[posServico].nome); fprintf(f, ",\n");
            fprintf(f, "      \"preco\": %.2f\n", servicos[posServico].preco);
        } else {
            fprintf(f, "      \"servico\": \"(removido)\",\n");
            fprintf(f, "      \"preco\": 0.00\n");
        }
        fprintf(f, "    }%s\n", (i < totalAtendimentos - 1) ? "," : "");
    }
    fprintf(f, "  ]\n}\n");

    fclose(f);
}

/* ============================================================
   MENU PRINCIPAL
   ============================================================ */

void mostrarMenu() {
    printf("\n===== CLINICA VETERINARIA =====\n");
    printf("1 - Cadastrar animal\n");
    printf("2 - Listar animais\n");
    printf("3 - Pesquisar animal\n");
    printf("4 - Registrar atendimento\n");
    printf("5 - Registrar servico\n");
    printf("6 - Consultar historico do animal\n");
    printf("7 - Relatorio de atendimentos\n");
    printf("8 - Faturamento\n");
    printf("9 - Exportar dados para JSON\n");
    printf("0 - Sair\n");
    printf("Opcao: ");
}

int main() {
    int opcao;

    carregarAnimais();
    carregarServicos();
    carregarAtendimentos();

    do {
        mostrarMenu();
        opcao = lerInteiro();
        if (fimEntrada) break;

        switch (opcao) {
            case 1: cadastrarAnimal();       break;
            case 2: listarAnimais();         break;
            case 3: pesquisarAnimal();       break;
            case 4: registrarAtendimento();  break;
            case 5: registrarServico();      break;
            case 6: consultarHistorico();    break;
            case 7: relatorioAtendimentos(); break;
            case 8: faturamento();           break;
            case 9: exportarJson();          break;
            case 0: printf("Ate logo!\n");   break;
            default: printf(">> Opcao invalida.\n");
        }
    } while (opcao != 0);

    return 0;
}