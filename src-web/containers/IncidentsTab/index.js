/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'

import PropTypes from 'prop-types'
import { DataTable } from 'carbon-components-react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
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
    clearIncidents: PropTypes.func,
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

  render() {
    const { locale } = this.context
    const { incidents, incidentCount } = this.props
    const rowsList = mapIncidents(incidents)
    const tableTitle = msgs.get('table.title.incidents', locale)
    return (
      <div id="incidents-tab">
        {rowsList.length !== 0 && (
          <React.Fragment>
            <div className="incidents-tab-table-title">
              {tableTitle} ({incidentCount})
            </div>
            <div className="incidents-tab-table">
              <DataTable
                rows={rowsList}
                headers={this.headers}
                zebra={false}
                render={({ rows, headers, getHeaderProps, getRowProps }) => {
                  return (
                    <TableContainer title="">
                      <Table zebra={false}>
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
        {rowsList.length === 0 && (
          <div className="incidents-tab-no-resource">
            <NoResource
              title={msgs.get('no-resource.title.incident', locale)}
              detail={msgs.get('no-resource.detail.incident', locale)}
            />
          </div>
        )}
      </div>
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

export default withRouter(connect(mapStateToProps)(IncidentsTab))
