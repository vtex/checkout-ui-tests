import { setup, visitAndClearCookies } from '../../utils'
import { ACCOUNT_NAMES, SKUS } from '../../utils/constants'
import {
  fillPickupLocation,
  goToShippingPreviewPickup,
} from '../../utils/shipping-actions'

describe('CHK-2201', () => {
  beforeEach(() => {
    visitAndClearCookies(ACCOUNT_NAMES.GEOLOCATION)
  })

  it('should keep the pickup selection when switching between pickup and delivery options using an address without an SLA for delivery.', () => {
    setup({
      skus: [SKUS.ONLY_PICKUP_2_SLA_RJ],
      account: ACCOUNT_NAMES.GEOLOCATION,
    })

    goToShippingPreviewPickup()
    cy.get('#find-pickup-link').click()
    fillPickupLocation({ address: 'Rua Marques de Olinda 106' })

    cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main').eq(1).click()
    cy.get('.pkpmodal-details-confirm-btn').click()
    cy.contains(
      'Retirar 1 item em Loja em Copacabana no Rio de Janeiro'
    ).should('be.visible')
    cy.get('.srp-toggle__delivery').click()
    cy.waitAndGet('#ship-addressQuery', 3000).type('Avenida João Wallig')
    cy.get('.pac-item').eq(1).trigger('mouseover')
    cy.get('.pac-item').eq(1).click()
    cy.waitAndGet('.srp-toggle__pickup', 3000).click()
    cy.get('.srp-toggle__delivery').click()
    cy.contains('Receber 1 item em Avenida João Wallig')
    cy.contains('Seu item não está disponível para receber no seu endereço.')
    cy.waitAndGet('.srp-toggle__pickup', 3000).click()
    cy.get('.srp-toggle__delivery').click()
    cy.waitAndGet('.srp-toggle__pickup', 3000).click()
    cy.contains(
      'Retirar 1 item em Loja em Copacabana no Rio de Janeiro'
    ).should('be.visible')
  })

  it('should keep the pickup selection when switching between pickup and delivery options using an address with an SLA for delivery.', () => {
    setup({
      skus: [SKUS.ONLY_PICKUP_2_SLA_RJ],
      account: ACCOUNT_NAMES.GEOLOCATION,
    })

    goToShippingPreviewPickup()
    cy.get('#find-pickup-link').click()
    fillPickupLocation({ address: 'Rua Marques de Olinda 106' })

    cy.get('.pkpmodal-points-list .pkpmodal-pickup-point-main').eq(1).click()
    cy.get('.pkpmodal-details-confirm-btn').click()
    cy.contains(
      'Retirar 1 item em Loja em Copacabana no Rio de Janeiro'
    ).should('be.visible')
    cy.get('.srp-toggle__delivery').click()
    cy.waitAndGet('#ship-addressQuery', 3000).type(
      'Rua General Azevedo Pimentel'
    )
    cy.get('.pac-item').first().trigger('mouseover')
    cy.get('.pac-item').first().click()
    cy.waitAndGet('.srp-toggle__pickup', 3000).click()
    cy.get('.srp-toggle__delivery').click()
    cy.contains('Receber 1 item em Rua General Azevedo Pimentel')
    cy.waitAndGet('.srp-toggle__pickup', 3000).click()
    cy.contains(
      'Retirar 1 item em Loja em Copacabana no Rio de Janeiro'
    ).should('be.visible')
  })
})
