/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards, timeWindows } = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  createApplication,
  passTimeWindowType,
  getTimeWindowType
} from "../../views/application";
import _ from "lodash";

describe("Application", () => {
  for (const type in wizards) {
    it(`can be created on resource ${type} from the wizard`, () => {
      const application = wizards[type];
      let { name, url } = application;
      cy.visit("/multicloud/applications").then(() => {
        cy.reload();
      });
      const timeWindowType = getTimeWindowType(name);
      const timeWindowData = passTimeWindowType(timeWindowType).timeWindowData;
      timeWindowData && timeWindowType
        ? createApplication(
            type,
            application,
            name,
            url,
            timeWindowData,
            timeWindowType
          )
        : createApplication(type, application, name, url);
    });
  }
});
