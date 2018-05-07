/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'

/* FIXME: Please fix disabled eslint rules when making changes to this file. */
/* eslint-disable react/prop-types */
/**
 * Functional React component that serves as a base
 * for all pages and renders the header
 */
const Page = ({ children }) =>
  <div className='page-content-container' role='main'>
    {children}
  </div>

export default Page
