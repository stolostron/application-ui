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
import apolloClient from '../../../lib/client/apollo-client'
import { Modal, TextInput, TextArea, InlineNotification, Loading } from 'carbon-components-react'
import { GET_SEARCH_INPUT_TEXT, GET_SAVED_USER_QUERY } from '../../apollo-client/queries/SearchQueries'
import { Query } from 'react-apollo'
import _ from 'lodash'
import {UPDATE_SINGLE_QUERY_TAB} from '../../apollo-client/queries/StateQueries'


resources(() => {
  require('../../../scss/search-input.scss')
})

class SaveAndEditQueryModal extends React.PureComponent {
  constructor(props) {
    super(props)
    const { data: { name, description} = {}} = props
    this.state = {
      nameInput: name || '',
      descriptionInput: description || '',
      errorMessage: '',
      editExisting: !!name,
    }
  }
  handleNameInputChange = (evt) => {
    this.setState({ nameInput: evt.target.value })
  }

  handleDesInputChange = (evt) => {
    this.setState({ descriptionInput: evt.target.value })
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
    // this.props.addQueryIntoUserProfile(name, description)
    const { nameInput, descriptionInput = '', searchText = '' } = this.state
    this.setState({ loading: true })
    this.makeApolloQuery(nameInput, descriptionInput, searchText, client)
  }

  handleNotificationClosed = () => this.setState({ errorMessage: null })

  makeApolloQuery = (name, description, searchText, client) => {
    apolloClient.saveUserQueries( { name, description, searchText } )
      .then(result => {
        if (result.data.saveQuery.errors && result.data.saveQuery.errors.length > 0){
          this.setState({ errorMessage: result.data.saveQuery.errors[0], loading: false })
        } else {
          this.setState({ nameInput: '', descriptionInput: '', errorMessage: '', loading: false})
          this.handleModalClose(client)
          client.query({ query: GET_SAVED_USER_QUERY })
        }
      })
    const newData =  {
      openedTabName: name,
      updateUnsavedOrExisting: true,
      searchText
    }
    client.mutate({ mutation: UPDATE_SINGLE_QUERY_TAB, variables: { ...newData } })
  }

  isSubmitDisabled = () => _.isEmpty(this.state.nameInput) || (_.isEmpty(this.state.searchText) && !this.state.editExisting)

  render(){
    return (<Query query={GET_SEARCH_INPUT_TEXT}>
      {( { data, client } ) => {
        const searchText = _.get(data, 'searchInput.text')
        if (searchText) this.setState({ searchText })
        return(
          <div className={'save-and-edit-query-modal'}>
            <Modal
              open={this.props.open}
              modalHeading={ msgs.get('modal.query.add.heading', this.context.locale) }
              primaryButtonText={ msgs.get('actions.save', this.context.locale) }
              primaryButtonDisabled={this.isSubmitDisabled()}
              secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
              onRequestSubmit={this.handleModalSubmit.bind(this, client)}
              onRequestClose={this.handleModalClose.bind(this, client)}
            >
              <div>
                { this.state.loading && <Loading className='content-spinner' />}
                <p className={'save-modal-description'}>{ msgs.get('modal.query.add.description', this.context.locale) }</p>
                { this.state.errorMessage &&
                <InlineNotification
                  kind='error'
                  title={msgs.get('error', this.context.locale)}
                  iconDescription=''
                  subtitle={this.state.errorMessage}
                  onCloseButtonClick={this.handleNotificationClosed}
                />
                }
                { searchText === '' && !this.state.editExisting &&
                <InlineNotification
                  kind='error'
                  title={msgs.get('error', this.context.locale)}
                  iconDescription=''
                  subtitle={msgs.get('error.no.searchtext', this.context.locale)}
                  onCloseButtonClick={this.handleNotificationClosed}
                />
                }
                <TextInput
                  id='add-query-name'
                  labelText={ msgs.get('modal.query.add.name.label', this.context.locale) }
                  placeholder={ msgs.get('modal.query.add.name', this.context.locale) }
                  value={this.state.nameInput}
                  onChange={this.handleNameInputChange}
                />
                <TextArea
                  id='add-query-desc'
                  labelText={ msgs.get('modal.query.add.desc.label', this.context.locale) }
                  placeholder={ msgs.get('modal.query.add.desc', this.context.locale) }
                  value={this.state.descriptionInput}
                  onChange={this.handleDesInputChange}
                />
              </div>
            </Modal>
          </div>
        )}
      }
    </Query>)
  }
}


SaveAndEditQueryModal.propTypes = {
  data: PropTypes.object,
  open: PropTypes.bool,
}

export default SaveAndEditQueryModal

