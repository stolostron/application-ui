/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import { validatorHelper, checkKeyExists, checkParsedKeys } from './utils'

const requiredValues = {
  PlacementRule: {
    apiVersion: '',
    kind: 'PlacementRule',
    metadata: {
      name: '',
      namespace: ''
    }
  }
}

const optionalValues = {}

const allValues = {
  PlacementRule: {
    apiVersion: '',
    kind: 'PlacementRule',
    metadata: {
      name: '',
      namespace: ''
    }
  }
}

export function validator(parsed, exceptions, locale) {
  const requiredKeys = Object.keys(requiredValues)

  checkKeyExists(requiredKeys, parsed, exceptions, locale)

  // check through all the parsed keys
  Object.keys(parsed).forEach(key => {
    const resources = parsed[key]
    // if it is NOT in either requiredValues nor optionalValues, it's an unknown key
    if (!requiredValues[key] && !optionalValues[key]) {
      checkParsedKeys(
        key,
        parsed,
        exceptions,
        requiredValues,
        optionalValues,
        locale
      )
    } else {
      resources.forEach(({ $raw: raw, $synced: synced }) => {
        // there may be more then one format for this resource
        let required = allValues[key]
        if (!Array.isArray(required)) {
          required = [required]
        }
        // keep checking until there's no error or no alternatives left
        const alternatives = required.length
        // some: at least one element
        required.some((requires, idx) => {
          const len = exceptions.length
          const err = validatorHelper(
            key,
            requires,
            raw,
            synced,
            idx < alternatives - 1,
            exceptions,
            locale
          )
          return !err && len === exceptions.length // this alternative had no problems
        })
      })
    }
  })
}
