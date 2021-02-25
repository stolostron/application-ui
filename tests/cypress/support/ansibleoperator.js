// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

/// <reference types="cypress" />

Cypress.Commands.add("installAnsibleOperator", () => {
  const ANSIBLE_FILE_PATH = "cypress/templates/ansible_yaml";

  const installAnsibleOperator = () => {
    cy.log(`Looking for AnsibleOperator ...`);
    cy
      .exec(`oc get pods -n app-ui-ansibleoperator`, {
        timeout: 20 * 1000
      })
      .then(({ stdout }) => {
        if (stdout.includes("tower-resource-operator")) {
          cy.log(`AnsibleOperator already exists.`);
        } else {
          cy.log(`Installing AnsibleOperator ...`);
          cy.exec(
            `oc delete operatorgroup --all=true -n app-ui-ansibleoperator`,
            {
              failOnNonZeroExit: false
            }
          );
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
                cy.log(
                  `app-ui-ansibleoperator namespace not exists to delete.`
                );
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
                .exec(
                  `oc apply -f ${ANSIBLE_FILE_PATH}/ansible-operator-group.yaml`
                )
                .its("stdout")
                .should("contain", "created");
              cy
                .exec(
                  `oc apply -f ${ANSIBLE_FILE_PATH}/ansible-subscription.yaml`
                )
                .its("stdout")
                .should("contain", "created");
            });
        }
      });
  };

  installAnsibleOperator();
});
