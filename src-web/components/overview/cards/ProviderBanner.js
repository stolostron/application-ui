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
import { Icon, Tag } from 'carbon-components-react'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

export default class ProviderBanner extends React.PureComponent {

  render() {
    const { locale } = this.context
    const { bannerCards, view, overview: {clusters=[]} } = this.props

    // gather data
    const typeMap = {}
    let allClusters = []
    const allTitles = []
    bannerCards.forEach(({title, include=[], exclude=[]})=>{
      allTitles.push(title)
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
      allClusters = [...allClusters, ...providerClusters]
    })

    const vendors = Object.keys(typeMap).sort()

    // unfilter all providers
    const onClose = () =>{
      const {updateActiveFilters} = view
      const activeFilters = _.cloneDeep(view.activeFilters)
      activeFilters['cloud'] = []
      updateActiveFilters(activeFilters)
    }

    return (
      <div className='provider-banner'>
        <div className='provider-title'>{allTitles.join(', ')}</div>
        <div className='provider-cluster'>{msgs.get('overview.count.cluster', [allClusters.length], locale)}</div>
        <div className='provider-counts'>{
          vendors.map(vendor=>{
            const vndCnt = typeMap[vendor].length
            return (
              <div key={vendor} className='provider-count-cell'>
                <div className='provider-count'>{vndCnt}</div>
                <div className='provider-type'>{vendor}</div>
              </div>
            )
          })
        }</div>
        <Tag type='custom'>
          <Icon
            className='closeIcon'
            description={msgs.get('filter.remove.tag', locale)}
            name="icon--close"
            onClick={onClose}
          />
        </Tag>
      </div>
    )
  }
}

ProviderBanner.propTypes = {
  bannerCards: PropTypes.array,
  overview: PropTypes.object,
  view: PropTypes.object,
}
