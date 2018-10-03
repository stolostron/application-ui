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
import Autocomplete from 'react-autocomplete'
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
          <div className={'modal-table-content'}>
            {this.getItems()}
          </div>
        </div>
      )
    }

    createNewInstance(newInstance) {
      const { onTextInputChange, newLabel, onTextInputSelect, items, onAdd } = this.props
      return (
        <div className='text-input-field-row'>
          <p className='text-input-field-row-header'>{msgs.get('modal.formfield.addLable', this.context.locale)}</p>
          <div className={'text-input-container'}>
            {Object.keys(newInstance).map((instanceKey, index) =>
              <div className={'text-input-box-container'} key={`add-new-${instanceKey}`}>
                {index !== 0 && <p>=</p>}
                <Autocomplete
                  getItemValue={(item) => item[instanceKey]}
                  items={items}
                  shouldItemRender={(item, value) => item[instanceKey].toLowerCase().indexOf(value.toLowerCase()) > -1}
                  renderItem={(item, isHighlighted) =>
                    <div className={ isHighlighted ? 'text-input-container__menu-item text-input-container__menu-item--highlighted' : 'text-input-container__menu-item'} key={`item-${instanceKey}-${item[instanceKey]}`}>
                      {item[instanceKey]}
                    </div>
                  }
                  renderMenu={(items) =>
                    <div className={'text-input-container-list-box__menu'}>
                      {items}
                    </div>
                  }
                  value={newLabel[instanceKey] || ''}
                  onChange={onTextInputChange(instanceKey)}
                  onSelect={onTextInputSelect(instanceKey)}
                />
              </div>)
            }
            <Icon
              id={'add-label-icon'}
              tabIndex='0'
              onClick={onAdd()}
              name='icon--add--solid'
              description={msgs.get('svg.description.add', this.context.locale)}
            />
          </div>
        </div>
      )
    }

    getItems() {
      const { items, type, error, onRemove, onClickRow, onEditValue } = this.props
      if (Array.isArray(items)) {
        return items.map((item, i) => {
          if (item.editable && Object.keys(onEditValue).length !== 0) {
            return <div key={`${item.name}-editable`}>
              {this.editExistingItem(newInstance)}
            </div>
          } else {
            return <Component
              /* eslint-disable-next-line react/no-array-index-key */
              key={`${type}-${i}`}
              item={item}
              id={i}
              error={error}
              onClickRow={onClickRow.bind(null, item.key)}
              onRemove={onRemove.bind(null, item.key)} />
          }
        })
      }
    }

    editExistingItem(newInstance) {
      const { onTextInputChange, onEditValue, onAdd } = this.props
      return (
        <div className='text-input-field-row'>
          <div className={'text-input-container'}>
            {Object.keys(newInstance).map((instanceKey, index) =>
              <div key={`update-existing-${instanceKey}`}>
                {index !== 0 && <p>=</p>}
                <TextInput
                  id={`update-existing-input-${instanceKey}`}
                  hideLabel
                  labelText=''
                  value={onEditValue[instanceKey] || ''}
                  onChange={onTextInputChange(instanceKey, true)}
                />
              </div>)
            }
            <Icon
              id={'update-existing-label-icon'}
              tabIndex='0'
              onClick={onAdd(true)}
              name='icon--checkmark--solid'
              description={msgs.get('svg.description.add', this.context.locale)}
            />
          </div>
        </div>
      )
    }
  }
}

export default withMultiple
