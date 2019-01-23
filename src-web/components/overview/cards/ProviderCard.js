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
import GridCard from '../GridCard'
import msgs from '../../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../../scss/overview-providers.scss')
})

export default class ProviderCard extends React.PureComponent {

  render() {
    const { locale } = this.context
    const { view, item, width, noncompliantClusterSet } = this.props
    const {cardData: {title, includes=[]}, overview: {clusters=[]} } = item

    // add this provider's cloud label to active filters
    const updateFilters = () => {
      const {updateActiveFilters} = view
      const activeFilters = _.cloneDeep(view.activeFilters)
      activeFilters[BANNER_FILTER] = [{title, includes: includes.slice()}]
      updateActiveFilters(activeFilters)
    }

    const handleKeyPress = (e) => {
      if ( e.key === 'Enter') {
        updateFilters()
      }
    }

    // gather data
    const {matchingClusters, kubeMap, kubeTypes} = getMatchingClusters(clusters, includes)

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
      <GridCard item={item} >
        <div className={providerClasses} style={{width}}
          tabIndex='0' role={'button'} onClick={updateFilters} onKeyPress={handleKeyPress}>
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
          <div className='provider-counts'>{
            kubeTypes.map(kubeType=>{
              const kubeCnt = _.padStart(kubeMap[kubeType].length+'', 2, 0)
              const providerTypeClasses = classNames({
                'provider-type': true,
                'large': kubeType.length>5,
              })
              let title = ''
              if (kubeType.length>16) {
                title = kubeType
                kubeType = kubeType.substr(0, 5) + '..' + kubeType.substr(kubeType.length - 5)
              }
              return (
                <div key={kubeType} className='provider-count-cell'>
                  <div className='provider-count'>{kubeCnt}</div>
                  <div className={providerTypeClasses} title={title}>{kubeType}</div>
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
  noncompliantClusterSet: PropTypes.object,
  view: PropTypes.object,
  width: PropTypes.number,
}
