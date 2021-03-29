/** *****************************************************************************
 * Licensed Materials - Property of IBM
 * (c) Copyright IBM Corporation 2017, 2018. All Rights Reserved.
 *
 * Note to U.S. Government Users Restricted Rights:
 * Use, duplication or disclosure restricted by GSA ADP Schedule
 * Contract with IBM Corp.
 ****************************************************************************** */
// Copyright (c) 2020 Red Hat, Inc.
// Copyright Contributors to the Open Cluster Management project
'use strict'

import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from '@patternfly/react-core'
import {
  AcmPageHeader,
  AcmSecondaryNav,
  AcmSecondaryNavItem
} from '@open-cluster-management/ui-components'
import resources from '../../lib/shared/resources'
import { withRouter, Link } from 'react-router-dom'
import msgs from '../../nls/platform.properties'
import classNames from 'classnames'
import loadable from 'loadable-components'

const AutoRefreshSelect = loadable(() =>
  import(/* webpackChunkName: "autoRefreshSelect" */ './common/AutoRefreshSelect')
)

resources(() => {
  require('../../scss/secondary-header.scss')
})

export class SecondaryHeader extends React.Component {
  constructor(props) {
    super(props)
    this.renderTabs = this.renderTabs.bind(this)
    this.renderTooltip = this.renderTooltip.bind(this)
    this.renderLinks = this.renderLinks.bind(this)

    this.state = {
      shadowPresent: false
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.listenToScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.listenToScroll)
  }

  listenToScroll = () => {
    if (window.scrollY > 0.1 && this.state.shadowPresent === false) {
      this.setState({ shadowPresent: true })
    } else if (window.scrollY <= 0.1 && this.state.shadowPresent === true) {
      this.setState({ shadowPresent: false })
    }
  };

  render() {
    const {
      tabs,
      title,
      breadcrumbItems,
      links,
      mainButton,
      actions
    } = this.props
    const { locale } = this.context

    const headerArgs = {
      breadcrumb: breadcrumbItems && this.getBreadcrumbs(),
      title: decodeURIComponent(title),
      navigation: tabs &&
        tabs.length > 0 && (
          <AcmSecondaryNav
            className={classNames({
              'cluster-tabs--long': breadcrumbItems,
              'cluster-tabs': !breadcrumbItems
            })}
            aria-label={`${title} ${msgs.get('tabs.label', locale)}`}
          >
            {this.renderTabs()}
          </AcmSecondaryNav>
      ),
      controls: <AutoRefreshSelect route={this.props.location} />,
      actions: tabs &&
        tabs.length > 0 &&
        mainButton && (
          <div
            className={classNames({
              'main-button-container': true,
              'with-breadcrumbs': breadcrumbItems
            })}
          >
            {mainButton}
          </div>
      ),
      switches: (
        <div className="switch-controls">
          <div id="edit-button-portal-id" />
        </div>
      )
    }

    if (
      (tabs && tabs.length > 0) ||
      (breadcrumbItems && breadcrumbItems.length > 0)
    ) {
      return (
        <div
          className={classNames({
            'secondary-header-wrapper': true,
            'with-tabs': tabs && tabs.length > 0,
            'with-breadcrumbs': breadcrumbItems && breadcrumbItems.length > 0
          })}
          role="region"
          aria-label={title}
        >
          <div
            className={`secondary-header ${
              actions && !tabs ? 'detailed-header-override' : ''
            }`}
          >
            {this.state.shadowPresent && <div className="header-box-shadow" />}
            <AcmPageHeader {...headerArgs} />
            {actions && this.renderActions()}
          </div>
          {links &&
            links.length > 0 && (
              <div className="secondary-header-links">{this.renderLinks()}</div>
          )}
        </div>
      )
    } else {
      return (
        <div
          className="secondary-header-wrapper-min"
          role="region"
          aria-label={`${title} ${msgs.get('secondaryHeader', locale)}`}
        >
          <div className="secondary-header simple-header">
            <h1>{decodeURIComponent(title)}</h1>
            {this.renderTooltip()}
          </div>
        </div>
      )
    }
  }

  getBreadcrumbs() {
    const { breadcrumbItems } = this.props
    return breadcrumbItems
      ? breadcrumbItems.map(breadcrumb => {
        return { text: breadcrumb.label, to: breadcrumb.url }
      })
      : null
  }

  renderLinks() {
    const { links } = this.props,
          { locale } = this.context
    return links.map(link => {
      const {
        id,
        label,
        url,
        kind = 'primary',
        title,
        handleClick = () => this.props.history.push(url)
      } = link
      // if portal, react component will create the button using a portal
      if (kind === 'portal') {
        return !title ? <div key={id} id={id} className="portal" /> : null
      }
      return (
        <Button key={id} id={id} onClick={handleClick} kind={kind}>
          {msgs.get(label, locale)}
        </Button>
      )
    })
  }

  renderActions() {
    const { actions } = this.props
    return (
      <div className="secondary-header-actions">
        <Button
          kind="secondary"
          onClick={() => actions.secondary && actions.secondary.action()}
          className="secondary-header-actions-secondary"
        >
          {actions.secondary && actions.secondary.label}
        </Button>
        <Button
          kind="primary"
          onClick={() => actions.primary && actions.primary.action()}
          disabled={actions.primary.disabled}
          className="secondary-header-actions-primary"
        >
          {actions.primary && actions.primary.label}
        </Button>
      </div>
    )
  }

  renderTabs() {
    const { tabs, location } = this.props,
          { locale } = this.context
    return tabs.map((tab, idx) => {
      return (
        <AcmSecondaryNavItem
          key={tab.id}
          id={tab.id}
          isActive={(this.getSelectedTab() || 0) === idx}
          onClick={tab.handleClick || undefined}
        >
          <Link
            to={{
              ...location,
              pathname: tab.url,
              state: { tabChange: location }
            }}
            replace={true}
          >
            {msgs.get(tab.label, locale)}
          </Link>
        </AcmSecondaryNavItem>
      )
    })
  }

  renderTooltip() {
    // Not used
  }

  getSelectedTab() {
    const { tabs, location } = this.props
    const selectedTab = tabs
      .map((tab, index) => {
        tab.index = index
        return tab
      })
      .filter((tab, index) => {
        if (index === 0) {
          return false
        }
        return location.pathname.startsWith(tab.url)
      })
    return selectedTab[0] && selectedTab[0].index
  }
}

SecondaryHeader.propTypes = {
  actions: PropTypes.array,
  breadcrumbItems: PropTypes.array,
  history: PropTypes.object,
  links: PropTypes.array,
  location: PropTypes.object,
  mainButton: PropTypes.object,
  tabs: PropTypes.array,
  title: PropTypes.string,
  tooltip: PropTypes.string
}

SecondaryHeader.contextTypes = {
  locale: PropTypes.string
}

const mapStateToProps = state => {
  return {
    title: state.secondaryHeader.title,
    tabs: state.secondaryHeader.tabs,
    actions: state.secondaryHeader.actions,
    mainButton: state.secondaryHeader.mainButton,
    breadcrumbItems: state.secondaryHeader.breadcrumbItems,
    links: state.secondaryHeader.links,
    tooltip: state.secondaryHeader.tooltip,
    role: state.role && state.role.role
  }
}

export default withRouter(connect(mapStateToProps)(SecondaryHeader))
