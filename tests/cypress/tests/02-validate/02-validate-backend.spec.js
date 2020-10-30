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

describe("Application backend Test", () => {
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`Verify that channels, subscription and placementrule are valid - ${type}: ${
        data.name
      }`, () => {
        apiResources(type, data);
      });
      it(`Validate timewindow - ${type}: ${data.name}`, () => {
        validateTimewindow(data.name, data.config);
      });
      it(`Validate resources created on the target cluster`, () => {
        targetResource(data);
      });
    } else {
      it(`disable validation on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
