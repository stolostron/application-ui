/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2020. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
/// <reference types="cypress" />

import { getManagedClusterName } from "../views/resources";

const e2eAuthJson = require("../templates/rbac_yaml/e2e-rbac-auth.json");
const secretValue = e2eAuthJson[0].value.htpasswd.fileData.name;
const idp = e2eAuthJson[0].value.name;
const RBAC_PASS = Cypress.env("OC_CLUSTER_PASS");
const filename = "htpasswd";

Cypress.Commands.add("addRolesToManagedClusterUser", () => {
  // const users = Cypress.env("managedClusterUser")
  cy
    .exec(
      "oc apply -f ./cypress/templates/rbac_yaml/e2e-rbac-clusterrolebinding.yaml"
    )
    .then(result => {
      return result.stdout;
    });
  const { users } = Cypress.env("USER_CONFIG");
  for (const role in users) {
    if (role == "admin-managed-cluster") {
      const cmdAddRole = `oc adm policy add-cluster-role-to-user \
                                open-cluster-management:admin:${Cypress.env(
                                  "managedCluster"
                                )} ${users[role]}| \
                                oc adm policy add-cluster-role-to-user admin ${
                                  users[role]
                                } -n ${Cypress.env("managedCluster")}`;
      cy.log(cmdAddRole);
      cy.exec(cmdAddRole);
    }
    if (role == "edit-managed-cluster") {
      const cmdAddRole = `oc adm policy add-cluster-role-to-user \
                                open-cluster-management:view:${Cypress.env(
                                  "managedCluster"
                                )} ${users[role]}| \
                                oc adm policy add-cluster-role-to-user edit ${
                                  users[role]
                                } -n ${Cypress.env("managedCluster")}`;
      cy.log(cmdAddRole);
      cy.exec(cmdAddRole);
    }
    if (role == "view-managed-cluster") {
      const cmdAddRole = `oc adm policy add-cluster-role-to-user \
                                open-cluster-management:view:${Cypress.env(
                                  "managedCluster"
                                )} ${users[role]}| \
                                oc policy add-role-to-user view ${
                                  users[role]
                                } -n ${Cypress.env("managedCluster")}`;
      cy.log(cmdAddRole);
      cy.exec(cmdAddRole);
    }
    if (role == "admin") {
      const cmdAddRole = `oc policy add-role-to-user admin ${
        users[role]
      } -n ${Cypress.env("managedCluster")}`;
      cy.log(cmdAddRole);
      cy.exec(cmdAddRole);
    }
    if (role == "edit") {
      const cmdAddRole = `oc policy add-role-to-user edit ${
        users[role]
      } -n ${Cypress.env("managedCluster")}`;
      cy.log(cmdAddRole);
      cy.exec(cmdAddRole);
    }
    if (role == "view") {
      const cmdAddRole = `oc policy add-role-to-user view ${
        users[role]
      } -n ${Cypress.env("managedCluster")}`;
      cy.log(cmdAddRole);
      cy.exec(cmdAddRole);
    }
  }
});

Cypress.Commands.add("addUsers", () => {
  // Adding users from users.yaml file

  const { users } = Cypress.env("USER_CONFIG");
  const secret = secretValue;
  cy.log(`secret values ${secret}`);
  const cmdGetSecrets =
    "oc get secret -n openshift-config -o jsonpath='{.items[*].metadata.name}'";
  const cmdCreateSecrets = `oc create secret generic ${secret} --from-file=htpasswd=${filename} -n openshift-config`;
  const cmdExtractSecrets = `oc extract secret/${secret} -n openshift-config --to - > ${filename}`;
  const updateSecrets = `oc create secret generic ${secret} --from-file htpasswd=test \
                            --dry-run=client -o yaml | oc replace -n openshift-config -f -`;

  const addingUserInHtpasswd = filename => {
    // creating a htpasswd file to store username and passwd
    cy.exec(`touch ${filename}`).then(stdout => {
      cy.log(stdout.stdout);
    });

    const addPasswordInFile = username => {
      // Function creates a local file userCreatedByTestSuite with list of users
      const cmdUpdateHtpasswd = `htpasswd -b ${filename} ${username} ${RBAC_PASS}`;
      cy.log("Checking Users:", username);
      cy
        .exec(cmdUpdateHtpasswd)
        .then(stdout => {
          return stdout.stdout;
        })
        .then(result => {
          console.log(result);
        });
    };
    for (const roles in users) {
      addPasswordInFile(users[roles]);
      cy.exec(`echo ${roles}:${users[roles]} >> userCreatedByTestSuite`);
    }
  };

  const extractSecrets = () => {
    // Extract secrets file
    cy.exec(cmdExtractSecrets).then(file => {
      return file.stdout;
    });
  };

  const addSecrets = () => {
    // Add/Update users in htpasswd file
    cy
      .exec(cmdGetSecrets)
      .then(stdout => {
        return stdout.stdout;
      })
      .then(result => {
        cy.log(result.split(" ").indexOf(secret));
        if (result.split(" ").indexOf(secret) < 0) {
          addingUserInHtpasswd(filename);
          cy
            .exec(cmdCreateSecrets)
            .then(stdout => {
              return stdout.stdout;
            })
            .then(result => {
              cy.log(`${result}`);
            });
        } else {
          // updating the users pass if secret already exists
          cy.log("Secret already exists");
          extractSecrets();
          cy.log("Udating Secret already exists");
          addingUserInHtpasswd(filename);
          cy.exec(updateSecrets).then(result => {
            cy.log("Updated Secrets");
            return result.stdout;
          });
        }
      });
  };
  addSecrets();
  // Wait to let openshift-authentication pod to restart and runnig
  cy.wait(3000);
  // Deleting htpasswd file
  cy.exec(`rm ${filename}`).then(stdout => {
    return stdout.stdout;
  });
});

