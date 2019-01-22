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
import msgs from '../../../nls/platform.properties'
// import RelatedResources from './RelatedResources'
import SearchResourceTable from './SearchResourceTable'

resources(() => {
  require('../../../scss/search.scss')
})

class SearchResult extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    searchResult: PropTypes.object,
  }
  render() {
    const { loading, searchResult } = this.props
    const items = (searchResult && Array.isArray(searchResult.items) && searchResult.items) || []
    // const relatedResources = (searchResult && searchResult.relatedResources) || []
    const uniqueKinds = [...new Set(items.map(item => item.kind))]
    // TODO searchFeature: Order results so Apps and Clusters are first


    if(loading){
      return (
        // <RelatedResources loading={true} />
        <div className={'search--results-view'} >
          <h4>{msgs.get('search.loading', this.context.locale)}</h4>
          <DataTableSkeleton zebra />
        </div>
      )
    }
    if (items.length === 0) {
      return (
        <div className={'search--results-view'} >
          <p>{msgs.get('search.noresults', this.context.locale)}</p>
        </div>
      )
    }

    return (
      <div>
        {/* <RelatedResources relatedResources={relatedResources} /> */}

        { uniqueKinds.map((kind) => (
          <div className={'search--resource-table'} key={kind}>
            <SearchResourceTable
              items={items.filter(item => item.kind === kind || item.__type === kind )}
              expandFullPage={uniqueKinds.length === 1}
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
