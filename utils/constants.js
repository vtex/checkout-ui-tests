const BASE_URL = "http://vtexgame1.vtexlocal.com.br:3000/"
const BASE_URL_COMPLETE = "http://vtexgame1.vtexlocal.com.br/"
const ADD_SKUS_ENDPOINT = "/checkout/cart/add?"
const CHECKOUT_ENDPOINT = "/checkout"
const PROFILE_ENDPOINT = "/api/checkout/pub/profiles/"
const BASE_WORKSPACE = "beta"

const ACCOUNT_NAMES = {
  DEFAULT: "vtexgame1",
  CLEAN_NO_MAPS: "vtexgame1clean",
  GEOLOCATION: "vtexgame1geo",
  NO_LEAN: "vtexgame1nolean",
  INVOICE: "vtexgame1invoice",
}

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
  BASE_WORKSPACE,
  ENV_BASE_URLS,
  ACCOUNT_NAMES,
  getAccountName,
  getBaseURL,
}
