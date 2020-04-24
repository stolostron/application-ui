/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import {
  SORT_DIRECTION_ASCENDING,
  SORT_DIRECTION_DESCENDING
} from '../actions/'
/*
* UI helper to handle search and sort for table components
* */
class TableHelper {
  handleInputValue(cb, e) {
    const value = e.target.value
    cb(value)
  }
  handleSort(prevSortDirection, prevSortColumn, cb, e) {
    const target = e.currentTarget
    if (target) {
      const newSortColumn = target.getAttribute('data-key')
      const defaultSortColumn = target.getAttribute('data-default-key')
      const defaultSort =
        defaultSortColumn === newSortColumn
          ? SORT_DIRECTION_DESCENDING
          : SORT_DIRECTION_ASCENDING
      const prevSortDir =
        prevSortDirection === SORT_DIRECTION_ASCENDING
          ? SORT_DIRECTION_DESCENDING
          : SORT_DIRECTION_ASCENDING
      const prevSort =
        prevSortColumn !== newSortColumn
          ? SORT_DIRECTION_ASCENDING
          : prevSortDir
      const newSortDirection = prevSortColumn ? prevSort : defaultSort
      cb(newSortDirection, newSortColumn)
    }
  }
}

export default new TableHelper()
