/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
    errorMessage(): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('errorMessage', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).parent().parent().find('.Mui-error');
});
