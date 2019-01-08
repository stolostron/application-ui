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
      const fields = this.formatFields(nextProps.availableFilters.allProperties)
      this.setState({
        fieldOptions: this.convertObjectToArray(fields)
      })
    }
    if (nextProps.value === '') {
      this.setState({
        currentQuery: '',
        tags: [],
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: ''
      })
    }
    if (nextProps.value !== '' && !_.isEqual(nextProps.value, this.state.currentQuery)) {
      const tagText = nextProps.value.split(' ')
      const tags = tagText.map((tag) => {
        const semicolonIdx = tag.indexOf(':')
        const field = semicolonIdx > 0 ? tag.substring(0, semicolonIdx) : tag
        const matchText = semicolonIdx > 0 ? tag.substring(semicolonIdx + 1).split(',') : ''
        return {
          id: `id-${field}-tag`,
          key:`key-${field}-tag`,
          classType: semicolonIdx < 1 ? 'keyword' : '',
          name: tag,
          value: tag,
          field: field,
          matchText: matchText
        }
      })
      const field = (tags[tags.length - 1].classType === 'keyword' || _.get(tags[tags.length - 1], 'matchText[0]', '') !== '')
        ? ''
        : tags[tags.length - 1].field
      this.setState({
        currentQuery: nextProps.value,
        searchComplete: field,
        tags: tags
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
        matchText: matchText
      }
      // need to replace the tag with new one
      const tagArray = matchText !== undefined ? tags.slice(0, tags.length - 1) : tags
      this.updateSelectedTags([...tagArray, tag], nextState.currentTag)
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
      this.updateSelectedTags([], {})
      this.setState({
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: ''
      })
    }
  }

  handleDelete(i) {
    const { tags } = this.state
    if (tags.length > 0) {
      if (tags[i].matchText === undefined || tags[i].matchText.length === 0 || tags[i].classType === 'keyword') {
        this.updateSelectedTags(tags.filter((tag, index) => index !== i), {})
        this.setState({
          currentTag: {
            field: '',
            matchText: []
          },
          searchComplete: ''
        })
      }
      if (tags[i].matchText && tags[i].matchText.length > 0) {
        tags[i].matchText.pop()
        const tagText = tags[i].field + ':' + tags[i].matchText.join(',')
        tags[i].name = tagText
        tags[i].value = tagText
        this.updateSelectedTags(tags, {})
        if (tags[i].matchText.length === 0) {
          this.setState({
            currentTag: {
              field: tags[i].field,
              matchText: []
            },
            searchComplete: tags[i].field,
          })
        }
      }
    }
  }

  updateSelectedTags(tags, currentTag) {
    const { onSelectedFilterChange } = this.props
    const { field, matchText } = currentTag

    // This block handles combining two tags with the same filter field
    const lastTag = tags[tags.length - 1]
    if (lastTag && lastTag.matchText && tags.length > 1) {
      let match = false
      // see if any tags have same field
      tags = _.map(tags.slice(0, tags.length - 1), (tag) => {
        if (tag.field === lastTag.field) {
          match = true
          tag.matchText = _.concat(tag.matchText, lastTag.matchText)
          const tagText = tag.field + ':' + tag.matchText.join(',')
          tag.name = tagText
          tag.value = tagText
        }
        return tag
      })
      if (!match) {
        tags.push(lastTag)
      }
    }

    onSelectedFilterChange && onSelectedFilterChange(tags)
    if (field !== '' && matchText !== undefined) {
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
      tags: tags
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
      this.updateSelectedTags([...tags, input], {})
    } else {
      // Adds matchText string
      if (searchComplete) {
        this.setState({
          currentTag: {
            field: searchComplete,
            matchText: _.concat(input.name)
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
      <Query query={GET_SEARCH_COMPLETE} variables={{ property: searchComplete }}>
        {( { data } ) => {
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
                  minQueryLength={0}
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
  value: PropTypes.string,
}

export default SearchBar
