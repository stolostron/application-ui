/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

/* eslint-disable react/no-array-index-key, react/prop-types */

import React from 'react'
import PropTypes from 'prop-types'
import { StructuredListWrapper, StructuredListHead, StructuredListRow, StructuredListCell, StructuredListBody } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import { getResourceType } from '../../../lib/client/resource-helper'

const ResourceTableRowExpandableContent = ({ items }, context) =>
  <StructuredListWrapper>
    <StructuredListHead>
      <StructuredListRow head>
        <StructuredListCell head>
          <div>{msgs.get('formfield.name', context.locale)}</div>
        </StructuredListCell>
        <StructuredListCell head>
          {msgs.get('formfield.type', context.locale)}
        </StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {items.map((item, index) => (
        <StructuredListRow key={`${item.resource}-${index}`} data-row-name={item.resource} >
          <StructuredListCell noWrap>{item.resource}</StructuredListCell>
          <StructuredListCell noWrap>{getResourceType(item, context.locale)}</StructuredListCell>
        </StructuredListRow>
      ))}
    </StructuredListBody>
  </StructuredListWrapper>

ResourceTableRowExpandableContent.contextTypes = {
  locale: PropTypes.string
}

export default ResourceTableRowExpandableContent
