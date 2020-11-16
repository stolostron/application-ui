/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { createApplication } from "../../views/application";
import {
  getManagedClusterName,
  channelsInformation
} from "../../views/resources";
import { resourceTable, validateSubscriptionTable } from "../../views/common";

describe("Application Creation Test", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`[P1/Sev1/application-lifecycle-ui] Verify application ${
          data.name
        } can be created from resource type ${type} using template editor`, () => {
          const clusterName = Cypress.env("managedCluster");
          createApplication(clusterName, data, type);
        });

        it(`[P1/Sev1/application-lifecycle-ui] Verify channel for app ${
          data.name
        } was created - wait for creation`, () => {
          const key = 0;
          const name = data.name;
          //wait until channel gets created, otherwise the next new app might try to create the same channel instead of reusing
          channelsInformation(name, key).then(({ channelNs, channelName }) => {
            cy.log(`validate channel ${channelName} exists on Advanced Tables`);
            cy.visit(`/multicloud/applications/advanced?resource=channels`);
            cy
              .get("#undefined-search", { timeout: 500 * 1000 })
              .type(channelName);
            resourceTable.rowShouldExist(channelName, 600 * 1000);
          });
        });
      } else {
        it(`disable creation on resource ${data.name} ${type}`, () => {
          cy.log(`skipping wizard: ${type} - ${data.name}`);
        });
      }
    });
  }
});
