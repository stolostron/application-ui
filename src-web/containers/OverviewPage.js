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
import { DragDropContextProvider } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import Page from '../components/common/Page'
import { OVERVIEW_REFRESH_INTERVAL_COOKIE, OVERVIEW_QUERY_COOKIE } from '../../lib/shared/constants'
import {getFreshOrStoredObject} from '../../lib/client/resource-helper'
import config from '../../lib/shared/config'

import {getPollInterval} from '../components/common/AutoRefreshSelect'
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
        consoleURL
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
      compliances {
        metadata {
          name
          namespace
        }
        raw
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

  constructor (props) {
    super(props)
    this.firstLoad = true
  }

  componentDidMount() {
    const pageContainer = document.getElementsByClassName('page-content-container')[0]
    pageContainer.style.padding = 0
  }

  render () {
    const overview = config['overview']
    const demoMode = overview && overview.demoMode
    const pollInterval = Math.max(getPollInterval(OVERVIEW_REFRESH_INTERVAL_COOKIE), 20*1000)
    return (
      <Page>
        <DragDropContextProvider backend={HTML5Backend}>
          <Query query={OVERVIEW_QUERY} variables={{ demoMode }}
            pollInterval={pollInterval} notifyOnNetworkStatusChange >
            {( {loading, error, data, refetch, startPolling, stopPolling} ) => {
              let { overview } = data
              overview = getFreshOrStoredObject(OVERVIEW_QUERY_COOKIE, overview)
              if (overview) {
                error = null
              }
              const firstLoad = this.firstLoad
              this.firstLoad = false
              return (
                <OverviewView
                  loading={!overview && loading}
                  reloading={!firstLoad && loading}
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

export default OverviewPage
