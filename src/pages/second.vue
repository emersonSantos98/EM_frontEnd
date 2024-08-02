<script setup lang="ts">
import { VDataTable } from "vuetify/labs/VDataTable";
import AuthService from "@/services/auth/auth.service";
import { useAuthStore } from "@/store/auth";

import * as XLSX from "xlsx";
import { ref } from "vue";

const authService = new AuthService();

const testeAuth = () => {
  authService
    .authVerifyToken()
    .then((data) => {
      console.log("data", data);
    })
    .catch((e) => {
      console.log("e", e);
    });
};

const refreshToken = () => {
  authService.AuthRefreshToken();
};

const authUser = () => {
  const authUser = useAuthStore();
  authUser.checkToken();
};
const search = ref("");

// Função para formatar número como moeda brasileira
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const totalFaturamentoBruto = ref<number>(0);
const totalFaturamentoLiquido = ref<number>(0);
const totalDespesasShopee = ref<number>(0);

const earningsReports = ref([
  {
    color: "info",
    icon: "tabler-currency-dollar",
    title: "Faturamento Bruto",
    amount: formatCurrency(totalFaturamentoBruto.value),
    progress: "55",
  },
  {
    color: "error",
    icon: "tabler-brand-paypal",
    title: "Despesas Shopee",
    amount: formatCurrency(totalDespesasShopee.value),
    progress: "65",
  },
  {
    color: "success",
    icon: "tabler-chart-pie-2",
    title: "Faturamento Líquido",
    amount: formatCurrency(totalFaturamentoLiquido.value),
    progress: "25",
  },
]);

const files = ref<File[]>([]);
const data = ref<Array<any>>([]);
const totalPrecoAcordado = ref<number>(0);
const headers = ref([
  { title: "ID do pedido", key: "iDdopedido" },
  { title: "Status do pedido", key: "statusDoPedido" },
  { title: "Nome do Produto", key: "nomeDoProduto" },
  { title: "Preço de Venda", key: "precoAcordado" },
  { title: "Valor Pago pelo Cliente", key: "valorPagoCliente" },
  { title: "Cobrança Shoppe", key: "cobrancaShoppe" },
  { title: "A Receber da Shoppe", key: "aReceberDaShoppe" },
]);

