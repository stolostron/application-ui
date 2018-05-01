/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import { Search } from 'carbon-components-react'
import { debounce } from 'lodash'

const SearchInput = ({
  placeHolderText,
  onChange,
  debounceTimeout = 300,
  labelText,
  ...props
}) => {
  return (
    <Search
      small
      className="searchclass"
      id="search-1"
      labelText={labelText}
      placeHolderText={placeHolderText}
      onChange={({ target: { value: input } }) =>
        debounce(onChange, debounceTimeout)(input)
      }
      {...props}
    />
  )
}

export default SearchInput
