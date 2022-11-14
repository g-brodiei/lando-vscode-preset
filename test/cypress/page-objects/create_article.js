/**
 * Get Add Content Button Locator
 */
export function getAddContentBtn() {
    return cy.get('.local-actions__item > .button')
}


/**
 * Get Topic Publicity Locator
 */
export function getTopicPublicityLocator() {
    return cy.get('#edit-field-topic-duration-0-value')
}





/**
 * Get Topic Link Locator
 */
export const getTopicLink = '.admin-item__link'

/**
 * Get Topic Type Locator
 */
export const getTopicType = '#edit-field-topic-type'

/**
 * Get Summary Text Format Locator
 */
export const getSummaryTextFormat = '#edit-body-0-format--2'

/**
 * Get Source Button Locator
 */
export const getArticleBodySourceBtnLocator = '#cke_24'


/**
 * Get Topic Duration Locator
 */
export const getTopicDurationLocator = '#edit-field-topic-duration-0-value'

/**
 * Get Topic Audience Locator
 */
export const getTopicAudienceLocator = '#edit-field-topic-audience'

/**
 * Get Topic Recording Link URI Locator
 */
export const getTopicRecordingLinkURI = '#edit-field-topic-recording-link-0-uri'

/**
 * Get Article Body
 */
export function getArticleBody() {
    return cy.get('.field--name-body')
}
