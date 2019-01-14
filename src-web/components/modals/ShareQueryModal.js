/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
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
import { Modal, CodeSnippet } from 'carbon-components-react'
import { ApolloConsumer } from 'react-apollo'
import copy from 'copy-to-clipboard'

resources(() => {
  require('../../../scss/search-input.scss')
})

class SaveAndEditQueryModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { data: { searchText } = {}} = props
    this.state = {
      searchText: searchText || '',
    }
  }

  handleModalClose = (client) => {
    client.writeData({ data: {
      modal: {
        __typename: 'modal',
        open: false
      }
    }} )
  }

  handleModalSubmit = (client) => {
    this.handleModalClose(client)
  }

  handleCopy = (text) => () => {
    copy(text)
  }

  render(){
    let url = decodeURIComponent(window.location.origin + window.location.pathname)
    if (this.state.searchText !== '') {
      url += `?filters={"textsearch":"${encodeURIComponent(this.state.searchText)}"}`
    }
    return (<ApolloConsumer>
      {client => (
        <div className={'save-and-edit-query-modal'}>
          <Modal
            passiveModal
            open={this.props.open}
            modalHeading={ msgs.get('modal.query.Share.heading', this.context.locale) }
            onRequestSubmit={this.handleModalSubmit.bind(this, client)}
            onRequestClose={this.handleModalClose.bind(this, client)}
          >
            <div className={'save-query-box'}>
              <p>{ msgs.get('modal.query.share.name.label', this.context.locale) }</p>
              <CodeSnippet
                feedback={ msgs.get('modal.button.copied', this.context.locale) }
                copyButtonDescription="copy button"
                ariaLabel=""
                onClick={this.handleCopy(url)}
              >
                {url}
              </CodeSnippet>
            </div>
          </Modal>
        </div>
      )}
    </ApolloConsumer>)
  }
}


SaveAndEditQueryModal.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
}

export default SaveAndEditQueryModal

