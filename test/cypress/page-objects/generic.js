/**
 * Get Recipe listing link locator
 */
export function getRecipeListingLink() {
    return cy.contains('Recipes');
}

/**
 * Get Spanish link locator
 */
export function getSpanishLink() {
    return cy.contains('Español');
}

/**
 * Get Number of recipes locator
 */
export function getNumberOfRecipes() {
    return cy.get('.node');
}

/**
 * Get ContentTitle Locator
 */
export function getContentTitle() {
    return cy.get('#edit-title-0-value')
}

/**
 * Get CKEditor Body Locator
 */
export const getCKEditorBodyLocator = '.cke_source'

/**
* Click elements inside the CKEditor Content Summary
* @param {*} Locator  - accepts css Locator only
*/
export function clickBtnInsideCKEditorSummary(locator) {
    cy.get(`${locator}`, { timeout: 15000 }).click({ force: true });
}

/**
 * Get Submit Button Locator
 */
export const getSubmitButtonLocator = '#edit-submit'


/**
 * Type Content Tag Name
 * @param {*} contentTag - String
 */
export function typeContentTag(contentTag) {
    cy.get('#edit-field-tags-target-id').clear({ force: true }).type(contentTag, { force: true })
}

/**
 * Get Content Tag
 */
export function getContentTag() {
    return cy.get('.field--name-field-tags a')
}

/**
 * Get Content Header
 */
export function getContentHeader() {
    return cy.get('h1')
}

/**
 * Get Content Message
 */
export function getContentMessage() {
    return cy.get('.messages')
}