/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

const path = require("path");
const platformFilePath = path.join(
  __dirname,
  "../../../nls/platform.properties"
);
const propertiesParser = require("properties-parser");
const jsonfile = require("jsonfile");
const fs = require("fs");

module.exports = async function() {
  // Use predicatble timezone for tests
  process.env.TZ = "America/Toronto";

  var content = fs.readFileSync(platformFilePath, { encoding: "utf-8" });
  if (content) {
    var jsonObject = propertiesParser.parse(content);
    if (jsonObject) {
      const file = path.join(
        __dirname,
        "../../../tests/jest/config/platform-properties.json"
      );
      jsonfile.writeFileSync(file, jsonObject, { spaces: 2, EOL: "\r\n" });
    }
  }
};
