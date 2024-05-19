import dayjs from 'dayjs';

describe('Transactions Table', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard/transactions');
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
    cy.location('pathname').should('eq', '/dashboard/transactions/create');
  });

  it('opens transaction update form when clicking update button', () => {
    cy.getByData('fromDate').type('2023-12-12');
    cy.getByData('toDate').type('2023-12-16');
    cy.getByData('filterButton').click();
    cy.getByData('transactionsTable').find('tbody tr').eq(0).find('a').click();
    cy.location('pathname').should(
      'to.match',
      /^\/dashboard\/transactions\/[0-9a-f-]+\/edit/,
    );
  });

  it('should filter the available transactions according to transaction filter', () => {
    cy.getByData('fromDate').type('2023-12-12');
    cy.getByData('toDate').type('2023-12-16');
    cy.getByData('filterButton').click();
    cy.getByData('transactionsTable').get('tbody tr').should('have.length', 4);
  });

  it('filtering with start date greater than end date shows validation error', () => {
    cy.getByData('fromDate').type('2023-12-17');
    cy.getByData('toDate').type('2023-12-16');
    cy.getByData('filterButton').click();
    cy.getByData('filter-error')
      .should('exist')
      .contains('End date should be more recent than start date');
  });

  it('querying with start date greater than end date returns empty resultset and shows validation error', () => {
    cy.visit('/dashboard/transactions?from=2024-04-29&to=2024-04-28');
    cy.getByData('filter-error')
      .should('exist')
      .contains('End date should be more recent than start date');
    cy.getByData('transactionsTable').get('tbody tr').should('have.length', 0);
  });

  it('clicking next button displays next page in transactions table', () => {
    cy.visit('/dashboard/transactions?from=2023-12-01&to=2023-12-09');
    cy.getByData('transactionsTable').get('tbody tr').should('have.length', 10);
    cy.getByData('next-page-button-disabled').should('not.exist');
    cy.getByData('next-page-button-active').should('exist').click();
    cy.getByData('transactionsTable').get('tbody tr').should('have.length', 4);
    cy.getByData('next-page-button-active').should('not.exist');
    cy.getByData('next-page-button-disabled').should('exist');
  });
});
