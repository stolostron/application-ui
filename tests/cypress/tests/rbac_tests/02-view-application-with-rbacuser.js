// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { getManagedClusterName } from "../../views/resources";

import { resourceTable } from "../../views/common";

const mngdTestRoles = [
  "admin-managed-cluster",
  "view-managed-cluster",
  "edit-managed-cluster"
];

describe("Application UI: [P1][Sev1][app-lifecycle-ui][RBAC] Validate view application Test", () => {
  if (Cypress.env("RBAC_TEST")) {
    it(`get the name of the managed OCP cluster`, () => {
      getManagedClusterName();
    });

    for (const type in config) {
      if (type == "git") {
        const apps = config[type].data;
        apps.forEach(data => {
          if (data.enable && data.config.length > 1) {
            const name = data.name;

            for (const loginrole in mngdTestRoles) {
              it(`[P1][Sev1][app-lifecycle-ui] Verify  application ${
                data.name
              } is displayed on UI and viewable by role: ${
                mngdTestRoles[loginrole]
              }`, () => {
                // cy.logInAsRole(mngdTestRoles[loginrole])
                cy.rbacSwitchUser(mngdTestRoles[loginrole]);
                cy.visit("/multicloud/applications");
                const selectorkey = `${Cypress.env("managedCluster")}/${name}`;
                resourceTable.rowShouldExist(data.name, selectorkey);
              });
            }
          }
        });
      }
    }
  } else {
    it("Skipping RBAC Test to execute test set export CYPRESS_RBAC_TEST=`true`", () => {
      cy.log("set export CYPRESS_RBAC_TEST=`true`");
    });
  }
});
