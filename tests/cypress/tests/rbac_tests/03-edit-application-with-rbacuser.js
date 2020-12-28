/*******************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 *******************************************************************************/

const config = JSON.parse(Cypress.env("TEST_CONFIG"));
import {
  verifyEditAfterDeleteSubscription,
  deleteFirstSubscription,
  addNewSubscription
} from "../../views/application";

import {
  getManagedClusterName,
  getNumberOfManagedClusters
} from "../../views/resources";

const mngdTestEditRole   = 'edit-managed-cluster' 
const mngdTestAdminRoles = 'admin-managed-cluster'
const mngdTestViewRole   = 'view-managed-cluster'

describe("Application UI: [P1][Sev1][app-lifecycle-ui][RBAC] Edit application subscription Test", () => {
if (Cypress.env('RBAC_TEST')) {
  for (const type in config) {
    if(type == 'git'){
    const apps = config[type].data;
    apps.forEach(data => {
      if (data.enable) {
        it(`Verify first subscription can be deleted for app with role: ${mngdTestEditRole} ${
          data.name
        }`, () => {
          deleteFirstSubscription(data.name, data,'edge1');
        });
        if (data.config.length > 1) {
          it(`Verify ${
            data.name
          } is valid after first subscription is deleted`, () => {
            cy.logInAsRole('edit-managed-cluster')
            const clusterName = Cypress.env("managedCluster");
            const namespace = clusterName
            verifyEditAfterDeleteSubscription(data.name, data);
          });
        }
        if (data.new) {
          it(`get the name of the managed OCP cluster`, () => {
            getManagedClusterName();
          });
          it(`get the number of the managed OCP clusters`, () => {
            getNumberOfManagedClusters();
          });
            it(`Verify new subscription can be added for application ${
              data.name
            } with role: ${mngdTestAdminRoles}`, () => {
            cy.logInAsRole('edit-managed-cluster')
              const clusterName = Cypress.env("managedCluster");
              addNewSubscription(data.name, data, clusterName);
            });
          }
      } else {
        it(`disable modification on resource ${type}`, () => {
          cy.log(`skipping ${type} - ${data.name}`);
        });
        }
     });
    }}
    }else{
      it('Skipping RBAC Test to execute test set export CYPRESS_RBAC_TEST=`true`',() => {
        cy.log('set export CYPRESS_RBAC_TEST=`true`')
      })
  }
});
