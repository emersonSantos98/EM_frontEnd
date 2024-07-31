<script>
export default {
  el: '#app',
  props: {
    value: {
      type: Object,
      default: () => ({

      }),
    },
    validationFunction: Function,

    // Defina outras props conforme necessário
  },
  data() {
    return {
      Months: [
        { title: '01', value: `0${1}` },
        { title: '02', value: `0${2}` },
        { title: '03', value: `0${3}` },
        { title: '04', value: `0${4}` },
        { title: '05', value: `0${5}` },
        { title: '06', value: `0${6}` },
        { title: '07', value: `0${7}` },
        { title: '08', value: `0${8}` },
        { title: '09', value: `0${9}` },
        { title: '10', value: 10 },
        { title: '11', value: 11 },
        { title: '12', value: 12 },
      ],
      years: [],

      // selection options
      monthSelection: '',
      yearSelection: '',
      timeToExpire: 9,

      // formated cardNumber
      // cardNumber: '',
      // cardNumber: this.cardNumber,

      // non formated
      cardVadid: '',

      // card type
      cardType: '',
      cardTypeIcon: '',

      // card class to manipulate on css
      cClass: '',
      cvv: '',
      regx: [
        { name: 'Visa', logo: '/src/assets/images/payments/visa.png', re: '^4[0-9]{12}(?:[0-9]{3})?$' },
        { name: 'Hipercard', logo: '/src/assets/images/payments/hipercard.png', re: '^(606282\\d{10}(\\d{3})?)|^(3841\\d{15})' },
        { name: 'MasterCard', logo: '/src/assets/images/payments/mastercard.png', re: '^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\\\d{4,10})|((502121)\\\\d{4,10})|((589916)\\\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\\\d{4,10})' },
        { name: 'Discover', logo: '/src/assets/images/payments/discover.png', re: '^(6011|65|6|64[4-9]|622)' },
        { name: 'Elo', logo: '/src/assets/images/payments/elo.png', re: '^636368|^438935|^504175|^451416|^636297|^5067|^4576|^4011|^506699' },
        { name: 'American Express', logo: '/src/assets/images/payments/american.expreess.png', re: '^3[47][0-9]{13}$' },

      ],
      regx2: [
        { name: 'Visa', logo: '/src/assets/images/payments/visa-icon.png', re: '^4[0-9]{12}(?:[0-9]{3})?$' },
        { name: 'Hipercard', logo: '/src/assets/images/payments/hipercard.png', re: '^(606282\\d{10}(\\d{3})?)|^(3841\\d{15})' },
        { name: 'MasterCard', logo: '/src/assets/images/payments/mastercard-icon.png', re: '^((5(([1-2]|[4-5])[0-9]{8}|0((1|6)([0-9]{7}))|3(0(4((0|[2-9])[0-9]{5})|([0-3]|[5-9])[0-9]{6})|[1-9][0-9]{7})))|((508116)\\\\d{4,10})|((502121)\\\\d{4,10})|((589916)\\\\d{4,10})|(2[0-9]{15})|(67[0-9]{14})|(506387)\\\\d{4,10})' },
        { name: 'Discover', logo: '/src/assets/images/payments/discover.png', re: '^(6011|65|6|64[4-9]|622)' },
        { name: 'Elo', logo: '/src/assets/images/payments/elo.png', re: '^636368|^438935|^504175|^451416|^636297|^5067|^4576|^4011|^506699' },
        { name: 'American Express', logo: '/src/assets/images/payments/american.expreess.png', re: '^3[47][0-9]{13}$' },

      ],
      btnClassName: '',
      cardNumberteste: '',

    }
  },

  computed: {

    formatedCard: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      },
    },

  },

  // watch for the cardNumber
  watch: {

  },
  beforeMount() {
    // get date for options on html
    this.expirationDate()
  },
  methods: {

    // 4 in 4 spaces on input format
    inputFormat() {
      let text = this.formatedCard.cardNumber.split(' ').join('')

      // this.cardVdid is not formated in 4 spaces
      this.cardVadid = text
      if (text.length > 0) {
        // regExp 4 in 4 number add an space between
        text = text.match(new RegExp(/.{1,4}/, 'g')).join(' ')

          // accept only numbers
          .replace(new RegExp(/[^\d]/, 'ig'), ' ')
      }

      // this.cardNumber is formated on 4 spaces
      this.formatedCard.cardNumber = text

      // after formatd they callback cardType for choose a type of the card
      this.GetCardTypeIcon(this.cardVadid)
      this.GetCardType(this.cardVadid)
    },

    // loop for the next 9 years for expire data on credit card
    expirationDate() {
      const yearNow = new Date().getFullYear()
      for (let i = yearNow; i < yearNow + this.timeToExpire; i++)
        this.years.push({ title: i, value: i })
    },
    validCreditCard(value) {
      console.log('value: ', value)

      const inputValidate = document.getElementById('cardNumber')

      // luhn algorithm
      let numCheck = 0
      let bEven = false
      value = value.toString().replace(new RegExp(/\D/g, ''))
      for (let n = value.length - 1; n >= 0; n--) {
        const cDigit = value.charAt(n)
        let digit = parseInt(cDigit, 10)

        if (bEven && (digit *= 2) > 9)
          digit -= 9
        numCheck += digit
        bEven = !bEven
      }
      const len = value.length

      // true: return valid number
      // this.cardType return true if have an valid number on regx array
      if (numCheck % 10 === 0 && len === 16 && this.cardType) {
        inputValidate.classList.remove('notValid')
        inputValidate.classList.add('valid')
      }

      // false: return not valid number
      else if (!numCheck % 10 === 0 && len === 16) {
        // inputValidate.classList.remove('valid')
        // inputValidate.classList.add('notValid')

        // if not have number on input
      }
      else {
        // inputValidate.classList.remove('valid')
        // inputValidate.classList.remove('notValid')
      }
    },

    // get the name of the card name
    GetCardType(number) {
      this.regx.forEach(item => {
        if (number.match(item.re) != null) {
          this.cardType = item.logo

          // cClass add a class with the name of cardName to manipulate with css
          this.cClass = item.name.toLowerCase()
        }

        else if (!number) {
          this.cardType = ''
          this.cClass = ''
        }
      })

      // after choose a cardtype return the number for the luhn algorithm
      this.validCreditCard(number)
    },

    GetCardTypeIcon(number) {
      this.regx2.forEach(item => {
        if (number.match(item.re) != null) {
          this.cardTypeIcon = item.logo
          this.cClass = item.name.toLowerCase()
        }

        else if (!number) {
          this.cardTypeIcon = ''
          this.cClass = ''
        }
      })
    },

    // mouse down on btn
    mouseDw() {
      this.btnClassName = 'btn__active'
    },

    // mouse up on btn
    mouseUp() {
      this.btnClassName = ''
    },

    blr() {
      const cr = document.getElementsByClassName('card--credit__card')[0]

      cr.classList.remove('cvv-active')
    },
    fcs() {
      const cr = document.getElementsByClassName('card--credit__card')[0]

      cr.classList.add('cvv-active')
    },
    onCvvInput() {
      // Remove caracteres não numéricos
      this.formatedCard.cvv = this.formatedCard.cvv.replace(/\D/g, '')

      // Limita a quantidade máxima de caracteres
      if (this.formatedCard.cvv.length > 4)
        this.formatedCard.cvv = this.formatedCard.cvv.slice(0, 4)
    },

  },

}
</script>

