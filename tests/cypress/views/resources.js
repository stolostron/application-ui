/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

export const targetResource = data => {
  const name = data.name;
  const config = data.config;
  const kubeconfigs = Cypress.env("KUBE_CONFIG");
  if (kubeconfigs) {
    kubeconfigs.forEach(kubeconfig => {
      cy.log(`cluster - ${kubeconfig}`);
      for (const [key, value] of Object.entries(config)) {
        cy.log(`instance-${key}`);
        !value.deployment.local
          ? subscription(key, name, kubeconfig)
          : cy.log(`${name} has been deployed locally`);
      }
    });
  } else {
    cy.log(
      `skipping validating resource on managed cluster as no kubeconfig is provided`
    );
  }
};

export const apiResources = (type, data) => {
  const name = data.name;
  const config = data.config;

  for (const [key, value] of Object.entries(config)) {
    cy.log(`instance-${key}`);
    channels(key, type, name);
    subscription(key, name);
    !value.deployment.local
      ? placementrule(key, name)
      : cy.log(
          "placement will not be created as the application is deployed locally"
        );
  }
};

export const channelsInformation = (name, key) => {
  // Return a Cypress chain with channel name/namespace from subscription
  return cy
    .exec(
      `oc -n ${name}-ns get subscription ${name}-subscription-${key} -o=jsonpath='{.spec.channel}'`
    )
    .then(({ stdout }) => {
      const [channelNs, channelName] = stdout.split("/");
      return {
        channelNs,
        channelName
      };
    });
};

export const channels = async (key, type, name) => {
  channelsInformation(name, key).then(({ channelNs, channelName }) => {
    cy.log(`validate the ${type} channel`);
    cy.exec(`oc get channel ${channelName} -n ${channelNs}`);
    cy.exec(`oc get ns ${channelNs}`);
  });
};

export const placementrule = (key, name) => {
  cy.log(`validate the placementrule`);
  cy.exec(`oc get placementrule -n ${name}-ns`).then(({ stdout, stderr }) => {
    cy.exec(`oc get placementrule ${name}-placement-${key} -n ${name}-ns`);
    cy.exec(`oc get ns ${name}-ns`);
  });
};

export const subscription = (key, name, kubeconfig = "") => {
  let managedCluster = kubeconfig ? `--kubeconfig ${kubeconfig}` : "";

  cy.log(`validate the subscription`);
  cy.exec(`oc ${managedCluster} get subscriptions -n ${name}-ns`).then(() => {
    if (!managedCluster) {
      cy.exec(`oc get subscription ${name}-subscription-${key} -n ${name}-ns`);
    } else {
      cy.exec(
        `oc ${managedCluster} get subscription -n ${name}-ns | awk 'NR>1 {print $1}'`
      );
    }
  });
  // namespace
  cy.log(`validate the namespace`);
  cy.exec(`oc  ${managedCluster} get ns ${name}-ns`);
};

export const validateTimewindow = (name, config) => {
  for (const [key, value] of Object.entries(config)) {
    const { timeWindow } = value;
    const windowType = { activeinterval: "active", blockinterval: "blocked" };
    // get the subscription
    cy.log(
      `instance ${key}-the subscription should contain the correct timewindow information`
    );
    cy.exec(`oc get subscription -n ${name}-ns`).then(({ stdout, stderr }) => {
      cy.log(stdout || stderr);
      cy.log("the subscription is not empty");
      if (
        timeWindow.type === "activeinterval" ||
        timeWindow.type === "blockinterval"
      ) {
        const searchText = windowType[timeWindow.type];
        cy
          .exec(
            `oc get subscription ${name}-subscription-${key} -n ${name}-ns -o yaml`
          )
          .its("stdout")
          .should("contain", "timewindow")
          .should("contain", searchText);
      } else {
        cy.log("active selected... checking the default type");
        cy
          .exec(
            `oc get subscription ${name}-subscription-${key} -n ${name}-ns -o yaml`
          )
          .its("stdout")
          .should("not.contain", "timewindow");
      }
    });
  }
};

export const getManagedClusterName = () => {
  cy.exec(`oc get managedcluster -oname`).then(({ stdout }) => {
    let managedClusters = stdout.split("\n");
    const substrings = [
      "vendor: OpenShift",
      'status: "True"',
      "type: ManagedClusterJoined"
    ];
    managedClusters.forEach((cluster, index) =>
      cy.exec(`oc get ${cluster} -o yaml`).then(({ stdout }) => {
        let isReady = false;
        substrings.forEach(substring => {
          stdout.includes(substring) ? (isReady = true) : isReady;
          isReady == false ? managedClusters.splice(index, 1) : managedClusters;
        });
      })
    );
    cy.log(managedClusters).then(() => {
      managedClusters
        ? (Cypress.env("managedCluster", managedClusters[0]),
          cy.log(`managed cluster is ${managedClusters[0]}`))
        : cy.log("Managed cluster is undefined!");
    });
  });
};

export const deleteNamespaceHub = (data, name, type) => {
  cy.exec(`oc delete ns ${name}-ns`, {
    failOnNonZeroExit: type !== "helm", // helm namespaces in particular get stuck
    timeout: 100 * 1000
  });
};

export const deleteNamespaceTarget = (name, kubeconfig) => {
  let managedCluster = "";
  if (kubeconfig) {
    (managedCluster = `--kubeconfig ${kubeconfig}`),
      cy
        .exec(`oc ${managedCluster} get ns ${name}-ns`, {
          failOnNonZeroExit: false
        })
        .then(({ stdout, stderr }) => {
          if ((stdout || stderr).includes("not found") === false) {
            cy
              .exec(
                `oc ${managedCluster} ${managedCluster} delete ns ${name}-ns`
              )
              .its("stdout")
              .should("contain", `${name}-ns`);
          } else {
            cy.log(`namespace - ${name}-ns does not exist`);
          }
        });
  }
};
