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
import loadable from 'loadable-components'
import { GET_MODAL_STATE } from '../../apollo-client/queries/StateQueries'
import { Query } from 'react-apollo'
import _ from 'lodash'

let SaveAndEditQueryModal
let DeleteQueryModal
let ShareQueryModal

class ModalApollo extends React.PureComponent {

  getMatchedModal = ({ type, open, ...rest }) => {
    switch (type) {
    case 'modal.actions.share':
      return open && this.getShareQueryModal({ type, open, ...rest })
    case 'modal.actions.remove':
      return open && this.getDeleteQueryModal({ type, open, ...rest })
    case 'modal.actions.edit':
      return open && this.getSaveAndEditQueryModal({ type, open, ...rest })
    case 'modal.actions.save':
      return open && this.getSaveAndEditQueryModal({ type, open, ...rest })
    default:
      return null
    }
  }

  getSaveAndEditQueryModal = props => {
    SaveAndEditQueryModal = SaveAndEditQueryModal === undefined ? loadable(() => import(/* webpackChunkName: "save-edit-resource-modal-apollo" */ '../modals/SaveAndEditQueryModal')) : SaveAndEditQueryModal
    return this.getModal(SaveAndEditQueryModal, props)
  }

  getDeleteQueryModal = props => {
    DeleteQueryModal = DeleteQueryModal === undefined ? loadable(() => import(/* webpackChunkName: "remove-resource-modal-apollo" */ '../modals/DeleteQueryModal')) : DeleteQueryModal
    return this.getModal(DeleteQueryModal, props)
  }

  getShareQueryModal = props => {
    ShareQueryModal = ShareQueryModal === undefined ? loadable(() => import(/* webpackChunkName: "share-resource-modal-apollo" */ '../modals/ShareQueryModal')) : ShareQueryModal
    return this.getModal(ShareQueryModal, props)
  }

  getModal = (Component, props) => <Component {...props} />

  render() {
    return (
      <Query query={GET_MODAL_STATE}>
        {( { data } ) => {
          if(_.get(data, 'modal.open')) {
            return this.getMatchedModal(_.get(data, 'modal'))
          } else {
            return null
          }
        }}
      </Query>
    )
  }
}

export default ModalApollo
