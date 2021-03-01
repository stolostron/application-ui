/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'
import lodash from 'lodash'

module.exports = (array, opts) => {
  if (array && array.length > 1) {
    return opts.fn(this)
  } else if (array && array.length === 1) {
    if (lodash.isObject(array[0])) {
      const emptyVals = Object.keys(array[0]).filter(
        key => array[0][key] === ''
      )
      return emptyVals.length < 1 ? opts.fn(this) : opts.inverse(this)
    } else if (array[0] !== '') {
      return opts.fn(this)
    } else {
      return opts.inverse(this)
    }
  } else {
    return opts.inverse(this)
  }
}
