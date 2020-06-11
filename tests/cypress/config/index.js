/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");

exports.getConfig = () => {
  let config;
  if (process.env.CYPRESS_TEST_MODE === "e2e") {
    config = fs.readFileSync(path.join(__dirname, "config.e2e.yaml"));
  } else {
    config = fs.readFileSync(path.join(__dirname, "config.func.yaml"));
  }

  try {
    config = jsYaml.safeLoad(config);
  } catch (e) {
    throw new Error(e);
  }

  return JSON.stringify(config);
};
