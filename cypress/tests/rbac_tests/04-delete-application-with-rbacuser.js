// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("RBAC_CONFIG");
import {
  deleteApplicationUI,
  verifyUnauthorizedApplicationDelete
} from "../../views/application";
import {
  getManagedClusterName,
  channelsInformation,
  deleteChannel,
  deleteNamespaceHub
} from "../../views/resources";

const mngdTestAdminRoles = "admin-managed-cluster";
const mngdTestViewRole = "view-managed-cluster";

describe("Application UI: [P3][Sev3][app-lifecycle-ui][RBAC] Delete application Test", () => {
  const disableTest = true;
  if (Cypress.env("RBAC_TEST") && !disableTest) {
    for (const type in config) {
      if (type == "git") {
        const apps = config[type].data;
        apps.forEach(data => {
          if (data.enable && data.config.length > 1) {
            const name = data.name;
            it(`get the name of the managed OCP cluster`, () => {
              getManagedClusterName();
            });

            it(`[app-lifecycle-ui][RBAC] Verify a user with role ${mngdTestViewRole} cannot delete 
        application ${data.name} from UI`, () => {
              const namespace = Cypress.env("managedCluster");
              cy.rbacSwitchUser(mngdTestViewRole);
              verifyUnauthorizedApplicationDelete(name, namespace);
            });

            it(`Try to delete channel with insecureSkipVerify option for application ${
              data.name
            }`, () => {
              const key = 2; // our tests use the invalidate option on add new subscription, which has index 2
              const name = data.name;
              const namespace = Cypress.env("managedCluster");
              cy.log(`DATA ${name}`);
              channelsInformation(name, key, namespace).then(
                ({ channelNs, channelName }) => {
                  cy.log(`CHANNEL ${channelName}, ${channelNs}`);
                  if (channelName.indexOf("insecureskipverifyoption") != -1) {
                    cy.log(
                      `delete channel ${channelName} ns:  ${channelNs}, set for insecureSkipVerifyOption test `
                    );
                    deleteChannel(channelName, channelNs);

                    cy.log(
                      `Delete insecureSkipVerify channel namespace, ${channelNs}`
                    );
                    deleteNamespaceHub(data, channelName, type);
                  }
                }
              );
            });
            it(`[app-lifecycle-ui][RBAC] Verify application ${
              data.name
            } is deleted from UI with role: ${mngdTestAdminRoles} `, () => {
              cy.rbacSwitchUser(mngdTestAdminRoles);
              const namespace = Cypress.env("managedCluster");
              deleteApplicationUI(data.name, namespace);
            });
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
