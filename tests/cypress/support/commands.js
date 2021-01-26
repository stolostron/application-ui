/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const apiUrl = !Cypress.config().baseUrl.includes("localhost")
  ? Cypress.config().baseUrl.replace("multicloud-console.apps", "api") + ":6443"
  : Cypress.env("OC_CLUSTER_URL");

const authUrl = Cypress.config().baseUrl.replace(
  "multicloud-console",
  "oauth-openshift"
);

Cypress.Commands.add("login", (idp, user, password) => {
  cy.log(`Attempt to log in app tests user ${user} with idp ${idp}`);
  cy
    .get(".pf-c-login__main-body")
    .get(".pf-c-button")
    .each($el => {
      const userIDP = $el.text();
      if (userIDP == idp) {
        cy
          .get($el)
          .focus()
          .click({ force: true });

        cy
          .get("#inputUsername", { timeout: 20000 })
          .click()
          .focused()
          .type(user);
        cy
          .get("#inputPassword", { timeout: 20000 })
          .click()
          .focused()
          .type(password);
        cy.get('button[type="submit"]', { timeout: 20000 }).click();
        cy.get("#header", { timeout: 30000 }).should("exist");
      }
    });
});

Cypress.Commands.add("logout", () => {
  cy.log("Attempt to logout existing user");
  cy.get(".header-user-info-dropdown_icon").then($btn => {
    //logout when test starts since we need to use the app idp user
    cy.log("Logging out existing user");
    cy.get($btn).click();
    cy.contains("Log out").click();
    // cy.clearCookies()
  });
});

Cypress.Commands.add("editYaml", file => {
  const selectAllKey = Cypress.platform == "darwin" ? "{cmd}a" : "{ctrl}a";
  cy.task("readFile", file).then(str => {
    str = str.replace(/(?:\\[rn]|[\r\n]+)+/g, "\n{home}");
    cy
      .get(".inputarea")
      .click()
      .focused()
      .type(selectAllKey)
      .type(str, { delay: 0 });
  });
});

Cypress.Commands.add("acquireToken", () => {
  cy
    .request({
      method: "HEAD",
      url:
        authUrl +
        "/oauth/authorize?response_type=token&client_id=openshift-challenging-client",
      followRedirect: false,
      headers: {
        "X-CSRF-Token": 1
      },
      auth: {
        username: Cypress.env("OC_CLUSTER_USER"),
        password: Cypress.env("OC_CLUSTER_PASS")
      }
    })
    .then(resp => {
      return cy.wrap(resp.headers.location.match(/access_token=([^&]+)/)[1]);
    });
});

Cypress.Commands.add("createAppResource", (kind, resourceType) => {
  let prefix = "";
  switch (kind.toLowerCase()) {
    case "channel":
      prefix = "03_";
      cy.get('button[id="create-channel"]').click();
      switch (resourceType.toLowerCase()) {
        case "github":
          cy
            .get("a")
            .contains("Git")
            .click({ force: true });
          break;
        case "namespace":
          cy
            .get("a")
            .contains("Namespace")
            .click({ force: true });
          break;
        case "helmrepo":
          cy
            .get("a")
            .contains("HelmRepo")
            .click({ force: true });
          break;
        case "objectstore":
          cy
            .get("a")
            .contains("ObjectBucket")
            .click({ force: true });
          break;
      }
      break;
    case "subscription":
      prefix = "02_";
      cy.get('button[id="create-subscription"]').click();
      break;
    case "placementrule":
      prefix = "01_";
      cy.get('button[id="create-placement-rule"]').click();
      break;
    case "application":
      prefix = "00_";
      cy.get('button[id="create-application"]').click();
      break;
  }
  cy.editYaml(prefix + kind + "-" + resourceType + ".yaml");
  cy
    .get("button")
    .contains("Save")
    .click();
});

