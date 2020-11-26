/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteApplicationUI } from "../../views/application";
import { deleteChannel, channelsInformation } from "../../views/resources";

describe("Application UI: [P1][Sev1][app-lifecycle-ui] Delete application Test", () => {
  for (const type in config) {
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        if (data.new && (type === "git" || type === "helm")) {
          it(`[P2][Sev2][app-lifecycle-ui] Try to delete channel with insecureSkipVerify option for application ${
            data.name
          }`, () => {
            const key = 2; // our tests use the invalidate option on add new subscription, which has index 2
            const name = data.name;
            cy.log(`DATA ${name}`);
            channelsInformation(name, key).then(
              ({ channelNs, channelName }) => {
                cy.log(`CHANNEL ${channelName}, ${channelNs}`);
                if (channelName.indexOf("insecureskipverifyoption") != -1) {
                  cy.log(
                    `delete channel ${channelName} ns:  ${channelNs}, set for insecureSkipVerifyOption test `
                  );
                  deleteChannel(channelName, channelNs);
                }
              }
            );
          });
        }
        it(`[P1][Sev1][app-lifecycle-ui] Verify application ${
          data.name
        } is deleted from UI`, () => {
          deleteApplicationUI(data.name);
        });
      } else {
        it(`Verify disable deletion on resource ${data.name} ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }
});
