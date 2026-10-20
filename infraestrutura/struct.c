// Registro de Cadastro dos Pets
#include <stdio.h>
#include <string.h>

typedef struct {
    char nomeTutor[50];
    char nomePet[50];
    int idadePet;
    int mesesPet;
    char especie[50];
    char raca[50];
    char sexo[10];
    char contatoTutor[50];
    char Problema[100];
} CadastrarPet;

void CadastroPet(CadastrarPet *cadastra) {

    printf("========== Registro ==========");
    printf("\nNome do Tutor: ");
    scanf(" %49[^\n]", cadastra->nomeTutor);

    printf("Nome do Pet: ");
    scanf(" %49[^\n]", cadastra->nomePet);

    printf("Idade do Pet (Anos): ");
    scanf(" %d", &cadastra->idadePet);

    printf(" Quantos Meses: ");         
    scanf(" %d", &cadastra->mesesPet);

    printf("Especie: ");
    scanf(" %49[^\n]", cadastra->especie);
    
    printf("raca: ");
    scanf(" %49[^\n]", cadastra->raca);
    
    printf("sexo: ");
    scanf(" %49[^\n]", cadastra->sexo);
    
    printf("Telefone: ");
    scanf(" %49[^\n]", cadastra->contatoTutor);

    printf("Problema: ");
    scanf(" %99[^\n]", cadastra->Problema);
    
}

int main(void) {
    CadastrarPet cadastro;
    CadastroPet(&cadastro);

    printf("\n ========== Dados do Cadastro ========== \n");
    printf(" Nome do Tutor: %s \n", cadastro.nomeTutor);
    printf("Nome do Pet: %s \n", cadastro.nomePet);
    printf("Idade do Pet: %d anos e %d meses \n", cadastro.idadePet, cadastro.mesesPet);
    printf("Especie: %s \n", cadastro.especie);                 
    printf("Raça: %s \n", cadastro.raca);
    printf("Sexo: %s \n", cadastro.sexo);
    printf("Telefone: %s \n", cadastro.contatoTutor);
    printf("Problema: %s \n", cadastro.Problema);   
    return 0;
}
