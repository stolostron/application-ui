// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

/// <reference types="cypress" />

Cypress.Commands.add("installArgoCDOperator", () => {
  const ARGOCD_FILE_PATH = "cypress/scripts/argocd-integration.sh";

  const installArgoCDOperator = () => {
    cy.log(`Looking for ArgoCDOperator ...`);
    cy
      .exec(`oc get pods -n argocd`, {
        timeout: 20 * 1000
      })
      .then(({ stdout }) => {
        if (stdout.includes("argocd-operator")) {
          cy.log(`ArgoCDOperator already exists.`);
        } else {
          cy.log(`Installing ArgoCDOperator ...`);
          cy
            .exec(`oc delete namespace argocd`, {
              failOnNonZeroExit: false,
              timeout: 50 * 1000
            })
            .then(({ stdout, stderr }) => {
              if ((stdout || stderr).includes("not found")) {
                cy.log(`argocd namespace not exists to delete.`);
              } else if (stdout.includes("deleted")) {
                cy.log(`argocd namespace deleted.`);
              }
              cy.exec(`sh ${ARGOCD_FILE_PATH}`, {
                timeout: 200 * 1000
              });
            });
        }
      });
  };

  installArgoCDOperator();
});
