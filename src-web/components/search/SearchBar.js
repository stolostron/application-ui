/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import _ from 'lodash'
import PropTypes from 'prop-types'
import ReactTags from 'react-tag-autocomplete'
import { Query } from 'react-apollo'
import resources from '../../../lib/shared/resources'
import { Icon } from 'carbon-components-react'
import msgs from '../../../nls/platform.properties'
import FilterTag from '../common/FilterTag'
import { GET_SEARCH_COMPLETE } from '../../apollo-client/queries/SearchQueries'

// https://github.com/i-like-robots/react-tags
// third part library for tag input
resources(() => {
  require('../../../scss/reactTag.scss')
})

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    const { tags =[] } = this.props
    this.state = {
      currentQuery: '',
      currentTag: {
        field: '',
        matchText: []
      },
      searchComplete: '',
      tags, // tags can be used for the filter popup modal
      fieldOptions: []
    }
    this.matchTextOptions = []

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleClearAllClick = this.handleClearAllClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.availableFilters, this.state.fieldOptions)) {
      const fields = this.formatFields(nextProps.availableFilters.allFields)
      this.setState({
        fieldOptions: this.convertObjectToArray(fields)
      })
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (!_.isEqual(nextState.currentQuery, this.state.currentQuery)) {
      this.props.onChange(nextState.currentQuery)
    }
    if (!_.isEqual(nextState.currentTag, this.state.currentTag)
      && nextState.currentTag.field !== '') {
      // create new tag and add it to array
      const { currentTag: { field, matchText }, tags } = nextState
      const value = matchText !== undefined ? matchText : ''
      const tagText = field + ':' + value
      const tag = {
        id: `id-${field}-tag`,
        key:`key-${field}-tag`,
        name: tagText,
        value: tagText,
        field: field,
        matchText: value
      }
      // need to replace the tag with new one
      const tagArray = matchText !== undefined ? tags.slice(0, tags.length - 1) : tags
      this.updateSelectedTags([...tagArray, tag], tag)
    }
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

  formatFields(data) {
    return data.map(field => {
      return {
        id: `id-${field}`,
        key:`key-${field}`,
        name: field,
        value: field
      }
    })
  }

  formatSuggestionOptions(data) {
    this.matchTextOptions = this.convertObjectToArray(
      data.map(item => {
        return {
          id: `id-${item}`,
          key:`key-${item}`,
          name: item,
          value: item
        }
      }))
  }


  handleClearAllClick() {
    if (this.state.tags.length > 0) {
      this.updateSelectedTags([], true)
      this.setState({
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: ''
      })
    }
    this.props.onChange('')
  }

  // TODO: TODO this should edit the tag text NOT delete the entire tag...
  handleDelete(i) {
    const { tags } = this.state
    if (tags.length === 1) {
      this.props.onChange('')
    }
    if (tags.length > 0) {
      this.updateSelectedTags(tags.filter((tag, index) => index !== i), true)
      this.setState({
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: ''
      })
    }
  }

  updateSelectedTags(tags) {
    const { onSelectedFilterChange } = this.props
    const { currentTag: { field } } = this.state

    // This block handles combining two tags with the same filter field
    const lastTag = tags[tags.length - 1]
    if (lastTag && lastTag.matchText && tags.length > 1) {
      let match = false
      // see if any tags have same field
      tags = _.map(tags.slice(0, tags.length - 1), (tag) => {
        if (tag.field === lastTag.field) {
          match = true
          tag.name = tag.name + ', ' + lastTag.matchText
          tag.value = tag.value + ',' + lastTag.matchText
          tag.matchText = tag.matchText + ',' + lastTag.matchText
        }
        return tag
      })
      if (!match) {
        tags.push(lastTag)
      }
    }

    onSelectedFilterChange && onSelectedFilterChange(tags)
    if (field !== '') {
      this.setState({
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: ''
      })
    }
    this.setState({
      currentQuery: tags.map(tag => {return tag.value}).join(' '),
      tags: tags,
    })
  }

  handleAddition(input) {
    const {
      fieldOptions,
      searchComplete,
      tags
    } = this.state

    if (!searchComplete && !input.id) { // Adds keyword tag
      input.classType = 'keyword'
      input.value = input.name
      this.updateSelectedTags([...tags, input], input)
    } else {
      // Adds matchText string
      if (searchComplete) {
        this.setState({
          currentTag: {
            field: searchComplete,
            matchText: input.name
          }
        })
      } else {
        // Adds field if name matches available option (name, status, etc.) otherwise keyword
        input = fieldOptions.find(element => element.name === input.name)
        if (input) {
          this.setState({
            currentTag: {
              field: input.name
            },
            searchComplete: input.name
          })
        }
      }
    }
  }

  render() {
    const {
      searchComplete = '',
      tags,
      fieldOptions
    } = this.state

    return (
      <Query query={GET_SEARCH_COMPLETE} variables={{ property: '' }}>
        {( { data } ) => {
          console.log('Search complete data:', data) // eslint-disable-line
          if (data.searchComplete) this.formatSuggestionOptions(data.searchComplete)
          return (
            <div className='tagInput-filter'>
              <div className='tagInput-searchIcon'>
                <Icon
                  className='icon--search'
                  name='icon--search'
                  description={msgs.get('taginput.icon.search', this.context.locale)}
                />
              </div>
              <div className={'tagInput-comboBox'}>
                <ReactTags
                  placeholder={msgs.get('searchbar.searchofferings', this.context.locale)}
                  tags={tags}
                  suggestions={searchComplete !== '' ? this.matchTextOptions : fieldOptions}
                  handleDelete={this.handleDelete}
                  handleAddition={this.handleAddition}
                  autoresize={true}
                  minQueryLength={1}
                  allowNew={true}
                  tagComponent={FilterTag}
                  delimiterChars={[' ', ':', ',']}
                  // maxSuggestionsLength={} defaulted to 6
                />
              </div>
              <div className='tagInput-cleanButton'>
                <Icon
                  className='icon--close--outline'
                  name='icon--close--outline'
                  description={msgs.get('taginput.icon.clean', this.context.locale)}
                  onClick={this.handleClearAllClick} />
              </div>
            </div>
          )
        }}
      </Query>
    )
  }
}

SearchBar.propTypes = {
  availableFilters: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  onChange: PropTypes.func,
  onSelectedFilterChange: PropTypes.func, // TODO - used to update the url..
  tags: PropTypes.array,
  // value: PropTypes.string,
}

export default SearchBar
