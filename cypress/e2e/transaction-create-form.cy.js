import dayjs from 'dayjs';
import { Guid } from 'guid-typescript';

describe('Transaction Creation Form', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/dashboard/transactions/create');
  });

  it('form should open with empty fields', () => {
    cy.getByData('transaction-date').should('have.value', '');
    cy.getByData('transaction-amount').should('have.value', '');
    cy.getByData('transaction-description').should('have.value', '');
    cy.getByData('transaction-tags').should('have.value', '');
  });

  it('date field is mandatory', () => {
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-tags').type('Rada George{enter}');
    cy.getByData('transaction-description').type('test description');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });

  it('tag field is mandatory', () => {
    cy.getByData('transaction-date').type('2024-04-03');
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags')
      .errorMessage()
      .should('exist')
      .contains('You must select at least one tag');
  });

  it('four tags at most', () => {
    //try with existing tags
    cy.getByData('transaction-tags').type('DIGI{enter}');
    cy.getByData('transaction-tags').type('OTL{enter}');
    cy.getByData('transaction-tags').type('Wikipedia{enter}');
    cy.getByData('transaction-tags').type('Ratuc{enter}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags').errorMessage().should('not.exist');
    cy.getByData('transaction-tags').type('Fulger Taxi{enter}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags')
      .errorMessage()
      .should('exist')
      .contains('You can select 4 tags, at most');
    cy.getByData('transaction-tags').focus();
    cy.get('[data-testid=CloseIcon]').parent().click();
    //try with new tags
    cy.getByData('transaction-tags').type('test tag 1{enter}');
    cy.getByData('transaction-tags').type('test tag 2{enter}');
    cy.getByData('transaction-tags').type('test tag 3{enter}');
    cy.getByData('transaction-tags').type('test tag 4{enter}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags').errorMessage().should('not.exist');
    cy.getByData('transaction-tags').type('test tag 5{enter}');
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
    cy.getByData('transaction-tags').type('{enter}');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-tags').errorMessage().should('not.exist');
    cy.getByData('transaction-tags').focus();
    cy.get('[data-testid=CloseIcon]').parent().click();
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
    cy.getByData('transaction-amount').type('100000');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-amount')
      .errorMessage('transaction-amount')
      .should('not.exist');
    cy.getByData('transaction-amount').clear().type('100001');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-amount')
      .errorMessage()
      .should('exist')
      .contains('Please enter an amount lower than 100000.');
  });

  it('amount is -100000 at least', () => {
    cy.getByData('transaction-amount').type('-100000');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-amount').errorMessage().should('not.exist');
    cy.getByData('transaction-amount').clear().type('-100001');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-amount')
      .errorMessage()
      .should('exist')
      .contains('Please enter an amount greater than -100000.');
  });

  it('description is not mandatory', () => {
    cy.getByData('transaction-amount').type('12.34');
    let testTag = Guid.create().toString();
    let today = dayjs();
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('transaction-date').type(today.format('YYYY-MM-DD'));
    cy.getByData('edit-submit').click();
    cy.location('pathname').should('eq', '/dashboard/transactions');
    cy.getByData('fromDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('toDate').type(today.format('YYYY-MM-DD'));
    cy.getByData('transactionsTable')
      .find('tbody tr')
      .find('.MuiChip-label')
      .contains(testTag)
      .should('exist');
  });

  it('description is shorter than 500 chars', () => {
    for (let i = 0; i < 5; i++) {
      cy.getByData('transaction-description').type(
        '0123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789',
      );
    }
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-description').errorMessage().should('not.exist');
    cy.getByData('transaction-description').type('0');
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-description')
      .errorMessage()
      .should('exist')
      .contains('Description should be 500 characters at most');
  });

  it('cannot create transaction without year', () => {
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    cy.getByData('transaction-date').type('{rightArrow}1111');
    let testTag = Guid.create().toString();
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });

  it('cannot create transaction without month', () => {
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    cy.getByData('transaction-date').type('2024{rightArrow}11');
    let testTag = Guid.create().toString();
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });

  it('cannot create transaction without day', () => {
    cy.getByData('transaction-amount').type('12.34');
    cy.getByData('transaction-description').type('test description');
    cy.getByData('transaction-date').type('202411');
    let testTag = Guid.create().toString();
    cy.getByData('transaction-tags').type(`${testTag}{enter}`);
    cy.getByData('edit-submit').click();
    cy.getByData('transaction-date')
      .errorMessage()
      .should('exist')
      .contains('The selected date is invalid.');
  });
});
