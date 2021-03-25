// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = JSON.parse(Cypress.env("TEST_CONFIG"));

// Only affects this spec file
// See https://docs.cypress.io/api/cypress-api/config.html#Syntax

import { validateArgoTopology } from "../../views/application";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Validation Test for single argo application page, topology", () => {
  it(`verify argoCD application`, () => {
    // Open Topology Page
    const applicationName = "helloworld-local";
    const namespace = "openshift-operators";
    validateArgoTopology(applicationName, namespace);
  });
});
