/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Icon } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

export default class CountsCardModule extends React.Component {
  getModuleData = () => {
    const { locale } = this.context
    const { data } = this.props
    const countCardItems = []
    data.map(({ msgKey, count, textKey, border, alert }) => {
      countCardItems.push({
        count,
        type: msgs.get(msgKey, locale),
        text: (textKey && msgs.get(textKey, locale)) || '',
        border: border || '',
        alert: alert || false
      })
    })
    return {
      countCardItems
    }
  };

  render() {
    const moduleData = this.getModuleData()
    const { locale } = this.context
    const { title, link } = this.props
    return (
      <div
        id={
          title
            ? link
              ? 'CountsCardModuleWithHeaderAndLink'
              : 'CountsCardModuleWithHeader'
            : 'CountsCardModule'
        }
      >
        {title && (
          <span className="card-container-title">
            {msgs.get(title, locale)}
            {link && (
              <span className="card-container-link">
                <a target="_blank" rel="noopener noreferrer" href={link}>
                  {msgs.get('dashboard.card.icam.link', locale)}{' '}
                  <Icon
                    style={{ margin: '0 0 0 5px' }}
                    className="icon--arrow--right"
                    name="icon--arrow--right"
                    fill="gray"
                    width="12px"
                    height="12px"
                  />
                </a>
              </span>
            )}
          </span>
        )}
        <div className="card-container">
          <div className="card-container-content">
            <CountCards moduleData={moduleData} locale={locale} />
          </div>
        </div>
      </div>
    )
  }
}

const CountCards = ({ moduleData: { countCardItems } }) => {
  return (
    <React.Fragment>
      {countCardItems.map(({ count, type, text, border, alert }) => {
        const cardClasses = classNames({
          'card-count-type': true,
          hasLeftBorder: border === 'left' ? true : false,
          hasRightBorder: border === 'right' ? true : false
        })
        const countClasses = classNames({
          'card-count': true,
          alert: alert
        })
        return (
          <div key={type} className={cardClasses} role="button" tabIndex="0">
            <div className={countClasses}>{count}</div>
            <div className="card-type">{type}</div>
            {text && <div className="card-text">{text}</div>}
          </div>
        )
      })}
    </React.Fragment>
  )
}

CountCards.propTypes = {
  moduleData: PropTypes.object
}

CountsCardModule.propTypes = {}
