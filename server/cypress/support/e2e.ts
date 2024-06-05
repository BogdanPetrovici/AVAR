import './commands';

Cypress.on('uncaught:exception', (err, runnable) => {
  if ('digest' in err && err.digest === 'NEXT_NOT_FOUND') {
    return false;
  }

  return true;
});
