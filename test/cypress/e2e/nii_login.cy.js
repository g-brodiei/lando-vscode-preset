describe('Login Flow', () => {
  // Verify login page contents.
  it('Check page content', () => {
    cy.visit('/user/login');
    cy.get('h1').should('contain', '使用者登入');
    cy.get('span.description').should('contain', '請於下方輸入您的登入資訊。');
    cy.get('.form-item-name label').should('contain', '使用者帳號');
    cy.get('.form-item-pass label').should('contain', '密碼');
    cy.get('#edit-submit').contains('登入');
  })

  // Verify login as admin.
  it('Login as Admin', () => {
    cy.createUser(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword'), Cypress.env('cyAdminRole'));
    cy.get('#edit-name').type(Cypress.env('cyAdminUser')).should('have.value', Cypress.env('cyAdminUser'));
    cy.get('#edit-pass').type(Cypress.env('cyAdminPassword')).should('have.value', Cypress.env('cyAdminPassword'));
    cy.get('.field-prefix').invoke('text').as('calculate');
    cy.get('@calculate').then((calculate) => {
      const captcha = eval(calculate.slice(0, calculate.length - 1));
      cy.get('#edit-captcha-response').type(captcha);
    });
    cy.get('#edit-submit').click();
    cy.contains('admin');
    cy.visit('/user/logout')
    cy.get('h1').should('contain.text', '使用者登入');
    cy.deleteUser(Cypress.env('cyAdminUser'));
  })

})
