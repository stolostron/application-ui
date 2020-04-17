/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

const requiredValues = {
  Channel: {
    apiVersion: '',
    kind: 'Channel',
    metadata: {
      name: '',
      namespace: ''
    },
    spec: {
      type: 'ObjectBucket|HelmRepo|Namespace|GitHub',
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
      type: 'ObjectBucket|HelmRepo|Namespace|GitHub',
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

  // check to see that all required keys exist
  required.forEach(key => {
    if (!parsed[key]) {
      exceptions.push({
        row: 0,
        column: 0,
        text: msgs.get('validation.missing.kind', [key], locale),
        type: 'error'
      })
    }
  })

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
      if (!optionalValues[key]) {
        resources.forEach(parse => {
          let row = _.get(parse, '$synced.kind.$r')
          let text = msgs.get('validation.extra.kind', [key], locale)
          if (row === undefined) {
            row = parse.$synced.$r
            text = msgs.get(
              'validation.missing.any.kind',
              [required.join(', ')],
              locale
            )
          }
          exceptions.push({
            row,
            text,
            column: 0,
            type: 'error'
          })
        })
      }
    } else {
      // there may be more then one format for this resource
      // assign the required values
      let required = allValues[key]

      resources.forEach(({ $raw: raw, $synced: synced }) => {
        // pull out the namespace values after looping through
        if (
          raw &&
          raw.kind === 'Namespace' &&
          raw.metadata &&
          raw.metadata.name
        ) {
          namespace = raw.metadata.name
        }
        if (
          raw &&
          raw.kind === 'Channel' &&
          raw.metadata &&
          raw.metadata.namespace
        ) {
          channelNamespace = raw.metadata.namespace
          channelNamespaceRow = synced.metadata.$v.namespace.$r
        }

        // pull out the spec / type
        if (raw && raw.kind && raw.kind === 'Channel') {
          // for Channel if it is type Namespace, remove pathname to make field optional
          if (raw.spec && raw.spec.type && raw.spec.type === 'Namespace')
            delete required.spec.pathname
          else required.spec.pathname = ''
        }

        if (
          raw &&
          raw.kind === 'ConfigMap' &&
          raw.metadata &&
          raw.metadata.namespace
        ) {
          configMapNamespace = raw.metadata.namespace
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

function validatorHelper(
  ky,
  required,
  raw,
  synced,
  hasAlternative,
  exceptions,
  locale
) {
  // does it have all the required keys?
  let error = false
  const requiredKeys = Object.keys(required)
  const diff = _.difference(requiredKeys, Object.keys(raw))
  if (diff.length > 0) {
    if (!hasAlternative) {
      exceptions.push({
        row: synced.$r,
        text: msgs.get(
          'validation.missing.keys',
          [ky, diff.join(', ')],
          locale
        ),
        column: 0,
        type: 'error'
      })
    } else {
      error = true
    }
  } else {
    // do all of those keys point to the right value type?
    requiredKeys.some(key => {
      const value = required[key]
      const rvalue = raw[key]
      const type = Array.isArray(value) ? 'array' : typeof value
      const rtype = Array.isArray(rvalue) ? 'array' : typeof rvalue
      const values = type === 'string' ? value.split('|') : []
      const row = _.get(synced, `$v.${key}.$r`) || synced.$r || 0
      if (type !== rtype) {
        exceptions.push({
          text: msgs.get('validation.bad.type', [key, type], locale),
          row,
          column: 0,
          type: 'error'
        })
      } else if (
        type === 'string' &&
        values[0].length > 0 &&
        values.indexOf(rvalue) === -1
      ) {
        exceptions.push({
          text: msgs.get(
            'validation.bad.value',
            [key, values.join(', ')],
            locale
          ),
          row,
          column: 0,
          type: 'error'
        })
      } else if (type === 'object' && Object.keys(value).length > 0) {
        // if required is an object, reiterate
        const sync = synced.$v || synced
        error = validatorHelper(
          key,
          value,
          rvalue,
          sync[key],
          hasAlternative,
          exceptions,
          locale
        )
      } else if (type === 'array') {
        rvalue.some(rval => {
          const sync = synced.$v || synced
          error = validatorHelper(
            key,
            value[0],
            rval,
            sync[key],
            hasAlternative,
            exceptions,
            locale
          )
          return error
        })
      }
      return error
    })
  }
  return error
}
