/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const { wizards, timeWindows } = JSON.parse(Cypress.env("TEST_CONFIG"));
import { createApplication, passTimeWindowType } from "../../views/application";
import _ from "lodash";

describe("Application", () => {
  for (const type in wizards) {
    it(`can be created on resource ${type} from the wizard`, () => {
      const application = wizards[type];
      let { name, url } = application;
      cy.visit("/multicloud/applications");
      const timeWindowType = _.sample(Object.keys(timeWindows));
      const timeWindowData = passTimeWindowType(timeWindowType).timeWindowData;
      const timewindowType = passTimeWindowType(timeWindowType).timeWindowType;
      timeWindowData && timewindowType
        ? createApplication(
            type,
            application,
            name,
            url,
            timeWindowData,
            timewindowType
          )
        : createApplication(type, application, name, url);
    });
  }
});
