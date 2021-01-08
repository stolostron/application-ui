/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

Cypress.Commands.add("installAnsibleOperator", () => {
  cy.log(`Installing AnsibleOperator ...`);
  const ANSIBLE_FILE_PATH = "cypress/templates/ansible_yaml";

  const installAnsibleOperator = () => {
    cy.exec(`oc delete operatorgroup --all=true -n app-ui-ansibleoperator`, {
      failOnNonZeroExit: false
    });
    cy.exec(
      `oc delete deployment tower-resource-operator -n app-ui-ansibleoperator`,
      { failOnNonZeroExit: false }
    );
    cy
      .exec(`oc delete namespace app-ui-ansibleoperator`, {
        failOnNonZeroExit: false,
        timeout: 50 * 1000
      })
      .then(({ stdout, stderr }) => {
        if ((stdout || stderr).includes("not found")) {
          cy.log(`app-ui-ansibleoperator namespace not exists to delete.`);
        } else if (stdout.includes("deleted")) {
          cy.log(`app-ui-ansibleoperator namespace deleted.`);
        }
        cy
          .exec(`oc create namespace app-ui-ansibleoperator`, {
            timeout: 20 * 1000
          })
          .then(({ stdout, stderr }) => {
            if (stdout.includes("created")) {
              cy.log(`app-ui-ansibleoperator namespace created.`);
            } else if (stderr) {
              cy.log(stderr);
            }
          });
        cy.exec(`oc apply -f ${ANSIBLE_FILE_PATH}/ansible-operator-group.yaml`);
        cy.exec(`oc apply -f ${ANSIBLE_FILE_PATH}/ansible-subscription.yaml`);
        cy.wait(5000);
        cy
          .exec(`oc get pods -n app-ui-ansibleoperator`)
          .then(({ stdout, stderr }) => {
            if (stdout.includes("tower-resource-operator")) {
              cy.log(`tower-resource-operator is installed.`);
            } else if (stderr) {
              cy.log(stderr);
            }
          });
      });
  };

  installAnsibleOperator();
});
