/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Cleanup resouces", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`delete application ${name}'s channel, subscription and placementrule`, () => {
      cy
        .exec(
          `oc login --server=${Cypress.env("OC_CLUSTER_URL")} -u ${Cypress.env(
            "OC_CLUSTER_USER"
          )} -p ${Cypress.env("OC_CLUSTER_PASS")}`
        )
        .its("stdout")
        .should("contain", "Login successful.")
        .then(() => {
          // delete the channel
          cy.log("delete the channel");
          cy.exec(`oc get channels -n ${name}-app-samples-chn-ns`);
          cy
            .exec(
              `oc delete channel ${name}-app-samples-chn -n ${name}-app-samples-chn-ns`
            )
            .its("stdout")
            .should("contain", "deleted");
          // delete the subscription
          cy.log("delete the subscription");
          cy.exec(`oc get subscription -n ${name}-ns`);
          cy
            .exec(`oc delete subscription ${name}-subscription-0 -n ${name}-ns`)
            .its("stdout")
            .should("contain", "deleted");
          // delete the placementrule
          cy.log("delete the placementrule");
          cy.exec(`oc get placementrule -n ${name}-ns`);
          cy
            .exec(`oc delete placementrule ${name}-placement -n ${name}-ns`)
            .its("stdout")
            .should("contain", "deleted");
        });
    });
  }
});
