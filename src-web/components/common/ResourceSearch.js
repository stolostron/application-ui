/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { Search } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'

const ResourceSearch = ({
  handleSearch,
  searchLabel,
  searchPlaceholder,
  renderSmallSearch,
  searchValue
}, context) =>
  <Search
    className='resource-search'
    small={renderSmallSearch}
    aria-label={msgs.get('search.label', context.locale)}
    labelText={searchLabel ? searchLabel : msgs.get('search.label', context.locale)}
    placeHolderText={searchPlaceholder ? searchPlaceholder : msgs.get('search.placeholder', context.locale)}
    value={searchValue}
    onChange={handleSearch} />

ResourceSearch.contextTypes = {
  locale: PropTypes.string
}

export default ResourceSearch
