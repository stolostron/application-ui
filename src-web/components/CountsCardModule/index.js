/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2019. All Rights Reserved.
 *
 * US Government Users Restricted Rights - Use, duplication or disclosure
 * restricted by GSA ADP Schedule Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as Actions from '../../actions'
import classNames from 'classnames'
import { Icon } from 'carbon-components-react'
import resources from '../../../lib/shared/resources'
import msgs from '../../../nls/platform.properties'
/* eslint-disable react/prop-types */

resources(() => {
  require('./style.scss')
})

class CountsCardModule extends React.Component {
  getModuleData = () => {
    const { locale } = this.context
    const { data } = this.props
    const countCardItems = []

    data &&
      data.map(
        ({ msgKey, count, textKey, border, alert, targetTab, targetLink }) => {
          countCardItems.push({
            count,
            type: msgs.get(msgKey, locale),
            text: (textKey && msgs.get(textKey, locale)) || '',
            border: border || '',
            alert: alert || false,
            targetTab,
            targetLink
          })
        }
      )
    return {
      countCardItems
    }
  };

  render() {
    const moduleData = this.getModuleData()
    const { locale } = this.context
    const { title, link, actions } = this.props
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
            {link &&
              link !== '#' && (
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
            <CountCards
              moduleData={moduleData}
              actions={actions}
              locale={locale}
            />
          </div>
        </div>
      </div>
    )
  }
}

const CountCards = ({ moduleData: { countCardItems }, actions }) => {
  return (
    <React.Fragment>
      {countCardItems.map(
        ({ count, type, text, border, alert, targetTab, targetLink }) => {
          const cardClasses = classNames({
            'card-count-type': true,
            hasLeftBorder: border === 'left' ? true : false,
            hasRightBorder: border === 'right' ? true : false
          })
          const countClasses = classNames({
            'card-count': true,
            alert: alert
          })
          const onClick = () => {
            if (targetTab != null) {
              actions.setSelectedAppTab(targetTab)
            } else if (targetLink) {
              window.open(targetLink, '_blank')
            }
          }
          const onKeyPress = e => {
            if (e.key === 'Enter') {
              onClick()
            }
          }
          return (
            <div
              key={type}
              className={cardClasses}
              role="button"
              tabIndex="0"
              onClick={onClick}
              onKeyPress={onKeyPress}
            >
              <div className={countClasses}>{count}</div>
              <div className="card-type">{type}</div>
              {text && <div className="card-text">{text}</div>}
            </div>
          )
        }
      )}
    </React.Fragment>
  )
}

CountCards.propTypes = {
  actions: PropTypes.object,
  moduleData: PropTypes.object
}

CountsCardModule.propTypes = {}

const mapDispatchToProps = dispatch => {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(CountsCardModule)