const handleFileUpload = () => {
  if (files.value.length === 0) return;

  const file = files.value[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const arrayBuffer = e.target?.result;
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Filtra as colunas necessárias
    const filteredData = jsonData
      .filter((row: any) => row["Status do pedido"] !== "Cancelado")
      .map((row: any) => {
        const precoAcordado = parseFloat(row["Preço acordado"]) || 0;
        const precoOriginal = row["Preço original"] || 0;
        const valorEstimadoFrete = parseFloat(
          row["Valor estimado do frete"] || 0
        );
        const taxaDeServico = parseFloat(row["Taxa de serviço"] || 0);
        const taxaDeComissao = parseFloat(row["Taxa de comissão"] || 0);
        const cupomDoVendedor = parseFloat(row["Cupom do vendedor"] || 0);
        const valorTotal = parseFloat(row["Valor Total"] || 0);
        const compensarMoedasShopee = parseFloat(
          row["Compensar Moedas Shopee"] || 0
        );

        const numeroProdutos = parseInt(row["Número de produtos pedidos"]) || 1;
        const cobrancaShoppe =
          (parseFloat(row["Taxa de serviço"]) || 0) +
          (parseFloat(row["Cupom do vendedor"]) || 0);
        const aReceber =
          precoAcordado * numeroProdutos -
          //  (parseFloat(row["Valor estimado do frete"]) || 0) -
          (parseFloat(row["Taxa de serviço"]) || 0) -
          (parseFloat(row["Taxa de comissão"]) || 0) -
          (parseFloat(row["Cupom do vendedor"]) || 0);

        const nomeProduto = row["Nome do Produto"] || "";
        const nomeProdutoReduzido =
          nomeProduto.length > 30
            ? nomeProduto.substring(0, 30) +
              "...                                        "
            : nomeProduto;

        return {
          iDdopedido: row["ID do pedido"] || "",
          statusDoPedido:
            row["Status do pedido"] === "Frete"
              ? "Enviado"
              : row["Status do pedido"] || "",
          nomeDoProduto: nomeProdutoReduzido,
          precoAcordado: formatCurrency(precoAcordado), // Adiciona "R$" e formata para 2 casas decimais
          precoOriginal: formatCurrency(precoOriginal), // Adiciona "R$" e formata para 2 casas decimais

          aReceberDaShoppe: formatCurrency(aReceber), // Adiciona "R$" e formata para 2 casas decimais
          valorEstimadoDoFrete: formatCurrency(valorEstimadoFrete), // Adiciona "R$" e formata para 2 casas decimais
          taxaDeServico: formatCurrency(taxaDeServico), // Adiciona "R$" e formata para 2 casas decimais
          taxaDeComissao: formatCurrency(taxaDeComissao), // Adiciona "R$" e formata para 2 casas decimais
          cupomDoVendedor: formatCurrency(cupomDoVendedor), // Adiciona "R$" e formata para 2 casas decimais
          valorTotal: formatCurrency(valorTotal), // Adiciona "R$" e formata para 2 casas decimais
          compensarMoedasShopee: converterCentavos(compensarMoedasShopee), // Adiciona "R$" e formata para 2 casas decimais
          rendaEstimadaDoPedido: formatCurrency(aReceber), // Adiciona "R$" e formata para 2 casas decimais
          cobrancaShoppe: formatCurrency(cobrancaShoppe), // Adiciona "R$" e formata para 2 casas decimais
          valorPagoCliente: formatCurrency(valorTotal), // Adiciona "R$" e formata para 2 casas decimais
        };
      });

    data.value = filteredData;
    // Calcula a soma dos valores "Preço acordado"
    totalPrecoAcordado.value = filteredData.reduce(
      (acc, row) =>
        acc +
        parseFloat(row.aReceberDaShoppe.replace("R$", "").replace(",", ".")),
      0
    );

    totalFaturamentoBruto.value = filteredData.reduce(
      (acc, row) =>
        acc +
        parseFloat(row.aReceberDaShoppe.replace("R$", "").replace(",", ".")),
      0
    );
    totalDespesasShopee.value = filteredData.reduce(
      (acc, row) =>
        acc +
        parseFloat(row.cobrancaShoppe.replace("R$", "").replace(",", ".")),
      0
    );

    earningsReports.value[0].amount = formatCurrency(
      totalFaturamentoBruto.value
    );
    earningsReports.value[1].amount = formatCurrency(totalDespesasShopee.value);

    earningsReports.value[2].amount = formatCurrency(
      totalFaturamentoBruto.value - totalDespesasShopee.value
    );

    console.log("data", data.value);
  };
  reader.readAsArrayBuffer(file);
};
const converterCentavos = (valor: number) => {
  return valor / 100;
};

const resolveAReceberVariant = (status: number) => {
  return { color: "success" };
};

const resolveCobrancaShoppeVariant = (status: number) => {
  return { color: "error" };
};

const resolveFaturamentoShoppeVariant = (status: number) => {
  return { color: "info" };
};
const resolveCorGreen = () => {
  // Verifica se o valor é numérico

  return { color: "green" }; // verde para positivo
};

const resolveCorInfo = () => {
  // Verifica se o valor é numérico

  return { color: "Info" }; // verde para positivo
};

const resolveCorRed = () => {
  // Verifica se o valor é numérico

  return { color: "red" }; // verde para positivo
};
const resolveCorBlue = () => {
  // Verifica se o valor é numérico

  return { color: "blue" }; // verde para positivo
};
</script>

