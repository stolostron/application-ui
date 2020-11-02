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
    for (const [key, value] of Object.entries(config)) {
      value.data.forEach(data => {
        let { enable, name } = data;
        if (enable) {
          process.env.CYPRESS_JOB_ID
            ? process.env.CYPRESS_JOB_ID.length > 5
              ? (name = name + "-" + process.env.CYPRESS_JOB_ID.slice(-5))
              : (name = name + "-" + process.env.CYPRESS_JOB_ID)
            : name;
          data.name = name;
        }
      });
      console.log(value);
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
