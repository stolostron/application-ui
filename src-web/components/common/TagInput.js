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
import ReactTags from 'react-tag-autocomplete'
import resources from '../../../lib/shared/resources'
import { Icon } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
// import FilterModal from '../modals/FilterModal'

resources(() => {
  require('../../../scss/reactTag.scss')
})

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
      tags: tags,
    })
  }

  updateSelectedTags(tags) {
    const { onSelectedFilterChange } = this.props
    this.setState({ tags: tags })
    onSelectedFilterChange && onSelectedFilterChange(tags)
  }

  handleDelete(i) {
    const { tags } = this.state
    this.updateSelectedTags(tags.filter((tag, index) => index !== i))
  }

  handleAddition(tag) {
    const { availableFilters=[] } = this.props
    const suggestions = this.convertObjectToArray(availableFilters)
    if (!tag.type) {
      // user can only add a tag that exists in suggestions
      tag = suggestions.find(element => element.name === tag.name)
    }
    if (tag) this.updateSelectedTags([...this.state.tags, tag], tag)
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    this.updateSelectedTags(newTags)
  }

  onFilterButtonClick() {
    this.handleModalOpen()
  }

  handleClearAllClick() {
    this.updateSelectedTags([])
  }

  handleModalOpen = () => {
    this.setState((prevState) => Object.assign({}, prevState, {
      modalOpen: true
    }))
  }

  handleModalClose = () => {
    this.setState((prevState) => Object.assign({}, prevState, {
      modalOpen: true
    }))
  }

  convertObjectToArray(input) {
    if (Array.isArray(input)) {
      return input
    } else {
      let result = []
      Object.values(input).forEach(value => {
        if (Array.isArray(value)) {
          Object.values(value).forEach(element => {
            result = [...result, element]
          })
        }
      })
      return result
    }
  }

  render() {
    const { availableFilters=[], onFilterButtonClick=this.onFilterButtonClick, hideModalButton } = this.props
    const { tags } = this.state
    const suggestions = this.convertObjectToArray(availableFilters)
    return (
      <div className='tagInput-filter'>
        {!hideModalButton &&
          <div className='tagInput-filterButton'>
            <Icon
              className='icon--filter--glyph'
              name='icon--filter--glyph'
              description={'filter'}
              onClick={onFilterButtonClick} />
          </div>
        }
        {/*<FilterModal selected={tags}*/}
        {/*suggestions={suggestions}*/}
        {/*modalOpen={this.state.modalOpen}*/}
        {/*handleModalOpen={this.handleModalOpen()}*/}
        {/*handleModalClose={this.handleModalClose()}*/}
        {/*/>*/}
        <div className='tagInput-comboBox'>
          <ReactTags
            placeholder={msgs.get('placeholder.filterInput.tags', this.context.locale)}
            tags={tags}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            autoresize={false}
            minQueryLength={1}
          />
        </div>
        <div role='presentation' className='tagInput-clearAll' onClick={this.handleClearAllClick}>{msgs.get('actions.clearAll', this.context.locale)}</div>
      </div>
    )
  }
}

TagInput.propTypes = {
  availableFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hideModalButton: PropTypes.bool,
  onFilterButtonClick: PropTypes.func,
  onSelectedFilterChange: PropTypes.func,
  tags: PropTypes.array,
}

export default TagInput
