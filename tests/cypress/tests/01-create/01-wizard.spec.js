/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { createApplication } from "../../views/application";
import {
  getManagedClusterName,
  channelsInformation
} from "../../views/resources";
import { getResourceKey, resourceTable } from "../../views/common";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Application Creation Test", () => {
  it(`get the name of the managed OCP cluster`, () => {
    getManagedClusterName();
  });
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`Verify application ${
          data.name
        } can be created from resource type ${type} using template editor`, () => {
          const clusterName = Cypress.env("managedCluster");
          createApplication(clusterName, data, type);
        });

        it(`Verify channel for app ${
          data.name
        } was created - wait for creation`, () => {
          let key = 0;
          const name = data.name;
          Object.keys(data.config).forEach(configObj => {
            cy.log(`validate channel for subscription number ${key}`);
            //call this after creating application to allow more time for the resources to get created
            //wait until channel gets created, otherwise the next new app might try to create the same channel instead of reusing
            channelsInformation(name, key).then(
              ({ channelNs, channelName }) => {
                cy.log(
                  `validate channel ${channelName} ns:  ${channelNs} exists on Advanced Tables`
                );
                cy.visit("/multicloud/applications/advanced?resource=channels");
                resourceTable.rowShouldExist(
                  channelName,
                  getResourceKey(channelName, channelNs),
                  60 * 1000
                );
              }
            );
            key = key + 1;
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
