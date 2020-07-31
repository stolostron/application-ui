/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { pageLoader, resourceTable, modal, noResource } from "../views/common";

describe("Application Resources", () => {
  beforeEach(() => {
    cy.visit("/multicloud/applications");
    cy.contains("Resources").click();
    cy.get(".refresh-time-selection", { timeout: 300000 }).click();
    cy.get("#refreshDropdown-item-0").click(); //refresh every 15s
  });

  // //github channel
  // it("Given user logs in as sysadmin, user should be able to add github channel", () => {
  //   let channelCount_b4 = 0;
  //   let filename = "03_channel-github.yaml";
  //   cy.get(".tableGridContainer").then($element => {
  //     if ($element.find(".channelGridContainer").length > 0) {
  //       channelCount_b4 = $element.find(".channelNameTitle").length;
  //     }
  //     cy.createAppResource("channel", "github");
  //     pageLoader.shouldNotExist();
  //     modal.shouldNotBeVisible();
  //     cy.wrap(queryAppResourceInFile("Channel", filename)).should("eq", 200);
  //     cy
  //       .get(".channelNameTitle", { timeout: 600000 })
  //       .should("have.length", channelCount_b4 + 1);
  //   });
  // });

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
    let appName = "";
    cy.task("getResourceMetadataInFile", filename).then(meta => {
      appName = meta.name;
      cy.get(".page-content-container").then($element => {
        if ($element.find(".no-resource").length < 1) {
          cy.log($element.find(".no-resource").length);
          cy
            .get("#undefined-search")
            .click()
            .type(appName);
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
        // wait 90 seconds for search to return the application
        resourceTable.rowShouldExist(appName, { timeout: 90000 });
        resourceTable.rowCount().then(rowCount => {
          expect(rowCount).to.equal(appCount_b4 + 1);
        });
      });
    });
  });

  // namespace channel
  // it("Given user logs in as sysadmin, user should be able to add namespace channel", () => {
  //   let channelCount_b4 = 0;
  //   let filename = "03_channel-namespace.yaml";
  //   cy.get(".tableGridContainer").then($element => {
  //     if ($element.find(".channelGridContainer").length > 0) {
  //       channelCount_b4 = $element.find(".channelNameTitle").length;
  //     }
  //     cy.createAppResource("channel", "namespace");
  //     pageLoader.shouldNotExist();
  //     modal.shouldNotBeVisible();
  //     cy.wrap(queryAppResourceInFile("Channel", filename)).should("eq", 200);
  //     cy
  //       .get(".channelNameTitle", { timeout: 600000 })
  //       .should("have.length", channelCount_b4 + 1);
  //   });
  // });

  // it("Given user logs in as sysadmin, user should be able to add namespace subscription", () => {
  //   let filename = "02_subscription-namespace.yaml";
  //   cy.createAppResource("subscription", "namespace");
  //   pageLoader.shouldNotExist();
  //   modal.shouldNotBeVisible();
  //   cy.wrap(queryAppResourceInFile("Subscription", filename)).should("eq", 200);
  // });

  // it("Given user logs in as sysadmin, user should be able to add namespace placement rule", () => {
  //   let filename = "01_placementrule-namespace.yaml";
  //   cy.createAppResource("placementrule", "namespace");
  //   pageLoader.shouldNotExist();
  //   modal.shouldNotBeVisible();
  //   cy
  //     .wrap(queryAppResourceInFile("PlacementRule", filename))
  //     .should("eq", 200);
  // });

  // it("Given user logs in as sysadmin, user should be able to add namespace application", () => {
  //   let appCount_b4 = 0;
  //   let filename = "00_application-namespace.yaml";
  //   cy.contains("Overview").click();
  //   let appName = "";
  //   cy.task("getResourceMetadataInFile", filename).then(meta => {
  //     appName = meta.name;
  //     cy.get(".page-content-container").then($element => {
  //       if ($element.find(".no-resource").length < 1) {
  //         cy.log($element.find(".no-resource").length);
  //         cy
  //           .get("#undefined-search")
  //           .click()
  //           .type(appName);
  //         resourceTable.rowCount().then(rowCount => {
  //           appCount_b4 = rowCount;
  //         });
  //       }
  //       cy.createAppResource("application", "namespace");
  //       pageLoader.shouldNotExist();
  //       modal.shouldNotBeVisible();
  //       cy
  //         .wrap(queryAppResourceInFile("Application", filename))
  //         .should("eq", 200);
  //       resourceTable.rowShouldExist(appName);
  //       resourceTable.rowCount().then(rowCount => {
  //         expect(rowCount).to.equal(appCount_b4 + 1);
  //       });
  //     });
  //   });
  // });

  //helmrepo channel
  // it("Given user logs in as sysadmin, user should be able to add heml repo channel", () => {
  //   let channelCount_b4 = 0;
  //   let filename = "03_channel-helmrepo.yaml";
  //   cy.get(".tableGridContainer").then($element => {
  //     if ($element.find(".channelGridContainer").length > 0) {
  //       channelCount_b4 = $element.find(".channelNameTitle").length;
  //     }
  //     cy.createAppResource("channel", "helmrepo");
  //     pageLoader.shouldNotExist();
  //     modal.shouldNotBeVisible();
  //     cy.wrap(queryAppResourceInFile("Channel", filename)).should("eq", 200);
  //     cy
  //       .get(".channelNameTitle", { timeout: 600000 })
  //       .should("have.length", channelCount_b4 + 1);
  //   });
  // });

  // it("Given user logs in as sysadmin, user should be able to add helmrepo subscription", () => {
  //   let filename = "02_subscription-helmrepo.yaml";
  //   cy.createAppResource("subscription", "helmrepo");
  //   pageLoader.shouldNotExist();
  //   modal.shouldNotBeVisible();
  //   cy.wrap(queryAppResourceInFile("Subscription", filename)).should("eq", 200);
  // });

  // it("Given user logs in as sysadmin, user should be able to add helmrepo placement rule", () => {
  //   let filename = "01_placementrule-helmrepo.yaml";
  //   cy.createAppResource("placementrule", "helmrepo");
  //   pageLoader.shouldNotExist();
  //   modal.shouldNotBeVisible();
  //   cy
  //     .wrap(queryAppResourceInFile("PlacementRule", filename))
  //     .should("eq", 200);
  // });

  // it("Given user logs in as sysadmin, user should be able to add helmrepo application", () => {
  //   let appCount_b4 = 0;
  //   let filename = "00_application-helmrepo.yaml";
  //   cy.contains("Overview").click();
  //   let appName = "";
  //   cy.task("getResourceMetadataInFile", filename).then(meta => {
  //     appName = meta.name;
  //     cy.get(".page-content-container").then($element => {
  //       if ($element.find(".no-resource").length < 1) {
  //         cy.log($element.find(".no-resource").length);
  //         cy
  //           .get("#undefined-search")
  //           .click()
  //           .type(appName);
  //         resourceTable.rowCount().then(rowCount => {
  //           appCount_b4 = rowCount;
  //         });
  //       }
  //       cy.createAppResource("application", "helmrepo");
  //       pageLoader.shouldNotExist();
  //       modal.shouldNotBeVisible();
  //       cy
  //         .wrap(queryAppResourceInFile("Application", filename))
  //         .should("eq", 200);
  //       resourceTable.rowShouldExist(appName);
  //       resourceTable.rowCount().then(rowCount => {
  //         expect(rowCount).to.equal(appCount_b4 + 1);
  //       });
  //     });
  //   });
  // });

  //objectbucket channel
  // it("Given user logs in as sysadmin, user should be able to add object bucket channel", () => {
  //   let channelCount_b4 = 0;
  //   let filename = "03_channel-objectbucket.yaml";
  //   cy.get(".tableGridContainer").then($element => {
  //     if ($element.find(".channelGridContainer").length > 0) {
  //       channelCount_b4 = $element.find(".channelNameTitle").length;
  //     }
  //     cy.createAppResource("channel", "objectbucket");
  //     pageLoader.shouldNotExist();
  //     modal.shouldNotBeVisible();
  //     cy.wrap(queryAppResourceInFile("Channel", filename)).should("eq", 200);
  //     cy
  //       .get(".channelNameTitle", { timeout: 600000 })
  //       .should("have.length", channelCount_b4 + 1);
  //   });
  // });

  // it("Given user logs in as sysadmin, user should be able to add objectbucket subscription", () => {
  //   let filename = "02_subscription-objectbucket.yaml";
  //   cy.createAppResource("subscription", "objectbucket");
  //   pageLoader.shouldNotExist();
  //   modal.shouldNotBeVisible();
  //   cy.wrap(queryAppResourceInFile("Subscription", filename)).should("eq", 200);
  // });

  // it("Given user logs in as sysadmin, user should be able to add objectbucket placement rule", () => {
  //   let filename = "01_placementrule-objectbucket.yaml";
  //   cy.createAppResource("placementrule", "objectbucket");
  //   pageLoader.shouldNotExist();
  //   modal.shouldNotBeVisible();
  //   cy
  //     .wrap(queryAppResourceInFile("PlacementRule", filename))
  //     .should("eq", 200);
  // });

  // it("Given user logs in as sysadmin, user should be able to add objectbucket application", () => {
  //   let appCount_b4 = 0;
  //   let filename = "00_application-objectbucket.yaml";
  //   cy.contains("Overview").click();
  //   let appName = "";
  //   cy.task("getResourceMetadataInFile", filename).then(meta => {
  //     appName = meta.name;
  //     cy.get(".page-content-container").then($element => {
  //       if ($element.find(".no-resource").length < 1) {
  //         cy.log($element.find(".no-resource").length);
  //         cy
  //           .get("#undefined-search")
  //           .click()
  //           .type(appName);
  //         resourceTable.rowCount().then(rowCount => {
  //           appCount_b4 = rowCount;
  //         });
  //       }
  //       cy.createAppResource("application", "objectbucket");
  //       pageLoader.shouldNotExist();
  //       modal.shouldNotBeVisible();
  //       cy
  //         .wrap(queryAppResourceInFile("Application", filename))
  //         .should("eq", 200);
  //       resourceTable.rowShouldExist(appName);
  //       resourceTable.rowCount().then(rowCount => {
  //         expect(rowCount).to.equal(appCount_b4 + 1);
  //       });
  //     });
  //   });
  // });

  after(() => {
    cy.logout();
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
