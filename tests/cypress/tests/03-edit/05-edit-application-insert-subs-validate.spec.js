/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  verifyEditAfterNewSubscription,
  verifyInsecureSkipAfterNewSubscription,
  validateTopology
} from "../../views/application";
import {
  getManagedClusterName,
  getNumberOfManagedClusters
} from "../../views/resources";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Edit application validate insert new subscription", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  it(`get the number of the managed OCP clusters`, () => {
    getNumberOfManagedClusters();
  });
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        if (data.new) {
          it(`Verify that ${
            data.name
          } template editor valid after new subscription is created`, () => {
            verifyEditAfterNewSubscription(data.name, data);
          });
          if (type === "git" || type === "helm") {
            it(`[P1][Sev1][app-lifecycle-ui] Verify insecureSkipVerify option in new channel for app ${
              data.name
            } was selected`, () => {
              verifyInsecureSkipAfterNewSubscription(data.name);
            });
          }
          it(`Verify that ${
            data.name
          } single app page info is valid after new subscription is created`, () => {
            const numberOfRemoteClusters = Cypress.env(
              "numberOfManagedClusters"
            );
            const clusterName = Cypress.env("managedCluster");
            validateTopology(
              data.name,
              data,
              type,
              clusterName,
              numberOfRemoteClusters,
              "add"
            );
          });
        }
      } else {
        it(`disable modification on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
