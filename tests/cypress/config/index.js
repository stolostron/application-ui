/** *****************************************************************************
 * Licensed Materials - Property of Red Hat, Inc.
 * Copyright (c) 2020 Red Hat, Inc.
 ****************************************************************************** */

const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");
const cons = require("consolidate");

exports.getConfig = () => {
  let config;
  if (process.env.CYPRESS_TEST_MODE === "e2e") {
    config = fs.readFileSync(path.join(__dirname, "config.e2e.json"));
  } else {
    config = fs.readFileSync(path.join(__dirname, "config.func.json"));
  }

  try {
    config = jsYaml.safeLoad(config);
  } catch (e) {
    throw new Error(e);
  }

  for (const [key, value] of Object.entries(config)) {
    if (value.data.enable) {
      process.env.CYPRESS_JOB_ID
        ? (value.data.name = value.data.name + "-" + process.env.CYPRESS_JOB_ID)
        : value.data.name;
    }
  }

  return JSON.stringify(config);
};
