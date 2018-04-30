/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/
'use strict'

import React from 'react'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import msgs from '../../nls/header.properties'
import resources from '../../lib/shared/resources'
import { requestLogout } from '../actions/login'
import { getContextRoot } from '../../lib/client/http-util'
import PropTypes from 'prop-types'

resources(() => {
  require('../../scss/header.scss')
})

class Header extends React.PureComponent {

  handleLogout = (event) => {
    event.preventDefault()
    this.props.requestLogout()
  }

  render() {
    const { user, leftNavOpen, userDropdownOpen } = this.props
    const locale = this.context.locale
    const contextPath = getContextRoot()
    return (
      <div className='app-header-wrapper'>
        <header className='app-header' aria-label={msgs.get('header.label', locale)}>
          <div className='app-header__container secondary'>
            <div className={'app-menu-btn-container ' + (leftNavOpen ? 'is-open' : '')}>
              <button className={'hamburger hamburger--slider ' + (leftNavOpen ? 'is-active' : '')} aria-label={msgs.get('header.menu.label', locale)} onClick={this.props.handleMenuClick}>
                <span className="hamburger-box">
                  <span className="hamburger-inner"></span>
                </span>
              </button>
              <div className='tooltip'>{msgs.get('tooltip.menu', locale)}</div>
            </div>
            <div className='logo-container'>
              <img className='logo' src={`${contextPath}/graphics/CloudPrivate-Text_Logo.svg`} alt={msgs.get('logo.alt', locale)} />
            </div>
            <div className='navigation-container'>
              <nav aria-label={msgs.get('nav.label', locale)}>
                <ul>
                  <li>
                    <div className={'admin-container ' + (userDropdownOpen ? 'is-open' : '')}>
                      <button id='user-dropdown' onClick={this.props.handleUserDropdownClick}>
                        <img src={`${contextPath}/graphics/User_Icon.svg`} alt={msgs.get('svg.description.user', locale)} />
                      </button>
                      <ul className='dropdown-content'>
                        <li><img src={`${contextPath}/graphics/User_Icon.svg`} alt={msgs.get('svg.description.user', locale)} /><span>{user}</span></li>
                        <li><a href='#'>{msgs.get('dropdown.user.about', locale)}</a></li>
                        <li><a href='#' onClick={this.handleLogout}>{msgs.get('dropdown.user.logout', locale)}</a></li>
                      </ul>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
      </div>
    )
  }
}

Header.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => {
  return {
    user: state.user,
  }
}
const mapDispatchToProps = dispatch => {
  return {
    requestLogout: () => dispatch(requestLogout()),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header))
