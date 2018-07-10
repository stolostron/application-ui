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
import { Modal, Table, TableBody, TableRow, TableData } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/modal.scss')
})

// WIP, still waiting Lise to finalize the design
/* eslint-disable-next-line */
const FilterTableRow = ({ filterName, availableFilters=[], selectedFilters=[] }) => (
  <TableRow>
    <TableData>
      {filterName}
    </TableData>
  </TableRow>
)
/* eslint-disable react/no-unused-prop-types */
FilterTableRow.propTypes = {
  filterData: PropTypes.array,
  filterKey: PropTypes.string,
}

class FilterModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.handleSubmitClick = this.handleSubmitClick.bind(this)
    this.state = {
      tags: props.tags || [],
    }
  }

  createFilterTable(tags, availableFilters) {
    return (
      <Table className='filter-table' >
        <TableBody>
          {Object.keys(availableFilters).map(filterKey =>
            <FilterTableRow
              availableFilters={availableFilters[filterKey]}
              filterName = {filterKey}
              key={filterKey}
              selectedFilters={tags}
            />
          )}
        </TableBody>
      </Table>
    )
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
          {this.createFilterTable(this.state.tags, availableFilters)}
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
  tags: PropTypes.array,
}


export default FilterModal
