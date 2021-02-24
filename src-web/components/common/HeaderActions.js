// Copyright (c) 2020 Red Hat, Inc.
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
