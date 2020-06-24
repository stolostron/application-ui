/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import msgs from '../../../nls/platform.properties'
import { validatorHelper, checkKeyExists, checkParsedKeys } from './utils'

const requiredValues = {
  Subscription: {
    apiVersion: '',
    kind: 'Subscription',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {
      channel: '',
      placement: {
        placementRef: {
          kind: 'PlacementRule',
          name: ''
        }
      }
    }
  }
}

const optionalValues = {
  PlacementRule: {
    apiVersion: '',
    kind: 'PlacementRule',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {}
  },
  Namespace: {
    apiVersion: '',
    kind: 'Namespace',
    metadata: {
      name: ''
    }
  }
}

const allValues = {
  Subscription: {
    apiVersion: '',
    kind: 'Subscription',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {
      channel: '',
      placement: {
        placementRef: {
          kind: 'PlacementRule',
          name: ''
        }
      }
    }
  },
  PlacementRule: {
    apiVersion: '',
    kind: 'PlacementRule',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {}
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
  const required = Object.keys(requiredValues)
  checkKeyExists(required, parsed, exceptions, locale)

  let subscriptionNamespace = ''
  let subscriptionPlacementRuleName = ''
  let placementRuleName = ''
  let placementRuleNameRow = ''
  let placementRuleNamespace = ''
  let placementRuleNamespaceRow = ''

  Object.keys(parsed).forEach(key => {
    const resources = parsed[key]
    // check if all required keys are present
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
        // pull out the namespace values for comparing
        if (raw && raw.kind === 'Subscription') {
          // pull out the namespace value
          if (raw.metadata && raw.metadata.namespace) {
            subscriptionNamespace = raw.metadata.namespace
          }
          // pull out the placement rule name in subscription
          if (
            raw.spec &&
            raw.spec.placement &&
            raw.spec.placement.placementRef &&
            raw.spec.placement.placementRef.name
          ) {
            subscriptionPlacementRuleName =
              raw.spec.placement.placementRef.name
          }
        }
        if (raw && raw.kind === 'PlacementRule') {
          // pull out the namespace value
          if (raw.metadata && raw.metadata.namespace) {
            placementRuleNamespace = raw.metadata.namespace
            placementRuleNamespaceRow = synced.metadata.$v.namespace.$r
          }
          // pull out the placement rule name
          if (raw.metadata && raw.metadata.name) {
            placementRuleName = raw.metadata.name
            placementRuleNameRow = synced.metadata.$v.name.$r
          }
        }

        // there may be more then one format for this resource
        let required = allValues[key]
        if (!Array.isArray(required)) {
          required = [required]
        }
        // keep checking until there's no error or no alternatives left
        const alternatives = required.length
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
  if (subscriptionNamespace) {
    if (
      placementRuleNamespace &&
      placementRuleNamespace !== subscriptionNamespace
    ) {
      // error
      exceptions.push({
        row: placementRuleNamespaceRow,
        text: msgs.get(
          'validation.namespace.mismatch',
          [subscriptionNamespace],
          locale
        ),
        column: 0,
        type: 'error'
      })
    }
  }
  if (subscriptionPlacementRuleName) {
    if (
      placementRuleName &&
      placementRuleName !== subscriptionPlacementRuleName
    ) {
      // error
      exceptions.push({
        row: placementRuleNameRow,
        text: msgs.get(
          'validation.placementrule.mismatch',
          [subscriptionPlacementRuleName],
          locale
        ),
        column: 0,
        type: 'error'
      })
    }
  }
}
