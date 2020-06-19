/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { pageLoader, resourceTable, modal, noResource } from "../views/common";

describe("Application Resources", () => {
  beforeEach(() => {
    cy.visit("/multicloud/applications");
    cy.contains("Resources").click();
  });

  it("test", () => {
    // cy.task('getResourceMetadataInFile','channel-github.yaml').then(data => {
    //     cy.log(data)
    // })
    // cy.task('getFileList','.yaml').then((list) => {
    //     list.forEach((file) => {
    //         cy.task('yaml2json',file).then((data) =>{
    //             let arr = JSON.parse(data)
    //             arr.forEach(element => {
    //                 if (element.kind == 'Namespace') {
    //                     cy.log(element.metadata.name)
    //                     cy.deleteNamespaceAPI(Cypress.env('token'),element.metadata.name)
    //                 }
    //             })
    //         })
  });

  //github channel
  it("Given user logs in as sysadmin, user should be able to add github channel", () => {
    let channelCount_b4 = 0;
    let filename = "03_channel-github.yaml";
    cy.get(".tableGridContainer").then($element => {
      if ($element.find(".channelGridContainer").length > 0) {
        channelCount_b4 = $element.find(".channelNameTitle").length;
      }
      cy.createAppResource("channel", "github");
      pageLoader.shouldNotExist();
      modal.shouldNotBeVisible();
      cy.wrap(queryAppResourceInFile("Channel", filename)).should("eq", 200);
      cy
        .get(".channelNameTitle", { timeout: 600000 })
        .should("have.length", channelCount_b4 + 1);
    });
  });

  it("Given user logs in as sysadmin, user should be able to add github subscription", () => {
    let filename = "02_subscription-github.yaml";
    cy.createAppResource("subscription", "github");
    pageLoader.shouldNotExist();
    modal.shouldNotBeVisible();
    cy.wrap(queryAppResourceInFile("Subscription", filename)).should("eq", 200);
  });

  it("Given user logs in as sysadmin, user should be able to add github placement rule", () => {
    let filename = "01_placementrule-github.yaml";
    cy.createAppResource("placementrule", "github");
    pageLoader.shouldNotExist();
    modal.shouldNotBeVisible();
    cy
      .wrap(queryAppResourceInFile("PlacementRule", filename))
      .should("eq", 200);
  });

  it("Given user logs in as sysadmin, user should be able to add github application", () => {
    let appCount_b4 = 0;
    let filename = "00_application-github.yaml";
    cy.contains("Overview").click();
    cy.get(".page-content-container").then($element => {
      if ($element.find(".no-resource").length < 1) {
        cy.log($element.find(".no-resource").length);
        resourceTable.rowCount().then(rowCount => {
          appCount_b4 = rowCount;
        });
      }
      cy.createAppResource("application", "github");
      pageLoader.shouldNotExist();
      modal.shouldNotBeVisible();
      cy
        .wrap(queryAppResourceInFile("Application", filename))
        .should("eq", 200);
      cy.task("getResourceMetadataInFile", filename).then(meta => {
        resourceTable.rowShouldExist(meta.name);
      });
      resourceTable.rowCount().then(rowCount => {
        expect(rowCount).to.equal(appCount_b4 + 1);
      });
    });
  });

  after(() => {
    cy.logout();
    cy.task("getFileList", "github").then(list => {
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
