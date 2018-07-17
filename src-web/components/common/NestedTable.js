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
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableRowExpanded,
  TableData,
  TableHeader,
  DataTable
} from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import resources from '../../../lib/shared/resources'

const { TableSelectRow, TableCell } = DataTable

resources(() => {
  require('../../../scss/nested-table.scss')
})

class NestedTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      toggle: [],
    }
  }

  toggleRow = index => () => {
    this.setState(preState => {
      const toggle = [...preState.toggle]
      toggle[index] = toggle[index] ? !toggle[index] : true
      return { toggle }
    })
  };

  getToggleState = index => this.state.toggle[index] ? this.state.toggle[index] : false

  getItemCheckedState = id => !!this.props.selectedItems.find(item => item.id === id)

  updateSelectedState = row => () => {
    const { selectedItems, selectionChanged } = this.props
    let newSelectedItems = [...selectedItems]
    if (selectedItems.find(item => item.id === row.id)) {
      const itemIndex = selectedItems.findIndex(item => item.id === row.id)
      newSelectedItems.splice(itemIndex, 1)
    } else {
      newSelectedItems = [...selectedItems, row]
    }
    selectionChanged && selectionChanged(newSelectedItems)
  }

  createTableSelectRow = (rows) => (
    <Table>
      <TableBody>
        {rows.map(row => (
          <TableRow key={row.id} even={false} >
            <TableSelectRow
              onSelect={this.updateSelectedState(row)}
              checked={this.getItemCheckedState(row.id)}
              ariaLabel={'tableSelectRow'}
              id={row.id}
              name={row.name}
            />
            <TableCell key={row.value}>{row.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );


  render() {
    const {
      availableItems,
      header
    } = this.props

    const createExpandedRows = (item, index, selectionChanged) => {
      const toggleState = this.getToggleState(index)
      return (
        <TableRowExpanded expanded={toggleState} colSpan={4} key={`c${index}`}>
          {this.createTableSelectRow(item.value, selectionChanged)}
        </TableRowExpanded>
      )
    }

    const rowData = availableItems.map((item, index) => {
      const toggleState = this.getToggleState(index)
      return [
        <TableRow key={`b${item.key}`} even={false} className={'nested-table-select-row'}>
          <TableData
            onClick={this.toggleRow(index)}
            key={`a${item.key}`}
            expanded={toggleState}
            className={'nest-table-expand-icon'}
          />
          <TableData key={`d${item.key}`} className={'nest-table-expand-name'}>
            {msgs.get(`modal.formfield.${item.key}`, this.context.locale)}
          </TableData>
        </TableRow>,
        createExpandedRows(item, index)
      ]
    })

    return (
      <div className={'nested-table-main'}>
        <Table>
          <TableHead>
            <TableRow header className={'nested-table-header-row'}>
              <TableHeader />
              <TableHeader className={'nested-table-header'}>
                <p>{header}  </p>
                <p>({this.props.selectedItems.length} {msgs.get('nested.table.selected', this.context.locale)})</p>
              </TableHeader>
            </TableRow>
          </TableHead>
          <TableBody className={'nested-table-body'}>{rowData}</TableBody>
        </Table>
      </div>
    )
  }
}

NestedTable.propTypes = {
  availableItems: PropTypes.array,
  header: PropTypes.string,
  selectedItems: PropTypes.array,
  selectionChanged: PropTypes.func
}

export default NestedTable
