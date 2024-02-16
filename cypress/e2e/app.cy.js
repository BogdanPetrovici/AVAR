import dayjs from 'dayjs';

describe('Transactions', () => {
  it('should open the transactions page with default filtering', () => {
    //Currently transactions are displayed on the index page
    cy.visit('/');

    const today = dayjs();
    let fromDate = today.subtract(100, 'day');

    // Check that the "from" date picker exists
    cy.get('input[data-testid="fromDate"]')
      .should('exist')
      .should('have.value', fromDate.format('DD/MM/YYYY'));

    cy.get('input[data-testid="toDate"]')
      .should('exist')
      .should('have.value', today.format('DD/MM/YYYY'));

    cy.get('table[data-testid="transactionsTable"]').should('exist');
    cy.get('table[data-testid="transactionsTable"] tbody tr').should(
      'have.length',
      66,
    );
  });

  it('should filter the available transactions according to date pickers', () => {
    cy.visit('/');
    cy.get('input[data-testid="fromDate"]').type('12/12/2023');
    cy.get('input[data-testid="toDate"]').type('16/12/2023');
    cy.get('button[data-testid="filterButton"]').click();
    cy.get('table[data-testid="transactionsTable"] tbody tr').should(
      'have.length',
      4,
    );
  });
});
