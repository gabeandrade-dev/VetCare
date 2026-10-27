// Registro de Cadastro dos Pets
#include <stdio.h>
#include <string.h>

typedef struct {
    char nomeTutor[50];
    char contatoTutor[50];
    char nomePet[50];
    int idadePet;
    int mesesPet;
    char animal[50];
    char sexo[10];
    char Problema[100];
} CadastrarPet;

void CadastroPet(CadastrarPet *cadastra) {

    printf("========== Registro ==========");
    printf("\nNome do Tutor: ");
    scanf(" %49[^\n]", cadastra->nomeTutor);

    printf("Telefone para contato: ");
    scanf(" %49[^\n]", cadastra->contatoTutor);

    printf("Nome do Pet: ");
    scanf(" %49[^\n]", cadastra->nomePet);

    printf("Qual a idade do seu pet (em anos)?: \n");
    scanf(" %d", &cadastra->idadePet);

    printf("Quantos Meses: ");         
    scanf(" %d", &cadastra->mesesPet);

    printf("Qual é o seu pet? ");
    scanf(" %49[^\n]", cadastra->animal);
    
    printf("sexo: ");
    scanf(" %49[^\n]", cadastra->sexo);
    
}

int main(void) {
    CadastrarPet cadastro;
    CadastroPet(&cadastro);

    printf("\n ========== Dados do Cadastro ========== \n");
    printf(" Nome do Tutor: %s \n", cadastro.nomeTutor);
    printf("Telefone: %s \n", cadastro.contatoTutor);
    printf("Nome do Pet: %s \n", cadastro.nomePet);
    printf("Idade do Pet: %d anos e %d meses \n", cadastro.idadePet);
    printf("Especie: %s \n", cadastro.animal);
    printf("Sexo: %s \n", cadastro.sexo);
    printf("Problema: %s \n", cadastro.Problema);   
    return 0;
}
