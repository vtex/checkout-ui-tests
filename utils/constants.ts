import { vtexEnv } from './environment'

export const BASE_URL = 'http://vtexgame1.vtexlocal.com.br:3000/'
export const BASE_URL_COMPLETE = 'http://vtexgame1.vtexlocal.com.br/'
export const ADD_SKUS_ENDPOINT = '/checkout/cart/add?'
export const CHECKOUT_ENDPOINT = '/checkout'
export const PROFILE_ENDPOINT = '/api/checkout/pub/profiles/'
export const DEFAULT_SELLER_ID = '1'
export const DEFAULT_SALES_CHANNEL = '1'

export const Accounts = {
  CLEAN_NO_MAPS: 'vtexgame1clean',
  DEFAULT: 'vtexgame1',
  GEOLOCATION: 'vtexgame1geo',
  GEOLOCATION_INVOICE: 'vtexgame1geoinvoice',
  GEOLOCATION_NO_LEAN: 'vtexgame1geonolean',
  INVOICE: 'vtexgame1invoice',
  NO_LEAN: 'vtexgame1nolean',
}

export { Accounts as ACCOUNT_NAMES }

export const SLAIds = {
  PICKUP: 'retirada-na-loja-141125d',
  SCHEDULED_PICKUP: 'pickup-141125d',
  MULTIPLE_PICKUP: 'retirada-na-loja-múltiplos-pontos-rj-141125d',
  SCHEDULED: 'agendada',
  CHEAPEST: 'cheapest',
  FASTEST: 'fastest',
}

export { SLAIds as SLA_IDS }

export const SKUs = {
  DELIVERY_CUSTOMIZATION_ATTACHMENT: '31',
  DELIVERY_AND_PICKUP: '35',
  PICKUP_1_SLA: '285',
  PICKUP_1_SLA_DELIVERY_1_SLA: '297',
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
  GIFT_CARD: '324',
  DELIVERY_NORTHEAST: '98729706',
  ONLY_PICKUP_2_SLA_RJ: '341',
}

export { SKUs as SKUS }

// The following constants depend on the version of the order placed page shown
// after checkout, so we check which environment we are running on and change
// accordingly. This way all tests will work on either environment.
export const DELIVERY_TEXT = vtexEnv === 'io' ? 'Entrega em casa' : 'Receber'
export const PICKUP_TEXT = vtexEnv === 'io' ? 'Retirada no ponto' : 'Retirar'
export const SCHEDULED_TEXT = 'Agendada'

export const PERU_TEXT = vtexEnv === 'io' ? 'PER' : 'Peru'
export const ARGENTINA_TEXT = vtexEnv === 'io' ? 'ARG' : 'Argentina'

/**
 * On the newer orderPlaced screen, we don't have the information about the Gift
 * Registry used on the order. So, when we run the tests using the "io" env,
 * which in turn uses this new screen, we should skip the assertions about gift
 * registry on orderPlaced.
 */
export const shouldAssertGiftRegistry = vtexEnv !== 'io'

const envBaseURLs = {
  local: (accountName: string, workspace: string) =>
    `http://${
      workspace ? `${workspace}--` : ''
    }${accountName}.vtexlocal.com.br`,
  beta: (accountName: string, workspace: string) =>
    `https://${
      workspace ? `${workspace}--` : ''
    }${accountName}.vtexcommercebeta.com.br`,
  stable: (accountName: string, workspace: string) =>
    `https://${
      workspace ? `${workspace}--` : ''
    }${accountName}.vtexcommercestable.com.br`,
  io: (accountName: string, workspace: string) =>
    `https://${workspace ?? 'master'}--${accountName}.myvtex.com`,
}

export function getBaseURL({
  accountName,
  environment,
  workspace,
}: {
  accountName: string
  workspace: string
  environment: keyof typeof envBaseURLs
}): string {
  return envBaseURLs[environment](accountName, workspace)
}

export function getAccountName(type: keyof typeof Accounts) {
  return Accounts[type]
}
