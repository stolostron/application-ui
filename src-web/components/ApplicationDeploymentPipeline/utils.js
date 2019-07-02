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
  if (list && list.items) {
    const deployables = list.items.map((item) => {
      return (item && item.deployables) || [];
    });
    const emptyArray = [];
    return emptyArray.concat.apply([], deployables);
  }
  return [];
};
