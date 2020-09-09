/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

/// <reference types="cypress" />

export const targetResource = {
  action: (action, data) => {
    const name = data.name;
    const config = data.config;
    const kubeconfigs = Cypress.env("KUBE_CONFIG");
    if (kubeconfigs) {
      kubeconfigs.forEach(kubeconfig => {
        cy.log(`cluster - ${kubeconfig}`);
        for (const [key, value] of Object.entries(config)) {
          cy.log(`instance-${key}`);
          subscription(key, action, name, kubeconfig);
        }
      });
    } else {
      cy.log(
        `skipping ${action} resource on managed cluster as no kubeconfig is provided`
      );
    }
  }
};

export const apiResources = {
  action: (type, action, data) => {
    const name = data.name;
    const config = data.config;

    for (const [key, value] of Object.entries(config)) {
      cy.log(`instance-${key}`);
      channels(key, type, action, name, value);
      subscription(key, action, name);
      placementrule(key, action, name);
    }
  }
};

export const channels = (key, type, action, name, config) => {
  const { repository } = config;
  const objChannelKey = parseInt(key) + 1;
  const channelDict = {
    git: {
      channelNs: "app-samples-chn-ns",
      channelName: "app-samples-chn"
    },
    objectstore: {
      channelNs: `dev${objChannelKey}-chn-ns`,
      channelName: `dev${objChannelKey}-chn`
    },
    "local-cluster": {
      channelNs: "resource-ns",
      channelName: "resource"
    }
  };

  if (type === "local-cluster") {
    if (repository) {
      let newValue = {
        channelNs: `${repository}-chn-ns`,
        channelName: `${repository}-chn`
      };
      channelDict[type] = newValue;
    }
  }

  const { channelNs, channelName } = channelDict[type];
  cy.log(`${action} the ${type} channel if it exists`);
  cy
    .exec(`oc get channels -n ${name}-${channelNs}-${key}`)
    .then(({ stdout, stderr }) => {
      cy.log(stdout || stderr);
      if ((stdout || stderr).includes("No resource") === false) {
        cy.log("There exist channel");
        cy
          .exec(
            `oc ${action} channel ${name}-${channelName}-${key} -n ${name}-${channelNs}-${key}`
          )
          .its("stdout")
          .should("contain", name);
        cy
          .exec(`oc ${action} ns ${name}-${channelNs}-${key}`)
          .its("stdout")
          .should("contain", `${name}`);
      } else {
        cy.log(
          `The channel ${name}-${channelName}-${key} in namespace:${name}-${channelNs}-ns-${key} is empty`
        );
      }
    });
};

export const placementrule = (key, action, name) => {
  cy.log(`${action} the placementrule if it exists`);
  cy.exec(`oc get placementrule -n ${name}-ns`).then(({ stdout, stderr }) => {
    cy.log(stdout || stderr);
    if ((stdout || stderr).includes("No resource") === false) {
      cy.log("There exist subscription");
      cy
        .exec(
          `oc ${action} placementrule ${name}-placement-${key} -n ${name}-ns`
        )
        .its("stdout")
        .should("contain", `${name}`);
      cy
        .exec(`oc ${action} ns ${name}-ns`)
        .its("stdout")
        .should("contain", `${name}`);
    } else {
      cy.log(
        `The placementrule ${name}-placement-${key} in namespace:${name}-ns is empty`
      );
    }
  });
};

export const subscription = (key, action, name, kubeconfig = "") => {
  let managedCluster = "";
  kubeconfig ? (managedCluster = `--kubeconfig ${kubeconfig}`) : managedCluster;

  cy.log(`${action} the subscription if it exists`);
  cy
    .exec(`oc ${managedCluster} get subscriptions -n ${name}-ns`)
    .then(({ stdout, stderr }) => {
      if ((stdout || stderr).includes("No resource") === false) {
        cy.log("There exists subscription");
        if (!managedCluster) {
          cy
            .exec(
              `oc ${action} subscription ${name}-subscription-${key} -n ${name}-ns`
            )
            .its("stdout")
            .should("contain", `${name}`);
        } else {
          action == "get"
            ? cy
                .exec(
                  `oc ${managedCluster}  ${action} subscription -n ${name}-ns | awk 'NR>1 {print $1}'`
                )
                .its("stdout")
                .should("contain", `${name}`)
            : (cy
                .exec(
                  `oc ${managedCluster} ${action} --all subscriptions -n ${name}-ns`,
                  { timeout: 100 * 1000 }
                )
                .its("stdout")
                .should("contain", `${action}`),
              cy
                .exec(`oc ${managedCluster} get subscriptions -n ${name}-ns`)
                .its("stderr")
                .should("contain", "No resources"),
              { timeout: 100 * 1000 });
        }
      } else {
        cy.log(`The subscription in namespace:${name}-ns is empty`);
      }
    });
  // namespace
  cy.log(`${action} the namespace if it exists`);
  cy.exec(`oc ${managedCluster} get ns -A`).then(({ stdout }) => {
    if (stdout.includes(`${name}-ns`)) {
      cy
        .exec(`oc  ${managedCluster}  ${action} ns ${name}-ns`)
        .its("stdout")
        .should("contain", `${name}`);
    } else {
      cy.log("no namespace left");
    }
  });
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
