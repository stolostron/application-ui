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
import GridCard from '../GridCard'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

export default class ProviderCard extends React.PureComponent {

  render() {
    const { locale } = this.context
    const { view, item } = this.props
    const {cardData: {title, include=[], exclude=[]}, overview: {clusters=[]} } = item

    const updateFilters = () => {
      const {updateActiveFilters} = view
      const activeFilters = _.cloneDeep(view.activeFilters)
      const cloudSet = new Set()
      // add this provider's cloud label to filters
      clusters.forEach((cluster)=>{
        const labels = _.get(cluster, 'metadata.labels', {})
        const { cloud='Other'} = labels

        // provider match
        const test = cloud.toLowerCase()
        const cloudMatch = (include.length!==0 && include.indexOf(test)!==-1) ||
               (exclude.length!==0 && exclude.indexOf(test) === -1)
        if (cloudMatch) {
          cloudSet.add(cloud)
        }
      })
      activeFilters['cloud'] = [...cloudSet]
      updateActiveFilters(activeFilters)
    }

    const handleKeyPress = (e) => {
      if ( e.key === 'Enter') {
        updateFilters()
      }
    }

    // gather data
    const typeMap = {}
    const providerClusters = clusters.filter((cluster)=>{
      const labels = _.get(cluster, 'metadata.labels', {})
      const { vendor='Other'} = labels
      let { cloud='Other'} = labels

      // provider match
      cloud = cloud.toLowerCase()

      const cloudMatch = (include.length!==0 && include.indexOf(cloud)!==-1) ||
             (exclude.length!==0 && exclude.indexOf(cloud) === -1)

      // vendor types
      if (cloudMatch) {
        let arr = typeMap[vendor]
        if (!arr) {
          arr = typeMap[vendor] = []
        }
        arr.push(vendor)
      }

      return cloudMatch
    })
    const vendors = Object.keys(typeMap).sort()
    return (
      <GridCard item={item} >
        <div className='provider-card' tabIndex='0' role={'button'} onClick={updateFilters} onKeyPress={handleKeyPress}>
          <div className='provider-title'>
            <div className='provider-name'>{title}</div>
            <div className='provider-cluster'>{msgs.get('overview.cluster.count', [providerClusters.length], locale)}</div>
          </div>
          <div className='provider-counts'>{
            vendors.map(vendor=>{
              const vndCnt = _.padStart(typeMap[vendor].length+'', 2, 0)
              return (
                <div key={vendor} className='provider-count-cell'>
                  <div className='provider-count'>{vndCnt}</div>
                  <div className='provider-type'>{vendor}</div>
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
}
