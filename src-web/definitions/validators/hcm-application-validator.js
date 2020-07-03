/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import _ from 'lodash'
import msgs from '../../../nls/platform.properties'
import { checkKeyExists, checkParsedKeys, validatorHelper } from './utils'

const requiredValues = {
  Application: {
    apiVersion: '',
    kind: 'Application',
    metadata: {
      name: '',
      namespace: ''
    }
  }
}

const optionalValues = {
  Namespace: {
    apiVersion: '',
    kind: 'Namespace',
    metadata: {
      name: ''
    }
  }
}

const allValues = {
  Application: {
    apiVersion: '',
    kind: 'Application',
    metadata: {
      name: '',
      namespace: ''
    }
  },
  Namespace: {
    apiVersion: '',
    kind: 'Namespace',
    metadata: {
      name: ''
    }
  }
}

export function validator(parsed, exceptions, locale) {
  const requiredKeys = Object.keys(requiredValues)

  checkKeyExists(requiredKeys, parsed, exceptions, locale)

  let namespace = ''
  let applicationNamespace = ''
  let applicationNamespaceRow = ''

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
        //pull out the namespace values after looping through
        const kind = _.get(raw, 'kind', '')
        const ns = _.get(raw, 'metadata.namespace')

        if (kind === 'Namespace') {
          namespace = _.get(raw, 'metadata.name', '')
        } else if (kind === 'Application' && ns) {
          applicationNamespace = ns
          applicationNamespaceRow = synced.metadata.$v.namespace.$r
        }

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

  //namespace values must match what is defined(if passed)
  if (namespace && applicationNamespace && applicationNamespace !== namespace) {
    // error
    exceptions.push({
      row: applicationNamespaceRow,
      text: msgs.get('validation.namespace.mismatch', [namespace], locale),
      column: 0,
      type: 'error'
    })
  }
}
