import {
  ADD_SKUS_ENDPOINT,
  BASE_URL,
  PROFILE_ENDPOINT,
  getBaseURL,
  CHECKOUT_ENDPOINT,
  BASE_WORKSPACE
} from "./constants";

const VTEX_ENV = process.env.VTEX_ENV || "local";

const BASE_CONFIG = {
  accountName: "vtexgame1",
  environment: "beta",
  workspace: BASE_WORKSPACE
};

export function setup({ mobile = false, isGiftList = false, skus }) {
  let url = "";
  if (isGiftList) {
    url = getAddGiftListEndpoint(getAddSkusEndpoint(...skus), "21");
  } else {
    url = getAddSkusEndpoint(...skus);
  }
  cy.server();
  cy.route({
    method: "POST",
    url: "/api/checkout/**"
  }).as("checkoutRequest");
  cy.route({
    method: "GET",
    url: "/api/checkout/**"
  }).as("checkoutRequest");

  if (Cypress.env("isLogged")) {
    cy.route({
      method: "GET",
      url: "/api/vtexid/**"
    }).as("vtexId");
  }

  if (mobile) {
    cy.viewport(414, 736);
  } else {
    cy.viewport(1280, 800);
  }

  cy.visit(url);

  return cy;
}

export function visitAndClearCookies() {
  cy.visit(getBaseURL(BASE_CONFIG) + CHECKOUT_ENDPOINT);
  cy.clearCookies();
  cy.clearLocalStorage();
}

export function getAddSkusEndpoint() {
  deleteAllCookies();
  return Array.from(arguments).reduce(
    (acumulatedSkus, sku, index) =>
      `${acumulatedSkus}${index > 0 ? "&" : ""}sku=${sku}&qty=1&seller=1&sc=1`,
    getBaseURL(BASE_CONFIG) + ADD_SKUS_ENDPOINT
  );
}

export function getAddGiftListEndpoint(url, giftRegistry) {
  deleteAllCookies();
  return url + `&gr=${giftRegistry}`;
}

export function identityPurchase(email) {
  deleteAllCookies();
  cy.request(`${BASE_URL}${PROFILE_ENDPOINT}?email=${email}&sc=1`).as(
    "@checkoutRequest"
  );
}

export function deleteAllCookies() {
  cy.clearCookies("https://vtexgame1.myvtex.com");
  cy.clearCookies("https://io.vtexpayments.com.br");
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}
