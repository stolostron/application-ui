/*******************************************************************************
 * Licensed Materials - Property of IBM
 * 5737-E67
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'
import apolloClient from '../../../lib/client/apollo-client'
import { Modal, InlineNotification, Loading } from 'carbon-components-react'
import { GET_SAVED_USER_QUERY } from '../../apollo-client/queries/SearchQueries'
import { ApolloConsumer } from 'react-apollo'

resources(() => {
  require('../../../scss/search-input.scss')
})

class SaveAndEditQueryModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { data: { name } = {} } = props
    this.state = {
      name: name || '',
      errorMessage: ''
    }
  }

  handleModalClose = client => {
    client.writeData({
      data: {
        modal: {
          __typename: 'modal',
          open: false
        }
      }
    })
  };

  handleModalSubmit = client => {
    // this.props.addQueryIntoUserProfile(name, description)
    const { name } = this.state
    this.setState({ loading: true })
    this.makeApolloQuery(name, client)
  };

  handleNotificationClosed = () => this.setState({ errorMessage: null });

  makeApolloQuery = (name, client) => {
    apolloClient.deleteUserQueries({ name }).then(result => {
      if (
        result.data.deleteQuery.errors &&
        result.data.deleteQuery.errors.length > 0
      ) {
        this.setState({
          errorMessage: result.data.deleteQuery.errors[0],
          loading: false
        })
      } else {
        this.setState({ loading: false })
        this.handleModalClose(client)
        client.query({ query: GET_SAVED_USER_QUERY })
      }
    })
  };

  render() {
    return (
      <ApolloConsumer>
        {client => (
          <div className={'save-and-edit-query-modal'}>
            <Modal
              danger
              open={this.props.open}
              modalHeading={msgs.get(
                'modal.query.delete.heading',
                this.context.locale
              )}
              primaryButtonText={msgs.get(
                'actions.delete.search',
                this.context.locale
              )}
              secondaryButtonText={msgs.get(
                'actions.cancel',
                this.context.locale
              )}
              onRequestSubmit={this.handleModalSubmit.bind(this, client)}
              onRequestClose={this.handleModalClose.bind(this, client)}
            >
              <div>
                {this.state.loading && <Loading className="content-spinner" />}
                <p>{`${msgs.get(
                  'modal.query.remove.warning',
                  [this.state.name],
                  this.context.locale
                )}`}</p>
                {this.state.errorMessage && (
                  <InlineNotification
                    kind="error"
                    title={msgs.get('error', this.context.locale)}
                    iconDescription=""
                    subtitle={this.state.errorMessage}
                    onCloseButtonClick={this.handleNotificationClosed}
                  />
                )}
              </div>
            </Modal>
          </div>
        )}
      </ApolloConsumer>
    )
  }
}

SaveAndEditQueryModal.propTypes = {
  // addQueryIntoUserProfile: PropTypes.func,
  data: PropTypes.object,
  open: PropTypes.bool
}

export default SaveAndEditQueryModal