<template>
  <div>
    <VCard title=" ">
      <template v-slot:title>
        <div class="d-flex align-center">
          <span class="ms-2 text-primary">Importe sua planilha da Shopee </span>
          <v-icon color="primary">tabler-brand-shopee</v-icon>
        </div>
      </template>

      <VCardText>
        <VFileInput
          v-model="files"
          multiple
          placeholder="Upload your documents"
          label="File input"
          prepend-icon="tabler-paperclip"
          @change="handleFileUpload"
        >
          <template #selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <VChip
                label
                size="small"
                variant="outlined"
                color="primary"
                class="me-2"
              >
                {{ fileName }}
              </VChip>
            </template>
          </template>
        </VFileInput>
      </VCardText>

      <VCol>
        <div class="border rounded mt-3 px-5 py-4">
          <VRow>
            <VCol
              v-for="report in earningsReports"
              :key="report.title"
              cols="12"
              sm="4"
            >
              <div class="d-flex align-center">
                <VAvatar
                  rounded
                  size="26"
                  :color="report.color"
                  variant="tonal"
                  class="me-2"
                >
                  <VIcon size="18" :icon="report.icon" />
                </VAvatar>

                <h6 class="text-base font-weight-medium">
                  {{ report.title }}
                </h6>
              </div>
              <h4 class="text-h4 my-3">
                {{ report.amount }}
              </h4>
              <VProgressLinear
                :model-value="report.progress"
                :color="report.color"
                height="4"
                rounded
                rounded-bar
              />
            </VCol>
          </VRow>
        </div>
        <VCardText>
          <VRow>
            <VCol cols="12" offset-md="6" md="6">
              <AppTextField
                v-model="search"
                density="compact"
                placeholder="Id do pedido, nome do produto, Preço acordado, Cobrança Shoppe, A Receber da Shoppe"
                append-inner-icon="tabler-search"
                single-line
                hide-details
                dense
                outlined
              />
            </VCol>
          </VRow>
        </VCardText>
        <VDataTable
          :headers="headers"
          :items="data"
          :items-per-page="5"
          expand-on-click
          :search="search"
        >
          <!-- Expanded Row Data -->

          <template #expanded-row="slotProps">
            <tr class="v-data-table__tr">
              <td :colspan="headers.length">
                <p class="my-1">
                  Valor de Venda:
                  <span
                    :style="resolveCorBlue(slotProps.item.raw.precoAcordado)"
                  >
                    {{ slotProps.item.raw.precoAcordado }}
                  </span>
                </p>
                <p class="my-1">
                  Valor do Frete:
                  <span
                    :style="
                      resolveCorBlue(slotProps.item.raw.valorEstimadoDoFrete)
                    "
                  >
                    {{ slotProps.item.raw.valorEstimadoDoFrete }}
                  </span>
                </p>
                <p class="my-1">
                  Taxa de Serviço:
                  <span
                    :style="resolveCorRed(slotProps.item.raw.taxaDeServico)"
                  >
                    {{ " - " + slotProps.item.raw.taxaDeServico }}
                  </span>
                </p>
                <p class="my-1">
                  Taxa de Comissão:
                  <span
                    :style="resolveCorRed(slotProps.item.raw.taxaDeComissao)"
                  >
                    {{ " - " + slotProps.item.raw.taxaDeComissao }}
                  </span>
                </p>
                <p class="my-1">
                  Cupom do Vendedor:
                  <span
                    :style="resolveCorRed(slotProps.item.raw.cupomDoVendedor)"
                  >
                    {{ " - " + slotProps.item.raw.cupomDoVendedor }}
                  </span>
                </p>

                <p class="my-1">
                  Moedas Shopee Resgatadas :
                  <span
                    :style="
                      resolveCorRed(slotProps.item.raw.compensarMoedasShopee)
                    "
                  >
                    {{ " - " + slotProps.item.raw.compensarMoedasShopee }}
                  </span>
                </p>

                <p class="my-1">
                  Pagamento total do comprador :
                  <span :style="resolveCorInfo(slotProps.item.raw.valorTotal)">
                    {{ slotProps.item.raw.valorTotal }}
                  </span>
                </p>

                <p class="my-1">
                  Renda Estimada do Pedido:
                  <span
                    :style="
                      resolveCorGreen(slotProps.item.raw.rendaEstimadaDoPedido)
                    "
                  >
                    {{ "+" + slotProps.item.raw.rendaEstimadaDoPedido }}
                  </span>
                </p>
              </td>
            </tr>
          </template>

          <template #item.aReceberDaShoppe="{ item }">
            <VChip
              :color="resolveAReceberVariant(item.raw.aReceberDaShoppe).color"
              class="font-weight-medium"
              size="small"
            >
              {{ item.raw.aReceberDaShoppe }}
            </VChip>
          </template>

          <template #item.cobrancaShoppe="{ item }">
            <VChip
              :color="
                resolveCobrancaShoppeVariant(item.raw.cobrancaShoppe).color
              "
              class="font-weight-medium"
              size="small"
            >
              {{ item.raw.cobrancaShoppe }}
            </VChip>
          </template>

          <template #item.valorPagoCliente="{ item }">
            <VChip
              :color="
                resolveFaturamentoShoppeVariant(item.raw.valorTotal).color
              "
              class="font-weight-medium"
              size="small"
            >
              {{ item.raw.valorTotal }}
            </VChip>
          </template>
        </VDataTable>
      </VCol>
    </VCard>
  </div>
</template>

<route lang="yaml">
meta:
  action: read
  subject: Auth
  auth: true
</route>
