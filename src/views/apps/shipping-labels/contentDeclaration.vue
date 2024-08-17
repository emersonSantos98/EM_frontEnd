<script setup lang="ts">
import { ref } from 'vue'

const rastreamento = ref('BR65265655565656565565656565')

const remetente = ref({
  nome: 'glamaura',
  endereco: 'R Rebelo de Avelar, 08, São Paulo',
  municipio: 'São Paulo',
  uf: 'SP',
  cep: '08474430',
  cpf: '55751386000165',
})

const destinatario = ref({
  nome: 'Laurita Da Conceição Alves Pereira',
  endereco: 'Sinhana, 11, Entrada à esquerda! Copanor., Botumirim, Minas Gerais',
  municipio: 'Botumirim',
  uf: 'MG',
  cep: '39597-000',
  cpf: '07855433686',
})
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      md="9"
    >
      <!-- Primeiro Card: Declaração de Conteúdo -->
      <VCard
        class="declaracao-conteudo"
        flat
      >
        <VCardText class="titulo">
          DECLARAÇÃO DE CONTEÚDO
        </VCardText>

        <VCardText class="rastreamento">
          Código de Rastreamento: {{ rastreamento }}
        </VCardText>
      </VCard>

      <!-- Segundo Card: Remetente e Destinatário -->
      <VCard
        class="remetente-destinatario"
        flat
      >
        <!-- Header com títulos REMETENTE e DESTINATÁRIO -->
        <div class="header">
          <div class="coluna-titulo">
            REMETENTE
          </div>
          <div class="coluna-titulo">
            DESTINATÁRIO
          </div>
        </div>

        <div class="header">
          <div class="coluna">
            <p><strong>Nome:</strong> {{ remetente.nome }}</p>
          </div>
          <div class="coluna">
            <p><strong>Nome:</strong> {{ destinatario.nome }}</p>
          </div>
        </div>

        <div class="header">
          <div class="coluna">
            <p><strong>Endereço:</strong> {{ remetente.endereco }}</p>
          </div>
          <div class="coluna">
            <p><strong>Endereço:</strong> {{ destinatario.endereco }}</p>
          </div>
        </div>

        <div class="header">
          <div class="coluna">
            <p><strong>Município:</strong> {{ remetente.municipio }}</p>
          </div>
          <div class="coluna coluna-uf">
            <p><strong>UF:</strong> {{ remetente.uf }}</p>
          </div>
          <div class="coluna">
            <p><strong>Município:</strong> {{ destinatario.municipio }}</p>
          </div>
          <div class="coluna coluna-uf">
            <p><strong>UF:</strong> {{ destinatario.uf }}</p>
          </div>
        </div>

        <div class="header">
          <div class="coluna coluna-cep">
            <p><strong>CEP:</strong> {{ remetente.cep }}</p>
          </div>
          <div class="coluna coluna-cpf">
            <p><strong>CPF/CNPJ:</strong> {{ remetente.cpf }}</p>
          </div>
          <div class="coluna coluna-cep">
            <p><strong>CEP:</strong> {{ destinatario.cep }}</p>
          </div>
          <div class="coluna coluna-cpf">
            <p><strong>CPF/CNPJ:</strong> {{ destinatario.cpf }}</p>
          </div>
        </div>

      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
.declaracao-conteudo {
  border-radius: 0;
  border: 1px solid #000;
  text-align: center;
  padding: 20px;
  margin-bottom: 20px;
}

.titulo {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 40px;
}

.rastreamento {
  font-size: 16px;
  margin-top: 40px;
}

.remetente-destinatario {
  border-radius: 0;
  border: 1px solid #000;
  padding: 0;
  margin-top: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #000;
  width: 100%;
}

.coluna-titulo {
  font-weight: bold;
  font-size: 20px;
  width: 50%;
  text-align: center;
  padding: 10px 0;
  border-right: 1px solid #000;
}

.coluna-titulo:last-child {
  border-right: none;
}

.conteudo {
  display: flex;
  width: 100%;
}

.coluna {
  width: 50%;
  padding: 10px;
  border-right: 1px solid #000;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.coluna:last-child {
  border-right: none;
}

.coluna p {
  margin: 5px 0;
  font-size: 14px;
  line-height: 1.5;
}

/* Ajuste específico para o campo "UF" */
.coluna-uf {
  width: 20%; /* Reduzindo o tamanho para 20% */
}

.coluna-municipio {
  width: 70%; /* Ajustando a largura do município */
}

/* Ajuste específico para o campo "UF" */
.coluna-uf {
  width: 15%; /* Reduzindo o tamanho para 15% */
}

/* Ajuste específico para o campo "CEP" */
.coluna-cep {
  width: 25%; /* Reduzindo o tamanho para 25% */
}

.coluna-municipio {
  width: 60%; /* Ajustando a largura do município */
}

.coluna-cpf {
  width: 50%; /* Ajustando a largura do CPF/CNPJ */
}
</style>
