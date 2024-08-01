<script setup lang="ts">
import type {VForm} from 'vuetify/components/VForm'
import avatar1 from '@images/bandeiras/icons8-brazil-96.png'
import {requiredValidator, cpfCnpjValidator} from '@validators'
import {useOrganizationStore, useAdressStore} from '@/views/apps/organization/OrganizationStore'
import type {OrganizationParams, AddressParams} from '@/views/apps/organization/types'

const organization = useOrganizationStore()
const adress = useAdressStore()

const refForm = ref<VForm>()
const refFormAdress = ref<VForm>()

const nome_organizaca = ref('')
const document = ref('')
const contryCode = ref('br')

const pais = ref([])
const countries = [
  {
    name: 'Brasil',
    tag: 'br',
    avatar: avatar1,
  },
]
const cep = ref('')
const address = ref('')
const number = ref('')
const neighborhood = ref('')
const complemente = ref('')
const city = ref('')
const state = ref('')
const estadoSigla = ref('')
const stateList = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" }
];
const loading = ref(false)
const verifyAddress = ref(false)

async function findOneOrganization() {
  const {data} = await organization.findOne()
   verifyAddress.value = data.address.length > 0
  nome_organizaca.value = data.name
  document.value = data.document
  if (data.address.length > 0) {
    pais.value = data.address[0].pais;
    cep.value = data.address[0].cep
    address.value = data.address[0].endereco
    number.value = data.address[0].numero
    neighborhood.value = data.address[0].bairro
    complemente.value = data.address[0].complemento
    city.value = data.address[0].cidade
    state.value =  mapSiglaToEstado(data.address[0].estado)
    estadoSigla.value = data.address[0].estado
  }


}

async function updateOrganization() {
  const Paramns: OrganizationParams = {
    name: nome_organizaca.value,
    document: document.value,
    contryCode: contryCode.value,
  }

  await organization.update(Paramns)
  findOneOrganization()
}
async function updateAdress() {
  const Paramns: AddressParams = {
    pais: pais.value,
    cep: cep.value,
    endereco: address.value,
    numero: number.value,
    bairro: neighborhood.value,
    complemento: complemente.value,
    cidade: city.value,
    estado: verifyState(estadoSigla.value, state.value.sigla),
  }

    await adress.update(Paramns)

  findOneOrganization()

}

async function createAdress() {
  const Paramns: AddressParams = {
    pais: pais.value,
    cep: cep.value,
    endereco: address.value,
    numero: number.value,
    bairro: neighborhood.value,
    complemento: complemente.value,
    cidade: city.value,
    estado: verifyState(estadoSigla.value, state.value.sigla),
  };

    await adress.create(Paramns)

  findOneOrganization()

}

async function viaCep() {
  const response = await organization.findCep(cep.value)
  address.value = response.logradouro
  neighborhood.value = response.bairro
  city.value = response.localidade
  state.value = mapSiglaToEstado(response.uf)
  estadoSigla.value = response.uf
    }

function mapSiglaToEstado(sigla : string) {
  const estado = stateList.find((item) => item.sigla === sigla);
  return estado ? estado.nome : '';
}

function  verifyState(estadoSigla : string, sigla : string) {
  if (estadoSigla === sigla) {
    return sigla
  }
  if (estadoSigla === '' || estadoSigla === undefined) {
    return sigla
  }
  if (sigla === '' || sigla === undefined) {
    return estadoSigla
  }

  return sigla

}



function onSubmit() {
  if (refForm.value) {
    refForm.value.validate()
      .then(({ valid: isValid }) => {
        if (isValid) {
          updateOrganization();
          setTimeout(() => {
            refForm.value.reset();
          }, 0);
        }
      });
  }
}

function onSubmitAdress(){
  if (refFormAdress.value) {
    refFormAdress.value.validate()
      .then(({ valid: isValid }) => {
        if (isValid) {
          verifyAddress.value ? updateAdress() : createAdress()
          setTimeout(() => {
            refFormAdress.value.reset();
          }, 0);
        }
      });
  }
}

const clickMe = () => {
  loading.value = true
  viaCep()

  setTimeout(() => {
    loading.value = false
  }, 2000)
}

watchEffect(() => {
  findOneOrganization()

})

</script>

