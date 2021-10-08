// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
const atob = require("atob");
const btoa = require("btoa");
const fs = require("fs");
const path = require("path");
const jsYaml = require("js-yaml");

const updateObjectStoreInfo = (process, config) => {
  if (
    process.env.OBJECTSTORE_ACCESS_KEY &&
    process.env.OBJECTSTORE_SECRET_KEY &&
    process.env.OBJECTSTORE_PRIVATE_URL
  ) {
    //secret is base64 encoded to allow any character
    const decodedSecret = atob(process.env.OBJECTSTORE_SECRET_KEY);
    const decodedKey = atob(process.env.OBJECTSTORE_ACCESS_KEY);

    //we want to set the private object store info for all
    config.forEach(item => {
      item.url = process.env.OBJECTSTORE_PRIVATE_URL;
      item.accessKey = decodedKey;
      item.secretKey = decodedSecret;
    });
  }
};

const SECRET_FILE_PATH = path.join(
  __dirname,
  "..",
  "/templates",
  "/secret_yaml/",
  "ansible-secret.yaml"
);

exports.getConfig = () => {
  let config;
  let secretConfig = fs.readFileSync(SECRET_FILE_PATH);
  if (process.env.CYPRESS_TEST_MODE === "e2e") {
    config = fs.readFileSync(path.join(__dirname, "config.e2e.yaml"));
  } else if (process.env.CYPRESS_TEST_MODE === "BVT") {
    config = fs.readFileSync(path.join(__dirname, "config.BVT.yaml"));
  } else {
    config = fs.readFileSync(path.join(__dirname, "config.func.yaml"));
  }

  try {
    config = jsYaml.safeLoad(config);
    secretConfig = jsYaml.safeLoad(secretConfig);
    for (const [key, value] of Object.entries(config)) {
      if (key !== "argo") {
        value.data.forEach(data => {
          let { enable, name, config } = data;
          if (enable) {
            // attach travis job id to each name
            const job_id =
              process.env.CYPRESS_JOB_ID &&
              process.env.CYPRESS_JOB_ID.slice(-5);
            process.env.CYPRESS_JOB_ID ? (name = name + "-" + job_id) : name;
            data.name = name;

            if (key == "objectstore" && data.new) {
              //update object store repo info for new subscription
              updateObjectStoreInfo(process, data.new);
            }

            // inject private credentials if given for the first subscription
            //only if we have multiple subscriptions
            //or this is an object store subscription
            if (config.length > 1 || key == "objectstore") {
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
                  break;
                case "objectstore":
                  updateObjectStoreInfo(process, config);
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

            if (key === "git" && config.length > 0) {
              if (process.env.ANSIBLE_URL && process.env.ANSIBLE_TOKEN) {
                secretConfig.data.host = btoa(process.env.ANSIBLE_URL);
                secretConfig.data.token = btoa(process.env.ANSIBLE_TOKEN);
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
    }
  } catch (e) {
    throw new Error(e);
  }
  return {
    config: JSON.stringify(config),
    secretConfig: JSON.stringify(secretConfig)
  };
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

exports.getrbacConfig = () => {
  let rbacConfig;
  rbacConfig = fs.readFileSync(path.join(__dirname, "config.rbac.yaml"));
  try {
    rbacConfig = jsYaml.safeLoad(rbacConfig);
    for (const [key, value] of Object.entries(rbacConfig)) {
      value.data.forEach(data => {
        let { enable, name, config } = data;
        if (enable) {
          // attach travis job id to each name
          const job_id =
            process.env.CYPRESS_JOB_ID && process.env.CYPRESS_JOB_ID.slice(-5);
          process.env.CYPRESS_JOB_ID ? (name = name + "-" + job_id) : name;
          data.name = name;
        }
      });
    }
  } catch (e) {
    throw new Error(e);
  }
  return JSON.stringify(rbacConfig);
};
