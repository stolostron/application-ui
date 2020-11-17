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
          if (data.new) {
            switch (key) {
              case "git":
                if (
                  process.env.GITHUB_USER &&
                  process.env.GITHUB_TOKEN &&
                  process.env.GITHUB_PRIVATE_URL
                ) {
                  data.new.forEach(instance => {
                    instance.url = process.env.GITHUB_PRIVATE_URL;
                    instance.username = process.env.GITHUB_USER;
                    instance.token = process.env.GITHUB_TOKEN;
                  });
                }
                break;
              case "objectstore":
                if (
                  process.env.OBJECTSTORE_ACCESS_KEY &&
                  process.env.OBJECTSTORE_SECRET_KEY &&
                  process.env.OBJECTSTORE_PRIVATE_URL
                ) {
                  data.new.forEach(instance => {
                    instance.url = process.env.OBJECTSTORE_PRIVATE_URL;
                    instance.accessKey = process.env.OBJECTSTORE_ACCESS_KEY;
                    instance.secretKey = process.env.OBJECTSTORE_SECRET_KEY;
                  });
                }
                break;
              case "helm":
                if (
                  process.env.HELM_USERNAME &&
                  process.env.HELM_PASSWORD &&
                  process.env.HELM_PRIVATE_URL &&
                  process.env.HELM_CHART_NAME
                ) {
                  data.new.forEach(instance => {
                    instance.url = process.env.HELM_PRIVATE_URL;
                    instance.username = process.env.HELM_USERNAME;
                    instance.password = process.env.HELM_PASSWORD;
                    instance.chartName = process.env.HELM_CHART_NAME;
                  });
                }
                break;
            }
          }
        }
      });
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

exports.getUsers = () => {
  // returns the userlist oject with username,
  // IDP corresponding role
  let userData;
  userData = jsYaml.safeLoad(
    fs.readFileSync(path.join(__dirname, "users.yaml"))
  );
  const userList = {
    users: userData.users,
    idp: userData.idp
  };
  return userList;
};
