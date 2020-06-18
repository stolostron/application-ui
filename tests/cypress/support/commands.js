/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

var apiUrl =
  Cypress.config().baseUrl.replace("multicloud-console.apps", "api") + ":6443";
var authUrl = Cypress.config().baseUrl.replace(
  "multicloud-console",
  "oauth-openshift"
);

Cypress.Commands.add("login", () => {
  cy.visit("/");
  cy.contains(Cypress.env("OC_IDP")).click();
  cy.get("#inputUsername").type(Cypress.env("OC_CLUSTER_USER"));
  cy.get("#inputPassword").type(Cypress.env("OC_CLUSTER_PASS"));
  cy.get("[type=submit]").click();
});

Cypress.Commands.add("logout", () => {
  cy.contains(Cypress.env("OC_CLUSTER_USER")).click();
  cy.contains("Log out").click();
});

Cypress.Commands.add("editYaml", file => {
  cy.task("readFile", file).then(str => {
    str = str.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n{home}");
    cy
      .get(".inputarea")
      // .first()
      .focus()
      // .clear()
      .type("{ctrl}a")
      // .type('{selectall}{del}')
      .type(str, { delay: 0 });
  });
});

Cypress.Commands.add("acquireToken", () => {
  cy
    .request({
      method: "HEAD",
      url:
        authUrl +
        "/oauth/authorize?response_type=token&client_id=openshift-challenging-client",
      followRedirect: false,
      headers: {
        "X-CSRF-Token": 1
      },
      auth: {
        username: Cypress.env("OC_CLUSTER_USER"),
        password: Cypress.env("OC_CLUSTER_PASS")
      }
    })
    .then(resp => {
      return cy.wrap(resp.headers.location.match(/access_token=([^&]+)/)[1]);
    });
});

Cypress.Commands.add("createAppResource", (kind, resourceType) => {
  switch (kind.toLowerCase()) {
    case "channel":
      cy.get("#Channel").click();
      switch (resourceType.toLowerCase()) {
        case "github":
          cy
            .get("a")
            .contains("GitHub")
            .click({ force: true });
          break;
        case "namespace":
          cy
            .get("a")
            .contains("Namespace")
            .click({ force: true });
          break;
        case "helmrepo":
          cy
            .get("a")
            .contains("HelmRepo")
            .click({ force: true });
          break;
        case "objectbucket":
          cy
            .get("a")
            .contains("ObjectBucket")
            .click({ force: true });
          break;
      }
      break;
    case "subscription":
      cy.get("#Subscription").click();
      break;
    case "placementrule":
      cy.get('button[id="Placement Rule"]').click();
      break;
    case "application":
      cy.get('button[id="New application"]').click();
      break;
  }
  cy.editYaml(kind + "-" + resourceType + ".yaml");
  cy
    .get("button")
    .contains("Save")
    .click();
});

Cypress.Commands.add("getAppResourceAPI", (token, kind, namespace, name) => {
  let path =
    kind.toLowerCase() == "application"
      ? "/apis/app.k8s.io/v1beta1"
      : "/apis/apps.open-cluster-management.io/v1";
  cy
    .request({
      method: "GET",
      url:
        apiUrl +
        path +
        "/namespaces/" +
        namespace +
        "/" +
        kind.toLowerCase() +
        "s/" +
        name,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => {
      return cy.wrap(resp.status);
    });
});

Cypress.Commands.add("deleteAppResourcesInFileAPI", (token, file) => {
  cy.task("getResourceMetadataInFile", file).then(meta => {
    if (meta.kind.toLowerCase() !== "channel") {
      cy.deleteAppResourceAPI(token, meta.kind, meta.namespace, meta.name);
    }
    cy.deleteNamespaceAPI(token, meta.namespace);
  });
});

Cypress.Commands.add("deleteNamespaceAPI", (token, namespace) => {
  cy
    .request({
      method: "DELETE",
      url: apiUrl + "/api/v1/namespaces/" + namespace,
      failOnStatusCode: false,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => {
      return cy.wrap(resp.status);
    });
});

Cypress.Commands.add("deleteAppResourceAPI", (token, kind, namespace, name) => {
  let path =
    kind.toLowerCase() == "application"
      ? "/apis/app.k8s.io/v1beta1"
      : "/apis/apps.open-cluster-management.io/v1";
  cy
    .request({
      method: "DELETE",
      failOnStatusCode: false,
      url:
        apiUrl +
        path +
        "/namespaces/" +
        namespace +
        "/" +
        kind.toLowerCase() +
        "s/" +
        name,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => {
      return cy.wrap(resp.status);
    });
});
