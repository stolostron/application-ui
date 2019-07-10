/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import R from 'ramda';

// A created Mapper to create the row for our application data table
const mapApplicationLookUp = (application) => {
  const { metadata, deployables } = application;
  const idRef = (metadata && metadata.name) || 'default';
  return {
    [idRef]: {
      id: (metadata && metadata.name) || '',
      name: (metadata && metadata.name) || '',
      deployables: deployables || [],
      selfLink:
        '/apis/mcm.ibm.com/v1alpha1/namespaces/services/deployables/appdeploy-guestbook-app',
      channel: ['channel1', 'channel2', 'channel4'],
      clusters: ['cluster1', 'cluster2', 'cluster3'],
      status: 'fail',
      version: '1.4.4',
    },
  };
};

// A created Mapper to create the row for our application data table
const mapApplicationForRow = (application) => {
  const { metadata, deployables } = application;
  return {
    id: (metadata && metadata.name) || '',
    name: (metadata && metadata.name) || '',
    deployables: deployables || [],
    selfLink:
      '/apis/mcm.ibm.com/v1alpha1/namespaces/services/deployables/appdeploy-guestbook-app',
    channel: ['channel1', 'channel2', 'channel4'],
    clusters: ['cluster1', 'cluster2', 'cluster3'],
    status: 'fail',
    version: '1.4.4',
  };
};

// Method will take in an object of applications and return back a mapped version
// for the DataTable
export const createApplicationRows = (list) => {
  const mappedApps =
    (list && list.map(item => mapApplicationForRow(item))) || {};
  return mappedApps;
};

// Method will take in an object of applications and return back a mapped version
// for the DataTable that will contain more data that we will use to look up and
// reference given the ID
export const createApplicationRowsLookUp = (list) => {
  const mappedApps =
    (list && list.map(item => mapApplicationLookUp(item))) || {};
  return R.mergeAll(mappedApps);
};
