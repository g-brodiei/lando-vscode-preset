/**
 * Get Recipe Preparation Time Locator
 */
export function getPreparationTime() {
    return cy.get('#edit-field-preparation-time-0-value')
}

/**
 * Get Recipe Cooking Time Locator
 */
export function getCookingTime() {
    return cy.get('#edit-field-cooking-time-0-value')
}

/**
 * Get Recipe Number Of Servings Locator
 */
export function getNumberOfServings() {
    return cy.get('#edit-field-number-of-servings-0-value')
}

/**
 * Get Recipe Difficulty Locator
 */
export function getDifficulty() {
    return cy.get('#edit-field-difficulty')
}


/**
 * Get Recipe Category Locator
 */
export function getRecipeCategory() {
    return cy.get('#edit-field-recipe-category-target-id')
}


/**
 * Get Add Media Button Locator
 */
export function getAddMediaButton() {
    return cy.get('#edit-field-media-image-open-button')
}

/**
 * Get Add Media PopUp Locator
 */
export function getAddMediaPopUp() {
    return cy.get('#edit-field-media-image-open-button', { timeout: 20000 })
}

/**
 * Get Any First Media Locator
 */
export function getFirstMedia() {
    return cy.get('.form-item-media-library-select-form-0').find('label').next()
}

/**
 * Get Insert Selected Button Locator
 */
export function getBtnInsertSelected() {
    return cy.contains('button', 'Insert selected')
}

/**
 * Get Inserted Media Image Locator
 */
export function IsFirstMediaInserted() {
    return cy.get('img')
}

/**
 * Get Inserted Media Image Locator
 */
export function getRecipeBody() {
    return cy.get('p')
}


/**
 * Get Summary Text Format Locator
 */
export const getRecipeSummaryTextFormat = '#edit-field-summary-0-format--2'

/**
 * Get Ingredients Locator
 */
export function getIngredients() {
    return cy.get('#edit-field-ingredients-0-value')
}


/**
 * Get Recipe Source Button Locator
 */
export const getRecipeSummarySourceBtnLocator = '#cke_28'

/**
 * Get Recipe Source Button Locator
 */
export const getRecipeInstructionSourceBtnLocator = '#cke_56'

/**
 * Get CKEditor Body Locator - Receipe Instructions
 */
export const getCKEditorSecondBodyLocator = '#cke_2_contents > .cke_source'