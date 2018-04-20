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
import { Link } from 'react-router-dom'
import { Icon } from 'carbon-components-react'
import msgs from '../../nls/header.properties'
import resources from '../../lib/shared/resources'
import lodash from 'lodash'
import PropTypes from 'prop-types'
import { CSSTransition } from 'react-transition-group'

resources(() => {
  require('../../scss/left-nav.scss')
})

class LeftNav extends React.Component {
  constructor(props) {
    super(props)
    this.renderRoutes = this.renderRoutes.bind(this)
    this.renderSubRoutes = this.renderSubRoutes.bind(this)
  }

  render() {
    return (
      <CSSTransition classNames='transition' in={this.props.open} timeout={300} mountOnEnter={true} unmountOnExit={true}>
        <div className='left-nav' role='navigation' aria-label={msgs.get('header.menu.bar.label', this.context.locale)}>
          {this.renderRoutes()}
        </div>
      </CSSTransition>
    )
  }

  renderRoutes() {
    const { navRoutes, selection } = this.props
    const locale = this.context.locale
    return navRoutes.map(route => {
      if (route.subItems) {
        let open = selection.item && selection.item.id === route.id && selection.expanded
        return (
          <div key={`${route.id}-${route.index}`} role='menu' aria-label={route.label}>
            <div
              className={'left-nav-item primary-nav-item ' + (open ? 'open' : '')}
              label={route.label}
              onClick={this.handleClick.bind(this, null, route)}
              onKeyPress={this.handleClick.bind(this, null, route)}
              title={route.label}
              role='menuitem'
              tabIndex='0'>
              <Icon
                className='icon-caret'
                name='icon--caret--right'
                fill='#1d364d'
                description={msgs.get('svg.description.menu', locale)} />
              {route.label}
            </div>
            <div className='left-nav-subitem-list'>
              {this.renderSubRoutes(route)}
            </div>
          </div>
        )
      } else {
        return (
          !route.disabled && <div
            className={'left-nav-item primary-nav-item ' + (selection.item && selection.item.id === route.id ? 'selected': '')}
            label={route.label}
            title={route.label}
            key={`${route.id}-${route.index}`}>
            <AdaptiveLink external={route.external} to={route.url} label={route.label} />
          </div>
        )
      }
    })
  }

  renderSubRoutes(route) {
    const { subItem } = this.props.selection
    return route.subItems.map(subRoute => (
      !subRoute.disabled &&
      <AdaptiveLink target={subRoute.target} external={subRoute.external} key={`${subRoute.id}-${subRoute.index}`} to={subRoute.url}
        className={'left-nav-item secondary-nav-item ' + (subItem && subItem.id === subRoute.id ? 'selected' : '')}
        label={subRoute.label}
        onClick={this.handleClick.bind(this, subRoute, route)}
        onKeyPress={this.handleClick.bind(this, subRoute, route)}
        title={subRoute.label}
        role='menuitem'
        tabIndex='0'>
      </AdaptiveLink>
    ))
  }

  handleClick(subitem, item) {
    const { selection } = this.props
    this.props.handleNavItemClick(subitem, item, !subitem ? !selection.expanded : true)
  }
}

LeftNav.contextTypes = {
  locale: PropTypes.string
}

const AdaptiveLink = (props) => {
  const passThoughProps = {...lodash.omit(props, 'external')}
  return props.external ? <a {...passThoughProps} href={props.to}>{props.label}</a> : <Link {...passThoughProps}>{props.label}</Link>
}

export default LeftNav
