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
import { updateResourceFilters, STRING_SPLITTER } from '../../actions/filters'
import {connect} from 'react-redux'

const pageWithUrlQuery = (ChildComponent, resourceType) => {
// HOC to handle the url query parameters
// used in TagInput.js
  class PageWithUrlQuery extends React.Component {
    static propTypes = {
      history: PropTypes.object.isRequired,
      location: PropTypes.object.isRequired,
      putParamsFiltersIntoStore: PropTypes.func,
    }

    createLocationSearch(queries) {
      // create location search in React router
      // .....?tag1=value1&tag2=value2
      let result = {filters:{}}
      queries.forEach((item) => {
        if (item.type) {
          if (!Array.isArray(result.filters[item.type])) {
            result.filters[item.type] = Array.of(item.name)
          } else {
            result.filters[item.type].push(item.name)
          }
        }
      })
      const query = JSON.stringify(result)
      return query
    }

    updateBrowserURL(tags) {
      const { history, location } = this.props
      if (history) {
        // update the URL with filter tags
        history.push(`${location.pathname}?${this.createLocationSearch(tags)}`)
      }
    }

    constructor(props) {
      super(props)
      this.updateBrowserURL = this.updateBrowserURL.bind(this)
    }

    convertObjectToFilterArray(object) {
      const tempArray = []
      for (let [type, value] of Object.entries(object)) {
        if ( Array.isArray(value) ) {
          value.forEach(element => {
            if (element && element.includes(STRING_SPLITTER)) {
              const [key, value] = element.split(STRING_SPLITTER)
              tempArray.push({
                type,
                key,
                value,
                name: element,
                id: element,
              })
            }
          })
        }
      }
      return tempArray
    }

    convertQueryParams() {
      const { location, putParamsFiltersIntoStore } = this.props
      let uri_dec = decodeURIComponent(location.search)
      uri_dec = uri_dec.startsWith('?', 0) ? uri_dec.substring(1) : uri_dec
      try {
        const result = JSON.parse(uri_dec)
        // handle query filters
        if (result && result.filters) {
          putParamsFiltersIntoStore(this.convertObjectToFilterArray(result.filters))
        }
      } catch(e) {
        // eslint-disable-next-line
        console.log(e)
      }
    }

    render() {
      // handle multi-purpose query parsing below
      this.convertQueryParams()
      return (
        <ChildComponent
          {...this.props}
          updateBrowserURL={this.updateBrowserURL}
        />
      )
    }
  }
  const mapDispatchToProps = (dispatch) => {
    return {
      putParamsFiltersIntoStore: (selectedFilters) => {
        dispatch(updateResourceFilters(resourceType, selectedFilters))
      }
    }
  }

  return connect(() => ({}), mapDispatchToProps)(PageWithUrlQuery)
}


export default pageWithUrlQuery
