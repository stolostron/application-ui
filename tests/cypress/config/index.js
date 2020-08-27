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
    config = fs.readFileSync(path.join(__dirname, "config.e2e.yaml"));
  } else {
    config = fs.readFileSync(path.join(__dirname, "config.func.yaml"));
  }

  try {
    config = jsYaml.safeLoad(config);

    for (const [key, value] of Object.entries(config.wizards)) {
      const timeWindowType = Object.keys(config.timeWindows)[
        Math.floor(Math.random() * 3)
      ];
      if (value.enable) {
        const timewindowFlag = config.timeWindows[timeWindowType].setting;
        process.env.CYPRESS_JOB_ID
          ? timewindowFlag
            ? (value.name =
                value.name +
                "-" +
                process.env.CYPRESS_JOB_ID +
                "-" +
                timeWindowType.toLowerCase())
            : (value.name = value.name + "-" + process.env.CYPRESS_JOB_ID)
          : timewindowFlag
            ? (value.name = value.name + "-" + timeWindowType.toLowerCase())
            : value.name;
        console.log("type: ", value.name);
      }
    }
  } catch (e) {
    throw new Error(e);
  }

  return JSON.stringify(config);
};
