/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import { lifecycle, withStateHandlers } from 'recompose'
import { forceCheck } from 'react-lazyload'

// higher-order component for forcing lazy-loading reload.
export const withForceCheck = lifecycle({
  componentDidUpdate() {
    forceCheck()
  }
})

export const withToggleOpen = withStateHandlers(
  ({ isOpenInitial = false }) => ({
    isOpen: isOpenInitial
  }),
  {
    toggleOpen: ({ isOpen }) => (status = !isOpen) => ({
      isOpen: status
    })
  }
)
