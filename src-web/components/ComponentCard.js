/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'carbon-components-react'
import {
  Module,
  ModuleHeader,
  ModuleBody,
  Tag
} from 'carbon-addons-cloud-react'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/dashboard-card.scss')
})

function formatStatus(statusArray, value) {
  const statuses = JSON.parse(statusArray).map(status => {
    return (
      <li
        className={`dashboard-card-text-list-item${value ? '' : '-alt'}`}
        key={status}
      >
        {status}
      </li>
    )
  })
  return <ul className="dashboard-card-text-list">{statuses}</ul>
}

const DashboardOrb = ({
  sev = 'healthy',
  status = ['healthy'],
  value,
  className = ''
}) => (
  <div className={`dashboard-count ${className}`}>
    <div className="dashboard-orb">
      {value === 0 ? (
        <div
          className={'dashboard-orb dashboard-orb__inner dashboard-orb__gray'}
        >
          {value}
        </div>
      ) : (
        <div
          className={`dashboard-orb dashboard-orb__inner dashboard-orb__${sev}`}
        >
          {value}
        </div>
      )}
    </div>
    {value === 0 ? (
      <div className={'dashboard-card-text dashboard-card-text__gray'}>
        {formatStatus(status, false)}
      </div>
    ) : (
      <div className={'dashboard-card-text'}>{formatStatus(status, true)}</div>
    )}
  </div>
)

const OrbPropType = {
  className: PropTypes.string,
  sev: PropTypes.string,
  status: PropTypes.string,
  value: PropTypes.number
}

DashboardOrb.propTypes = OrbPropType

const getIcon = status => {
  switch (status) {
  case 'healthy':
    return 'icon--checkmark--glyph'
  case 'warning':
    return 'icon--warning--glyph'
  case 'critical':
    return 'icon--error--glyph'
  default:
    break
  }
}

const getTableStatus = (critical, healthy, warning) => {
  switch (true) {
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
    releases: {
      critical: [
        msgs.get('table.cell.failed', locale),
        msgs.get('table.cell.deleted', locale),
        msgs.get('table.cell.superseded', locale),
        msgs.get('table.cell.unknown', locale)
      ],
      warning: [msgs.get('table.cell.deleting', locale)],
      healthy: [msgs.get('table.cell.deployed', locale)]
    },
    pods: {
      critical: [
        msgs.get('table.cell.failed', locale),
        msgs.get('table.cell.notrunning', locale)
      ],
      warning: [msgs.get('table.cell.pending', locale)],
      healthy: [
        msgs.get('table.cell.running', locale),
        msgs.get('table.cell.succeeded', locale)
      ]
    },
    storage: {
      critical: [msgs.get('table.cell.unbound', locale)],
      warning: [msgs.get('table.cell.available', locale)],
      healthy: [msgs.get('table.cell.bound', locale)]
    },
    clusters: {
      critical: [msgs.get('table.cell.offline', locale)],
      healthy: [msgs.get('table.cell.ready', locale)]
    }
  }

  const tempStatusArray = statusList[resourceName][status] || [status]
  return JSON.stringify(tempStatusArray)
}

export class DashboardCard extends React.PureComponent {
  render() {
    const { locale } = this.context
    const {
      critical = 0,
      healthy = 0,
      title,
      warning = 0,
      type = ''
    } = this.props
    const cardStatus = getTableStatus(critical, healthy, warning)
    const totalCount = critical + warning + healthy
    return (
      <Module
        className={`bx--tile dashboard-card dashboard-card__${cardStatus}`}
        size="single"
        {...this.props}
      >
        <ModuleHeader className={`dashboard-card-header__${cardStatus}`}>
          <div className="dashboard-card-header__icon">
            <div className="dashboard-card-header__icon-title">{title}</div>
            <Tag type="beta">{totalCount}</Tag>
            {cardStatus !== 'healthy' ? (
              <Icon
                className={`dashboard-card-header__icon__${cardStatus}`}
                name={getIcon(cardStatus)}
                description={`table-status-icon-${cardStatus}`}
                role="img"
              />
            ) : null}
          </div>
        </ModuleHeader>
        <ModuleBody className={'dashboard-card-orb-summary'}>
          <div className="dashboard-overview">
            <div>
              <Link
                to={`${
                  config.contextPath
                }/${type}?filters={"status":${getStatusSearchArray(
                  type,
                  'critical',
                  locale
                )}}`}
              >
                <DashboardOrb
                  key="critical-orb"
                  sev="critical"
                  status={getStatusSearchArray(type, 'critical', locale)}
                  value={critical}
                />
              </Link>
              {type !== 'clusters' ? (
                <Link
                  to={`${
                    config.contextPath
                  }/${type}?filters={"status":${getStatusSearchArray(
                    type,
                    'warning',
                    locale
                  )}}`}
                >
                  <DashboardOrb
                    key="warning-orb"
                    sev="warning"
                    status={getStatusSearchArray(type, 'warning', locale)}
                    value={warning}
                  />
                </Link>
              ) : null}
              <Link
                to={`${
                  config.contextPath
                }/${type}?filters={"status":${getStatusSearchArray(
                  type,
                  'healthy',
                  locale
                )}}`}
              >
                <DashboardOrb
                  key="healthy-orb"
                  sev="healthy"
                  status={getStatusSearchArray(type, 'healthy', locale)}
                  value={healthy}
                />
              </Link>
            </div>
          </div>
        </ModuleBody>
        <ModuleBody className={'dashboard-card-table-body'}>
          <div className={'dashboard-card-separator-link'}>
            {type ? (
              <Link to={`${config.contextPath}/${type}`}>
                {msgs.get('dashboard.module.separator.link')}
              </Link>
            ) : null}
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
  title: PropTypes.string,
  type: PropTypes.string,
  warning: PropTypes.number
}
