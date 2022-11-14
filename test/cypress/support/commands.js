/// <reference types="cypress" />

/**
 * Create an article node using JSON:API:Reference: https://www.drupal.org/project/jsonapi
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} primary_fields  - Json input
 * @param {*} secondary_fields  - Json input
 */
Cypress.Commands.add('createNode', function (token, nodeType, primary_fields, secondary_fields) {
    return cy.request({
        method: 'POST',
        url: `/jsonapi/node/${nodeType}`,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'X-CSRF-Token': token
        },
        body: {
            data: {
                type: `node--${nodeType}`,
                attributes: primary_fields,
                relationships: secondary_fields
            }
        },
    }).its('body.data.attributes.drupal_internal__nid');
});


/**
 * Delete a article node using JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} uuid  - String - Unique Identifier for the User's content
 */
Cypress.Commands.add('deleteNode', function (token, nodeType, uuid) {
    return cy.request({
        method: 'DELETE',
        url: `/jsonapi/node/${nodeType}/${uuid}`,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'X-CSRF-Token': token
        },
    }).its('body');
});


/**
 * Get Nodes with given article title using JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} title  - String - Content Title
 */
Cypress.Commands.add('getNodesWithTitle', function (token, nodeType, title) {
    return cy.request({
        method: 'GET',
        url: `/jsonapi/node/${nodeType}?filter[article-title][path]=title&filter[article-title][value]=${title}&filter[article-title][operator]==`,
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'X-CSRF-Token': token
        },
    }).then(res => {
        return JSON.parse(JSON.stringify(res.body)).data;
    });
});

/**
 * Get User's Session Token using JSON:API
 * @param {*} user  - String - Username
 * @param {*} password  - String - Password
 */
Cypress.Commands.add('getRestToken', function (user, password) {
    cy.login(user, password);
    return cy.request({
        method: 'GET',
        url: '/session/token',
    }).its('body');
});

/**
* Login with different user roles
* @param {*} type  - String - Possible Role Types: "administrator" and "editor"
*/
Cypress.Commands.add('login', function (type) {
    let perms = {};
    switch (type) {
        case 'admin':
            perms = {
                name: Cypress.env('cyAdminUser'),
                pass: Cypress.env('cyAdminPassword'),
            };
            break;
        case 'editor':
            perms = {
                name: Cypress.env('cyEditorUser'),
                pass: Cypress.env('cyEditorPassword'),
            };
            break;
    }
    return cy.request({
        method: 'POST',
        url: '/user/login',
        form: true,
        body: {
            ...perms,
            form_id: 'user_login_form',
        },
    });
});


/**
 * Logout with cy.request
 */
Cypress.Commands.add('logout', function () {
    cy.request({
        method: 'GET',
        url: '/user/logout',
        followRedirect: false // turn off following redirects
    }).then((resp) => {
        // redirect status code is 302
        expect(resp.status).to.eq(302)
    });
});


/**
 * Re-seeding(Get-Delete-Post) an article data through JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} nodeType  - String (Possible value: "article")
 * @param {*} primary_fields  - Json input
 * @param {*} secondary_fields  - Json input
 */
Cypress.Commands.add('reseedArticle', function (token, nodeType, primary_fields, secondary_fields) {
    cy.getNodesWithTitle(token, nodeType, primary_fields.title.value)
        .then(nodes => {
            nodes.map(function (node) {
                cy.deleteNode(token, nodeType, node.id);
            });
        });
    return cy.createNode(token, nodeType, primary_fields, secondary_fields);
});


/**
 * Create taxonomy term through JSON:API
 * @param {*} token  - String - User's session token
 * @param {*} field  - Json input
 */
Cypress.Commands.add('createTaxonomyTerm', function (token, field) {
    return cy.request({
        method: 'POST',
        url: '/jsonapi/taxonomy_term/tags',
        headers: {
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json',
            'X-CSRF-Token': token
        },
        body: {
            data: {
                type: 'taxonomy_term--tags',
                attributes: field
            }
        },
    }).then(res => {
        return JSON.parse(JSON.stringify(res.body)).data.id
    });
});

