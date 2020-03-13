/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

const config = require("../../config");

module.exports = {
  url: function() {
    return `${this.api.launchUrl}${config.get("contextPath")}`;
  },
  elements: {
    header: ".app-header"
  },
  commands: [
    {
      inputUsername,
      inputPassword,
      submit,
      authenticate,
      waitForLoginSuccess,
      waitForLoginPageLoad
    }
  ]
};

// Detect if we are OCP login (default) or ICP login for backwards compatibility (temp)
function authenticate(user, password) {
  let loginPage = "html.login-pf";
  let ocpLoginLink = "a[href*='ocp']";
  let userNameField = "#inputUsername";
  let passwordField = "#inputPassword";
  let submitBtn = 'button[type="submit"]';
  this.waitForLoginPageLoad(loginPage);
  this.waitForElementPresent(ocpLoginLink);
  this.click(ocpLoginLink);
  this.waitForElementPresent(userNameField);
  this.inputUsername(user, userNameField);
  this.inputPassword(password, passwordField);
  this.submit(submitBtn);
  this.waitForLoginSuccess(loginPage);
}

function inputUsername(user, userNameField) {
  this.waitForElementPresent(userNameField).setValue(
    userNameField,
    user || process.env.K8S_CLUSTER_USER
  );
}

function inputPassword(password, passwordField) {
  this.waitForElementPresent(passwordField).setValue(
    passwordField,
    password || process.env.K8S_CLUSTER_PASSWORD
  );
}

function submit(submitBtn) {
  this.waitForElementPresent(submitBtn).click(submitBtn);
}

function waitForLoginSuccess() {
  this.waitForElementPresent("@header", 20000);
}

function waitForLoginPageLoad(loginPage) {
  this.waitForElementPresent(loginPage, 20000);
}
