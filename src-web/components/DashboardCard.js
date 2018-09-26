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
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/dashboard-card.scss')
})

const DashboardOrb = ({ status = 'healthy', value, className = '' }) => (
  <div className={`dashboard-count ${className}`}>
    <div className="dashboard-orb">
      {value === 0 ? <div className={'dashboard-orb dashboard-orb__inner dashboard-orb__gray'}>{value}</div>
        : <div className={`dashboard-orb dashboard-orb__inner dashboard-orb__${status}`}>{value}</div>}
    </div>
    {value === 0 ? <p className={'dashboard-card-text dashboard-card-text__gray'}>{status}</p> : <p className={'dashboard-card-text'}>{status}</p>}
  </div>
)

const OrbPropType = {
  className: PropTypes.string,
  status: PropTypes.oneOf(['critical', 'warning', 'healthy']),
  value: PropTypes.number
}

DashboardOrb.propTypes = OrbPropType

const DashboardTableRow = ({ clusterIP, percentage, resourceName, status, namespace, type, ...rest }) => {
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
  default:
    break
  }
  return (
    <TableRow {...rest}>
      {status != null ?
        <TableData className='dashboard-status-link'>
          {clusterIP ? (namespace ? <a href={`https://${clusterIP}:8443/catalog/instancedetails/${namespace}/${resourceName}`}>{truncate(resourceName, 34)}</a>
            : <a href={`https://${clusterIP}:8443/console/dashboard`}>{truncate(resourceName, 34)}</a> )
            : <Link to={`${config.contextPath}/${type}?filters={"name":["${resourceName}"]}`}>{truncate(resourceName, 34)}</Link>
          }
        </TableData> : <TableData />
      }
      {percentage != null ? <TableData className='dashboard-status-secondary'>{`${percentage}%`}</TableData> : null}
      {status !=null ?<TableData className='dashboard-status'>
        <div className='table-status-icon'>
          {status && iconName && <Icon className={`table-status-icon__${status}`} name={iconName} description={`table-status-icon-${status}`} role='img' />}
          <p className='dashboard-status-text'>{status}</p>
        </div>
      </TableData>: <TableData />}
    </TableRow>
  )
}

export const TableRowPropType = {
  clusterIP: PropTypes.string,
  namespace: PropTypes.string,
  percentage: PropTypes.number,
  resourceName: PropTypes.string,
  status: PropTypes.string,
  type: PropTypes.string,
}

DashboardTableRow.propTypes = TableRowPropType

const DashboardTable = ({ table, type, locale, ...rest }) => {
  return (
    <Table className='dashboard-table' role='presentation' {...rest}>
      <TableBody>
        <TableRow even={false}>
          <TableData className='dashboard-table-header'>{msgs.get('dashboard.module.separator', locale)}</TableData>
          {
            !type && <TableData className='dashboard-table-header dashboard-table-header__secondary'>{msgs.get('dashboard.module.separator.utilization', locale)}</TableData>
          }
          <TableData className='dashboard-table-header__secondary'>{msgs.get('dashboard.module.separator.status', locale)}</TableData>
        </TableRow>
        {table.map((row, ind) => {
          {/* only show top 5 items*/}
          return (ind < 5) && <DashboardTableRow even={false} {...row} key={row.resourceName} type={type} />})
        }
      </TableBody>
    </Table>
  )
}

DashboardTable.propTypes = {
  locale: PropTypes.string,
  table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType)),
  type: PropTypes.string,
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

const getStatusSearchArray = (resourceName, status, locale) => {
  const statusList = {
    'releases' : {
      'critical' : [msgs.get('table.cell.failed', locale), msgs.get('table.cell.deleted', locale),
        msgs.get('table.cell.superseded', locale), msgs.get('table.cell.unknown', locale)],
      'warning' : [msgs.get('table.cell.deleting', locale)],
      'healthy' : [msgs.get('table.cell.deployed', locale)],
    },
    'pods' : {
      'critical' : [msgs.get('table.cell.failed', locale), msgs.get('table.cell.notrunning', locale)],
      'warning' : [msgs.get('table.cell.pending', locale)],
      'healthy' : [msgs.get('table.cell.running', locale), msgs.get('table.cell.succeeded', locale)],
    },
    // TODO: Zack L. - Only aware of bound, available and unbound statues
    'storage' : {
      'critical' : [msgs.get('table.cell.unbound', locale), msgs.get('table.cell.unbound', locale)],
      'warning' : [msgs.get('table.cell.pending', locale)],
      'healthy' : [msgs.get('table.cell.bound', locale), msgs.get('table.cell.bound', locale)],
    },
    'clusters' : {
      'critical' : [msgs.get('table.cell.critical', locale), msgs.get('table.cell.failed', locale),
        msgs.get('table.cell.unknown', locale)],
      'warning' : [msgs.get('table.cell.warning', locale)],
      'healthy' : [msgs.get('table.cell.healthy', locale)],
    }
  }

  const tempStatusArray =  statusList[resourceName][status] || [status]
  return JSON.stringify(tempStatusArray)
}

export class DashboardCard extends React.PureComponent {
  render() {
    const { locale } = this.context
    const {
      critical = 0, healthy = 0, title, table, warning = 0, type = ''
    } = this.props
    const cardStatus = getTableStatus(critical, healthy, warning)
    return table && (
      <Module className={`bx--tile dashboard-card dashboard-card__${cardStatus}`} size="single" {...this.props}>
        <ModuleHeader className={`dashboard-card-header__${cardStatus}`}>{title}</ModuleHeader>
        <ModuleBody className={'dashboard-card-orb'}>
          <div className="dashboard-overview">
            {type ?
              (
                <div>
                  <Link to={`${config.contextPath}/${type}?filters={"status":${getStatusSearchArray(type, 'critical', locale)}}`}>
                    <DashboardOrb key='critical-orb' status='critical' value={critical} />
                  </Link>
                  <Link to={`${config.contextPath}/${type}?filters={"status":${getStatusSearchArray(type, 'warning', locale)}}`}>
                    <DashboardOrb key='warning-orb' status='warning' value={warning} />
                  </Link>
                  <Link to={`${config.contextPath}/${type}?filters={"status":${getStatusSearchArray(type, 'healthy', locale)}}`}>
                    <DashboardOrb key='healthy-orb' status='healthy' value={healthy} />
                  </Link>
                </div>
              )
              :
              (
                <div>
                  <DashboardOrb key='critical-orb' status='critical' value={critical} />
                  <DashboardOrb key='warning-orb' status='warning' value={warning} />
                  <DashboardOrb key='healthy-orb' status='healthy' value={healthy} />
                </div>
              )
            }
          </div>
        </ModuleBody>
        <ModuleBody className={'dashboard-card-table-body'}>
          {/*<div className={'dashboard-card-separator-text dashboard-card-text'}>*/}
          {/*<div>{msgs.get('dashboard.module.separator')}</div>*/}
          {/*</div>*/}
          <DashboardTable table={table} type={type} locale={locale} />
          <div className={'dashboard-card-separator-link'}>
            {type ?
              <Link to={`${config.contextPath}/${type}`}>{msgs.get('dashboard.module.separator.link')}</Link> : null }
          </div>
        </ModuleBody>
      </Module>
    )
  }
}


DashboardCard.propTypes = {
  critical: PropTypes.number,
  healthy: PropTypes.number,
  namespace: PropTypes.string,
  table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType)),
  title: PropTypes.string,
  type: PropTypes.string,
  warning: PropTypes.number,
}

