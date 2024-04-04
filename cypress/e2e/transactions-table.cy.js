import dayjs from 'dayjs';

describe('Transactions Table', () => {
  beforeEach(() => {
    cy.visit('/transactions');
  });

  it('should open with default filtering', () => {
    const today = dayjs();
    let fromDate = today.subtract(100, 'day');

    // Check that the "from" date picker exists
    cy.getByData('fromDate')
      .should('exist')
      .should('have.value', fromDate.format('YYYY-MM-DD'));

    cy.getByData('toDate')
      .should('exist')
      .should('have.value', today.format('YYYY-MM-DD'));

    cy.getByData('transactionsTable').should('exist');
  });

  it('should open transaction creation form when clicking create button', () => {
    cy.getByData('create-transaction-button').click();
    cy.location('pathname').should('eq', '/transactions/create');
  });

  it('opens transaction update form when clicking update button', () => {
    cy.getByData('fromDate').type('2023-12-12');
    cy.getByData('toDate').type('2023-12-16');
    cy.getByData('filterButton').click();
    cy.getByData('transactionsTable').find('tbody tr').eq(0).find('a').click();
    cy.location('pathname').should(
      'to.match',
      /^\/transactions\/[0-9a-f-]+\/edit/,
    );
  });

  it('should filter the available transactions according to transaction filter', () => {
    cy.getByData('fromDate').type('2023-12-12');
    cy.getByData('toDate').type('2023-12-16');
    cy.getByData('filterButton').click();
    cy.getByData('transactionsTable').get('tbody tr').should('have.length', 4);
  });
});
