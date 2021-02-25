/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import {
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody
} from 'carbon-components-react'
import { Module, ModuleBody } from 'carbon-addons-cloud-react'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { transform } from '../../../lib/client/resource-helper'
import { Link } from 'react-router-dom'

resources(() => {
  require('../../../scss/structured-list.scss')
})

const StructuredListModule = ({ headerRows, rows, data, url }, context) => (
  <Module className="structured-list-module">
    <ModuleBody>
      <StructuredListWrapper
        className="bx--structured-list--condensed"
        role="region"
      >
        <StructuredListHead>
          <StructuredListRow head>
            {headerRows.map(row => (
              <StructuredListCell head key={row + 'Header'}>
                {msgs.get(row, context.locale)}
              </StructuredListCell>
            ))}
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {Array.isArray(data)
            ? data.map((item, index) => (
              <StructuredListRow
                key={rows[0].cells[0].resourceKey + `Row ${index}`}
                >
                {rows[0].cells.map(cell => (
                  <StructuredListCell key={cell.resourceKey + 'Cell'}>
                    <p>
                      {cell.link && url ? (
                        <Link to={url} className="bx--link">
                          {transform(item, cell, context.locale)}
                        </Link>
                      ) : (
                        transform(item, cell, context.locale)
                      )}
                    </p>
                  </StructuredListCell>
                ))}
              </StructuredListRow>
            ))
            : rows.map(({ cells }) => (
              <StructuredListRow key={cells[0].resourceKey + 'Row'}>
                {cells.map(cell => (
                  <StructuredListCell key={cell.resourceKey + 'Cell'}>
                    <div>
                      {cell.link && url ? (
                        <Link to={url} className="bx--link">
                          {transform(data, cell, context.locale)}
                        </Link>
                      ) : (
                        transform(data, cell, context.locale)
                      )}
                    </div>
                  </StructuredListCell>
                ))}
              </StructuredListRow>
            ))}
        </StructuredListBody>
      </StructuredListWrapper>
    </ModuleBody>
  </Module>
)

StructuredListModule.contextTypes = {
  locale: PropTypes.string
}

StructuredListModule.propTypes = {
  data: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  headerRows: PropTypes.array,
  rows: PropTypes.array,
  url: PropTypes.string
}

export default StructuredListModule
