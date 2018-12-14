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
import resources from '../../../lib/shared/resources'
import { Loading, Notification } from 'carbon-components-react'
import RefreshSelect from '../common/RefreshSelect'
import ProviderView from './ProviderView'
import StatusView from './StatusView'
import msgs from '../../../nls/platform.properties'

import { OVERVIEW_REFRESH_INTERVAL_COOKIE  } from '../../../lib/shared/constants'

resources(() => {
  require('../../../scss/overview-page.scss')
})

export class OverviewView extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    overview: PropTypes.object,
    pollInterval: PropTypes.number,
    refetch: PropTypes.func,
    startPolling: PropTypes.func,
    stopPolling: PropTypes.func,
  }


  render() {
    const { loading, error } = this.props

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', this.context.locale)} />

    const { refetch, startPolling, stopPolling, pollInterval, overview } = this.props
    const {timestamp} = overview

    return (
      <div className='overview-view'>
        <RefreshSelect
          timestamp={timestamp}
          startPolling={startPolling}
          stopPolling={stopPolling}
          refetch={refetch}
          pollInterval={pollInterval}
          refreshCookie={OVERVIEW_REFRESH_INTERVAL_COOKIE} />
        <ProviderView overview={overview} />
        <StatusView overview={overview} />
      </div>
    )
  }
}

OverviewView.contextTypes = {
  locale: PropTypes.string
}

export default OverviewView
