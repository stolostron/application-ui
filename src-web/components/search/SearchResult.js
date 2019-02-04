/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import config from '../../../lib/shared/config'
import { DataTableSkeleton } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import RelatedResources from './RelatedResources'
import SearchResourceTable from './SearchResourceTable'
import { GET_RELATED_RESOURCES } from '../../apollo-client/queries/SearchQueries'

resources(() => {
  require('../../../scss/search.scss')
})

class SearchResult extends React.PureComponent {
  static propTypes = {
    // TODO: Zack L - Remove keywordPresent prop when they are handled on backend
    keywordPresent: PropTypes.bool,
    loading: PropTypes.bool,
    searchResult: PropTypes.object,
  }
  render() {
    const { keywordPresent, loading, searchResult } = this.props
    const items = (searchResult && Array.isArray(searchResult.items) && searchResult.items) || []
    const relatedResources = (searchResult && searchResult.related) || []
    const uniqueKinds = [...new Set(items.map(item => item.kind))]
    // TODO searchFeature: Order results so Apps and Clusters are first


    if(loading){
      return (
        <div>
          { (config['featureFlags:searchRelated'] && !keywordPresent) ? <RelatedResources loading={true} /> : null }
          <div className={'search--results-view'} >
            <h4>{msgs.get('search.loading', this.context.locale)}</h4>
            <DataTableSkeleton zebra />
          </div>
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
      <Query query={GET_RELATED_RESOURCES}>
        {( { data } ) => {
          return (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              { config['featureFlags:searchRelated'] && !keywordPresent && relatedResources.length > 0 && <RelatedResources relatedResources={relatedResources} selectedKinds={data} />}

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

              {/* TODO: Zack L - need to eventually remove the feature flags */}
              { config['featureFlags:searchRelated'] && !keywordPresent && data && data.relatedResources && data.relatedResources.visibleKinds.map((kind) => (
                <div className={'search--resource-table'} key={`related-resource-${kind}`}>
                  <SearchResourceTable
                    items={_.flatten(relatedResources.filter(resource => {
                      if (resource.kind === kind) return resource.items
                    }).map(resource => resource.items))}
                    key={kind}
                    kind={kind}
                  />
                </div>
              ))}
            </div>
          )
        }}
      </Query>
    )
  }
}

export default SearchResult
