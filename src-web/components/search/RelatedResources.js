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
import { Query } from 'react-apollo'
import resources from '../../../lib/shared/resources'
import RelatedResourceTile from './RelatedResourceTile'
import { GET_RELATED_RESOURCES } from '../../apollo-client/queries/SearchQueries'

resources(() => {
  require('../../../scss/search.scss')
})

class RelatedResources extends React.PureComponent {
  static propTypes = {
    loading: PropTypes.bool,
    relatedResources: PropTypes.arrayOf(PropTypes.shape({
      kind: PropTypes.string,
      count: PropTypes.number,
    })),
    selectedKinds: PropTypes.object
  }

  render() {
    const { loading, relatedResources, selectedKinds } = this.props

    if (relatedResources){
      return (
        <Query query={GET_RELATED_RESOURCES}>
          {( { data, client } ) => {
            return (
              <div className='search--related-results'>
                {relatedResources && relatedResources.map(r => (
                  <RelatedResourceTile
                    key={r.kind}
                    kind={r.kind}
                    count={r.count}
                    selected={selectedKinds && selectedKinds.relatedResources && selectedKinds.relatedResources.visibleKinds.findIndex(kind => kind === r.kind) >= 0}
                    loading={loading}
                    handleClick={(kind) => {
                      const kinds = data && data.relatedResources && data.relatedResources.visibleKinds
                      const idx = kinds && kinds.findIndex(resource => resource === kind)
                      if (kinds && idx >= 0) {
                        kinds.splice(idx, 1)
                      } else if (kinds && idx === -1){
                        kinds.push(kind)
                      }
                      client.writeData({ data: {
                        relatedResources: {
                          __typename: 'RelatedResources', // TODO searchFeature: define schema
                          visibleKinds: kinds
                        }
                      }} )
                    }}
                  />
                ))}
              </div>
            )
          }}
        </Query>
      )
    }
    return(
      <div style={{display: 'flex'}}>
        <RelatedResourceTile
          loading={loading}
        />
        <div className={'spacer'} />
        <RelatedResourceTile
          loading={loading}
        />
        <div className={'spacer'} />
        <RelatedResourceTile
          loading={loading}
        />
      </div>
    )
  }
}

export default RelatedResources
