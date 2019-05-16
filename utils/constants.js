export const BASE_URL = "http://vtexgame1.vtexlocal.com.br:3000/";
export const BASE_URL_COMPLETE = "http://vtexgame1.vtexlocal.com.br/";
export const ADD_SKUS_ENDPOINT = "/checkout/cart/add?";
export const CHECKOUT_ENDPOINT = "/checkout";
export const PROFILE_ENDPOINT = "/api/checkout/pub/profiles/";
export const BASE_WORKSPACE = "beta";

export const DEFAULT_ACCOUNT_NAME = "vtexgame1";
export const NO_GOOGLE_MAPS_ACCOUNT_NAME = "vtexgame1clean";
export const GEOLOCATION_MAPS_ACCOUNT_NAME = "vtexgame1geo";

const LOCAL_PORT = process.env.PORT || 3000;

const ENV_BASE_URLS = {
  local: (accountName, workspace) =>
    `http://${
      workspace ? workspace + "--" : ""
    }${accountName}.vtexlocal.com.br`,
  beta: (accountName, workspace) =>
    `https://${
      workspace ? workspace + "--" : ""
    }${accountName}.vtexcommercebeta.com.br`,
  stable: accountName => `https://${accountName}.vtexcommercestable.com.br`
};

export function getBaseURL({ accountName, environment, workspace }) {
  return ENV_BASE_URLS[environment](accountName, workspace);
}

export const ACCOUNT_NAMES = {
  geolocation: GEOLOCATION_MAPS_ACCOUNT_NAME,
  clean: NO_GOOGLE_MAPS_ACCOUNT_NAME,
  default: DEFAULT_ACCOUNT_NAME
};

export function getAccountName(type) {
  return ACCOUNT_NAMES[type];
}