Cypress.Commands.add("addUserIfNotCreatedBySuite", () => {
  cy.task("readFileMaybe", "userCreatedByTestSuite").then(result => {
    if (result == false) {
      getManagedClusterName();
      cy.deleteExistingUsersIdentity();
      cy.addUsers();
      cy.getIdentity();
      cy.wait(60000); // Wait for users to take affect
      cy.addRolesToManagedClusterUser();
    } else cy.log("Users Already initiated by Testsuite");
  });
});

Cypress.Commands.add("getIdentity", () => {
  const RBAC_AUTH_FILE_PATH = "cypress/templates/rbac_yaml/e2e-rbac-auth.json";
  const cmdGetidentity =
    "oc -n openshift-config get oauth cluster \
                                -o jsonpath='{.spec.identityProviders}'";
  const cmdClearidentity = `oc patch -n openshift-config oauth cluster \
                             --type json --patch '[{"op":"add","path":"/spec/identityProviders","value":[]}]'`;
  const cmdcheckIdentity = `oc -n openshift-config get oauth cluster \
                             -o jsonpath='{.spec.identityProviders[*].name}'`;

  cy
    .exec(cmdGetidentity)
    .then(stdout => {
      return stdout.stdout;
    })
    .then(result => {
      if (result.length < 3) {
        cy.log("No identity Exists");
        cy.exec(cmdClearidentity).then(stdout => {
          return stdout.stdout;
        });
      }
    });

  // Create new if IDP not exists
  cy
    .exec(cmdcheckIdentity)
    .then(stdout => {
      return stdout.stdout;
    })
    .then(result => {
      cy.log("Checking IDP:", idp);
      if (result.split(" ").indexOf(idp) < 0) {
        let createNewidentity = `oc patch -n openshift-config oauth cluster \
                                         --type json --patch "$(cat ${RBAC_AUTH_FILE_PATH})"`;
        cy.exec(createNewidentity).then(stdout => {
          cy.log(stdout.stdout);
        });
      } else cy.log("Identity already Present");
    });
});

Cypress.Commands.add("deleteExistingUsersIdentity", () => {
  // delete the pre-existing identity resource
  const { users } = Cypress.env("USER_CONFIG");

  cy
    .exec(`oc get users -o jsonpath='{.items[*].metadata.name}'`)
    .then(result => {
      const userlist = result.stdout.split(" ").filter(i => i);
      for (const roles in users) {
        if (userlist.length !== 0 && userlist.includes(users[roles])) {
          cy.exec(`oc delete users ${users[roles]}`);
        }
      }
    });

  cy
    .exec(`oc get identity -o jsonpath='{.items[*].metadata.name}'`)
    .then(identity => {
      const identityList = identity.stdout.split(" ").filter(i => i);
      cy.log(identityList);
      cy.log(`Delete identity ${idp} `);
      for (const roles in users) {
        if (
          identityList.length !== 0 &&
          identityList.includes(`${idp}:${users[roles]}`)
        ) {
          cy.log(`Deleteing existing identity ${idp}:${users[roles]}`);
          cy.exec(`oc delete identity ${idp}:${users[roles]}`);
        }
      }
    });
});
