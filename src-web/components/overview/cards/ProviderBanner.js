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
import { Icon, Tag } from 'carbon-components-react'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-providers.scss')
})

export default class ProviderBanner extends React.PureComponent {

  render() {
    const { locale } = this.context
    const { bannerCards=[], view, overview: {clusters=[]} } = this.props

    // gather data
    const allKubeMap = {}
    let allClusters = []
    let allKubeTypes = []
    const allTitles = []
    bannerCards.forEach(({title, includes=[]})=>{
      allTitles.push(title)
      const {matchingClusters, kubeMap, kubeTypes} = getMatchingClusters(clusters, includes)
      allClusters = [...allClusters, ...matchingClusters]
      allKubeTypes = [...allKubeTypes, ...kubeTypes]
      Object.keys(kubeMap).forEach(key=>{
        if (allKubeMap[key]) {
          allKubeMap[key] = allKubeMap[key] + kubeMap[key]
        } else {
          allKubeMap[key] = kubeMap[key]
        }
      })
    })

    // unfilter all providers
    const onClose = () =>{
      const {updateActiveFilters} = view
      const activeFilters = _.cloneDeep(view.activeFilters)
      activeFilters[PROVIDER_FILTER] = []
      updateActiveFilters(activeFilters)
    }

    return (
      <div className='provider-banner'>
        <div className='provider-title'>{allTitles.join(', ')}</div>
        <div className='provider-cluster'>{msgs.get('overview.cluster.count', [allClusters.length], locale)}</div>
        <div className='provider-counts'>{
          allKubeTypes.map(kubeType=>{
            const kubeCnt = allKubeMap[kubeType].length
            return (
              <div key={kubeType} className='provider-count-cell'>
                <div className='provider-count'>{kubeCnt}</div>
                <div className='provider-type'>{kubeType}</div>
              </div>
            )
          })
        }</div>
        <Tag type='custom' className='provider-banner-close' onClick={onClose}>
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
