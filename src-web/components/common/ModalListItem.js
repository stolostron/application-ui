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
import { TextInput, Icon, DataTable } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
/* eslint-disable react/prop-types, react/jsx-no-bind, react/display-name, no-console, react/no-string-refs */

const withMultiple = (Component, newInstance) => {

  return class extends React.Component {

    constructor(props) {
      super(props)
    }

    render() {
      const { TableToolbarSearch } = DataTable
      const { handleSearch, searchValue } = this.props
      return (
        <div>
          {newInstance && this.createNewInstance(newInstance)}
          <TableToolbarSearch
            onChange={handleSearch}
            value={searchValue}
            aria-label={'modal-table-search'}
            id={'modal-table-search'} />
          {this.getItems()}
        </div>
      )
    }

    handleSubmit = () => {
      this.props.onAdd()
    }

    createNewInstance(newInstance) {
      const { onTextInputChange, newLabel } = this.props
      return (
        <div className='text-input-field-row'>
          <p className='text-input-field-row-header'>{msgs.get('modal.formfield.addLable', this.context.locale)}</p>
          <div>
            {Object.keys(newInstance).map((instanceKey, index) =>
              <div key={`add-new-${instanceKey}`}>
                {index !== 0 && <p>=</p>}
                <TextInput
                  id={`add-new-input-${instanceKey}`}
                  hideLabel
                  labelText=''
                  value={newLabel[instanceKey] || ''}
                  onChange={onTextInputChange(instanceKey)}
                />
              </div>)
            }
            <Icon
              id={'add-label-icon'}
              tabIndex='0'
              onClick={this.handleSubmit}
              name='icon--add--solid'
              description={msgs.get('svg.description.add', this.context.locale)}
            />
          </div>
        </div>
      )
    }

    getItems() {
      const { items, type, error, onRemove } = this.props
      if (Array.isArray(items)) {
        return items.map((item, i) => {
          return <Component
            /* eslint-disable-next-line react/no-array-index-key */
            key={`${type}-${i}`}
            item={item}
            id={i}
            error={error}
            onRemove={onRemove.bind(null, item.key)} />
        })
      }
    }
  }
}

export default withMultiple
