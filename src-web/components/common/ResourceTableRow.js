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
import { TableRow, TableData, OverflowMenu, OverflowMenuItem } from 'carbon-components-react'
import { connect } from 'react-redux'
import msgs from '../../../nls/platform.properties'
import { withRouter } from 'react-router-dom'
import { transform } from '../../../lib/client/resource-helper'
import { resourceActions } from './ResourceTableRowMenuItemActions'
import lodash from 'lodash'

class ResourceTableRow extends React.PureComponent {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types */

  render() {
    const {
      resource,
      staticResourceData,
      even,
      tableActions
    } = this.props
    const { locale } = this.context
    return (
      <TableRow even={even} data-row-name={lodash.get(resource, lodash.get(staticResourceData, 'tableKeys[0].resourceKey'))}>
        {staticResourceData.tableKeys.map((key, index) =>
          /* eslint-disable-next-line react/no-array-index-key */
          <TableData key={`${key.resourceKey}-${index}`}>
            {transform(resource, key, locale)}
          </TableData>
        )}
        {tableActions && tableActions.length > 0 &&
          <TableData>
            <OverflowMenu flipped={true} iconDescription={msgs.get('svg.description.overflowMenu', locale)}>
              {tableActions.map((action, index) =>
                /* eslint-disable-next-line react/no-array-index-key */
                <OverflowMenuItem data-table-action={action} isDelete={action ==='table.actions.remove' || action ==='table.actions.delete'} onClick={() => this.props.getResourceAction(action, resource)} key={`${action}-${index}`} itemText={msgs.get(action, locale)} />)}
            </OverflowMenu>
          </TableData>
        }
      </TableRow>
    )
  }
}

ResourceTableRow.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => state

const mapDispatchToProps = (dispatch, ownProps) => {
  const resourceType = ownProps.resourceType
  return {
    getResourceAction: (action, resource) => {
      return resourceActions(action, dispatch, resourceType, resource)
    }
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ResourceTableRow))
