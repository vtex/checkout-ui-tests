export function removeUnavailablePickups() {
  cy.get('#remove-unavailable-items').click()
  cy.wait('@itemsUpdateRequest')
}
