/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { TableRow, TableHeader } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import * as ResourceDefinitions from '../../definitions'

class ResourceTableHeader extends React.PureComponent {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)
    this.state = { activeColumn: undefined }
  }
  render() {
    const { staticResourceData, sortDirection, sortColumn, handleSort, resourceType, tableActions } = this.props
    return <TableRow header>
      {staticResourceData.tableKeys.map((key, index) => {
        const active = this.state.activeColumn === key.resourceKey || key.resourceKey === sortColumn || (!sortColumn && key.resourceKey === ResourceDefinitions.getDefaultSortField(resourceType))
        return <TableHeader
          key={`${key}-${index}`} /* eslint-disable-line react/no-array-index-key */
          sortDir={key.resourceKey === sortColumn ? sortDirection.toUpperCase() : 'asc'}
          data-key={key.resourceKey}
          data-default-key={staticResourceData.defaultSortField}
          className={`table-header-sortable${active && !key.dropdown ? '' : ' inactive'}`}
          onMouseEnter={this.handleMouseEnter.bind(this)}
          onMouseLeave={this.handleMouseLeave.bind(this)}
          onClick={!key.dropdown && handleSort || null}>{key.dropdown ? '' : msgs.get(key.msgKey, this.context.locale)}
        </TableHeader>
      })}
      {tableActions && tableActions.length > 0 && <TableHeader>{msgs.get('action', this.context.locale)}</TableHeader>}
    </TableRow>
  }

  handleMouseEnter(e) {
    const key = e.target.getAttribute('data-key')
    this.setState({ activeColumn: key})
  }
  handleMouseLeave() {
    this.setState({ activeColumn: undefined })
  }
}

ResourceTableHeader.contextTypes = {
  locale: PropTypes.string
}

export default ResourceTableHeader
