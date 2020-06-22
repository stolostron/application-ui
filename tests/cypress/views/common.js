/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

export const pageLoader = {
  shouldExist: () =>
    cy.get(".content-spinner", { timeout: 20000 }).should("exist"),
  shouldNotExist: () =>
    cy.get(".content-spinner", { timeout: 20000 }).should("not.exist")
};

export const resourceTable = {
  shouldExist: () =>
    cy.get(".resource-table", { timeout: 20000 }).should("exist"),
  shouldNotExist: () =>
    cy.get(".resource-table", { timeout: 20000 }).should("not.exist"),
  rowCount: () =>
    cy.get(".resource-table", { timeout: 500000 }).then($table => {
      return $table.find("tbody").find("tr").length;
    }),
  rowShouldExist: name =>
    cy.get(`tr[data-row-name="${name}"]`, { timeout: 500000 }).should("exist"),
  rowShouldNotExist: name =>
    cy
      .get(`tr[data-row-name="${name}"]`, { timeout: 500000 })
      .should("not.exist"),
  openRowMenu: name =>
    cy.get(`tr[data-row-name="${name}"] .bx--overflow-menu`).click(),
  menuClickEdit: () =>
    cy.get('button[data-table-action="table.actions.connection.edit"]').click(),
  menuClickDelete: () =>
    cy
      .get('button[data-table-action="table.actions.connection.delete"]')
      .click(),
  menuClickDestroy: () =>
    cy.get('button[data-table-action="table.actions.cluster.destroy"]').click(),
  menuClickDetach: () =>
    cy.get('button[data-table-action="table.actions.cluster.detach"]').click()
};

export const secondaryHeader = {
  clickPrimary: () => cy.get(".secondary-header-actions-primary").click(),
  clickSecondary: () => cy.get(".secondary-header-actions-secondary").click()
};

export const noResource = {
  shouldExist: () => cy.get(".no-resource").should("exist"),
  shouldNotExist: () => cy.get(".no-resource").should("not.exist")
};

export const modal = {
  shouldBeOpen: () => cy.get(".bx--modal", { timeout: 20000 }).should("exist"),
  shouldBeClosed: () =>
    cy.get(".bx--modal", { timeout: 20000 }).should("not.exist"),
  shouldBeVisible: () =>
    cy.get(".bx--modal-container", { timeout: 20000 }).should("be.visible"),
  shouldNotBeVisible: () =>
    cy.get(".bx--modal-container", { timeout: 20000 }).should("not.be.visible"),
  clickDanger: () => cy.get(".bx--modal .bx--btn--danger--primary").click(),
  clickPrimary: () => cy.get(".bx--modal .bx--btn--primary").click(),
  clickSecondary: () => cy.get(".bx--modal .bx--btn--tertiary").click(),
  confirmAction: text => cy.get("#confirm-action").type(text)
};

export const notification = {
  shouldExist: type =>
    cy
      .get(`.bx--inline-notification[kind="${type}"]`, { timeout: 10000 })
      .should("exist")
};

export const resourcePage = {
  shouldLoad: () => {
    cy.get("#page").then(page => {
      if (page.find(".resource-table").length) {
        resourceTable.shouldExist();
      } else {
        noResource.shouldExist();
      }
    });
  }
};

export const menu = {};
