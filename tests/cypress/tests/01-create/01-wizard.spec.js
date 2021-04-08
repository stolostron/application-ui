// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = Cypress.env("TEST_CONFIG_EXCLUDE_ARGO");
import { createApplication } from "../../views/application";
import { getManagedClusterName } from "../../views/resources";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Creation Test", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`Verify application ${
          data.name
        } can be created from resource type ${type} using template editor`, () => {
          const clusterName = Cypress.env("managedCluster");
          createApplication(clusterName, data, type);
        });
      } else {
        it(`disable creation on resource ${data.name} ${type}`, () => {
          cy.log(`skipping wizard: ${type} - ${data.name}`);
        });
      }
    });
  }
});
