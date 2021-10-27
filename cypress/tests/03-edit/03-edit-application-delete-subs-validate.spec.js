// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("TEST_CONFIG_EXCLUDE_ARGO");
import { validateTopology } from "../../views/application";
import {
  getManagedClusterName,
  getNumberOfManagedClusters
} from "../../views/resources";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Edit application validate delete first subscription", () => {
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
          } single app page info is valid after first subscription is deleted`, () => {
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
              "delete"
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
