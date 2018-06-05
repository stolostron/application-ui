/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
/* eslint-disable react/prop-types,react/no-unused-state */

import React from 'react'
import Page from '../../components/common/Page'
import resources from '../../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader, fetchResources } from '../../actions/common'
import { RESOURCE_TYPES } from '../../../lib/shared/constants'
import { REQUEST_STATUS } from '../../actions/index'
import HealthOverview from '../../components/dashboard/HealthOverview'
import ResourceOverview from '../../components/dashboard/ResourceOverview'
import TagInput from '../../components/common/TagInput'
import FilterButton from '../../components/common/FilterButton'
import SettingsButton from '../../components/common/SettingsButton'
import config from '../../../lib/shared/config'
import headerMsgs from '../../../nls/header.properties'
import PropTypes from 'prop-types'

resources(() => {
  require('../../../scss/dashboard.scss')
})

const TYPES = [
  RESOURCE_TYPES.HCM_CLUSTERS,
  RESOURCE_TYPES.HCM_PODS,
  RESOURCE_TYPES.HCM_RELEASES
]

const fullDashboard = (config['featureFlags:fullDashboard'])
const POLL_INTERVAL = 60000 // 1 min

class Dashboard extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
    const { updateSecondaryHeader } = this.props
    const { tabs, title, extra } = this.props.secondaryHeaderProps
    updateSecondaryHeader(headerMsgs.get(title, this.context.locale), tabs, extra)

    if (parseInt(config['featureFlags:liveUpdates']) === 2) {
      var intervalId = setInterval(this.reload.bind(this), POLL_INTERVAL)
      this.setState({ intervalId: intervalId })
    }
  }

  componentDidMount() {
    this.reload(true)
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    const { serverProps } = this.props

    return (
      <div>
        {fullDashboard && (
          <div className='dashboard-toolbar'>
            <TagInput />
            <FilterButton />
            <SettingsButton />
          </div>)
        }
        <div className='dashboard-main'>
          <Page serverProps={serverProps}>
            <div className='dashboard'>
              <HealthOverview />
              <ResourceOverview />
            </div>
          </Page>
        </div>
      </div>
    )
  }

  reload(onMount) {
    const { fetchResources } = this.props
    TYPES.forEach(type => {
      if (onMount || this.props[`status_${type.list}`] === REQUEST_STATUS.DONE)
        fetchResources(type)
    })
  }
}

Dashboard.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) => state

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: (title, tabs, extra) => dispatch(updateSecondaryHeader(title, tabs, undefined, undefined, extra)),
    fetchResources: resourceType => dispatch(fetchResources(resourceType))
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Dashboard))
