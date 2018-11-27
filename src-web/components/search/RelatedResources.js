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
import resources from '../../../lib/shared/resources'
// import { ClickableTile } from 'carbon-components-react'
import RelatedResourceTile from './RelatedResourceTile'

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
  }

  render() {
    const { loading, relatedResources } = this.props

    if (relatedResources){
      return (
        <div className='search--related-results'>
          {relatedResources && relatedResources.map(r =>
            (<RelatedResourceTile
              key={r.kind}
              kind={r.kind}
              count={r.count}
              loading={loading}
            />)
          )}
        </div>
      )
    }
    return(
      <div className='search--related-results'>
        <RelatedResourceTile
          loading={loading}
        />
        <RelatedResourceTile
          loading={loading}
        />
      </div>
    )
  }
}

export default RelatedResources
