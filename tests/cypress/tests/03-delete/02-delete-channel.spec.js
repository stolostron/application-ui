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
          cy.log("delete the channel if it exists");
          cy
            .exec(`oc get channels -n ${name}-app-samples-chn-ns`)
            .then(({ stdout, stderr }) => {
              cy.log(stdout || stderr);
              if ((stdout || stderr).includes("No resource") === false) {
                cy.log("There exist leftover channel");
                cy
                  .exec(
                    `oc delete channel ${name}-app-samples-chn -n ${name}-app-samples-chn-ns`
                  )
                  .its("stdout")
                  .should("contain", "deleted");
              } else {
                cy.log(
                  `The channel ${name}--app-samples-chn-ns in namespace:${name}-app-samples-chn-ns is empty`
                );
              }
            });

          // delete the subscription
          cy.log("delete the subscription if it exists");
          cy
            .exec(`oc get subscription -n ${name}-ns`)
            .then(({ stdout, stderr }) => {
              cy.log(stdout || stderr);
              if ((stdout || stderr).includes("No resource") === false) {
                cy.log("There exist leftover subscription");
                cy
                  .exec(
                    `oc delete subscription ${name}-subscription-0 -n ${name}-ns`
                  )
                  .its("stdout")
                  .should("contain", "deleted");
              } else {
                cy.log(
                  `The subscription ${name}-subscription-0 in namespace:${name}-ns is empty`
                );
              }
            });
          // delete the placementrule
          cy.log("delete the placementrule if it exists");
          cy
            .exec(`oc get placementrule -n ${name}-ns`)
            .then(({ stdout, stderr }) => {
              cy.log(stdout || stderr);
              if ((stdout || stderr).includes("No resource") === false) {
                cy.log("There exist leftover subscription");
                cy
                  .exec(
                    `oc delete placementrule ${name}-placement -n ${name}-ns`
                  )
                  .its("stdout")
                  .should("contain", "deleted");
              } else {
                cy.log(
                  `The placementrule ${name}-placement in namespace:${name}-ns is empty`
                );
              }
            });
        });
    });
  }
});
