
import {
  getSummaryTextFormat, getArticleBody, getArticleBodySourceBtnLocator
} from '../page-objects/create_article'

import {
  getContentTitle, getContentMessage, getCKEditorBodyLocator, clickBtnInsideCKEditorSummary, typeContentTag, getContentHeader, getContentTag, getSubmitButtonLocator,
} from '../page-objects/generic'

import {
  FORMAT_TYPE, SAVE_BTN_TEXT
} from '../fixtures/generic_testdata.js'

import {
  CONTENT_URL, ARTICLE_BODY, ARTICLE_TITLE, ARTICLE_TAG
} from '../fixtures/article_testdata.js'

describe('Test Article Creation Flow', function () {
  before(function () {
    cy.createUser(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword'), Cypress.env('cyAdminRole'));
  });

  it('Create and Verify the article using ui', function () {
    cy.login('admin');
    cy.visit(CONTENT_URL);
    getContentTitle().type(ARTICLE_TITLE, { force: true });
    cy.checkDefaultTextFormat(getSummaryTextFormat, FORMAT_TYPE);
    clickBtnInsideCKEditorSummary(getArticleBodySourceBtnLocator);
    cy.setValueByJQuery(getCKEditorBodyLocator, ARTICLE_BODY);
    typeContentTag(ARTICLE_TAG);
    cy.intercept('POST', '**/quickedit/*').as('quickEdit');
    cy.clickByLocatorAndPartialText(getSubmitButtonLocator, SAVE_BTN_TEXT);
    cy.wait('@quickEdit', { timeout: 7000 });
    getContentMessage().should('contain.text', ARTICLE_TITLE);
    cy.url().then(function (currentURL) {
      cy.visit(currentURL);
      getContentHeader().should('contain.text', ARTICLE_TITLE);
      getArticleBody().should('contain.text', ARTICLE_TITLE);
      getContentTag().should('contain.text', ARTICLE_TAG);
    });
    cy.logout();
  });

  after(function () {
    cy.deleteUser(Cypress.env('cyAdminUser'));
  });

});