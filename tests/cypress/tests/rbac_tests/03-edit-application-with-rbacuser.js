// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("RBAC_CONFIG");
import {
  deleteFirstSubscription,
  addNewSubscription
} from "../../views/application";

import {
  getManagedClusterName,
  getNumberOfManagedClusters
} from "../../views/resources";

const mngdTestEditRole = "edit-managed-cluster";

describe("Application UI: [P3][Sev3][app-lifecycle-ui][RBAC] Edit application subscription Test", () => {
  const disableTest = true;
  if (Cypress.env("RBAC_TEST") && !disableTest) {
    it(`get the name of the managed OCP cluster`, () => {
      getManagedClusterName();
    });

    it(`get the number of the managed OCP clusters`, () => {
      getNumberOfManagedClusters();
    });

    for (const type in config) {
      if (type == "git") {
        const apps = config[type].data;
        apps.forEach(data => {
          if (data.enable && data.config.length > 1) {
            it(`Verify edit by deleting the first subscription for app ${
              data.name
            } with role: ${mngdTestEditRole}`, () => {
              const clusterName = Cypress.env("managedCluster");
              const namespace = clusterName;
              deleteFirstSubscription(data.name, data, namespace);
            });

            it(`Verify new subscription can be added for application ${
              data.name
            } with role: ${mngdTestEditRole}`, () => {
              const clusterName = Cypress.env("managedCluster");
              const namespace = clusterName;
              addNewSubscription(data.name, data, clusterName, namespace);
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
