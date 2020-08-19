/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

import { validateResourceTable } from "../../views/application";
const { wizards } = JSON.parse(Cypress.env("TEST_CONFIG"));

describe("Application", () => {
  for (const resource in wizards) {
    const { name } = wizards[resource];
    it(`should be validated from the resource table`, () => {
      validateResourceTable(name);
    });
  }
});
