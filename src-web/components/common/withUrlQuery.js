/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { updateResourceFilters, STRING_SPLITTER } from '../../actions/filters'
import { connect } from 'react-redux'
import queryString from 'query-string'

const pageWithUrlQuery = (ChildComponent, resourceType) => {
  // HOC to handle the url query parameters
  // used in TagInput.js
  class PageWithUrlQuery extends React.Component {
    static propTypes = {
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      putParamsFiltersIntoStore: PropTypes.func
    };

    createLocationSearch(queries) {
      // create location search in React router
      // .....？{filters:{clusterLabel:[cloud=IBM]}}
      if (queries.length > 0) {
        const result = {}
        queries.forEach(item => {
          if (item.type) {
            if (!Array.isArray(result[item.type])) {
              result[item.type] = Array.of(item.name)
            } else {
              result[item.type].push(item.name)
            }
          }
        })
        const query = JSON.stringify(result)
        return query
      } else {
        return false
      }
    }

    createURLFilters(inputs) {
      let result = ''
      if (inputs.includes('={') && inputs.includes('}')) {
        const searchFields = inputs
          .replace('},', '}},')
          .toLowerCase()
          .split('},')
        result += '{'
        searchFields.forEach((search, i) => {
          const searchKey = search.substring(0, search.indexOf('='))
          const searchField = search.substring(search.indexOf('=') + 1)
          const searchKeys = searchField.replace(/[{}]/g, '').split(',')
          result += `"${searchKey}":[`
          searchKeys.forEach((searchKey, index) => {
            result += `"${searchKey}"`
            if (index !== searchKeys.length - 1) result += ','
          })
          result += ']}'
          if (i !== searchFields.length - 1) result += ','
        })
      } else {
        result += '{"textsearch":['
        inputs.split(',').forEach(item => {
          result += encodeURIComponent(`"${item.replace('=', ':')}"`)
        })
        result += ']}'
      }
      return result
    }

    updateBrowserURL(inputs) {
      const { history, location } = this.props
      if (inputs.query !== undefined) {
        if (inputs.query === '') {
          history.push(location.pathname)
        } else {
          history.push(
            `${location.pathname}?filters={"textsearch":${encodeURIComponent(
              JSON.stringify(inputs.query)
            )}}`
          )
        }
      } else if (Array.isArray(inputs)) {
        const paramString = this.createLocationSearch(inputs)
        if (history && paramString) {
          // update the URL with filter tags
          history.push(`${location.pathname}?tags=${paramString}`)
        } else if (history) {
          history.push(`${location.pathname}`)
        }
      } else if (typeof inputs === 'string') {
        if (inputs !== '') {
          const filters = this.createURLFilters(inputs)
          history.push(`${location.pathname}?filters=${filters}`)
        } else {
          history.push(`${location.pathname}`)
        }
      }
    }

    constructor(props) {
      super(props)
      this.updateBrowserURL = this.updateBrowserURL.bind(this)
      this.state = {
        firstTimeLoad: true
      }
    }

    componentWillReceiveProps() {
      this.setState({ firstTimeLoad: false })
    }

    convertObjectToFilterArray(object) {
      const tempArray = []
      for (const [type, value] of Object.entries(object)) {
        if (Array.isArray(value)) {
          value.forEach(element => {
            if (element && element.includes(STRING_SPLITTER)) {
              const [key, value] = element.split(STRING_SPLITTER)
              tempArray.push({
                type,
                key,
                value,
                name: element,
                id: element
              })
            }
          })
        }
      }
      return tempArray
    }

    convertClientSideFiltersToString(input) {
      let result = ''
      try {
        const filterJson = JSON.parse(input)
        if (!filterJson.textsearch) {
          Object.entries(filterJson).forEach(([key, value]) => {
            if (result !== '') result += ','
            if (Array.isArray(value)) {
              result += key + '={'
              value.forEach(
                (item, index) =>
                  (result +=
                    item.replace(':', '=') +
                    (index !== value.length - 1 ? ',' : ''))
              )
              result += '}'
            }
          })
        } else {
          result += filterJson.textsearch
        }
      } catch (err) {
        if (!input.includes('{') && !input.includes('}')) return input
      }
      return result
    }

    convertQueryParams() {
      const { location, putParamsFiltersIntoStore } = this.props
      const paramString = queryString.parse(location.search)
      let filters = {}
      try {
        if (paramString.tags) {
          const tags = paramString.tags
          const tagsJson = JSON.parse(tags)
          if (tagsJson && this.state.firstTimeLoad) {
            putParamsFiltersIntoStore(
              this.convertObjectToFilterArray(tagsJson)
            )
          }
        }
        // for client side filtering
        if (paramString.filters) {
          const clientSideFilters = this.convertClientSideFiltersToString(
            paramString.filters
          )
          if (clientSideFilters) {
            filters = { ...filters, clientSideFilters }
          }
        }
      } catch (e) {
        // eslint-disable-next-line
      }
      return filters
    }

    render() {
      // handle multi-purpose query parsing below
      const filters = this.convertQueryParams()
      return (
        <ChildComponent
          {...this.props}
          clientSideFilters={filters.clientSideFilters}
          updateBrowserURL={this.updateBrowserURL}
        />
      )
    }
  }
  const mapDispatchToProps = dispatch => {
    return {
      putParamsFiltersIntoStore: selectedFilters => {
        dispatch(updateResourceFilters(resourceType, selectedFilters))
      }
    }
  }

  return connect(() => ({}), mapDispatchToProps)(PageWithUrlQuery)
}

export default pageWithUrlQuery