<template>
  <VRow>
    <VCol
      cols="12"
      class="justify-center"
      style="display: flex"
    >
      <div class="card-container">
        <div class="card--credit__card">
          <div class="front">
            <div class="Cheader">
              <div

                class="card__logo"
              >
                <img
                  v-if="cClass"
                  :class="cClass"
                  :src="cardType"
                  alt=""
                >
              </div>
              <div class="card__chip">
                <svg
                  x="0px"
                  y="0px"
                  viewBox="0 0 100 125"
                >
                  <g transform="translate(0,-952.36218)">
                    <path
                      d="M 18,18 C 11.869627,18 7,23.41809 7,30 l 0,40 c 0,6.5819 4.869627,12 11,12 21.333333,0 42.666667,0 64,0 6.130373,0 11,-5.4181 11,-12 L 93,30 C 93,23.41809 88.130373,18 82,18 60.666667,18 39.333333,18 18,18 z m 0,2 23.46875,0 C 37.589245,22.564948 35,27.361832 35,33 l 0,4.6875 C 34.069867,37.259411 33.060307,37 32,37 L 9,37 9,30 c 0,-5.60609 4.050373,-10 9,-10 z m 30,0 4,0 c 6.043676,0 11,5.47378 11,13 0,2.009661 0,4.023816 0,6.03125 -0.251164,0.237363 -0.495555,0.475252 -0.71875,0.75 C 60.845717,41.54836 60,44.04215 60,47 l 0,5 c 0,2.9578 0.845717,5.4204 2.28125,7.1875 C 62.508873,59.467697 62.743321,59.757384 63,60 l 0,7 c 0,7.5263 -4.956311,13 -11,13 l -4,0 C 41.956311,80 37,74.5263 37,67 l 0,-7 c 0.256679,-0.242616 0.491127,-0.532303 0.71875,-0.8125 C 39.154283,57.4204 40,54.9578 40,52 l 0,-5 C 40,44.04215 39.154283,41.54836 37.71875,39.78125 37.491127,39.501051 37.256679,39.241295 37,39 l 0,-6 C 37,25.47378 41.956324,20 48,20 z M 58.53125,20 82,20 c 4.949627,0 9,4.39391 9,10 l 0,7 -23,0 c -1.060307,0 -2.069867,0.259411 -3,0.6875 L 65,33 C 65,27.361832 62.410755,22.564948 58.53125,20 z M 9,39 32,39 c 1.641597,0 3.092532,0.68336 4.1875,2.03125 C 37.282468,42.37914 38,44.41785 38,47 l 0,5 c 0,2.5822 -0.717532,4.5896 -1.8125,5.9375 C 35.092532,59.2854 33.641597,60 32,60 L 9,60 z m 59,0 23,0 0,21 -23,0 C 66.358403,60 64.907468,59.2854 63.8125,57.9375 62.717532,56.5896 62,54.5822 62,52 l 0,-5 c 0,-2.58215 0.717532,-4.62086 1.8125,-5.96875 C 64.907468,39.68336 66.358403,39 68,39 z M 35,61.34375 35,67 c 0,5.625803 2.572319,10.430848 6.4375,13 L 18,80 C 13.050373,80 9,75.6061 9,70 l 0,-8 23,0 c 1.060307,0 2.069867,-0.220772 3,-0.65625 z m 30,0 C 65.930133,61.779228 66.939693,62 68,62 l 23,0 0,8 c 0,5.6061 -4.050373,10 -9,10 L 58.5625,80 C 62.427681,77.430848 65,72.625803 65,67 z"
                      transform="translate(0,952.36218)"
                    />
                  </g>
                </svg>
              </div>
            </div>
            <div class="Cbody">
              <p>{{ formatedCard.cardNumber }}</p>
            </div>
            <div class="Cfooter">
              <VCol>
                <p class="cor-text text-size">
                  {{ formatedCard.cardName }}
                </p>
              </VCol>
              <div>
                <span class="cor-text text-xs">EXPIRA</span>

                <p
                  v-if="formatedCard.monthSelection"
                  class="cor-text"
                >
                  {{ formatedCard.monthSelection }} / {{ formatedCard.yearSelection }}
                </p>
              </div>
            </div>
          </div>
          <div class="back">
            <div class="strip" />
            <div class="cvv-container">
              <p>cvv: {{ formatedCard.cvv }}</p>
              <div class="cvv-strip" />
            </div>
          </div>
        </div>
      </div>
    </VCol>
  </VRow>

  <VRow>
    <VCol cols="12">
      <AppTextField
        id="cardNumber"
        v-model="formatedCard.cardNumber"

        label="Número do Cartão"
        maxlength="19"
        type="text"
        :rules="[validationFunction(formatedCard.cardNumber, 'Número do Cartão')]"

        @keyup="inputFormat"
      >
        <template
          #append-inner
        >
          <div
            v-bind="tooltipProps"
            class="  custom-image"
          >
            <img
              v-if="cardTypeIcon"
              class="imgsrc"
              :src="cardTypeIcon"
            >
            <img
              v-else
              class="imgsrc"
              src="@/assets/images/payments/default.png"
            >
          </div>
        </template>
      </AppTextField>
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="12"
    >
      <AppTextField
        v-model="formatedCard.cardName"
        label="Nome impresso no cartão"
        class="form-control-sm"
        :rules="[validationFunction(formatedCard.cardName, 'Nome')]"
      />
    </VCol>
  </VRow>
  <VRow>
    <VCol
      cols="6"
      md="4"
      style="
    display: flex;
    align-items: flex-end;"
    >
      <VSelect
        v-model="formatedCard.monthSelection"
        name="expirationDate__month"
        label="Mês"
        :rules="[validationFunction(formatedCard.monthSelection, 'Mês')]"
        :items="Months"
      />
    </VCol>

    <VCol
      cols="6"
      md="4"
      style="
    display: flex;
    align-items: flex-end;"
    >
      <VSelect
        v-model="formatedCard.yearSelection"
        :rules="[validationFunction(formatedCard.yearSelection, 'Ano')]"
        label="Ano"
        :items="years"
      />
    </VCol>

    <VCol
      cols="6"
      md="4"
    >
      <AppTextField
        id="cvvInput"
        v-model="formatedCard.cvv"
        label="CVV"
        maxlength="4"
        :rules="[validationFunction(formatedCard.cvv, 'CVV')]"
        @input="onCvvInput"
        @focus="fcs"
        @blur="blr"
      >
        <template #append-inner>
          <VTooltip
            text="Card Verification Value"
            location="bottom"
          >
            <template #activator="{ props: tooltipProps }">
              <VIcon
                v-bind="tooltipProps"
                size="20"
                icon="tabler-help"
              />
            </template>
          </VTooltip>
        </template>
      </AppTextField>
    </VCol>
  </VRow>

  <div id="app">
    <div class="card">
      <div class="container">
        <!--      era aqui -->
      </div>
    </div>
  </div>
