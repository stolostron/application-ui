/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import PropTypes from 'prop-types'
import { DataTable } from 'carbon-components-react'
import withAccess from '../../components/common/withAccess'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { ROLES, RESOURCE_TYPES } from '../../../lib/shared/constants'
import { fetchResource } from '../../actions/common'
import {
  getIncidentCount,
  getIncidentList
} from '../../components/common/ResourceDetails/utils'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'

const {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} = DataTable

resources(() => {
  require('./style.scss')
})

class IncidentsTab extends React.Component {
  static propTypes = {
    fetchIncidents: PropTypes.func,
    incidentCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    incidents: PropTypes.array
  };

  constructor(props) {
    super(props)
    this.headers = [
      {
        key: 'id',
        header: 'id'
      },
      {
        key: 'createdTime',
        header: 'createdTime'
      },
      {
        key: 'lastChanged',
        header: 'lastChanged'
      },
      {
        key: 'priority',
        header: 'priority'
      },
      {
        key: 'escalated',
        header: 'escalated'
      },
      {
        key: 'correlationDetails',
        header: 'correlationDetails'
      },
      // {
      //   key: 'incidentURL',
      //   header: 'incidentURL'
      // },
      // {
      //   key: 'eventsURL',
      //   header: 'eventsURL'
      // },
      // {
      //   key: 'timelineURL',
      //   header: 'timelineURL'
      // },
      {
        key: 'eventSummary',
        header: 'eventSummary'
      }
    ]
  }

  componentWillMount() {
    this.props.fetchIncidents()
  }

  render() {
    const rowsList = this.props.incidents
    const rowCount = this.props.incidentCount
    const tableTitle = msgs.get(
      'table.title.allIncidents',
      this.context.locale
    )
    return (
      <div id="incidents-tab">
        {rowsList.length !== 0 && (
          <React.Fragment>
            <div className="incidents-tab-table-title">
              {tableTitle} ({rowCount})
            </div>
            <div className="incidents-tab-table">
              <DataTable
                rows={rowsList}
                headers={this.headers}
                render={({ rows, headers, getHeaderProps, getRowProps }) => {
                  return (
                    <TableContainer title="">
                      <Table>
                        <TableHead>
                          <TableRow>
                            {headers.map(header => (
                              <TableHeader
                                {...getHeaderProps({ header })}
                                key={header.header}
                              >
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map(row => (
                            <TableRow
                              {...getRowProps({ row })}
                              key={Math.random()}
                            >
                              {row.cells.map(cell => (
                                <TableCell key={cell.id}>
                                  {typeof cell.value === 'object'
                                    ? JSON.stringify(cell.value)
                                    : cell.value}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )
                }}
              />
            </div>
          </React.Fragment>
        )}
        {rowsList.length === 0 && (
          <div className="incidents-tab-table-title-empty">
            No incidents found
          </div>
        )}
      </div>
    )
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  const { params } = ownProps
  return {
    fetchIncidents: () =>
      dispatch(
        fetchResource(
          RESOURCE_TYPES.CEM_INCIDENTS,
          params.namespace,
          params.name
        )
      )
  }
}

const mapStateToProps = state => {
  const { CEMIncidentList } = state
  return {
    incidents: getIncidentList(CEMIncidentList),
    incidentCount: getIncidentCount(CEMIncidentList)
  }
}

export default withRouter(
  withAccess(
    connect(mapStateToProps, mapDispatchToProps)(IncidentsTab),
    ROLES.VIEWER
  )
)
