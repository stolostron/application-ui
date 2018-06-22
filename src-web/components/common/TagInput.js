/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { WithContext as ReactTags } from 'react-tag-input'
import resources from '../../../lib/shared/resources'
import { Icon } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'

resources(() => {
  require('../../../scss/reactTag.scss')
})

const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

class TagInput extends React.Component {
  constructor(props) {
    super(props)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleClearAllClick = this.handleClearAllClick.bind(this)
  }

  componentWillMount() {
    const { tags=[] } = this.props
    this.setState({
      tags: tags
    })
  }

  handleDelete(i) {
    const { tags } = this.state
    const { onSelectedFilterChange } = this.props
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    })
    if (onSelectedFilterChange) {
      onSelectedFilterChange (this.state.tags)
    }
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }))
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    this.setState({ tags: newTags })
  }

  handleClearAllClick() {
    this.setState({ tags: [] })
  }

  onFilterButtonClick() {
    // TODO: add filter modal
  }

  render() {
    const { suggestions=[], onFilterButtonClick=this.onFilterButtonClick } = this.props
    const { tags } = this.state
    return (
      <div className='tagInput-filter'>
        <div className='tagInput-filterButton'>
          <Icon
            className='icon--filter--glyph'
            name='icon--filter--glyph'
            description={'filter'}
            onClick={onFilterButtonClick} />
        </div>
        <div className='tagInput-comboBox'>
          <ReactTags
            inline={true}
            placeholder={msgs.get('placeholder.filterInput.tags', this.context.locale)}
            tags={tags}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            handleDrag={this.handleDrag}
            delimiters={delimiters} />
        </div>
        <div role='presentation' className='tagInput-clearAll' onClick={this.handleClearAllClick}>{msgs.get('actions.clearAll', this.context.locale)}</div>

      </div>
    )
  }
}

TagInput.propTypes = {
  onFilterButtonClick: PropTypes.func,
  onSelectedFilterChange: PropTypes.func,
  suggestions: PropTypes.array,
  tags: PropTypes.array,
}

export default TagInput