</template>

<style>
@import url("https://fonts.googleapis.com/css?family=Roboto&display=swap");

.text-size{
  font-size: small;
}

.cor-text{
  color:#ffffff;

}
.custom-image {
  padding-top: 0 !important; /* Use !important para garantir que sua regra seja aplicada */
}

.imgsrc{
  width: 50px;
  height: 30px;
  user-select: none;
}

.card--credit__card {
  width: 350px;
  height: 200px;
  border-radius: 10px;
  background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRtX-QkYwDKEXw_jriWgI5vplXUadOusPHRitOZKZCfBqJqK7IU");
  background-size: cover;
  position: relative;
  z-index: 2;

}

.date--expiration {
  width: 90%;
  height: 50px;
  margin: 20px 0px 0px 0px;
  padding: 0px 5px 0px 5px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date--expiration input {
  width: 100px;
}

select {
  width: 100px;
  height: 33px;
  border: 2px solid #ccc;
  outline: none;
  border-radius: 5px;
}

.card__logo {
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
  pointer-events: none;
  margin-right: 5px;
  margin-top: 5px;
}

img {
  width: 60px;
  height: 40px;
  user-select: none;
}

.visa {
  width: 58px;
  height: 25px;
}

.elo {
  height: 27px;
}

.Cheader {
  width: 100%;
  height: 30%;
  display: flex;
  justify-content: space-between;
  align-content: center;
  flex-direction: row-reverse;
}

.card__chip {
  width: 55px;
  height: 40px;
  background: #D4AF37;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 7px;
  margin-left: 5px;
  margin-top: 5px;
}

.card__chip svg {
  width: 58px;
  height: 80px;
  position: relative;
  top: 7px;
}

.Cbody {
  width: 100%;
  height: 33px;
  position: absolute;
  bottom: 40%;
  display: flex;
  align-items: center;
}

.Cbody p {
  font-size: 25px;
  margin-left: 8%;
  color: white;
}

.Cfooter {
  width: 95%;
  height: 33px;
  position: absolute;
  bottom: 6%;
  margin-left: 5px;
  display: flex;
  align-items: center;
}

.Cfooter .name {
  width: 70%;
  height: 100%;
  color: white;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0;
  padding: 0;
}

.name p {
  position: absolute;
  left: 0;
  top: 0;
}

.name span {
  font-size: 10px;
  position: absolute;
  left: 0;
  top: 0;
}

.expiration__data {
  width: 30%;
  height: 100%;
  color: white;
}

.expiration__data p {
  position: absolute;
  right: 0;
  top: 0;
}

.expiration__data span {
  font-size: 10px;
  position: absolute;
  right: 0;
  top: 0;
}

.card-container {
  /*position: relative;*/
  width: 350px;
  height: 200px;
  z-index: 2;

  top: 110px
}

.card--credit__card {
  transition: 1s ease;
  transform-style: preserve-3d;
}

.cvv-active {
  transform: rotateY(180deg);
}

.front {
  width: 350px;
  height: 200px;
}

.front,
.back {
  position: absolute;
  backface-visibility: hidden;
}

.back {
  width: 350px;
  height: 200px;
  color: white;
  transform: rotateY(180deg);
  border-radius: 10px;
  background: url("https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcRtX-QkYwDKEXw_jriWgI5vplXUadOusPHRitOZKZCfBqJqK7IU");
  background-size: cover;
  z-index: 2;
  -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  -moz-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
}

.strip {
  width: 100%;
  height: 40px;
  background: linear-gradient(135deg, #404040, #1a1a1a);
  position: relative;
  top: 25px;
}

.cvv-container {
  width: 90%;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.cvv-container p {
  z-index: 2;
  position: absolute;
  left: 65%;
  top: 25%;
  color: black;
  margin: 0;
}

.cvv-container .cvv-strip {
  width: 100%;
  height: 35px;
  background: white;
  position: absolute;
  top: 5%;
}
</style>
