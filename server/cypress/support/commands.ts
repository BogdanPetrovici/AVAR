/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    getByData(dataTestAttribute: string): Chainable<JQuery<HTMLElement>>;
    errorMessage(): Chainable<JQuery<HTMLElement>>;
    login(): Chainable<JQuery<HTMLElement>>;
  }
}

Cypress.Commands.add('getByData', (selector) => {
  return cy.get(`[data-test=${selector}]`);
});

Cypress.Commands.add('errorMessage', { prevSubject: true }, (subject) => {
  return cy.wrap(subject).parent().parent().find('.Mui-error');
});

Cypress.Commands.add('login', () => {
  cy.session('User Authentication', () => {
    const maxAge = 30 * 24 * 60 * 60;
    const expiration = Math.round(Date.now() / 1000 + maxAge);
    cy.setCookie(
      'authjs.session-token',
      'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiSEotYksxNVRRM0dNTGxBMWNjREVFX3F1NVVKbFJ1VW9aTFdjRk1vLUxBdmtFN1NBdURUUUkyU0d5NXRsNjY1LW8zWXhxMnFEd1oyQ3RkT2duckUyOUEifQ..Eh23pCUw557x17h6_QB4HQ._mcDLeeF_2r1ulO7O3kKLGe2tfC1idtoQ2-YqhAmaTtEdi_1g0EtHEST0bh8Xcx6SilJrK6y4G3RFxw6eHRsQr8k5O3tinbLXNFnPrcYwqCG8798mcjpcqkTPj3btq7TPvIGS5wNTwulCzWKog8NbJfZ6KgmD-9_W6SoI0FcldFHvGg1KawwcYnu0p2sVv3AlbKaee71wdSKh_0R4MgRIJ4cE3bnFZuY_hzyBUoruf0.gXf4cTRB5VwfH7ypYyxWuT0xGyRmxjdONf9xZi0SFkM',
      { expiry: expiration },
    );
  });

  cy.visit('/dashboard');
});
