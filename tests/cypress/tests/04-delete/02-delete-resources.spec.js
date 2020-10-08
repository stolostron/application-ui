/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  deleteNamespaceHub,
  deleteNamespaceTarget,
  deleteUnusedChannelNamespaces
} from "../../views/resources";

describe("Cleanup resouces", () => {
  const kubeconfigs = Cypress.env("KUBE_CONFIG");
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`delete namepsace ${data.name}-ns on hub cluster`, () => {
        deleteNamespaceHub(data, data.name, type);
      });
      it(`delete namespace ${data.name}-ns on target cluster`, () => {
        kubeconfigs
          ? kubeconfigs.forEach(kubeconfig =>
              deleteNamespaceTarget(data.name, kubeconfig)
            )
          : cy.log("skipping - no kubeconfig defined");
      });
    } else {
      it(`disable deletion on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
});
