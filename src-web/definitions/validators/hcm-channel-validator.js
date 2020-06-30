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
import { validatorHelper, checkKeyExists, checkParsedKeys } from './utils'

const requiredValues = {
  Channel: {
    apiVersion: '',
    kind: 'Channel',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {
      type: 'ObjectBucket|HelmRepo|Namespace|GitHub|Git',
      pathname: ''
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
  },
  ConfigMap: {
    apiVersion: '',
    kind: 'ConfigMap',
    metadata: {
      name: '',
      namespace: ''
    }
  },
  Secret: {
    apiVersion: '',
    kind: 'Secret',
    metadata: {
      name: '',
      namespace: ''
    }
  }
}

const allValues = {
  Namespace: {
    apiVersion: '',
    kind: 'Namespace',
    metadata: {
      name: ''
    }
  },
  Channel: {
    apiVersion: '',
    kind: 'Channel',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {
      type: 'ObjectBucket|HelmRepo|Namespace|GitHub|Git',
      pathname: '' // pathname by default will be required field
    }
  },
  ConfigMap: {
    apiVersion: '',
    kind: 'ConfigMap',
    metadata: {
      name: '',
      namespace: ''
    }
  },
  Secret: {
    apiVersion: '',
    kind: 'Secret',
    metadata: {
      name: '',
      namespace: ''
    }
  }
}

export function validator(parsed, exceptions, locale) {
  const required = Object.keys(requiredValues)

  checkKeyExists(required, parsed, exceptions, locale)

  let namespace = ''
  let channelNamespace = ''
  let configMapNamespace = ''
  let channelNamespaceRow = ''
  let configMapNamespaceRow = ''

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
      // there may be more then one format for this resource
      // assign the required values
      let required = allValues[key]

      resources.forEach(({ $raw: raw, $synced: synced }) => {
        // pull out the namespace values after looping through
        const kind = _.get(raw, kind, '')
        const ns = _.get(raw, 'metadata.namespace')

        if (kind === 'Namespace') {
          namespace = _.get(raw, 'metadata.name', '')
        }
        if (kind === 'Channel' && ns) {
          channelNamespace = ns
          channelNamespaceRow = synced.metadata.$v.namespace.$r
        }
        if (kind === 'ConfigMap' && ns) {
          configMapNamespace = ns
          configMapNamespaceRow = synced.metadata.$v.namespace.$r
        }

        // convert required into an array
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

  // namespace values must match what is defined (if passed)
  if (namespace) {
    if (channelNamespace && channelNamespace !== namespace) {
      // error
      exceptions.push({
        row: channelNamespaceRow,
        text: msgs.get('validation.namespace.mismatch', [namespace], locale),
        column: 0,
        type: 'error'
      })
    }
    if (configMapNamespace && configMapNamespace !== namespace) {
      // error
      exceptions.push({
        row: configMapNamespaceRow,
        text: msgs.get('validation.namespace.mismatch', [namespace], locale),
        column: 0,
        type: 'error'
      })
    }
  }
}
