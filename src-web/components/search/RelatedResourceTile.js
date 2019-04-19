/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2018, 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { /*Icon, */ SelectableTile, SkeletonText } from 'carbon-components-react'
import { formatNumber } from '../../../lib/client/search-helper'
import msgs from '../../../nls/platform.properties'
import '../../../graphics/diagramShapes.svg'
import '../../../scss/related-resources-tile.scss'

class RelatedResourceTile extends React.PureComponent {
  static propTypes = {
    count: PropTypes.number,
    handleClick: PropTypes.func,
    kind: PropTypes.string,
    loading: PropTypes.bool,
    selected: PropTypes.bool,
  }

  static contextTypes = {
    locale: PropTypes.string
  }

  // iconType(kind) {
  //   switch (kind.toLowerCase()) {
  //   case 'application':
  //   case 'applications':
  //     return 'app-services'
  //   case 'cluster':
  //   case 'clusters':
  //     return 'app-services'
  //   case 'deployment':
  //   case 'deployments':
  //     return 'launch'
  //   case 'pod':
  //   case 'pods':
  //     return 'network'
  //   case 'service':
  //   case 'services':
  //     return 'services'
  //   default:
  //     return 'app-services'
  //   }
  // }

  render() {
    const { count, handleClick, kind, loading, selected } = this.props
    const { locale } = this.context
    return loading
      ? <SelectableTile >
        <div className='related-resource-tile-loading'>
          <SkeletonText />
          <SkeletonText />
        </div>
      </SelectableTile>
      : <SelectableTile
        id={`related-resource-${kind}`}
        selected={selected}
        handleClick={count > 0 ? () => handleClick(kind) : () => {}}
        defaultChecked={false}
        tabIndex={0} >
        <div className='related-resource-tile'>
          {/* <Icon
            id={`${kind}-icon`}
            name={`icon--${this.iconType(kind)}`} /> */}
          <div className='related-resource-tile content'>
            <div className='related-resource-tile count'>{formatNumber(count)}</div>
            <div className='related-resource-tile text'>{msgs.get('related.tile.text', [kind], locale)}</div>
          </div>
        </div>
      </SelectableTile>
  }
}

export default RelatedResourceTile
