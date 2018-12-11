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
import gql from 'graphql-tag'
import { Query } from 'react-apollo'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { updateSecondaryHeader } from '../actions/common'
import Page from '../components/common/Page'
//import config from '../../../lib/shared/config'
import msgs from '../../nls/platform.properties'

import OverviewView from '../components/overview/OverviewView'

const OVERVIEW_QUERY = gql`
  query getOverview {
    overview {
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
      services {
        cluster
        name
        namespace
        labels {
          name
          value
        }
        type
        uid
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
    return (
      <Page>
        <Query query={OVERVIEW_QUERY}>
          {( {loading, error, data} ) => {
            const { overview } = data
            return (
              <OverviewView loading={loading} error={error} overview={overview} />
            )
          }
          }
        </Query>
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
