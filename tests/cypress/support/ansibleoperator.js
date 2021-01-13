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
          .its("stdout")
          .should("contain", "created");
        cy
          .exec(`oc apply -f ${ANSIBLE_FILE_PATH}/ansible-operator-group.yaml`)
          .its("stdout")
          .should("contain", "created");
        cy
          .exec(`oc apply -f ${ANSIBLE_FILE_PATH}/ansible-subscription.yaml`)
          .its("stdout")
          .should("contain", "created");
      });
  };

  installAnsibleOperator();
});
