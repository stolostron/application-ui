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

// return the data for the stacked channel
export const getChannelChartData = (list) => {
  if (list && list.items) {
    const channelChartDataList = list.items.map((item) => {
      return {
        name: (item && item.metadata && item.metadata.name) || 'unknown',
        cm: 500,
        pr: 900,
        fl: 700,
      };
    });
    const emptyArray = [];
    return emptyArray.concat.apply([], channelChartDataList);
  }
  return [];
};
