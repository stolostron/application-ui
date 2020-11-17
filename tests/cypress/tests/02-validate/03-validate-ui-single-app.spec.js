/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { validateTopology } from "../../views/application";
import {
  getManagedClusterName,
  getNumberOfManagedClusters
} from "../../views/resources";

describe("Application Validation Test for single application page, topology ", () => {
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
        it(`[P1,Sev1,app-lifecycle-ui] Verify application ${
          data.name
        } content from the single application topology - ${type}: ${
          data.name
        }`, () => {
          const numberOfRemoteClusters = Cypress.env("numberOfManagedClusters");
          const clusterName = Cypress.env("managedCluster");
          validateTopology(
            data.name,
            data,
            type,
            clusterName,
            numberOfRemoteClusters,
            "create"
          );
        });
      } else {
        it(`disable validation on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
