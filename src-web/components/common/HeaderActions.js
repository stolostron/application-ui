/*******************************************************************************
 * Licensed Materials - Property of IBM
 * Copyright (c) 2020 Red Hat, Inc.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { withLocale } from '../../providers/LocaleProvider'

const HeaderActions = withLocale(() => {
  return (
    <div className="app-info-and-dashboard-links">
      <span className="app-info-and-dashboard-links-separator-f" />
    </div>
  )
})

export default withLocale(HeaderActions)
