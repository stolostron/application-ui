/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { createApplication } from "../../views/application";
import {
  getManagedClusterName,
  channelsInformation
} from "../../views/resources";
import { getResourceKey, resourceTable } from "../../views/common";

const mngdTestAdminRoles = "admin-managed-cluster";
const mngdTestViewRole = "view-managed-cluster";
const mngdTestEditRole = "edit-managed-cluster";

describe("Application UI: [P1][Sev1][app-lifecycle-ui][RBAC] Application  Test", () => {
  it(`example`, () => {
    if (Cypress.config().baseUrl.includes("localhost")) {
      cy.ocLogin(mngdTestViewRole);
      cy.exec("oc whoami -t").then(res => {
        cy.setCookie("acm-access-token-cookie", res.stdout);
        Cypress.env("token", res.stdout);
      });
    } else {
      cy.addUserIfNotCreatedBySuite();
      cy.logInAsRole(mngdTestViewRole);
      cy.acquireToken().then(token => {
        Cypress.env("token", token);
      });
    }
    //   createApplication(clusterName, data, type, namespace);
    cy.visit("/multicloud/applications");
  });
});
