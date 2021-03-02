// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { ToggleGroup, ToggleGroupItem } from '@patternfly/react-core'

export const getSelectedId = ({
  location,
  options,
  defaultOption,
  query,
  queryParam = 'resource'
}) => {
  if (!query) {
    query = queryString.parse(location.search)
  }
  const validOptionIds = options.map(o => o.id)
  return validOptionIds.includes(query[queryParam])
    ? query[queryParam]
    : defaultOption
}

const QuerySwitcher = ({
  options,
  defaultOption,
  queryParam = 'resource',
  location,
  history
}) => {
  const query = queryString.parse(location.search)
  const selectedId = getSelectedId({
    query,
    options,
    defaultOption,
    queryParam
  })
  const isSelected = id => id === selectedId
  const handleChange = (_, event) => {
    const id = event.currentTarget.id
    query[queryParam] = id
    const newQueryString = queryString.stringify(query)
    const optionalNewQueryString = newQueryString && `?${newQueryString}`
    history.replace(
      `${location.pathname}${optionalNewQueryString}${location.hash}`,
      { noScrollToTop: true }
    )
  }

  return (
    <ToggleGroup>
      {options.map(({ id, contents }) => (
        <ToggleGroupItem
          key={id}
          buttonId={id}
          isSelected={isSelected(id)}
          onChange={handleChange}
          text={contents}
        />
      ))}
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
