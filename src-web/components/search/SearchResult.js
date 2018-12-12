/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { DataTableSkeleton } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import RelatedResources from './RelatedResources'
import SearchResourceTable from './SearchResourceTable'

resources(() => {
  require('../../../scss/search.scss')
})

class SearchResult extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    searchResult: PropTypes.object, // TODO searchFeature, add shape
  }
  render() {
    const { loading, searchResult } = this.props
    const items = (searchResult && Array.isArray(searchResult.items) && searchResult.items) || []
    const relatedResources = (searchResult && searchResult.relatedResources) || []
    const uniqueKinds = [...new Set(items.map(item => item.kind))]
    // TODO searchFeature: Order results so Apps and Clusters are first


    if(loading){
      return (
        <div >
          <RelatedResources loading={true} />
          <div className={'search--resource-table'} >
            <h4>loading...</h4> {/* TODO searchFeature: Finalize text, translate. */}
            <DataTableSkeleton zebra />
          </div>
        </div>
      )
    }

    return (
      <div>
        <RelatedResources relatedResources={relatedResources} />

        { uniqueKinds.map((kind) => (
          <div className={'search--resource-table'} key={kind}>
            <SearchResourceTable
              items={items.filter(item => item.kind === kind || item.__type === kind )}
              key={kind}
              kind={kind}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default SearchResult
