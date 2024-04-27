import dayjs from 'dayjs';
import { Guid } from 'guid-typescript';

describe('Transaction Creation Form', () => {
  beforeEach(() => {
    cy.visit(
      '/transactions/20240325-46352667-2322-d648-61ab-596960d677b5/edit',
    );
  });

  it('form should open with values set', () => {
    cy.getByData('transaction-date').should('have.value', '2024-03-25');
    cy.getByData('transaction-amount').should('have.value', '-234.65');
    cy.getByData('transaction-description').should('have.value', 'test');
    cy.getByData('transaction-tags').should('have.value', '');
    cy.getByData('transaction-tags')
      .parent()
      .find('.MuiChip-label')
      .contains('Rada George');
    cy.getByData('transaction-tags')
      .parent()
      .find('.MuiChip-label')
      .contains('Wikipedia');
  });

  it('date is mandatory', () => {
    cy.getByData('transaction-date').type('{ctrl}{a}').clear();
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });

  it('tag field is mandatory', () => {
    cy.getByData('transaction-tags').focus();
    cy.get('[data-testid=CloseIcon]').parent().click();
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags')
      .errorMessage()
      .should('exist')
      .contains('You must select at least one tag');
  });

  it('four tags at most', () => {
    cy.getByData('transaction-tags').type('DIGI{enter}');
    cy.getByData('transaction-tags').type('OTL{enter}');
    cy.getByData('transaction-tags').type('Ratuc{enter}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags')
      .errorMessage()
      .should('exist')
      .contains('You can select 4 tags, at most');
  });

  it('maximum tag length is 50 characters', () => {
    for (let i = 0; i < 5; i++) {
      cy.getByData('transaction-tags').type('0123456789');
    }
    cy.getByData('transaction-tags').type('0{enter}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags')
      .errorMessage()
      .should('exist')
      .contains('Tags should have 50 characters, at most');
  });

  it('amount is 100000 at most', () => {
    cy.getByData('transaction-amount').clear().type('100001');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-amount')
      .errorMessage()
      .should('exist')
      .contains('Please enter an amount lower than 100000.');
  });

  it('amount is -100000 at least', () => {
    cy.getByData('transaction-amount').clear().type('-100001');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-amount')
      .errorMessage()
      .should('exist')
      .contains('Please enter an amount greater than -100000.');
  });

  it('description is shorter than 500 chars', () => {
    cy.getByData('transaction-description').clear();
    for (let i = 0; i < 5; i++) {
      cy.getByData('transaction-description').type(
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
      );
    }
    cy.getByData('transaction-description').type('0');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-description')
      .errorMessage()
      .should('exist')
      .contains('Description should be 500 characters at most');
  });

  it('editing date updates transaction id', () => {
    cy.getByData('transaction-date')
      .type('{ctrl}{a}')
      .clear()
      .type('2024-03-26');
    cy.getByData('edit-submit').click();
    cy.visit(
      '/transactions/20240326-46352667-2322-d648-61ab-596960d677b5/edit',
    );
    //transaction date field should exist if no errors - reset to previous value for future tests
    cy.getByData('transaction-date')
      .should('exist')
      .type('{ctrl}{a}')
      .clear()
      .type('2024-03-25');
    cy.getByData('edit-submit').click();
  });

  it('editing anything except date does not update id', () => {
    cy.getByData('transaction-amount').clear().type('-1');
    cy.getByData('transaction-description').clear().type('test for id update');
    cy.getByData('transaction-tags').focus();
    cy.get('[data-testid=CloseIcon]').parent().click();
    cy.getByData('transaction-tags').type('OTL{enter}');
    cy.getByData('edit-submit').click();

    cy.visit(
      '/transactions/20240325-46352667-2322-d648-61ab-596960d677b5/edit',
    );

    // put everything back
    cy.getByData('transaction-amount').should('exist').clear().type('-234.65');
    cy.getByData('transaction-description').clear().type('test');
    cy.getByData('transaction-tags').focus();
    cy.get('[data-testid=CloseIcon]').parent().click();
    cy.getByData('transaction-tags').type('Rada George{enter}');
    cy.getByData('transaction-tags').type('Wikipedia{enter}');
    cy.getByData('edit-submit').click();
  });

  it('clicking delete removes transaction', () => {
    //create transaction
    cy.visit('/transactions/create');
    cy.getByData('transaction-amount').type('12.34');
    let testTag = Guid.create().toString();
    let today = dayjs();
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('transaction-date').type(today.format('YYYY-MM-DD'));
    cy.getByData('edit-submit').click();
    cy.getByData('fromDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('toDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .parent()
      .parent()
      .parent()
      .find('a')
      .click();
    cy.getByData('delete-submit').click();
    cy.getByData('delete-form').click();
    cy.location('pathname').should('eq', '/transactions');
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .should('not.exist');
  });

  it('cancelling delete does not remove transaction', () => {
    //create transaction
    cy.visit('/transactions/create');
    cy.getByData('transaction-amount').type('12.34');
    let testTag = Guid.create().toString();
    let today = dayjs();
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('transaction-date').type(today.format('YYYY-MM-DD'));
    cy.getByData('edit-submit').click();
    cy.getByData('fromDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('toDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .parent()
      .parent()
      .parent()
      .find('a')
      .click();
    cy.getByData('delete-submit').click();
    cy.getByData('cancel-delete').click();
    //no redirection
    cy.location('pathname').should('contain', '/edit');
    cy.visit('/transactions');
    //transaction still exists
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .should('exist');
  });

  it('if transaction not found display 404 error page', () => {
    cy.visit(
      '/transactions/00000000-00000000-0000-0000-0000-000000000000/edit',
      { failOnStatusCode: false },
    );
    cy.getByData('redirect-button').should('exist');
    cy.getByData('not-found-title').should('exist').contains('404 Not Found');
    cy.getByData('not-found-text')
      .should('exist')
      .contains('Could not find the requested transaction.');
  });

  it('cannot remove year from transaction date', () => {
    cy.visit('/transactions/create');
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    let testTag = Guid.create().toString();
    let today = dayjs();
    cy.getByData('transaction-date').type(today.format('YYYY-MM-DD'));
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('edit-submit').click();
    cy.getByData('fromDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('toDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .parent()
      .parent()
      .parent()
      .find('a')
      .click();
    cy.getByData('transaction-date').click().type('{del}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });

  it('cannot remove month from transaction date', () => {
    cy.visit('/transactions/create');
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    let testTag = Guid.create().toString();
    let today = dayjs();
    cy.getByData('transaction-date').type(today.format('YYYY-MM-DD'));
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('edit-submit').click();
    cy.getByData('fromDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('toDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .parent()
      .parent()
      .parent()
      .find('a')
      .click();
    cy.getByData('transaction-date').click().type('{rightArrow}{del}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });

  it('cannot remove day from transaction date', () => {
    cy.visit('/transactions/create');
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    let testTag = Guid.create().toString();
    let today = dayjs();
    cy.getByData('transaction-date').type(today.format('YYYY-MM-DD'));
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('edit-submit').click();
    cy.getByData('fromDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('toDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .parent()
      .parent()
      .parent()
      .find('a')
      .click();
    cy.getByData('transaction-date')
      .click()
      .type('{rightArrow}{rightArrow}{del}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });
});
