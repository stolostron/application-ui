/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
import _ from 'lodash'

resources(() => {
  require('../../../scss/counts-card-module.scss')
})

export default class CountsCardModule extends React.Component {

  render() {
    const { locale } = this.context
    const { handleDrillDownClick } = this.props
    const moduleData = this.getModuleData()
    return (
      <div className='counts-card-module'>
        <div className='card-container-container'>
          <div className='card-container'>
            <div className='card-content'>
              <div className='card-inner-content'>
                <CountCards moduleData={moduleData} handleClick={handleDrillDownClick} locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  getModuleData = () => {
    const { locale } = this.context
    return {
      countCardItems: [
        {count: 6, type: msgs.get('table.header.deployables', locale)},
        {count: 8, type: msgs.get('table.header.deployments', locale)},
        {count: 2, type: msgs.get('table.header.failedDeployments', locale)},
      ]
    }
  }
}

const CountCards = ({moduleData: {countCardItems}, handleDrillDownClick, locale}) => {
  return (
    <React.Fragment>
      {countCardItems.map(({count, type}, idx) => {
        const onClick = () =>{
          handleDrillDownClick(type)
        }
        const onKeyPress = (e) =>{
          if ( e.key === 'Enter') {
            onClick()
          }
        }
        const cardClasses = classNames({
          'card-count-type': true,
          hasBorder: idx===0,
        })
        const countClasses = classNames({
          'card-count': true,
          // 'alert': count>0,
        })
        return (
          <div key={type} className={cardClasses} role={'button'}
            tabIndex='0' onClick={onClick} onKeyPress={onKeyPress}>
            <div className={countClasses}>
              {count}
            </div>
            <div className='card-type'>
              <div>
                {type.toUpperCase()}
              </div>
            </div>
          </div>
        )
      })}
    </React.Fragment>
  )
}

CountCards.propTypes = {
  handleDrillDownClick: PropTypes.func,
  locale: PropTypes.string,
  moduleData: PropTypes.object,
}

CountsCardModule.propTypes = {
  handleDrillDownClick: PropTypes.func,
}
