/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// Method will take in an object and return back the channels mapped for display purposes
export const getChannelsList = (channels) => {
  if (channels && channels.items) {
    const mappedChannels = channels.items.map((channel) => {
      return {
        name: channel.metadata.name || '',
        counts: {
          pending: {
            total: 3,
          },
          'in progress': {
            total: 2,
          },
          failed: {
            total: 1,
          },
        },
      };
    });
    return mappedChannels;
  }
  return [];
};
