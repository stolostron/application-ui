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
  }

  render() {
    const { loading } = this.props
    return (
      <div className='search--related-results'>
        <RelatedResourceTile
          kind='applications'
          count={3}
          loading={loading}
        />
        <RelatedResourceTile
          kind='pods'
          count={1583}
          loading={loading}
        />
        <RelatedResourceTile
          kind='deployments'
          count={13}
          loading={loading}
        />
        <RelatedResourceTile
          kind='services'
          count={5}
          loading={loading}
        />
      </div>
    )
  }
}

export default RelatedResources
