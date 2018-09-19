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
import { getLink } from '../../definitions'
import { transform } from '../../../lib/client/resource-helper'
import { resourceActions } from './ResourceTableRowMenuItemActions'
import lodash from 'lodash'

const deleteActions = [
  'table.actions.applications.remove',
  'table.actions.compliance.remove',
  'table.actions.policy.remove',
  'table.actions.remove',
]
class ResourceTableRow extends React.PureComponent {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types */

  getOverflowMenuHandler = (action, resource) => () => this.props.getResourceAction(action, resource)

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
        {staticResourceData.tableKeys.map((key) =>
          <TableData key={key.resourceKey}>
            {key.link ?
              getLink(key.link, resource) : transform(resource, key, locale)
            }
          </TableData>
        )}
        {tableActions && tableActions.length > 0 &&
          <TableData>
            <OverflowMenu flipped={true} iconDescription={msgs.get('svg.description.overflowMenu', locale)}>
              {tableActions.map((action) =>
                <OverflowMenuItem
                  data-table-action={action}
                  isDelete={deleteActions.indexOf(action) > -1}
                  onClick={this.getOverflowMenuHandler(action, resource)}
                  key={action}
                  itemText={msgs.get(action, locale)}
                />)}
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
