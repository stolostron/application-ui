/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
// seems to be an issue with this rule and redux
/* eslint-disable import/no-named-as-default */

import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader } from '../actions/common'
import Page from '../components/common/Page'
import msgs from '../../nls/platform.properties'
import { OVERVIEW_REFRESH_INTERVAL_COOKIE  } from '../../lib/shared/constants'
import config from '../../lib/shared/config'

import {getPollInterval} from '../components/common/AutoRefreshMenu'
import OverviewView from '../components/overview/OverviewView'

const OVERVIEW_QUERY = gql`
  query getOverview($demoMode: Boolean) {
    overview(demoMode: $demoMode) {
      clusters {
        metadata {
          name
          namespace
          labels
          uid
        }
        capacity {
          cpu
          memory
          nodes
          storage
        }
        usage {
          cpu
          memory
          pods
          storage
        }
        status
      }
      applications {
        metadata {
          name
          namespace
        }
        raw
        selector
      }
      pods {
        metadata {
          name
          namespace
        }
        cluster {
          metadata {
            name
          }
        }
        status
      }
      timestamp
    }
  }
`


class OverviewPage extends React.Component {

  static propTypes = {
    secondaryHeaderProps: PropTypes.object,
    updateSecondaryHeader: PropTypes.func,
  }

  componentWillMount() {
    const { updateSecondaryHeader, secondaryHeaderProps } = this.props
    updateSecondaryHeader(msgs.get(secondaryHeaderProps.title, this.context.locale))
  }

  render () {
    const overview = config['overview']
    const demoMode = overview && overview.demoMode
    const pollInterval = getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE)
    return (
      <Page>
        <DragDropContextProvider backend={HTML5Backend}>
          <Query query={OVERVIEW_QUERY} variables={{ demoMode }}
            pollInterval={pollInterval} notifyOnNetworkStatusChange >
            {( {loading, error, data, refetch, startPolling, stopPolling} ) => {
              const { overview } = data
              return (
                <OverviewView
                  loading={loading}
                  error={error}
                  refetch={refetch}
                  startPolling={startPolling}
                  stopPolling={stopPolling}
                  pollInterval={pollInterval}
                  overview={overview} />
              )
            }
            }
          </Query>
        </DragDropContextProvider>
      </Page>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateSecondaryHeader: title => dispatch(updateSecondaryHeader(title))
  }
}

export default withRouter(connect(null, mapDispatchToProps)(OverviewPage))
