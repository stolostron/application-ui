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
    config = fs.readFileSync(path.join(__dirname, "config.e2e.json"));
  } else {
    config = fs.readFileSync(path.join(__dirname, "config.func.json"));
  }

  try {
    config = jsYaml.safeLoad(config);
    for (const [key, value] of Object.entries(config)) {
      let { enable, name } = value.data;
      if (enable) {
        process.env.CYPRESS_JOB_ID
          ? process.env.CYPRESS_JOB_ID.length > 5
            ? (name = name + "-" + process.env.CYPRESS_JOB_ID.slice(-5))
            : (name = name + "-" + process.env.CYPRESS_JOB_ID)
          : name;
        console.log(name);
      }
    }
  } catch (e) {
    throw new Error(e);
  }

  return JSON.stringify(config);
};

exports.getKubeConfig = () => {
  const results = [];
  const dir = path.join(__dirname, "./import-kubeconfig");
  fs.readdirSync(dir).forEach(file => {
    if (file[0] !== ".") {
      file = `${dir}/${file}`;
      results.push(file);
    }
  });
  return results;
};
