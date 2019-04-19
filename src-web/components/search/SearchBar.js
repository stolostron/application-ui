/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
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
import { convertStringToQuery } from '../../../lib/client/search-helper'

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
      tags,
      fieldOptions: [],
      chosenOperator: null
    }
    this.matchTextOptions = []
    this.operators = ['=', '<', '>', '<=', '>=', '!=', '!']

    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleClearAllClick = this.handleClearAllClick.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(nextProps.availableFilters, this.state.fieldOptions)) {
      const fields = this.formatFields(nextProps.availableFilters.allProperties)
      const labelTag = {
        id: 'id-filter-label',
        key:'key-filter-label',
        name: msgs.get('searchbar.filters.label', this.context.locale),
        value: msgs.get('searchbar.filters.label', this.context.locale),
        disabled: true
      }
      this.setState({
        fieldOptions: this.convertObjectToArray(fields, labelTag)
      })
    }
    if ((nextProps.value === '' && nextProps.clientSideFilters !== undefined)
    || (nextProps.value !== '' && !_.isEqual(nextProps.clientSideFilters, this.props.clientSideFilters))) {
      nextProps.onChange(nextProps.clientSideFilters || '')
    } else if (nextProps.value === '') {
      this.setState({
        currentQuery: '',
        tags: [],
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: ''
      })
    } else if (nextProps.value !== '' && !_.isEqual(nextProps.value, this.state.currentQuery)) {
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
      const currentOperator = this.operators[this.operators.findIndex(op => op === tags[tags.length - 1].matchText[0])] || null
      const field = ((tags[tags.length - 1].classType === 'keyword' || _.get(tags[tags.length - 1], 'matchText[0]', '') !== '') && currentOperator === null)
        ? ''
        : tags[tags.length - 1].field
      this.setState({
        currentQuery: nextProps.value,
        searchComplete: field,
        tags: tags,
        chosenOperator: currentOperator || null
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(nextProps.clientSideFilters, nextState.currentQuery) ||
      !_.isEqual(nextProps.availableFilters, nextState.fieldOptions)
  }

  componentWillUpdate(nextProps, nextState) {
    const { onChange, updateBrowserURL } = this.props
    if (!_.isEqual(nextState.currentQuery, this.state.currentQuery)) {
      onChange(nextState.currentQuery)
      if (nextState.currentQuery.length > this.state.currentQuery.length) {
        updateBrowserURL({query: nextState.currentQuery})
      }
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

  convertObjectToArray(input, label) {
    if (Array.isArray(input)) {
      input.unshift(label)
      return input
    } else {
      let result = [label]
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
    const { chosenOperator, fieldOptions, searchComplete, tags } = this.state
    const labelTag = {
      id: 'id-filter-label',
      key:'key-filter-label',
      name: msgs.get('searchbar.values.label', [searchComplete], this.context.locale),
      value: msgs.get('searchbar.values.label', [searchComplete], this.context.locale),
      disabled: true
    }
    if (searchComplete !== '' && data && data.searchComplete) {
      // Filter out previously used labels
      if (tags.length > 1) {
        const kindTag = tags.slice(0, tags.length - 1).filter(tag => tag.field === searchComplete)
        if (kindTag.length > 0) {
          data.searchComplete = data.searchComplete.filter(value => kindTag[0].matchText.findIndex(item => item === value) === -1)
        }
      }
      if (data.searchComplete.length === 0) {
        return [{
          id: 'id-no-results',
          name: msgs.get('searchbar.no.suggestions', this.context.locale),
          disabled: true
        }]
      } else {
        if (data.searchComplete[0] === 'isNumber') {
          if (chosenOperator !== null) {
            const rangeText = data.searchComplete.length > 2
              ? msgs.get('searchbar.operator.range', [parseInt(data.searchComplete[1], 10), parseInt(data.searchComplete[2], 10)], this.context.locale)
              : msgs.get('searchbar.operator.range', [parseInt(data.searchComplete[1], 10), parseInt(data.searchComplete[1], 10)], this.context.locale)
            return [
              labelTag,
              {
                id: 'id-values-range',
                key:'key-values-range',
                name: rangeText,
                value: rangeText,
                disabled: true
              }
            ]
          }
          return this.operators.map(operator => {
            return {
              id: `id-operators-${operator}`,
              key:`key-operators-${operator}`,
              name: operator,
              value: operator
            }
          })
        } else if (data.searchComplete[0] === 'isDate') {
          const dateOptions = ['hour', 'day', 'week', 'month', 'year']
          return this.convertObjectToArray(
            dateOptions.map(date => {
              return {
                id: `id-date-${date}`,
                key:`key-date-${date}`,
                name: date,
                value: date
              }
            }),
            {
              id: 'id-filter-label',
              key:'key-filter-label',
              name: msgs.get('searchbar.operator.dateSort', [searchComplete], this.context.locale),
              value: msgs.get('searchbar.operator.dateSort', [searchComplete], this.context.locale),
              disabled: true
            }
          )
        }
        return this.convertObjectToArray(
          data.searchComplete.map(item => {
            return {
              id: `id-${item}`,
              key:`key-${item}`,
              name: item,
              value: item
            }
          }),
          labelTag
        )
      }
    } else {
      return fieldOptions
    }
  }

  handleClearAllClick() {
    if (this.state.tags.length > 0) {
      this.updateSelectedTags([], {})
      this.setState({
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: '',
        chosenOperator: null
      })
    }
    this.props.updateBrowserURL('')
  }

  handleDelete(i) {
    const { tags, searchComplete } = this.state
    if (tags.length > 0) {
      if (tags[i].matchText === undefined || (tags[i].matchText && tags[i].matchText.length <= 1) || tags[i].classType === 'keyword') {
        const newTags = tags.filter((tag, index) => index !== i)
        const newQuery = newTags.map(tag => {return tag.value}).join(' ')
        this.updateSelectedTags(newTags, {})
        this.props.updateBrowserURL({query: newQuery})
        this.setState({
          currentQuery: newQuery
        })
        if (i !== tags.length - 1) {
          this.setState({
            searchComplete: searchComplete
          })
        } else {
          this.setState({
            currentTag: {
              field: '',
              matchText: []
            },
            searchComplete: '',
            chosenOperator: null
          })
        }
      } else if (tags[i].matchText && tags[i].matchText.length > 1) {
        tags[i].matchText.pop()
        const tagText = tags[i].field + ':' + tags[i].matchText.join(',')
        tags[i].name = tagText
        tags[i].value = tagText
        this.updateSelectedTags(tags, {})
        this.props.updateBrowserURL({query: tags.map(tag => {return tag.value}).join(' ')})
      }
    }
  }

  updateSelectedTags(tags, currentTag) {
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
    if (field !== '' && matchText !== undefined && this.operators.findIndex(op => op === matchText[0]) === -1) {
      this.setState({
        currentTag: {
          field: '',
          matchText: []
        },
        searchComplete: '',
        chosenOperator: null
      })
    }

    // Checks if the user has entered a space and deletes the newly created tag
    if (tags.length > 0 && (tags[tags.length - 1].name === '' || tags[tags.length - 1].name.charAt(0) === ' ')) {
      tags = tags.slice(0, tags.length - 1)
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
      tags,
      chosenOperator
    } = this.state

    if (!searchComplete && !input.id) { // Adds keyword tag
      input.classType = 'keyword'
      input.value = input.name
      this.updateSelectedTags([...tags, input], {})
    } else {
      // Adds matchText string
      if (searchComplete && input.name && this.operators.findIndex(op => op === input.name) > -1) {
        this.setState({
          chosenOperator: input,
          currentTag: {
            field: searchComplete,
            matchText: _.concat(input.name)
          }
        })
      } else if (searchComplete) {
        this.setState({
          currentTag: {
            field: searchComplete,
            matchText: chosenOperator === null ? _.concat(input.name) : _.concat(chosenOperator.name + input.name)
          },
          chosenOperator: null
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
      currentQuery,
      searchComplete = '',
      tags
    } = this.state

    let query = {keywords: [], filters: []}
    if (searchComplete !== '') {
      query = convertStringToQuery(currentQuery)
      query.filters = query.filters.filter((filter) => {
        return filter.property !== searchComplete
      })
    }

    return (
      <Query query={GET_SEARCH_COMPLETE} variables={{ property: searchComplete, query }}>
        {( { data, loading } ) => {
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
                  placeholder={currentQuery ? '' : msgs.get('searchbar.searchofferings', this.context.locale)}
                  tags={tags}
                  suggestions={loading !== true
                    ? this.formatSuggestionOptions(data)
                    : [{id: 'loading', name: msgs.get('resource.loading', this.context.locale), disabled: true}]}
                  handleDelete={this.handleDelete}
                  handleAddition={this.handleAddition}
                  autoresize={true}
                  minQueryLength={0}
                  allowNew={true}
                  tagComponent={FilterTag}
                  delimiterChars={[' ', ':', ',']}
                  autofocus={false}
                  maxSuggestionsLength={7}
                />
              </div>
              {currentQuery === ''
                ? null
                : <div className='tagInput-cleanButton'>
                  <Icon
                    className='icon--close--outline'
                    name='icon--close--outline'
                    description={msgs.get('taginput.icon.clear', this.context.locale)}
                    onClick={this.handleClearAllClick} />
                </div>
              }
              <div className='tagInput-infoButton'>
                <Icon
                  className='icon--info--outline'
                  name='icon--info--outline'
                  description={msgs.get('taginput.icon.info', this.context.locale)}
                  onClick={this.props.handleInfoButtonClick} />
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
  clientSideFilters: PropTypes.string,
  handleInfoButtonClick: PropTypes.func,
  onChange: PropTypes.func,
  tags: PropTypes.array,
  updateBrowserURL: PropTypes.func,
  value: PropTypes.string,
}

export default SearchBar
