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
import Page from '../components/common/Page'
import resources from '../../lib/shared/resources'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader } from '../actions/common'
import { RESOURCE_TYPES } from '../../lib/shared/constants'
import { REQUEST_STATUS } from '../actions/index'
// import HealthOverview from '../components/dashboard/HealthOverview'
import ResourceOverview from '../components/dashboard/ResourceOverview'
import StatusOverview from '../components/dashboard/StatusOverview'
// import TagInput from '../../components/common/TagInput'
// import FilterButton from '../../components/common/FilterButton'
// import SettingsButton from '../../components/common/SettingsButton'
import config from '../../lib/shared/config'
import msgs from '../../nls/platform.properties'
import PropTypes from 'prop-types'
import { fetchDashboardResources } from '../actions/dashboard'
import { Loading, Notification } from 'carbon-components-react'

resources(() => {
  require('../../scss/dashboard.scss')
})

const TYPE = RESOURCE_TYPES.HCM_DASHBOARD

const fullDashboard = (config['featureFlags:fullDashboard'])
const liveUpdates = (config['featureFlags:dashboardLiveUpdates'])
const updatesPollInterval = (config['featureFlags:dashboardRefreshInterval'])

export class ClustersDashboardTab extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      xhrPoll: false
    }
  }

  componentWillMount() {
    const { updateSecondaryHeader } = this.props
    const title = 'routes.dashboard'
    updateSecondaryHeader(msgs.get(title, this.context.locale))

    if (liveUpdates) {
      var intervalId = setInterval(this.reload.bind(this), updatesPollInterval)
      this.setState({ intervalId: intervalId })
    }
  }

  componentDidMount() {
    const { fetchDashboardResources } = this.props
    fetchDashboardResources(TYPE)
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId)
  }

  render() {
    // add barChartItems back once we have more data
    const { serverProps, cardItems, status } = this.props

    if ((status !== REQUEST_STATUS.DONE || !cardItems) && !this.state.xhrPoll)
      return <Loading withOverlay={false} className='content-spinner' />

    const resourceCards = cardItems.filter(card => card.type)
    const statusCards = cardItems.filter(card => !card.type)
    return (
      <div>
        {fullDashboard && (
          <div className='dashboard-toolbar'>
            {/* <TagInput />
            <FilterButton />
            <SettingsButton /> */}
          </div>)
        }
        <div className='dashboard-main'>
          {(status === REQUEST_STATUS.ERROR) &&
          <Notification
            title=''
            className='dashboard-notification'
            subtitle={msgs.get('dashboard.error.default', this.context.locale)}
            kind='error' />
          }
          <Page serverProps={serverProps}>
            <div className='dashboard'>
              <ResourceOverview cardItems={resourceCards} />
              <StatusOverview cardItems={statusCards} />
            </div>
          </Page>
        </div>
      </div>
    )
  }

  reload(onMount) {
    const { fetchDashboardResources } = this.props
    this.setState({ xhrPoll: true })
    if (onMount || this.props.status === REQUEST_STATUS.DONE || this.props.status === REQUEST_STATUS.ERROR) {
      fetchDashboardResources(TYPE)
    }
  }
}

ClustersDashboardTab.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    error: state[TYPE.list].err,
    cardItems: state[TYPE.list].cardItems,
    pieChartItems: state[TYPE.list].pieChartItems,
    barChartItems: state[TYPE.list].barChartItems,
    status: state[TYPE.list].status,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: (title) => dispatch(updateSecondaryHeader(title)),
    fetchDashboardResources: resourceType => dispatch(fetchDashboardResources(resourceType)),
    // TODO: add dashboard filter container
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ClustersDashboardTab))
