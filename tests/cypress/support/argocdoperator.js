// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

/// <reference types="cypress" />

Cypress.Commands.add("installArgoCDOperator", () => {
  const ARGOCD_FILE_PATH = "cypress/scripts/argocd-integration.sh";

  const installArgoCDOperator = () => {
    cy.log(`Looking for ArgoCDOperator ...`);
    cy
      .exec(`oc get pods -n openshift-operators`, {
        timeout: 20 * 1000
      })
      .then(({ stdout }) => {
        if (stdout.includes("gitops-operator")) {
          cy.log(`ArgoCDOperator already exists.`);
        } else {
          cy.log(`Installing ArgoCDOperator ...`);
          cy.exec(`/bin/bash ${ARGOCD_FILE_PATH}`, {
            timeout: 400 * 1000
          });
        }
      });
  };

  installArgoCDOperator();
});
