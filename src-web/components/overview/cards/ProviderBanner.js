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
import classNames from 'classnames'
import '../../../../graphics/diagramIcons.svg'
import {getMatchingClusters, BANNER_FILTER} from '../filterHelper'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-providers.scss')
})

export default class ProviderBanner extends React.PureComponent {

  render() {
    const { locale } = this.context
    const { bannerCards=[], view, noncompliantClusterSet, overview: {clusters=[]} } = this.props

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
      activeFilters[BANNER_FILTER] = []
      updateActiveFilters(activeFilters)
    }

    const handleKeyPress = (e) => {
      if ( e.key === 'Enter') {
        onClose()
      }
    }

    // anything not compliant?
    let nonComplaintCnt = 0
    allClusters.forEach(({metadata: {name}})=>{
      if (noncompliantClusterSet.has(name)) {
        nonComplaintCnt++
      }
    })

    const compliantClasses = classNames({
      'provider-cluster-noncompliant': true,
      'non-compliant': nonComplaintCnt>0,
    })

    return (
      <div className='provider-banner'>
        <div className='provider-banner-backlink' tabIndex='0' role={'button'}
          onClick={onClose} onKeyPress={handleKeyPress}>
          {msgs.get('overview.all.providers') + ' /'}
        </div>
        <div className='provider-banner-content'>
          <div className='provider-title'>{allTitles.join(', ')}</div>
          <div className='provider-cluster'>{msgs.get('overview.cluster.count', [allClusters.length], locale)}</div>
          <div className={compliantClasses}>
            <div>
              <svg className='provider-noncompilant-icon'>
                <use href={'#diagramIcons_error'} ></use>
              </svg>
            </div>
            <div>
              {nonComplaintCnt}
            </div>
          </div>
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
        </div>
      </div>
    )
  }
}

ProviderBanner.propTypes = {
  bannerCards: PropTypes.array,
  noncompliantClusterSet: PropTypes.object,
  overview: PropTypes.object,
  view: PropTypes.object,
}
