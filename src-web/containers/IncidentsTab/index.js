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
import { fetchIncidents } from '../../actions/common'
import {
  getIncidentCount,
  getIncidentList
} from '../../components/common/ResourceDetails/utils'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import { mapIncidents } from '../../reducers/data-mappers/mapIncidents'

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
    incidents: PropTypes.array,
    params: PropTypes.object
  };

  constructor(props) {
    super(props)
    this.headers = [
      {
        key: 'id',
        header: 'ID'
      },
      {
        key: 'summary',
        header: 'Summary'
      },
      {
        key: 'description',
        header: 'Description'
      },
      {
        key: 'priority',
        header: 'Priority'
      },
      {
        key: 'escalated',
        header: 'Escalated'
      },
      {
        key: 'owner',
        header: 'Owner'
      },
      {
        key: 'team',
        header: 'Team'
      },
      {
        key: 'state',
        header: 'State'
      },

      {
        key: 'createdTime',
        header: 'Created'
      },
      {
        key: 'lastChanged',
        header: 'Last changed'
      }
    ]
  }

  componentWillMount() {
    const { params } = this.props
    if (params && params.namespace && params.name) {
      this.props.fetchIncidents()
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.params || !prevProps.params.name) {
      const { params } = this.props
      if (params && params.namespace && params.name) {
        this.props.fetchIncidents()
      }
    }
  }

  render() {
    const rowsList = mapIncidents(this.props.incidents)
    const rowCount = this.props.incidentCount
    const tableTitle = msgs.get('table.title.incidents', this.context.locale)
    const noIncidentFound = msgs.get(
      'table.title.noIncidentFound',
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
                                  {cell.value}
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
          <div className="incidents-tab-table-title incidents-tab-table-title-empty">
            {noIncidentFound}
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
        fetchIncidents(
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
