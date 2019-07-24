/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { connect } from 'react-redux'
import resources from '../../../lib/shared/resources'
import {
  updateSecondaryHeader, /* , fetchResource */
} from '../../actions/common'
import { getBreadCrumbs } from './utils'
import ApplicationDeployableHighlights from '../../components/ApplicationDeployableHighlights'
import ApplicationDeployableSubscription from '../../components/ApplicationDeployableSubscription'
import ApplicationDeployableVersionStatus from '../../components/ApplicationDeployableVersionStatus'
/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

const mapDispatchToProps = (dispatch) => {
  return {
    updateSecondaryHeaderInfo: (title, breadCrumbs) =>
      dispatch(updateSecondaryHeader(title, [], breadCrumbs, [])),
  }
}

const tempData = {
  deployables: {
    metadata: {
      name: 'kirti1-guestbook-app',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/ibmcom/deployables/kirti1-guestbook-app',
      __typename: 'Metadata',
    },
    status: {
      cluster1: 'failed',
      cluster2: 'success',
    },
    channels: [
      {
        name: 'dev',
        template: {
          kind: 'CustomResourceDefinition',
          scope: 'Namespaced',
        },
        lastUpdateTime: '2019-07-05T09:50:56Z',
        status: 'failed',
      },
      {
        name: 'devkirti',
        template: {
          kind: 'CustomResourceDefinition',
          scope: 'Namespaced',
        },
        lastUpdateTime: '2019-07-05T09:50:56Z',
        status: 'success',
      },
      {
        name: 'prod',
        template: {
          kind: 'CustomResourceDefinition',
          scope: 'Namespaced',
        },
        lastUpdateTime: '2019-07-05T09:50:56Z',
        status: 'success',
      },
    ],
    subscription: {
      metadata: {
        name: 'mydevsub',
        namespace: 'myspace',
        labels: [
          ['Region', 'North America'],
          ['DataCenter', 'Austin'],
          ['ClusterType', 'AWS'],
          ['controller-tools.k8s.io', '1.0'],
        ],
      },
      spec: {
        channel: 'ch - dev / dev',
        package: 'nginx',
        packageFilter: {
          version: '1. x',
        },
        version: 'v1alpha1',
      },
      placement: {
        clusters: {
          '-name': 'mydevcluster1',
        },
      },
    },
    __typename: 'Deployable',
  },
};

export const getDeployableDetails = (data) => {
  if (data) {
    // perhaps restructure the object that is returned
    return data;
  }
  return [];
};

export const getSubscriptions = (data) => {
  if (data && data.deployables && data.deployables.subscription) {
    // perhaps restructure the object that is returned

    return {
      name: data.deployables.subscription.metadata.name || '',
      namespace: data.deployables.subscription.metadata.namespace || '',
      labels: data.deployables.subscription.metadata.labels || '',
      channel: data.deployables.subscription.spec.channel || '',
      package: data.deployables.subscription.spec.package || '',
      version: data.deployables.subscription.spec.version || '',
      clusters: data.deployables.subscription.placement.clusters || '',
    };
  }
  return [];
};

export const getChannels = (data) => {

  if (data && data.deployables && data.deployables.channels) {
    return data.deployables.channels;
  }
  return [];

}

const mapStateToProps = (state) => {
  const { } = state;

  const deployableDetails = getDeployableDetails(tempData);
  const subscriptions = getSubscriptions(tempData);
  const channels = getChannels(tempData);

  return { deployableDetails, subscriptions, channels };
};

class ApplicationDeployableDetails extends React.Component {
  componentWillMount() {
    const { updateSecondaryHeaderInfo, params } = this.props
    const { locale } = this.context
    const deployableParams =
      (params && params.match && params.match.params) || {}
    const breadCrumbs = getBreadCrumbs(deployableParams, locale)

    updateSecondaryHeaderInfo(deployableParams.name || '', breadCrumbs)
  }

  componentDidMount() { }

  componentWillUnmount() { }

  render() {
    return (
      <div id="ApplicationDeployableDetails">
        <ApplicationDeployableHighlights />
        <ApplicationDeployableSubscription
          subscription={this.props.subscriptions}
        />
        <ApplicationDeployableVersionStatus
          deployableDetails={this.props.deployableDetails}
          channels={this.props.channels}
          subscriptions={this.props.subscriptions}
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ApplicationDeployableDetails)
