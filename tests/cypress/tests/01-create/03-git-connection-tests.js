/*******************************************************************************
 * Copyright (c) 2021 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { testGitApiInput } from "../../views/common";

describe("Application UI: [P3][Sev3][app-lifecycle-ui] Application Creation Validate git api Test", () => {
  it(`Verify git api can access git branches`, () => {
    for (const type in config) {
      const apps = config[type].data;
      apps.forEach(data => {
        if (data.enable && data.new && type === "git") {
          testGitApiInput(data);
        }
      });
    }
  });
});
