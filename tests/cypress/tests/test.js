/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { pageLoader, resourceTable, modal, noResource } from "../views/common";

describe("Application Resources", () => {
  beforeEach(() => {
    cy.visit("/multicloud/applications");
    cy.contains("Resources").click();
  });

  it("Given user logs in as sysadmin, user should be able to add github channel", () => {
    // let channelCount_b4 = 0;
    // let filename = "03_channel-github.yaml";
    // cy.get(".tableGridContainer", { timeout: 300000 }).then($element => {
    //   if ($element.find(".channelGridContainer").length > 0) {
    //     channelCount_b4 = $element.find(".channelNameTitle").length;
    //     //channelCount_b4 = $element.find(".channelColumn").length;
    //   }
    //   cy.createAppResource("channel", "github");
    //   pageLoader.shouldNotExist();
    //   modal.shouldNotBeVisible();
    //   cy.wrap(queryAppResourceInFile("Channel", filename)).should("eq", 200);
    //   cy
    //     .get(".channelNameTitle", { timeout: 600000 })
    //     .should("have.length", channelCount_b4 + 1);
    // });
  });

  after(() => {
    cy.logout();
    cy.task("getFileList", "yaml").then(list => {
      cy.log(list);
      list.forEach(file => {
        cy.deleteAppResourcesInFileAPI(Cypress.env("token"), file);
      });
    });
  });
});

function queryAppResourceInFile(kind, filename) {
  return Promise.resolve(
    new Promise(function(resolve) {
      let status = 0;
      cy
        .task("yaml2json", filename)
        .then(data => {
          JSON.parse(data).forEach(el => {
            if (el.kind === kind) {
              status = cy.getAppResourceAPI(
                Cypress.env("token"),
                el.kind.toLowerCase(),
                el.metadata.namespace,
                el.metadata.name
              );
            }
          });
        })
        .then(status => {
          resolve(status);
        });
    })
  );
}
