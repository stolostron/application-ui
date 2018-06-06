/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Module, ModuleHeader, ModuleBody, Table, TableBody, TableRow, TableData } from 'carbon-components-react'
import config from '../../lib/shared/config'
import resources from '../../lib/shared/resources'

resources(() => {
  require('../../scss/dashboard-card.scss')
})

const DashboardOrb = ({ status = 'healthy', value, className = '' }) => (
  <div className={`dashboard-count ${className}`}>
    <div className="dashboard-orb">
      <div className={`dashboard-orb dashboard-orb__inner dashboard-orb__${status}`}>{value}</div>
    </div>
    <p>{status}</p>
  </div>
)

const OrbPropType = {
  className: PropTypes.string,
  status: PropTypes.oneOf(['critical', 'warning', 'healthy']),
  value: PropTypes.number,
}

DashboardOrb.propTypes = OrbPropType

const DashboardTableRow = ({ link, percentage, resourceName, status, ...rest }) => (
  <TableRow {...rest}>
    <TableData className='dashboard-status'>
      <img src={`${config.contextPath}/graphics/${status}.svg`} alt='Row Status' />
      {link ? <a href={link}>{resourceName}</a> : <p>{resourceName}</p> }
    </TableData>
    <TableData>{`${percentage}%`}</TableData>
  </TableRow>
)

const TableRowPropType = {
  link: PropTypes.string,
  percentage: PropTypes.number,
  resourceName: PropTypes.string,
  status: PropTypes.oneOf(['critical', 'warning', 'healthy']),
}

DashboardTableRow.propTypes = TableRowPropType

const DashboardTable = ({ table, ...rest }) => (
  <Table className='dashboard-table' {...rest}>
    <TableBody>
      {table.map((row, ind) => <DashboardTableRow even={!(ind % 2)} {...row} key={row.resourceName} />)}
    </TableBody>
  </Table>
)

DashboardTable.propTypes = {
  table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType))
}

const getTableStatus = (critical, healthy, warning) => {
  switch(true){
  case critical > 0:
    return 'critical'
  case warning > 0:
    return 'warning'
  default:
    return 'healthy'
  }
}

const DashboardCard = ({ critical = 0, healthy = 0, title, table, warning = 0, ...rest }) => (
  <Module className={`dashboard-card dashboard-card__${getTableStatus(critical, healthy, warning)}`} size="single" {...rest}>
    <ModuleHeader>{title}</ModuleHeader>
    <ModuleBody>
      <div className="dashboard-overview">
        <DashboardOrb key='critical-orb' status='critical' value={critical} />
        <DashboardOrb key='warning-orb' status='warning' value={warning} />
        <DashboardOrb key='healthy-orb' status='healthy' value={healthy} />
      </div>
      <DashboardTable table={table} />
    </ModuleBody>
  </Module>
)

DashboardCard.propTypes = {
  critical: PropTypes.number,
  healthy: PropTypes.number,
  table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType)),
  title: PropTypes.string,
  warning: PropTypes.number,
}

export default DashboardCard
