
import {
    getRecipeListingLink, getSpanishLink, getNumberOfRecipes
} from '../page-objects/generic'

context('Listing Pages', () => {

    beforeEach(() => {
        cy.visit('/');
        getRecipeListingLink().click()
    });

    it('Visually test the listing Page in English Languge!', () => {
        getNumberOfRecipes().should('have.length', 9);
        cy.eyesCheckWindow({
            tag: "Recipes Page in English Languge",
            target: 'window',
            fully: true
        });
    });

    it('Visually test the listing Page in Spanish Languge', () => {
        getRecipeListingLink().click();
        getNumberOfRecipes().should('have.length', 9);
        cy.eyesCheckWindow({
            tag: "Recipes Page in Spanish Languge",
            target: 'window',
            fully: true
        });
    });

});
