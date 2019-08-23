/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

const path = require('path')
const platformFilePath = path.join(
  __dirname,
  '../../../nls/platform.properties'
)
const propertiesParser = require('properties-parser')
const jsonfile = require('jsonfile')
const fs = require('fs')

module.exports = async function() {
  var content = fs.readFileSync(platformFilePath, { encoding: 'utf-8' })
  if (content) {
    var jsonObject = propertiesParser.parse(content)
    if (jsonObject) {
      const file = path.join(
        __dirname,
        '../../../tests/jest/config/platform-properties.json'
      )
      jsonfile.writeFileSync(file, jsonObject, { spaces: 2, EOL: '\r\n' })
    }
  }
}
