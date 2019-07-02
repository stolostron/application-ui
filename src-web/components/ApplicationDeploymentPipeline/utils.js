/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

export const getApplicationsListTotal = (list) => {
  if (list && list.items) {
    return list.items.length;
  }
  return -1;
};

// export const getDeployablesListTotal = (list) => {
//   if (list && list.items && ) {
//     return list.items.length;
//   }
//   return -1;
// };
