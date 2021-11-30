export const BASE_URL = 'http://vtexgame1.vtexlocal.com.br:3000/'
export const BASE_URL_COMPLETE = 'http://vtexgame1.vtexlocal.com.br/'
export const ADD_SKUS_ENDPOINT = '/checkout/cart/add?'
export const CHECKOUT_ENDPOINT = '/checkout'
export const PROFILE_ENDPOINT = '/api/checkout/pub/profiles/'

export const ACCOUNT_NAMES = {
  DEFAULT: 'vtexgame1',
  CLEAN_NO_MAPS: 'vtexgame1clean',
  GEOLOCATION: 'vtexgame1geo',
  NO_LEAN: 'vtexgame1nolean',
  INVOICE: 'vtexgame1invoice',
  GEOLOCATION_INVOICE: 'vtexgame1geoinvoice',
}

export const SLA_IDS = {
  PICKUP: 'retirada-na-loja-141125d',
  SCHEDULED_PICKUP: 'pickup-141125d',
  MULTIPLE_PICKUP: 'retirada-na-loja-múltiplos-pontos-rj-141125d',
  SCHEDULED: 'agendada',
  CHEAPEST: 'cheapest',
  FASTEST: 'fastest',
}

export const SKUS = {
  DELIVERY_CUSTOMIZATION_ATTACHMENT: '31',
  DELIVERY_AND_PICKUP: '35',
  PICKUP_1_SLA: '285',
  DELIVERY_PORTO_ALEGRE: '308',
  DELIVERY_MULTIPLE_SLA: '289',
  DELIVERY_MULTIPLE_SLA_AND_PICKUP_AT_PORTO_ALEGRE: '290',
  SCHEDULED_DELIVERY: '291',
  SCHEDULED_PICKUP: '296',
  PICKUP_1_SLA_AND_DELIVERY_MULTIPLE_SLA: '298',
  SCHEDULED_DELIVERY_AND_DELIVERY_MULTIPLE_SLA: '299',
  GLOBAL_PRODUCT: '312',
  PICKUP_RJ: '307',
  PICKUP_RJ_BARRA: '331',
  PARAGUAY_DELIVERY: '369',
  POLYGON_ARGENTINA: '370',
}

export const ENV_BASE_URLS = {
  local: (accountName, workspace) =>
    `http://${
      workspace ? `${workspace}--` : ''
    }${accountName}.vtexlocal.com.br`,
  beta: (accountName, workspace) =>
    `https://${
      workspace ? `${workspace}--` : ''
    }${accountName}.vtexcommercebeta.com.br`,
  stable: (accountName, workspace) =>
    `https://${
      workspace ? `${workspace}--` : ''
    }${accountName}.vtexcommercestable.com.br`,
}

export function getBaseURL({ accountName, environment, workspace }) {
  return ENV_BASE_URLS[environment](accountName, workspace)
}

export function getAccountName(type) {
  return ACCOUNT_NAMES[type]
}
