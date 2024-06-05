describe('Authentication', () => {
  it('should reach the transactions page after logging in', () => {
    cy.login();
    cy.visit('/dashboard/transactions');
    cy.location('pathname').should('eq', '/dashboard/transactions');
  });

  it('should be redirected to login page if not logged in', () => {
    cy.visit('/dashboard/transactions');
    cy.location('pathname').should('eq', '/login');
  });

  it('should be redirected to login page after logging out', () => {
    cy.login();
    cy.visit('/dashboard/transactions');
    cy.location('pathname').should('eq', '/dashboard/transactions');
    cy.getByData('logout-button').click();
    cy.location('pathname').should('eq', '/login');
  });
});
