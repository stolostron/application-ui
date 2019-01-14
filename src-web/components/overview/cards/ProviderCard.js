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
import resources from '../../../../lib/shared/resources'
import {getMatchingClusters, PROVIDER_FILTER} from '../filterHelper'
import GridCard from '../GridCard'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-providers.scss')
})

export default class ProviderCard extends React.PureComponent {

  render() {
    const { locale } = this.context
    const { view, item, width } = this.props
    const {cardData: {title, includes=[]}, overview: {clusters=[]} } = item

    // add this provider's cloud label to active filters
    const updateFilters = () => {
      const {updateActiveFilters} = view
      const activeFilters = _.cloneDeep(view.activeFilters)
      activeFilters[PROVIDER_FILTER] = [{title, includes: includes.slice()}]
      updateActiveFilters(activeFilters)
    }

    const handleKeyPress = (e) => {
      if ( e.key === 'Enter') {
        updateFilters()
      }
    }

    // gather data
    const {matchingClusters, kubeMap, kubeTypes} = getMatchingClusters(clusters, includes)

    return (
      <GridCard item={item} >
        <div className='provider-card' style={{width}}
          tabIndex='0' role={'button'} onClick={updateFilters} onKeyPress={handleKeyPress}>
          <div className='provider-title'>
            <div className='provider-name'>{title}</div>
            <div className='provider-cluster'>{msgs.get('overview.cluster.count', [matchingClusters.length], locale)}</div>
          </div>
          <div className='provider-counts'>{
            kubeTypes.map(kubeType=>{
              const kubeCnt = _.padStart(kubeMap[kubeType].length+'', 2, 0)
              return (
                <div key={kubeType} className='provider-count-cell'>
                  <div className='provider-count'>{kubeCnt}</div>
                  <div className='provider-type'>{kubeType}</div>
                </div>
              )
            })
          }</div>
        </div>
      </GridCard>
    )
  }
}

ProviderCard.propTypes = {
  item: PropTypes.object,
  view: PropTypes.object,
  width: PropTypes.number,
}
