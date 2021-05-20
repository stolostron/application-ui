// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("RBAC_CONFIG");
import { createApplication } from "../../views/application";
import {
  getManagedClusterName,
  channelsInformation
} from "../../views/resources";
import { getResourceKey, resourceTable } from "../../views/common";

describe("Application UI: [P3][Sev3][app-lifecycle-ui][RBAC] Application Creation Test", () => {
  const disableTest = true;
  if (Cypress.env("RBAC_TEST") && !disableTest) {
    it(`get the name of the managed OCP cluster`, () => {
      getManagedClusterName();
    });
    const mngdTestAdminRoles = "admin-managed-cluster";
    const viewRole = "view-managed-cluster";

    for (const type in config) {
      if (type == "git") {
        const apps = config[type].data;
        apps.forEach(data => {
          if (data.enable && data.config.length > 1) {
            if (data.config)
              data.config.forEach(configDeployment => {
                if (
                  configDeployment.deployment.local &&
                  !configDeployment.deployment.matchingLabel
                ) {
                  configDeployment.deployment.local = false;
                  if (!configDeployment.deployment.online) {
                    configDeployment.deployment.online = true;
                  }
                }
              });

            it(`Verify application ${
              data.name
            } can be created from resource type ${type} by role: ${mngdTestAdminRoles}`, () => {
              const clusterName = Cypress.env("managedCluster");
              const namespace = clusterName;
              // cy.logInAsRole(mngdTestAdminRoles)
              cy.rbacSwitchUser(mngdTestAdminRoles);
              createApplication(clusterName, data, type, namespace);
            });

            it(`Verify channel for app ${
              data.name
            } was created - wait for creation`, () => {
              let key = 0;
              const name = data.name;
              const clusterName = Cypress.env("managedCluster");
              const namespace = clusterName;
              Object.keys(data.config).forEach(configObj => {
                cy.log(`validate channel for subscription number ${key}`);
                //call this after creating application to allow more time for the resources to get created
                //wait until channel gets created, otherwise the next new app might try to create the same channel instead of reusing
                channelsInformation(name, key, namespace).then(
                  ({ channelNs, channelName }) => {
                    cy.log(
                      `validate channel ${channelName} ns:  ${channelNs} exists on Advanced Tables`
                    );
                    cy.visit(
                      "/multicloud/applications/advanced?resource=channels"
                    );
                    resourceTable.rowShouldExist(
                      channelName,
                      getResourceKey(channelName, channelNs),
                      120 * 1000
                    );
                  }
                );
                key = key + 1;
              });
            });
          }
        });
      }
    }

    it(`Verify a user with view only role: ${viewRole} cannot create application`, () => {
      // cy.logInAsRole(viewRole)
      cy.rbacSwitchUser(viewRole);
      cy.visit("/multicloud/applications");
      const alertMessage =
        "You are not authorized to complete this action. See " +
        "your cluster administrator for role-based " +
        "access control information.";
      // # Open Gitbacklog for tooltip message validation as a test Improvement

      cy
        .get("#CreateAppButton")
        .trigger("mouseover", { bubbles: true })
        .should("have.attr", "aria-disabled", "true")
        .and("have.attr", "data-test-create-application", "false");
    });
  } else {
    it("Skipping RBAC Test as of Now to execute test set export CYPRESS_RBAC_TEST=`true`", () => {
      cy.log("set export CYPRESS_RBAC_TEST=`true`");
    });
  }
});
