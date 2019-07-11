/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// import R from 'ramda';

// Method will take in an object and return back the items of applications
export const getApplicationsList = (list) => {
  if (list && list.items) {
    return list.items;
  }
  return [];
};

// This method takes in an object and drills down to find the items of applications
// Within that it will go a step further and find the deployables and merge them together.
export const getDeployablesList = (list) => {
  // if (list && list.items) {
  //   const deployables = list.items.map((item) => {
  //     return (item && item.deployables) || [];
  //   });
  //   const emptyArray = [];
  //   return emptyArray.concat.apply([], deployables);
  // }
  // return [];
  return [
    {
      name: 'kirti1-guestbook-app',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/ibmcom/deployables/kirti1-guestbook-app',
      channel: ['channel1', 'channel2'],
      clusters: ['cluster1', 'cluster2', 'cluster3'],
      status: 'failed',
      version: '1.3.4',
    },
    {
      name: 'kirti1-guestbook-app-redismaster',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/ibmcom/deployables/kirti1-guestbook-app-redismaster',
      channel: ['channel2'],
      clusters: ['cluster1', 'cluster2'],
      status: 'failed',
      version: '1.3.4',
    },
    {
      name: 'kirti1-guestbook-app-redisslave',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/ibmcom/deployables/kirti1-guestbook-app-redisslave',
      channel: ['channel1', 'channel2'],
      clusters: ['cluster2', 'cluster3'],
      status: 'pass',
      version: '1.3.4',
    },
    {
      name: 'appdeploy-guestbook-app',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/services/deployables/appdeploy-guestbook-app',
      channel: ['channel2', 'channel3', 'channel4'],
      clusters: ['cluster1', 'cluster2', 'cluster3'],
      status: 'pass',
      version: '1.4.4',
    },
    {
      name: 'appdeploy-guestbook-app-redismaster',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/services/deployables/appdeploy-guestbook-app-redismaster',
      channel: ['channel2', 'channel3', 'channel4'],
      clusters: ['cluster1', 'cluster2', 'cluster3'],
      status: 'pass',
      version: '1.4.4',
    },
    {
      name: 'appdeploy-guestbook-app-redisslave',
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/services/deployables/appdeploy-guestbook-app-redisslave',
      channel: ['channel2', 'channel3', 'channel4'],
      clusters: ['cluster1', 'cluster2', 'cluster3'],
      status: 'fail',
      version: '1.4.14',
    },
  ];
};

// Method will take in an object and return back the channels
export const getChannelsList = () => {
  return [
    {
      kind: 'Channel',
      metaData: {
        name: 'channel1',
        namespace: 'namespace1',
      },
      spec: {
        type: 'HelmRepo',
        pathname: 'https://kubernetes-charts.storage.googleapis.com/',
      },
    },
    {
      kind: 'Channel',
      metaData: {
        name: 'channel2',
        namespace: 'namespace2',
      },
      spec: {
        type: 'ObjectStore',
        pathname: 'https://kubernetes-charts.storage.googleapis.com/',
      },
    },
    {
      kind: 'Channel',
      metaData: {
        name: 'channel3',
        namespace: 'namespace3',
      },
      spec: {
        type: 'HelmRepo',
        pathname: 'https://kubernetes-charts.storage.googleapis.com/',
      },
    },
    {
      kind: 'Channel',
      metaData: {
        name: 'channel4',
        namespace: 'namespace4',
      },
      spec: {
        type: 'ObjectStore',
        pathname: 'https://kubernetes-charts.storage.googleapis.com/',
      },
    },
  ];
};

// TODO TODO TODO not sure if this is accurate
// TODO TODO Not even using this yet
// TODO right now we are just using mock data
// Method will take in an object and return back the channels
export const getSubscriptionsList = () => {
  return [
    {
      kind: 'Subscription',
      metaData: {
        name: 'subscription1',
        namespace: 'namespace1',
      },
      spec: {
        source: 'https://kubernetes-charts.storage.googleapis.com/',
        package: 'nginx',
        packageFilter: { version: '1.x' },
        placement: {
          clusters: {
            name: 'cluster1',
          },
        },
      },
    },
    {
      kind: 'Subscription',
      metaData: {
        name: 'subscription2',
        namespace: 'namespace2',
      },
      spec: {
        source: 'https://kubernetes-charts.storage.googleapis.com/',
        package: 'nginx',
        packageFilter: { version: '1.x' },
        placement: {
          clusters: {
            name: 'cluster2',
          },
        },
      },
    },
    {
      kind: 'Subscription',
      metaData: {
        name: 'subscription3',
        namespace: 'namespace',
      },
      spec: {
        source: 'https://kubernetes-charts.storage.googleapis.com/',
        package: 'nginx',
        packageFilter: { version: '1.x' },
        placement: {
          clusters: {
            name: 'cluster3',
          },
        },
      },
    },
  ];
};
