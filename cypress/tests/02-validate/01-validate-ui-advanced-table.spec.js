// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("TEST_CONFIG_EXCLUDE_ARGO");
import { validateAdvancedTables } from "../../views/application";
import { getNumberOfManagedClusters } from "../../views/resources";

describe("Application UI: [P2][Sev2][app-lifecycle-ui] Application Validation Test for advanced configuration tables", () => {
  if (Cypress.env("TEST_MODE") !== "BVT") {
    it(`get the name of the managed OCP cluster`, () => {
      getNumberOfManagedClusters();
    });
    it("Wait for 5 mins...", () => {
      // hard wait for cluster status to propagate
      cy.wait(300 * 1000);
    });
    for (const type in config) {
      const apps = config[type].data;
      apps.forEach(data => {
        // ansible app will not be validated on the advanced table, the app deployment will be verified on the app topo and apps table
        if (
          data.enable &&
          (!data.name.includes("ui-helm2") &&
            !data.name.includes("ui-git-ansible"))
        ) {
          it(`Verify application ${
            data.name
          } channel, subscription, placement rule info from the advanced configuration tables - ${type}: ${
            data.name
          }`, () => {
            const numberOfRemoteClusters = Cypress.env(
              "numberOfManagedClusters"
            );
            validateAdvancedTables(
              data.name,
              data,
              type,
              numberOfRemoteClusters
            );
          });
        } else {
          it(`disable validation on resource ${type} - ${data.name}`, () => {
            cy.log(`skipping ${type} - ${data.name}`);
          });
        }
      });
    }
  } else {
    it("Skipping this test in BVT test mode", () => {});
  }
});
