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
import { Icon, CopyButton } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import FilterTag from './FilterTag'
import FilterModal from '../modals/FilterModal'
import CopyToClipboard from 'react-copy-to-clipboard'

// https://github.com/i-like-robots/react-tags
// third part library for tag input
resources(() => {
  require('../../../scss/reactTag.scss')
})

const ARRAY_SPLITTER = ';'

class TagInput extends React.Component {
  constructor(props) {
    super(props)
    const { tags =[] } = this.props
    this.state = {
      tags,
      modalOpen: false
    }

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleClearAllClick = this.handleClearAllClick.bind(this)
    this.onFilterButtonClick = this.onFilterButtonClick.bind(this)
    this.onCopyButtonClick = this.onCopyButtonClick.bind(this)
  }

  convertObjectToArray(input) {
    // used to combine all the possible tags into one single array
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

  updateSelectedTags(tags) {
    const { onSelectedFilterChange, availableFilters=[] } = this.props
    const suggestions = this.convertObjectToArray(availableFilters)
    tags.forEach((item, index) => {
      if (!item.type) {
        const suggestion = suggestions.find(element => element.name === item.name)
        if (suggestion) tags[index] = suggestion
      }
    })
    this.setState({ tags: tags })

    onSelectedFilterChange && onSelectedFilterChange(tags)
  }

  handleDelete(i) {
    const { tags } = this.state
    if (tags.length > 0) {
      this.updateSelectedTags(tags.filter((tag, index) => index !== i), true)
    }
  }

  handleAddition(input) {
    const { availableFilters=[] } = this.props
    const { tags } = this.state
    const suggestions = this.convertObjectToArray(availableFilters)
    if (input && input.name && input.name.includes(ARRAY_SPLITTER)) {
      // handle adding multi tags at the same time
      const tempArray = []
      const tagArray = input.name.split(ARRAY_SPLITTER)
      tagArray.forEach(item => {
        const value = item.trim()
        if (!tags.find(n => n.name === value) && !tempArray.find(n => n.name === value)) {
          tempArray.push({name: value, id:value})
        }
      })
      if (tempArray.length > 0) this.updateSelectedTags([...tags, ...tempArray])
    } else {
      if (!input.type) {
        // user can only add a tag which exists in suggestions
        input = suggestions.find(element => element.name === input.name)
      }
      if (!tags.find(n => n.name === input.name)) {
        if (input && !tags.find(n => n.name === input.name)) this.updateSelectedTags([...tags, input], input)
      }
    }
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()
    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)
    this.updateSelectedTags(newTags)
  }

  onCopyButtonClick() {
    const result = window.location.href
    return decodeURIComponent(result)
  }

  onFilterButtonClick() {
    this.handleModalOpen()
  }

  handleClearAllClick() {
    if (this.state.tags.length > 0) {
      this.updateSelectedTags([], true)
    }
  }

  handleModalOpen = () => {
    this.setState({ modalOpen: true })
  }

  handleModalClose = () => {
    this.setState({ modalOpen: false })
  }

  handleModalSubmit = (selections) => {
    // WIP, waiting for Lise to finalize the design
    const { onSelectedFilterChange } = this.props
    this.setState({
      modalOpen: false,
      tags: selections
    })
    onSelectedFilterChange && onSelectedFilterChange(selections)
  }

  render() {
    const { availableFilters=[], hideModalButton } = this.props
    const { tags } = this.state
    const suggestions = this.convertObjectToArray(availableFilters)
    const haveTagSelected = tags.length > 0 ? 'hasTags' : 'noTag'
    return (
      <div className='tagInput-filter'>
        <FilterModal
          selected={tags}
          availableFilters={availableFilters}
          modalOpen={this.state.modalOpen}
          handleModalClose={this.handleModalClose}
          handleModalSubmit={this.handleModalSubmit}
        />
        <div className='tagInput-searchIcon'>
          <Icon
            className='icon--search'
            name='icon--search'
            description={msgs.get('taginput.icon.search', this.context.locale)}
          />
        </div>
        <div className={`tagInput-comboBox tagInput-comboBox__${haveTagSelected}`}>
          <ReactTags
            placeholder={msgs.get('placeholder.filterInput.tags', this.context.locale)}
            tags={tags}
            suggestions={suggestions}
            handleDelete={this.handleDelete}
            handleAddition={this.handleAddition}
            autoresize={true}
            minQueryLength={1}
            allowNew={true}
            tagComponent={FilterTag}
          />
        </div>
        <div className='tagInput-cleanButton'>
          <Icon
            className='icon--close--outline'
            name='icon--close--outline'
            description={msgs.get('taginput.icon.clean', this.context.locale)}
            onClick={this.handleClearAllClick} />
        </div>
        <div className='tagInput-copyButton'>
          <CopyToClipboard text={this.onCopyButtonClick()}>
            <CopyButton className='tagInput-button' />
          </CopyToClipboard>
        </div>
        {!hideModalButton &&
        <div className='tagInput-filterButton'>
          <button type="button" className="tagInput-button"
            onClick={this.onFilterButtonClick}>
            <Icon
              className='icon--filter'
              name='icon--filter'
              description={msgs.get('taginput.icon.filter', this.context.locale)}
            />
          </button>
        </div>
        }
      </div>
    )
  }
}

TagInput.propTypes = {
  availableFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  hideModalButton: PropTypes.bool,
  onSelectedFilterChange: PropTypes.func,
  tags: PropTypes.array,
}

export default TagInput
