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
      'eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2Q0JDLUhTNTEyIiwia2lkIjoiSEotYksxNVRRM0dNTGxBMWNjREVFX3F1NVVKbFJ1VW9aTFdjRk1vLUxBdmtFN1NBdURUUUkyU0d5NXRsNjY1LW8zWXhxMnFEd1oyQ3RkT2duckUyOUEifQ..RS4Avn3Gz_-y7g7A_AcedQ.Nm-Sl0WSPRYLYV3Lt4lsEOrsUcFuCPr1QeEXspwY_FwkJ9dePxGcShHr3_kspoVHXqFn1izb9fXio7ztAecIvpg8kfMPUfhHaMA4a4eVewHP8WAPTCFAgTPyjPaI0RwbRr8ID0AzlMd_YR5YJDsJWvDBMTkUciGwFn5P5Rw66AiAHK8r25eMI-0UPlni3McyRKF1LWJZoljL-AOwv-8sxa7zaJ5yG5y0A4-Bf7-V_YQ.h2lAWhjSr3sYf0F_RIym2XH57N_mMYMWq0lN1OO67DI',
      { expiry: expiration },
    );
  });

  cy.visit('/dashboard');
});