/**
 * Create a User through Drush
 * @param {*} user - String
 * @param {*} password - String
 * @param {*} role - String (Possible Values: "administrator", "editor")
 */
Cypress.Commands.add('createUser', function (user, pass, role) {
    let drush = 'lando drush';
    cy.exec(`${drush} user-create "${user}" --mail="${user}@example.com" --password="${pass}"`,
        //Code will continue to execute if the given user account data already exists
        { failOnNonZeroExit: false }
    );

    cy.exec(
        `${drush} user-add-role "${role}" "${user}"`,
        { failOnNonZeroExit: false }
    );

    cy.exec(`${drush} user-information "${user}"`);
    //we didn’t explicitly set the failOnNonZeroExit property here and the test will fail
    //if the given user account doesn’t exist.
});


/**
 * Delete a User through Drush
 * @param {*} user - String
 */
Cypress.Commands.add('deleteUser', function (user) {
    let drush = 'lando drush';
    cy.exec(`${drush} -y user:cancel --delete-content "${user}"`, {
        timeout: 120000
    });
});

/**
 * Verify innerText of the given locator
 * @param {*} locator - CSS locator
 * @param {*} assertText - String(An innerText property of the input locator)
 */
Cypress.Commands.add('verifyInnerTextByLocator', function (locator, assertText) {
    cy.get(`${locator}`).then(($element) => {
        expect($element.get(0).innerText.trim()).to.eq(assertText)
    });
});

/**
 * Click the given locator which has the respective text in it
 * @param {*} locator - CSS locator
 * @param {*} textContent - String
 */
Cypress.Commands.add('clickByLocatorAndPartialText', function (locator, textContent) {
    cy.get(`${locator}`).contains(textContent).click({ force: true });
});

/**
 * Handling on iFrames(https://github.com/cypress-io/cypress/issues/136)
 */
Cypress.Commands.add('iframe', { prevSubject: 'element' }, function ($iframe) {
    return new Cypress.Promise(resolve => {
        $iframe.on('load', () => {
            resolve($iframe.contents().find('body'));
        });
    });
});


/**
 * Type the given text in the given input element
 * @param {*} locator - CSS Locator
 * @param {*} inputText - String
 */
Cypress.Commands.add('typeTextInput', function (locator, textContent) {
    cy.get(`${locator}`).type(textContent, { force: true });
});


/**
 * Set the value of an input box
 * @param {*} locator - CSS Locator
 * @param {*} inputText - String
 */
Cypress.Commands.add('setValueByJQuery', function (locator, inputText) {
    cy.get(`${locator}`, { timeout: 10000 }).invoke('val', inputText, { parseSpecialCharSequences: false }).trigger('change', { force: true });
});


/**
 * Select from Drop-down
 * @param {*} locator - CSS Locator
 * @param {*} inputText - String
 */
Cypress.Commands.add('selectDropDown', function (locator, inputText) {
    cy.get(`${locator}`, { timeout: 10000 }).select(inputText, { force: true });
});

/**
 * Check Default format value of the Edit summary CKEditor
 * @param {*} locator - CSS Locator
 * @param {*} strFormat - String (Possible Values: Basic HTML, Restricted HTML, Full HTML; Default Value:Basic HTML)
 */
Cypress.Commands.add('checkDefaultTextFormat', function (locator, strFormat) {
    cy.get(`${locator}`).find(':selected').contains(strFormat)
});

Cypress.Commands.add("type_ckeditor", (element, content) => {
    cy.window()
        .then(win => {
            win.CKEDITOR.instances[element].setData(content);
        });
});

