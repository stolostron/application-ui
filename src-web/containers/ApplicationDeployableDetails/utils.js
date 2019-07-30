/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import msgs from '../../../nls/platform.properties'
import config from '../../../lib/shared/config'

export const sampleData = {
  deployables: {
    metadata: {
      name: 'kirti1-guestbook-app',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/ibmcom/deployables/kirti1-guestbook-app',
      __typename: 'Metadata'
    },
    status: {
      cluster1: 'failed',
      cluster2: 'success'
    },
    channels: [
      {
        name: 'dev',
        template: {
          kind: 'CustomResourceDefinition',
          scope: 'Namespaced'
        },
        lastUpdateTime: '2019-07-05T09:50:56Z',
        status: 'failed'
      },
      {
        name: 'devkirti',
        template: {
          kind: 'CustomResourceDefinition',
          scope: 'Namespaced'
        },
        lastUpdateTime: '2019-07-05T09:50:56Z',
        status: 'success'
      },
      {
        name: 'prod',
        template: {
          kind: 'CustomResourceDefinition',
          scope: 'Namespaced'
        },
        lastUpdateTime: '2019-07-05T09:50:56Z',
        status: 'success'
      }
    ],
    subscription: {
      metadata: {
        name: 'mydevsub',
        namespace: 'myspace',
        labels: [
          ['Region', 'NorthAmerica'],
          ['DataCenter', 'Austin'],
          ['ClusterType', 'AWS'],
          ['controller-tools.k8s.io', '1.0']
        ]
      },
      spec: {
        channel: 'ch - dev / dev',
        package: 'nginx',
        packageFilter: {
          version: '1. x'
        },
        version: 'v1alpha1'
      },
      placement: {
        clusters: {
          '-name': 'mydevcluster1'
        }
      }
    },
    __typename: 'Deployable'
  }
}

// Get the full list of deployables with details
export const getDeployableDetails = data => {
  if (data) {
    // perhaps restructure the object that is returned
    return data
  }
  return []
}

// Get the subscriptions contained in a specific deployable
export const getSubscriptions = data => {
  if (data && data.deployables && data.deployables.subscription) {
    // perhaps restructure the object that is returned

    return {
      name: data.deployables.subscription.metadata.name || '',
      namespace: data.deployables.subscription.metadata.namespace || '',
      labels: data.deployables.subscription.metadata.labels || '',
      channel: data.deployables.subscription.spec.channel || '',
      package: data.deployables.subscription.spec.package || '',
      version: data.deployables.subscription.spec.version || '',
      clusters: data.deployables.subscription.placement.clusters || ''
    }
  }
  return []
}

// Get list of channels that are associated with a specific deployable
export const getChannels = data => {
  if (data && data.deployables && data.deployables.channels) {
    return data.deployables.channels
  }
  return []
}

// This method constructs the breadCrumbs for the application deployable details
export const getBreadCrumbs = (deployableParams, locale) => {
  if (deployableParams) {
    const breadCrumbs = [
      {
        label: msgs.get('dashboard.card.deployment.applications', locale),
        url: `${config.contextPath}`
      },
      {
        label: `${deployableParams.application || ''}`,
        url: `${config.contextPath}/${deployableParams.namespace ||
          ''}/${deployableParams.application || ''}`
      },
      {
        label: `${deployableParams.name || ''}`,
        url: `${config.contextPath}/${deployableParams.namespace ||
          ''}/${deployableParams.application ||
          ''}/deployable/${deployableParams.name || ''}`
      }
    ]

    return breadCrumbs
  }
  return [
    {
      label: msgs.get('dashboard.card.deployment.applications', locale),
      url: `${config.contextPath}`
    }
  ]
}
