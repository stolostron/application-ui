/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  addNewSubscription,
  verifyEditAfterNewSubscription,
  validateTopology
} from "../../views/application";
import {
  getManagedClusterName,
  getNumberOfManagedClusters
} from "../../views/resources";

describe("Edit application insert new subscription Test", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  it(`get the number of the managed OCP clusters`, () => {
    getNumberOfManagedClusters();
  });
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        if (data.new) {
          it(`Verify new subscription can be added`, () => {
            const clusterName = Cypress.env("managedCluster");
            addNewSubscription(data.name, data, clusterName);
          });
          it(`Verify that ${
            data.name
          } is valid after new subscription is created`, () => {
            verifyEditAfterNewSubscription(data.name, data);
          });
          it(`Verify that ${
            data.name
          } is valid after new subscription is created`, () => {
            const numberOfRemoteClusters = Cypress.env(
              "numberOfManagedClusters"
            );
            //TODO : enable this after bug 6881 is fixed
            //validateTopology(data.name, data, type, numberOfRemoteClusters);
          });
        }
      } else {
        it(`disable modification on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