// Drupal drush command.
Cypress.Commands.add("drupalDrushCommand", (command) => {
    var cmd = Cypress.env('drupalDrushCmdLine');

    if (cmd == null) {
        if (Cypress.env('localEnv') === "lando") {
            cmd = 'lando drush %command'
        } else {
            cmd = 'drush %command'
        }
    }

    if (typeof command === 'string') {
        command = [command];
    }

    const execCmd = cmd.replace('%command', command.join(' '));
    cy.log(execCmd)

    return cy.exec(execCmd);
});

// Composer command.
Cypress.Commands.add("composerCommand", (command) => {
    var cmd = Cypress.env('composerCmdLine');

    if (cmd == null) {
        console.log(Cypress.env())
        if (Cypress.env('localEnv') === "lando") {
            cmd = 'cd ../..; lando composer %command'
        } else {
            cmd = 'cd ../..; composer %command'
        }
    }

    if (typeof command === 'string') {
        command = [command];
    }

    const execCmd = cmd.replace('%command', command.join(' '));

    return cy.exec(execCmd)
});

Cypress.Commands.add("createUser", (siteRole) => {
    cy.fixture(`users/${siteRole}.json`).then((user) => {
        const username = user.firstname + user.lastname
        const password = user.password
        const email = user.email
        const role = user.role
        cy.drupalDrushCommand([
            "user:create",
            username,
            `--mail="${email}"`,
            `--password="${password}"`,
        ]).then(() => {
            cy.drupalDrushCommand(["urol", role, username])
        })
    })
})

Cypress.Commands.add('uiCreateUser', (userrole, role) => {
    let user_role_machine_name = 'govcms-' + userrole.toLowerCase().replace(' ', '-')
    let password = user_role_machine_name + '#123'
    cy.userLogin(role).then(() => {
        cy.get('#toolbar-link-entity-user-collection')
            .click({ force: true })
        cy.get('.local-actions__item > .button')
            .click({ force: true })
        cy.get('#edit-mail')
            .type('cypress-tester-' + user_role_machine_name + '@govcms.test', { force: true })
        cy.get('#edit-name')
            .type('@cypresstest-' + user_role_machine_name, { force: true })
        cy.get('#edit-pass-pass1', { force: true })
            .type(password, { force: true })
        cy.get('#edit-pass-pass2', { force: true })
            .type(password, { force: true })
        cy.get('#edit-submit')
            .click({ force: true })
        cy.get('.messages-list__item')
            .contains('Created a new user account')
        cy.get('#toolbar-link-entity-user-collection')
            .click({ force: true })
        cy.get('#edit-user-bulk-form-0')
            .click({ force: true })
        cy.get('#edit-action')
            .select('Add the ' + userrole + ' role to the selected user(s)')
        cy.get('#edit-submit')
            .click({ force: true })
        cy.get('#edit-user-bulk-form-0')
            .click({ force: true })
        cy.get('#edit-action')
            .select('Cancel the selected user account(s)')
        cy.get('#edit-submit')
            .click({ force: true })
        cy.get('#edit-user-cancel-method-user-cancel-delete')
            .click({ force: true })
        cy.get('#edit-submit')
            .click({ force: true })
    })
})

Cypress.Commands.add("deleteUser", (siteRole) => {
    cy.fixture(`users/${siteRole}.json`).then((user) => {
        const username = user.firstname + user.lastname
        cy.drupalDrushCommand(["ucan", "--delete-content", username, "-y"])
    })
})

Cypress.Commands.add("deleteUserByUsername", (username) => {
    cy.drupalDrushCommand(["ucan", "--delete-content", username, "-y"])
})

Cypress.Commands.add("userLogin", (siteRole) => {
    cy.fixture(`users/${siteRole}.json`).then((user) => {
        const username = user.firstname + user.lastname
        const password = user.password
        cy.visit(`/user/login`)
        cy.get("#edit-name").type(username)
        cy.get("#edit-pass").type(password)
        cy.get("#edit-submit").click()
    })
})

Cypress.Commands.add("userlogout", () => {
    cy.visit(`/user/logout`)
})