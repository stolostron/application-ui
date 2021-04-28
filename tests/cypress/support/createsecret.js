// Copyright (c) 2021 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

/// <reference types="cypress" />

const secretConfig = Cypress.env("SECRET_CONFIG");
const path = require("path");
const SECRET_FILE_PATH = path.join(
  __dirname,
  "..",
  "/templates",
  "/secret_yaml/",
  "ansible-secret-with-credentials.yaml"
);

Cypress.Commands.add("createSecret", () => {
  const createSecret = () => {
    cy.log("Looking for secret...");
    const { name, namespace } = secretConfig.metadata;
    cy
      .exec(`oc get secret ${name} -n ${namespace}`, {
        timeout: 20 * 1000,
        failOnNonZeroExit: false
      })
      .then(({ stderr, stdout }) => {
        if ((stdout || stderr).includes("not found")) {
          cy.log("Secret not found. Now creating the secret...");
          cy.writeFile(SECRET_FILE_PATH, secretConfig);
          // create an ansible secret
          cy
            .exec(`oc apply -f ${SECRET_FILE_PATH}`)
            .its("stdout")
            .should("contain", "created");
        } else {
          cy.log(`Secret - ${name} exists in namespace - ${namespace}`);
        }
      });
  };
  createSecret();
});
