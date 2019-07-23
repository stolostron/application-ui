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
export const getApplicationsList = list => {
  if (list && list.items) {
    return list.items
  }
  return []
}

// This method takes in an object and drills down to find the items of applications
// Within that it will go a step further and find the deployables and merge them together.
export const getDeployablesList = list => {
  if (list && list.items) {
    const deployables = list.items.map(item => {
      return (item && item.deployables) || []
    })
    const emptyArray = []
    return emptyArray.concat.apply([], deployables)
  }
  return []
}

// Method will take in an object and return back the channels mapped
export const getChannelsList = channels => {
  if (channels && channels.items) {
    const mappedChannels = channels.items.map(channel => {
      return {
        id: channel.metadata.name || '',
        name: channel.metadata.name || '',
        namespace: channel.metadata.namespace || '',
        selfLink: channel.metadata.selfLink || '',
        uid: channel.metadata.uid || '',
        creationTimeStamp: channel.raw.metadata.creationTimestamp || '',
        pathName: channel.objectPath || '',
        type: channel.type || ''
      }
    })
    return mappedChannels
  }
  return []
}

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
        namespace: 'namespace1'
      },
      spec: {
        source: 'https://kubernetes-charts.storage.googleapis.com/',
        package: 'nginx',
        packageFilter: { version: '1.x' },
        placement: {
          clusters: {
            name: 'cluster1'
          }
        }
      }
    },
    {
      kind: 'Subscription',
      metaData: {
        name: 'subscription2',
        namespace: 'namespace2'
      },
      spec: {
        source: 'https://kubernetes-charts.storage.googleapis.com/',
        package: 'nginx',
        packageFilter: { version: '1.x' },
        placement: {
          clusters: {
            name: 'cluster2'
          }
        }
      }
    },
    {
      kind: 'Subscription',
      metaData: {
        name: 'subscription3',
        namespace: 'namespace'
      },
      spec: {
        source: 'https://kubernetes-charts.storage.googleapis.com/',
        package: 'nginx',
        packageFilter: { version: '1.x' },
        placement: {
          clusters: {
            name: 'cluster3'
          }
        }
      }
    }
  ]
}
