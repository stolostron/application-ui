/*******************************************************************************
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

import { pageLoader, resourceTable, modal, noResource } from "../views/common";

var status = 0;

describe("Application Resources", () => {
  beforeEach(() => {
    cy.visit("/multicloud/applications");
    cy.contains("Resources").click();
  });

  //github channel
  it("Given user logs in as sysadmin, user should be able to add github channel", () => {
    let channelCount_b4 = 0;
    cy.get(".tableGridContainer").then($element => {
      if ($element.find(".channelGridContainer").length > 0) {
        channelCount_b4 = $element.find(".channelNameTitle").length;
      }
      cy.createAppResource("channel", "github");
      pageLoader.shouldNotExist();
      modal.shouldNotBeVisible();
      cy
        .wrap(queryAppResourceInFile("Channel", "channel-github.yaml"))
        .should("eq", 200);
      cy
        .get(".channelNameTitle", { timeout: 600000 })
        .should("have.length", channelCount_b4 + 1);
    });
  });

  it("Given user logs in as sysadmin, user should be able to add github subscription", () => {
    cy.createAppResource("subscription", "github");
    pageLoader.shouldNotExist();
    modal.shouldNotBeVisible();
    cy
      .wrap(queryAppResourceInFile("Subscription", "subscription-github.yaml"))
      .should("eq", 200);
  });

  it("Given user logs in as sysadmin, user should be able to add github placement rule", () => {
    cy.createAppResource("placementrule", "github");
    pageLoader.shouldNotExist();
    modal.shouldNotBeVisible();
    cy
      .wrap(
        queryAppResourceInFile("PlacementRule", "placementrule-github.yaml")
      )
      .should("eq", 200);
  });

  it("Given user logs in as sysadmin, user should be able to add github application", () => {
    let appCount_b4 = 0;
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
        .wrap(queryAppResourceInFile("Application", "application-github.yaml"))
        .should("eq", 200);
      resourceTable.rowCount().then(rowCount => {
        expect(rowCount).to.equal(appCount_b4 + 1);
      });
    });
  });

  //namespace channel
  it("Given user logs in as sysadmin, user should be able to add namespace channel", () => {
    let channelCount_b4 = 0;
    cy.get(".tableGridContainer").then($element => {
      if ($element.find(".channelGridContainer").length > 0) {
        channelCount_b4 = $element.find(".channelNameTitle").length;
      }
      cy.createAppResource("channel", "namespace");
      pageLoader.shouldNotExist();
      modal.shouldNotBeVisible();
      cy
        .wrap(queryAppResourceInFile("Channel", "channel-namespace.yaml"))
        .should("eq", 200);
      cy
        .get(".channelNameTitle", { timeout: 600000 })
        .should("have.length", channelCount_b4 + 1);
    });
  });

  // it('add namespace subscription', () => {
  //     cy.createAppResource('subscription','namespace')
  //     pageLoader.shouldNotExist()
  //     modal.shouldNotBeVisible()
  //     cy.wrap(queryAppResourceInFile('Subscription', 'subscription-namespace.yaml')).should('eq',200)
  // })

  // it('add github placement rule', () => {
  //     cy.createAppResource('placementrule','github')
  //     pageLoader.shouldNotExist()
  //     modal.shouldNotBeVisible()
  //     cy.wrap(queryAppResourceInFile('PlacementRule', 'placementrule-github.yaml')).should('eq',200)
  // })

  // it('add github application', () => {
  //     let appCount_b4 = 0
  //     cy.contains('Overview').click()
  //     cy.get('.page-content-container').then($element => {
  //         if ($element.find('.no-resource').length < 1) {
  //             cy.log($element.find('.no-resource').length)
  //             resourceTable.rowCount().then(rowCount => {
  //                 appCount_b4 = rowCount
  //             })
  //         }
  //         cy.createAppResource('application','github')
  //         pageLoader.shouldNotExist()
  //         modal.shouldNotBeVisible()
  //         cy.wrap(queryAppResourceInFile('Application', 'application-github.yaml')).should('eq',200)
  //         resourceTable.rowCount().then(rowCount => {expect(rowCount).to.equal(appCount_b4 + 1)})
  //     })

  // })

  //helmrepo channel
  it("Given user logs in as sysadmin, user should be able to add heml repo channel", () => {
    let channelCount_b4 = 0;
    cy.get(".tableGridContainer").then($element => {
      if ($element.find(".channelGridContainer").length > 0) {
        channelCount_b4 = $element.find(".channelNameTitle").length;
      }
      cy.createAppResource("channel", "helmrepo");
      pageLoader.shouldNotExist();
      modal.shouldNotBeVisible();
      cy
        .wrap(queryAppResourceInFile("Channel", "channel-helmrepo.yaml"))
        .should("eq", 200);
      cy
        .get(".channelNameTitle", { timeout: 600000 })
        .should("have.length", channelCount_b4 + 1);
    });
  });

  //objectbucket channel
  it("Given user logs in as sysadmin, user should be able to add object bucket channel", () => {
    let channelCount_b4 = 0;
    cy.get(".tableGridContainer").then($element => {
      if ($element.find(".channelGridContainer").length > 0) {
        channelCount_b4 = $element.find(".channelNameTitle").length;
      }
      cy.createAppResource("channel", "objectbucket");
      pageLoader.shouldNotExist();
      modal.shouldNotBeVisible();
      cy
        .wrap(queryAppResourceInFile("Channel", "channel-objectbucket.yaml"))
        .should("eq", 200);
      cy
        .get(".channelNameTitle", { timeout: 600000 })
        .should("have.length", channelCount_b4 + 1);
    });
  });

  after(() => {
    cy.logout();
    cy.task("getFileList", ".yaml").then(list => {
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
