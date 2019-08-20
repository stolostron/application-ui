/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { Module, ModuleHeader, ModuleBody } from 'carbon-addons-cloud-react'
import resources from '../../lib/shared/resources'
import msgs from '../../nls/platform.properties'
import { Link } from 'react-router-dom'
import config from '../../lib/shared/config'

resources(() => {
  require('../../scss/dashboard-card.scss')
})

const DashboardOrb = ({
  status = 'healthy',
  value,
  utilStatus,
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
          className={`dashboard-orb dashboard-orb__inner dashboard-orb__util-${status}`}
        >
          {value}
        </div>
      )}
    </div>
    {value === 0 ? (
      <p className={'dashboard-card-text dashboard-card-text__gray'}>
        {utilStatus}
      </p>
    ) : (
      <p className={'dashboard-card-text'}>{utilStatus}</p>
    )}
  </div>
)

const OrbPropType = {
  className: PropTypes.string,
  status: PropTypes.oneOf(['critical', 'warning', 'healthy']),
  utilStatus: PropTypes.string,
  value: PropTypes.number
}

DashboardOrb.propTypes = OrbPropType

export class UtilizationCard extends React.PureComponent {
  render() {
    const { locale } = this.context
    const { critical = 0, healthy = 0, title, warning = 0 } = this.props
    return (
      <Module
        className={'bx--tile dashboard-card'}
        size="single"
        {...this.props}
      >
        <ModuleHeader className={'dashboard-card-header__utilization'}>
          {title}
        </ModuleHeader>
        <ModuleBody className={'dashboard-card-orb'}>
          <div className="dashboard-overview">
            <div>
              <DashboardOrb
                key="critical-orb"
                status="critical"
                utilStatus={msgs.get(
                  'dashboard.utilization.orb.critical',
                  locale
                )}
                value={critical}
              />
              <DashboardOrb
                key="warning-orb"
                status="warning"
                utilStatus={msgs.get(
                  'dashboard.utilization.orb.warning',
                  locale
                )}
                value={warning}
              />
              <DashboardOrb
                key="healthy-orb"
                status="healthy"
                utilStatus={msgs.get(
                  'dashboard.utilization.orb.healthy',
                  locale
                )}
                value={healthy}
              />
            </div>
          </div>
        </ModuleBody>
        <ModuleBody className={'dashboard-card-table-body'}>
          <div className={'dashboard-card-separator-link'}>
            <Link to={`${config.contextPath}/clusters`}>
              {msgs.get('dashboard.module.separator.link')}
            </Link>
          </div>
        </ModuleBody>
      </Module>
    )
  }
}

UtilizationCard.propTypes = {
  critical: PropTypes.number,
  healthy: PropTypes.number,
  title: PropTypes.string,
  warning: PropTypes.number
}
