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
import ProviderView from './ProviderView'
import StatusView from './/StatusView'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/overview-page.scss')
})

export class OverviewView extends React.Component {

  static propTypes = {
    error: PropTypes.object,
    loading: PropTypes.bool.isRequired,
    overview: PropTypes.object,
  }


  render() {
    const { loading, error, overview } = this.props

    if (loading)
      return <Loading withOverlay={false} className='content-spinner' />

    if (error)
      return <Notification title='' className='overview-notification' kind='error'
        subtitle={msgs.get('overview.error.default', this.context.locale)} />

    return (
      <div className='overview-view'>
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
