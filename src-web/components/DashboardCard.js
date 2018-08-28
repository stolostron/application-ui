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
import { Module, ModuleHeader, ModuleBody, Table, TableBody, TableRow, TableData, Icon } from 'carbon-components-react'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import truncate from '../util/truncate-middle'

const MAX_TABLE_ROWS = 5

resources(() => {
  require('../../scss/dashboard-card.scss')
})

const DashboardOrb = ({ status = 'healthy', value, className = '' }) => (
  <div className={`dashboard-count ${className}`}>
    <div className="dashboard-orb">
      <div className={`dashboard-orb dashboard-orb__inner dashboard-orb__${status}`}>{value}</div>
    </div>
    <p className={'dashboard-card-text'}>{status}</p>
  </div>
)

const OrbPropType = {
  className: PropTypes.string,
  status: PropTypes.oneOf(['critical', 'warning', 'healthy']),
  value: PropTypes.number
}

DashboardOrb.propTypes = OrbPropType

const DashboardTableRow = ({ link, percentage, resourceName, status, ...rest }) => {
  let iconName
  switch (status) {
  case 'healthy':
    iconName = 'icon--checkmark--glyph'
    break
  case 'warning':
    iconName = 'icon--warning--glyph'
    break
  case 'critical':
    iconName = 'icon--error--glyph'
    break
  }
  return (
    <TableRow {...rest}>
      <TableData className='dashboard-status'>
        <div className='table-status-icon'>
          {status && <Icon className={`table-status-icon__${status}`} name={iconName} description='' />}
        </div>
        {link ? <a href={`https://${link}:8443`}>{truncate(resourceName, 34)}</a> : <p>{truncate(resourceName, 34)}</p> }
      </TableData>
      {percentage != null ? <TableData>{`${percentage}%`}</TableData> : <TableData />}
    </TableRow>
  )
}

export const TableRowPropType = {
  link: PropTypes.string,
  percentage: PropTypes.number,
  resourceName: PropTypes.string,
  status: PropTypes.oneOf(['critical', 'warning', 'healthy']),
}

DashboardTableRow.propTypes = TableRowPropType

const DashboardTable = ({ table, ...rest }) => {
  const numOfEmptyRow = MAX_TABLE_ROWS - table.length
  return (
    <Table className='dashboard-table' {...rest}>
      <TableBody>
        {table.map((row, ind) => {
          {/* only show top 5 items*/}
          return (ind < 5) && <DashboardTableRow even={!(ind % 2)} {...row} key={row.resourceName} />})
        }
        {(numOfEmptyRow > 0) &&  Array.from({length: numOfEmptyRow}, (v, i) => i).map((item) => {
          return <DashboardTableRow even={!((item+table.length) % 2)} key={`empty-row-${item}`} />})
        }
      </TableBody>
    </Table>
  )
}

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

export const DashboardCard = ({ critical = 0, healthy = 0, title, table, warning = 0, ...rest }) => {
  const cardStatus = getTableStatus(critical, healthy, warning)
  return table && (
    <Module className={`dashboard-card dashboard-card__${cardStatus}`} size="single" {...rest}>
      <ModuleHeader>{title}</ModuleHeader>
      <ModuleBody>
        <div className="dashboard-overview">
          <DashboardOrb key='critical-orb' status='critical' value={critical} />
          <DashboardOrb key='warning-orb' status='warning' value={warning} />
          <DashboardOrb key='healthy-orb' status='healthy' value={healthy} />
        </div>
        <div className={'dashboard-card-separator-text dashboard-card-text'}>{msgs.get('dashboard.module.separator')}</div>
        <DashboardTable table={table} />
      </ModuleBody>
    </Module>
  )
}

DashboardCard.propTypes = {
  critical: PropTypes.number,
  healthy: PropTypes.number,
  table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType)),
  title: PropTypes.string,
  warning: PropTypes.number,
}

