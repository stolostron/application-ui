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
  let applicationNamespace = ''
  let applicationNamespaceRow = ''

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
      resources.forEach(({ $raw: raw, $synced: synced }) => {
        //pull out the namespace values after looping through
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
          raw.kind === 'Application' &&
          raw.metadata &&
          raw.metadata.namespace
        ) {
          applicationNamespace = raw.metadata.namespace
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
  if (namespace) {
    if (applicationNamespace && applicationNamespace !== namespace) {
      // error
      exceptions.push({
        row: applicationNamespaceRow,
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
