// Copyright (c) 2020 Red Hat, Inc.
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import {
  ToggleGroup,
  ToggleGroupItem
} from '@patternfly/react-core'


const QuerySwitcher = ({ options, defaultOption, queryParam='resource', location, history }) => {
  const query = queryString.parse(location.search)
  const validOptionIds = options.map(o => o.id)
  const isSelected = id => validOptionIds.includes(query[queryParam]) ? query[queryParam] === id : defaultOption === id
  const handleChange = (_, event) => {
    const id = event.currentTarget.id
    query[queryParam] = id
    const newQueryString = queryString.stringify(query)
    history.replace(`${location.pathname}${newQueryString && `?${newQueryString}`}${location.hash}`)
  }

  return (
    <ToggleGroup variant="light">
      {
        options.map(({ id, contents }) => (
          <ToggleGroupItem key={id} buttonId={id} isSelected={isSelected(id)} onChange={handleChange}>
            { contents }
          </ToggleGroupItem>
        ))
      }
    </ToggleGroup>
  )
}

QuerySwitcher.propTypes = {
  defaultOption: PropTypes.string,
  history: PropTypes.object,
  location: PropTypes.object,
  options: PropTypes.array,
  queryParam: PropTypes.string
}

export default withRouter(QuerySwitcher)
