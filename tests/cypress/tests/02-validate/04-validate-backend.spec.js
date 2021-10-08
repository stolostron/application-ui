// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import {
  apiResources,
  targetResource,
  validateTimewindow,
  getManagedClusterName
} from "../../views/resources";

const config = Cypress.env("TEST_CONFIG_EXCLUDE_ARGO");

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application application backend resources exist", () => {
  if (Cypress.env("TEST_MODE") !== "BVT") {
    it(`get the name of the managed OCP cluster`, () => {
      getManagedClusterName();
    });
    for (const type in config) {
      const apps = config[type].data;
      apps.forEach(data => {
        if (data.enable) {
          it(`Verify that the apps ${
            data.name
          } channels, subscription and placementrule are valid - ${type}: ${
            data.name
          }`, () => {
            apiResources(type, data, "contain");
          });
          it(`Validate apps ${data.name} timewindow - ${type}: ${
            data.name
          }`, () => {
            validateTimewindow(data.name, data.config);
          });
          it(`Validate apps ${
            data.name
          } resources created on the target cluster`, () => {
            targetResource(data);
          });
        } else {
          it(`disable validation on resource ${type}`, () => {
            cy.log(`skipping ${type} - ${data.name}`);
          });
        }
      });
    }
  } else {
    it("Skipping this test in BVT test mode", () => {});
  }
});