<template>
  <VRow>
    <!-- SECTION User Details -->
    <VCol cols="12">
            <VCard>
                <VOverlay
                        v-model="organization.loading"
                        contained

                        persistent
                        class="align-center justify-center"
                >
                    <VProgressCircular indeterminate />
                </VOverlay>
                <VCardText>
                    <VList class="card-list mt-2">
                        <VListItem>
                            <VListItemTitle>
                                <h6 class="text-h6">
                  <span class="text-body-5">
                     {{ $t('Organization Details')}}
                  </span>
                                </h6>
                            </VListItemTitle>
                        </VListItem>
                    </VList>
                </VCardText>
                <VDivider/>

                <!-- 👉 Details -->
                <VCardText>
                    <VForm ref="refForm"
                           @submit.prevent class="mt-2">
                        <VRow>
                            <VCol
                                    md="8"
                                    cols="12"
                            >
                                <AppTextField
                                        v-model="nome_organizaca"
                                        :label="$t('Organization name')"
                                        :rules="[requiredValidator(nome_organizaca, $t('Organization name'))]"
                                />
                            </VCol>

                            <VCol
                                    md="4"
                                    cols="12"
                            >
                                <AppTextField
                                        v-model="document"
                                        :label="$t('Document')"
                                        v-mask="['###.###.###-##', '##.###.###/####-##']"
                                        :rules="[requiredValidator, cpfCnpjValidator]"
                                />
                            </VCol>
                        </VRow>
                    </VForm>
                </VCardText>
                <!-- 👉 Edit and Suspend button -->
                <VCardText class="d-flex justify-start">
                    <VBtn
                            variant="elevated"
                            class="me-4"
                            :disabled="nome_organizaca === '' || document === '' "
                            type="submit"
                            @click="onSubmit"
                    >
                        salvar
                    </VBtn>
                </VCardText>
            </VCard>
    </VCol>

    <VCol cols="12">
      <VCard>
          <VOverlay
                  v-model="adress.loading"
                  contained
                  persistent
                  class="align-center justify-center"
          >
              <VProgressCircular indeterminate />
          </VOverlay>
        <VCardText>
          <VList class="card-list mt-2">
            <VListItem>
              <VListItemTitle>
                <h6 class="text-h6">
                  <span class="text-body-5">
                     {{ $t('Address')}}
                  </span>
                </h6>
              </VListItemTitle>
            </VListItem>
          </VList>
        </VCardText>
        <VDivider/>

        <!-- 👉 Details -->
        <VCardText>
          <VForm ref="refFormAdress" class="mt-2" >
          <VRow>
            <!-- 👉 País -->
            <VCol
              cols="12"
              md="2"
            >
              <AppSelect
                v-model="pais"
                :items="countries"
                item-value="tag"
                :label="$t('Country')"
                :rules="[requiredValidator(pais, $t('Country'))]"
              >
                <template #chip="{ props, item }">
                  <VChip
                    v-bind="props"
                    :prepend-avatar="item.raw.avatar"
                    :text="item.raw.name"
                  />
                </template>

                <template #item="{ props, item }">
                  <VListItem
                    v-bind="props"
                    :prepend-avatar="item?.raw?.avatar"
                    :title="item?.raw?.name"
                  />
                </template>
              </AppSelect>
            </VCol>

            <!-- 👉 Cep -->
            <VCol md="3" cols="12">
              <AppTextField
                v-model="cep"
                clearable
                :label="$t('Zip code')"
                v-mask="['#####-###', '#####']"
                :rules="[requiredValidator(cep, $t('Zip code'))]"
                type="text"
                class="textfield-demo-icon-slot"
              >

                <!-- AppendInner -->
                <template #append-inner>
                  <VFadeTransition leave-absolute>
                    <VProgressCircular
                      v-if="loading"
                      color="primary"
                      indeterminate
                    />
                  </VFadeTransition>
                </template>

                <!-- Append -->
                <template #append>
                  <VBtn
                    :icon="$vuetify.display.smAndDown"
                    @click="clickMe"
                  >
                    <VIcon icon="tabler-search" v-if="$vuetify.display.mdAndUp"/>
                  </VBtn>
                </template>
              </AppTextField>
            </VCol>

            <!-- 👉 Address -->
            <VCol md="5" cols="12">
              <AppTextarea
                v-model="address"
                :label="$t('Address')"
                :rules="[requiredValidator(address, $t('Address'))]"
                rows="1"
              />
            </VCol>

            <!-- 👉 Número -->
            <VCol
              cols="12"
              md="2"
            >
              <AppTextField
                v-model="number"
                :label="$t('Number')"
                :rules="[requiredValidator(number, $t('Number'))]"
                type="text"
              />
            </VCol>

            <!-- 👉 Bairro -->
            <VCol
              cols="12"
              md="4"
            >
              <AppTextField
                  v-model="neighborhood"
                  :label="$t('Neighborhood')"
                  :rules="[requiredValidator(neighborhood, $t('Neighborhood'))]"
                  type="text"
              />
            </VCol>

            <!-- 👉 Complemente -->
            <VCol
              cols="12"
              md="8"
            >
              <AppTextField
                  v-model="complemente"
                  :label="$t('Complement')"
                  type="text"
              />
            </VCol>

            <!-- 👉 Cidade -->
            <VCol
              cols="12"
              md="6"
            >
              <AppTextField
                  v-model="city"
                  :label="$t('City')"
                  type="text"
                  :rules="[requiredValidator(city, $t('City'))]"
              />
            </VCol>


            <!-- 👉 Estado -->
            <VCol
              cols="12"
              md="6"
            >
              <AppSelect
                  v-model="state"
                  :items="stateList"
                  item-title="nome"
                  item-value="sigla"
                  :label="$t('State')"
                  :rules="[requiredValidator(state, $t('State'))]"
                  persistent-hint
                  return-object
                  single-line
              />

            </VCol>
          </VRow>
          </VForm>
        </VCardText>


        <!-- 👉 salvar and Suspend button -->
        <VCardText class="d-flex justify-start">
          <VBtn
            variant="elevated"
            class="me-4"
            type="submit"
            @click="onSubmitAdress"
          >
            salvar
          </VBtn>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss" scoped>
.card-list {
  --v-card-list-gap: 0.75rem;
}

.text-capitalize {
  text-transform: capitalize !important;
}


.textfield-demo-icon-slot {
  :deep(.v-input) {
    align-content: center;

    .v-input__prepend,
    .v-input__append {
      padding-block-start: 0 !important;
    }

    .v-input__prepend {
      align-items: center;
    }

    .v-field__append-inner .v-progress-circular svg {
      block-size: 1.3em;
      inline-size: 1.3em;
    }

    .v-field__append-inner svg {
      margin-block-start: 0.1rem;
    }
  }
}
</style>
