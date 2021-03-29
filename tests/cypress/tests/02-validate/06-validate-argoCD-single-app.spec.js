// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
import _ from "lodash";

const config = JSON.parse(Cypress.env("TEST_CONFIG"));

// Only affects this spec file
// See https://docs.cypress.io/api/cypress-api/config.html#Syntax

import { validateTopology } from "../../views/application";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Validation Test for single argo application page, topology", () => {
  const type = "argo";
  const data = config.argo.data[0];
  if (data.enable) {
    it(`Verify application ${
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
        "create",
        data.namespace
      );
    });
  }
});
