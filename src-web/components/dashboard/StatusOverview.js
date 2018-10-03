/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import DashboardSection from '../common/DashboardSection'
import msgs from '../../../nls/platform.properties'
import { UtilizationCard } from '../UtilizationCard'
import {withRouter} from 'react-router-dom'

class StatusOverview extends React.Component {
  render() {
    const { locale } = this.context
    const { cardItems = [] } = this.props
    return (
      <div id='resource-utilization'>
        <DashboardSection name={msgs.get('dashboard.section.status-overview', locale)}>
          {cardItems.map(item =>
            item.name &&
            <UtilizationCard
              critical={item.critical}
              warning={item.warning}
              healthy={item.healthy}
              table={item.table}
              percentage={item.percentage}
              type={item.type}
              title={msgs.get(`dashboard.card.${lodash.camelCase(item.name)}`, locale)}
              key={item.name}
              id={`card-${item.name.replace(' ', '-')}`}
            />)}
        </DashboardSection>
      </div>
    )
  }
}

DashboardSection.contextTypes = {
  locale: PropTypes.string
}

StatusOverview.propTypes = {
  cardItems: PropTypes.arrayOf(PropTypes.shape({
    critical: PropTypes.number,
    healthy: PropTypes.number,
    warning: PropTypes.number,
    name: PropTypes.string,
  }))
}

export default withRouter(StatusOverview)
