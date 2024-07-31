import { isEmpty, isEmptyArray, isNullOrUndefined } from './index'
import i18n from "@/plugins/i18n";
const $t = i18n.global.t
// 👉 Required Validator
export const requiredValidator = (value: unknown, field: string) => {
  field = field || 'field'
  if (isNullOrUndefined(value) || isEmptyArray(value) || value === false)
    return $t('validators.required', {field})
  return !!String(value).trim().length || $t('validators.required', {field})
}

// 👉 Email Validator
export const emailValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (Array.isArray(value))
    return value.every(val => re.test(String(val))) || 'The Email field must be a valid email'

  return re.test(String(value)) || 'The Email field must be a valid email'
}

// 👉 Password Validator
export const passwordValidator = (password: string) => {
  const regExp = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()]).{8,}/

  const validPassword = regExp.test(password)

  return (
    // eslint-disable-next-line operator-linebreak
    validPassword ||
    'Field must contain at least one uppercase, lowercase, special character and digit with min 8 chars'
  )
}

// 👉 Confirm Password Validator
export const confirmedValidator = (value: string, target: string, field: string) =>

  value === target || $t('validators.confirmed', {field})

// 👉 Between Validator
export const betweenValidator = (value: unknown, min: number, max: number) => {
  const valueAsNumber = Number(value)

  return (Number(min) <= valueAsNumber && Number(max) >= valueAsNumber) || `Enter number between ${min} and ${max}`
}

// 👉 Integer Validator
export const integerValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  if (Array.isArray(value))
    return value.every(val => /^-?[0-9]+$/.test(String(val))) || 'This field must be an integer'

  return /^-?[0-9]+$/.test(String(value)) || 'This field must be an integer'
}

// 👉 Regex Validator
export const regexValidator = (value: unknown, regex: RegExp | string): string | boolean => {
  if (isEmpty(value))
    return true

  let regeX = regex
  if (typeof regeX === 'string')
    regeX = new RegExp(regeX)

  if (Array.isArray(value))
    return value.every(val => regexValidator(val, regeX))

  return regeX.test(String(value)) || 'The Regex field format is invalid'
}

// 👉 Alpha Validator
export const alphaValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  return /^[A-Z]*$/i.test(String(value)) || 'The Alpha field may only contain alphabetic characters'
}

// 👉 URL Validator
export const urlValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const re = /^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/

  return re.test(String(value)) || 'URL is invalid'
}

// 👉 Length Validator
export const lengthValidator = (value: unknown, length: number) => {
  if (isEmpty(value))
    return true

  return String(value).length === length || `The Min Character field must be at least ${length} characters`
}

// 👉 Alpha-dash Validator
export const alphaDashValidator = (value: unknown) => {
  if (isEmpty(value))
    return true

  const valueAsString = String(value)

  return /^[0-9A-Z_-]*$/i.test(valueAsString) || 'All Character are not valid'
}

export const min = (value: unknown, min: number, field: string) => {
  if (isEmpty(value))
    return true

  return String(value).length >= min || $t('validators.min', { field: `${field}`, min: `${min}` })
}


export const cpfCnpjValidator = (value: string) => {
  if (isEmpty(value))
    return true

  const cleanedValue = value.replace(/[^\d]+/g, ''); // Remove caracteres não numéricos

  if (cleanedValue.length === 11) {
    // CPF
    if (/^(\d)\1{10}$/.test(cleanedValue)) {
      return 'Invalid CPF';
    }

    let sum = 0;
    let weight = 10;

    for (let i = 0; i < 9; i++) {
      sum += parseInt(cleanedValue.charAt(i)) * weight;
      weight--;
    }

    const remainder = 11 - (sum % 11);
    const checkDigit = remainder > 9 ? 0 : remainder;

    if (parseInt(cleanedValue.charAt(9)) !== checkDigit) {
      return 'Invalid CPF';
    }

    sum = 0;
    weight = 11;

    for (let i = 0; i < 10; i++) {
      sum += parseInt(cleanedValue.charAt(i)) * weight;
      weight--;
    }

    const secondRemainder = 11 - (sum % 11);
    const secondCheckDigit = secondRemainder > 9 ? 0 : secondRemainder;

    if (parseInt(cleanedValue.charAt(10)) !== secondCheckDigit) {
      return 'Invalid CPF';
    }
  } else if (cleanedValue.length === 14) {
    // CNPJ
    let sum = 0;
    let weight = 5;

    for (let i = 0; i < 12; i++) {
      sum += parseInt(cleanedValue.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    const remainder = sum % 11;
    const firstDigit = remainder < 2 ? 0 : 11 - remainder;

    if (parseInt(cleanedValue.charAt(12)) !== firstDigit) {
      return 'Invalid CNPJ';
    }

    sum = 0;
    weight = 6;

    for (let i = 0; i < 13; i++) {
      sum += parseInt(cleanedValue.charAt(i)) * weight;
      weight = weight === 2 ? 9 : weight - 1;
    }

    const secondRemainder = sum % 11;
    const secondDigit = secondRemainder < 2 ? 0 : 11 - secondRemainder;

    if (parseInt(cleanedValue.charAt(13)) !== secondDigit) {
      return 'Invalid CNPJ';
    }
  } else {
    return 'Invalid CPF/CNPJ';
  }

  return true;
}
