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
import { connect } from 'react-redux'
import queryString from 'query-string'

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
      // .....？{filters:{clusterLabel:[cloud=IBM]}}
      if (queries.length > 0) {
        let result = {}
        queries.forEach((item) => {
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

    updateBrowserURL(tags) {
      const { history, location } = this.props
      const paramString = this.createLocationSearch(tags)
      if (history && paramString) {
        // update the URL with filter tags
        history.push(`${location.pathname}?tags=${paramString}`)
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
      this.setState({firstTimeLoad: false})
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
      const uri_dec = decodeURIComponent(location.search)
      const paramString = queryString.parse(uri_dec)
      try {
        const tags = paramString.tags
        if (tags) {
          const result = JSON.parse(tags)
          if (result && this.state.firstTimeLoad) {
            putParamsFiltersIntoStore(this.convertObjectToFilterArray(result))
          }
        }
      } catch(e) {
        // eslint-disable-next-line
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
