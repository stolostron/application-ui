/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const masonryOptions = {
  layoutInstant: true,
  horizontalOrder: true,
  fitWidth: true,
  initLayout: true,
  resizeContainer: true,
  columnWidth: 10,
  gutter: 0,
};

// This method takes in an object and drills down to find the items of applications
// Within that it will go a step further and find the deployables and merge them together.
export const getChannelNames = (list) => {
  if (list && list.items) {
    const channelNames = list.items.map((item) => {
      return (item && item.metadata && item.metadata.name) || 'unknown';
    });
    const emptyArray = [];
    return emptyArray.concat.apply([], channelNames);
  }
  return [];
};

export const stackChartCardData = [
  {
    name: 'Development',
    cm: 500,
    pr: 900,
    fl: 700,
  },
  {
    name: 'QA',
    cm: 200,
    pr: 400,
    fl: 900,
  },
  {
    name: 'Production',
    cm: 800,
    pr: 300,
    fl: 900,
  },
];
