/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import { Button, ListItem, Modal, UnorderedList } from 'carbon-components-react'
import { ApolloConsumer } from 'react-apollo'


resources(() => {
  require('../../../scss/search-input.scss')
})

class SearchGuideModal extends React.PureComponent {

  handleModalClose = (client) => {
    client.writeData({ data: {
      modal: {
        __typename: 'modal',
        open: false
      }
    }} )
  }

  renderModalBodySection(headerText, typeText, showText) {
    return (
      <div className={'bx--modal-content-body'}>
        <p>{headerText}</p>
        <div className={'bx--modal-content-body-row'}>
          <div className={'body-pill'}><p className={'body-pill-label'}>Type</p></div>
          <p>{typeText}</p>
        </div>
        <div className={'bx--modal-content-body-row'}>
          <div className={'body-pill'}><p className={'body-pill-label'}>Show</p></div>
          <p>{showText}</p>
        </div>
      </div>
    )
  }

  render(){
    return (
      <ApolloConsumer>
        {client => (
          <div className={'search-guide-modal'}>
            <Modal
              passiveModal
              open={this.props.open}
              onRequestClose={this.handleModalClose.bind(this, client)}
            >
              <div>
                <div className={'bx--modal-content-header'}>
                  <div className={'bx--modal-content-header-main'}>{msgs.get('modal.query.info.heading', this.context.locale)}</div>
                  <div className={'bx--modal-content-header-subtext'}>{msgs.get('modal.query.info.heading.subtext', this.context.locale)}</div>
                </div>
                {this.renderModalBodySection(
                  msgs.get('modal.query.info.keyword.desc', this.context.locale),
                  'IBM',
                  msgs.get('modal.query.info.keyword.example', this.context.locale)
                )}
                {this.renderModalBodySection(
                  msgs.get('modal.query.info.filter.desc', this.context.locale),
                  'status: failed,pending',
                  msgs.get('modal.query.info.filter.example', this.context.locale)
                )}
                <div className={'bx--modal-content-body'}>
                  <p>{msgs.get('modal.query.info.note.label', this.context.locale)}</p>
                  <UnorderedList>
                    <ListItem>{msgs.get('modal.query.info.special.note1', this.context.locale)}</ListItem>
                    <ListItem>{msgs.get('modal.query.info.special.note2', this.context.locale)}</ListItem>
                  </UnorderedList>
                </div>
                <div className={'bx--modal-content-footer'}>
                  <Button type='button' onClick={this.handleModalClose.bind(this, client)}>{msgs.get('modal.button.close', this.context.locale)}</Button>
                </div>
              </div>
            </Modal>
          </div>
        )}
      </ApolloConsumer>
    )
  }
}


SearchGuideModal.propTypes = {
  open: PropTypes.bool,
}

export default SearchGuideModal

