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
import { DashboardCard, TableRowPropType } from '../DashboardCard'

class ResourceOverview extends React.Component {
  render() {
    const { locale } = this.context
    const { cardItems = [] } = this.props
    return (
      <div id='resource-overview'>
        <DashboardSection name={msgs.get('dashboard.section.resource-overview', locale)}>
          {cardItems.map(item =>
            item.name &&
            <DashboardCard
              critical={item.critical}
              warning={item.warning}
              healthy={item.healthy}
              table={item.table}
              percentage={item.percentage}
              title={msgs.get(`dashboard.card.${lodash.camelCase(item.name)}`, locale)}
              key={item.name}
            />)}
        </DashboardSection>
      </div>
    )
  }
}

DashboardSection.contextTypes = {
  locale: PropTypes.string
}

ResourceOverview.propTypes = {
  cardItems: PropTypes.arrayOf(PropTypes.shape({
    critical: PropTypes.number,
    healthy: PropTypes.number,
    warning: PropTypes.number,
    name: PropTypes.string,
    table: PropTypes.arrayOf(PropTypes.shape(TableRowPropType))
  }))
}

export default ResourceOverview
