/*******************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 *******************************************************************************/

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import resources from '../../lib/shared/resources'
import Header from '../components/Header'
import LeftNav from '../components/LeftNav'

resources(() => {
  require('../../scss/common.scss')
})

class HeaderContainer extends React.Component {

  constructor(props) {
    super(props)

    this.handleMenuClick = this.handleMenuClick.bind(this)
    this.handleNavItemClick = this.handleNavItemClick.bind(this)
    this.handleUserDropdownClick = this.handleUserDropdownClick.bind(this)
    this.handleMouseClick = this.handleMouseClick.bind(this)

    let selectedItem = this.getSelectedItem()
    this.state = {
      leftNavOpen: false,
      leftNavSelection: {
        item: this.getCurrentNavItem(),
        expanded: !!selectedItem,
        subItem: selectedItem,
      },
      userDropdownOpen: false,
      docLink: undefined
    }
  }

  render() {
    const { history, navRoutes } = this.props
    return (
      <div>
        <div ref={ref => this.headerWrapper = ref}>
          <Header handleMenuClick={this.handleMenuClick}
            leftNavOpen={this.state.leftNavOpen}
            userDropdownOpen={this.state.userDropdownOpen}
            docLink={this.state.docLink}
            handleUserDropdownClick={this.handleUserDropdownClick} />
          <LeftNav location={history.location}
            open={this.state.leftNavOpen}
            selection={this.state.leftNavSelection}
            handleNavItemClick={this.handleNavItemClick}
            handleMenuClick={this.handleMenuClick}
            navRoutes={navRoutes} />
        </div>
      </div>
    )
  }

  handleMouseClick(event) {
    if (this.headerWrapper && !this.headerWrapper.contains(event.target)) {
      this.setState({
        leftNavOpen: false,
        userDropdownOpen: false
      })
      document.removeEventListener('click', this.handleMouseClick)
    }
  }

  getCurrentNavItem() {
    const { location, navRoutes } = this.props
    const currentNavItem = navRoutes.filter(route => {
      if (route.id !== 'dashboard' && location.pathname.indexOf(route.url) !== -1) {
        return route
      } else if (route.subItems) {
        const matchedSubRoute = route.subItems.filter(subRoute => location.pathname.indexOf(subRoute.url) !== -1)
        if (matchedSubRoute.length > 0) {
          return route
        }
      } else if (route.url === location.pathname) {
        return route
      }
    })
    // We may have multiple matches in the left nav that prefix the current url.
    // The one one with the largest length is going to be the one with the highest specificity so we return that one
    if (currentNavItem && currentNavItem.length > 1) {
      return currentNavItem.reduce((acc, navItem) => {
        if (navItem.subItems) {
          const matchedSubRoute = navItem.subItems.reduce((acc, subItem) => subItem.url.length > acc.url.length ? subItem : acc)
          if (matchedSubRoute) {
            return navItem
          }
        }
        return navItem.url.length > acc.url.length ? navItem : acc
      })
    }
    return currentNavItem[0]
  }

  getSelectedItem() {
    const { location } = this.props
    const navItem = this.getCurrentNavItem()
    if (navItem && navItem.subItems)
      return navItem.subItems.filter(route => location.pathname.indexOf(route.url) !== -1)[0]
    return null
  }

  handleMenuClick() {
    this.setState({
      leftNavOpen: !this.state.leftNavOpen
    }, () => {
      if (this.state.leftNavOpen) {
        document.addEventListener('click', this.handleMouseClick)
      } else {
        document.removeEventListener('click', this.handleMouseClick)
      }
    })
  }

  handleUserDropdownClick() {
    this.setState({
      userDropdownOpen: !this.state.userDropdownOpen
    }, () => {
      if (this.state.userDropdownOpen) {
        document.addEventListener('click', this.handleMouseClick)
      } else {
        document.removeEventListener('click', this.handleMouseClick)
      }
    })
  }

  handleNavItemClick(item, parent, expanded) {
    this.setState({
      leftNavSelection: {
        item: parent,
        expanded: expanded,
        subItem: item
      }
    })
  }

  getChildContext() {
    return {
      locale: this.props.locale
    }
  }
}

HeaderContainer.childContextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = (state) => {
  return {
    navRoutes: state.nav && state.nav.navItems,
  }
}

export default withRouter(connect(mapStateToProps)(HeaderContainer))
