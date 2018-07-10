/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2016, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use_strict'

import React from 'react'
import config from '../../../lib/shared/config'

class Notification extends React.Component {
  /* FIXME: Please fix disabled eslint rules when making changes to this file. */
  /* eslint-disable react/prop-types, react/jsx-no-bind */

  constructor(props) {
    super(props)
    this.state = {
      hide: false,
    }
  }

  render() {
    if (!this.state.hide) {
      const { type } = this.props
      return (
        <div className={`bx--inline-notification bx--inline-notification--${type}`}
          role="alert">
          <div className="bx--inline-notification__details">
            <svg className="bx--inline-notification__icon" aria-label="close">
              <use
                xlinkHref={`${
                  config.contextPath
                }/graphics/carbon-icons.svg#icon--${
                  type === 'success' ? 'checkmark' : type
                }--glyph`}
              />
            </svg>
            <div className="bx--inline-notification__text-wrapper">
              <p className="bx--inline-notification__title">
                {this.props.title}
              </p>
              {(() => {
                if (this.props.renderNotificationContent) {
                  return this.props.renderNotificationContent()
                } else {
                  return (
                    <p
                      className="bx--inline-notification__subtitle"
                      dangerouslySetInnerHTML={{
                        __html: this.props.description,
                      }}
                    />
                  )
                }
              })()}
            </div>
          </div>
          {(() => {
            if (this.props.allowClose) {
              return (
                <div>
                  <button
                    className="bx--inline-notification__close-button"
                    type="button"
                    onClick={this._handleClick.bind(this)}
                  >
                    <svg
                      className="bx--inline-notification__close-icon"
                      aria-label="close"
                    >
                      <use
                        xlinkHref={`${
                          config.contextPath
                        }/graphics/carbon-icons.svg#icon--close`}
                      />
                    </svg>
                  </button>
                </div>
              )
            }
          })()}
        </div>
      )
    }
    return <div />
  }

  _handleClick() {
    if (this.props.closed) {
      this.props.closed()
    } else {
      this.setState({
        hide: true,
      })
    }
  }
}
export default Notification
