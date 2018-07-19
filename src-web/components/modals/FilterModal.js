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
import { Modal } from 'carbon-components-react'
import NestedTable from '../common/NestedTable'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/modal.scss')
})


class FilterModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.selectionChanged = this.selectionChanged.bind(this)
    this.state = {
      tags: props.selected || [],
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps && nextProps.selected !== this.props.selected) {
      this.setState({tags: nextProps.selected})
    }
  }

  convertFilterArray(queries) {
    const filterArray = []
    for (const [type, value] of Object.entries(queries)) {
      filterArray.push({
        key: type,
        value
      })
    }
    return filterArray
  }

  createFilterTable(availableFilters, selectedFilters, selectionChanged) {
    return (
      <NestedTable
        availableItems={this.convertFilterArray(availableFilters)}
        header={ msgs.get('modal.formfield.name', this.context.locale) }
        selectedItems={selectedFilters}
        selectionChanged={selectionChanged}
      />
    )
  }

  selectionChanged(selections) {
    this.setState({tags:selections})
  }

  handleSubmitClick() {
    const { handleModalSubmit } = this.props
    handleModalSubmit(this.state.tags)
  }

  render(){
    const { availableFilters=[], handleModalClose } = this.props
    const { modalOpen } = this.props
    return (
      <div>
        <Modal
          className='modal-with-editor'
          open={modalOpen}
          modalHeading={ msgs.get('modal.resource-filter.label', this.context.locale) }
          primaryButtonText={ msgs.get('actions.save', this.context.locale) }
          primaryButtonDisabled={false}
          secondaryButtonText={ msgs.get('actions.cancel', this.context.locale) }
          onRequestSubmit={ this.handleSubmitClick }
          onRequestClose={ handleModalClose }
        >
          {this.createFilterTable(availableFilters, this.state.tags, this.selectionChanged)}
        </Modal>
      </div>
    )
  }
}

FilterModal.propTypes = {
  availableFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  handleModalClose: PropTypes.func,
  handleModalSubmit: PropTypes.func,
  modalOpen: PropTypes.bool,
  selected: PropTypes.array,
}


export default FilterModal
