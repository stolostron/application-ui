// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { validateAdvancedTables } from "../../views/application";
import { getNumberOfManagedClusters } from "../../views/resources";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Validation Test for advanced configuration tables", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getNumberOfManagedClusters();
  });
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable && !data.name.includes("ui-helm2")) {
        it(`Verify application ${
          data.name
        } channel, subscription, placement rule info from the advanced configuration tables - ${type}: ${
          data.name
        }`, () => {
          const numberOfRemoteClusters = Cypress.env("numberOfManagedClusters");
          validateAdvancedTables(data.name, data, type, numberOfRemoteClusters);
        });
      } else {
        it(`disable validation on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
