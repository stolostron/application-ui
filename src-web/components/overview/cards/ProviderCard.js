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
import classNames from 'classnames'
import resources from '../../../../lib/shared/resources'
import '../../../../graphics/diagramIcons.svg'
import {getMatchingClusters, BANNER_FILTER} from '../filterHelper'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-providers.scss')
})

export default class ProviderCard extends React.Component {

  render() {
    const { locale } = this.context
    const { view, item, conditionFilterSets: {noncompliantClusterSet} } = this.props
    const {cardData: {title, includes=[]}, overview: {clusters=[]} } = item

    // add this provider's cloud label to active filters
    const updateFilters = () => {
      const {updateFilters} = view
      const activeFilters = _.cloneDeep(view.activeFilters)
      activeFilters[BANNER_FILTER] = [{title, includes: includes.slice()}]
      updateFilters(activeFilters)
    }

    const handleKeyPress = (e) => {
      if ( e.key === 'Enter') {
        updateFilters()
      }
    }

    // gather data
    const {matchingClusters, kubeMap, kubeTypes} = getMatchingClusters(clusters, includes)
    const otherTypes = []
    const otherMsg = msgs.get('overview.other.type', locale)
    kubeMap[otherMsg] = []
    const filteredKubeTypes = kubeTypes.filter(kubeType=>{
      if (kubeType.length>5) {
        kubeMap[otherMsg] = [...kubeMap[otherMsg], kubeMap[kubeType]]
        otherTypes.push(kubeType)
        return false
      }
      return true
    })
    let otherIdx=-1
    if (otherTypes.length>0) {
      filteredKubeTypes.push(otherMsg)
      otherIdx = filteredKubeTypes.length-1
    }

    // anything not compliant?
    let nonComplaintCnt = 0
    matchingClusters.forEach(({metadata: {name}})=>{
      if (noncompliantClusterSet.has(name)) {
        nonComplaintCnt++
      }
    })
    const providerClasses = classNames({
      'provider-card': true,
      'non-compliant': nonComplaintCnt>0,
    })
    const compliantClasses = classNames({
      'provider-cluster-noncompliant': true,
      'non-compliant': nonComplaintCnt>0,
    })
    return (
      <div className={providerClasses}
        tabIndex='0' role={'button'} onClick={updateFilters} onKeyPress={handleKeyPress}>
        <div className='provider-title-container'>
          <div className='provider-title'>
            <div className='provider-name'>{title}</div>
            <div className='provider-cluster-container'>
              <div className='provider-cluster'>{msgs.get('overview.cluster.count', [matchingClusters.length], locale)}</div>
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
            </div>
          </div>
        </div>
        <div className='provider-counts'>{
          filteredKubeTypes.map((kubeType,idx)=>{
            const kubeCnt = _.padStart(kubeMap[kubeType].length+'', 2, 0)
            const title = (idx===otherIdx) ?
              otherTypes.map(type=>{
                return `${_.padStart(kubeMap[type].length+'', 2, 0)} ${type}`
              }).join('\n') : ''
            return (
              <div key={kubeType} className='provider-count-cell'>
                <div className='provider-count' title={title}>{kubeCnt}</div>
                <div className='provider-type' title={title}>{kubeType}</div>
              </div>
            )
          })
        }</div>
      </div>
    )
  }
}

ProviderCard.propTypes = {
  conditionFilterSets: PropTypes.object,
  item: PropTypes.object,
  view: PropTypes.object,
}
