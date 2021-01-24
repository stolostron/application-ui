/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import { deleteApplicationUI ,
         verifyUnauthorizedApplicationDelete} from "../../views/application";
import {
  channelsInformation,
  deleteChannel,
  deleteNamespaceHub,
  getManagedClusterName
} from "../../views/resources";
import {resourceTable, modal,getResourceKey } from "../../views/common";

const mngdTestAdminRoles = 'admin-managed-cluster'
const mngdTestViewRole   = 'view-managed-cluster'
const mngdTestEditRole   = 'edit-managed-cluster'

describe("Application UI: [P1][Sev1][app-lifecycle-ui][RBAC] Delete application Test", () => {
  if (Cypress.env('RBAC_TEST')) {
  for (const type in config) {
    if(type == 'git'){
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        const name = data.name;
        it(`get the name of the managed OCP cluster`, () => {
          getManagedClusterName();
          
        });

        it(`[P1][Sev1][app-lifecycle-ui][RBAC] Verify a user with role ${mngdTestViewRole} cannot delete 
        application ${data.name} from UI`, () => {
         
          const namespace  = Cypress.env("managedCluster");
          cy.logInAsRole(mngdTestViewRole)
          verifyUnauthorizedApplicationDelete(name,namespace)

        });

        
        it(`[P1][Sev1][app-lifecycle-ui][RBAC] Verify application ${
          data.name
        } is deleted from UI with role: ${mngdTestAdminRoles} `, () => {
          cy.logInAsRole(mngdTestAdminRoles)
          const namespace  = Cypress.env("managedCluster");
          deleteApplicationUI(data.name,namespace);
        });

      } else {
        it(`Verify disable deletion on resource ${data.name} ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
      }
    });
  }}}
  else {
    it('Skipping RBAC Test to execute test set export CYPRESS_RBAC_TEST=`true`',() => {
      cy.log('set export CYPRESS_RBAC_TEST=`true`')
    });
  }
});
