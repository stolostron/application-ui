/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { targetResource, removeTargetNamespaces } from "../../views/resources";

describe("Cleanup resouces", () => {
  const kubeconfigs = Cypress.env("KUBE_CONFIG");
  for (const type in config) {
    const data = config[type].data;
    if (data.enable) {
      it(`resource should be deleted on the target cluster`, () => {
        targetResource.action("delete", data);
      });
    } else {
      it(`disable deletion on resource ${type}`, () => {
        cy.log(`skipping ${type} - ${data.name}`);
      });
    }
  }
  it(`remove resources on the target cluster`, () => {
    removeTargetNamespaces(kubeconfigs, config);
  });
});
