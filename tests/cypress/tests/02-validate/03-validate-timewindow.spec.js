/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

import { validateTimewindow } from "../../views/application";
const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Application", () => {
  for (const type in wizards) {
    const { name } = wizards[type];
    it(`should be validated from the timewindow - ${type}: ${name}`, () => {
      validateTimewindow(name);
    });
  }
});
