/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

// this method may need to be updated with different status values
export const getChannelStatusClass = status => {
  return (
    (status === 'success' && 'statusTagCompleted') ||
    (status === 'failed' && 'statusTagFailed') ||
    (status === 'inprogress' && 'statusTagInProgress') ||
    (status && 'statusTag')
  )
}
