
import {
    getContentTitle,
    getCKEditorBodyLocator,
    clickBtnInsideCKEditorSummary,
    getSubmitButtonLocator,
    typeContentTag,
    getContentTag,
    getContentHeader,
    getContentMessage
} from '../page-objects/generic'

import {
    getAddMediaButton,
    getCookingTime,
    getDifficulty,
    getIngredients,
    getNumberOfServings,
    getPreparationTime,
    getRecipeCategory,
    getRecipeSummaryTextFormat,
    getRecipeSummarySourceBtnLocator,
    getRecipeInstructionSourceBtnLocator,
    getAddMediaPopUp,
    getFirstMedia,
    getBtnInsertSelected,
    IsFirstMediaInserted,
    getRecipeBody,
    getCKEditorSecondBodyLocator
} from '../page-objects/create_recipe'

import {
    FORMAT_TYPE, SAVE_BTN_TEXT
} from '../fixtures/generic_testdata.js'

import {
    CONTENT_URL,
    RECIPE_CATEGORY,
    RECIPE_COOKING_TIME,
    RECIPE_DIFFICULTY,
    RECIPE_NUMBER_OF_SERVINGS,
    RECIPE_PREPARATION_TIME,
    RECIPE_INGREDIENTS,
    RECIPE_TITLE,
    RECIPE_BODY,
    RECIPE_TAG
} from '../fixtures/recipe_testdata.js'

describe('Test Recipe Creation Flow', function () {

    before(function () {
        cy.createUser(Cypress.env('cyAdminUser'), Cypress.env('cyAdminPassword'), Cypress.env('cyAdminRole'));
    });

    it('Create and Verify the recipe using ui', function () {
        cy.login('admin');
        cy.visit(CONTENT_URL);
        getContentTitle().type(RECIPE_TITLE, { force: true });
        getPreparationTime().type(RECIPE_PREPARATION_TIME, { force: true });
        getCookingTime().type(RECIPE_COOKING_TIME, { force: true });
        getNumberOfServings().type(RECIPE_NUMBER_OF_SERVINGS, { force: true });
        getDifficulty().select(RECIPE_DIFFICULTY, { force: true });
        getRecipeCategory().type(RECIPE_CATEGORY, { force: true });
        typeContentTag(RECIPE_TAG);
        getAddMediaButton().click({ force: true });
        getAddMediaPopUp().should('be.visible');
        getFirstMedia().check();
        cy.intercept('POST', '**/node/add/*').as('mediaUpload');
        getBtnInsertSelected().click();
        cy.wait('@mediaUpload', { timeout: 10000 });
        IsFirstMediaInserted().should('be.visible');
        getIngredients().type(RECIPE_INGREDIENTS);
        cy.checkDefaultTextFormat(getRecipeSummaryTextFormat, FORMAT_TYPE);
        clickBtnInsideCKEditorSummary(getRecipeSummarySourceBtnLocator);
        cy.setValueByJQuery(getCKEditorBodyLocator, RECIPE_BODY);
        clickBtnInsideCKEditorSummary(getRecipeInstructionSourceBtnLocator);
        cy.setValueByJQuery(getCKEditorSecondBodyLocator, RECIPE_BODY);
        cy.intercept('POST', '**/quickedit/*').as('quickEdit');
        cy.clickByLocatorAndPartialText(getSubmitButtonLocator, SAVE_BTN_TEXT);
        cy.wait('@quickEdit', { timeout: 7000 });
        getContentMessage().should('contain.text', RECIPE_TITLE);
        cy.url().then(function (currentURL) {
            cy.visit(currentURL);
            getContentHeader().should('contain.text', RECIPE_TITLE);
            getRecipeBody().should('contain.text', RECIPE_TITLE);
            getContentTag().should('contain.text', RECIPE_TAG);
        });
        cy.logout();
    });

    after(function () {
        cy.deleteUser(Cypress.env('cyAdminUser'));
    });

});