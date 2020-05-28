/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import * as Actions from './index'

// pass the refetch flag and also the interval value
export const refetchIntervalUpdate = refetch => ({
  type: Actions.REFETCH_INTERVAL_UPDATE,
  data: refetch
})
