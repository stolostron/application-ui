// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { testGitApiInput } from "../../views/common";

describe("Application UI: [P3][Sev3][app-lifecycle-ui] Application Creation Validate git api Test", () => {
  if (
    Cypress.config().baseUrl.includes("localhost") &&
    Cypress.env("TEST_MODE") !== "smoke"
  ) {
    //run this test only on PRs
    it(`Verify git api can access git branches`, () => {
      cy.log("Test cluster", Cypress.config().baseUrl);
      for (const type in config) {
        const apps = config[type].data;
        apps.forEach(data => {
          if (data.enable && data.new && type === "git") {
            testGitApiInput(data);
          }
        });
      }
    });
  } else {
    it("Skipping git api validation test, this test is only run against localhost, PR execution and is not run in smoke test mode", () => {
      cy.log(
        "Cypress.config().baseUrl should include localhost to execute this test"
      );
    });
  }
});
