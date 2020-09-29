/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2020. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
// import '@cypress/code-coverage/support'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.Cookies.defaults({
  preserve: ["acm-access-token-cookie", "_oauth_proxy", "XSRF-TOKEN", "_csrf"]
});

before(() => {
  if (Cypress.config().baseUrl.includes("localhost")) {
    cy.exec("oc whoami -t").then(res => {
      cy.setCookie("acm-access-token-cookie", res.stdout);
      Cypress.env("token", res.stdout);
    });
  } else {
    cy.visit("/");
    cy.get("body").then(body => {
      // Check if logged in
      if (body.find("#header").length === 0) {
        // Check if identity providers are configured
        if (body.find("form").length === 0)
          cy.contains(Cypress.env("OC_IDP")).click();

        cy.get("#inputUsername").type(Cypress.env("OC_CLUSTER_USER"));
        cy.get("#inputPassword").type(Cypress.env("OC_CLUSTER_PASS"));
        cy.get('button[type="submit"]').click();
        cy.get("#header").should("exist");
      }
    });
    cy.acquireToken().then(token => {
      Cypress.env("token", token);
    });
  }
});

beforeEach(() => {
  if (Cypress.config().baseUrl.includes("localhost")) {
    cy.exec("oc whoami -t").then(res => {
      cy.setCookie("acm-access-token-cookie", res.stdout);
      Cypress.env("token", res.stdout);
    });
  }
});

//delete app resource - disabled now as it's not used currently
// cy.task("getFileList", "yaml").then(list => {
//   cy.log(list);
//   list.forEach(file => {
//     cy.deleteAppResourcesInFileAPI(Cypress.env("token"), file);
//   });
// });

Cypress.on("uncaught:exception", (err, runnable) => {
  debugger;
  // returning false here prevents Cypress from
  // failing the test
  return false;
});
