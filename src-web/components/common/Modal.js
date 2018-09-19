/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { connect } from 'react-redux'
import loadable from 'loadable-components'

let RemoveResourceModal

const Modal = ({ type, open, ...rest }) => {
  switch (type) {
  case 'resource-remove':
    return open && getRemoveResourceModal({ type, open, ...rest })
  default:
    return null
  }
}

const getRemoveResourceModal = props => {
  RemoveResourceModal = RemoveResourceModal === undefined ? loadable(() => import(/* webpackChunkName: "remove-resource-modal"" */ '../modals/RemoveResourceModal')) : RemoveResourceModal
  return getModal(RemoveResourceModal, props)
}


const getModal = (Component, props) => <Component {...props} />

const mapStateToProps = state => state.modal

export default connect(mapStateToProps)(Modal)