Cypress.Commands.add("getAppResourceAPI", (token, kind, namespace, name) => {
  let path =
    kind.toLowerCase() == "application"
      ? "/apis/app.k8s.io/v1beta1"
      : "/apis/apps.open-cluster-management.io/v1";
  cy
    .request({
      method: "GET",
      url:
        apiUrl +
        path +
        "/namespaces/" +
        namespace +
        "/" +
        kind.toLowerCase() +
        "s/" +
        name,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => {
      return cy.wrap(resp.status);
    });
});

Cypress.Commands.add("deleteAppResourcesInFileAPI", (token, file) => {
  cy.task("getResourceMetadataInFile", file).then(meta => {
    cy.log(meta);
    if (meta.kind.toLowerCase() !== "channel") {
      cy.deleteAppResourceAPI(token, meta.kind, meta.namespace, meta.name);
    }
    cy.deleteNamespaceAPI(token, meta.namespace);
  });
});

Cypress.Commands.add("deleteNamespaceAPI", (token, namespace) => {
  cy
    .request({
      method: "DELETE",
      url: apiUrl + "/api/v1/namespaces/" + namespace,
      failOnStatusCode: false,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => {
      return cy.wrap(resp.status);
    });
});

Cypress.Commands.add("deleteAppResourceAPI", (token, kind, namespace, name) => {
  let path =
    kind.toLowerCase() == "application"
      ? "/apis/app.k8s.io/v1beta1"
      : "/apis/apps.open-cluster-management.io/v1";
  cy
    .request({
      method: "DELETE",
      failOnStatusCode: false,
      url:
        apiUrl +
        path +
        "/namespaces/" +
        namespace +
        "/" +
        kind.toLowerCase() +
        "s/" +
        name,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
    .then(resp => {
      return cy.wrap(resp.status);
    });
});

Cypress.Commands.add("get$", selector => {
  return cy.wrap(Cypress.$(selector)).should("have.length.gte", 1);
});

Cypress.Commands.add("ocLogin", role => {
  const { users } = Cypress.env("USER_CONFIG");
  let user;
  if (role !== "kubeadmin") {
    cy.addUserIfNotCreatedBySuite();
    user = Cypress.env("OC_CLUSTER_USER", users[role]);
  }
  const loginUserDetails = {
    api: apiUrl,
    user: user || "kubeadmin",
    password: Cypress.env("OC_CLUSTER_PASS")
  };
  cy.exec(
    `oc login --server=${loginUserDetails.api} -u ${loginUserDetails.user} -p ${
      loginUserDetails.password
    }`
  );
});

Cypress.Commands.add("logInAsRole", role => {
  // reading users and idp  object values from users.yaml file
  const { users, idp } = Cypress.env("USER_CONFIG");
  const user = Cypress.env("OC_CLUSTER_USER", users[role]);
  const password = Cypress.env("OC_CLUSTER_PASS");

  // Cypress.env("OC_CLUSTER_PASS",Cypress.env("OC_CLUSTER_USER_PASS"))
  Cypress.env("OC_IDP", idp);

  // login only if user is not looged In
  const logInIfRequired = () => {
    cy.log(`Check if login is required for user ${user} with idp ${idp}`);
    cy
      .get(".header-user-info-dropdown")
      .invoke("text")
      .then(text => {
        cy.log(`Logged in User ${text} expected ${users[role]}`);
        if (text == users[role]) {
          cy.log(`Already Logged in as User $users[role]`);
        } else {
          cy.logout();
          cy.wait(5000);
          cy.login(idp, user, password);
        }
      });
  };
  cy.visit("/multicloud/applications");
  cy.get("body").then(body => {
    if (body.find("#header").length !== 0) {
      cy.log(
        "User already logged in, check if required to logout and login again"
      );
      logInIfRequired();
    }
    if (body.find("#header").length === 0) {
      cy.login(idp, user, password);
      cy.log(`Logged in with user ${users[role]}`);
    }
  });
});

Cypress.Commands.add("logoutFromRole", role => {
  const { users } = Cypress.env("USER_CONFIG");
  Cypress.env("OC_CLUSTER_USER", users[role]);
  cy.logout();
});

Cypress.Commands.add(
  "paste",
  {
    prevSubject: true,
    element: true
  },
  ($element, text) => {
    const subString = text.substr(0, text.length - 1);
    const lastChar = text.slice(-1);

    $element.text(subString);
    $element.val(subString);
    cy
      .get($element)
      .type(lastChar)
      .then(() => {
        if ($element.val() !== text)
          // first usage only setStates the last character for some reason
          cy
            .get($element)
            .clear()
            .type(text);
      });
  }
);
