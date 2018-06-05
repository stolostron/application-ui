/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { WithContext as ReactTags } from 'react-tag-input'
import resources from '../../../lib/shared/resources'

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

    //TODO: get data from store
    this.state = {
      tags: [
        { id: 'tag1', text: 'tag1' },
        { id: 'tag2', text: 'tag2' }
      ],
      suggestions: [
        { id: 'tag1', text: 'tag1' },
        { id: 'tag2', text: 'tag2' },
        { id: 'tag3', text: 'tag3' },
        { id: 'tag4', text: 'tag4' },
        { id: 'tag5', text: 'tag5' },
        { id: 'tag6', text: 'tag6' }
      ]
    }
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
  }

  handleDelete(i) {
    const { tags } = this.state
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    })
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

  render() {
    const { tags, suggestions } = this.state
    return (
      <div className='dashboard-comboBox'>
        <ReactTags
          inline
          placeholder="Add new filter tags..."
          tags={tags}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters} />
      </div>
    )
  }
}

export default TagInput
