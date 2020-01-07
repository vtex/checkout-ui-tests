const BASE_URL = "http://vtexgame1.vtexlocal.com.br:3000/"
const BASE_URL_COMPLETE = "http://vtexgame1.vtexlocal.com.br/"
const ADD_SKUS_ENDPOINT = "/checkout/cart/add?"
const CHECKOUT_ENDPOINT = "/checkout"
const PROFILE_ENDPOINT = "/api/checkout/pub/profiles/"

const ACCOUNT_NAMES = {
  DEFAULT: "vtexgame1",
  CLEAN_NO_MAPS: "vtexgame1clean",
  GEOLOCATION: "vtexgame1geo",
  NO_LEAN: "vtexgame1nolean",
  INVOICE: "vtexgame1invoice",
}

const SKU_DELIVERY_CUSTOMIZATION_ATTACHMENT = "31"
const SKU_DELIVERY_AND_PICKUP = "35"
const SKU_PICKUP_1_SLA = "285"
const SKU_DELIVERY_MULTIPLE_SLA = "289"
const SKU_DELIVERY_MULTIPLE_SLA_AND_PICKUP_AT_PORTO_ALEGRE = "290"
const SKU_SCHEDULED_DELIVERY = "291"
const SKU_SCHEDULED_PICKUP = "296"
const SKU_PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA = "298"
const SKU_SCHEDULED_DELIVERY_AND_DELIVERY_MULTIPLE_SLA = "299"
const SKU_PICKUP = "312"

const ENV_BASE_URLS = {
  local: (accountName, workspace) =>
    `http://${
      workspace ? workspace + "--" : ""
    }${accountName}.vtexlocal.com.br`,
  beta: (accountName, workspace) =>
    `https://${
      workspace ? workspace + "--" : ""
    }${accountName}.vtexcommercebeta.com.br`,
  stable: (accountName, workspace) =>
    `https://${
      workspace ? workspace + "--" : ""
    }${accountName}.vtexcommercestable.com.br`,
}

function getBaseURL({ accountName, environment, workspace }) {
  return ENV_BASE_URLS[environment](accountName, workspace)
}

function getAccountName(type) {
  return ACCOUNT_NAMES[type]
}

module.exports = {
  BASE_URL,
  BASE_URL_COMPLETE,
  ADD_SKUS_ENDPOINT,
  CHECKOUT_ENDPOINT,
  PROFILE_ENDPOINT,
  ENV_BASE_URLS,
  ACCOUNT_NAMES,
  getAccountName,
  getBaseURL,
  SKU_DELIVERY_CUSTOMIZATION_ATTACHMENT,
  SKU_DELIVERY_AND_PICKUP,
  SKU_PICKUP_1_SLA,
  SKU_DELIVERY_MULTIPLE_SLA,
  SKU_DELIVERY_MULTIPLE_SLA_AND_PICKUP_AT_PORTO_ALEGRE,
  SKU_SCHEDULED_DELIVERY,
  SKU_SCHEDULED_PICKUP,
  SKU_PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA,
  SKU_SCHEDULED_DELIVERY_AND_DELIVERY_MULTIPLE_SLA,
  SKU_PICKUP,
}
