/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project

import React from 'react'
import PropTypes from 'prop-types'

export const withLocale = Component => {
  const ComponentWithLocale = (props, context) =>
    React.createElement(Component, { ...props, ...context })
  ComponentWithLocale.displayName = `withLocale(${Component.displayName})`
  ComponentWithLocale.contextTypes = { locale: PropTypes.string }
  return ComponentWithLocale
}
