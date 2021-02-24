/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import PropTypes from 'prop-types'

/**
 * Functional React component that serves as a base
 * for all pages and renders the header
 */
const Page = ({ children }) => (
  <div className="page-content-container" role="main">
    {children}
  </div>
)

Page.propTypes = {
  children: PropTypes.object
}

export default Page
