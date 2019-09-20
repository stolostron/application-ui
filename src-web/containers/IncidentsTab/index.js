/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
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
import { mapCell } from './utils'
import NoResource from '../../components/common/NoResource'

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
    const { locale } = this.context
    const { incidents, incidentCount, params } = this.props
    const rowsList = mapIncidents(incidents)
    // We want to make sure the current incidents data we have matches the incidents
    // data in our store. To do so we will compare the summary and description to
    // see if one of them includes the name of the application selected
    const currentAppIncidentsData =
      rowsList &&
      rowsList[0] &&
      ((rowsList[0].summary && rowsList[0].summary.includes(params.name)) ||
        (rowsList[0].description &&
          rowsList[0].description.includes(params.name)))
    const tableTitle = msgs.get('table.title.incidents', locale)
    return (
      <div id="incidents-tab">
        {rowsList.length !== 0 &&
          currentAppIncidentsData && (
          <React.Fragment>
            <div className="incidents-tab-table-title">
              {tableTitle} ({incidentCount})
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
                                  {mapCell(cell, locale)}
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
        {rowsList.length === 0 ||
          (!currentAppIncidentsData && (
            <div className="incidents-tab-no-resource">
              <NoResource
                title={msgs.get('no-resource.title.incident', locale)}
                detail={msgs.get('no-resource.detail.incident', locale)}
              />
            </div>
          ))}
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
