Cypress._.times(5, () => {
    it('testa a página de política de privacidade de forma independente', () => {
        cy.visit('./src/privacy.html')

        cy.contains('Talking About Testing').should('be.visible')
    })
})