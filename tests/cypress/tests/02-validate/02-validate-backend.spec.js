/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */
const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  apiResources,
  targetResource,
  validateTimewindow
} from "../../views/resources";

describe("Application", () => {
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`channels, subscription and placementrule - should be validated - ${type}: ${
        data.name
      }`, () => {
        apiResources(type, data);
      });
      it(`timewindow - should be validated - ${type}: ${data.name}`, () => {
        validateTimewindow(data.name, data.config);
      });
      it(`This is kubeconfig: ${Cypress.env("KUBE_CONFIG")}`);
      it(`resource should be validated on the target cluster`, () => {
        targetResource(data);
      });
    } else {
      it(`disable validation on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
