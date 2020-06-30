/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
var config = require("./config");

module.exports = (settings => {
  if (process.env.TEST_LOCAL) {
    var defaultUrl = `https://localhost:${config.get("httpsPort")}`;
  } else {
    var defaultUrl = process.env.RHACM4K8;
  }

  console.log("DEFAULT URL IS: ", defaultUrl); // eslint-disable-line no-console

  settings.test_settings.default.launch_url = defaultUrl;

  return settings;
})(require("./nightwatch.json"));
