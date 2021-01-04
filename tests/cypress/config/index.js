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
        let { enable, name, config } = data;
        if (enable) {
          // attach travis job id to each name
          const job_id =
            process.env.CYPRESS_JOB_ID && process.env.CYPRESS_JOB_ID.slice(-5);
          process.env.CYPRESS_JOB_ID ? (name = name + "-" + job_id) : name;
          data.name = name;

          // inject private credentials if given for the first subscription only if we have multiple subscriptions
          if (config.length > 1) {
            const givenConfig = config[0];
            switch (key) {
              case "git":
                if (
                  process.env.GITHUB_USER &&
                  process.env.GITHUB_TOKEN &&
                  process.env.GITHUB_PRIVATE_URL
                ) {
                  givenConfig.url = process.env.GITHUB_PRIVATE_URL;
                  givenConfig.username = process.env.GITHUB_USER;
                  givenConfig.token = process.env.GITHUB_TOKEN;
                }
                if (process.env.ANSIBLE_URL && process.env.ANSIBLE_TOKEN) {
                  givenConfig.ansibleHost = process.env.ANSIBLE_URL;
                  givenConfig.ansibleToken = process.env.ANSIBLE_TOKEN;
                }
                break;
              case "objectstore":
                if (
                  process.env.OBJECTSTORE_ACCESS_KEY &&
                  process.env.OBJECTSTORE_SECRET_KEY &&
                  process.env.OBJECTSTORE_PRIVATE_URL
                ) {
                  givenConfig.url = process.env.OBJECTSTORE_PRIVATE_URL;
                  givenConfig.accessKey = process.env.OBJECTSTORE_ACCESS_KEY;
                  givenConfig.secretKey = process.env.OBJECTSTORE_SECRET_KEY;
                }
                break;
              case "helm":
                if (
                  process.env.HELM_USERNAME &&
                  process.env.HELM_PASSWORD &&
                  process.env.HELM_PRIVATE_URL &&
                  process.env.HELM_CHART_NAME
                ) {
                  givenConfig.url = process.env.HELM_PRIVATE_URL;
                  givenConfig.username = process.env.HELM_USERNAME;
                  givenConfig.password = process.env.HELM_PASSWORD;
                  givenConfig.chartName = process.env.HELM_CHART_NAME;
                }
                break;
            }
          }

          // attach travis job id to the new subscription url
          if (data.new) {
            data.new.forEach(instance => {
              instance.url = instance.insecureSkipVerifyOption
                ? instance.url + "/" + job_id
                : instance.url;
            });
          }
          if (data.config && (key === "git" || key === "helm")) {
            data.config.forEach(instance => {
              if (instance.insecureSkipVerifyOption) {
                instance.url = instance.url + "/" + job_id;
              }
            });
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
