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
  itemSelector: '.grid-item',
};

// return the data for the stacked channel
export const getChannelChartData = (list) => {
  if (list && list.items) {
    const channelChartDataList = list.items.map((item) => {
      return {
        name: (item && item.metadata && item.metadata.name) || 'unknown',
        cm: item.metadata.name.length * 20,
        pr: item.metadata.name.length * 30,
        fl: item.metadata.name.length * 50,
      }
    })
    const emptyArray = []
    return emptyArray.concat.apply([], channelChartDataList)
  }
  return []
}

// return the width of the chart
export const getChannelChartWidth = (list) => {
  if (list && list.items) {
    if (list.items.length > 10) {
      return 700;
    }
    if (list.items.length > 7) {
      return 500;
    }
    return list.items.length * 75;
  }
  return 300;
};

const getDeployablesList = (list) => {
  if (list && list.items) {
    const deployables = list.items.map((item) => {
      return (item && item.deployables) || [];
    });
    const emptyArray = [];
    return emptyArray.concat.apply([], deployables);
  }
  return [];
};

export const getDeployablesChartData = (list) => {
  if (list) {
    const deployableList = getDeployablesList(list);

    if (deployableList) {
      const deplChartDataList = deployableList.map((item) => {
        return {
          name: (item && item.metadata && item.metadata.name) || 'unknown',
          cm: item.metadata.name.length * 20,
          pr: item.metadata.name.length * 30,
          fl: item.metadata.name.length * 50,
        };
      });
      const emptyArray = [];
      return emptyArray.concat.apply([], deplChartDataList);
    }
  }
  return [];
};
